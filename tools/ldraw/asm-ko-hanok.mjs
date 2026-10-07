// Seoul · Bukchon hanok (2026-10-06) — every hanok element one assembly of real parts, authored in our frame (asm-ours.mjs), exploded with
// bp.assembly() in src/scenes/ko-hanok.ts. Scheme: docs/refs/seoul-hanok/SCHEME.md; build notes: docs/refs/seoul-hanok/BUILD.md.
//   LDRAW_DIR=… node tools/ldraw/asm-ko-hanok.mjs [names…] && node tools/ldraw/bake.mjs ko_hiptest.ldr … --force --hull
// Frames: x east, z south (toward the default camera), y up in plates; cell (i, j) = footprint min corner; origins at the proxy's footprint
// bottom centre.
//
// The roof (SCHEME §2.6). Each plane is built flat — the hinge top (3938) on its base (3937) in the wall's hinge course, a two-layer plate
// deck on the hinge top's studs (rows along the eave underneath, plates across the rows on top: the two layers cross, so every row is
// clutched), the cover-tile lines on the deck — and then the whole group is turned about the hinge axle (10 LDU under the base's top face,
// on the wall row's centre line) to the pitch. Nothing rests: every plane hangs on its hinges.
//   line   a cover-tile line on every other column: Bracket 1×1–1×1 Up (36840) on the eave cell, its flange outward carrying a White round
//          tile (98138: the white mortar end of the tile line), then Brick 1×1×⅔ curved top (49307) on every cell up the slope
//   trough the bare studs of the deck between two lines
//   fascia Bracket 1×2–1×2 Down (99781) in Reddish Brown under the eave row, its studs in the deck's underside, its flange hanging at the
//          eave edge: a White round tile on one side stud (a rafter end), a Reddish Brown 1×1 tile on the other — staggered against the lines
//   sweep  the last two lines at each free end stand on one and two plates: the eave rises into every corner
import { Asm, RY, mul, app, add, sub, bbox, PLATE } from './asm-ours.mjs';
const DBG = 72, LBG = 71, WHITE = 15, MN = 84, TAN = 19, RB = 70, SANDRED = 335, BLK = 0;
const only = process.argv.slice(2); const want = (n) => !only.length || only.includes(n);
const PLT = { 1: '3024', 2: '3023', 3: '3623', 4: '3710', 6: '3666', 8: '3460' };
const TILE = { 1: '3070b', 2: '3069b', 3: '63864', 4: '2431', 6: '6636', 8: '4162' };
const BRK = { 1: '3005', 2: '3004', 3: '3622', 4: '3010', 6: '3009', 8: '3008' };
const fit = (L, T) => { while (!T[L]) L--; return L; };
/** split a run of length n into lengths from table T, longest first, never leaving a 1 when avoidable */
const runs = (n, T, max = 8) => { const out = []; let k = n; while (k > 0) { let L = fit(Math.min(max, k), T); if (k - L === 1 && L > 2 && T[L - 1]) L = fit(L - 1, T); out.push(L); k -= L; } return out; };
const Rz = (deg) => { const t = (deg * Math.PI) / 180, c = Math.cos(t), s = Math.sin(t); return [c, -s, 0, s, c, 0, 0, 0, 1]; };   // +x toward +y
const Rx = (deg) => { const t = (deg * Math.PI) / 180, c = Math.cos(t), s = Math.sin(t); return [1, 0, 0, 0, c, -s, 0, s, c]; };   // +y toward +z
const turn = (recs, Rt, pivot) => { for (const r of recs) { r.R = mul(Rt, r.R); r.t = add(app(Rt, sub(r.t, pivot)), pivot); } };
/** a part whose LDraw origin sits on the centre of cell (i, j) (1×1 or 1×2 brackets, 1×1 round parts), origin at plate height y */
const atCell = (a, id, color, i, j, y, r, w = 1) => { const R = RY(r); const c = r % 2 ? [i + 0.5, y * PLATE, j + w / 2] : [i + w / 2, y * PLATE, j + 0.5]; return a.put(id, color, R, c); };
/** outward unit for a plane side; quarter turn that points a part's local +z (a bracket's flange) that way */
const OUT = { W: [-1, 0], E: [1, 0], N: [0, -1], S: [0, 1] };
const FLANGE = { S: 0, E: 1, N: 2, W: 3 };

/**
 * One hinged roof plane. side: which way it falls (W E N S); wall: the wall row's cell index across the axis (x for W/E, z for N/S);
 * yH: the hinge course's bottom plate; rows: the deck rows r from rIn (< 0, toward the ridge) to rOut (the eave row), r = 0 over the hinge;
 * ext(r) → [u0, u1) the cells of row r along the axis; hinges: u of each 3937 (two cells); lineAt(u): a cover line on that column;
 * lift(u): sweep plates under that column's line; theta: the pitch (degrees). Returns the members and handy geometry.
 */
function plane(a, o) {
  const { side, wall, yH, rIn, rOut, ext, hinges, lineAt, lift = () => 0, theta, capLo = false, capHi = false, hipLo = capLo, hipHi = capHi, under = 0, capLift = () => 0, deck = MN, capRows = () => true, verge = () => false, fine = true, endsOut = false, dots = (u) => ((u % 2) + 2) % 2 === 1 } = o;
  const along = side === 'W' || side === 'E' ? 'z' : 'x';
  const sgn = side === 'W' || side === 'N' ? -1 : 1;
  const cell = (r, u) => (along === 'z' ? [wall + sgn * r, u] : [u, wall + sgn * r]);   // world (i, j) of deck cell (r, u)
  const recs = []; const keep = (rec) => { recs.push(rec); return rec; };
  const yP = yH + 3;                                                  // the deck's bottom plate (on the hinge tops)
  // hinges: base in the wall's hinge course, top on the same origin
  for (const u of hinges) {
    const [i, j] = cell(0, u); const base = a.up('3937', MN, i, yH, j, along === 'z' ? 1 : 0);
    keep(a.put('3938', MN, base.R, base.t));
  }
  // lower layer: a run along the axis per row (Medium Nougat: the soffit seen from below)
  // `under`: the lower layer reaches one cell further at a hip end (−1: below u0, +1: past u1) under the other plane's hip cap, closing the
  // slit the two tilts open between the cap and this plane's row ends (its top stays under the cap: checked by check-assemblies)
  for (let r = rIn; r <= rOut; r++) { let [u0, u1] = ext(r); if (under < 0 || under === 2) u0--; if (under === 1 || under === 2) u1++; let u = u0; for (const L of runs(u1 - u0, PLT)) { const [i, j] = cell(r, u); keep(a.up(PLT[L], deck, i, yP, j, along === 'z' ? 1 : 0)); u += L; } }
  // upper layer: across the rows, one column at a time (Dark Bluish Gray)
  const cols = new Map(); for (let r = rIn; r <= rOut; r++) { const [u0, u1] = ext(r); for (let u = u0; u < u1; u++) { if (!cols.has(u)) cols.set(u, []); cols.get(u).push(r); } }
  for (const [u, rs] of cols) {
    rs.sort((p, q) => p - q); let k = 0;
    while (k < rs.length) { let n = 1; while (k + n < rs.length && rs[k + n] === rs[k] + n) n++;
      let r0 = rs[k]; for (const L of runs(n, PLT, 4)) { const rA = r0, rB = r0 + L - 1; const [i0, j0] = cell(rA, u), [i1, j1] = cell(rB, u); keep(a.up(PLT[L], DBG, Math.min(i0, i1), yP + 1, Math.min(j0, j1), along === 'z' ? 0 : 1)); r0 += L; }
      k += n; }
  }
  // hip caps: on each row's last stud at a hip end, a 1×2 plate reaching one cell past the row over the V between the two planes (it lies in
  // this plane, so beyond the hip it rides above the other plane's deck), a curved-top brick on each of its studs: the raised hip ridge.
  // The eave row's cap carries the corner's bracket and white end instead of the outer brick.
  const capped = new Set();
  for (let r = rIn; r <= rOut; r++) { const [u0, u1] = ext(r);
    for (const [on, uL, uD] of [[capHi, u1 - 1, u1], [capLo, u0, u0 - 1]]) { if (!on) continue;
      if (verge(r)) { const [i, j] = cell(r, uL); keep(a.up(PLT[1], fine ? WHITE : DBG, i, yP + 2, j)); keep(fine ? a.up('3070b', DBG, i, yP + 3, j) : a.up('49307', DBG, i, yP + 3, j, along === 'z' ? 0 : 1)); capped.add(`${r},${uL}`); continue; }   // a row above the hip: a raised end on its last stud, the verge line up to the ridge
      if (!capRows(r)) continue;
      const [iL, jL] = cell(r, uL), [iD, jD] = cell(r, uD); const cl = capLift(r);
      for (let p = 0; p <= cl; p++) keep(a.up(PLT[2], p === cl ? WHITE : DBG, Math.min(iL, iD), yP + 2 + p, Math.min(jL, jD), along === 'z' ? 1 : 0)); capped.add(`${r},${uL}`);   // risers + cap: the hip rises into the corner; the cap is White, the hip's mortar line
      const yc = yP + 3 + cl;
      keep(a.up('3070b', DBG, iL, yc, jL));                                            // the row's last stud tiled: the hip is ONE line of curved-top bricks on the diagonal
      if (fine) keep(a.up(r === rOut ? '98138' : '3070b', r === rOut ? WHITE : DBG, iD, yc, jD));   // r5 (Eric: thin hips): a flat tile on the diagonal, the eave's white end at the corner
      else if (r === rOut) { const br = keep(atCell(a, '36840', DBG, iD, jD, yc + 1, FLANGE[side])); keep(a.onStud('98138', WHITE, a.side(br)[0], along === 'z' ? [0, 0, 1] : [1, 0, 0], 'x')); }
      else keep(a.up('49307', DBG, iD, yc, jD, along === 'z' ? 0 : 1)); } }
  // r5 (Eric, 2026-10-07: the roofs read as a child's oversized hat): every column a run of 1×2 grille tiles down the slope — fine, low,
  // even tile lines (Gwanghwamun r8's field) — and the eave cell a White round tile 1×1: one small, even row of white tile ends. Sweep
  // risers (plates) under a column where it lifts toward a corner.
  if (fine) for (const [u, rs] of cols) {
    const free = rs.filter((r) => !capped.has(`${r},${u}`)).sort((p, q) => q - p); if (!free.length) continue; const lp = lift(u);
    const lo = free[free.length - 1], hi = free[0];
    for (let p = 0; p < lp; p++) { let r0 = lo; for (const L of runs(hi - lo + 1, PLT, 4)) { const [i0, j0] = cell(r0, u), [i1, j1] = cell(r0 + L - 1, u); keep(a.up(PLT[L], DBG, Math.min(i0, i1), yP + 2 + p, Math.min(j0, j1), along === 'z' ? 0 : 1)); r0 += L; } }
    const y0 = yP + 2 + lp; let k = 0;
    if (free[0] === rOut) { const [i, j] = cell(rOut, u); const w = dots(u);   // a white end on every second column: small, spaced dots
      if (w && endsOut) { const f = keep(atCell(a, '36841', DBG, i, j, yP, FLANGE[side])); keep(a.onStud('98138', WHITE, a.side(f)[0], along === 'z' ? [0, 0, 1] : [1, 0, 0], 'x')); keep(a.up('3070b', DBG, i, y0, j)); }   // r6: turned to face out, on a bracket under the eave cell
      else keep(a.up(w ? '98138' : '3070b', w ? WHITE : DBG, i, y0, j)); k = 1; }
    while (k < free.length) { const r = free[k];
      if (k + 1 < free.length && free[k + 1] === r - 1) { const [i0, j0] = cell(r, u), [i1, j1] = cell(r - 1, u); keep(a.up('2412b', DBG, Math.min(i0, i1), y0, Math.min(j0, j1), along === 'z' ? 0 : 1)); k += 2; }
      else { const [i, j] = cell(r, u); keep(a.up('3070b', DBG, i, y0, j)); k += 1; } }
  }
  // lines (pre-r5)
  if (!fine) for (const [u, rs] of cols) {
    if (!lineAt(u)) continue; const lp = lift(u); const top = Math.max(...rs), low = Math.min(...rs);
    if (lp) { const free = rs.filter((r) => !capped.has(`${r},${u}`)); const lo = Math.min(...free), hi = Math.max(...free);   // risers under the line's own cells (a capped cell carries the hip)
      for (let p = 0; p < lp; p++) { let r0 = lo; for (const L of runs(hi - lo + 1, PLT, 4)) { const [i0, j0] = cell(r0, u), [i1, j1] = cell(r0 + L - 1, u); keep(a.up(PLT[L], DBG, Math.min(i0, i1), yP + 2 + p, Math.min(j0, j1), along === 'z' ? 0 : 1)); r0 += L; } } }
    const y0 = yP + 2 + lp;
    for (const r of rs) {
      const [i, j] = cell(r, u); if (capped.has(`${r},${u}`)) continue;
      if (r === rOut && top === rOut) { const br = keep(atCell(a, '36840', DBG, i, j, y0 + 1, FLANGE[side])); const s = a.side(br)[0]; keep(a.onStud('98138', WHITE, s, along === 'z' ? [0, 0, 1] : [1, 0, 0], 'x')); }
      else keep(a.up('49307', DBG, i, y0, j, along === 'z' ? 0 : 1));
    }
  }
  // troughs: the bare studs between two lines tiled smooth (the concave pan tiles), Dark Bluish Gray tiles along the slope (pre-r5)
  if (!fine) for (const [u, rs] of cols) {
    if (lineAt(u)) continue; const free = rs.filter((r) => !capped.has(`${r},${u}`)).sort((p, q) => p - q); let k = 0;
    while (k < free.length) { let n = 1; while (k + n < free.length && free[k + n] === free[k] + n) n++;
      let r0 = free[k]; for (const L of runs(n, TILE, 4)) { const [i0, j0] = cell(r0, u), [i1, j1] = cell(r0 + L - 1, u); keep(a.up(TILE[L], DBG, Math.min(i0, i1), yP + 2, Math.min(j0, j1), along === 'z' ? 0 : 1)); r0 += L; }
      k += n; }
  }
  // fascia under the eave row, in pairs of columns; a White rafter end on the side stud of the column without a line
  const [e0, e1] = ext(rOut).map((v, k) => v + (k ? (hipHi ? -1 : 0) : (hipLo ? 1 : 0)));
  for (let u = e0; !fine && u + 1 < e1; u += 2) {
    const [i, j] = cell(rOut, u); const ii = along === 'z' ? i : i, jj = j;
    const R = RY(FLANGE[side]); const c = along === 'z' ? [ii + 0.5, yP * PLATE, jj + 1] : [ii + 1, yP * PLATE, jj + 0.5];
    const f = keep(a.put('99781', RB, R, c));
    for (const s of a.side(f)) { const uu = along === 'z' ? Math.floor(s.p[2]) : Math.floor(s.p[0]); keep(a.onStud('98138', WHITE, s, along === 'z' ? [0, 0, 1] : [1, 0, 0], 'x')); }   // one rafter end per stud, evenly
  }
  if (!fine && (e1 - e0) % 2) { const u = e1 - 1; const [i, j] = cell(rOut, u); const f = keep(atCell(a, '36841', RB, i, j, yP, FLANGE[side]));   // an odd cell: Bracket 1×1–1×1 Down
    for (const s of a.side(f)) keep(a.onStud('98138', WHITE, s, along === 'z' ? [0, 0, 1] : [1, 0, 0], 'x')); }
  // turn the plane about the hinge axle
  const pivotY = yH * PLATE + 1.2 - 0.5;
  const Rt = side === 'W' ? Rz(theta) : side === 'E' ? Rz(-theta) : side === 'S' ? Rx(theta) : Rx(-theta);
  const pivot = along === 'z' ? [wall + 0.5, pivotY, 0] : [0, pivotY, wall + 0.5];
  turn(recs, Rt, pivot);
  return { recs, pivotY };
}

// ---- ko_hiptest: one hip corner (SCHEME §2.10 risk 1): the south-west corner of the anchae, walls 6 × 6 (x 0..5, z 0..5), the west long
// plane over x 0 and the south hip plane over z 5, rising into the corner. Origin at the walls' footprint bottom centre.
if (want('ko_hiptest')) {
  const a = new Asm('ko_hiptest', [3, 0, 3]); const yH = 12; const TH = 35;
  // walls: White bricks 0..12 round the two outer sides, Medium Nougat beam (plates) on top; hinge course: 3937s and 2-plate fillers
  for (let y = 0; y < 12; y += 3) { for (let z = 0; z < 6; z += 2) a.up('3004', WHITE, 0, y, z, 1); for (let x = 1; x < 6; x += 2) a.up(x + 2 <= 6 ? '3004' : '3005', WHITE, x, y, 5, 0); }
  const hW = [0, 2], hS = [2, 4];
  for (const [i, j] of [[0, 4], [0, 5], [1, 5]]) { a.up('3024', MN, i, yH, j); a.up('3024', MN, i, yH + 1, j); }
  const W = plane(a, { side: 'W', wall: 0, yH, rIn: -1, rOut: 2, theta: TH, hinges: hW, lineAt: (u) => u % 2 === 0, capHi: true, capLift: (r) => (r === 2 ? 2 : r === 1 ? 1 : 0), lift: (u) => (u === 4 ? 1 : 0),
    ext: (r) => [-3, { 2: 7, 1: 6, 0: 5, '-1': 4 }[r]] });
  const S = plane(a, { side: 'S', wall: 5, yH, rIn: 0, rOut: 2, theta: TH, hinges: hS, lineAt: (u) => u % 2 === 1, hipLo: true, under: -1, deck: DBG, lift: (u) => (u === -1 ? 2 : u === 1 ? 1 : 0),
    ext: (r) => [{ 2: -1, 1: 0, 0: 1 }[r], 8] });
  console.log('ko_hiptest pivot', W.pivotY.toFixed(2), a.write());
}

// ---- shared ---------------------------------------------------------------------------------------------------------------------------
const MASON = { 1: '3005', 2: '98283', 4: '15533' };   // granite: Brick 1×2 / 1×4 with Masonry Profile
/** pack one course of cells (Map "i,j" → colour) at plate y into runs from table T (bricks, plates, tiles), alternating the run direction
 *  course by course so each course bonds across the one below (asm-build.mjs's rule) */
let nCourse = 0;
function course(a, cells, y, T) {
  const alongX = nCourse++ % 2 === 0; const used = new Set();
  const run = (i, j, dx, dz) => { const col = cells.get(`${i},${j}`); let L = 1; while (L < 8 && cells.get(`${i + dx * L},${j + dz * L}`) === col && !used.has(`${i + dx * L},${j + dz * L}`)) L++; return fit(L, T); };
  const keys = [...cells.keys()].map((k) => k.split(',').map(Number)).sort((p, q) => (alongX ? p[1] - q[1] || p[0] - q[0] : p[0] - q[0] || p[1] - q[1]));
  for (const [i, j] of keys) { if (used.has(`${i},${j}`)) continue;
    let dx = alongX ? 1 : 0, dz = alongX ? 0 : 1; let L = run(i, j, dx, dz); if (L === 1) { const L2 = run(i, j, dz, dx); if (L2 > 1) { [dx, dz] = [dz, dx]; L = L2; } }
    for (let k = 0; k < L; k++) used.add(`${i + dx * k},${j + dz * k}`);
    a.up(T[L], cells.get(`${i},${j}`), i, y, j, dx ? 0 : 1); }
}
const rect = (i0, j0, w, d, c) => { const m = new Map(); for (let i = i0; i < i0 + w; i++) for (let j = j0; j < j0 + d; j++) m.set(`${i},${j}`, c); return m; };
const ring = (i0, j0, w, d, c, skip = () => false) => { const m = new Map(); for (let i = i0; i < i0 + w; i++) for (let j = j0; j < j0 + d; j++) if ((i === i0 || j === j0 || i === i0 + w - 1 || j === j0 + d - 1) && !skip(i, j)) m.set(`${i},${j}`, c); return m; };
/** a run of `n` cells from (i, j) along x (dir 'x') or z, split into the longest parts of table T, rotated to lie along the run */
const lay = (a, T, color, i, j, y, n, dir) => { let k = 0; for (const L of runs(n, T)) { a.up(T[L], color, dir === 'x' ? i + k : i, y, dir === 'x' ? j : j + k, dir === 'x' ? 0 : 1); k += L; } };
/** a column of Round 1×1 bricks (the honey timber posts) from plate y0 to y1 */
const post = (a, i, j, y0, y1) => { for (let y = y0; y < y1; y += 3) a.up('3062b', MN, i, y, j); };
/** the hinge course: 2 plates on every ring cell no hinge base stands on (the planes clear it by 0.02 stud at the wall's outer face) */
function hingeFill(a, cells, yH) { course(a, cells, yH, PLT); course(a, cells, yH + 1, PLT); }
/**
 * The ridge: `x0, z0, w, d` its footprint (w across, d along when dir 'z'; swapped when 'x'), bottom at plate y. Two Dark Bluish Gray layers
 * that cross, a White plate course (the white mortar line along the real ridge), the crest — curved-top bricks in a line along the middle
 * (one or two lines), Dark Bluish Gray cheese slopes falling outward on the outer rows — and at each end a kick: a plate under the last two crest cells and a curved
 * slope 2×1 on it, its high end outward, so the ridge ends turn up a plate.
 */
function ridge(a, dir, x0, z0, w, len, y, crest) {
  const ax = dir === 'z';   // ridge runs along z: w across x, len along z
  const at = (c, l) => (ax ? [x0 + c, z0 + l] : [x0 + l, z0 + c]);   // c across, l along
  // r6 (lead: ridge ≈ 1/6 of the roof, 1–2 wide, a thin white line under a dark cap): layer A only on the crest row (on the gable posts,
  // hidden between the planes' inner edges), layer B across the full width flush with the planes' top course, flat tiles on its outer
  // cells, and on the crest row one White plate line under a Dark Bluish Gray tile cap, a White round tile closing each end.
  for (const c of crest) { const [i, j] = at(c, 0); lay(a, PLT, DBG, i, j, y, len, ax ? 'z' : 'x'); }                             // layer A: along
  for (let l = 0; l < len; l++) { const [i, j] = at(0, l); lay(a, PLT, DBG, i, j, y + 1, w, ax ? 'x' : 'z'); }                     // layer B: across
  for (let c = 0; c < w; c++) { const [i, j] = at(c, 0);
    if (!crest.includes(c)) { lay(a, TILE, DBG, i, j, y + 2, len, ax ? 'z' : 'x'); continue; }
    lay(a, PLT, WHITE, i, j, y + 2, len, ax ? 'z' : 'x');
    for (const l of [0, len - 1]) { const [p, q] = at(c, l); a.up('98138', WHITE, p, y + 3, q); }
    { const [p, q] = at(c, 1); lay(a, TILE, DBG, p, q, y + 3, len - 2, ax ? 'z' : 'x'); } }
}

/** The 2-wide ridge (r4, lead): x0..x0+1 across, z0..z0+len−1 along; two crossing Dark Bluish Gray layers of 2-wide plates whose joints
 *  stagger (the posts' studs at x0 + 1 land on the first layer's tube line), a White line, two crest lines of curved-top bricks, kicked ends. */
function ridge2(a, x0, z0, len, y) {
  const P2 = { 1: '3023', 2: '3022', 3: '3021', 4: '3020', 6: '3795', 8: '3034' };
  const along2 = (runsL, yy) => { let z = z0; for (const L of runsL) { if (L === 1) a.up('3023', DBG, x0, yy, z, 0); else a.up(P2[L], DBG, x0, yy, z, 1); z += L; } };
  along2([6, 3], y); along2([2, 6, 1], y + 1);
  for (const c of [0, 1]) lay(a, PLT, WHITE, x0 + c, z0, y + 2, len, 'z');
  for (const c of [0, 1]) {
    lay(a, TILE, DBG, x0 + c, z0 + 2, y + 3, len - 4, 'z');                                                                          // r5: a flat tile crest (thin ridge)
    for (const [l, hi] of [[0, -1], [len - 2, 1]]) a.up('11477', DBG, x0 + c, y + 3, z0 + l, hi < 0 ? 2 : 0);
  }
}

// ---- ko_anchae: the main wing (SCHEME §2.4–2.7), body 6 × 11 (x 0..5, z 0..10), its back (east, x 5) the alley facade, its front (west)
// lattice doors on the courtyard; the gidan one stud wider on the west (x −1: the toenmaru). Plates above the courtyard level C (= 0):
//   0–3 granite gidan (masonry ring) · 3–4 cap · 4 toenmaru tiles · 4–16 walls (east: meander band 4–7, plaster 7–10, high lattice window
//   10–16; west: lattice doors 4–16; ends: plaster 4–10, lattice window 10–16) · 16–17 beam and ceiling · 17–19 hinge course ·
//   long planes (west, east) and hip planes (north, south) at 35°, hip ridges · gables 17–24 · ridge 24–27, crest to 29, kicks to 30
// Proxy: the gidan, x −1..5 × z 0..10 (7 × 11); origin at its bottom centre.
if (want('ko_anchae')) {
  const a = new Asm('ko_anchae', [2.5, 0, 5.5]); const yH = 20, TH = 30;   // r5: 35° → 30°, eave 2 → 1 row
  // gidan
  course(a, ring(-1, 0, 7, 11, LBG, (i, j) => j === 10 && (i === 1 || i === 2)), 0, MASON);
  a.up('2877', BLK, 1, 0, 10, 0);                                                     // the ondol firebox under the south end
  course(a, rect(-1, 0, 7, 11, LBG), 3, PLT);
  lay(a, TILE, MN, -1, 0, 4, 11, 'z');                                                // toenmaru
  // walls
  for (const z of [0, 5, 10]) { post(a, 0, z, 4, 19); post(a, 5, z, 7, 19); }
  for (const z0 of [1, 6]) {
    for (const y of [4, 10]) a.up('32932', TAN, 0, y, z0, 1);                         // west: lattice doors, two stacked, plaster over them
    a.up('3010', WHITE, 0, 16, z0, 1);
    for (let y = 4; y < 16; y += 3) a.up('3010', WHITE, 1, y, z0, 1);                 // white paper behind
    for (const y of [7, 10]) a.up('3010', WHITE, 5, y, z0, 1);                        // east: plaster
    a.up('32932', TAN, 5, 13, z0, 1);                                                 // east: high window
    for (const y of [13, 16]) a.up('3010', WHITE, 4, y, z0, 1);
  }
  for (const z of [0, 2, 4, 6, 8]) a.up('3004', SANDRED, 5, 4, z, 1);                 // east: the meander band (printed in the scene)
  a.up('3005', SANDRED, 5, 4, 10, 0);
  for (const z of [0, 10]) { for (const y of [4, 7, 10]) a.up('3010', WHITE, 1, y, z, 0); a.up('32932', TAN, 1, 13, z, 0); }   // ends: plaster, window
  for (const z of [1, 9]) for (const y of [13, 16]) a.up('3004', WHITE, 2, y, z, 0);
  course(a, rect(0, 0, 6, 11, MN), 19, PLT);                                          // beam and ceiling
  // gables (white, on the ceiling) and the ridge's middle support
  // r4 (lead): the hapgak — a white gable panel at each short end under the long planes' verges (their Medium Nougat soffits frame its
  // sloping sides), a Medium Nougat sill line at its foot, and behind it a 2 × 2 column that turns, through a 2 × 2 jumper, into a centred
  // round 1 × 1 post carrying the 2-wide ridge on its tube line (the long planes now have two rows in and close to 1.5 studs of the middle)
  for (const [zf, zc] of [[1, 2], [9, 7]]) {
    a.up('3710', MN, 1, 20, zf, 0); a.up('3010', WHITE, 1, 21, zf, 0);                                         // sill line, panel
    a.up('3794b', WHITE, 2, 24, zf, 0); for (const y of [25, 26]) a.up('3024', WHITE, 2.5, y, zf); a.up('3070b', WHITE, 2.5, 27, zf);   // a white king post on a jumper, under the ridge (r5: one plate lower, the 30° planes)
    for (const y of [20]) a.up('3003', DBG, 2, y, zc); a.up('3022', DBG, 2, 23, zc); a.up('87580', DBG, 2, 24, zc);   // the ridge's post behind the panel
    a.up('3062b', DBG, 2.5, 25, zc + 0.5);
  }
  // hinge course: bases at z 2–3 / 7–8 (west, east) and x 1–2 / 3–4 (north, south); 2 plates on the rest of the ring
  const hingeAt = (i, j) => ((i === 0 || i === 5) && [2, 3, 7, 8].includes(j)) || ((j === 0 || j === 10) && i >= 1 && i <= 4);
  hingeFill(a, ring(0, 0, 6, 11, MN, hingeAt), yH);
  const longExt = (r) => ({ 1: [0, 11], 0: [1, 10], '-1': [1, 10], '-2': [1, 10] })[r];
  const longOpts = { yH, rIn: -2, rOut: 1, theta: TH, hinges: [2, 7], ext: longExt, lineAt: (u) => u % 2 === 0, capLo: true, capHi: true, capRows: (r) => r >= 0, verge: (r) => r < 0,
    capLift: () => 0, lift: (u) => (u === 0 || u === 10 ? 1 : 0) };   // r5: a subtle corner lift
  plane(a, { ...longOpts, side: 'W', wall: 0 }); plane(a, { ...longOpts, side: 'E', wall: 5 });
  const hipOpts = { yH, rIn: 0, rOut: 1, theta: TH, hinges: [1, 3], ext: (r) => ({ 1: [0, 6], 0: [1, 5] })[r], lineAt: (u) => [-1, 1, 4, 6].includes(u), dots: (u) => u === 1 || u === 4, hipLo: true, hipHi: true, under: 2, deck: DBG,
    lift: (u) => (u === 0 || u === 5 ? 1 : 0) };
  plane(a, { ...hipOpts, side: 'N', wall: 0 }); plane(a, { ...hipOpts, side: 'S', wall: 10 });
  ridge2(a, 2, 1, 9, 28);
  const out = a.write(); console.log('ko_anchae:', a.parts.length, 'parts', JSON.stringify(out.bom));
}

/**
 * A plain gable roof (matbae) over a body `len` long and 5 deep, ridge along `dir` ('x': the body is x 0..len−1 × z 0..4; 'z': x 0..4 ×
 * z 0..len−1). Hinge course at yH on the two long walls (bases at `hinges`, 2 plates elsewhere on the ring), two planes at `theta` with one
 * row in and two out, verges a stud past each end wall with a line on the end column (it rises with the sweep), a 1-wide White gable post
 * on each end wall's middle cell up to the ridge, the ridge 3 wide over the middle with one crest line.
 */
function gableRoof(a, { len, dir, yH, theta, hinges, lineAt, lift, yR, hiVerge = 1 }) {
  const ax = dir === 'x'; const L = len;
  const ringCells = ax ? ring(0, 0, L, 5, MN, (i, j) => (j === 0 || j === 4) && hinges.some((u) => i === u || i === u + 1)) : ring(0, 0, 5, L, MN, (i, j) => (i === 0 || i === 4) && hinges.some((u) => j === u || j === u + 1));
  hingeFill(a, ringCells, yH);
  const opts = { yH, rIn: -1, rOut: 1, theta, hinges, ext: () => [-1, L + hiVerge], lineAt, lift, hipLo: true, hipHi: hiVerge > 0 };   // the fascia stops a stud short of each verge
  if (ax) { plane(a, { ...opts, side: 'N', wall: 0 }); plane(a, { ...opts, side: 'S', wall: 4 }); }
  else { plane(a, { ...opts, side: 'W', wall: 0 }); plane(a, { ...opts, side: 'E', wall: 4 }); }
  for (const e of [0, L - 1]) { const [i, j] = ax ? [e, 2] : [2, e]; for (let y = yH + 2; y < yR; ) { if (yR - y >= 3) { a.up('3005', WHITE, i, y, j); y += 3; } else { a.up('3024', WHITE, i, y, j); y += 1; } }
    for (const k of [1, 3]) { const [ii, jj] = ax ? [e, k] : [k, e]; a.up('3024', WHITE, ii, yH + 2, jj); a.up('3070b', WHITE, ii, yH + 3, jj); } }   // the gable's shoulders: two plates either side of the post, up to the planes' undersides
  if (ax) ridge(a, 'x', -1, 1, 3, L + 1 + hiVerge, yR, [1]); else ridge(a, 'z', 1, -1, 3, L + 1 + hiVerge, yR, [1]);
}

// ---- ko_gatewing: the gate wing (daemun-chae, SCHEME §2.7), body 6 × 5 (x 0..5, z 0..4), ridge E–W; its south face (z 4) the lane facade
// with the double gate toward the camera. Plates above the lane (C − 2 = 0): 0–3 granite sill · 3–15 walls (south: corner posts, gate of two
// Medium Nougat leaves in the 4-wide middle bay under a lintel and plaster; north: posts, plaster, a high lattice window; ends: granite to 9,
// plaster to 15) · 15–16 beam · 16–18 hinge course · two planes at 40° · gable posts · ridge 23–26, crest to 28, kicks to 29.
// Proxy: the body, 6 × 5; origin at its bottom centre.
if (want('ko_gatewing')) {
  const a = new Asm('ko_gatewing', [3, 0, 2.5]); const yH = 19;
  course(a, ring(0, 0, 6, 5, LBG), 0, MASON);
  for (const [i, j] of [[0, 0], [5, 0], [0, 4], [5, 4]]) post(a, i, j, 3, 18);
  for (const i of [1, 3]) a.up('87544', MN, i, 3, 4, 0);                             // the gate: two leaves …
  a.up('3710', MN, 1, 12, 4, 0); a.up('3010', WHITE, 1, 13, 4, 0); for (const y of [16, 17]) a.up('3710', WHITE, 1, y, 4, 0);   // … under a lintel and plaster
  for (const y of [3, 6, 9]) a.up('3010', WHITE, 1, y, 0, 0);                       // north: plaster, then the high window over white
  a.up('32932', TAN, 1, 12, 0, 0); for (const y of [12, 15]) a.up('3010', WHITE, 1, y, 1, 0);
  for (const i of [0, 5]) { for (const y of [3, 6]) { a.up('98283', LBG, i, y, 1, 1); a.up('3005', LBG, i, y, 3); } for (const y of [9, 12, 15]) { a.up('3004', WHITE, i, y, 1, 1); a.up('3005', WHITE, i, y, 3); } }   // ends: granite, plaster
  course(a, rect(0, 0, 6, 5, MN), 18, PLT);
  gableRoof(a, { len: 6, dir: 'x', yH, theta: 30, hinges: [1, 3], lineAt: (u) => [-1, 1, 3, 5].includes(u), lift: (u) => (u === -1 ? 1 : 0), yR: 25, hiVerge: 0 });   // r6: ridge a plate lower   // the east end tucks under the anchae's eave: no verge there
  const out = a.write(); console.log('ko_gatewing:', a.parts.length, 'parts', JSON.stringify(out.bom));
}

// ---- ko_neighbour: the neighbour's house one step down the alley (SCHEME §3), body 5 × 9 (x 0..4, z 0..8), ridge N–S; its west face (x 0)
// the alley facade: granite 0–3, the meander band 3–6, plaster 6–9, a high lattice window 9–15 between corner posts; the east face and the
// ends plaster over granite. Plates above its floor level (C − 4 = 0). Proxy: the body, 5 × 9.
if (want('ko_neighbour')) {
  const a = new Asm('ko_neighbour', [2.5, 0, 4.5]); const yH = 16;
  course(a, ring(0, 0, 5, 9, LBG), 0, MASON);
  for (const z of [1, 3, 5]) a.up('3004', SANDRED, 0, 3, z, 1); a.up('3005', SANDRED, 0, 3, 7); for (const z of [0, 8]) a.up('3005', WHITE, 0, 3, z);   // west: the band between the corner posts …
  course(a, ring(0, 0, 5, 9, WHITE, (i) => i === 0), 3, BRK);                      // … plaster round the rest
  for (const j of [0, 8]) for (const i of [0, 4]) post(a, i, j, 6, 15);
  const wall = (y, skip) => course(a, ring(0, 0, 5, 9, WHITE, (i, j) => ((i === 0 || i === 4) && (j === 0 || j === 8)) || skip(i, j)), y, BRK);
  wall(6, () => false);
  const win = (i, j) => i === 0 && j >= 2 && j <= 5;
  for (const y of [9, 12]) { wall(y, win); a.up('3010', WHITE, 1, y, 2, 1); }       // the high window over white
  a.up('32932', TAN, 0, 9, 2, 1);
  course(a, rect(0, 0, 5, 9, MN), 15, PLT);
  gableRoof(a, { len: 9, dir: 'z', yH, theta: 30, hinges: [2, 5], lineAt: (u) => (u + 1) % 2 === 0, lift: (u) => (u === -1 || u === 9 ? 1 : 0), yR: 22 });   // r6: ridge a plate lower
  const out = a.write(); console.log('ko_neighbour:', a.parts.length, 'parts', JSON.stringify(out.bom));
}

// ---- ko_wall<n>: the tile-capped courtyard wall (SCHEME §2.7), one stud thick, `n` long along x: granite 0–3, the meander course 3–6,
// plaster 6–9, a coping plate 9–10 and a line of curved-top bricks along it, a free end a bracket with a white disc (the wall's own small
// roof); an end that runs under a neighbour's eave stops plain. 12 plates, under every eave of the hanok. Proxy: n × 1.
for (const [n, s0, s1] of [[10, false, false], [8, false, false], [11, false, false]]) {   // north, west, south; r4: no sideways end discs (judge r3)
  const name = `ko_wall${n}`; if (!want(name)) continue;
  const a = new Asm(name, [n / 2, 0, 0.5]);
  lay(a, MASON, LBG, 0, 0, 0, n, 'x');
  for (let i = 0; i + 1 < n; i += 2) a.up('3004', SANDRED, i, 3, 0, 0); if (n % 2) a.up('3005', SANDRED, n - 1, 3, 0);
  lay(a, BRK, WHITE, 0, 0, 6, n, 'x');
  lay(a, PLT, DBG, 0, 0, 9, n, 'x');
  lay(a, PLT, WHITE, 0, 0, 10, n, 'x'); lay(a, TILE, DBG, 0, 0, 11, n, 'x');   // r5 (Eric: thin, fine tops): a white mortar line and a flat tile cap, not a row of curved ribs
  for (const [i, f, on] of [[0, 3, s0], [n - 1, 1, s1]]) { if (!on) continue; const br = atCell(a, '36840', DBG, i, 0, 11, f); a.onStud('98138', WHITE, a.side(br)[0], [0, 0, 1], 'x'); }
  const out = a.write(); console.log(name + ':', a.parts.length, 'parts', JSON.stringify(out.bom));
}

// ---- ko_chimney: the gulttuk (SCHEME §2.7), 2 × 2, standing apart: three courses of Dark Bluish Gray masonry, a plate, a tiny tiled cap.
if (want('ko_chimney')) {
  const a = new Asm('ko_chimney', [1, 0, 1]);
  for (const [y, k] of [[0, 0], [3, 1], [6, 0], [9, 1], [12, 0]]) { if (k) { a.up('98283', DBG, 0, y, 0, 1); a.up('98283', DBG, 1, y, 0, 1); } else { a.up('98283', DBG, 0, y, 0, 0); a.up('98283', DBG, 0, y, 1, 0); } }
  a.up('3022', DBG, 0, 15, 0); a.up('3022', DBG, 0, 16, 0);
  for (const j of [0, 1]) a.up('49307', DBG, 0, 17, j, 0), a.up('49307', DBG, 1, 17, j, 0);
  const out = a.write(); console.log('ko_chimney:', a.parts.length, 'parts', JSON.stringify(out.bom));
}
