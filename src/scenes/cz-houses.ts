// Prague · test scene for one landmark (2026-10-02). ?scene=cz-houses, ?only=houses,hallwing (add ,tyn for the row against the church)
// Grid offset from the island: scene x = island x − 46, z as the island (the row stands at island x 50–84, z 14–22; Týn's front at z 13).
import { Blueprint } from '../core/builder';
import type { SceneMeta } from './lib';
import { minifig2 } from './lib';
import '../core/catalog-cz-houses';
import { houseRow, hallWing } from './prague-houses';
import { tyn } from './prague-tyn';

export function buildCzHouses(bp: Blueprint): SceneMeta {
  const W = 48, D = 32; bp.tag = 'ground'; for (let x = 0; x < W; x += 8) for (let z = 0; z < D; z += 8) bp.part('plate_8x8', x, 0, z, 'LightBluishGray');
  tyn(bp, 12, 1, 2, 0);   // Týn (16 wide since the 4-wide gap) centred on x 20, the Týn School / White Unicorn boundary
  houseRow(bp, 4, 1, 14, 0); hallWing(bp, 4, 1, 14, 0);
  // a figure under the Týn School arcade, looking out through the left arch, to prove the clear height
  bp.tag = 'minifig'; minifig2(bp, 13, 1, 19.5, 0, { legs: 'DarkBlue', torso: 'DarkRed', face: 'face_grin', hair: 'DarkBrown', hairKey: 'hair_tousled' });
  bp.tag = ''; bp.pack();
  return { id: 'cz-houses', title: 'Prague · houses', caption: 'Old Town Square houses', subtitle: 'test scene', size: [W, D], center: [W / 2, 15, D / 2], camera: { az: 0.3, el: 0.25, dist: 90 } };
}
