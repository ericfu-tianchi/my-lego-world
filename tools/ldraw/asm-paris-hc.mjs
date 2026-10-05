// Paris · Haussmann corner, the cut corner (2026-10-03). Scheme: docs/countries/france.md §1.15.
//   LDRAW_DIR=… node tools/ldraw/asm-paris-hc.mjs && node tools/ldraw/bake.mjs hc_corner.ldr hc_roofcorner.ldr --force
// The building is 12 × 10 on the stud grid with its front-left corner cut at 45°. The cut face is a 4-stud wall turned 45° — real
// modulars set such a wall on its own plates and lock it between the two square façades; here it is two LDraw assemblies of real
// parts, exploded in the scene (rule 12): `hc_corner` (pavement to cornice: the café door, the awning, the two balconies, the cornice)
// and `hc_roofcorner` (the mansard on the cut with its dormer). Coordinates are the building's own grid (x right, z toward the street,
// y up; 1 = a stud, a plate = 0.4). The cut's outer face runs from (0, 6) to (4, 10); its middle M = (2, 8) is also the centre of the
// proxies' 6 × 6 footprint (cells x −1..4, z 5..10). Each proxy's mask (the cells its bricks reach) is printed for the catalogue entry.
import { Asm, bbox, PLATE, add, sub, scl, app, basis } from './asm-ours.mjs';
const C = { white: 15, tan: 19, green: 288, black: 0, zinc: 72, brown: 308, room: 78 };   // LDraw codes: Dark Green 288, Dark Bluish Gray 72, Dark Brown 308, Light Nougat 78
const R2 = Math.SQRT1_2; const U = [R2, 0, R2], N = [-R2, 0, R2], UP = [0, 1, 0];   // along the cut, outward
const M = [2, 0, 8];

/** A part on the cut: footprint centre at M + t·U + o·N (o = 0 is the outer wall face; the wall row is o ∈ [−1, 0], the rows outside +1,
 *  +2), body bottom at plate level y. Local x runs along the cut, local z outward — or, with `cross`, local x outward (a ridge piece). */
function D(a, id, color, t, y, o, cross = false) {
  const b = bbox(id); const R = cross ? basis(N, UP, scl(U, -1)) : basis(U, UP, N);
  const lc = [(b[0] + b[3]) / 2, b[1], (b[2] + b[5]) / 2];
  return a.put(id, color, R, sub(add(add(M, scl(U, t)), add(scl(N, o), [0, y * PLATE, 0])), app(R, lc)));
}

/** proxy mask: the cells of the 6 × 6 box (x −1..4, z 5..10) any member's footprint reaches (separating-axis test, 0.05 shrink) */
function mask(a) {
  const cells = new Set();
  for (const p of a.parts) {
    const b = bbox(p.id); const s = 0.05; const loc = [[b[0] + s, b[2] + s], [b[3] - s, b[2] + s], [b[3] - s, b[5] - s], [b[0] + s, b[5] - s]];
    const poly = loc.map(([x, z]) => { const w = add(app(p.R, [x, 0, z]), p.t); return [w[0], w[2]]; });
    for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++) {
      const sq = [[i - 1, j + 5], [i, j + 5], [i, j + 6], [i - 1, j + 6]];
      const axes = [[1, 0], [0, 1], ...poly.map((q, k) => { const r = poly[(k + 1) % 4]; return [-(r[1] - q[1]), r[0] - q[0]]; })];
      const sep = axes.some(([ax, az]) => { const pa = poly.map(([x, z]) => x * ax + z * az), pb = sq.map(([x, z]) => x * ax + z * az); return Math.max(...pa) <= Math.min(...pb) + 1e-9 || Math.max(...pb) <= Math.min(...pa) + 1e-9; });
      if (!sep) cells.add(`${i},${j}`);
    }
  }
  return [...cells].sort();
}

// ---- hc_corner: pavement to cornice (plates 0–51) ------------------------------------------------------------------------------------
{
  const a = new Asm('hc_corner', M);
  // ground floor: the café door — a 1 × 4 × 5 frame in Dark Green, open (summer), the dark wood of the room behind it
  D(a, '2493b', C.green, 0, 0, -0.5);
  for (let k = 0; k < 5; k++) D(a, '3010', C.room, 0, 3 * k, -1.5);   // the lit café room behind the open door
  // the awning on the cut, the same profile as the square fronts: a soffit plate at 15, the valance two rows out, 45° slopes up to the wall
  D(a, '3710', C.green, 0, 15, -0.5); D(a, '3020', C.green, 0, 15, 1);
  D(a, '3010', C.green, 0, 16, 1.5);
  for (const t of [-1.5, -0.5, 0.5, 1.5]) D(a, '3040b', C.green, t, 19, 1);
  for (const y of [16, 19]) D(a, '15533', C.white, 0, y, -0.5);                        // the entresol behind the awning, White masonry
  D(a, '3020', C.tan, 0, 22, 0);                                                          // the string course, one row proud: the 2nd-floor ledge
  // four storeys: a French window between Tan piers with the lit room behind it (Light Nougat bricks against the frame), a plate course
  // between floors — one row proud on the 2nd and the 5th floor, where it is the ledge of the continuous iron balcony (a lattice fence),
  // one row in elsewhere, where it carries the dark room
  for (const [f, y] of [[2, 23], [3, 30], [4, 37], [5, 44]]) {
    D(a, '60592', C.white, 0, y, -0.5);   // no pane: the assembly check cannot seat a glass in its frame; the open frame shows the lit room
    for (const k of [0, 3]) D(a, '3004', C.room, 0, y + k, -1.5);   // the room behind: a light wall against the frame
    for (const t of [-1.5, 1.5]) { D(a, '3005', C.tan, t, y, -0.5); if (f !== 5) D(a, '3005', C.tan, t, y + 3, -0.5); }
    if (f === 2 || f === 5) D(a, '3633', C.black, 0, y, 0.5);
    if (f < 5) D(a, '3020', C.tan, 0, y + 6, f === 4 ? 0 : -1);                           // 29 and 36 one row in; 43 one row proud (the 5th-floor ledge)
  }
  for (const t of [-1.5, 1.5]) D(a, '3665a', C.tan, t, 47, 0);                            // stone consoles under the cornice, over the piers
  D(a, '3710', C.tan, 0, 50, -1.5); D(a, '3020', C.tan, 0, 50, 0);                        // the cornice: one plate over the room, one over wall and consoles (the consoles' top stud is one row in, under it: the outer row had no stud)
  console.log(JSON.stringify(a.write()), '\nmask hc_corner', JSON.stringify(mask(a)));
}

// ---- hc_roofcorner: the zinc mansard on the cut (plates 51–63) -------------------------------------------------------------------------
// The Paris profile, as on the square faces: a steep 75° lower slope (the brisis) with the dormer set into it, a plate course at the break
// that stands out over the slope's head (the thin zinc cornice), a short 30° upper slope (the terrasson), the flat top tiled. The square
// deck behind meets it with a 4 × 4 plate without corner, whose 45° edge runs along this row's inner face (paris-haussmann.ts).
{
  const a = new Asm('hc_roofcorner', add(M, [0, 51 * PLATE, 0]));
  D(a, '2431', C.tan, 0, 51, 0.5);                                                        // the cornice's smooth top
  for (const t of [-1.5, 1.5]) D(a, '4460b', C.zinc, t, 51, -1);                          // steep 75° zinc, stud row on the inside
  D(a, '60592', C.white, 0, 51, -0.5);                                                    // the dormer: a white window …
  for (const y of [51, 54, 57]) D(a, '3004', C.room, 0, y, -1.5);                     // the attic room behind it
  D(a, '3044b', C.white, 0, 57, -0.5, true);                                              // … under a small white gable facing the street
  D(a, '3020', C.zinc, 0, 60, -1);                                                        // the break: over the slope's head and the inner row
  for (const t of [-1, 1]) D(a, '85984', C.zinc, t, 61, -0.5);                            // the short upper slope
  D(a, '3710', C.zinc, 0, 61, -1.5); D(a, '2431', C.zinc, 0, 62, -1.5);                  // the flat top over the inner row, tiled
  console.log(JSON.stringify(a.write()), '\nmask hc_roofcorner', JSON.stringify(mask(a)));
}
