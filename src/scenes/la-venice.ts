// Los Angeles element test scene: Venice beachfront on a slab of island earth (docs/refs/la-venice/SCHEME.md, BUILD.md). ?scene=la-venice&noglobe
// The ground is the island's own section (BASE 3, earth to plate 9, sand top at G = 10), so the bowl sinks into it as it will on the island.
// Tags: walk (Ocean Front Walk, bike path, lamps, benches), bowl, walls, gym, tower.
import { Blueprint } from '../core/builder';
import type { SceneMeta } from './lib';

const BASE = 3, G = 10;
/** Where each Venice element stands (absolute grid cells). walk: the Ocean Front Walk strip x0 ≤ x < x1 from z0 (11 deep: walk 6, furniture
 *  strip 2, bike path 3); pockets / lamps / benches: x of each palm pocket (2 wide), lamp (2) and bench (4) in the furniture strip; skater:
 *  the roller-skater's bare stud pair on the walk. */
export interface VeniceLayout {
  walk: { x0: number; x1: number; z0: number; pockets: number[]; lamps: number[]; benches: number[]; skater: [number, number][] };
  bowl: { x: number; z: number }; gym: { x: number; z: number }; tower: { x: number; z: number; rot?: number }; walls: { x: number; z: number };
}
/** The Venice elements at their layout cells on ground whose surface plate is at G − 1 and whose base is BASE. Every surface cell an element
 *  lays itself goes into `own` (the caller lays sand or anything else on the rest). The bowl lays its own earth from BASE: the caller leaves
 *  its 19 × 12 cells empty from BASE up. */
export function placeVenice(bp: Blueprint, L: VeniceLayout, own: Set<string>) {
  const BOWL = L.bowl, GYM = L.gym, TOWER = L.tower, WX = L.walls.x, WZ = L.walls.z, { x0: X0, x1: X1, z0: Z0 } = L.walk;
  const k2 = (x: number, z: number) => x + ',' + z;

  // ---- Ocean Front Walk (SCHEME §5): a 6-wide walk with Sand Blue sweeps of macaroni tiles, a furniture strip (palm pockets, lamps,
  // benches), a 3-wide bike path in Dark Bluish Gray; all flush with the sand (the surface layer at G − 1)
  bp.tag = 'walk';
  const surf = (x: number, z: number, kind: 'tile' | 'plate', c: string) => { own.add(k2(x, z)); bp.vox1(kind, x, G - 1, z, c); };
  // the walk stands one plate proud of the sand (a curb): plates at G − 1, tiles at G. r2 (Eric, after real-boardwalk.jpg: broad, loose blue
  // swooshes, not a tight sine): Sand Blue sweeps that run diagonally across the walk, each entering at one edge on a quarter arc, running
  // along it and leaving at the other edge on a second arc, wide and thin sweeps in turn, of different lengths, down and up.
  //   wide: a 2-wide band, its arcs a macaroni tile 2×2 (radii 1–2) inside a macaroni tile 3×3 (2–3), both Sand Blue, rows 1–2 (up: 3–4)
  //   thin: a 1-wide band, the 3×3 macaroni alone (radii 2–3), the inside filled flush in grey (a quarter tile and a grey 2×2 macaroni), row 2 (up: 3)
  // Every arc's centre cell is a quarter tile; its outer corner cell, cut by the 3×3's outer arc, is tiled one course down, so no stud shows.
  const SB = 'SandBlue', LBG = 'LightBluishGray';
  const band = new Map<string, string>(), arcCells = new Set<string>(), low = new Set<string>();
  const rotQ = (sx: number, sz: number) => (sx > 0 ? (sz > 0 ? 0 : 1) : (sz > 0 ? 3 : 2));   // the quadrant a quarter tile / macaroni bulges toward
  const claim = (x: number, z: number) => { const c = k2(x, z); if (arcCells.has(c) || band.has(c)) throw new Error(`walk sweep overlaps itself at ${c}`); return c; };
  const arc = (cx: number, cz: number, sx: number, sz: number, wide: boolean) => {   // ring centre (cx, cz) on the grid, the 3 × 3 quadrant toward (sx, sz)
    const cell = (i: number, j: number) => [sx > 0 ? cx + i : cx - 1 - i, sz > 0 ? cz + j : cz - 1 - j] as const;
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) { const [x, z] = cell(i, j); arcCells.add(claim(x, z)); }
    const r = rotQ(sx, sz), m0 = (n: number, c: number, s: number) => (s > 0 ? c : c - n);
    bp.part('tile_quarter_1x1', m0(1, cx, sx), G, m0(1, cz, sz), LBG, r);
    bp.part('la_macaroni', m0(2, cx, sx), G, m0(2, cz, sz), wide ? SB : LBG, r);
    bp.part('la_macaroni3', m0(3, cx, sx), G, m0(3, cz, sz), SB, r);
    const [ox, oz] = cell(2, 2); low.add(k2(ox, oz));
  };
  const sweep = (a: number, run: number, wide: boolean, up: boolean) => {   // walk-relative x from a; returns the first free x after it
    const Z = (z: number) => Z0 + (up ? 5 - z : z), CZ = (z: number) => Z0 + (up ? 6 - z : z), SZ = (s: number) => (up ? -s : s);
    const b = a + 3 + run;
    arc(X0 + a + 3, CZ(0), -1, SZ(1), wide);                                                         // in from the edge, turning along the walk
    for (let x = a + 3; x < b; x++) for (const z of wide ? [1, 2] : [2]) band.set(claim(X0 + x, Z(z)), SB);
    arc(X0 + b, CZ(wide ? 4 : 5), 1, SZ(-1), wide);                                                  // turning out across the walk …
    for (const x of wide ? [b + 1, b + 2] : [b + 2]) for (let z = wide ? 4 : 5; z < 6; z++) band.set(claim(X0 + x, Z(z)), SB);   // … to the far edge
    return b + 3;
  };
  const PLAN: [number, boolean, boolean, number][] = [[8, true, false, 2], [11, false, true, 3], [5, true, true, 2], [9, false, false, 3], [12, true, false, 2], [6, false, true, 3]];   // run, wide, up, gap
  for (let x = 1, i = 0; ; i++) { const [run, wide, up, gap] = PLAN[i % PLAN.length]; if (X0 + x + 6 + run > X1) break; x = sweep(x, run, wide, up) + gap; }
  const SKATER = L.walk.skater.map(([x, z]) => k2(x, z));   // the roller-skater's bare stud pair on the walk's sand-side margin
  for (const c of SKATER) if (band.has(c) || arcCells.has(c)) throw new Error(`walk sweep runs over the roller-skater's studs at ${c}`);
  for (let x = X0; x < X1; x++) for (let z = Z0; z < Z0 + 6; z++) {
    const c = k2(x, z); surf(x, z, low.has(c) ? 'tile' : 'plate', LBG);
    if (!arcCells.has(c)) bp.vox1(SKATER.includes(c) ? 'plate' : 'tile', x, G, z, band.get(c) ?? LBG);
  }
  for (let x = X0; x < X1; x++) for (let z = Z0 + 8; z < Z0 + 11; z++) surf(x, z, 'tile', 'DarkBluishGray');
  const { pockets: POCKETS, lamps: LAMPS, benches: BENCHES } = L.walk, FZ = Z0 + 6;
  const furn = new Set<string>(); for (const x of [...POCKETS, ...LAMPS]) for (let i = 0; i < 2; i++) for (const z of [FZ, FZ + 1]) furn.add(k2(x + i, z));
  for (const x of BENCHES) for (let i = 0; i < 4; i++) for (const z of [FZ, FZ + 1]) furn.add(k2(x + i, z));
  for (let x = X0; x < X1; x++) for (const z of [FZ, FZ + 1]) {             // the furniture strip: plates, tiled except where something stands; palm pockets sunk
    const p = POCKETS.some((px) => x >= px && x < px + 2); surf(x, z, 'plate', p ? 'Tan' : 'LightBluishGray'); if (!furn.has(k2(x, z))) bp.vox1('tile', x, G, z, 'LightBluishGray');
  }
  LAMPS.forEach((x, i) => bp.assembly(i % 2 ? 'la_lamp2' : 'la_lamp', x, G, FZ, 'DarkBluishGray'));   // the two Ocean Front Walk types in turn: arm over the walk, twin bells along it
  for (const x of BENCHES) bp.assembly('la_bench', x, G, FZ, 'DarkGreen');   // a Venice bench: concrete ends, green seat and backrest (back to the walk)

  // ---- skate bowl (SCHEME §1): its own surface and earth down to the base; the rail on the walk side
  for (let x = BOWL.x; x < BOWL.x + 19; x++) for (let z = BOWL.z; z < BOWL.z + 12; z++) own.add(k2(x, z));
  bp.tag = 'bowl'; bp.assembly('la_bowl', BOWL.x, BASE, BOWL.z, 'LightBluishGray');
  bp.tag = 'skater'; bp.assembly('la_skater', BOWL.x + 11, BASE + 11, BOWL.z + 2, 'BrightRed', 0, { '973|White': 'torso_la_skate_m', '3626c|Yellow': 'face_la_shades_m' }); bp.tag = 'bowl';   // r2: the tail stall on the coping's two hinges
  bp.assembly('la_bowlrail', BOWL.x, G, BOWL.z - 2, 'FlatSilver');   // a stud of sand between rail and apron: the board's tail reaches the apron's edge

  // ---- art walls (SCHEME §2): footing 1×8, Brick 1×1×5 ends in the wall's colour, the printed Brick 1×6×5 between, a 1×8 tile cap — 17 plates.
  // An echelon, as the Pit's walls stand: each print seen whole from the south, one stud between them
  bp.tag = 'walls';
  const WALLS: [number, number, string, string][] = [[WX, WZ + 3, 'MediumAzure', 'graffiti_wild'], [WX + 9, WZ, 'Lime', 'graffiti_char'], [WX + 18, WZ + 2, 'MediumLavender', 'graffiti_sun']];
  for (const [x, z, c, pr] of WALLS) {
    bp.part('plate_1x8', x, G, z, 'LightBluishGray', 1);
    for (const px of [x, x + 7]) bp.part('brick_1x1x5', px, G + 1, z, c);   // the ends painted the ground colour: one painted slab, not a framed picture
    bp.part('la_wall_1x6x5', x + 1, G + 1, z, c, 1, pr);
    bp.part('tile_1x8', x, G + 16, z, 'LightBluishGray', 1);
  }
  for (let x = WX + 2; x < WX + 24; x++) for (const z of [WZ + 5, WZ + 6]) surf(x, z, 'tile', 'LightBluishGray');   // the concrete path across the sand

  // ---- Muscle Beach (SCHEME §3): a 14 × 10 pen on a concrete pad, black mats, a plinth with the square-lattice steel fence on three
  // sides, the gate on the north side, a pull-up bar, a bench, and a bare 2×2 for the lifter
  bp.tag = 'gym';
  const gx = GYM.x, gz = GYM.z;
  bp.fill('plate', gx, G, gz, 14, 1, 10, 'LightBluishGray');
  const skip = new Set<string>([k2(2, 5), k2(5, 5), k2(9, 5), k2(12, 5), k2(6, 5), k2(7, 5), k2(6, 6), k2(7, 6)]);
  for (let x = 7; x < 13; x++) skip.add(k2(x, 3));                                                              // the dumbbell rack stands on the pad
  for (let x = 1; x < 13; x++) for (let z = 1; z < 9; z++) if (!skip.has(k2(x, z)) && !(z === 1 && x >= 2 && x <= 11)) bp.vox1('tile', gx + x, G + 1, gz + z, 'Black');
  const plinth = (x: number, z: number) => bp.fill('brick', gx + x, G + 1, gz + z, 1, 3, 1, 'LightBluishGray');
  for (const x of [0, 1, 12, 13]) { plinth(x, 0); bp.vox1('tile', gx + x, G + 4, gz, 'LightBluishGray'); }
  for (let z = 1; z < 10; z++) { plinth(0, z); plinth(13, z); } for (let x = 1; x < 13; x++) plinth(x, 9);
  // r2 (Eric: the fence read as stone): thin-framed lattice panels, see-through like the real steel mesh, instead of the chunky
  // square-lattice balustrade; the panel's frame is the top rail, and no studs show on it
  for (const x of [0, 13]) for (const z of [1, 5]) bp.part('fence_lattice_1x4x2', gx + x, G + 4, gz + z, 'FlatSilver', 1);
  for (const x of [1, 5, 9]) bp.part('fence_lattice_1x4x2', gx + x, G + 4, gz + 9, 'FlatSilver');
  for (const x of [0, 13]) { for (const y of [4, 7]) bp.part('round_1x1', gx + x, G + y, gz + 9, 'FlatSilver'); bp.part('roundtile_1x1', gx + x, G + 10, gz + 9, 'FlatSilver'); }
  bp.assembly('la_gate', gx + 2, G + 1, gz, 'LightBluishGray');
  for (const x of [2, 5]) for (const y of [1, 4]) bp.part('round_1x1', gx + x, G + y, gz + 5, 'FlatSilver');   // pull-up bar
  bp.part('la_bar_1x4x2', gx + 2, G + 7, gz + 5, 'FlatSilver');
  for (const x of [9, 12]) bp.part('brick_1x1', gx + x, G + 1, gz + 5, 'LightBluishGray');                    // weight bench with a blue pad
  bp.part('plate_1x4', gx + 9, G + 4, gz + 5, 'LightBluishGray', 1); bp.part('tile_1x4', gx + 9, G + 5, gz + 5, 'BrightBlue', 1);
  bp.part('plate_2x2', gx + 6, G + 1, gz + 5, 'Black');                                                          // the lifter stands here
  bp.assembly('la_rack', gx + 7, G + 1, gz + 3, 'LightBluishGray');                                              // dumbbells lying across a rack: both weights show (r2)

  // ---- lifeguard tower (SCHEME §4) on the sand
  bp.tag = 'tower'; bp.assembly('la_tower', TOWER.x, G, TOWER.z, 'BrightLightBlue', TOWER.rot ?? 0, { '2362b|BrightLightBlue': 'la_tower_18' });
  bp.tag = '';
}

export function buildLaVenice(bp: Blueprint): SceneMeta {
  const W = 56, D = 48;
  const BOWL = { x: 3, z: 13 };
  const own = new Set<string>(); const k2 = (x: number, z: number) => x + ',' + z;   // surface cells an element lays itself (no sand plate there)
  // earth: two bricks deep, and a sand plate on top wherever no element lays its own surface
  bp.tag = 'ground';
  for (let x = 0; x < W; x++) for (let z = 0; z < D; z++) { if (x >= BOWL.x && x < BOWL.x + 19 && z >= BOWL.z && z < BOWL.z + 12) continue; bp.fill('brick', x, BASE, z, 1, 6, 1, 'DarkTan'); }
  placeVenice(bp, { walk: { x0: 0, x1: W, z0: 0, pockets: [1, 13, 25, 37, 49], lamps: [7, 19, 31, 43], benches: [15, 39], skater: [[21, 5], [22, 5]] },
    bowl: BOWL, gym: { x: 27, z: 13 }, tower: { x: 36, z: 27 }, walls: { x: 4, z: 30 } }, own);

  // sand: every surface cell nobody laid
  bp.tag = 'ground';
  for (let x = 0; x < W; x++) for (let z = 0; z < D; z++) if (!own.has(k2(x, z))) bp.vox1('plate', x, G - 1, z, 'Tan');
  bp.tag = ''; bp.pack();
  return { id: 'la-venice', title: 'Venice beachfront', caption: 'Venice beachfront', subtitle: 'test scene', size: [W, D], center: [W / 2, G, D / 2], base: BASE, camera: { az: 0.3, el: 0.5, dist: 80 } };
}
