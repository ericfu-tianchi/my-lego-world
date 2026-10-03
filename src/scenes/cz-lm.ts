// Prague landmarks test scene (2026-10-02): each landmark alone on a grey plate before it goes onto the island.
// ?scene=cz-lm, one element with ?only=tyn
import { Blueprint } from '../core/builder';
import type { SceneMeta } from './lib';
import { tyn } from './prague-tyn';

export function buildCzLm(bp: Blueprint): SceneMeta {
  const W = 24, D = 24; bp.tag = 'ground'; for (let x = 0; x < W; x += 8) for (let z = 0; z < D; z += 8) bp.part('plate_8x8', x, 0, z, 'LightBluishGray');
  tyn(bp, 3, 1, 4, 0);
  bp.tag = ''; bp.pack();
  return { id: 'cz-lm', title: 'Prague landmarks', caption: 'Týn Church', subtitle: 'test scene', size: [W, D], center: [W / 2, 20, D / 2], camera: { az: 0.3, el: 0.25, dist: 90 } };
}
