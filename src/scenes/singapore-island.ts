// B · Singapore v8 (2026-10-01) — Marina Bay as a floating garden island, in three layouts for Eric to compare (his notes on v7: too little
// tropical planting, the buildings sat in one front row and hid the Merlion, the two stalls touched, the tourist stood behind the Merlion;
// try several arrangements). All three share the landmarks (MBS v10, Merlion v6, the three-tree grove, the terrace v2, the stall, the cart),
// the life layer (hawker, ice-cream uncle, tourist photographing the Merlion from across the water; otters) and the island DNA (56 × 44,
// base 3, stone plinth, one land level, water two plates down). What differs is where the water is and who faces whom.
//   A · Bay centre     the lagoon in the middle, the Merlion on its west shore spouting east, the tourist on the east shore
//   B · Merlion Park   the bay across the front, the Merlion on a promontory at the right spouting west, a bumboat on the bay
//   C · Postcard       the Merlion straight in front of MBS facing the viewer, the lagoon in front of it, the terrace on the right
import { Blueprint } from '../core/builder';
import { Reserve, Sites, patch, minifig2, tree, palm, bush, type SceneMeta } from './lib';
import { hawkerStall, iceCreamCart, orchidBed, placer } from './singapore';
import { mbs10, merlion6, shophouse2, bumboat } from './singapore-v4';

type Pt = [number, number];
interface Layout {
  id: string; title: string;
  lagoon: [number, number, number, number];            // centre x, z, radius x, z
  mouth: [number, number, number, number, number];     // a channel from (x0, z0) to (x1, z1), half width
  grove: [number, number, number];                     // grove6 box min corner, rot
  merlion: [number, number, number, number];           // ox, oz, rot, jet reach
  terrace: [number, number, number];                   // shophouse2 ox, oz, rot
  hawker: [number, number, number];                    // stall ox, oz, rot
  cart: [number, number, number]; uncle: [number, number, number];
  tourist: [number, number, number];
  otters: [number, number, number][];                  // x, z, rot; swimming when the cell is water
  boat?: [number, number, number];
  rain: Pt[]; palms: Pt[]; bushes: Pt[];               // planting candidates; each is planted only if it fits (Sites, reservations, dry land)
  orchids: Pt;
}

const LAYOUTS: Record<string, Layout> = {
  a: { id: 'singapore', title: 'Singapore', lagoon: [34, 25, 11, 7.5], mouth: [40, 29, 56, 46, 4.2], grove: [3, 1, 0], merlion: [15, 21, 0, 9], terrace: [2, 42, 1], hawker: [21, 33, 0], cart: [38, 37, 0], uncle: [42.5, 38.5, 3], tourist: [47.5, 24.5, 3], otters: [[30, 26, 1], [36, 28, 1], [44, 33, 2]],
    rain: [[11, 17], [44, 15]], palms: [[13, 30], [10, 34], [26, 18], [53, 31], [16, 41], [48, 35], [21, 28], [52, 16]], bushes: [[11, 26], [14, 15], [20, 16], [42, 14], [50, 33], [46, 40], [8, 22], [26, 40]], orchids: [16, 31] },
  b: { id: 'singapore-b', title: 'Singapore · B', lagoon: [28, 33, 15, 8], mouth: [28, 38, 28, 46, 6], grove: [2, 1, 0], merlion: [51, 30, 2, 9], terrace: [3, 17, 0], hawker: [26, 15, 0], cart: [7, 36, 0], uncle: [11.5, 37.5, 3], tourist: [12.5, 30.5, 1], otters: [[32, 36, 1], [36, 35, 1], [18, 35, 3]], boat: [22, 29, 0],
    rain: [[46, 17], [6, 40]], palms: [[41, 24], [52, 20], [19, 23], [10, 26], [44, 42], [50, 38], [15, 41], [38, 19], [4, 31], [53, 41]], bushes: [[21, 15], [36, 16], [48, 24], [3, 26], [13, 26], [40, 41], [18, 40]], orchids: [32, 18] },
  c: { id: 'singapore-c', title: 'Singapore · C', lagoon: [26, 30, 12, 7.5], mouth: [18, 35, 0, 46, 4.2], grove: [2, 1, 0], merlion: [27, 12, 3, 10], terrace: [38, 14, 0], hawker: [45, 30, 0], cart: [8, 31, 0], uncle: [12.5, 32.5, 3], tourist: [31.5, 41.5, 2], otters: [[17, 30, 1], [31, 33, 3], [20, 35, 0]],
    rain: [[8, 21], [42, 17]], palms: [[18, 18], [35, 18], [14, 25], [40, 24], [38, 33], [44, 29], [20, 41], [30, 18], [3, 26], [52, 40]], bushes: [[11, 16], [16, 22], [36, 22], [39, 28], [45, 25], [24, 40], [35, 40]], orchids: [4, 21] },
};

export function buildSingaporeLayout(bp: Blueprint, L: Layout): SceneMeta {
  const W = 56, D = 44; const R = new Reserve(); const ground = new Sites(2), canopy = new Sites(2);
  const inIsland = (x: number, z: number) => { if (x < 0 || z < 0 || x >= W || z >= D) return false; if (x >= 18 && z <= 12) return true; const cx = x + 0.5, cz = z + 0.5; return ((cx - 28) / 27.5) ** 4 + ((cz - 22) / 21.5) ** 4 < 1; };
  const edgeDist = (x: number, z: number) => { for (let r = 1; r <= 3; r++) for (let dx = -r; dx <= r; dx++) for (let dz = -r; dz <= r; dz++) if (Math.max(Math.abs(dx), Math.abs(dz)) === r && !inIsland(x + dx, z + dz)) return r; return 9; };
  const [lx, lz, lrx, lrz] = L.lagoon; const inLagoon = (x: number, z: number) => ((x + 0.5 - lx) / lrx) ** 2 + ((z + 0.5 - lz) / lrz) ** 2 < 1;
  const segDist = (px: number, pz: number, ax: number, az: number, bx: number, bz: number) => { const vx = bx - ax, vz = bz - az; const t = Math.max(0, Math.min(1, ((px - ax) * vx + (pz - az) * vz) / (vx * vx + vz * vz))); return Math.hypot(px - ax - t * vx, pz - az - t * vz); };
  const [m0x, m0z, m1x, m1z, mw] = L.mouth; const inMouth = (x: number, z: number) => segDist(x + 0.5, z + 0.5, m0x, m0z, m1x, m1z) < mw;
  const isWater = (x: number, z: number) => inIsland(x, z) && (inLagoon(x, z) || inMouth(x, z));
  const nearWater = (x: number, z: number, r: number) => { for (let dx = -r; dx <= r; dx++) for (let dz = -r; dz <= r; dz++) if (isWater(x + dx, z + dz)) return true; return false; };
  const G = 10, WATER_TOP = 8;
  const promenade = (x: number, z: number) => !isWater(x, z) && nearWater(x, z, 2);
  const grass = (x: number, z: number) => (patch(x, z, 5, 7) < 0.22 ? 'Green' : 'BrightGreen');
  const BASE = 3; const floorOf = (x: number, z: number) => (edgeDist(x, z) <= 3 ? 0 : BASE);
  const earth = (y: number) => (y < 6 ? 'DarkBluishGray' : y < 9 ? 'ReddishBrown' : 'MediumNougat');
  const studCells = new Set<string>(); const keep = (x0: number, z0: number, w: number, d: number) => { for (let x = x0; x < x0 + w; x++) for (let z = z0; z < z0 + d; z++) studCells.add(x + ',' + z); };
  const waterStuds = new Set<string>(); const wet = (x: number, z: number) => waterStuds.add(x + ',' + z);

  // ---- what stands where (before the terrain, so the ground under each thing keeps its studs)
  const [mox, moz, mrot, reach] = L.merlion; const mc = placer(bp, mox, moz, mrot).cell;
  for (let x = -1; x <= 7; x++) for (let z = -1; z <= 5; z++) { const [cx, cz] = mc(x, z); keep(cx, cz, 1, 1); }
  for (let i = 0; i < reach; i++) { const [cx, cz] = mc(7 + i, 2); wet(cx, cz); } { const e = 7 + reach - 1; for (const [fx, fz] of [[e + 1, 2], [e, 1], [e, 3], [e - 1, 1]]) { const [cx, cz] = mc(fx, fz); wet(cx, cz); } }
  const [gx, gz, grot] = L.grove; keep(gx, gz, grot % 2 ? 13 : 16, grot % 2 ? 16 : 13);
  const keepLocal = (o: [number, number, number], x0: number, x1: number, z0: number, z1: number) => { const c = placer(bp, o[0], o[1], o[2]).cell; for (let x = x0; x <= x1; x++) for (let z = z0; z <= z1; z++) { const [cx, cz] = c(x, z); keep(cx, cz, 1, 1); } };
  keepLocal(L.terrace, 0, 15, 0, 6); keepLocal(L.hawker, -4, 3, -3, 9);
  keep(L.cart[0], L.cart[1], 2, 2); keep(Math.floor(L.uncle[0]) - 1, Math.floor(L.uncle[1]) - 1, 3, 3); keep(Math.floor(L.tourist[0]) - 1, Math.floor(L.tourist[1]) - 1, 3, 3);
  for (const [x, z, r] of L.otters) { keep(x, z, 1, 1); wet(x, z); const [bx, bz] = [[0, 1], [1, 0], [0, -1], [-1, 0]][r & 3]; wet(x - bx * 3, z - bz * 3); }
  if (L.boat) { const bc = placer(bp, L.boat[0], L.boat[1], L.boat[2]).cell; for (let x = 0; x < 10; x++) for (let z = 0; z < 4; z++) { const [cx, cz] = bc(x, z); wet(cx, cz); } }

  bp.tag = 'terrain';
  for (let x = 0; x < W; x++) for (let z = 0; z < D; z++) {
    if (!inIsland(x, z)) continue;
    if (isWater(x, z)) { for (let y = floorOf(x, z); y < 6; y++) bp.vox1('brick', x, y, z, earth(y)); bp.vox1('plate', x, 6, z, inMouth(x, z) && !inLagoon(x, z) ? 'DarkBlue' : (patch(x, z, 4, 5) < 0.5 ? 'DarkBlue' : 'DarkAzure')); bp.vox1(waterStuds.has(x + ',' + z) || patch(x, z, 1, 33) < 0.08 ? 'plate' : 'tile', x, 7, z, 'TransLightBlue'); R.add(x, z, 1, 1); continue; }
    for (let y = floorOf(x, z); y < G - 1; y++) bp.vox1('brick', x, y, z, earth(y));
    if (promenade(x, z)) bp.vox1(studCells.has(x + ',' + z) ? 'plate' : 'tile', x, G - 1, z, nearWater(x, z, 1) ? 'DarkBluishGray' : 'LightBluishGray'); else bp.vox1('plate', x, G - 1, z, grass(x, z));
  }
  for (let x = -1; x <= W; x++) for (let z = -1; z <= D; z++) {
    if (inIsland(x, z)) continue; if (![[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dz]) => inIsland(x + dx, z + dz))) continue;
    for (let y = 0; y < 6; y++) bp.vox1('brick', x, y, z, 'DarkBluishGray'); bp.vox1('tile', x, 6, z, 'DarkBluishGray');
  }

  // ---- landmarks
  for (const tx of [29, 39, 49]) ground.add('mbs-tower', tx, 3, 3.5, 'mbs'); mbs10(bp, 20, G, 1, 0, R);
  { const w = grot % 2 ? 13 : 16, d = grot % 2 ? 16 : 13; ground.add('grove', gx + w / 2, gz + d / 2, 6); R.add(gx - 2, gz - 2, w + 4, d + 4); bp.tag = 'supertree';   // the canopies and their fringe reach two studs past the box
     bp.assembly('grove6', gx, G, gz, 'Magenta', grot); }
  { const [cx, cz] = mc(3, 2); ground.add('merlion', cx + 0.5, cz + 0.5, 3.5); merlion6(bp, mox, G, moz, mrot, WATER_TOP, reach, R); }
  { const [tx, tz, tr] = L.terrace; const tc = placer(bp, tx, tz, tr).cell; for (const bxl of [2, 7, 12]) { const [cx, cz] = tc(bxl, 3); ground.add('shophouse', cx + 0.5, cz + 0.5, 3, 'terrace'); } shophouse2(bp, tx, G, tz, tr, R, 'plaque_shophouse', 'tile_majolica'); }
  { const [hx, hz, hr] = L.hawker; ground.add('hawker', hx + 0.5, hz + 2, 3.5); hawkerStall(bp, hx, G, hz, hr, { legs: 'Black', torso: 'White', face: 'face_hawker', torsoPrint: 'torso_hawker', hair: 'Black', hairKey: 'hair_short' }, 'sign_chickenrice', R); }

  // ---- life layer
  bp.tag = 'cart'; ground.add('cart', L.cart[0] + 1, L.cart[1] + 1, 1.5, 'uncle'); iceCreamCart(bp, L.cart[0], G, L.cart[1], L.cart[2], 'LightBluishGray', R, 'cart_side');
  bp.tag = 'minifig'; ground.add('uncle', L.uncle[0], L.uncle[1], 1, 'uncle'); minifig2(bp, L.uncle[0], G, L.uncle[1], L.uncle[2], { legs: 'DarkBlue', torso: 'White', face: 'face_uncle', torsoPrint: 'torso_vendor', hair: 'DarkBluishGray', hairKey: 'hair_tousled', hold: [{ key: 'icecream_cone', color: 'Tan', hand: 'R' }] }, R);
  ground.add('tourist', L.tourist[0], L.tourist[1], 1); minifig2(bp, L.tourist[0], G, L.tourist[1], L.tourist[2], { legs: 'DarkTan', torso: 'Coral', face: 'face_grin', torsoPrint: 'torso_batik', hair: 'DarkBrown', hairKey: 'hair_tousled', hold: [{ key: 'camera', color: 'Black', hand: 'R' }] }, R);
  // otters: on the bank, or swimming — on the water with a white wake behind (Marina Bay's otter families swim the bay daily)
  bp.tag = 'animals';
  for (const [x, z, r] of L.otters) {
    const sw = isWater(x, z); bp.part('otter', x, sw ? WATER_TOP : G, z, r % 2 ? 'ReddishBrown' : 'DarkBrown', r); R.add(x, z, 1, 1);
    // the body overhangs 1.5 studs, so the wake starts three cells behind the stud
    if (sw) { const [bx, bz] = [[0, 1], [1, 0], [0, -1], [-1, 0]][r & 3]; const wx = x - bx * 3, wz = z - bz * 3; if (isWater(wx, wz) && waterStuds.has(wx + ',' + wz)) bp.part('roundplate_1x1', wx, WATER_TOP, wz, 'White'); }
  }
  if (L.boat) { ground.add('boat', L.boat[0] + 5, L.boat[1] + 2, 3); bumboat(bp, L.boat[0], WATER_TOP, L.boat[1], L.boat[2], R); }

  // ---- planting (Eric: 热带植被太少): rain trees, palms, bougainvillea and ferns wherever there is room; a candidate is planted only on dry
  //      grass clear of everything (Sites spacing, reservations, promenade)
  const dry = (x0: number, z0: number, w: number, d: number) => { for (let x = x0; x < x0 + w; x++) for (let z = z0; z < z0 + d; z++) if (!inIsland(x, z) || isWater(x, z) || promenade(x, z) || R.has(x, z)) return false; return true; };
  const tryAdd = (name: string, x: number, z: number, r: number, cr: number) => { try { ground.add(name, x, z, r); } catch { return false; } try { canopy.add(name, x, z, cr); } catch { return false; } return true; };
  L.rain.forEach(([x, z], i) => { if (dry(x - 2, z - 2, 4, 4) && tryAdd('raintree' + i, x, z, 1.5, 5.5)) tree(bp, x, G, z, 'M', R, i, undefined, 'raintree'); });
  L.palms.forEach(([x, z], i) => { if (dry(x - 1, z - 1, 2, 2) && tryAdd('palm' + i, x, z, 1, 2.5)) palm(bp, x, G, z, 3 + (i % 2), i & 3, R); });
  const BOUG = ['DarkPink', 'Magenta', 'BrightPink'];
  L.bushes.forEach(([x, z], i) => { if (!dry(x, z, 2, 2) || !tryAdd('bush' + i, x + 1, z + 1, 1, 1)) return; bp.tag = 'bush'; bush(bp, x, G, z, ['Green', 'DarkGreen', 'BrightGreen'], R); bp.part('flower_1x1', x, G + 2, z, BOUG[i % 3]); });   // bougainvillea
  bp.tag = 'orchid'; { const [ox, oz] = L.orchids; orchidBed(bp, ([[ox, oz], [ox + 1, oz + 1], [ox + 2, oz], [ox, oz + 2], [ox + 2, oz + 2], [ox + 1, oz + 3]] as Pt[]).filter(([x, z]) => dry(x, z, 1, 1)), G, R); }
  bp.tag = 'tufts';   // ferns and grass scattered over the lawns
  for (let x = 0; x < W; x++) for (let z = 0; z < D; z++) {
    if (!dry(x, z, 1, 1)) continue; const r = patch(x, z, 1, 41); if (r > 0.045) continue;
    if (r < 0.02) { bp.part('roundplate_1x1', x, G, z, 'Green'); bp.part('grass_stem', x, G + 1, z, bp.pick(['BrightGreen', 'Lime', 'Green'])); } else bp.part('plant_3leaves', x, G, z, bp.pick(['Green', 'DarkGreen', 'BrightGreen']), Math.floor(bp.rand() * 4));
    R.add(x, z, 1, 1);
  }
  bp.tag = ''; bp.pack();
  return { id: L.id, title: L.title, caption: 'Marina Bay', subtitle: 'Marina Bay Sands · Supertrees · Merlion · shophouses', size: [W, D], center: [W / 2, 11, D / 2], base: BASE, camera: { az: 0.62, el: 0.42, dist: 100 } };
}
export const buildSingapore = (bp: Blueprint) => buildSingaporeLayout(bp, LAYOUTS.a);
export const buildSingaporeB = (bp: Blueprint) => buildSingaporeLayout(bp, LAYOUTS.b);
export const buildSingaporeC = (bp: Blueprint) => buildSingaporeLayout(bp, LAYOUTS.c);
