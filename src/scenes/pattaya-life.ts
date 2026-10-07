// Pattaya · the life layer (2026-10-06, docs/countries/thailand.md §1.3): the seafood grill stall on Beach Road and the snorkel speedboat.
import { Blueprint } from '../core/builder';
import { minifig2, spanPlates } from './lib';
import { placer } from './singapore';

/** A Beach Road seafood grill under a blue tarp. Local frame: the stall faces +z (the road); the grill counter runs along z 3 (x 0–5), the
 *  iced display along x 0–1 on its left, the vendor behind the counter at z 1 fanning the charcoal; four white posts at the corners carry a
 *  Blue tarp of plates at plate 15; a steel table with two red stools in front, the diner standing at it with a bowl. Footprint x 0..7,
 *  z 0..9. Returns nothing; every piece stands on studs at level y. */
export function seafoodStall(bp: Blueprint, ox: number, y: number, oz: number, rot: number) {
  bp.tag = 'stall'; const { part, cell } = placer(bp, ox, oz, rot); const STEEL = 'LightBluishGray', POST = 'White', TARP = 'BrightBlue';
  // posts at the four corners, five round bricks each (15 plates), the tarp on top
  for (const [px, pz] of [[0, 0], [7, 0], [0, 5], [7, 5]]) for (let k = 0; k < 5; k++) part('round_1x1', px, y + 3 * k, pz, POST);
  { const a = cell(0, 0), b = cell(7, 5); spanPlates(bp, Math.min(a[0], b[0]), Math.min(a[1], b[1]), 8, 6, y + 15, TARP); }
  part('plate_1x8', 0, y + 16, 5, TARP, 1); part('plate_1x8', 0, y + 16, 0, TARP, 1);   // the tarp's front and back hems, a plate thicker
  // the grill counter: a steel brick run with the grill on it — a dark grille, prawns and squid skewers as orange and white round plates
  part('brick_1x4', 2, y, 4, STEEL, 1); part('plate_1x4', 2, y + 3, 4, 'DarkBluishGray', 1); part('plate_1x4', 2, y + 4, 4, STEEL, 1);
  for (const [gx, c] of [[2, 'Orange'], [3, 'Orange'], [4, 'White'], [5, 'Orange']] as [number, string][]) part('roundplate_1x1', gx, y + 5, 4, c);
  part('flower_1x1', 3, y + 6, 4, 'TransOrange');   // a glow from the coals between the skewers
  // the iced display: a white tray on a steel stand, whole fish laid on it
  part('brick_1x2', 6, y, 3, STEEL); part('brick_1x2', 6, y + 3, 3, STEEL); part('plate_1x2', 6, y + 6, 3, 'White');
  part('fish', 6, y + 7, 3, 'LightBluishGray');
  // the vendor behind the counter, a conical hat, fanning the coals
  { const [fx, fz] = cell(3, 1); minifig2(bp, fx + 0.5, y, fz, rot, { legs: 'DarkBluishGray', torso: 'Orange', face: 'face_hawker', hat: 'kasa', hold: [{ key: 'hand_fan', color: 'White', hand: 'R', pose: 'f' }] }); }
  // in front: a steel table, two red plastic stools, the diner with a bowl
  part('round_1x1', 2, y, 7, STEEL); part('roundplate_1x1', 2, y + 3, 7, STEEL); { const [wx, wz] = cell(2, 7); bp.part('plate_2x2', wx - 0.5, y + 4, wz - 0.5, STEEL); }
  for (const [sx, sz] of [[0, 7], [4, 8]]) { part('round_1x1', sx, y, sz, 'BrightRed'); const [wx, wz] = cell(sx, sz); bp.part('roundplate_2x2_jumper', wx - 0.5, y + 3, wz - 0.5, 'BrightRed'); }   // red plastic stools: a round seat on a leg
  { const [fx, fz] = cell(2, 10); minifig2(bp, fx + 0.5, y, fz, (rot + 2) & 3, { legs: 'Tan', torso: 'White', face: 'face_smile', hair: 'Black', hairKey: 'hair_short', hold: [{ key: 'rice_bowl', color: 'White', hand: 'R' }] }); }
  bp.tag = '';
}

/** The snorkel speedboat: a white hull 5 × 14 along local +z (bow at +z), a dark blue stripe, a windscreen console amidships, a swim deck at
 *  the stern where the snorkeller in an orange life jacket stands ready to go in. Local origin = the hull's min corner; bottom at y (the water
 *  plates under it keep their studs). */
/** hull cells of a speedboat placed at (ox, oz, rot), for keeping the water's studs under it */
export function speedboatCells(bp: Blueprint, ox: number, oz: number, rot: number) { const { cell } = placer(bp, ox, oz, rot); const out: [number, number][] = []; for (let lx = 0; lx < 4; lx++) for (let lz = 0; lz < 14; lz++) out.push(cell(lx, lz)); return out; }
export function speedboat(bp: Blueprint, ox: number, y: number, oz: number, rot: number) {
  bp.tag = 'boat'; const { part } = placer(bp, ox, oz, rot); const HULL = 'White', STRIPE = 'DarkBlue';
  part('plate_4x6', 0, y, 0, HULL); part('plate_4x6', 0, y, 6, HULL);
  part('wedge_4x2_brick_r', 0, y, 12, HULL); part('wedge_4x2_brick_l', 2, y, 12, HULL);   // the bow
  for (const sx of [0, 3]) { part('brick_1x6', sx, y + 1, 2, STRIPE); part('brick_1x4', sx, y + 1, 8, HULL); }   // topsides: dark stripe aft, white forward
  part('brick_1x2', 1, y + 1, 11, HULL, 1);   // the bow's inner ring (the wedges' studs)
  part('plate_2x2', 1, y + 1, 0, 'LightBluishGray');   // the swim deck at the stern
  // the console: a white brick with a slope windscreen, two seats behind it
  part('brick_1x2', 1, y + 1, 7, HULL, 1); part('slope_1x2', 1, y + 4, 7, 'TransBlack', 0); part('slope_1x2', 2, y + 4, 7, 'TransBlack', 0);
  part('seat_2x2', 1, y + 1, 4, 'DarkBluishGray');
  // the snorkeller on the swim deck, orange life jacket, facing the reef
  minifig2(bp, ...(() => { const c = placer(bp, ox, oz, rot).cell(1, 0); return [c[0] + 0.5, y + 2, c[1]] as [number, number, number]; })(), (rot + 2) & 3, { legs: 'DarkBlue', torso: 'Orange', face: 'face_grin', hair: 'Black', hairKey: 'hair_short' });
  bp.tag = '';
}

/** A Pattaya songthaew (baht bus): a pickup with a covered bench bed, Dark Blue, 4 wide × 10 long along local +z (cab at +z). Two axles on
 *  wheel-pin plates over road-coloured 2 × 2 plates; the bed has two side benches and a roof on four posts; the cab a black windscreen.
 *  Local origin = the chassis' min corner. */
export function songthaew(bp: Blueprint, ox: number, y: number, oz: number, rot: number, road = 'DarkBluishGray') {
  bp.tag = 'songthaew'; const { part } = placer(bp, ox, oz, rot); const BODY = 'DarkBlue', TRIM = 'LightBluishGray';
  for (const az of [1, 7]) { part('plate_2x2', 1, y, az, road); part('wheelplate_2x2', 1, y + 1, az, TRIM); part('cart_wheel_l', 1, y + 1, az, 'Black'); part('cart_wheel_r', 1, y + 1, az, 'Black'); }
  const Y = y + 1;   // the wheels' tops stand a plate above their pin plates: a spacer course under the chassis
  for (const az of [1, 7]) part('plate_2x2', 1, y + 2, az, 'Black');
  part('plate_4x6', 0, Y + 2, 0, 'Black'); part('plate_4x4', 0, Y + 2, 6, 'Black');           // chassis
  part('plate_4x6', 0, Y + 3, 0, BODY); part('plate_4x4', 0, Y + 3, 6, BODY);                 // floor
  // the bed: side walls one brick, benches inside, a tailgate step
  for (const sx of [0, 3]) { part('brick_1x6', sx, Y + 4, 0, BODY); part('plate_1x6', sx, Y + 7, 0, TRIM); }
  for (const sx of [1, 2]) part('tile_1x2', sx, Y + 4, 0, TRIM);
  // the roof on four posts
  for (const [px, pz] of [[0, 0], [3, 0], [0, 5], [3, 5]]) { part('round_1x1', px, Y + 8, pz, TRIM); part('round_1x1', px, Y + 11, pz, TRIM); }
  part('plate_4x6', 0, Y + 14, 0, BODY); part('tile_2x4', 1, Y + 15, 1, 'White');            // roof, a white luggage panel
  // the cab: body brick, a black windscreen and side windows, a roof
  part('brick_2x4', 0, Y + 4, 6, BODY, 1); part('brick_2x4', 0, Y + 4, 8, BODY, 1);
  part('brick_1x4', 0, Y + 7, 6, 'TransBlack', 1); part('brick_1x4', 0, Y + 7, 9, 'TransBlack', 1);
  part('plate_4x4', 0, Y + 10, 6, BODY);
    bp.tag = '';
}

/** A spirit house (san phra phum) on its pillar: a white 2 × 2 shrine with a red-and-gold stepped roof on a single post, a flower garland and a
 *  bottle of red soda on its ledge — every Thai lot has one. Local origin = the pillar's cell. */
export function spiritHouse(bp: Blueprint, x: number, y: number, z: number) {
  // (x, z) = the base's min corner. A white post on a jumper; a 4 × 4 white platform gripping the post's stud with its centre tube; on it a
  // white shrine with a gold door, a two-tier roof (gold plate, dark red ridge), marigold garlands on the platform's corners and a figure of
  // the guardian spirit's offering — a red soda bottle (judge r1: a spirit house must read as a little Thai house, not a lamp)
  bp.tag = 'spirit';
  bp.part('plate_2x2', x, y, z, 'LightBluishGray'); bp.part('jumper_2x2', x, y + 1, z, 'LightBluishGray');
  bp.part('round_1x1', x + 0.5, y + 2, z + 0.5, 'White'); bp.part('round_1x1', x + 0.5, y + 5, z + 0.5, 'White');
  bp.part('plate_4x4', x - 1, y + 8, z - 1, 'White');
  bp.part('brick_2x2', x, y + 9, z, 'White');
  bp.part('plate_2x2', x, y + 12, z, 'PearlGold');
  bp.part('ridge_2x2', x, y + 13, z, 'DarkRed');
  for (const [dx, dz, c] of [[-1, -1, 'Orange'], [2, -1, 'Yellow'], [-1, 2, 'Yellow'], [2, 2, 'Orange']] as [number, number, string][]) bp.part('flower_1x1', x + dx, y + 9, z + dz, c);
  bp.part('bottle', x + 2, y + 9, z + 0.5 - 0.5, 'BrightRed');
  bp.tag = '';
}

/** A coconut cart: a green cart body on two wheels, a heap of green coconuts, an orange beach umbrella over it. (x, z) = the body's min corner
 *  (2 × 4 along +z). */
export function coconutCart(bp: Blueprint, x: number, y: number, z: number) {
  bp.tag = 'cart';
  bp.part('plate_2x2', x, y, z + 1, 'LightBluishGray'); bp.part('wheelplate_2x2', x, y + 1, z + 1, 'LightBluishGray'); bp.part('cart_wheel_l', x, y + 1, z + 1, 'Black'); bp.part('cart_wheel_r', x, y + 1, z + 1, 'Black');
  bp.part('plate_2x4', x, y + 2, z, 'DarkGreen', 0); bp.part('brick_2x4', x, y + 3, z, 'Green', 0);
  for (const [dx, dz] of [[0, 0], [1, 0], [0, 1], [1, 2], [0, 3], [1, 3]]) bp.part('roundplate_1x1', x + dx, y + 6, z + dz, 'BrightGreen');
  bp.part('round_1x1', x + 1, y + 6, z + 1, 'BrightGreen'); bp.part('round_1x1', x, y + 6, z + 2, 'BrightGreen');
  bp.part('roundplate_open', x + 1, y + 9, z + 1, 'White'); bp.part('bar_4l', x + 1, y + 10, z + 1, 'White'); bp.part('umbrella', x - 1.5, y + 17, z - 1.5, 'Orange');
  bp.tag = '';
}

/** A jet-ski: brick-built (no jet-ski mould exists): a 2 × 4 hull plate, a black saddle, a red slope cowl in front. (x, z) = min corner, long
 *  along +x (bow at +x). Stands on plate studs in the water. */
export function jetski(bp: Blueprint, x: number, y: number, z: number, color = 'BrightRed') {
  bp.tag = 'jetski';
  bp.part('plate_2x4', x, y, z, 'White', 1); bp.part('brick_1x2', x + 1, y + 1, z, 'Black', 0); bp.part('slope_2x2', x + 2, y + 1, z, color, 1); bp.part('tile_1x2', x, y + 1, z, 'White', 0);
  bp.tag = '';
}

/** A Thai sala: an open pavilion, four Reddish Brown posts on a 6 × 6 platform, a stepped two-tier roof with curled ends. (x, z) = the
 *  platform's min corner. */
export function sala(bp: Blueprint, x: number, y: number, z: number, roof = 'DarkRed') {
  bp.tag = 'sala';
  bp.part('plate_6x6', x, y, z, 'Tan');
  for (const [px, pz] of [[0, 0], [5, 0], [0, 5], [5, 5]]) for (let k = 0; k < 3; k++) bp.part('round_1x1', x + px, y + 1 + 3 * k, z + pz, 'ReddishBrown');
  bp.part('plate_6x6', x, y + 10, z, 'ReddishBrown');
  for (let i = 0; i < 6; i++) { bp.part('slope_1x2', x + i, y + 11, z, roof, 2); bp.part('slope_1x2', x + i, y + 11, z + 4, roof, 0); }
  bp.part('brick_2x6', x, y + 11, z + 2, roof, 1);
  for (const i of [0, 2, 4]) bp.part('ridge_2x2', x + i, y + 14, z + 2, roof);
  bp.tag = '';
}

/** A Thai gabled roof over [x, x + W) × [z, z + D), ridge along z: 45° slope rows stepping in one stud per brick from both long sides, the
 *  outer row Dark Green (the border every Thai temple roof has), the inner rows Bright Red; the gable ends filled with Reddish Brown; a
 *  double slope ridge; a gold curved flame (chofa) on a jumper at each ridge end. W even. Returns the ridge top level. */
export function thaiRoof(bp: Blueprint, x: number, y: number, z: number, W: number, D: number, sign?: { j: number; print: string }, chofa = true) {
  bp.tag = 'thairoof'; const half = W / 2;
  for (let k = 0; k < half - 1; k++) {
    const c = k === 0 ? 'DarkGreen' : 'BrightRed', yy = y + 3 * k;
    for (let j = 0; j < D; j++) { bp.part('slope_1x2', x + k, yy, z + j, c, 3); bp.part('slope_1x2', x + W - 2 - k, yy, z + j, c, 1); }
  }
  const yr = y + 3 * (half - 1);
  const mid = Math.floor(D / 2);
  for (let j = chofa ? 1 : 0; j < (chofa ? D - 1 : D); j++) {
    if (!chofa && j === mid) {   // instead of chofas (Eric: the pier already has them), a gold tiered finial on the ridge's middle
      bp.part('jumper_1x2', x + half - 1, yr, z + j, 'PearlGold', 0); bp.part('roundplate_1x1', x + half - 0.5, yr + 1, z + j, 'PearlGold');
      bp.part('roundplate_1x1', x + half - 0.5, yr + 2, z + j, 'PearlGold'); bp.part('cone_1x1', x + half - 0.5, yr + 3, z + j, 'PearlGold'); continue; }
    bp.part('slope45_double_2x1', x + half - 1, yr, z + j, 'BrightRed', 1); }
  // gable ends: Reddish Brown infill under the roof's triangle, so the gable reads as a carved face, not the slopes' undersides
  for (const j of [0, D - 1]) for (let k = 0; k < half - 1; k++) for (let i = k + 2; i <= W - k - 3; i++) {
    const s0 = Math.floor(W / 2) - 3;   // a signboard (1 × 6) in the lowest course of a gable, centred
    if (sign && j === sign.j && k === 0 && i >= s0 && i < s0 + 6) { if (i === s0) bp.part('brick_1x6', x + i, y, z + j, 'White', j === 0 ? 1 : 3, sign.print); continue; }   // the print faces out of the gable
    bp.part('brick_1x1', x + i, y + 3 * k, z + j, i === k + 2 || i === W - k - 3 ? 'PearlGold' : 'DarkRed'); }   // judge r3: a Thai gable is a dark red board with gold running up its rakes (the bai raka), not stepped wood
  for (const [j, r] of (chofa ? [[0, 0], [D - 1, 2]] : []) as [number, number][]) {
    bp.part('jumper_1x2', x + half - 1, yr, z + j, 'PearlGold', 0); bp.part('roundplate_open', x + half - 0.5, yr + 1, z + j, 'PearlGold');
    bp.part('flame_curved_5l', x + half - 0.5, yr + 2, z + j, 'PearlGold', r);   // the chofa, curling outward along the ridge
  }
  bp.tag = ''; return yr;
}

/** The pier seafood restaurant (Pattaya's open-air seafood halls on wooden piers, the Lan Pho market's iced displays). Local frame: x 0..11
 *  across, z 0..17 out over the bay (the street end at z 0). The deck and its stilts are terrain (the scene lays them); this builds what stands
 *  on the deck at level y: a hall z 0..14 under a Thai roof on twelve posts with a ซีฟู้ด board in the sea-facing gable; along its bay side
 *  (x 11) the iced seafood display in two tiers, the blue live tanks and the charcoal grill with the cook behind it; tables with red stools and
 *  two diners inside; an open terrace beyond the hall with the Thai flag on its corner. */
export function seafoodPier(bp: Blueprint, x: number, y: number, z: number) {
  bp.tag = 'restaurant'; const WOOD = 'ReddishBrown', STEEL = 'LightBluishGray';
  // posts and beams
  for (const px of [0, 11]) for (const pz of [0, 4, 9, 14]) for (let k = 0; k < 6; k++) bp.part('round_1x1', x + px, y + 3 * k, z + pz, WOOD);   // Eric: tall enough to see the diners and the ice from outside
  for (const px of [0, 11]) { bp.part('plate_1x8', x + px, y + 18, z, WOOD); bp.part('plate_1x6', x + px, y + 18, z + 8, WOOD); bp.part('plate_1x1', x + px, y + 18, z + 14, WOOD); }
  for (const pz of [0, 14]) { bp.part('plate_1x8', x + 1, y + 18, z + pz, WOOD, 1); bp.part('plate_1x2', x + 9, y + 18, z + pz, WOOD, 1); }
  thaiRoof(bp, x, y + 19, z, 12, 15, { j: 14, print: 'th_seafood' });
  bp.tag = 'restaurant';
  // Eric 2026-10-06: the seafood must be seen at once. The iced display runs along the sea-facing end (z 12–13, x 2–9), facing the camera:
  // a steel counter two studs deep, a White ice plate on it, and on the ice a red lobster, an orange crab, three whole fish, orange prawns
  for (const zz of [12, 13]) { bp.part('brick_1x6', x + 1, y, z + zz, STEEL, 1); bp.part('brick_1x4', x + 7, y, z + zz, STEEL, 1); }
  bp.part('plate_2x6', x + 1, y + 3, z + 12, 'White', 1); bp.part('plate_2x4', x + 7, y + 3, z + 12, 'White', 1);
  bp.part('lobster', x + 1, y + 4, z + 12, 'BrightRed', 1);
  bp.part('crab', x + 5, y + 4, z + 12, 'Orange');
  bp.part('fish', x + 8, y + 4, z + 12, 'LightBluishGray', 1); bp.part('fish', x + 8, y + 4, z + 13, 'Coral', 1);
  // the live tank on the bay side (x 7–10, z 1–6): a steel base, clear blue walls one brick high, two fish swimming inside
  bp.part('plate_4x6', x + 7, y, z + 1, STEEL);
  for (const tx of [7, 10]) bp.part('brick_1x6', x + tx, y + 1, z + 1, 'TransLightBlue');
  for (const tz of [1, 6]) bp.part('brick_1x2', x + 8, y + 1, z + tz, 'TransLightBlue', 1);
  bp.part('fish', x + 8, y + 1, z + 2, 'Orange'); bp.part('fish', x + 9, y + 1, z + 3, 'LightBluishGray');
  // the charcoal grill by the bay side (x 9–10, z 8–9), the cook fanning it from the hall
  bp.part('brick_2x2', x + 9, y, z + 8, 'DarkBluishGray'); bp.part('plate_2x2', x + 9, y + 3, z + 8, 'Black');
  for (const [dx, dz, c] of [[0, 0, 'White'], [1, 0, 'Orange'], [0, 1, 'Orange'], [1, 1, 'White']] as [number, number, string][]) bp.part('roundplate_1x1', x + 9 + dx, y + 4, z + 8 + dz, c);
  minifig2(bp, x + 6, y, z + 9, 1, { legs: 'DarkBluishGray', torso: 'White', torsoPrint: 'torso_hawker', face: 'face_hawker', hair: 'Black', hairKey: 'hair_short', hold: [{ key: 'hand_fan', color: 'White', hand: 'R', pose: 'f' }] });
  // one table with red stools on the street side, the diner with her bowl — well apart from the cook (Eric: two people, not crowded)
  bp.part('round_1x1', x + 2, y, z + 3, STEEL); bp.part('round_1x1', x + 2, y + 3, z + 3, STEEL); bp.part('plate_2x2', x + 2, y + 6, z + 3, 'White');
  for (const [sx, sz] of [[1, 2], [4, 4]] as [number, number][]) { bp.part('round_1x1', x + sx, y, z + sz, 'BrightRed'); bp.part('roundplate_1x1', x + sx, y + 3, z + sz, 'BrightRed'); }
  minifig2(bp, x + 2, y, z + 7, 2, { legs: 'DarkBlue', torso: 'Yellow', face: 'face_laugh', hair: 'Black', hairKey: 'hair_long', hold: [{ key: 'rice_bowl', color: 'White', hand: 'R' }] });
  // the terrace: the Thai flag on a pole at its corner, flying out over the bay
  // the Thai flag, brick-built (judge: a printed flag reads as a blank cloth at this scale): a white pole of round bricks, then six 1 × 4
  // plates stacked on its top stud and flying out over the bay — red, white, blue, blue, white, red, the real 1:1:2:1:1 bands
  for (let k = 0; k < 9; k++) bp.part('round_1x1', x + 11, y + 3 * k, z + 15, 'White');   // the pole clears the eave: the flag flies above the roof's edge
  ['BrightRed', 'White', 'DarkBlue', 'DarkBlue', 'White', 'BrightRed'].forEach((c, k) => bp.part(k === 5 ? 'tile_1x4' : 'plate_1x4', x + 11, y + 27 + k, z + 15, c, 1));   // a tile on top: no studs (Eric)
  bp.tag = '';
}

/** A Thai tuk-tuk at minifig scale (judge r3: the 2-wide one was a toy; Eric: "差一点意思"). 4 wide × 8 long along +z (nose forward).
 *  What makes it a tuk-tuk: three wheels (two rear on a pin plate, a single front wheel under a pointed nose with one headlight), an open
 *  passenger bench at the back with low sides, the driver forward of it at the handlebars, and a long canopy that rolls down at both ends with
 *  a red trim — the Bangkok/Pattaya silhouette. Bright Blue body, Yellow canopy. Local origin = min corner. */
export function tuktuk(bp: Blueprint, x: number, y: number, z: number) {
  bp.tag = 'tuktuk'; const BODY = 'BrightBlue', ROOF = 'Yellow', TRIM = 'BrightRed';
  bp.part('plate_2x2', x + 1, y, z + 1, 'DarkBluishGray'); bp.part('wheelplate_2x2', x + 1, y + 1, z + 1, 'LightBluishGray'); bp.part('cart_wheel_l', x + 1, y + 1, z + 1, 'Black'); bp.part('cart_wheel_r', x + 1, y + 1, z + 1, 'Black');
  bp.part('plate_2x2', x + 1, y + 2, z + 1, 'Black');
  bp.part('round_1x1', x + 1, y, z + 7, 'Black'); bp.part('round_1x1', x + 2, y, z + 7, 'Black');   // the front wheel
  bp.part('plate_4x8', x, y + 3, z, BODY);
  // the passengers' compartment: low sides with a chrome rail, a red bench across the back
  for (const sx of [0, 3]) { bp.part('brick_1x4', x + sx, y + 4, z, BODY); bp.part('plate_1x4', x + sx, y + 7, z, 'LightBluishGray'); }
  bp.part('brick_1x2', x + 1, y + 4, z, TRIM, 1); bp.part('tile_1x2', x + 1, y + 7, z, TRIM, 1);
  // the nose: a pointed fairing, a headlight on its top
  bp.part('slope_2x2', x + 1, y + 4, z + 6, BODY, 0); bp.part('slope_1x2', x, y + 4, z + 6, BODY, 0); bp.part('slope_1x2', x + 3, y + 4, z + 6, BODY, 0);
  bp.part('brick_1x2', x + 1, y + 4, z + 5, BODY, 1); bp.part('roundplate_1x1', x + 1, y + 7, z + 5, 'TransClear'); bp.part('roundplate_1x1', x + 2, y + 7, z + 5, 'LightBluishGray');
  // posts and the canopy: four black posts, a yellow roof rolling down at both ends, red trim along its sides
  for (const px of [0, 3]) { for (let k = 0; k < 3; k++) bp.part('round_1x1', x + px, y + 8 + 3 * k, z, 'Black'); bp.part('roundplate_1x1', x + px, y + 17, z, 'Black'); bp.part('roundplate_1x1', x + px, y + 18, z, 'Black'); }   // rear posts on the side rails
  bp.part('plate_4x8', x, y + 20, z, ROOF);
  for (const sx of [0, 3]) bp.part('plate_1x8', x + sx, y + 19, z, TRIM, 0);
  bp.part('curve_2x2', x + 1, y + 21, z + 6, ROOF, 0); bp.part('curve_2x2', x + 1, y + 21, z, ROOF, 2);
  bp.part('tile_2x4', x + 1, y + 21, z + 2, ROOF);
  minifig2(bp, x + 2, y + 4, z + 3, 0, { legs: 'DarkBluishGray', torso: 'Orange', face: 'face_smile', hair: 'Black', hairKey: 'hair_short' });
  bp.tag = '';
}

/** A grey brick-built elephant with its mahout, after LEGOLAND Miniland's elephants. Local origin = min corner, 4 wide × 9 long along +z, head
 *  at +z. Four 2 × 2 round-brick legs; a 4 × 6 body of two brick courses with a rounded back (curved slopes down both flanks, a Dark Red
 *  saddle cloth along the spine); a head 4 wide × 2 deep at the front, a curved brow, ears as Dark Bluish Gray 2 × 3 plates flaring from its
 *  sides; a trunk of round bricks rising from the ground into the head's underside, curling at its foot; the mahout astride the neck. */
export function elephant(bp: Blueprint, x: number, y: number, z: number) {
  bp.tag = 'elephant'; const G = 'LightBluishGray';
  for (const [lx, lz] of [[0, 0], [2, 0], [0, 4], [2, 4]]) { bp.part('roundbrick_2x2', x + lx, y, z + lz, G); bp.part('roundbrick_2x2', x + lx, y + 3, z + lz, G); }
  for (const yy of [6, 9]) { bp.part('brick_2x6', x, y + yy, z, G); bp.part('brick_2x6', x + 2, y + yy, z, G); }
  // the back: the spine plate in Dark Red (saddle cloth), curved slopes rolling down both flanks
  bp.part('plate_2x4', x + 1, y + 12, z, 'DarkRed');
  for (const j of [0, 2]) { bp.part('curve_2x2', x - 1, y + 12, z + j, G, 3); bp.part('curve_2x2', x + 3, y + 12, z + j, G, 1); }
  // the trunk: four round bricks from the ground straight up into the head plate
  for (let k = 0; k < 4; k++) bp.part('round_1x1', x + 1, y + 3 * k, z + 7, G);
  // the head: a 4 × 4 plate lapping the body's front and the trunk's top, a brick course, a Dark Bluish Gray 2 × 8 plate across whose ends
  // flare out as the ears, a second course, a curved brow
  bp.part('plate_4x4', x, y + 12, z + 4, G);
  bp.part('brick_2x4', x, y + 13, z + 6, G, 1);
  bp.part('plate_2x8', x - 2, y + 16, z + 6, 'DarkBluishGray', 1);
  bp.part('brick_2x4', x, y + 17, z + 6, G, 1);
  bp.part('curve_2x2', x, y + 20, z + 6, G, 0); bp.part('curve_2x2', x + 2, y + 20, z + 6, G, 0);
  bp.tag = 'elephant'; minifig2(bp, x + 2, y + 13, z + 4.5, 0, { legs: 'DarkRed', torso: 'White', face: 'face_smile', hair: 'Black', hairKey: 'hair_short' });
  bp.tag = '';
}

/** The summit sala and its chedi: an open pavilion on a 6 × 6 platform under a Thai roof (green border, red field, gold chofa), and beside it
 *  a small white chedi — a round bell on a square base, a gold spire. (x, z) = the sala platform's min corner; the chedi stands at x + 7. */
export function summitSala(bp: Blueprint, x: number, y: number, z: number) {
  bp.tag = 'sala';
  bp.part('plate_6x6', x, y, z, 'White');
  for (const [px, pz] of [[0, 0], [5, 0], [0, 5], [5, 5]]) for (let k = 0; k < 3; k++) bp.part('round_1x1', x + px, y + 1 + 3 * k, z + pz, 'White');
  for (const pz of [0, 5]) bp.part('plate_1x6', x, y + 10, z + pz, 'ReddishBrown', 1);
  for (const px of [0, 5]) bp.part('plate_1x6', x + px, y + 11, z, 'ReddishBrown');   // side beams lap over the end beams
  thaiRoof(bp, x, y + 12, z, 6, 6, undefined, false);
  bp.tag = 'chedi'; const cx = x + 8, cz = z + 2;
  bp.part('plate_2x2', cx, y, cz, 'White'); bp.part('brick_2x2', cx, y + 1, cz, 'White'); bp.part('roundbrick_2x2', cx, y + 4, cz, 'White'); bp.part('cone_2x2', cx, y + 7, cz, 'White');
  bp.part('cone_1x1', cx + 0.5, y + 13, cz + 0.5, 'PearlGold');
  bp.tag = '';
}

/** A beach fruit vendor: the coconut cart under its orange umbrella with the vendor in a conical hat beside it. (x, z) = the cart's min corner. */
export function fruitVendor(bp: Blueprint, x: number, y: number, z: number) {
  coconutCart(bp, x, y, z);
  bp.tag = 'vendor'; minifig2(bp, x + 3.5, y, z + 2, 3, { legs: 'DarkBlue', torso: 'BrightPink', face: 'face_smile', hat: 'kasa' }); bp.tag = '';
}
