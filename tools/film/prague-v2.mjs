// Prague promo film v2 (2026-10-17). v1 felt stiff at every close-up (Eric: 每一个 close-up 都非常生硬): it braked to a crawl, turned a
// little and craned up to a bird's-eye view between scenes. v2 never brakes hard (a close-up is the same glide at about a third of the
// speed), keeps orbiting the subject in the direction of travel, and moves between scenes at the height it is already at. Týn gets its
// own close-up; each close-up lasts longer. No music.
//   S01 globe + intro, the tap, the entrance (1×), the orbit with a dolly-in, then the tour: Old Town Square (Hus, the guide with her
//       coffee, the café, the cat) → the two watching the Astronomical Clock, over their shoulders → the saints and the saxophonist on
//       Charles Bridge → the painter on Kampa, his canvas and the bridge beyond. Each stop eases in, drifts for a beat, eases out.
//   S02 starts where S01 stops (no visible cut): rise from the painter back to the whole island, Take it apart, end card
//   node tools/film/prague-v2.mjs [--keys | --preview]; node tools/film/assemble.mjs <frames> docs/film/prague-v2.mp4
import { chromium } from '../node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';

const argv = process.argv.slice(2);
const PREVIEW = argv.includes('--preview'), STILLS = argv.includes('--stills');
const only = argv.find((a) => /^S\d/.test(a))?.split(',');
const [VW, VH] = PREVIEW || STILLS ? [540, 960] : [1080, 1920];
const FPS = PREVIEW ? 15 : STILLS ? 30 : 60;
const OUT = process.env.FILM_OUT ?? path.resolve('tools/film/out-prague-v2');
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
const OPEN = `<div class="open">Prague<span>·</span><b>布拉格</b><div class="cr">Designed, built &amp; shot by <i>Claude</i></div><div class="crz">由 Claude 设计 · 搭建 · 拍摄</div></div>`;
const END = (parts) => `<div class="end"><div class="l">Designed by <i>Claude</i></div><div class="l">Built by <i>Claude</i></div><div class="l">Shot by <i>Claude</i></div><div class="c">由 Claude 设计 · 搭建 · 拍摄</div><div class="m">My Lego World · Prague · <b>${parts} 块乐高零件</b></div></div>`;
const fade = (t, a, b, f = 0.6) => clamp((t - a) / f) * clamp((b - t) / f);
const layer = (html, o, lift = 14) => (o > 0 ? `<div style="opacity:${o.toFixed(3)};transform:translateY(calc(var(--u) * ${((1 - o) * lift).toFixed(2)}))">${html}</div>` : '');

// ---- the shots ---------------------------------------------------------------------------------------
// world coordinates (x east, z south = the front, y up; a plate is 0.4)
const away = (p, l, f) => p.map((v, i) => l[i] + (v - l[i]) * f);   // the same view, f × farther
/** the tour's stops: where the camera slows to a walk and turns DRIFT round the subject. `via`: an eye the path passes on its way in */
const TOUR = [
  { name: 'square', l: [20, 10, 10], az: 0.2, el: 0.3, d: 62, fov: 40, hold: 2.4 },
  { name: 'tyn', l: [23, 26, -14], az: 0.05, el: 0.12, d: 66, fov: 40, hold: 2.4 },
  { name: 'orloj', l: [35, 17, 4], az: 0.12, el: -0.12, d: 40, fov: 40, hold: 2.6 },
  { name: 'bridge', l: [-20, 11, 2], az: 0.5, el: 0.2, d: 42, fov: 40, hold: 2.6 },
  { name: 'painter', l: [-35, 8, 11], az: -0.3, el: 0.25, d: 26, fov: 40, hold: 2.4 },
];
const DRIFT = 0.3, SPEED = 1.15, EDGE = 0.8;   // rad of orbit through a close-up; cruise in view-widths per second; how long the glide takes to ease into and out of a close-up
const pose = (s, daz = 0, dk = 1) => ({ p: orb(s.l, s.az + daz, s.el, s.d * dk), l: s.l, fov: s.fov });
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
/** S01's path after the app's tween: one spline through the orbit and the stops, never stopping. The camera's speed is set in view-widths
 *  (eye and target travel divided by the distance between them), so a wide arc and a close pass feel equally fast. It cruises at SPEED
 *  and glides down to a walk over each stop's span, timed so the span lasts its `hold`; the speed curve is smooth, so there is no jolt
 *  where it slows or leaves (Eric, 2026-10-12: 运镜特别生硬 — v1 stopped dead at each scene and craned straight up and down between them) */
function flight(o) {
  const K = [{ ...{ p: orb(o.l, o.az, o.el, o.d), l: o.l } }, { p: orb([0, 14, 0], o.az - 0.12, 0.38, 175), l: [0, 14, 0] }, { p: orb([6, 13, 4], o.az - 0.2, 0.32, 145), l: [6, 13, 4] }];
  const spans = [];
  // each close-up orbits its subject the way the camera is travelling (sign of the next scene's x against the last), easing in a little
  const camX = (s) => orb(s.l, s.az, s.el, s.d)[0];
  const dir = TOUR.map((s, i) => Math.sign((camX(TOUR[i + 1] ?? s) - camX(TOUR[i - 1] ?? s)) || 1));
  TOUR.forEach((s, i) => {
    const D = DRIFT * dir[i];
    if (i > 0) {   // between scenes: one key over the midpoint, a little farther back and at about the same height — a glide, not a crane
      const r = TOUR[i - 1], l = r.l.map((v, j) => (v + s.l[j]) / 2), a0 = r.az + DRIFT * dir[i - 1] / 2, a1 = s.az - D / 2, az = a0 + Math.atan2(Math.sin(a1 - a0), Math.cos(a1 - a0)) / 2;
      K.push({ p: s.via ?? orb(l, az, Math.max(0.3, (r.el + s.el) / 2 + 0.12), Math.max(r.d, s.d) * 1.12 + Math.hypot(...r.l.map((v, j) => v - s.l[j])) * 0.35), l, fov: s.fov }); }
    K.push(pose(s, -D / 2, 1.05)); K.push(pose(s, 0, 1.0)); K.push(pose(s, D / 2, 0.96)); spans.push([K.length - 3, K.length - 1, s.hold]);
  });
  // sample the spline; τ = view-widths travelled
  const N = 6000, U = [], P = [], Lk = [], T = [0];
  for (let i = 0; i <= N; i++) { const u = (i / N) * (K.length - 1); U.push(u); P.push(cspline(K.map((k) => k.p), u)); Lk.push(cspline(K.map((k) => k.l), u)); }
  for (let i = 1; i <= N; i++) { const d = Math.hypot(...P[i].map((v, j) => v - Lk[i][j])); T.push(T[i - 1] + (Math.hypot(...P[i].map((v, j) => v - P[i - 1][j])) + Math.hypot(...Lk[i].map((v, j) => v - Lk[i - 1][j]))) / d); }
  const tauAt = (u) => T[Math.round((u / (K.length - 1)) * N)];
  const S = spans.map(([a, b, hold]) => ({ a: tauAt(a), b: tauAt(b), v: (tauAt(b) - tauAt(a)) / hold }));
  const rise = 1.2;   // the start: out of the app's tween at rest, up to speed over `rise` view-widths
  const speed = (tau) => { let v = SPEED * (0.08 + 0.92 * ease.smooth(clamp(tau / rise)));
    for (const s of S) { const w = clamp(tau < s.a ? 1 - (s.a - tau) / EDGE : tau > s.b ? 1 - (tau - s.b) / EDGE : 1); v = Math.min(v, s.v + (SPEED - s.v) * (1 - ease.smooth(w))); }
    return v; };
  const time = [0]; for (let i = 1; i <= N; i++) time.push(time[i - 1] + (T[i] - T[i - 1]) / speed((T[i] + T[i - 1]) / 2));
  if (argv.includes('--plan')) { let slow = 0, runs = []; for (let i = 1; i <= N; i++) { const dt = time[i] - time[i - 1], sl = speed(T[i]) < 0.3 * SPEED; if (sl) slow += dt; else if (slow) { runs.push(slow.toFixed(1)); slow = 0; } } runs.push(slow.toFixed(1)); console.log('dwell (s, below 30 % speed):', runs.join(' ')); }
  if (argv.includes('--plan')) console.log(K.map((_, k) => `${k}:${time[Math.round((k / (K.length - 1)) * N)].toFixed(1)}`).join(' '));
  const F = K.map((k) => [k.fov ?? 32]);
  return { dur: time[N], at: (t) => { let lo = 0, hi = N; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (time[m] <= t) lo = m; else hi = m; }
    const x = U[lo] + (U[hi] - U[lo]) * clamp((t - time[lo]) / (time[hi] - time[lo] || 1)); return { p: cspline(K.map((k) => k.p), x), l: cspline(K.map((k) => k.l), x), fov: cspline(F, x)[0] }; } };
}
const TOUR_DUR = flight({ l: [0, 9.6, 0], az: -0.45, el: 0.38, d: 135 * 1.3 }).dur;
if (argv.includes('--plan')) { console.log('tour', TOUR_DUR.toFixed(1), 's'); process.exit(0); }
const LAST = pose(TOUR[TOUR.length - 1], -DRIFT / 2, 0.96), WIDE = { p: orb([0, 12, 0], 0.28, 0.4, 200), l: [0, 13, 0], fov: 44 }, WIDE2 = { p: orb([0, 16, 0], 0.4, 0.38, 250), l: [0, 19, 0], fov: 42 };
const SHOTS = [
  { id: 'S01', name: 'Intro card over the globe, tap at 1.2 s, the entrance at 1×, orbit with a dolly-in, the tour: the square, the clock watchers, the bridge saints, the painter on Kampa', dur: 4.0 + TOUR_DUR + 0.15, app: true },
  // no visible cut: S02 starts on the painter, where S01's drift ends, and eases out from it
  { id: 'S02', name: 'From the painter, rise back to the whole island, a beat, Take it apart, end card', dur: 12.5, finale: true, apartAt: 6.6, apartSpeed: 1.5,
    cam: seq([
      [4.6, move([LAST, { p: orb([-20, 12, 6], -0.05, 0.3, 90), l: [-14, 12, 4], fov: 38 }, WIDE], ease.smooth)],
      [7.9, move([WIDE, WIDE2], ease.out)],
    ]),
    overlay: (t, s) => layer(END(s.parts), fade(t, 9.2, 99, 0.5)) },
];

// ---- capture -------------------------------------------------------------------------------------------
const browser = await chromium.launch({ args: ['--use-angle=metal', '--ignore-gpu-blocklist', '--enable-gpu'] });
const page = await browser.newPage({ viewport: { width: VW, height: VH }, deviceScaleFactor: 1 });
page.on('pageerror', (e) => console.log('[pageerror]', e.message));
await page.goto(`http://127.0.0.1:${PORT}/index.html?film=1`, { waitUntil: 'domcontentloaded', timeout: 180000 });
await page.waitForFunction(() => window.__ready === true, null, { timeout: 180000 });
await page.evaluate(({ css, u }) => { const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s); const d = document.createElement('div'); d.id = 'fo'; d.style.setProperty('--u', u + 'px'); document.body.appendChild(d); document.querySelectorAll('.hud').forEach((h) => (h.style.visibility = 'hidden')); document.documentElement.classList.add('no-intro'); document.body.classList.remove('intro'); const c = document.getElementById('c'); c.style.transition = 'none'; c.classList.add('ready'); }, { css: OVERLAY_CSS, u: VW / 1080 });
await page.evaluate(() => document.fonts.ready);
const ev = (fn, arg) => page.evaluate(fn, arg);
const setOverlay = (html) => ev((h) => { document.getElementById('fo').innerHTML = h; }, html);
const look = (c) => ev((c) => window.__film.look(c.p, c.l, c.fov), c);
const step = (dt) => ev((dt) => window.__film.step(dt), dt);
let frameNo = 0, shotDir = '';
async function snap() { await page.screenshot({ path: path.join(shotDir, String(frameNo++).padStart(5, '0') + '.png') }); }
const state = { parts: '' };

async function enterSet() {   // straight to the built set (single-shot renders), without filming the entrance
  await ev(() => { window.__film.enter('prague'); }); for (let i = 0; i < 200; i++) { await step(1 / 30); if (i > 120 && (await ev(() => window.__film.state())).state === 'built') break; }
}
async function readParts() { state.parts = await ev(() => (document.getElementById('place-stats').textContent.match(/^[\d,]+/) || [''])[0]); }

/** S01: the app drives the globe and the entrance (its camera k × farther for 9:16); from the end of its tween the camera is ours */
async function shotGlobe(shot, frames) {
  const N = Math.round(shot.dur * FPS), dt = 1 / FPS;
  const spinAt = await ev(() => { const a = window.__app; let best = 0, bs = 1e9; for (let s = 0; s < 6.283; s += 0.01) { a.spin = s; a.globe.group.quaternion.copy(a.globe.homeQuat(s)); a.globe.group.updateMatrixWorld(true); const w = a.globe.pins.find((p) => p.place.scene === 'prague').group.getWorldPosition(a.camera.position.clone()); if (w.z < 0) continue; const [x, y] = window.__film.pinScreen('prague'); const sc = Math.abs(x - innerWidth * 0.5) + Math.abs(y - innerHeight * 0.42) * 0.3; if (sc < bs) { bs = sc; best = s; } } return best; });
  const CLICK = 1.2, TWEEN = 2.8, SPIN0 = spinAt - 0.45, K0 = 0.95, K1 = 0.85, K2 = 1.3, FAST = 1;   // TWEEN in app seconds
  let clicked = false, pin = [0, 0], orbit = null, appT = 0, clickApp = 0, orbitT0 = 0;
  for (let i = 0; i < N; i++) {
    const t = i * dt, sp = clicked ? FAST : 1, ta = clicked ? appT - clickApp : 0;
    if (t < CLICK) { const k = t / CLICK; await ev(({ s, z }) => { const a = window.__app; a.spin = s; a.spinVel = 0; a.idle = 0; window.__film.zoom(z); }, { s: SPIN0 + (spinAt - SPIN0) * ease.out(k), z: K0 + (K1 - K0) * ease.sine(k) }); }
    else if (!clicked) { pin = await ev(() => window.__film.pinScreen('prague')); await ev(() => window.__film.enter('prague')); clicked = true; clickApp = appT; }
    if (clicked && ta < TWEEN) await ev((z) => window.__film.zoom(z), K1 + (K2 - K1) * ease.inOut(clamp(ta / TWEEN)));
    let html = layer(OPEN, clamp((1.9 - t) / 0.4), 0);   // on screen from the first frame, gone as the globe sinks
    const tp = t - (CLICK - 0.25); if (tp > 0 && tp < 1.1) { if (!clicked) pin = await ev(() => window.__film.pinScreen('prague'));
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
if (argv.includes('--keys')) {
  await enterSet(); shotDir = path.join(OUT, 'keys'); fs.mkdirSync(shotDir, { recursive: true });
  for (const c of [...TOUR.map((s) => pose(s)), WIDE]) { await look(c); await step(0); await snap(); }
  await browser.close(); process.exit(0);
}
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
