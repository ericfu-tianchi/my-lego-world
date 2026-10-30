// "How a city becomes LEGO", English edition (2026-10-28) of howto-v2.mjs, for Eric's portfolio site. Same film, English copy, Rubik type.
// v2 (2026-10-13): the real pipeline, told simply, the Paris set as the worked example, ≈ 83 s at 105 BPM.
// v2 answers Eric's notes on v1: the steps follow the actual process (references → pick the places → colours and heights → blockout + a
// human check → real parts → build, compare, rebuild → automatic checks and the AI judge → a last human look); a brick-wall wipe on every
// step; quicker cuts.
//   node tools/film/howto-en.mjs [--preview] [--from <s> --to <s>]; python3 tools/film/howto-mix.py <frames dir> <out.mp4> --cues howto-en-cues.json
//   serve dist/ on 8161 first (python3 -m http.server 8161 -d dist)
// The reference images (our own AI concept renders, docs/refs/paris-composition-a / paris-eiffel-lego-b) are served from dist/filmref/.
import { chromium } from '../node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';

const argv = process.argv.slice(2);
const PREVIEW = argv.includes('--preview');
const arg = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? +argv[i + 1] : d; };
const [VW, VH] = PREVIEW ? [540, 960] : [1080, 1920];
const FPS = PREVIEW ? 10 : 30;
const OUT = process.env.FILM_OUT ?? path.resolve(PREVIEW ? 'tools/film/out-howto-en-preview' : 'tools/film/out-howto-en');
const PORT = process.env.PORT ?? 8161;

// ---- timing: the track's beat grid (105 BPM, first beat 0.377 s); each step starts on a bar or half-bar line -----------------------------
const BEAT = 60 / 105, BAR = 4 * BEAT, bar = (n) => 0.377 + n * BAR;   // v1's track (music.wav, Eric 2026-10-13: 配乐我喜欢 v1 的)
const STEPS = [
  { t: bar(2), n: 1, title: 'Find references', sub: 'Know what it really looks like first', c: '#C91A09', short: 'Reference' },
  { t: bar(5.5), n: 2, title: 'Pick the landmarks', sub: 'Keep the iconic ones that can really be built', c: '#FE8A18', short: 'Landmarks' },
  { t: bar(9), n: 3, title: 'Set colors and heights', sub: 'Colors from real photos, heights to real scale', c: '#F2CD37', ink: '#3a2d00', short: 'Colors' },
  { t: bar(12.5), n: 4, title: 'Block it out', sub: 'Plain boxes first, checked against the reference', c: '#237841', short: 'Blockout' },
  { t: bar(17), n: 5, title: 'Real parts only', sub: 'Every piece is a real, official LEGO part', c: '#36AEBF', short: 'Parts' },
  { t: bar(20.5), n: 6, title: 'Build, compare, rebuild', sub: "Side by side with the reference. If it's off, swap parts and rebuild", c: '#0055BF', short: 'Build' },
  { t: bar(26), n: 7, title: 'Check and score', sub: 'Code checks the structure, an AI judge checks the likeness', c: '#8320B7', short: 'Check' },
  { t: bar(30.5), n: 8, title: 'One last human look', sub: '', c: '#E4ADC8', ink: '#5a1d3a', short: 'Done' },
];
// the ending: at bar 32 the music jumps to the track's last phrase (bar 36 on), so its final chord closes the film
const JOIN = [bar(32), bar(36)], END = JOIN[0] + (92.0 - JOIN[1]);
fs.writeFileSync(path.join(path.dirname(new URL(import.meta.url).pathname), 'howto-en-cues.json'), JSON.stringify({ steps: STEPS.map((s) => s.t), end: END, beat: BEAT }));

// ---- maths ------------------------------------------------------------------------------------------------------------------------
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, k) => a + (b - a) * k;
const L3 = (a, b, k) => a.map((v, i) => lerp(v, b[i], k));
const io = (k) => (k < 0.5 ? 4 * k ** 3 : 1 - (-2 * k + 2) ** 3 / 2);
const out = (k) => 1 - (1 - k) ** 3;
const out5 = (k) => 1 - (1 - k) ** 5;
const back = (k) => { if (k <= 0) return 0; const c = 1.7; return 1 + (c + 1) * (k - 1) ** 3 + c * (k - 1) ** 2; };
const bounce = (k) => { const n = 7.5625, d = 2.75; if (k < 1 / d) return n * k * k; if (k < 2 / d) return n * (k -= 1.5 / d) * k + 0.75; if (k < 2.5 / d) return n * (k -= 2.25 / d) * k + 0.9375; return n * (k -= 2.625 / d) * k + 0.984375; };
const seg = (t, a, b) => clamp((t - a) / (b - a));
const orb = (l, az, el, d, fov = 40) => ({ p: [l[0] + Math.sin(az) * Math.cos(el) * d, l[1] + Math.sin(el) * d, l[2] + Math.cos(az) * Math.cos(el) * d], l, fov });
const orbLerp = (A, B, k) => orb(L3(A[0], B[0], k), lerp(A[1], B[1], k), lerp(A[2], B[2], k), Math.exp(lerp(Math.log(A[3]), Math.log(B[3]), k)), lerp(A[4] ?? 40, B[4] ?? 40, k));
/** a pseudo-random number per integer, stable between frames */
const rnd = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

const BOXES = [
  ['eiffel', ['eiffel'], 'Eiffel Tower'], ['notredame', ['notredame'], 'Notre-Dame'], ['haussmann', ['haussmann', 'cafe'], 'Haussmann blocks'],
  ['bridge', ['bridge'], 'Seine bridge'], ['bouquiniste', ['bouquiniste'], 'Bookstalls'],
];
const GROUND = new Set(['terrain', 'water', 'quay']);
const TRAY_Y = 70;
const TREE = [14, 19];

// ---- overlay: LEGO-flat graphics drawn in HTML/SVG over the render -----------------------------------------------------------------
const CSS = `
#fo { position: fixed; inset: 0; z-index: 10; pointer-events: none; font-family: Rubik, -apple-system, sans-serif; color: #1f2124; overflow: hidden; }
#fo * { box-sizing: border-box; }
#fo .bp { position: absolute; inset: 0; background-color: #efeee9; background-image: radial-gradient(circle at 50% 44%, rgba(255,255,255,.95) 0 24%, transparent 25%), radial-gradient(circle at 50% 54%, rgba(0,0,0,.075) 0 27%, transparent 28%); background-size: calc(var(--u) * 60) calc(var(--u) * 60); }
#fo .bar { position: absolute; left: 0; right: 0; top: calc(var(--u) * 86); display: flex; justify-content: center; gap: calc(var(--u) * 22); }
#fo .bar i { width: calc(var(--u) * 42); height: calc(var(--u) * 42); border-radius: 50%; display: block; position: relative; box-shadow: inset 0 calc(var(--u) * -5) 0 rgba(0,0,0,.18); }
#fo .bar i::after { content: ''; position: absolute; inset: 22%; border-radius: 50%; box-shadow: inset 0 calc(var(--u) * 3) 0 rgba(255,255,255,.35), 0 calc(var(--u) * 2) calc(var(--u) * 2) rgba(0,0,0,.12); }
#fo .hd { position: absolute; left: calc(var(--u) * 76); right: calc(var(--u) * 40); top: calc(var(--u) * 190); display: flex; align-items: flex-end; gap: calc(var(--u) * 34); }
#fo .hd .ti { font-size: calc(var(--u) * 66); font-weight: 600; letter-spacing: -.005em; line-height: 1.08; }
#fo .hd .ti span { display: inline-block; }
#fo .hd .ti .w { white-space: nowrap; }
#fo .hd .su { font-size: calc(var(--u) * 34); color: #5b6064; margin-top: calc(var(--u) * 12); line-height: 1.28; }
#fo .tag { position: absolute; white-space: nowrap; background: #fff; border-radius: calc(var(--u) * 40); padding: calc(var(--u) * 10) calc(var(--u) * 24) calc(var(--u) * 10) calc(var(--u) * 16); font-size: calc(var(--u) * 30); font-weight: 600; display: flex; align-items: center; gap: calc(var(--u) * 10); box-shadow: 0 calc(var(--u) * 6) calc(var(--u) * 18) rgba(0,0,0,.14); }
#fo .tag b { width: calc(var(--u) * 24); height: calc(var(--u) * 24); border-radius: 50%; display: block; box-shadow: inset 0 calc(var(--u) * -3) 0 rgba(0,0,0,.2); }
#fo .fcard { position: absolute; background: #fff; border-radius: calc(var(--u) * 34); padding: calc(var(--u) * 28) calc(var(--u) * 36); box-shadow: 0 calc(var(--u) * 12) calc(var(--u) * 34) rgba(0,0,0,.16); font-size: calc(var(--u) * 40); font-weight: 600; white-space: nowrap; display: flex; align-items: center; gap: calc(var(--u) * 22); }
#fo .stamp { position: absolute; border: calc(var(--u) * 9) solid #237841; color: #237841; border-radius: calc(var(--u) * 26); padding: calc(var(--u) * 4) calc(var(--u) * 34); font: 800 calc(var(--u) * 92)/1.15 Rubik, -apple-system, sans-serif; letter-spacing: .04em; white-space: nowrap; background: rgba(255,255,255,.85); }
#fo .big { position: absolute; left: 0; right: 0; text-align: center; }
#fo .stud { width: calc(var(--u) * 120); height: calc(var(--u) * 120); border-radius: 50%; position: relative; box-shadow: inset 0 calc(var(--u) * -10) 0 rgba(0,0,0,.2), 0 calc(var(--u) * 8) calc(var(--u) * 16) rgba(0,0,0,.18); }
#fo .stud::after { content: ''; position: absolute; inset: 24%; border-radius: 50%; box-shadow: inset 0 calc(var(--u) * 5) 0 rgba(255,255,255,.4), 0 calc(var(--u) * 4) calc(var(--u) * 4) rgba(0,0,0,.15); }
#fo .pc { position: absolute; background: #fff; border-radius: calc(var(--u) * 22); padding: calc(var(--u) * 18) calc(var(--u) * 18) calc(var(--u) * 22); box-shadow: 0 calc(var(--u) * 14) calc(var(--u) * 36) rgba(0,0,0,.18); }
#fo .pc .im { border-radius: calc(var(--u) * 12); overflow: hidden; display: flex; align-items: center; justify-content: center; }
#fo .pc .lb { text-align: center; font-size: calc(var(--u) * 34); font-weight: 600; margin-top: calc(var(--u) * 16); white-space: nowrap; }
#fo .pin { position: absolute; left: 50%; top: calc(var(--u) * -26); transform: translateX(-50%); }
#fo .lbrick { position: absolute; display: flex; flex-direction: column; align-items: stretch; }
#fo .lbrick .st { display: flex; justify-content: space-around; padding: 0 calc(var(--u) * 16); height: calc(var(--u) * 20); }
#fo .lbrick .st i { width: calc(var(--u) * 58); height: calc(var(--u) * 20); border-radius: calc(var(--u) * 5) calc(var(--u) * 5) 0 0; display: block; box-shadow: inset 0 calc(var(--u) * 4) 0 rgba(255,255,255,.25); }
#fo .lbrick .bd { height: calc(var(--u) * 112); border-radius: calc(var(--u) * 10); display: flex; align-items: center; padding: 0 calc(var(--u) * 44); font-size: calc(var(--u) * 54); font-weight: 600; white-space: nowrap; box-shadow: inset 0 calc(var(--u) * -9) 0 rgba(0,0,0,.16), inset 0 calc(var(--u) * 6) 0 rgba(255,255,255,.2); }
#fo .col { position: absolute; bottom: calc(var(--u) * 300); width: calc(var(--u) * 128); border-radius: calc(var(--u) * 8) calc(var(--u) * 8) 0 0; box-shadow: inset 0 calc(var(--u) * -6) 0 rgba(0,0,0,.12); }
#fo .chip { display: inline-flex; align-items: center; gap: calc(var(--u) * 10); background: #fff; border-radius: calc(var(--u) * 40); padding: calc(var(--u) * 12) calc(var(--u) * 26); font-size: calc(var(--u) * 34); font-weight: 600; box-shadow: 0 calc(var(--u) * 5) calc(var(--u) * 14) rgba(0,0,0,.12); white-space: nowrap; }
#fo .wb { position: absolute; width: calc(var(--u) * 432); height: calc(var(--u) * 216); background-size: 100% 100%; }
`;
const svgUri = (s) => `url('data:image/svg+xml,${encodeURIComponent(s)}')`;
/** a 2×4 brick seen from above */
const topBrick = (c) => svgUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200"><rect x="2" y="2" width="396" height="196" rx="12" fill="${c}"/><rect x="2" y="2" width="396" height="196" rx="12" fill="none" stroke="rgba(0,0,0,.18)" stroke-width="4"/>${[0, 1, 2, 3].flatMap((i) => [0, 1].map((j) => `<circle cx="${50 + 100 * i}" cy="${56 + 100 * j}" r="31" fill="rgba(0,0,0,.18)"/><circle cx="${50 + 100 * i}" cy="${50 + 100 * j}" r="30" fill="${c}"/><circle cx="${50 + 100 * i}" cy="${50 + 100 * j}" r="30" fill="rgba(255,255,255,.12)"/><path d="M ${30 + 100 * i} ${44 + 100 * j} A 22 22 0 0 1 ${60 + 100 * i} ${30 + 100 * j}" stroke="rgba(255,255,255,.55)" stroke-width="6" fill="none" stroke-linecap="round"/>`)).join('')}</svg>`);
const WALL = new Map(); for (const s of STEPS) for (const c of [s.c, '#ffffff', '#d9dbd8']) if (!WALL.has(c)) WALL.set(c, topBrick(c));
/** a 1×2 brick from the side, its number on the face */
const brickSvg = (c, n, ink = '#fff', w = 150) => `<svg viewBox="0 0 150 118" style="width:calc(var(--u) * ${w});height:calc(var(--u) * ${w * 118 / 150});display:block;overflow:visible">
  <rect x="25" y="2" width="34" height="20" rx="3" fill="${c}"/><rect x="25" y="2" width="34" height="20" rx="3" fill="#000" opacity=".12"/><rect x="91" y="2" width="34" height="20" rx="3" fill="${c}"/><rect x="91" y="2" width="34" height="20" rx="3" fill="#000" opacity=".12"/>
  <rect x="25" y="2" width="34" height="6" rx="3" fill="#fff" opacity=".25"/><rect x="91" y="2" width="34" height="6" rx="3" fill="#fff" opacity=".25"/>
  <rect x="0" y="18" width="150" height="100" rx="8" fill="${c}"/><rect x="0" y="104" width="150" height="14" rx="6" fill="#000" opacity=".16"/><rect x="0" y="18" width="150" height="8" rx="4" fill="#fff" opacity=".22"/>
  <text x="75" y="88" text-anchor="middle" font-family="Rubik, sans-serif" font-weight="800" font-size="66" fill="${ink}">${n}</text></svg>`;
const head = `<svg viewBox="0 0 100 100" style="width:calc(var(--u) * 84);height:calc(var(--u) * 84);flex:none"><rect x="34" y="2" width="32" height="14" rx="4" fill="#F2CD37"/><rect x="34" y="2" width="32" height="14" rx="4" fill="#000" opacity=".1"/><rect x="12" y="12" width="76" height="80" rx="24" fill="#F2CD37"/><circle cx="37" cy="44" r="6" fill="#1f2124"/><circle cx="63" cy="44" r="6" fill="#1f2124"/><path d="M33 62 Q50 76 67 62" stroke="#1f2124" stroke-width="6" fill="none" stroke-linecap="round"/></svg>`;
const ICON = {
  photo: `<svg viewBox="0 0 100 100" style="width:45%"><rect x="10" y="28" width="80" height="56" rx="10" fill="#fff"/><rect x="34" y="18" width="32" height="16" rx="4" fill="#fff"/><circle cx="50" cy="56" r="17" fill="#0055BF"/><circle cx="50" cy="56" r="9" fill="#fff" opacity=".5"/></svg>`,
  set: `<svg viewBox="0 0 100 100" style="width:45%"><path d="M50 12 L88 30 L88 72 L50 90 L12 72 L12 30 Z" fill="#fff"/><path d="M12 30 L50 48 L88 30 M50 48 L50 90" stroke="#FE8A18" stroke-width="5" fill="none"/><rect x="40" y="20" width="20" height="9" rx="3" fill="#FE8A18"/></svg>`,
  moc: `<svg viewBox="0 0 100 100" style="width:45%"><path d="M50 10 L61 37 L90 38 L67 56 L75 85 L50 68 L25 85 L33 56 L10 38 L39 37 Z" fill="#fff"/></svg>`,
};
const op = (o, extra = '') => `opacity:${clamp(o).toFixed(3)};${extra}`;
const U = VW / 1080, px = (v) => `${(v * U).toFixed(1)}px`;
const tf = (x = 0, y = 0, s = 1, r = 0) => `transform:translate(${px(x)},${px(y)}) scale(${s.toFixed(3)}) rotate(${r.toFixed(2)}deg)`;

/** the step header: the brick drops on the beat after the wall clears, the title pops in letter by letter */
function header(t) {
  let i = -1; for (let j = 0; j < STEPS.length; j++) if (t >= STEPS[j].t) i = j;
  if (i < 0) return ''; const s = STEPS[i]; if (s.n === 8 && t > s.t + 4.4) return '';
  const land = s.t + BEAT, dt = t - (land - 0.42);
  const drop = (1 - bounce(clamp(dt / 0.42))) * -360;
  let j = 0; const chars = s.title.split(' ').map((w) => `<span class="w">${[...w].map((ch) => { const k = back(seg(t, land - 0.05 + j * 0.03, land + 0.25 + j * 0.03)); j++; return `<span style="${op(k * 1.5, `transform:translateY(${px(30 * (1 - k))}) scale(${(0.6 + 0.4 * k).toFixed(3)})`)}">${ch}</span>`; }).join('')}</span>`).join(' ');
  const k2 = out(seg(t, land + 0.25, land + 0.6));
  const leave = s.n === 8 ? seg(t, s.t + 4.0, s.t + 4.4) : 0;
  return `<div class="hd" style="${op(1 - leave)}"><div style="transform:translateY(${px(drop)})">${brickSvg(s.c, s.n, s.ink)}</div>
    <div><div class="ti">${chars}</div><div class="su" style="${op(k2, `transform:translateX(${px(30 * (1 - k2))})`)}">${s.sub}</div></div></div>`;
}
function progress(t) {
  if (t < STEPS[0].t) return ''; const o = 1 - seg(t, STEPS[7].t + 4.0, STEPS[7].t + 4.4);
  return `<div class="bar" style="${op(o)}">${STEPS.map((s) => { const k = seg(t, s.t + BEAT - 0.1, s.t + BEAT + 0.25); const sc = 1 + 0.4 * Math.sin(Math.PI * k);
    return `<i style="background:${k > 0 ? s.c : '#d9dbd8'};transform:scale(${sc.toFixed(3)})"></i>`; }).join('')}</div>`;
}
/** the brick wall between steps: 2×4 bricks drop onto the screen just before the bar line and fall away just after it */
function wall(t) {
  const B = STEPS.find((s) => t > s.t - 0.5 && t < s.t + 0.75); if (!B) return '';
  const cols = 4, rows = 10; let h = '';
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const i = r * cols + c, x = c * 432 - (r % 2 ? 216 : 0), y = r * 216 - 60;
    const d1 = rnd(i) * 0.22, d2 = rnd(i + 97) * 0.25 + (rows - r) * 0.012;
    const kin = out(seg(t, B.t - 0.5 + d1, B.t - 0.5 + d1 + 0.15)), kout = seg(t, B.t + 0.12 + d2, B.t + 0.12 + d2 + 0.32);
    if (kin <= 0 || kout >= 1) continue;
    const pick = rnd(i + 31); const c0 = pick < 0.68 ? B.c : pick < 0.86 ? '#ffffff' : '#d9dbd8';
    const s = lerp(1.7, 1, kin) * lerp(1, 0.85, kout), fall = kout * kout * 900, rot = (rnd(i + 7) - 0.5) * 40 * kout;
    h += `<div class="wb" style="left:${px(x)};top:${px(y)};background-image:${WALL.get(c0)};opacity:${(kin * (1 - kout * kout)).toFixed(3)};${tf(0, fall, s, rot)};filter:drop-shadow(0 ${px(10)} ${px(14)} rgba(0,0,0,${(0.25 * (1 - kin) + 0.08).toFixed(3)}))"></div>`;
  }
  return h;
}

// ---- capture ------------------------------------------------------------------------------------------------------------------------
const browser = await chromium.launch({ args: ['--use-angle=metal', '--ignore-gpu-blocklist', '--enable-gpu'] });
const page = await browser.newPage({ viewport: { width: VW, height: VH }, deviceScaleFactor: 1 });
page.on('pageerror', (e) => console.log('[pageerror]', e.message));
page.on('console', (m) => { if (m.type() === 'error') console.log('[page]', m.text().slice(0, 300)); });
await page.goto(`http://127.0.0.1:${PORT}/index.html?film=1`, { waitUntil: 'domcontentloaded', timeout: 180000 });
await page.waitForFunction(() => window.__ready === true, null, { timeout: 180000 });
await page.evaluate(({ css, u }) => { const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s); const d = document.createElement('div'); d.id = 'fo'; d.style.setProperty('--u', u + 'px'); document.body.appendChild(d); document.querySelectorAll('.hud').forEach((h) => (h.style.visibility = 'hidden')); document.documentElement.classList.add('no-intro'); document.body.classList.remove('intro'); const c = document.getElementById('c'); c.style.transition = 'none'; c.classList.add('ready'); }, { css: CSS, u: VW / 1080 });
await page.evaluate(() => Promise.all(['/filmref/ref-paris.jpg', '/filmref/ref-eiffel.jpg'].map((s) => new Promise((r) => { const im = new Image(); im.onload = r; im.onerror = r; im.src = s; (window.__keep ??= []).push(im); }))));
await page.evaluate(() => document.fonts.ready);
const ev = (fn, a) => page.evaluate(fn, a);
await ev(() => window.__film.enter('paris'));
for (let i = 0; i < 400; i++) { await ev(() => window.__film.step(1 / 30)); if (i > 120 && (await ev(() => window.__film.state())).state === 'built') break; }
await ev(() => window.__film.hideUI(true));

// in-page helpers: per-brick poses and colours, the blockout boxes, the scan plane, projection for labels
await ev(({ BOXES, GROUND, TRAY_Y, TREE }) => {
  const A = window.__app, B = A.bricks, T = window.__film.three, items = B.items;
  const m = new T.Matrix4(), v = new T.Vector3(), s3 = new T.Vector3(), c = new T.Color();
  const col = items.map((it) => { it.mesh.getColorAt(it.index, c); return c.getHex(); });
  const put = (it, p, q, s) => { m.compose(p, q, s3.set(s, s, s)); it.mesh.setMatrixAt(it.index, m); if (it.decal) it.decal.mesh.setMatrixAt(it.decal.index, m); };
  const tint = (it, hex) => { c.setHex(hex); it.mesh.setColorAt(it.index, c); };
  // blockout boxes from each landmark's real bounds
  const bounds = (tags) => { const b = [1e9, 1e9, 1e9, -1e9, -1e9, -1e9]; for (const it of items) if (tags.includes(it.tag)) { const p = it.home.p, h = it.half; for (let i = 0; i < 3; i++) { b[i] = Math.min(b[i], p.getComponent(i) - h[i]); b[i + 3] = Math.max(b[i + 3], p.getComponent(i) + h[i]); } } return b; };
  const boxGroup = new T.Group(); A.scene.add(boxGroup); boxGroup.visible = false;
  const boxMat = new T.MeshStandardMaterial({ color: 0xa0a5a9, roughness: 0.55 });
  const boxes = BOXES.map(([name, tags]) => { const b = bounds(tags); const g = new T.Mesh(new T.BoxGeometry(1, 1, 1), boxMat); g.castShadow = g.receiveShadow = true;
    if (name === 'eiffel') { b[0] += 3; b[3] -= 3; b[2] += 3; b[5] -= 3; }   // a slimmer block for the tower
    boxGroup.add(g); return { name, b, g }; });
  // the parts tray: the tower's bricks sorted by mould, laid out in rows high above the island
  const tower = items.filter((it) => it.tag === 'eiffel'); const byKey = new Map(); for (const it of tower) (byKey.get(it.key) ?? byKey.set(it.key, []).get(it.key)).push(it);
  // laid as moulded (studs up), shelf-packed mould after mould, rows as deep as their deepest part
  const groups = [...byKey.values()].sort((a, b) => Math.max(...b.map((it) => it.half[0] * it.half[2])) - Math.max(...a.map((it) => it.half[0] * it.half[2])));
  const tray = new Map(); let z = 0, x = 0, row = 0; const W = 40, GAP = 0.7;
  for (const g of groups) for (const it of g) { const w = 2 * it.half[0] + GAP, d = 2 * it.half[2] + GAP; if (x + w > W && x > 0) { x = 0; z += row; row = 0; } tray.set(it, [x + w / 2, z + d / 2, it.half[1]]); x += w; row = Math.max(row, d); }
  const trayZ = z + row; for (const [it, p] of tray) tray.set(it, new T.Vector3(p[0] - W / 2, TRAY_Y + p[2], p[1] - trayZ / 2));
  const flat = new T.Quaternion(), q = new T.Quaternion();
  // the scan plane
  const scan = new T.Mesh(new T.PlaneGeometry(1, 1), new T.MeshBasicMaterial({ color: 0x3ddc84, transparent: true, opacity: 0.28, side: T.DoubleSide, depthWrite: false }));
  scan.rotation.y = Math.PI / 2; scan.scale.set(70, 50, 1); scan.visible = false; A.scene.add(scan);
  const treeSet = new Set(items.filter((it) => it.tag === 'platane' && Math.hypot(it.home.p.x - TREE[0], it.home.p.z - TREE[1]) < 7));
  const hiddenQ = new T.Quaternion();
  window.H = {
    types: groups.length, tower: tower.length, trayW: W, trayZ, total: items.length,
    dirty() { A.renderer.shadowMap.autoUpdate = true; for (const mm of B.meshes) { mm.instanceMatrix.needsUpdate = true; if (mm.instanceColor) mm.instanceColor.needsUpdate = true; } },
    home() { items.forEach((it, i) => { put(it, it.home.p, it.home.q, 1); tint(it, col[i]); }); },
    /** show(pred(it) → 0..1 scale) */
    show(f) { for (const it of items) { const s = f(it); put(it, it.home.p, it.home.q, s); } },
    sil(on) { B.silhouette(on); },
    globe(on) { A.globe.group.visible = on; },
    blockout(on, k) {   // k: per box [rise 0..1, height factor]
      boxGroup.visible = on; if (!on) return;
      boxes.forEach((bx, i) => { const [r, hf] = k[i]; const b = bx.b, h = (b[4] - b[1]) * hf * Math.max(0.001, r);
        bx.g.scale.set(b[3] - b[0], h, b[5] - b[2]); bx.g.position.set((b[0] + b[3]) / 2, b[1] + h / 2, (b[2] + b[5]) / 2); bx.g.visible = r > 0; });
    },
    boxTop(i, hf) { const b = boxes[i].b; return [(b[0] + b[3]) / 2, b[1] + (b[4] - b[1]) * hf, (b[2] + b[5]) / 2]; },
    /** the build: kTray (0..1 parts appearing on the tray), tower flight progress per brick by layer, the rest raining in */
    build({ trayK, towerK, groundK, restK }) {
      const towerSorted = window.H._ts ??= tower.slice().sort((a, b) => a.home.p.y - b.home.p.y || a.home.p.x - b.home.p.x);
      const rest = window.H._rs ??= items.filter((it) => it.tag !== 'eiffel' && !GROUND.includes(it.tag)).sort((a, b) => a.home.p.y - b.home.p.y || a.home.p.x - b.home.p.x);
      const ground = window.H._gs ??= items.filter((it) => GROUND.includes(it.tag)).sort((a, b) => a.home.p.y - b.home.p.y || a.home.p.x - b.home.p.x);
      const rain = (list, K, drop, span) => list.forEach((it, i) => { const st = (i / list.length) * (1 - span); const k = Math.min(1, Math.max(0, (K - st) / span));
        if (k <= 0) { put(it, it.home.p, hiddenQ, 0); return; } const e = 1 - (1 - k) ** 3; v.copy(it.home.p); v.y += drop * (1 - e); put(it, v, it.home.q, 1); });
      rain(ground, groundK, 14, 0.18);
      towerSorted.forEach((it, i) => { const tp = tray.get(it); const ap = (i / towerSorted.length) * 0.82; const k = Math.min(1, Math.max(0, (towerK - ap) / 0.18));
        // on the tray: popped in group by group
        const gi = groups.findIndex((g) => g.includes(it)); const pk = Math.min(1, Math.max(0, (trayK * (groups.length + 2) - gi) / 2));
        if (k <= 0) { put(it, tp, flat, pk <= 0 ? 0 : Math.min(1, pk * 1.6)); return; }
        const e = k * k * (3 - 2 * k); v.lerpVectors(tp, it.home.p, e); v.y += Math.sin(Math.PI * e) * 6; q.slerpQuaternions(flat, it.home.q, Math.min(1, e * 1.4)); put(it, v, q, 1); });
      rain(rest, restK, 18, 0.12);
    },
    check({ scanX, liftK, red }) {   // the scan plane's x (null: hidden); the tree lifted by liftK studs, tinted red or green
      scan.visible = scanX !== null; if (scanX !== null) scan.position.set(scanX, 14, 0);
      items.forEach((it, i) => { if (!treeSet.has(it)) return; v.copy(it.home.p); v.y += liftK; put(it, v, it.home.q, 1); tint(it, red === 1 ? 0xd9342b : red === 2 ? 0x3ddc84 : col[i]); });
    },
    cam(p, l, fov) { const c2 = A.camera; if (!c2.view) c2.setViewOffset(innerWidth, innerHeight, 0, -0.09 * innerHeight, innerWidth, innerHeight);   // the subject sits a little low, clear of the header
      c2.position.set(...p); c2.lookAt(...l); if (c2.fov !== fov) { c2.fov = fov; c2.updateProjectionMatrix(); } c2.updateMatrixWorld(); },
    proj(p) { v.set(...p).project(A.camera); return [(v.x + 1) / 2 * innerWidth, (1 - v.y) / 2 * innerHeight, v.z]; },
  };
}, { BOXES, GROUND: [...GROUND], TRAY_Y, TREE });
const info = await ev(() => ({ trayW: window.H.trayW, trayZ: window.H.trayZ, types: window.H.types, tower: window.H.tower, total: window.H.total, stats: document.getElementById('place-stats').textContent }));
console.log(info);

// ---- the film: one function of time ---------------------------------------------------------------------------------------------------
const S = STEPS.map((s) => s.t);
const HERO = [[0, 14, 0], -0.7, 0.34, 235], HERO2 = [[0, 12, 0], -0.36, 0.3, 212];
const BLK = [[0, 10, 0], -0.55, 0.55, 245], BLK2 = [[0, 10, 0], -0.36, 0.5, 232];
const REV = [[-18, 24, -8], -0.36, 0.3, 195], REV2 = [[-18, 26, -8], -0.26, 0.28, 200];
const TD = Math.max(info.trayZ / 0.4, info.trayW / 0.33);
const TRAY = [[0, TRAY_Y, 0], 0.0, 1.36, TD * 1.08], TRAY2 = [[0, TRAY_Y, 0], 0.1, 1.3, TD];
const TWR = [[-28, 26, -12], -0.42, 0.3, 150], TWR2 = [[-28, 28, -12], -0.18, 0.26, 150], ISL = [[0, 14, 0], -0.15, 0.36, 240];
const SCN = [[0, 12, 0], -0.75, 0.55, 235], TRE = [[14, 17, 18], 0.55, 0.22, 72], TRE2 = [[14, 17, 18], 0.75, 0.2, 68], SCN2 = [[0, 12, 0], -0.3, 0.42, 240];
const FIN = [[0, 14, 0], 0.1, 0.3, 225], FIN1 = [[0, 14, 0], 0.3, 0.32, 215], FIN2 = [[0, 6, 0], 0.6, 0.36, 360];
const SFX = [];   // [time, 'click' | 'wipe', gain]: written for the mix
for (const s of STEPS) { SFX.push([s.t - 0.5, 'wipe', 0.7], [s.t + BEAT, 'click', 0.9]); }

function frameAt(t) {
  const st = { cam: null, mode: null, html: '', labels: null };
  const ov = (h) => { st.html += h; };
  if (t < S[0]) {   // hook
    st.mode = { kind: 'full', globe: true }; st.cam = orbLerp(HERO, HERO2, io(seg(t, 0, S[0])));
    const line = (txt, y, a, size, extra = '') => { const red = txt.indexOf('LEGO'); return `<div class="big" style="top:${px(y)}"><div style="font-size:${px(size)};font-weight:600;letter-spacing:-.01em;${extra}">${[...txt].map((ch, j) => { const k = back(seg(t, a + j * 0.04, a + 0.3 + j * 0.04)); return `<span style="display:inline-block;${op(k * 1.5, `transform:translateY(${px(40 * (1 - k))}) scale(${(0.5 + 0.5 * k).toFixed(3)})`)}${red >= 0 && j >= red && j < red + 4 ? ';color:#C91A09' : ''}">${ch === ' ' ? '&nbsp;' : ch}</span>`; }).join('')}</div></div>`; };
    ov(line('How does a city', 200, 0.25, 96) + line('become LEGO?', 320, 0.75, 96) + `<div class="big" style="top:${px(470)};${op(seg(t, 1.6, 2.0))}"><span class="chip">Paris, in 8 steps</span></div>`);
  } else if (t < S[1]) {   // 1 references: four cards dealt onto a baseplate, the AI concept image brought forward
    st.mode = { kind: 'hide' }; ov(`<div class="bp"></div>`);
    const cards = [['photo', 'Real photos', '#0055BF'], ['set', 'Official sets', '#FE8A18'], ['moc', 'Fan builds', '#237841'], ['ai', 'AI concept', '#8320B7']];
    const focus = out5(seg(t, S[0] + 4.6, S[0] + 5.3));
    cards.forEach(([ic, lb, c], i) => {
      const a = S[0] + 1.0 + i * 0.32, k = back(seg(t, a, a + 0.4)); if (k <= 0) return;
      const gx = 110 + (i % 2) * 450, gy = 560 + Math.floor(i / 2) * 520, r0 = (i % 2 ? 4 : -4) + (i > 1 ? -1.5 : 1.5);
      let x = gx, y = gy, w = 400, s = 1, r = r0 * k + (1 - k) * (i % 2 ? 30 : -30), o = 1;
      if (ic === 'ai') { x = lerp(gx, 90, focus); y = lerp(gy, 560, focus); w = lerp(400, 900, focus); r = lerp(r, -1.5, focus); }
      else o = 1 - 0.75 * focus;
      const ih = w * (ic === 'ai' ? 0.667 : 0.72);
      const inner = ic === 'ai' ? `<img src="/filmref/ref-paris.jpg" style="width:100%;height:100%;object-fit:cover">` : ICON[ic];
      ov(`<div class="pc" style="left:${px(x)};top:${px(y - 300 * (1 - k))};width:${px(w)};${op(Math.min(1, k * 1.6) * o, `transform:rotate(${r.toFixed(2)}deg) scale(${(0.7 + 0.3 * k).toFixed(3)})`)}">
        <div class="pin">${brickSvg(c, '', '#fff', 70)}</div><div class="im" style="height:${px(ih)};background:${c}">${inner}</div><div class="lb">${lb}</div></div>`);
    });
    ov(`<div class="big" style="top:${px(1300)};${op(seg(t, S[0] + 5.5, S[0] + 5.9))}"><span class="chip">The AI concept is a guide, not part of the build</span></div>`);
  } else if (t < S[2]) {   // 2 pick the places: candidates stack up as bricks, the ones that won't read at this size fall off
    st.mode = { kind: 'hide' }; ov(`<div class="bp"></div>`);
    const C = [['Eiffel Tower', 1, '#582A12'], ['Arc de Triomphe', 0, '#A0A5A9'], ['Notre-Dame', 1, '#C8A96E'], ['Seine · Bookstalls', 1, '#184632'], ['Louvre Pyramid', 0, '#A0A5A9'], ['Stone bridge', 1, '#C8A96E'], ['Sacré-Cœur', 0, '#A0A5A9'], ['Haussmann blocks · Café', 1, '#5b6064']];
    let kept = 0; const T0 = S[1] + 0.9, CUT = S[1] + 4.0, CLOSE = S[1] + 5.2;
    C.forEach(([name, keep, c], i) => {
      const a = T0 + i * 0.2, k = seg(t, a, a + 0.4); if (k <= 0) return;
      const y0 = 470 + i * 140, y1 = 540 + kept * 170; if (keep) kept++;
      let y = y0 - (1 - bounce(k)) * 500, x = 110, r = 0, o = 1;
      if (!keep) { const f = seg(t, CUT + 0.4 + i * 0.05, CUT + 1.3 + i * 0.05); y += 1400 * f * f; x += 260 * f; r = 50 * f; o = 1 - f; }
      else y = lerp(y, y1, io(seg(t, CLOSE, CLOSE + 0.5)));
      const cross = !keep && t > CUT ? `<span style="color:#C91A09;font-size:${px(50)};margin-left:${px(20)}">✗</span>` : '';
      const tick = keep && t > CLOSE + 0.4 ? `<span style="color:#fff;font-size:${px(46)};margin-left:${px(20)};${op(seg(t, CLOSE + 0.4 + kept * 0.06, CLOSE + 0.6 + kept * 0.06))}">✓</span>` : '';
      ov(`<div class="lbrick" style="left:${px(x)};top:${px(y)};${op(o, tf(0, 0, 1, r))}"><div class="st">${'<i style="background:' + c + '"></i>'.repeat(Math.max(3, Math.round(name.length * 0.5)))}</div><div class="bd" style="background:${c};color:#fff">${name}${cross}${tick}</div></div>`);
    });
    ov(`<div class="big" style="top:${px(1480)};${op(seg(t, CLOSE + 0.6, CLOSE + 1.0))}"><span class="chip">Only 5 fit on the island, so each must stand out</span></div>`);
  } else if (t < S[3]) {   // 3 colours and heights
    st.mode = { kind: 'hide' }; ov(`<div class="bp"></div>`);
    const pal = [['#C8A96E', 'Limestone'], ['#6C6E68', 'Zinc roofs'], ['#184632', 'Kiosk green'], ['#352100', 'Tower brown'], ['#6074A1', 'The Seine']];
    ov(`<div style="position:absolute;left:${px(70)};right:${px(70)};top:${px(470)};display:flex;justify-content:space-between">${pal.map(([c, n], i) => { const a = S[2] + 1.0 + i * 0.22; const k = seg(t, a, a + 0.42); const d = (1 - bounce(k)) * -260;
      return `<div style="width:${px(170)};text-align:center;font-size:${px(30)};font-weight:600;color:#3b3f43;${op(k > 0 ? 1 : 0)}"><div class="stud" style="margin:0 auto ${px(16)};background:${c};transform:translateY(${px(d)})"></div>${n}</div>`; }).join('')}</div>`);
    const H = [['Tower', 116, '#352100'], ['Notre-Dame', 84, '#C8A96E'], ['Haussmann', 69, '#E4CD9E'], ['Plane tree', 48, '#4B9F4A'], ['Minifig', 12, '#F2CD37']];
    ov(`<div style="position:absolute;left:${px(70)};right:${px(70)};top:${px(1630)};height:${px(6)};background:#c9c8c2;border-radius:${px(3)}"></div>`);
    H.forEach(([n, h, c], i) => { const a = S[2] + 3.0 + i * 0.3, k = out(seg(t, a, a + 0.9)); if (k <= 0) return; const hp = h * 6.4 * k, x = 92 + i * 186;
      ov(`<div class="col" style="left:${px(x)};height:${px(hp)};background:${c} repeating-linear-gradient(0deg, rgba(0,0,0,.10) 0 ${px(2)}, transparent ${px(2)} ${px(19)});top:auto;bottom:${px(1920 - 1630)}"></div>
        <div style="position:absolute;left:${px(x - 30)};width:${px(188)};text-align:center;top:${px(1630 - hp - 64)};font:700 ${px(40)}/1 Rubik, sans-serif;color:#1f2124">${Math.round(h * k)}</div>
        <div style="position:absolute;left:${px(x - 30)};width:${px(188)};text-align:center;top:${px(1652)};font-size:${px(28)};white-space:nowrap;font-weight:600;color:#3b3f43">${n}</div>`); });
    ov(`<div class="big" style="top:${px(1730)};${op(seg(t, S[2] + 5.0, S[2] + 5.4))}"><span style="font-size:${px(30)};color:#7a7e82">Heights in plates (1 plate = 3.2 mm)</span></div>`);
  } else if (t < S[4]) {   // 4 blockout beside the reference; a human check
    const grow = back(seg(t, S[3] + 5.6, S[3] + 6.3));
    st.mode = { kind: 'blockout', rise: BOXES.map((_, i) => back(seg(t, S[3] + 0.9 + i * 0.45, S[3] + 1.4 + i * 0.45))), tower: lerp(0.62, 1, grow) };
    st.cam = t < S[3] + 3.4 ? orbLerp(BLK, BLK2, io(seg(t, S[3], S[3] + 3.4))) : t < S[3] + 4.6 ? orbLerp(BLK2, REV, io(seg(t, S[3] + 3.4, S[3] + 4.6))) : orbLerp(REV, REV2, io(seg(t, S[3] + 4.6, S[4])));
    const kr = back(seg(t, S[3] + 0.7, S[3] + 1.2)) * (1 - seg(t, S[3] + 3.3, S[3] + 3.7));
    if (kr > 0) ov(`<div class="pc" style="left:${px(600)};top:${px(1380)};width:${px(400)};${op(kr * 1.5, `transform:rotate(3deg) scale(${kr.toFixed(3)})`)}"><div class="pin">${brickSvg('#237841', '', '#fff', 60)}</div><div class="im" style="height:${px(260)}"><img src="/filmref/ref-paris.jpg" style="width:100%;height:100%;object-fit:cover"></div><div class="lb" style="font-size:${px(28)}">Reference</div></div>`);
    st.labels = { kind: 'review', t: t - S[3], hf: lerp(0.62, 1, grow), boxesT: t };
  } else if (t < S[5]) {   // 5 the tower's real parts on a tray
    st.mode = { kind: 'build', trayK: seg(t, S[4] + 0.6, S[4] + 3.4), towerK: 0, groundK: 0, restK: 0 };
    st.cam = orbLerp(TRAY, TRAY2, io(seg(t, S[4], S[5] + 1)));
    const n = Math.round(info.tower * out(seg(t, S[4] + 0.6, S[4] + 3.4)));
    ov(`<div class="big" style="top:${px(1640)};${op(seg(t, S[4] + 0.6, S[4] + 1.0))}"><div style="font:700 ${px(120)}/1 Rubik, sans-serif;color:#36AEBF">${n}<span style="font-size:${px(48)};color:#3b3f43;font-weight:600"> bricks</span></div>
      <div style="margin-top:${px(20)};${op(seg(t, S[4] + 3.4, S[4] + 3.8))}"><span class="chip">The tower alone: ${info.types} part types, all official</span></div></div>`);
  } else if (t < S[6]) {   // 6 build, compare with the reference, rebuild
    const groundK = seg(t, S[5] + 0.9, S[5] + 2.6), towerK = seg(t, S[5] + 2.2, S[5] + 7.0), restK = seg(t, S[5] + 6.8, S[5] + 8.6);
    st.mode = { kind: 'build', trayK: 1, towerK, groundK, restK };
    st.cam = t < S[5] + 2.2 ? orbLerp(TRAY2, TWR, io(seg(t, S[5], S[5] + 2.2))) : orbLerp(TWR, TWR2, io(seg(t, S[5] + 2.2, S[6])));
    const kc = back(seg(t, S[5] + 8.4, S[5] + 8.9)), kv = seg(t, S[5] + 9.2, S[5] + 10.8), ver = Math.max(1, Math.round(1 + 25 * out(kv)));
    if (kc > 0) ov(`<div class="fcard" style="left:${px(60)};right:${px(60)};top:${px(1330)};padding:${px(22)};${op(kc * 1.5, `transform:scale(${kc.toFixed(3)});transform-origin:center bottom`)}">
      <div style="width:${px(380)};height:${px(250)};border-radius:${px(16)};overflow:hidden;flex:none;position:relative"><img src="/filmref/ref-eiffel.jpg" style="width:100%;height:100%;object-fit:cover"><span class="chip" style="position:absolute;left:${px(12)};top:${px(12)};font-size:${px(26)};padding:${px(6)} ${px(16)}">Reference</span></div>
      <div style="${op(seg(t, S[5] + 8.8, S[5] + 9.2))}"><div style="font-size:${px(32)};color:#3b3f43">Compare → swap parts → rebuild</div><div style="font:800 ${px(120)}/1.05 Rubik, sans-serif;color:#0055BF;margin-top:${px(6)}">v${ver}</div><div style="font-size:${px(30)};color:#5b6064;font-weight:400;${op(seg(t, S[5] + 10.6, S[5] + 11.0))}">The tower took 26 versions</div></div></div>`);
  } else if (t < S[7]) {   // 7 checks and the AI judge
    const sx = seg(t, S[6] + 0.7, S[6] + 3.0), lift = 1 - out(seg(t, S[6] + 5.4, S[6] + 5.8));
    const red = t < S[6] + 3.6 ? 0 : t < S[6] + 5.8 ? 1 : t < S[6] + 7.2 ? 2 : 0;
    st.mode = { kind: 'check', scanX: sx > 0 && sx < 1 ? lerp(-46, 46, sx) : null, liftK: t < S[6] + 3.4 ? 0 : 1.6 * out(seg(t, S[6] + 3.4, S[6] + 3.8)) * lift, red };
    st.cam = t < S[6] + 3.1 ? orbLerp(ISL, SCN, io(seg(t, S[6], S[6] + 3.1))) : t < S[6] + 4.2 ? orbLerp(SCN, TRE, io(seg(t, S[6] + 3.1, S[6] + 4.2))) : t < S[6] + 6.4 ? orbLerp(TRE, TRE2, io(seg(t, S[6] + 4.2, S[6] + 6.4))) : orbLerp(TRE2, SCN2, io(seg(t, S[6] + 6.4, S[7] + 0.3)));
    const n = Math.round(info.total * out(sx));
    ov(`<div class="big" style="top:${px(1620)};${op(Math.min(seg(t, S[6] + 0.7, S[6] + 1.0), 1 - seg(t, S[6] + 3.1, S[6] + 3.4)))}"><div style="font:700 ${px(96)}/1 Rubik, sans-serif;color:#8320B7">${n.toLocaleString('en-US')}<span style="font-size:${px(42)};color:#3b3f43;font-weight:600"> bricks, each one checked</span></div></div>`);
    if (t > S[6] + 3.8 && t < S[6] + 6.6) { const bad = t < S[6] + 5.8, k = back(seg(t, bad ? S[6] + 3.8 : S[6] + 5.8, bad ? S[6] + 4.3 : S[6] + 6.3)) * (1 - seg(t, S[6] + 6.3, S[6] + 6.6));
      ov(`<div class="fcard" style="left:${px(90)};top:${px(1440)};transform:scale(${k.toFixed(3)});transform-origin:left center;color:${bad ? '#C91A09' : '#237841'}">${bad ? '✗ This tree floats off the studs' : '✓ Back on the studs, locked in'}</div>`); }
    const kj = back(seg(t, S[6] + 6.8, S[6] + 7.3));
    if (kj > 0) ov(`<div class="fcard" style="left:${px(90)};right:${px(90)};top:${px(1280)};display:block;white-space:normal;transform:scale(${kj.toFixed(3)});transform-origin:center bottom">
      <div style="display:flex;align-items:center;gap:${px(18)}">${brickSvg('#8320B7', 'AI', '#fff', 90)}<div><div style="font-size:${px(44)}">AI judge</div><div style="font-size:${px(30)};color:#5b6064;font-weight:400;margin-top:${px(6)}">If it falls short, it goes back for another round</div></div></div>
      <div style="display:flex;flex-wrap:wrap;gap:${px(16)};margin-top:${px(26)}">${['Likeness', 'Looks', 'Buildable', 'Detail'].map((x, i) => { const kk = back(seg(t, S[6] + 7.5 + i * 0.25, S[6] + 7.8 + i * 0.25)); return `<span class="chip" style="background:#f3eaf8;box-shadow:none;font-size:${px(30)};padding:${px(10)} ${px(20)};${op(kk * 1.5, `transform:scale(${kk.toFixed(3)})`)}"><span style="color:#237841">✓</span>${x}</span>`; }).join('')}</div></div>`);
  } else {   // 8 a last human look, done, on the globe
    st.mode = { kind: 'full', globe: true };
    st.cam = t < S[7] + 4.4 ? orbLerp(FIN, FIN1, io(seg(t, S[7], S[7] + 4.4))) : orbLerp(FIN1, FIN2, io(seg(t, S[7] + 4.4, END)));
    const kc = back(seg(t, S[7] + 1.0, S[7] + 1.5)), ks = back(seg(t, S[7] + 2.4, S[7] + 2.9)), ko4 = 1 - seg(t, S[7] + 4.0, S[7] + 4.4);
    if (kc > 0 && ko4 > 0) ov(`<div class="fcard" style="left:${px(90)};top:${px(1480)};${op(ko4, `transform:scale(${kc.toFixed(3)});transform-origin:left center`)}">${head}<div>OK, this is it</div></div>`);
    if (ks > 0 && ko4 > 0) ov(`<div class="stamp" style="left:${px(560)};top:${px(1460)};${op(Math.min(ks * 2, ko4), `transform:rotate(-10deg) scale(${(2 - ks).toFixed(3)})`)}">OK ✓</div>`);
    const k1 = back(seg(t, S[7] + 4.5, S[7] + 5.0)), k2 = out(seg(t, S[7] + 5.1, S[7] + 5.6)), kr = S[7] + 5.8, ko = 1 - seg(t, END - 0.6, END);
    if (t > S[7] + 4.3) ov(`<div class="big" style="top:${px(190)};${op(Math.min(k1 * 1.5, ko))}"><div style="display:inline-block;transform:translateY(${px((1 - bounce(seg(t, S[7] + 4.2, S[7] + 4.7))) * -360)})">${brickSvg('#C91A09', '✓')}</div>
      <div style="font-size:${px(100)};font-weight:600;margin-top:${px(16)};transform:scale(${(0.6 + 0.4 * k1).toFixed(3)})">Done!</div></div>
      <div class="big" style="top:${px(500)};${op(Math.min(k2, ko))}"><div style="font-size:${px(40)};color:#3b3f43;letter-spacing:.02em">LEGO Paris · <b>${info.total.toLocaleString('en-US')}</b> bricks</div></div>
      <div style="position:absolute;left:${px(14)};right:${px(14)};top:${px(620)};display:flex;justify-content:space-between;${op(ko)}">${STEPS.map((s, i) => { const kk = seg(t, kr + i * 0.16, kr + 0.42 + i * 0.16); const d = (1 - bounce(kk)) * -160;
        return `<div style="width:${px(130)};text-align:center;font-size:${px(22)};font-weight:600;color:#3b3f43;${op(kk > 0 ? 1 : 0)}"><div class="stud" style="width:${px(64)};height:${px(64)};margin:0 auto ${px(12)};background:${s.c};transform:translateY(${px(d)})"></div>${s.short}</div>`; }).join('')}</div>`);
  }
  st.html = (st.mode.kind === 'hide' ? st.html : st.html) + header(t) + progress(t) + wall(t);
  return st;
}
for (let i = 0; i < 8; i++) { SFX.push([S[1] + 0.9 + i * 0.2 + 0.25, 'click', 0.35]); }
for (let i = 0; i < 5; i++) SFX.push([S[2] + 1.0 + i * 0.22 + 0.2, 'click', 0.4]);
for (let i = 0; i < 5; i++) SFX.push([S[3] + 1.25 + i * 0.45, 'click', 0.4]);
SFX.push([S[3] + 6.1, 'click', 0.8], [S[7] + 2.75, 'click', 0.9], [S[6] + 5.8, 'click', 0.9]);
for (let i = 0; i < 241; i += 5) SFX.push([S[5] + 2.2 + (i / 241 * 0.82 + 0.18) * 4.8, 'click', 0.16 + 0.1 * rnd(i)]);
for (let i = 0; i < 12; i++) SFX.push([S[5] + 7.0 + i * 0.14, 'click', 0.14]);
for (let i = 0; i < 26; i += 2) SFX.push([S[5] + 9.2 + 1.6 * (1 - Math.pow(1 - i / 25, 1 / 3)), 'click', 0.22]);
fs.writeFileSync(path.join(path.dirname(new URL(import.meta.url).pathname), 'howto-en-cues.json'), JSON.stringify({ steps: S, end: END, beat: BEAT, sfx: SFX, join: JOIN }));

/** labels that follow 3-D points */
async function labels(L) {
  if (!L || L.kind !== 'review') return '';
  const t = L.t; let h = '';
  const pts = await ev((hf) => [0, 1, 2, 3, 4].map((i) => window.H.proj(window.H.boxTop(i, i === 0 ? hf : 1))), L.hf);
  const ko = 1 - seg(t, 3.2, 3.5);
  if (ko > 0) h += pts.map((p, i) => { const a = 1.1 + i * 0.45; const k = back(seg(t, a, a + 0.35)); if (k <= 0) return '';
    return `<div class="tag" style="left:${p[0]}px;top:${p[1]}px;${op(Math.min(k * 2, ko), `transform:translate(-50%,-115%) scale(${k.toFixed(3)})`)}"><b style="background:${STEPS[3].c}"></b>${BOXES[i][2]}</div>`; }).join('');
  const p = pts[0];
  const kc = back(seg(t, 4.6, 5.1)), kx = 1 - seg(t, 5.6, 5.9), ks = back(seg(t, 6.6, 7.1)), kf = seg(t, 7.4, 7.8);
  if (kc > 0 && kx > 0) h += `<div style="position:absolute;left:${p[0]}px;top:${p[1] + 60 * U}px;width:${300 * U}px;height:${240 * U}px;border-radius:50%;border:${7 * U}px dashed #C91A09;${op(kx, `transform:translate(-50%,-50%) scale(${kc.toFixed(3)})`)}"></div>`;
  if (kc > 0) h += `<div class="fcard" style="left:${px(90)};top:${px(1430)};${op(kc * 2, `transform:scale(${kc.toFixed(3)});transform-origin:left center`)}">${head}<div>${kx > 0.5 ? "The tower's too short. The scale is off" : 'Fixed. One more look'}</div></div>`;
  if (ks > 0) h += `<div class="stamp" style="left:${p[0] - 170 * U}px;top:${p[1] - 250 * U}px;${op(ks * 2, `transform:rotate(-12deg) scale(${(2 - ks).toFixed(3)})`)}">OK ✓</div>`;
  if (kf > 0) h += `<div class="big" style="top:${px(1640)};${op(kf)}"><span class="chip">Nothing moves on until a person signs off</span></div>`;
  return h;
}

// ---- render loop --------------------------------------------------------------------------------------------------------------------
fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
const from = arg('--from', 0), to = arg('--to', END); const N = Math.round((to - from) * FPS);
let lastKind = '';
const t0 = Date.now();
for (let i = 0; i < N; i++) {
  const t = from + i / FPS; const f = frameAt(t); const M = f.mode; const cam = f.cam ?? orb([0, 14, 0], 0, 0.3, 240);
  await ev(({ M, cam, first }) => {
    const H = window.H;
    if (first) { H.home(); H.sil(false); H.blockout(false); H.check({ scanX: null, liftK: 0, red: 0 }); }
    H.globe(!!M.globe);
    if (M.kind === 'hide') H.show(() => 0);
    else if (M.kind === 'blockout') { H.show((it) => (['terrain', 'water', 'quay'].includes(it.tag) ? 1 : 0)); H.blockout(true, M.rise.map((r, i) => [r, i === 0 ? M.tower : 1])); }
    else if (M.kind === 'build') H.build(M);
    else if (M.kind === 'check') H.check(M);
    H.cam(cam.p, cam.l, cam.fov); H.dirty();
  }, { M, cam, first: M.kind !== lastKind });
  lastKind = M.kind;
  await ev((c) => window.__film.look(c.p, c.l, c.fov), cam);
  const html = f.html + (await labels(f.labels));
  await ev((h) => { document.getElementById('fo').innerHTML = h; }, html);
  await ev(() => window.__film.step(1 / 30));
  if (html.includes('<img')) await page.waitForFunction(() => [...document.images].every((im) => im.complete), null, { timeout: 30000 }).catch(() => {});
  await page.screenshot({ path: path.join(OUT, String(i).padStart(5, '0') + '.jpg'), type: 'jpeg', quality: 94 });
  if (i % 150 === 0) console.log(`${i}/${N} t=${t.toFixed(1)} ${((Date.now() - t0) / 1000).toFixed(0)}s`);
}
await browser.close();
fs.writeFileSync(path.join(OUT, 'meta.json'), JSON.stringify({ fps: FPS, from, to }));
console.log('done', N);
