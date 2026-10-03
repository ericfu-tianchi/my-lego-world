// Prague · Charles Bridge (a three-opening run) and the Old Town Bridge Tower, round 1 (2026-10-02). Scheme: docs/countries/czechia.md §1.15, §1.18.
// Island coordinates: river x 12–39, deck rows z 26–31 (parapets z 26 and z 31, walk z 27–30), tower x 41–48 × z 25–32; camera side is +z.
// Levels from the water surface W (plates): pier tops / arch springing W+2, arch crowns W+8, deck plate W+8, walk W+10 (= the square, L),
// parapet to L+6 with a tile coping, statue plinths over the piers, lamps over the abutments, the tower ≈ 62 above the walk.
import { Blueprint } from '../core/builder';
import { minifig2 } from './lib';
import { PARTS } from '../core/catalog';
import { ROOF, GOLD, spire, type PartFn } from './prague-lib';

const BRIDGE = ['Tan', 'Tan', 'DarkTan', 'Tan', 'DarkTan', 'Tan', 'LightBluishGray'];     // honey-grey sandstone (charles-bridge-oldtown-tower-river.jpg)
const PARAPET = ['DarkTan', 'DarkTan', 'Tan', 'DarkTan', 'DarkBluishGray'];              // weathered darker at the parapet
const BLACKENED = ['Black', 'Black', 'DarkBrown', 'Black', 'DarkBluishGray', 'Black'];   // the tower: sandstone blackened nearly black; Dark Brown ≤ 1/3 (judge 10-03)
const PIERS = [18, 29];
const PLINTH_X = [9, 20, 30];   // statue plinths (2 wide), one pair over each pier — the Kampa pier (the old abutment, x 8–11) and the two river piers
const LAMPS = [3, 39];         // lamps at the two ends: the Kampa end over the land arch, the Old Town end by the tower
const STAIR = [7, 8];          // the gap in the south parapet where the stair goes down to Kampa (east of the land arch, so the arch stays in view)
export type StatueKind = 'statuette' | 'minifig' | 'robe' | 'robecape' | 'shroud' | 'cross' | 'nepomuk' | 'book' | 'staff' | 'palm' | 'miniland'
  | 'calvary' | 'wenceslas' | 'christopher' | 'norbert' | 'xavier' | 'augustine' | 'anthony';
/** Nepomuk's halo variants for Eric to choose from (round 9) */
export type Halo = 'stars4' | 'disc' | 'crown' | 'flower' | 'crownstar';
/** the six bridge saints, after real statues on Charles Bridge: [south (camera side), north] per plinth */
const SAINTS: Record<number, [StatueKind, StatueKind]> = { 9: ['wenceslas', 'augustine'], 20: ['nepomuk', 'anthony'], 30: ['norbert', 'xavier'] };   // round 10: no figureless cross, no flag, no child on the head

/** Cells where the river gets no trans-tile surface: the pier bodies and the jumpers under the cutwater noses (the noses stand above the water
 *  tiles from W). The ice-breakers were cut in round 9 (Eric could not read them). Island grid. */
export function bridgeDry(x: number, z: number): boolean {
  return PIERS.some((px) => (x >= px && x <= px + 4 && z >= 26 && z <= 31) || (x >= px && x <= px + 3 && (z === 25 || z === 32)));
}
// upstream river life (round 9): a moored wooden rowing boat by the Kampa bank and three white ducks with a little foam
const BOAT = { x: 13, z: 14 };   // hull x 13–16, z 14–23, bow downstream (+z)
const DUCKS: [number, number, number][] = [[20, 5, 0], [30, 9, 0], [35, 15, 0]];   // spread over the open water at the back (round 10), swimming downstream (+z)
const FOAM: [number, number][] = [[20, 3], [30, 7], [35, 13]];                     // a little wake behind each
/** Water cells that must be a plate (studs) instead of a tile, because the boat, a duck or foam stands on them. */
export function riverPlate(x: number, z: number): boolean {
  return (x >= BOAT.x && x <= BOAT.x + 3 && z >= BOAT.z && z <= BOAT.z + 9) || DUCKS.some(([dx, dz]) => dx === x && dz === z) || FOAM.some(([fx, fz]) => fx === x && fz === z);
}
/** The boat, the ducks and the foam on the water (W is the water surface: the water plates' studs are at W). */
export function riverLife(bp: Blueprint, W: number) {
  bp.tag = 'river'; const { x, z } = BOAT; const WOOD = 'ReddishBrown';
  bp.part('plate_4x6', x, W, z, WOOD);                                                     // the bottom, stern half
  bp.part('wedge_4x2_brick_r', x, W, z + 6, WOOD); bp.part('wedge_4x2_brick_l', x + 2, W, z + 6, WOOD);   // the bow: two wedge bricks closing to a point downstream
  for (const sx of [x, x + 3]) { bp.part('brick_1x6', sx, W + 1, z, WOOD); bp.part('tile_1x3', sx, W + 4, z, 'DarkTan'); bp.part('tile_1x2', sx, W + 4, z + 4, 'DarkTan'); }   // the gunwales
  bp.part('brick_1x2', x + 1, W + 1, z, WOOD, 1); bp.part('tile_1x2', x + 1, W + 4, z, 'DarkTan', 1);    // the transom
  for (let k = 1; k <= 5; k++) bp.part('tile_1x2', x + 1, W + 1, z + k, 'DarkTan', 1);    // floor boards
  bp.part('plate_1x4', x, W + 4, z + 3, WOOD, 1); bp.part('tile_1x4', x, W + 5, z + 3, 'DarkTan', 1);   // the thwart across the gunwales
  for (const [dx, dz, r] of DUCKS) bp.part('duckling', dx, W, dz, 'White', r);
  for (const [fx, fz] of FOAM) bp.part('roundtile_1x1', fx, W, fz, 'White');
  bp.tag = '';
}
/** The terrain the bridge replaces: the Kampa pier x 8–11 and the Old Town arch leg x 40 from the river bed (W − 1) to the walk, the walk-level
 *  tile under the tower and the quay cells beside the leg under the tower's corners. West of the pier the bridge runs on over Kampa on a land
 *  arch and its stair, both standing on the lawn (L − 6 = W + 4) as built. Call before `charlesBridge`. */
export function bridgeClearTerrain(bp: Blueprint, W: number) {
  bp.clear(8, W - 1, 26, 4, 11, 6); bp.clear(40, W - 1, 26, 1, 11, 6); bp.clear(41, W + 9, 25, 8, 1, 8);
  bp.clear(40, W + 8, 25, 1, 2, 1); bp.clear(40, W + 8, 32, 1, 2, 1);
}

/** A statue on its plinth cap: the plinth's min cell (x, z), cap top at y, facing `rot` (0 = +z, 2 = −z). Black, the bronze-dark of the real
 *  replicas; each saint carries one attribute so it reads as a sculpture: a cross, St John of Nepomuk's gold star (a crown read as a king), a book. */
export function statue(bp: Blueprint, kind: StatueKind, x: number, y: number, z: number, rot: number, halo: Halo = 'crown') {   // Eric 10-03: Nepomuk wears the gold 5-point crown (option C)
  const C = 'Black';
  if (kind === 'statuette') { bp.part('jumper_2x2', x, y, z, C); bp.part('statuette', x + 0.5, y + 1, z + 0.5, C); return; }
  if (kind === 'miniland') {   // brick-built, Miniland style: a 2×2 round hem, a cone robe, a 1×1 chest and head on the axis, a gold halo
    bp.part('roundbrick_2x2', x, y, z, C); bp.part('cone_2x2', x, y + 3, z, C);
    bp.part('round_1x1', x + 0.5, y + 9, z + 0.5, C); bp.part('roundplate_1x1', x + 0.5, y + 12, z + 0.5, C); bp.part('round_1x1', x + 0.5, y + 13, z + 0.5, C); bp.part('roundtile_1x1', x + 0.5, y + 16, z + 0.5, GOLD);
    return;
  }
  const cx = x + 1;
  if (kind === 'minifig') { minifig2(bp, cx, y, z + 1, rot, { legs: C, torso: C, skin: C, hair: C, hold: [{ key: 'bar_4l', color: C, hand: 'R' }] }); return; }   // a saint with a staff (legs show: reads as a person)
  if (kind === 'shroud') { minifig2(bp, cx, y, z + 1, rot, { legs: C, torso: C, skin: C, hair: C, hairKey: 'ghost_shroud' }); return; }
  // robed saints: a 65° robe slope in place of legs, the minifig's torso on its back row of studs; arms, grip and attribute from minifig2.
  // Each follows a real statue on the bridge and carries its legible attribute (round 9, Eric: no empty bars, no empty hands).
  const r = rot & 3; const cz = r === 2 ? z + 1.5 : z + 0.5;
  if (kind === 'calvary') {   // the Crucifix and Calvary: a tall freestanding cross, no figure — a jumper, two round bricks, the cross in the top one's hollow stud
    bp.part('jumper_2x2', x, y, z, C); bp.part('round_1x1', x + 0.5, y + 1, z + 0.5, C); bp.part('round_1x1', x + 0.5, y + 4, z + 0.5, C);
    bp.part('cross_up', x, y + 7, z + 0.5, C); return;
  }
  bp.part('robe_65_2x2', x, y, z, C, r);
  const tmp = new Blueprint(1); tmp.tag = bp.tag;
  type H = { key: string; color: string; hand: 'L' | 'R'; pose?: 'd' | 'f' | 'h' | 'u'; grip?: 'mid' | 'ground' | 'bottom' };
  const hold: H[] = kind === 'cross' || kind === 'xavier' ? [{ key: 'cross_up', color: C, hand: 'R', pose: kind === 'xavier' ? 'h' : undefined, grip: 'bottom' }]   // St Francis Xavier lifts the crucifix
    : kind === 'nepomuk' ? [{ key: 'cross_up', color: C, hand: 'L', grip: 'bottom' }]                                     // St John of Nepomuk holds the crucifix in his arms
    : kind === 'wenceslas' ? [{ key: 'sword', color: C, hand: 'R', pose: 'd', grip: 'bottom' }]   // St Wenceslas: the sword, point up at his side (the shield cannot clear the robe)
    : kind === 'augustine' ? [{ key: 'roundplate_held', color: C, hand: 'R' }]                                             // St Augustine: the flaming heart on his hand
    : kind === 'anthony' ? [{ key: 'baby_held', color: C, hand: 'L' }]                                                     // St Anthony of Padua: the Christ child in his arms
    : kind === 'norbert' ? [{ key: 'bar_3l', color: GOLD, hand: 'R', grip: 'bottom' }]                                    // St Norbert: the gold monstrance
    : kind === 'staff' || kind === 'palm' ? [{ key: 'bar_4l', color: C, hand: 'R' }] : kind === 'book' ? [{ key: 'book', color: 'DarkBrown', hand: 'L' }] : [];
  // Eric 10-03: every saint has something on the head unless the real statue is bare-headed — Nepomuk wears his crown, Christopher carries the
  // child, Anthony is tonsured as on the real statue (a cowl would also clash with the child in his arms); Wenceslas the knight-king wears a
  // helmet; the others the cowl
  const bare = kind === 'nepomuk' || kind === 'christopher' || kind === 'anthony';
  const headKey = kind === 'wenceslas' ? 'helmet_castle' : 'hood';
  const fig = minifig2(tmp, cx, y, cz, r, { legs: C, torso: C, skin: C, hair: bare ? undefined : C, hairKey: bare ? undefined : headKey, hold, poses: kind === 'christopher' ? { L: 'u', R: 'u' } : undefined });
  for (const p of tmp.parts) if (p.key !== 'fig_legs') bp.parts.push({ ...p, y: p.y });
  const head = (key: string, dy: number, color: string) => bp.part(key, cx - 0.5, y + 12 + dy, cz - 0.5, color);
  if (kind === 'palm') { const [gx, , gz] = fig.grips.R; bp.part('plant_3leaves', gx - 0.5, fig.held.bar_4l + PARTS.bar_4l.h - 1, gz - 0.5, C); }
  if (kind === 'norbert') { const [gx, , gz] = fig.grips.R; const top = fig.held.bar_3l + PARTS.bar_3l.h; bp.part('roundplate_1x1', gx - 0.5, top, gz - 0.5, GOLD); bp.part('star_1x1', gx - 0.5, top + 1, gz - 0.5, GOLD); }   // the sunburst on its stem
  if (kind === 'augustine') { const [gx, , gz] = fig.grips.R; bp.part('heart_tile', gx - 0.5, fig.held.roundplate_held + 1, gz - 0.5, GOLD); }
  if (kind === 'nepomuk') {
    if (halo === 'stars4') { bp.part('roundplate_2x2', cx - 1, y + 12, cz - 1, GOLD); for (const [dx, dz] of [[-1, -1], [0, -1], [-1, 0], [0, 0]]) bp.part('star_1x1', cx + dx, y + 13, cz + dz, GOLD); }
    else if (halo === 'disc') bp.part('roundplate_2x2', cx - 1, y + 12, cz - 1, GOLD);
    else if (halo === 'crown') head('crown_5pt', 0, GOLD);
    else if (halo === 'flower') head('petal_1x1', 0, GOLD);
    else { head('crown_5pt', 0, GOLD); head('star_1x1', 3, GOLD); }
  }
  if (kind === 'robecape') bp.part('fig_cape', cx - 1, y + 9, cz - 0.5, C, r);
}

/** The jazz busker on the walk between the statue pairs (island grid x 25–26, z 28; the case x 21–23, z 28–29), facing the camera: saxophone held at the body tube,
 *  an open case at the feet with three gold coins. The walk leaves bare studs there (`charlesBridge`). W is the water surface; the walk is W + 10. */
/** the saxophone grip: the hand closes on the body tube (HOLD_DEFAULTS gp), no offsets — chosen from the round-9 pose × rotation study */
const SAX = { pose: 'f' as const, rot: 3 };   // held at the side, bell forward: no minifig pose brings the mouthpiece to the mouth without lifting the horn off the clip
export function busker(bp: Blueprint, W: number) {
  const L = W + 10; bp.tag = 'busker';
  minifig2(bp, 26, L, 28.5, 0, { legs: 'Black', torso: 'DarkRed', torsoPrint: 'torso_busker', face: 'face_smile', hair: 'DarkBrown', hold: [{ key: 'saxophone', color: 'PearlGold', hand: 'R', ...SAX }] });
  // the open case beside him: a Dark Red 2×3 plate, the lid standing open along the back (a 1×3 brick, tile-capped), three gold coins in front
  bp.part('plate_2x3', 21, L, 28, 'DarkRed', 1); bp.part('brick_1x3', 21, L + 1, 28, 'DarkRed', 1); bp.part('tile_1x3', 21, L + 4, 28, 'DarkRed', 1);
  for (const x of [21, 22, 23]) bp.part('roundtile_1x1', x, L + 1, 29, GOLD);
  bp.tag = '';
}

export function charlesBridge(bp: Blueprint, ox: number, oz: number, W: number, statues: StatueKind = 'robe') {
  const L = W + 10; const put: PartFn = (k, x, y, z, c, r = 0, pr) => bp.part(k, ox + x, y, oz + z, c, r, pr);
  const vox = (kind: 'brick' | 'plate' | 'tile', x: number, y: number, z: number, c: string) => bp.vox1(kind, ox + x, y, oz + z, c);
  let run = 0, col = BRIDGE[0];
  const mottle = (pal: string[], len = 4) => { if (run-- <= 0) { run = 2 + Math.floor(bp.rand() * len); let c = bp.pick(pal); if (c === col) c = bp.pick(pal); col = c; } return col; };   // runs of 2–5 cells in a new colour: the packer lays 1×N bricks
  bp.tag = 'bridge';
  // piers: 5 × 6 from the river bed to the springing, pointed cutwaters both sides (a 4-wide pointed wedge on two jumpers, centred on the pier)
  for (const px of PIERS) {
    for (let z = 26; z <= 31; z++) { const c = mottle(BRIDGE); for (let x = px; x < px + 5; x++) for (let d = 0; d < 3; d++) vox('brick', x, W - 1 + d, z, c); }
    for (const [zj, r] of [[32, 0], [25, 2]] as [number, number][]) {
      put('jumper_1x2', px, W - 1, zj, 'DarkTan'); put('jumper_1x2', px + 2, W - 1, zj, 'DarkTan');
      put('wedge_4x4_pointed', px + 0.5, W, r === 0 ? 32 : 22, 'DarkTan', r);
      // the cutwater's cap on the wedge's two real studs (the mould has only those, cells 1–2 of its straight row): two 1×1 pyramids, low enough to clear the plinth corbels above
      for (const dx of [1.5, 2.5]) put('pyramid_1x1', px + dx, W + 3, r === 0 ? 32 : 25, 'DarkTan');
    }
    // spandrel over the pier between the two arch legs
    for (let z = 26; z <= 31; z++) for (let d = 0; d < 6; d += 3) { const c = mottle(BRIDGE); for (let x = px + 1; x <= px + 3; x++) for (let e = 0; e < 3; e++) vox('brick', x, W + 2 + d + e, z, c); }
  }
  // the three vaults: six raised 1×8×2 arches side by side per span, legs on the piers and the banks
  for (const ax of [11, 22, 33]) for (let z = 26; z <= 31; z++) put('arch_1x8x2_raised', ax, W + 2, z, z === 31 || z === 26 ? bp.pick(['Tan', 'Tan', 'DarkTan']) : 'DarkTan');
  // the Kampa pier x 8–11 (x 11 carries the arch leg; the old abutment), Old Town quay x 40 (the leg) — stone to the springing under the legs, to the deck plate behind
  for (let z = 26; z <= 31; z++) {
    for (const x of [11, 40]) { const c = mottle(BRIDGE); for (let d = 0; d < 3; d++) vox('brick', x, W - 1 + d, z, c); }
    for (let d = 0; d < 9; d += 3) { const c = mottle(BRIDGE); for (let x = 8; x <= 10; x++) for (let e = 0; e < 3; e++) vox('brick', x, W - 1 + d + e, z, c); }
  }
  // corbels under the six plinth bays (front +z, back −z)
  for (const px of PLINTH_X) for (let k = 0; k < 2; k++) {
    for (let d = 0; d < 3; d++) { bp.clear(ox + px + k, W + 5 + d, oz + 31, 1, 1, 1); bp.clear(ox + px + k, W + 5 + d, oz + 26, 1, 1, 1); }
    put('slope_inv_1x2_a', px + k, W + 5, 31, 'DarkTan', 0); put('slope_inv_1x2_a', px + k, W + 5, 25, 'DarkTan', 2);
  }
  // deck: one plate course (W+8), the walk tiled in two greys (W+9), parapets z 26 / 31 of two mottled bricks with a Tan tile coping
  const isPlinth = (x: number) => PLINTH_X.some((p) => x === p || x === p + 1);
  for (let x = 1; x <= 40; x++) for (let z = 26; z <= 31; z++) if (!((z === 26 || z === 31) && isPlinth(x))) vox('plate', x, W + 8, z, 'DarkTan');
  const BUSKER = (x: number, z: number) => ((x === 25 || x === 26) && z === 28) || (x >= 21 && x <= 23 && (z === 28 || z === 29));   // bare studs under the busker's feet (x 25–26, z 28) and his case (x 21–23, z 28–29)
  const walk = (x: number, z: number) => (z >= 27 && z <= 30) || (z === 31 && STAIR.includes(x));
  for (let z = 27; z <= 31; z++) for (let x = 1; x <= 40; x++) if (walk(x, z)) vox(BUSKER(x, z) ? 'plate' : 'tile', x, W + 9, z, BUSKER(x, z) ? 'LightBluishGray' : mottle(['LightBluishGray', 'LightBluishGray', 'DarkBluishGray'], 3));   // the walk: grey setts in runs
  for (const z of [26, 31]) {
    for (let x = 1; x <= 40; x++) {
      if (isPlinth(x) || (z === 31 && STAIR.includes(x))) continue;
      const c = mottle(PARAPET); for (let d = 0; d < 6; d++) vox('brick', x, W + 9 + d, z, c);
      if (!LAMPS.includes(x)) vox('tile', x, W + 15, z, 'Tan');
    }
    // statue plinths: a 2×2 plate bay over the deck edge, three Dark Tan bricks (one brick above the parapet: the plinth carries the presence), a Black cap
    for (const px of PLINTH_X) {
      const bz = z === 31 ? 31 : 25;
      put('plate_2x2', px, W + 8, bz, 'DarkTan'); for (let k = 0; k < 3; k++) put('brick_2x2', px, W + 9 + 3 * k, bz, 'DarkTan'); put('plate_2x2', px, W + 18, bz, 'Black');
      // six saints, no two neighbours alike along a parapet or across the deck; Nepomuk on the camera side
      const kind: StatueKind = statues !== 'robe' ? statues : SAINTS[px][z === 31 ? 0 : 1];   // see SAINTS
      statue(bp, kind, px, W + 19, bz, z === 31 ? 2 : 0);
    }
    // lamps over the abutments: open-stud plate, Dark Green 3L bar, clear glass, a Dark Green cone cap
    for (const lx of LAMPS) { put('roundplate_open', lx, W + 15, z, 'DarkGreen'); put('bar_3l', lx, W + 16, z, 'DarkGreen'); put('round_1x1', lx, W + 21, z, 'TransClear'); put('cone_1x1', lx, W + 24, z, 'DarkGreen'); }
  }
  // over Kampa: the bridge runs on to the island's edge (x 1) on a land arch standing on the lawn (W + 4) — the real bridge crosses Kampa the same
  // way; a raised 1×6 arch per deck row (legs x 2 and x 7 on a stone sill), the west end a solid stone pier at x 1
  for (let z = 26; z <= 31; z++) {
    put('arch_1x6_raised', 2, W + 5, z, z === 26 || z === 31 ? mottle(BRIDGE) : 'DarkTan');
    for (const x of [2, 7]) vox('plate', x, W + 4, z, 'DarkTan');
    const c = mottle(BRIDGE); vox('plate', 1, W + 4, z, c); for (let d = 0; d < 3; d++) vox('brick', 1, W + 5 + d, z, c);
  }
  // the Kampa stair: through the gap in the south parapet (x 7–8), straight down to the lawn on the bridge's south side — two equal 2-plate
  // steps, each two studs deep, in the bridge's stone
  for (const x of STAIR) { for (const z of [32, 33]) for (let d = 0; d < 4; d++) vox(d === 3 ? 'tile' : 'plate', x, W + 4 + d, z, 'DarkTan'); for (const z of [34, 35]) for (let d = 0; d < 2; d++) vox(d === 1 ? 'tile' : 'plate', x, W + 4 + d, z, 'DarkTan'); }   // treads capped with tiles
  bp.tag = '';
  bridgeTower(bp, ox, oz, L, mottle);
}

/** Old Town Bridge Tower, x 41–48 × z 25–32 on the quay, standing on the walk's plate course (L − 1). */
function bridgeTower(bp: Blueprint, ox: number, oz: number, L: number, mottle: (pal: string[], len?: number) => string) {
  bp.tag = 'bridgetower'; const put: PartFn = (k, x, y, z, c, r = 0, pr) => bp.part(k, ox + x, y, oz + z, c, r, pr);
  const vox = (kind: 'brick' | 'plate' | 'tile', x: number, y: number, z: number, c: string) => bp.vox1(kind, ox + x, y, oz + z, c);
  const X0 = 41, X1 = 48, Z0 = 25, Z1 = 32, B = L - 1;
  const ring = (x: number, z: number) => x === X0 || x === X1 || z === Z0 || z === Z1;
  const gateCell = (x: number, z: number) => z >= 27 && z <= 30;                                         // the passage, open end to end
  const passWall = (z: number) => z === 26 || z === 31;
  const SHELF = B + 24;                                                                                    // a full 8×8 plate: the lancets' sill and the dark glass behind them
  const lancet = (x: number, z: number, y: number) => y > SHELF && y < SHELF + 10 && ((z === Z0 || z === Z1) ? (x >= 42 && x <= 47) : x === X0 ? (z >= 26 && z <= 31) : false);
  const niche = (x: number, z: number, y: number) => x === X1 && z >= 27 && z <= 30 && [B + 18, B + 21, SHELF + 4, SHELF + 7].includes(y);
  for (let y = B; y < B + 34; ) {
    if (y === SHELF) {   // a string course; under each lancet's opening a Black tile sill, so no stud shows in the window
      const sill = (x: number, z: number) => ((z === Z0 || z === Z1) && (x === 43 || x === 46)) || (x === X0 && (z === 27 || z === 30));
      for (let x = X0; x <= X1; x++) for (let z = Z0; z <= Z1; z++) vox(sill(x, z) ? 'tile' : 'plate', x, y, z, sill(x, z) ? 'Black' : 'DarkBluishGray');
      y += 1; continue;
    }
    for (let x = X0; x <= X1; x++) for (let z = Z0; z <= Z1; z++) {
      let solid: boolean;
      if (y < B + 12) solid = (ring(x, z) || passWall(z)) && !gateCell(x, z);
      else if (y < B + 15) solid = z === Z0 || z === Z1;                         // the first pair of head slopes fills z 26–27 / 30–31
      else if (y < B + 18) solid = z === Z0 || z === Z1 || passWall(z);
      else solid = ring(x, z);
      if (!solid || lancet(x, z, y) || niche(x, z, y)) continue;
      const c = mottle(BLACKENED, 5); for (let d = 0; d < 3; d++) vox('brick', x, y + d, z, c);   // long runs: compact packing then lays long bricks, not blotches
    }
    y += 3;
  }
  // the gate's pointed head: two pairs of 45° inverted slopes closing over the 4-wide passage (B+12 → B+18); the passage floor is the walk
  for (let x = X0; x <= X1; x++) {
    put('slope_inv_1x2_a', x, B + 12, 26, 'DarkBluishGray', 0); put('slope_inv_1x2_a', x, B + 12, 30, 'DarkBluishGray', 2);
    put('slope_inv_1x2_a', x, B + 15, 27, 'DarkBluishGray', 0); put('slope_inv_1x2_a', x, B + 15, 29, 'DarkBluishGray', 2);
    for (let z = 27; z <= 30; z++) vox('tile', x, B, z, 'LightBluishGray');
  }
  put('plate_6x6', 42, B + 18, 26, 'DarkBluishGray');   // floor over the gate head
  // lancets: two 1×3×3 pointed arches per face (south, north, west) on the shelf, dark glass behind each opening
  // the upper stage on the river and bridge faces (photo: plain blackened stone, a pair of tall pointed windows): two 1×3×3 pointed arches per face in
  // the stone's own Black, so they read as tracery cut into the wall, not as grey frames
  for (const lx of [42, 45]) { put('arch_pointed_1x3x3', lx, SHELF + 1, Z1, 'Black', 1); put('arch_pointed_1x3x3', lx, SHELF + 1, Z0, 'Black', 1); }
  for (const lz of [26, 29]) put('arch_pointed_1x3x3', X0, SHELF + 1, lz, 'Black', 0);
  for (let k = 0; k < 3; k++) { for (const lx of [42, 45]) { put('brick_1x3', lx, SHELF + 1 + 3 * k, Z1 - 1, 'Black', 1); put('brick_1x3', lx, SHELF + 1 + 3 * k, Z0 + 1, 'Black', 1); } put('brick_1x4', X0 + 1, SHELF + 1 + 3 * k, 27, 'Black'); }   // dark glass behind every lancet
  // the east face's sculpture tier (Charles IV, Wenceslas IV, St Vitus below; Adalbert and Sigismund above): statuettes in two recessed niches
  for (const [yy, zs] of [[B + 18, [27, 30]], [SHELF + 4, [28, 29]]] as [number, number[]][]) {
    for (let z = 27; z <= 30; z++) {   // a ledge and a dark back wall standing on the floor below: the niche is a recess, not a hole
      put('plate_1x1', X1, yy, z, 'DarkBluishGray');
      if (yy === B + 18) { put('brick_1x1', X1 - 1, yy + 1, z, 'Black'); put('plate_1x1', X1 - 1, yy + 4, z, 'Black'); put('plate_1x1', X1 - 1, yy + 5, z, 'Black'); }
      else for (let k = 0; k < 3; k++) put('brick_1x1', X1 - 1, SHELF + 1 + 3 * k, z, 'Black');
    }
    for (const z of zs) put('statuette', X1, yy + 1, z, 'Black');
  }
  // corbels and the 10 × 10 gallery, crenellations, four corner turrets, the steep slate roof on the tower's axis
  const G = B + 37;
  for (let k = 1; k <= 6; k++) { put('slope_inv_1x2_a', X0 + k, G - 3, Z1, 'DarkBluishGray', 0); put('slope_inv_1x2_a', X0 + k, G - 3, Z0 - 1, 'DarkBluishGray', 2); put('slope_inv_1x2_a', X0 - 1, G - 3, Z0 + k, 'DarkBluishGray', 3); put('slope_inv_1x2_a', X1, G - 3, Z0 + k, 'DarkBluishGray', 1); }
  for (const [cx, cz] of [[X0, Z0], [X1, Z0], [X0, Z1], [X1, Z1]]) put('brick_1x1', cx, G - 3, cz, 'Black');
  put('plate_4x10', X0 - 1, G, Z0 - 1, 'DarkBluishGray', 1); put('plate_4x10', X0 - 1, G, Z0 + 3, 'DarkBluishGray', 1); put('plate_2x8', X0 - 1, G, Z0 + 7, 'DarkBluishGray', 1); put('plate_2x2', X0 + 7, G, Z0 + 7, 'DarkBluishGray');
  // crenellations (judge r2): every side identical and mirror-symmetric — four 1×1 merlons with one-stud gaps between them, centred on the side:
  // a course of four 1×2 jumpers fills slots 1–8 between the corner spirelets, each carries a merlon on its centre stud, a tile caps each merlon
  for (let k = 1; k <= 7; k += 2) {
    for (const [x, z, r] of [[X0 - 1 + k, Z0 - 1, 0], [X0 - 1 + k, Z1 + 1, 0], [X0 - 1, Z0 - 1 + k, 1], [X1 + 1, Z0 - 1 + k, 1]] as [number, number, number][]) {
      put('jumper_1x2', x, G + 1, z, 'Black', r);
      const [mx, mz] = r === 0 ? [x + 0.5, z] : [x, z + 0.5];
      bp.part('brick_1x1', ox + mx, G + 2, oz + mz, 'Black'); bp.part('tile_1x1', ox + mx, G + 5, oz + mz, 'DarkBluishGray');
    }
  }
  for (const [cx, cz] of [[X0 - 1, Z0 - 1], [X1 + 1, Z0 - 1], [X0 - 1, Z1 + 1], [X1 + 1, Z1 + 1]]) spire(put, cx, G + 1, cz, 2);
  // the roof (charles-bridge-oldtown-tower-river.jpg): a tall steep slate wedge with its ridge along the bridge (x), gold finials at both ridge ends.
  // Tier 1 (G+1–10): a 75° hip on 6 × 6 (four double-convex corners, 75° sides) → 4 × 4; tier 2 (G+10–19): 75° on the long sides only → a 4 × 2 ridge
  // zone; the ridge (G+19–22): two 45° doubles, a jumper at each end carrying the finial (1×1 round plate, gold bar) on the ridge line
  put('slope75_corner_2x2x3', 42, G + 1, 26, ROOF, 2); put('slope75_corner_2x2x3', 46, G + 1, 26, ROOF, 1); put('slope75_corner_2x2x3', 42, G + 1, 30, ROOF, 3); put('slope75_corner_2x2x3', 46, G + 1, 30, ROOF, 0);
  for (const x of [44, 45]) { put('slope75_2x1x3', x, G + 1, 26, ROOF, 2); put('slope75_2x1x3', x, G + 1, 30, ROOF, 0); }
  for (const z of [28, 29]) { put('slope75_2x1x3', 42, G + 1, z, ROOF, 3); put('slope75_2x1x3', 46, G + 1, z, ROOF, 1); }
  for (let x = 44; x <= 45; x++) for (let z = 28; z <= 29; z++) for (let d = 0; d < 9; d++) vox('brick', x, G + 1 + d, z, ROOF);
  for (let x = 43; x <= 46; x++) { put('slope75_2x1x3', x, G + 10, 27, ROOF, 2); put('slope75_2x1x3', x, G + 10, 29, ROOF, 0); }
  for (const x of [44, 45]) put('slope45_double_2x1', x, G + 19, 28, ROOF);
  for (const x of [43, 46]) { put('jumper_1x2', x, G + 19, 28, ROOF, 1); bp.part('roundplate_open', ox + x, G + 20, oz + 28.5, GOLD); bp.part('bar_3l', ox + x, G + 21, oz + 28.5, GOLD); }
  bp.tag = '';
}
