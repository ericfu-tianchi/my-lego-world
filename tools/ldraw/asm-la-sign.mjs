// Mount Lee radio mast (2026-10-05) — one assembly of real parts, authored in our frame (tools/ldraw/asm-ours.mjs).
//   LDRAW_DIR=<main repo>/vendor/ldraw-lib/ldraw node tools/ldraw/asm-la-sign.mjs && node tools/ldraw/bake.mjs la_mast.ldr --force
// Scheme: docs/refs/la-hollywood-sign/SCHEME.md §2; build notes BUILD.md. (The HOLLYWOOD letters are studs-up bricks placed in the scene.)
// Real: a slender red/white lattice tower with a low rack of white dishes beside it (real-straight-on.jpg).
// Ours, footprint 4 × 2 (x 0..4, z 0..2), origin at its bottom centre:
//   tower   on a 2 × 2 plate at x 2..4, two 4-plate bands of four 1 × 1 round-brick legs: band 1 Red legs under a White 2 × 2
//           plate, band 2 White legs under a Red 2 × 2 jumper, then a 1 × 1 column of round bricks Red / White / Red, a thin Red whip
//   rack    at x 0..1: two White bricks with a stud on one side, facing south and west, carrying two radar dishes, a round tile on top, on a
//           1 × 1 Light Bluish Gray round-brick post
import { Asm } from './asm-ours.mjs';
const WHITE = 15, LBG = 71, RED = 4;
const basis = (ex, ey, ez) => [ex[0], ey[0], ez[0], ex[1], ey[1], ez[1], ex[2], ey[2], ez[2]];
const I = [1, 0, 0, 0, 1, 0, 0, 0, 1];
const RYq = (k) => { const c = [1, 0, -1, 0][k & 3], s = [0, 1, 0, -1][k & 3]; return [c, 0, s, 0, 1, 0, -s, 0, c]; };
const a = new Asm('la_mast', [2, 0, 1]);
const P = 0.4;
// ---- tower (x 2..4, z 0..2)
a.put('3022', LBG, I, [3, P, 1]);                                            // 2 × 2 base plate on the summit
let y = 1;
const legs = [[2.5, 0.5], [3.5, 0.5], [2.5, 1.5], [3.5, 1.5]];
for (const [legC, plateC, plate] of [[RED, WHITE, '3022'], [WHITE, RED, '87580']]) {   // the top plate is a 2 × 2 jumper: its centre stud carries the column
  for (const [lx, lz] of legs) a.put('3062b', legC, I, [lx, (y + 3) * P, lz]);
  a.put(plate, plateC, I, [3, (y + 4) * P, 1]); y += 4;
}
for (const c of [RED, WHITE, RED]) { a.put('3062b', c, I, [3, (y + 3) * P, 1]); y += 3; }
a.put('3957a', RED, I, [3, (y + 1) * P, 1]);
const tip = y + 12;
// ---- dish rack (x 0..1, z 0.5..1.5): a grey round-brick post, two White side-stud bricks, dishes on the side studs
a.put('3062b', LBG, I, [0.5, 3 * P, 1]);
const dishes = [];
// the upper side-stud brick sits one grey round brick higher, so the two 2 × 2 dishes clear each other
for (const [k, d] of [[0, [0, 0, 1]], [3, [-1, 0, 0]]]) {                    // 87087's side stud is local +z; RYq(3) turns it to −x
  const yb = (k === 0 ? 3 : 9); a.put('87087', WHITE, RYq(k), [0.5, (yb + 3) * P, 1]);
  dishes.push({ p: [0.5 + d[0] * 0.5, (yb + 3) * P - 0.5, 1 + d[2] * 0.5], d });
}
for (const { p, d } of dishes) {
  const ey = d, ex = d[0] ? [0, 0, -1] : [1, 0, 0]; const ez = [ex[1] * ey[2] - ex[2] * ey[1], ex[2] * ey[0] - ex[0] * ey[2], ex[0] * ey[1] - ex[1] * ey[0]];
  a.put('4740', WHITE, basis(ex, ey, ez), [p[0] + d[0] * 0.4, p[1], p[2] + d[2] * 0.4]);
}
a.put('3062b', LBG, I, [0.5, 9 * P, 1]);   // between the two side-stud bricks
a.put('98138', WHITE, I, [0.5, 13 * P, 1]);                                   // a round tile caps the rack
console.log('la_mast', JSON.stringify(a.write().bom), a.parts.length, 'parts; tower', y, 'plates to the whip, tip', tip);
