// B · Singapore v7 (2026-10-01) — Marina Bay as a floating garden island, laid out by docs/countries/singapore.md §1.9 (Eric approved the
// places 2026-09-25): four places, each with room and one person doing something. Marina Bay Sands along the back on a hard reclaimed edge;
// the Supertree Grove on the east lawn with the skyway (east of MBS, as Gardens by the Bay is); the Merlion on the west shore of the bay spouting east toward MBS (real geography); the
// shophouse terrace and the chicken-rice stall front-left, the ice-cream uncle on the south promenade. The bay is the calm centre and runs
// out to the strait at the front-right corner. No boats. Every landmark is an exploded assembly or real bricks (rule 12).
import { Blueprint } from '../core/builder';
import { Reserve, Sites, patch, minifig2, tree, palm, type SceneMeta } from './lib';
import { shophouseRow, hawkerStall, iceCreamCart, orchidBed } from './singapore';
import { mbs10, merlion6 } from './singapore-v4';

export function buildSingapore(bp: Blueprint): SceneMeta {
  const W = 56, D = 44; const R = new Reserve(); const ground = new Sites(2), canopy = new Sites(2);
  // ---- island: a rounded rectangle; the back edge behind MBS is squared off (reclaimed land, a hard sea wall)
  const inIsland = (x: number, z: number) => { if (x < 0 || z < 0 || x >= W || z >= D) return false; if (x >= 18 && z <= 12) return true; const cx = x + 0.5, cz = z + 0.5; return ((cx - 28) / 27.5) ** 4 + ((cz - 22) / 21.5) ** 4 < 1; };
  const edgeDist = (x: number, z: number) => { for (let r = 1; r <= 3; r++) for (let dx = -r; dx <= r; dx++) for (let dz = -r; dz <= r; dz++) if (Math.max(Math.abs(dx), Math.abs(dz)) === r && !inIsland(x + dx, z + dz)) return r; return 9; };
  // the bay: a lagoon at the centre, a mouth running out to the strait at the front-right corner
  const inLagoon = (x: number, z: number) => ((x + 0.5 - 34) / 11) ** 2 + ((z + 0.5 - 23.5) / 7.5) ** 2 < 1;
  const segDist = (px: number, pz: number, ax: number, az: number, bx: number, bz: number) => { const vx = bx - ax, vz = bz - az; const t = Math.max(0, Math.min(1, ((px - ax) * vx + (pz - az) * vz) / (vx * vx + vz * vz))); return Math.hypot(px - ax - t * vx, pz - az - t * vz); };
  const inMouth = (x: number, z: number) => segDist(x + 0.5, z + 0.5, 40, 27, 56, 45) < 4.2 + Math.max(0, (x - 44) * 0.18);
  const isWater = (x: number, z: number) => inIsland(x, z) && (inLagoon(x, z) || inMouth(x, z));
  const nearWater = (x: number, z: number, r: number) => { for (let dx = -r; dx <= r; dx++) for (let dz = -r; dz <= r; dz++) if (isWater(x + dx, z + dz)) return true; return false; };
  const G = 10, WATER_TOP = 8;                                                                           // reclaimed land at one level; water two plates below the bank
  const promenade = (x: number, z: number) => !isWater(x, z) && nearWater(x, z, 2);                        // granite promenade two studs wide round the bay
  const grass = (x: number, z: number) => (patch(x, z, 5, 7) < 0.22 ? 'Green' : 'BrightGreen');   // broad patches: a fine noise packs into 1×1 plates
  const BASE = 3; const floorOf = (x: number, z: number) => (edgeDist(x, z) <= 3 ? 0 : BASE);
  const earth = (y: number) => (y < 6 ? 'DarkBluishGray' : y < 9 ? 'ReddishBrown' : 'MediumNougat');
  const studCells = new Set<string>(); const keep = (x0: number, z0: number, w: number, d: number) => { for (let x = x0; x < x0 + w; x++) for (let z = z0; z < z0 + d; z++) studCells.add(x + ',' + z); };
  const waterStuds = new Set<string>();

  // ---- places (positions first: the terrain keeps studs where something stands)
  const MER = { ox: 15, oz: 20 };                         // statue x 15..22, kerb x 14..22 × z 19..25; spouts +x into the lagoon
  keep(MER.ox - 1, MER.oz - 1, 9, 7);
  for (let i = 0; i <= 9; i++) waterStuds.add(`${MER.ox + 7 + i},${MER.oz + 2}`); for (const [fx, fz] of [[1, 2], [0, 1], [0, 3], [-1, 1]]) waterStuds.add(`${MER.ox + 15 + fx},${MER.oz + fz}`);
  const CART = { x: 31, z: 35 }; keep(CART.x, CART.z, 2, 2);
  const UNCLE: [number, number] = [35.5, 36.5], TOURIST: [number, number] = [19.5, 15.5]; keep(34, 35, 3, 3); keep(18, 14, 3, 3);
  const OTTERS: [number, number, number][] = [[38, 32, 1], [41, 35, 0]]; for (const [x, z] of OTTERS) keep(x, z, 2, 2);
  keep(46, 12, 8, 16); keep(35, 12, 2, 2); keep(10, 26, 2, 2);                                          // the grove's planters, the palms

  bp.tag = 'terrain';
  for (let x = 0; x < W; x++) for (let z = 0; z < D; z++) {
    if (!inIsland(x, z)) continue;
    if (isWater(x, z)) { for (let y = floorOf(x, z); y < 6; y++) bp.vox1('brick', x, y, z, earth(y)); bp.vox1('plate', x, 6, z, inMouth(x, z) && !inLagoon(x, z) ? 'DarkBlue' : (patch(x, z, 4, 5) < 0.5 ? 'DarkBlue' : 'DarkAzure')); bp.vox1(waterStuds.has(x + ',' + z) || patch(x, z, 1, 33) < 0.1 ? 'plate' : 'tile', x, 7, z, 'TransLightBlue'); R.add(x, z, 1, 1); continue; }
    for (let y = floorOf(x, z); y < G - 1; y++) bp.vox1('brick', x, y, z, earth(y));
    if (promenade(x, z)) bp.vox1(studCells.has(x + ',' + z) ? 'plate' : 'tile', x, G - 1, z, nearWater(x, z, 1) ? 'DarkBluishGray' : 'LightBluishGray'); else bp.vox1('plate', x, G - 1, z, grass(x, z));
  }
  for (let x = -1; x <= W; x++) for (let z = -1; z <= D; z++) {                                            // plinth: two bricks of stone one cell outside the footprint, capped
    if (inIsland(x, z)) continue; if (![[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dz]) => inIsland(x + dx, z + dz))) continue;
    for (let y = 0; y < 6; y++) bp.vox1('brick', x, y, z, 'DarkBluishGray'); bp.vox1('tile', x, 6, z, 'DarkBluishGray');
  }

  // ---- landmarks
  for (const tx of [29, 39, 49]) ground.add('mbs-tower', tx, 3, 3.5, 'mbs'); mbs10(bp, 20, G, 1, 0, R);                      // x 20..54 along the back, prow to the west, Shoppes toward the bay
  // Gardens by the Bay lies east of MBS across the bay from the Merlion (real geography; the 09-25 sketch had it back-left, where it crowded the
  // Merlion and left the east lawn empty): the grove turned a quarter, trunks at (50, 24) and (50, 15), the skyway running north–south
  ground.add('supertree-tall', 50, 24, 3.5, 'grove'); ground.add('supertree-mid', 50, 15, 3.5, 'grove'); R.add(46, 12, 8, 16);
  bp.tag = 'supertree'; bp.assembly('grove6', 46, G, 12, 'Magenta', 1);
  ground.add('merlion', MER.ox + 3.5, MER.oz + 2.5, 3.5); merlion6(bp, MER.ox, G, MER.oz, 0, WATER_TOP, 9, R);
  for (const bx of [5, 10, 15]) ground.add('shophouse-bay', bx + 0.5, 34, 3, 'shophouses'); shophouseRow(bp, 2, G, 31, 0, undefined, R, 'plaque_shophouse', 'tile_majolica', true);   // x 2..17, z 31..36, five-foot way toward the viewer
  ground.add('hawker', 25, 35, 3.5); hawkerStall(bp, 25, G, 33, 0, { legs: 'Black', torso: 'White', face: 'face_hawker', torsoPrint: 'torso_hawker', hair: 'Black', hairKey: 'hair_short' }, 'sign_chickenrice', R);   // kiosk x 22..27 × z 31..36, tables to z 40

  // ---- trees: a rain tree on the back-left lawn behind the Merlion, palms by the Merlion's kerb and at the north bank
  const plant = (name: string, x: number, z: number, r: number) => { ground.add(name, x, z, 1.5); canopy.add(name, x, z, r); };
  plant('raintree', 8, 9, 5.5); tree(bp, 8, G, 9, 'M', R, 0, undefined, 'raintree');
  plant('palm-W', 11, 27, 2); palm(bp, 11, G, 27, 3, 0, R);
  plant('palm-N', 36, 13, 2); palm(bp, 36, G, 13, 4, 1, R);                                                // in front of the Shoppes, clear of the jet

  // ---- life layer: the hawker frying (in the stall), the ice-cream uncle at his cart, a tourist photographing the Merlion; two otters
  bp.tag = 'cart'; ground.add('cart', CART.x + 1, CART.z + 1, 1.5, 'uncle'); iceCreamCart(bp, CART.x, G, CART.z, 0, 'LightBluishGray', R, 'cart_side');
  bp.tag = 'minifig'; ground.add('uncle', UNCLE[0], UNCLE[1], 1, 'uncle'); minifig2(bp, UNCLE[0], G, UNCLE[1], 3, { legs: 'DarkBlue', torso: 'White', face: 'face_uncle', torsoPrint: 'torso_vendor', hair: 'DarkBluishGray', hairKey: 'hair_tousled', hold: [{ key: 'icecream_cone', color: 'Tan', hand: 'R' }] }, R);
  ground.add('tourist', TOURIST[0], TOURIST[1], 1); minifig2(bp, TOURIST[0], G, TOURIST[1], 0, { legs: 'DarkTan', torso: 'Coral', face: 'face_grin', torsoPrint: 'torso_batik', hair: 'DarkBrown', hairKey: 'hair_tousled', hold: [{ key: 'camera', color: 'Black', hand: 'R' }] }, R);   // north of the statue facing +z: the Merlion's flank and its jet
  bp.tag = 'animals'; for (const [x, z, r] of OTTERS) { bp.part('otter', x, G, z, r ? 'ReddishBrown' : 'DarkBrown', r); R.add(x, z, 2, 2); }

  // ---- gardens: an orchid bed on the lawn in front of the grove, a few tufts
  bp.tag = 'orchid'; orchidBed(bp, [[14, 9], [15, 10], [16, 9], [14, 11], [16, 11], [15, 12]].filter(([x, z]) => !R.has(x, z) && !isWater(x, z) && !promenade(x, z)) as [number, number][], G, R);
  bp.tag = 'tufts';
  for (const [x, z] of [[42, 13], [52, 32], [4, 38], [12, 18], [4, 24], [46, 37]] as [number, number][]) { if (!inIsland(x, z) || isWater(x, z) || R.has(x, z) || promenade(x, z)) continue; bp.part('roundplate_1x1', x, G, z, 'Green'); bp.part('grass_stem', x, G + 1, z, bp.pick(['BrightGreen', 'Lime', 'Green'])); R.add(x, z, 1, 1); }
  bp.tag = ''; bp.pack();
  return { id: 'singapore', title: 'Singapore', caption: 'Marina Bay', subtitle: 'Marina Bay Sands · Supertrees · Merlion · shophouses', size: [W, D], center: [W / 2, 11, D / 2], base: BASE, camera: { az: 0.62, el: 0.42, dist: 100 } };
}
