// China · Shanghai v2 (2026-10-03) — the Huangpu bend as a floating island. Eric on v1 (50/100): a rectangle with a straight river, the
// trio in a row, the same lawn and the same plane trees on both banks, the Bund as tall as Jin Mao. v2:
//   outline   the river's real bend: it runs north past the Bund, swings east round the Lujiazui point and leaves the island at the back
//             right; the land north of the bend is cut away, so the island is the Bund bank plus the Pudong peninsula
//   Puxi      old Shanghai: grey stone paving, the Bund street, plane trees only here, the shikumen lane as two facing terraces with the lane
//             open (a resident sweeping, a bicycle against the wall, laundry), the Bund promenade with cast-iron lamps and the auntie
//   Pudong    new Shanghai: the Lujiazui lawn with white paths and modern lamps, the circular footbridge, the Pearl on the river and the
//             trio in their real triangle (Jin Mao, SWFC east of it, the Shanghai Tower south-west), an office worker in a suit. The Pearl
//             moved from the bend's point down to the straight reach: from the south camera the point lies behind the trio, and the
//             four towers are spread so their screen positions never overlap (s = x cos az − z sin az, ≥ half-widths + 2 apart)
//   river     jade water, a sightseeing boat on the straight reach and a sand barge on the bend
//   heights   the set's one table (docs/countries/china.md §1.9): ST 110 > SWFC 93 > Pearl 86 > Jin Mao 80 ≫ Bund 41–57 > houses 30 > trees ≈ 20
// Island DNA as every set: base 3, two bricks of earth, a capped stone plinth one cell outside, water two plates below the land.
// Grid: x west → east, z north → south (north at the back); the camera looks from the south-south-east.
import { Blueprint } from '../core/builder';
import { Reserve, Sites, patch, minifig2, tree, type SceneMeta, type GlowRule } from './lib';

type Pt = [number, number];
const segDist = (px: number, pz: number, [ax, az]: Pt, [bx, bz]: Pt) => { const vx = bx - ax, vz = bz - az; const t = Math.max(0, Math.min(1, ((px - ax) * vx + (pz - az) * vz) / (vx * vx + vz * vz))); return Math.hypot(px - ax - t * vx, pz - az - t * vz); };
const near = (px: number, pz: number, line: Pt[]) => Math.min(...line.slice(1).map((b, k) => segDist(px, pz, line[k], b)));

/** Night (Eric 2026-10-03: the Bund glows warm yellow, Pudong's towers each carry their own lights): the Bund floodlit gold with lit
 *  windows, the lane's windows warm, the Pearl pink, Jin Mao gold, the Shanghai Tower's bands and glass cool white-blue, the SWFC's rims
 *  white, the footbridge a blue ring, lamps and boats lit. Colours are emissive; everything else falls to moonlight. */
const BUND = new Set(['peace', 'customs', 'hsbc']);
const glow: GlowRule = (tag, color) => {
  if (BUND.has(tag)) return color === 'TransVeryLightBlue' ? 0xffc35a : color === 'Tan' ? 0x5c3f14 : color === 'DarkTan' ? 0x3a2a10 : color === 'White' ? 0xfff2cc : color === 'DarkGreen' ? 0x0f4a2c : color === 'LightBluishGray' ? 0x3a3a44 : null;
  if (tag === 'shikumen') return color === 'TransBlack' ? 0xffaa44 : color === 'LightBluishGray' ? 0x2a2a30 : null;
  if (tag === 'lamps') return color === 'TransClear' ? 0xffe0a0 : color === 'White' ? 0xe6f2ff : null;
  if (tag === 'pearl') return color === 'Magenta' ? 0xff3d9a : color === 'Tan' ? 0x6a3a7a : color === 'LightBluishGray' ? 0x404a70 : null;
  if (tag === 'jinmao') return color === 'FlatSilver' ? 0xffc060 : color === 'LightBluishGray' ? 0x8a6a30 : null;
  if (tag === 'shtower') return color === 'White' ? 0xd8f0ff : color === 'TransVeryLightBlue' ? 0x123a64 : null;
  if (tag === 'swfc') return color === 'FlatSilver' ? 0xe8f4ff : color === 'SandBlue' ? 0x0c1a38 : color === 'TransClear' ? 0xffffff : null;
  if (tag === 'skyring') return color === 'White' ? 0x7fc0ff : null;
  if (tag === 'boats') return color === 'Black' ? 0xffcf70 : null;
  if (tag === 'fountain') return 0x9fe0ff;
  return null;
};

export function buildShanghai(bp: Blueprint): SceneMeta {
  const W = 100, D = 62; const R = new Reserve(); const ground = new Sites(2);
  const G = 10, WATER_TOP = 8, BASE = 3;
  // the Huangpu's centre line (south → north-east) and half width
  const RIVER: Pt[] = [[51, 66], [52, 40], [60, 16], [60, -4]]; const HALF = 6;   // Eric 2026-10-03: north–south with one gentle S, not a half-circle (the half-circle left a bank empty)
  const riverD = (x: number, z: number) => near(x + 0.5, z + 0.5, RIVER);
  /** which bank: Puxi lies left of the river line (west, then north), Pudong right — the side of the nearest segment */
  const puxi = (x: number, z: number) => { const px = x + 0.5, pz = z + 0.5; let best = Infinity, side = 0;
    for (let k = 1; k < RIVER.length; k++) { const a = RIVER[k - 1], b = RIVER[k]; const d = segDist(px, pz, a, b); if (d < best) { best = d; side = (b[0] - a[0]) * (pz - a[1]) - (b[1] - a[1]) * (px - a[0]); } }
    return side < 0; };
  const base = (x: number, z: number) => { const cx = x + 0.5, cz = z + 0.5; return ((cx - W / 2) / (W / 2 - 0.5)) ** 4 + ((cz - D / 2) / (D / 2 - 0.5)) ** 4 < 1; };

  const inIsland = (x: number, z: number) => x >= 0 && z >= 0 && x < W && z < D && base(x, z);
  const isWater = (x: number, z: number) => inIsland(x, z) && riverD(x, z) < HALF;
  const edgeDist = (x: number, z: number) => { for (let r = 1; r <= 3; r++) for (let dx = -r; dx <= r; dx++) for (let dz = -r; dz <= r; dz++) if (Math.max(Math.abs(dx), Math.abs(dz)) === r && !inIsland(x + dx, z + dz)) return r; return 9; };
  const floorOf = (x: number, z: number) => (edgeDist(x, z) <= 3 ? 0 : BASE);
  const earth = (y: number) => (y < 6 ? 'DarkBluishGray' : y < 9 ? 'ReddishBrown' : 'MediumNougat');
  const studCells = new Set<string>(); const keep = (x0: number, z0: number, w: number, d: number) => { for (let x = x0; x < x0 + w; x++) for (let z = z0; z < z0 + d; z++) studCells.add(x + ',' + z); };
  const wetStuds = new Set<string>(); const wet = (x0: number, z0: number, w: number, d: number) => { for (let x = x0; x < x0 + w; x++) for (let z = z0; z < z0 + d; z++) wetStuds.add(x + ',' + z); };

  // ---- what stands where (footprints after rotation)
  const LANE = { x: 1, z: 12 };                                                    // the shikumen lane 25 × 22: two south-facing terraces, the gatehouse at the east end
  const BX = 31, PEACE = 8, CUSTOMS = 20, HSBC = 37;                              // the Bund buildings, rot 3 (fronts east to the river)
  const PEARL = { x: 67, z: 3 }, JINMAO = { x: 80, z: 22 }, SWFC = { x: 88, z: 26 }, ST = { x: 70, z: 38 }, RING = { x: 79, z: 6 };   // the real plan seen from the Bund: the Pearl north-west at the river, Jin Mao, the SWFC east of it (wide face to the Bund), the Shanghai Tower south of Jin Mao
  const CRUISE = { x: 50, z: 30 }, BARGE = { x: 58, z: 2 };   // the small sightseeing boat mid-river on the bend, the big barge up the north reach
  keep(LANE.x, LANE.z, 25, 22);
  keep(BX, PEACE, 10, 10); keep(BX, CUSTOMS, 10, 15); keep(BX, HSBC, 10, 20);
  keep(PEARL.x, PEARL.z, 10, 10); keep(JINMAO.x, JINMAO.z, 7, 7); keep(SWFC.x, SWFC.z, 8, 8); keep(ST.x, ST.z, 10, 10);
  for (const [x, z] of [[-4.5, 0.5], [4.5, -0.5], [0.5, 4.5], [-0.5, -4.5]]) keep(RING.x + 5 + x - 0.5, RING.z + 5 + z - 0.5, 1, 1);
  wet(CRUISE.x, CRUISE.z, 4, 12);
  const WAKE: Pt[] = [[CRUISE.x + 1, CRUISE.z + 12], [CRUISE.x + 2, CRUISE.z + 13], [CRUISE.x, CRUISE.z + 14], [CRUISE.x + 3, CRUISE.z + 14], [CRUISE.x - 1, CRUISE.z + 1], [CRUISE.x + 4, CRUISE.z + 1],   // the boat's wake astern and a bow wave either side
    [BARGE.x + 1, BARGE.z + 16], [BARGE.x + 2, BARGE.z + 16], [BARGE.x - 1, BARGE.z + 14], [BARGE.x + 4, BARGE.z + 14]]; for (const [x, z] of WAKE) wetStuds.add(x + ',' + z); wet(BARGE.x, BARGE.z, 4, 16);
  const street = (x: number) => x >= 27 && x < 31;
  const promenade = (x: number, z: number) => x >= 41 || (z < PEACE && x >= 31);                         // the Bund promenade along the water
  const pudongWalk = (x: number, z: number) => riverD(x, z) < HALF + 3;
  const dist = (x: number, z: number, o: { x: number; z: number }, s: number) => Math.hypot(x + 0.5 - (o.x + s / 2), z + 0.5 - (o.z + s / 2));
  const plaza = (x: number, z: number) => dist(x, z, PEARL, 10) < 7.5, ringPlaza = (x: number, z: number) => dist(x, z, RING, 10) < 6.5;
  const towerPlaza = (x: number, z: number) => ([[JINMAO, 7], [SWFC, 8], [ST, 10]] as [{ x: number; z: number }, number][]).some(([p, n]) => x >= p.x - 1 && x < p.x + n + 1 && z >= p.z - 1 && z < p.z + n + 1);
  const PATHS: Pt[][] = [[[72, 15], [78, 19], [84, 21]], [[78, 30], [79, 36]], [[86, 48], [92, 40]], [[66, 30], [72, 34]]];   // Lujiazui lawn paths joining the plazas
  const path = (x: number, z: number) => PATHS.some((pl) => near(x + 0.5, z + 0.5, pl) < 1);
  const FIG = { resident: [28.5, 23.5, 3] as const, tourist: [72.5, 21.5, 2] as const, worker: [79.5, 52.5, 0] as const, worker2: [93.5, 51.5, 3] as const };
  const DANCERS: [number, number, number][] = [[45.5, 7.5, 1], [50.5, 7.5, 1], [45.5, 12.5, 1], [50.5, 12.5, 1], [48.5, 16.5, 1]];   // square dancing in front of the Peace Hotel: four aunties with red fans and an old man
  for (const [fx, fz] of DANCERS) keep(Math.floor(fx) - 1, Math.floor(fz) - 1, 3, 3);
  for (const [fx, fz] of Object.values(FIG)) keep(Math.floor(fx) - 1, Math.floor(fz) - 1, 3, 3);
  const BENCHES: [number, number, number][] = [[42, 18, 1], [42, 48, 1], [6, 41, 0], [20, 42, 0]];   // x, z, rot (1: along z) — a 1×4 wooden seat on two plate legs
  for (const [x, z, r] of BENCHES) r ? keep(x, z, 1, 4) : keep(x, z, 4, 1);
  const SPEAKER: Pt = [51, 15]; keep(SPEAKER[0], SPEAKER[1], 1, 3);               // the dancers' boombox by the old man, its speakers facing the river (Eric 2026-10-03)
  // the Bund railing: on the last promenade cell before the water, in straight runs of four along z
  const fence: Pt[] = []; for (let z = 0; z < D; z++) { let e = -1; for (let x = 31; x < 60; x++) { if (isWater(x, z)) { e = x - 1; break; } } if (e < 0 || !puxi(e, z) || !inIsland(e, z)) continue; fence.push([e, z]); }
  const fenceRuns: Pt[] = []; for (let k = 0; k + 3 < fence.length; ) { const [x, z] = fence[k]; if ([1, 2, 3].every((d) => fence[k + d] && fence[k + d][0] === x && fence[k + d][1] === z + d) && z >= 2) { if (x >= 43 && ![[42, 13], [42, 26], [42, 44], [42, 54]].some(([lx, lz]) => x <= lx + 1 && x >= lx && lz + 1 >= z && lz <= z + 3) && !BENCHES.some(([bx, bz, br]) => br && bx === x && bz <= z + 3 && bz + 3 >= z)) { fenceRuns.push([x, z]); keep(x, z, 1, 4); } k += 4; } else k++; }   // runs that would meet a lamp are left out
  const BIKE = { x: 11, z: 38 }; keep(BIKE.x, BIKE.z, 6, 2);                    // parked under the plane trees

  const BUNDLAMPS: Pt[] = [[42, 13], [42, 26], [42, 44], [42, 54]]; for (const [x, z] of BUNDLAMPS) keep(x, z, 2, 2);
  const PLANES: Pt[] = [[6, 47], [17, 47], [12, 55], [23, 54]]; for (const [x, z] of PLANES) keep(x - 1, z - 1, 2, 2);   // in rows nine apart, crowns clear of each other (judge r1); trunks need studs
  const POOL = { x: 82, z: 48, w: 9, d: 7 };                                     // a reflecting pool with a fountain on the Lujiazui lawn (Eric: the front right was empty)
  const pool = (x: number, z: number) => x >= POOL.x && x < POOL.x + POOL.w && z >= POOL.z && z < POOL.z + POOL.d;
  const FOUNTAIN: Pt = [POOL.x + 4, POOL.z + 3]; keep(FOUNTAIN[0], FOUNTAIN[1], 1, 1);
  const CAMPHOR: Pt[] = [[66, 54], [72, 57], [95, 45]]; for (const [x, z] of CAMPHOR) keep(x - 1, z - 1, 2, 2);   // camphor trees (香樟), Pudong's evergreen street tree: a small green umbrella, not the plane
  const BEDS: [number, number, number, number][] = [[69, 49, 5, 2], [84, 56, 5, 2], [82, 38, 2, 4]]; for (const [x, z, w, d] of BEDS) keep(x, z, w, d);   // flower beds on the lawn
  const PBENCH: [number, number, number][] = [[83, 46, 0], [71, 52, 0]]; for (const [x, z, r] of PBENCH) r ? keep(x, z, 1, 4) : keep(x, z, 4, 1);   // benches by the pool and the beds
  const MODLAMPS: Pt[] = [[71, 18], [87, 20], [70, 33], [88, 44]]; for (const [x, z] of MODLAMPS) keep(x, z, 1, 1);

  bp.tag = 'terrain';
  for (let x = 0; x < W; x++) for (let z = 0; z < D; z++) {
    if (!inIsland(x, z)) continue;
    if (isWater(x, z)) { for (let y = floorOf(x, z); y < 6; y++) bp.vox1('brick', x, y, z, earth(y)); bp.vox1('plate', x, 6, z, patch(x, z, 4, 5) < 0.6 ? 'DarkGreen' : 'Green'); bp.vox1(wetStuds.has(x + ',' + z) || patch(x, z, 1, 33) < 0.06 ? 'plate' : 'tile', x, 7, z, 'TransLightBlue'); R.add(x, z, 1, 1); continue; }   // jade water
    for (let y = floorOf(x, z); y < G - 1; y++) bp.vox1('brick', x, y, z, earth(y));
    const k = studCells.has(x + ',' + z); const top = (c: string) => bp.vox1(k ? 'plate' : 'tile', x, G - 1, z, c);
    if (puxi(x, z)) {
      if (riverD(x, z) < HALF + 1) top('DarkBluishGray');                                                    // the flood wall's coping at the water
      else if (street(x)) top('DarkBluishGray');                                                               // the Bund street (a dashed white line read as scattered bricks, judge r2)
      else if (promenade(x, z)) top(z % 5 === 0 ? 'DarkBluishGray' : 'LightBluishGray');                     // pale slabs with dark cross bands
      else top(x % 4 === 0 || z % 4 === 0 ? 'DarkBluishGray' : 'LightBluishGray');                          // old granite paving in a regular grid of dark joints
    } else if (pool(x, z)) { bp.vox1('plate', x, G - 2, z, 'DarkAzure'); const edge = x === POOL.x || x === POOL.x + POOL.w - 1 || z === POOL.z || z === POOL.z + POOL.d - 1; bp.vox1(edge ? 'tile' : k ? 'plate' : 'tile', x, G - 1, z, edge ? 'White' : 'TransLightBlue'); }
    else if (pudongWalk(x, z) || plaza(x, z) || ringPlaza(x, z) || towerPlaza(x, z) || path(x, z)) top(plaza(x, z) && dist(x, z, PEARL, 10) > 6.5 ? 'DarkBluishGray' : 'White');   // white granite plazas and paths
    else bp.vox1('plate', x, G - 1, z, k ? 'White' : 'BrightGreen');                                       // the Lujiazui lawn, one even green
  }
  for (let x = -1; x <= W; x++) for (let z = -1; z <= D; z++) {
    if (inIsland(x, z)) continue; if (![[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dz]) => inIsland(x + dx, z + dz))) continue;
    for (let y = 0; y < 6; y++) bp.vox1('brick', x, y, z, 'DarkBluishGray'); bp.vox1('tile', x, 6, z, 'DarkBluishGray');
  }

  // ---- Puxi
  bp.tag = 'shikumen'; ground.add('shikumen', 13.5, 23, 10);
  bp.assembly('shikumen', LANE.x, G, LANE.z, 'DarkBluishGray', 0);
  R.add(LANE.x, LANE.z, 25, 22);
  bp.tag = 'peace'; bp.assembly('peace', BX, G, PEACE, 'Tan', 3); bp.tag = 'customs'; bp.assembly('customs', BX, G, CUSTOMS, 'Tan', 3, { '14769|White': 'clock_customs' }); bp.tag = 'hsbc'; bp.assembly('hsbc', BX, G, HSBC, 'Tan', 3);
  R.add(BX, PEACE, 10, 10); R.add(BX, CUSTOMS, 10, 15); R.add(BX, HSBC, 10, 20);
  for (const [n, z, r] of [['peace', PEACE + 5, 4], ['customs', CUSTOMS + 7.5, 5], ['hsbc', HSBC + 10, 5]] as const) ground.add(n, BX + 5, z, r, 'bund');
  bp.tag = 'lamps'; for (const [x, z] of BUNDLAMPS) { bp.assembly('bundlamp', x, G, z, 'Black'); R.add(x, z, 2, 2); }
  bp.tag = 'bike'; bp.assembly('bike', BIKE.x, G, BIKE.z, 'Black', 1); R.add(BIKE.x, BIKE.z, 6, 2);
  bp.tag = 'furniture';
  for (const [x, z, r] of BENCHES) { const [lx, lz] = r ? [0, 3] : [3, 0]; bp.part('plate_1x1', x, G, z, 'DarkBluishGray'); bp.part('plate_1x1', x + lx, G, z + lz, 'DarkBluishGray'); bp.part('tile_1x4', x, G + 1, z, 'ReddishBrown', r ? 0 : 1); R.add(x, z, r ? 1 : 4, r ? 4 : 1); }
  bp.part('boombox', SPEAKER[0], G, SPEAKER[1], 'Black', 1); R.add(SPEAKER[0], SPEAKER[1], 1, 3);
  for (const [x, z] of fenceRuns) { bp.part('fence_1x4', x, G, z, 'Black', 1); R.add(x, z, 1, 4); }


  // ---- Pudong
  bp.tag = 'pearl'; ground.add('pearl', PEARL.x + 5, PEARL.z + 5, 5); bp.assembly('pearl', PEARL.x, G, PEARL.z, 'Tan'); R.add(PEARL.x, PEARL.z, 10, 10);
  bp.tag = 'jinmao'; bp.assembly('jinmao', JINMAO.x, G, JINMAO.z, 'LightBluishGray'); R.add(JINMAO.x, JINMAO.z, 7, 7);
  bp.tag = 'swfc'; bp.assembly('swfc', SWFC.x, G, SWFC.z, 'SandBlue', 1); R.add(SWFC.x, SWFC.z, 8, 8);
  bp.tag = 'shtower'; bp.assembly('shtower', ST.x, G, ST.z, 'TransVeryLightBlue'); R.add(ST.x, ST.z, 10, 10);
  for (const [n, x, z, r] of [['jinmao', JINMAO.x + 3.5, JINMAO.z + 3.5, 3.5], ['swfc', SWFC.x + 4, SWFC.z + 4, 4], ['shtower', ST.x + 5, ST.z + 5, 5]] as const) ground.add(n, x, z, r, 'lujiazui');
  bp.tag = 'skyring'; bp.assembly('skyring', RING.x, G, RING.z, 'White'); R.add(RING.x, RING.z, 10, 10);
  bp.tag = 'fountain'; { const [x, z] = FOUNTAIN; bp.part('round_1x1', x, G, z, 'TransClear'); bp.part('round_1x1', x, G + 3, z, 'TransClear'); bp.part('roundtile_1x1', x, G + 6, z, 'TransClear'); R.add(x, z, 1, 1); }
  bp.tag = 'beds'; const FLOWERS = ['BrightPink', 'Yellow', 'White', 'DarkPink', 'BrightLightOrange'];
  for (const [x0, z0, w, d] of BEDS) for (let x = x0; x < x0 + w; x++) for (let z = z0; z < z0 + d; z++) { bp.part('flower_1x1', x, G, z, FLOWERS[(x + 2 * z) % FLOWERS.length]); R.add(x, z, 1, 1); }
  for (const [x, z, r] of PBENCH) { const [lx, lz] = r ? [0, 3] : [3, 0]; bp.part('plate_1x1', x, G, z, 'DarkBluishGray'); bp.part('plate_1x1', x + lx, G, z + lz, 'DarkBluishGray'); bp.part('tile_1x4', x, G + 1, z, 'White', r ? 0 : 1); R.add(x, z, r ? 1 : 4, r ? 4 : 1); }
  bp.tag = 'lamps'; for (const [x, z] of MODLAMPS) { bp.assembly('modlamp', x, G, z, 'DarkBluishGray'); R.add(x, z, 1, 1); }

  // ---- the river: a sightseeing boat heading north up the straight reach, a sand barge going down round the bend
  bp.tag = 'wake'; for (const [x, z] of WAKE) if (isWater(x, z)) { bp.part('roundtile_1x1', x, WATER_TOP, z, 'White'); R.add(x, z, 1, 1); }   // ripples: white round tiles on the water's studs
  bp.tag = 'boats'; bp.assembly('cruise', CRUISE.x, WATER_TOP, CRUISE.z, 'White', 1); bp.assembly('barge', BARGE.x, WATER_TOP, BARGE.z, 'Black', 3);

  // ---- life layer: three people, each doing one legible thing
  bp.tag = 'minifig';
  DANCERS.forEach(([x, z, r], i) => { ground.add('dancer' + i, x, z, 1); const man = i === 4; minifig2(bp, x, G, z, r, man ? { legs: 'DarkBluishGray', torso: 'White', face: 'face_uncle', hair: 'LightBluishGray', hairKey: 'hair_short', poses: { L: 'u', R: 'f' } } : { legs: 'Black', torso: ['BrightRed', 'White', 'Magenta', 'MediumAzure'][i], face: ['face_smile', 'face_laugh', 'face_smile', 'face_grin'][i], hair: i % 2 ? 'DarkBluishGray' : 'Black', hairKey: 'hair_short', poses: { L: 'u' }, hold: [{ key: 'hand_fan', color: 'BrightRed', hand: 'R' }] }, R); });   // the square dance: fans up, the old man with his arm raised
  { const [x, z, r] = FIG.resident; minifig2(bp, x, G, z, r, { legs: 'DarkBlue', torso: 'White', face: 'face_uncle', torsoPrint: 'torso_vendor', hair: 'DarkBluishGray', hairKey: 'hair_tousled', hold: [{ key: 'pushbroom', color: 'Tan', hand: 'R' }] }, R); }   // sweeping the lane
  { const [x, z, r] = FIG.worker; ground.add('worker', x, z, 1); minifig2(bp, x, G, z, r, { legs: 'DarkBluishGray', torso: 'DarkBluishGray', torsoPrint: 'torso_suit', face: 'face_glasses', hair: 'Black', hairKey: 'hair_short', hold: [{ key: 'briefcase', color: 'Black', hand: 'R' }] }, R); }   // the Lujiazui office worker in a suit with his briefcase
  { const [x, z, r] = FIG.worker2; ground.add('worker2', x, z, 1); minifig2(bp, x, G, z, r, { legs: 'Black', torso: 'Black', torsoPrint: 'torso_suit', face: 'face_smile', hair: 'DarkBrown', hairKey: 'hair_long', hold: [{ key: 'takeaway_cup', color: 'White', hand: 'R' }], poses: { L: 'h' } }, R); }   // a colleague with her takeaway coffee, the other hand at her phone-height
  { const [x, z, r] = FIG.tourist; ground.add('tourist', x, z, 1); minifig2(bp, x, G, z, r, { legs: 'Tan', torso: 'Orange', face: 'face_grin', hair: 'DarkBrown', hairKey: 'hair_tousled', hold: [{ key: 'camera', color: 'Black', hand: 'R' }] }, R); }   // a tourist photographing the Pearl

  // ---- plane trees: Puxi only — the square south of the lane and the north corner
  const dry = (x0: number, z0: number, w: number, d: number) => { for (let x = x0; x < x0 + w; x++) for (let z = z0; z < z0 + d; z++) if (!inIsland(x, z) || isWater(x, z) || R.has(x, z) || !puxi(x, z)) return false; return true; };
  bp.tag = 'camphor'; CAMPHOR.forEach(([x, z], i) => { try { ground.add('camphor' + i, x, z, 2); } catch { return; } tree(bp, x, G, z, 'S', R, i, undefined, 'raintree'); });
  PLANES.forEach(([x, z], i) => { if (!dry(x - 2, z - 2, 4, 4)) return; try { ground.add('plane' + i, x, z, 2.5); } catch { return; } tree(bp, x, G, z, i % 3 ? 'M' : 'L', R, i, undefined, 'plane'); });
  bp.tag = ''; bp.pack();
  return { id: 'shanghai', title: 'China', caption: 'Shanghai', subtitle: 'The Bund · shikumen · Oriental Pearl · Lujiazui', size: [W, D], center: [W / 2, 14, D / 2], base: BASE, camera: { az: 0, el: 0.55, dist: 160 } };   // night mode tried and switched off (Eric 2026-10-03: 感觉不是很好); `glow` stays in the file for a later try
}
