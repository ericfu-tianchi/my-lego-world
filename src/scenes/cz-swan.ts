// Prague · swan study (2026-10-02). ?scene=cz-swan
import { Blueprint } from '../core/builder';
import { minifig2, type SceneMeta } from './lib';
import '../core/catalog-cz-swan';
import { swan } from './prague-swan';

export function buildCzSwan(bp: Blueprint): SceneMeta {
  const W = 24, D = 14; bp.tag = 'water'; for (let x = 0; x < W; x++) for (let z = 0; z < D; z++) bp.vox1('plate', x, 0, z, 'TransLightBlue');
  bp.tag = 'swans'; swan(bp, 15, 1, 6, 1); swan(bp, 15, 1, 9, 1);
  bp.tag = 'fig'; minifig2(bp, 20, 1, 8.5, 0, { legs: 'DarkBlue', torso: 'BrightRed', hair: 'DarkBrown' });
  bp.tag = ''; bp.pack();
  return { id: 'cz-swan', title: 'Prague · swan', caption: 'swan', subtitle: 'test scene', size: [W, D], center: [W / 2, 2, D / 2], camera: { az: 0.3, el: 0.36, dist: 30 } };
}
