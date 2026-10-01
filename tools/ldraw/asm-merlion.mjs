// Merlion v6 (2026-10-01) — the statue as one assembly of real parts, authored in our frame (tools/ldraw/asm-ours.mjs).
//   LDRAW_DIR="$PWD/vendor/ldraw-lib/ldraw" node tools/ldraw/asm-merlion.mjs && node tools/ldraw/bake.mjs merlion6.ldr --force
// Targets: docs/refs/merlion-moc/real-merlion-side-profile-night-wikimedia.jpg (profile), docs/refs/singapore-merlion-lego.png (gpt-image-2),
// MOC-155340 (strands, flower scales), Eric's brick model. What makes it read, in order: the forward-leaning C (muzzle furthest forward, chin
// back, chest out); the mane as vertical ridges in stepped tiers whose hem slants from mid-body at the back up to the jaw at the face; the
// open mouth with the jet; fish scales; the round hole of the tail curl on the flank.
// Frame: faces +x. Box x 0..7, z 0..5, 39 plates. Body core x 1..6 × z 1..4.
//   y 0–15   body: five courses; outer cells are side-stud bricks carrying quarter-round tile pairs = fish scales (down-pointing arcs) on both
//            flanks and the front; course 1 has three technic bricks with holes in line at x 4..6 = the tail curl's hole, seen through
//   y 15     3×3 plates bind the body and push the chest out to x 7
//   mane     6×1 curved slopes standing on end, thick end down on a side stud, its two studs capped with a 1×2 tile = the flat-cut hem;
//            the hem slants like the real one: back from y 12.5, flanks from y 19.5, the strand next to the face from y 22.5; a second back
//            tier of 3×1 curved slopes from y 29.5 to the crest — the gap between tiers is the step of the real mane
//   y 25–28  lower jaw plate to x 7; mouth two plates open from x 5, a two-plate trans-light-blue nozzle at the front; upper jaw to x 7
//   y 29–32  head with black round-tile eyes at x 5; y 32 brow; forehead curved slopes falling forward to x 7; crest high at the back; ears
import { Asm, bbox } from './asm-ours.mjs';
const W = 15, TLB = 43, EYE = 15;                                            // white eyes: the statue has no painted pupils (Eric, 2026-10-01)
const a = new Asm('merlion6', [3.5, 0, 2.5]);                                  // box x 0..7, z 0..5: the LDraw origin at its bottom centre
const X = [1, 0, 0], Y = [0, 1, 0], Z = [0, 0, 1], neg = (v) => v.map((x) => -x);

const rect = (x0, x1, z0, z1) => { const out = []; for (let x = x0; x < x1; x++) for (let z = z0; z < z1; z++) out.push([x, z]); return out; };
const minus = (A, B) => { const s = new Set(B.map(([x, z]) => x + ',' + z)); return A.filter(([x, z]) => !s.has(x + ',' + z)); };
/** fill cells of one brick course (or plate layer) at plate y with 1×N parts along x */
function fill(y, cells, ids = { 1: '3005', 2: '3004', 3: '3622', 4: '3010' }) {
  const set = new Set(cells.map(([x, z]) => x + ',' + z));
  for (const z of [...new Set(cells.map((c) => c[1]))]) {
    const xs = cells.filter((c) => c[1] === z).map((c) => c[0]); let x = Math.min(...xs); const xmax = Math.max(...xs);
    while (x <= xmax) { if (!set.has(x + ',' + z)) { x++; continue; } let L = 0; while (set.has(x + L + ',' + z) && L < 4) L++; a.up(ids[L] ?? ids[1], W, x, y, z); x += L; }
  }
}
const PLATES = { 1: '3024', 2: '3023', 3: '3623', 4: '3710' };
/** a side-stud brick at cell (x, z) whose studs face exactly the listed world directions; returns its side studs */
function snot(x, y, z, dirs) {
  const key = dirs.map((d) => d.join()).sort().join('|');
  const id = dirs.length === 1 ? '87087' : Math.abs(dirs[0][0] * dirs[1][0] + dirs[0][2] * dirs[1][2]) > 0.5 ? '47905' : '26604';
  for (let r = 0; r < 4; r++) { const rec = a.up(id, W, x, y, z, r); const st = a.side(rec); if (st.map((s) => s.d.join()).sort().join('|') === key) return st; a.parts.pop(); }
  throw new Error(`no ${id} faces ${key}`);
}
const facing = (st, d) => st.filter((s) => s.d.join() === d.join());
/** a quarter-round tile on stud s with its round corner toward world directions h + v (both in the wall plane) */
function quarter(s, h, v) {
  for (const ex of [X, Y, Z, neg(X), neg(Y), neg(Z)]) {
    if (Math.abs(ex[0] * s.d[0] + ex[1] * s.d[1] + ex[2] * s.d[2]) > 0.5) continue;
    const rec = a.onStud('25269', W, s, ex, 'x'); const corner = [0, 1, 2].map((i) => rec.R[i * 3] + rec.R[i * 3 + 2]);   // local (+x, +z)
    if (corner.every((c, i) => Math.abs(c - (h[i] + v[i])) < 1e-6)) return rec; a.parts.pop();
  }
  throw new Error('quarter tile: no orientation');
}
/** fish scales on one face: pairs of quarter tiles, round corners down; alternate courses start with a half scale */
function scales(studs, along, course) {
  const k = (s) => s.p[0] * along[0] + s.p[2] * along[2]; const st = [...studs].sort((p, q) => k(p) - k(q));
  let i = 0; if (course % 2 && st.length) { quarter(st[0], along, neg(Y)); i = 1; }
  for (; i < st.length; i += 2) { quarter(st[i], neg(along), neg(Y)); if (st[i + 1]) quarter(st[i + 1], along, neg(Y)); }
}
/** a mane strand: curved slope on end, thick end down with its first cell on the stud, thin end up */
function strand(id, s) { const b = bbox(id); return a.onStud(id, W, s, Y, 'z', [0, b[1], b[2] + 0.5]); }

const mane = { back: [], left: [], right: [], backHi: [], leftHi: [], rightHi: [], leftFront: [], rightFront: [] };
// ---- body: five courses ------------------------------------------------------------------------------------------------------------
for (let c = 0; c < 5; c++) {
  const y = 3 * c; const taken = []; const L = [], Rr = [], F = [];
  for (let x = 1; x < 6; x++) for (const [z, side] of [[1, neg(Z)], [3, Z]]) {
    if (c === 1 && x >= 4) continue;                                        // the tail-curl hole
    const dirs = [side]; if (x === 5 && c !== 1) dirs.push(X); if (x === 1 && c === 4) dirs.push(neg(X));
    const st = snot(x, y, z, dirs); (z === 1 ? L : Rr).push(...facing(st, side)); F.push(...facing(st, X)); mane.back.push(...facing(st, neg(X))); taken.push([x, z]);
  }
  if (c !== 1) { F.push(...facing(snot(5, y, 2, [X]), X)); taken.push([5, 2]); }
  if (c === 4) { mane.back.push(...facing(snot(1, y, 2, [neg(X)]), neg(X))); taken.push([1, 2]); }
  if (c === 1) for (const z of [1, 2, 3]) { a.up('3700', W, 4, y, z); taken.push([4, z], [5, z]); }
  fill(y, minus(rect(1, 6, 1, 4), taken));
  scales(L, X, c); scales(Rr, X, c); scales(F, Z, c);
}
// ---- the tail: off the back of the body at the foot, rising and curling up and outward (the real tail fin curls up behind the statue) ----
a.up('3005', W, 0, 0, 2); a.up('3005', W, 0, 3, 2);                        // tail root against the back, two courses
a.up('54200', W, 0, 0, 1, 2); a.up('54200', W, 0, 0, 3, 0);                // the tail flaring at the root: cheese slopes falling to the sides…
a.up('3023', W, -1, 6, 2, 1); a.up('3005', W, -1, 7, 2);                     // …the tail leaves the body on a plate cantilevered one stud out and rises…
a.up('54200', W, -1, 10, 2, 3);                                              // …and the fin tip curls back toward the body (cheese, high end outward)
a.up('11212', W, 1, 15, 1); a.up('11212', W, 4, 15, 1);                     // binding plates, chest out to x 7
// ---- mane hem / chest y 16, neck y 19, y 22 ------------------------------------------------------------------------------------------
fill(16, rect(1, 7, 1, 4));
{ const taken = []; for (const x of [1, 2]) { mane.left.push(...snot(x, 19, 1, [neg(Z)])); mane.right.push(...snot(x, 19, 3, [Z])); taken.push([x, 1], [x, 3]); } fill(19, minus(rect(1, 6, 1, 4), taken));
  for (const z of [1, 2, 3]) a.up('54200', W, 6, 19, z, 1); }                 // chest top chamfers back into the neck (cheese, high end at the back)
{ const taken = [[3, 1], [3, 3]]; mane.leftFront.push(...snot(3, 22, 1, [neg(Z)])); mane.rightFront.push(...snot(3, 22, 3, [Z])); fill(22, minus(rect(1, 6, 1, 4), taken)); }
// ---- jaw, mouth, upper jaw ------------------------------------------------------------------------------------------------------------
for (const z of [1, 3]) { a.up('3710', W, 1, 25, z); a.up('3024', W, 5, 25, z); }   // lower jaw to x 6 (the chin recedes under the muzzle)…
a.up('3666', W, 1, 25, 2);                                                   // …the lower lip in the middle to x 7, under the nozzle
for (const y of [26, 27]) { fill(y, rect(1, 5, 1, 4), PLATES); a.up('3024', W, 5, y, 2); a.up('6141', TLB, 6, y, 2); }   // mouth open from x 5; the nozzle
for (const z of [1, 2, 3]) a.up('3666', W, 1, 28, z);                        // upper jaw to x 7
// ---- head course y 29: eyes, upper mane studs; brow ---------------------------------------------------------------------------------
{ const taken = [];
  for (const s of [...snot(5, 29, 1, [neg(Z)]), ...snot(5, 29, 3, [Z])]) a.onStud('98138', EYE, s, X, 'x'); taken.push([5, 1], [5, 3]);
  for (const z of [1, 2, 3]) mane.backHi.push(...snot(1, 29, z, [neg(X)])); taken.push([1, 1], [1, 2], [1, 3]);
  fill(29, minus(rect(1, 7, 1, 4), taken)); }
for (const z of [1, 2, 3]) a.up('3666', W, 1, 32, z);                        // brow
// ---- skull, forehead, crest, ears -----------------------------------------------------------------------------------------------------
const HIGH_BACK = 1;                                                         // curved slopes / cheese: high end at local −z; r 1 puts it at −x
fill(33, rect(1, 5, 1, 4));
a.up('11477', W, 5, 33, 2, HIGH_BACK);                                       // nose bridge: high at x 5, falling forward to the brow at x 7
for (const [z, r] of [[1, 2], [3, 0]]) { a.up('54200', W, 5, 33, z, HIGH_BACK); a.up('54200', W, 6, 33, z, r); }   // the snout rounds off: cheese slopes falling to the sides
for (const z of [1, 2, 3]) { a.up('11477', W, 1, 36, z, HIGH_BACK); a.up('3023', W, 3, 36, z); }   // crest high at the back; crown plates
a.up('54200', W, 4, 37, 1, HIGH_BACK); a.up('54200', W, 4, 37, 3, HIGH_BACK); for (const [x, z] of [[3, 1], [3, 2], [3, 3], [4, 2]]) a.up('3070b', W, x, 37, z);   // ears, crown tiles
// ---- the mane --------------------------------------------------------------------------------------------------------------------------
// 6×1 curved slopes have two studs on the thick end: a 1×2 tile on them is the flat-cut hem. (4×1 curved 61678 is a bow — its underside
// arches up, so a side stud under it shows; the upper back tier is 3×1, flat underneath.)
const hemmed = (s) => { const r = strand('42022', s); const cap = a.side(r).filter((t) => t.d.join() === s.d.join()); if (cap.length === 2) a.onStud('3069b', W, { p: cap[0].p.map((v, i) => (v + cap[1].p[i]) / 2), d: s.d }, Y, 'x'); };
for (const s of [...mane.back, ...mane.left, ...mane.right, ...mane.leftFront, ...mane.rightFront]) hemmed(s);
for (const s of mane.backHi) strand('50950', s);
const bare = a.exposed(); if (bare.length) console.warn(`${bare.length} exposed side studs:`, JSON.stringify(bare.slice(0, 12)));
const out = a.write(); console.log('merlion:', out.file, a.parts.length, 'parts', JSON.stringify(out.bom));
