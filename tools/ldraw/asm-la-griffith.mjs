// Griffith Observatory v2 (2026-10-04) — the building and the Astronomers Monument, two assemblies of real parts in our frame
// (tools/ldraw/asm-ours.mjs).
//   LDRAW_DIR=<main repo>/vendor/ldraw-lib/ldraw node tools/ldraw/asm-la-griffith.mjs && node tools/ldraw/bake.mjs griffith.ldr griffith_monument.ldr --force
// Scheme: docs/refs/la-hollywood-sign/SCHEME.md §3 (signed off 2026-10-04); build notes and what was rejected: docs/refs/la-griffith/BUILD.md.
// Frame: footprint gx 0..27 (west → east) × gz 0..18 (north → south; gz 18 is the forecourt row, the front faces +z); the LDraw origin is the footprint's bottom centre.
// Plan along x: side drum 5 · wing 6 · pavilion 6 · wing 6 · side drum 5 = 28 (the scheme's 26 gave 4-stud wings squeezed between fat
// drums; real proportions are drum 0.16 · wing 0.26 · pavilion 0.17 of the width). Plates from the terrace (0):
//   0–1     white base course under every wall; LBG paving tiles on every other cell of the footprint (the proxy is a rectangle)
//   1–11    wings: a studs-up body behind a SNOT curtain of standing plates, from the pavilion out W W P × 5 (windows 0.8 × 2 studs, as
//           tall-narrow as the real ones), hung on 1×1×1⅔ side-stud bricks in the pavilion's side walls, whose studs fall at
//           2.25 / 4.75 / 7.25 / 9.75 plates — the curtain's 1×1 + 1×2 + 1×1 standing plates; cornice 11–12, terrace tiles 12–13
//   1–16    pavilion: stepped portal (white jambs, bronze doors), roof 14–15, tiles 15–16; rotunda on its back half: 4×4 round brick
//           15–18, Sand Green 6×6 dish 18–20, lantern to 22
//   1–16    side drums 5 × 4 (2×2 round corners + a middle column, a dark slit window); telescope domes 16–18: a Reddish Brown 4×4 dish
//           with a 4×1 double curved slope over its crown as the shutter band (to 18.5)
//   1–16    main drum 12 × 12: 4×4 round corners, each flat a pilaster pair between recessed panels (dark windows in the back and side
//           panels); two deck layers 16–18; pilaster heads 18–20; dome 18–28 of four 5×5 quarter domes; finial to 30
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
import { Asm, bbox, PLATE } from './asm-ours.mjs';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const WHITE = 15, LBG = 71, DBG = 72, TAN = 19, RB = 70, DGREEN = 288, SGREEN = 378, BLACK = 0, GOLD = 297, DBROWN = 308, DTAN = 28;
// Dome colours (BrickLink known colours, checked 2026-10-04/05): all three domes are copper brown, as today's building. 76776 (5×5 quarter
// dome) is made in Reddish Brown. The 2×2 quarter dome 5906 is not (nor Dark Brown); neither are 88293 (3×3 quarter dome), 49612, 86500
// (4×4 dome), 30208 / 24130 (hemispheres). 65617 (3×3×1 curved corner) and 24599 (5×5×1) are, but too wide and flat for a 4-stud dome.
// v4 built them of 1871 quarter domes + 6091 curved slopes (both made in Reddish Brown): lumpy. v5: Dish 4×4 inverted (3960, a known
// Reddish Brown colour) as a smooth low dome, band = Slope Curved 4×1 Double (93273, Reddish Brown) over its crown.
// (v1 Dark Red read crimson, v2/v3 Dark Bluish Gray was the pre-2006 colour.)
// r2 (Eric, 2026-10-05: "3 个棕色过深 … 绿有点廉价 … 有些圆表面有质感"): colours re-sampled from daylight photos 2022–2024
// (docs/refs/la-griffith/daylight/, BUILD.md r2). Today's copper is a weathered warm grey-brown, not Reddish Brown: the main dome reads as a
// light taupe, about 0.6–0.75 of the white walls' brightness in sun, the telescope domes darker charcoal-bronze (0.3–0.6) → main dome
// Dark Tan, telescope domes Dark Bluish Gray. 76776 is not made in either (BrickLink: Reddish Brown, Nougat, Sand Green, White, Bright
// Light Orange, Reddish Orange), so the main dome is now brick-built in courses — which is also how the real one reads (horizontal panel
// courses, standing seams): see the main dome below.
const DOME_Q = DBG, SIDE_Q = DBG, BAND = DBG;
const W = 28, D = 19, ZB = -1;                                                              // footprint gz ZB..D−1: the row behind the drum (gz −1) carries its back pilasters and the promenade
const a = new Asm('griffith', [W / 2, 0, (ZB + D) / 2]);
const yaw = (r) => { const c = [1, 0, -1, 0][r & 3], s = [0, 1, 0, -1][r & 3]; return [c, 0, s, 0, 1, 0, -s, 0, c]; };
const appR = (A, v) => [0, 1, 2].map((i) => A[i * 3] * v[0] + A[i * 3 + 1] * v[1] + A[i * 3 + 2] * v[2]);
/** a round part centred on (x, z), bottom at plate y */
const round = (id, color, x, y, z) => a.put(id, color, yaw(0), [x, y * PLATE - bbox(id)[1], z]);

/** the bbox corner (sx, sz) of a part's footprint that its curve cuts away, measured on the baked mesh */
const cutCache = new Map();
// the 2×2 corner moulds also have a notch at the arc's centre that is farther from the mesh than the rounded corner: v2 turned them all
// inward (square drums, judge round 1), so their round corner is given by hand, checked in a top-down close-up
// 27507 and 87559 are quarter rings: the inner hole is farther from the mesh still
const CUT = { '3063b': [1, 1], '79491': [-1, 1], '27507': [1, 1], '87559': [1, 1] };
function cut(id) {
  if (CUT[id]) return CUT[id]; if (cutCache.has(id)) return cutCache.get(id);
  const src = fs.readFileSync(path.join(ROOT, 'src/parts/ldraw', `p${id}.ts`), 'utf8'); const rec = JSON.parse(/const p: Baked = (.*);\n/.exec(src)[1]);
  const buf = Buffer.from(rec.pos, 'base64'); const P = new Int16Array(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length)); const b = rec.bbox;
  let best = null, far = -1;
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) { const cx = sx < 0 ? b[0] : b[3], cz = sz < 0 ? b[2] : b[5]; let m = 1e9;
    for (let i = 0; i < P.length; i += 3) m = Math.min(m, Math.hypot(P[i] / rec.q - cx, P[i + 2] / rec.q - cz)); if (m > far) { far = m; best = [sx, sz]; } }
  cutCache.set(id, best); return best;
}
/** a quarter-round part in the quadrant (sx, sz) of the corner point (cx, cz): its cut corner points outward, bottom at plate y */
function quad(id, color, cx, cz, y, sx, sz) {
  const [ux, uz] = cut(id); let r = 0; for (; r < 4; r++) { const v = appR(yaw(r), [ux, 0, uz]); if (Math.round(v[0]) === sx && Math.round(v[2]) === sz) break; }
  if (r === 4) throw new Error('no turn for ' + id); const b = bbox(id); const w = Math.round(b[3] - b[0]), d = Math.round(b[5] - b[2]); const [fw, fd] = r % 2 ? [d, w] : [w, d];
  return a.up(id, color, sx > 0 ? cx : cx - fw, y, sz > 0 ? cz : cz - fd, r);
}
const Q4 = [[1, 1], [1, -1], [-1, -1], [-1, 1]];
const PLT = { 1: '3024', 2: '3023', 3: '3623', 4: '3710', 6: '3666', 8: '3460' }, BRK = { 1: '3005', 2: '3004', 3: '3622', 4: '3010', 6: '3009', 8: '3008' };
const TL = { 1: '3070b', 2: '3069b', 3: '63864', 4: '2431' };
/** 1-wide runs over a cell set (Map "i,j" → colour), along x on even calls and z on odd ones, a 1-long run tried the other way */
let parity = 0;
function runs(cells, y, T) {
  const alongX = parity++ % 2 === 0; const used = new Set(); const fit = (L) => { while (!T[L]) L--; return L; };
  const run = (i, j, dx, dz) => { const c = cells.get(`${i},${j}`); let L = 1; while (L < 8 && cells.get(`${i + dx * L},${j + dz * L}`) === c && !used.has(`${i + dx * L},${j + dz * L}`)) L++; return fit(L); };
  const keys = [...cells.keys()].map((k) => k.split(',').map(Number)).sort((p, q) => (alongX ? p[1] - q[1] || p[0] - q[0] : p[0] - q[0] || p[1] - q[1]));
  for (const [i, j] of keys) { if (used.has(`${i},${j}`)) continue;
    let dx = alongX ? 1 : 0, dz = alongX ? 0 : 1; let L = run(i, j, dx, dz); if (L === 1) { const L2 = run(i, j, dz, dx); if (L2 > 1) { [dx, dz] = [dz, dx]; L = L2; } }
    for (let k = 0; k < L; k++) used.add(`${i + dx * k},${j + dz * k}`); a.up(T[L], cells.get(`${i},${j}`), i, y, j, dx ? 0 : 1); }
}
const rect = (i0, j0, w, d, c, m = new Map()) => { for (let i = i0; i < i0 + w; i++) for (let j = j0; j < j0 + d; j++) m.set(`${i},${j}`, c); return m; };
const ring = (i0, j0, w, d, c, m = new Map()) => { for (let i = i0; i < i0 + w; i++) for (let j = j0; j < j0 + d; j++) if (i === i0 || j === j0 || i === i0 + w - 1 || j === j0 + d - 1) m.set(`${i},${j}`, c); return m; };
const taken = new Set(); const take = (i0, j0, w, d) => { for (let i = i0; i < i0 + w; i++) for (let j = j0; j < j0 + d; j++) taken.add(`${i},${j}`); };

// ===================================================================== main drum 12 × 12, gx 8..19, gz 0..11, axis (14, 6)
const MX = 14, MZ = 6, M0 = MX - 6;
const corners = (id, y, color = WHITE) => { for (const [sx, sz] of Q4) quad(id, color, MX + 2 * sx, MZ + 2 * sz, y, sx, sz); };   // 4×4 corners: the arc's centre 2 in from the drum's corner
const SIDES = [[0, 1], [0, -1], [1, 0], [-1, 0]];                                            // south (the front) first
/** cell (i, j) on side e of the drum at offset t along the face and rel from the axis */
const cellAt = ([ex, ez], t, rel) => { const [x, z] = ez !== 0 ? [t, rel * ez] : [rel * ex, t]; return [MX + x - 0.5, MZ + z - 0.5]; };
/** the four 4-stud flats, solid on the outer row; `win`: small dark windows at t ±1.5, between the pilasters (back and side faces) */
const flats = (y, P, win = false) => {
  for (const e of SIDES) { const [i0, j0] = cellAt(e, -1.5, 5.5);
    if (!win || e[1] === 1) { a.up(P[4], WHITE, i0, y, j0, e[0] ? 1 : 0); continue; }
    for (const t of [-1.5, -0.5, 0.5, 1.5]) { const [i, j] = cellAt(e, t, 5.5); a.up(P[1], Math.abs(t) === 1.5 ? BLACK : WHITE, i, y, j); } }
};
for (const [i, j] of [[M0, 0], [M0 + 8, 0], [M0, 8], [M0 + 8, 8]]) a.up('3031', WHITE, i, 0, j); flats(0, PLT);   // base course: a square plinth (round corner plates left the terrace showing in the pockets)
for (let c = 0; c < 5; c++) { corners('2577', 1 + 3 * c); flats(1 + 3 * c, BRK, c === 3); }  // walls 1–16, windows 10–13
// pilasters (v4, lead review: v3's recessed panels and two-plate heads still read as battlements): round 1×1 columns standing a stud out
// from each flat at t ±0.5 and ±2.5, 1–16, on a 1×6 plinth plate, capped by a 1×6 cornice plate and tile (16–18). Standing out, they
// also round the drum's plan: with the 4×4 round corners the outline is close to a circle of radius 6.5. The front face's four are left
// out: the pavilion's back wall stands there. 12 visible.
const PIL = [-2.5, -0.5, 0.5, 2.5];
for (const e of SIDES.filter((e) => e[1] !== 1)) { const [i0, j0] = cellAt(e, -2.5, 6.5); const r = e[0] ? 1 : 0;
  a.up('3666', WHITE, i0, 0, j0, r);
  for (const t of [-1.5, 1.5]) { const [i, j] = cellAt(e, t, 6.5); a.up('3070b', WHITE, i, 1, j); }
  for (const t of PIL) { const [i, j] = cellAt(e, t, 6.5); for (let k = 0; k < 5; k++) a.up('3062b', WHITE, i, 1 + 3 * k, j); }
  a.up('3666', WHITE, i0, 16, j0, r);
  // r2b: stepped pilaster heads rise beside the dome's foot as on the real drum (real-04.jpg): a 1×1 brick and a tile over the middle pair
  // of columns on each face, tiles elsewhere (heads on the outer columns too stood at the drum's corners like battlements)
  for (const t of PIL) { const [i, j] = cellAt(e, t, 6.5); if (Math.abs(t) < 1) { a.up('3005', WHITE, i, 17, j); a.up('3070b', WHITE, i, 20, j); } else a.up('3070b', WHITE, i, 17, j); }
  for (const t of [-1.5, 1.5]) { const [i, j] = cellAt(e, t, 6.5); a.up('3070b', WHITE, i, 17, j); }
  take(Math.min(i0, i0 + (r ? 0 : 5)), Math.min(j0, j0 + (r ? 5 : 0)), r ? 1 : 6, r ? 6 : 1); }
// deck A 16–17: corners, two 2×12 through the middle along z, 2×4s over the side flats
corners('30565', 16); a.up('2445', WHITE, M0 + 4, 16, 0, 1); a.up('2445', WHITE, M0 + 6, 16, 0, 1);
for (const i of [M0, M0 + 2, M0 + 8, M0 + 10]) a.up('3020', WHITE, i, 16, 4, 1);
// deck B 17–18: corner round TILES (no studs in the pockets round the dome — lead: no battlement studs), two 2×12 along x across the
// middle, 2×4s over the front and back flats — crossing deck A; the outer row's flat cells are tiled
corners('27507', 17); a.up('2445', WHITE, M0, 17, 4, 0); a.up('2445', WHITE, M0, 17, 6, 0);
for (const j of [0, 2, 8, 10]) a.up('3020', WHITE, M0 + 4, 17, j, 0);
// (r1 tiled the outer row's flat cells at 18; the r2 dome ring covers them)
// the dome (r2b, lead review: the nested-dish cap read as a stepped wedding cake): one curve of two real moulds in Dark Bluish Gray
//   18–24  four 87559 (6×6×2 corner round, curved top): a 12-stud ring, vertical to ~21, rolling in to a flat top inside r 4.5; its tubes take
//          deck B's cross studs; a 2×2 column rises through its 4-stud hole to 26
//   24–27  an 8×8 inverted dish (3961) on the column (its centre tube sits 2 plates above its rim), rim on the ring's flat top at r 4: the
//          dish carries the ring's curve on to the crown; 27–28.5 a 2×2 dish (4740) flush on its flat top: the vent cap
// The pilasters' stepped heads rise round its foot (below), as on the real drum, so the near-vertical lower course reads as springing.
// No 10–12-stud hemisphere mould exists in Dark Bluish Gray (76776, 49612, 98107, 4413, 86500, 87375, 88067 checked on BrickLink): rise 10.5
// on 12 is the roundest real profile found. Tried: a 10×10 dish (50990b) nested over the ring (its rim skirt read as a saucer lid on a bun);
// r2a: a 24599 ring + 30565 band + 8×8 dish (a hat with a brim), 87559 + nested 8×8 / 6×6 / 2×2 dishes (a stepped cake).
for (const [sx, sz] of Q4) quad('87559', DOME_Q, MX, MZ, 18, sx, sz);
a.up('3003', DOME_Q, MX - 1, 18, MZ - 1); a.up('3003', DOME_Q, MX - 1, 21, MZ - 1); a.up('3022', DOME_Q, MX - 1, 24, MZ - 1); a.up('3022', DOME_Q, MX - 1, 25, MZ - 1);
round('3961', DOME_Q, MX, 24, MZ); round('4740', DOME_Q, MX, 27, MZ);
take(M0, 0, 12, 12);

// ===================================================================== side drums 5 × 4 and the slit domes, gx 0..4 / 23..27, gz 13..16
for (const X0 of [0, W - 5]) {
  const cxW = X0 + 2, cxE = X0 + 3, CZ = 15;                                              // the west pair's arc centre, the east pair's; the middle column between
  const ends = (id, y, color = WHITE) => { for (const [sx, sz] of Q4) quad(id, color, sx > 0 ? cxE : cxW, CZ, y, sx, sz); };
  for (const [i, j] of [[X0, 13], [X0 + 3, 13], [X0, 15], [X0 + 3, 15]]) a.up('3022', WHITE, i, 0, j); a.up('3710', WHITE, X0 + 2, 0, 13, 1);   // square plinth
  for (let c = 0; c < 4; c++) { const y = 1 + 3 * c; ends('3063b', y);
    if (c === 1 || c === 2) { a.up('3622', WHITE, X0 + 2, y, 13, 1); a.up('3005', BLACK, X0 + 2, y, 16); } else a.up('3010', WHITE, X0 + 2, y, 13, 1); }
  for (const y of [13, 14]) { ends('79491', y); a.up('3710', WHITE, X0 + 2, y, 13, 1); }      // plate courses: the drum stands a plate above the wing cornice
  // the top course carries a 1×2 jumper on the middle column whose stud is the dome's axis (x = middle of the 5, z = the 4's centre line)
  ends('79491', 15); a.up('3710', WHITE, X0 + 2, 15, 13, 1);
  // the telescope dome (r2b, lead review: v5's 4×4 dish was too flat; the real ones are near-hemispheres with a raised shutter band): four
  // Dark Bluish Gray 2×2 quarter domes (5906, a BrickLink DBG colour), the pairs one stud apart, a 1×4 plate between carrying two 5907
  // curved-top bricks back to back — a near-hemisphere 16–21 with a band a plate proud running N–S over the crown (v3's build, now in the
  // daylight colour; no 4×4 hemisphere is made in DBG: 86500, 30208, 24130/24132 checked)
  for (const [sx, sz] of Q4) quad('5906', SIDE_Q, sx > 0 ? cxE : cxW, CZ, 16, sx, sz);
  a.up('3710', BAND, X0 + 2, 16, 13, 1); a.up('5907', BAND, X0 + 2, 17, 15, 0); a.up('5907', BAND, X0 + 2, 17, 13, 2);
  take(X0, 13, 5, 4);
}

// ===================================================================== pavilion 6 × 6, gx 11..16, gz 12..17, portal on the axis
const PX = 11, PZ = 12, PW = 6, PD = 6, FRONT = PZ + PD - 1;
const ANCH = [[PX, 15, 3], [PX + PW - 1, 15, 1]];                                          // side-stud columns for the wing curtains (r: studs → −x / +x)
const isAnch = (i, j) => ANCH.some(([ai, aj]) => ai === i && aj === j);
const opening = (i) => i >= PX + 1 && i <= PX + 4;
const WING = [[5, -1], [PX + PW, 1]];                                                        // the wings' bodies: min x, and the side they hang on
{ const base = ring(PX, PZ, PW, PD, WHITE); for (let i = PX + 1; i <= PX + 4; i++) { base.delete(`${i},${FRONT}`); base.set(`${i},${FRONT - 1}`, WHITE); }
  for (const [i0] of WING) rect(i0, 12, 6, 3, WHITE, base);                                  // wing bodies join the pavilion's base course: it bonds the bar together
  runs(base, 0, PLT); }
// entrance steps (lead review): a white landing in the portal (top 3) and a step on the forecourt row (top 2) above the lawn path (top 1),
// equal rises of one plate, tiled
a.up('3710', WHITE, PX + 1, 0, FRONT); a.up('3710', WHITE, PX + 1, 1, FRONT); a.up('2431', WHITE, PX + 1, 2, FRONT);
a.up('3710', WHITE, PX + 1, 0, FRONT + 1); a.up('2431', WHITE, PX + 1, 1, FRONT + 1); take(PX + 1, FRONT + 1, 4, 1);
for (const [i, j, r] of ANCH) { a.up('32952', WHITE, i, 1, j, r); a.up('32952', WHITE, i, 6, j, r); }
for (const y of [1, 4, 7]) { const m = ring(PX, PZ, PW, PD, WHITE); for (const k of [...m.keys()]) { const [i, j] = k.split(',').map(Number); if (isAnch(i, j) || (j === FRONT && opening(i))) m.delete(k); } runs(m, y, BRK); }
for (const i of [PX + 1, PX + 4]) a.up('14716', WHITE, i, 1, FRONT - 1);                     // the stepped portal: jambs a stud back,
for (const i of [PX + 2, PX + 3]) a.up('14716', DBROWN, i, 1, FRONT - 1);                    // the bronze doors between them
{ const m = ring(PX, PZ, PW, PD, WHITE); for (const k of [...m.keys()]) { const [i, j] = k.split(',').map(Number); if (isAnch(i, j)) m.delete(k); } for (let i = PX + 1; i <= PX + 4; i++) m.set(`${i},${FRONT - 1}`, WHITE); runs(m, 10, PLT); }   // lintel course
runs(ring(PX, PZ, PW, PD, WHITE), 11, BRK);                                                 // attic
runs(rect(PX, PZ, PW, PD, WHITE), 14, PLT);                                                 // roof
const RX = PX + 3, RZ = 15;                                                                  // the rotunda's axis
{ const rot = (i, j) => Math.abs(i + 0.5 - RX) < 2 && Math.abs(j + 0.5 - RZ) < 2; const m = new Map();
  for (let i = PX; i < PX + PW; i++) for (let j = PZ; j < PZ + PD; j++) if (!rot(i, j)) m.set(`${i},${j}`, j === FRONT ? WHITE : TAN); runs(m, 15, TL); }
// rotunda (the Hall of the Eye). r2 (Eric: the Sand Green disc looked cheap): the real roof is a low octagon — a dark bronze frieze,
// verdigris palmettes on the eave, a low stepped verdigris roof and a small lantern (real-2011.jpg, daylight/facade-2026.jpg, july-2023.jpg);
// from the lawn it is wide and low, about a plate of frieze to a plate of roof. White 4×4 round drum 15–18 (hidden behind the attic), a
// Black round plate as the frieze 18–19, a Sand Green octagon of four cut-corner wedge plates 19–20, eight Sand Green cheese slopes on its
// edge studs facing out (the hipped eave of the octagon, 20–20.7), a 2×2 round step and a lantern (Black band, Sand Green cap) to 24.
// Tried for the crest: 1×1 horizontal-tooth plates (splayed like a succulent), 1×1 cones (a crown, three plates tall: too big), three-leaf
// plant plates (read as a planter); the cheese ring reads as the octagonal roof the photos show.
// (v2's 6×6 dish overhung a stud all round and read as a flying saucer; r1's 4×4 Sand Green dish was a flat disc on a white can)
round('87081', WHITE, RX, 15, RZ); round('60474', BLACK, RX, 18, RZ);
for (const [sx, sz] of Q4) quad('26601', SGREEN, RX, RZ, 19, sx, sz);
for (const [x, z, r] of [[-1.5, -0.5, 3], [-1.5, 0.5, 3], [1.5, -0.5, 1], [1.5, 0.5, 1], [-0.5, -1.5, 2], [0.5, -1.5, 2], [-0.5, 1.5, 0], [0.5, 1.5, 0]])
  a.put('54200', SGREEN, yaw(r), [RX + x, 20 * PLATE - bbox('54200')[1], RZ + z]);
round('4032a', SGREEN, RX, 20, RZ); round('18674', SGREEN, RX, 21, RZ); round('6141', BLACK, RX, 22, RZ); round('6141', SGREEN, RX, 23, RZ);
take(PX, PZ, PW, PD);

// ===================================================================== wings: body 6 × 3 (gz 12..14), curtain on gz 15
for (const [i0, s] of WING) {
  for (const y of [1, 4, 7]) runs(rect(i0, 12, 6, 3, WHITE), y, BRK);
  runs(rect(i0, 12, 6, 3, WHITE), 10, PLT);
  a.up('6636', WHITE, i0, 0, 15);                                                          // a smooth course under the curtain (bare studs would sit under the standing plates)
  // curtain: fifteen standing layers from the pavilion's face outward, W W P × 5; the last layer is tiles (no studs against the drum).
  // (v4 tried two-stud-deep piers to recess the windows: the piers' second column showed its side studs inside every window bay; the
  // windows stay flush — see BUILD.md)
  const face = s < 0 ? PX : PX + PW;
  for (let k = 0; k < 15; k++) {
    const x = face + s * 0.4 * k; const last = k === 14; const win = k % 3 !== 2;
    const st = (yPl) => ({ p: [x, yPl * PLATE, 15.5], d: [s, 0, 0] });
    const one = last ? '3070b' : '3024', two = last ? '3069b' : '3023';
    a.onStud(one, WHITE, st(2.25), [0, 0, 1], 'z');
    a.onStud(two, win ? DGREEN : WHITE, st(4.75), [0, 1, 0], 'x', [-0.5, bbox(two)[1], 0]);
    a.onStud(one, WHITE, st(9.75), [0, 0, 1], 'z');
  }
  // cornice (lead review: a frieze band and a projecting cornice): 11–13 two crossing plate courses over body, curtain and piers; 13–14
  // Tan terrace tiles and, on the front two rows, 1×2 jumpers whose centre studs carry 1×2 tiles half a stud out past the facade (14–15):
  // a cornice lip proud of the facade, the white band of plate edges under it reads as the frieze
  a.up('3795', WHITE, i0, 11, 12, 0); a.up('3795', WHITE, i0, 11, 14, 0);
  a.up('3666', WHITE, i0, 12, 12, 0); a.up('3795', WHITE, i0, 12, 13, 0); a.up('3666', WHITE, i0, 12, 15, 0);
  for (const j of [12, 13]) a.up('6636', TAN, i0, 13, j, 0);
  for (let i = i0; i < i0 + 6; i++) { a.up('3794b', WHITE, i, 13, 14, 1); a.put('3069b', WHITE, yaw(1), [i + 0.5, 14 * PLATE - bbox('3069b')[1], 15.5]); }
  take(i0, 12, 6, 4);   // the pier row gz 16 is paved below the piers
}

// ===================================================================== two Italian cypresses flanking the portal on the forecourt row, paving on every free cell
// v1 palms, v2 a banded barrel, v3 stacked leaf plates (a ragged pine, and the west one hid behind the obelisk — lead review). v4: the
// Italian cypress is a slim dark column with a pointed top, one each side of the portal, mirror images: a plate of trunk, two round bricks,
// two cones stacked (the second cone's tip is the point), 14 plates — about the wing's height
for (const i of [PX, PX + PW - 1]) {
  a.up('3024', LBG, i, 0, 18); a.up('6141', RB, i, 1, 18); a.up('3062b', DGREEN, i, 2, 18); a.up('3062b', DGREEN, i, 5, 18);
  a.up('4589', DGREEN, i, 8, 18); a.up('4589', DGREEN, i, 11, 18); take(i, 18, 1, 1);
}
// the rear promenade (lead review: the back corners were empty paving): a low white parapet, three plates, round the outer edge of the
// back terrace — the real one runs round the drum's rear; the paving inside it is the promenade
{ const par = new Map(); for (let j = ZB; j <= 12; j++) for (const i of [0, W - 1]) par.set(`${i},${j}`, WHITE);
  for (let i = 0; i < W; i++) if (i <= 7 || i >= W - 8) par.set(`${i},${ZB}`, WHITE);
  runs(par, 0, PLT); runs(par, 1, PLT); runs(par, 2, TL); for (const k of par.keys()) taken.add(k); }
{ // greedy paving: 2×4, 2×2, then 1-wide tiles
  const free = (i, j) => i >= 0 && i < W && j >= ZB && j < D && !taken.has(`${i},${j}`);
  const fits = (i, j, w, d) => { for (let x = i; x < i + w; x++) for (let z = j; z < j + d; z++) if (!free(x, z)) return false; return true; };
  for (let j = ZB; j < D; j++) for (let i = 0; i < W; i++) { if (!free(i, j)) continue;
    for (const [id, w, d, r] of [['87079', 4, 2, 0], ['87079', 2, 4, 1], ['3068b', 2, 2, 0], ['2431', 4, 1, 0], ['2431', 1, 4, 1], ['3069b', 2, 1, 0], ['3069b', 1, 2, 1], ['3070b', 1, 1, 0]])
      if (fits(i, j, w, d)) { a.up(id, LBG, i, 0, j, r); take(i, j, w, d); break; } }
}
const out = a.write(); console.log('griffith:', a.parts.length, 'parts', JSON.stringify(out.bom));

// ===================================================================== Astronomers Monument on its paved island (4 × 4)
{ const m = new Asm('griffith_monument', [2, 0, 2]); const at = (id, color, y, dx = 0, dz = 0) => m.put(id, color, yaw(0), [2 + dx, y * PLATE - bbox(id)[1], 2 + dz]);
  // v1/v2 read as a lighthouse, v3 (1×1×5 shaft) as a chimney, v4 (2×2 obelisk, 20 plates) as a white building in front of the door
  // (lead review). v5, as the real one: a slim white column below the wing parapet on a round paved island, four small white figures round
  // its foot facing out (a four-fold pinwheel: six do not divide a 4×4 ring), clipped hedge between, a gold armillary on top (12 plates)
  at('3031', LBG, 0); at('60474', LBG, 1); at('18674', WHITE, 2); for (const k of [0, 1, 2]) at('3062b', WHITE, 3 + 3 * k); at('6141', GOLD, 12);   // the round island stands a plate proud on a square of paving (the terrace showed in its corners)
  for (const [dx, dz, r] of [[-0.5, -1.5, 2], [1.5, -0.5, 1], [0.5, 1.5, 0], [-1.5, 0.5, 3]]) m.put('90398', WHITE, yaw(r), [2 + dx, 2 * PLATE - bbox('90398')[1], 2 + dz]);
  for (const [dx, dz] of [[0.5, -1.5], [1.5, 0.5], [-0.5, 1.5], [-1.5, -0.5]]) at('6141', DGREEN, 2, dx, dz);
  const o = m.write(); console.log('griffith_monument:', m.parts.length, 'parts', JSON.stringify(o.bom)); }
