// Seoul life layer (ko-life, 2026-10-06): the chimaek picnic pair on the Han lawn as one assembly of real parts, because minifig2 cannot sit.
//   LDRAW_DIR=<main repo>/vendor/ldraw-lib/ldraw node tools/ldraw/asm-ko-life.mjs && node tools/ldraw/bake.mjs ko_picnic.ldr --force
// Scheme: docs/refs/seoul-hangang/SCHEME.md §4 (signed off 2026-10-06, decision 3: the seated assembly). Build notes: docs/refs/seoul-real/BUILD.md.
// Frame (asm-ours.mjs): footprint min corner (0, 0), x east, z south (the figures face +z, the river and the camera), y up; the LDraw origin is
// the footprint's bottom centre (3, 0, 2). The mat is a White Plate 4 × 6 (3032) on the lawn's studs; the scene lays nothing under its cells.
//   0–1   mat 3032, its 24 studs: the two figures' rear leg holes take four, the box plate four, Medium Azure 1×1 tiles a gingham on rows 0–1
//   1–3   chicken box: Plate 2 × 2 (3022) + Tile 2 × 2 (3068b) printed 치킨 (ko_chicken_box_m) between the two figures
//   1–13  two seated minifigs (LA's coaster riders, asm-la-park.mjs): hips 3815 with the legs 3816 / 3817 turned 90° on the hip pin, feet
//         forward; each leg's rear hole (LDraw leg-local (±10, 18, 5), from 3816s02.dat) lands on a stud of the mat's front row, 0.9 stud in
//         front of the hips, and the legs reach out over the mat's front edge (a leg lies flat only where it has a hole: over any other stud
//         it would stand on the stud's top), one plate above the lawn's studs — people sitting at the edge of their mat, facing the river
//   held  v2: both raise a beer bottle (95228, Reddish Brown — opaque, so it reads) by the neck — A in her left hand, B in his right (the inner hands) — the arm level (−90°), the
//         bottle held out forward along that clip's bore: a toast over the 치킨 box (the drumstick read as an orange blob, Eric 2026-10-06).
// r8 (Eric 2026-10-07: the pair sat half over the water; no proper seat): a bigger mat, White Plate 6 × 8 (3036), whole on the lawn; each
//         figure on a Tan 2 × 2 cushion plate (its leg holes on the cushion's front row), the legs one plate above the mat's studs and ending
//         on the mat; the 치킨 box (a 2 × 2 brick, printed tile) between their feet, in front of them; she lifts a drumstick (33057, Medium
//         Nougat — fried, not raw orange) upright in her inner forward hand, he holds a beer bottle (95228, Reddish Brown) out level in his.
//         Footprint 8 × 6, origin (4, 0, 3).
import { Asm } from './asm-ours.mjs';
const RBROWN = 70;   // r5 (lead, judge r3): opaque — Trans-Brown rendered as a ghost glass
const WHITE = 15, AZURE = 322, BLACK = 0, YEL = 14, SANDBLUE = 379, DKBLUE = 272, DKGREEN = 288, DKBROWN = 308, TAN = 19, MNOUGAT = 84;
const a = new Asm('ko_picnic', [4, 0, 3]);
const P = 0.4;

// ---- the mat (8 along x, 6 along z as moulded), the two cushions (x 1–2 and 5–6, rows 1–2), the box between the feet (x 3–4, rows 3–4)
a.up('3036', WHITE, 0, 0, 0);
for (const x of [1, 5]) a.up('3022', TAN, x, 1, 1);
a.up('3003', WHITE, 3, 1, 3); a.up('3068b', WHITE, 3, 4, 3);
// gingham on every cell nothing else takes: not the cushions, not under the legs (x 1–2 / 5–6, rows 3–4: the legs lie one plate above the
// mat, a tile there would touch them), not the box
const free = (x, z) => !(z >= 1 && z <= 4 && ((x >= 1 && x <= 2) || (x >= 5 && x <= 6))) && !(z >= 3 && z <= 4 && x >= 3 && x <= 4);
for (let x = 0; x < 8; x++) for (let z = 0; z < 6; z++) if (free(x, z)) a.up('3070b', (x + z) % 2 === 0 ? AZURE : WHITE, x, 1, z);
// ---- seated minifig, in LDraw minifig coordinates (origin at the neck, y down, facing −z), converted to ours about the hips' origin
const D2R = Math.PI / 180;
const mm = (A, B) => [0, 1, 2].flatMap((i) => [0, 1, 2].map((j) => A[i * 3] * B[j] + A[i * 3 + 1] * B[3 + j] + A[i * 3 + 2] * B[6 + j]));
const apv = (M, v) => [0, 1, 2].map((i) => M[i * 3] * v[0] + M[i * 3 + 1] * v[1] + M[i * 3 + 2] * v[2]);
const rX = (q) => [1, 0, 0, 0, Math.cos(q), -Math.sin(q), 0, Math.sin(q), Math.cos(q)], rZ = (q) => [Math.cos(q), -Math.sin(q), 0, Math.sin(q), Math.cos(q), 0, 0, 0, 1];
const I3 = [1, 0, 0, 0, 1, 0, 0, 0, 1], S = [1, 0, 0, 0, -1, 0, 0, 0, -1];
const TILT = 9.782 * D2R, POSE = { d: 0, f: -45, h: -90, u: -135 };
const ARM = { R: { file: '3818', P: [-15.552, 9, 0], tilt: TILT, hand: [-23.6904, 26.774, -9.8982] }, L: { file: '3819', P: [15.552, 9, 0], tilt: -TILT, hand: [23.6904, 26.774, -9.8982] } };
const GRIP = [0, -0.8229, -9.8948];                           // the hand clip's centre, 3820.dat !HELP
const LEG_HOLE = [0, 18, 5];                                  // the rear hole of a leg (3816s02.dat), leg-local, x ±10
/** one seated figure: hips' origin at `hip` (ours, asm frame); returns the two hands' grip points and bore axes (ours) */
function seated(hip, o) {
  const toOurs = (p) => [hip[0] + p[0] / 20, hip[1] - (p[1] - 32) / 20, hip[2] - p[2] / 20], M = (m) => mm(mm(S, m), S);
  const put = (id, col, m, p) => a.put(id, col, M(m), toOurs(p));
  put('3815', o.legs, I3, [0, 32, 0]);
  const SEAT = [1, 0, 0, 0, 0, 1, 0, -1, 0];                  // Rx(−90°): the legs forward
  for (const leg of ['3816', '3817']) put(leg, o.legs, SEAT, [0, 44, 0]);
  put('973', o.torso, I3, [0, 0, 0]);
  const grips = {};
  for (const side of ['R', 'L']) {
    const A = ARM[side], th = POSE[o.pose[side]] * D2R, armM = mm(rZ(A.tilt), rX(th));
    const d = apv(rZ(-A.tilt), A.hand.map((v, i) => v - A.P[i])); const hp = apv(armM, d).map((v, i) => v + A.P[i]); const handM = mm(armM, rX(45 * D2R));
    put(A.file, o.torso, armM, A.P); put('3820', YEL, handM, hp);
    const g = apv(handM, GRIP).map((v, i) => v + hp[i]); const ax = apv(handM, [0, 1, 0]);
    grips[side] = { p: toOurs(g), axis: [ax[0], -ax[1], -ax[2]] };
  }
  put('3626c', YEL, I3, [0, -24, 0]); put(o.hair[0], o.hair[1], I3, [0, -24, 0]);
  const holes = [-10, 10].map((x) => toOurs(apv(SEAT, LEG_HOLE).map((v, i) => v + [x, 44, 0][i])));
  return { grips, holes };
}
// hips: x on a grid line (the two leg holes on two stud columns), z 0.9 behind the holes' row (row 2 of the cushion's front, cell centre 2.5);
// the leg undersides (21 LDU under the hips' origin) on the cushion's top
const SEAT_Y = 2 * P + 21 / 20;
const A = seated([2, SEAT_Y, 2.5 - 0.9], { torso: SANDBLUE, legs: DKBLUE, hair: ['12890', BLACK], pose: { R: 'd', L: 'f' } });
const B = seated([6, SEAT_Y, 2.5 - 0.9], { torso: DKGREEN, legs: BLACK, hair: ['3901', DKBROWN], pose: { R: 'h', L: 'f' } });

// ---- held props: the grip point of each mould on the hand's clip centre
// drumstick 33057: the bone is the r 4 cylinder from its origin up 12.08 LDU; the hand closes on its middle (ours y +0.3). Turned half round
// (RY 2) so the meat, which leans toward LDraw +z, leans out in front of her — upright in the forward hand, whose clip bore is vertical.
// r9 (Eric: the clip must really close on the bone): the bone's axis laid along the clip's bore (the forward hand's bore leans ~10° off
// vertical), the bone's middle on the clip centre; local z still turned to −z so the meat leans out in front of her
{ const u = A.grips.L.axis.map((v) => -v), ez = [0, 0, -1], ex = [-u[1], u[0], 0];   // ex = u × ez
  const R = [ex[0], u[0], ez[0], ex[1], u[1], ez[1], ex[2], u[2], ez[2]];
  a.put('33057', MNOUGAT, R, A.grips.L.p.map((v, i) => v - apv(R, [0, 0.3, 0])[i])); }
// bottle 95228 (origin at the top of the neck), gripped 0.25 under it: his inner arm level (h), whose clip bore runs up-back / down-forward —
// the neck in the fist pointing up-back, the bottle held out forward over the box
function bottle(grip) { const u = grip.axis.map((v) => -v); const ex0 = [1, 0, 0].map((v, i) => v - u[0] * u[i]); const n = Math.hypot(...ex0); const ex = ex0.map((v) => v / n);
  const ez = [ex[1] * u[2] - ex[2] * u[1], ex[2] * u[0] - ex[0] * u[2], ex[0] * u[1] - ex[1] * u[0]]; const R = [ex[0], u[0], ez[0], ex[1], u[1], ez[1], ex[2], u[2], ez[2]];
  a.put('95228', RBROWN, R, grip.p.map((v, i) => v - apv(R, [0, -0.25, 0])[i])); }
bottle(B.grips.R);

const fmt = (v) => v.map((x) => +x.toFixed(3));
console.log('A holes', JSON.stringify(A.holes.map(fmt)), 'grip L', fmt(A.grips.L.p), 'axis', fmt(A.grips.L.axis));
console.log('B holes', JSON.stringify(B.holes.map(fmt)), 'grip R', fmt(B.grips.R.p), 'axis', fmt(B.grips.R.axis));
const out = a.write(); console.log('ko_picnic:', a.parts.length, 'parts', JSON.stringify(out.bom));
