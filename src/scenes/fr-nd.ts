// Paris test scene (2026-10-03): Notre-Dame alone on a grey plate before it goes onto the island. ?scene=fr-nd
import { Blueprint } from '../core/builder';
import type { SceneMeta } from './lib';
import { notreDame } from './paris-notredame';

export function buildFrNd(bp: Blueprint): SceneMeta {
  const W = 32, D = 32; bp.tag = 'ground'; for (let x = 0; x < W; x += 8) for (let z = 0; z < D; z += 8) bp.part('plate_8x8', x, 0, z, 'LightBluishGray');
  notreDame(bp, 6, 1, 12, 0);
  bp.tag = ''; bp.pack();
  return { id: 'fr-nd', title: 'Paris landmarks', caption: 'Notre-Dame', subtitle: 'test scene', size: [W, D], center: [W / 2, 20, D / 2], camera: { az: 0.5, el: 0.2, dist: 110 } };
}
