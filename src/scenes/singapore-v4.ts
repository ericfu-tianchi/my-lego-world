// Singapore landmarks, v4 (2026-10-01): rebuilt on the exploded-assembly pipeline (every brick a brick, CLAUDE.md rule 12).
import { Blueprint } from '../core/builder';
import { Reserve } from './lib';
import { placer } from './singapore';
import { spanPlates, spanPlatesX, hipCorners } from './lib';

/** Marina Bay Sands v10. Proportions from docs/refs/mbs-moc/real-mbs-jays-photo.jpg: SkyPark 34 long ≈ 1.7 × tower height, towers 6 wide with
 *  4-stud gaps, the cantilever one tower-width past the north tower (−x), the south end a 2-stud rounded lip. Three `mbs10_tower` assemblies
 *  (straight bay leaf + back leaf leaning on hinges, trans tiles on side studs); the SkyPark is a white hull: a brick course whose underside
 *  sweeps up to the cantilever tip on inverted 6×1 curved slopes, a 4-wide binding plate course with round-ended plates fore and aft, and a
 *  tiled deck — grey observation deck at the tip, the infinity pool in three deep basins along the bay edge with loungers and palms behind,
 *  two white lift-core pavilions. The Shoppes podium: the towers' glass over a dark backing under a saw-tooth white roof. Bay side is +z.
 *  Local footprint x 0..34, z 0..9 (towers z 0..4, deck z 1..5, walk z 5, podium z 6..9); 45 + 5 plates. */
export function mbs10(bp: Blueprint, ox: number, y: number, oz: number, rot: number, R?: Reserve) {
  bp.tag = 'mbs'; const { part, vox, cell, asm } = placer(bp, ox, oz, rot);
  const W = 'White', DECK = 'LightBluishGray', POOL = 'TransLightBlue', GLASS = 'TransLightBlue', BACKING = 'DarkBluishGray';
  if (R) { const a = cell(0, 0), b = cell(33, 8); R.add(Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.abs(b[0] - a[0]) + 1, Math.abs(b[1] - a[1]) + 1); }
  const TX = [6, 16, 26]; for (const tx of TX) asm('mbs10_tower', tx, y, 0, W);
  const H = y + 45;
  /** a row of 1×N parts along +x from x0 to x1 at row z, lengths in order */
  const run = (kind: 'brick' | 'tile', z: number, yy: number, x0: number, lens: number[], color: string) => { let x = x0; for (const L of lens) { part(`${kind}_1x${L}`, x, yy, z, color, 1); x += L; } };
  // ---- hull: one brick course (H..H+3); the cantilever's underside is four inverted curved slopes, thin end at the tip (outer rows one stud shorter: the tip is round)
  // (the tip's first stud is the round plate alone: thinner, and nothing pokes out of its curve)
  for (const z of [2, 3]) part('curve_inv_6x1', 1, H, z, W, 3);
  for (const z of [1, 4]) part('curve_inv_6x1', 2, H, z, W, 3);
  run('brick', 1, H, 8, [8, 8, 8], W); run('brick', 2, H, 7, [6, 8, 8, 3], W); run('brick', 3, H, 7, [3, 8, 8, 6], W); run('brick', 4, H, 8, [8, 8, 8], W);
  // ---- binding course (H+3): every row of the hull hangs from a 4-wide plate; round ends fore and aft
  part('plate_4x6_round', 0, H + 3, 1, W); part('plate_4x12', 6, H + 3, 1, W, 1); part('plate_4x10', 18, H + 3, 1, W, 1); part('plate_4x6_round', 28, H + 3, 1, W);
  // ---- deck (H+4): what is on the real SkyPark, top to bottom of the plan
  const D = H + 4;
  // round ends: quarter-circle tiles step round the round plate's curve (the corner cells of the plate are not there)
  const Q = (x: number, z: number, r: number, c: string) => part('tile_quarter_1x1', x, D, z, c, r);
  Q(0, 2, 2, DECK); Q(0, 3, 3, DECK); Q(1, 1, 2, DECK); Q(1, 4, 3, DECK); part('tile_1x2', 1, D, 2, DECK); part('tile_2x4', 2, D, 1, DECK, 1); part('tile_2x4', 2, D, 3, DECK, 1);   // observation deck at the tip
  Q(33, 2, 1, W); Q(33, 3, 0, W); Q(32, 1, 1, W); Q(32, 4, 0, W); part('tile_1x2', 32, D, 2, W);                                                                 // south lip                                                                     // south lip
  // The SkyPark between the ends (2026-10-01, Eric: the pool should make you want to swim): two plate layers so the pool can be built in depth —
  // Dark Azure basin under Trans-Light-Blue water, flush with the deck like the real vanishing edge, two studs deep along the bay side in three
  // basins (one per tower) split by white walkways; behind each basin a row of white sun loungers on raised plates with palms between them;
  // the lift-core pavilions at either end of the pool deck.
  const SECT: [number, number][] = [[8, 13], [15, 22], [24, 29]]; const inPool = (x: number) => SECT.some(([a, b]) => x >= a && x <= b);
  for (let x = 6; x < 32; x++) for (let z = 1; z < 5; z++) {
    if (inPool(x) && z >= 3) { vox('plate', x, D, z, 'DarkAzure'); vox('tile', x, D + 1, z, POOL); continue; }
    vox('plate', x, D, z, W);
    const pav = (x <= 7 || x >= 30) && z <= 2; if (pav || (inPool(x) && z <= 2)) continue;
    vox('tile', x, D + 1, z, W);
  }
  for (const px of [6, 30]) { part('plate_2x2', px, D + 1, 1, W); part('plate_2x2', px, D + 2, 1, W); part('tile_2x2', px, D + 3, 1, W); }   // lift-core pavilions
  for (const [s0, s1] of SECT) for (let x = s0; x <= s1; x++) {
    if ((x - s0) % 3 === 0) { part('tile_1x1', x, D + 1, 1, W); part('plate_1x1', x, D + 1, 2, W); part('flower_1x1', x, D + 2, 2, x % 2 ? 'Green' : 'BrightGreen'); }   // a palm crown on the pool edge (three-leaf plates read as lily pads at this scale)
    else { part('plate_1x2', x, D + 1, 1, W); part('grilletile_1x2', x, D + 2, 1, W, 1); }                                                                     // a sun lounger
  }
  // ---- walk and the Shoppes podium: smoked glass storey, white roof, saw-tooth of 1×2 cheese slopes
  for (let x = 2; x < 34; x++) vox('tile', x, y, 5, DECK);
  for (let x = 2; x + 4 <= 34; x += 4) part('brick_1x4', x, y, 8, GLASS, 1);
  for (let x = 2; x < 34; x++) for (const [z, c] of [[6, W], [7, BACKING]] as const) for (let d = 0; d < 3; d++) vox('brick', x, y + d, z, c);   // dark backing behind the glass, as on the towers
  for (let x = 2; x < 34; x++) for (const z of [6, 7, 8]) vox('plate', x, y + 3, z, W);
  for (let x = 2; x < 34; x++) { part('cheese_1x2', x, y + 4, 7, W, 1); vox('tile', x, y + 4, 6, W); }
  bp.tag = '';
}

/** Merlion v6: the statue (`merlion6`, one studs-out assembly, faces +x) on a Dark Blue wave plinth ringed with cheese slopes leaning in
 *  (a white crest every third), on a grey stone kerb; the jet leaves the nozzle at the front of the open mouth and falls in a parabola —
 *  each stud forward a vertical run of 1×1 round plates, joined to the next run by a 1×2 plate — into the water at `waterY`, with foam.
 *  Local box: kerb x −1..7 × z −1..5 at plate y; statue x 0..7 × z 0..5 from y + 3 (37 plates); the jet from x 7 at y + 29 down to the water. */
export function merlion6(bp: Blueprint, ox: number, y: number, oz: number, rot: number, waterY: number, reach = 9, R?: Reserve) {
  bp.tag = 'merlion'; const { part, vox, cell, asm } = placer(bp, ox, oz, rot);
  const W = 'White', DB = 'DarkBlue', STONE = 'LightBluishGray', TLB = 'TransLightBlue';
  if (R) { const a = cell(-1, -1), b = cell(7, 5); R.add(Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.abs(b[0] - a[0]) + 1, Math.abs(b[1] - a[1]) + 1); }
  for (let x = -1; x <= 7; x++) for (let z = -1; z <= 5; z++) vox('plate', x, y, z, STONE);
  for (let x = 0; x < 7; x++) for (let z = 0; z < 5; z++) { vox('plate', x, y + 1, z, DB); vox('plate', x, y + 2, z, DB); }
  let k = 0; const crest = () => (k++ % 3 === 1 ? W : DB);
  for (let x = -1; x <= 7; x++) { part('cheese_1x1', x, y + 1, -1, crest(), 0); part('cheese_1x1', x, y + 1, 5, crest(), 2); }   // high end inward
  for (let z = 0; z < 5; z++) { part('cheese_1x1', -1, y + 1, z, crest(), 1); part('cheese_1x1', 7, y + 1, z, crest(), 3); }
  asm('merlion6', 0, y + 3, 0, W);
  // jet: from the nozzle (statue plate 26, x 6, z 2) forward; drops grow by one plate every other stud — a parabola on the plate grid
  const top = y + 3 + 26; const T = [top]; for (let i = 0; i < reach; i++) T.push(Math.max(waterY, T[i] - Math.max(1, Math.round(0.45 * (i + 0.5)) + (i > 4 ? 1 : 0))));
  T[reach] = waterY;
  for (let i = 0; i < reach; i++) {
    const x = 7 + i; const lo = i === reach - 1 ? waterY : T[i + 1] + 1;
    for (let lv = T[i]; lv > lo; lv--) part('roundplate_1x1', x, lv, 2, TLB);
    if (i < reach - 1) part('plate_1x2', x, lo, 2, TLB, 1); else part('roundplate_1x1', x, lo, 2, TLB);
  }
  const lx = 7 + reach - 1; for (const [fx, fz] of [[lx + 1, 2], [lx, 1], [lx, 3], [lx - 1, 1]]) part('roundplate_1x1', fx, waterY, fz, W);   // foam
  bp.tag = '';
}

/** Koon Seng Road terrace v2 (2026-10-01, Eric: 糙了一点). Against `real-koon-seng-road-commons-colorful.jpg`: each house is its own pastel
 *  from foot to eave with white ornament on it, not white with a coloured strip. Per bay (5 wide: white pilaster + 4): ground floor folding
 *  timber doors under a pastel fascia, the five-foot way behind white round columns; upper floor a pair of tall louvred windows in white
 *  frames, the shutters in the bay's contrasting colour (pink → azure, azure → white, yellow → green, as on the street), over a white sill;
 *  above the windows a white lintel, a dentil course of alternating white and pastel 1×1 plates, a white cornice; a forecourt wall in front
 *  with white gate pillars capped by pyramid slopes, the gate open in the middle with a potted plant. Hip roof as before.
 *  Local: body x 0..15, z 0..5 (z 5 = five-foot way), forecourt z 6; front toward local +z. */
export function shophouse2(bp: Blueprint, ox: number, y0: number, oz: number, rot: number, R?: Reserve, plaque?: string, floorPrint?: string) {
  bp.tag = 'shophouse'; const { part, vox, cell } = placer(bp, ox, oz, rot); const W = 16, D = 6;
  const TRIM = 'White', TIMBER = 'DarkBrown', ROOF = 'DarkOrange';
  const BAYS = [{ c: 'BrightPink', s: 'MediumAzure' }, { c: 'MediumAzure', s: 'White' }, { c: 'BrightLightYellow', s: 'DarkGreen' }];
  if (R) { const cs = [cell(-1, -1), cell(W, D + 1)]; R.add(Math.min(cs[0][0], cs[1][0]), Math.min(cs[0][1], cs[1][1]), Math.abs(cs[1][0] - cs[0][0]) + 1, Math.abs(cs[1][1] - cs[0][1]) + 1); }
  for (let lx = 0; lx < W; lx++) for (let lz = 0; lz <= D; lz++) vox('plate', lx, y0, lz, 'Tan');
  const GF = 12, UF = 12; const slabY = y0 + 1 + GF;
  for (let i = 0; i < 3; i++) {
    const bx = 5 * i, { c: C, s: S } = BAYS[i];
    const PW = i === 0 ? C : TRIM;                                                                     // the terrace's end wall is plaster in the end house's colour
    for (let dy = 0; dy < GF; dy++) { for (let lz = 0; lz <= 4; lz++) vox('brick', bx, y0 + 1 + dy, lz, lz === 4 ? TRIM : PW); for (let lx = bx + 1; lx <= bx + 4; lx++) vox('brick', lx, y0 + 1 + dy, 0, C); }
    for (const fx of [bx + 1, bx + 3]) { part('window_1x2x3', fx, y0 + 1, 4, TIMBER); if (i !== 1) part('shutter_1x2x3', fx, y0 + 1, 4, TIMBER); }
    if (i === 1 && plaque) part('brick_1x4', bx + 1, y0 + GF - 2, 4, 'Black', 3, plaque); else for (let dy = 0; dy < 3; dy++) for (let lx = bx + 1; lx <= bx + 4; lx++) vox('brick', lx, y0 + GF - 2 + dy, 4, C);
    for (let lz = 1; lz <= 3; lz++) for (let lx = bx + 1; lx <= bx + 4; lx++) vox('tile', lx, y0 + 1, lz, 'DarkTan');
    for (let k = 0; k < 4; k++) part('round_1x1', bx, y0 + 1 + 3 * k, 5, TRIM);
    if (floorPrint) { part('tile_1x2', bx + 1, y0 + 1, 5, 'Tan', 1, floorPrint); part('tile_1x2', bx + 3, y0 + 1, 5, 'Tan', 1, floorPrint); } else for (let lx = bx + 1; lx <= bx + 4; lx++) vox('tile', lx, y0 + 1, 5, 'Tan');
    // upper floor: the pilaster and the whole front in the bay's pastel; the windows, sill, lintel, dentils and cornice in white
    const uy = slabY + 1;
    for (let dy = 0; dy < 9; dy++) {                                                                   // three brick courses
      for (let lz = 0; lz <= 4; lz++) vox('brick', bx, uy + dy, lz, PW);                               // party wall
      for (const lx of [bx + 1, bx + 4]) vox('brick', lx, uy + dy, 0, C);                                // back wall either side of the back window
      vox('brick', bx, uy + dy, 5, C);                                                                 // the pilaster between the two windows of a house
    }
    for (const [dy, dent] of [[9, false], [10, true], [11, false]] as const) {                         // lintel, dentil course, cornice
      for (let lz = 0; lz <= 4; lz++) vox('plate', bx, uy + dy, lz, TRIM);
      for (let lx = bx + 1; lx <= bx + 4; lx++) vox('plate', lx, uy + dy, 0, TRIM);
      for (let lx = bx; lx <= bx + 4; lx++) vox('plate', lx, uy + dy, 5, dent && (lx - bx) % 2 === 0 ? C : TRIM);
    }
    // the green-shuttered house has both windows pushed open, the pair swung out to either side (Eric 10-02); the others closed
    for (const wx of [bx + 1, bx + 3]) { part('window_1x2x3', wx, uy, 5, TRIM); part(i !== 2 ? 'shutter_1x2x3' : wx === bx + 1 ? 'shutter_open_1x2x3' : 'shutter_open_r_1x2x3', wx, uy, 5, S); }
    part('window_1x2x3', bx + 2, uy, 0, TRIM, 2); part('shutter_1x2x3', bx + 2, uy, 0, S, 2);
    // forecourt (z 6): low pastel walls each side of an open gate, white gate pillars with pyramid caps at the pilasters, a potted plant in the gate
    for (const lx of [bx + 1, bx + 4]) { part('brick_1x1', lx, y0 + 1, 6, C); part('tile_1x1', lx, y0 + 4, 6, TRIM); }
    part('brick_1x1', bx, y0 + 1, 6, TRIM); part('brick_1x1', bx, y0 + 4, 6, TRIM); part('pyramid_1x1', bx, y0 + 7, 6, TRIM);
    part('round_1x1', bx + 2, y0 + 1, 6, 'DarkOrange'); part('plant_3leaves', bx + 2, y0 + 4, 6, 'Green', i);
  }
  for (let dy = 0; dy < GF; dy++) for (let lz = 0; lz <= 4; lz++) vox('brick', W - 1, y0 + 1 + dy, lz, lz === 4 ? TRIM : BAYS[2].c); for (let k = 0; k < 4; k++) part('round_1x1', W - 1, y0 + 1 + 3 * k, 5, TRIM);
  for (let dy = 0; dy < 9; dy++) for (let lz = 0; lz <= 5; lz++) vox('brick', W - 1, slabY + 1 + dy, lz, BAYS[2].c);
  for (let dy = 9; dy < UF; dy++) for (let lz = 0; lz <= 5; lz++) vox('plate', W - 1, slabY + 1 + dy, lz, TRIM);
  part('brick_1x1', W - 1, y0 + 1, 6, TRIM); part('brick_1x1', W - 1, y0 + 4, 6, TRIM); part('pyramid_1x1', W - 1, y0 + 7, 6, TRIM);
  { const a = cell(0, 0), b = cell(W - 1, D - 1); const X = Math.min(a[0], b[0]), Z = Math.min(a[1], b[1]), Wd = Math.abs(b[0] - a[0]) + 1, Dd = Math.abs(b[1] - a[1]) + 1; if (rot % 2) spanPlatesX(bp, X, Z, Wd, Dd, slabY, TRIM); else spanPlates(bp, X, Z, Wd, Dd, slabY, TRIM); }
  const ry = slabY + 1 + UF; const [rx0w, rz0w] = cell(-1, -1), [rx1w, rz1w] = cell(W, D); const RX = Math.min(rx0w, rx1w), RZ = Math.min(rz0w, rz1w), RW = Math.abs(rx1w - rx0w) + 1, RD = Math.abs(rz1w - rz0w) + 1;
  spanPlates(bp, RX, RZ, RW, RD, ry, ROOF); hipCorners(bp, 'slope_corner_3x3', RX, RZ, RW, RD, ry + 1, ROOF);
  for (let x = RX + 3; x < RX + RW - 3; x += 2) { const two = x + 2 <= RX + RW - 3; bp.part(two ? 'slope_2x3' : 'slope_1x3', x, ry + 1, RZ, ROOF, 2); bp.part(two ? 'slope_2x3' : 'slope_1x3', x, ry + 1, RZ + RD - 3, ROOF, 0); if (!two) break; }
  for (let z = RZ + 3; z < RZ + RD - 3; z += 2) { const two = z + 2 <= RZ + RD - 3; bp.part(two ? 'slope_2x3' : 'slope_1x3', RX, ry + 1, z, ROOF, 3); bp.part(two ? 'slope_2x3' : 'slope_1x3', RX + RW - 3, ry + 1, z, ROOF, 1); if (!two) break; }
  bp.fill('brick', RX + 3, ry + 1, RZ + 3, RW - 6, 3, RD - 6, ROOF);
  const along = RW >= RD; const L = along ? RW - 6 : RD - 6; let k = 0; while (k < L) { const s = L - k >= 4 ? 4 : 2; bp.part(s === 4 ? 'ridge_4x2' : 'ridge_2x2', along ? RX + 3 + k : RX + 3, ry + 4, along ? RZ + 3 : RZ + 3 + k, ROOF, along ? 0 : 1); k += s; }
  bp.tag = '';
}

/** A Singapore River bumboat (the river-cruise boat on Marina Bay): a reddish-brown timber hull 4 wide with a pointed bow of wedge plates,
 *  white gunwales with a red stripe, a tan deck, and a red-and-white awning on four slim posts. No one aboard (rule 6). Bow toward local −x.
 *  Local: hull x 0..10, z 0..3 on the water at `y` (the water tiles must carry studs under it). */
export function bumboat(bp: Blueprint, ox: number, y: number, oz: number, rot: number, R?: Reserve) {
  bp.tag = 'boat'; const { part, cell } = placer(bp, ox, oz, rot); const HULL = 'ReddishBrown';
  if (R) { const a = cell(0, 0), b = cell(9, 3); R.add(Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.abs(b[0] - a[0]) + 1, Math.abs(b[1] - a[1]) + 1); }
  part('plate_4x6', 4, y, 0, HULL, 1); part('wedge_4x2_r', 0, y, 0, HULL, 2); part('wedge_4x2_l', 0, y, 2, HULL, 2);
  for (const z of [0, 3]) { part('brick_1x4', 5, y + 1, z, 'White', 1); part('brick_1x1', 4, y + 1, z, 'White'); part('brick_1x1', 9, y + 1, z, 'White'); part('plate_1x6', 4, y + 4, z, 'BrightRed', 1); }
  part('plate_1x2', 9, y + 1, 1, 'White'); part('brick_1x2', 9, y + 2, 1, 'White'); part('tile_1x2', 9, y + 5, 1, 'BrightRed');    // stern transom
  for (let x = 4; x < 9; x++) for (const z of [1, 2]) part('tile_1x1', x, y + 1, z, 'Tan');
  for (const [px, pz] of [[4, 0], [8, 0], [4, 3], [8, 3]]) { part('round_1x1', px, y + 5, pz, 'White'); part('round_1x1', px, y + 8, pz, 'White'); }
  part('plate_4x6', 4, y + 11, 0, 'White', 1); for (let x = 4; x < 10; x += 2) part('tile_2x2', x, y + 12, 1, 'BrightRed'); for (let x = 4; x < 10; x++) for (const z of [0, 3]) part('tile_1x1', x, y + 12, z, 'White');
  bp.tag = '';
}
