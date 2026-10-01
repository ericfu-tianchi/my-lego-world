// Supertree Grove v6 (2026-10-01) — two Supertrees and the OCBC Skyway as one assembly of real parts (tools/ldraw/asm-ours.mjs).
//   LDRAW_DIR="$PWD/vendor/ldraw-lib/ldraw" node tools/ldraw/asm-grove.mjs && node tools/ldraw/bake.mjs grove6.ldr --force
// Targets: docs/refs/supertree-moc/real-supertree-ocbc-skyway-commons-2012.jpg, NOTES.md, docs/refs/singapore-supertree-lego.png.
// What makes a Supertree: a slim trunk of steel lattice and planting that flares in its top quarter into a wine-glass canopy of radial
// ribs 3–4× the trunk's width; three heights in a cluster; the orange Skyway slung between two of them at about half height.
//   trunk    2×2 bundle of 1×1 round bricks, Magenta and Dark Green in a checker (steel lattice and planting; Dark Purple read blue), every third course bound by a Dark Green
//            2×2 round plate (a planter ring); every other course one brick is a side-stud brick carrying a three-leaf plate — the clinging plants,
//            turning a quarter round the trunk each course
//   canopy   2×2 round plate with axle hole → round tile with hole → a 4×4×2 cone upside down on a 3L axle (2 → 4 wide) → an inverted
//            webbed 6×6 dish upside down, its studs in the cone: 4 → 6, the ribs radiating to the rim
//   skyway   at the second planter ring both trees carry a 2×3 plate pointing at each other; two rows of Bright Light Orange plates span
//            between them; 1×2 plates with handles along both edges are the railings
// Frame: box x 0..16 × z 0..8 (the tall tree's canopy spans z 0..8); trunks at x 3..5 and 12..14, z 3..5.
import { Asm, bbox, PLATE } from './asm-ours.mjs';
const MAG = 26, DP = 85, DG = 288, G = 2, BG = 10, LIME = 27, ORANGE = 191;
const a = new Asm('grove6', [8, 0, 4]);
const X = [1, 0, 0], Y = [0, 1, 0], Z = [0, 0, 1], neg = (v) => v.map((x) => -x);
const FLIP = [1, 0, 0, 0, -1, 0, 0, 0, -1];                                 // upside down (π about x)
const LEAVES = [G, BG, LIME, DG];

/** a side-stud 1×1 brick at (x, z) facing d */
function snot(x, y, z, d, color) {
  for (let r = 0; r < 4; r++) { const rec = a.up('87087', color, x, y, z, r); const st = a.side(rec); if (st.length === 1 && st[0].d.join() === d.join()) return st[0]; a.parts.pop(); }
  throw new Error('snot');
}
/** one Supertree; trunk min corner (tx, tz), `periods` = courses per planter ring; returns the plate level of each ring */
function tree(tx, tz, periods, big, skywayRing, skywayDir) {
  const rings = []; let y = 0, k = 0;
  a.up('4032a', DG, tx, y, tz); y += 1;                                      // planter at the foot
  const cells = [[0, 0], [1, 0], [0, 1], [1, 1]]; const out = { '0,0': [neg(X), neg(Z)], '1,0': [X, neg(Z)], '0,1': [neg(X), Z], '1,1': [X, Z] };
  periods.forEach((n, pi) => {
    for (let c = 0; c < n; c++, k++) {
      const leafCell = cells[(k >> 1) % 4]; const leafDir = out[leafCell.join()][(k >> 3) % 2];
      for (const [i, j] of cells) {
        const col = (i + j + k) % 2 ? MAG : DG;                                   // steel and planting in a checker
        const leaf = k % 2 === 0 && !(pi === skywayRing + 1 && c === 0 && leafDir[0] === skywayDir);   // every other course; none into the skyway
        if (leaf && i === leafCell[0] && j === leafCell[1]) { const s = snot(tx + i, y, tz + j, leafDir, col); a.onStud('32607', LEAVES[k % 4], s, leafDir[0] ? Z : X, 'x'); }
        else a.up('3062b', col, tx + i, y, tz + j);
      }
      y += 3;
    }
    rings.push(y);
    if (pi === skywayRing) a.up('3021', DG, skywayDir > 0 ? tx : tx - 1, y, tz, 0);   // 2×3: one stud out toward the other tree
    else a.up('4032a', DG, tx, y, tz);
    y += 1;
  });
  // canopy
  const top = y - 1;                                                         // the last ring (a 4032a with the axle hole)
  a.up('15535', MAG, tx, y, tz); const tileTop = (y + 1) * PLATE;
  a.put('4519', DP, [0, -1, 0, 1, 0, 0, 0, 0, 1], [tx + 1, top * PLATE + 1.475, tz + 1]);   // axle 3 standing in the hole (its local x → up)
  const cb = bbox('3943b'); a.put('3943b', MAG, FLIP, [tx + 1, tileTop + cb[4], tz + 1]);  // cone upside down: its stud tip rests on the tile
  const coneTop = tileTop + cb[4] - cb[1];
  // dish upside down, studs into the cone's wide end — webbed: the ribs (a solid 8×8 dish read as a tray)
  a.put('4285b', MAG, FLIP, [tx + 1, coneTop, tz + 1]);
  return rings;
}
const A = tree(3, 3, [3, 3, 2], true, 1, +1);                                // tall: rings at 10, 20, 27 → canopy to ~36
const B = tree(12, 3, [3, 3, 1], false, 1, -1);                              // medium
if (A[1] !== B[1]) throw new Error('skyway rings differ');
// skyway on the two 2×3 ledges (A: x 3..6 → ledge cell x 5; B: x 11..14 → ledge cell x 11)
const sy = A[1] + 1;
a.up('3710', ORANGE, 5, sy, 3); a.up('3623', ORANGE, 9, sy, 3); a.up('3623', ORANGE, 5, sy, 4); a.up('3710', ORANGE, 8, sy, 4);
for (let x = 6; x < 11; x += 2) { a.up('48336', ORANGE, x, sy + 1, 3, 2); a.up('48336', ORANGE, x, sy + 1, 4, 0); }   // railings, handles outward
const bare = a.exposed(); if (bare.length) console.warn(`${bare.length} exposed side studs`, JSON.stringify(bare.slice(0, 8)));
const out = a.write(); console.log('grove:', out.file, a.parts.length, 'parts', JSON.stringify(out.bom), 'rings', A, B);
