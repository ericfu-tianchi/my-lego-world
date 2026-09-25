// Singapore element test scene: every new mould and every Singapore assembly on a grey plate, for visual verification before the island.
// Reach it with ?scene=sg-parts, one element with ?only=<tag>. Must pass the validator like any scene.
import { Blueprint } from '../core/builder';
import { PARTS } from '../core/catalog';
import { minifig2, palm, tree, type SceneMeta } from './lib';
import { supertree, skywalk, shophouseRow, hawkerStall, merlion, mbs, iceCreamCart, orchidBed } from './singapore';

export function buildSgParts(bp: Blueprint): SceneMeta {
  const W = 96, D = 64; bp.tag = 'ground'; for (let x = 0; x < W; x += 8) for (let z = 0; z < D; z += 8) bp.part('plate_8x8', x, 0, z, 'LightBluishGray');
  // row A (z 2): loose new moulds, 4 studs apart
  bp.tag = 'loose';
  const loose: [string, string, number][] = [['otter', 'ReddishBrown', 0], ['otter', 'DarkBrown', 1], ['frypan', 'Black', 0], ['popsicle', 'Coral', 0], ['icecream_scoops', 'White', 0], ['plate_4x4_cut', 'White', 0], ['plate_4x4_cut', 'White', 1], ['palm_trunk', 'ReddishBrown', 0]];
  let x = 2; loose.forEach(([k, c, r]) => { bp.part(k, x, 1, 2, c, r); x += Math.max(4, PARTS[k].w + 2); });
  bp.tag = 'shutter'; for (let r = 0; r < 4; r++) { const cx = 40 + r * 5; bp.part('window_1x2x3', cx, 1, 2, 'White', r); bp.part('shutter_1x2x3', cx, 1, 2, 'DarkGreen', r); }
  bp.tag = 'wheels'; bp.part('plate_2x2', 62, 1, 2, 'LightBluishGray'); bp.part('wheelplate_2x2', 62, 2, 2, 'LightBluishGray'); bp.part('cart_wheel_l', 62, 2, 2, 'Black'); bp.part('cart_wheel_r', 62, 2, 2, 'Black');
  bp.tag = 'leaves'; for (let r = 0; r < 4; r++) { bp.part('plate_2x2', 68 + r * 6, 1, 2, 'Green'); bp.part(r < 2 ? 'palm_leaf_l' : 'palm_leaf_s', 68 + r * 6, 2, 2, 'Green', r); }
  // row B (z ~16): palms, rain tree, supertree grove with the skywalk
  palm(bp, 6, 1, 18, 4, 0); palm(bp, 18, 1, 18, 3, 1);
  tree(bp, 34, 1, 18, 'L', undefined, 0, undefined, 'raintree');
  supertree(bp, 50, 1, 22, 7, undefined, 1 + 16); supertree(bp, 57, 1, 22, 6, undefined, 1 + 16); supertree(bp, 56, 1, 12, 5); skywalk(bp, 50, 57, 22, 1 + 16);
  // row C (z ~34): shophouse terrace (front toward +z), hawker stall in front of it, ice-cream cart, orchids
  shophouseRow(bp, 2, 1, 28, 0, undefined, undefined, 'plaque_shophouse', 'tile_majolica');
  hawkerStall(bp, 26, 1, 40, 0, { legs: 'Black', torso: 'White', face: 'face_hawker', torsoPrint: 'torso_hawker', hair: 'Black', hairKey: 'hair_short' }, 'sign_chickenrice');
  iceCreamCart(bp, 40, 1, 44, 0, 'LightBluishGray', undefined, 'cart_side');
  bp.tag = 'figs'; const uncle = minifig2(bp, 44.5, 1, 45.5, 3, { legs: 'DarkBlue', torso: 'White', face: 'face_uncle', torsoPrint: 'torso_vendor', hair: 'DarkBluishGray', hairKey: 'hair_tousled', hold: [{ key: 'icecream_cone', color: 'Tan', hand: 'R' }] });
  { const [gx, , gz] = uncle.grips.R; bp.part('icecream_scoops', Math.round(gx * 2) / 2 - 0.5, uncle.held.icecream_cone + PARTS.icecream_cone.h, Math.round(gz * 2) / 2 - 0.5, 'White'); }
  orchidBed(bp, [[50, 44], [51, 45], [52, 44], [50, 46], [52, 46], [51, 47]], 1);
  // row D (z ~50): Merlion on a promenade block beside a water pit, tourist with a camera; Marina Bay Sands at the far right
  bp.tag = 'merlion'; for (let px = 8; px < 16; px++) for (let pz = 50; pz < 56; pz++) { for (let yy = 1; yy < 4; yy++) bp.vox1('brick', px, yy, pz, 'LightBluishGray'); bp.vox1(px >= 8 && px < 15 && pz >= 52 && pz < 54 ? 'plate' : 'tile', px, 4, pz, 'LightBluishGray'); }   // promenade block; studs only under the plinth
  bp.tag = 'water'; for (let px = 0; px < 8; px++) for (let pz = 48; pz < 58; pz++) bp.vox1('plate', px, 1, pz, 'TransLightBlue');
  merlion(bp, 9, 5, 52, 0, 2, undefined, 'merlion_face', 'merlion_scales');
  bp.tag = 'figs'; minifig2(bp, 18.5, 1, 56.5, 3, { legs: 'DarkTan', torso: 'Coral', face: 'face_grin', torsoPrint: 'torso_batik', hair: 'DarkBrown', hairKey: 'hair_tousled', hold: [{ key: 'camera', color: 'Black', hand: 'R' }] });
  mbs(bp, 62, 1, 52, 0);
  bp.tag = ''; bp.pack();
  return { id: 'sg-parts', title: 'Singapore parts', caption: 'new moulds · palm · rain tree · Supertrees · shophouses · hawker · Merlion · MBS', subtitle: 'test scene', size: [W, D], center: [W / 2, 8, D / 2], camera: { az: 0.3, el: 0.5, dist: 140 } };
}
