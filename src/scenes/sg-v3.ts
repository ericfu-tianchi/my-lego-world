// Singapore landmark rebuild, v3 (2026-09-19): the four landmarks alone on a grey plate for Eric's screenshot check before they go on the island.
// ?scene=sg-v3, one element with ?only=merlion / mbs / supertree / shophouse (Merlion with only=merlion,water,promenade).
import { Blueprint } from '../core/builder';
import { minifig2, type SceneMeta } from './lib';
import { shophouseRow } from './singapore';
import { merlion3, mbs4, supertree4, skywalk4 } from './singapore-v3';

export function buildSgV3(bp: Blueprint): SceneMeta {
  const W = 96, D = 64; bp.tag = 'ground'; for (let x = 0; x < W; x += 8) for (let z = 0; z < D; z += 8) bp.part('plate_8x8', x, 0, z, 'LightBluishGray');
  // Merlion on a promenade block beside water two plates lower; a tourist for scale
  bp.tag = 'promenade'; for (let px = 18; px < 30; px++) for (let pz = 32; pz < 46; pz++) for (let yy = 1; yy < 4; yy++) bp.vox1('brick', px, yy, pz, 'LightBluishGray');
  bp.tag = 'water'; for (let px = 6; px < 18; px++) for (let pz = 30; pz < 48; pz++) bp.vox1('plate', px, 1, pz, 'TransLightBlue');
  merlion3(bp, 21, 4, 39, 0, 2);
  bp.tag = 'figs'; minifig2(bp, 31.5, 1, 43.5, 3, { legs: 'DarkTan', torso: 'Coral', face: 'face_grin', torsoPrint: 'torso_batik', hair: 'DarkBrown', hairKey: 'hair_tousled', hold: [{ key: 'camera', color: 'Black', hand: 'R' }] });
  // Marina Bay Sands, bay side toward +z
  mbs4(bp, 40, 1, 44, 0, undefined, false);
  // Supertree grove with the skyway
  const a = supertree4(bp, 72, 1, 14, 7, undefined, 2, 3), b = supertree4(bp, 80, 1, 14, 6, undefined, 0, 3); supertree4(bp, 77, 1, 24, 5, undefined, 1);
  const east = a.ledges.find((l) => l.dir === 1)!, west = b.ledges.find((l) => l.dir === 3)!; if (east.level !== west.level) throw new Error('skyway ledges differ'); skywalk4(bp, 72, 80, 14, east.level);
  // Peranakan terrace with paired windows, five-foot way toward +z
  shophouseRow(bp, 34, 1, 4, 0, undefined, undefined, 'plaque_shophouse', 'tile_majolica', true);
  bp.tag = ''; bp.pack();
  return { id: 'sg-v3', title: 'Singapore landmarks v3', caption: 'Merlion · Marina Bay Sands · Supertrees · shophouses', subtitle: 'test scene', size: [W, D], center: [W / 2, 8, D / 2], camera: { az: 0.3, el: 0.5, dist: 140 } };
}
