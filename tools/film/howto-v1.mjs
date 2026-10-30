// "How a city becomes LEGO" (2026-10-13): a 9:16 explainer for social, the Paris set as the worked example, ≈ 89 s on a 105 BPM track.
// Seven steps, each opened by a numbered brick that drops onto the beat: research → blockout → human review → real parts → build → check → done.
//   node tools/film/howto-v1.mjs [--preview] [--from <s> --to <s>]; then node tools/film/howto-mix.mjs <frames dir>
import { chromium } from '../node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';

const argv = process.argv.slice(2);
const PREVIEW = argv.includes('--preview');
const arg = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? +argv[i + 1] : d; };
const [VW, VH] = PREVIEW ? [540, 960] : [1080, 1920];
const FPS = PREVIEW ? 10 : 30;
const OUT = process.env.FILM_OUT ?? path.resolve(PREVIEW ? 'tools/film/out-howto-preview' : 'tools/film/out-howto-v1');
const PORT = process.env.PORT ?? 8161;

// ---- timing: the track's beat grid (105 BPM, first beat at 0.377 s); every step starts on a bar line ----------------------------
const BAR = 4 * 60 / 105, bar = (n) => 0.377 + n * BAR;
const STEPS = [   // [start, title, sub, colour]
  { t: bar(3), n: 1, title: '研究真实的样子', sub: '轮廓 · 比例 · 颜色', c: '#C91A09' },
  { t: bar(8), n: 2, title: '先用方块摆布局', sub: '挑 5 个地标，定好位置和高度', c: '#FE8A18' },
  { t: bar(13), n: 3, title: '人来把关', sub: '不对就改，满意了才往下走', c: '#F2CD37', ink: '#3a2d00' },
  { t: bar(18), n: 4, title: '只用真零件', sub: '从上万种官方零件里，挑最像的', c: '#237841' },
  { t: bar(22), n: 5, title: '一块一块搭起来', sub: '从下往上，像真的在拼', c: '#0055BF' },
  { t: bar(28), n: 6, title: '检查每一块', sub: '必须真的扣住：不能悬空，不能穿模', c: '#36AEBF' },
  { t: bar(33), n: 7, title: '完成！', sub: '', c: '#8320B7' },
];
const END = 89.0;
fs.writeFileSync(path.join(path.dirname(new URL(import.meta.url).pathname), 'howto-v1-cues.json'), JSON.stringify({ steps: STEPS.map((s) => s.t), end: END }));

// ---- maths ------------------------------------------------------------------------------------------------------------------------
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, k) => a + (b - a) * k;
const L3 = (a, b, k) => a.map((v, i) => lerp(v, b[i], k));
const io = (k) => (k < 0.5 ? 4 * k ** 3 : 1 - (-2 * k + 2) ** 3 / 2);
const smooth = (k) => k * k * k * (k * (k * 6 - 15) + 10);
const out = (k) => 1 - (1 - k) ** 3;
const back = (k) => { const c = 1.7; return 1 + (c + 1) * (k - 1) ** 3 + c * (k - 1) ** 2; };   // overshoot, settles at 1
const bounce = (k) => { const n = 7.5625, d = 2.75; if (k < 1 / d) return n * k * k; if (k < 2 / d) return n * (k -= 1.5 / d) * k + 0.75; if (k < 2.5 / d) return n * (k -= 2.25 / d) * k + 0.9375; return n * (k -= 2.625 / d) * k + 0.984375; };
const seg = (t, a, b) => clamp((t - a) / (b - a));
/** orbit pose → camera {p, l, fov} (az 0 looks from +z, the front) */
const orb = (l, az, el, d, fov = 34) => ({ p: [l[0] + Math.sin(az) * Math.cos(el) * d, l[1] + Math.sin(el) * d, l[2] + Math.cos(az) * Math.cos(el) * d], l, fov });
const camLerp = (A, B, k) => ({ p: L3(A.p, B.p, k), l: L3(A.l, B.l, k), fov: lerp(A.fov, B.fov, k) });
/** an orbit move between two orbit poses [l, az, el, d] (true arcs, not chords) */
const orbLerp = (A, B, k) => orb(L3(A[0], B[0], k), lerp(A[1], B[1], k), lerp(A[2], B[2], k), Math.exp(lerp(Math.log(A[3]), Math.log(B[3]), k)), lerp(A[4] ?? 34, B[4] ?? 34, k));

// ---- the scene plan (world units: a stud is 1, a plate 0.4; the set's centre at the origin) --------------------------------------
const BOXES = [   // the blockout: [name, tag(s), label]
  ['eiffel', ['eiffel'], '埃菲尔铁塔'], ['notredame', ['notredame'], '巴黎圣母院'], ['haussmann', ['haussmann', 'cafe'], '奥斯曼建筑'],
  ['bridge', ['bridge'], '塞纳河上的桥'], ['bouquiniste', ['bouquiniste'], '河岸书摊'],
];
const GROUND = new Set(['terrain', 'water', 'quay']);
const TRAY_Y = 70;   // the parts tray floats high above the island
const TREE = [14, 19];   // the quay's plane tree: the "floating" fault in step 6

// ---- overlay ------------------------------------------------------------------------------------------------------------------------
const CSS = `
#fo { position: fixed; inset: 0; z-index: 10; pointer-events: none; font-family: "PingFang SC", Rubik, -apple-system, sans-serif; color: #1f2124; }
#fo * { box-sizing: border-box; }
#fo .bar { position: absolute; left: 0; right: 0; top: calc(var(--u) * 86); display: flex; justify-content: center; gap: calc(var(--u) * 26); }
#fo .bar i { width: calc(var(--u) * 46); height: calc(var(--u) * 46); border-radius: 50%; display: block; position: relative; box-shadow: inset 0 calc(var(--u) * -5) 0 rgba(0,0,0,.18); }
#fo .bar i::after { content: ''; position: absolute; inset: 22%; border-radius: 50%; box-shadow: inset 0 calc(var(--u) * 3) 0 rgba(255,255,255,.35), 0 calc(var(--u) * 2) calc(var(--u) * 2) rgba(0,0,0,.12); }
#fo .hd { position: absolute; left: calc(var(--u) * 76); right: calc(var(--u) * 60); top: calc(var(--u) * 196); display: flex; align-items: flex-end; gap: calc(var(--u) * 34); }
#fo .hd .tx { padding-bottom: calc(var(--u) * 4); }
#fo .hd .ti { font-size: calc(var(--u) * 76); font-weight: 600; letter-spacing: .02em; line-height: 1.1; }
#fo .hd .su { font-size: calc(var(--u) * 38); color: #5b6064; margin-top: calc(var(--u) * 16); letter-spacing: .04em; }
#fo .tag { position: absolute; transform: translate(-50%, -100%); white-space: nowrap; background: #fff; border-radius: calc(var(--u) * 40); padding: calc(var(--u) * 12) calc(var(--u) * 26) calc(var(--u) * 12) calc(var(--u) * 18); font-size: calc(var(--u) * 34); font-weight: 600; display: flex; align-items: center; gap: calc(var(--u) * 12); box-shadow: 0 calc(var(--u) * 6) calc(var(--u) * 18) rgba(0,0,0,.14); }
#fo .tag b { width: calc(var(--u) * 26); height: calc(var(--u) * 26); border-radius: 50%; display: block; box-shadow: inset 0 calc(var(--u) * -3) 0 rgba(0,0,0,.2); }
#fo .fcard { position: absolute; background: #fff; border-radius: calc(var(--u) * 34); padding: calc(var(--u) * 30) calc(var(--u) * 36); box-shadow: 0 calc(var(--u) * 10) calc(var(--u) * 30) rgba(0,0,0,.16); font-size: calc(var(--u) * 40); font-weight: 600; white-space: nowrap; display: flex; align-items: center; gap: calc(var(--u) * 24); }
#fo .stamp { position: absolute; border: calc(var(--u) * 9) solid #237841; color: #237841; border-radius: calc(var(--u) * 26); padding: calc(var(--u) * 6) calc(var(--u) * 34); font: 800 calc(var(--u) * 92)/1.15 Rubik, "PingFang SC", sans-serif; letter-spacing: .04em; transform-origin: center; }
#fo .big { position: absolute; left: 0; right: 0; text-align: center; }
#fo .pal { position: absolute; left: calc(var(--u) * 70); right: calc(var(--u) * 70); display: flex; justify-content: space-between; }
#fo .pal div { width: calc(var(--u) * 170); text-align: center; font-size: calc(var(--u) * 30); font-weight: 600; color: #3b3f43; }
#fo .stud { margin: 0 auto calc(var(--u) * 18); width: calc(var(--u) * 130); height: calc(var(--u) * 130); border-radius: 50%; position: relative; box-shadow: inset 0 calc(var(--u) * -10) 0 rgba(0,0,0,.2), 0 calc(var(--u) * 8) calc(var(--u) * 16) rgba(0,0,0,.18); }
#fo .stud::after { content: ''; position: absolute; inset: 24%; border-radius: 50%; box-shadow: inset 0 calc(var(--u) * 5) 0 rgba(255,255,255,.4), 0 calc(var(--u) * 4) calc(var(--u) * 4) rgba(0,0,0,.15); }
#fo .recap { position: absolute; left: calc(var(--u) * 40); right: calc(var(--u) * 40); display: flex; justify-content: space-between; }
#fo .recap div { width: calc(var(--u) * 132); text-align: center; font-size: calc(var(--u) * 27); font-weight: 600; color: #3b3f43; }
#fo .recap i { display: block; margin: 0 auto calc(var(--u) * 14); width: calc(var(--u) * 72); height: calc(var(--u) * 72); border-radius: 50%; position: relative; box-shadow: inset 0 calc(var(--u) * -6) 0 rgba(0,0,0,.2); }
#fo .recap i::after { content: ''; position: absolute; inset: 22%; border-radius: 50%; box-shadow: inset 0 calc(var(--u) * 3) 0 rgba(255,255,255,.4); }
#fo .ring { position: absolute; border-radius: 50%; transform: translate(-50%, -50%); }
`;
/** a 1×2 brick seen from the side, its number on the face */
const brickSvg = (c, n, ink = '#fff') => `<svg viewBox="0 0 150 118" style="width:calc(var(--u) * 150);height:calc(var(--u) * 118);display:block;overflow:visible">
  <rect x="25" y="2" width="34" height="20" rx="3" fill="${c}"/><rect x="25" y="2" width="34" height="20" rx="3" fill="#000" opacity=".12"/><rect x="91" y="2" width="34" height="20" rx="3" fill="${c}"/><rect x="91" y="2" width="34" height="20" rx="3" fill="#000" opacity=".12"/>
  <rect x="25" y="2" width="34" height="6" rx="3" fill="#fff" opacity=".25"/><rect x="91" y="2" width="34" height="6" rx="3" fill="#fff" opacity=".25"/>
  <rect x="0" y="18" width="150" height="100" rx="8" fill="${c}"/><rect x="0" y="104" width="150" height="14" rx="6" fill="#000" opacity=".16"/><rect x="0" y="18" width="150" height="8" rx="4" fill="#fff" opacity=".22"/>
  <text x="75" y="88" text-anchor="middle" font-family="Rubik, sans-serif" font-weight="800" font-size="66" fill="${ink}">${n}</text></svg>`;
const head = `<svg viewBox="0 0 100 100" style="width:calc(var(--u) * 84);height:calc(var(--u) * 84);flex:none"><rect x="34" y="2" width="32" height="14" rx="4" fill="#F2CD37"/><rect x="34" y="2" width="32" height="14" rx="4" fill="#000" opacity=".1"/><rect x="12" y="12" width="76" height="80" rx="24" fill="#F2CD37"/><circle cx="37" cy="44" r="6" fill="#1f2124"/><circle cx="63" cy="44" r="6" fill="#1f2124"/><path d="M33 62 Q50 76 67 62" stroke="#1f2124" stroke-width="6" fill="none" stroke-linecap="round"/></svg>`;
const op = (o, extra = '') => `opacity:${clamp(o).toFixed(3)};${extra}`;

/** the header for step s at time t: the brick drops on the beat, the words follow it in */
function header(t) {
  let i = -1; for (let j = 0; j < STEPS.length; j++) if (t >= STEPS[j].t - 0.45) i = j;
  if (i < 0 || STEPS[i].n === 7) return '';
  const s = STEPS[i], next = STEPS[i + 1], dt = t - (s.t - 0.45);
  const leave = next ? seg(t, next.t - 0.75, next.t - 0.45) : 0;
  const drop = (1 - bounce(clamp(dt / 0.6))) * -420;   // falls from above and bounces on the line
  const k1 = out(seg(dt, 0.5, 0.95)), k2 = out(seg(dt, 0.7, 1.15));
  return `<div class="hd" style="${op(1 - leave, `transform:translateY(calc(var(--u) * ${(-40 * leave).toFixed(1)}))`)}">
    <div style="transform:translateY(calc(var(--u) * ${drop.toFixed(1)}))">${brickSvg(s.c, s.n, s.ink)}</div>
    <div class="tx"><div class="ti" style="${op(k1, `transform:translateX(calc(var(--u) * ${(40 * (1 - k1)).toFixed(1)}))`)}">${s.title}</div>
    <div class="su" style="${op(k2, `transform:translateX(calc(var(--u) * ${(40 * (1 - k2)).toFixed(1)}))`)}">${s.sub}</div></div></div>`;
}
/** seven studs at the top, one lit per step reached */
function progress(t) {
  if (t < STEPS[0].t - 0.45 || t > STEPS[6].t + 0.6) return '';
  const o = seg(t, STEPS[0].t - 0.45, STEPS[0].t) * (1 - seg(t, STEPS[6].t, STEPS[6].t + 0.6));
  return `<div class="bar" style="${op(o)}">${STEPS.map((s) => { const k = seg(t, s.t - 0.1, s.t + 0.25); const sc = 1 + 0.35 * Math.sin(Math.PI * k);
    return `<i style="background:${k > 0 ? s.c : '#d9dbd8'};transform:scale(${sc.toFixed(3)})"></i>`; }).join('')}</div>`;
}

// ---- capture ------------------------------------------------------------------------------------------------------------------------
const browser = await chromium.launch({ args: ['--use-angle=metal', '--ignore-gpu-blocklist', '--enable-gpu'] });
const page = await browser.newPage({ viewport: { width: VW, height: VH }, deviceScaleFactor: 1 });
page.on('pageerror', (e) => console.log('[pageerror]', e.message));
page.on('console', (m) => { if (m.type() === 'error') console.log('[page]', m.text().slice(0, 300)); });
await page.goto(`http://127.0.0.1:${PORT}/index.html?film=1`, { waitUntil: 'domcontentloaded', timeout: 180000 });
await page.waitForFunction(() => window.__ready === true, null, { timeout: 180000 });
await page.evaluate(({ css, u }) => { const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s); const d = document.createElement('div'); d.id = 'fo'; d.style.setProperty('--u', u + 'px'); document.body.appendChild(d); document.querySelectorAll('.hud').forEach((h) => (h.style.visibility = 'hidden')); document.documentElement.classList.add('no-intro'); document.body.classList.remove('intro'); const c = document.getElementById('c'); c.style.transition = 'none'; c.classList.add('ready'); }, { css: CSS, u: VW / 1080 });
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
const F = 40;   // overviews: a 9:16 frame is narrow, a wider lens keeps the island whole without a far, flat camera
const HERO = [[0, 14, 0], -0.62, 0.34, 235, F], HERO2 = [[0, 12, 0], -0.36, 0.3, 215, F];
const SKY = [[0, 22, -6], 0.0, 0.06, 250, F], SKY2 = [[0, 22, -6], 0.08, 0.1, 235, F];
const BLK = [[0, 10, 0], -0.5, 0.55, 245, F], BLK2 = [[0, 10, 0], -0.32, 0.5, 230, F];
const REV = [[-18, 24, -8], -0.36, 0.3, 195, F], REV2 = [[-18, 26, -8], -0.26, 0.28, 200, F];
const TD = Math.max(info.trayZ / 0.4, info.trayW / 0.33);   // the whole tray inside the frame, below the header
const TRAY = [[0, TRAY_Y, 0], 0.0, 1.36, TD * 1.06, F], TRAY2 = [[0, TRAY_Y, 0], 0.1, 1.3, TD, F];
const TWR = [[-28, 26, -12], -0.42, 0.3, 150, F], TWR2 = [[-28, 30, -12], -0.22, 0.26, 165, F], ISL = [[0, 14, 0], -0.15, 0.36, 240, F];
const SCN = [[0, 12, 0], -0.75, 0.55, 235, F], TRE = [[14, 17, 18], 0.55, 0.22, 72, F], TRE2 = [[14, 17, 18], 0.75, 0.2, 68, F];
const FIN = [[0, 14, 0], 0.15, 0.32, 235, F], FIN2 = [[0, 6, 0], 0.55, 0.36, 360, F];

function frameAt(t) {
  const st = { cam: null, mode: null, html: header(t) + progress(t) };
  const ov = (h) => { st.html += h; };
  const U = VW / 1080;
  if (t < S[0]) {   // hook: the finished set turning, the question
    st.mode = { kind: 'full', globe: true }; st.cam = orbLerp(HERO, HERO2, io(seg(t, 0, S[0])));
    const k1 = out(seg(t, 0.4, 1.1)), k2 = out(seg(t, 1.0, 1.7)), k3 = out(seg(t, 1.8, 2.4)), ko = 1 - seg(t, S[0] - 0.8, S[0] - 0.4);
    ov(`<div class="big" style="top:calc(var(--u) * 210);${op(Math.min(k1, ko))}"><div style="font-size:calc(var(--u) * 92);font-weight:600;letter-spacing:.03em;transform:translateY(calc(var(--u) * ${(30 * (1 - k1)).toFixed(1)}))">一座城，</div></div>
      <div class="big" style="top:calc(var(--u) * 330);${op(Math.min(k2, ko))}"><div style="font-size:calc(var(--u) * 92);font-weight:600;letter-spacing:.03em;transform:translateY(calc(var(--u) * ${(30 * (1 - k2)).toFixed(1)}))">是怎么变成<span style="color:#C91A09">乐高</span>的？</div></div>
      <div class="big" style="top:calc(var(--u) * 480);${op(Math.min(k3, ko))}"><div style="font-size:calc(var(--u) * 40);color:#5b6064;letter-spacing:.12em">以巴黎为例 · 7 步看懂</div></div>`);
  } else if (t < S[1]) {   // 1 research: the skyline in silhouette, proportions marked, the palette pulled out
    const k = seg(t, S[0], S[1]);
    st.mode = { kind: 'sil' }; st.cam = orbLerp(SKY, SKY2, io(k));
    const pal = [['#E4CD9E', '石灰岩'], ['#A0A5A9', '锌皮屋顶'], ['#184632', '墨绿报亭'], ['#582A12', '铁塔深棕'], ['#5A93DB', '塞纳河']];
    ov(`<div class="pal" style="top:calc(var(--u) * 1480)">${pal.map(([c, n], i) => { const a = S[0] + 4.4 + i * 0.57; const kk = seg(t, a - 0.3, a + 0.25); const d = (1 - bounce(clamp(kk))) * -200;
      return `<div style="${op(seg(t, a - 0.3, a - 0.15))}"><div class="stud" style="background:${c};transform:translateY(calc(var(--u) * ${d.toFixed(1)}))"></div>${n}</div>`; }).join('')}</div>`);
  } else if (t < S[2]) {   // 2 blockout: grey blocks rise one by one, each named
    const k = seg(t, S[1], S[2]);
    st.mode = { kind: 'blockout', rise: BOXES.map((_, i) => back(seg(t, S[1] + 1.4 + i * 1.14, S[1] + 2.0 + i * 1.14))), tower: 0.62 };
    st.cam = orbLerp(BLK, BLK2, io(k)); st.labels = { kind: 'boxes', t, hf: 0.62 };
  } else if (t < S[3]) {   // 3 review: a note on the tower, the block grows, OK
    const k = seg(t, S[2], S[3]); const grow = back(seg(t, S[2] + 4.2, S[2] + 5.0));
    st.mode = { kind: 'blockout', rise: BOXES.map(() => 1), tower: lerp(0.62, 1, grow) };
    st.cam = orbLerp(BLK2, REV, io(seg(t, S[2], S[2] + 1.6))); if (t > S[2] + 1.6) st.cam = orbLerp(REV, REV2, io(seg(t, S[2] + 1.6, S[3])));
    st.labels = { kind: 'review', t: t - S[2], hf: lerp(0.62, 1, grow) };
  } else if (t < S[4]) {   // 4 parts: the tower's bricks on a tray, sorted by mould
    st.mode = { kind: 'build', trayK: seg(t, S[3] + 0.8, S[3] + 5.0), towerK: 0, groundK: 0, restK: 0 };
    st.cam = orbLerp(TRAY, TRAY2, io(seg(t, S[3], S[4] + 1)));
    const n = Math.round(info.tower * out(seg(t, S[3] + 0.8, S[3] + 5.0)));
    ov(`<div class="big" style="top:calc(var(--u) * 1640);${op(seg(t, S[3] + 0.8, S[3] + 1.2))}"><div style="font:700 calc(var(--u) * 120)/1 Rubik, sans-serif;color:#237841">${n}<span style="font-size:calc(var(--u) * 48);color:#3b3f43;font-family:'PingFang SC';font-weight:600"> 块</span></div>
      <div style="font-size:calc(var(--u) * 38);color:#5b6064;margin-top:calc(var(--u) * 18);${op(seg(t, S[3] + 4.6, S[3] + 5.2))}">这座铁塔用了 ${info.types} 种零件，每一种都真实存在</div></div>`);
  } else if (t < S[5]) {   // 5 build: the ground, then the tower layer by layer from the tray, then the rest of the island
    const groundK = seg(t, S[4] + 1.3, S[4] + 3.4), towerK = seg(t, S[4] + 3.0, S[4] + 9.2), restK = seg(t, S[4] + 9.0, S[5] - 0.5);
    st.mode = { kind: 'build', trayK: 1, towerK, groundK, restK };
    if (t < S[4] + 2.8) st.cam = orbLerp(TRAY2, TWR, io(seg(t, S[4], S[4] + 2.8)));
    else if (t < S[4] + 9.2) st.cam = orbLerp(TWR, TWR2, io(seg(t, S[4] + 2.8, S[4] + 9.2)));
    else st.cam = orbLerp(TWR2, ISL, io(seg(t, S[4] + 9.2, S[5])));
  } else if (t < S[6]) {   // 6 check: a scan sweeps the island; one tree that floats turns red, drops onto its studs, green
    const sx = seg(t, S[5] + 0.6, S[5] + 3.6); const lift = 1 - out(seg(t, S[5] + 7.2, S[5] + 7.7));
    const red = t < S[5] + 4.8 ? 0 : t < S[5] + 7.7 ? 1 : t < S[5] + 9.6 ? 2 : 0;
    st.mode = { kind: 'check', scanX: sx > 0 && sx < 1 ? lerp(-46, 46, sx) : null, liftK: t < S[5] + 4.3 ? 0 : 1.6 * Math.min(1, out(seg(t, S[5] + 4.3, S[5] + 4.8))) * lift, red };
    st.cam = t < S[5] + 4.0 ? orbLerp(ISL, SCN, io(seg(t, S[5], S[5] + 4.0))) : t < S[5] + 5.4 ? orbLerp(SCN, TRE, io(seg(t, S[5] + 4.0, S[5] + 5.4))) : orbLerp(TRE, TRE2, io(seg(t, S[5] + 5.4, S[6])));
    const n = Math.round(info.total * out(sx));
    ov(`<div class="big" style="top:calc(var(--u) * 1600);${op(Math.min(seg(t, S[5] + 0.6, S[5] + 1.0), 1 - seg(t, S[5] + 3.9, S[5] + 4.3)))}"><div style="font:700 calc(var(--u) * 92)/1 Rubik, sans-serif;color:#36AEBF">${n.toLocaleString('en-US')}<span style="font-size:calc(var(--u) * 42);color:#3b3f43;font-family:'PingFang SC';font-weight:600"> 块已检查</span></div></div>`);
    st.labels = { kind: 'fault', t: t - S[5] };
  } else {   // 7 done: the set on its globe, the numbers, the recap
    st.mode = { kind: 'full', globe: true }; st.cam = orbLerp(FIN, FIN2, io(seg(t, S[6], END)));
    const k1 = out(seg(t, S[6] + 0.1, S[6] + 0.6)), k2 = out(seg(t, S[6] + 0.8, S[6] + 1.3)), kr = seg(t, S[6] + 3.6, S[6] + 4.2), ko = 1 - seg(t, END - 0.8, END);
    ov(`<div class="big" style="top:calc(var(--u) * 200);${op(Math.min(k1, ko))}"><div style="display:inline-block;transform:translateY(calc(var(--u) * ${((1 - bounce(clamp(seg(t, S[6] - 0.45, S[6] + 0.15)))) * -380).toFixed(1)}))">${brickSvg('#8320B7', '7')}</div>
      <div style="font-size:calc(var(--u) * 96);font-weight:600;margin-top:calc(var(--u) * 22)">完成！</div></div>
      <div class="big" style="top:calc(var(--u) * 500);${op(Math.min(k2, ko))}"><div style="font-size:calc(var(--u) * 40);color:#3b3f43;letter-spacing:.06em">一座乐高巴黎 · <b style="font-family:Rubik">${info.total.toLocaleString('en-US')}</b> 块零件</div></div>
      <div class="recap" style="top:calc(var(--u) * 640);${op(Math.min(kr, ko))}">${STEPS.map((s, i) => { const kk = seg(t, S[6] + 3.6 + i * 0.29, S[6] + 4.1 + i * 0.29); const d = (1 - bounce(clamp(kk))) * -160;
        return `<div style="${op(kk > 0 ? 1 : 0)}"><i style="background:${s.c};transform:translateY(calc(var(--u) * ${d.toFixed(1)}))"></i>${['研究', '布局', '把关', '选零件', '搭建', '检查', '完成'][i]}</div>`; }).join('')}</div>`);
  }
  return st;
}

/** labels that follow 3-D points: computed in the page after the camera is placed */
async function labels(L) {
  if (!L) return '';
  if (L.kind === 'boxes') {
    const pts = await ev((hf) => [0, 1, 2, 3, 4].map((i) => window.H.proj(window.H.boxTop(i, i === 0 ? hf : 1))), L.hf);
    return pts.map((p, i) => { const a = S[1] + 1.7 + i * 1.14; const k = back(seg(L.t, a, a + 0.4)); if (k <= 0) return '';
      return `<div class="tag" style="left:${p[0]}px;top:${p[1] - 14 * VW / 1080}px;opacity:${clamp(k * 2)};transform:translate(-50%,-100%) scale(${k.toFixed(3)})"><b style="background:${STEPS[1].c}"></b>${BOXES[i][2]}</div>`; }).join('');
  }
  if (L.kind === 'review') {
    const p = await ev((hf) => window.H.proj(window.H.boxTop(0, hf)), L.hf); const t = L.t, U = VW / 1080;
    const kc = back(seg(t, 1.6, 2.1)), kx = 1 - seg(t, 4.0, 4.4), ks = back(seg(t, 5.4, 5.9)), kf = seg(t, 6.6, 7.1);
    let h = '';
    if (kc > 0 && kx > 0) h += `<div class="ring" style="left:${p[0]}px;top:${p[1] + 60 * U}px;width:${300 * U}px;height:${240 * U}px;border:${7 * U}px dashed #C91A09;opacity:${(kx).toFixed(3)};transform:translate(-50%,-50%) scale(${kc.toFixed(3)})"></div>`;
    if (kc > 0) h += `<div class="fcard" style="left:${110 * U}px;top:${1430 * U}px;opacity:${clamp(kc * 2)};transform:scale(${kc.toFixed(3)});transform-origin:left center">${head}<div>${kx > 0.5 ? '铁塔太矮了，比例不对' : '改好了，再看一眼'}</div></div>`;
    if (ks > 0) h += `<div class="stamp" style="left:${p[0] - 170 * U}px;top:${p[1] - 250 * U}px;opacity:${clamp(ks * 2)};transform:rotate(-12deg) scale(${(2 - ks).toFixed(3)})">OK ✓</div>`;
    if (kf > 0) h += `<div class="big" style="top:${1640 * U}px;${op(kf)}"><div style="font-size:${36 * U}px;color:#5b6064;letter-spacing:.06em">每一步都会这样，来回改几轮</div></div>`;
    return h;
  }
  if (L.kind === 'fault') {
    const t = L.t, U = VW / 1080; if (t < 4.8) return '';
    const bad = t < 7.7; const k = back(seg(t, bad ? 4.8 : 7.7, bad ? 5.3 : 8.2));
    return `<div class="fcard" style="left:${110 * U}px;top:${1430 * U}px;transform:scale(${k.toFixed(3)});transform-origin:left center;color:${bad ? '#C91A09' : '#237841'}">${bad ? '✗ 这棵树悬空了，没扣在凸点上' : '✓ 放回凸点上，扣住了'}</div>`;
  }
  if (L.kind === 'dims') {   // proportion marks beside the tower and the cathedral
    const t = L.t, U = VW / 1080; const pts = await ev(() => [window.H.proj([-41, 7.2, -16]), window.H.proj([-41, 53.7, -16]), window.H.proj([13.5, 5, -10]), window.H.proj([35.5, 5, -10])]);
    const k1 = out(seg(t, 1.4, 2.4)), k2 = out(seg(t, 2.6, 3.6)); let h = '';
    if (k1 > 0) { const [a, b] = [pts[0], pts[1]]; const y1 = lerp(a[1], b[1], k1);
      h += `<div style="position:absolute;left:${a[0] - 3 * U}px;top:${y1}px;width:${6 * U}px;height:${a[1] - y1}px;background:#C91A09;border-radius:${3 * U}px"></div><div style="position:absolute;left:${a[0] - 26 * U}px;top:${y1 - 3 * U}px;width:${52 * U}px;height:${6 * U}px;background:#C91A09"></div><div style="position:absolute;left:${a[0] - 26 * U}px;top:${a[1] - 3 * U}px;width:${52 * U}px;height:${6 * U}px;background:#C91A09"></div>
        <div class="tag" style="left:${a[0] + 70 * U}px;top:${y1 + 160 * U}px;${op(seg(t, 2.0, 2.4))}"><b style="background:#C91A09"></b>高度</div>`; }
    if (k2 > 0) { const [a, b] = [pts[2], pts[3]]; const x2 = lerp(a[0], b[0], k2);
      h += `<div style="position:absolute;left:${a[0]}px;top:${a[1] + 30 * U}px;width:${x2 - a[0]}px;height:${6 * U}px;background:#C91A09;border-radius:${3 * U}px"></div>
        <div class="tag" style="left:${(a[0] + b[0]) / 2}px;top:${a[1] + 130 * U}px;${op(seg(t, 3.2, 3.6))}"><b style="background:#C91A09"></b>宽度</div>`; }
    return h;
  }
  return '';
}

// ---- render loop --------------------------------------------------------------------------------------------------------------------
fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
const from = arg('--from', 0), to = arg('--to', END); const N = Math.round((to - from) * FPS);
let lastKind = '';
const t0 = Date.now();
for (let i = 0; i < N; i++) {
  const t = from + i / FPS; const f = frameAt(t); const M = f.mode;
  await ev(({ M, cam, first }) => {
    const H = window.H;
    if (first) { H.home(); H.sil(false); H.blockout(false); H.check({ scanX: null, liftK: 0, red: 0 }); }
    H.globe(!!M.globe);
    if (M.kind === 'full') { if (first) H.home(); }
    else if (M.kind === 'sil') { if (first) { H.home(); H.sil(true); } }
    else if (M.kind === 'blockout') { H.show((it) => (['terrain', 'water', 'quay'].includes(it.tag) ? 1 : 0)); H.blockout(true, M.rise.map((r, i) => [r, i === 0 ? M.tower : 1])); }
    else if (M.kind === 'build') H.build(M);
    else if (M.kind === 'check') H.check(M);
    H.cam(cam.p, cam.l, cam.fov); H.dirty();
  }, { M, cam: f.cam, first: M.kind !== lastKind });
  lastKind = M.kind;
  await ev((c) => window.__film.look(c.p, c.l, c.fov), f.cam);
  const html = f.html + (await labels(f.labels));
  await ev((h) => { document.getElementById('fo').innerHTML = h; }, html);
  await ev(() => window.__film.step(1 / 30));
  await page.screenshot({ path: path.join(OUT, String(i).padStart(5, '0') + '.jpg'), type: 'jpeg', quality: 94 });
  if (i % 150 === 0) console.log(`${i}/${N} t=${t.toFixed(1)} ${((Date.now() - t0) / 1000).toFixed(0)}s`);
}
await browser.close();
fs.writeFileSync(path.join(OUT, 'meta.json'), JSON.stringify({ fps: FPS, from, to }));
console.log('done', N);
