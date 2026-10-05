// Paris · the life layer and the small things that make the island Parisian (2026-10-04, Eric: "缺乏一种法式浪漫的情怀"; "剩余面积里可以放几个
// 小元件…一定要和当前剩余的 scale 和面积相符"). Each piece is a handful of real parts at minifig scale, placed on island coordinates.
import { Blueprint } from '../core/builder';
import { PARTS } from '../core/catalog';
import { minifig2 } from './lib';

/** A Paris street lamp, slim (judge r1: the 1 × 1 round-brick post read as a bollard): two black 4L bars, each pushed into an open-stud round
 *  plate, a round plate between them; the lantern a clear 1 × 1 round brick under a black pyramid cap. About 23 plates tall. */
export function parisLamp(bp: Blueprint, x: number, y: number, z: number) {
  bp.tag = 'lamp';
  let yy = y; for (let k = 0; k < 2; k++) { bp.part('roundplate_open', x, yy, z, 'Black'); bp.part('bar_4l', x, yy + 1, z, 'Black'); bp.part('roundplate_1x1', x, yy + 9, z, 'Black'); yy += 10; }
  bp.part('round_1x1', x, yy, z, 'TransClear'); bp.part('pyramid_1x1', x, yy + 3, z, 'Black');
  bp.tag = '';
}

/** A Wallace fountain in dark green: a round base, four slim columns (the caryatids, 1 × 1 round bricks), a round canopy and a little dome. 2 × 2. */
export function wallace(bp: Blueprint, x: number, y: number, z: number) {
  bp.tag = 'wallace'; const G = 'DarkGreen';
  bp.part('roundbrick_2x2', x, y, z, G); bp.part('roundplate_2x2', x, y + 3, z, G);
  for (const [dx, dz] of [[0, 0], [1, 0], [0, 1], [1, 1]]) bp.part('round_1x1', x + dx, y + 4, z + dz, G);
  bp.part('roundplate_2x2', x, y + 7, z, G); bp.part('dome_2x2', x, y + 8, z, G);
  bp.tag = '';
}

/** A bateau-mouche: a long low white hull with a navy band, a glazed cabin, a white roof. 4 × 14, bow toward +z. Stands on the river's
 *  plate studs (the river lays plates, not tiles, under it). */
export function bateau(bp: Blueprint, x: number, y: number, z: number) {
  bp.tag = 'boat';
  bp.part('plate_4x6', x, y, z, 'White'); bp.part('plate_4x6', x, y, z + 6, 'White');
  bp.part('wedge_4x2_brick_r', x, y, z + 12, 'White'); bp.part('wedge_4x2_brick_l', x + 2, y, z + 12, 'White');
  for (const sx of [x, x + 3]) { bp.part('brick_1x6', sx, y + 1, z, 'DarkBlue'); bp.part('brick_1x6', sx, y + 1, z + 6, 'DarkBlue'); }
  bp.part('brick_1x2', x + 1, y + 1, z, 'DarkBlue', 1);   // the stern
  for (const sx of [x, x + 3]) for (const dz of [1, 3, 5, 7, 9]) bp.part('brick_1x2', sx, y + 4, z + dz, 'TransLightBlue');
  bp.part('plate_4x6', x, y + 7, z + 1, 'White'); bp.part('plate_4x4', x, y + 7, z + 7, 'White');
  bp.tag = '';
}

/** A picnic on the lawn: a red-and-white gingham cloth of 1 × 1 tiles (4 × 3), a bottle of red on one corner, two glasses, a baguette laid
 *  across the near row (a row of four 1 × 1 plates under it, in the cloth's colours, so it sits on studs). (x, z) is the cloth's min corner. */
export function picnic(bp: Blueprint, x: number, y: number, z: number) {
  bp.tag = 'picnic';
  for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) {
    const c = (i + j) % 2 ? 'White' : 'BrightRed';
    if (j === 2) { bp.part('plate_1x1', x + i, y, z + j, c); continue; }          // the near row keeps its studs for the baguette
    if ((i === 0 && j === 0) || (i === 2 && j === 0) || (i === 3 && j === 1)) { bp.part('plate_1x1', x + i, y, z + j, c); continue; }
    bp.part('tile_1x1', x + i, y, z + j, c);
  }
  bp.part('bottle', x, y + 1, z, 'TransBlack'); bp.part('goblet', x + 2, y + 1, z, 'TransClear'); bp.part('goblet', x + 3, y + 1, z + 1, 'TransClear');
  bp.part('baguette', x, y + 1, z + 2, 'MediumNougat');
  bp.tag = '';
}

/** Pétanque on the sand: three steel boules and the little red jack (1 × 1 round tiles), two players — one has just thrown, one watches. */
export function petanque(bp: Blueprint, x: number, y: number, z: number) {
  bp.tag = 'petanque';
  for (const [dx, dz] of [[0, 0], [2, 1], [1, -2]]) bp.part('roundtile_1x1', x + dx, y, z + dz, 'LightBluishGray');
  bp.part('roundtile_1x1', x + 1, y, z - 1, 'BrightRed');
  minifig2(bp, x + 1, y, z + 6.5, 2, { legs: 'Tan', torso: 'White', torsoPrint: 'torso_mariniere', face: 'face_uncle', hair: 'LightBluishGray', hairKey: 'hair_short', poses: { R: 'f' } });
  minifig2(bp, x + 4, y, z + 4.5, 3, { legs: 'DarkBlue', torso: 'DarkBlue', face: 'face_glasses', hair: 'DarkBluishGray', hairKey: 'hair_short', hold: [{ key: 'cup', color: 'White', hand: 'L' }] });   // watching, a coffee in hand
  bp.tag = '';
}

/** The painter at the easel facing (−z) what he paints; the canvas (a printed 1 × 2 × 2 brick) on a pole in front of him, facing him. */
export function painter(bp: Blueprint, x: number, y: number, z: number) {
  bp.tag = 'painter';
  bp.part('roundplate_open', x, y, z, 'ReddishBrown'); bp.part('bar_3l', x, y + 1, z, 'ReddishBrown'); bp.part('roundplate_1x1', x, y + 6, z, 'ReddishBrown');
  bp.part('brick_1x2x2', x, y + 7, z, 'White', 0, 'canvas_nd'); bp.part('tile_1x2', x, y + 13, z, 'White', 1);
  minifig2(bp, x + 1, y, z + 3.5, 2, { legs: 'Black', torso: 'White', torsoPrint: 'torso_painter', face: 'face_calm', hair: 'DarkBrown', hairKey: 'hair_tousled', hold: [{ key: 'paintbrush', color: 'ReddishBrown', hand: 'R' }, { key: 'palette', color: 'Tan', hand: 'L' }] });
  bp.tag = '';
}

/** Two lovers on the bridge, facing each other: he holds out a red rose, she has the baguette under her arm. (x, z) between them. */
export function lovers(bp: Blueprint, x: number, y: number, z: number) {
  bp.tag = 'lovers';
  const him = minifig2(bp, x, y, z - 2.5, 0, { legs: 'DarkBluishGray', torso: 'DarkBlue', face: 'face_smile', hair: 'DarkBrown', hairKey: 'hair_short', hold: [{ key: 'bar_3l', color: 'Green', hand: 'R' }] });
  const [gx, , gz] = him.grips.R; bp.part('flower_1x1', gx - 0.5, him.held.bar_3l + PARTS.bar_3l.h, gz - 0.5, 'BrightRed');   // a green 3L bar as the stem, a red flower-edged round plate pushed onto its top (a round plate takes a bar from below)
  minifig2(bp, x, y, z + 2.5, 2, { legs: 'DarkBlue', torso: 'BrightRed', face: 'face_grin', hair: 'Black', hairKey: 'hair_long', hold: [{ key: 'baguette', color: 'MediumNougat', hand: 'L' }] });
  bp.tag = '';
}

/** Pigeons on the parvis: grey songbirds pecking about. */
export function pigeons(bp: Blueprint, y: number, spots: [number, number, number][]) { bp.tag = 'pigeons'; for (const [x, z, r] of spots) bp.part('songbird', x, y, z, 'LightBluishGray', r); bp.tag = ''; }

/** Two old friends chatting on the Champ de Mars (Eric 2026-10-04: no need for pétanque — "两个老人聊天…很 chill"): a green bench
 *  facing +z, the two men in front of it turned to each other, one with a coffee, one talking with his hand up. (x, z) the bench's min corner. */
export function oldFriends(bp: Blueprint, x: number, y: number, z: number) {
  bp.tag = 'friends';
  // Eric r3: no bench (it read as stuck on), a little more room between them, and no coffee cup (one cup-holder per set): a glass of red,
  // held by the stem the way a minifig hand really grips a goblet
  minifig2(bp, x - 0.5, y, z + 4, 1, { legs: 'Tan', torso: 'White', torsoPrint: 'torso_mariniere', face: 'face_uncle', hair: 'LightBluishGray', hairKey: 'hair_short', hold: [{ key: 'goblet', color: 'TransClear', hand: 'R' }] });
  minifig2(bp, x + 4.5, y, z + 4, 3, { legs: 'DarkBlue', torso: 'DarkBlue', face: 'face_glasses', hair: 'DarkBluishGray', hairKey: 'hair_short', poses: { L: 'h' } });
  bp.tag = '';
}
