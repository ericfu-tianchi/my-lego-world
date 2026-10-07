// N Seoul Tower at the v2 island's scale (2026-10-07, docs/refs/seoul-island/LAYOUT-v2.md): 58.5 plates on the range's east shoulder (44; Eric r7: taller and slenderer, clearly above the peak), so
// the tower stands on a hill of its own height (243 m hill, 236 m tower). Proportions after LEGOLAND Korea Miniland (seoul-namsan/
// legoland-korea-miniland-tower-crop.png; lead r3): a 2 × 2 round shaft, a Ø4 pod about twice its width with two glass bands, a mast in red
// and white bands about a third of the height.
//   LDRAW_DIR=<main repo>/vendor/ldraw-lib/ldraw node tools/ldraw/asm-ko-tower-s.mjs && node tools/ldraw/bake.mjs seoul_tower_s.ldr --force --hull
// Plates above the pad T (frame x 0..6, z 0..6, axis (3, 3); the LDraw origin is the axis at T):
//   0–2   two 4 × 4 round plates (the base building), a macaroni ring on its rim round the shaft
//   2–25  shaft: 2 × 2 round bricks on the inner studs; two Light Bluish Gray 2 × 2 round plates as flush ring bands
//   25–33 pod: 4 × 4 round plates, Dark Bluish Gray underside, Black glass between Light Bluish Gray floors
//   33–37 a macaroni ring on the pod's roof, the upper drum (a 2 × 2 round brick), a 2 × 2 round plate with one centre stud
//   37–49 mast: 1 × 1 round bricks Red / White / Red / White; then open-stud 1 × 1 round plates Red / White on a Red bar 4L whose foot sits
//         in the top brick's hollow stud (tip 58.5)
import { Asm, bbox, PLATE, RY } from './asm-ours.mjs';
const WHITE = 15, LBG = 71, DBG = 72, RED = 4, BLACK = 0;
const C = [3, 0, 3];
const a = new Asm('seoul_tower_s', C);
function at(id, color, x, y, z, R = RY(0)) {
  const b = bbox(id); const corners = [];
  for (const cx of [b[0], b[3]]) for (const cy of [b[1], b[4]]) for (const cz of [b[2], b[5]]) corners.push([0, 1, 2].map((i) => R[i * 3] * cx + R[i * 3 + 1] * cy + R[i * 3 + 2] * cz));
  const lo = [0, 1, 2].map((i) => Math.min(...corners.map((c) => c[i]))), hi = [0, 1, 2].map((i) => Math.max(...corners.map((c) => c[i])));
  return a.put(id, color, R, [x - (lo[0] + hi[0]) / 2, y * PLATE - lo[1], z - (lo[2] + hi[2]) / 2]);
}
const body = (id) => { const b = bbox(id); return Math.round(((b[4] > 0.01 && b[4] <= 0.201 ? 0 : b[4]) - b[1]) / PLATE); };
let cur = 0;
const stack = (id, color) => { at(id, color, C[0], cur, C[2]); cur += body(id); };
// macaroni quarter rings close every exposed rim (no bare studs on a sculpture): 27925 (r 1–2, its circle's centre at the bbox's min corner)
// round a 4 × 4's inner 2 × 2
const ring4 = (top, color) => { for (let k = 0; k < 4; k++) { const R = RY(k); const off = [R[0] * -0.5 + R[2] * -0.5, 0, R[6] * -0.5 + R[8] * -0.5]; a.put('27925', color, R, [C[0] - off[0], top * PLATE, C[2] - off[2]]); } };
// lead r3 (after Miniland): a 2 × 2 round shaft, the Ø4 pod ≈ 2 × its width, the mast in red and white bands
stack('60474', WHITE); stack('60474', WHITE); ring4(3, WHITE);                  // 0–2: the base building (two 4 × 4 round plates), its rim tiled round the shaft
const SHAFT = cur;
for (const id of ['3941', '3941', '4032a', '3941', '3941', '3941', '4032a', '3941', '3941']) stack(id, id === '4032a' ? LBG : WHITE);   // 2–25: shaft, two ring bands flush with it
// (Eric r7: short and stubby — the shaft 14 → 23 plates; the tower may now rise clearly above the peak)
// (r3: 4 × 4 ring plates read as discs as wide as the pod; Miniland's rings barely stand proud of the shaft)
const POD = cur;
for (const c of [DBG, LBG, BLACK, BLACK, LBG, BLACK, BLACK, LBG]) stack('60474', c);   // 25–33: underside, two glass bands, three floors
ring4(cur + 1, LBG); stack('3941', WHITE); stack('18674', WHITE);              // 33–37: the pod's roof ring, the upper drum, the collar plate
const MAST = cur;
for (const c of [RED, WHITE, RED, WHITE]) stack('3062b', c);                 // 37–49: mast bands
const BAR = cur;
for (const c of [RED, WHITE]) stack('85861', c);   // 49–51: two more bands on the bar
at('30374', RED, C[0], BAR - 0.5, C[2]);
const tip = BAR - 0.5 + 10;
const out = a.write();
console.log(`seoul_tower_s: ${out.file} ${a.parts.length} parts · shaft ${SHAFT}–${POD} · pod ${POD}–${MAST} · mast ${MAST} · tip ${tip} plates`, JSON.stringify(out.bom));
