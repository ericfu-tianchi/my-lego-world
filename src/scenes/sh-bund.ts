// Shanghai Bund test scene (2026-10-03): the three Bund buildings side by side on grey plates, fronts toward −z (the river).
// ?scene=sh-bund, one element with ?only=customs | hsbc | peace | shikumen
import { Blueprint } from '../core/builder';
import { tree, type SceneMeta } from './lib';

export function buildShBund(bp: Blueprint): SceneMeta {
  const W = 64, D = 48; bp.tag = 'ground'; for (let x = 0; x < W; x += 8) for (let z = 0; z < D; z += 8) bp.part('plate_8x8', x, 0, z, 'LightBluishGray');
  bp.tag = 'peace'; bp.assembly('peace', 4, 1, 8, 'Tan');
  bp.tag = 'hsbc'; bp.assembly('hsbc', 18, 1, 8, 'Tan');
  bp.tag = 'customs'; bp.assembly('customs', 44, 1, 8, 'Tan');
  bp.tag = 'shikumen'; bp.assembly('shikumen_row', 20, 1, 26, 'DarkBluishGray'); bp.assembly('shikumen_row', 20, 1, 39, 'DarkBluishGray', 2); bp.assembly('shikumen_gate', 18, 1, 34, 'LightBluishGray', 1);
  tree(bp, 14, 1, 36, 'M', undefined, 0, undefined, 'plane');              // a plane tree at the lane mouth
  bp.tag = ''; bp.pack();
  return { id: 'sh-bund', title: 'Shanghai Bund', caption: 'The Bund', subtitle: 'test scene', size: [W, D], center: [W / 2, 16, D / 2], camera: { az: 3.0, el: 0.15, dist: 70 } };
}
