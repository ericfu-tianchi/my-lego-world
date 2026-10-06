// Los Angeles promo film v4 (2026-10-06, Eric's notes on v3): the intro card at the top over the globe; the entrance at real app speed; a
// shorter orbit that dollies in and then flies straight down into the coast track in one unbroken move (no whip pans); two clean hard
// cuts on motion; the arch / roller-skater / HOLLYWOOD shot reframed so all three read.
//   S01 globe + intro card, the tap, the entrance (1×), the orbit with a dolly-in, the swoop down over the bay into the coast track, the
//       slow beat on the skater, on to Muscle Beach — one camera path, time-mapped by a cubic Hermite through keyed times
//   S02 cut on motion: pier crane from the ice-cream cart up the face of the wheel
//   S03 cut on rising motion: a slow crane-and-arc on the arch, the roller-skater and the whole word HOLLYWOOD; pull back, Take it apart, end card
//   node tools/film/la-v4.mjs [--preview | --stills] [S02,S03]   (frames to $FILM_OUT; serve dist/ on $PORT 8161 first)
//   node tools/film/assemble.mjs <frames> docs/film/la-v4.mp4
import { chromium } from '../node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';

const argv = process.argv.slice(2);
const PREVIEW = argv.includes('--preview'), STILLS = argv.includes('--stills');
const only = argv.find((a) => /^S\d/.test(a))?.split(',');
const [VW, VH] = PREVIEW || STILLS ? [540, 960] : [1080, 1920];
const FPS = PREVIEW ? 15 : STILLS ? 30 : 60;
const OUT = process.env.FILM_OUT ?? path.resolve('tools/film/out-v4');
const PORT = process.env.PORT ?? 8161;

// ---- maths: eases, Catmull-Rom, orbit poses -------------------------------------------------------------
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ease = { linear: (k) => k, inOut: (k) => (k < 0.5 ? 4 * k ** 3 : 1 - (-2 * k + 2) ** 3 / 2), sine: (k) => 0.5 - 0.5 * Math.cos(Math.PI * k),
  out: (k) => 1 - (1 - k) ** 3, in: (k) => k ** 3, smooth: (k) => k * k * k * (k * (k * 6 - 15) + 10),
  /** speed ramp: rushes in, then drifts in near slow motion for the last stretch */
  ramp: (k) => (k < 0.35 ? 0.72 * ease.inOut(k / 0.35) ** 0.8 : 0.72 + 0.28 * ease.out((k - 0.35) / 0.65)) };
/** uniform Catmull-Rom through points (ends doubled), u in [0, 1] across all segments */
function spline(P, u) {
  const n = P.length - 1; if (n === 0) return P[0]; const s = clamp(u) * n, i = Math.min(n - 1, Math.floor(s)), t = s - i;
  const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(n, i + 2)], t2 = t * t, t3 = t2 * t;
  return p1.map((_, j) => 0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3));
}
/** the app's orbit formula: camera = target + (sin az · c, sin el · d, cos az · c), c = cos el · d (az 0 looks from +z, the front) */
const orb = (l, az, el, d) => [l[0] + Math.sin(az) * Math.cos(el) * d, l[1] + Math.sin(el) * d, l[2] + Math.cos(az) * Math.cos(el) * d];
/** a camera move: keyframes { p, l, fov } (or { l, az, el, d, fov }) splined, timed by an ease */
const move = (keys, e = ease.inOut) => { const K = keys.map((k) => ({ p: k.p ?? orb(k.l, k.az, k.el, k.d), l: k.l, fov: k.fov ?? 32 })); return (k) => { const u = e(k); return { p: spline(K.map((x) => x.p), u), l: spline(K.map((x) => x.l), u), fov: spline(K.map((x) => [x.fov]), u)[0] }; }; };

/** ease from rest into a constant speed (for a move that is cut away from while still moving) */
const inLin = (a = 0.3) => (k) => (k < a ? (k * k) / (2 * a) : k - a / 2) / (1 - a / 2);
const linOut = (a = 0.3) => (k) => 1 - inLin(a)(1 - k);
/** a move whose speed follows s(u) along the path (u = spline parameter): slows where s dips */
const warp = (s, n = 2000) => { const U = [0]; for (let i = 0; i < n; i++) U.push(U[i] + 1 / s(U[i])); return (k) => { const T = clamp(k) * U[n]; let lo = 0, hi = n; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (U[m] <= T) lo = m; else hi = m; } return (lo + (T - U[lo]) / (U[hi] - U[lo] || 1)) / n; }; };
/** orbit keyframes {l, az, el, d, fov} splined in orbit parameters (true arcs), timed by e */
const arc = (keys, e = ease.inOut) => (k) => { const u = e(k), q = spline(keys.map((x) => [...x.l, x.az, x.el, x.d, x.fov ?? 32]), u); const l = q.slice(0, 3); return { p: orb(l, q[3], q[4], q[5]), l, fov: q[6] }; };
/** segments [dur, fn(k)] played one after another */
const seq = (segs) => { const T = segs.reduce((a, s) => a + s[0], 0); return (k) => { let t = k * T; for (const [d, f] of segs) { if (t <= d) return f(t / d); t -= d; } return segs[segs.length - 1][1](1); }; };

// ---- overlays ----------------------------------------------------------------------------------------
const OVERLAY_CSS = `
#fo { position: fixed; inset: 0; z-index: 10; pointer-events: none; font-family: Rubik, "PingFang SC", -apple-system, sans-serif; color: #1f2124; }
#fo .open { position: absolute; left: 0; right: 0; top: calc(var(--u) * 190); text-align: center; font-size: calc(var(--u) * 46); font-weight: 500; letter-spacing: .06em; }
#fo .open span { color: #8a8e92; margin: 0 calc(var(--u) * 14); font-weight: 400; }
#fo .open b { font-family: "PingFang SC", sans-serif; font-weight: 500; letter-spacing: .14em; }
#fo .end { position: absolute; left: 0; right: 0; top: calc(var(--u) * 250); text-align: center; }
#fo .end .l { font-size: calc(var(--u) * 66); font-weight: 600; letter-spacing: -.015em; line-height: 1.24; }
#fo .end .l i { font-style: normal; color: #c91a09; }
#fo .end .c { font-family: "PingFang SC", sans-serif; font-size: calc(var(--u) * 32); color: #4a4e52; margin-top: calc(var(--u) * 34); letter-spacing: .16em; }
#fo .end .m { font-family: "IBM Plex Mono", Menlo, monospace; font-size: calc(var(--u) * 21); color: #7a7e82; margin-top: calc(var(--u) * 22); letter-spacing: .14em; text-transform: uppercase; }
#fo .end .m b { font-family: "PingFang SC", sans-serif; font-weight: 400; letter-spacing: .08em; text-transform: none; }
#fo .open .cr { margin-top: calc(var(--u) * 26); font-size: calc(var(--u) * 28); font-weight: 400; letter-spacing: .04em; color: #4a4e52; }
#fo .open .cr i { font-style: normal; color: #c91a09; font-weight: 500; }
#fo .open .crz { margin-top: calc(var(--u) * 8); font-family: "PingFang SC", sans-serif; font-size: calc(var(--u) * 24); color: #7a7e82; letter-spacing: .14em; }
#fo .tap { position: absolute; width: 0; height: 0; } #fo .tap i { position: absolute; border-radius: 50%; transform: translate(-50%, -50%); }
`;
const OPEN = `<div class="open">Los Angeles<span>·</span><b>洛杉矶</b><div class="cr">Designed, built &amp; shot by <i>Claude</i></div><div class="crz">由 Claude 设计 · 搭建 · 拍摄</div></div>`;
const END = (parts) => `<div class="end"><div class="l">Designed by <i>Claude</i></div><div class="l">Built by <i>Claude</i></div><div class="l">Shot by <i>Claude</i></div><div class="c">由 Claude 设计 · 搭建 · 拍摄</div><div class="m">My Lego World · Los Angeles · <b>${parts} 块乐高零件</b></div></div>`;
const fade = (t, a, b, f = 0.6) => clamp((t - a) / f) * clamp((b - t) / f);
const layer = (html, o, lift = 14) => (o > 0 ? `<div style="opacity:${o.toFixed(3)};transform:translateY(calc(var(--u) * ${((1 - o) * lift).toFixed(2)}))">${html}</div>` : '');

// ---- the shots ---------------------------------------------------------------------------------------
// world coordinates (x east, z south = the front, y up; a plate is 0.4), from __film.tags()
const away = (p, l, f) => p.map((v, i) => l[i] + (v - l[i]) * f);   // the same view, f × farther
const COAST = [   // [camera, target]: arch → tower 18 and the surfer → umbrellas and sandcastle → the walls → the skater → Muscle Beach
  [[-10, 17, 44], [6, 13, 18]], [[6, 15, 54], [10, 9, 31]], [[24, 15, 58], [24, 8, 35]], [[38, 16, 52], [38, 8, 25]], [[42, 19, 38], [32.5, 10, 10.5]], [[56, 18, 36], [46, 9, 14]],
].map(([p, l]) => [away(p, l, 1.4), l]);
/** centripetal Catmull-Rom (no overshoot where short and long segments meet), u = key index (fractional) */
function cspline(P, u) {
  const n = P.length - 1, i = Math.min(n - 1, Math.max(0, Math.floor(u))), t = clamp(u - i);
  const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(n, i + 2)];
  const d = (a, b) => Math.max(1e-4, Math.hypot(...a.map((v, j) => v - b[j])) ** 0.5);
  const t0 = 0, t1 = d(p0, p1), t2 = t1 + d(p1, p2), t3 = t2 + d(p2, p3), T = t1 + (t2 - t1) * t;
  const L = (a, b, ta, tb) => a.map((v, j) => (tb - T) / (tb - ta) * v + (T - ta) / (tb - ta) * b[j]);
  const A1 = L(p0, p1, t0, t1), A2 = L(p1, p2, t1, t2), A3 = L(p2, p3, t2, t3), B1 = L(A1, A2, t0, t2), B2 = L(A2, A3, t1, t3);
  return L(B1, B2, t1, t2);
}
/** time → key index through keyed times: cubic Hermite, slopes by Fritsch–Carlson unless a key sets v (keys per second) */
function keyTime(T, V) {
  const n = T.length, m = T.slice(1).map((t, i) => 1 / (t - T[i]));
  const s = T.map((_, i) => (V[i] ?? (i === 0 ? m[0] : i === n - 1 ? m[n - 2] : 2 / (1 / m[i - 1] + 1 / m[i]))));
  return (t) => { if (t <= T[0]) return 0; if (t >= T[n - 1]) return n - 1; let i = 0; while (t > T[i + 1]) i++;
    const h = T[i + 1] - T[i], x = (t - T[i]) / h, x2 = x * x, x3 = x2 * x;
    return i * (2 * x3 - 3 * x2 + 1) + s[i] * h * (x3 - 2 * x2 + x) + (i + 1) * (-2 * x3 + 3 * x2) + s[i + 1] * h * (x3 - x2); };
}
/** S01's path after the app's tween: the orbit (dollying in and descending), the swoop over the bay, the coast track */
function flight(o) {
  const O = (dt, daz, el, d, l) => ({ t: dt, p: orb(l, o.az + daz, el, d), l });
  const K = [
    { t: 0, p: orb(o.l, o.az, o.el, o.d), l: o.l, v: 0 },
    O(1.3, -0.4, 0.40, 360, [-1, 11, 0]), O(2.6, -0.85, 0.37, 315, [-2, 9, 1]), O(3.8, -1.25, 0.31, 255, [-2, 8, 4]),
    { t: 5.0, p: [-120, 52, 84], l: [0, 10, 14] }, { t: 6.1, p: [-52, 28, 68], l: [4, 12, 17] },
    ...COAST.map(([p, l], j) => ({ t: [7.2, 8.2, 9.1, 10.0, 11.2, 12.6][j], p, l, v: j === 4 ? 0.32 : undefined })),
  ];
  const u = keyTime(K.map((k) => k.t), K.map((k) => k.v));
  return { dur: K[K.length - 1].t, at: (t) => { const x = u(t); return { p: cspline(K.map((k) => k.p), x), l: cspline(K.map((k) => k.l), x), fov: 36 - 4 * clamp(1 - (x - 4) / 2) }; } };
}
const HW = { l: [1, 12, -14] };   // aim for the arch / roller-skater / HOLLYWOOD layers (the word whole, the skater clear of the lamp)
const S02 = 3.6;
const SHOTS = [
  { id: 'S01', name: 'Intro card over the globe, tap at 1.2 s, the entrance at 1×, orbit with a dolly-in, swoop down into the coast track, slow beat on the skater', dur: 4.0 + 12.6, app: true },
  { id: 'S02', name: 'Cut on motion: pier crane from the ice-cream cart up the face of the wheel to the whole pier', dur: S02,
    cam: arc([{ l: [-4, 11, 28.5], az: -0.42, el: 0.16, d: 27, fov: 36 }, { l: [-14, 15, 22], az: -0.32, el: 0.07, d: 40, fov: 36 }, { l: [-23, 19, 15], az: -0.38, el: 0.14, d: 72, fov: 35 }, { l: [-22, 14, 16], az: -0.5, el: 0.35, d: 128, fov: 34 }], ease.linear) },
  { id: 'S03', name: 'Cut on rising motion: crane-and-arc on the arch, the roller-skater and the whole word HOLLYWOOD, pull back, Take it apart, end card', dur: 10.2, finale: true, apartAt: 4.6, apartSpeed: 1.5,
    cam: seq([
      [4.0, move([{ p: [54, 27, 52], l: [3, 10.5, -13], fov: 44 }, { p: [50, 32, 58], l: [2, 11.5, -14], fov: 43 }, { p: [48, 38, 64], l: HW.l, fov: 42 }], linOut(0.5))],
      [0.6, move([{ p: [48, 38, 64], l: HW.l, fov: 42 }, { p: away([48, 38, 64], HW.l, 0.985), l: HW.l, fov: 42 }], ease.linear)],
      [2.4, move([{ p: away([48, 38, 64], HW.l, 0.985), l: HW.l, fov: 42 }, { p: orb([0, 10, 0], 0.6, 0.42, 320), l: [0, 10, 0], fov: 32 }], inLin(0.35))],
      [3.2, move([{ p: orb([0, 10, 0], 0.6, 0.42, 320), l: [0, 10, 0], fov: 32 }, { p: orb([0, 22, 0], 0.7, 0.4, 400), l: [0, 22, 0], fov: 32 }], ease.out)],
    ]),
    overlay: (t, s) => layer(END(s.parts), fade(t, 7.0, 99, 0.5)) },
];

// ---- capture -------------------------------------------------------------------------------------------
const browser = await chromium.launch({ args: ['--use-angle=metal', '--ignore-gpu-blocklist', '--enable-gpu'] });
const page = await browser.newPage({ viewport: { width: VW, height: VH }, deviceScaleFactor: 1 });
page.on('pageerror', (e) => console.log('[pageerror]', e.message));
await page.goto(`http://127.0.0.1:${PORT}/index.html?film=1`, { waitUntil: 'domcontentloaded', timeout: 180000 });
await page.waitForFunction(() => window.__ready === true, null, { timeout: 180000 });
await page.evaluate(({ css, u }) => { const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s); const d = document.createElement('div'); d.id = 'fo'; d.style.setProperty('--u', u + 'px'); document.body.appendChild(d); document.querySelectorAll('.hud').forEach((h) => (h.style.visibility = 'hidden')); }, { css: OVERLAY_CSS, u: VW / 1080 });
await page.evaluate(() => document.fonts.ready);
const ev = (fn, arg) => page.evaluate(fn, arg);
const setOverlay = (html) => ev((h) => { document.getElementById('fo').innerHTML = h; }, html);
const look = (c) => ev((c) => window.__film.look(c.p, c.l, c.fov), c);
const step = (dt) => ev((dt) => window.__film.step(dt), dt);
let frameNo = 0, shotDir = '';
async function snap() { await page.screenshot({ path: path.join(shotDir, String(frameNo++).padStart(5, '0') + '.png') }); }
const state = { parts: '' };

async function enterSet() {   // straight to the built set (single-shot renders), without filming the entrance
  await ev(() => { window.__film.enter('la'); }); for (let i = 0; i < 200; i++) { await step(1 / 30); if (i > 120 && (await ev(() => window.__film.state())).state === 'built') break; }
}
async function readParts() { state.parts = await ev(() => (document.getElementById('place-stats').textContent.match(/^[\d,]+/) || [''])[0]); }

/** S01: the app drives the globe and the entrance (its camera k × farther for 9:16); from the end of its tween the camera is ours */
async function shotGlobe(shot, frames) {
  const N = Math.round(shot.dur * FPS), dt = 1 / FPS;
  const spinAt = await ev(() => { const a = window.__app; let best = 0, bs = 1e9; for (let s = 0; s < 6.283; s += 0.01) { a.spin = s; a.globe.group.quaternion.copy(a.globe.homeQuat(s)); a.globe.group.updateMatrixWorld(true); const w = a.globe.pins.find((p) => p.place.scene === 'la').group.getWorldPosition(a.camera.position.clone()); if (w.z < 0) continue; const [x, y] = window.__film.pinScreen('la'); const sc = Math.abs(x - innerWidth * 0.5) + Math.abs(y - innerHeight * 0.42) * 0.3; if (sc < bs) { bs = sc; best = s; } } return best; });
  const CLICK = 1.2, TWEEN = 2.8, SPIN0 = spinAt - 0.45, K0 = 1.62, K1 = 1.45, K2 = 2.44, FAST = 1;   // TWEEN in app seconds
  let clicked = false, pin = [0, 0], orbit = null, appT = 0, clickApp = 0, orbitT0 = 0;
  for (let i = 0; i < N; i++) {
    const t = i * dt, sp = clicked ? FAST : 1, ta = clicked ? appT - clickApp : 0;
    if (t < CLICK) { const k = t / CLICK; await ev(({ s, z }) => { const a = window.__app; a.spin = s; a.spinVel = 0; a.idle = 0; window.__film.zoom(z); }, { s: SPIN0 + (spinAt - SPIN0) * ease.out(k), z: K0 + (K1 - K0) * ease.sine(k) }); }
    else if (!clicked) { pin = await ev(() => window.__film.pinScreen('la')); await ev(() => window.__film.enter('la')); clicked = true; clickApp = appT; }
    if (clicked && ta < TWEEN) await ev((z) => window.__film.zoom(z), K1 + (K2 - K1) * ease.inOut(clamp(ta / TWEEN)));
    let html = layer(OPEN, clamp((1.9 - t) / 0.4), 0);   // on screen from the first frame, gone as the globe sinks
    const tp = t - (CLICK - 0.25); if (tp > 0 && tp < 1.1) { if (!clicked) pin = await ev(() => window.__film.pinScreen('la'));
      const u = VW / 1080, r = (14 + 70 * ease.out(tp / 1.1)) * u, o = tp < 0.25 ? tp / 0.25 : 1 - (tp - 0.25) / 0.85, dot = tp < 0.35 ? 1 - Math.abs(tp - 0.2) / 0.2 * 0.3 : clamp(1 - (tp - 0.35) / 0.3);
      html += `<div class="tap" style="left:${pin[0]}px;top:${pin[1]}px"><i style="width:${2 * r}px;height:${2 * r}px;border:${3 * u}px solid rgba(255,255,255,${(0.9 * o).toFixed(3)});box-shadow:0 0 ${10 * u}px rgba(0,0,0,${(0.18 * o).toFixed(3)})"></i><i style="width:${46 * u}px;height:${46 * u}px;background:rgba(255,255,255,${(0.75 * dot).toFixed(3)})"></i></div>`; }
    await setOverlay(html);
    if (clicked && ta >= TWEEN) {   // the tween has landed on the app's opening view: carry on from it as one high orbit
      if (!orbit) { const o = await ev(() => { const a = window.__app.orbit; return { l: a.target.toArray(), az: a.az, el: a.el, d: a.dist }; });
        orbit = flight({ ...o, d: o.d * K2 }); orbitT0 = t; }
      await look(orbit.at(t - orbitT0));
    }
    await step(dt * sp); appT += dt * sp; if (frames.includes(i)) await snap();
  }
}

fs.mkdirSync(OUT, { recursive: true });
let entered = false;
for (const shot of SHOTS) {
  if (only && !only.includes(shot.id)) continue;
  shotDir = path.join(OUT, shot.id); fs.rmSync(shotDir, { recursive: true, force: true }); fs.mkdirSync(shotDir, { recursive: true }); frameNo = 0;
  const N = Math.round(shot.dur * FPS), frames = STILLS ? [0, N >> 2, N >> 1, (3 * N) >> 2, N - 1] : [...Array(N).keys()];
  const t0 = Date.now();
  if (shot.app) { await shotGlobe(shot, frames); entered = true; }
  else {
    if (!entered) { await enterSet(); entered = true; }
    if (!state.parts) await readParts();
    const dt = 1 / FPS; let apart = false;
    for (let i = 0; i < N; i++) {
      const t = i * dt; if (STILLS && !frames.includes(i) && !shot.finale) continue;
      await look(shot.cam(i / (N - 1)));
      if (shot.finale && !apart && t >= shot.apartAt) { await ev(() => window.__film.apart()); apart = true; }
      await setOverlay(shot.overlay?.(t, state) ?? '');
      await step(shot.finale || !STILLS ? dt * (apart ? shot.apartSpeed ?? 1 : 1) : 0); if (frames.includes(i)) await snap();
    }
  }
  console.log(`${shot.id} ${shot.name}: ${frameNo} frames, ${((Date.now() - t0) / 1000).toFixed(0)} s`);
}
await browser.close();
fs.writeFileSync(path.join(OUT, 'meta.json'), JSON.stringify({ fps: FPS, w: VW, h: VH, shots: SHOTS.map((s) => ({ id: s.id, name: s.name, dur: s.dur })) }, null, 1));
