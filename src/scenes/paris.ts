// Paris · the Seine as a floating island (layout v1, docs/countries/france.md §1.12; first assembly 2026-10-04; v2 the same day: Eric —
// "几乎没有任何细节…缺乏法式浪漫": Paris planes, lamps, benches, a picnic, pétanque, the painter, lovers on the bridge, pigeons). 86 × 58.
// The river runs back to front at x 30–45 with the stone bridge across it (z 22–35). Left bank: the Eiffel Tower at the back, the Champ de
// Mars in front of it (lawn panels either side of a sand axis, an allée of planes down each side). Right bank: Notre-Dame's west front at the
// back facing the camera over its parvis, the two-level quay with the bouquinistes along the river, the Haussmann corner with its café at the
// front-right. Levels in plates: island base 3 · water surface 5 · both banks (the street) 18.
import { Blueprint } from '../core/builder';
import { Reserve, Sites, patch, tree, minifig2, type SceneMeta } from './lib';
import { PARTS, footprint } from '../core/catalog';
import { eiffel } from './paris-eiffel';
import { notreDame } from './paris-notredame';
import { haussmann } from './paris-haussmann';
import { seineBridge, quay, bouquiniste, LV } from './paris-seine';
import { bench, flowerBox } from './prague-square';
import { parisLamp, picnic, oldFriends, painter, lovers, pigeons, wallace, bateau } from './paris-life';

export function buildParis(bp: Blueprint): SceneMeta {
  const W = 86, D = 58, BASE = 3, WS = 5, ST = WS + LV.walk;   // water surface, street
  bp.compact = true;
  const R = new Reserve(); const ground = new Sites(2);
  const inIsland = (x: number, z: number) => { if (x < 0 || z < 0 || x >= W || z >= D) return false; const cx = x + 0.5, cz = z + 0.5; return ((cx - W / 2) / (W / 2 - 0.5)) ** 8 + ((cz - D / 2) / (D / 2 - 0.5)) ** 8 < 1; };
  const edgeDist = (x: number, z: number) => { for (let r = 1; r <= 3; r++) for (let dx = -r; dx <= r; dx++) for (let dz = -r; dz <= r; dz++) if (Math.max(Math.abs(dx), Math.abs(dz)) === r && !inIsland(x + dx, z + dz)) return r; return 9; };
  const river = (x: number) => x >= 30 && x <= 45;
  const BOAT = [35, 40];
  // the boat's wake behind its stern, a bow wave, foam below the two cutwaters (Eric r3: no splash, no sense of water) — white round tiles on plate studs
  const FOAM: [number, number][] = [[36, 39], [37, 38], [35, 37], [38, 36], [34, 39], [39, 38], [34, 52], [39, 51], [34, 36], [41, 36]];
  const foamCell = (x: number, z: number) => FOAM.some(([a, b]) => a === x && b === z);
  const EIF = [5, 3];   // the Eiffel Tower's 20 × 20 footprint min corner: sand under it, studs only under the four footings
  const eifSand = (x: number, z: number) => x >= EIF[0] && x < EIF[0] + 20 && z >= EIF[1] && z < EIF[1] + 20;
  const eifFoot = (x: number, z: number) => eifSand(x, z) && (x - EIF[0] < 6 || x - EIF[0] >= 14) && (z - EIF[1] < 6 || z - EIF[1] >= 14);
  const floorOf = (x: number, z: number) => (edgeDist(x, z) <= 3 ? 0 : BASE);
  const earth = (y: number) => (y < 6 ? 'DarkBluishGray' : y < 9 ? 'ReddishBrown' : 'MediumNougat');
  // the Champ de Mars: lawn either side of the sand axis that runs from the tower's foot to the front edge
  const champ = (x: number, z: number) => x <= 23 && z >= 25;
  const axis = (x: number) => x >= 12 && x <= 15;
  const parvis = (x: number, z: number) => x >= 54 && z >= 19 && z <= 25;
  // Eric r2: the bare paving beside and behind Notre-Dame — the gardens that really flank it (square Jean-XXIII behind, the lawns beside)
  const garden = (x: number, z: number) => x >= 47 && ((x <= 55 && z <= 17) || z <= 3 || (x >= 80 && z <= 17));
  const parapetL = (x: number, z: number) => (x === 29 || x === 46) && z < 22;   // north of the bridge; south of it both banks are two-level quays   // Eric r2: both banks have the parapet, not only the quay

  const street: [number, number][] = [], sand: [number, number][] = [];
  // Eric r2: the all-grey right bank read as unfinished. The parvis is pale stone with its dark inlaid lines; the quay street is grey setts
  // laid in runs with darker stones among them; a Tan kerb band runs along the café's terrace and the cathedral's front
  // the paving (Eric r3: the random two-grey mix read as messy): pale grey setts in courses, every fifth course a band of darker stones laid
  // two on, two off and shifted each band — regular, not rigid; the parvis pale stone with its dark inlaid lines; the quay road dark
  const pave = (x: number, z: number) => parvis(x, z) ? ((x + z) % 7 === 0 || (x - z + 70) % 7 === 0 ? 'DarkTan' : 'Tan')
    : (z === 26 || z === 27) && x >= 47 ? 'DarkBluishGray'
    : z % 5 === 0 && (x + 2 * Math.floor(z / 5)) % 4 < 2 ? 'DarkBluishGray' : 'LightBluishGray';
  bp.tag = 'terrain';
  for (let x = 0; x < W; x++) for (let z = 0; z < D; z++) {
    if (!inIsland(x, z)) continue;
    const f = floorOf(x, z);
    if (river(x)) {
      for (let y = f; y < WS - 2; y++) bp.vox1('brick', x, y, z, earth(y));
      bp.vox1('plate', x, WS - 2, z, 'DarkBlue');   // Eric r2: the sand-blue bed under clear tiles read as a dry channel; Prague's recipe (dark blue bed, light-blue water) reads as water
      const boat = x >= BOAT[0] && x < BOAT[0] + 4 && z >= BOAT[1] && z < BOAT[1] + 14;   // the bateau-mouche stands on plate studs
      const ripple = (x === 32 || x === 34 || x === 37 || x === 40 || x === 43) && (z + 3 * x) % 9 < 3;   // judge r1: trans streaks along the flow so the river reads as water
      bp.vox1(boat || foamCell(x, z) ? 'plate' : 'tile', x, WS - 1, z, ripple ? 'TransClear' : 'TransLightBlue');
      continue;
    }
    const face = x === 29 || (x === 46 && z < 22);   // the banks' plain walls where neither the bridge nor the quay stands
    const rim = edgeDist(x, z) <= 1;
    for (let y = f; y < ST - 1; y++) bp.vox1('brick', x, y, z, face && y >= WS - 1 ? (y <= WS ? 'DarkBluishGray' : 'Tan') : rim && y >= WS - 1 ? 'Tan' : earth(y));
    if (champ(x, z) && !axis(x)) bp.vox1('plate', x, ST - 1, z, patch(x, z, 5, 7) < 0.25 ? 'Green' : 'BrightGreen');
    else if (champ(x, z) && axis(x)) sand.push([x, z]);
    else if (eifSand(x, z)) bp.vox1(eifFoot(x, z) ? 'plate' : 'tile', x, ST - 1, z, x === EIF[0] || x === EIF[0] + 19 || z === EIF[1] || z === EIF[1] + 19 ? 'DarkTan' : 'Tan');   // Eric r3: a stone kerb round the tower's sand
    else if (garden(x, z)) bp.vox1('plate', x, ST - 1, z, patch(x, z, 4, 11) < 0.3 ? 'Green' : 'BrightGreen');
    else if (parapetL(x, z)) { bp.vox1('plate', x, ST - 1, z, 'Tan'); for (let y = ST; y < ST + 3; y++) bp.vox1('brick', x, y, z, 'Tan'); bp.vox1('tile', x, ST + 3, z, 'Tan'); }
    else street.push([x, z]);   // laid last: studs only under what stands on it
  }
  // the plinth: two bricks of stone one cell outside the island, capped with tiles (series DNA)
  for (let x = -1; x <= W; x++) for (let z = -1; z <= D; z++) {
    if (inIsland(x, z)) continue; if (![[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dz]) => inIsland(x + dx, z + dz))) continue;
    for (let y = 0; y < 6; y++) bp.vox1('brick', x, y, z, 'DarkBluishGray'); bp.vox1('tile', x, 6, z, 'DarkBluishGray');
  }

  // ---- the Seine: the bridge across, the quay and the bouquinistes on the right bank
  seineBridge(bp, 24, WS, 22, 0);
  quay(bp, 46, WS, 33, 23, 0);
  quay(bp, 25, WS, 36, 19, 2);   // the left bank's own quay (Eric r3: the river sat in a deep trench; a low bank at the water on both sides brings it up)
  bp.tag = 'water'; for (const [fx, fz] of FOAM) bp.part('roundtile_1x1', fx, WS, fz, 'White'); bp.tag = '';
  [38, 43, 48].forEach((z, i) => bouquiniste(bp, 50, WS + LV.parapetTop - 1, z, 0, i));

  // ---- landmarks
  ground.add('eiffel', 15, 13, 10, 'block'); eiffel(bp, 5, ST, 3);
  ground.add('notredame', 68, 10, 11, 'block'); notreDame(bp, 58, ST, 12, 0);
  ground.add('haussmann', 73, 39, 7, 'block'); haussmann(bp, 67, ST, 34, 0);

  // ---- trees: Paris planes (lib.ts 'platane': mottled pale bark, fresh yellow-green crowns). An allée down each side of the Champ de Mars,
  // the hero plane on the right-bank quay over the bouquinistes
  bp.tag = '';
  for (const [tx, tz, turn] of [[5, 35, 0], [5, 43, 1], [5, 51, 2], [19, 35, 3], [19, 43, 0], [19, 51, 1]] as [number, number, number][]) { ground.add(`plane-${tx}-${tz}`, tx, tz, 4, 'allee'); tree(bp, tx, ST, tz, 'S', R, turn, undefined, 'platane'); }   // the Champ de Mars has its rows of trees along the sides; kept low (S) so they no longer hide the tower's legs and arches
  ground.add('plane-q', 57, 48, 6); tree(bp, 57, ST, 48, 'L', R, 2, undefined, 'platane');

  // the tower's plaza: two pigeons
  pigeons(bp, ST, [[13, 27, 1], [17, 30, 2]]);   // Eric r4: apart, one on the sand, one on the lawn; the box hedges went ("丑")
  // ---- the Champ de Mars: a picnic on the lawn, pétanque on the sand axis
  picnic(bp, 16, ST, 45);
  ground.add('friends', 12, 39, 2); oldFriends(bp, 10, ST, 35);

  // ---- the right bank: lamps, benches facing the cathedral, pigeons on the parvis, the painter, geraniums by the café
  // the lamps, laid out in pairs (Eric r3: "重新梳理一下所有台灯的排布"): the bridge carries its own four lanterns (one on every pier tower, both
  // sides), so its heads stay clear; the parvis pair mirrored about the cathedral's axis; one on each quay and one at each bank's north end,
  // mirrored across the river; one by the café
  for (const [lx, lz] of [[54, 21], [82, 21], [22, 47], [53, 47], [27, 15], [48, 15], [64, 48]]) parisLamp(bp, lx, ST, lz);
  wallace(bp, 61, ST, 21);
  // the garden beside Notre-Dame: a plane, flower beds, a bench
  ground.add('plane-g', 51, 9, 4); tree(bp, 51, ST, 9, 'M', R, 1, undefined, 'platane');
  bp.tag = 'flowers'; for (const [fx, fz, c] of [[48, 14, 'BrightRed'], [49, 15, 'BrightPink'], [53, 14, 'Yellow'], [54, 15, 'BrightRed'], [48, 3, 'BrightPink'], [81, 5, 'BrightRed'], [83, 9, 'Yellow'], [82, 13, 'BrightPink'], [84, 15, 'BrightRed']] as [number, number, string][]) bp.part('flower_1x1', fx, ST, fz, c); bp.tag = '';
  bench(bp, 48, ST, 6, 1);
  // the left bank: its own bouquinistes on the parapet, a lamp between them
  [[24, 39], [24, 45]].forEach(([bx, bz], i) => bouquiniste(bp, bx, WS + LV.parapetTop - 1, bz, 2, i + 1));
  bateau(bp, BOAT[0], WS, BOAT[1]);
  bench(bp, 59, ST, 24, 2); bench(bp, 74, ST, 24, 2);
  pigeons(bp, ST, [[65, 22, 0], [68, 23, 1], [70, 21, 3]]);
  ground.add('painter', 58, 31, 2); painter(bp, 57, ST, 28);
  flowerBox(bp, 70, ST, 48, 0, ['BrightRed', 'BrightRed']); flowerBox(bp, 76, ST, 48, 0, ['BrightRed', 'BrightPink']);

  // ---- life layer: the lovers on the bridge, the bookseller at her boxes, the waiter on the terrace (+ the painter, the pétanque pair)
  bp.tag = 'terrain'; for (const z of [26, 27, 31, 32]) bp.vox1('plate', 38, WS + LV.walk - 1, z, 'LightBluishGray');   // the setts under the lovers' feet keep their studs
  lovers(bp, 38, WS + LV.walk, 29);
  bp.tag = 'bookseller';   // Eric r3: the hand went through the book, and one coffee-drinker is enough — the bookseller sweeps the pavement by his boxes before opening
  ground.add('bookseller', 55, 39, 1); minifig2(bp, 55, ST, 39, 0, { legs: 'DarkBluishGray', torso: 'DarkRed', face: 'face_glasses', hair: 'LightBluishGray', hairKey: 'hair_short', hold: [{ key: 'pushbroom', color: 'ReddishBrown', hand: 'R' }] });
  bp.tag = 'waiter';   // on the café terrace, a bottle of wine in one hand, a napkin arm in front
  ground.add('waiter', 67, 50, 1); minifig2(bp, 67, ST, 50, 0, { legs: 'Black', torso: 'White', torsoPrint: 'torso_waiter', face: 'face_smile', hair: 'Black', hairKey: 'hair_short', hold: [{ key: 'bottle', color: 'TransBlack', hand: 'R', gp: [0, 0.7, 0] }] });

  // ---- the street: smooth setts everywhere, studs exactly under what stands on it (Prague's rule)
  const studCells = new Set<string>();
  for (const p of bp.parts) { if (p.member || p.y !== ST) continue; const d = PARTS[p.key]; if (!d) continue; const [fw, fd] = footprint(d, p.rot); for (let x = Math.floor(p.x); x < Math.ceil(p.x + fw); x++) for (let z = Math.floor(p.z); z < Math.ceil(p.z + fd); z++) studCells.add(x + ',' + z); }
  bp.tag = 'terrain';
  for (const [x, z] of street) if (bp.hasVox(x, ST - 2, z)) bp.vox1(studCells.has(x + ',' + z) || bp.hasVox(x, ST, z) ? 'plate' : 'tile', x, ST - 1, z, pave(x, z));
  for (const [x, z] of sand) bp.vox1(studCells.has(x + ',' + z) ? 'plate' : 'tile', x, ST - 1, z, 'Tan');
  bp.tag = ''; bp.pack();
  return { id: 'paris', title: 'Paris', caption: 'The Seine', subtitle: 'Eiffel Tower · Notre-Dame · the quays · a Haussmann corner', size: [W, D], center: [W / 2, 24, D / 2], base: BASE, camera: { az: -0.45, el: 0.38, dist: 135 }, viewDist: 135 };
}
