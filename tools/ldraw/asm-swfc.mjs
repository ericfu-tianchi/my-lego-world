// Shanghai World Financial Center v5 (2026-10-03) — one assembly of real parts, authored in our frame (tools/ldraw/asm-ours.mjs).
//   LDRAW_DIR=<main repo>/vendor/ldraw-lib/ldraw node tools/ldraw/asm-swfc.mjs && node tools/ldraw/bake.mjs swfc.ldr --force
// The real tower (KPF) is a 58 m square prism; from about a third of the way up, two opposite corners are bevelled away by sweeping arcs
// until the plan is a narrow rectangle along the diagonal at the top, and the trapezoid hole goes through that rectangle.
// v3/v4 kept the square on the stud grid, so the bevels ran diagonally across it and could only be built as a staircase of cells —
// Eric 2026-10-03: the blade was "多边形凑", the top too thin and the foot too fat from the side. v5 turns the grid instead: x runs along
// the top line, so the bevels are flat faces across the grid that lean in on 75° slope bricks (one stud over three bricks) at an
// accelerating pace, and the hole sits in the same grid. The square's own sides are now the diagonal ones (stud steps), the price.
// Proportions: bevels start at course 11 of 22 (≈ 0.4 of the body), top band 2 studs deep (≈ 0.25 of the 8-stud face); hole 4 → 6 studs
// wide, 9 plates tall (≈ 0.50 / 0.75 / 0.45 of the face; real 0.55 / 0.70 / 0.42), trans-clear skywalk, silver sill and soffit.
// Frame: box x 0..8, z 0..8, axis at (4, 4).
import { Asm, bbox, PLATE } from './asm-ours.mjs';
const GLASS = +(process.env.SWFC_GLASS ?? 379), CORE = 72, LBG = 71, TC = 47;
const C = [4, 0, 4];
const BZ = 4.5;   // the tower's axis across the top line: z cells on whole studs put it on a cell centre, half a stud off the footprint's centre
const a = new Asm('swfc', C);
const at = (id, color, x, y, z, q = 0) => a.up(id, color, C[0] + x, y, C[2] + z, q);   // footprint min corner relative to the axis
for (const yy of [0, 1]) for (let z = -4; z < 4; z++) at('3460', LBG, -4, yy, z, 0);
const BRICK = { 1: '3005', 2: '3004', 3: '3622', 4: '3010', 6: '3009', 8: '3008' };
// v5 frame: x along the top line, z across it (the wide face, with the hole, looks along ±z). The plan is the square turned 45° — the cells
// with |x| + |z| ≤ 4.5 — clipped to |z| < k, k = 4 (the whole square) for the bottom third, then 3, 2, 1 at an accelerating pace (the arc)
const COURSES = 24;   // 93 plates: the set height table, ST 110 > SWFC 93 > Pearl 86 > Jin Mao 80 (2026-10-03)
// v5.1 (Eric 2026-10-03: from the side the foot was far too fat and the top far too thin): the plan is a rectangle, 8 along the top line
// and 5 across it, and one 75° slope run takes both broad faces in a stud to a top band 8 × 3. From the side: 5 at the foot, 3 at the top
// (v5: 8 and 2). The rectangle drops v5's turned-square sides, which were stud steps; the front still reads as the straight slab.
const SLOPE = 17;                                                            // the run fills courses 17–19: the lean sits under the top third, like a blade's tip (mid-height read as a waist)
const K = (c) => (c < SLOPE + 3 ? 2 : 1);                                    // |z| ≤ K
const inPlan = (x, z, c) => Math.abs(z) <= K(c) && Math.abs(x) <= 4;
const XS = [-3.5, -2.5, -1.5, -0.5, 0.5, 1.5, 2.5, 3.5], ZS = [-2, -1, 0, 1, 2];
let y = 2;
for (let c = 0; c < COURSES; c++) {
  const taken = new Set(); const key = (x, z) => `${x},${z}`;
  // the slope run: the outer row and the one inside it are one 75° slope brick facing out, placed on the run's first course
  if (c >= SLOPE && c < SLOPE + 3) for (const sz of [1, -1]) for (const x of XS) { const zo = 2 * sz, zi = sz; if (!inPlan(x, zo, c)) continue;
    if (c === SLOPE) a.up('4460b', GLASS, C[0] + x - 0.5, y, BZ + Math.min(zo, zi) - 0.5, sz > 0 ? 0 : 2); taken.add(key(x, zo)); taken.add(key(x, zi)); }
  const edge = (x, z) => [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dz]) => !inPlan(x + dx, z + dz, c));
  // runs along x on even courses, along z on odd ones, so each course bonds across the one below
  const lines = c % 2 === 0 ? ZS.map((z) => XS.map((x) => [x, z])) : XS.map((x) => ZS.map((z) => [x, z]));
  for (const line of lines) {
    const cells = line.filter(([x, z]) => inPlan(x, z, c) && !taken.has(key(x, z)));
    let i = 0; while (i < cells.length) { let L = 1;
      const adj = (p, q) => Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]) === 1;
      while (i + L < cells.length && L < 8 && adj(cells[i + L - 1], cells[i + L])) L++;
      while (!BRICK[L]) L--;
      const run = cells.slice(i, i + L); const glass = run.some(([x, z]) => edge(x, z));
      const x0 = Math.min(...run.map((p) => p[0])), z0 = Math.min(...run.map((p) => p[1]));
      a.up(BRICK[L], glass ? GLASS : CORE, C[0] + x0 - 0.5, y, BZ + z0 - 0.5, c % 2 === 0 ? 0 : 1); i += L; }
  }
  y += 3;
}
// the top: the 8 × 3 band carrying the hole; plate courses split 2 + 1 rows, alternately, to bond the 1-wide brick rows
const sl = (id, color, x0, z0, q = 0) => a.up(id, color, C[0] + x0, y, BZ + z0, q);   // footprint min corner relative to the axis
const RIM = +(process.env.SWFC_RIM ?? 179), ROOF = LBG;
const plates = (color, flip) => { if (flip) { sl('3460', color, -4, -1.5); sl('3034', color, -4, -0.5); } else { sl('3034', color, -4, -1.5); sl('3460', color, -4, 0.5); } y += 1; };
const bricks = (color) => { for (const z of [-1.5, -0.5, 0.5]) sl('3008', color, -4, z); y += 3; };
plates(GLASS, false); bricks(GLASS);
plates(RIM, true);                                                          // the hole's sill: a thin silver line
for (const z of [-1.5, -0.5, 0.5]) { sl('2431', TC, -2, z); sl('4460b', GLASS, -4, z, 1); sl('4460b', GLASS, 2, z, 3); }   // skywalk; 75° slopes facing into the hole, 4 studs → 6
y += 9;
plates(RIM, false);                                                         // the beam's soffit, silver, on the slopes' tops
bricks(GLASS);
for (const z of [-1.5, -0.5, 0.5]) sl('4162', ROOF, -4, z); y += 1;
console.log(`swfc v5: top at ${y} plates`);
const out = a.write(); console.log('swfc:', out.file, a.parts.length, 'parts', JSON.stringify(out.bom));
