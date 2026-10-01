// Singapore landmarks v4 test scene (2026-10-01): each landmark alone on a grey plate, built on the exploded-assembly pipeline.
// ?scene=sg-v4, one element with ?only=mbs
import { Blueprint } from '../core/builder';
import type { SceneMeta } from './lib';
import { mbs10, merlion6 } from './singapore-v4';

export function buildSgV4(bp: Blueprint): SceneMeta {
  const W = 48, D = 40; bp.tag = 'ground'; for (let x = 0; x < W; x += 8) for (let z = 0; z < D; z += 8) bp.part('plate_8x8', x, 0, z, 'LightBluishGray');
  mbs10(bp, 7, 1, 7, 0);
  // Merlion on a promenade block two plates above the water, spouting +x
  bp.tag = 'promenade'; for (let x = 1; x < 13; x++) for (let z = 22; z < 34; z++) { bp.vox1('plate', x, 1, z, 'LightBluishGray'); bp.vox1('plate', x, 2, z, 'LightBluishGray'); }
  bp.tag = 'water'; for (let x = 13; x < 30; x++) for (let z = 20; z < 36; z++) bp.vox1('plate', x, 1, z, 'TransLightBlue');
  merlion6(bp, 3, 3, 25, 0, 2);
  bp.tag = 'supertree'; bp.assembly('grove6', 32, 1, 25, 'Magenta');
  bp.tag = ''; bp.pack();
  return { id: 'sg-v4', title: 'Singapore landmarks v4', caption: 'Marina Bay Sands', subtitle: 'test scene', size: [W, D], center: [W / 2, 10, D / 2], camera: { az: 0.45, el: 0.3, dist: 80 } };
}

