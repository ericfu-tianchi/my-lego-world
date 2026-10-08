// Seoul element test scene: the Bukchon district — hanok (anchae + gate wing, courtyard walls, chimney), the sloping alley, the neighbour's
// roof one step down, the alley-head ginkgo (docs/refs/seoul-hanok/SCHEME.md, BUILD.md). ?scene=ko-hanok&noglobe
// Tags: hanok, roof (the roofs are members of the hanok assemblies: ?only=hanok shows both), neighbour, alley, ginkgo.
import { Blueprint } from '../core/builder';
import { ginkgo, type SceneMeta } from './lib';

/** The district's plan in its own cells (x east, z south), origin = the north-west corner of the courtyard wall; heights relative to the
 *  courtyard level C. Every cell the district owns is listed in `cells` with its surface level and kind. */
const LOT = { x0: 0, x1: 17, z0: -3, z1: 14 };                        // the hanok lot at C (x 0..16, z −3..13)
const ALLEY = { x0: 17, x1: 21 };                                      // 4 wide, x 17..20
/** the alley steps down southward in flat 2-plate risers: level (relative to C) of alley row z */
export const alleyLevel = (z: number) => (z < 4 ? 0 : z < 8 ? -2 : z < 12 ? -4 : z < 16 ? -6 : -8);
const TERRACE = { x0: 21, x1: 30, z0: -3, z1: 9 };                     // east of the alley at C: the ginkgo's paving
const NEIGH = { x0: 21, x1: 30, z0: 9, z1: 18, level: -4 };            // the neighbour's lot (body x 24..28, z 9..17) at C − 4, three studs of paving along the alley
const LANE = { x0: 0, x1: 17, z0: 14, z1: 16, level: -2 };             // the lane in front of the gate wing
/** The visitor's standing spot at the alley head (the hanbok figure is built in another worktree): a 2 × 2 of bare plate studs at C,
 *  cells x 18..19, z 0..1 (district frame); she faces south, down the alley. */
export const VISITOR_SPOT = { x: 18, z: 0, w: 2, d: 2, level: 0, facing: 'south' };
/** The ginkgo's axis (a grid corner; trunk cells x 23..24, z 1..2) on the terrace, west side bare (toward the anchae's eave). */
export const GINKGO_AXIS = { x: 24, z: 3 };

/** Lay a column's ground from `base` to its surface level `top`: Dark Tan earth below `low` (the lowest neighbouring surface, so a step's
 *  face reads as granite, never as earth), Light Bluish Gray above it, and the surface course (`tile` = smooth pavers, `plate` = studs
 *  something stands on). */
function column(bp: Blueprint, x: number, z: number, base: number, top: number, low: number, kind: 'tile' | 'plate', color = 'LightBluishGray') {
  const g = Math.min(low, top - 2);
  for (let y = base; y < g; y++) bp.vox1('brick', x, y, z, 'DarkTan');
  for (let y = Math.max(base, g); y < top - 1; y++) bp.vox1('brick', x, y, z, 'LightBluishGray');
  bp.vox1(kind, x, top - 1, z, color);
}

/**
 * The Bukchon district at district origin (ox, oz) with courtyard level C, ground built up from plate `base`. Owns the cells x ox−0..ox+25,
 * z oz−3..oz+17 (see the plan constants above): it lays their ground itself and adds every owned cell to `own` (the island lays nothing there).
 * `ginkgoSize`: the alley-head ginkgo. `minLevel`: the lowest level relative to C (Seoul v2: −2, the district two plates above the street,
 * so the anchae's ridge stays below the gate's — the alley keeps one step, the neighbour stands a step down).
 */
export function placeBukchon(bp: Blueprint, ox: number, oz: number, C: number, base: number, own = new Set<string>(), ginkgoSize: 'L' | 'M' = 'L', minLevel = -99) {
  const al = (z: number) => Math.max(minLevel, alleyLevel(z)), NL = Math.max(minLevel, NEIGH.level);   // Seoul v2: the district on a lower terrace, the alley's steps clamped
  const k2 = (x: number, z: number) => `${x},${z}`; const studs = new Set<string>();   // surface cells left as plates (something stands on them)
  const stand = (x: number, z: number, w: number, d: number) => { for (let i = x; i < x + w; i++) for (let j = z; j < z + d; j++) studs.add(k2(i, j)); };
  // what stands on the ground (district cells): the hanok's assemblies, the visitor's spot, the ginkgo's trunk and fallen-leaf studs
  stand(10, 1, 7, 11); stand(0, 9, 6, 5); stand(0, 0, 10, 1); stand(0, 1, 1, 8); stand(6, 13, 11, 1); stand(6, 10, 2, 2); stand(5, 1, 4, 4); stand(7, 14, 1, 1); stand(10, 14, 1, 1);
  stand(VISITOR_SPOT.x, VISITOR_SPOT.z, 2, 2); stand(24, 9, 5, 9);
  const G = GINKGO_AXIS; stand(G.x - 1, G.z - 1, 2, 2);
  // fallen leaves: twelve bare studs under the crown, on the terrace and the alley head, never on the trunk or the visitor's spot
  const pool: [number, number][] = []; for (let x = 17; x < 30; x++) for (let z = -3; z < 9; z++) {
    const d = Math.hypot(x + 0.5 - G.x, z + 0.5 - G.z); const level0 = x >= 21 || z < 4; const taken = studs.has(k2(x, z));
    if (d > 1.6 && d < 4.2 && x >= 19 && level0 && !taken) pool.push([x, z]); }
  const leaves: [number, number][] = []; for (let k = 0; k < 12 && pool.length; k++) leaves.push(pool.splice(Math.floor(bp.rand() * pool.length), 1)[0]);
  for (const [x, z] of leaves) stand(x, z, 1, 1);
  // ground
  bp.tag = 'alley';
  const level = new Map<string, number>(); const set = (x: number, z: number, l: number) => level.set(k2(x, z), l);
  for (let x = LOT.x0; x < LOT.x1; x++) for (let z = LOT.z0; z < LOT.z1; z++) set(x, z, x <= 5 && z >= 9 ? LANE.level : 0);   // the gate wing stands on the lane level
  for (let x = LANE.x0; x < LANE.x1; x++) for (let z = LANE.z0; z < LANE.z1; z++) set(x, z, LANE.level);
  for (let x = ALLEY.x0; x < ALLEY.x1; x++) for (let z = -3; z < 18; z++) set(x, z, al(z));
  for (let x = TERRACE.x0; x < TERRACE.x1; x++) for (let z = TERRACE.z0; z < TERRACE.z1; z++) set(x, z, 0);
  for (let x = NEIGH.x0; x < NEIGH.x1; x++) for (let z = NEIGH.z0; z < NEIGH.z1; z++) set(x, z, NL);
  for (const [k, l] of level) {
    const [x, z] = k.split(',').map(Number); own.add(k2(ox + x, oz + z));
    const low = Math.min(l, ...[[1, 0], [-1, 0], [0, 1], [0, -1]].map(([dx, dz]) => level.get(k2(x + dx, z + dz)) ?? l));
    column(bp, ox + x, oz + z, base, C + l, C + low, studs.has(k) ? 'plate' : 'tile');
  }
  // granite where a lot stands above the alley: Brick 1 × 2 with Masonry Profile courses laid level from the lot's surface down, the last
  // one at most a plate below the alley (the plates under it are the step's own riser)
  const mason = (x: number, z0: number, z1: number, lotLvl: number) => {
    for (let z = z0; z < z1; ) {
      const pair = z + 1 < z1 && al(z) === al(z + 1); const foot = al(z);
      for (let y = C + lotLvl - 4; y >= C + foot - 2; y -= 3) { bp.clear(ox + x, y, oz + z, 1, 3, pair ? 2 : 1); bp.part(pair ? 'brick_masonry_1x2' : 'brick_1x1', ox + x, y, oz + z, 'LightBluishGray', pair ? 1 : 0); }
      z += pair ? 2 : 1;
    }
  };
  mason(16, 4, 14, 0); mason(21, 4, 9, 0); mason(21, 12, 18, NL);
  // the hanok
  bp.tag = 'hanok';
  bp.assembly('ko_anchae', ox + 10, C, oz + 1, 'White', 0, { '3004|SandRed': 'ko_meander' });
  bp.assembly('ko_gatewing', ox + 0, C + LANE.level, oz + 9, 'White', 0, { '87544|MediumNougat': 'ko_gate_leaf' });
  bp.assembly('ko_wall10', ox + 0, C, oz + 0, 'White', 0, { '3004|SandRed': 'ko_meander' });
  bp.assembly('ko_wall8', ox + 0, C, oz + 1, 'White', 3, { '3004|SandRed': 'ko_meander' });
  bp.assembly('ko_wall11', ox + 6, C, oz + 13, 'White', 0, { '3004|SandRed': 'ko_meander' });
  bp.assembly('ko_chimney', ox + 6, C, oz + 10, 'White');                     // the gulttuk stands apart in the courtyard's south corner
  // the jangdokdae: onggi jars on the stone pavers in the courtyard's north-east corner, big at the back, small in front
  bp.tag = 'jars';
  const jar = (x: number, z: number, c: string, tall: boolean) => { bp.part('roundbrick_2x2', ox + x, C, oz + z, c); if (tall) bp.part('roundbrick_2x2', ox + x, C + 3, oz + z, c); bp.part('dome_2x2', ox + x, C + (tall ? 6 : 3), oz + z, c); };
  jar(5, 1, 'DarkBrown', true); jar(7, 1, 'ReddishBrown', true); jar(5, 3, 'ReddishBrown', false);
  for (const [x, z, c] of [[7, 3, 'DarkBrown'], [8, 4, 'ReddishBrown'], [7, 4, 'DarkBrown']] as [number, number, string][]) { bp.part('round_1x1', ox + x, C, oz + z, c); bp.part('roundtile_1x1', ox + x, C + 3, oz + z, c); }
  bp.tag = 'hanok';
  bp.tag = 'hanok';   // a wooden bench against the courtyard wall in the lane, beside the gate
  for (const x of [7, 10]) bp.part('brick_1x1', ox + x, C + LANE.level, oz + 14, 'ReddishBrown');
  bp.part('tile_1x4', ox + 7, C + LANE.level + 3, oz + 14, 'MediumNougat', 1);
  bp.tag = 'neighbour';
  bp.assembly('ko_neighbour', ox + 24, C + NL, oz + 9, 'White', 0, { '3004|SandRed': 'ko_meander' });
  // the alley-head ginkgo, west side bare
  ginkgo(bp, ox + G.x, C, oz + G.z, ginkgoSize, undefined, 0, 1, leaves.map(([x, z]) => [ox + x, oz + z] as [number, number]));
  bp.tag = '';
  return own;
}

export function buildKoHanok(bp: Blueprint): SceneMeta {
  const W = 50, D = 28, OX = 5, OZ = 5, BASE = 1, C = 12;
  bp.tag = 'ground'; for (let x = 0; x < W; x += 8) for (let z = 0; z < D; z += 8) bp.part('plate_8x8', x, 0, z, 'LightBluishGray');
  placeBukchon(bp, OX, OZ, C, BASE);
  // the second ginkgo's size (M, for Samcheong-dong-gil by the palace wall) as a sample on the table
  const fall: [number, number][] = []; for (let x = 39; x < 48; x++) for (let z = 8; z < 17; z++) if ((x * 7 + z * 3) % 5 === 0 && Math.hypot(x - 43, z - 12) > 1.5) fall.push([x, z]);
  ginkgo(bp, 43, 1, 12, 'M', undefined, 1, undefined, fall);
  bp.tag = ''; bp.pack();
  return { id: 'ko-hanok', title: 'Bukchon hanok', caption: 'Bukchon hanok', subtitle: 'test scene', size: [W, D], center: [18, C, D / 2], base: BASE, camera: { az: 5.6, el: 0.45, dist: 75 } };
}
