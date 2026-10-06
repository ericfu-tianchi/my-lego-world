// Pacific Wheel, Santa Monica Pier (2026-10-04) — one assembly of real Technic parts, authored in our frame (tools/ldraw/asm-ours.mjs).
//   LDRAW_DIR=<main repo>/vendor/ldraw-lib/ldraw node tools/ldraw/asm-la-wheel.mjs && node tools/ldraw/bake.mjs la_wheel.ldr --force
// Scheme: docs/refs/la-santa-monica/SCHEME.md §1 (signed off 2026-10-04). Build notes: docs/refs/la-santa-monica/BUILD.md.
// Frame: x along the wheel's face, z its axle, y up; the LDraw origin is the deck under the hub (the wheel's centre plane is a cell centre).
//   rim     20-gon of thin 5L liftarms (holes 4 apart), vertices at 9° + 18k, R = 2 / sin 9° = 12.785; two layers per rim, rims at |z| 1.5–2.5
//   drum    10-gon of 3L beams (holes 2 apart), vertices at 36j, r = 1 / sin 18° = 3.236; two layers per side at |z| 0.5–2.5
//   spokes  white 10L axles in axle/pin cross blocks turning on the vertex axles, drum vertex 36j → rim vertex 36j ± 27°, each line shifted
//           1 stud toward the hub; front +27° (odd k), back −27° (v1 used 11L beams: a toy wheel)
//   axles   a 7L axle through every rim vertex (spoke, two rim layers, bush, hanger, bush, rim layers, spoke or cap), a 7L through every drum
//           vertex, a 10L through the two lowest, which also carry the A-frame legs and the hub bracket
//   legs    15L beams at 60° from the lowest drum vertices (x ±1) to a Technic brick on a grey footing brick (x ±8); a 13L crossbar outside
//   hub     a white 4×4 dish, dome out, front and back, on a bracket from the two lowest drum axles
//   gondola hanger (axle connector: its cross hole on the vertex axle, its socket down) → 2L axle pole → canopy (2×2 round plate, LBG, 45°) →
//           tub (a truncated 2×2 cone turned over, Red / Yellow alternating); the vertex axle turns in the rim's round holes, so the tub hangs level
import { Asm, bbox, basis, cross } from './asm-ours.mjs';
const WHITE = 15, LBG = 71, RED = 4, YEL = 14, SILVER = 179;
let a;   // the assembly being written, through an offset (addWheel)
const RAD = Math.PI / 180;
const R = 2 / Math.sin(9 * RAD), r = 1 / Math.sin(18 * RAD);
// heights: the foot brick (3 plates) under a Technic brick whose hole is 0.5 below its top → foot hole at 1.9; leg rises 14 × sin 60°
const FOOT = [8, 1.9]; const LEGTOP = [1, 0]; const LEG_DY = Math.sqrt(14 * 14 - 49);
const HUB = FOOT[1] + LEG_DY + r * Math.cos(18 * RAD);           // the lowest drum vertices sit r·cos 18° below the hub
const vtx = (rad, deg) => [rad * Math.cos(deg * RAD), HUB + rad * Math.sin(deg * RAD)];
const Z = [0, 0, 1];
export const WHEEL = { HUB, R, r };
/** a beam (holes along local y, length along local z) between hole points p and q in the plane z = zc */
function beam(id, color, p, q, zc) {
  const d = [q[0] - p[0], q[1] - p[1], 0]; const L = Math.hypot(d[0], d[1]); const ez = [d[0] / L, d[1] / L, 0]; const ey = Z; const ex = cross(ey, ez);
  return a.put(id, color, basis(ex, ey, ez), [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2, zc]);
}
/** an axle or pin (length along local x) through point p, along world z, centred at zc */
const AXZ = basis([0, 0, 1], [1, 0, 0], [0, 1, 0]);
const axleZ = (id, color, p, zc) => a.put(id, color, AXZ, [p[0], p[1], zc]);
/** a bush (axis along local z) on a z axle at zc */
const bushZ = (id, color, p, zc) => a.put(id, color, basis([1, 0, 0], [0, 1, 0], [0, 0, 1]), [p[0], p[1], zc]);

/** add the wheel to assembly A with its deck point (under the hub, on the deck plate's top face) at O; returns the member count */
export function addWheel(A, O) {
a = { put: (id, color, R3, t) => A.put(id, color, R3, [t[0] + O[0], t[1] + O[1], t[2] + O[2]]) }; const n0 = A.parts.length;
// ---- rims: segment k joins vertices k and k+1; even k in the inner layer, odd k in the outer, front and back
const RV = Array.from({ length: 20 }, (_, k) => vtx(R, 9 + 18 * k));
for (let k = 0; k < 20; k++) for (const s of [1, -1]) beam('32017', WHITE, RV[k], RV[(k + 1) % 20], s * (k % 2 ? 2.25 : 1.75));
// ---- drum: two rings, segment j joins vertices j and j+1
const DV = Array.from({ length: 10 }, (_, j) => vtx(r, 36 * j));
for (let j = 0; j < 10; j++) for (const s of [1, -1]) beam('32523', WHITE, DV[j], DV[(j + 1) % 10], s * (j % 2 ? 2 : 1));
// ---- spokes: front +27° to the odd rim vertices, back −27° to the even ones
// v2: thin axles, as 31389 and 10247 do it. Each end is a cross block (axle/pin) whose pin hole turns on the vertex axle; its axle hole sits 1
// stud off the vertex, so the spoke is the vertex-to-vertex line shifted 1 stud toward the hub (tangent to both blocks' circles). The 10L axle ends
// half-way through each block (the blocks' holes are 10.009 apart).
const SPOKES = [];
function spoke(P, Q, zc) {
  const L = Math.hypot(Q[0] - P[0], Q[1] - P[1]); const u = [(Q[0] - P[0]) / L, (Q[1] - P[1]) / L, 0];
  let n = [-u[1], u[0], 0]; const m = [(P[0] + Q[0]) / 2, (P[1] - HUB + Q[1] - HUB) / 2]; if (n[0] * m[0] + n[1] * m[1] > 0) n = n.map((v) => -v);   // toward the hub: the lines run nearer the centre (more radial) and the rim-end blocks stay inside the rim
  const ez = cross(u, n);
  for (const V of [P, Q]) a.put('6536', WHITE, basis(u, n, ez), [V[0] + n[0], V[1] + n[1], zc]);                                 // pin hole (local y −1) on the vertex
  a.put('3737', WHITE, basis(u, [-u[1], u[0], 0], [0, 0, 1])   // v4: white, as the real spokes (lead review: Light Bluish Gray read as a grey cage)
  , [(P[0] + Q[0]) / 2 + n[0], (P[1] + Q[1]) / 2 + n[1], zc]);
  SPOKES.push({ a: [P[0] + n[0], P[1] + n[1]], b: [Q[0] + n[0], Q[1] + n[1]], zc });
}
for (let j = 0; j < 10; j++) { spoke(DV[j], RV[(2 * j + 1) % 20], 3); spoke(DV[j], RV[(2 * j + 18) % 20], -3); }
// ---- drum axles (the two lowest, j = 7 and 8, are 9L and carry the legs)
for (let j = 0; j < 10; j++) axleZ(j === 7 || j === 8 ? '3737' : '44294', LBG, DV[j], 0);   // v2: the two lowest are 10L (z ±5): legs + hub bracket
// ---- hub disc (v2, judge round 1: the open drum read as a hole; the real hub is a white disc). No part has ten holes round its axis, so the
// disc hangs on a bracket from the two lowest drum axles, front and back: a 3L beam across both axles (z ±4.5–5.5), a friction pin in its
// middle hole, a 5L beam standing up from it (z ±5.5–6.5) whose 4th hole sits 0.08 below the hub centre (r·cos 18° = 3.078 vs 3), a 2L axle
// through that hole and a white 4×4 dish, dome out (v3; v2 had a 6×6 round plate: too big, all studs).
for (const s of [1, -1]) {
  const lo = DV[7][1]; beam('32523', WHITE, [-1, lo], [1, lo], s * 5);
  axleZ('2780', LBG, [0, lo], s * 5.5);
  beam('32316', WHITE, [0, lo], [0, lo + 4], s * 6);
  const c = [0, lo + 3];
  axleZ('3704', LBG, c, s * 6.5);
  a.put('3960', WHITE, s > 0 ? basis([1, 0, 0], [0, 0, 1], [0, -1, 0]) : basis([1, 0, 0], [0, 0, -1], [0, 1, 0]), [c[0], c[1], s * 7.3]);   // local +y (the convex side, its stud) out; body z 6.5–7.5   // v3: a white 4×4 dish, dome out, on the axle (its axle hole grips): smooth, and 0.16 D like the real hub (the 6×6 plate was 0.23 D and all studs)
}
// ---- rim vertex axles: spacers, hanger, cap on the side without a spoke (silver, the 31389 joint dots)
for (let k = 0; k < 20; k++) {
  const V = RV[k]; axleZ('44294', LBG, V, 0);
  bushZ('3713', LBG, V, 1); bushZ('3713', LBG, V, -1); bushZ('3713', SILVER, V, k % 2 ? -3 : 3);
  // gondola
  a.put('32039', LBG, basis([0, 0, 1], [1, 0, 0], [0, 1, 0]), [V[0], V[1] - 1, 0]);          // cross hole on the vertex axle, socket down
  a.put('3704', LBG, basis([0, 1, 0], [-1, 0, 0], [0, 0, 1]), [V[0], V[1] - 1.5, 0]);         // pole (v4: 2L): 1 in the socket, 1 below it into the tub
  const q = Math.SQRT1_2; a.put('4032a', LBG, basis([q, 0, -q], [0, 1, 0], [q, 0, q]), [V[0], V[1] - 1.5, 0]);   // canopy right under the hanger, turned 45° so its studs straddle the hanger's sides (v2: 0.5 of air, the pole shows)
  const tub = k % 2 ? YEL : RED;
  // v4 (lead review: flat discs, tiny against the rim): the tub is a truncated 2×2 cone turned over on the pole's axle — open top, tapered
  // body, its stud underneath as the real tub's round boss; 1.2 tall (1.5× the v3 tub). The taper also clears the hanger below it at 9°/27°.
  a.put('98100', tub, basis([1, 0, 0], [0, -1, 0], [0, 0, -1]), [V[0], V[1] - 3.3, 0]);
}
// ---- A-frames: legs, crossbars, feet
const BAR = 10 / 14;
for (const sx of [1, -1]) for (const sz of [1, -1]) {
  const top = DV[sx > 0 ? 8 : 7], foot = [sx * FOOT[0], FOOT[1]];
  beam('32278', WHITE, top, foot, sz * 4);
  axleZ('2780', LBG, foot, sz * 3.5);                                                            // friction pin: leg foot hole ↔ Technic brick
  a.put('3700', WHITE, [1, 0, 0, 0, 1, 0, 0, 0, 1], [foot[0], FOOT[1] + 0.5, sz * 3]);   // hole 0.5 below its top
  a.put('3004', LBG, [1, 0, 0, 0, 1, 0, 0, 0, 1], [foot[0], 1.2, sz * 3]);   // v4: the footing grey, so the white legs read down to it
  const h = [top[0] + (foot[0] - top[0]) * BAR, top[1] + (foot[1] - top[1]) * BAR];
  axleZ('2780', LBG, h, sz * 4.5);                                                               // leg ↔ crossbar
}
for (const sz of [1, -1]) { const h = [-1 + (-7) * BAR, DV[7][1] + (FOOT[1] - DV[7][1]) * BAR]; beam('41239', WHITE, h, [-h[0], h[1]], sz * 5); }

// ---- spoke axles against every vertex axle they pass (axles are exempt from the OBB clash test: check here)
const segDist = (p, a0, b0) => { const d = [b0[0] - a0[0], b0[1] - a0[1]]; const t = Math.max(0, Math.min(1, ((p[0] - a0[0]) * d[0] + (p[1] - a0[1]) * d[1]) / (d[0] ** 2 + d[1] ** 2))); return Math.hypot(p[0] - a0[0] - t * d[0], p[1] - a0[1] - t * d[1]); };
let sp = 9; for (const S of SPOKES) for (const V of [...RV, ...DV]) { const dd = segDist(V, S.a, S.b); if (Math.hypot(V[0] - S.a[0], V[1] - S.a[1]) > 1.1 && Math.hypot(V[0] - S.b[0], V[1] - S.b[1]) > 1.1) sp = Math.min(sp, dd); }
console.log(`spoke axle to nearest foreign vertex axle: ${sp.toFixed(2)} (needs > 0.6)`);
// ---- clearance report: gondola bottoms against the hanger rings below them
let worst = 9; for (let k = 0; k < 20; k++) for (let m = 0; m < 20; m++) { if (k === m) continue; const g = RV[k], h = RV[m]; const dx = Math.abs(g[0] - h[0]); if (dx > 1.5) continue; const gap = g[1] - 3.3 - (h[1] + 0.5); if (gap > -2) worst = Math.min(worst, gap); }
console.log(`hub ${HUB.toFixed(3)} studs (${(HUB / 0.4).toFixed(1)} plates) · rim top ${(HUB + R).toFixed(2)} · rim bottom vertex ${(HUB - R * Math.sin(81 * RAD)).toFixed(2)} · tightest gondola-over-hanger gap ${worst.toFixed(2)}`);
return A.parts.length - n0;
}
if (process.argv[1]?.endsWith('asm-la-wheel.mjs')) { const A = new Asm('la_wheel', [0, 0, 0]); addWheel(A, [0, 0, 0]); const out = A.write(); console.log('la_wheel:', out.file, A.parts.length, 'parts', JSON.stringify(out.bom)); }
