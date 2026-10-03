// Prague · Old Town Square furniture (2026-10-02): the Jan Hus Memorial and a café terrace. Eric: "广场确实太空了…纪念碑你可以简单拼一下".
// References: docs/refs/prague-real/hus-memorial-front.jpg, old-town-square-hus-from-tower.jpg (NOTES.md §Hus).
import { Blueprint } from '../core/builder';
import { placer } from './singapore';
import { minifig2, tree, bush } from './lib';
import '../core/catalog-cz-bridge';
import '../core/catalog-cz-square';

// the bronze is near-black with green patina in the folds (photos): Black figures, Dark Green for the patina; the base dark granite
const BRONZE = 'DarkGreen', PATINA = 'DarkGreen', SHADOW = 'Black', GRANITE = 'DarkBluishGray', PAVE = 'LightBluishGray';

/** Jan Hus Memorial (Šaloun, 1915), round 2 after the judge (docs/judge/prague-r1/REVIEW.md ⑫: "三个光头人仔坐在斜坡上"). Local frame: the
 *  granite base x 0..9 × z 0..5, two low steps (the lower ring one brick, the upper x 1..8 × z 1..4 one brick and a cap), the paved step
 *  and flower beds round it (x −1..10, z −1..6); the face toward +z. On the cap the bronze — near-black with green patina — is one
 *  flowing mass, not a row of figures: Hus stands alone and tall at the −x end on a mound (a 65° robe, a torso,
 *  a bare head: the only figure that rises clear); from his feet the drapery of the crowd rolls toward +x, rising to a bowed cloaked
 *  figure and the leaning tablet, then falling over the edges of the base in curved slopes. One head in the whole memorial: his. */
export function husMemorial(bp: Blueprint, ox: number, y: number, oz: number, rot: number) {
  bp.tag = 'hus'; const { part, vox } = placer(bp, ox, oz, rot);
  const lower = (x: number, z: number) => x >= 0 && x <= 9 && z >= 0 && z <= 5 && !((x === 0 || x === 9) && (z === 0 || z === 5));
  const upper = (x: number, z: number) => x >= 1 && x <= 8 && z >= 1 && z <= 4;
  // the paved step round the base, the flower beds in its two ends (old-town-square-hus-from-tower.jpg)
  for (let x = -1; x <= 10; x++) for (let z = -1; z <= 6; z++) {
    if (lower(x, z)) continue; const bed = (x <= 0 || x >= 9) && z >= 1 && z <= 4;
    vox(bed ? 'plate' : 'tile', x, y, z, bed ? 'Green' : PAVE);
  }
  for (const [fx, fz, c] of [[-1, 1, 'BrightPink'], [-1, 2, 'Yellow'], [-1, 4, 'Lavender'], [10, 1, 'Lavender'], [10, 3, 'BrightPink'], [10, 4, 'Yellow']] as [number, number, string][]) part('flower_1x1', fx, y + 1, fz, c);
  // the granite: two steps, the tread of the lower step tiled, the upper capped with plates where bronze stands
  for (let x = 0; x <= 9; x++) for (let z = 0; z <= 5; z++) {
    if (!lower(x, z)) continue;
    for (let d = 0; d < 3; d++) vox('brick', x, y + d, z, GRANITE);
    if (!upper(x, z)) { vox('tile', x, y + 3, z, GRANITE); continue; }
    for (let d = 3; d < 6; d++) vox('brick', x, y + d, z, GRANITE); vox('plate', x, y + 6, z, GRANITE);
  }
  const T = y + 7;
  // the bronze, round 3 after judge r2 (⑫⑬: "兜帽人 + 两颗插在方块和圆锥上的黑头，读成棋子"): all sheet-green patina (Dark Green), Black only in
  // the deepest folds; no heads but Hus's; the crowd is drapery — curved slopes, 45° slopes, a 65° robe — over a low core
  // Hus: bareheaded, slim, standing on a mound at the −x end, clearly above the rest: a 65° robe, a torso with arms hanging, a plain head
  part('brick_2x2', 1, T, 2, BRONZE); part('robe_65_2x2', 1, T + 3, 2, BRONZE, 0);
  { const tmp = new Blueprint(1); tmp.tag = bp.tag; const c = placer(bp, ox, oz, rot).cell(1, 2), c2 = placer(bp, ox, oz, rot).cell(2, 3);
    minifig2(tmp, Math.min(c[0], c2[0]) + 1, T + 3, Math.min(c[1], c2[1]) + 0.5, rot & 3, { legs: BRONZE, torso: BRONZE, skin: BRONZE, poses: { L: 'd', R: 'd' } });
    for (const p of tmp.parts) if (p.key !== 'fig_legs') bp.parts.push(p); }
  // the sea of the crowd at his feet: curved slopes spilling over the front and back edges of the upper step, one dark fold each side
  for (let x = 1; x <= 8; x++) { part('curve_1x2', x, T, 0, x === 5 ? SHADOW : BRONZE, 2); part('curve_1x2', x, T, 4, x === 4 ? SHADOW : BRONZE, 0); }
  // the core of the group: one low plate course, then drapery rolling up from Hus toward the tablet and falling away at the +x end
  part('plate_2x6', 3, T, 2, BRONZE, 1);
  part('slope_2x2', 3, T + 1, 2, BRONZE, 3);                          // the wave sloping down toward Hus
  part('robe_65_2x2', 5, T + 1, 2, BRONZE, 0);                        // a cloaked figure bowed into the mass: a hump of drapery, no head
  part('curve_2x2', 5, T + 7, 2, BRONZE, 3);                          // its shoulder rolling toward Hus
  // the great tablet leaning toward Hus: two 75° slopes side by side, a broad slab set at an angle (hus-memorial-front.jpg)
  part('slope75_2x1x3', 7, T + 1, 2, BRONZE, 3); part('slope75_2x1x3', 7, T + 1, 3, BRONZE, 3); part('tile_1x2', 8, T + 10, 2, BRONZE);   // its top edge smooth
  part('tile_1x2', 4, T + 4, 2, BRONZE);   // no stud on the wave's crest
  bp.tag = '';
}

/** A café terrace under cream umbrellas: `n` round tables (two 1×1 round bricks under a 2×2 round plate) laid with a cup and a plate (1×1
 *  round tile) each side, two chairs facing the table, an umbrella on a pole behind. Local frame x 0..8n−1 × z −4..2 (umbrella canopies reach z −4..1, poles on z −1), the street side +z. */
export function cafeTerrace(bp: Blueprint, ox: number, y: number, oz: number, rot: number, n = 2) {
  bp.tag = 'cafe'; const { part } = placer(bp, ox, oz, rot);
  for (let k = 0; k < n; k++) {
    const x = 8 * k + 3;   // the table's pole cell; chairs either side, the umbrella pole behind
    part('round_1x1', x, y, 1, 'Black'); part('round_1x1', x, y + 3, 1, 'Black'); part('roundplate_2x2', x - 0.5, y + 6, 0.5, 'DarkBrown');   // a dark top under the white cups: visible from above against the paving
    part('cup', x + 0.5, y + 7, 1.5, 'White'); part('roundtile_1x1', x - 0.5, y + 7, 1.5, 'White');   // a cup at one place, a plate at the other
    part('seat_2x2', x - 3, y, 0, 'DarkBrown', 1); part('seat_2x2', x + 2, y, 0, 'DarkBrown', 3);
    // the umbrella stands behind the table (−z, toward the house front) so its canopy shades the back half and the laid table shows from the square
    part('roundplate_open', x, y, -1, 'Black'); part('bar_4l', x, y + 1, -1, 'Tan'); part('round_1x1', x, y + 7, -1, 'Tan'); part('bar_4l', x, y + 9, -1, 'Tan');
    part('umbrella', x - 2.5, y + 16, -3.5, 'Tan');   // Tan = LEGO Brick Yellow: the cream of the Old Town Square umbrellas
  }
  bp.tag = '';
}

/** A park bench in dark green: two black 1×2 bricks as legs, a 2×4 seat plate, a 1×4 fence as the back on the −z row. Local x 0..3 × z 0..1, facing +z. */
export function bench(bp: Blueprint, ox: number, y: number, oz: number, rot: number) {
  bp.tag = 'bench'; const { part } = placer(bp, ox, oz, rot);
  part('brick_1x2', 0, y, 0, 'Black'); part('brick_1x2', 3, y, 0, 'Black'); part('plate_2x4', 0, y + 3, 0, 'DarkGreen', 1); part('fence_1x4', 0, y + 4, 0, 'DarkGreen');
  bp.tag = '';
}

/** A flower box: a 1×4 brick in Dark Brown planted with alternating flowers and three-leaf plates. Local x 0..3 × z 0. */
export function flowerBox(bp: Blueprint, ox: number, y: number, oz: number, rot: number, colors = ['BrightPink', 'Yellow']) {
  bp.tag = 'flowers'; const { part } = placer(bp, ox, oz, rot);
  part('brick_1x4', 0, y, 0, 'DarkBrown', 1);
  for (let k = 0; k < 4; k++) k % 2 ? part('plant_3leaves', k, y + 3, 0, 'Green', k) : part('flower_1x1', k, y + 3, 0, colors[(k / 2) % colors.length]);
  bp.tag = '';
}

/** A Prague gas lamp (prague.eu; tyn-from-square.jpg): a dark green post of 1×1 round bricks, a 1×3 cross arm, three lanterns — one on each
 *  arm end and one above the centre — each a dark green 1×1 round plate, a trans-clear 1×1 round brick of glass and a dark green pyramid cap.
 *  Axis on cell (0, 0) of the local frame: foot, post, the arm's middle cell, the top lantern; the arm runs along local x. */
export function squareLamp(bp: Blueprint, ox: number, y: number, oz: number, rot: number) {
  bp.tag = 'lamp'; const { part } = placer(bp, ox, oz, rot); const G = 'DarkGreen';
  part('roundplate_1x1', 0, y, 0, G);   // the foot: everything stands on this one cell's axis
  for (let k = 0; k < 5; k++) part('round_1x1', 0, y + 1 + 3 * k, 0, G);
  part('plate_1x3', -1, y + 16, 0, G, 1);
  const lantern = (lx: number, ly: number) => { part('roundplate_1x1', lx, ly, 0, G); part('round_1x1', lx, ly + 1, 0, 'TransClear'); part('pyramid_1x1', lx, ly + 4, 0, G); };
  lantern(-1, y + 17); lantern(1, y + 17); part('round_1x1', 0, y + 17, 0, G); lantern(0, y + 20);
  bp.tag = '';
}

/** The garden behind the Old Town block (Eric 2026-10-03: "背后太空旷"; second review: "把那三棵树的位置重新排一下", the cat in plain view,
 *  no odd wall), island coordinates at the square level `L`: a planted strip on the quay behind the Bridge Tower and the Stone Bell — two
 *  small lindens against the back edge and a larger one forward on the open quay between the river and the house row, staggered so the
 *  group reads as planted, crowns ≥ 2 studs apart and clear of Týn (x 56–73) and the roofs (houses from x 50, z 14) — box hedges and
 *  flowers at their feet; one small linden behind the Hall wing. `ox`, `oz` shift everything for the test scene. Cells that must keep
 *  their studs: BACK_GARDEN_CELLS. */
export const BACK_TREES: { x: number; z: number; size: 'S' | 'M' }[] = [{ x: 42, z: 4, size: 'S' }, { x: 52, z: 4, size: 'S' }, { x: 44, z: 18, size: 'M' }, { x: 79, z: 6, size: 'S' }];
const HEDGES: [number, number][] = [[45, 3], [48, 6], [41, 10], [46, 14]];   // 2×2 box hedges (lib.ts bush), min cells
const BEDS: [number, number, string][] = [[45, 7, 'BrightPink'], [49, 9, 'Yellow'], [43, 13, 'Lavender'], [48, 16, 'BrightPink'], [41, 21, 'Yellow']];
export const BACK_GARDEN_CELLS: [number, number, number, number][] = [   // x0, z0, w, d
  ...BACK_TREES.map(({ x, z }) => [x - 1, z - 1, 2, 2] as [number, number, number, number]), ...HEDGES.map(([x, z]) => [x, z, 2, 2] as [number, number, number, number]), ...BEDS.map(([x, z]) => [x, z, 1, 1] as [number, number, number, number]),
];
export function backGarden(bp: Blueprint, L: number, ox = 0, oz = 0) {
  BACK_TREES.forEach(({ x, z, size }, i) => tree(bp, ox + x, L, oz + z, size, undefined, i, undefined, 'linden'));
  bp.tag = 'hedge'; for (const [x, z] of HEDGES) bush(bp, ox + x, L, oz + z, ['DarkGreen', 'Green', 'DarkGreen']);
  bp.tag = 'flowers'; for (const [x, z, c] of BEDS) { bp.part('plant_3leaves', ox + x, L, oz + z, 'Green'); bp.part('flower_1x1', ox + x, L + 1, oz + z, c); }
  bp.tag = '';
}

/** The cat, in plain view on the square (Eric: "就正常地放一只猫"): a black cat sitting on the paving, facing the camera side (+z). Its two
 *  anti-studs need two studded cells (x, z) and (x, z + 1). */
export const CAT_SPOT: [number, number] = [70, 44];
// rot 0: the cat sits facing +z, the hero camera (its front paws toward the square)
export function squareCat(bp: Blueprint, L: number, ox = 0, oz = 0) { bp.tag = 'cat'; bp.part('cat', ox + CAT_SPOT[0], L, oz + CAT_SPOT[1], 'Black', 0); bp.tag = ''; }
