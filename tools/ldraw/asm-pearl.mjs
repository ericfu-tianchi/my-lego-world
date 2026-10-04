// Oriental Pearl Tower v2 (2026-10-02) — one assembly of real parts, authored in our frame (tools/ldraw/asm-ours.mjs).
//   LDRAW_DIR=<main repo>/vendor/ldraw-lib/ldraw node tools/ldraw/asm-pearl.mjs && node tools/ldraw/bake.mjs pearl.ldr --force
// Scheme: docs/countries/china.md §1.9.2; references docs/refs/shanghai-pearl/NOTES.md (band order from LEGOLAND Shanghai Miniland, knee
// spheres from Brickman, dark lattice mast from the LEGO Store People's Square model).
// Frame: box x 0..10, z 0..10, axis at (5, 5); the LDraw origin is the axis at the plaza top.
// v1 stood the columns on 3-blade rotors (the only true triangle of studs); beside the photos the rotors made the shaft as wide as the
// spheres — real spheres are ≈ 1.8 × the column cluster. v2 puts the three columns on three cells of a 2×2 (an L, mirror-symmetric about the
// diagonal toward +x+z), the platforms are 2×2 round plates flush with the cluster, the beads sit in the empty fourth cell, and the spheres
// (4 studs) come out 2 × the shaft. Plates from the plaza:
//   0–12    three Tan 1×1 round-brick columns standing on the plaza
//   12–13   4×4 round collar: the strut heads touch its underside
//   13–26.5 lower sphere: grey bowl (hemisphere) → MAGENTA · grey · MAGENTA band plates → grey dome
//   23–     shaft: three plain Tan columns at radius 1, 120° apart (set out by Technic three-axle bushes at foot and head), three beam levels
//   upper   grey bowl → 6×6 grey deck ring → black window band → MAGENTA dome; stem; space module; dark grey mast
//   struts  three at 120°, one toward +x+z; outer leg at 60° with a knee sphere at ≈ 0.56 (the inner legs were cut, 2026-10-03)
import { Asm, bbox, PLATE } from './asm-ours.mjs';
const TAN = 19, LBG = 71, MAG = 26, BLK = 0, DBG = 72;
const C = [5, 0, 5];
const a = new Asm('pearl', C);
const yaw = (deg) => { const t = (deg * Math.PI) / 180, c = Math.cos(t), s = Math.sin(t); return [c, 0, s, 0, 1, 0, -s, 0, c]; };
const FLIP = [1, 0, 0, 0, -1, 0, 0, 0, -1];   // half turn about x: studs down, the dish becomes a bowl
const mulR = (A, B) => [0, 1, 2].flatMap((i) => [0, 1, 2].map((j) => A[i * 3] * B[j] + A[i * 3 + 1] * B[3 + j] + A[i * 3 + 2] * B[6 + j]));
const appR = (A, v) => [0, 1, 2].map((i) => A[i * 3] * v[0] + A[i * 3 + 1] * v[1] + A[i * 3 + 2] * v[2]);
/** place part `id` so the centre of its baked bbox's bottom face (after rotation R) sits at world (x, plate y, z) */
function at(id, color, x, y, z, R = yaw(0)) {
  const b = bbox(id); const corners = [];
  for (const cx of [b[0], b[3]]) for (const cy of [b[1], b[4]]) for (const cz of [b[2], b[5]]) corners.push(appR(R, [cx, cy, cz]));
  const lo = [0, 1, 2].map((i) => Math.min(...corners.map((c) => c[i]))), hi = [0, 1, 2].map((i) => Math.max(...corners.map((c) => c[i])));
  const t = [x - (lo[0] + hi[0]) / 2, y * PLATE - lo[1], z - (lo[2] + hi[2]) / 2]; return a.put(id, color, R, t);
}
/** a part laid along an inclined axis: its local +y along `ax`, bottom-face centre at world point p */
function along(id, color, p, ax, side) {
  const ey = ax, ex = side, ez = [ex[1] * ey[2] - ex[2] * ey[1], ex[2] * ey[0] - ex[0] * ey[2], ex[0] * ey[1] - ex[1] * ey[0]];
  const R = [ex[0], ey[0], ez[0], ex[1], ey[1], ez[1], ex[2], ey[2], ez[2]]; const b = bbox(id);
  const lc = [(b[0] + b[3]) / 2, b[1], (b[2] + b[5]) / 2]; const r = appR(R, lc); return a.put(id, color, R, [p[0] - r[0], p[1] - r[1], p[2] - r[2]]);
}

// ---- columns: rotor + three round-brick stacks; inner rotor studs at (0, −1), (0.87, 0.5), (−0.87, 0.5) about the axis
const COLS = [[-0.5, -0.5], [0.5, -0.5], [-0.5, 0.5]];   // the legs' three columns: three cells of the 2×2 round the axis
/** plates of a part's body: the bbox without a top stud (LDraw origin on the top face, stud above it) */
const body = (id) => { const b = bbox(id); return (b[4] > 0.01 && b[4] <= 0.201 ? -b[1] : b[4] - b[1]) / PLATE; };
const hasStud = (id) => { const b = bbox(id); return b[4] > 0.01 && b[4] <= 0.201; };
let cur = 0;
/** stack a part on the axis at the cursor; a part turned over (studs down) is lowered so its stud sinks into the part below */
function stack(id, color, R) { at(id, color, C[0], cur - (R === FLIP && hasStud(id) ? 0.5 : 0), C[2], R); cur += body(id); }
/** a Technic pin standing on the axis, half in the dome's top pin hole, half up into the part stacked next (Technic dome 8181) */
const pin = () => a.put('3673', DBG, [0, -1, 0, 1, 0, 0, 0, 0, 1], [C[0], cur * PLATE, C[2]]);
const columns = (n) => { for (const [dx, dz] of COLS) for (let k = 0; k < n; k++) at('3062b', TAN, C[0] + dx, cur + 3 * k, C[2] + dz); cur += 3 * n; };
// ---- columns from the plaza, the collar the struts meet
// columns: the two that carry a strut's top hinge end in a round plate with a side handle (26047) under the collar; the third is plain
const HINGE_COLS = [[-0.5, 0.5], [0.5, -0.5]];
for (const [dx, dz] of COLS) { const hinge = HINGE_COLS.some(([hx, hz]) => hx === dx && hz === dz);
  for (let k = 0; k < (hinge ? 3 : 4); k++) at('3062b', TAN, C[0] + dx, cur + 3 * k, C[2] + dz);
  if (hinge) { at('6141', TAN, C[0] + dx, cur + 10, C[2] + dz); at('6141', TAN, C[0] + dx, cur + 11, C[2] + dz); } }   // the handle plate goes in at 9–10 (below)
cur += 12;
const STRUT_TOP = cur;
stack('60474', LBG);
// ---- lower sphere
stack('24130', LBG); cur -= 0.5; stack('8181', MAG); pin();                  // a true sphere (the bowl's lip, 0.2 above its equator, sits inside the dome: v4 left a visible ring gap), 4 × 4 × 10.5 plates: grey hemisphere bowl + magenta dome (Eric 2026-10-02: 该圆的地方就要圆; band plates between the halves made it an egg)
const LOWER = cur;
// ---- shaft (v7, Eric 2026-10-03: plain smooth columns exactly round the axis, beams between them with a touch of pink — no square
// plates, no crosses, nothing sunk into anything). A stud grid has no three points symmetric about a centre, so the columns are set out by
// Technic three-axle bushes on the axis, one under the shaft and one at its head, each axle in a 1×1 Technic brick (Tan, as the columns)
// at radius 1, 120° apart; between them the columns are plain Tan round bricks. Each of the three beam levels is, on every column, a pink
// round plate and a round plate with a handle on its side turned toward the next column: the handle spans the 0.73-stud gap and touches
// the neighbour, so the three handles draw the triangle of beams. The bottom hub stands on a 2L axle in a 2×2 round plate on the dome; the
// top hub carries a 2×2 round plate under the bowl the same way, clear of the columns' tiled tops.
const R1 = [[0, -1], [0.866, 0.5], [-0.866, 0.5]];                           // the hub's axle directions in our frame, columns at radius 1
const axleV = (yTop) => { const b = bbox('3704'); a.put('3704', DBG, [0, -1, 0, 1, 0, 0, 0, 0, 1], [C[0], yTop - (b[3] - b[0]) / 2, C[2]]); };   // a 2L axle standing on the axis, its top at yTop (studs)
const hubLevel = (y0) => { const top = (y0 + 3) * PLATE;                     // Technic bricks with their bottom at plate y0, the hub in their hole plane
  for (const [dx, dz] of R1) a.put('73230', TAN, yaw((Math.atan2(dx, dz) * 180) / Math.PI), [C[0] + dx, top, C[2] + dz]);
  a.put('57585', TAN, yaw(0), [C[0], top - 0.5, C[2]]); };
stack('3941', LBG);                                                          // a 2×2 round brick on the dome's pin: the shaft is clutched to the sphere (the smooth dome had no stud — check-asm-studs, 2026-10-03)
const base = cur; let y = base + 1;                                          // a plate of air over the round plate's studs
hubLevel(y); axleV((y + 3) * PLATE + 0.2); y += 3;                          // the axle from the round brick's axle hole into the hub
for (let k = 0; k < 3; k++) {
  for (const [dx, dz] of R1) at('3062b', TAN, C[0] + dx, y, C[2] + dz); y += 3;
  for (let i = 0; i < 3; i++) { const [dx, dz] = R1[i], [nx, nz] = R1[(i + 1) % 3];
    at('6141', MAG, C[0] + dx, y, C[2] + dz);
    a.put('26047', TAN, yaw((Math.atan2(nx - dx, nz - dz) * 180) / Math.PI + 10), [C[0] + dx, (y + 1) * PLATE - bbox('26047')[1], C[2] + dz]); }   // the handle (local +z) toward the next column, 10° off so its tip meets the neighbour's surface instead of entering it
  y += 2;
}
for (const [dx, dz] of R1) at('3062b', TAN, C[0] + dx, y, C[2] + dz); y += 3;
hubLevel(y); y += 3;
for (const [dx, dz] of R1) a.put('98138', TAN, yaw((Math.atan2(dx, dz) * 180) / Math.PI), [C[0] + dx, y * PLATE - bbox('98138')[1], C[2] + dz]);   // the columns' tops tiled
y += 1; axleV(y * PLATE + 0.4); at('18674', LBG, C[0], y, C[2]); cur = y + 1;   // a round plate with one centre stud: the bowl's centre tube takes it
// ---- upper sphere: bowl, deck ring, window band, MAGENTA dome
stack('24130', LBG); cur -= 0.5; stack('8181', MAG); pin();                  // the same true sphere; the 6×6 deck ring read as a stray line and is gone
const UPPER = cur;
// ---- stem, space module (grey base, window band, magenta cap), mast
stack('3062b', LBG); stack('3062b', LBG); stack('20953', MAG);              // stem ≈ 0.25 of the sphere; the space module is a round 2×2 sphere brick
stack('3062b', DBG); stack('6141', DBG); stack('30374', DBG);                                // dark grey mast narrowing to the antenna
console.log(`lower sphere top ${LOWER} · upper sphere top ${UPPER} · tip ${cur} plates`);
// ---- struts (v3, Eric 2026-10-04: the legs were laid on the plaza at an angle, plugged into nothing): each strut is a chain of real
// bricks hung between two bar-in-clip hinges — the LEGO way to hold a part at an angle (21039 hangs its struts on clips the same way).
//   top     a round plate with a side handle (26047) under the collar — on a hinge column's top, or hung from the collar's free cell —
//           turned so its handle points out along the strut and its bar runs across it
//   foot    the same handle plate on the plaza (on a jumper where the half-stud lattice fits better), its bar parallel to the top's
//   strut   a clip plate (61252) whose ring closes on the foot bar, a tan round brick, the grey knee brick, two round plates, a clip plate whose
//           ring closes on the top bar; each clip plate sits on the chain's end stud, so the chain is clutched end to end
// The three struts are 120° apart (41°, 161°, 281°) at one lean (56.4°); their feet were found by a lattice search (scratch
// strut3.mjs, 2026-10-04) so each foot bar lands within 0.05 stud of where the strut needs it (along the bar, within 0.13: the clip
// slides on the handle).
const HANDLE = [0, -0.1, 1.0];                                               // 26047's handle bar and 61252's clip ring: centre in the plate's frame (LDraw: 0, 2, −20)
const basis3 = (ex, ey, ez) => [ex[0], ey[0], ez[0], ex[1], ey[1], ez[1], ex[2], ey[2], ez[2]];
const cross3 = (u, v) => [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
const norm = (v) => { const n = Math.hypot(...v); return v.map((x) => x / n); };
const handleAt = (x, topY, z, dir) => { const R = yaw((Math.atan2(dir[0], dir[1]) * 180) / Math.PI); a.put('26047', TAN, R, [x, topY, z]); const h = appR(R, HANDLE); return [x + h[0], topY + h[1], z + h[2]]; };
const STRUTS = [   // found by the lattice search (scratch s2b.mjs, 2026-10-04): 120° apart, one lean (51°), every bar within 0.05 stud
  { top: [0.5, 0.5], hang: true, th: 49.5, foot: [3.5, 4], jumper: 'z', nf: 0, fo: 1, opp: true },
  { top: [-0.5, 0.5], th: 167.5, foot: [-5, 1.5], jumper: 'x', nf: 0, fo: 1, opp: true, flip: true },   // flip: its top clip on the outer side (inside, it ran into the column)
  { top: [0.5, -0.5], th: 289.5, foot: [2, -4.5], jumper: 'x', nf: 1, fo: 1, opp: false },
];
const TOPY = STRUT_TOP - 2;                                                  // the top handle plates sit two plates under the collar, clear of it
for (const st of STRUTS) {
  const t = (st.th * Math.PI) / 180; const d = [Math.cos(t), Math.sin(t)];
  if (st.hang) { at('6141', TAN, C[0] + st.top[0], STRUT_TOP - 1, C[2] + st.top[1]); at('6141', TAN, C[0] + st.top[0], STRUT_TOP - 2, C[2] + st.top[1]); }   // hung from the collar's free cell
  const Btop = handleAt(C[0] + st.top[0], TOPY * PLATE, C[2] + st.top[1], d);
  let fy = 0; const fx = C[0] + st.foot[0], fz = C[2] + st.foot[1];
  if (st.jumper === 'x') { at('3794b', LBG, fx, 0, fz); fy = 1; } else if (st.jumper === 'z') { at('3794b', LBG, fx, 0, fz, yaw(90)); fy = 1; } else if (st.jumper === '22') { at('87580', LBG, fx, 0, fz); fy = 1; }
  for (let k = 0; k < st.nf; k++) at('6141', LBG, fx, fy + k, fz);
  const Bfoot = handleAt(fx, (fy + st.nf + 1) * PLATE, fz, [-st.fo * d[0], -st.fo * d[1]]);
  const V = [Btop[0] - Bfoot[0], Btop[1] - Bfoot[1], Btop[2] - Bfoot[2]]; const M = Math.hypot(...V); const v = V.map((x) => x / M); const tg = norm([-d[1], 0, d[0]]);
  const inDown = (e) => (e[1] + e[0] * d[0] + e[2] * d[1] < 0) !== !!st.flip;                 // the bottom clip reaches in and down to its bar: the chain rides outside
  let ax, eb, et, Lk;
  if (!st.opp) { ax = v; Lk = M; let e = norm(cross3(tg, ax)); if (!inDown(e)) e = e.map((x) => -x); eb = e; et = e; }
  else { Lk = Math.sqrt(M * M - 4); let w = norm(cross3(tg, v)); let e = [0, 1, 2].map((i) => (-2 * v[i] + Lk * w[i]) / M); if (!inDown(e)) { w = w.map((x) => -x); e = [0, 1, 2].map((i) => (-2 * v[i] + Lk * w[i]) / M); }
    ax = [0, 1, 2].map((i) => (Lk * v[i] + 2 * w[i]) / M); eb = e; et = e.map((x) => -x); }   // clips on opposite sides: Lk·ax + et − eb = V
  const chain = 3.2;                                                          // between the clip plates: a tan round brick, the grey knee brick, two tan round plates
  const P0 = [0, 1, 2].map((i) => Bfoot[i] + 0.1 * ax[i] - eb[i]);
  const pt = (s) => [0, 1, 2].map((i) => P0[i] + ax[i] * s);
  a.put('61252', TAN, basis3(cross3(ax, eb), ax, eb), P0);
  const sx = cross3(ax, eb); along('3062b', TAN, pt(0), ax, sx); along('3062b', LBG, pt(1.2), ax, sx); along('6141', TAN, pt(2.4), ax, sx); along('6141', TAN, pt(2.8), ax, sx);   // the knee a grey band (the 2×2 sphere swamped a strut this short)
  a.put('61252', TAN, basis3(cross3(ax, et), ax, et), pt(chain + 0.4));
  const ring = [0, 1, 2].map((i) => pt(chain + 0.3)[i] + et[i]); const miss = Math.hypot(...[0, 1, 2].map((i) => ring[i] - Btop[i]));
  console.log(`strut ${st.th}°: chain needs ${(Lk - 0.4).toFixed(3)}, has ${chain}; top ring misses its bar by ${miss.toFixed(3)} stud`);
}
const out = a.write(); console.log('pearl:', out.file, a.parts.length, 'parts', JSON.stringify(out.bom));
