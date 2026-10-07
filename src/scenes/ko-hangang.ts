// Seoul element test scene: the Han front strip (docs/refs/seoul-hangang/SCHEME.md §2–§4, BUILD.md). ?scene=ko-hangang&noglobe
// One strip across the island's front, north → south: the cycle path (Dark Bluish Gray, a solid Yellow centre line), the lawn with its lamps,
// benches and the picnic mat, the bank bowing toward the camera in the middle (a tiled granite coping at G, one step at G − 1), and the river at
// w = G − 2 with the Hangang Bus and its wake. The ground is the island's own section (BASE 3, earth to plate 8, surface course at G − 1).
// `placeHan` lays every cell of the strip from the column's floor up, so the island calls it with its outline and keeps out of those cells.
// Tags: river, bank, park, boat, picnic. `?scene=ko-hangang-swatch` is the water swatch (the scheme's first risk test).
import { Blueprint } from '../core/builder';
import { Sites, type SceneMeta } from './lib';
import { vnoise } from './la-sign';
const k2 = (x: number, z: number) => x + ',' + z;

/** Where the strip goes on the island. Cells x0 ≤ x < x1 from row z0 (the path's north row) south to the island's edge, wherever `inIsland`. */
export interface HanSite {
  x0: number; x1: number; z0: number; G: number; BASE: number;
  inIsland: (x: number, z: number) => boolean;
  /** the plate the column starts from (0 at the rim, BASE inside: the island's rule) */
  floorOf: (x: number, z: number) => number;
  /** earth colour by plate (whole brick layers from BASE); default: Dark Bluish Gray under 6, Dark Tan above */
  earth?: (y: number) => string;
}
/** Water swatch options (the scheme's §2.2 risk test). Defaults are the chosen mix. */
export interface HanLook { bare?: boolean /* water and bank only (the swatch) */; glint?: string; fleck?: string; fleckShare?: number; fleckStretch?: number /* flecks as soft bands this many times longer along x than across */; side?: string; river?: string; buoys?: boolean /* false: no buoys (Seoul v2, Eric: unreadable yellow floats) */; matX?: number /* the mat's west x (default: centred) */; matZ?: number; matW?: number; matD?: number /* the mat's north row and size (default z0 + 6, 6 × 4) */; boatX?: number /* the Hangang Bus's west x (default x0 + 8) */; lamps?: number[]; benches?: number[] /* x positions (default: symmetric about the strip's axis) */; mat?: boolean /* false: leave the mat, box and gingham to the caller's ko_picnic assembly (its own mat); the cells stay studded */ }
export interface HanInfo {
  /** a river cell (the island's plinth beside it tops out at `sideY` − 1 with a tile, so the water's thickness shows) */
  isRiver: (x: number, z: number) => boolean;
  sideY: number;
  /** the two seated figures' stud pairs on the picnic mat (cells; the figures face +z, the river), and the cells each figure may cover */
  seats: { studs: [number, number][]; cells: [number, number, number, number] }[];
  /** the coping row by x (z of the tiled granite edge at G) */
  copingZ: (x: number) => number;
  boat: { x: number; z: number; rot: number };
}


/** The Han front strip. Every surface cell it lays goes into `own`. */
export function placeHan(bp: Blueprint, S: HanSite, own: Set<string>, sites?: Sites, look: HanLook = {}): HanInfo {
  const { x0, x1, z0, G, inIsland, floorOf } = S; const earth = S.earth ?? ((y: number) => (y < 6 ? 'DarkBluishGray' : 'DarkTan'));
  const BED = G - 4, WATER = G - 3, SIDE_Y = G - 6;   // bed plate 6, water tiles 7 (top w = G − 2 = 8), side wall from 4 up: LA's levels
  const RIVER = look.river ?? 'SandBlue', GLINT = look.glint ?? 'TransClear', SIDE = look.side ?? 'SandBlue';
  const cx = (x0 + x1 - 1) / 2;
  // the lawn (r2, judge r1: random specks read as noise): Green, with a few grouped patches placed mirror-symmetric — Olive Green dry grass
  // in 3 × 2 clumps near the ends and beside the benches, a worn Dark Tan track from the path to the picnic mat
  const lawnPatch = new Map<string, string>();
  const patchAt = (a: number, z: number, w: number, d: number, c: string) => { for (const xx of [a, 2 * cx - a - w + 1]) for (let i = 0; i < w; i++) for (let j = 0; j < d; j++) lawnPatch.set(k2(xx + i, z + j), c); };
  patchAt(x0 + 3, z0 + 5, 3, 2, 'OliveGreen'); patchAt(Math.round(cx - 12.5), z0 + 6, 3, 2, 'OliveGreen'); patchAt(Math.round(cx - 0.5), z0 + 5, 1, 1, 'DarkTan');
  const LAWN = (x: number, z: number) => lawnPatch.get(k2(x, z)) ?? 'Green';
  // ---- the bow (SCHEME §2.3): the coping row steps one stud south every 6 studs toward the middle, symmetric about the strip's axis
  const step = (x: number) => { const d = Math.abs(x - cx); return d < 8 ? 4 : d < 14 ? 3 : d < 20 ? 2 : d < 26 ? 1 : 0; };
  const copingZ = (x: number) => z0 + 7 + step(x);
  const kind = (x: number, z: number): 'path' | 'lawn' | 'coping' | 'step' | 'water' | null => {
    if (x < x0 || x >= x1 || z < z0 || !inIsland(x, z)) return null; const c = copingZ(x);
    return z < z0 + 5 ? 'path' : z < c ? 'lawn' : z === c ? 'coping' : z === c + 1 ? 'step' : 'water';
  };
  const isRiver = (x: number, z: number) => kind(x, z) === 'water';
  const edge = (x: number, z: number) => { for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) if (!inIsland(x + dx, z + dz)) return true; return false; };

  // ---- placements on the strip (SCHEME §2.3): lamps on the lawn's first row, benches facing the river, the mat in the middle, the boat bow east
  const LAMPS = look.lamps ?? [-26.5, -8.5, 8.5, 26.5].map((o) => cx + o), BENCHES = look.benches ?? [cx - 17.5, cx + 14.5];
  const MAT = { x: look.matX ?? cx - 2.5, z: look.matZ ?? z0 + 6, w: look.matW ?? 6, d: look.matD ?? 4 }, BOAT = { x: look.boatX ?? x0 + 8, z: z0 + 15, rot: 0 };
  const props = new Set<string>();   // lawn cells something stands on: studded plates, never a tile
  const take = (x: number, z: number, w: number, d: number) => { for (let i = 0; i < w; i++) for (let j = 0; j < d; j++) props.add(k2(x + i, z + j)); };

  const wet = new Set<string>(); const WAKE: [number, number][] = [];
  const seats: HanInfo['seats'] = [];
  if (!look.bare) {
  bp.tag = 'park';
  for (const x of LAMPS) { sites?.add('lamp' + x, x + 0.5, z0 + 5.5, 1, 'hanlamp'); bp.assembly('hg_lamp', x, G, z0 + 5, 'LightBluishGray'); take(x, z0 + 5, 1, 1); }
  for (const x of BENCHES) { sites?.add('bench' + x, x + 2, z0 + 8, 2, 'hanbench'); bp.assembly('hg_bench', x, G, z0 + 7, 'ReddishBrown', 0); take(x, z0 + 7, 4, 2); }   // backrest north, facing the water

  // shrubs (r3, judge r2: a middle layer between the lamps and the benches): a low clump at each end of each bench, mirror-symmetric — a
  // three-leaf plate on the lawn stud and two leaves 4 × 3 crossed over it; r5 (judge r3): a row inland, the leaf tips clear of the coping
  BENCHES.forEach((bx, i) => { for (const [sx, out] of [[bx - 2, 3], [bx + 5, 1]] as [number, number][]) {
    bp.tag = 'park'; bp.part('plant_3leaves', sx, G, z0 + 7, 'Green'); bp.part('leaves_4x3', sx, G + 1, z0 + 7, 'Green', out); bp.part('leaves_4x3', sx, G + 2, z0 + 7, 'DarkGreen', (out + 1 + 2 * i) & 3); take(sx, z0 + 7, 1, 1); } });

  // ---- the picnic (SCHEME §4.3–4.5): a White 4 × 6 mat on the lawn, a Medium Azure / White gingham of tiles on the cells no figure takes, the
  // chicken box between the two seats. The figures (another builder) sit on the stud pairs in `seats`; their cells stay bare studs.
  bp.tag = 'picnic'; sites?.add('picnic', MAT.x + MAT.w / 2, MAT.z + MAT.d / 2, 3);
  if (look.mat !== false) bp.part('plate_4x6', MAT.x, G, MAT.z, 'White', 1); take(MAT.x, MAT.z, MAT.w, MAT.d);
  const figCells = (fx: number) => [fx, MAT.z + 1, 2, 3] as [number, number, number, number];   // r2: the row behind the hips is tiled
  seats.push(...[MAT.x, MAT.x + 4].map((fx) => ({ studs: [[fx, MAT.z + 2], [fx + 1, MAT.z + 2]] as [number, number][], cells: figCells(fx) })));
  const BOX = { x: MAT.x + 2, z: MAT.z + 1 };
  if (look.mat !== false) {
    bp.part('brick_2x2', BOX.x, G + 1, BOX.z, 'White'); bp.part('tile_2x2', BOX.x, G + 4, BOX.z, 'White', 0, 'ko_chicken_box');   // r2: a brick tall (judge r1)
    for (const [i, j] of [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [2, 3], [3, 3]]) bp.part('tile_1x1', MAT.x + i, G + 1, MAT.z + j, (i + j) % 2 ? 'MediumAzure' : 'White');
  }

  // ---- the Hangang Bus and its wake (SCHEME §3): hull cells and the wake are wet studs (plates), the tunnel and the bow tips' outer cells tiled
  bp.tag = 'boat'; for (const dx of [3, 8, 13]) sites?.add('boat' + dx, BOAT.x + dx, BOAT.z + 2.5, 3, 'boat');   // a long boat registers along its length
  bp.assembly('hangang_bus', BOAT.x, WATER + 1, BOAT.z, 'White', BOAT.rot);
  for (let i = 0; i < 16; i++) for (const j of [0, 1, 3, 4]) { const bowOuter = i > 12 && (j === 0 || j === 4); if (!bowOuter) wet.add(k2(BOAT.x + i, BOAT.z + j)); }   // bow east at rot 0 (r4: the right-hand wedge plates face the camera; the mirrored left-hand moulds render a recess in their angled face): x 13..15 are the tips
  // the wake flush with the water (r1's round tiles standing on wet studs read as stepping stones; r2's square tiles as blocks): White round
  // tiles 1 × 1 on the bed plate's studs in two short lines diverging astern
  WAKE.push(...([[16, 0], [17, 0], [18, -1], [19, -1], [20, -2], [21, -3], [16, 4], [17, 4], [18, 5], [19, 5], [20, 6], [21, 7]] as [number, number][]).map(([i, j]) => [15 - i, j] as [number, number]));   // astern = west
  }
  // two yellow buoys mid-river (r3, judge r2, after real-hangang-yeouido.jpg), mirror-symmetric, clear of the boat. r5 (judge r3: a round brick
  // read as a bottle): a wide low cone — a round plate 2 × 2 on four wet studs, a jumper 2 × 2, a cone 1 × 1 on its centre stud
  const BX = Math.round(cx - 9.5), BUOYS: [number, number][] = look.bare || look.buoys === false ? [] : [[BX, z0 + 18], [2 * cx - BX - 1, z0 + 18]];
  for (const [x, z] of BUOYS) { for (const [i, j] of [[0, 0], [1, 0], [0, 1], [1, 1]]) wet.add(k2(x + i, z + j)); bp.tag = 'river';
    bp.part('roundplate_2x2', x, WATER + 1, z, 'Yellow'); bp.part('jumper_2x2', x, WATER + 2, z, 'Yellow'); bp.part('cone_1x1', x + 0.5, WATER + 3, z + 0.5, 'Yellow'); }
  const nearBoat = (x: number, z: number) => BUOYS.some(([a, b]) => Math.abs(a + 0.5 - x) < 3.5 && Math.abs(b + 0.5 - z) < 3.5) || !look.bare && x >= BOAT.x - 4 && x <= BOAT.x + 23 && z >= BOAT.z - 4 && z <= BOAT.z + 8;

  // ---- glints (SCHEME §2.2): short streaks of 1 × 1 tiles along x, one per 11 × 4 cell of a jittered grid, mid-river, clear of the boat
  const glint = new Set<string>();
  for (let gx = x0; gx < x1; gx += 11) for (let gz = z0 + 8; gz < z0 + 40; gz += 4) {
    const h = (n: number) => vnoise(gx * 3.1 + n * 17, gz * 2.3, 1, 401 + n) * 0.5 + 0.5;
    if (h(0) < 0.62) continue; const len = 2 + Math.floor(h(1) * 1.99), x = gx + Math.floor(h(2) * (11 - len)), z = gz + Math.floor(h(3) * 4);
    const cells = Array.from({ length: len }, (_, i) => [x + i, z] as [number, number]);
    if (cells.every(([a, b]) => isRiver(a, b) && kind(a, b - 2) === 'water' && !edge(a, b) && !nearBoat(a, b))) for (const [a, b] of cells) glint.add(k2(a, b));
  }

  // ---- columns: earth two bricks deep under the path and the lawn; the bank's granite; the river's bed, side wall and surface
  const water = new Map<string, string>();
  for (let x = x0; x < x1; x++) for (let z = z0; z < z0 + 60; z++) {
    const t = kind(x, z); if (!t) continue;
    own.add(k2(x, z)); const f = floorOf(x, z);
    if (t === 'water') {
      const e = edge(x, z); bp.tag = 'river';
      for (let y = f; y < BED; y++) bp.vox1('brick', x, y, z, e ? (y < SIDE_Y ? earth(y) : SIDE) : RIVER);   // the side wall shows the water's thickness over the lowered plinth
      bp.vox1('plate', x, BED, z, e ? SIDE : RIVER);
      if (wet.has(k2(x, z))) { bp.vox1('plate', x, WATER, z, RIVER); continue; }   // studs for the hulls
      if (WAKE.some(([i, j]) => BOAT.x + i === x && BOAT.z + j === z)) { bp.tag = 'boat'; bp.part('roundtile_1x1', x, WATER, z, 'White'); continue; }
      const st = look.fleckStretch ?? 0; const fl = look.fleck && (st ? vnoise(x / st, z, 1.3, 307) > 0.6 - 1.2 * (look.fleckShare ?? 0.15) * 2 : vnoise(x, z, 1, 307) > 1 - 2 * (look.fleckShare ?? 0.15));
      water.set(k2(x, z), glint.has(k2(x, z)) ? GLINT : fl ? look.fleck! : RIVER); continue;
    }
    bp.tag = t === 'path' ? 'park' : t === 'lawn' ? 'park' : 'bank';
    const top = t === 'step' ? G - 2 : G - 1;   // the surface course: the step's tile at G − 2, everything else at G − 1
    const stone = t === 'coping' ? 6 : t === 'step' ? 6 : 99;   // the bank is granite from plate 6 up (a whole brick layer under the coping)
    for (let y = f; y < Math.min(top, stone); y++) bp.vox1('brick', x, y, z, earth(y));
    for (let y = stone; y < top; y++) bp.vox1(t === 'coping' ? 'brick' : 'plate', x, y, z, 'LightBluishGray');
    if (t === 'path') bp.vox1('tile', x, top, z, z === z0 + 2 ? 'Yellow' : 'DarkBluishGray');
    else if (t === 'lawn') bp.vox1('plate', x, top, z, props.has(k2(x, z)) ? 'Green' : LAWN(x, z));
    else {   // coping and step: tiles; a quarter-round tile on each convex corner of a jog (LA's macaroni idea: it softens the stair-step)
      const jog = [-1, 1].find((sx) => kind(x + sx, z) === (t === 'coping' ? 'step' : 'water'));
      if (jog === undefined) bp.vox1('tile', x, top, z, 'LightBluishGray');
      else bp.part('tile_quarter_1x1', x, top, z, 'LightBluishGray', jog > 0 ? 0 : 3);
    }
  }
  // the water's tiles by hand (r2, judge r1: 2 × 2 tiles read as a grid): long Sand Blue tiles 1 × 8 / 6 / 4 / 3 / 2 running with the
  // current (along x), joints staggered row to row; glints stay 1 × 1
  bp.tag = 'river';
  const RUNS = [8, 6, 4, 3, 2, 1];
  for (let z = z0; z < z0 + 60; z++) for (let x = x0; x < x1; x++) {
    const c = water.get(k2(x, z)); if (!c) continue;
    let n = 1; while (n < 8 && water.get(k2(x + n, z)) === c && c === RIVER) n++;
    if (x === x0 || water.get(k2(x - 1, z)) !== c) { const first = z % 3 === 0 ? 8 : z % 3 === 1 ? 3 : 6; n = Math.min(n, first); }   // stagger: each row starts on a different joint
    const L = RUNS.find((r) => r <= n)!;
    bp.part(L === 1 ? 'tile_1x1' : `tile_1x${L}`, x, WATER, z, c, L === 1 ? 0 : 1); for (let i = 0; i < L; i++) water.delete(k2(x + i, z));
  }
  bp.tag = '';
  return { isRiver, sideY: SIDE_Y, seats, copingZ, boat: BOAT };
}

const G = 10, BASE = 3;
/** the island's plinth round a rectangle W × D: two bricks of stone one cell outside, capped; along the river one brick lower */
function plinth(bp: Blueprint, W: number, D: number, info: HanInfo, inIsland: (x: number, z: number) => boolean) {
  bp.tag = 'plinth';
  for (let x = -1; x <= W; x++) for (let z = -1; z <= D; z++) {
    if (inIsland(x, z)) continue; const nb = [[1, 0], [-1, 0], [0, 1], [0, -1]].filter(([dx, dz]) => inIsland(x + dx, z + dz)); if (!nb.length) continue;
    const top = nb.every(([dx, dz]) => info.isRiver(x + dx, z + dz)) ? info.sideY - 1 : 6;
    for (let y = 0; y < top; y++) bp.vox1('brick', x, y, z, 'DarkBluishGray'); bp.vox1('tile', x, top, z, 'DarkBluishGray');
  }
}

/** The test scene: the strip at the scheme's own numbers (76 wide, path at z 2 = the scheme's z 40), two rows of lawn verge north of it. */
export function buildKoHangang(bp: Blueprint): SceneMeta {
  const W = 76, D = 28; const inIsland = (x: number, z: number) => x >= 0 && z >= 0 && x < W && z < D;
  const rim = (x: number, z: number) => Math.min(x, z, W - 1 - x, D - 1 - z) < 3;
  const own = new Set<string>(); const sites = new Sites(2);
  const info = placeHan(bp, { x0: 0, x1: W, z0: 2, G, BASE, inIsland, floorOf: (x, z) => (rim(x, z) ? 0 : BASE) }, own, sites);
  bp.tag = 'verge';
  for (let x = 0; x < W; x++) for (let z = 0; z < D; z++) { if (own.has(x + ',' + z)) continue; const f = rim(x, z) ? 0 : BASE; for (let y = f; y < G - 1; y++) bp.vox1('brick', x, y, z, y < 6 ? 'DarkBluishGray' : 'DarkTan'); bp.vox1('plate', x, G - 1, z, 'Green'); }
  plinth(bp, W, D, info, inIsland);
  bp.tag = ''; bp.compact = true; bp.pack();
  return { id: 'ko-hangang', title: 'Han River front', caption: 'Han River front', subtitle: 'test scene', size: [W, D], center: [W / 2, G, D / 2], base: BASE, camera: { az: 0, el: 0.45, dist: 95 } };
}

/** The water swatch (SCHEME §2.2): four 18 × 12 bays of river behind a strip of bank, side by side. Round 1 (build/swatch-*.png): A Sand Blue + Trans-Clear
 *  glints (Trans-Dark-Blue side wall), B A + 15 % Sand Green 1 × 1 flecks, C Light Aqua glints, D a Sand Blue side wall. Round 2 (swatch2-*): A, then Sand Green
 *  in soft bands along the river at ≈ 20 % and ≈ 40 % (Sand Blue side wall), and Sand Green water with Sand Blue bands.
 *  Round 3 (swatch3-*): plain Sand Blue + glints, side wall Trans-Dark-Blue / Sand Blue / Trans-Black / Dark Bluish Gray. */
export function buildKoHangangSwatch(bp: Blueprint): SceneMeta {
  const looks: HanLook[] = [{ side: 'TransDarkBlue' }, { side: 'SandBlue' }, { side: 'TransBlack' }, { side: 'DarkBluishGray' }];
  const BW = 18, GAP = 3, D = 26;
  looks.forEach((look, i) => {
    const ox = i * (BW + GAP); const inIsland = (x: number, z: number) => x >= ox && x < ox + BW && z >= 0 && z < D;
    const rim = (x: number, z: number) => Math.min(x - ox, z, ox + BW - 1 - x, D - 1 - z) < 3; const own = new Set<string>();
    const info = placeHan(bp, { x0: ox, x1: ox + BW, z0: 0, G, BASE, inIsland, floorOf: (x, z) => (rim(x, z) ? 0 : BASE) }, own, undefined, { ...look, bare: true });
    plinth(bp, ox + BW, D, info, (x, z) => inIsland(x, z));
  });
  bp.tag = ''; bp.compact = true; bp.pack();
  const W = 4 * BW + 3 * GAP;
  return { id: 'ko-hangang-swatch', title: 'Han water swatch', caption: 'Han water swatch', subtitle: 'test scene', size: [W, D], center: [W / 2, G, D / 2], base: BASE, camera: { az: 0, el: 0.45, dist: 95 } };
}
