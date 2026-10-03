// Shanghai Tower v7 (2026-10-03) — one assembly of real parts, authored in our frame (tools/ldraw/asm-ours.mjs).
//   LDRAW_DIR=<main repo>/vendor/ldraw-lib/ldraw node tools/ldraw/asm-shtower.mjs && node tools/ldraw/bake.mjs shtower.ldr --force
// Scheme: docs/countries/china.md §1.9.3. Eric on v6 (2026-10-03, 30/100): not see-through, not blue, and the twist is wrong — the real
// tower turns a little at every floor, which gives it its order; v6 turned 15° per 13-plate zone and read as a pile of drums.
// v7 is a turntable stack: 22 thin rigid units (5 plates each), every one turned 120/21° on the one below about the axis, so the corners
// and the notch climb in an even spiral. A unit is
//   L0  one plate course that bonds the unit (its seams sit under the middle of the bricks above)
//   L1  one brick course: the glass skin on the outline, an opaque core inside (seen through the glass)
//   L4  one tile course, smooth so the next unit can sit at any angle, with ONE centre stud — the pivot the next unit turns on
// Outlines (cells, axis at the origin):
//   8 wide  round corners r 2 as below, 4-long flats — the bottom two zones (v7's 7 → 6 bulged: the squarer 6 read as wide as the 7)
//   7 wide  round corners r 2: macaroni bricks / tiles on 3×3 round-corner plates (their seams cross the macaroni ↔ flat joint)
//   6 wide  round corners r 1: 2×2 round bricks / tiles on 2×6 two-round-corner plates, a 2×6 plate down the middle (tube on the axis)
//   crown   the 6-wide skin run on as an open ring round a dark roof, its rim a course higher on the notch half
// The notch is one opaque grey cell flush in the +x flat of every unit (v7's open slot showed the inside — Eric: 没合上): a stripe that spirals up. The last unit of each zone carries
// white tiles: the eight refuge-floor bands. Glass is Trans-Very-Light-Blue (drawn with real transmission) round a Dark Bluish Gray core (Eric chose it from four, 2026-10-03),
// bands white, the notch Dark Bluish Gray like the core (Sand Blue read as a blue inside — Eric 2026-10-03).
// Frame: axis at (0, 0); the 10-wide podium (four 4×4 quarter-round plates + a cross) is the footprint, 10 × 10, origin at its bottom centre.
import { Asm, bbox, PLATE } from './asm-ours.mjs';
const WHITE = 15, LBG = 71;
const GLASS = +(process.env.ST_GLASS ?? 39), CORE = +(process.env.ST_CORE ?? 72), NOTCH = +(process.env.ST_NOTCH ?? 72), BAND = +(process.env.ST_BAND ?? 15);
const a = new Asm('shtower', [0, 0, 0]);
const appR = (A, v) => [0, 1, 2].map((i) => A[i * 3] * v[0] + A[i * 3 + 1] * v[1] + A[i * 3 + 2] * v[2]);
const mulR = (A, B) => [0, 1, 2].flatMap((i) => [0, 1, 2].map((j) => A[i * 3] * B[j] + A[i * 3 + 1] * B[3 + j] + A[i * 3 + 2] * B[6 + j]));
const yaw = (deg) => { const t = (deg * Math.PI) / 180, c = Math.cos(t), s = Math.sin(t); return [c, 0, s, 0, 1, 0, -s, 0, c]; };
const RY = (q) => yaw(90 * q);
/** bbox bottom-centre of `id` (turned q quarter turns in the unit) at unit-local (lx, plate y, lz); the unit is turned Z about the axis */
function cell(id, color, lx, y, lz, q, Z) { const b = bbox(id); const R = mulR(Z, RY(q)); const lc = appR(RY(q), [(b[0] + b[3]) / 2, b[1], (b[2] + b[5]) / 2]); const p = appR(Z, [lx - lc[0], 0, lz - lc[2]]); return a.put(id, color, R, [p[0], y * PLATE - lc[1], p[2]]); }
// quarter turn that points a corner mould's round corner (at `base` when unturned, from tools/ldraw/corner.mjs) at quadrant (sx, sz)
const turnTo = (base, sx, sz) => { for (let q = 0; q < 4; q++) { const d = appR(RY(q), [base[0], 0, base[1]]); if (Math.sign(Math.round(d[0])) === sx && Math.sign(Math.round(d[2])) === sz) return q; } throw new Error('no turn'); };
const ROUND = { '3063b': [1, 1], '27925': [1, 1], '30357': [1, -1], '30565': [1, 1] };
const QUADS = [[1, 1], [1, -1], [-1, -1], [-1, 1]];

// podium: two courses of a 10-wide near-disc (quarter-round 4×4 plates on the quadrants, a 2-wide cross), even like the 8-wide foot
let y = 0;
for (let k = 0; k < 2; k++, y++) {
  for (const [sx, sz] of QUADS) cell('30565', LBG, 3 * sx, y, 3 * sz, turnTo(ROUND['30565'], sx, sz), I3());
  cell('3832', LBG, 0, y, 0, k, I3()); for (const s of [1, -1]) k ? cell('3020', LBG, 3 * s, y, 0, 0, I3()) : cell('3020', LBG, 0, y, 3 * s, 1, I3());
}
function I3() { return [1, 0, 0, 0, 1, 0, 0, 0, 1]; }

/** a 7-wide unit at plate y turned Z; `band`: white top ring; `first`: sits straight on the podium studs (no pivot under it) */
function unit7(y, Z, band) {
  const top = band ? BAND : GLASS;
  // L0: four 3×3 round-corner plates on the quadrants, a cross of 1-wide plates
  for (const [sx, sz] of QUADS) cell('30357', GLASS, 2 * sx, y, 2 * sz, turnTo(ROUND['30357'], sx, sz), Z);
  cell('3623', GLASS, -2, y, 0, 0, Z); cell('3024', CORE, 0, y, 0, 0, Z); cell('3023', GLASS, 1.5, y, 0, 0, Z); cell('3024', NOTCH, 3, y, 0, 0, Z); cell('3623', GLASS, 0, y, 2, 1, Z); cell('3623', GLASS, 0, y, -2, 1, Z);
  // L1: macaronis, flats, core (columns at x ±2 and rows across the middle, every one spanning an L0 seam)
  const b = y + 1;
  for (const [sx, sz] of QUADS) cell('3063b', GLASS, 2.5 * sx, b, 2.5 * sz, turnTo(ROUND['3063b'], sx, sz), Z);
  cell('3622', GLASS, 0, b, 3, 0, Z); cell('3622', GLASS, 0, b, -3, 0, Z); cell('3622', GLASS, -3, b, 0, 1, Z);
  cell('3005', GLASS, 3, b, 1, 0, Z); cell('3004', NOTCH, 2.5, b, 0, 0, Z); cell('3005', GLASS, 3, b, -1, 0, Z);   // the notch: Sand Blue in every course, flush in the skin
  cell('3622', CORE, -2, b, 0, 1, Z); cell('3005', CORE, 2, b, 1, 0, Z); cell('3005', CORE, 2, b, -1, 0, Z);
  for (const z of [-2, -1, 0, 1, 2]) cell('3622', CORE, 0, b, z, 0, Z);
  // L4: tiles in the same layout, the pivot (1×1 round plate) on the axis
  const t = y + 4;
  for (const [sx, sz] of QUADS) cell('27925', top, 2.5 * sx, t, 2.5 * sz, turnTo(ROUND['27925'], sx, sz), Z);
  cell('63864', top, 0, t, 3, 0, Z); cell('63864', top, 0, t, -3, 0, Z); cell('63864', top, -3, t, 0, 1, Z); cell('3070b', top, 3, t, 1, 0, Z); cell('3069b', NOTCH, 2.5, t, 0, 0, Z); cell('3070b', top, 3, t, -1, 0, Z);
  cell('63864', CORE, -2, t, 0, 1, Z); cell('3070b', CORE, 2, t, 1, 0, Z); cell('3070b', CORE, 2, t, -1, 0, Z);
  for (const z of [-2, -1, 1, 2]) cell('63864', CORE, 0, t, z, 0, Z);
  cell('3070b', CORE, -1, t, 0, 0, Z); cell('3070b', CORE, 1, t, 0, 0, Z); cell('6141', CORE, 0, t, 0, 0, Z);
}
/** an 8-wide unit (cells on half studs): macaroni corners on 3×3 round-corner plates, 4-long flats, the notch the +x flat's z > 0
 *  inner cell — the bottom zones, so the outline only ever shrinks: 8 → 7 → 6 (v7's 7 → 6 let the squarer 6 read as a bulge) */
function unit8(y, Z, band) {
  const top = band ? BAND : GLASS;
  // L0: 3×3 round-corner plates on the quadrants, a 2×6 + 2×2 strip across x (its tube on the axis), 2×3 arms along z
  for (const [sx, sz] of QUADS) cell('30357', GLASS, 2.5 * sx, y, 2.5 * sz, turnTo(ROUND['30357'], sx, sz), Z);
  cell('3795', GLASS, -1, y, 0, 0, Z); cell('3023', GLASS, 2.5, y, 0, 1, Z); cell('3024', GLASS, 3.5, y, -0.5, 0, Z); cell('3024', NOTCH, 3.5, y, 0.5, 0, Z); cell('3021', GLASS, 0, y, 2.5, 1, Z); cell('3021', GLASS, 0, y, -2.5, 1, Z);
  const b = y + 1;
  for (const [sx, sz] of QUADS) cell('3063b', GLASS, 3 * sx, b, 3 * sz, turnTo(ROUND['3063b'], sx, sz), Z);
  cell('3010', GLASS, 0, b, 3.5, 0, Z); cell('3010', GLASS, 0, b, -3.5, 0, Z); cell('3010', GLASS, -3.5, b, 0, 1, Z);
  cell('3004', GLASS, 3.5, b, -1, 1, Z); cell('3004', NOTCH, 3, b, 0.5, 0, Z); cell('3005', GLASS, 3.5, b, 1.5, 0, Z);
  cell('3010', CORE, 0, b, 2.5, 0, Z); cell('3010', CORE, 0, b, -2.5, 0, Z); cell('3004', CORE, 2.5, b, -1, 1, Z); cell('3005', CORE, 2.5, b, 1.5, 0, Z); cell('3010', CORE, -2.5, b, 0, 1, Z);
  cell('3001', CORE, 0, b, 1, 0, Z); cell('3001', CORE, 0, b, -1, 0, Z);
  const t = y + 4;
  for (const [sx, sz] of QUADS) cell('27925', top, 3 * sx, t, 3 * sz, turnTo(ROUND['27925'], sx, sz), Z);
  cell('2431', top, 0, t, 3.5, 0, Z); cell('2431', top, 0, t, -3.5, 0, Z); cell('2431', top, -3.5, t, 0, 1, Z);
  cell('3069b', top, 3.5, t, -1, 1, Z); cell('3069b', NOTCH, 3, t, 0.5, 0, Z); cell('3070b', top, 3.5, t, 1.5, 0, Z);
  cell('2431', CORE, 0, t, 2.5, 0, Z); cell('2431', CORE, 0, t, -2.5, 0, Z); cell('3069b', CORE, 2.5, t, -1, 1, Z); cell('3070b', CORE, 2.5, t, 1.5, 0, Z); cell('2431', CORE, -2.5, t, 0, 1, Z);
  cell('2431', CORE, 0, t, 1.5, 0, Z); cell('2431', CORE, 0, t, -1.5, 0, Z); cell('3069b', CORE, 1.5, t, 0, 1, Z); cell('3069b', CORE, -1.5, t, 0, 1, Z);
  cell('87580', CORE, 0, t, 0, 0, Z);
}
/** a 6-wide unit (cells on half studs): round 2×2 corners, the +x flat is the notch */
function unit6(y, Z, band) {
  const top = band ? BAND : GLASS;
  // L0: two 2×6 two-round-corner plates on the ±z rows, a 2×4 + 1×2 down the middle (the 2×4's middle tube is on the axis)
  cell('18980', GLASS, 0, y, 2, 0, Z); cell('18980', GLASS, 0, y, -2, 2, Z); cell('3020', GLASS, -1, y, 0, 0, Z); cell('3023', GLASS, 1.5, y, 0, 1, Z); cell('3024', GLASS, 2.5, y, -0.5, 0, Z); cell('3024', NOTCH, 2.5, y, 0.5, 0, Z);
  // L1: round bricks on the corners, flats, a 2×4 core down the middle and 1×2 cores either side
  const b = y + 1;
  for (const [sx, sz] of QUADS) cell('3941', GLASS, 2 * sx, b, 2 * sz, 0, Z);
  cell('3004', GLASS, 0, b, 2.5, 0, Z); cell('3004', GLASS, 0, b, -2.5, 0, Z); cell('3004', GLASS, -2.5, b, 0, 1, Z);
  cell('3004', GLASS, 2, b, -0.5, 0, Z); cell('3004', NOTCH, 2, b, 0.5, 0, Z);   // the notch: Sand Blue in every course, flush in the skin
  cell('3001', CORE, 0, b, 0, 1, Z); cell('3004', CORE, -1.5, b, 0, 1, Z);
  // L4: round tiles, flat tiles, the jumper on the axis
  const t = y + 4;
  for (const [sx, sz] of QUADS) cell('14769', top, 2 * sx, t, 2 * sz, 0, Z);
  cell('3069b', top, 0, t, 2.5, 0, Z); cell('3069b', top, 0, t, -2.5, 0, Z); cell('3069b', top, -2.5, t, 0, 1, Z);
  cell('3069b', CORE, 0, t, 1.5, 0, Z); cell('3069b', CORE, 0, t, -1.5, 0, Z); cell('3069b', CORE, -1.5, t, 0, 1, Z); cell('3069b', top, 2, t, -0.5, 0, Z); cell('3069b', NOTCH, 2, t, 0.5, 0, Z);
  cell('87580', CORE, 0, t, 0, 0, Z);
}

const ZONES = [[8, 3], [8, 3], [7, 2], [7, 2], [7, 2], [6, 2], [6, 2], [6, 2], [6, 2]];   // [width, units]; the last unit of a zone is the band
const N = ZONES.reduce((s, [, n]) => s + n, 0) + 1; const TURN = 120 / (N - 1);
let u = 0;
for (const [w, n] of ZONES) for (let i = 0; i < n; i++, u++) { const Z = yaw(TURN * u); ({ 8: unit8, 7: unit7, 6: unit6 })[w](y, Z, i === n - 1); y += 5; }
const TOP = y;
// the crown: the skin runs on past the last floor as an open ring at full width — walls round a dark roof, no core, no tiles inside —
// and its rim rises a course on the notch half (the real rim is cut on a slant). v7's 4-wide drum stuck up out of the top like a chimney
// (Eric 2026-10-03: 顶端凸出来了一块).
{ const Z = yaw(TURN * u), ROOF = 72;
  cell('18980', GLASS, 0, y, 2, 0, Z); cell('18980', GLASS, 0, y, -2, 2, Z); cell('3020', GLASS, -1, y, 0, 0, Z); cell('3022', GLASS, 2, y, 0, 0, Z);
  const b = y + 1;
  for (const [sx, sz] of QUADS) cell('3941', GLASS, 2 * sx, b, 2 * sz, 0, Z);
  cell('3004', GLASS, 0, b, 2.5, 0, Z); cell('3004', GLASS, 0, b, -2.5, 0, Z); cell('3004', GLASS, -2.5, b, 0, 1, Z);
  cell('3005', GLASS, 2.5, b, -0.5, 0, Z); cell('3005', NOTCH, 2.5, b, 0.5, 0, Z);
  for (const z of [-1.5, -0.5, 0.5, 1.5]) cell('3069b', ROOF, 0, b, z, 0, Z); cell('3069b', ROOF, 1.5, b, 0, 1, Z); cell('3069b', ROOF, -1.5, b, 0, 1, Z);   // the roof inside the ring
  const t = y + 4;
  // the −x half of the rim tiled at this course; the +x half (notch side) one brick higher
  for (const sz of [1, -1]) cell('14769', GLASS, -2, t, 2 * sz, 0, Z);
  cell('3069b', GLASS, -2.5, t, 0, 1, Z);
  for (const sz of [1, -1]) cell('3069b', GLASS, 0, t, 2.5 * sz, 0, Z);   // the ±z flats span the middle: tiled low
  for (const sz of [1, -1]) cell('3941', GLASS, 2, t, 2 * sz, 0, Z);
  cell('3005', GLASS, 2.5, t, -0.5, 0, Z); cell('3005', NOTCH, 2.5, t, 0.5, 0, Z);
  for (const sz of [1, -1]) cell('14769', GLASS, 2, t + 3, 2 * sz, 0, Z);
  cell('3070b', GLASS, 2.5, t + 3, -0.5, 0, Z); cell('3070b', NOTCH, 2.5, t + 3, 0.5, 0, Z);
  y = t + 4; }
console.log(`shtower v7: ${N} units × ${TURN.toFixed(2)}° · zones top ${TOP} · tip ${y} plates`);
const out = a.write(); console.log('shtower:', out.file, a.parts.length, 'parts', JSON.stringify(out.bom));
