// B · Singapore — Marina Bay as a floating garden island. The bay cuts in from the front edge and pools at the centre; Marina Bay Sands stands
// on the back-right skyline, the Supertree grove back-left, a terrace of Peranakan shophouses with a hawker stall on the west shore, the
// Merlion on the east promenade spouting into the bay; rain tree and palms, orchids, otters on the bank. Three people, each doing one thing.
// Same footprint, plinth, figure scale and restraint as Kyoto (docs/countries/singapore.md; brief judge/briefs/singapore.md).
import { Blueprint } from '../core/builder';
import { Reserve, Sites, patch, minifig2, tree, palm, bush, type SceneMeta } from './lib';
import { PARTS } from '../core/catalog';
import { shophouseRow, hawkerStall, iceCreamCart, orchidBed } from './singapore';
import { merlion3, mbs4, supertree4, skywalk4 } from './singapore-v3';

export function buildSingapore(bp: Blueprint): SceneMeta {
  const W = 56, D = 44; const R = new Reserve(); const ground = new Sites(2), canopy = new Sites(2);
  // ---- island: a full rounded rectangle (reclaimed land), the bay an inlet from the front edge widening into a lagoon at the centre
  const inIsland = (x: number, z: number) => { if (x < 0 || z < 0 || x >= W || z >= D) return false; if (x >= 40 && z <= 12) return true; const cx = x + 0.5, cz = z + 0.5; return ((cx - 28) / 27.5) ** 4 + ((cz - 22) / 21.5) ** 4 < 1; };   // back-right corner squared off: Marina Bay Sands stands on reclaimed land with a hard edge (Eric: terrain may bend for a landmark)
  const edgeDist = (x: number, z: number) => { for (let r = 1; r <= 3; r++) for (let dx = -r; dx <= r; dx++) for (let dz = -r; dz <= r; dz++) if (Math.max(Math.abs(dx), Math.abs(dz)) === r && !inIsland(x + dx, z + dz)) return r; return 9; };
  const LAGOON: [number, number, number, number] = [30, 24, 9, 6.5];                                    // centre, radii
  const inLagoon = (x: number, z: number) => ((x + 0.5 - LAGOON[0]) / LAGOON[2]) ** 2 + ((z + 0.5 - LAGOON[1]) / LAGOON[3]) ** 2 < 1;
  const inChannel = (x: number, z: number) => z >= 28 && x >= 27 && x <= 33 && !(z < 31 && (x === 27 || x === 33));   // the inlet mouth, 7 wide, slightly flared
  const inSea = (x: number, z: number) => ((x + 0.5 - 52) / 22) ** 2 + ((z + 0.5 - 46) / 14) ** 2 < 1;                              // the strait: an open bay biting into the front-right corner (Eric: 新加坡是海中绿洲), the channel runs out into it
  const isWater = (x: number, z: number) => inIsland(x, z) && (inLagoon(x, z) || inChannel(x, z) || inSea(x, z));
  const nearWater = (x: number, z: number, r: number) => { for (let dx = -r; dx <= r; dx++) for (let dz = -r; dz <= r; dz++) if (isWater(x + dx, z + dz)) return true; return false; };
  const G = 10; const WATER_TOP = 8;                                                                       // one flat level: reclaimed land; water two plates below the bank
  const street = (x: number, z: number) => (z >= 21 && z <= 22 && x >= 10 && x <= 20) || (x >= 17 && x <= 24 && z >= 35 && z <= 36);   // paved streets: five-foot way → lagoon; hawker tables → channel bank
  const promenade = (x: number, z: number) => !isWater(x, z) && (nearWater(x, z, 2) || street(x, z));       // granite promenade two studs wide around the bay, plus the streets
  const grass = (x: number, z: number) => (patch(x, z, 3, 7) < 0.22 ? 'Green' : 'BrightGreen');
  const BASE = 3; const floorOf = (x: number, z: number) => (edgeDist(x, z) <= 3 ? 0 : BASE);
  const earth = (y: number) => (y < 6 ? 'DarkBluishGray' : y < 9 ? 'ReddishBrown' : 'MediumNougat');
  const waterStuds = new Set(['35,24', '34,24', '35,23', '35,25']); for (let x = 38; x < 50; x++) for (const z of [37, 38, 39, 40]) waterStuds.add(x + ',' + z); for (let x = 33; x < 37; x++) for (const z of [40, 41]) waterStuds.add(x + ',' + z);   // Merlion column + foam; the ship and the bumboat on the strait
  const LAMPS: [number, number][] = [[14, 22], [31, 17], [35, 16], [36, 29]];
  const studCells = new Set<string>();                                                                     // promenade is tiled; only what stands on it keeps studs
  const keep = (x0: number, z0: number, w: number, d: number) => { for (let x = x0; x < x0 + w; x++) for (let z = z0; z < z0 + d; z++) studCells.add(x + ',' + z); };
  keep(40, 22, 8, 6); keep(26, 27, 8, 6); keep(34, 35, 2, 2); keep(37, 33, 2, 2); keep(47, 31, 2, 2); keep(20, 32, 5, 1); keep(25, 33, 1, 5); keep(18, 25, 2, 2); for (const [lx, lz] of LAMPS) keep(lx, lz, 1, 1);   // Merlion kerb, cart, uncle, otters, tourist, bench, lamps                                          // the Merlion's water column and its foam stand here: these cells get a stud on the water

  bp.tag = 'terrain';
  for (let x = 0; x < W; x++) for (let z = 0; z < D; z++) {
    if (!inIsland(x, z)) continue;
    if (isWater(x, z)) { for (let y = floorOf(x, z); y < 6; y++) bp.vox1('brick', x, y, z, earth(y)); bp.vox1('plate', x, 6, z, inSea(x, z) && !inLagoon(x, z) ? 'DarkBlue' : (patch(x, z, 2, 5) < 0.5 ? 'DarkBlue' : 'DarkAzure')); const stud = waterStuds.has(x + ',' + z) || (patch(x, z, 1, 33) < 0.12); bp.vox1(stud ? 'plate' : 'tile', x, 7, z, 'TransLightBlue'); R.add(x, z, 1, 1); continue; }
    for (let y = floorOf(x, z); y < G - 1; y++) bp.vox1('brick', x, y, z, earth(y));
    if (promenade(x, z)) bp.vox1(studCells.has(x + ',' + z) ? 'plate' : 'tile', x, G - 1, z, nearWater(x, z, 1) ? 'DarkBluishGray' : 'LightBluishGray'); else bp.vox1('plate', x, G - 1, z, grass(x, z));   // granite promenade: smooth tiles with a dark kerb line along the water; studs only where something stands
  }
  // plinth: two bricks of stone one cell outside the footprint, capped
  for (let x = -1; x <= W; x++) for (let z = -1; z <= D; z++) {
    if (inIsland(x, z)) continue; if (![[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dz]) => inIsland(x + dx, z + dz))) continue;
    for (let y = 0; y < 6; y++) bp.vox1('brick', x, y, z, 'DarkBluishGray'); bp.vox1('tile', x, 6, z, 'DarkBluishGray');
  }
  // the bay's mouth: the water runs to the island's edge; the plinth cap there is the sea wall
  // ---- landmarks
  for (const tx of [33, 42, 51]) ground.add('mbs-tower', tx, 4, 3.5, 'mbs'); mbs4(bp, 30, G, 2, 0, R);              // 21057-style towers x 30..54 on the squared corner, deck prow to x 25, podium z 8..10
  const GROVE: [number, number, number, number, number | undefined][] = [[9, 8, 7, 2, 3], [17, 8, 6, 0, 3], [19, 18, 5, 1, undefined]];   // x, z, bricks, spiral phase, ledge left bare for the skyway
  const trees = GROVE.map(([x, z, n, phase, bare]) => { ground.add('supertree', x, z, 2.5); return supertree4(bp, x, G, z, n, R, phase, bare); });
  { const e = trees[0].ledges.find((l) => l.dir === 1)!, w = trees[1].ledges.find((l) => l.dir === 3)!; if (e.level !== w.level) throw new Error('skyway ledges differ'); skywalk4(bp, 9, 17, 8, e.level); }
  for (const bz of [16.5, 21.5, 26.5]) ground.add('shophouse-bay', 7, bz, 3.5, 'shophouses'); shophouseRow(bp, 4, G, 30, 1, undefined, R, 'plaque_shophouse', 'tile_majolica', true);   // terrace along the west shore, five-foot way toward the bay (+x); x 3..10, z 14..29
  ground.add('hawker', 14, 36, 5); hawkerStall(bp, 12, G, 36, 1, { legs: 'Black', torso: 'White', face: 'face_hawker', torsoPrint: 'torso_hawker', hair: 'Black', hairKey: 'hair_short' }, 'sign_chickenrice', R);   // kiosk x 11..16, z 33..38, tables to x 20, facing the bay (+x)
  ground.add('merlion', 44, 24, 4); merlion3(bp, 42, G, 23, 0, WATER_TOP, R);   // studs-out statue on the east promenade, spouting west; kerb x 40..47, column and foam at (35, 24)
  // ---- supporting layer: ArtScience Museum (the lotus), promenade lamps, the Helix bridge, boats on the strait
  // ArtScience Museum: ten white fingers of unequal height round a bowl, each a slim round-brick column with an inverted slope flaring up and
  // outward and a round tile at the tip — the real lotus is asymmetric; it stands in its own lily pond, a lawn's width from the Shoppes
  bp.tag = 'artscience'; ground.add('artscience', 26, 13, 3.5); R.add(23, 10, 6, 6);
  bp.part('plate_6x6', 23, G, 10, 'MediumAzure');
  bp.part('roundbrick_2x2', 25, G + 1, 12, 'White'); bp.part('roundbrick_2x2', 25, G + 4, 12, 'White'); bp.part('dish_2x2', 25, G + 7, 12, 'LightBluishGray');   // the bowl with its skylight
  const PETALS: [number, number, number, number, number, number][] = [[25, 11, 25, 10, 2, 4], [26, 11, 26, 10, 2, 3], [25, 14, 25, 14, 0, 2], [26, 14, 26, 14, 0, 3], [27, 12, 27, 12, 1, 3], [27, 13, 27, 13, 1, 5], [24, 12, 23, 12, 3, 4], [24, 13, 23, 13, 3, 2]];   // column x, z · slope min x, z · rotation · bricks
  for (const [cx, cz, px, pz, rot, n] of PETALS) { for (let k = 0; k < n; k++) bp.part('round_1x1', cx, G + 1 + 3 * k, cz, 'White'); bp.part('slope_inv_1x2', px, G + 1 + 3 * n, pz, 'White', rot); const tip: [number, number] = rot === 2 ? [px, pz] : rot === 0 ? [px, pz + 1] : rot === 1 ? [px + 1, pz] : [px, pz]; bp.part('roundtile_1x1', tip[0], G + 4 + 3 * n, tip[1], 'White'); }
  for (const [cx, cz, rot] of [[24, 11, 2], [27, 14, 0]] as [number, number, number][]) { bp.part('round_1x1', cx, G + 1, cz, 'White'); bp.part('cheese_1x1', cx, G + 4, cz, 'White', rot); }   // two low outer fingers
  bp.tag = 'street';
  for (const [lx, lz] of LAMPS) { ground.add('lamp', lx, lz, 0.5); R.add(lx, lz, 1, 1); bp.part('roundplate_open', lx, G, lz, 'DarkBluishGray'); bp.part('bar_4l', lx, G + 1, lz, 'LightBluishGray'); bp.part('roundplate_open', lx, G + 8, lz, 'White'); }   // slim promenade lamps: bar through open studs
  // Helix Bridge: a tiled deck across the channel's neck under three white hoops, lattice rails outside them — the tube of spiralling steel at this scale
  bp.tag = 'bridge'; ground.add('helix', 30, 30, 2); R.add(26, 27, 8, 6);
  bp.part('plate_6x8', 26, G, 27, 'LightBluishGray', 1); for (const tx of [27, 28, 30, 31, 32]) bp.part('tile_1x2', tx, G + 1, 29, 'LightBluishGray', 0);
  for (const bx of [26, 30]) for (const bz of [27, 32]) bp.part('fence_lattice_1x4x2', bx, G + 1, bz, 'White');
  for (const hx of [26, 29, 33]) bp.part('arch_1x4x2', hx, G + 1, 28, 'White', 1);
  // boats on the strait: a container ship (grey hull, wedge bow, a block of coloured containers, white bridge, red funnel) and a red bumboat
  bp.tag = 'boat'; R.add(38, 37, 12, 4); R.add(33, 40, 4, 2);
  bp.part('plate_4x8', 42, WATER_TOP, 37, 'DarkBluishGray', 1); bp.part('wedge_4x2_r', 38, WATER_TOP, 37, 'DarkBluishGray', 2); bp.part('wedge_4x2_l', 38, WATER_TOP, 39, 'DarkBluishGray', 2);   // hull and prow
  bp.part('plate_2x6', 42, WATER_TOP + 1, 38, 'LightBluishGray', 1); bp.part('plate_2x2', 48, WATER_TOP + 1, 38, 'LightBluishGray'); for (const dx of [42, 46]) { bp.part('plate_1x4', dx, WATER_TOP + 1, 37, 'LightBluishGray', 1); bp.part('plate_1x4', dx, WATER_TOP + 1, 40, 'LightBluishGray', 1); }   // deck
  for (const [cx, col] of [[42, 'BrightRed'], [44, 'BrightBlue'], [46, 'Green']] as [number, string][]) { bp.part('plate_1x2', cx, WATER_TOP + 2, 38, col, 1); bp.part('plate_1x2', cx, WATER_TOP + 2, 39, col === 'Green' ? 'Yellow' : col, 1); bp.part('plate_1x2', cx, WATER_TOP + 3, 38, col === 'BrightRed' ? 'BrightBlue' : 'BrightRed', 1); }   // three bays of containers
  bp.part('brick_2x2', 48, WATER_TOP + 2, 38, 'White'); bp.part('tile_2x2', 48, WATER_TOP + 5, 38, 'White'); bp.part('roundplate_1x1', 49, WATER_TOP + 2, 40, 'BrightRed');   // bridge and funnel
  bp.part('plate_2x4', 33, WATER_TOP, 40, 'ReddishBrown', 1); bp.part('brick_1x2', 34, WATER_TOP + 1, 40, 'White', 1); bp.part('plate_1x2', 34, WATER_TOP + 4, 40, 'DarkGreen', 1); bp.part('roundplate_1x1', 33, WATER_TOP + 1, 40, 'BrightRed'); bp.part('roundplate_1x1', 36, WATER_TOP + 1, 41, 'Yellow');   // bumboat: the painted eye at the bow
  bp.tag = 'bush'; for (const [bx, bz] of [[47, 31], [39, 12], [13, 12]] as [number, number][]) { ground.add('bush', bx + 0.5, bz + 0.5, 1); bush(bp, bx, G, bz, undefined, R); }
  // ---- trees
  const plant = (name: string, x: number, z: number, r: number) => { ground.add(name, x, z, 1.5); canopy.add(name, x, z, r); };
  plant('raintree', 51, 27, 7); tree(bp, 51, G, 27, 'L', R, 0, undefined, 'raintree');                      // on the east lawn behind the Merlion's shoulder: off the hero sight-line to the Merlion and to the stall (a tree at the channel mouth hid the stall)
  plant('palm-N', 45, 14, 2); palm(bp, 45, G, 14, 4, 0, R);                                                 // palms north and south of the Merlion at a distance, registered by trunk
  plant('palm-S', 40, 32, 2); palm(bp, 40, G, 32, 3, 1, R);
  // ---- story layer: ice-cream uncle by the promenade, tourist framing the Merlion from the west bank, otters on the south bank, a mynah on the roof
  bp.tag = 'cart'; ground.add('cart', 35, 36, 2.5); iceCreamCart(bp, 34, G, 35, 0, 'LightBluishGray', R, 'cart_side');   // on the promenade at the channel's east bank, printed side toward the viewer; the uncle beside it
  bp.tag = 'minifig'; minifig2(bp, 38.5, G, 34.5, 3, { legs: 'DarkBlue', torso: 'White', face: 'face_uncle', torsoPrint: 'torso_vendor', hair: 'DarkBluishGray', hairKey: 'hair_tousled', hold: [{ key: 'icecream_cone', color: 'Tan', hand: 'R' }] }, R);
  ground.add('tourist', 18.5, 25.5, 1); minifig2(bp, 18.5, G, 25.5, 1, { legs: 'DarkTan', torso: 'Coral', face: 'face_grin', torsoPrint: 'torso_batik', hair: 'DarkBrown', hairKey: 'hair_tousled', hold: [{ key: 'camera', color: 'Black', hand: 'R' }] }, R);   // facing +x: the Merlion across the lagoon
  bp.tag = 'animals'; bp.part('otter', 22, G, 32, 'ReddishBrown', 1); R.add(20, 32, 5, 1); bp.part('otter', 25, G, 35, 'DarkBrown', 0); R.add(25, 33, 1, 5);   // two otters on the channel's west bank, below the bridge
  bp.part('songbird', 13, G + 17, 37, 'DarkBrown', 3);                                                      // mynah on the hawker's roof
  // ---- gardens: orchid bed by the terrace, bougainvillea at the pilasters, a few bank tufts
  bp.tag = 'orchid'; orchidBed(bp, [[16, 18], [17, 19], [18, 18], [16, 20], [18, 20], [17, 21]].filter(([x, z]) => !R.has(x, z) && !isWater(x, z) && !promenade(x, z)) as [number, number][], G, R);
  bp.tag = 'ground';
  for (const [x, z] of [[11, 14], [11, 29]] as [number, number][]) if (inIsland(x, z) && !R.has(x, z)) { bp.part('plant_3leaves', x, G, z, 'Green'); bp.part('flower_1x1', x, G + 1, z, 'DarkPink'); R.add(x, z, 1, 1); }
  bp.tag = 'tufts';
  for (const [x, z] of [[20, 36], [40, 33], [44, 12], [50, 22], [6, 38], [20, 12], [24, 6], [52, 40]] as [number, number][]) { if (!inIsland(x, z) || isWater(x, z) || R.has(x, z) || promenade(x, z)) continue; bp.part('roundplate_1x1', x, G, z, 'Green'); bp.part('grass_stem', x, G + 1, z, bp.pick(['BrightGreen', 'Lime', 'Green'])); R.add(x, z, 1, 1); }
  bp.tag = ''; bp.pack();
  return { id: 'singapore', title: 'Singapore', caption: 'Marina Bay', subtitle: 'Marina Bay Sands · Supertrees · Merlion · shophouses', size: [W, D], center: [W / 2, 11, D / 2], base: BASE, camera: { az: 0.62, el: 0.42, dist: 100 } };
}
export { PARTS };
