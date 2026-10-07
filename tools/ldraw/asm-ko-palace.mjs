// Seoul · Gwanghwamun (2026-10-06): the gate's assemblies of real parts in our frame (tools/ldraw/asm-ours.mjs).
//   LDRAW_DIR=<main repo>/vendor/ldraw-lib/ldraw node tools/ldraw/asm-ko-palace.mjs && node tools/ldraw/bake.mjs ko_gwanghwamun.ldr ko_haechi.ldr --force --hull
// Scheme: docs/refs/seoul-palace/SCHEME.md (signed off: eave A = stepped rib lifts on 24201). Build notes: docs/refs/seoul-palace/BUILD.md.
// Gate frame: x 0..BW−1 west → east over the granite base, z 0..BD−1 north → south (the front faces +z), y in plates above the island surface G.
// r9 (Eric 2026-10-07: 比例再放大一点): the whole gate ≈ 1.3× wide and tall — base 34 × 14 (r8 26 × 12), top ≈ G + 64 (r8 50). The upper eave
// covers the base, the upper storey x 3..30 × z 3..10, the lower storey x 3..30 × z 2..11; E = the underside of the upper eave plates.
import { Asm, BODY, bbox } from './asm-ours.mjs';

export const COL = { DBG: 72, LBG: 71, WHITE: 15, BLACK: 0, SG: 378, DRED: 320, RED: 4, DBLUE: 272, GOLD: 297, DTURQ: 3, DGREEN: 288 };
const { DBG, WHITE, BLACK, SG, DRED } = COL;
// ---- the plan (r9) ----------------------------------------------------------------------------------------------------------------------
export const BW = 34, BD = 14;                       // granite base
const DECK = 20;                                     // the deck plates (top 21); parapet 21–25
const TUN = [[5, 4], [14, 6], [25, 4]];              // tunnels: first x, width (piers 5 wide, as the real gate's massive piers)
const SIDE_WALLS = [4, 9, 24, 29], CENTRE_WALLS = [13, 20], SA = 11, CA = 12;   // the arches' seats: side 1×6×2 at 11, centre 1×8×2 at 12
const X0 = 3, X1 = BW - 4, LZ0 = 2, LZ1 = BD - 3, UZ0 = 3, UZ1 = BD - 4;          // storey walls
const POSTS = [3, 11, 22, 30];                       // three bays, the centre one widest (the plaque's)
const P0 = DECK + 1, PB = P0 + 9, LE = PB + 5;        // parapet / lower posts from 21, lower bracket band 30–35, lower eave plates 35
BODY['15070'] = [-0.5, 0.5, -0.5, 0.5];   // the tooth hangs off the side: not footprint
BODY['4190'] = [-1.5, 0.5, -1.5, 0.5];
/** bottom of the part's box relative to its LDraw origin, in plates, where the bbox does not give it exactly */
const BOTTOM = { '24201': -2, '15070': -1 };   // 15070: a 1-plate body, its tooth hangs 2 plates lower beside it

// ---- frames: a face or corner is authored in (u, v) cells — u along the eave, v inward from the eave edge — and mapped to the gate
// frame by an integer 2×2 matrix (mirrors allowed: the parts are not mirrored, only their positions and the way they face)
export class Frame {
  constructor(m, t) { this.m = m; this.t = t; }
  pt(u, v) { const [a, b, c, d] = this.m; return [a * u + b * v + this.t[0], c * u + d * v + this.t[1]]; }
  dir(du, dv) { const [a, b, c, d] = this.m; return [a * du + b * dv, c * du + d * dv]; }
}
const ROT = (dx, dz) => (dz > 0 ? 0 : dx > 0 ? 1 : dz < 0 ? 2 : 3);   // the quarter turn that sends the part's +z to (dx, dz) (asm-ours RY)
const DIAG4190 = (dx, dz) => (dx < 0 && dz < 0 ? 0 : dx < 0 ? 1 : dz > 0 ? 2 : 3);   // 4190's upturned corner is (−x, −z) at turn 0
function foot(id) { const b = BODY[id] ?? (() => { const q = bbox(id); const s = (v) => Math.round(v * 2) / 2; return [s(q[0]), s(q[3]), s(q[2]), s(q[5])]; })(); return [Math.round(b[1] - b[0]), Math.round(b[3] - b[2])]; }

/** place a part on the cell rectangle u0..u0+w × v0..v0+d of frame F, bottom at plate y; `dir` (local) is where the part's +z points
 *  (slopes: downhill; 24201: its high cell; 87087 / 15070: the side stud / tooth), omitted for parts that only need their long axis laid */
export function cell(a, F, id, color, u0, v0, w, d, y, dir, tag) {
  const [x1, z1] = F.pt(u0, v0), [x2, z2] = F.pt(u0 + w, v0 + d); const x = Math.min(x1, x2), z = Math.min(z1, z2), W = Math.abs(x2 - x1), D = Math.abs(z2 - z1);
  let r;
  if (dir === 'diag') { const [dx, dz] = F.dir(-1, -1); r = DIAG4190(dx, dz); }
  else if (dir) { const [dx, dz] = F.dir(dir[0], dir[1]); r = ROT(dx, dz); }
  else { const [fw, fd] = foot(id); r = fw === W && fd === D ? 0 : 1; }
  const [fw, fd] = foot(id); const [ew, ed] = r % 2 ? [fd, fw] : [fw, fd];
  if (ew !== W || ed !== D) throw new Error(`${id}: footprint ${fw}×${fd} turn ${r} does not fill ${W}×${D} at (${x}, ${z})`);
  if (BOTTOM[id] !== undefined) { const rec = a.up(id, color, x, y, z, r, tag); rec.t[1] = (y - BOTTOM[id]) * 0.4; return rec; }   // exact origin height
  return a.up(id, color, x, y, z, r, tag);
}
// plates by size (w along u × d along v, either way round)
const PLATE = { '1x1': '3024', '1x2': '3023', '1x3': '3623', '1x4': '3710', '1x6': '3666', '1x8': '3460', '2x2': '3022', '2x3': '3021', '2x4': '3020', '2x6': '3795', '2x8': '3034', '4x4': '3031', '4x6': '3032', '6x6': '3958' };
const BRICK = { '1x1': '3005', '1x2': '3004', '1x3': '3622', '1x4': '3010', '1x6': '3009', '2x2': '3003', '2x3': '3002', '2x4': '3001' };
const sz = (w, d) => `${Math.min(w, d)}x${Math.max(w, d)}`;
export const plate = (a, F, c, u, v, w, d, y, tag) => { const id = PLATE[sz(w, d)]; if (!id) throw new Error(`no plate ${w}×${d}`); return cell(a, F, id, c, u, v, w, d, y, null, tag); };
export const brick = (a, F, c, u, v, w, d, y, tag) => { const id = BRICK[sz(w, d)]; if (!id) throw new Error(`no brick ${w}×${d}`); return cell(a, F, id, c, u, v, w, d, y, null, tag); };
/** a solid column of plates/bricks from y0 to y1 on one rectangle (bricks where three plates fit) */
export function stack(a, F, c, u, v, w, d, y0, y1, tag) { let y = y0; while (y < y1) { if (y1 - y >= 3 && BRICK[sz(w, d)]) { brick(a, F, c, u, v, w, d, y, tag); y += 3; } else { plate(a, F, c, u, v, w, d, y, tag); y += 1; } } }

/** a rafter-end dot: a Sand Green 1×1 brick with a side stud hung under the eave plate (its top stud in the plate's tube), the stud
 *  pointing out of the eave, a White round 1×1 tile on it */
export function dot(a, F, u, v, yTop, out, tile = WHITE) {
  const b = cell(a, F, '87087', SG, u, v, 1, 1, yTop - 3, out);
  const s = a.side(b)[0]; a.onStud('98138', tile, s, s.d[0] !== 0 ? [0, 0, 1] : [1, 0, 0], 'x');
}

// ---- hinged roof strips (r4: copied from Seon-Bi Won, the LEGO Ideas hanok, after three rounds of grid-stepped roofs topped out at 6.5)
// Each pair of columns (rib + channel) is one 2-wide strip: a hinge 1×2 (base on the eave plate), a spacer plate, a 2×n plate turned up
// THETA about the hinge axle; on it a rib of round 1×1 bricks chained down the slope from a side-stud brick at the top, ending in a White
// round tile at the eave (the row of white dots), and a channel of rounded-end 1×1 tiles. Strips toward the corners sit higher (the lift
// table), so the ribs climb into the corner one by one — Seon-Bi Won's fan. Hips and the ridge are White stacks (the yangseong).
/** r6: the plates and hinge bases under the strips are the bracket zone (Sand Green, as the real soffit), so the roof itself reads as a thin dark sheet */
const SUP = SG;
/** r9: the corner support stacks under the upturned corners are the corner bracket zone (귀공포), Sand Green as the soffits (Dark Turquoise read as loud cyan slabs) —
 *  in roof grey they read as blocks under the corners (judge r6–r8) */
const CB = SG;
const THETA = 22;   // roof pitch, degrees (r6: 30° made the roofs steep mounds that crushed the upper storey; the real pitch at the eave is ≈ 20°)
let TH = THETA;   // the pitch of the roof being built: lower 22°, upper 18° (r6: the upper roof's height budget)
const rodrigues = (k, deg) => { const t = (deg * Math.PI) / 180, c = Math.cos(t), s = Math.sin(t), C = 1 - c, [x, y, z] = k; return [c + x * x * C, x * y * C - z * s, x * z * C + y * s, y * x * C + z * s, c + y * y * C, y * z * C - x * s, z * x * C - y * s, z * y * C + x * s, c + z * z * C]; };
const mulR = (A, B) => [0, 1, 2].flatMap((i) => [0, 1, 2].map((j) => A[i * 3] * B[j] + A[i * 3 + 1] * B[3 + j] + A[i * 3 + 2] * B[6 + j]));
const appR = (A, v) => [0, 1, 2].map((i) => A[i * 3] * v[0] + A[i * 3 + 1] * v[1] + A[i * 3 + 2] * v[2]);
function turn(recs, R, p) { for (const r of recs) { r.R = mulR(R, r.R); r.t = appR(R, r.t.map((v, i) => v - p[i])).map((v, i) => v + p[i]); } }
/** the highest point (plates) of a set of placed parts, from their bbox corners */
export function topOf(recs) { let m = -Infinity; for (const r of recs) { const b = bbox(r.id); for (const x of [b[0], b[3]]) for (const y of [b[1], b[4]]) for (const z of [b[2], b[5]]) m = Math.max(m, appR(r.R, [x, y, z])[1] + r.t[1]); } return m / 0.4; }
const along = (d) => (d[0] ? [0, 0, 1] : [1, 0, 0]);
/** a rib of round bricks from a side stud: `k` bricks, a round tile of `end` colour on the last */
function ribChain(a, s, k, end) { const out = []; for (let i = 0; i < k; i++) { const b = a.onStud('3062b', DBG, s, along(s.d), 'x'); out.push(b); s = { p: b.t.slice(), d: s.d }; } out.push(a.onStud('98138', end, s, along(s.d), 'x')); return out; }
/** r6 low ribs on the strip plate (top at plate level y): 'bead' = round plates under round tiles, one per cell; 'plate' = a 1×n plate
 *  under round tiles; 'curve' = curved slopes 1×2 down the slope (chosen by eye from a 6-stud test strip of all three, r6: it reads as
 *  overlapping convex tiles, the other two as coins / a ridge); the eave cell of every rib is a White round tile */
function lowRib(a, F, u, vlo, n, y, kind, end = WHITE) {
  const out = [];
  if (kind === 'curve') { let v = vlo + 1; for (; v + 2 <= vlo + n; v += 2) out.push(cell(a, F, '11477', DBG, u, v, 1, 2, y, [0, -1])); if (v < vlo + n) out.push(cell(a, F, '54200', DBG, u, v, 1, 1, y, [0, -1])); }
  else if (kind === 'plate') { let v = vlo; for (const q of splitLen(n)) { out.push(plate(a, F, DBG, u, v, 1, q, y)); v += q; } for (let v2 = vlo; v2 < vlo + n; v2++) out.push(cell(a, F, '98138', v2 === vlo ? end : DBG, u, v2, 1, 1, y + 1)); return out; }
  else for (let v = vlo + 1; v < vlo + n; v++) { out.push(cell(a, F, '85861', DBG, u, v, 1, 1, y)); out.push(cell(a, F, '98138', DBG, u, v, 1, 1, y + 1)); }
  out.push(cell(a, F, '98138', end, u, vlo, 1, 1, y));   // r6: one White round tile, a plate high (two read as marshmallows)
  return out;
}
const TILE = { 1: '3070b', 2: '3069b', 3: '63864', 4: '2431', 6: '6636' };
function tileRun(a, F, u, v0, n, y) { const out = []; let v = v0; for (const q of splitLen(n)) { out.push(cell(a, F, TILE[q], DBG, u, v, 1, q, y)); v += q; } return out; }
/** r8 (Eric: the curved-slope ribs read as a rough pile): the tile field is 1×2 grille tiles laid down the slope in every column, so
 *  each face reads as fine, even, parallel tile lines (Monkie Kid / Chinese New Year roofs); a 1×1 tile closes an odd run at the top */
/** r10 (lead: a dark eave edge along every eave): the strip plate and its eave tile are Black — the strip's front edge and the eave row
 *  read as one dark fascia line over the grey tile field; `TC` is the field's colour (White on the corner strips, so the hips run white
 *  to the tip; there plain tiles — white grilles read as combs) */
let TC = DBG;
function grilleRun(a, F, u, v0, n, y) { const out = [cell(a, F, '3070b', BLACK, u, v0, 1, 1, y)]; let v = v0 + 1; for (; v + 2 <= v0 + n; v += 2) out.push(cell(a, F, TC === WHITE ? '3069b' : '2412b', TC, u, v, 1, 2, y)); if (v < v0 + n) out.push(cell(a, F, '3070b', TC, u, v, 1, 1, y)); return out; }   // r8b: the eave cell is a plain tile — a smooth dark fascia line over the grille ends (judge r8: the comb)
function strip(a, F, u0, vh, vlo, n, yb, ribU, theta = TH, kind = 'grille') {
  const base = cell(a, F, '3937', SUP, u0, vh, 2, 1, yb);
  const recs = [a.put('3938', DBG, base.R, base.t)];
  const pivot = [base.t[0], base.t[1] - 0.5, base.t[2]];   // the axle: 10 LDU under the base's top, on the cell row's centre line
  const H = yb + 3;
  recs.push(plate(a, F, BLACK, u0, vlo, 2, n, H));   // on the hinge top's studs (its outer rows clear the base's knuckle by a hair at 30°)
  for (const u of [u0, u0 + 1]) {
    if (kind === 'grille') recs.push(...grilleRun(a, F, u, vlo, n, H + 1));
    else if (kind) { if (u === ribU) recs.push(...lowRib(a, F, u, vlo, n, H + 1, kind)); else recs.push(...(kind === 'plate' ? [tileRun(a, F, u, vlo, n, H + 1)].flat() : Array.from({ length: n }, (_, i) => cell(a, F, '24246', DBG, u, vlo + i, 1, 1, H + 1, [0, -1])))); }
    else if (u === ribU) { const top = cell(a, F, '87087', DBG, u, vlo + n - 1, 1, 1, H + 1, [0, -1]); recs.push(cell(a, F, '3070b', DBG, u, vlo + n - 1, 1, 1, H + 4)); recs.push(top, ...ribChain(a, a.side(top)[0], Math.max(1, Math.round((n - 1.1) / 1.2)), WHITE)); }
    else for (let v = vlo; v < vlo + n; v++) recs.push(cell(a, F, '24246', DBG, u, v, 1, 1, H + 1, [0, -1]));
  }
  const [dx, dz] = F.dir(0, 1); turn(recs, rodrigues([-dz, 0, dx], theta), pivot);   // axis d × y: the inward edge rises
  return recs;
}
/** r10 (lead: no stepped cards at the corners — the eave edge one continuous rising line): every strip's lift and hinge angle are solved
 *  together so its eave tip lands on a smooth curve from the flat middle to the corner strip; a lift of one plate is paid back by a
 *  steeper angle, so the steps move from the eave edge to the strips' inner ends, under the hips. Tip = the top of the eave tile. */
const tipOf = (recs) => { const r = recs[2], b = bbox(r.id); return (appR(r.R, [(b[0] + b[3]) / 2, b[4], (b[2] + b[5]) / 2])[1] + r.t[1]) / 0.4; };
const tipAt = (F, u0, vh, vlo, n, yb, th) => tipOf(strip(new Asm('_tip'), F, u0, vh, vlo, n, yb, null, th));
function solve(F, u0, vh, vlo, n, yb, target, Lmin = 0, Lmax = 0, thMin = 8) {
  let best = null;
  for (let L = Lmin; L <= Lmax; L++) for (let th = thMin; th <= 26; th += 0.25) { const e = Math.abs(tipAt(F, u0, vh, vlo, n, yb + L, th) - target); if (!best || e < best.e - 0.03) best = { L, th, e }; }
  return best;
}
/** the tip curve: 0 in the flat middle, 1 at the corner strip, easing in over K pairs-distance */
const ease = (k, K = 14) => (k >= K ? 0 : ((K - k) / K) ** 2);
const CURVE = { up: null, low: null };   // { t0, tc } per roof, set before the faces are built
const target = (c, k) => c.t0 + (c.tc - c.t0) * ease(k);
/** the tile plane's height (plates) over row v of a strip hinged at row vh on a base from plate yb */
const surf = (yb, vh, v) => { const t = (TH * Math.PI) / 180; return yb + 1.75 + 2.25 * Math.cos(t) + (v - vh - 0.5) * Math.tan(t) * 2.5; };
/** the same frame with u and v swapped (a corner's short face) */
const swap = (F) => new Frame([F.m[1], F.m[0], F.m[3], F.m[2]], F.t);
/** a White hip block (2×2) from y0 up to y1, japsang (black 1×1 cones) on the cells in `figs`, white tiles on the rest */
function hipBlock(a, F, u, v, y0, y1, figs) {
  if (y1 - 2 > y0) stack(a, F, DBG, u, v, 2, 2, y0, y1 - 2);
  stack(a, F, WHITE, u, v, 2, 2, Math.max(y0, y1 - 2), y1);   // only the cap is white: the hip's white line, not a white tower
  for (const [du, dv] of [[0, 0], [1, 0], [0, 1], [1, 1]]) { const f = figs.find(([p, q]) => p === u + du && q === v + dv); if (f) { if (f[2] !== 'open') cell(a, F, '85861', DBG, u + du, v + dv, 1, 1, y1); } else cell(a, F, '3070b', WHITE, u + du, v + dv, 1, 1, y1); }
}
// ---- the upper roof: eave BW × BD over the upper storey (x 3..30, z 3..10); E = underside of the eave plates ------------------------------
/** a strip pair's distance from the nearest corner along a face of n cells (the smaller of its two cells', so mirrored pairs agree) */
const kPair = (u0, n) => Math.min(u0, n - 1 - u0, u0 + 1, n - 2 - u0);
/** r8 (Eric: the corners rose as stepped shelves): the hinge angle flattens toward the corner, so each strip's eave end climbs a little
 *  more than its neighbour's — one accelerating curve, as the real 추녀 sweep. r9: the longer faces take finer steps (1–2° a pair) */
const SWEEP = (k) => (k <= 1 ? 6 : k <= 3 ? 9 : k <= 5 ? 11 : k <= 7 ? 13 : k <= 9 ? 15 : k <= 11 ? 16.5 : k <= 13 ? 17.5 : 18);
const LIFT = (k) => (k <= 1 ? 5 : k <= 3 ? 3 : k <= 5 ? 2 : k <= 7 ? 1 : 0);   // r6: only the pairs next to the corner kits lifted (the sag)
function upperLong(a, F, E) {   // u 6..BW−7 in the face's frame; returns the flat (L 0) strips
  const out = [];
  for (let u0 = 6; u0 <= BW - 8; u0 += 2) {
    const k = kPair(u0, BW), { L, th } = k >= 14 ? { L: 0, th: 18 } : solve(F, u0, 2, -1, 6, E + 1, target(CURVE.up, k), 0, 4);
    for (let y = E; y <= E + L; y++) plate(a, F, SUP, u0, 2, 2, 4, y);   // r9: all four rows, so it clutches the bracket tips under the lifted pairs
    const s = strip(a, F, u0, 2, -1, 6, E + L + 1, null, th); if (!L) out.push(...s);
  }
  return out;
}
function upperCorner(a, F, E) {
  const T = swap(F);
  plate(a, F, CB, 3, 3, 3, 2, E); plate(a, F, CB, 2, 5, 4, 1, E); plate(a, F, CB, 4, 2, 2, 1, E); plate(a, F, CB, 3, 3, 2, 3, E + 1); plate(a, F, CB, 5, 3, 1, 3, E + 1);   // shims on the storey corner
  plate(a, F, CB, 4, 1, 2, 4, E + 2); plate(a, F, CB, 4, 5, 2, 1, E + 2); plate(a, F, CB, 1, 4, 3, 2, E + 2); plate(a, F, CB, 0, 0, 4, 4, E + 2);   // pair-2 eave plates, the corner floor
  plate(a, F, CB, 2, 0, 2, 6, E + 3); plate(a, F, CB, 0, 2, 2, 2, E + 3); plate(a, F, CB, 0, 0, 2, 2, E + 3);   // pair-1 eave plates, the corner block's foot
  const th2 = solve(F, 4, 1, -1, 4, E + 3, target(CURVE.up, 4)).th, th1 = solve(F, 2, 0, -1, 3, E + 4, target(CURVE.up, 2)).th;
  return { p2: [...strip(a, F, 4, 1, -1, 4, E + 3, 5, th2), ...strip(a, T, 4, 1, -1, 4, E + 3, 4, th2)], p1: [...strip(a, F, 2, 0, -1, 3, E + 4, 3, th1), ...strip(a, T, 2, 0, -1, 3, E + 4, 2, th1)] };   // short faces: ribs 2 / 4 from each corner, a channel pair at the centre
}
export function upperRoof(a, E) {
  TH = 18;
  { const F0 = new Frame([1, 0, 0, 1], [0, 0]); CURVE.up = { t0: tipAt(F0, 14, 2, -1, 6, E + 1, 18), tc: tipAt(F0, 0, 0, -1, 3, E + 5, SWEEP(0)) }; }
  const S = new Frame([1, 0, 0, -1], [0, BD]), N = new Frame([-1, 0, 0, 1], [BW, 0]), SE = new Frame([-1, 0, 0, -1], [BW, BD]), NW = new Frame([1, 0, 0, 1], [0, 0]);
  const mids = [...upperLong(a, S, E), ...upperLong(a, N, E)];
  const RT = Math.max(E + 9, Math.ceil(topOf(mids)));   // the hips' white top: level with the flat middle's tile tops (r7–r8: E + 9)
  for (const F of [S, SE, N, NW]) {
    const c = upperCorner(a, F, E);
    // hips at the roof surface where the faces meet (the tile plane over the cell next to the hip, a plate proud), not at the ribs' tops
    const HJ = Math.ceil(surf(E + 3, 1, 3)) + 1;
    plate(a, F, CB, 0, 0, 2, 2, E + 4); TC = WHITE; strip(a, F, 0, 0, -1, 3, E + 5, 1, SWEEP(0)); TC = DBG;   // the corner rib strip one plate over pair 1 (r6: low ribs; r5's L 5 rose as horns)
    hipBlock(a, F, 2, 2, E + 4, HJ, [[2, 2], [3, 3]]);   // r10: japsang at 2 / 3 / 4 along each upper hip   // r6: one plate over j2, not over the corner strip (it rose above the ridge)
    hipBlock(a, F, 4, 4, E + 3, RT, [[4, 4], [5, 4, 'open'], [5, 5, 'open']]);
    // r7 (judge r6: the hips showed gaps down to the soffit): White 1×1 stacks close the diagonal between j1 and j2, so each hip reads
    // as one white line from the ridge to the corner
    for (const [u, v, y0] of [[4, 3, E + 3], [3, 4, E + 4]]) { stack(a, F, DBG, u, v, 1, 1, y0, RT - 2);   // (3, 4) stands on pair 1's eave plate
      stack(a, F, WHITE, u, v, 1, 1, RT - 2, RT); cell(a, F, '3070b', WHITE, u, v, 1, 1, RT); }
  }
  // r9 (depth 14): the short faces have a middle pair (z 6..7) between the corner kits — on three plates cantilevered from the end wall —
  // and the gable block over it, dark under a white cap, so the hip lines meet across the ridge end
  for (const F of [NW, SE]) {
    for (let y = E; y < E + 3; y++) plate(a, F, CB, 1, 6, 4, 2, y);
    strip(a, swap(F), 6, 1, -1, 4, E + 3, null, solve(swap(F), 6, 1, -1, 4, E + 3, target(CURVE.up, 6)).th);
    stack(a, F, DBG, 3, 6, 3, 2, E + 3, RT - 2); stack(a, F, WHITE, 3, 6, 3, 2, RT - 2, RT);
    for (const v of [6, 7]) cell(a, F, '63864', WHITE, 3, v, 3, 1, RT);
  }
  // ridge (r9: 4 rows over the deeper roof): a 4-wide base plate on the two inner eave-plate rows (z 5, 8); dark rows z 5 / 8 continuing the
  // roof to RT; the White core z 6..7 from the base to RW; a dark tile cap; at each end dark cheese slopes rising outward (취두)
  const G = NW, RW = RT + 1;   // r7: the ridge's white band a plate over the hips (judge r6: the brightest line on the real roof barely showed)
  const segs = [[6, 2, E + 2], [8, 4, E + 1], [12, 4, E + 1], [16, 2, E + 1], [18, 4, E + 1], [22, 4, E + 1], [26, 2, E + 2]];   // [x0, n, base level]; 6–7 / 26–27 on lifted plates
  for (const [x0, n, yb] of segs) {
    plate(a, G, DBG, x0, 5, n, 4, yb);
    for (const z of [5, 8]) { stack(a, G, DBG, x0, z, n, 1, yb + 1, RT - 3); cell(a, G, n === 4 ? '2431' : '3069b', DBG, x0, z, n, 1, RT - 3); }   // r9: three plates under RT, so the white band shows bold as on the real ridge
    stack(a, G, WHITE, x0, 6, n, 2, yb + 1, RW);
  }
  for (let u = 7; u < BW - 7; u += 4) cell(a, G, '87079', DBG, u, 6, 4, 2, RW);
  for (const z of [6, 7]) { cell(a, G, '54200', DBG, 6, z, 1, 1, RW, [1, 0]); cell(a, G, '54200', DBG, BW - 7, z, 1, 1, RW, [-1, 0]); }   // r6: 취두 as dark cheese slopes rising to the ends
  TH = THETA; return RT;
}

// ---- shared ---------------------------------------------------------------------------------------------------------------------------
export const ID = new Frame([1, 0, 0, 1], [0, 0]);   // the gate frame itself
const hash = (x, y, z) => { let h = (x * 73856093) ^ (y * 19349663) ^ (z * 83492791); h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
const { LBG, RED, DBLUE } = COL;
/** a tile or plate mounted on a row of side studs (their midpoint), its long axis along `along` */
function onStuds(a, id, color, studs, along) { const p = [0, 1, 2].map((i) => studs.reduce((q, s) => q + s.p[i], 0) / studs.length); return a.onStud(id, color, { p, d: studs[0].d }, along, 'x'); }
const DIRV = { S: [0, 0, 1], N: [0, 0, -1], W: [-1, 0, 0], E: [1, 0, 0] };
/** a straight run of bricks (or plates) along x (axis 'x', at row z) or along z (axis 'z', at column x), split into the given lengths */
function run(a, axis, fixed, from, lens, y, color, kind = 'brick', ids) {
  let k = from; for (const n of lens) { const id = ids?.[n] ?? (kind === 'brick' ? BRICK : PLATE)[`1x${n}`]; if (!id) throw new Error(`no ${kind} 1×${n}`);
    if (axis === 'x') cell(a, ID, id, color(k), k, fixed, n, 1, y); else cell(a, ID, id, color(k), fixed, k, 1, n, y); k += n; }
}

// ---- granite base BW × BD, 0–21: a hollow shell of masonry bricks round three tunnels, round arches back to back along z ------------------
// Walls along z (the tunnel walls and the end faces) and the front / back faces; piers 5 wide (0–4, 9–13, 20–24, 29–33), tunnels 5–8 ·
// 14–19 · 25–28. Side arches (1×6×2) stand on the walls at x 4 / 9 / 24 / 29 at SA, the centre arch (1×8×2) on x 13 / 20 at CA.
const MASON = { 4: '15533', 2: '98283', 1: '3005' };
const inTunnel = (x) => TUN.some(([t, w]) => x >= t && x < t + w);
function baseTop(x, z) {
  if (x === 0 || x === BW - 1) return DECK;
  if (SIDE_WALLS.includes(x)) return SA;
  if (CENTRE_WALLS.includes(x)) return CA;
  if ((z === 0 || z === BD - 1) && !inTunnel(x)) return DECK;
  return 0;
}
function granite(a) {
  const lines = [];
  for (const z of [0, BD - 1]) lines.push({ axis: 'x', fixed: z, cells: Array.from({ length: BW }, (_, x) => x) });
  for (const x of [0, ...SIDE_WALLS, ...CENTRE_WALLS, BW - 1].sort((p, q) => p - q)) lines.push({ axis: 'z', fixed: x, cells: Array.from({ length: BD - 2 }, (_, i) => i + 1) });
  const col = (x, y, z) => (hash(Math.min(x, BW - 1 - x), y, z === BD - 1 ? 0 : z) < 0.08 ? WHITE : LBG);   // a few pale stones, mirrored about the axis, the same front and back
  for (const [li, L] of lines.entries()) {
    const top = (c) => (L.axis === 'x' ? baseTop(c, L.fixed) : baseTop(L.fixed, c));
    for (let k = 0; k * 3 < DECK; k++) {
      const y0 = 3 * k;
      // brick runs: cells solid through the whole course
      let i = 0; const cs = L.cells;
      while (i < cs.length) {
        if (top(cs[i]) < y0 + 3) { i++; continue; }
        let j = i; while (j + 1 < cs.length && cs[j + 1] === cs[j] + 1 && top(cs[j + 1]) >= y0 + 3) j++;
        const n = j - i + 1; const lens = []; let rest = n; if ((k + li) % 2 && rest > 2) { lens.push(2); rest -= 2; }
        while (rest >= 4) { lens.push(4); rest -= 4; } if (rest === 3) lens.push(2, 1); else if (rest) lens.push(rest);
        run(a, L.axis, L.fixed, cs[i], lens, y0, (c) => (L.axis === 'x' ? col(c, y0, L.fixed) : col(L.fixed, y0, c)), 'brick', MASON);
        i = j + 1;
      }
      // plate runs where the wall ends inside the course
      for (let y = y0; y < y0 + 3; y++) {
        let i2 = 0;
        while (i2 < cs.length) {
          const t = top(cs[i2]); if (!(t > y && t < y0 + 3)) { i2++; continue; }
          let j = i2; while (j + 1 < cs.length && cs[j + 1] === cs[j] + 1) { const t2 = top(cs[j + 1]); if (!(t2 > y && t2 < y0 + 3)) break; j++; }
          const n = j - i2 + 1; const lens = []; let rest = n; while (rest > 0) { const q = rest >= 6 ? 6 : rest >= 4 ? 4 : rest; lens.push(q); rest -= q; }
          run(a, L.axis, L.fixed, cs[i2], lens, y, () => LBG, 'plate'); i2 = j + 1;
        }
      }
    }
  }
  for (let z = 0; z < BD; z++) {
    cell(a, ID, '3308a', LBG, CENTRE_WALLS[0], z, 8, 1, CA);                         // centre vault, opening 6
    for (let y = CA + 6; y < DECK; y++) plate(a, ID, LBG, CENTRE_WALLS[0], z, 8, 1, y);
    for (const x of [SIDE_WALLS[0], SIDE_WALLS[2]]) { cell(a, ID, '3307', LBG, x, z, 6, 1, SA); for (let y = SA + 6; y < DECK; y++) plate(a, ID, LBG, x, z, 6, 1, y); }   // side vaults, opening 4
  }
  for (let x = 0; x < BW; x += 2) { plate(a, ID, LBG, x, 0, 2, 8, DECK); plate(a, ID, LBG, x, 8, 2, BD - 8, DECK); }   // the deck over everything
  // the doors, folded back against the tunnel walls just inside the south mouth: Dark Red leaves on the tunnel floor
  // r10 (lead: red doors filling the arches): each leaf runs from the floor to the arch's spring (side 11, centre 12) — bricks, then plates
  for (const [t, w] of TUN) { const top = w === 6 ? CA : SA; for (const x of [t, t + w - 1]) { let y = 0; for (; y + 3 <= top; y += 3) w === 6 ? cell(a, ID, '3622', DRED, x, BD - 4, 1, 3, y) : cell(a, ID, '3004', DRED, x, BD - 3, 1, 2, y); for (; y < top; y++) plate(a, ID, DRED, x, w === 6 ? BD - 4 : BD - 3, 1, w === 6 ? 3 : 2, y); } }
}

// ---- parapet 21–25: Dark Bluish Gray, one stud thick on the base edge, White panels (grille / plain) on side-stud bricks, tile cap --------
function parapet(a) {
  const D = () => DBG; let g = 0;
  const panel = (x, z, out, axis) => { const b = cell(a, ID, '11211', DBG, x, z, axis === 'x' ? 2 : 1, axis === 'x' ? 1 : 2, P0, [out[0], out[2]]); onStuds(a, g++ % 2 ? '2412b' : '3069b', WHITE, a.side(b), axis === 'x' ? [1, 0, 0] : [0, 0, 1]); };
  // long faces: margin 4, nine panels two wide with one-stud gaps, margin 4
  for (const [z, out] of [[BD - 1, DIRV.S], [0, DIRV.N]]) {
    run(a, 'x', z, 0, [4], P0, D); run(a, 'x', z, BW - 4, [4], P0, D);
    for (let i = 0; i < 9; i++) { panel(4 + 3 * i, z, out, 'x'); if (i < 8) run(a, 'x', z, 6 + 3 * i, [1], P0, D); }
  }
  for (const [x, out] of [[0, DIRV.W], [BW - 1, DIRV.E]]) { run(a, 'z', x, 1, [2], P0, D); panel(x, 3, out, 'z'); run(a, 'z', x, 5, [4], P0, D); panel(x, 9, out, 'z'); run(a, 'z', x, 11, [2], P0, D); }
  const T = { 1: '3070b', 2: '3069b', 4: '2431', 6: '6636' };
  for (const z of [0, BD - 1]) run(a, 'x', z, 0, [6, 6, 2, 6, 2, 6, 6], P0 + 3, D, 'tile', T);
  for (const x of [0, BW - 1]) run(a, 'z', x, 1, [6, 6], P0 + 3, D, 'tile', T);
}

// ---- lower storey 21–30 (x 3..30, z 2..11): Dark Red round posts and walls, three courses so the posts show over the parapet; the
// bracket band 30–35 under the lower eave
const BAYS = [[4, [4, 3]], [12, [4, 2, 4]], [23, [3, 4]]];   // wall runs between the posts
function lowerStorey(a) {
  // r9: above the parapet the storey shows lattice panels (Sand Green grille tiles on Dark Red side-stud bricks) and the green beam course
  // (창방) under the bracket band, as on the real gate — r8's plain red wall read as one flat slab at the larger scale
  const R = () => DRED, S = () => SG;
  const panel = (x, z, out, axis) => { const b = cell(a, ID, '11211', DRED, x, z, axis === 'x' ? 2 : 1, axis === 'x' ? 1 : 2, P0 + 3, [out[0], out[2]]); onStuds(a, '2412b', SG, a.side(b), axis === 'x' ? [1, 0, 0] : [0, 0, 1]); };
  for (const [z, out] of [[LZ0, DIRV.N], [LZ1, DIRV.S]]) {
    for (const y of [P0, P0 + 3, P0 + 6]) for (const x of POSTS) cell(a, ID, '3062b', DRED, x, z, 1, 1, y);
    for (const [x0, lens] of BAYS) { run(a, 'x', z, x0, lens, P0, R); run(a, 'x', z, x0, lens, P0 + 6, S); }
    for (const x0 of [4, 6, 8, 12, 14, 16, 18, 20, 24, 26, 28]) panel(x0, z, out, 'x');
    run(a, 'x', z, 10, [1], P0 + 3, R); run(a, 'x', z, 23, [1], P0 + 3, R);
  }
  for (const [x, out] of [[X0, DIRV.W], [X1, DIRV.E]]) { run(a, 'z', x, LZ0 + 1, splitLen(LZ1 - LZ0 - 1), P0, R); run(a, 'z', x, LZ0 + 1, splitLen(LZ1 - LZ0 - 1), P0 + 6, S); for (const z0 of [3, 5, 7, 9]) panel(x, z0, out, 'z'); }
  bracketBand(a, LZ0, LZ1, PB);
}
/** r9 (Eric: the white dots were wrong — the real gate has the gongpo, densely packed painted bracket clusters between the columns): the
 *  bracket band on the storey's wall ring, 5 plates. A Sand Green beam plate (평방); on it, every second stud, a bracket cluster — a Dark
 *  Turquoise inverted slope 2×1 standing on the wall row and corbelling one stud out (its sloped underside is the stepped bracket arm) —
 *  with Dark Green recessed panels (포벽) between them; a Sand Green cap plate on the wall row and a Red round plate on each cluster's
 *  tip (the red-tipped 쇠서), the eave plates on top. Clusters where a cell's distance from the face's ends is odd, so every face is
 *  symmetric (a double panel at the axis); plain Sand Green bricks at the corners. (Chinese New Year sets 80105 / 80107 build their
 *  bracket bands as Dark Turquoise corbels under the eave in the same way: SNOT-free inverted slopes and plates on the wall line.) */
function bracketBand(a, z0, z1, y) {
  const ring = (yy, c) => { for (const z of [z0, z1]) run(a, 'x', z, X0, splitLen(X1 - X0 + 1), yy, () => c, 'plate'); for (const x of [X0, X1]) run(a, 'z', x, z0 + 1, splitLen(z1 - z0 - 1), yy, () => c, 'plate'); };
  ring(y, SG);
  const isC = (i, lo, hi) => Math.min(i - lo, hi - i) % 2 === 1;
  const unit = (x, z, out, on) => {
    if (!on) { cell(a, ID, '3005', COL.DGREEN, x, z, 1, 1, y + 1); return; }
    const [ox, oz] = out; cell(a, ID, '3665a', COL.DTURQ, Math.min(x, x + ox), Math.min(z, z + oz), ox ? 2 : 1, oz ? 2 : 1, y + 1, [ox, oz]);
    cell(a, ID, '6141', COL.RED, x + ox, z + oz, 1, 1, y + 4);
  };
  for (const [z, oz] of [[z1, 1], [z0, -1]]) for (let x = X0 + 1; x < X1; x++) unit(x, z, [0, oz], isC(x, X0 + 1, X1 - 1));
  for (const [x, ox] of [[X1, 1], [X0, -1]]) for (let z = z0 + 1; z < z1; z++) unit(x, z, [ox, 0], isC(z, z0 + 1, z1 - 1));
  for (const x of [X0, X1]) for (const z of [z0, z1]) cell(a, ID, '3005', SG, x, z, 1, 1, y + 1);
  ring(y + 4, SG);
}
const splitLen = (n) => { const out = []; while (n > 0) { const q = n >= 6 ? 6 : n === 5 ? 3 : n; out.push(q); n -= q; } return out; };

// ---- lower roof: ring (BW + 2) × (BD + 2) (x −1..BW, z −1..BD) round the upper storey; eave plates (DBG) at LE ----------------------------
// Strips hinged at row 2, 2×4 plates rising to the upper-storey wall; corner pair 1 strips hinged at the eave row; lifts: corner 3,
// pair 1 2, pairs 2–3 1, the rest flat (long face symmetric about the axis with a channel at the centre, short face likewise).
const LIFTL = (k) => (k <= 1 ? 3 : k <= 3 ? 2 : k <= 7 ? 1 : 0);
const SWEEPL = (k) => (k <= 1 ? 8 : k <= 3 ? 11 : k <= 5 ? 13 : k <= 7 ? 15.5 : k <= 9 ? 17.5 : k <= 11 ? 19.5 : k <= 13 ? 21 : 22);   // r9: finer steps over the longer face
const RWL = BW + 2, RDL = BD + 2;
const LFR = { S: new Frame([1, 0, 0, -1], [-1, BD + 1]), N: new Frame([-1, 0, 0, 1], [BW + 1, -1]), SE: new Frame([-1, 0, 0, -1], [BW + 1, BD + 1]), NW: new Frame([1, 0, 0, 1], [-1, -1]) };
function lowerDeck(a) {
  for (const F of [LFR.S, LFR.N]) for (let u = 4; u <= RWL - 6; u += 2) { if (u === 4 || u === RWL - 6) plate(a, F, SUP, u, 0, 2, 4, LE); else plate(a, F, SUP, u, 2, 2, 4, LE); }   // r6: no deck under the strips' overhang (its studs showed under the eave)
  for (const x0 of [1, BW - 5]) for (let z = 3; z < LZ1; z += 2) plate(a, ID, SUP, x0, z, 4, 2, LE);   // r6: under the hinge bases only
  for (const F of [LFR.S, LFR.SE, LFR.N, LFR.NW]) { plate(a, F, CB, 0, 0, 6, 2, LE + 1); plate(a, F, CB, 0, 2, 6, 2, LE + 1); }   // the corner quadrants, on pair 2's deck plates
}
function lowerRoof(a) {
  lowerDeck(a); const all = [];
  { const F0 = LFR.NW; CURVE.low = { t0: tipAt(F0, 14, 2, 0, 4, LE + 1, 22), tc: tipAt(F0, 0, 0, -1, 3, LE + 4, SWEEPL(0)) }; }
  const p1th = solve(LFR.NW, 2, 0, -1, 3, LE + 3, target(CURVE.low, 2)).th;
  for (const F of [LFR.S, LFR.N]) for (let u0 = 4; u0 <= RWL - 6; u0 += 2) {
    const k = kPair(u0, RWL), edge = u0 === 4 || u0 === RWL - 6;   // (u 4 and RWL − 6 stand on the corner quadrant: lift ≥ 1)
    const { L, th } = k >= 14 ? { L: 0, th: 22 } : solve(F, u0, 2, 0, 4, LE + 1, target(CURVE.low, k), edge ? 1 : 0, 4, edge ? 12 : 5)   // flatter allowed: a lifted steep strip's top end met the upper lattice;
    for (let y = edge ? LE + 2 : LE + 1; y < LE + 1 + L; y++) plate(a, F, SUP, u0, 2, 2, 1, y);
    all.push(...strip(a, F, u0, 2, 0, 4, LE + 1 + L, null, th));
  }
  for (const F of [LFR.S, LFR.SE]) { const T = swap(F); for (let v0 = 4; v0 <= RDL - 6; v0 += 2) {
    const k = kPair(v0, RDL), { L, th } = solve(T, v0, 2, 0, 4, LE + 1, target(CURVE.low, k), 0, 4, 12);
    for (let y = LE + 1; y < LE + 1 + L; y++) plate(a, T, SUP, v0, 2, 2, 1, y);
    all.push(...strip(a, T, v0, 2, 0, 4, LE + 1 + L, null, th));
  } }
  for (const F of [LFR.S, LFR.SE, LFR.N, LFR.NW]) {
    const T = swap(F); const p1 = [];
    for (const G of [F, T]) { plate(a, G, CB, 2, 0, 2, 1, LE + 2); p1.push(...strip(a, G, 2, 0, -1, 3, LE + 3, null, p1th)); }
    const HK = Math.ceil(surf(LE + 3, 0, 1)) + 1; all.push(...p1);
    plate(a, F, CB, 0, 0, 2, 1, LE + 2); plate(a, F, CB, 0, 0, 2, 1, LE + 3); TC = WHITE; strip(a, F, 0, 0, -1, 3, LE + 4, null, SWEEPL(0)); TC = DBG;   // the corner rib strip, a plate over pair 1
    hipBlock(a, F, 2, 2, LE + 2, HK + 1, [[2, 2], [3, 3]]);
  }
  return Math.ceil(topOf(all));
}
/** a ring under the upper storey's walls from the lower deck to the upper storey's floor U0 (Dark Red, mostly hidden behind the strips) */
function upperFooting(a, U0) {
  for (const z of [UZ0, UZ1]) for (let x = X0; x <= X1; x += 4) stack(a, ID, DRED, x, z, 4, 1, LE + 1, U0);
  for (const x of [X0, X1]) stack(a, ID, DRED, x, UZ0 + 1, 1, UZ1 - UZ0 - 1, LE + 1, U0);
}

// ---- upper storey from U0 (x 3..30, z 3..10): Dark Red posts, lattice panels (Sand Green grille tiles on Dark Red side-stud bricks), a
// Sand Green beam course (창방), the bracket band; the plaque 光化門 on the south face's centre bay; returns the eave plates' level -----------
const PLAQUE_TILT = 10;   // degrees, the board's top out (r8b; the real board leans forward; r10 10°: at 15° it faced away from the light)
export const PLAQUE_PRINT = { '69729|Black': 'ko_plaque26' };   // r9: the board's printed tile (src/core/prints.ts)
function upperStorey(a, y) {
  const R = () => DRED, S = () => SG;
  const panel = (x, z, out, axis) => { const b = cell(a, ID, '11211', DRED, x, z, axis === 'x' ? 2 : 1, axis === 'x' ? 1 : 2, y, [out[0], out[2]]); onStuds(a, '2412b', SG, a.side(b), axis === 'x' ? [1, 0, 0] : [0, 0, 1]); };
  let bs = [];
  for (const [z, out] of [[UZ1, DIRV.S], [UZ0, DIRV.N]]) {
    for (const x of POSTS) for (const yy of [y, y + 3]) cell(a, ID, '3062b', DRED, x, z, 1, 1, yy);
    for (const x0 of [4, 6, 8, 24, 26, 28]) panel(x0, z, out, 'x');
    run(a, 'x', z, 10, [1], y, R); run(a, 'x', z, 23, [1], y, R);
    for (let x0 = 12; x0 <= 20; x0 += 2) panel(x0, z, out, 'x');
    if (out === DIRV.N) for (const [x0, lens] of BAYS) run(a, 'x', z, x0, lens, y + 3, S);   // the green beam course
    else { for (const [x0, lens] of [[4, [4, 3]], [12, [1]], [21, [1]], [23, [3, 4]]]) run(a, 'x', z, x0, lens, y + 3, S); bs = [13, 15, 17, 19].map((x) => cell(a, ID, '11211', SG, x, z, 2, 1, y + 3, [0, 1])); }   // the plaque's mount in the beam course, behind the board (the lattice shows under it; a lower mount met the lower roof's top tiles)
  }
  for (const [x, out] of [[X0, DIRV.W], [X1, DIRV.E]]) { for (const z0 of [4, 6, 8]) panel(x, z0, out, 'z'); run(a, 'z', x, UZ0 + 1, [6], y + 3, S); }
  bracketBand(a, UZ0, UZ1, y + 6);
  // r9 (Eric: 光化門 must be there and readable): a 2 × 8 board in the centre bay over the lattice, low enough to clear the upper eave
  // from a 30–38° camera: four Black hinge bricks 1×2 on the mount's side studs, a Black 2×8 plate on the hinge tops (its lower row on
  // them), the printed 2×6 tile in the middle and Dark Red 1×2 tiles standing at its ends as the frame; the hinge tops turned PLAQUE_TILT
  // so the board's top leans out from the wall
  const studs = bs.flatMap((b) => a.side(b)), d = studs[0].d, recs = [];
  for (let i = 0; i < 4; i++) { const base = onStuds(a, '3937', DRED, studs.slice(2 * i, 2 * i + 2), [1, 0, 0]); recs.push(a.put('3938', DRED, base.R, base.t)); }   // r10: Dark Red, as the frame and the posts (black hinges showed past the board's end)
  const P = [0, 1, 2].map((k) => studs.reduce((q, st) => q + st.p[k], 0) / studs.length), at = (h) => P.map((v, k) => v + h * d[k]);
  const low = (id) => { const b = bbox(id); return [(b[0] + b[3]) / 2, b[1], (b[2] + b[5]) / 2 + 0.5]; };   // the underside cell half a stud off centre: its lower row on the hinge row
  recs.push(a.onStud('3034', BLACK, { p: at(1.2), d }, [1, 0, 0], 'x', low('3034')), a.onStud('69729', BLACK, { p: at(1.6), d }, [1, 0, 0], 'x', low('69729')));
  for (const sx of [-3.5, 3.5]) recs.push(a.onStud('3069b', DRED, { p: [at(1.6)[0] + sx, at(1.6)[1] + 0.5, at(1.6)[2]], d }, [0, -1, 0], 'x'));
  turn(recs, rodrigues([1, 0, 0], PLAQUE_TILT), at(0.7));   // the hinge axle 0.5 stud under the base's top
  return y + 11;
}

// ---- haechi (one statue, 2 × 4 footprint, facing +z): two-step plinth, forelegs of round bricks, haunches, a curved back, a grille grin,
// tooth-plate brows ------------------------------------------------------------------------------------------------------------------------
function haechi(a) {
  // r8 (Eric: crouching animals, not boxes): a seated beast in profile — rounded haunches low at the back, straight forelegs, a deep chest,
  // the head raised over the forelegs with its grin, a rounded crown and mane; on a granite plinth with a dark cap plate
  const F = ID;
  brick(a, F, LBG, 0, 0, 2, 4, 0); plate(a, F, DBG, 0, 0, 2, 4, 3);             // plinth
  for (const x of [0, 1]) cell(a, F, '6091', LBG, x, 0, 1, 2, 4, [0, -1]);     // haunches: curved tops rounding down to the back (4–8)
  for (const x of [0, 1]) { cell(a, F, '3062b', LBG, x, 3, 1, 1, 4); cell(a, F, '6141', LBG, x, 3, 1, 1, 7); }   // forelegs (4–8)
  brick(a, F, LBG, 0, 2, 2, 1, 4); plate(a, F, LBG, 0, 2, 2, 1, 7);             // the belly between them
  brick(a, F, LBG, 0, 2, 2, 2, 8);                                             // chest (8–11)
  const head = cell(a, F, '11211', LBG, 0, 3, 2, 1, 11, [0, 1]);                // head over the forelegs (11–14)
  onStuds(a, '2412b', LBG, a.side(head), [1, 0, 0]);                           // the grin
  brick(a, F, LBG, 0, 2, 2, 1, 11);                                            // back of the head
  plate(a, F, LBG, 0, 2, 2, 2, 14);                                            // crown
  for (const x of [0, 1]) { cell(a, F, '49307', LBG, x, 3, 1, 1, 15); cell(a, F, '49307', LBG, x, 2, 1, 1, 15); }   // rounded brow and curled mane
}

export function gwanghwamun(a) {
  granite(a); parapet(a); lowerStorey(a);
  const lowTop = lowerRoof(a); const U0 = LE + 6;   // r6: the lattice starts just over the lower roof's top at the wall, all of the storey shows
  upperFooting(a, U0); const E = upperStorey(a, U0); const RT = upperRoof(a, E);
  console.log(`levels: lower ribs top ${lowTop}, upper storey ${U0}, upper eave plates ${E}, ridge white ${RT}, top ≈ ${RT + 2}`);
}

if (process.argv[1] && process.argv[1].endsWith('asm-ko-palace.mjs')) {
  const g = new Asm('ko_gwanghwamun', [BW / 2, 0, BD / 2]); gwanghwamun(g);
  let out = g.write(); console.log('ko_gwanghwamun:', g.parts.length, 'parts', JSON.stringify(out.bom.map(([k]) => k)));
  let ex = g.exposed(); if (ex.length) console.log('exposed side studs:', ex.length, JSON.stringify(ex.slice(0, 8)));
  const h = new Asm('ko_haechi', [1, 0, 2]); haechi(h);
  out = h.write(); console.log('ko_haechi:', h.parts.length, 'parts', JSON.stringify(out.bom.map(([k]) => k)));
  ex = h.exposed(); if (ex.length) console.log('exposed side studs (haechi):', JSON.stringify(ex));
}
