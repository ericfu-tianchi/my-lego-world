// Los Angeles element test scene: Palms and figures, alone on a grey plate (docs/countries/usa.md §1.12). ?scene=la-life&noglobe
// A row of six fan palms at equal pitch 8 on a tiled walk (Tan sand pockets), and the four Venice figures, each on the ground it will have on
// the island: the surfer on sand, the lifter on a rubber pad, the skater at a ledge's edge about to drop in, the roller-skater on studs.
import { Blueprint } from '../core/builder';
import { fanPalm, minifig2, type FigOpts2, type PalmCrown, type SceneMeta } from './lib';

/** The four Venice figures (the island reuses them) */
export const SURFER: FigOpts2 = { legs: 'Black', torso: 'Black', torsoPrint: 'torso_la_wetsuit', face: 'face_la_grin', hair: 'DarkBrown', hairKey: 'hair_tousled', poses: { L: 'd' }, hold: [{ key: 'surfboard_up', color: 'White', hand: 'R' }] };
export const LIFTER: FigOpts2 = { legs: 'Black', torso: 'Yellow', torsoPrint: 'torso_la_tank', face: 'face_la_grin', hair: 'Black', hairKey: 'hair_short', poses: { L: 'd' }, hold: [{ key: 'dumbbell_x', color: 'Black', hand: 'R', pose: 'f' }] };   // r3 (Eric): one dumbbell, a curl (forearm up at 45°, the weights clear of his face); the left arm relaxed at his side
export const SKATER: FigOpts2 = { legs: 'DarkBlue', torso: 'White', torsoPrint: 'torso_la_skate', face: 'face_la_shades', hair: 'BrightRed', hairKey: 'helmet_skate', headTurn: 1, poses: { L: 'k', R: 'f' } };
export const ROLLER: FigOpts2 = { legs: 'MediumAzure', torso: 'White', torsoPrint: 'torso_la_rainbow', face: 'face_la_shades', hair: 'Black', hairKey: 'hair_afro', skates: 'White', poses: { L: 'f', R: 'k' } };

export function buildLaLife(bp: Blueprint): SceneMeta {
  const W = 88, D = 72; bp.tag = 'ground'; for (let x = 0; x < W; x += 8) for (let z = 0; z < D; z += 8) bp.part('plate_8x8', x, 0, z, 'LightBluishGray');
  // the walk: tiles, with a 4×4 Tan sand pocket round each palm's foot
  const PALMS = [12, 20, 28, 36, 44, 52], PZ = 9; const pocket = (x: number, z: number) => PALMS.some((p) => x >= p - 2 && x < p + 2) && z >= PZ - 2 && z < PZ + 2;
  for (let x = 0; x < W; x++) for (let z = 3; z < 15; z++) if (!pocket(x, z)) bp.vox1('tile', x, 1, z, 'LightBluishGray');
  for (const p of PALMS) bp.fill('plate', p - 2, 1, PZ - 2, 4, 1, 4, 'Tan');
  // figure grounds: sand (surfer), a black rubber pad (lifter), a two-brick ledge (skater), studded walk (roller-skater)
  bp.fill('plate', 6, 1, 22, 6, 1, 6, 'Tan');
  bp.fill('plate', 15, 1, 22, 11, 1, 6, 'Black');
  bp.fill('brick', 28, 1, 22, 7, 6, 6, 'LightBluishGray');
  bp.tag = ''; bp.pack();

  PALMS.forEach((p, i) => fanPalm(bp, p, 2, PZ, { turn: i }));

  bp.tag = 'surfer'; minifig2(bp, 10, 2, 25, 0, SURFER);
  bp.tag = 'lifter'; minifig2(bp, 17, 2, 25, 0, LIFTER);
  // skater: a 1 × 2 riser of two plates at the ledge's east edge, the board on it (nose over the edge, front wheels in the air), feet on its studs
  bp.tag = 'skater'; const LT = 7; bp.part('plate_1x2', 33, LT, 24, 'LightBluishGray', 1); bp.part('plate_1x2', 33, LT + 1, 24, 'LightBluishGray', 1);
  bp.assembly('skateboard', 33, LT + 2, 24, 'Orange');
  minifig2(bp, 34, LT + 3, 24.5, 0, SKATER);
  bp.tag = 'roller'; minifig2(bp, 46, 1, 25, 0, ROLLER);
  bp.tag = '';
  // palms r2 (2026-10-05): the r1 head and the four candidate crowns side by side on the bare plate, pitch 17 (crown A is 17.6 wide)
  // each tagged palm_<r1|a|b|c|d> so ?only= isolates it (fanPalm tags its parts 'palm'; the retag keeps trunk and crown under one tag)
  (['r1', 'a', 'b', 'c', 'd'] as PalmCrown[]).forEach((crown, i) => {
    const n0 = bp.parts.length; fanPalm(bp, 10 + 17 * i, 1, 50, { crown }); for (const p of bp.parts.slice(n0)) p.tag = 'palm_' + crown;
  });
  // palms r3: the copies of Eric's reference palms, a row in front (z 60), pitch 17
  (['v1', 'v2', 'v3'] as PalmCrown[]).forEach((crown, i) => {
    const n0 = bp.parts.length; fanPalm(bp, 27 + 17 * i, 1, 59, { crown }); for (const p of bp.parts.slice(n0)) p.tag = 'palm_' + crown;
  });
  return { id: 'la-life', title: 'Palms and figures', caption: 'Palms and figures', subtitle: 'test scene', size: [W, D], center: [W / 2, 10, D / 2], camera: { az: 0.3, el: 0.2, dist: 70 } };
}
