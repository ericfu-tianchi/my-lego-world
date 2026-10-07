// South Korea · Seoul island v2, phase 1: the BLOCKOUT (2026-10-06, CLAUDE.md rule 13 "Layering is read from the hero camera").
// Plain boxes per mass at the footprints and heights of docs/refs/seoul-island/LAYOUT-v2.md (table v3), measured off the composition
// reference docs/refs/seoul-composition.png. No detail: only silhouette, height steps and what the hero camera sees.
// ?scene=seoul-blockout ; ?only=hill | gate | stage | hanok | tower | ginkgo | figs | terrain | river
// Grid: x west → east, z north → south (north at the back); heights in plates above the square G.
import { Blueprint } from '../core/builder';
import { patch, type SceneMeta } from './lib';

export const BLOCK = {
  W: 68, D: 64, G: 10, BASE: 3, R: 7,                   // island footprint, square level, corner radius
  gate: { x: 14, z: 18, w: 26, d: 12, base: 16, body: 24, roof1: 30, upper: 38, ridge: 50 },   // base NW corner; heights: base top … ridge
  stage: { x: 16, z: 37, w: 22, d: 7, deck: 3, top: 16 },                                      // centred on the gate's axis (x 27)
  /** the range along the back: crest height (plates) at control x; peak behind-left of the gate, a saddle, the tower's shoulder on the right */
  crest: [[0, 30], [6, 44], [13, 62], [20, 75], [26, 70], [32, 54], [38, 40], [43, 34], [48, 38], [53, 39], [60, 39], [65, 34], [68, 28]] as [number, number][],
  crestZ: (x: number) => (x < 30 ? 6 : x < 48 ? 5 : 8),
  shoulder: { x: 57, z: 8, h: 39, flat: 2.5 },           // N Seoul Tower's pad on the range's east shoulder
  tower: 42,                                             // shaft + pod + mast above the pad (≈ the hill: 236 m on 243 m)
  terrace: 3,                                            // Bukchon's granite terrace above the square
  hanok: [{ x: 45, z: 21, w: 12, d: 9 }, { x: 52, z: 32, w: 14, d: 9 }], hanokWall: 9, hanokRidge: 18,
  ginkgo: [{ x: 46, z: 38 }, { x: 64, z: 24 }], ginkgoH: 30,
  path: 47, river: (x: number) => 55 - Math.round((4 * x) / 68),   // cycle path row; first river row (the bank bows out to the left)
  figs: { visitor: [50, 43], guard: [9, 32], picnic: [[7, 51], [10, 51]], fans: [[25, 45], [29, 45]] } as Record<string, number[] | number[][]>,
};

export function buildSeoulBlockout(bp: Blueprint): SceneMeta {
  const { W, D, G, BASE, R } = BLOCK; const T = (t: string) => { bp.tag = t; };
  const inIsland = (x: number, z: number) => {
    if (x < 0 || z < 0 || x >= W || z >= D) return false;
    const cx = Math.min(Math.max(x + 0.5, R), W - R), cz = Math.min(Math.max(z + 0.5, R), D - R);
    return Math.hypot(x + 0.5 - cx, z + 0.5 - cz) <= R;
  };
  const edge = (x: number, z: number) => { for (let r = 1; r <= 3; r++) for (let dx = -r; dx <= r; dx++) for (let dz = -r; dz <= r; dz++) if (!inIsland(x + dx, z + dz)) return true; return false; };

  // ---- the range: ONE massif across the back width (crest profile + a front fall-off that ends at the gate / Bukchon / the west wall), uneven
  // brick terraces (value noise, quantised to whole bricks), the back held high as a rock face; the tower's pad levelled on the east shoulder
  const { gate: g, shoulder: sh } = BLOCK;
  const crestAt = (x: number) => { const c = BLOCK.crest; for (let i = 1; i < c.length; i++) if (x <= c[i][0]) { const t = (x - c[i - 1][0]) / (c[i][0] - c[i - 1][0]); return c[i - 1][1] + (c[i][1] - c[i - 1][1]) * (t * t * (3 - 2 * t)); } return c[c.length - 1][1]; };
  const front = (x: number) => (x < g.x - 3 ? g.z + 4 : x < g.x + g.w + 2 ? g.z - 1 : g.z + 2);   // the first row the range may not reach
  const range = (x: number, z: number) => {
    const cz = BLOCK.crestZ(x), lim = front(x), top = crestAt(x + 0.5); if (z >= lim) return 0;
    const f = z <= cz ? 0.6 + 0.4 * (z + 0.5) / (cz + 0.5) : 1 - Math.pow((z + 0.5 - cz) / (lim - cz), 1.25);
    const ds = Math.hypot(x + 0.5 - sh.x, z + 0.5 - sh.z); if (ds <= sh.flat) return sh.h;
    return Math.max(0, top * f + (patch(x, z, 3, 5) - 0.5) * 5 + (patch(x, z, 6, 9) - 0.5) * 5);
  };
  const hillH = (x: number, z: number) => { const h = range(x, z); return h < 3 ? 0 : h === sh.h ? h : 3 * Math.round(h / 3); };
  const rocky = (x: number, z: number) => { const h = hillH(x, z); if (h > 60) return true; for (const [dx, dz] of [[0, 1], [1, 0], [-1, 0], [0, -1]]) if (h > 40 && h - hillH(x + dx, z + dz) >= 12) return true; return false; };

  // ---- ground level per cell (plates above G): river −2, square 0, Bukchon's terrace, the hills
  const terrace = (x: number, z: number) => x >= g.x + g.w + 3 && z >= g.z && z < BLOCK.path - 1;
  const river = (x: number, z: number) => z >= BLOCK.river(x);
  const surf = (x: number, z: number) => river(x, z) ? -2 : Math.max(hillH(x, z), terrace(x, z) ? BLOCK.terrace : 0);
  const colourOf = (x: number, z: number) => {
    const h = hillH(x, z);
    if (river(x, z)) return 'SandBlue';
    if (h > 0) return rocky(x, z) ? 'LightBluishGray' : patch(x, z, 4, 3) < 0.3 ? 'Green' : 'DarkGreen';
    if (z === BLOCK.river(x) - 1) return 'LightBluishGray';                       // the bank's coping
    if (z >= BLOCK.path && z < BLOCK.path + 2) return 'DarkBluishGray';             // the cycle path
    if (z >= BLOCK.path + 2) return 'Green';                                        // Hangang Park lawn
    if (terrace(x, z)) return 'Tan';                                                // Bukchon's ground
    return 'LightBluishGray';                                                       // the square
  };

  T('terrain');
  for (let x = 0; x < W; x++) for (let z = 0; z < D; z++) {
    if (!inIsland(x, z)) continue; const f = edge(x, z) ? 0 : BASE; const s = surf(x, z);
    for (let y = f; y < G - 1 + Math.min(s, 0); y++) bp.vox1('brick', x, y, z, y < 6 ? 'DarkBluishGray' : 'DarkTan');
    const top = G - 1 + s;
    if (s > 0) { T(hillH(x, z) > 0 ? 'hill' : 'terrain'); for (let y = G - 1; y < top; y++) bp.vox1('brick', x, y, z, y >= top - 3 && hillH(x, z) > 0 ? colourOf(x, z) : 'DarkBluishGray'); }   // the riser course in the zone colour, as the terraces will be
    bp.vox1('plate', x, top, z, colourOf(x, z)); T('terrain');
  }
  // the plinth: two bricks of stone one cell outside, capped
  T('plinth');
  for (let x = -1; x <= W; x++) for (let z = -1; z <= D; z++) {
    if (inIsland(x, z) || ![[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dz]) => inIsland(x + dx, z + dz))) continue;
    for (let y = 0; y < 6; y++) bp.vox1('brick', x, y, z, 'DarkBluishGray'); bp.vox1('tile', x, 6, z, 'DarkBluishGray');
  }

  // ---- Gwanghwamun: granite base with three tunnels, Dark Red body, two dark roof slabs, the upper storey
  T('gate'); const box = (c: string, x: number, y0: number, z: number, w: number, y1: number, d: number) => bp.fill('brick', x, G + y0, z, w, y1 - y0, d, c);
  box('LightBluishGray', g.x, 0, g.z, g.w, g.base, g.d);
  for (const [i, w] of [[3, 4], [10, 6], [19, 4]]) bp.clear(g.x + i, G, g.z, w, i === 10 ? 11 : 9, g.d);
  box('DarkRed', g.x + 2, g.base, g.z + 1, g.w - 4, g.body, g.d - 2);
  box('DarkBluishGray', g.x - 2, g.body, g.z - 1, g.w + 4, g.roof1, g.d + 2);
  box('DarkRed', g.x + 4, g.roof1, g.z + 2, g.w - 8, g.upper, g.d - 4);
  box('DarkBluishGray', g.x + 1, g.upper, g.z + 1, g.w - 2, g.upper + 6, g.d - 2);
  box('DarkBluishGray', g.x + 5, g.upper + 6, g.z + 4, g.w - 10, g.ridge, g.d - 8);
  T('palacewall'); for (const [x0, x1] of [[2, g.x], [g.x + g.w, g.x + g.w + 3]]) box('LightBluishGray', x0, 0, g.z + 5, x1 - x0, 9, 2);

  // ---- the stage: black deck, two speaker towers, the top truss, the LED face
  T('stage'); const st = BLOCK.stage;
  box('Black', st.x, 0, st.z, st.w, st.deck, st.d);
  for (const x of [st.x, st.x + st.w - 2]) box('Black', x, st.deck, st.z, 2, st.top, 2);
  box('Black', st.x + 2, st.top - 2, st.z, st.w - 4, st.top, 2);
  box('BrightRed', st.x + 2, st.deck, st.z, st.w - 4, st.top - 2, 1);

  // ---- the City Wall along the crest, from the peak east to the tower's shoulder: a grey course three plates high on the highest cell
  T('wall');
  for (let x = 18; x < sh.x - 2; x++) { let bz = 0; for (let z = 1; z < 14; z++) if (hillH(x, z) > hillH(x, bz)) bz = z; bp.fill('brick', x, G + hillH(x, bz), bz, 1, 3, 1, 'LightBluishGray'); }

  // ---- N Seoul Tower on the range's east shoulder: 2 × 2 white shaft, a 6 × 6 pod at 0.50–0.62 of the height, a red-and-white mast
  T('tower'); const t0 = G + sh.h, H = BLOCK.tower, tx = sh.x - 1, tz = sh.z - 1;
  bp.fill('brick', tx - 1, t0, tz - 1, 4, 3, 4, 'White');
  bp.fill('brick', tx, t0 + 3, tz, 2, Math.round(0.5 * H) - 3, 2, 'White');
  bp.fill('brick', tx - 2, t0 + Math.round(0.5 * H), tz - 2, 6, Math.round(0.12 * H), 6, 'DarkBluishGray');
  const m0 = t0 + Math.round(0.62 * H); bp.fill('brick', tx, m0, tz, 2, 3, 2, 'White');
  for (let y = m0 + 3, i = 0; y < t0 + H; y += 3, i++) bp.fill('brick', tx, y, tz, 1, 3, 1, i % 2 ? 'White' : 'BrightRed');

  // ---- Bukchon: two hanok on the terrace (walls, then a roof slab to the ridge), the ginkgos
  T('hanok'); const k0 = BLOCK.terrace;
  for (const h of BLOCK.hanok) {
    bp.fill('brick', h.x + 1, G + k0, h.z + 1, h.w - 2, BLOCK.hanokWall, h.d - 2, 'White');
    bp.fill('brick', h.x, G + k0 + BLOCK.hanokWall, h.z, h.w, 6, h.d, 'DarkBluishGray');
    bp.fill('brick', h.x + 2, G + k0 + BLOCK.hanokWall + 6, h.z + 3, h.w - 4, BLOCK.hanokRidge - BLOCK.hanokWall - 6, h.d - 6, 'DarkBluishGray');
  }
  T('ginkgo');
  for (const p of BLOCK.ginkgo) { const y0 = G + surf(p.x, p.z); bp.fill('brick', p.x, y0, p.z, 1, 9, 1, 'ReddishBrown'); bp.fill('brick', p.x - 2, y0 + 9, p.z - 2, 5, 15, 5, 'Yellow'); bp.fill('brick', p.x - 1, y0 + 24, p.z - 1, 3, BLOCK.ginkgoH - 24, 3, 'Yellow'); }

  // ---- figures: 1 × 1 columns four bricks tall (a minifig's height)
  T('figs'); const fig = (x: number, z: number, c: string) => bp.fill('brick', x, G + surf(x, z), z, 1, 12, 1, c);
  const f = BLOCK.figs; fig(f.visitor[0] as number, f.visitor[1] as number, 'BrightPink'); fig(f.guard[0] as number, f.guard[1] as number, 'DarkBlue');
  for (const [x, z] of f.picnic as number[][]) fig(x, z, 'BrightBlue');
  for (const [x, z] of f.fans as number[][]) fig(x, z, 'MediumLavender');
  for (let i = 0; i < 7; i++) bp.fill('brick', st.x + 4 + i * 2, G + st.deck, st.z + 3, 1, 12, 1, 'DarkRed');   // the seven idols on the deck

  bp.tag = ''; bp.compact = true; bp.pack();
  return { id: 'seoul-blockout', title: 'South Korea', caption: 'Seoul · blockout', subtitle: 'v2 layering study', size: [W, D], center: [W / 2, 18, D / 2], base: BASE, camera: { az: -0.32, el: 0.38, dist: 122 } };
}
