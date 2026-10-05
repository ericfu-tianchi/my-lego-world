// Paris test scene (2026-10-03): the Seine bridge, the two-level quay and three bouquinistes on a slab of bank, before they go onto the island.
// River x 10–25 (16 wide) running along z; the bridge's box at x 4, z 2 (vault rows z 6–11); the quay on the right bank x 26–30 from z 13.
// ?scene=fr-seine (&only=bridge | quay | bouquiniste)
import { Blueprint } from '../core/builder';
import { patch, type SceneMeta } from './lib';
import { seineBridge, quay, bouquiniste } from './paris-seine';

export function buildFrSeine(bp: Blueprint): SceneMeta {
  const W = 44, D = 44, WS = 5, ST = WS + 13;   // water surface, street
  bp.compact = true;
  const river = (x: number) => x >= 10 && x <= 25;
  bp.tag = 'terrain';
  for (let x = 0; x < W; x++) for (let z = 0; z < D; z++) {
    if (river(x)) {
      for (let y = 0; y < WS - 2; y++) bp.vox1('brick', x, y, z, 'DarkBluishGray');
      bp.vox1('plate', x, WS - 2, z, x <= 11 || x >= 24 ? 'DarkBluishGray' : 'SandBlue');   // grey Seine: two bed tones under clear tiles (the Kyoto way), darker along the walls
      bp.vox1('tile', x, WS - 1, z, 'TransClear');
      continue;
    }
    const face = x === 9 || x === 26;   // the plain bank walls
    for (let y = 0; y < ST - 1; y++) bp.vox1('brick', x, y, z, face && y >= WS - 1 ? (y <= WS ? 'DarkBluishGray' : 'Tan') : 'DarkBluishGray');
    bp.vox1('tile', x, ST - 1, z, 'LightBluishGray');
  }
  seineBridge(bp, 4, WS, 2, 0);
  quay(bp, 26, WS, 13, 31, 0);
  [28, 33, 38].forEach((z, i) => bouquiniste(bp, 30, WS + 16, z, 0, i));
  bp.tag = ''; bp.pack();
  return { id: 'fr-seine', title: 'Paris · Seine', caption: 'Bridge, quay and bouquinistes', subtitle: 'test scene', size: [W, D], center: [W / 2, 10, D / 2], camera: { az: 0.5, el: 0.35, dist: 80 } };
}
