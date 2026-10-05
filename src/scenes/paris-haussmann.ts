// Paris · the Haussmann corner and its café, round 1 (2026-10-03). Scheme: docs/countries/france.md §1.15 (signed off by Eric).
// References: haussmann-59-bd-haussmann.jpg (the grammar), cafe-deux-magots.jpg (awning, chairs in rows facing the street),
// moc-lepra-boulevard-lumieres-1.jpg (the brick grammar), official-10243-mansard.jpg (zinc mansard, dormers, chimney pots).
import { Blueprint } from '../core/builder';
import { placer } from './singapore';

const WHITE = 'White', TAN = 'Tan', GREEN = 'DarkGreen', IRON = 'Black', ZINC = 'DarkBluishGray', POT = 'DarkOrange', WOOD = 'DarkBrown', GLASS = 'TransLightBlue', ROOM = 'LightNougat';   // glass, a lit room behind (Eric: no black windows); Trans-Light Blue over Trans-Clear: clear read as an empty hole on a render

// The building on its own grid: x 0..11, z 0..9, the street front on z 9 (facing +z), the river side on x 0 (facing −x); the corner
// between them is cut at 45° (the cut face runs from (0, 6) to (4, 10): tools/ldraw/asm-paris-hc.mjs). Faces F front, L left, R right,
// B back. `own` is each face's run of wall cells (the three square corners belong to one face each); `wins` the window bays (2 wide),
// on one axis from the shop front to the dormers.
type F = 'F' | 'L' | 'R' | 'B';
const FACES: Record<F, { own: [number, number]; wins: number[]; rot: number }> = {
  F: { own: [4, 11], wins: [5, 8], rot: 0 },    // pier 1 at the cut, windows, the 2-wide corner pier
  L: { own: [1, 5], wins: [3], rot: 3 },        // mirrors the front about the cut: pier 1 at the cut, the window, the corner pier
  R: { own: [0, 8], wins: [2, 6], rot: 1 },
  B: { own: [0, 10], wins: [3, 7], rot: 2 },
};
// plate levels
const CHAIR_Z = 0, CHAIR_X = 3;   // seat rotations: back on −z (facing the street), back on +x (facing the river)
const SOFFIT = 15, SC = 22, FLOORS = [23, 30, 37, 44], CORNICE = 50, ROOF = 51, BREAK = 60, TOP = 61;

/** The Haussmann corner block with the café on the street side and the river side. (x, z) is the min corner of the building's 12 × 10
 *  footprint, y the pavement level; the café terrace reaches 4 studs in front (z 10..13) and to the left (x −4..−1), the Morris column
 *  stands at x 15..16. Heights in plates from the pavement: shop fronts 0–15 · awning 15–22 · string course 22 · four storeys of 7
 *  (French windows 1 × 2 × 2; continuous iron balconies on the 2nd and 5th floors, grille balconettes on the 3rd and 4th) · consoles and
 *  cornice 47–51 · zinc mansard: 75° brisis 51–60 with dormers, the break course 60, a 30° terrasson and the flat top 61–63 · chimney
 *  stacks with terracotta pots to 72. */
export function haussmann(bp: Blueprint, x: number, y: number, z: number, rot: number) {
  const P = placer(bp, x, z, rot); const part = (k: string, lx: number, ly: number, lz: number, c: string, lr = 0, pr?: string) => P.part(k, lx, y + ly, lz, c, lr, pr);
  const vox = (kind: 'brick' | 'plate' | 'tile', lx: number, ly: number, lz: number, c: string) => P.vox(kind, lx, y + ly, lz, c);
  bp.tag = 'haussmann';

  /** min corner of a block on face f spanning along-face cells s0..s0+len−1 and rows k0..k1 (0 the wall, 1, 2 outside, −1 inside) */
  const fp = (f: F, s0: number, len: number, k0: number, k1: number): [number, number] =>
    f === 'F' ? [s0, 9 + k0] : f === 'B' ? [s0, -k1] : f === 'L' ? [-k1, s0] : [11 + k0, s0];
  /** a part on face f: by default turned to face out of it (canonical front +z, long side along x); `r` gives an absolute quarter turn */
  const put = (f: F, key: string, s0: number, len: number, k0: number, k1: number, ly: number, c: string, print?: string, r?: number) => { const [px, pz] = fp(f, s0, len, k0, k1); part(key, px, ly, pz, c, r ?? FACES[f].rot, print); };
  const along = (f: F) => (f === 'F' || f === 'B' ? 1 : 0);   // the quarter turn that lays a canonical 1×N / 2×N (long along z) along the face
  /** lengths for a run of n cells: 8 / 6 / 4 / 3 / 2 / 1, never leaving a lone 1 at the end (it would have nothing under its outer cell) */
  const split = (n: number) => { const out: number[] = []; while (n > 0) { let L = [8, 6, 4, 3, 2, 1].find((m) => m <= n)!; if (n - L === 1 && L > 2) L = [8, 6, 4, 3, 2].find((m) => m < L && n - m !== 1)!; out.push(L); n -= L; } return out; };
  const isWin = (f: F, s: number) => FACES[f].wins.some((w) => s === w || s === w + 1);
  const cellOf = (f: F, s: number): [number, number] => fp(f, s, 1, 0, 0);
  /** runs of consecutive cells of face f (own range) where `keep(s)` holds */
  const runs = (f: F, keep: (s: number) => boolean) => { const out: [number, number][] = []; const [a, b] = FACES[f].own; let s = a; while (s <= b) { if (!keep(s)) { s++; continue; } let e = s; while (e + 1 <= b && keep(e + 1)) e++; out.push([s, e]); s = e + 1; } return out; };
  /** a masonry course (White, 3 plates) along face f over a run, real bond: 1×4 and 1×2 masonry bricks, a plain 1×1 brick for an odd end;
   *  odd courses start with a 1×2 so the joints never line up */
  const masonry = (f: F, s0: number, s1: number, ly: number, course: number) => {
    let s = s0; let first = true;
    while (s <= s1) {
      const left = s1 - s + 1; let L = left >= 4 ? 4 : left >= 2 ? 2 : 1; if (first && course % 2 === 1 && left >= 3) L = 2; first = false;
      if (L === 1) { const [cx, cz] = cellOf(f, s); part('brick_1x1', cx, ly, cz, WHITE); } else put(f, L === 4 ? 'brick_masonry_1x4' : 'brick_masonry_1x2', s, L, 0, 0, ly, WHITE);
      s += L;
    }
  };
  /** a 2-deep plate strip (the wall row and one row out) along face f, cells s0..s1 */
  const strip2 = (f: F, s0: number, s1: number, ly: number, c: string, k0 = 0) => { let s = s0; for (const L of split(s1 - s0 + 1)) { put(f, L === 1 ? 'plate_1x2' : `plate_2x${L}`, s, L, k0, k0 + 1, ly, c, undefined, L === 1 ? 1 - along(f) : along(f)); s += L; } };
  /** a 1-deep plate run along face f at row k */
  const strip1 = (f: F, s0: number, s1: number, ly: number, c: string, k = 0, kind: 'plate' | 'tile' = 'plate') => { let s = s0; for (const L of split(s1 - s0 + 1)) { put(f, `${kind}_1x${L}`, s, L, k, k, ly, c, undefined, along(f)); s += L; } };

  // ---- ground floor + entresol (0–22): White rusticated masonry ------------------------------------------------------------------------
  // The café fronts (F, L): tall shop windows to the pavement in Dark Green frames (a 1×2×3 under a 1×2×2 transom), the dark wood room
  // behind; a Dark Green fascia course at 15 carries the awning; masonry piers between.
  for (const f of ['F', 'L'] as F[]) {
    for (let c = 0; c < 5; c++) for (const [a, b] of runs(f, (s) => !isWin(f, s))) masonry(f, a, b, 3 * c, c);
    for (const w of FACES[f].wins) {
      masonry(f, w, w + 1, 0, 1);   // a low masonry sill, then two glazed frames (shop window and transom)
      for (const wy of [3, 9]) { put(f, 'window_1x2x2', w, 2, 0, 0, wy, GREEN); put(f, 'glass_1x2x2', w, 2, 0, 0, wy, GLASS); }
      for (let c = 0; c < 5; c++) put(f, 'brick_1x2', w, 2, -1, -1, 3 * c, ROOM, undefined, along(f));   // the lit café room
    }
    strip1(f, FACES[f].own[0], FACES[f].own[1], SOFFIT, GREEN);
    for (let c = 0; c < 2; c++) masonry(f, FACES[f].own[0], FACES[f].own[1], SOFFIT + 1 + 3 * c, c + 1);
  }
  // the awning: a soffit two rows out, the printed valance on the outer row, 45° slopes back up to the wall under the string course.
  // Front x 3..11 (it reaches one stud past the wall to meet the cut's awning), river side z 0..6.
  part('plate_2x8', 3, SOFFIT, 10, GREEN, 1); part('plate_1x2', 11, SOFFIT, 10, GREEN, 0);
  part('brick_1x2', 2, SOFFIT + 1, 11, GREEN, 1); part('brick_1x4', 4, SOFFIT + 1, 11, GREEN, 3, 'hc_cafe'); part('brick_1x4', 8, SOFFIT + 1, 11, GREEN, 3, 'hc_cafe');
  for (let sx = 3; sx <= 11; sx++) part('slope_1x2', sx, SOFFIT + 4, 10, GREEN, 0);
  part('plate_2x6', -2, SOFFIT, 1, GREEN, 0); part('plate_1x2', -2, SOFFIT, 0, GREEN, 1);
  part('brick_1x2', -2, SOFFIT + 1, 0, GREEN, 0); part('brick_1x4', -2, SOFFIT + 1, 2, GREEN, 2, 'hc_cafe'); part('brick_1x2', -2, SOFFIT + 1, 6, GREEN, 0);
  for (let sz = 0; sz <= 6; sz++) part('slope_1x2', -2, SOFFIT + 4, sz, GREEN, 3);
  for (const [tx, tz] of [[3, 10], [-1, 0], [-1, 6]]) part('tile_1x1', tx, SC, tz, GREEN);
  // the valance runs one stud on past each square awning's end, toward the cut, closing the wedge between it and the 45° awning
  part('cheese_1x1', 2, SOFFIT + 4, 11, GREEN, 0); part('cheese_1x1', -2, SOFFIT + 4, 7, GREEN, 3);   // the slopes' stud rows the string course does not cover
  // The back (B): masonry with windows on the bay axes — rez-de-chaussée 6–12, entresol 16–22 — and a White band at 15.
  {
    const f: F = 'B';
    for (let c = 0; c < 5; c++) for (const [a, b] of runs(f, (s) => !(isWin(f, s) && c >= 2 && c <= 3))) masonry(f, a, b, 3 * c, c);
    for (const w of FACES.B.wins) for (const wy of [6, 16]) { put(f, 'window_1x2x2', w, 2, 0, 0, wy, WHITE); put(f, 'glass_1x2x2', w, 2, 0, 0, wy, GLASS); }
    strip1(f, FACES.B.own[0], FACES.B.own[1], SOFFIT, WHITE);
    for (let c = 0; c < 2; c++) for (const [a, b] of runs(f, (s) => !isWin(f, s))) masonry(f, a, b, SOFFIT + 1 + 3 * c, c + 1);
  }
  // The right side (R): the porte cochère, a 1 × 4 × 6 carriage door in dark wood on the axis, masonry either side.
  {
    const f: F = 'R'; const door = (s: number) => s >= 3 && s <= 6;
    for (let c = 0; c < 5; c++) for (const [a, b] of runs(f, (s) => !door(s))) masonry(f, a, b, 3 * c, c);
    put(f, 'doorframe_1x4x6', 3, 4, 0, 0, 0, WHITE); put(f, 'door_1x4x6', 3, 4, 0, 0, 0, WOOD);
    for (const [a, b] of runs(f, (s) => !door(s))) strip1(f, a, b, SOFFIT, WHITE);
    for (let c = 0; c < 2; c++) for (const [a, b] of runs(f, (s) => !door(s))) masonry(f, a, b, SOFFIT + 1 + 3 * c, c + 1);
    strip1(f, 3, 6, 18, WHITE); masonry(f, 3, 6, 19, 1);
  }

  // ---- the cut corner (two assemblies of real parts, exploded) ----------------------------------------------------------------------
  P.asm('hc_corner', -1, y, 5, TAN); P.asm('hc_roofcorner', -1, y + ROOF, 5, ZINC);

  // ---- four storeys of Tan stone (22–50) -------------------------------------------------------------------------------------------
  // Bands: the string course at 22 and the floor course at 43 run two deep along the café faces — the ledges of the two continuous
  // balconies; elsewhere the band is the wall row, with a 2 × 2 plate reaching one row in under each window. Behind every window a lit
  // room (two Light Nougat bricks against the frame) stands on that plate or hangs from the one above; under the mansard a plate one row in
  // carries the 5th floor's.
  const balcony = (f: F, band: number) => (f === 'F' || f === 'L') && (band === SC || band === FLOORS[3] - 1);
  for (const f of ['F', 'L', 'R', 'B'] as F[]) {
    const [a, b] = FACES[f].own;
    for (const yb of FLOORS) {
      const band = yb - 1;
      if (balcony(f, band)) strip2(f, a, b, band, TAN);
      else { for (const [r0, r1] of runs(f, (s) => !isWin(f, s))) strip1(f, r0, r1, band, TAN); for (const w of FACES[f].wins) put(f, 'plate_2x2', w, 2, -1, 0, band, TAN); }
      // piers: Tan bricks, two a storey (on the 5th floor the top brick is a stone console)
      for (const [r0, r1] of runs(f, (s) => !isWin(f, s))) for (let s = r0; s <= r1; s++) { const [cx, cz] = cellOf(f, s); for (let d = 0; d < (yb === FLOORS[3] ? 3 : 6); d++) vox('brick', cx, yb + d, cz, TAN); }
      for (const w of FACES[f].wins) {
        put(f, 'window_1x2x2', w, 2, 0, 0, yb, WHITE); put(f, 'glass_1x2x2', w, 2, 0, 0, yb, GLASS);
        for (const k of [0, 3]) put(f, 'brick_1x2', w, 2, -1, -1, yb + k, ROOM, undefined, along(f));
      }
      if (balcony(f, band)) {   // the lattice fences on the ledge, centred on the window bays
        if (f === 'F') { put(f, 'fence_lattice_1x4x1', 4, 4, 1, 1, yb, IRON); put(f, 'fence_lattice_1x4x1', 8, 4, 1, 1, yb, IRON); }
        else put(f, 'fence_lattice_1x4x1', 2, 4, 1, 1, yb, IRON);
      }
    }
    for (const w of FACES[f].wins) put(f, 'plate_1x2', w, 2, -1, -1, CORNICE, TAN, undefined, along(f));
    // stone consoles under the cornice over every pier cell, then the cornice two deep (a pinwheel round the corners)
    for (const [r0, r1] of runs(f, (s) => !isWin(f, s))) for (let s = r0; s <= r1; s++) put(f, 'slope_inv_1x2_a', s, 1, 0, 1, FLOORS[3] + 3, TAN);
  }
  strip2('F', 4, 12, CORNICE, TAN); strip2('R', -1, 8, CORNICE, TAN); strip2('B', -1, 10, CORNICE, TAN); strip2('L', 1, 5, CORNICE, TAN);
  // the cornice's outer row is capped smooth (Tan tiles); the wall row carries the mansard
  for (let cx = 4; cx <= 12; cx++) vox('tile', cx, ROOF, 10, TAN);
  for (let cz = -1; cz <= 9; cz++) vox('tile', 12, ROOF, cz, TAN);
  for (let cx = -1; cx <= 11; cx++) vox('tile', cx, ROOF, -1, TAN);
  for (let cz = 0; cz <= 5; cz++) vox('tile', -1, ROOF, cz, TAN);

  // ---- the zinc mansard (51–60): steep 75° Dark Bluish Gray slopes, white dormers on the window axes, 75° corners -----------------------
  const dormer = (f: F, w: number) => {
    put(f, 'window_1x2x2', w, 2, 0, 0, ROOF, WHITE); put(f, 'glass_1x2x2', w, 2, 0, 0, ROOF, GLASS);
    for (let k = 0; k < 3; k++) put(f, 'brick_1x2', w, 2, -1, -1, ROOF + 3 * k, ROOM, undefined, along(f));   // the attic room
    put(f, 'slope45_double_2x1', w, 2, 0, 0, ROOF + 6, WHITE, undefined, along(f));   // a small white gable facing the street
  };
  const slope = (f: F, s: number) => put(f, 'slope75_2x1x3', s, 1, -1, 0, ROOF, ZINC);
  dormer('F', 5); dormer('F', 8); slope('F', 7);
  dormer('R', 2); dormer('R', 6); slope('R', 4); slope('R', 5);
  dormer('B', 3); dormer('B', 7); for (const s of [2, 5, 6, 9]) slope('B', s);
  slope('L', 2); dormer('L', 3);
  part('slope75_corner_2x2x3', 10, ROOF, 8, ZINC, 0); part('slope75_corner_2x2x3', 10, ROOF, 0, ZINC, 1); part('slope75_corner_2x2x3', 0, ROOF, 0, ZINC, 2);   // SE, NE, NW (hipCorners order); the SW corner is the cut
  // where the square faces meet the cut: one square zinc post on the wall line under the break course
  for (const [rx, rz] of [[4, 9], [0, 5]]) for (let k = 0; k < 3; k++) part('brick_1x1', rx, ROOF + 3 * k, rz, ZINC);

  // ---- the break (60): a plate course over the brisis' head, two deep, standing out over the slope — the thin zinc cornice of a Paris
  // mansard; on it the short 30° terrasson (cheese slopes, pyramids at the three square corners) and, inside, the flat top
  strip2('F', 5, 11, BREAK, ZINC, -1); strip2('R', 0, 7, BREAK, ZINC, -1); strip2('B', 0, 9, BREAK, ZINC, -1); strip2('L', 2, 4, BREAK, ZINC, -1);
  for (const [rx, rz] of [[4, 9], [0, 5]]) part('plate_1x1', rx, BREAK, rz, ZINC);
  for (const f of ['F', 'R', 'B', 'L'] as F[]) { const [a, b] = ({ F: [4, 10], R: [1, 8], B: [1, 10], L: [1, 5] } as Record<F, number[]>)[f]; for (let s = a; s <= b; s++) put(f, 'cheese_1x1', s, 1, 0, 0, TOP, ZINC); }
  for (const [px, pz] of [[11, 9], [11, 0], [0, 0]]) part('pyramid_1x1', px, TOP, pz, ZINC);
  // the flat top: plates run back from the break course's inner rows across the room and are tiled; by the cut a 4 × 4 plate without
  // corner lies over them with its 45° edge along the cut's top row, so no wedge is left open between the square deck and the 45° one
  const top: [string, number, number, number][] = [   // key, x, z, quarter turn (all at TOP)
    ['plate_1x4', 1, 1, 0], ['plate_2x3', 2, 1, 0], ['plate_1x2', 2, 4, 1], ['plate_2x4', 4, 1, 0], ['plate_1x2', 3, 5, 1], ['plate_1x1', 4, 6, 0],
    ['plate_1x4', 5, 5, 0], ['plate_2x8', 6, 1, 0], ['plate_1x8', 8, 1, 0], ['plate_2x8', 9, 1, 0]];
  for (const [k, dx, dz, r] of top) part(k, dx, TOP, dz, ZINC, r);
  part('plate_4x4_cut', 2, TOP + 1, 4, ZINC, 3);
  const cutCell = (cx: number, cz: number) => cx >= 2 && cx <= 5 && cz >= 4 && cz <= 7 && cz - cx < 3;
  const stacks: [number, number, number][] = [[3, 2, 1], [8, 4, 0]];   // min cell, run along x (1) or z (0): 1 × 3 stacks
  const stackCell = (cx: number, cz: number) => stacks.some(([sx, sz, ax]) => ax ? cz === sz && cx >= sx && cx < sx + 3 : cx === sx && cz >= sz && cz < sz + 3);
  for (let cx = 1; cx <= 10; cx++) for (let cz = 1; cz <= 8; cz++) {
    const deck = (cx === 1 && cz <= 4) || (cx >= 2 && cx <= 3 && cz <= 4) || (cx >= 4 && cx <= 5 && cz <= 4) || (cx === 3 && cz === 5) || (cx === 4 && (cz === 5 || cz === 6)) || (cx === 5 && cz >= 5) || cx >= 6;
    if (deck && !cutCell(cx, cz) && !stackCell(cx, cz)) vox('tile', cx, TOP + 1, cz, ZINC);
  }
  for (const [sx, sz, ax] of stacks) {
    const k = ax ? 1 : 0; part('brick_1x3', sx, TOP + 1, sz, TAN, k); part('brick_1x3', sx, TOP + 4, sz, TAN, k); part('plate_1x3', sx, TOP + 7, sz, TAN, k);
    for (let i = 0; i < 3; i++) part('round_1x1', ax ? sx + i : sx, TOP + 8, ax ? sz : sz + i, POT);
  }
  bp.tag = '';

  // ---- the café terrace -------------------------------------------------------------------------------------------------------------
  bp.tag = 'cafe';
  /** a bistro table on one pedestal: a jumper puts the stem on the line between two chairs, a white round top on its stud */
  const table = (jx: number, jz: number, jr: number, cx: number, cz: number) => { part('jumper_1x2', jx, 0, jz, IRON, jr); part('roundplate_1x1', cx, 1, cz, IRON); part('bar_3l', cx, 1, cz, IRON); part('roundplate_1x1', cx, 6, cz, IRON); part('tile_round_2x2_stud', cx - 0.5, 7, cz - 0.5, WHITE); };   // a thin iron stem: a 3L bar between two 1×1 round plates
  // two tables in front of the street face, two rattan chairs side by side behind each, facing the street (Les Deux Magots)
  /** a rattan bistro chair, brick-built (mijasper's bistro chairs, Les Deux Magots): a jumper foot and a 1×1 round stem in Dark Tan, a
   *  2×2 round seat, a 1×2 curved-top brick as the rounded back — Tan, the colour of the rattan. (x, z) min cell of its 2 × 2; `face` the way it looks:
   *  'z' toward +z (back on the z row), 'x' toward −x (back on the x + 1 column). */
  // Eric 2026-10-04: the brick-built rattan chair read as a cushion, not a chair — now the real minifig chair (Minifig Seat 2 × 2) in Dark Brown
  const chair = (x: number, z: number, face: 'z' | 'x') => part('seat_2x2', x, 0, z, 'DarkBrown', face === 'z' ? CHAIR_Z : CHAIR_X);
  for (const gx of [5, 9]) { chair(gx, 10, 'z'); chair(gx + 2, 10, 'z'); table(gx + 1, 12, 0, gx + 1.5, 12); }
  // one on the river side, chairs facing the river
  chair(-2, 1, 'x'); chair(-2, 3, 'x'); table(-3, 2, 1, -3, 2.5);
  // planters close the terrace at both ends: a dark green box planted with box shrubs and a few red geraniums
  const planter = (px: number, pz: number, lr: number) => { part('brick_1x4', px, 0, pz, GREEN, lr); const cells = lr % 2 ? [0, 1, 2, 3].map((i) => [px + i, pz]) : [0, 1, 2, 3].map((i) => [px, pz + i]); cells.forEach(([cx, cz], i) => (i === 1 ? part('flower_1x1', cx, 3, cz, 'BrightRed') : part('plant_3leaves', cx, 3, cz, 'Green', i))); };
  planter(13, 10, 0); planter(-5, -1, 1);
  // the chalk menu board by the corner door: a dark wood frame with a black board
  part('window_1x2x2', 1, 0, 11, WOOD, 0); part('glass_1x2x2', 1, 0, 11, IRON, 0);
  bp.tag = '';

  // ---- the Morris column beside the terrace (round 3, after the 2020s photo): a dark green plinth, a drum wrapped in posters, the wide
  // canopy, the frieze, an onion dome. Nearly two minifigs tall, like the real one beside a passer-by.
  bp.tag = 'morris';
  const mx = 15, mz = 11;
  part('roundbrick_2x2', mx, 0, mz, GREEN);
  for (let k = 0; k < 4; k++) part('roundbrick_2x2', mx, 3 + 3 * k, mz, GREEN, k, 'hc_morris_wrap');   // posters all round, each course turned a quarter further
  part('roundplate_4x4', mx - 1, 15, mz - 1, GREEN); part('roundplate_2x2', mx, 16, mz, GREEN); part('hc_dome_stud', mx, 17, mz, GREEN);   // canopy, frieze, onion dome
  bp.tag = '';
}
