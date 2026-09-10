// A · Tokyo — micro skyline city on a 48×32 baseplate. Tokyo Tower and Skytree as heroes; Senso-ji, Tokyo Station,
// Shibuya crossing, Rainbow Bridge over the Sumida, Tokyo Dome, a sakura park, Mt Fuji in the corner, and a figure stand.
import { Blueprint } from '../core/builder';
import { Reserve, patch, minifig, sakura, bush, type SceneMeta } from './lib';

export function buildTokyo(bp: Blueprint): SceneMeta {
  const W = 48, D = 32; const R = new Reserve(); const G = 2; // ground plates sit at y=1 (top 2)
  bp.tag = 'base'; bp.part('baseplate_32x32', 0, 0, 0, 'DarkBluishGray'); bp.part('baseplate_16x32', 32, 0, 0, 'DarkBluishGray');
  for (let x = 0; x < W; x += 8) { bp.part('plate_1x8', x, 1, 0, 'Black', 1); bp.part('plate_1x8', x, 1, D - 1, 'Black', 1); }
  for (let z = 1; z < D - 1; z += 6) { const len = Math.min(6, D - 1 - z); bp.part(`plate_1x${len}`, 0, 1, z, 'Black', 0); bp.part(`plate_1x${len}`, W - 1, 1, z, 'Black', 0); }
  // ---- ground
  const isRiver = (x: number, z: number) => z >= 26 && z <= 28 && x >= 1 && x <= 46 && !(x >= 33 && x <= 34);
  const isRoad = (x: number, z: number) => ((x === 16 || x === 17) && z < 25) || ((x === 32 || x === 33) && z < 25) || ((z === 12 || z === 13) && x >= 1 && x <= 46) || ((z === 22 || z === 23) && x >= 1 && x <= 46);
  const isQuay = (x: number, z: number) => (z === 25 || z === 29) && x >= 1 && x <= 46;
  const isPark = (x: number, z: number) => x >= 2 && x <= 9 && z >= 15 && z <= 21;
  for (let x = 1; x < W - 1; x++) for (let z = 1; z < D - 1; z++) {
    if (isRiver(x, z)) { bp.vox1('tile', x, 1, z, 'TransLightBlue'); R.add(x, z, 1, 1); continue; }
    if (isQuay(x, z)) { bp.vox1('plate', x, 1, z, 'DarkBluishGray'); continue; }
    if (isRoad(x, z)) { const zebra = ((x === 15 || x === 18) && (z === 12 || z === 13)) || ((z === 11 || z === 14) && (x === 16 || x === 17)); bp.vox1('tile', x, 1, z, zebra ? 'White' : 'LightBluishGray'); R.add(x, z, 1, 1); continue; }
    bp.vox1('plate', x, 1, z, isPark(x, z) ? (patch(x, z, 2, 5) < 0.3 ? 'Green' : 'BrightGreen') : (patch(x, z, 3, 9) < 0.5 ? 'LightBluishGray' : 'Tan'));
  }
  // ---- Mt Fuji (back-left corner)
  bp.tag = 'fuji'; R.add(1, 1, 6, 6); bp.fill('brick', 1, G, 1, 6, 3, 6, 'DarkBluishGray'); bp.fill('brick', 2, G + 3, 2, 4, 3, 4, 'DarkBluishGray');
  bp.part('slope_2x2', 2, G + 6, 2, 'White', 2); bp.part('slope_2x2', 4, G + 6, 2, 'White', 2); bp.part('slope_2x2', 2, G + 6, 4, 'White', 0); bp.part('slope_2x2', 4, G + 6, 4, 'White', 0);
  // ---- Tokyo Tower (legs x 8/11, z 3/6)
  bp.tag = 'tokyo-tower'; R.add(7, 2, 6, 6);
  for (const [lx, lz] of [[8, 3], [11, 3], [8, 6], [11, 6]]) for (let k = 0; k < 3; k++) bp.part('round_1x1', lx, G + k * 3, lz, 'BrightRed');
  bp.part('plate_4x4', 8, G + 9, 3, 'BrightRed'); bp.part('roundbrick_2x2', 9, G + 10, 4, 'BrightRed'); bp.part('roundbrick_2x2', 9, G + 13, 4, 'White'); bp.part('jumper_2x2', 9, G + 16, 4, 'BrightRed');
  for (let k = 0; k < 5; k++) bp.part('round_1x1', 9.5, G + 17 + k * 3, 4.5, k % 2 ? 'White' : 'BrightRed');
  bp.part('roundplate_2x2', 9, G + 32, 4, 'White'); bp.part('roundplate_2x2', 9, G + 33, 4, 'BrightRed');
  for (let k = 0; k < 3; k++) bp.part('round_1x1', 9.5, G + 34 + k * 3, 4.5, k === 1 ? 'White' : 'BrightRed');
  bp.part('cone_1x1', 9.5, G + 43, 4.5, 'White'); bp.part('bar_3l', 9.5, G + 46, 4.5, 'White');
  // ---- Skytree (x 40..41, z 5..6)
  bp.tag = 'skytree'; R.add(39, 4, 4, 4);
  for (let k = 0; k < 3; k++) bp.part('roundbrick_2x2', 40, G + k * 3, 5, 'White'); bp.part('jumper_2x2', 40, G + 9, 5, 'LightBluishGray');
  for (let k = 0; k < 6; k++) bp.part('round_1x1', 40.5, G + 10 + k * 3, 5.5, 'White');
  bp.part('roundplate_2x2', 40, G + 28, 5, 'LightBluishGray'); bp.part('roundplate_2x2', 40, G + 29, 5, 'TransLightBlue');
  for (let k = 0; k < 3; k++) bp.part('round_1x1', 40.5, G + 30 + k * 3, 5.5, 'White');
  bp.part('roundplate_2x2', 40, G + 39, 5, 'LightBluishGray'); for (let k = 0; k < 2; k++) bp.part('round_1x1', 40.5, G + 40 + k * 3, 5.5, 'White');
  bp.part('cone_1x1', 40.5, G + 46, 5.5, 'LightBluishGray'); bp.part('antenna_1x4', 40.5, G + 49, 5.5, 'White');
  // ---- Tokyo Station (x 18..29, z 14..16), arches face the viewer
  bp.tag = 'station'; R.add(17, 13, 14, 5);
  for (let x = 18; x < 30; x += 4) bp.part('arch_1x4', x, G, 16, 'DarkRed');
  bp.fill('brick', 18, G, 14, 12, 3, 2, 'DarkRed'); bp.fill('plate', 18, G + 3, 14, 12, 1, 3, 'White'); bp.fill('brick', 18, G + 4, 14, 12, 3, 3, 'DarkRed');
  bp.fill('plate', 18, G + 7, 14, 12, 1, 3, 'White'); for (let x = 20; x < 28; x++) bp.part('tile_1x1', x, G + 8, 15, 'DarkBluishGray');
  bp.part('dome_2x2', 18, G + 8, 14, 'DarkBluishGray'); bp.part('dome_2x2', 28, G + 8, 14, 'DarkBluishGray'); bp.part('tile_1x2', 18, G + 8, 16, 'DarkBluishGray', 1); bp.part('tile_1x2', 28, G + 8, 16, 'DarkBluishGray', 1);
  for (let x = 20; x < 28; x += 2) bp.part('tile_1x2', x, G + 8, 16, 'DarkBluishGray', 1);
  // ---- Senso-ji (x 36..45, z 14..21): Kaminarimon gate with hanging lantern, Nakamise stalls, micro pagoda
  bp.tag = 'sensoji'; R.add(35, 14, 11, 8);
  for (const px of [37, 41]) for (let k = 0; k < 2; k++) bp.part('round_1x1', px, G + k * 3, 19, 'BrightRed');
  bp.part('plate_2x6', 36, G + 6, 18, 'DarkBluishGray', 1); bp.part('round_1x1', 39, G + 3, 19, 'BrightRed'); // lantern hangs from the roof plate
  for (let x = 36; x < 42; x++) bp.part('slope_1x2', x, G + 7, 18, 'DarkBluishGray', 0);
  for (let x = 36; x < 42; x += 2) bp.part('tile_1x2', x, G + 10, 18, 'Black', 1);
  for (let i = 0; i < 3; i++) { const x = 36 + i * 2; bp.part('brick_1x2', x, G, 21, bp.pick(['BrightRed', 'White', 'DarkRed']), 1); bp.part('plate_1x2', x, G + 3, 21, 'Tan', 1); bp.part('tile_1x2', x, G + 4, 21, i % 2 ? 'BrightRed' : 'White', 1); }
  let py = G; for (let t = 0; t < 5; t++) { bp.part('brick_2x2', 43, py, 15, 'DarkRed'); bp.part('plate_4x4', 42, py + 3, 14, 'DarkGreen'); if (t < 4) for (const [x, z, r] of [[42, 14, 0], [45, 14, 0], [42, 17, 2], [45, 17, 2]] as [number, number, number][]) bp.part('cheese_1x1', x, py + 4, z, 'DarkGreen', r); py += 4; }
  bp.part('brick_2x2', 43, py, 15, 'DarkRed'); bp.part('jumper_2x2', 43, py + 3, 15, 'DarkGreen'); bp.part('cone_1x1', 43.5, py + 4, 15.5, 'PearlGold'); bp.part('bar_3l', 43.5, py + 7, 15.5, 'PearlGold');
  // ---- Tokyo Dome (x 11..14, z 15..18)
  bp.tag = 'dome'; R.add(10, 14, 6, 6); bp.part('roundbrick_2x2', 12, G, 16, 'White'); bp.part('dish_4x4', 11, G + 3, 15, 'White'); bp.part('roundplate_1x1', 12.5, G + 4, 16.5, 'LightBluishGray');
  // ---- Rainbow Bridge over the Sumida (x 33..34, z 24..30), legs on the quays
  bp.tag = 'rainbow-bridge'; R.add(33, 24, 2, 7);
  bp.part('arch_1x6x2', 33, G, 24, 'White', 1); bp.part('arch_1x6x2', 34, G, 24, 'White', 1); bp.part('plate_2x6', 33, G + 6, 24, 'White', 0);
  for (const z of [24, 29]) { bp.part('round_1x1', 33, G + 7, z, 'White'); bp.part('round_1x1', 34, G + 7, z, 'White'); bp.part('roundplate_1x1', 33, G + 10, z, 'BrightRed'); bp.part('roundplate_1x1', 34, G + 10, z, 'BrightRed'); }
  // ---- Shibuya corner screen (x 14..15, z 10..11)
  bp.tag = 'shibuya'; R.add(14, 10, 2, 2); bp.part('plate_2x2', 14, G, 10, 'White'); bp.part('brick_2x2', 14, G + 1, 10, 'White'); bp.part('plate_2x2', 14, G + 4, 10, 'TransLightBlue'); bp.part('tile_2x2', 14, G + 5, 10, 'TransLightBlue');
  // ---- park: sakura and bushes
  bp.tag = 'park'; sakura(bp, 3, G, 16, 'S', R); sakura(bp, 7, G, 19, 'S', R); bush(bp, 2, G, 20, undefined, R); bush(bp, 8, G, 15, undefined, R);
  // ---- city fabric: parametric towers (skipped where anything else already stands)
  bp.tag = 'towers';
  const tower = (x: number, z: number, w: number, d: number, floors: number, style: 'glass' | 'stone' | 'stripe' | 'tan') => {
    for (let a = 0; a < w; a++) for (let b = 0; b < d; b++) if (R.has(x + a, z + b)) return false;
    R.add(x, z, w, d); let y = G;
    for (let f = 0; f < floors; f++) {
      const wall = style === 'glass' ? 'White' : style === 'stone' ? 'LightBluishGray' : style === 'tan' ? 'Tan' : 'DarkBluishGray';
      const band = style === 'glass' ? 'TransLightBlue' : style === 'stone' ? 'DarkBluishGray' : style === 'tan' ? 'White' : 'LightBluishGray';
      bp.fill('brick', x, y, z, w, 3, d, wall); bp.fill('plate', x, y + 3, z, w, 1, d, band); y += 4;
    }
    bp.fill('tile', x, y, z, w, 1, d, style === 'glass' ? 'LightBluishGray' : 'DarkBluishGray');
    bp.clear(x, y, z, 1, 1, 1); bp.vox1('plate', x, y, z, 'DarkBluishGray');
    if (w * d >= 6) bp.part('telescope', x, y + 1, z, 'LightBluishGray'); else bp.part('roundplate_1x1', x, y + 1, z, 'LightBluishGray');
    return true;
  };
  const specs: [number, number, number, number, number, 'glass' | 'stone' | 'stripe' | 'tan'][] = [
    [13, 2, 2, 3, 3, 'tan'], [2, 8, 3, 3, 2, 'tan'], [6, 8, 2, 2, 3, 'stone'], [10, 8, 3, 3, 3, 'stone'],
    [19, 2, 4, 3, 6, 'stripe'], [24, 3, 3, 3, 4, 'glass'], [28, 2, 3, 4, 8, 'glass'], [19, 7, 2, 4, 3, 'glass'], [24, 8, 3, 3, 7, 'stripe'], [28, 8, 2, 2, 4, 'tan'],
    [35, 2, 2, 3, 5, 'stone'], [44, 3, 2, 3, 4, 'tan'], [36, 8, 3, 3, 6, 'glass'], [43, 8, 3, 3, 3, 'stone'],
    [19, 19, 2, 2, 2, 'stone'], [23, 18, 3, 3, 3, 'glass'], [28, 19, 2, 2, 2, 'tan'], [12, 20, 3, 1, 2, 'tan'],
    [10, 24, 3, 1, 2, 'glass'], [21, 24, 4, 1, 2, 'tan'], [39, 24, 3, 1, 2, 'stone'], [2, 24, 3, 1, 1, 'stone'],
  ];
  for (const s of specs) tower(...s);
  // ---- boats on the river (sit on trans plates swapped in for tiles)
  bp.tag = 'boats'; for (const x of [12, 26, 41]) { bp.clear(x, 1, 27, 2, 1, 1); bp.vox1('plate', x, 1, 27, 'TransLightBlue'); bp.vox1('plate', x + 1, 1, 27, 'TransLightBlue'); bp.part('plate_1x2', x, 2, 27, 'White', 1); bp.part('tile_1x1', x, 3, 27, 'BrightRed'); }
  // ---- figure stand beside the base
  bp.tag = 'figures'; bp.part('plate_4x8', 50, 0, 20, 'Tan');
  minifig(bp, 51.5, 1, 21.5, 3, { legs: 'DarkTan', torso: 'DarkBlue', hair: 'Black' });      // Eric, the traveller
  minifig(bp, 51.5, 1, 24.5, 3, { legs: 'DarkRed', torso: 'DarkRed', hair: 'Black' });       // kimono colours
  minifig(bp, 51.5, 1, 27, 3, { legs: 'BrightBlue', torso: 'White', hair: 'DarkOrange' });    // schoolkid
  bp.part('brick_1x2', 53, 1, 21, 'Black', 0); // suitcase
  bp.tag = ''; bp.pack();
  return { id: 'tokyo', title: 'Japan', caption: 'Tokyo', subtitle: 'Tokyo Tower · Skytree · Senso-ji · Tokyo Station · Rainbow Bridge', size: [W, D], center: [W / 2, 6, D / 2], camera: { az: 0.62, el: 0.42, dist: 80 } };
}
