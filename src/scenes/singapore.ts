// Singapore · Marina Bay — the landmark and story-layer builders (research: docs/countries/singapore.md; brief: judge/briefs/singapore.md).
// Every builder is canonical (front toward +z, or as noted) and takes a world rotation where the island needs one. Real moulds only;
// vertical things on one axis; four-way symmetric things through helpers. Build notes go to docs/countries/singapore.md §2.
import { Blueprint } from '../core/builder';
import { PARTS, footprint } from '../core/catalog';
import { Reserve, rotv, minifig2, hipCorners, spanPlates, spanPlatesX, type FigOpts2 } from './lib';

/** Local → world placer for a building drawn in its own frame (origin at local (0, 0), local +z = front), turned `rot` quarter turns. */
export function placer(bp: Blueprint, ox: number, oz: number, rot: number) {
  const part = (key: string, lx: number, y: number, lz: number, color: string, lrot = 0, print?: string) => {
    const [w, d] = footprint(PARTS[key], lrot); const [dx, dz] = rotv(lx + w / 2, lz + d / 2, rot); const [fw, fd] = footprint(PARTS[key], (lrot + rot) & 3);
    bp.part(key, ox + dx - fw / 2, y, oz + dz - fd / 2, color, (lrot + rot) & 3, print);
  };
  const vox = (kind: 'brick' | 'plate' | 'tile', lx: number, y: number, lz: number, color: string) => { const [dx, dz] = rotv(lx + 0.5, lz + 0.5, rot); bp.vox1(kind, Math.floor(ox + dx), y, Math.floor(oz + dz), color); };
  const cell = (lx: number, lz: number): [number, number] => { const [dx, dz] = rotv(lx + 0.5, lz + 0.5, rot); return [Math.floor(ox + dx), Math.floor(oz + dz)]; };
  /** an LDraw assembly exploded into its real bricks (bp.assembly), placed like `part` */
  const asm = (key: string, lx: number, y: number, lz: number, color: string, lrot = 0) => {
    const [w, d] = footprint(PARTS[key], lrot); const [dx, dz] = rotv(lx + w / 2, lz + d / 2, rot); const [fw, fd] = footprint(PARTS[key], (lrot + rot) & 3);
    bp.assembly(key, ox + dx - fw / 2, y, oz + dz - fd / 2, color, (lrot + rot) & 3);
  };
  return { part, vox, cell, asm };
}

// ---- Supertree Grove ----------------------------------------------------------------------------------------------------------------
/** One Supertree on the axis point (x, z) (a grid corner). `bricks` 1×1 round bricks in the trunk (7 / 6 / 5 → 39 / 35 / 31 plates): a 2×2 jumper
 *  footing puts the 1×1 trunk on the axis; the trunk is Magenta (the real steel skin) with a green 3-leaf plate after every brick and a Lime
 *  flower plate after every third — the vertical garden that covers the real trunks — so all trunks share 4-plate boundaries and a skywalk
 *  plate can thread through at `walkLevel`; a jumper brings the axis back to the grid, two 2×2 round bricks flare the trunk, a 2×2 and a 4×4
 *  round plate in Dark Purple are the lattice, and a 6×6 round plate is the canopy top: 1 → 2 → 4 → 6, the funnel of the real tree. Green and
 *  Lime round plates ring the canopy rim, a Magenta hub covers the centre hole. */
export function supertree(bp: Blueprint, x: number, y: number, z: number, bricks: number, R?: Reserve, walkLevel?: number) {
  bp.tag = 'supertree'; const cx = x - 0.5, cz = z - 0.5;
  bp.part('jumper_2x2', x - 1, y, z - 1, 'DarkBluishGray'); let ty = y + 1;
  for (let k = 0; k < bricks; k++) {
    bp.part('round_1x1', cx, ty, cz, 'Magenta'); ty += 3;
    if (k === bricks - 1) break;
    if (ty !== walkLevel) bp.part(k % 3 === 2 ? 'flower_1x1' : 'plant_3leaves', cx, ty, cz, k % 3 === 2 ? 'Lime' : 'Green');
    ty += 1;
  }
  bp.part('jumper_2x2', x - 1, ty, z - 1, 'Magenta'); ty += 1;
  bp.part('roundbrick_2x2', x - 1, ty, z - 1, 'Magenta'); ty += 3; bp.part('roundbrick_2x2', x - 1, ty, z - 1, 'Magenta'); ty += 3;
  bp.part('roundplate_2x2', x - 1, ty, z - 1, 'DarkPurple'); ty += 1;
  bp.part('roundplate_4x4', x - 2, ty, z - 2, 'DarkPurple'); ty += 1;
  bp.part('roundplate_6x6', x - 3, ty, z - 3, 'LightBluishGray'); ty += 1;
  bp.part('roundplate_2x2', x - 1, ty, z - 1, 'Magenta');
  for (const [px, pz] of [[x - 3, z - 1], [x - 3, z], [x + 2, z - 1], [x + 2, z], [x - 1, z - 3], [x, z - 3], [x - 1, z + 2], [x, z + 2]] as [number, number][]) bp.part('roundplate_1x1', px, ty, pz, 'Green');   // planted rim on the eight edge studs
  for (const [px, pz] of [[x - 2, z - 2], [x + 1, z + 1], [x + 1, z - 2], [x - 2, z + 1]] as [number, number][]) bp.part('flower_1x1', px, ty, pz, 'Lime');                                              // a cheese-slope brim was tried: it squared the disc off
  R?.add(x - 3, z - 3, 6, 6); bp.tag = ''; return ty;
}
/** OCBC Skyway: a 1×8 plate threaded through two trunks 7 studs apart on the same axis row, at a shared plate boundary. */
export function skywalk(bp: Blueprint, xa: number, xb: number, z: number, level: number) {
  bp.tag = 'supertree'; const x0 = Math.min(xa, xb) - 0.5; const d = Math.abs(xb - xa) + 1; if (![2, 3, 4, 6, 8].includes(d)) throw new Error('skywalk: trunks must be 1, 2, 3, 5 or 7 studs apart');
  bp.part(`plate_1x${d}`, x0, level, z - 0.5, 'LightBluishGray', 1); bp.tag = '';
}

// ---- Peranakan shophouse terrace (Koon Seng Road) -------------------------------------------------------------------------------------
/** Three bays, each 5 wide (a white pilaster + 4 interior), 6 deep, two storeys, front toward local +z. Ground floor: a five-foot way behind
 *  round white columns, timber folding doors (1×2×3 frames with shutters; the middle bay stands open). Upper floor: one tall louvred window per
 *  bay centred between plaster, white cornice slab. Terracotta hip roof through `hipCorners`. Local origin = back-left corner of the body. */
export function shophouseRow(bp: Blueprint, ox: number, y0: number, oz: number, rot: number, colors = ['BrightPink', 'MediumAzure', 'BrightLightYellow'], R?: Reserve, plaque?: string, floorPrint?: string, paired = false) {
  bp.tag = 'shophouse'; const { part, vox, cell } = placer(bp, ox, oz, rot); const W = 16, D = 6; const TRIM = 'White', TIMBER = 'DarkBrown', SHUT = 'DarkGreen', ROOF = 'DarkOrange';
  if (R) { const cs = [cell(-1, -1), cell(W, D + 1)]; R.add(Math.min(cs[0][0], cs[1][0]) - 1, Math.min(cs[0][1], cs[1][1]) - 1, Math.abs(cs[1][0] - cs[0][0]) + 2, Math.abs(cs[1][1] - cs[0][1]) + 2); }
  for (let lx = 0; lx < W; lx++) for (let lz = 0; lz < D; lz++) vox('plate', lx, y0, lz, 'Tan');                        // ground slab incl. the five-foot way row (z = 5)
  const GF = 12, UF = 10; const slabY = y0 + 1 + GF;                                                                        // ground floor 12 plates (a person fits under the walkway), cornice slab, upper floor 10
  for (let i = 0; i < 3; i++) {
    const bx = 5 * i, C = colors[i];
    for (let dy = 0; dy < GF; dy++) { for (let lz = 0; lz <= 4; lz++) vox('brick', bx, y0 + 1 + dy, lz, TRIM); for (let lx = bx + 1; lx <= bx + 4; lx++) vox('brick', lx, y0 + 1 + dy, 0, C); }   // pilaster + back wall
    for (const fx of [bx + 1, bx + 3]) { part('window_1x2x3', fx, y0 + 1, 4, TIMBER); if (i !== 1) part('shutter_1x2x3', fx, y0 + 1, 4, TIMBER); }             // folding timber doors; the middle shop is open
    if (i === 1 && plaque) part('brick_1x4', bx + 1, y0 + GF - 2, 4, 'Black', 3, plaque); else for (let dy = 0; dy < 3; dy++) for (let lx = bx + 1; lx <= bx + 4; lx++) vox('brick', lx, y0 + GF - 2 + dy, 4, C);   // fascia over the doors carries the shop plaque
    for (let lz = 1; lz <= 3; lz++) for (let lx = bx + 1; lx <= bx + 4; lx++) vox('tile', lx, y0 + 1, lz, 'DarkTan');                                        // shop floor
    for (let k = 0; k < 4; k++) part('round_1x1', bx, y0 + 1 + 3 * k, 5, TRIM);                                                                              // five-foot-way column, four bricks
    if (floorPrint) { part('tile_1x2', bx + 1, y0 + 1, 5, 'Tan', 1, floorPrint); part('tile_1x2', bx + 3, y0 + 1, 5, 'Tan', 1, floorPrint); } else for (let lx = bx + 1; lx <= bx + 4; lx++) vox('tile', lx, y0 + 1, 5, 'Tan');   // walkway floor tiles
    // upper floor: pilaster, plaster with a centred window, back wall
    for (let dy = 0; dy < UF; dy++) { for (let lz = 0; lz <= 5; lz++) vox('brick', bx, slabY + 1 + dy, lz, paired && lz === 5 && dy < UF - 1 ? C : TRIM); for (let lx = bx + 1; lx <= bx + 4; lx++) for (const lz of [0, 5]) if ((!paired || lz === 0) && (lx === bx + 1 || lx === bx + 4) || dy === UF - 1) vox(dy === UF - 1 && paired && lz === 5 ? 'plate' : 'brick', lx, slabY + 1 + dy, lz, dy === UF - 1 && paired && lz === 5 ? TRIM : C); }
    if (paired) { for (const wx of [bx + 1, bx + 3]) { part('window_1x2x3', wx, slabY + 1, 5, TRIM); part('shutter_1x2x3', wx, slabY + 1, 5, SHUT); } }      // Koon Seng Road: a pair of tall louvred windows fills the bay between white pilasters, a white lintel band above
    else { part('window_1x2x3', bx + 2, slabY + 1, 5, TRIM); part('shutter_1x2x3', bx + 2, slabY + 1, 5, SHUT); }                                           // bay window toward the street
    part('window_1x2x3', bx + 2, slabY + 1, 0, TRIM, 2); part('shutter_1x2x3', bx + 2, slabY + 1, 0, SHUT, 2);                                               // and one at the back (air-well side)
  }
  for (let dy = 0; dy < GF; dy++) for (let lz = 0; lz <= 4; lz++) vox('brick', W - 1, y0 + 1 + dy, lz, TRIM); for (let k = 0; k < 4; k++) part('round_1x1', W - 1, y0 + 1 + 3 * k, 5, TRIM);   // end pilaster + column
  for (let dy = 0; dy < UF; dy++) for (let lz = 0; lz <= 5; lz++) vox('brick', W - 1, slabY + 1 + dy, lz, TRIM);
  { const a = cell(0, 0), b = cell(W - 1, D - 1); const X = Math.min(a[0], b[0]), Z = Math.min(a[1], b[1]), Wd = Math.abs(b[0] - a[0]) + 1, Dd = Math.abs(b[1] - a[1]) + 1; if (rot % 2) spanPlatesX(bp, X, Z, Wd, Dd, slabY, TRIM); else spanPlates(bp, X, Z, Wd, Dd, slabY, TRIM); }   // cornice slab / upper floor: strips from the back wall to the shopfront, never a lone plate over the shop
  // hip roof: eave plates one stud out all round, 33° slopes, 3×3 hip corners, inner block, ridge along the terrace
  const ry = slabY + 1 + UF; const [rx0w, rz0w] = cell(-1, -1), [rx1w, rz1w] = cell(W, D); const RX = Math.min(rx0w, rx1w), RZ = Math.min(rz0w, rz1w), RW = Math.abs(rx1w - rx0w) + 1, RD = Math.abs(rz1w - rz0w) + 1;
  spanPlates(bp, RX, RZ, RW, RD, ry, ROOF); hipCorners(bp, 'slope_corner_3x3', RX, RZ, RW, RD, ry + 1, ROOF);
  for (let x = RX + 3; x < RX + RW - 3; x += 2) { const two = x + 2 <= RX + RW - 3; bp.part(two ? 'slope_2x3' : 'slope_1x3', x, ry + 1, RZ, ROOF, 2); bp.part(two ? 'slope_2x3' : 'slope_1x3', x, ry + 1, RZ + RD - 3, ROOF, 0); if (!two) break; }
  for (let z = RZ + 3; z < RZ + RD - 3; z += 2) { const two = z + 2 <= RZ + RD - 3; bp.part(two ? 'slope_2x3' : 'slope_1x3', RX, ry + 1, z, ROOF, 3); bp.part(two ? 'slope_2x3' : 'slope_1x3', RX + RW - 3, ry + 1, z, ROOF, 1); if (!two) break; }
  bp.fill('brick', RX + 3, ry + 1, RZ + 3, RW - 6, 3, RD - 6, ROOF);
  const along = RW >= RD; const L = along ? RW - 6 : RD - 6; let k = 0; while (k < L) { const s = L - k >= 4 ? 4 : 2; bp.part(s === 4 ? 'ridge_4x2' : 'ridge_2x2', along ? RX + 3 + k : RX + 3, ry + 4, along ? RZ + 3 : RZ + 3 + k, ROOF, along ? 0 : 1); k += s; }
  bp.tag = '';
}

// ---- Hawker stall ---------------------------------------------------------------------------------------------------------------------
/** A hawker-centre stall as a kiosk: grey back wall with a shelf of cups, half-height side walls under white posts, red canopy on a white front
 *  beam, yellow signboard on the canopy's front edge; steel counter along the front with the gas ring under the hawker's wok and a small glass
 *  display case; the hawker stands inside facing local +z with the frypan in the right hand. Two tables with red and blue round-brick stools
 *  in front. Local origin = the hawker's cell (0, 0); the kiosk spans x −3..2, z −2..3, tables to z 7. */
export function hawkerStall(bp: Blueprint, ox: number, y: number, oz: number, rot: number, hawker: FigOpts2, sign?: string, R?: Reserve) {
  bp.tag = 'hawker'; const { part, vox, cell } = placer(bp, ox, oz, rot); const WALL = 'LightBluishGray', POST = 'White', ROOF = 'BrightRed', STEEL = 'LightBluishGray'; const F = 4;   // F = the counter row; the hawker stands at z 1, a clear stud from the shelf
  if (R) { const a = cell(-4, -3), b = cell(3, 9); R.add(Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.abs(b[0] - a[0]) + 1, Math.abs(b[1] - a[1]) + 1); }
  for (let lx = -3; lx <= 2; lx++) for (let dy = 0; dy < 16; dy++) if (!(dy === 9 && lx >= -2 && lx <= 1)) vox(dy === 15 ? 'plate' : 'brick', lx, y + dy, -2, WALL);   // back wall (16 plates: the roof lands on it), a slot for the shelf plate
  part('plate_2x4', -2, y + 9, -2, WALL, 1); part('roundplate_1x1', -2, y + 10, -1, 'White'); part('roundplate_1x1', -2, y + 11, -1, 'White'); part('roundplate_1x1', -2, y + 12, -1, 'BrightRed');   // shelf: half in the wall, half out; a stack of plates at its far end (the hawker's hair box covers the two cells nearest him)
  for (const sx of [-3, 2]) { for (let lz = -1; lz <= F - 1; lz++) for (let dy = 0; dy < 6; dy++) vox('brick', sx, y + dy, lz, WALL); for (let lz = -1; lz <= F - 1; lz++) vox('tile', sx, y + 6, lz, WALL); }   // half walls, capped
  for (const [px, pz] of [[-3, F], [2, F]]) for (let k = 0; k < 5; k++) part('round_1x1', px, y + 3 * k, pz, POST);                          // front posts
  part('brick_1x4', -2, y, F, STEEL, 1); part('plate_1x4', -2, y + 3, F, 'DarkBluishGray', 1); part('plate_1x4', -2, y + 4, F, STEEL, 1);      // counter: brick + two plates = 5
  part('flower_1x1', -1, y + 5, F, 'TransOrange');                                                                                              // gas ring under the wok (the wok is wider than its cell: nothing beside it)
  part('brick_1x1', 1, y + 5, F, 'TransClear'); part('brick_1x1', 1, y + 8, F, 'TransClear'); part('plate_1x1', 1, y + 11, F, STEEL);           // glass display case at the counter's end
  part('plate_1x6', -3, y + 15, F, POST, 1);                                                                                                    // front beam on the posts
  { const a = cell(-3, -2), b = cell(2, F); const X = Math.min(a[0], b[0]), Z = Math.min(a[1], b[1]), Wd = Math.abs(b[0] - a[0]) + 1, Dd = Math.abs(b[1] - a[1]) + 1; if (rot % 2) spanPlatesX(bp, X, Z, Wd, Dd, y + 16, ROOF); else spanPlates(bp, X, Z, Wd, Dd, y + 16, ROOF); }   // strips span wall → beam
  part('brick_1x6', -3, y + 17, F, 'Yellow', 3, sign); part('tile_1x2', -3, y + 17, -2, ROOF, 1); part('tile_1x2', 1, y + 17, -2, ROOF, 1);  // signboard on the canopy's front edge, print toward the street
  const [fx, fz] = cell(0, 1); const fig = minifig2(bp, rot & 1 ? fx + 0.5 : fx, y, rot & 1 ? fz : fz + 0.5, rot, { ...hawker, hold: [{ key: 'frypan', color: 'Black', hand: 'R' }] });
  for (const [tx, tz, stools] of [[-2, F + 3, [[-3, F + 2], [-3, F + 4]]], [1, F + 3, [[2, F + 2], [2, F + 4]]]] as [number, number, [number, number][]][]) {
    part('round_1x1', tx, y, tz, STEEL); part('roundplate_1x1', tx, y + 3, tz, STEEL); { const [wx, wz] = cell(tx, tz); bp.part('plate_2x2', wx - 0.5, y + 4, wz - 0.5, 'White'); }
    stools.forEach(([sx, sz], i) => part('round_1x1', sx, y, sz, i % 2 ? 'BrightBlue' : 'BrightRed'));
  }
  { const [wx, wz] = cell(-2, F + 3); bp.part('rice_bowl', wx - 0.5, y + 5, wz - 0.5, 'White'); } { const [wx, wz] = cell(1, F + 3); bp.part('cup', wx + 0.5, y + 5, wz - 0.5, 'White', 1); }
  bp.tag = ''; return fig;
}

// ---- Merlion --------------------------------------------------------------------------------------------------------------------------
/** White Merlion facing local −x (the bay), 21 plates over a two-step grey plinth. Proportions from the statue: head and mane a third, a chest
 *  that leans out over the water (an inverted slope carries the upper body one stud forward), a fish tail sweeping up behind (45° slope with
 *  two cheese-slope fin tips). Head brick with the face print, jutting jaw plate, a 2×2 slope behind and another on top as the mane. The jet
 *  leaves under the jaw as two clear 1×3 plates and lands on a clear round-brick column rising from the water three studs out, white foam
 *  at its foot. Scales print on the lower body. Local origin = body cell (0, 0); body x 0..1, z 0..1; tail to x 3; column at x −3. */
export function merlion(bp: Blueprint, ox: number, y: number, oz: number, rot: number, waterY: number, R?: Reserve, facePrint?: string, scalesPrint?: string) {
  bp.tag = 'merlion'; const { part, cell } = placer(bp, ox, oz, rot); const W = 'White', STONE = 'LightBluishGray';
  if (R) { const a = cell(-4, -1), b = cell(4, 2); R.add(Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.abs(b[0] - a[0]) + 1, Math.abs(b[1] - a[1]) + 1); }
  part('plate_2x6', -1, y, 0, STONE, 1); part('plate_2x2', 0, y + 1, 0, 'DarkBluishGray');                                  // plinth, two steps
  part('slope_2x2', 2, y + 1, 0, W, 3); part('cheese_1x1', 3, y + 4, 0, W, 1); part('cheese_1x1', 3, y + 4, 1, W, 1);       // tail sweeping up behind, fin tips
  part('brick_2x2', 0, y + 2, 0, W, 2, scalesPrint); part('brick_2x2', 0, y + 5, 0, W);                                     // lower body (scales toward the bay)
  part('slope_inv_2x2', -1, y + 8, 0, W, 3); part('brick_2x2', -1, y + 11, 0, W);                                           // chest leaning out one stud, upper body
  part('plate_2x2', 0, y + 14, 0, W); part('plate_1x3', -3, y + 14, 0, 'TransClear', 1); part('plate_1x3', -3, y + 14, 1, 'TransClear', 1);   // neck ledge; the jet leaves as a clear sheet
  part('brick_2x2', -1, y + 15, 0, W, 2, facePrint); part('plate_1x2', -2, y + 15, 0, W);                                   // head (face toward the bay), jaw over the water
  part('curve_2x2', 1, y + 15, 0, W, 1); part('slope_2x2', -1, y + 18, 0, W, 1);                                            // mane: a curved slope behind the head, a 45° slope on top, both sweeping back
  part('cheese_1x1', -1, y + 21, 0, W, 1); part('cheese_1x1', -1, y + 21, 1, W, 1);                                        // two tufts on the brow
  const [jx, jz] = cell(-3, 0); let cy = waterY; while (cy + 3 <= y + 14) { bp.part('round_1x1', jx, cy, jz, 'TransClear'); cy += 3; } while (cy < y + 14) { bp.part('roundplate_1x1', jx, cy, jz, 'TransClear'); cy += 1; }
  for (const [fx, fz] of [[-4, 0], [-3, 1], [-3, -1]]) { const [wx, wz] = cell(fx, fz); bp.part('roundplate_1x1', wx, waterY, wz, W); }   // foam
  bp.tag = ''; return [jx, jz] as [number, number];
}

// ---- Marina Bay Sands -----------------------------------------------------------------------------------------------------------------
/** Three 6-wide towers × 15 bricks + 4 jumper rows (49 plates) in a row along local x, glass on both broad faces. Real proportions: each tower
 *  is two slabs — a straight one (local −z) and a curved one toward the bay (+z) that bows out at the base — so the bay-side glass row (with its
 *  white 1×1 edge fins) steps back half a stud at each of four stage boundaries on rows of clear 1×2 jumpers, 4 deep at the base to 2 at the top:
 *  a stepped curve with a floor line at every step, the half-stud sky-gap between core and glass that the real towers have, and at the top the
 *  two glass slabs meet with nothing between them. The grey core shows only on the narrow ends. Grey core, Trans-Dark Blue glass (the 21057 colour). A two-plate white SkyPark, 4 deep, spans all three towers and
 *  cantilevers past the −x tower to a wedge-plate prow; infinity pool along the bay edge, palms along the back, tiles elsewhere. A two-brick
 *  glass-fronted podium (the Shoppes) runs along the bay side. Local origin = the −x tower's back-left cell; the whole thing spans x −7..21, z −1..8. */
export function mbs(bp: Blueprint, ox: number, y: number, oz: number, rot: number, R?: Reserve) {
  bp.tag = 'mbs'; const { part, vox, cell } = placer(bp, ox, oz, rot); const CORE = 'LightBluishGray', GLASS = 'TransDarkBlue', FIN = 'LightBluishGray', DECK = 'White';   // fins in the core grey: white ones turned the facade into a grid of balconies
  if (R) { const a = cell(-8, -2), b = cell(22, 8); R.add(Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.abs(b[0] - a[0]) + 1, Math.abs(b[1] - a[1]) + 1); }
  for (let lx = -1; lx <= 20; lx++) for (let lz = -1; lz <= 7; lz++) vox('plate', lx, y, lz, CORE);                              // base slab
  const TW = 6, TX = [0, 7, 14]; const stages: [number, number][] = [[4, 3.5], [4, 3.0], [3, 2.5], [3, 2.0], [1, 1.5]];   // [bricks, glass-row centre z]: the front face leans back half a stud per stage
  let by = y + 1;
  stages.forEach(([nb, C], k) => {
    const gz = C - 0.5, coreMax = Math.floor(C - 0.5) - 1;                                                                        // glass span [gz, gz+1); core cells 0..coreMax stay clear of it (a half-stud sky-gap between the two slabs, as on the real towers)
    if (k > 0) { for (const tx of TX) for (let lx = tx; lx < tx + TW; lx++) { part('jumper_1x2', lx, by, C - 1, 'TransClear', 1); for (let lz = 1; lz <= Math.floor(C - 2); lz++) vox('plate', lx, by, lz, CORE); } if (C - 1 >= 1) for (const tx of TX) { part('plate_1x1', tx, by, 0, FIN); part('plate_1x1', tx + TW - 1, by, 0, FIN); for (let lx = tx + 1; lx < tx + TW - 1; lx++) vox('plate', lx, by, 0, GLASS); } by += 1; }   // the straight slab keeps a plate course at each jumper level, until the top where the jumper row spans both slabs   // jumper row: one stud at the plate's centre carries the next stage half a stud back; a clear floor line on the facade (white striped it into balconies); core plates at this level stop a cell short of the jumper's first cell
    for (const tx of TX) {
      for (let bb = 0; bb < nb; bb++) { const yy = by + 3 * bb;
        for (let lz = 1; lz <= coreMax; lz++) for (let lx = tx; lx < tx + TW; lx++) for (let dyy = 0; dyy < 3; dyy++) vox('brick', lx, yy + dyy, lz, CORE);
        for (const [zz, odd] of [[gz, bb % 2 === 1], [0, bb % 2 === 0]] as [number, boolean][]) {                                   // bay-side slab steps back; the straight slab stays at z 0
          if (odd) { part('brick_1x2', tx + 1, yy, zz, GLASS, 1); part('brick_1x2', tx + 3, yy, zz, GLASS, 1); } else part('brick_1x4', tx + 1, yy, zz, GLASS, 1);
          part('brick_1x1', tx, yy, zz, FIN); part('brick_1x1', tx + TW - 1, yy, zz, FIN);                                           // white edge fins
        }
      }
    }
    by += 3 * nb;
  });
  const dy = by;                                                                                                                // 50: SkyPark on the tower tops
  for (const lx of [-4, 4, 12]) { part('plate_2x8', lx, dy, 0, DECK, 1); part('plate_2x8', lx, dy, 2, DECK, 1); }                     // layer 1: two rows of 2×8 strips, the back row on the tower tops, the front row overhanging the bay side
  for (const lx of [-2, 6]) { part('plate_2x8', lx, dy + 1, 1, DECK, 1); part('plate_1x8', lx, dy + 1, 0, DECK, 1); part('plate_1x8', lx, dy + 1, 3, DECK, 1); }   // layer 2 offset by one row and four studs: the overlapping bond that ties the overhang to the towers
  part('plate_2x6', 14, dy + 1, 1, DECK, 1); part('plate_1x6', 14, dy + 1, 0, DECK, 1); part('plate_1x6', 14, dy + 1, 3, DECK, 1);
  part('wedge_4x2_r', -6, dy + 1, 0, DECK, 2); part('wedge_4x2_l', -6, dy + 1, 2, DECK, 2);                                       // the prow: two wedge plates narrowing toward the tip
  for (let lx = -2; lx <= 14; lx += 4) part('tile_2x4', lx, dy + 2, 1, DECK, 1); part('tile_2x2', 18, dy + 2, 1, DECK);              // deck
  part('tile_2x2', -4, dy + 2, 1, DECK); part('tile_1x2', 18, dy + 2, 0, DECK, 1); part('tile_1x2', 18, dy + 2, 3, DECK, 1);
  for (let lx = 2; lx <= 16; lx += 2) part('tile_1x2', lx, dy + 2, 3, 'TransLightBlue', 1);                                        // infinity pool along the bay edge
  for (const lx of [0, 4, 8, 12, 16]) part('roundplate_1x1', lx, dy + 2, 0, 'Green'); for (const lx of [2, 10]) part('flower_1x1', lx, dy + 2, 0, 'Green');   // SkyPark garden along the back
  part('tile_1x2', -2, dy + 2, 0, DECK, 1); part('tile_1x2', -2, dy + 2, 3, DECK, 1); part('tile_1x2', 0, dy + 2, 3, DECK, 1);
  // podium — the Shoppes: two bricks, glass along the bay side, white tiled top
  for (let lx = -1; lx <= 20; lx++) for (let lz = 5; lz <= 6; lz++) for (let dy = 1; dy <= 6; dy++) vox('brick', lx, y + dy, lz, CORE);
  for (let lx = -1; lx <= 15; lx += 4) { part('brick_1x4', lx, y + 1, 7, GLASS, 1); part('brick_1x4', lx, y + 4, 7, GLASS, 1); } part('brick_1x2', 19, y + 1, 7, GLASS, 1); part('brick_1x2', 19, y + 4, 7, GLASS, 1);
  for (let lx = -1; lx <= 20; lx++) for (let lz = 5; lz <= 7; lz++) vox('tile', lx, y + 7, lz, DECK);
  bp.tag = '';
}

// ---- Ice-cream uncle's cart -----------------------------------------------------------------------------------------------------------
/** The Singapore ice-cream cart: a white box with a blue band on a wheel plate, parked on a ground-colour 2×2 plate (the wheels then stand a
 *  tenth of a plate off the ground), a yellow umbrella on a 4L bar, a display popsicle and a scoop stack on top. Wheels on the local ±x sides.
 *  Local origin = the cart's back-left cell; the box covers x 0..1, z 0..1. */
export function iceCreamCart(bp: Blueprint, ox: number, y: number, oz: number, rot: number, ground: string, R?: Reserve, sidePrint?: string) {
  bp.tag = 'cart'; const { part, cell } = placer(bp, ox, oz, rot);
  if (R) { const a = cell(-1, -1), b = cell(2, 2); R.add(Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.abs(b[0] - a[0]) + 1, Math.abs(b[1] - a[1]) + 1); }
  part('plate_2x2', 0, y, 0, ground); part('wheelplate_2x2', 0, y + 1, 0, 'LightBluishGray'); part('cart_wheel_l', 0, y + 1, 0, 'Black'); part('cart_wheel_r', 0, y + 1, 0, 'Black');
  part('brick_2x2', 0, y + 2, 0, 'White', 0, sidePrint); part('plate_2x2', 0, y + 5, 0, 'MediumAzure'); part('brick_2x2', 0, y + 6, 0, 'White'); part('plate_2x2', 0, y + 9, 0, 'White');
  part('roundplate_1x1', 1, y + 10, 1, 'LightBluishGray'); part('bar_4l', 1, y + 11, 1, 'LightBluishGray');
  { const [bx, bz] = cell(1, 1); bp.part('umbrella', bx + 0.5 - 3, y + 18, bz + 0.5 - 3, 'Yellow'); }
  part('roundplate_1x1', 0, y + 10, 0, 'White'); part('popsicle', 0, y + 11, 0, 'Coral'); part('icecream_scoops', 0, y + 10, 1, 'White');
  bp.tag = '';
}

// ---- Orchid bed (Vanda Miss Joaquim) ------------------------------------------------------------------------------------------------------
export function orchidBed(bp: Blueprint, cells: [number, number][], y: number, R?: Reserve) {
  bp.tag = 'orchid'; const COL = ['MediumLavender', 'Magenta', 'MediumLavender', 'Lavender'];
  cells.forEach(([x, z], i) => { if (i % 3 === 2) { bp.part('plant_3leaves', x, y, z, 'Green'); } else { bp.part('flower_stem', x, y, z, 'BrightGreen'); bp.part('flower_7', x, y + 3, z, COL[i % COL.length]); } R?.add(x, z, 1, 1); });
  bp.tag = '';
}
