// Hidden test scene: every LDraw-imported part and every v2 grammar assembly on a grey plate, for visual verification.
// Reach it with ?scene=partsheet. Must pass the validator like any scene.
import { Blueprint } from '../core/builder';
import { PARTS } from '../core/catalog';
import { minifig2, holdUmbrella, banner, paperLantern, lowTable, blossom, sakura3, pine3, type SceneMeta } from './lib';

export function buildPartsheet(bp: Blueprint): SceneMeta {
  const W = 64, D = 40; bp.tag = 'ground'; for (let x = 0; x < W; x += 8) for (let z = 0; z < D; z += 8) bp.part('plate_8x8', x, 0, z, 'LightBluishGray');
  // row A: loose LDraw parts, 4 studs apart
  const loose: [string, string, number][] = [['fish', 'Orange', 0], ['cup', 'White', 0], ['goblet', 'TransClear', 0], ['camera', 'Black', 0], ['pushbroom', 'ReddishBrown', 0], ['hand_fan', 'White', 0], ['tray', 'ReddishBrown', 0], ['rice_bowl', 'White', 0], ['teapot', 'DarkGreen', 0], ['swirl_1x1', 'BrightGreen', 0], ['bottle', 'TransGreen', 0], ['basket', 'ReddishBrown', 0], ['seat_2x2', 'ReddishBrown', 0], ['barrel_2x2', 'ReddishBrown', 0], ['cat', 'White', 0]];
  bp.tag = 'loose'; loose.forEach(([k, c, r], i) => bp.part(k, 2 + i * 4, 1, 2, c, r));
  const loose2: [string, string, number][] = [['songbird', 'DarkPink', 0], ['frog', 'BrightGreen', 0], ['butterfly', 'Lavender', 0], ['duckling', 'Yellow', 0], ['flower_small', 'White', 0], ['fence_lattice_1x4x2', 'ReddishBrown', 0], ['rock_4x4', 'DarkBluishGray', 0], ['nugget', 'LightBluishGray', 0], ['clip_v', 'Black', 0], ['clip_h', 'Black', 0], ['window_1x2x3', 'DarkBrown', 0], ['doorframe_1x4x6', 'DarkBrown', 0], ['arch_1x8x2', 'BrightRed', 0]];
  let x = 2; loose2.forEach(([k, c, r]) => { bp.part(k, x, 1, 8, c, r); x += Math.max(4, PARTS[k].w + 2); });
  bp.part('pane_lattice_1x2x3', 46, 1, 8, 'White'); bp.part('door_lattice', 50, 1, 8, 'DarkBrown'); // same cell as their frames
  // row B: rotations of clip_v (0..3) with a lantern hanging, and flags on bars (0..3)
  bp.tag = 'clips'; for (let r = 0; r < 4; r++) { const cx = 3 + r * 5; bp.fill('brick', cx, 1, 15, 1, 15, 1, 'Tan'); paperLantern(bp, cx, 16, 15, 'lantern_kyo', r); }
  bp.tag = 'banners'; for (let r = 0; r < 4; r++) banner(bp, 24 + r * 5, 1, 15, r, 'DarkBlue', 'nobori_cha');
  bp.tag = 'leaves'; for (let r = 0; r < 4; r++) bp.part('leaves_6x5', 46 + (r % 2) * 7, 1, 15 + Math.floor(r / 2) * 7, 'Green', r);
  // row C: blossoms, lily + lotus, grass stems, flower stem + small flower
  bp.tag = 'plants'; blossom(bp, 2, 1, 24, 'BrightPink', 'White'); bp.part('flower_1x1', 4, 1, 24, 'BrightPink'); bp.part('flower_7', 4, 2, 24, 'DarkPink');
  bp.part('lilypad', 6, 1, 23, 'Green'); bp.part('lotus', 6, 4, 23, 'BrightPink'); bp.part('roundplate_1x1', 10, 1, 24, 'Green'); bp.part('grass_stem', 10, 2, 24, 'BrightGreen'); bp.part('flower_stem', 12, 1, 24, 'BrightGreen'); bp.part('flower_small', 12, 4, 24, 'Yellow');
  sakura3(bp, 20, 1, 26, 'M'); pine3(bp, 34, 1, 26, 3); sakura3(bp, 46, 1, 26, 'S');
  // row D: minifigs — faces, prints, hair, held things
  bp.tag = 'figs';
  minifig2(bp, 3.5, 1, 34.5, 0, { legs: 'DarkRed', torso: 'White', face: 'face_smile', torsoPrint: 'torso_kimono_red', hair: 'Black', hairKey: 'hair_topknot', hold: [{ key: 'hand_fan', color: 'White', hand: 'R' }] });
  minifig2(bp, 8.5, 1, 34.5, 0, { legs: 'DarkTan', torso: 'DarkTan', face: 'face_calm', torsoPrint: 'torso_monk', hold: [{ key: 'pushbroom', color: 'ReddishBrown', hand: 'R' }] });
  holdUmbrella(bp, 13.5, 1, 34.5, 0, { legs: 'DarkBlue', torso: 'DarkBlue', face: 'face_laugh', torsoPrint: 'torso_kimono_indigo', hair: 'Black', hairKey: 'hair_highbun' }, 'L', 'BrightRed');
  minifig2(bp, 19.5, 1, 34.5, 0, { legs: 'Black', torso: 'Tan', face: 'face_glasses', hair: 'DarkBrown', hairKey: 'fig_hair', hold: [{ key: 'camera', color: 'Black', hand: 'R' }] });
  minifig2(bp, 24.5, 1, 34.5, 0, { legs: 'BrightRed', torso: 'White', face: 'face_child', torsoPrint: 'torso_apron', hair: 'Black', hairKey: 'hair_long', hold: [{ key: 'cup', color: 'White', hand: 'L' }, { key: 'lantern', color: 'BrightRed', hand: 'R' }] });
  minifig2(bp, 29.5, 1, 34.5, 0, { legs: 'DarkBlue', torso: 'BrightRed', hat: 'kasa', face: 'face_smile', poses: { L: 'u', R: 'd' } });
  minifig2(bp, 40.5, 1, 38.5, 2, { legs: 'Black', torso: 'DarkRed', face: 'face_smile', hair: 'DarkBrown', hairKey: 'hair_tousled', hold: [{ key: 'tray', color: 'ReddishBrown' }] });
  minifig2(bp, 45.5, 1, 38.5, 2, { legs: 'DarkTan', torso: 'White', face: 'face_calm', hair: 'DarkOrange', hairKey: 'hair_short', hold: [{ key: 'rice_bowl', color: 'White', hand: 'L' }, { key: 'bottle', color: 'TransGreen', hand: 'R' }] });
  lowTable(bp, 35, 1, 34, 'ReddishBrown', [{ key: 'cup', color: 'White', dx: -0.5, dz: -0.5, rot: 1 }, { key: 'cup', color: 'White', dx: 0.5, dz: -0.5, rot: 3 }, { key: 'teapot', color: 'DarkGreen', dx: 0, dz: 1 }]);
  bp.part('brick_1x4', 40, 1, 34, 'Tan', 3, 'sign_saryo'); bp.part('tile_1x2', 46, 1, 34, 'TransLightBlue', 0, 'koi_tile'); bp.part('round_1x1', 49, 1, 34, 'TransOrange', 0, 'lantern_kyo');
  bp.tag = ''; bp.pack();
  return { id: 'partsheet', title: 'Parts sheet', caption: 'LDraw imports · v2 grammar', subtitle: 'test scene', size: [W, D], center: [W / 2, 4, D / 2], camera: { az: 0.3, el: 0.6, dist: 90 } };
}
