// Prague · the Old Town bank of the Vltava as a floating island (layout v1, approved 2026-10-02; docs/countries/czechia.md §1.12, §1.18).
// 84 × 56. The river runs back to front at x 12–39 with Charles Bridge across it (z 25–32) and the Old Town Bridge Tower on the quay; Kampa
// is the low lawn on the far bank (x 0–11); the Old Town is a stone quay four bricks above the water carrying the square, the Týn School row
// with Týn behind it, the Old Town Hall wing and the clock tower in front of it. Levels in plates: island base 3 · water surface 5 · Kampa 9 ·
// square 15.
import { Blueprint } from '../core/builder';
import { Reserve, Sites, patch, tree, minifig2, type SceneMeta } from './lib';
import { PARTS, footprint } from '../core/catalog';
import { tyn } from './prague-tyn';
import { orloj } from './prague-orloj';
import { houseRow, hallWing } from './prague-houses';
import { charlesBridge, bridgeDry, bridgeClearTerrain, busker, riverLife, riverPlate } from './prague-bridge';
import { swan } from './prague-swan';
import { husMemorial, cafeTerrace, bench, flowerBox, squareLamp, backGarden, squareCat } from './prague-square';
import '../core/catalog-cz-orloj';
import '../core/catalog-cz-bridge';
import '../core/catalog-cz-houses';

export function buildPrague(bp: Blueprint): SceneMeta {
  const W = 84, D = 50, BASE = 3, WS = 5, L = WS + 10, K = L - 6;   // water surface, square, Kampa
  bp.compact = true;
  const R = new Reserve(); const ground = new Sites(2);
  const inIsland = (x: number, z: number) => { if (x < 0 || z < 0 || x >= W || z >= D) return false; const cx = x + 0.5, cz = z + 0.5; return ((cx - W / 2) / (W / 2 - 0.5)) ** 4 + ((cz - D / 2) / (D / 2 - 0.5)) ** 4 < 1; };
  const edgeDist = (x: number, z: number) => { for (let r = 1; r <= 3; r++) for (let dx = -r; dx <= r; dx++) for (let dz = -r; dz <= r; dz++) if (Math.max(Math.abs(dx), Math.abs(dz)) === r && !inIsland(x + dx, z + dz)) return r; return 9; };
  const river = (x: number) => x >= 12 && x <= 39, kampa = (x: number) => x <= 11;
  const floorOf = (x: number, z: number) => (edgeDist(x, z) <= 3 ? 0 : BASE);
  const earth = (y: number) => (y < 6 ? 'DarkBluishGray' : y < 9 ? 'ReddishBrown' : 'MediumNougat');
  // cells of the square that carry a building keep their studs (plates, not tiles)
  // the square's surface is laid last: a cell keeps its studs (plate) only where a part stands on the square, every other cell is tiled
  const square: [number, number][] = [];

  const SWAN = new Set<string>(); for (const [bx, bz] of [[15, 39], [17, 41], [22, 44]]) for (const [dx, dz] of [[0, 0], [0, -1], [-1, 0], [-1, -1]]) SWAN.add((bx + dx) + ',' + (bz + dz));   // only round the birds' own cells do studs show
  // three of the 27 white crosses set in the paving by the Old Town Hall (the nobles executed in 1621), each five white 1×1 tiles
  const CROSS = new Set<string>(); for (const [cx, cz] of [[70, 33], [70, 37], [66, 33]]) for (const [dx, dz] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]]) CROSS.add((cx + dx) + ',' + (cz + dz));
  bp.tag = 'terrain';
  for (let x = 0; x < W; x++) for (let z = 0; z < D; z++) {
    if (!inIsland(x, z)) continue;
    const f = floorOf(x, z);
    if (river(x)) {
      for (let y = f; y < WS - 2; y++) bp.vox1('brick', x, y, z, earth(y));
      bp.vox1('plate', x, WS - 2, z, 'DarkBlue');   // one bed colour: patches under the trans tiles read as a chequer (judge r2)
      // the current: trans-clear streaks laid along the flow (z) between trans-light-blue runs; white foam just downstream of each cutwater
      const foam = (z === 37 && (x === 20 || x === 31)) || (z === 38 && (x === 21 || x === 30));
      if (!bridgeDry(x, z)) bp.vox1(SWAN.has(x + ',' + z) || foam || riverPlate(x, z) ? 'plate' : 'tile', x, WS - 1, z, patch(x, Math.floor((z + 3 * x) / 9), 1, 13) < 0.14 ? 'TransClear' : 'TransLightBlue');
      continue;
    }
    const top = kampa(x) ? K : L;
    const quay = !kampa(x) && (x === 40 || edgeDist(x, z) <= 1);   // the Old Town stands on an embankment: its faces are sandstone, to the river and to the island's edge
    for (let y = f; y < top - 1; y++) bp.vox1('brick', x, y, z, quay && y >= WS - 2 ? (y >= L - 4 ? 'LightBluishGray' : 'DarkBluishGray') : earth(y));   // the embankment: dark granite in whole brick courses under a light coping course (judge r2: no camouflage)
    if (kampa(x)) bp.vox1('plate', x, top - 1, z, patch(x, z, 5, 7) < 0.22 ? 'Green' : 'BrightGreen');
    else if (CROSS.has(x + ',' + z)) bp.vox1('tile', x, top - 1, z, 'White');
    else square.push([x, z]);   // the square's diagonal bands (prague.eu: light setts in a large diagonal grid of darker ones)
  }
  // the plinth: two bricks of stone one cell outside the island, capped with tiles (series DNA)
  for (let x = -1; x <= W; x++) for (let z = -1; z <= D; z++) {
    if (inIsland(x, z)) continue; if (![[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dz]) => inIsland(x + dx, z + dz))) continue;
    for (let y = 0; y < 6; y++) bp.vox1('brick', x, y, z, 'DarkBluishGray'); bp.vox1('tile', x, 6, z, 'DarkBluishGray');
  }
  // the bridge's own stone replaces the banks where it stands (arch legs, abutment, the tower base, the Kampa steps)
  bridgeClearTerrain(bp, WS);

  // foam: two white round tiles below each pier's downstream point
  bp.tag = 'water'; for (const fx of [20, 31]) { bp.part('roundtile_1x1', fx, WS, 37, 'White'); bp.part('roundtile_1x1', fx + (fx === 20 ? 1 : -1), WS, 38, 'White'); }

  // ---- landmarks
  ground.add('tyn', 64.5, 8, 6, 'block'); tyn(bp, 57, L, 2, 0);
  ground.add('houses', 62, 18, 4, 'block'); houseRow(bp, 50, L, 14, 0); hallWing(bp, 50, L, 14, 0);
  ground.add('orloj', 78, 27, 4, 'block'); orloj(bp, 74, L, 23, 0);   // one stud clear of the wing's cornice
  charlesBridge(bp, 0, 0, WS, 'robe');

  // ---- the square's own furniture: the Jan Hus Memorial at the open centre, a café terrace under cream umbrellas along the house fronts
  ground.add('hus', 62.5, 38, 5, 'hus'); husMemorial(bp, 58, L, 35, 0);
  cafeTerrace(bp, 52, L, 29, 0, 2);   // the café's frame is z −4..2: its umbrellas must clear the arcades' string courses
  bench(bp, 52, L, 46, 2); bench(bp, 66, L, 46, 2);                 // facing the memorial, brought forward so the front of the square is not empty (Eric 10-03)
  flowerBox(bp, 69, L, 23, 0); flowerBox(bp, 70, L, 46, 0);
  squareLamp(bp, 50, L, 34, 0); squareLamp(bp, 73, L, 34, 1);       // Prague's dark green three-lantern lamps   // three studs out from the arcades so the umbrellas clear the string courses

  // ---- trees: the hero linden on Kampa, a smaller one on the quay behind the Bridge Tower (front-right would hide the Orloj)
  ground.add('linden-kampa', 6, 12, 5); tree(bp, 6, K, 12, 'L', R, 1, undefined, 'linden');
  // behind the block (Eric 10-03: too empty): four lindens, a low wall with the Týnská street plate and a black cat, an unattended trdelník stand
  backGarden(bp, L);
  // a black cat in plain view, side-on to the hero camera so its whole body reads, sniffing the flower box (Eric 10-03)
  bp.tag = 'cat'; bp.part('cat', 68, L, 46, 'Black', 1); bp.tag = '';

  // ---- life layer: three figures, each doing one legible thing, far apart (rule 6)
  // a jazz saxophonist on the walk between the statue pairs, his open case at his feet (prague-bridge.ts); upstream of the bridge a moored
  // rowing boat, three ducks and a little foam (Eric 10-03)
  busker(bp, WS); riverLife(bp, WS);
  bp.tag = 'tourist';   // the visitor under the clock, waiting for the hour, camera up
  // Eric 2026-10-02: five figures for Prague (the square is the exception) — the extra two join the hour crowd under the Orloj
  ground.add('tourist', 77.5, 40.5, 1, 'crowd'); minifig2(bp, 77.5, L, 40.5, 2, { legs: 'DarkBlue', torso: 'SandGreen', torsoPrint: 'torso_tourist', face: 'face_grin', hair: 'Black', hairKey: 'hair_long', hold: [{ key: 'camera', color: 'Black', hand: 'R' }] });
  ground.add('pointer', 74.5, 39.5, 1, 'crowd'); minifig2(bp, 74.5, L, 39.5, 2, { legs: 'Tan', torso: 'DarkBlue', face: 'face_glasses', hair: 'ReddishBrown', hairKey: 'hair_short', poses: { R: 'u' } });   // pointing up at the apostles beside the photographer (Eric 10-03: both watch the clock)
  ground.add('guide', 55.5, 39, 1, 'hus'); minifig2(bp, 55.5, L, 39, 1, { legs: 'DarkBluishGray', torso: 'DarkRed', face: 'face_smile', hair: 'Black', hairKey: 'hair_long', headTurn: 3, hold: [{ key: 'cup', color: 'White', hand: 'L' }] });   // coffee in hand by the Hus Memorial (Eric 10-03: two at the clock are enough)
  bp.tag = 'painter';   // the painter on Kampa, looking at the bridge, canvas on a pole
  ground.add('painter', 7, 41.5, 2); minifig2(bp, 7, K, 41.5, 2, { legs: 'Tan', torso: 'White', torsoPrint: 'torso_painter', face: 'face_calm', hair: 'DarkBrown', hairKey: 'hair_tousled', hold: [{ key: 'paintbrush', color: 'ReddishBrown', hand: 'R' }, { key: 'palette', color: 'Tan', hand: 'L' }] });
  // the easel: a pole in an open-stud plate, a round plate pushed onto its top, the canvas (a printed 1×2×2 brick) on that stud, facing the painter
  bp.part('roundplate_open', 6, K, 38, 'ReddishBrown'); bp.part('bar_3l', 6, K + 1, 38, 'ReddishBrown'); bp.part('roundplate_1x1', 6, K + 6, 38, 'ReddishBrown');
  bp.part('brick_1x2x2', 6, K + 7, 38, 'White', 0, 'canvas_tyn'); bp.part('tile_1x2', 6, K + 13, 38, 'White', 1);   // the painter faces the bridge, the easel between (Eric 10-03)
  // swans off Kampa: no swan mould exists at minifig scale and four brick builds read as lamps or horns (2026-10-03), so three white
  // water-bird moulds on the water's studs stand in for the Kampa swans — honest scale, one part each
  bp.tag = 'swans'; swan(bp, 15, WS, 39, 1); swan(bp, 17, WS, 41, 1); swan(bp, 22, WS, 44, 3);

  // ---- the square's surface: studs exactly under what stands on it, smooth tiles everywhere else (judge r1: bare studs round the furniture)
  const studCells = new Set<string>();
  for (const p of bp.parts) { if (p.member || p.y !== L) continue; const d = PARTS[p.key]; if (!d) continue; const [fw, fd] = footprint(d, p.rot); for (let x = Math.floor(p.x); x < Math.ceil(p.x + fw); x++) for (let z = Math.floor(p.z); z < Math.ceil(p.z + fd); z++) studCells.add(x + ',' + z); }
  bp.tag = 'terrain';
  for (const [x, z] of square) if (bp.hasVox(x, L - 2, z)) bp.vox1(studCells.has(x + ',' + z) || bp.hasVox(x, L, z) ? 'plate' : 'tile', x, L - 1, z, (x + z) % 11 === 0 || (x - z + 110) % 11 === 0 ? 'DarkBluishGray' : 'LightBluishGray');   // the square's diagonal bands (prague.eu: light setts in a large diagonal grid of darker ones)
  bp.tag = ''; bp.pack();
  return { id: 'prague', title: 'Prague', caption: 'Old Town', subtitle: 'Charles Bridge · Týn · Astronomical Clock · Old Town Square', size: [W, D], center: [W / 2, 21, D / 2], base: BASE, camera: { az: 0.3, el: 0.36, dist: 165 }, viewDist: 165 };   // centre raised: Týn's spires reach 44 above the table
}
