// Venice beachfront (LA, 2026-10-04) — each element one assembly of real parts, authored in our frame (asm-ours.mjs).
//   LDRAW_DIR=<main repo>/vendor/ldraw-lib/ldraw node tools/ldraw/asm-la-venice.mjs && node tools/ldraw/bake.mjs la_bowl.ldr la_bowlrail.ldr la_skateboard.ldr … --force
// Scheme: docs/refs/la-venice/SCHEME.md; build notes: docs/refs/la-venice/BUILD.md.
// Frames: footprint min corner at (0, 0), x east, z south (toward the default camera), y up in plates; origins at the footprint's bottom centre.
import { building, TILES } from './asm-build.mjs';
import { Asm, bbox, PLATE } from './asm-ours.mjs';
const LBG = 71, DBG = 72, BLK = 0, WHITE = 15, RED = 4, BLUE = 1, BLB = 212, TCLR = 47, TBLK = 40, SILVER = 179;
const yaw0 = [1, 0, 0, 0, 1, 0, 0, 0, 1];
const key = (i, j) => `${i},${j}`;
const only = process.argv.slice(2);
const want = (n) => !only.length || only.includes(n);

// ---- la_bowl: the skate bowl, 19 × 12, sunk into the island's earth and a raised concrete plateau (SCHEME §1). Plates from the island base (BASE = 3 in the scene):
//   0      base plates over the whole footprint (the island's bottom layer: the earth round the bowl clamps the rim)
//   1–4    supports under the apron and the 45° slopes; floor-level plates under the cheese; the deep floor tiled at 1 (surface 2)
//   2–4    lower facet: Slope 31 1×2×⅔ cheese (85984), 31°
//   4–7    upper facet: Slope 45 2×1 (3040b), inside corners Slope 45 2×2 Double Concave (3046), the waist Double Convex (3045)
//   4–10   apron: a brick, two plates and a tile — the concrete plateau one brick above the sand (G + 3), its outer face a retaining edge
//   7–10   upper wall: a vertical course on the 45° slopes' high cells; the six concave corners are macaroni bricks (3063b)
//   10–11  coping ring: tiles on the upper wall, macaroni tiles (27925) over the corners
// v3 (lead review: v2 read as a rectangular swimming pool): the plateau and the vertical upper wall make the bowl 8 plates deep (floor
// at base + 2, coping at base + 11); the profile runs 31° → 45° → vertical, a quarter-pipe in three facets, with rounded corners.
// Deep lobe (west): coping box x1–10 × z1–10, floor 4 × 4 at surface 2 (8 plates deep). Shallow lobe (east): coping box x10–17 × z3–8,
// floor x9–15 × z5–6 at surface 4 (6 plates deep), reached from the deep floor over the deep lobe's east cheese row (the step 2 → 4).
// Deck strip x11–17 × z0–2 north of the shallow lobe. r3 (Eric: no raised platform, no hinge risers — the tail truck's wheels hook the
// coping): the coping and the apron are plain again; one apron cell behind the coping (x13, z2) carries a plate and, flush with the coping
// top, a Dark Bluish Gray tile with a clip (15712) whose bore runs along the coping: it closes on the bar between la_skater's tail wheels.
if (want('la_bowl')) {
  const W = 19, D = 12; const { a, layer } = building('la_bowl', W, D);
  const COPE = DBG;
  const slope = new Map();   // cell → 'C' (high, carries a coping tile) | 's' (sloped / low)
  const put45 = (id, x, z, r, cells) => { a.up(id, LBG, x, 4, z, r); for (const [i, j, k] of cells) slope.set(key(i, j), k); };
  // 3040b (1×2, high cell first along the descent): r0 descends +z, r1 +x, r2 −z, r3 −x
  const s45 = (x, z, r) => { const c = r === 0 ? [[x, z, 'C'], [x, z + 1, 's']] : r === 2 ? [[x, z + 1, 'C'], [x, z, 's']] : r === 1 ? [[x, z, 'C'], [x + 1, z, 's']] : [[x + 1, z, 'C'], [x, z, 's']]; put45('3040b', x, z, r, c); };
  // 3046 double concave (2×2): low cell at +x+z (r0), +x−z (r1), −x−z (r2), −x+z (r3)
  const concave = (x, z, r) => { const low = [[1, 1], [1, 0], [0, 0], [0, 1]][r]; const c = []; for (const [i, j] of [[0, 0], [1, 0], [0, 1], [1, 1]]) c.push([x + i, z + j, i === low[0] && j === low[1] ? 's' : 'C']); put45('3046', x, z, r, c); };
  // 3045 double convex (2×2): high cell at −x−z (r0), … r2 +x+z, r3 +x−z
  const convex = (x, z, r) => { const hi = [[0, 0], [0, 1], [1, 1], [1, 0]][r]; const c = []; for (const [i, j] of [[0, 0], [1, 0], [0, 1], [1, 1]]) c.push([x + i, z + j, i === hi[0] && j === hi[1] ? 'C' : 's']); put45('3045', x, z, r, c); };
  // deep lobe
  concave(1, 1, 0); concave(9, 1, 3); concave(1, 9, 1); concave(9, 9, 2);
  for (let x = 3; x <= 8; x++) { s45(x, 1, 0); s45(x, 9, 2); }
  for (let z = 3; z <= 8; z++) s45(1, z, 1);
  convex(9, 3, 3); convex(9, 7, 2);                                             // the waist
  // shallow lobe
  for (let x = 11; x <= 15; x++) { s45(x, 3, 0); s45(x, 7, 2); }
  concave(16, 3, 3); concave(16, 7, 2); for (const z of [5, 6]) s45(16, z, 3);
  // cheese ring of the deep lobe (2 wide, high side toward the wall): the east row is also the step up to the shallow floor
  const cheese = new Set(); const ch = (x, z, r) => { a.up('85984', LBG, x, 2, z, r); const [w, d] = r % 2 ? [1, 2] : [2, 1]; for (let i = 0; i < w; i++) for (let j = 0; j < d; j++) cheese.add(key(x + i, z + j)); };
  for (const x of [3, 5, 7]) { ch(x, 3, 0); ch(x, 8, 2); }
  for (const z of [4, 6]) { ch(3, z, 1); ch(8, z, 3); }
  const deep = new Set(), shallow = new Set();
  for (let x = 4; x <= 7; x++) for (let z = 4; z <= 7; z++) deep.add(key(x, z));
  for (let x = 9; x <= 15; x++) for (const z of [5, 6]) shallow.add(key(x, z));
  const apron = new Set(); for (let x = 0; x < W; x++) for (let z = 0; z < D; z++) { const k = key(x, z); if (!slope.has(k) && !cheese.has(k) && !deep.has(k) && !shallow.has(k)) apron.add(k); }
  const HOOK = [13, 2];   // the apron cell whose clip tile holds the skater's tail truck (la_skater)
  const m = (set, c = LBG) => new Map([...set].map((k) => [k, c]));
  layer(m(new Set([...Array(W * D).keys()].map((n) => key(n % W, Math.floor(n / W))))), 0, 'plate');      // base
  layer(m(new Set([...apron, ...slope.keys()])), 1, 'brick');                                                // supports 1–4
  layer(m(new Set([...cheese, ...shallow])), 1, 'plate'); layer(m(shallow), 2, 'plate'); layer(m(shallow), 3, 'plate', TILES);   // floors
  layer(m(deep), 1, 'plate', TILES);
  layer(m(apron), 4, 'brick'); layer(m(apron), 7, 'plate'); layer(m(apron), 8, 'plate');                  // the raised apron: one brick over the sand
  const apronTop = new Set([...apron].filter((k) => k !== key(...HOOK)));
  layer(m(apronTop), 9, 'plate', TILES);
  a.up('3024', LBG, HOOK[0], 9, HOOK[1]); a.up('15712', COPE, HOOK[0], 10, HOOK[1], 1);                    // the hook: a plate, the clip tile flush with the coping top, its bore along x
  // the upper wall: a vertical course on the 45° slopes' high cells (plates 7–10), its six concave corners rounded by macaroni bricks
  // (3063b) on the double-concave slopes' three studs; the coping on top, macaroni tiles over the corners
  const cope = new Set([...slope].filter(([, k]) => k === 'C').map(([c]) => c));
  const CORNERS = [[1, 1, 0], [9, 1, 3], [1, 9, 1], [9, 9, 2], [16, 3, 3], [16, 7, 2]];   // r as the 3046 under it
  for (const [x, z, r] of CORNERS) {
    a.up('3063b', LBG, x, 7, z, (r + 2) % 4); a.up('27925', COPE, x, 10, z, (r + 2) % 4);                   // the macaroni's ring centre is at its −x−z cell at r0 (checked in a render)
    const low = [[1, 1], [1, 0], [0, 0], [0, 1]][r]; for (const [i, j] of [[0, 0], [1, 0], [0, 1], [1, 1]]) if (!(i === low[0] && j === low[1])) cope.delete(key(x + i, z + j));
  }
  layer(m(cope), 7, 'brick');
  layer(m(cope, COPE), 10, 'plate', TILES);
  const out = a.write(); console.log('la_bowl:', a.parts.length, 'parts', JSON.stringify(out.bom));
}

// ---- la_bowlrail: the pipe rail on the boardwalk side of the bowl — two Bar 1×8×2 rail sections (legs on studs 5 apart)
if (want('la_bowlrail')) {
  const a = new Asm('la_bowlrail', [9.5, 0, 0.5]);   // 19 wide like the bowl, two sections symmetric about its centre, legs on cell centres
  for (const cx of [5, 14]) a.put('2486', SILVER, yaw0, [cx, 6 * PLATE, 0.5]);   // LDraw origin on the top bar; legs at cx ± 2.5 on cell centres
  const out = a.write(); console.log('la_bowlrail:', a.parts.length, 'parts', JSON.stringify(out.bom));
}

// ---- la_skateboard: the placeholder board (42511c01 exploded: deck 42511 + two wheel pairs 2496), deck along x; origin = the deck's top centre
if (want('la_skateboard')) {
  const a = new Asm('la_skateboard', [0, 0, 0]);
  a.put('42511', 16, yaw0, [0, 0, 0]);
  for (const s of [1, -1]) a.put('2496', BLK, [0, 0, 1, 0, 1, 0, -1, 0, 0].map((v, k) => (k === 2 || k === 6 ? -v : v)), [s * 29.6 / 20, -14.3 / 20, 0]);
  const out = a.write(); console.log('la_skateboard:', a.parts.length, 'parts', JSON.stringify(out.bom));
}

// ---- shared: rotate a group of already-placed parts about an axis through `pivot` (studs): R' = Rt·R, t' = pivot + Rt·(t − pivot)
const mulR = (A, B) => [0, 1, 2].flatMap((i) => [0, 1, 2].map((j) => A[i * 3] * B[j] + A[i * 3 + 1] * B[3 + j] + A[i * 3 + 2] * B[6 + j]));
const appR = (A, v) => [0, 1, 2].map((i) => A[i * 3] * v[0] + A[i * 3 + 1] * v[1] + A[i * 3 + 2] * v[2]);
const turn = (recs, Rt, pivot) => { for (const r of recs) { r.R = mulR(Rt, r.R); r.t = appR(Rt, r.t.map((v, i) => v - pivot[i])).map((v, i) => v + pivot[i]); } };
const Rz = (deg) => { const t = (deg * Math.PI) / 180, c = Math.cos(t), s = Math.sin(t); return [c, -s, 0, s, c, 0, 0, 0, 1]; };   // +x toward +y for deg > 0
const Rx = (deg) => { const t = (deg * Math.PI) / 180, c = Math.cos(t), s = Math.sin(t); return [1, 0, 0, 0, c, -s, 0, s, c]; };   // +y toward +z for deg > 0
/** a hinge 1×2 (3937 base + 3938 top on the same LDraw origin): the base is placed like a brick; the top's group turns about the axle,
 *  10 LDU (0.5 stud) under the base's top face on the cell-row centre line (as measured for asm-mbs.mjs) */
/** tile a set of cells (Map "i,j" → colour) at plate y in runs along x (1×N tiles), the largest that fit */
const tileRuns = (a, cells, y) => { const used = new Set(); for (const k of [...cells.keys()].sort((p, q) => { const [a1, b1] = p.split(',').map(Number), [a2, b2] = q.split(',').map(Number); return b1 - b2 || a1 - a2; })) {
  if (used.has(k)) continue; const [i, j] = k.split(',').map(Number); const c = cells.get(k); let L = 1; while (L < 8 && cells.get(key(i + L, j)) === c && !used.has(key(i + L, j))) L++; while (!TILES[L]) L--;
  for (let n = 0; n < L; n++) used.add(key(i + n, j)); a.up(TILES[L], c, i, y, j, 0); } };
const hinge = (a, color, x, y, z, r) => { const base = a.up('3937', color, x, y, z, r); const top = a.put('3938', color, base.R, base.t); return { base, top, pivot: [base.t[0], base.t[1] - 0.5, base.t[2]] }; };

// ---- la_gate: the Muscle Beach gate (SCHEME §3, real-musclebeach.jpg). Frame x0–9 (pen x2–11), z0–1, y from the pad top (pen plate 1):
//   piers   2×2 concrete at x2–3 and x6–7: three Brick 2×2 + a Plate 2×2, 10 plates (v3: the gate scaled down, lead review)
//   lintel  Plate 2×10 over both piers, x0–9; the bar on it, a Brick 2×4 between the piers, tiled
//   boxes   royal blue, as in the photo: the west one hangs under the lintel's overhang, the east one stands on it; the east box's top course
//           is a hinge base (3937) and a 1×2 brick, so the arm springs from the box itself
//   arm     the hinge top (3938) turned up toward the west, a 2×4 plate and a Technic brick 1×2 at the end, tiled; a 2L axle through
//           its hole carries the disc
//   disc    Brick 2×2 round (3941) on edge on the axle, its studs to the south under a Dish 2×2 (4740): the weight plate (v2's 4×4 read as a tyre)
if (want('la_gate')) {
  const a = new Asm('la_gate', [5, 0, 1]); const GR = LBG;
  // the strip of the pen it owns: plinth bricks beside the piers on the north edge, mat tiles behind them, the threshold through the opening
  for (const x of [0, 8]) { a.up('3004', GR, x, 0, 0, 0); a.up('3069b', GR, x, 3, 0, 0); a.up('3069b', BLK, x, 0, 1, 0); }
  a.up('3069b', LBG, 4, 0, 0, 0); a.up('3069b', BLK, 4, 0, 1, 0);
  for (const x of [2, 6]) { for (let k = 0; k < 3; k++) a.up('3003', GR, x, 3 * k, 0); a.up('3022', GR, x, 9, 0); }   // piers, 10 plates
  a.up('3832', GR, 0, 10, 0, 0);                                                                            // lintel 2×10
  a.up('2456', GR, 2, 11, 0, 0); for (const x of [2, 4, 6]) a.up('3068b', GR, x, 14, 0); a.up('3068b', GR, 0, 11, 0);   // the bar between the piers, tiled; the lintel's west end tiled
  for (const y of [4, 7]) a.up('3003', BLUE, 0, y, 0);                                                       // west box, hanging from the lintel
  a.up('3003', BLUE, 8, 11, 0); a.up('3023', BLUE, 9, 14, 0, 1);                                            // east box: a 2×2, then a 1×2 plate beside …
  const h = hinge(a, BLUE, 8, 14, 0, 1);                                                                     // … the hinge base (length along z)
  a.up('3069b', BLUE, 9, 15, 0, 1);                                                                          // … tiled a plate under the hinge top, so the arm's end clears it as it turns
  const arm = [h.top];
  arm.push(a.up('3020', GR, 5, 17, 0, 0));                                                                   // 2×4 plate on the hinge top's studs, reaching west
  const tb = a.up('3700', GR, 5, 18, 1, 0); arm.push(tb, a.up('3710', GR, 5, 18, 0, 0), a.up('2431', GR, 5, 19, 0, 0), a.up('3069b', GR, 5, 21, 1, 0));   // Technic brick 1×2 at the end, the rest tiled
  arm.push(a.up('3023', GR, 7, 18, 1, 0), a.up('3069b', GR, 7, 19, 1, 0));
  const hole = [tb.t[0], tb.t[1] - 0.5, tb.t[2]];                                                            // 3700: hole 10 LDU under the top face
  arm.push(a.put('3704', BLK, [0, 0, -1, 0, 1, 0, 1, 0, 0], [hole[0], hole[1], hole[2] + 0.5]));            // 2L axle along z, half in the brick
  const D = [1, 0, 0, 0, 0, -1, 0, 1, 0];                                                                    // local +y → +z: studs to the south
  const zo = hole[2] + 0.5 + 1.2;                                                                            // the round brick's top face (its origin), its bottom on the arm's south face
  arm.push(a.put('3941', BLK, D, [hole[0], hole[1], zo]), a.put('4740', BLK, D, [hole[0], hole[1], zo + 0.4]), a.put('98138', LBG, D, [hole[0], hole[1], zo + 0.4 + 0.4]));   // the weight plate: round 2×2 on edge, dish face, steel hub
  const TH = -25; turn(arm, Rz(TH), h.pivot);
  const c = appR(Rz(TH), [hole[0] - h.pivot[0], hole[1] - h.pivot[1], 0]).map((v, i) => v + h.pivot[i]);
  console.log(`la_gate: arm ${TH}°, disc centre x ${c[0].toFixed(2)} y ${(c[1] / PLATE).toFixed(1)} plates (top ${((c[1] + 1) / PLATE).toFixed(1)})`);
  const out = a.write(); console.log('la_gate:', a.parts.length, 'parts', JSON.stringify(out.bom));
}

// ---- la_tower v3 (lead review 2026-10-04: v2 read as a blue box on stubby blocks under giant pipe rails). Proportions copied from
// real-tower-19.jpg / real-tower-18.jpg and the official 60328: four slim stilts that lift the deck about one cabin-height off the sand,
// open X-bracing between them, a cabin narrower than the deck, an eave all round, slim spindle rails, a long straight ramp.
// Frame x0–5 deck (+ hinge post and ramp east to ≈ x18), z0–6 (z0 = the roof's north eave), y from the sand. Plates:
//   0–13    stilts: 1×1 columns at x1/x4 × z2/z5 (3 apart), each with a Technic brick 1×1 (hole along x) at the foot and the head. On both
//           side faces two thin 6-long Technic beams cross in an X, pinned in those holes: 3 across, 10 plates up, a 3-4-5 triangle, so the
//           beam's end holes (5 apart) land exactly on the pins. The beams sit in two layers outside the face so they cross clear
//   13–14   deck Plate 6×6 (x0–5, z1–6), its ring tiled; spindle-fence rails (Fence 1×4×2) and round posts on the west, south and east edges
//   14–26   cabin x1–4 × z1–4: sea face a Window 1×4×3 on two 1×2 hinges raked 10° out, Trans-Black glass; east a Panel 1×2×3 with the stencil
//           "18" (Venice tower 18); west a Window 1×2×3; corners and back in Bright Light Blue bricks
//   26–29   ceiling 4×4, a White roof Plate 6×6 one stud out all round (z0–5), tiled
//   ramp    4 wide, 12 long, two 2×12 plates on two 1×2 hinges on a post at the deck's east edge (z1–4), turned down until its foot rests
//           on the sand; Fence Lattice 1×4×1 guards along both edges; treads alternate grille and plain tiles; the foot-wash bucket at its foot
if (want('la_tower')) {
  const a = new Asm('la_tower', [9.5, 0, 3.5]); const B = BLB, W = WHITE;
  // stilts with the brace pins
  const STILT = [[1, 2], [4, 2], [1, 5], [4, 5]];
  for (const [x, z] of STILT) { a.up('6541', B, x, 0, z, 1); a.up('3005', B, x, 3, z); a.up('3005', B, x, 6, z); a.up('3024', B, x, 9, z); a.up('6541', B, x, 10, z, 1); }
  const holeY = (top) => top * PLATE - 0.5;                                                                  // Technic brick: hole 10 LDU under the top face
  const PINX = [0, 1, 0, -1, 0, 0, 0, 0, 1].map((v, k) => [1, 0, 0, 0, 1, 0, 0, 0, 1][k]);                   // pin axis along x (its own axis)
  for (const x of [1, 4]) {                                                                                  // west face (x1, out −x) and east face (x4, out +x)
    const out = x === 1 ? -1 : 1, face = x === 1 ? 1 : 5;                                                    // the face plane
    const lo = holeY(3), hi = holeY(13);
    for (const z of [2.5, 5.5]) for (const y of [lo, hi]) a.put('2780', BLK, PINX, [face, y, z]);           // pins: half in the brick, half out
    const beam = (z0, layer) => { const z1 = z0 === 2.5 ? 5.5 : 2.5; const d = [0, (hi - lo) / 5, (z1 - z0) / 5];   // unit along the beam (0, 0.8, ±0.6)
      const ey = [out, 0, 0], ez = d, ex = [ey[1] * ez[2] - ey[2] * ez[1], ey[2] * ez[0] - ey[0] * ez[2], ey[0] * ez[1] - ey[1] * ez[0]];
      a.put('32063', B, [ex[0], ey[0], ez[0], ex[1], ey[1], ez[1], ex[2], ey[2], ez[2]], [face + out * (0.25 + 0.5 * layer), (lo + hi) / 2, (z0 + z1) / 2]); };
    beam(2.5, 0); beam(5.5, 1);                                                                              // the X: one beam against the face, the other outside it
  }
  a.up('3958', B, 0, 13, 1, 0);                                                                              // deck 6×6
  const posts = [[0, 1], [0, 6], [5, 5], [5, 6]], fenceCells = new Set();
  const fence = (x, z, r) => { a.up('30055', W, x, 14, z, r); for (let k = 0; k < 4; k++) fenceCells.add(r ? key(x, z + k) : key(x + k, z)); };
  fence(1, 6, 0); fence(0, 2, 1);                                                                            // south x1–4, west z2–5 (the ramp leaves the east edge at z1–4)
  for (const [x, z] of posts) { a.up('3062b', W, x, 14, z); a.up('3062b', W, x, 17, z); fenceCells.add(key(x, z)); }
  const ring = new Map();
  for (let x = 0; x < 6; x++) for (let z = 1; z < 7; z++) { const cab = x >= 1 && x <= 4 && z >= 1 && z <= 4; if (!cab && !fenceCells.has(key(x, z))) ring.set(key(x, z), B); }
  tileRuns(a, ring, 14);
  // cabin
  const front = [hinge(a, B, 1, 14, 4, 0), hinge(a, B, 3, 14, 4, 0)];
  const win = front.map((h) => h.top); const wf = a.up('60594', W, 1, 17, 4, 0); win.push(wf, a.put('86210', TBLK, wf.R, wf.t));
  turn(win, Rx(10), front[0].pivot);                                                                         // raked 10° out
  for (const x of [1, 4]) { a.up('3622', B, x, 14, 1, 1); for (const y of [17, 20, 23]) a.up('3005', B, x, y, 1); }   // side walls: base course, back corner columns
  a.up('3004', B, 2, 14, 1, 0); for (const y of [17, 20, 23]) a.up('3004', B, 2, y, 1, 0);                   // back wall
  const pn = a.up('2362b', B, 4, 17, 2, 3);                                                                  // east: numeral panel, wall face out
  const ww = a.up('60593', W, 1, 17, 2, 1); a.put('60602', TBLK, ww.R, ww.t);                                // west: window 1×2×3
  a.up('3031', B, 1, 26, 1, 0);                                                                              // ceiling 4×4
  a.up('3958', W, 0, 27, 0, 0); for (const x of [0, 2, 4]) for (const z of [0, 2, 4]) a.up('3068b', W, x, 28, z, 0);   // roof 6×6, tiled
  // ramp: a post at x6 (z1–4) to the deck's level, two hinges on it, the ramp built flat then turned down about the axle
  for (const z of [1, 3]) { for (const y of [0, 3, 6]) a.up('3004', B, 6, y, z, 1); a.up('3023', B, 6, 9, z, 1); a.up('3023', B, 6, 10, z, 1); }
  const rh = hinge(a, B, 6, 11, 1, 1); const rh2 = hinge(a, B, 6, 11, 3, 1);
  const ramp = [rh.top, rh2.top, a.up('2445', B, 6, 14, 1, 0), a.up('2445', B, 6, 14, 3, 0)];                // two 2×12 plates: the ramp is 4 wide
  for (let x = 6; x < 18; x++) ramp.push(a.up(x % 2 ? '3069b' : '2412b', x % 2 ? B : LBG, x, 15, 2, 1));    // treads across the middle two rows
  for (const z of [1, 4]) for (const x of [6, 10, 14]) ramp.push(a.up('3633', W, x, 15, z, 0));              // thin lattice guards along both edges
  // the foot: turn until the far bottom edge (x18, plate 14) rests on the sand studs' tops (0.2)
  const p0 = rh.pivot, far = [18 - p0[0], 14 * PLATE - p0[1]]; let al = 0;
  for (let i = 0; i < 120; i++) { const t = (al * Math.PI) / 180; const y = p0[1] - far[0] * Math.sin(t) + far[1] * Math.cos(t); al += (y - 0.2) * 6; }
  turn(ramp, Rz(-al), p0);
  const footX = p0[0] + far[0] * Math.cos((al * Math.PI) / 180) + far[1] * Math.sin((al * Math.PI) / 180);
  a.up('12884', W, 17, 0, 5);                                                                                // foot-wash bucket beside the foot
  console.log(`la_tower: ramp ${al.toFixed(2)}° down, foot at x ${footX.toFixed(2)}`);
  const out = a.write(); console.log('la_tower:', a.parts.length, 'parts', JSON.stringify(out.bom));
}

// ---- la_skater (r3, Eric: "no raised platform … the instant the board rolls up the transition and the wheels HOOK the coping edge"): a tail
// stall. The tail truck's wheels are caught behind the coping on the deck side, the board raked TILT° nose-up over the bowl, the skater on it
// side-on, leaning back with it, one arm forward and one back, looking down into the bowl. The joint is real and hidden: the bar between the
// tail wheels (Wheel Trolley 2496, its middle a 3.2 mm bar) sits in the clip tile la_bowl puts on the apron cell x13 z2, flush with the coping
// top, and turns in it — so the board can take any rake. The board (42511) carries its two trolleys in its own clips; the skater is a minifig of
// real parts (970c00, 973 with arms 3818/3819 posed as the rig's kf, hands 3820, head 3626c, helmet 46303) on the board's two studs.
// r2 stood the board on two locking hinges over 1 × 5 plates on raised plates — a visible launch ledge. Frame: the bowl's (x east, z south,
// y plates from the island base); the proxy is cells x11–15 × z2–7 from plate 11.
if (want('la_skater')) {
  const a = new Asm('la_skater', [13.5, 11 * PLATE, 5]); const TILT = 26;
  const RY1 = [0, 0, 1, 0, 1, 0, -1, 0, 0], RY3 = [0, 0, -1, 0, 1, 0, 1, 0, 0];
  const LD = (M) => M.map((v, k) => [1, -1, -1][Math.floor(k / 3)] * [1, -1, -1][k % 3] * v);          // an LDraw matrix in our frame
  const ldp = (p) => [p[0] / 20, -p[1] / 20, -p[2] / 20];
  const sub = (id, col, R, t, Ml, pl) => a.put(id, col, mulR(R, LD(Ml)), appR(R, ldp(pl)).map((v, i) => v + t[i]));   // a part given in a parent's LDraw-local frame
  const AXLE = [13.5, 11 * PLATE + 0.3, 2.5];                                                                // the clip's bore: 6 LDU over the clip tile's top (the coping top, plate 11), over cell x13 z2
  const moving = [];
  const BC = [AXLE[0], AXLE[1] + 0.715, AXLE[2] + 1.48];                                                    // the deck's top centre: the tail trolley's axle 0.715 under the deck, 1.48 behind its centre
  moving.push(a.put('42511', RED, RY3, BC));                                                               // deck length along z, the nose toward the bowl (+z)
  for (const s of [1, -1]) moving.push(sub('2496', BLK, RY3, BC, [0, 0, 1, 0, 1, 0, -1, 0, 0], [s * 29.6, 14.3, 0]));
  // the skater: feet on the deck's studs, facing +x (side-on, the nose to his right), head turned to look down the board into the bowl
  const F = BC, Rf = RY1;   // figure frame: feet bottom centre, rotation (the rig faces +z)
  const fig = (id, col, ldLines, y0) => { for (const [pl, Ml, part] of ldLines) moving.push(sub(part ?? id, col, Rf, [F[0], F[1] + y0, F[2]], Ml, pl)); };
  const I3 = [1, 0, 0, 0, 1, 0, 0, 0, 1];
  fig('970c00', 272, [[[0, 0, 0], I3]], 2.0);                                                                 // hips and legs: the LDraw origin 5 plates over the feet
  fig('973', WHITE, [[[0, 0, 0], I3]], 3.6);                                                                   // torso: origin (the neck) 9 plates over the feet, as minifig2
  fig(null, WHITE, [[[15.552, 9, 0], [0.9855, 0, -0.1699, -0.1699, 0, -0.9855, 0, 1, 0], '3819'], [[-15.552, 9, 0], [0.9855, -0.1201, -0.1201, 0.1699, 0.6968, 0.6968, 0, -0.7071, 0.7071], '3818']], 3.6);   // arms: figtorso_kf.ldr (left back, right forward)
  fig(null, 14, [[[22.1613, 17.9047, 18.8983], [0.9855, -0.1201, -0.1201, -0.1699, -0.6968, -0.6968, 0, 0.7071, -0.7071], '3820'], [[-21.5608, 14.422, -20.3622], [0.9855, -0.1699, 0, 0.1699, 0.9855, 0, 0, 0, 1], '3820']], 3.6);   // hands: fighands_kf.ldr
  const HEAD = mulR(RY3, I3);                                                                               // the head turned a quarter to his right: it faces +z, down the board
  moving.push(a.put('3626c', 14, mulR(Rf, HEAD), [F[0], F[1] + 4.8, F[2]]), a.put('46303', RED, mulR(Rf, HEAD), [F[0], F[1] + 4.8, F[2]]));
  turn(moving, Rx(-TILT), AXLE);                                                                            // the rake: nose up about the axle (local +z → +y)
  // the tail wheels (radius 0.5, centred on the axle) against the coping's deck-side top corner (z 3, plate 11) and over the apron (plate 10)
  const gap = Math.hypot(3 - AXLE[2], 11 * PLATE - AXLE[1]) - 0.5, over = AXLE[1] - 0.5 - 10 * PLATE;
  let deckLo = 1e9; { const d = moving[0], b = bbox('42511'); for (const x of [b[0], b[3]]) for (const y of [b[1], b[4]]) for (const z of [b[2], b[5]]) { const w = appR(d.R, [x, y, z]).map((v, i) => v + d.t[i]); if (w[2] < 4 && w[2] > 2) deckLo = Math.min(deckLo, w[1]); } }
  console.log(`la_skater: tilt ${TILT}°, tail wheels ${gap.toFixed(3)} studs from the coping's corner, ${over.toFixed(3)} over the apron`);
  const out = a.write(); console.log('la_skater:', a.parts.length, 'parts', JSON.stringify(out.bom));
}

// ---- la_roller (r3, Eric: "lift one foot slightly — a gliding pose"): the Ocean Front Walk roller-skater as a minifig of its real parts, so
// each leg turns on its own hip pin (minifig2's legs are one moulded piece, 970c00). Hips 3815, right leg 3816 plumb with its skate 11253
// clamped on a walk stud (the proxy's one cell), left leg 3817 swung back LEG_BACK° about the hip pin with its skate on its foot, clear of the
// ground — connected only through the hip; torso 973 with arms posed fk (left forward, right straight back: the stride's counter-swing),
// hands 3820, head 3626c turned a quarter to his left so he faces the camera while gliding west, afro 87995. Frame: origin at the standing
// skate's cell, bottom centre, on the walk (y 0 = the walk's top); the figure faces −x, his raised leg on the +z side.
if (want('la_roller')) {
  const a = new Asm('la_roller', [0, 0, 0]); const LEG_BACK = 60;
  const LD = (M) => M.map((v, k) => [1, -1, -1][Math.floor(k / 3)] * [1, -1, -1][k % 3] * v);           // an LDraw matrix in our frame
  const ldp = (p) => [p[0] / 20, -p[1] / 20, -p[2] / 20];
  const RY1 = [0, 0, 1, 0, 1, 0, -1, 0, 0], RY3 = [0, 0, -1, 0, 1, 0, 1, 0, 0], I3 = [1, 0, 0, 0, 1, 0, 0, 0, 1];
  const Rf = RY3;                                                                                           // the rig faces +z; he faces −x
  const O = [0, 6 * PLATE, 0.5];                                                                            // the hips' LDraw origin: 5 plates over the feet, which stand on the skates (1 plate); the right foot over the origin cell
  const sub = (id, col, Ml, pl) => a.put(id, col, mulR(Rf, LD(Ml)), appR(Rf, ldp(pl)).map((v, i) => v + O[i]));   // a part in the hips' LDraw frame
  const MED = 322, BLK0 = 0, YEL = 14;
  const t = (LEG_BACK * Math.PI) / 180, BACK = [1, 0, 0, 0, Math.cos(t), -Math.sin(t), 0, Math.sin(t), Math.cos(t)];   // LDraw Rx: the foot (+y) swings toward +z, his back
  const ap3 = (M, v) => [0, 1, 2].map((i) => M[i * 3] * v[0] + M[i * 3 + 1] * v[1] + M[i * 3 + 2] * v[2]);
  sub('3815', MED, I3, [0, 0, 0]);
  sub('3816', MED, I3, [0, 12, 0]);                                                                         // right leg, plumb (the hip pin is the legs' origin, 12 under the hips')
  sub('3817', MED, BACK, [0, 12, 0]);                                                                       // left leg, swung back on the same pin
  sub('11253', WHITE, I3, [-10, 40, 0]);                                                                    // the standing skate: its stud in the right foot's hole, its wheels round the walk's stud
  const raised = sub('11253', WHITE, BACK, ap3(BACK, [10, 28, 0]).map((v, i) => v + [0, 12, 0][i]));        // the lifted skate on the left foot
  sub('973', WHITE, I3, [0, -32, 0]);                                                                       // torso: the neck 4 plates over the hips
  for (const [pl, Ml, id] of [[[15.552, 9, 0], [0.9855, 0.1201, 0.1201, -0.1699, 0.6968, 0.6968, 0, -0.7071, 0.7071], '3819'], [[-15.552, 9, 0], [0.9855, 0, 0.1699, 0.1699, 0, -0.9855, 0, 1, 0], '3818']])
    sub(id, WHITE, Ml, [pl[0], pl[1] - 32, pl[2]]);                                                          // arms: figtorso_fk.ldr (left forward, right back)
  for (const [pl, Ml] of [[[21.5608, 14.422, -20.3622], [0.9855, 0.1699, 0, -0.1699, 0.9855, 0, 0, 0, 1]], [[-22.1613, 17.9047, 18.8983], [0.9855, 0.1201, 0.1201, 0.1699, -0.6968, -0.6968, 0, 0.7071, -0.7071]]])
    sub('3820', YEL, Ml, [pl[0], pl[1] - 32, pl[2]]);                                                        // hands: fighands_fk.ldr
  const HEAD = mulR(Rf, RY1);                                                                               // the head turned a quarter to his left: it faces +z, the camera
  const H = [O[0], O[1] + 2.8, O[2]]; a.put('3626c', YEL, HEAD, H); a.put('87995', BLK0, HEAD, H);
  // the lifted skate's lowest point above the walk (bbox corners through its transform)
  const b = bbox('11253'); let lo = 1e9; for (const x of [b[0], b[3]]) for (const y of [b[1], b[4]]) for (const z of [b[2], b[5]]) lo = Math.min(lo, appR(raised.R, [x, y, z])[1] + raised.t[1]);
  console.log(`la_roller: left leg back ${LEG_BACK}°, its skate ${(lo / PLATE).toFixed(2)} plates over the walk`);
  const out = a.write(); console.log('la_roller:', a.parts.length, 'parts', JSON.stringify(out.bom));
}

// ---- la_lamp v3 / la_lamp2 (Eric, r2: "do they look Californian?"): the Ocean Front Walk's own standards, read off real-boardwalk.jpg — a
// slim charcoal pole with a finial, a straight arm and a bell pendant (la_lamp, the arm over the walk), and the twin type with two bells
// on a cross-arm (la_lamp2, the arm along the walk). v2's fluted cast-iron post with saucers was a stock "old town" lamp, not Venice's.
//   0–2    Plate 2×2 round + a 2×2 jumper: the pole stands on the footprint's centre stud
//   2–5    Brick 1×1 round, the base collar
//   5.5–   Bar 6L with thick stop (63965a): its stub in the collar's hollow stud, the stop on the stud, 12 plates of bar above
//   18–22  Brick 1×1 round on the bar's top end and a round plate, the head collar; 22 the arm — Plate 1×3 (single) / Plate 1×5 (twin),
//          tiled so it reads as a pipe — and a cone finial over the pole
//   pendant under each arm end: a Cone 1×1 (its stud in the arm: the bell's crown), a Dish 2×2 dome up on the cone's foot (the bell),
//          a Trans-Clear Plate 1×1 round in the dish's underside (the lens), two studs out from the pole so the bell clears the collar
const lamp = (name, twin) => {
  const a = new Asm(name, [1, 0, 1]); const C = DBG;
  a.up('4032a', C, 0, 0, 0); a.up('87580', C, 0, 1, 0); a.up('3062b', C, 0.5, 2, 0.5);
  a.put('63965a', C, yaw0, [1, 5 * PLATE + 0.2, 1]);                                                        // origin = the stop's underside, on the collar's stud
  a.up('3062b', C, 0.5, 18, 0.5); a.up('6141', C, 0.5, 21, 0.5);                                            // the bar's top 0.2 into the head collar
  const ends = twin ? [[-1, 1], [3, 1]] : [[1, -1]];
  if (twin) { a.up('78329', C, -1.5, 22, 0.5, 0); a.up('3069b', C, -1.5, 23, 0.5, 0); a.up('3069b', C, 1.5, 23, 0.5, 0); }   // the arm, tiled: a smooth pipe
  else { a.up('3623', C, 0.5, 22, -1.5, 1); a.up('3069b', C, 0.5, 23, -1.5, 1); }
  a.up('4589', C, 0.5, 23, 0.5);                                                                             // finial over the pole
  for (const [x, z] of ends) { a.up('4589', C, x - 0.5, 19, z - 0.5); a.up('4740', C, x - 1, 18, z - 1); a.up('6141', TCLR, x - 0.5, 17, z - 0.5); }   // bell: cone crown, dish dome, lens
  const out = a.write(); console.log(`${name}:`, a.parts.length, 'parts, top 26', JSON.stringify(out.bom));
};
if (want('la_lamp')) lamp('la_lamp', false);
if (want('la_lamp2')) lamp('la_lamp2', true);

// ---- la_rack (Eric, r2: "make the dumbbells read as dumbbells"): a dumbbell rack in the Muscle Beach pen. Held upright in a fist a
// dumbbell shows as one ball; lying across a rack it shows both weights and the bar. A Plate 1×6 shelf on two 1×1 brick legs (6 plates,
// a minifig's waist), three Tile 1×1 with Clip on cells 0, 2, 4 (the clip's bore along z, 0.3 stud over the tile), and in each clip a
// dumbbell (29592) by the middle of its bar, lying across the shelf with a weight hanging past each edge; the cells between tiled.
if (want('la_rack')) {
  const a = new Asm('la_rack', [3, 0, 0.5]); const C = LBG;
  for (const x of [0, 5]) { a.up('3005', C, x, 0, 0); a.up('3005', C, x, 3, 0); }
  const sb = bbox('3666'); a.up('3666', C, 0, 6, 0, sb[3] - sb[0] > 2 ? 0 : 1);
  const ALONG_Z = [1, 0, 0, 0, 0, -1, 0, 1, 0];                                                              // local y (the bar) → z
  for (let x = 0; x < 6; x++) {
    if (x % 2) { a.up('3070b', C, x, 7, 0); continue; }
    a.up('15712', C, x, 7, 0); a.put('29592', BLK, ALONG_Z, [x + 0.5, 8 * PLATE + 0.3, 0.5]);
  }
  const out = a.write(); console.log('la_rack:', a.parts.length, 'parts', JSON.stringify(out.bom));
}

// ---- la_bench: a Venice bench — grey concrete ends, a green slatted seat and a backrest on brackets (lead review: add a backrest)
if (want('la_bench')) {
  const a = new Asm('la_bench', [2, 0, 1]); const G = 288;                                                   // Dark Green
  for (const x of [0, 3]) a.up('3004', LBG, x, 0, 0, 1);
  const br = [1, 3].map((cx) => a.put('99780', G, [-1, 0, 0, 0, 1, 0, 0, 0, -1], [cx, 4 * PLATE, 0.5]));      // brackets on the back row, upright plates at its back edge
  a.up('3710', G, 0, 3, 1, 0); a.up('2431', G, 0, 4, 1, 0);                                                  // seat
  const st = br.flatMap((r) => a.side(r)).filter((s) => s.d[2] !== 0).sort((p, q) => p.p[0] - q.p[0]);
  const tb = bbox('2431'); a.onStud('2431', G, st[0], [1, 0, 0], 'x', [tb[0] + 0.5, tb[1], (tb[2] + tb[5]) / 2]);   // backrest: a 1×4 tile on the four side studs
  console.log('la_bench side studs', JSON.stringify(st.map((s) => [s.p.map((v) => +v.toFixed(2)), s.d])));
  const out = a.write(); console.log('la_bench:', a.parts.length, 'parts', JSON.stringify(out.bom));
}
