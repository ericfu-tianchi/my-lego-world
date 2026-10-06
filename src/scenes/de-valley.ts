// Germany · the valley under Neuschwanstein and the Pöllat gorge (2026-10-05): the Allgäu farmhouse, the maypole, the carriage, the
// Marienbrücke. Scheme: docs/countries/germany.md §1.3. Everything here is minifig scale except the bridge, which belongs to the crag
// (castle scale, germany.md §1.5).
import { Blueprint } from '../core/builder';
import { placer } from './singapore';
import { mason } from './de-mason';

/** An Allgäu farmhouse (Schwangau, `schwangau-mitteldorf-house.jpg`), gable to the front: white rendered ground floor with a wooden door and
 *  windows with open reddish-brown shutters, a Medium Nougat timber gable storey with a balcony of red geraniums across it, a wide low roof
 *  (33° slopes) one stud out all round. Local frame x 0..9 (the gable front 10 wide), z 0..11 (front +z). Ground floor 0..18, gable from 18,
 *  ridge ≈ 30. */
export function farmhouse(bp: Blueprint, ox: number, y: number, oz: number, rot: number) {
  bp.tag = 'farmhouse'; const { part } = placer(bp, ox, oz, rot); const m = mason(part, y);
  const RENDER = 'White', TIMBER = 'MediumNougat', SHUT = 'ReddishBrown', ROOF = 'DarkBrown', PLINTH = 'LightBluishGray';
  const F = 11;
  for (let x = 0; x <= 9; x++) for (const z of [0, F]) m.plates(x, x, z, z, 0, PLINTH);
  for (let z = 1; z < F; z++) for (const x of [0, 9]) m.plates(x, x, z, z, 0, PLINTH);
  // white rendered walls with the door, a front window and two windows each side left open
  m.shell(0, 9, 0, F, 1, 19, RENDER);
  m.clear(4, 7, F, F, 1, 19); m.clear(1, 2, F, F, 7, 16);
  for (const x of [0, 9]) for (const z of [3, 7]) m.clear(x, x, z, z + 1, 7, 16);
  // the first floor: a timber band round the house (the front row is the balcony deck), timber long walls to the eaves
  for (let x = 0; x <= 9; x++) m.plates(x, x, 0, 0, 19, TIMBER); for (let z = 1; z < F; z++) for (const x of [0, 9]) m.plates(x, x, z, z, 19, TIMBER);
  m.wall(0, 0, 1, F - 1, 20, 23, TIMBER); m.wall(9, 9, 1, F - 1, 20, 23, TIMBER);
  // the gables front and back, timber up to the roof's underside: the first course's eaves at 23, the second course and the ridge bed at 27
  const under = (x: number) => (x <= 1 || x >= 8 ? 23 : 27);
  for (const z of [0, F]) for (let x = 0; x <= 9; x++) m.wall(x, x, z, z, 20, under(x), TIMBER);
  m.flush();
  // eaves one stud out on the long sides: 2-wide plates along z, so the overhanging rows hang from the wall rows
  for (const x of [-1, 9]) { part('plate_2x8', x, y + 23, -1, ROOF); part('plate_2x6', x, y + 23, 7, ROOF); }
  // the ridge's bed: two runs along z whose joints are staggered, standing on the two gable tops
  part('brick_1x8', 4, y + 27, 0, ROOF); part('brick_1x4', 4, y + 27, 8, ROOF); part('brick_1x4', 5, y + 27, 0, ROOF); part('brick_1x8', 5, y + 27, 4, ROOF);
  part('doorframe_1x4x6', 4, y + 1, F, 'DarkBrown'); part('door_1x4x6', 4, y + 1, F, 'ReddishBrown');
  part('window_1x2x3', 1, y + 7, F, 'White'); part('shutter_open_1x2x3', 1, y + 7, F, SHUT);
  for (const [wx, wz] of [[0, 3], [0, 7], [9, 3], [9, 7]]) { part('window_1x2x3', wx, y + 7, wz, 'White', wx === 0 ? 3 : 1); part('shutter_open_1x2x3', wx, y + 7, wz, SHUT, wx === 0 ? 3 : 1); }
  // the balcony across the front gable: a Dark Brown deck one stud out, a rail of bricks carrying the geranium boxes
  for (let x = 0; x <= 9; x++) part('plate_1x2', x, y + 19, F, 'DarkBrown');
  for (let x = 0; x <= 8; x += 2) part('brick_1x2', x, y + 20, F + 1, 'DarkBrown', 1);
  for (let x = 1; x <= 8; x++) part('flower_1x1', x, y + 23, F + 1, x % 3 === 0 ? 'Green' : 'BrightRed');
  // the low roof: two courses of 33° slopes a side, the ridge
  for (let z = -1; z <= F + 1; z++) { part('slope_1x3', -1, y + 24, z, ROOF, 3); part('slope_1x3', 8, y + 24, z, ROOF, 1); part('slope_1x3', 1, y + 27, z, ROOF, 3); part('slope_1x3', 6, y + 27, z, ROOF, 1); }
  for (let z = -1; z <= F + 1; z += 2) part('ridge_2x2', 4, y + 30, z, ROOF, 1);
  bp.tag = '';
}

/** A Bavarian maypole: a 1×1 round shaft in white and blue bands (the spiral read as bands), on a 2×2 base, a green wreath and a tip. */
export function maypole(bp: Blueprint, x: number, y: number, z: number) {
  bp.tag = 'maypole';
  bp.part('plate_2x2', x - 1, y, z - 1, 'DarkBrown'); bp.part('jumper_2x2', x - 1, y + 1, z - 1, 'DarkBrown');
  let h = y + 2;
  // two green garlands on the shaft (a 2×2 round plate with a centre stud threads onto the axis), as on every Bavarian maypole
  for (let k = 0; k < 11; k++) { if (k === 7) { bp.part('roundplate_2x2_jumper', x - 1, h, z - 1, 'Green'); h += 1; } bp.part('round_1x1', x - 0.5, h, z - 0.5, k % 2 ? 'BrightBlue' : 'White'); h += 3; }
  bp.part('roundplate_2x2_jumper', x - 1, h, z - 1, 'Green'); h += 1;
  bp.part('plant_3leaves', x - 0.5, h, z - 0.5, 'Green'); bp.part('cone_1x1', x - 0.5, h + 1, z - 0.5, 'Green');
  bp.tag = '';
}

/** The Hohenschwangau carriage (`carriage-2.jpg`): a long open bench wagon in dark wood on two wheel plates, a Sand Green canopy on four
 *  posts, two chestnut horses in front. Local frame: wagon x 0..3, z 0..7, horses ahead at z 9..; rot 0 drives toward +z. */
export function carriage(bp: Blueprint, ox: number, y: number, oz: number, rot: number, ground: string) {
  bp.tag = 'carriage'; const { part } = placer(bp, ox, oz, rot);
  for (const az of [1, 5]) { part('plate_2x2', 1, y, az, ground); part('wheelplate_2x2', 1, y + 1, az, 'Black'); part('cart_wheel_l', 1, y + 1, az, 'Black'); part('cart_wheel_r', 1, y + 1, az, 'Black'); part('brick_2x2', 1, y + 2, az, 'DarkBrown'); }
  // the body rides a brick above the axles so the wheels turn clear of it
  part('plate_4x8', 0, y + 5, 0, 'DarkBrown');
  for (let z = 0; z <= 7; z++) { part('brick_1x1', 0, y + 6, z, 'ReddishBrown'); part('brick_1x1', 3, y + 6, z, 'ReddishBrown'); }
  for (const bz of [2, 5]) { part('plate_1x2', 1, y + 6, bz, 'DarkBrown', 1); part('tile_1x2', 1, y + 7, bz, 'ReddishBrown', 1); }
  for (const [px, pz] of [[0, 0], [3, 0], [0, 7], [3, 7]]) for (let k = 0; k < 3; k++) part('round_1x1', px, y + 9 + 3 * k, pz, 'DarkBrown');
  part('plate_4x8', 0, y + 18, 0, 'SandGreen');
  for (let z = 0; z <= 7; z += 2) { part('curve_2x2', 0, y + 19, z, 'SandGreen', 3); part('curve_2x2', 2, y + 19, z, 'SandGreen', 1); }
  part('horse', 0, y, 11, 'ReddishBrown'); part('horse', 2, y, 11, 'ReddishBrown');
  bp.tag = '';
}

/** The Marienbrücke at castle scale (`marienbruecke-gorge.jpg`): fish-belly girders under the deck between two grey abutments, a deck of Light
 *  Bluish Gray plates, the timber walkway down the middle in Reddish Brown tiles, Light Bluish Gray lattice railings along both edges (the
 *  real X-lattice). Local frame x 0..7 across the gorge, z 0..2; `y` = the lips' top, where the arch legs stand. */
export function marienbruecke(bp: Blueprint, ox: number, y: number, oz: number) {
  bp.tag = 'bridge'; const { part } = placer(bp, ox, oz, 0); const IRON = 'LightBluishGray';
  // abutments: two bricks of grey on each lip, carrying the deck's ends
  for (const x of [0, 7]) for (const z of [0, 1, 2]) for (const h of [0, 3]) part('brick_1x1', x, y + h, z, 'DarkBluishGray');
  // the fish-belly girders along both edges: inverted curved slopes thin at the abutments, deepest at mid-span, a flat run between; the middle
  // row stays open so the bridge reads light from below
  for (const z of [0, 2]) { part('nd_curve_inv_2x1', 1, y + 4, z, IRON, 1); part('nd_curve_inv_2x1', 5, y + 4, z, IRON, 3); part('plate_1x2', 3, y + 4, z, IRON, 1); part('plate_1x2', 3, y + 5, z, IRON, 1); }
  part('plate_2x8', 0, y + 6, 0, IRON, 1); part('plate_1x8', 0, y + 6, 2, IRON, 1);
  for (const z of [0, 2]) for (const x of [0, 4]) part('fence_lattice_1x4x1', x, y + 7, z, IRON);
  for (let x = 0; x <= 7; x += 4) part('tile_1x4', x, y + 7, 1, 'ReddishBrown', 1);
  bp.tag = '';
}
