// Jin Mao Tower v4 (2026-10-03) — one assembly of real parts, authored in our frame (tools/ldraw/asm-ours.mjs).
//   LDRAW_DIR=<main repo>/vendor/ldraw-lib/ldraw node tools/ldraw/asm-jinmao.mjs && node tools/ldraw/bake.mjs jinmao.ldr --force
// Eric on v3 (2026-10-03): "完全不像" — the spindled fences read as white round columns the tower does not have, the corner eaves were
// wrong, and the crown had no spikes round the spire. v4 starts again from the photographs (docs/refs/shanghai-trio/real-jinmao-*):
//   plan   5 × 5 with the corner cells cut away — the real square with stepped (re-entrant) corners, at the scheme's 5 studs (≈ 6 : 1)
//   faces  three cells each: dark glass either side of a silver centre rib, the rib running unbroken up every tier
//   tiers  eight, shorter toward the top: four plain storeys (2, 2, 2, 1 shaft courses + the eave plate), then four that each end in a
//          flare course (a storey of flare alone read as a stack of inverted pyramids): an inverted double-convex
//          45° slope on every corner grows the cut corner back out to the full square, so each tier widens at its top like a pagoda
//          storey — then a full 5 × 5 joint plate (the eave line) whose bare corner carries a tile
//   crown  a 3 × 3 storey on the last eave, cheese slopes round it as the stepped roof, a 1 × 1 shaft, four pinnacles on the corners of
//          the 3 × 3, flat teeth splaying out from the eave corners, and the needle spire
// Frame: axis at (0, 0) (a cell centre); 7 × 7 podium.
import { Asm, bbox, PLATE } from './asm-ours.mjs';
const GLASS = +(process.env.JM_GLASS ?? 72), RIB = +(process.env.JM_RIB ?? 179), EAVE = +(process.env.JM_EAVE ?? 71), FLARE = +(process.env.JM_FLARE ?? 71), CORE = 72, LBG = 71, SILVER = 179;
const a = new Asm('jinmao', [0, 0, 0]);
const appR = (A, v) => [0, 1, 2].map((i) => A[i * 3] * v[0] + A[i * 3 + 1] * v[1] + A[i * 3 + 2] * v[2]);
const yaw = (deg) => { const t = (deg * Math.PI) / 180, c = Math.cos(t), s = Math.sin(t); return [c, 0, s, 0, 1, 0, -s, 0, c]; };
/** bbox bottom-centre at (x, plate y, z) from the axis, turned by `deg` */
function at(id, color, x, y, z, deg = 0) { const b = bbox(id); const R = yaw(deg); const cs = [];
  for (const cx of [b[0], b[3]]) for (const cy of [b[1], b[4]]) for (const cz of [b[2], b[5]]) cs.push(appR(R, [cx, cy, cz]));
  const lo = [0, 1, 2].map((i) => Math.min(...cs.map((c) => c[i]))), hi = [0, 1, 2].map((i) => Math.max(...cs.map((c) => c[i])));
  return a.put(id, color, R, [x - (lo[0] + hi[0]) / 2, y * PLATE - lo[1], z - (lo[2] + hi[2]) / 2]); }
// a part's bbox measured from its LDraw origin is off-centre for corner moulds (3676 slopes toward +x +z): turning by deg about the origin
// and re-centring the bbox as `at` does keeps the footprint where it is asked for
const QUADS = [[1, 1], [1, -1], [-1, -1], [-1, 1]];
const toward = (sx, sz) => ({ '1,1': 0, '1,-1': 90, '-1,-1': 180, '-1,1': 270 })[`${sx},${sz}`];   // yaw that takes +x +z to (sx, sz)

// podium: two 7 × 7 courses, rows along x then along z (each row a 1×6 and a 1×1, staggered)
let y = 0;
for (let k = 0; k < 2; k++, y++) for (let r = -3; r <= 3; r++) { const s = (r + k) % 2 ? 1 : -1;
  if (k === 0) { at('3666', LBG, -0.5 * s, y, r); at('3024', LBG, 3 * s, y, r); } else { at('3666', LBG, r, y, -0.5 * s, 90); at('3024', LBG, r, y, 3 * s); } }

/** one shaft course (a brick tall) of the 5 × 5 cut-corner plan. Every face cell is a 1×2 running into the core, alternately for the z
 *  faces (`zFirst`) and the x faces, so consecutive courses bond across each other; the rib is the face's centre cell */
function shaft(zFirst) {
  const face = (i) => (i === 0 ? RIB : GLASS);
  for (const sz of [1, -1]) for (let i = -1; i <= 1; i++) {
    if (zFirst) at('3004', face(i), i, y, 1.5 * sz, 90); else if (i === 0) at('3004', RIB, 0, y, 1.5 * sz, 90); else at('3005', GLASS, i, y, 2 * sz);
  }
  for (const sx of [1, -1]) for (let i = -1; i <= 1; i++) {
    if (!zFirst) at('3004', face(i), 1.5 * sx, y, i); else if (i === 0) at('3004', RIB, 1.5 * sx, y, 0); else at('3005', GLASS, 2 * sx, y, i);
  }
  at('3005', CORE, 0, y, 0);
  y += 3;
}
/** the flare course: an inverted double-convex slope on each corner (its foot on the core cell (±1, ±1), its top the full corner), the
 *  face ribs running on, then the joint plate — a pinwheel of four 2×3 plates and a 1×1 — whose corners stick out as the eave */
function flare() {
  for (const [sx, sz] of QUADS) at('3676', FLARE, 1.5 * sx, y, 1.5 * sz, toward(sx, sz));
  for (const sz of [1, -1]) at('3004', RIB, 0, y, 1.5 * sz, 90);
  for (const sx of [1, -1]) at('3004', RIB, 1.5 * sx, y, 0);
  at('3005', CORE, 0, y, 0);
  y += 3;
  joint();
}
function joint() {
  at('3021', EAVE, -1, y, -1.5); at('3021', EAVE, 1.5, y, -1, 90); at('3021', EAVE, 1, y, 1.5); at('3021', EAVE, -1.5, y, 1, 90); at('3024', EAVE, 0, y, 0);
  y += 1;
}
/** the eave tip: the joint plate's bare corner cell, tiled */
const eaveTips = () => { for (const [sx, sz] of QUADS) at('3070b', EAVE, 2 * sx, y, 2 * sz); };

// [shaft courses, flares?]: plain storeys (shaft + eave plate) below, flaring storeys above — the pagoda grows stronger toward the crown,
// as on the real tower; all-plain read as a banded office block, all-flared as a stack of inverted pyramids (both rendered 2026-10-03)
const TIERS = [[2, false], [2, false], [2, false], [2, false], [1, false], [1, true], [1, true], [1, true], [1, true]];
let flip = true;
for (const [n, flares] of TIERS) { for (let i = 0; i < n; i++) { shaft(flip); flip = !flip; } if (flares) flare(); else joint(); eaveTips(); }
const SHOULDER = y;
// crown, a stepped pyramid: the last eave's ring under cheese slopes round a 3 × 3 plate; on that, a cut-corner plus with cheese slopes
// on its arms and tiles on the 3 × 3's corners; the needle: round brick, cone, 3L bar. (Four splayed 3L fins round the needle were cut —
// Eric 2026-10-03: 丑死了.)
for (let i = -1; i <= 1; i++) { at('54200', SILVER, i, y, 2, 0); at('54200', SILVER, i, y, -2, 180); at('54200', SILVER, 2, y, i, 90); at('54200', SILVER, -2, y, i, 270); }
at('11212', SILVER, 0, y, 0); y += 1;
at('3622', SILVER, 0, y, 0); at('3005', SILVER, 0, y, 1); at('3005', SILVER, 0, y, -1);
for (const [sx, sz] of QUADS) at('3070b', SILVER, sx, y, sz);
y += 3;
at('54200', SILVER, 0, y, 1, 0); at('54200', SILVER, 0, y, -1, 180); at('54200', SILVER, 1, y, 0, 90); at('54200', SILVER, -1, y, 0, 270);
at('3062b', SILVER, 0, y, 0); y += 3; at('4589', SILVER, 0, y, 0); y += 3; at('87994', SILVER, 0, y, 0);
console.log(`jinmao v4: shoulders ${SHOULDER} · spire base ${y} plates (+3 bar)`);
const out = a.write(); console.log('jinmao:', out.file, a.parts.length, 'parts', JSON.stringify(out.bom));
