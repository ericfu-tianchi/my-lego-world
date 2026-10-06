// Los Angeles promo film, rendered frame by frame from the live app (?film=1, see window.__film in src/app/main.ts).
//   node tools/film/la.mjs                      final: 1080 × 1920, 60 fps capture (pairs blended to 30 fps in assemble.sh)
//   node tools/film/la.mjs --preview            540 × 960, 15 fps
//   node tools/film/la.mjs --stills [S04,S05]   first / middle / last frame of each shot (static shots only need the built set)
// Frames go to $FILM_OUT (default: tools/film/out, git-ignored) as <shot>/00000.png. Serve dist/ on $PORT (8161) first.
// GPU: headless Chromium with ANGLE on Metal (≈ 0.25 s a frame at 1080 × 1920 on an M3 Pro); swiftshader also works, about 20 × slower.
import { chromium } from '../node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';

const argv = process.argv.slice(2);
const PREVIEW = argv.includes('--preview'), STILLS = argv.includes('--stills');
const only = argv.find((a) => /^S\d/.test(a))?.split(',');
const [VW, VH] = PREVIEW || STILLS ? [540, 960] : [1080, 1920];
const FPS = PREVIEW ? 15 : STILLS ? 30 : 60;
const OUT = process.env.FILM_OUT ?? path.resolve('tools/film/out');
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

// ---- overlays (DOM over the canvas, so the type is real web type) --------------------------------------
const OVERLAY_CSS = `
#fo { position: fixed; inset: 0; z-index: 10; pointer-events: none; font-family: Rubik, "PingFang SC", -apple-system, sans-serif; color: #1f2124; }
#fo .title { position: absolute; left: 0; right: 0; top: 13%; text-align: center; }
#fo .title h1 { font-size: calc(var(--u) * 92); font-weight: 600; letter-spacing: .02em; margin: 0; line-height: 1.22; font-family: "PingFang SC", Rubik, sans-serif; }
#fo .title p { margin: calc(var(--u) * 26) 0 0; font-family: "IBM Plex Mono", Menlo, monospace; font-size: calc(var(--u) * 26); letter-spacing: .28em; text-transform: uppercase; color: #5d6166; }
#fo .lt { position: absolute; left: calc(var(--u) * 60); top: calc(var(--u) * 150); padding: calc(var(--u) * 22) calc(var(--u) * 30) calc(var(--u) * 24); border-radius: calc(var(--u) * 22); background: rgba(255,255,255,.86); box-shadow: 0 calc(var(--u) * 10) calc(var(--u) * 40) rgba(28,27,24,.14); }
#fo .lt .k { font-family: "IBM Plex Mono", Menlo, monospace; font-size: calc(var(--u) * 22); letter-spacing: .28em; text-transform: uppercase; color: #6a6e72; display: flex; align-items: center; gap: calc(var(--u) * 14); }
#fo .lt .k::before { content: ""; width: calc(var(--u) * 26); height: calc(var(--u) * 18); background: #c91a09; border-radius: calc(var(--u) * 4); }
#fo .lt .n { font-size: calc(var(--u) * 54); font-weight: 600; letter-spacing: -.01em; margin-top: calc(var(--u) * 8); }
#fo .lt .z { font-family: "PingFang SC", sans-serif; font-size: calc(var(--u) * 28); color: #4a4e52; margin-top: calc(var(--u) * 2); letter-spacing: .06em; }
#fo .end { position: absolute; left: 0; right: 0; top: 12%; text-align: center; }
#fo .end .logo { display: inline-block; width: calc(var(--u) * 66); height: calc(var(--u) * 46); border-radius: calc(var(--u) * 8); background: #c91a09; position: relative; box-shadow: inset 0 calc(var(--u) * -8) 0 rgba(0,0,0,.18); }
#fo .end .logo::before, #fo .end .logo::after { content: ""; position: absolute; top: calc(var(--u) * -11); width: calc(var(--u) * 18); height: calc(var(--u) * 11); border-radius: calc(var(--u) * 5) calc(var(--u) * 5) 0 0; background: #c91a09; }
#fo .end .logo::before { left: calc(var(--u) * 9); } #fo .end .logo::after { right: calc(var(--u) * 9); }
#fo .end h2 { font-size: calc(var(--u) * 104); font-weight: 600; letter-spacing: -.02em; margin: calc(var(--u) * 34) 0 0; }
#fo .end .s { font-family: "IBM Plex Mono", Menlo, monospace; font-size: calc(var(--u) * 25); letter-spacing: .26em; text-transform: uppercase; color: #5d6166; margin-top: calc(var(--u) * 14); }
#fo .end .c { font-family: "PingFang SC", sans-serif; font-size: calc(var(--u) * 40); font-weight: 500; margin-top: calc(var(--u) * 56); letter-spacing: .06em; }
#fo .end .m { font-family: "PingFang SC", sans-serif; font-size: calc(var(--u) * 27); color: #5d6166; margin-top: calc(var(--u) * 16); letter-spacing: .04em; }
#fo .tap { position: absolute; width: 0; height: 0; } #fo .tap i { position: absolute; border-radius: 50%; transform: translate(-50%, -50%); }
`;
const card = {
  title: () => `<div class="title"><h1>AI 搭的乐高<br>AI 剪的片</h1><p>Built by AI · Edited by AI</p></div>`,
  lt: (k, n, z) => `<div class="lt"><div class="k">Los Angeles · ${k}</div><div class="n">${n}</div><div class="z">${z}</div></div>`,
  end: (parts) => `<div class="end"><span class="logo"></span><h2>Los Angeles</h2><div class="s">My Lego World</div><div class="c">${parts} 块真实乐高零件</div><div class="m">AI 设计 · AI 搭建 · AI 剪辑</div></div>`,
};
/** an overlay's opacity over a shot: fades in at a, out at b (seconds into the shot) */
const fade = (t, a, b, f = 0.45) => clamp((t - a) / f) * clamp((b - t) / f);
const rise = (o) => `transform: translateY(calc(var(--u) * ${((1 - o) * 18).toFixed(2)}))`;

// ---- the set's places (world coordinates, from __film.tags(): x east, z south/front, y up; a plate is 0.4) -------
const WHEEL = [-23, 21, 14.5], RIDERS = [-7, 14.8, 23], CART = [-3.5, 10.4, 28.2], ARCH = [8.5, 15, 14.5], SIGN66 = [5.5, 12, 17];
const TOWER = [12, 10, 30.5], SURFER = [3, 7.4, 31.5], SKATER = [32.5, 10.4, 9.7], WALLS = [38, 7, 25.5], LIFTER = [47, 8, 14.5];
const ROLLER = [9.5, 8.6, -4], STARS = [12.5, 4.2, -7], LETTERS = [-6, 19, -26.5], MAST = [17.5, 30, -33], GRIFFITH = [40, 16, -20];

// ---- the shot list (dur in seconds; cam(k, t) with k = t / dur) ------------------------------------------
const SHOTS = [
  // the globe, the pin, the app's own entrance (Rain) and a first wide drift
  { id: 'S01', name: 'Globe turns · tap LA · the set rains in (the app\'s own entrance) · wide drift', dur: 10.0, app: true },
  // Santa Monica Pier
  { id: 'S02', name: 'Ferris wheel · low angle, tilt up and arc', dur: 3.6,
    cam: move([{ l: [-23, 14, 14.5], az: 0.42, el: -0.06, d: 64, fov: 38 }, { l: [-23, 22, 14.5], az: 0.2, el: 0.02, d: 57, fov: 38 }], ease.sine),
    overlay: (t) => [card.lt('01', 'Santa Monica Pier', '圣塔莫尼卡码头'), fade(t, 0.35, 3.3)] },
  { id: 'S03', name: 'Coaster rider laughing · close-up arc', dur: 2.6,
    cam: move([{ l: [-4.5, 15.6, 20.5], az: 0.05, el: 0.16, d: 10.5, fov: 34 }, { l: [-4.5, 15.4, 20.5], az: 0.55, el: 0.12, d: 9.5, fov: 34 }], ease.sine) },
  { id: 'S04', name: 'Ice-cream cart, the kid and the vendor · push-in', dur: 3.2,
    cam: move([{ l: [-4, 11, 28.5], az: -0.5, el: 0.2, d: 24, fov: 34 }, { l: [-3, 11.2, 28.5], az: -0.3, el: 0.14, d: 16, fov: 34 }], ease.sine) },
  { id: 'S05', name: 'SANTA MONICA arch · from the lettering, pull back to reveal the wheel', dur: 3.8,
    cam: move([{ l: [8.5, 17.2, 13.8], az: 1.6, el: 0.05, d: 12.5, fov: 36 }, { l: [8.5, 16, 14.5], az: 1.45, el: 0.12, d: 30, fov: 36 }], ease.inOut) },
  // the beach and Venice
  { id: 'S06', name: 'Beach · lateral track, the surfer to tower 18', dur: 3.6,
    cam: move([{ l: [3.5, 8, 31.5], az: 0.15, el: 0.14, d: 15, fov: 36 }, { l: [12, 12, 30.5], az: 0.1, el: 0.15, d: 26, fov: 36 }], ease.sine),
    overlay: (t) => [card.lt('02', 'Venice Beach', '威尼斯海滩'), fade(t, 0.35, 3.3)] },
  { id: 'S07', name: 'Skater on the coping · speed ramp from high wide into a low arc', dur: 3.4,
    cam: move([{ l: [30, 8, 14], az: 1.0, el: 0.5, d: 36, fov: 34 }, { l: [32.5, 10, 10.5], az: 0.75, el: 0.24, d: 15, fov: 34 }, { l: [32.5, 10, 10.5], az: 0.55, el: 0.24, d: 14.5, fov: 34 }], ease.ramp) },
  { id: 'S08', name: 'Graffiti walls · dolly past the umbrella', dur: 3.2,
    cam: move([{ l: [30, 7, 24], az: 0.25, el: 0.2, d: 28, fov: 34 }, { l: [45, 7, 24], az: -0.25, el: 0.2, d: 28, fov: 34 }], ease.sine) },
  { id: 'S09', name: 'Muscle Beach · the curl', dur: 2.4,
    cam: move([{ l: [47, 9, 14.5], az: 0.15, el: 0.36, d: 12.5, fov: 34 }, { l: [47, 9, 14.5], az: 0.45, el: 0.32, d: 11.5, fov: 34 }], ease.sine) },
  { id: 'S10', name: 'Roller-skater · parallax past the palms, HOLLYWOOD behind', dur: 3.8,
    cam: move([{ p: [20, 7.6, 9], l: [9.5, 8.8, -4], fov: 34 }, { p: [7, 7.6, 9], l: [9.5, 8.6, -4], fov: 34 }], ease.sine) },
  // Hollywood
  { id: 'S11', name: 'Walk of Fame · dolly along the stars, tilt up to HOLLYWOOD', dur: 4.6,
    cam: move([{ p: [26, 7.6, -3], l: [10, 4, -7.4], fov: 36 }, { p: [21, 8.4, -2.6], l: [6, 8, -11], fov: 36 }, { p: [17, 11, -1.5], l: [-2, 19, -26.5], fov: 34 }], ease.inOut),
    overlay: (t) => [card.lt('03', 'Hollywood Hills', '好莱坞山'), fade(t, 1.4, 4.4)] },
  { id: 'S12', name: 'HOLLYWOOD, the mast, Griffith · crane and arc', dur: 4.0,
    cam: move([{ l: [-6, 19, -26.5], az: 0.45, el: 0.15, d: 72, fov: 32 }, { l: [38, 18, -22], az: 0.9, el: 0.3, d: 50, fov: 32 }], ease.inOut) },
  // finale: wide pull-back, Take it apart, end card
  { id: 'S13', name: 'Wide pull-back · Take it apart (nebula) · end card', dur: 8.0, finale: true,
    cam: move([{ l: [0, 8, 0], az: 0.62, el: 0.42, d: 240, fov: 32 }, { l: [0, 30, 0], az: 0.95, el: 0.38, d: 520, fov: 32 }], ease.sine),
    overlay: (t, s) => [card.end(s.parts), fade(t, 3.4, 99, 0.9)] },
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

async function enterSet() {   // straight to the built set (stills of single shots), without filming the entrance
  await ev(() => { window.__film.enter('la'); }); for (let i = 0; i < 200; i++) { await step(1 / 30); if ((await ev(() => window.__film.state())).state === 'built' && i > 120) break; }
}
async function readParts() { state.parts = await ev(() => (document.getElementById('place-stats').textContent.match(/^[\d,]+/) || [''])[0]); }

/** S01: the globe turns LA into view, a tap on the pin, the app's entrance; the camera is the app's own (k × farther for 9:16) */
async function shotGlobe(shot, frames) {
  const N = Math.round(shot.dur * FPS), dt = 1 / FPS;
  // find the spin that brings LA's pin to the front, a little right of centre
  const spinAt = await ev(() => { const a = window.__app; let best = 0, bs = 1e9; for (let s = 0; s < 6.283; s += 0.01) { a.spin = s; a.globe.group.quaternion.copy(a.globe.homeQuat(s)); a.globe.group.updateMatrixWorld(true); const w = a.globe.pins.find((p) => p.place.scene === 'la').group.getWorldPosition(a.camera.position.clone()); if (w.z < 0) continue; const [x, y] = window.__film.pinScreen('la'); const sc = Math.abs(x - innerWidth * 0.5) + Math.abs(y - innerHeight * 0.44) * 0.3; if (sc < bs) { bs = sc; best = s; } } return best; });
  const CLICK = 3.6, SPIN0 = spinAt - 1.1;
  let clicked = false, pin = [0, 0];
  for (let i = 0; i < N; i++) {
    const t = i * dt;
    if (t < CLICK) { const k = t / CLICK; await ev(({ s, z }) => { const a = window.__app; a.spin = s; a.spinVel = 0; a.idle = 0; window.__film.zoom(z); }, { s: SPIN0 + (spinAt - SPIN0) * ease.out(k), z: 1.45 - 0.2 * ease.sine(k) }); }
    else if (!clicked) { pin = await ev(() => window.__film.pinScreen('la')); await ev(() => window.__film.enter('la')); clicked = true; }
    if (clicked) { const k = clamp((t - CLICK) / 2.8); await ev((z) => window.__film.zoom(z), 1.25 + 0.3 * ease.inOut(k)); }
    // overlays: the title over the turning globe, the tap ripple on the pin
    let html = '';
    const to = fade(t, 0.25, 2.9, 0.6); if (to > 0) html += `<div style="opacity:${to.toFixed(3)};${rise(clamp((t - 0.25) / 0.9))}">${card.title()}</div>`;
    const tp = t - (CLICK - 0.25); if (tp > 0 && tp < 1.1) { if (!clicked) pin = await ev(() => window.__film.pinScreen('la'));
      const r = (14 + 70 * ease.out(tp / 1.1)) * VW / 1080, o = tp < 0.25 ? tp / 0.25 : 1 - (tp - 0.25) / 0.85, dot = tp < 0.35 ? 1 - Math.abs(tp - 0.2) / 0.2 * 0.3 : clamp(1 - (tp - 0.35) / 0.3);
      html += `<div class="tap" style="left:${pin[0]}px;top:${pin[1]}px"><i style="width:${2 * r}px;height:${2 * r}px;border:${3 * VW / 1080}px solid rgba(255,255,255,${(0.9 * o).toFixed(3)});box-shadow:0 0 ${10 * VW / 1080}px rgba(0,0,0,${(0.18 * o).toFixed(3)})"></i><i style="width:${46 * VW / 1080}px;height:${46 * VW / 1080}px;background:rgba(255,255,255,${(0.75 * dot).toFixed(3)})"></i></div>`; }
    await setOverlay(html);
    if (clicked && t > CLICK + 3.0) {   // the app's tween is over: the camera is ours from here, carried on from where it stands
      if (!shot.from) { shot.from = await ev(() => { const a = window.__app; return { p: a.camera.position.toArray(), l: a.orbit.target.toArray() }; }); }
      const k = (t - CLICK - 3.0) / (shot.dur - CLICK - 3.0), f = shot.from;
      const end = { p: orb([-6, 6, 4], 0.58, 0.34, 215), l: [-6, 6, 4] };
      const e = ease.inOut(k); await look({ p: f.p.map((v, j) => v + (end.p[j] - v) * e), l: f.l.map((v, j) => v + (end.l[j] - v) * e), fov: 32 });
    }
    await step(dt); if (frames.includes(i)) await snap();
  }
}

fs.mkdirSync(OUT, { recursive: true });
let entered = false;
for (const shot of SHOTS) {
  if (only && !only.includes(shot.id)) continue;
  shotDir = path.join(OUT, shot.id); fs.rmSync(shotDir, { recursive: true, force: true }); fs.mkdirSync(shotDir, { recursive: true }); frameNo = 0;
  const N = Math.round(shot.dur * FPS), all = [...Array(N).keys()], frames = STILLS ? [0, N >> 1, N - 1] : all;
  const t0 = Date.now();
  if (shot.app) { await shotGlobe(shot, frames); entered = true; }
  else {
    if (!entered) { await enterSet(); entered = true; }
    if (!state.parts) await readParts();
    const dt = 1 / FPS; let apart = false;
    for (let i = 0; i < N; i++) {
      const t = i * dt; if (STILLS && !frames.includes(i) && !shot.finale) continue;
      await look(shot.cam(i / (N - 1)));
      if (shot.finale && !apart && t >= 1.6) { await ev(() => window.__film.apart()); apart = true; }
      const ov = shot.overlay?.(t, state); await setOverlay(ov && ov[1] > 0 ? `<div style="opacity:${ov[1].toFixed(3)};${rise(ov[1])}">${ov[0]}</div>` : '');
      await step(shot.finale || !STILLS ? dt : 0); if (frames.includes(i)) await snap();
    }
  }
  console.log(`${shot.id} ${shot.name}: ${frameNo} frames, ${((Date.now() - t0) / 1000).toFixed(0)} s`);
}
await browser.close();
fs.writeFileSync(path.join(OUT, 'meta.json'), JSON.stringify({ fps: FPS, w: VW, h: VH, shots: SHOTS.map((s) => ({ id: s.id, name: s.name, dur: s.dur })) }, null, 1));
