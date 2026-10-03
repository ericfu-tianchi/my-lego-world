// Prague · test scene for one landmark (2026-10-02). ?scene=cz-orloj, ?only=orloj
import { Blueprint } from '../core/builder';
import type { SceneMeta } from './lib';
import '../core/catalog-cz-orloj';
import { orloj } from './prague-orloj';

export function buildCzOrloj(bp: Blueprint): SceneMeta {
  const W = 24, D = 24; bp.tag = 'ground'; for (let x = 0; x < W; x += 8) for (let z = 0; z < D; z += 8) bp.part('plate_8x8', x, 0, z, 'LightBluishGray');
  orloj(bp, 8, 1, 6, 0);
  bp.tag = ''; bp.pack();
  return { id: 'cz-orloj', title: 'Prague · Old Town Hall tower', caption: 'Astronomical Clock', subtitle: 'test scene', size: [W, D], center: [W / 2, 18, D / 2], camera: { az: 0.3, el: 0.2, dist: 90 } };
}
