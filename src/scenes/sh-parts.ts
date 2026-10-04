// Shanghai landmarks test scene (2026-10-02): each landmark alone on a grey plate, built on the exploded-assembly pipeline.
// ?scene=sh-parts, one element with ?only=pearl
import { Blueprint } from '../core/builder';
import type { SceneMeta } from './lib';

export function buildShParts(bp: Blueprint): SceneMeta {
  const W = 72, D = 24; bp.tag = 'ground'; for (let x = 0; x < W; x += 8) for (let z = 0; z < D; z += 8) bp.part('plate_8x8', x, 0, z, 'LightBluishGray');
  // Pearl plaza: a round granite plaza (r 8) in a lawn ring, a dark ring round the column well; the tower stands on studs at y 2
  bp.tag = 'plaza'; for (let x = 0; x < W; x++) for (let z = 0; z < D; z++) { const r = Math.hypot(x + 0.5 - 12, z + 0.5 - 12); if (r < 8) bp.vox1('plate', x, 1, z, r > 2 && r < 3.2 ? 'DarkBluishGray' : 'LightBluishGray'); else if (r < 10.5) bp.vox1('plate', x, 1, z, 'Green'); }
  bp.tag = 'pearl'; bp.assembly('pearl', 6, 2, 6, 'Tan');
  bp.tag = 'shtower'; for (let x = 26; x < 38; x++) for (let z = 7; z < 19; z++) bp.vox1('plate', x, 1, z, 'LightBluishGray'); bp.assembly('shtower', 27, 2, 8, 'SandBlue');
  bp.tag = 'swfc'; for (let x = 42; x < 52; x++) for (let z = 7; z < 17; z++) bp.vox1('plate', x, 1, z, 'LightBluishGray'); bp.assembly('swfc', 43, 2, 8, 'SandBlue', 1);
  bp.tag = 'jinmao'; for (let x = 58; x < 68; x++) for (let z = 7; z < 17; z++) bp.vox1('plate', x, 1, z, 'LightBluishGray'); bp.assembly('jinmao', 59, 2, 8, 'LightBluishGray');
  bp.tag = ''; bp.pack();
  return { id: 'sh-parts', title: 'Shanghai landmarks', caption: 'Oriental Pearl Tower', subtitle: 'test scene', size: [W, D], center: [W / 2, 20, D / 2], camera: { az: 0.3, el: 0.15, dist: 70 } };
}
