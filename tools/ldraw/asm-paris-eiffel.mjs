// Paris · Eiffel Tower, v24 (2026-10-05). Scheme: docs/countries/france.md §1.13; history and Eric's reviews in §2.
//   LDRAW_DIR=… node tools/ldraw/asm-paris-eiffel.mjs && node tools/ldraw/bake.mjs eiffel.ldr --force
// One assembly of real parts, exploded in the scene (rule 12). Our frame (asm-ours.mjs): x right, y up, z to the viewer, 1 = a stud,
// a plate = 0.4; the origin is the footprint's bottom centre (proxy 20 × 20).
// Rebuilt from first principles after Eric's v5 review ("上面的东西都没有挂住…用料简直跟屎一样"): every member sits exactly where a real
// connection puts it, computed from the parts' own pivots, never snapped near it.
//  · Legs are lattice girders — the 2 × 2 × 5 lattice support, the one LEGO mould that is an Eiffel girder — leaning along the diagonal,
//    square to the faces, held at each end by a ball joint: a 1 × 2 plate with a ball on the stone or deck below, a 1 × 2 plate with a
//    socket under the girder; at the head a ball plate on the girder's studs and a socket plate hung under the next deck (a plate under a
//    plate is held by its studs). Both joints sit exactly on the parts' ball/socket centres (LDraw joint8 primitives); the lean is solved
//    so the head socket lands on the deck's stud grid. Corners are mirror images, so the tower is symmetric about both axes.
//  · The four great arches (Arch 1 × 12 × 5) stand on hinge bricks at the footprint's edge, leaning back with the faces, outside the legs.
//  · Above L2 (v11, after 10307): the same lattice legs, three supports long, running unbroken to the top platform round a lattice mast;
//    then a small round top, lantern, cone and mast.
import { Asm, bbox, PLATE, add, sub, scl, cross, app, basis, mul } from './asm-ours.mjs';
const C = { iron: +(process.env.IRON ?? 308), stone: 19, gold: 297, glass: 40 };   // 308 Dark Brown, 19 Tan, 297 Pearl Gold, 40 Trans-Black
const a = new Asm(process.env.NAME ?? 'eiffel');
const norm = (v) => scl(v, 1 / Math.hypot(...v)); const dot = (u, v) => u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
const deg = Math.PI / 180; const up = [0, 1, 0], X = [1, 0, 0], Z = [0, 0, 1];
const SIDES = [[1, 0, 0], [0, 0, -1], [-1, 0, 0], [0, 0, 1]];   // span axis ex of face r; its outward normal is ex × up (r 0 → +z)
const CORNERS = [[1, 1], [-1, 1], [-1, -1], [1, -1]];
const I3 = [1, 0, 0, 0, 1, 0, 0, 0, 1];
/** rotation by θ about unit axis k (row-major, acting on column vectors) */
function rot(k, th) { const c = Math.cos(th), s = Math.sin(th), t = 1 - c; const [x, y, z] = k;
  return [t * x * x + c, t * x * y - s * z, t * x * z + s * y, t * x * y + s * z, t * y * y + c, t * y * z - s * x, t * x * z - s * y, t * y * z + s * x, t * z * z + c]; }
const col = (R, i) => [R[i], R[3 + i], R[6 + i]];

/** place a part so that its bbox centre lands on `c`, local axes x, y, z → ex, ey, ez */
function box(id, color, c, ex, ey, ez) { const b = bbox(id); const lc = [(b[0] + b[3]) / 2, (b[1] + b[4]) / 2, (b[2] + b[5]) / 2]; const R = basis(ex, ey, ez); return a.put(id, color, R, sub(c, app(R, lc))); }
/** a studs-up part with the bottom of its body at y0, footprint centre (x, z), r quarter turns */
function flat(id, color, x, y0, z, r = 0) { const ex = SIDES[r & 3]; const R = basis(ex, up, cross(ex, up)); const b = bbox(id); const lc = [(b[0] + b[3]) / 2, b[1], (b[2] + b[5]) / 2]; return a.put(id, color, R, sub([x, y0, z], app(R, lc))); }
function spanY(recs) { let lo = Infinity, hi = -Infinity; for (const r of recs) { const b = bbox(r.id); for (const x of [b[0], b[3]]) for (const y of [b[1], b[4]]) for (const z of [b[2], b[5]]) { const q = app(r.R, [x, y, z])[1] + r.t[1]; lo = Math.min(lo, q); hi = Math.max(hi, q); } } return [lo, hi]; }
function cover(g, n, x0, z0, y0, color, sizes) {
  const done = g.map((row) => row.map(() => false));
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    if (!g[i][j] || done[i][j]) continue;
    outer: for (const [A, B, id] of sizes) for (const [w, d] of A === B ? [[A, B]] : [[A, B], [B, A]]) {
      let ok = i + w <= n && j + d <= n; for (let di = 0; ok && di < w; di++) for (let dj = 0; ok && dj < d; dj++) ok = g[i + di][j + dj] && !done[i + di][j + dj];
      if (!ok) continue; for (let di = 0; di < w; di++) for (let dj = 0; dj < d; dj++) done[i + di][j + dj] = true;
      const bx = bbox(id); flat(id, color, x0 + i + w / 2, y0, z0 + j + d / 2, Math.round(bx[3] - bx[0]) === w ? 0 : 1); break outer;
    }
  }
}
const PLATES = [[6, 6, '3958'], [4, 4, '3031'], [2, 6, '3795'], [2, 4, '3020'], [2, 3, '3021'], [2, 2, '3022'], [1, 6, '3666'], [1, 4, '3710'], [1, 3, '3623'], [1, 2, '3023'], [1, 1, '3024']];
const TILES = [[2, 4, '87079'], [2, 2, '3068b'], [1, 6, '6636'], [1, 4, '2431'], [1, 2, '3069b'], [1, 1, '3070b']];
const grid = (n, fill) => Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => fill(i, j, n)));
const rim = (i, j, n) => i === 0 || j === 0 || i === n - 1 || j === n - 1;


// ---- ball-joint legs ------------------------------------------------------------------------------------------------------------------
// 1 × 2 plate with Ball Joint-8 on End (22890) and 1 × 2 plate with Socket Joint-8 (14418): ball and socket centre at (1.5, −0.2, 0) from
// the plate's origin (its top face over the two studs), read from the joint8 primitives' placement in both part files.
const JOINT = [1.5, -0.2, 0];
const GIRDER = '2580c01', GLEN = -bbox(GIRDER)[1];   // 6 studs: origin at the top face, body below
/** the girder frame for leg direction L: square to the faces (local x as close to world x as L allows) */
function legFrame(L, ax = X) { const ex = norm(sub(ax, scl(L, dot(ax, L)))); const ez = cross(ex, L); return basis(ex, L, ez); }
/** A leg from a foot ball plate (origin f, pointing along world u: ±x) to a head socket plate hung under a deck (origin h at the deck's
 *  underside, pointing along world w: ±x). Returns the parts and the solved direction. */
let STACK = 1;   // lattice supports stacked end to end in one leg (the upper stage uses three)
function ballLeg(L, f, u, h, w, color, place = true, riser = false) {
  const R = legFrame(L, u.map(Math.abs)); const ex = col(R, 0);
  const ball0 = add(add(f, scl(u, JOINT[0])), [0, JOINT[1], 0]);                    // the foot ball
  const sgn = -Math.sign(dot(ex, u)) || -1;                                         // the socket plate under the girder points back at it
  const Pb = sub(sub(ball0, scl(ex, sgn * JOINT[0])), scl(L, JOINT[1]));            // the socket plate's origin = the girder's bottom face
  const Pt = add(Pb, scl(L, GLEN * STACK));                                         // the (top) girder's top face
  const oB = add(add(Pt, scl(L, PLATE)), scl(col(R, 2), 0.5));                      // the head ball plate's origin, on one row of the girder's 2 × 2 studs (centred it straddled the rows: check-asm-studs)
  const ball1 = add(add(oB, scl(ex, -sgn * JOINT[0])), scl(L, JOINT[1]));            // its ball points the other way: toward the axis
  const sock1 = add(add(h, scl(w, JOINT[0])), [0, JOINT[1], 0]);
  if (place) {
    if (riser) a.put('3023', color, basis(u, up, cross(u, up)), sub(f, [0, PLATE, 0]));   // a 1 × 2 plate lifts the foot ball clear of the deck
    a.put('3023', color, basis(w, up, cross(w, up)), add(h, [0, PLATE, 0]));                // the head socket hangs under a 1 × 2 plate under the deck
    a.put('22890', color, basis(u, up, cross(u, up)), f);
    a.put('14418', color, basis(scl(ex, sgn), L, cross(scl(ex, sgn), L)), Pb);
    for (let i = 0; i < STACK; i++) a.put(GIRDER, color, R, add(Pb, scl(L, GLEN * (i + 1))));
    a.put('22890', color, basis(scl(ex, -sgn), L, cross(scl(ex, -sgn), L)), oB);
    a.put('14418', color, basis(w, up, cross(w, up)), h);
  }
  return { gap: sub(ball1, sock1), Pt };
}
/** solve the leg direction and the deck height so the head ball meets the socket hung at (hx, ?, hz) */
function solveLeg(f, u, hx, hz, w) {
  let p = [0.3, 0.3, f[1] + 6 * STACK + 1];   // tilt toward −x, tilt toward −z, deck underside y
  const dirOf = (q) => norm([-Math.tan(q[0]), 1, -Math.tan(q[1])]);
  const err = (q) => ballLeg(dirOf(q), f, u, [hx, q[2], hz], w, 0, false).gap;
  for (let it = 0; it < 80; it++) { const e = err(p), J = []; for (let k = 0; k < 3; k++) { const d = p.slice(); d[k] += 1e-6; const e2 = err(d); J.push(e2.map((v, i) => (v - e[i]) / 1e-6)); }
    // J[k][i] = ∂e_i/∂p_k ; solve J^T Δ = −e
    const A = [0, 1, 2].map((i) => [0, 1, 2].map((k) => J[k][i])); const dp = solve3(A, e.map((v) => -v)); p = p.map((v, k) => v + dp[k]); }
  return { L: dirOf(p), y: p[2], gap: Math.hypot(...err(p)) };
}
function solve3(A, b) { const m = A.map((r, i) => [...r, b[i]]); for (let c = 0; c < 3; c++) { let piv = c; for (let r = c + 1; r < 3; r++) if (Math.abs(m[r][c]) > Math.abs(m[piv][c])) piv = r; [m[c], m[piv]] = [m[piv], m[c]];
  for (let r = 0; r < 3; r++) if (r !== c) { const k = m[r][c] / m[c][c]; for (let j = c; j < 4; j++) m[r][j] -= k * m[c][j]; } } return m.map((r, i) => r[3] / r[i]); }
/** quarter turn k about the y axis, for rotating corner 0's layout to the other three corners */
const ROT = (k) => { const R = [[1, 0, 0, 0, 1, 0, 0, 0, 1], [0, 0, 1, 0, 1, 0, -1, 0, 0], [-1, 0, 0, 0, 1, 0, 0, 0, -1], [0, 0, -1, 0, 1, 0, 1, 0, 0]][k & 3]; return R; };

// ---- legs are mirrored corner to corner (the parts are mirror-symmetric), so the tower is symmetric about both axes ---------------------------
const MIR = [[1, 1], [-1, 1], [-1, -1], [1, -1]];
const mir = ([sx, sz], v) => [sx * v[0], v[1], sz * v[2]];
/** solve and place four mirrored legs: foot ball plate origin f (pointing along u), head socket plate origin (hx, ?, hz) pointing along w */
function legs(f, u, hx, hz, w, riser) {
  const out = [];
  for (const m of MIR) { const s = solveLeg(mir(m, f), mir(m, u), m[0] * hx, m[1] * hz, mir(m, w));
    if (s.gap > 1e-4) throw new Error(`leg solve gap ${s.gap}`); ballLeg(s.L, mir(m, f), mir(m, u), [m[0] * hx, s.y, m[1] * hz], mir(m, w), C.iron, true, riser); out.push({ ...s, f: mir(m, f) }); }
  if (Math.abs(out[0].y - out[2].y) > 1e-6) throw new Error('legs not symmetric'); return out;
}
/** the same with the four corners as quarter turns of corner 0: the hidden joint plates go round in a pinwheel (used where mirrored plates
 *  would share cells); the girders themselves sit a few tenths of a stud off the diagonals */
function legsRot(f, u, hx, hz, w, riser) {
  const s = solveLeg(f, u, hx, hz, w); if (s.gap > 1e-4) throw new Error(`leg solve gap ${s.gap}`); const out = [];
  for (let k = 0; k < 4; k++) { const fk = app(ROT(k), f); ballLeg(app(ROT(k), s.L), fk, app(ROT(k), u), app(ROT(k), [hx, s.y, hz]), app(ROT(k), w), C.iron, true, riser); out.push({ ...s, f: fk, u: app(ROT(k), u) }); }
  return out;
}
const tilt = (L) => `${(Math.atan2(-L[0], L[1]) / deg).toFixed(1)}°/${(Math.atan2(-L[2], L[1]) / deg).toFixed(1)}°`;
const FOOT = 2 * PLATE, HALF = +(process.env.HALF ?? 10);
// the corner leg leans along the diagonal: foot ball plate on the footing's second plate, head socket hung under L1's first course
const BF = [+(process.env.FX ?? 5), FOOT + 2 * PLATE, +(process.env.FZ ?? 7.5)], BH = [+(process.env.HX ?? 4), +(process.env.HZ ?? 3.5)];
STACK = +(process.env.SB ?? 1); const base = legs(BF, X, BH[0], BH[1], X, true); STACK = 1; const yL1 = base[0].y + PLATE;   // L1's first course sits on the sockets' spacer plates
// the great arches (Arch 1 × 12 × 5 with Curved Top) stand on hinge bricks on the footings' outer rows, leaning back with the faces so the
// crown sits under the frieze; each 2-wide foot on a 1 × 2 hinge pair
const ATILT = +(process.env.ATILT ?? 26) * deg, AZ = HALF - 0.5, ASIDE = 5, archFeet = [];   // the arch's 2-wide feet span ±(4..6)
for (let r = 0; r < 4; r++) {
  const ex = SIDES[r], out = cross(ex, up); const e = add(scl(up, Math.cos(ATILT)), scl(out, -Math.sin(ATILT))), nrm = cross(ex, e);
  const yb = PLATE + bbox('3937')[4] - bbox('3937')[1] + 0.1;
  for (const side of [-1, 1]) {
    const c = add(scl(ex, side * ASIDE), scl(out, AZ)); const r0 = side > 0 ? r : (r + 2) & 3;
    flat('3937', C.iron, c[0], PLATE, c[2], r0); for (const kk of [-0.5, 0.5]) archFeet.push(add(c, scl(ex, kk)));
    a.put('3938', C.iron, basis(scl(ex, side), e, scl(nrm, side)), add(add(c, [0, yb - 0.5, 0]), scl(e, 0.5)));
  }
  const b = bbox('6184'); const foot = add(add(scl(out, AZ), [0, yb - 0.5, 0]), scl(e, 0.5));
  box('6184', C.iron, add(foot, scl(e, -b[1] + (b[1] + b[4]) / 2)), ex, e, nrm);
}
// footings: 6 × 6 Tan at the corners, two plates; the second course tiled except under the ball plates' risers
for (const [sx, sz] of CORNERS) {
  const N = +(process.env.FN ?? 6), x0 = sx > 0 ? HALF - N : -HALF, z0 = sz > 0 ? HALF - N : -HALF;
  cover(grid(N, () => true), N, x0, z0, 0, C.stone, PLATES);
  const ball = (i, j) => { const x = x0 + i + 0.5, z = z0 + j + 0.5; return base.some(({ f }) => Math.abs(f[2] - z) < 0.01 && Math.abs(f[0] - x) <= 0.51); };
  const hinge = (i, j) => archFeet.some((q) => Math.abs(q[0] - x0 - i - 0.5) < 0.01 && Math.abs(q[2] - z0 - j - 0.5) < 0.01);   // the hinge bricks stand on the first course
  cover(grid(N, ball), N, x0, z0, PLATE, C.stone, PLATES);
  cover(grid(N, (i, j) => !ball(i, j) && !hinge(i, j)), N, x0, z0, PLATE, C.stone, TILES);
}
// ---- L1, three courses: (A) the frieze — a rim course of Dark Brown 1 × 1 plates — and the deck plates, carrying the four
// head sockets and the four arches' crown studs underneath; (B) plates over all of it, which is what holds the frieze; (C) the walkway tiles
// and the lattice gallery
const N1 = +(process.env.N1 ?? 12), h1 = N1 / 2; let y = yL1;
const fromCorner = (i, j, n) => (j === 0 || j === n - 1 ? Math.min(i, n - 1 - i) : Math.min(j, n - 1 - j));
for (let i = 0; i < N1; i++) for (let j = 0; j < N1; j++) if (rim(i, j, N1)) flat('3024', C.iron, -h1 + i + 0.5, y, -h1 + j + 0.5);   // Eric 2026-10-05: all Dark Brown (the alternating Pearl Gold read as stray colour)
cover(grid(N1, (i, j, n) => !rim(i, j, n)), N1, -h1, -h1, y, C.iron, PLATES); y += PLATE;
cover(grid(N1, () => true), N1, -h1, -h1, y, C.iron, PLATES); y += PLATE; const L1 = y;
// ---- L1 → L2: four shorter girders on ball joints, ball plates on L1, sockets under L2 -----------------------------------------------------
// v12 (Eric: "第三段比第二段反而收进去了" — the tower must only grow wider going down): the mid legs start just inside the base legs' heads and
// end outside the upper legs' feet, so each stage is wider than the one above; head sockets along z keep their tops out at x ≈ 3
const MF = [+(process.env.MFX ?? 1), L1 + 2 * PLATE, +(process.env.MFZ ?? 4.5)], MH = [+(process.env.MHX ?? 3.5), +(process.env.MHZ ?? 1)];
STACK = +(process.env.SM ?? 1); const mid = legs(MF, X, MH[0], MH[1], (process.env.MW ?? 'z') === 'z' ? Z : X, true); STACK = 1; const yL2 = mid[0].y + PLATE;
const onMid = (i, j, n) => { const x = -n / 2 + i + 0.5, z = -n / 2 + j + 0.5; return mid.some(({ f }) => Math.abs(z - f[2]) < 0.01 && Math.abs(x - f[0] - Math.sign(f[0]) * 0.5) < 1.01); };   // the riser under each mid ball plate and the cell under its ball and socket
const fence = (i, j, n) => rim(i, j, n);   // Eric 2026-10-05 (photo): a railing all round both platforms — lattice fences between round posts
cover(grid(N1, (i, j, n) => !fence(i, j, n) && !onMid(i, j, n)), N1, -h1, -h1, L1, C.iron, TILES);
/** the railing round an n × n deck at y: lattice fences 1 × 4 centred on each side, a round 1 × 1 post at each corner, the cells between tiled */
function railing(n, y) { const h = n / 2, k = Math.floor((n - 2) / 4); const span = 4 * k;
  for (let r = 0; r < 4; r++) { const ex = SIDES[r], out = cross(ex, up);
    for (let f = 0; f < k; f++) { const c = add(scl(ex, -span / 2 + 2 + 4 * f), scl(out, h - 0.5)); flat('3633', C.iron, c[0], y, c[2], r); }
    for (let t = span / 2 + 0.5; t < h - 0.5; t++) for (const sgn of [-1, 1]) { const c = add(scl(ex, sgn * t), scl(out, h - 0.5)); flat('3070b', C.iron, c[0], y, c[2]); } }   // round posts read as bollards in clusters: the gaps are tiled
  for (const [sx, sz] of CORNERS) flat('3062b', C.iron, sx * (h - 0.5), y, sz * (h - 0.5)); }
railing(N1, L1);
// ---- L2: a 10 × 10 deck on the four head sockets --------------------------------------------------------------------------------------------
const N2 = +(process.env.N2 ?? 8), h2 = N2 / 2; y = yL2; cover(grid(N2, () => true), N2, -h2, -h2, y, C.iron, PLATES); y += PLATE; const L2 = y;
// ---- above L2 (v24, Eric 2026-10-05: the upper two stages of v23 — "顶部两层是否有必要外层的加固杆…展现出塔从顶到下逐渐变大的感觉就 ok" —
// on the lower two of v17, "下面两层…之前的好"): no outer sticks, open lattice narrowing by whole steps — a 4 × 4 column of four lattice
// supports on L2, a 4 × 4 cap, a 2 × 2 lattice support to the top. Widths L2 8 · shaft 4 · needle 2 (Eric: the 10-wide L2 deck read too long).
const S3 = +(process.env.S3 ?? 2), S4 = +(process.env.S4 ?? 2);
cover(grid(N2, (i, j, n) => !rim(i, j, n) && !(Math.abs(-n / 2 + i + 0.5) < 2 && Math.abs(-n / 2 + j + 0.5) < 2)), N2, -h2, -h2, L2, C.iron, TILES);
railing(N2, L2);
y = L2;
for (let k = 0; k < S3; k++) { for (const [sx, sz] of CORNERS) flat(GIRDER, C.iron, sx, y, sz); y += GLEN; }
cover(grid(4, () => true), 4, -2, -2, y, C.iron, PLATES); y += PLATE; const yN = y;
cover(grid(4, (i, j) => !(i >= 1 && i <= 2 && j >= 1 && j <= 2)), 4, -2, -2, y, C.iron, TILES);
for (let k = 0; k < S4; k++) { flat(GIRDER, C.iron, 0, y, 0); y += GLEN; }
flat('3022', C.iron, 0, y, 0); y += PLATE;
// ---- top: a small round platform, lantern, cone and mast, on one axis -------------------------------------------------------------------
const TOP = y; flat('4032b', C.iron, 0, y, 0); y += PLATE; flat('87580', C.iron, 0, y, 0); y += PLATE;
flat('3062b', C.iron, 0, y, 0); y += 3 * PLATE; flat('4589', C.iron, 0, y, 0); y += 3 * PLATE;
box('30374', C.iron, [0, y - 0.4 + 2, 0], X, up, Z);
const b0 = base[0], m0 = mid[0];
const gl = (s, n = 1) => { STACK = n; const r = ballLeg(s.L, s.f, X, [0, 0, 0], X, 0, false); STACK = 1; const c = (P) => P.map((v) => v.toFixed(2)).join(','); return `girder ${c(sub(r.Pt, scl(s.L, GLEN * n)))} → ${c(r.Pt)}`; };
console.log(`base tilt ${tilt(b0.L)} ${gl(b0, +(process.env.SB ?? 1))} · mid tilt ${tilt(m0.L)} ${gl(m0, +(process.env.SM ?? 1))} · node ${(yN / PLATE).toFixed(1)}`);

const tip = spanY(a.parts)[1];
console.log(`base lean ${(Math.acos(b0.L[1]) / deg).toFixed(1)}° · mid lean ${(Math.acos(m0.L[1]) / deg).toFixed(1)}° · L1 deck ${(L1 / PLATE).toFixed(1)} plates (${(L1 / tip).toFixed(3)} H) · L2 ${(L2 / PLATE).toFixed(1)} (${(L2 / tip).toFixed(3)} H) · top ${(TOP / PLATE).toFixed(1)} (${(TOP / tip).toFixed(3)} H) · tip ${(tip / PLATE).toFixed(1)}`);
const res = a.write(); console.log(res.file, res.bom.map(([kk, n]) => `${kk}×${n}`).join(' '), '·', a.parts.length, 'parts');
