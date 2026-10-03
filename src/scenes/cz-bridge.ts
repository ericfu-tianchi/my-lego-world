// Prague · test scene for one landmark (2026-10-02). ?scene=cz-bridge, ?only=bridge,bridgetower ; the statue study with ?only=statues
// Island coordinates (x 0–55, z 14–43 of the layout): Kampa x 0–11 low, the Vltava x 12–39, the Old Town quay x 40–55 at the square level.
import { Blueprint } from '../core/builder';
import { minifig2, type SceneMeta } from './lib';
import '../core/catalog-cz-bridge';
import { charlesBridge, statue, bridgeDry, bridgeClearTerrain, busker, riverPlate, riverLife, type StatueKind, type Halo } from './prague-bridge';

export function buildCzBridge(bp: Blueprint): SceneMeta {
  const W = 2, L = W + 10, Z0 = 2, Z1 = 44, X1 = 56;   // water surface, walk / square level
  bp.tag = 'ground'; bp.compact = true;   // deterministic maximum-area packing (new scenes opt in; Blueprint.compact)
  for (let x = 0; x < X1; x++) for (let z = Z0; z < Z1; z++) {
    if (x >= 12 && x <= 39) { bp.vox1('plate', x, 0, z, 'DarkBlue'); continue; }
    if (x <= 11) { for (let y = 0; y < 3; y++) bp.vox1('brick', x, y, z, 'DarkBrown'); for (let y = 3; y < 5; y++) bp.vox1('plate', x, y, z, 'DarkBrown'); bp.vox1('plate', x, 5, z, (x * 7 + z * 3) % 5 === 0 ? 'Green' : 'BrightGreen'); continue; }
    for (let y = 0; y < 9; y++) bp.vox1('brick', x, y, z, x === 40 ? 'DarkTan' : 'LightBluishGray');
    for (let y = 9; y < 11; y++) bp.vox1('plate', x, y, z, 'LightBluishGray');
    const study = z >= 16 && z <= 21 && x >= 42;
    if (study) bp.vox1('plate', x, 11, z, 'LightBluishGray'); else bp.vox1('tile', x, 11, z, (x + z) % 4 === 0 ? 'DarkBluishGray' : 'LightBluishGray');
  }
  // the bridge's own stone replaces the banks where it stands; the river's surface stops at the piers (helpers shared with the island scene)
  bridgeClearTerrain(bp, W);
  for (let x = 12; x <= 39; x++) for (let z = Z0; z < Z1; z++) if (!bridgeDry(x, z)) bp.vox1(riverPlate(x, z) ? 'plate' : 'tile', x, W - 1, z, 'TransLightBlue');
  bp.tag = '';
  charlesBridge(bp, 0, 0, W, 'robe');
  busker(bp, W);
  // the statue strip in front of the island (z 46–52): every candidate on the bridge's own plinth along one run of parapet, no visitors
  bp.tag = 'statues';
  for (let x = 0; x < X1; x += 8) bp.part('plate_8x8', x, 0, 46, 'LightBluishGray');
  const KINDS: StatueKind[] = ['wenceslas', 'augustine', 'nepomuk', 'anthony', 'norbert', 'xavier'];
  const HALOS: Halo[] = ['stars4', 'disc', 'crown', 'flower', 'crownstar'];
  const row = (pz: number, n: number, put: (px: number, i: number) => void) => {
    for (let x = 1; x < 55; x++) { const onPlinth = [...Array(n).keys()].some((i) => x === 4 + 9 * i || x === 5 + 9 * i); if (!onPlinth) { bp.part('brick_1x1', x, 1, pz + 1, 'DarkTan'); bp.part('brick_1x1', x, 4, pz + 1, 'DarkTan'); bp.part('tile_1x1', x, 7, pz + 1, 'Tan'); } }
    for (let i = 0; i < n; i++) { const px = 4 + 9 * i; for (let k = 0; k < 3; k++) bp.part('brick_2x2', px, 1 + 3 * k, pz, 'DarkTan'); bp.part('plate_2x2', px, 10, pz, 'Black'); put(px, i); }
  };
  row(48, KINDS.length, (px, i) => statue(bp, KINDS[i], px, 11, 48, 0));
  bp.tag = 'halos'; for (let x = 0; x < X1; x += 8) bp.part('plate_8x8', x, 0, 54, 'LightBluishGray');
  row(56, HALOS.length, (px, i) => statue(bp, 'nepomuk', px, 11, 56, 0, HALOS[i]));
  riverLife(bp, W);
  bp.tag = 'saxtest';   // grip study (round 9): no offsets — the hand closes on the sax body; pose × rotation
  for (let x = 0; x < X1; x += 8) for (const z of [62, 70]) bp.part('plate_8x8', x, 0, z, 'LightBluishGray');
  // pose × rotation; f-2, h-0 and h-2 put the horn through the body and were dropped
  ([['f', 0], ['f', 1], ['f', 3], ['h', 1], ['h', 3]] as const).forEach(([pose, r], i) => minifig2(bp, 4 + 7 * i, 1, 64.5, 0, { legs: 'Black', torso: 'DarkRed', hair: 'DarkBrown', hold: [{ key: 'saxophone', color: 'PearlGold', hand: 'R', pose, rot: r }] }));
  bp.tag = ''; bp.pack();
  return { id: 'cz-bridge', title: 'Prague · Charles Bridge', caption: 'Charles Bridge', subtitle: 'test scene', size: [X1, 60], center: [28, 14, 29], camera: { az: 0.3, el: 0.25, dist: 110 } };
}
