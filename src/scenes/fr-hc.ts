// Paris test scene (2026-10-03): Haussmann corner and café alone on a grey plate before it goes onto the island. ?scene=fr-hc
// (?only=haussmann, cafe, morris)
import { Blueprint } from '../core/builder';
import type { SceneMeta } from './lib';
import { haussmann } from './paris-haussmann';

export function buildFrHc(bp: Blueprint): SceneMeta {
  const W = 32, D = 32; bp.tag = 'ground'; for (let x = 0; x < W; x += 8) for (let z = 0; z < D; z += 8) bp.part('plate_8x8', x, 0, z, 'LightBluishGray');
  bp.tag = ''; haussmann(bp, 9, 1, 8, 0);
  bp.pack();
  return { id: 'fr-hc', title: 'Paris landmarks', caption: 'Haussmann corner and café', subtitle: 'test scene', size: [W, D], center: [W / 2, 12, D / 2], camera: { az: 0.6, el: 0.2, dist: 90 } };
}
