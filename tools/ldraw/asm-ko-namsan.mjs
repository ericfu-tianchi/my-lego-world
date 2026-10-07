// N Seoul Tower (2026-10-06) — one assembly of real parts, authored in our frame (tools/ldraw/asm-ours.mjs).
//   LDRAW_DIR=<main repo>/vendor/ldraw-lib/ldraw node tools/ldraw/asm-ko-namsan.mjs && node tools/ldraw/bake.mjs seoul_tower.ldr --force
// Scheme: docs/refs/seoul-namsan/SCHEME.md §2.4 (level table); build notes docs/refs/seoul-namsan/BUILD.md.
// Frame: box x 0..8, z 0..8, axis at (4, 4); the LDraw origin is the axis at the plateau top (T). Every member sits on that one axis.
// Plates above T:
//   0–7     base building: a ring of four 4×4 corner-round bricks, White under Dark Bluish Gray (the glass band); roof a 6×6 round plate
//           inside four 4×4 corner-round macaroni tiles
//   7–13    lower cylinder: two 4×4 round bricks on the roof quarters' centre studs (they tie the four quarters together)
//   13–18   two lattice rings: a 6×6 webbed dish, studs up, on a 2×2 round spacer, a 4×4 round plate between them
//   18–42   shaft: eight 2×2 round bricks, a Technic axle 6 threaded through their axle holes as a spine
//   42–58   pod: Dark Bluish Gray 4×4 + 6×6 underside, ten 6×6 round plates (Light Bluish Gray floors / two-plate Black glass), a 4×4 upper
//           drum Dark / Light / Dark, a White 4×4 roof
//   58–86.5 collar (2×2 round brick), 2×2 round plate with one centre stud, mast of five 1×1 round bricks Red / White, three open-stud 1×1
//           round plates White Red White threaded on a Red bar 4L whose foot sits in the top round brick's hollow stud
import { Asm, bbox, PLATE, RY } from './asm-ours.mjs';
const WHITE = 15, LBG = 71, DBG = 72, RED = 4, BLACK = 0;
const C = [4, 0, 4];
const a = new Asm('seoul_tower', C);
/** place part `id` so the centre of its baked bbox's bottom face sits at world (x, plate y, z) */
function at(id, color, x, y, z, R = RY(0)) {
  const b = bbox(id); const corners = [];
  for (const cx of [b[0], b[3]]) for (const cy of [b[1], b[4]]) for (const cz of [b[2], b[5]]) corners.push([0, 1, 2].map((i) => R[i * 3] * cx + R[i * 3 + 1] * cy + R[i * 3 + 2] * cz));
  const lo = [0, 1, 2].map((i) => Math.min(...corners.map((c) => c[i]))), hi = [0, 1, 2].map((i) => Math.max(...corners.map((c) => c[i])));
  return a.put(id, color, R, [x - (lo[0] + hi[0]) / 2, y * PLATE - lo[1], z - (lo[2] + hi[2]) / 2]);
}
/** body height in plates (the bbox without its top stud) */
const body = (id) => { const b = bbox(id); return Math.round(((b[4] > 0.01 && b[4] <= 0.201 ? 0 : b[4]) - b[1]) / PLATE); };
let cur = 0;
const stack = (id, color) => { at(id, color, C[0], cur, C[2]); cur += body(id); };
// ---- base building: four quarters round the axis (2577's origin is its square corner, the round corner diagonally opposite; 30565's origin is
// its centre, the round corner at (+2, +2)), so quarter k is the part turned k times about the axis
for (const [color, y] of [[WHITE, 0], [DBG, 3]]) for (let k = 0; k < 4; k++) a.put('2577', color, RY(k), [C[0], (y + 3) * PLATE, C[2]]);
// roof (lead r4: no exposed studs on the ring): a White 6×6 round plate on the axis ties the four quarters, four 4×4 corner-round
// macaroni tiles (r 3–4, origin at the circle's centre like the bricks) close the rim flush with it
at('11213', WHITE, C[0], 6, C[2]);
for (let k = 0; k < 4; k++) a.put('27507', WHITE, RY(k), [C[0], 7 * PLATE, C[2]]);
cur = 7;
stack('87081', WHITE); stack('87081', WHITE);                                  // 7–13
for (let r = 0; r < 2; r++) { stack('4032a', WHITE); at('4285b', LBG, C[0], cur - 1, C[2]); cur += 1; if (r === 0) stack('60474', WHITE); }   // 13–18: spacer, dish (its lip hangs a plate below its seat)
const SHAFT = cur;
for (let k = 0; k < 8; k++) stack('3941', WHITE);                            // 18–42 (judge r1: 18 plates read short beside Miniland; 24 is the scheme's own limit)
a.put('3706', DBG, [0, -1, 0, 1, 0, 0, 0, 0, 1], [C[0], ((SHAFT + cur) / 2) * PLATE, C[2]]);   // axle 6 (15 plates) on the axis, centred in the shaft, threading its middle five bricks
const POD = cur;
stack('60474', DBG); stack('11213', DBG);                                    // underside, stepped
for (const c of [LBG, BLACK, BLACK, LBG, BLACK, BLACK, LBG, BLACK, BLACK, LBG]) stack('11213', c);   // judge r1: Dark Bluish Gray glass read as grey stripes; Black reads as glass   // lower drum: three glass rows two plates deep between thin floors (1:1 stripes read as a striped drum)
for (const c of [BLACK, LBG, BLACK, WHITE]) stack('60474', c);   // judge r2: the upper drum's glass Black too                    // upper drum Ø4 and the roof
const ROOF = cur;
stack('3941', WHITE); stack('18674', WHITE);                                 // collar, flange onto one centre stud
const MAST = cur;
for (let k = 0; k < 5; k++) stack('3062b', k % 2 ? WHITE : RED);   // lead r4: a thinner tip — five round bricks, then rings on the bar
const BAR = cur;
for (const c of [WHITE, RED, WHITE]) stack('85861', c);
at('30374', RED, C[0], BAR - 0.5, C[2]);                                      // the bar's foot half a plate into the top round brick's hollow stud
const tip = BAR - 0.5 + 10;
const out = a.write();
console.log(`seoul_tower: ${out.file} ${a.parts.length} parts · shaft ${SHAFT}–${POD} · pod ${POD}–${ROOF} · mast ${MAST} · tip ${tip} plates`, JSON.stringify(out.bom));
