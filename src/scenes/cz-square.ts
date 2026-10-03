// Prague · test scene for the Old Town Square furniture (2026-10-02). ?scene=cz-square, ?only=hus or ?only=cafe
import { Blueprint } from '../core/builder';
import { minifig2, type SceneMeta } from './lib';
import { husMemorial, cafeTerrace, bench, flowerBox, squareLamp, backGarden, squareCat } from './prague-square';

export function buildCzSquare(bp: Blueprint): SceneMeta {
  const W = 24, D = 24; bp.tag = 'ground'; for (let x = 0; x < W; x += 8) for (let z = 0; z < D; z += 8) bp.part('plate_8x8', x, 0, z, 'LightBluishGray');
  husMemorial(bp, 6, 1, 4, 0);
  bp.tag = 'visitor'; minifig2(bp, 12.5, 1, 14.5, 2, { legs: 'DarkBlue', torso: 'BrightRed', hair: 'DarkBrown' });
  cafeTerrace(bp, 0, 1, 17, 0, 3);
  bench(bp, 1, 1, 12, 0); bench(bp, 18, 1, 12, 0); flowerBox(bp, 1, 1, 10, 0); flowerBox(bp, 18, 1, 10, 0, ['Lavender', 'BrightPink']); squareLamp(bp, 21, 1, 3, 0);
  // the back garden, shifted to z 30–44 of the test plate (island x 41–84 kept): its own ground
  bp.tag = 'ground'; for (let x = 40; x < 88; x += 8) for (let z = 30; z < 62; z += 8) bp.part('plate_8x8', x, 0, z, 'LightBluishGray');
  backGarden(bp, 1, 0, 30);
  squareCat(bp, 1, -53, -30);   // the cat on the test plate at (17, 14)
  bp.tag = ''; bp.pack();
  return { id: 'cz-square', title: 'Prague · square', caption: 'Old Town Square', subtitle: 'test scene', size: [88, 62], center: [44, 5, 31], camera: { az: 0.3, el: 0.3, dist: 50 } };
}
