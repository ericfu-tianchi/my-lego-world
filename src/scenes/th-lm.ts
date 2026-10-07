// Pattaya landmarks test scene (2026-10-05): each element alone on a grey plate before it goes onto the island. ?scene=th-lm, one element
// with ?only=sanctuary; a visitor stands at the foot for scale (?only=sanctuary,fig)
import { Blueprint } from '../core/builder';
import type { SceneMeta } from './lib';
import { minifig2 } from './lib';

export function buildThLm(bp: Blueprint): SceneMeta {
  const W = 56, D = 56; bp.tag = 'ground'; for (let x = 0; x < W; x += 8) for (let z = 0; z < D; z += 8) bp.part('plate_8x8', x, 0, z, 'LightBluishGray');
  bp.tag = 'sanctuary'; bp.assembly('th_sanctuary', 8, 1, 8, 'ReddishBrown');
  bp.tag = 'pole'; bp.assembly('th_pole', 46, 1, 6, 'LightBluishGray');
  bp.tag = 'fig'; minifig2(bp, 51, 1, 46, 0, { legs: 'DarkBlue', torso: 'White', skin: 'Yellow', hair: 'Black' });
  bp.tag = ''; bp.pack();
  return { id: 'th-lm', title: 'Pattaya landmarks', caption: 'Sanctuary of Truth', subtitle: 'test scene', size: [W, D], center: [W / 2, 24, D / 2], camera: { az: 0.6, el: 0.2, dist: 120 } };
}
