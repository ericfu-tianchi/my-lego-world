// Germany test scene (2026-10-05): Neuschwanstein alone on a grey plate before it goes onto the crag. ?scene=de-ns
import { Blueprint } from '../core/builder';
import type { SceneMeta } from './lib';
import { neuschwanstein } from './de-castle';

export function buildDeNs(bp: Blueprint): SceneMeta {
  const W = 72, D = 32; bp.tag = 'ground'; for (let x = 0; x < W; x += 8) for (let z = 0; z < D; z += 8) bp.part('plate_8x8', x, 0, z, 'LightBluishGray');
  neuschwanstein(bp, 4, 1, 5);
  bp.tag = ''; bp.pack();
  return { id: 'de-ns', title: 'Neuschwanstein', caption: 'Neuschwanstein', subtitle: 'test scene', size: [W, D], center: [W / 2, 30, D / 2], camera: { az: 0.35, el: 0.2, dist: 150 } };
}
/** colour samples (2026-10-06): the castle with three roof palettes, rendered side by side for the colour decision */
import { NS_COL } from './de-castle';
const VARIANTS: Record<string, Partial<typeof NS_COL>> = { a: { roof: 'DarkBlue', spire: 'DarkBlue', lower: 'SandGreen' }, b: { roof: 'SandBlue', spire: 'SandBlue', lower: 'SandGreen' }, c: { roof: 'DarkBluishGray', spire: 'SandBlue', lower: 'SandGreen' } };
export const buildDeCol = (v: string) => (bp: Blueprint): SceneMeta => { const keep = { ...NS_COL }; Object.assign(NS_COL, VARIANTS[v]); try { return { ...buildDeNs(bp), id: `de-col-${v}` }; } finally { Object.assign(NS_COL, keep); } };
