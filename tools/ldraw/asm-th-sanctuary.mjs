// Pattaya · Sanctuary of Truth (2026-10-05, docs/countries/thailand.md §1). Prototype v1: massing — cruciform plan, stepped Thai roofs on
// the four arms with a nested porch at each end, nested cross-gable levels over the crossing, spire stubs.
// Roofs are "prisms" (a gable along x or z, or a cross-gable with four gables) built from studs-up slope rows: 33° skirts, 45° upper tiers,
// a one-plate Dark Brown ledge after a tier whose outer cell projects over the tier below and carries a tooth plate (the serrated eave).
// Prisms are unioned on a voxel grid (cell × plate): a slope that ends up inside another prism's volume is dropped and its room filled, so a
// porch gable stands in front of its arm and each crossing level's gable rises out of the roof below it. What is left is packed into bricks
// (three free plate layers) or plates.
//   LDRAW_DIR=… node tools/ldraw/asm-th-sanctuary.mjs && node tools/ldraw/bake.mjs th_sanctuary.ldr --force --lite
import { Asm, bbox, RY, BODY } from './asm-ours.mjs';

const RB = +(process.env.TH_WALL ?? 308), DB = +(process.env.TH_DARK ?? 308), MN = +(process.env.TH_CARVE ?? 84), DT = 28;   // walls · recesses · carving (LDraw codes). Eric 2026-10-06 chose scheme 3, dark old wood: Dark Brown walls, Reddish Brown roofs, Medium Nougat carving
const ROOF = +(process.env.TH_ROOF ?? 70);

const a = new Asm('th_sanctuary', [20, 0, 20]);
// every member remembers the cell it was placed in (its origin's cell; plate level from just below the origin) for the sweep
{ const put0 = a.put.bind(a); a.put = (id, color, R, t, tag) => { const rec = put0(id, color, R, t, tag); rec.cell = [Math.floor(t[0] + 1e-6), Math.floor(t[1] / 0.4 - 0.5), Math.floor(t[2] + 1e-6)]; return rec; }; }
const k2 = (x, z) => `${x},${z}`, k3 = (x, y, z) => `${x},${y},${z}`;

// ---- part footprints ------------------------------------------------------------------------------------------------------------------
const HEIGHT = { '2540': 1, '60470a': 1, '85861': 1, '90398': 5, '6141': 1, '3062b': 3, '24201': 2, '3794b': 1, '3045': 3, '3675': 3, '60481a': 6, '4286': 3, '3298': 3, '3040b': 3, '3039': 3, '3046': 3, '99301': 3, '3044b': 3, '3043': 3, '54200': 2, '49668': 1, '3070b': 1, '3024': 1 };
/** cells (x, z) a studs-up part covers when placed by Asm.up at min corner (x, z) with r quarter turns */
function cells(id, x, z, r) { const b = bbox(id).slice(); if (BODY[id]) [b[0], b[3], b[2], b[5]] = BODY[id]; const sn = (v) => Math.round(v * 2) / 2; const w = Math.max(1, Math.round(sn(b[3]) - sn(b[0]))), d = Math.max(1, Math.round(sn(b[5]) - sn(b[2]))); const [fw, fd] = r % 2 ? [d, w] : [w, d];
  const out = []; for (let i = 0; i < fw; i++) for (let j = 0; j < fd; j++) out.push([x + i, z + j]); return out; }

// ---- prisms on a voxel grid ------------------------------------------------------------------------------------------------------------
const claims = new Map();
const FACE = new Map();     // voxel → { ax: the axis the carved face runs along, n: its outward normal [nx, nz] }: grille and flower courses   // voxel → Set of prism ids
const prisms = [];          // { id, pieces: [{ id, color, x, y, z, r, vox }], fill: Map voxel → colour }
function newPrism() { const p = { id: prisms.length, pieces: [], fill: new Map() }; prisms.push(p); return p; }
const claim = (p, v) => { let s = claims.get(v); if (!s) claims.set(v, (s = new Set())); s.add(p.id); };
function piece(p, id, color, x, y, z, r) { const h = HEIGHT[id]; const vox = []; for (const [cx, cz] of cells(id, x, z, r)) for (let k = 0; k < h; k++) vox.push(k3(cx, y + k, cz));
  p.pieces.push({ id, color, x, y, z, r, vox }); for (const v of vox) claim(p, v); }
function fillVox(p, x, y, z, color) { const v = k3(x, y, z); p.fill.set(v, color); claim(p, v); }

// slopes descend toward +z at r = 0; DIRS maps a descent direction to r
const DIRS = { '0,1': 0, '1,0': 1, '0,-1': 2, '-1,0': 3 };
/** a slope `depth` cells deep whose front (low) cell is (fx, fz), descending along dir */
function slope(p, id, color, fx, fz, dir, y, depth) { const [dx, dz] = dir; let x0 = fx, z0 = fz; if (dx > 0) x0 = fx - depth + 1; if (dz > 0) z0 = fz - depth + 1; piece(p, id, color, x0, y, z0, DIRS[dir.join(',')]); }
const VALLEY_R = { '1,1': 0, '1,-1': 1, '-1,-1': 2, '-1,1': 3 };
function valley(p, id, n, color, cx, cz, sx, sz, y) { piece(p, id, color, sx > 0 ? cx - n + 1 : cx, y, sz > 0 ? cz - n + 1 : cz, VALLEY_R[`${sx},${sz}`]); }

const apexes = [], tiles = [], crests = [];
function crestFig(p, fx, y, fz, alongX) { piece(p, '3794b', DB, fx, y, fz, alongX ? 0 : 1); crests.push({ pc: p.pieces[p.pieces.length - 1], x: alongX ? fx + 0.5 : fx, z: alongX ? fz : fz + 0.5, y: y + 1 }); }
/** a 1 × 2 jumper across a gable's two top cells, min corner (fx, fz), long along x (alongX) or z, with a statuette on its centre stud */
function apex(p, fx, y, fz, alongX, out) { piece(p, '3794b', DB, fx, y, fz, alongX ? 0 : 1); apexes.push({ pc: p.pieces[p.pieces.length - 1], x: alongX ? fx + 0.5 : fx, z: alongX ? fz : fz + 0.5, y: y + 1, out }); }
/** walls round the union of rectangles, plate y0 to yTop: outer ring = arcade, the ring inside it = Dark Brown recess */
function arcade(rects, y0, yTop) {
  const inF = (x, z) => rects.some(([x0, x1, z0, z1]) => x >= x0 && x < x1 && z >= z0 && z < z1);
  const N4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  const outer = new Map(), inner = new Set();
  for (const [x0, x1, z0, z1] of rects) for (let x = x0; x < x1; x++) for (let z = z0; z < z1; z++) { const out = N4.filter(([u, v]) => !inF(x + u, z + v)); if (out.length) outer.set(k2(x, z), out); }
  for (const [x0, x1, z0, z1] of rects) for (let x = x0; x < x1; x++) for (let z = z0; z < z1; z++) if (!outer.has(k2(x, z)) && N4.some(([u, v]) => outer.has(k2(x + u, z + v)))) inner.add(k2(x, z));
  const p = newPrism(); for (const k of inner) { const [x, z] = k.split(',').map(Number); for (let y = y0; y < yTop; y++) fillVox(p, x, y, z, DB); }
  const yh = yTop - 3;   // piers to yh, pointed heads yh..yh+2, a plate course to yTop
  const pier = (x, z, alongX) => { /* a 1-stud slice of pier: grille brick between plain courses */ for (let y = y0; y < yh; y++) fillVox(p, x, y, z, RB); };
  // runs: outer cells with one outward normal, grouped along their wall line
  const seen = new Set();
  for (const [k, out] of outer) {
    if (seen.has(k)) continue; const [x, z] = k.split(',').map(Number);
    if (out.length !== 1) { seen.add(k); for (let y = y0; y < yTop; y++) fillVox(p, x, y, z, RB); continue; }   // corners: solid posts
    const [u, v] = out[0]; const alongX = v !== 0; const step = alongX ? [1, 0] : [0, 1];
    let sx0 = x, sz0 = z; while (outer.get(k2(sx0 - step[0], sz0 - step[1]))?.length === 1 && outer.get(k2(sx0 - step[0], sz0 - step[1]))[0].join() === out[0].join()) { sx0 -= step[0]; sz0 -= step[1]; }
    const run = []; for (let cx = sx0, cz = sz0; outer.get(k2(cx, cz))?.length === 1 && outer.get(k2(cx, cz))[0].join() === out[0].join(); cx += step[0], cz += step[1]) { run.push([cx, cz]); seen.add(k2(cx, cz)); }
    const L = run.length, n = Math.floor(L / 4), rem = L - (4 * n - 2), left = Math.floor(rem / 2);   // openings 2 wide, piers 2 between them, end piers ≥ 1
    const isOpen = (i) => i >= left && (i - left) % 4 < 2 && i < left + 4 * n;
    // piers: carved round columns (Medium Nougat, the lit carving) on every pier cell, Reddish Brown above the heads
    run.forEach(([cx, cz], i) => { if (isOpen(i)) return; for (let y = y0; y < yh; y += 3) piece(p, '3062b', MN, cx, y, cz, 0); for (let y = yh; y < yTop - 1; y++) fillVox(p, cx, y, cz, RB); });
    for (let j = 0; j < n; j++) {
      const [ax, az] = run[left + 4 * j];   // first opening cell; a pointed head (two inverted curved slopes) from its jambs, as Notre-Dame's nd_head2
      if (alongX) { head(p, ax - 1, yh, az, 1, [ax - 1, az]); head(p, ax + 1, yh, az, 3, [ax + 2, az]); }
      else { head(p, ax, yh, az - 1, 0, [ax, az - 1]); head(p, ax, yh, az + 1, 2, [ax, az + 2]); }
    }
    for (const [cx, cz] of run) fillVox(p, cx, yTop - 1, cz, RB);   // the plate course over the heads
  }
  for (const pc of p.pieces) if (pc.id === '24201') for (const v of pc.vox) p.fill.delete(v);   // the head's two plates replace the pier fill on its jamb
}
const heads = [];
/** one half of a pointed head: an inverted curved slope 2 × 1 whose one-plate end stands on the jamb `j`; a 1 × 1 plate tops that end */
function head(p, x, y, z, r, j) { piece(p, '24201', RB, x, y, z, r); heads.push({ pc: p.pieces[p.pieces.length - 1], j, y: y + 1 }); }
const hooks = [];
/** an eave-corner hook (the hang hong): a 1 × 1 tooth plate on the step a telescoped tier leaves, its tooth thrown outward (judge r1: blades
 *  read as rhino horns; r2: cones read as chimney caps) */
function hook(p, x, y, z, out, big) { piece(p, '85861', RB, x, y, z, 0); hooks.push({ pc: p.pieces[p.pieces.length - 1], x, y: y + 1, z, out, big }); }   // the tooth's footprint is 1 × 2: on the −x / −z ends its min corner is one stud out (judge r3: the west and north hooks were buried)
/** solid block [x0,x1)×[z0,z1) between plate levels y0 and y1 */
function block(x0, x1, z0, z1, y0, y1, color = RB, carved = false) { const p = newPrism(); for (let x = x0; x < x1; x++) for (let z = z0; z < z1; z++) for (let y = y0; y < y1; y++) {
  const edgeX = x === x0 || x === x1 - 1, edgeZ = z === z0 || z === z1 - 1; const face = carved && (edgeX !== edgeZ);   // carved: the side faces (not the corners) are grille bricks
  fillVox(p, x, y, z, face ? MN : color); if (face) FACE.set(k3(x, y, z), edgeZ ? { ax: 'x', n: [0, z === z0 ? -1 : 1] } : { ax: 'z', n: [x === x0 ? -1 : 1, 0] }); } return p; }

/** A stepped Thai roof over [x0,x1)×[z0,z1) with its first row at plate level y. type 'x' = ridge along x (gables at x0 / x1), 'z' = ridge
 *  along z, 'cross' = both (square; four gables, valleys on the diagonals). rows: ['33' | '45', ledge?]. `base` < y fills the rectangle
 *  from base up to y (a drum). Returns { p, top }. */
function roof(x0, x1, z0, z1, y, type, rows, opts = {}) {
  const { color = ROOF, fill = RB, base = y } = opts; const p = newPrism();
  for (let x = x0; x < x1; x++) for (let z = z0; z < z1; z++) for (let yy = base; yy < y; yy++) fillVox(p, x, yy, z, fill);
  const W = x1 - x0, D = z1 - z0;
  const dxOf = (x) => Math.min(x - x0, x1 - 1 - x), dzOf = (z) => Math.min(z - z0, z1 - 1 - z);
  const mOf = (x, z) => (type === 'x' ? dzOf(z) : type === 'z' ? dxOf(x) : type === 'hip' ? Math.min(dxOf(x), dzOf(z)) : Math.max(dxOf(x), dzOf(z)));
  const sx = (x) => (x - x0 < x1 - 1 - x ? -1 : 1), sz = (z) => (z - z0 < z1 - 1 - z ? -1 : 1);
  const half = (type === 'x' ? D : type === 'z' ? W : Math.min(W, D)) / 2;
  // a gable (x / z) telescopes: every tier above the first is shorter at each free end, so its gable stands set back on the tier below (the
  // real roofs' nested gables), and the step it leaves carries an upturned hook at each eave corner
  const ends = opts.ends ?? 'both', nearFree = ends !== 'far', farFree = ends !== 'near';
  const gab = type === 'x' || type === 'z'; let lo = type === 'x' ? x0 : z0, hi = type === 'x' ? x1 : z1;
  const along = (x, z) => (type === 'x' ? x : z);
  const live = (x, z) => !gab || (along(x, z) >= lo && along(x, z) < hi);
  // gable ends: their slopes are the bargeboards (Reddish Brown rake lines), the fill behind them the carved face (grille bricks)
  const gableAxis = (x, z) => (type === 'x' ? ((x === lo && nearFree) || (x === hi - 1 && farFree) ? 'z' : null) : type === 'z' ? ((z === lo && nearFree) || (z === hi - 1 && farFree) ? 'x' : null) : type === 'cross' ? (dxOf(x) === 0 ? 'z' : dzOf(z) === 0 ? 'x' : null) : null);
  const rake = (x, z) => (gableAxis(x, z) ? RB : color);
  const faceN = (x, z) => (type === 'z' ? [0, z === lo ? -1 : 1] : type === 'x' ? [x === lo ? -1 : 1, 0] : dxOf(x) === 0 ? [sx(x), 0] : [0, sz(z)]);
  // THE UPSWEEP (Eric, 2026-10-06: 每一个屋檐其实都是往上翘的…要把真理寺的灵魂抓到，它是有这种上扬感的). Every eave rises toward its free ends:
  // the last SWEEP.length cells of each eave line are lifted by SWEEP[d] plates (d = cells from the end), a whole column at a time — the slope,
  // the riser and everything above it in that cell ride up together on fill plates — so each tier's edge curves up into its corners.
  const SWEEP = opts.sweep === false || type === 'cross' ? [] : (opts.sweepCurve ?? []);
  const lift = new Map(); const L = (x, z) => lift.get(k2(x, z)) ?? 0;
  const want = (x, z, m) => {
    let d = Infinity;
    if (gab) { const a = along(x, z); if (nearFree) d = Math.min(d, a - lo); if (farFree) d = Math.min(d, hi - 1 - a); }
    else if (type === 'hip') { const dx = dxOf(x), dz = dzOf(z); d = dz <= m + 1 && dx >= m ? dx - m : dx <= m + 1 && dz >= m ? dz - m : Infinity; }
    return d < SWEEP.length ? SWEEP[d] : 0;
  };
  /** place a roof piece whose cells are `cells`, raising its column to the highest lift any of them wants; the gap below is filled */
  const put = (id, col, x, yy, z, r, cellsOf, m) => {
    const cs = cellsOf; const Lp = Math.max(...cs.map(([cx, cz]) => Math.max(L(cx, cz), want(cx, cz, m))));
    for (const [cx, cz] of cs) { for (let k = L(cx, cz); k < Lp; k++) fillVox(p, cx, yy + k, cz, fill); lift.set(k2(cx, cz), Lp); }
    piece(p, id, col, x, yy + Lp, z, r);
  };
  const slopeL = (id, col, fx, fz, dir, yy, depth, m) => { const [dx, dz] = dir; let x0_ = fx, z0_ = fz; if (dx > 0) x0_ = fx - depth + 1; if (dz > 0) z0_ = fz - depth + 1;
    put(id, col, x0_, yy, z0_, DIRS[dir.join(',')], cells(id, x0_, z0_, DIRS[dir.join(',')]), m); };
  const valleyL = (id, n, col, cx, cz, sx_, sz_, yy, m) => { const vx = sx_ > 0 ? cx - n + 1 : cx, vz = sz_ > 0 ? cz - n + 1 : cz, r = VALLEY_R[`${sx_},${sz_}`]; put(id, col, vx, yy, vz, r, cells(id, vx, vz, r), m); };
  let m = 0, tier = 0;
  for (const [kind, ledge] of rows) {
    if (m > half - 1) break;
    const depth = kind === '33' ? 3 : 2, id = { '33': '4286', '45': '3040b', '65': '60481a' }[kind], vid = kind === '33' ? '99301' : '3046', rise = kind === '65' ? 6 : 3;
    const used = new Set();
    // hip corners first: each convex corner piece also covers the first edge cell on both sides
    if (type === 'hip') for (let x = x0; x < x1; x++) for (let z = z0; z < z1; z++) if (dxOf(x) === m && dzOf(z) === m) { valleyL(kind === '33' ? '3675' : '3045', depth, color, x, z, sx(x), sz(z), y, m); for (let i = 0; i < depth; i++) for (let j = 0; j < depth; j++) used.add(k2(x - sx(x) * i, z - sz(z) * j)); }
    for (let x = x0; x < x1; x++) for (let z = z0; z < z1; z++) {
      if (!live(x, z) || mOf(x, z) !== m || used.has(k2(x, z))) continue;
      const dx = dxOf(x), dz = dzOf(z);
      if (type === 'hip') { if (dz === m) { slopeL(id, color, x, z, [0, sz(z)], y, depth, m); for (let j = 0; j < depth; j++) used.add(k2(x, z - sz(z) * j)); } else { slopeL(id, color, x, z, [sx(x), 0], y, depth, m); for (let i = 0; i < depth; i++) used.add(k2(x - sx(x) * i, z)); } continue; }
      if (type === 'cross' && dx === m && dz === m) { if (rise === 6) for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) for (let k = 0; k < 3; k++) fillVox(p, x - sx(x) * i, y + k, z - sz(z) * j, fill);   // no 65° valley mould: a 45° valley on a brick
        valleyL(vid, depth, color, x, z, sx(x), sz(z), y + rise - 3, m); for (let i = 0; i < depth; i++) for (let j = 0; j < depth; j++) used.add(k2(x - sx(x) * i, z - sz(z) * j)); continue; }
      if (type === 'x' || (type === 'cross' && dz === m && dx < m)) { slopeL(id, rake(x, z), x, z, [0, sz(z)], y, depth, m); for (let j = 0; j < depth; j++) used.add(k2(x, z - sz(z) * j)); continue; }
      if (type === 'z' || (type === 'cross' && dx === m && dz < m)) { slopeL(id, rake(x, z), x, z, [sx(x), 0], y, depth, m); for (let i = 0; i < depth; i++) used.add(k2(x - sx(x) * i, z)); continue; }
    }
    for (let x = x0; x < x1; x++) for (let z = z0; z < z1; z++) if (live(x, z) && mOf(x, z) > m && !used.has(k2(x, z))) { const g = gableAxis(x, z);
      for (let k = 0; k < rise; k++) { const v = k3(x, y + L(x, z) + k, z); fillVox(p, x, y + L(x, z) + k, z, g ? MN : fill); if (g) FACE.set(v, { ax: g, n: faceN(x, z) }); } }
    y += rise; m += depth - 1;
    if (ledge && m <= half - 1) {
      // a one-plate Dark Brown riser over the tier's back studs and the interior: the shadow line between two tiers
      for (let x = x0; x < x1; x++) for (let z = z0; z < z1; z++) { const mm = mOf(x, z); if (live(x, z) && mm >= m) fillVox(p, x, y + L(x, z), z, mm === m ? DB : fill); }
      if (gab) {   // the tier above steps back at each free end; the riser's end cells carry hooks at the eave corners, tiles between
        const step = (e) => { for (let x = x0; x < x1; x++) for (let z = z0; z < z1; z++) { if (along(x, z) !== e) continue; const mm = mOf(x, z); if (mm < m) continue;
          const outer = e === lo0 || e === hi0 - 1;   // the outermost step column carries a row of figures on every other cell (the real gables' carved figures)
          if (mm === m && opts.hooks !== false) hook(p, x, y + 1 + L(x, z), z, type === 'x' ? [Math.sign(e - (x0 + x1 - 1) / 2), 0] : [0, Math.sign(e - (z0 + z1 - 1) / 2)], tier === 0);
          else if (outer && mm > m && (mm - m) % 2 === 0 && opts.hooks !== false) piece(p, '90398', RB, x, y + 1 + L(x, z), z, 0); else piece(p, '3070b', RB, x, y + 1 + L(x, z), z, 0); } };
        const lo0 = lo, hi0 = hi;
        const st = opts.step ?? 1; for (let k = 0; k < st; k++) { if (nearFree) { step(lo); lo++; } if (farFree) { step(hi - 1); hi--; } }
        tier++;
      }
      y += 1;
    }
  }
  // ridge: a 45° double slope across the two top cells of a gable; at each free gable end a jumper instead, carrying a figure on the gable's
  // axis (every apex of the real building is crowned by a carved figure); the ridge rides its columns' lift, so it too sweeps up at the ends
  const ridge = (x, z, alongX, end) => { const cs = alongX ? [[x, z], [x + 1, z]] : [[x, z], [x, z + 1]]; const Lr = Math.max(...cs.map(([cx, cz]) => L(cx, cz)));
    for (const [cx, cz] of cs) for (let k = L(cx, cz); k < Lr; k++) fillVox(p, cx, y + k, cz, fill);
    const hg = (opts.hinges ?? []).find((h) => h.a === along(x, z));
    if (hg) { if (hg.k === 'gap') return;   // the hinge's own cell: the handle and the clips meet here
      // the swept segments hang on clip hinges at the ridge: a plate with a handle on the fixed side, a plate with two clips on the swept
      // side, handle and clips pointing at the gap cell between them (their bar and clip axis is the hinge line the sweep turns about)
      const r = alongX ? (hg.t > 0 ? 0 : 2) : (hg.t > 0 ? 1 : 3);
      piece(p, hg.k === 'A' ? '2540' : '60470a', RB, x, y + Lr, z, r);
      if (hg.k === 'A') PIVOT_LEVEL.push(y + Lr); return; }
    if (end) apex(p, x, y + Lr, z, alongX, end); else if (crest(x, z)) crestFig(p, x, y + Lr, z, alongX); else piece(p, '3044b', color, x, y + Lr, z, alongX ? 1 : 0); };
  // ridge crest: a seated figure on a jumper every third cell between the ends (the real ridges carry rows of small carved figures)
  const crest = (x, z) => { const a_ = along(x, z); return a_ - lo > 1 && hi - 1 - a_ > 1 && (a_ - lo) % 3 === 0; };
  if (type === 'z') for (let z = lo; z < hi; z++) ridge(x0 + m, z, true, z === lo && nearFree ? [0, -1] : z === hi - 1 && farFree ? [0, 1] : null);
  if (type === 'x') for (let x = lo; x < hi; x++) ridge(x, z0 + m, false, x === lo && nearFree ? [-1, 0] : x === hi - 1 && farFree ? [1, 0] : null);
  return { p, top: y + (type === 'cross' ? 0 : 3) };
}

// ---- union and packing -----------------------------------------------------------------------------------------------------------------
const BRICKS = [[2, 8, '3007'], [2, 6, '2456'], [2, 4, '3001'], [2, 3, '3002'], [2, 2, '3003'], [1, 8, '3008'], [1, 6, '3009'], [1, 4, '3010'], [1, 3, '3622'], [1, 2, '3004'], [1, 1, '3005']];
const FLAT = [[2, 4, '87079'], [2, 2, '3068b'], [1, 4, '2431'], [1, 3, '63864'], [1, 2, '3069b'], [1, 1, '3070b']];
const PLATES = [[2, 8, '3034'], [2, 6, '3795'], [2, 4, '3020'], [2, 3, '3021'], [2, 2, '3022'], [1, 8, '3460'], [1, 6, '3666'], [1, 4, '3710'], [1, 3, '3623'], [1, 2, '3023'], [1, 1, '3024']];
function emit() {
  const kept = []; const pieceVox = new Set(); const fill = new Map();
  // a piece survives unless another prism's solid fills one of its cells, or a higher piece of another prism already took it
  const solidOf = new Map(); for (const p of prisms) for (const v of p.fill.keys()) { let s = solidOf.get(v); if (!s) solidOf.set(v, (s = new Set())); s.add(p.id); }
  const all = prisms.flatMap((p) => p.pieces.map((pc) => ({ pc, p }))).sort((u, w) => w.pc.y - u.pc.y);
  const buried = new Set(), lost = [];   // lost: beaten by another prism's piece in the same cells; its free cells are filled solid   // pieces inside another prism's solid: their room is filled; pieces that lost to a higher piece leave no fill
  for (const { pc, p } of all) { if (pc.vox.some((v) => [...(solidOf.get(v) ?? [])].some((q) => q !== p.id))) { buried.add(pc); continue; } if (pc.vox.some((v) => pieceVox.has(v))) { lost.push({ pc, p }); continue; } kept.push(pc); pc.vox.forEach((v) => pieceVox.add(v)); }
  for (const p of prisms) { for (const [v, c] of p.fill) if (!fill.has(v)) fill.set(v, c); for (const pc of p.pieces) if (buried.has(pc)) for (const v of pc.vox) if (!fill.has(v)) fill.set(v, p.fill.values().next().value ?? RB); }
  for (const { pc } of lost) for (const v of pc.vox) { const [x, y, z] = v.split(',').map(Number); const below = k3(x, pc.y - 1, z);
    if (!pieceVox.has(v) && !fill.has(v) && (fill.has(below) || pieceVox.has(below))) fill.set(v, RB); }   // never over thin air (the hip skirt overhangs the cross's re-entrant corners)
  for (const v of pieceVox) fill.delete(v);
  const ys = [...new Set([...fill.keys()].map((v) => +v.split(',')[1]))].sort((p, q) => p - q); const used = new Set();
  for (const y of ys) {
    // carved gable faces in alternating courses (Eric: 繁复): a course of 1 × 2 grille bricks lying along the face, then a course of 1 × 1
    // bricks with studs on four sides, each carrying a Medium Nougat flower plate on its outward stud — rosettes over fretwork
    const flowers = Math.floor(y / 3) % 2 === 1;
    for (const [v, f] of FACE) { const [x, yy, z] = v.split(',').map(Number); if (yy !== y || used.has(v)) continue; const { ax, n } = f; const c = fill.get(v);
      const same = (w) => fill.get(w) === c && !used.has(w) && FACE.get(w)?.ax === ax;
      if (flowers) { if (![0, 1, 2].every((k) => same(k3(x, y + k, z)) && !claims.has(k3(x + n[0], y + k, z + n[1])))) continue;   // no room in front: a plain brick
        const rec = a.up('4733', RB, x, y, z, 0); for (let k = 0; k < 3; k++) used.add(k3(x, y + k, z));
        const st = a.side(rec).find((q) => q.d[0] === n[0] && q.d[2] === n[1]); if (st) a.onStud('24866', MN, st, [0, 1, 0], 'z'); continue; }
      const nx = ax === 'x' ? x + 1 : x, nz = ax === 'z' ? z + 1 : z;
      if (![0, 1, 2].every((k) => same(k3(x, y + k, z)) && same(k3(nx, y + k, nz))) || segOf(x, y, z) !== segOf(nx, y, nz)) continue;
      a.up('2877', c, x, y, z, ax === 'x' ? 0 : 1); for (let k = 0; k < 3; k++) { used.add(k3(x, y + k, z)); used.add(k3(nx, y + k, nz)); } }
  }
  for (const y of ys) for (const kind of ['brick', 'plate']) {
    const free = (x, z, c) => { for (let k = 0; k < (kind === 'brick' ? 3 : 1); k++) { const v = k3(x, y + k, z); if (used.has(v) || fill.get(v) !== c) return false; } return true; };
    const here = [...fill.entries()].filter(([v]) => +v.split(',')[1] === y && !used.has(v)).map(([v, c]) => { const [x, , z] = v.split(',').map(Number); return { x, z, c }; })
      .filter(({ x, z, c }) => free(x, z, c)).sort((p, q) => ((y >> 1) & 1 ? p.z - q.z || p.x - q.x : p.x - q.x || p.z - q.z));
    for (const { x, z, c } of here) {
      if (!free(x, z, c)) continue;
      const under = false;
      for (const [w, l, id] of kind === 'brick' ? BRICKS : under ? FLAT : PLATES) {
        let placed = false;
        for (const [fw, fd, r] of ((y >> 1) & 1 ? [[l, w, 0], [w, l, 1]] : [[w, l, 1], [l, w, 0]])) {
          let ok = true; const s0 = segOf(x, y, z); for (let i = 0; i < fw && ok; i++) for (let j = 0; j < fd && ok; j++) if (!free(x + i, z + j, c) || segOf(x + i, y, z + j) !== s0 || (under && segOf(x + i, ROOF_BASE, z + j) === 0)) ok = false;
          if (!ok) continue;
          a.up(id, c, x, y, z, r); for (let i = 0; i < fw; i++) for (let j = 0; j < fd; j++) for (let k = 0; k < (kind === 'brick' ? 3 : 1); k++) used.add(k3(x + i, y + k, z + j));
          placed = true; break;
        }
        if (placed) break;
      }
    }
  }
  for (const pc of kept) a.up(pc.id, pc.color, pc.x, pc.y, pc.z, pc.r);
  // a curl's head leans toward local −z: the quarter turn that throws it toward `out`
  const curlR = (o) => (o[0] > 0 ? 3 : o[0] < 0 ? 1 : o[1] > 0 ? 2 : 0);
  // gable apex: an open-stud round plate on the jumper and a tall curved flame (the chofa) leaning out along the ridge
  for (const ap of apexes) if (kept.includes(ap.pc)) { a.up('85861', RB, ap.x, ap.y, ap.z, 0); a.put('18395', RB, RY(curlR(ap.out)), [ap.x + 0.5, (ap.y + 1) * 0.4 - 0.1, ap.z + 0.5]); }
  for (const c of crests) if (kept.includes(c.pc)) a.up('90398', RB, c.x, c.y, c.z, 0);
  // eave ends: a curled vine on an open-stud round plate (the hang hong), its scroll thrown outward
  for (const h of hooks) if (kept.includes(h.pc)) { if (h.big) a.put('1997', RB, RY(curlR(h.out)), [h.x + 0.5, h.y * 0.4 - 0.1, h.z + 0.5]); else a.put('87747', RB, RY(curlR(h.out)), [h.x + 0.5, h.y * 0.4 + 0.2, h.z + 0.5]); }
  for (const h of heads) if (kept.includes(h.pc)) a.up('3024', RB, h.j[0], h.y, h.j[1], 0);
}

// ---- the sweep (Eric, 2026-10-06, with the aerial photo: 左右两侧的那层亭台全部都不是水平的，而是往上翘的) -------------------------------
// The wing roofs are not level: each wing's whole roof — eave lines, ridge, gables — rises toward its outer end like a boat. Built the way
// LEGO builds a bent roof (80105's tilted end panels): each wing roof beyond the crossing is cut into two segments, each segment a rigid
// sub-build tilted on a hinge line at its inner edge — SWEEP_A at the first line, SWEEP_A + SWEEP_B beyond the second — so the roof bends up
// in two steps that read as one curve. The packer never joins bricks across a hinge line; the walls below stay level.
const SWEEP_A = +(process.env.TH_SWA ?? 5), SWEEP_B = +(process.env.TH_SWB ?? 7);   // degrees
const HINGE = [11.5, 6.5, 28.5, 33.5];   // hinge lines (the handle bars) on both arms: inner and outer, near and far side, along the arm
const PIVOT_LEVEL = [];                  // plate level of every handle plate (all at the arm ridges' level)
const HINGES = [[27, 'A', 1], [28, 'gap'], [29, 'B', -1], [32, 'A', 1], [33, 'gap'], [34, 'B', -1], [12, 'A', -1], [11, 'gap'], [10, 'B', 1], [7, 'A', -1], [6, 'gap'], [5, 'B', 1]].map(([a_, k, t]) => ({ a: a_, k, t }));
const ROOF_BASE = 13;            // plates: the arm roofs start here (EAVE); everything below is level
// wall lines under the swept roofs (the arcade's outer ring: x 15 / 24 along the z arms, z 15 / 24 along the x arms, and the end walls)
const FRIEZE_LINES = [[14, 15, 0, 11, 'z'], [25, 26, 0, 11, 'z'], [14, 15, 29, 40, 'z'], [25, 26, 29, 40, 'z'], 
  [0, 11, 14, 15, 'x'], [0, 11, 25, 26, 'x'], [29, 40, 14, 15, 'x'], [29, 40, 25, 26, 'x'], [15, 25, 0, 1, 'x', 1], [15, 25, 39, 40, 'x', 1], [0, 1, 15, 25, 'z', 1], [39, 40, 15, 25, 'z', 1]];   // end walls: one course only — the swept end also swings inward over them   // the eave ring
const FRIEZE_CELLS = FRIEZE_LINES.flatMap(([x0, x1, z0, z1]) => { const o = []; for (let x = x0; x < x1; x++) for (let z = z0; z < z1; z++) o.push([x, z]); return o; });
/** sweep segment of a roof voxel: 0 = level; ±1 / ±2 inner / outer segment of the near (−) or far (+) end; arm 'z' or 'x' */
function segOf(x, y, z) {
  if (y < ROOF_BASE) return 0;
  const inZ = x >= 14 && x < 26, inX = z >= 14 && z < 26;
  // the inner hinges sit just outside the crossing's face gables (z 13–15 / 24–26), the outer ones five cells further out
  if (inZ && (z <= 10 || z >= 29)) return z <= 5 ? 'z-2' : z <= 10 ? 'z-1' : z < 34 ? 'z+1' : 'z+2';
  if (inX && (x <= 10 || x >= 29)) return x <= 5 ? 'x-2' : x <= 10 ? 'x-1' : x < 34 ? 'x+1' : 'x+2';
  return 0;
}
/** rotate every member of a swept segment about its hinge lines (our frame: y up, studs) */
function applySweep() {
  if (new Set(PIVOT_LEVEL).size !== 1) throw new Error('hinge plates at different levels: ' + [...new Set(PIVOT_LEVEL)]);
  const yb = ROOF_BASE * 0.4, yp = (PIVOT_LEVEL[0] + 1) * 0.4 - 0.1;   // the handle bar: 0.1 below the handle plate's top   // hinge lines at the roof's top: bending up opens a crack at the eave instead of crushing the ridge
  const rot = (axis, deg, pivot) => { const t = (deg * Math.PI) / 180, c = Math.cos(t), s = Math.sin(t);
    // axis 'x': rotation in the y–z plane about the line (y = yb, z = pivot); 'z': in the x–y plane about (x = pivot, y = yb)
    const R = axis === 'x' ? [1, 0, 0, 0, c, -s, 0, s, c] : [c, -s, 0, s, c, 0, 0, 0, 1];
    const P = axis === 'x' ? [0, yp, pivot] : [pivot, yp, 0];
    return (rec) => { const d = [0, 1, 2].map((i) => rec.t[i] - P[i]); rec.t = [0, 1, 2].map((i) => R[i * 3] * d[0] + R[i * 3 + 1] * d[1] + R[i * 3 + 2] * d[2] + P[i]);
      rec.R = [0, 1, 2].flatMap((i) => [0, 1, 2].map((j) => R[i * 3] * rec.R[j] + R[i * 3 + 1] * rec.R[3 + j] + R[i * 3 + 2] * rec.R[6 + j])); }; };
  // the end of the arm rises: on the far (+) side that is a negative rotation about +x (for 'z' arms) and a positive one about +z (for 'x')
  const sgn = (arm, side) => (arm === 'z' ? -side : side);
  const sweep = (rec, sg) => {
    const arm = sg[0], side = sg[1] === '+' ? 1 : -1, n = +sg[2];
    const [inner, outer] = side > 0 ? [HINGE[2], HINGE[3]] : [HINGE[0], HINGE[1]];
    if (n === 2) rot(arm === 'z' ? 'x' : 'z', sgn(arm, side) * SWEEP_B, outer)(rec);
    rot(arm === 'z' ? 'x' : 'z', sgn(arm, side) * SWEEP_A, inner)(rec);
  };
  const frieze = [];   // [x, z, plates] the wall under a swept roof rises with it: whole plates up to the roof's underside
  for (const [lineCells] of [[FRIEZE_CELLS]]) for (const [x, z] of lineCells) { const sg = segOf(x, ROOF_BASE, z); if (!sg) continue;
    const arm = sg[0], side = sg[1] === '+' ? 1 : -1;
    // the lowest point of the roof's underside over this cell: its edge nearest the hinge
    const e = arm === 'z' ? [x + 0.5, yb, side > 0 ? z : z + 1] : [side > 0 ? x : x + 1, yb, z + 0.5];
    const probe = { t: e, R: [1, 0, 0, 0, 1, 0, 0, 0, 1] }; sweep(probe, sg); frieze.push([x, z, Math.max(0, Math.floor((probe.t[1] - yb) / 0.4 - 1.2))]); }   // a margin: the roof also slides outward as it turns about its top
  for (const rec of a.parts) {
    const c = rec.cell; if (!c || rec.level) continue; const sg = segOf(c[0], c[1], c[2]); if (!sg) continue; sweep(rec, sg); }
  return frieze;
}
function unusedOld() {
  for (const rec of []) {
    const c = rec.cell; if (!c) continue; const sg = segOf(c[0], c[1], c[2]); if (!sg) continue;
    const arm = sg[0], side = sg[1] === '+' ? 1 : -1, n = +sg[2];
    const [inner, outer] = side > 0 ? [HINGE[2], HINGE[3]] : [HINGE[0], HINGE[1]];
    if (n === 2) rot(arm === 'z' ? 'x' : 'z', sgn(arm, side) * SWEEP_B, side > 0 ? outer : outer)(rec);
    rot(arm === 'z' ? 'x' : 'z', sgn(arm, side) * SWEEP_A, side > 0 ? inner : inner)(rec);
  }
}
// ---- the building -----------------------------------------------------------------------------------------------------------------------
// v4 (Eric, 2026-10-06: 缺少了一点震撼力…两边的亭子长度更夸张): plan 40 × 40, centre (20, 20): crossing [14, 26)², arms 12 wide reaching 14
// beyond it on every side; every eave sweeps up into its ends (roof(): SWEEP). Heights in plates from the plinth top.
const S = 40, C0 = 14, C1 = 26, EAVE = 13;
// 45° rows in three tiers; each tier steps back two studs at the ends (telescoping), so every wing ends in three nested gables
const ARM = [['45', true], ['45', false], ['45', true], ['45', false], ['45', false]];   // tier 1: m0 · tier 2: m1–m2 · tier 3: m3–m4, ridge
// platform (one brick, Dark Brown) under the cross
block(C0, C1, 0, S, 0, 3, DB); block(0, S, C0, C1, 0, 3, DB);
// walls: a carved arcade on the outer ring (round Medium Nougat columns, 2-stud openings under pointed heads), a Dark Brown recess ring
// behind it, the interior hollow under a Dark Brown ceiling plate that also shows as the shadow line under the eaves
arcade([[C0 + 1, C1 - 1, 1, S - 1], [1, S - 1, C0 + 1, C1 - 1]], 3, EAVE - 1);
block(C0, C1, 0, S, EAVE - 1, EAVE, DB); block(0, S, C0, C1, EAVE - 1, EAVE, DB);
// the two arm roofs run edge to edge through the crossing
roof(C0, C1, 0, S, EAVE, 'z', ARM, { base: EAVE, step: 2, hinges: HINGES }); roof(0, S, C0, C1, EAVE, 'x', ARM, { base: EAVE, step: 2, hinges: HINGES });
// crossing: a mountain of roofs. Three hip skirts from the arms' eaves (top 8 × 8 at 25), a drum and two more (top 4 × 4 at 39), a drum
// and one more (top 2 × 2 at 48) under the central spire; four 2 × 2 columns on the diagonals rise to 39 and carry the sub-spires; a steep
// 65° gable leans on each face of the stage
const G = [['65', true], ['65', false], ['65', false]];
roof(13, 27, 13, 27, EAVE, 'hip', [['45', true], ['45', true], ['45', true]], { base: EAVE });   // 13–16 R 17–20 R 21–24 R → top [16, 24)² at 25
roof(16, 24, 16, 24, 31, 'hip', [['45', true], ['45', true]], { base: 25 });                   // drum 25–31, 31–34 R 35–38 R → top [18, 22)² at 39
roof(18, 22, 18, 22, 45, 'hip', [['45', false]], { base: 39 });                                // drum 39–45, 45–48 → top [19, 21)² at 48
const SUB = 39; for (const [x, z] of [[16, 16], [22, 16], [16, 22], [22, 22]]) block(x, x + 2, z, z + 2, 25, SUB, RB);
const GO = { base: 25, color: RB, hooks: false, sweep: false };   // judge r2: a big smooth Medium Nougat 65° face caught the sky as lilac — Reddish Brown
roof(17, 23, 24, 27, 25, 'z', G, { ...GO, ends: 'far' }); roof(17, 23, 13, 16, 25, 'z', G, { ...GO, ends: 'near' }); roof(24, 27, 17, 23, 25, 'x', G, { ...GO, ends: 'far' }); roof(13, 16, 17, 23, 25, 'x', G, { ...GO, ends: 'near' });
// corner pavilions in the four re-entrant corners (the lobes on the diagonals of the real plan): an 8 × 8 plinth, a short arcade, a
// three-step hip with swept corners; the front-left one is the Brahma tower — a 2 × 2 shaft through its hip to a tiered cap
const corners = [[29, 3, false], [3, 3, false], [29, 29, false], [3, 29, true]];
for (const [x0, z0, brahma] of corners) {
  block(x0, x0 + 8, z0, z0 + 8, 0, 3, DB);
  arcade([[x0 + 1, x0 + 7, z0 + 1, z0 + 7]], 3, 9);
  block(x0, x0 + 8, z0, z0 + 8, 9, 10, DB);
  roof(x0, x0 + 8, z0, z0 + 8, 10, 'hip', [['45', true], ['45', true], ['45', false]], { base: 10 });   // 10–13 R 14–17 R 18–21 → top 2 × 2 at 21
  if (brahma) block(x0 + 3, x0 + 5, z0 + 3, z0 + 5, 10, 28, RB);
}
// the plinth's open top is tiled (a walked floor, no studs showing): every plinth cell nothing stands on
{ const open = new Set(); for (let x = 0; x < S; x++) for (let z = 0; z < S; z++) { const v = claims.get(k3(x, 2, z)); if (v && !claims.has(k3(x, 3, z))) open.add(k2(x, z)); }
  const TILES = [[2, 4, '87079'], [2, 2, '3068b'], [1, 4, '2431'], [1, 3, '63864'], [1, 2, '3069b'], [1, 1, '3070b']];
  for (const k of [...open].sort()) { if (!open.has(k)) continue; const [x, z] = k.split(',').map(Number);
    for (const [w, l, id] of TILES) { let done = false; for (const [fw, fd, r] of [[l, w, 0], [w, l, 1]]) { let ok = true; for (let i = 0; i < fw && ok; i++) for (let j = 0; j < fd && ok; j++) ok = open.has(k2(x + i, z + j)); if (!ok) continue;
      tiles.push([id, x, z, r]); for (let i = 0; i < fw; i++) for (let j = 0; j < fd; j++) open.delete(k2(x + i, z + j)); done = true; break; } if (done) break; } } }
emit();
for (const [id, x, z, r] of tiles) a.up(id, DB, x, 3, z, r);
// ---- spires (stacked round parts on their own axes, placed after the union) ----
/** a stack on the axis (cx, cz) from plate y: [id, colour, size(studs), height(plates)] … */
function stack(cx, cz, y, list) { for (const [id, color, n, h] of list) { a.up(id, color, cx - n / 2, y, cz - n / 2, 0); y += h; } return y; }
// the yot on the third stage's 2 × 2 top: stacked crowns (a round brick under a flared inverted dish), then a needle of petal rings, a rider
const P = ['24866', ROOF, 1, 1], R1 = ['3062b', RB, 1, 3], CR = [['3941', RB, 2, 3], ['4740', ROOF, 2, 1]];
const tip = stack(20, 20, 48, [...CR, ...CR, ...CR, ['4032a', RB, 2, 1], ['4740', ROOF, 2, 1], ['3942c', RB, 2, 6],
  P, R1, P, R1, P, R1, P, R1, P, ['6141', RB, 1, 1], P, ['4589', RB, 1, 3], ['6141', ROOF, 1, 1], ['90398', RB, 1, 5]]);
// four sub-spires on the diagonal columns
for (const [cx, cz] of [[17, 17], [23, 17], [17, 23], [23, 23]]) stack(cx, cz, SUB, [...CR, ...CR, ['4032a', RB, 2, 1], ['4740', ROOF, 2, 1], ['3942c', RB, 2, 6],
  P, R1, P, R1, P, ['4589', RB, 1, 3], ['90398', RB, 1, 5]]);
// pavilion finials; the Brahma tower's tiered cap
for (const [x0, z0, brahma] of corners) {
  const c = [x0 + 4, z0 + 4];
  if (brahma) stack(c[0], c[1], 28, [['4740', ROOF, 2, 1], ...CR, ['3942c', RB, 2, 6], P, R1, P, ['4589', RB, 1, 3], ['90398', RB, 1, 5]]);
  else stack(c[0], c[1], 21, [...CR, ['3942c', RB, 2, 6], P, ['4589', RB, 1, 3], ['90398', RB, 1, 5]]);
}
{ const fr = applySweep();
  // the frieze: runs of Reddish Brown plates along each wall line, level k present where the roof has lifted more than k plates
  const by = new Map(); for (const [x, z, n] of fr) by.set(k2(x, z), n);
  const lines = [];   // each wall line as an ordered list of cells
  for (const [x0, x1, z0, z1, ax, cap] of FRIEZE_LINES) { const cs = []; for (let x = x0; x < x1; x++) for (let z = z0; z < z1; z++) { cs.push([x, z]); if (cap) by.set(k2(x, z), Math.min(by.get(k2(x, z)) ?? 0, cap)); } lines.push([cs, ax]); }
  for (const [cs, ax] of lines) for (let k = 0; k < 12; k++) { let run = [];
    const flush = () => { while (run.length) { const L = [8, 6, 4, 3, 2, 1].find((v) => v <= run.length); const [x, z] = run[0];
      const top = run.slice(0, L).every(([cx, cz]) => (by.get(k2(cx, cz)) ?? 0) === k + 1);   // the last course under the roof is tiled
      const id = top ? { 8: '4162', 6: '6636', 4: '2431', 3: '63864', 2: '3069b', 1: '3070b' }[L] : { 8: '3460', 6: '3666', 4: '3710', 3: '3623', 2: '3023', 1: '3024' }[L];
      const rec = a.up(id, RB, x, ROOF_BASE + k, z, ax === 'x' ? 0 : 1); rec.level = true; run = run.slice(L); } };
    for (const c of cs) { const n = by.get(k2(c[0], c[1])) ?? 0; if (n > k && (run.length === 0 || ((by.get(k2(run[0][0], run[0][1])) ?? 0) === k + 1) === (n === k + 1))) run.push(c); else { flush(); if (n > k) run.push(c); } } flush(); }
}
console.log('spire tip', tip);
console.log(JSON.stringify(a.write()));
