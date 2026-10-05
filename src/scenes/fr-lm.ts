// Paris landmarks test scene (2026-10-03): each landmark alone on a grey plate before it goes onto the island.
// ?scene=fr-lm, one element with ?only=eiffel; a visitor stands at the tower's foot for scale (?only=eiffel,fig)
import { Blueprint } from '../core/builder';
import type { SceneMeta } from './lib';
import { minifig2 } from './lib';
import { eiffel } from './paris-eiffel';

export function buildFrLm(bp: Blueprint): SceneMeta {
  const W = 32, D = 32; bp.tag = 'ground'; for (let x = 0; x < W; x += 8) for (let z = 0; z < D; z += 8) bp.part('plate_8x8', x, 0, z, 'LightBluishGray');
  eiffel(bp, 3, 1, 3);
  bp.tag = 'fig'; minifig2(bp, 26, 1, 15, 1, { legs: 'DarkBlue', torso: 'White', skin: 'Yellow', hair: 'ReddishBrown', hold: [{ key: 'camera', color: 'Black', hand: 'R' }] });
  bp.tag = ''; bp.pack();
  return { id: 'fr-lm', title: 'Paris landmarks', caption: 'Eiffel Tower', subtitle: 'test scene', size: [W, D], center: [W / 2, 18, D / 2], camera: { az: 0.6, el: 0.2, dist: 110 } };
}
