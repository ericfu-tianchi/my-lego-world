// Los Angeles element test scene: Griffith Observatory on its spur terrace (G + 8) with the front lawn and the Astronomers Monument, and
// the Walk of Fame strip at ground level (docs/countries/usa.md §1.12, docs/refs/la-hollywood-sign/SCHEME.md §3–4).
// ?scene=la-griffith&noglobe · ?only=griffith · ?only=walkoffame
import { Blueprint } from '../core/builder';
import type { SceneMeta } from './lib';

export function buildLaGriffith(bp: Blueprint): SceneMeta {
  const W = 40, D = 48; bp.tag = 'ground'; for (let x = 0; x < W; x += 8) for (let z = 0; z < D; z += 8) bp.part('plate_8x8', x, 0, z, 'LightBluishGray');
  // the spur terrace: 8 plates of earth over a 30 × 30 footprint (x 5..34, z 1..30), top at G + 8 = plate 9
  const TX = 5, TZ = 1, TW = 30, TD = 30, G = 1, TOP = G + 8;
  bp.tag = 'griffith';
  bp.fill('brick', TX, G, TZ, TW, 6, TD, 'DarkTan'); bp.fill('plate', TX, G + 6, TZ, TW, 2, TD, 'DarkTan');
  // observatory footprint 28 × 28 inside the terrace (gx 0..27, gz −1..26 → x 6..33, z 2..29): building 28 × 20 incl. the back promenade and the forecourt row
  // (gz 18) in the assembly, lawn panels north (19–21) and south (24–26) of an E–W path (22–23), the N–S path on the axis (gx 13–14), edge paths;
  // the monument on a square paved island over the crossing (gx 12–15, gz 21–24)
  const X0 = TX + 1, Z0 = TZ + 2;
  bp.assembly('griffith', X0, TOP, Z0 - 1, 'White');               // the proxy starts a row behind gz 0 (the drum's back pilasters, the promenade)
  const island = (i: number, j: number) => i >= 12 && i <= 15 && j >= 21 && j <= 24;
  for (let i = 0; i < 28; i++) for (let j = 19; j < 27; j++) {
    if (island(i, j)) continue;
    const path = j === 22 || j === 23 || i === 13 || i === 14 || i === 0 || i === 27;
    bp.vox1(path ? 'tile' : 'plate', X0 + i, TOP, Z0 + j, path ? 'LightBluishGray' : 'Green');
  }
  // the terrace's rim outside the footprint: a stud of paving all round
  for (let x = TX; x < TX + TW; x++) for (let z = TZ; z < TZ + TD; z++) if (x === TX || z === TZ || x === TX + TW - 1 || z === TZ + TD - 1) bp.vox1('tile', x, TOP, z, 'LightBluishGray');
  bp.assembly('griffith_monument', X0 + 12, TOP, Z0 + 21, 'White');
  // Walk of Fame: a 20 × 4 strip of sidewalk at ground level, a charcoal band with four star tiles every five studs, a dark kerb (x 10..29, z 39..42)
  bp.tag = 'walkoffame'; const SX = 10, SZ = 39;
  for (const k of [0, 1, 2, 3]) bp.part('tile_2x2', SX + 1 + 5 * k, G, SZ + 1, 'Black', 0, 'walk_star');
  for (let i = 0; i < 20; i++) for (let j = 0; j < 4; j++) { const star = j >= 1 && j <= 2 && (i - 1) % 5 <= 1 && i >= 1 && i <= 17; if (!star) bp.vox1('tile', SX + i, G, SZ + j, j === 3 ? 'DarkBluishGray' : j === 0 ? 'LightBluishGray' : 'Black'); }   // the stars sit in one continuous charcoal band (v1's lone squares read as stickers)
  bp.tag = ''; bp.pack();
  return { id: 'la-griffith', title: 'Griffith Observatory', caption: 'Griffith Observatory', subtitle: 'test scene', size: [W, D], center: [W / 2, 14, D / 2 - 6], camera: { az: 0.35, el: 0.3, dist: 80 } };
}
