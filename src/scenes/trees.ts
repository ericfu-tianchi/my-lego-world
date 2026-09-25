// Test scene: cherry tree candidates side by side with a minifig for scale. ?scene=trees
// Left → right: sakura4 L / M / S (LEGO Masters way), then the earlier candidates A (10315 tiling) and v3 for comparison.
import { Blueprint } from '../core/builder';
import { minifig2, sakura4, sakuraA, sakura3, type SceneMeta } from './lib';

export function buildTrees(bp: Blueprint): SceneMeta {
  const W = 56, D = 24;
  bp.tag = 'ground'; for (let x = 0; x < W; x += 8) for (let z = 0; z < D; z += 8) bp.part('plate_8x8', x, 0, z, 'BrightGreen');
  sakura4(bp, 6, 1, 11, 'L', undefined, 0); sakura4(bp, 18, 1, 11, 'M', undefined, 1); sakura4(bp, 27, 1, 11, 'S', undefined, 2);
  sakuraA(bp, 38, 1, 12, 'L'); sakura3(bp, 49, 1, 12, 'L');
  bp.tag = 'figs'; minifig2(bp, 32.5, 1, 15.5, 0, { legs: 'DarkBlue', torso: 'White', face: 'face_smile', torsoPrint: 'torso_kimono_red', hair: 'Black', hairKey: 'hair_topknot' });
  bp.tag = ''; bp.pack();
  return { id: 'trees', title: 'Cherry trees', caption: 'v4 · A · v3', subtitle: 'candidate techniques', size: [W, D], center: [W / 2, 5, D / 2], camera: { az: 0, el: 0.18, dist: 64 } };
}
