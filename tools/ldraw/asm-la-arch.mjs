// Santa Monica Pier entrance arch (1941) and the Route 66 "End of the Trail" sign (2026-10-04), two small assemblies of real parts.
//   LDRAW_DIR=<main repo>/vendor/ldraw-lib/ldraw node tools/ldraw/asm-la-arch.mjs && node tools/ldraw/bake.mjs la_arch.ldr la_sign66.ldr --force
// Scheme: docs/refs/la-santa-monica/SCHEME.md §4. Frames: origin = footprint bottom centre on the deck plates' top (the planks are left out
// under them); y in plates below.
//   arch   v4 (lead review: one thin arch with a block on top): 2 × 16 across the approach. Two stepped Art Deco pylons — a 2×2 Dark Blue
//          post, a 2×3 head whose lower stripe group (Bright Light Orange / Dark Blue plates) carries the band's foot, an upper head of two
//          columns (a mustard vertical bar beside a blue one) under the upper stripes, a stepped cap — and between them the band, two raised
//          arches 1×12×3 side by side, its stepped shoulders smoothed with cheese slopes; on top a white cartouche (two raised arches 1×6,
//          tiled, its ends rounded down to the band with curved 1×1 slopes). r2 (2026-10-05): the cartouche is a 1×6 brick, lettered SANTA MONICA;
//          the band's east arch is lettered too (prints la_arch_cartouche / la_arch_band, set in la-pier.ts).
//   66     a Dark Bluish Gray post of 1×1 bricks, a 1×1 brick with a side stud, the white 2×2 round tile with the printed 66 on that stud
import { Asm, PLATE } from './asm-ours.mjs';
const DB = 272, BLO = 191, WHITE = 15, DBG = 72;

const a = new Asm('la_arch', [0, 0, 0]);
const ROWS = [-1, 0];                              // the band is two raised arches deep (x −1…1)
// r3 (Eric, 2026-10-05: the real capitals carry three VERTICAL yellow lines between the two groups of three horizontal bands, on slim blue
// posts — eric-arch-photo.png, real-entrance-sign.jpg): each pylon is a slim 1 × 2 post under a capital 3 wide (z) × 4 deep (x), so the
// band (two rows, x −1…1) tucks into its core and both faces carry the trim:
//   lower bands  y 12–17  five plates Bright Light Orange / Dark Blue, each layer a 3 × 3 plate beside a 1 × 3, the seam alternating
//   fins         y 17–27  the core in Dark Blue bricks (the band's leg in the inner column); in front of it on each face three 4L bars in
//                         Bright Light Orange standing in open-stud round plates top and bottom — the three vertical lines, blue between
//   upper bands  y 27–32  as the lower; the top layer's face rows are tiles (both groups)
//   cap          y 32–34  a Dark Blue 2 × 3 plate stepped in from the face rows, tiled — the Art Deco step
const LEG = 17;
const bands = (m, zc, y0, topTiles) => [BLO, DB, BLO, DB, BLO].forEach((c, i) => {
  const z0 = Math.min(zc(-8), zc(-6)), y = y0 + i;
  if (topTiles && i === 4) { a.up('3021', c, -1, y, z0, 1); for (const x of [-2, 1]) a.up('63864', c, x, y, z0, 1); return; }
  if (i % 2 === 0) { a.up('11212', c, -2, y, z0); a.up('3623', c, 1, y, z0, 1); } else { a.up('3623', c, -2, y, z0, 1); a.up('11212', c, -1, y, z0); }
});
for (const m of [1, -1]) {                          // left pylon (m 1: cells z −8…−6), right pylon mirrored (cells 5…7)
  const zc = (c) => (m > 0 ? c : -1 - c);          // mirror a left-side cell index
  for (let k = 0; k < 4; k++) a.up('3004', DB, -1, 3 * k, zc(-7));                                   // post 1 × 2 (x), cell −7: slim under the capital
  bands(m, zc, 12, true);
  for (const y of [LEG, LEG + 3, LEG + 6]) a.up('3003', DB, -1, y, Math.min(zc(-8), zc(-7)));          // core: outer two columns
  a.up('3022', DB, -1, LEG + 9, Math.min(zc(-8), zc(-7)));
  for (const X of ROWS) { for (const y of [LEG + 3, LEG + 6]) a.up('3005', DB, X, y, zc(-6)); a.up('3024', DB, X, LEG + 9, zc(-6)); }   // core: inner column over the band's end step
  for (const x of [-2, 1]) for (const c of [-8, -7, -6]) {                                           // the fins
    a.up('85861', DB, x, LEG + 9, zc(c));                                                            // an open-stud round plate under the upper bands
    a.up('30374', BLO, x, LEG, zc(c));                                                               // the bar clutched in its open stud, its foot on the lower bands' tile
  }
  bands(m, zc, LEG + 10, true);
  a.up('3021', DB, -1, LEG + 15, Math.min(zc(-8), zc(-6)), 1);                                        // the cap, a step in from the face rows
  for (const c of [-8, -7, -6]) a.up('3069b', DB, -1, LEG + 16, zc(c));
}
for (const X of ROWS) {
  a.up('14707', DB, X, LEG, -6, 1);                // raised arch 1×12×3: legs on the capitals' inner columns (−6 and 5)
  for (const z of [-5, 4]) { a.up('3024', DB, X, LEG + 6, z); a.up('54200', DB, X, LEG + 7, z, z < 0 ? 2 : 0); }   // the outer shoulder step: plate + cheese slope, high side inward
  a.up('3009', WHITE, X, LEG + 9, -3, 1); a.up('6636', WHITE, X, LEG + 12, -3, 1);   // cartouche: a 1×6 brick, tiled (r2: v4's raised arch 1×6 left a 1-plate strip over its opening, too thin to letter SANTA MONICA)
  a.up('49307', WHITE, X, LEG + 9, -4, 2); a.up('49307', WHITE, X, LEG + 9, 3, 0);   // its ends rounded down to the band (curved 1×1, high side inward)
}
let out = a.write(); console.log('la_arch:', a.parts.length, 'parts', JSON.stringify(out.bom));

const s = new Asm('la_sign66', [0, 0, 0]);
for (let k = 0; k < 3; k++) s.up('3005', DBG, -0.5, 3 * k, -0.5);
const head = s.up('87087', DBG, -0.5, 9, -0.5, 0);  // side stud toward +z (south, the camera)
const st = s.side(head).find((q) => q.d[2] > 0.5); if (!st) throw new Error('87087: no +z side stud');
s.onStud('14769', WHITE, st, [1, 0, 0], 'x');
s.up('3070b', DBG, -0.5, 12, -0.5);
out = s.write(); console.log('la_sign66:', s.parts.length, 'parts', JSON.stringify(out.bom));
