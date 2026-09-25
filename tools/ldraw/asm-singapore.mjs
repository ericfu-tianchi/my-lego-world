// Singapore studs-out assemblies, v5 (2026-09-25, after Eric's nine-point review): Merlion (body + head + mane + tail), the Marina Bay Sands
// tower with a real hinge lean, and the Supertree canopy (flipped cone + flipped webbed dish on a bar).
//   LDRAW_DIR="$PWD/vendor/ldraw-lib/ldraw" node tools/ldraw/asm-singapore.mjs   → vendor/ldraw/asm/*.ldr, then bake them.
// Frames: LDraw (y DOWN, 20 LDU / stud, 8 LDU / plate). Part names read "A x B" = z-extent A, x-extent B.
import { Model, turnFor, hangSpin, RY, connectors } from './asm-lib.mjs';
const W = 15, TLB = 43, TDB = 33, MAG = 26, DP = 85;
const SPIN = +(process.env.SPIN_ADD ?? 0);                                  // render check: add quarter turns to every hung slope

// ================================================================ MERLION ================================================================
// Footprint x −1..4 (6 studs: head −1..1, body 0..2, mane 2..3, tail 3..4), z 0..2 (mane hood −1..3). Faces −x (the bay). 25 plates.
const m = new Model('merlion', [-40, 0, -30]);   // footprint x −1..4, z 0..2
const SIDE = { '-x': [-1, 0], '+x': [1, 0], '-z': [0, -1], '+z': [0, 1] };
/** one brick with side studs facing the listed directions; 3005 when none */
function studBrick(x, z, py, dirs, color = W) {
  if (!dirs.length) return m.up('3005', color, x, z, py, 3, 1, 1);
  const want = dirs.map((d) => SIDE[d]);
  const part = dirs.length === 1 ? '87087' : dirs.length === 2 && (want[0][0] * want[1][0] + want[0][1] * want[1][1]) === 0 ? '26604' : dirs.length === 2 ? '47905' : '4733';
  return m.up(part, color, x, z, py, 3, 1, 1, turnFor(part, want));
}
/** a 3×3 ring row at x0..x0+2, z 0..2; `faces` lists which outward faces carry studs; returns the world-frame side studs with their cell */
function ring(py, x0, faces, skip = () => false) {
  const studs = [];
  for (let dx = 0; dx < 3; dx++) for (let z = 0; z < 3; z++) {
    const x = x0 + dx; const dirs = [];
    if (dx === 0 && faces.includes('-x')) dirs.push('-x'); if (dx === 2 && faces.includes('+x')) dirs.push('+x');
    if (z === 0 && faces.includes('-z')) dirs.push('-z'); if (z === 2 && faces.includes('+z')) dirs.push('+z');
    const rec = studBrick(x, z, py, skip(x, z) ? [] : dirs);
    if (dirs.length && !skip(x, z)) for (const s of m.sideStuds(rec)) studs.push({ ...s, x, z });
  }
  return studs;
}
const fwd = (s) => s.dir[0] === -1, back = (s) => s.dir[0] === 1, side = (s) => s.dir[2] !== 0;
// body rows 0–3 (x 0..2): fish scales = flower plates and round plates alternating by row on the front and sides; the back carries scales on
// rows 0–1 and hung mane locks (curved slopes, thick end up) on rows 2–3 — the mane's hem reaching down to mid-body
for (const r of [0, 1, 2, 3]) for (const s of ring(3 * r, 0, ['-x', '+x', '-z', '+z'])) { if (back(s) && r >= 2) m.attach('11477', W, s, (hangSpin(s.dir) + SPIN) & 3); else m.attach(r % 2 ? '6141' : '24866', W, s); }
// neck: two staggered plate layers spanning x −1..3 × z −1..3 — they carry the head one stud forward and the mane hood one stud back and a stud wider each side
for (const [z0, z1] of [[-1, 0], [1, 2]]) { m.up('3020', W, -1, z0, 12, 1, 4, 2); m.up('3023', W, 3, z0, 12, 1, 1, 2); } m.up('3710', W, -1, 3, 12, 1, 4, 1); m.up('3024', W, 3, 3, 12, 1, 1, 1);
m.up('3710', W, -1, -1, 13, 1, 4, 1); m.up('3024', W, 3, -1, 13, 1, 1, 1); for (const z0 of [0, 2]) { m.up('3020', W, -1, z0, 13, 1, 4, 2); m.up('3023', W, 3, z0, 13, 1, 1, 2); }
// head rows at x −1..1. Row A (jaw, 14–17): three headlight recesses across the front = the open mouth in shadow, the clear-blue spout in the middle one
for (const z of [0, 1, 2]) m.up('4070', W, -1, z, 14, 3, 1, 1, turnFor('4070', [[-1, 0]]));
for (let x = 0; x <= 1; x++) for (const z of [0, 1, 2]) m.up('3005', W, x, z, 14, 3, 1, 1);
{ const hl = connectors('4070').find((c) => c.kind === 'stud' && c.dir[1] > -0.5); const M = RY(turnFor('4070', [[-1, 0]]));
  const at = [20 * (-1) + 10 + (M[0] * hl.at[0] + M[1] * hl.at[1] + M[2] * hl.at[2]), -8 * 17 + hl.at[1], 20 * 1 + 10 + (M[6] * hl.at[0] + M[7] * hl.at[1] + M[8] * hl.at[2])];
  m.attach('54200', TLB, { at, dir: [-1, 0, 0] }, (hangSpin([-1, 0, 0]) + SPIN) & 3); }
// Row B (muzzle, 17–20): plates across the front so the muzzle stands proud over the mouth; mane locks on the sides of x 0..1
for (const s of ring(17, -1, ['-x', '-z', '+z'], (x, z) => x === -1 && z !== 1 ? false : x === -1)) { if (fwd(s)) m.attach('3024', W, s); else if (s.x >= 0) m.attach('11477', W, s, (hangSpin(s.dir) + SPIN) & 3); }
m.up('87087', W, -1, 1, 17, 3, 1, 1, turnFor('87087', [[-1, 0]])); { const c = m.placed[m.placed.length - 1]; for (const st of m.sideStuds(c)) m.attach('3024', W, st); }
// Row C (eyes, 20–23): the eye cells are left open — two deep sockets under the brow, floored with a plate; the nose bridge between; locks on the sides
for (const z of [0, 2]) m.up('3024', W, -1, z, 20, 1, 1, 1); m.up('3005', W, -1, 1, 20, 3, 1, 1);
for (let x = 0; x <= 1; x++) for (const z of [0, 1, 2]) { const dirs = z === 0 ? ['-z'] : z === 2 ? ['+z'] : []; const rec = studBrick(x, z, 20, dirs); for (const st of m.sideStuds(rec)) m.attach('11477', W, st, (hangSpin(st.dir) + SPIN) & 3); }
// Row D (top, 23–26): brow = a 1×3 plate cantilevered over the sockets carrying three cheese slopes, vertical face to the bay; crown = a 2×3 plate with
// curved slopes rising to the mane; the mane's first step (x 2) curved-top bricks level with the crown, second step (x 3) a 45° slope sweeping back
m.up('3623', W, -1, 0, 23, 1, 1, 3); for (let z = 0; z < 3; z++) m.up('54200', W, -1, z, 24, 0, 1, 1, 3);
m.up('3021', W, 0, 0, 23, 1, 3, 2, 1); for (let z = 0; z < 3; z++) m.up('11477', W, 0, z, 24, 0, 1, 2, 1);
for (const z of [0, 1, 2]) { for (let py = 14; py < 23; py += 3) m.up('3005', W, 2, z, py, 3, 1, 1); m.up('3024', W, 2, z, 23, 1, 1, 1); m.up('49307', W, 2, z, 24, 0, 1, 1, 3); }
for (const z of [0, 1, 2]) { for (let py = 14; py < 20; py += 3) m.up('3005', W, 3, z, py, 3, 1, 1); m.up('3024', W, 3, z, 20, 1, 1, 1); m.up('3040b', W, 3, z, 21, 3, 1, 2, 3); }
for (const z of [-1, 3]) { m.up('3005', W, 3, z, 14, 3, 1, 1); m.up('3024', W, 3, z, 17, 1, 1, 1); m.up('11477', W, 3, z, 18, 0, 1, 2, 3); m.up('3005', W, 2, z, 14, 3, 1, 1); m.up('3024', W, 2, z, 17, 1, 1, 1); m.up('11477', W, 2, z, 18, 0, 1, 2, 3); }   // the hood's outer wings, lower, curving down and back: the ruff round the face
for (let x = -1; x <= 1; x++) for (const z of [-1, 3]) m.up('3070b', W, x, z, 14, 1, 1, 1);                      // tiles close the neck plate's wings beside the head
// tail: a 65° slope beside the body's back corner (z 3), vertical face at the back, sweeping up from the waves to one side like the real tail; cheese tip
m.raw('60481a', W, [20 * 4 + 10, -48, 20 * 3 + 10], RY(1)); m.up('54200', W, 4, 3, 6, 0, 1, 1, 1);
const mf = m.write({ body: [W], jet: [TLB] }); console.log('merlion:', mf.join(' '), 'BOM', JSON.stringify(m.bom()));

// ============================================================ MARINA BAY SANDS TOWER ============================================================
// 21057 technique (rows of 1×2 side-stud bricks carrying trans-dark-blue 1×2 plates on both broad faces) with the real "deck of cards" lean:
// the back slab (2 deep) stands straight on the ground; the bay slab (2 deep) stands on three 1×2 hinge bricks one stud further out and
// leans in about 3° until its inner face meets the back slab under the SkyPark. Footprint 6 × 5 at the base, 6 × 4 at the top, 49 plates.
const t = new Model('mbstower', [-60, 0, -50]); const ROWS = 16;
for (let r = 0; r < ROWS; r++) for (let x = 0; x < 6; x += 2) {
  const b = t.up('11211', W, x, 0, 3 * r, 3, 2, 1, turnFor('11211', [[0, -1], [0, -1]])); t.up('3004', W, x, 1, 3 * r, 3, 2, 1);
  const ss = t.sideStuds(b); t.attach('3023', TDB, { at: [(ss[0].at[0] + ss[1].at[0]) / 2, (ss[0].at[1] + ss[1].at[1]) / 2, (ss[0].at[2] + ss[1].at[2]) / 2], dir: ss[0].dir });
}
for (let x = 0; x < 6; x += 2) { t.up('3023', W, x, 0, 48, 1, 2, 1); t.up('3023', W, x, 1, 48, 1, 2, 1); }   // a plate layer closes the back slab at 49 plates
// hinges: bases on the ground at z cell 4, tops rotated about the hinge axle (y = 10 LDU below the base's top face, z = the cell centre)
const PIVOT = [0, -24 + 10, 90]; const H_TOP = 384 - 16;                                                    // slab height above the pivot
let th = 0; for (let i = 0; i < 40; i++) th = Math.asin((50 - 30 * Math.cos(th)) / H_TOP);                    // inner face lands on the back slab: 90 − 30cosθ − H sinθ = 40
const c = Math.cos(th), s = Math.sin(th); const R = [1, 0, 0, 0, c, -s, 0, s, c];
const lean = (pos) => [pos[0], PIVOT[1] + c * (pos[1] - PIVOT[1]) - s * (pos[2] - PIVOT[2]), PIVOT[2] + s * (pos[1] - PIVOT[1]) + c * (pos[2] - PIVOT[2])];
const mul = (A, B) => { const O = new Array(9).fill(0); for (let r = 0; r < 3; r++) for (let cc = 0; cc < 3; cc++) O[r * 3 + cc] = A[r * 3] * B[cc] + A[r * 3 + 1] * B[3 + cc] + A[r * 3 + 2] * B[6 + cc]; return O; };
const tilted = (part, color, pos, M) => t.raw(part, color, lean(pos), mul(R, M));
for (let x = 0; x < 6; x += 2) { t.up('3937', W, x, 4, 0, 3, 2, 1); tilted('3938', W, [20 * x + 20, -24, 90], RY(0)); }
for (let i = 0; i < 15; i++) for (let x = 0; x < 6; x += 2) {
  const oy = -52 - 24 * i;
  const kFront = turnFor('11211', [[0, 1], [0, 1]]);
  const b = tilted('11211', W, [20 * x + 20, oy, 90], RY(kFront)); tilted('3004', W, [20 * x + 20, oy, 70], RY(0));
  const ss = t.sideStuds(b); t.attach('3023', TDB, { at: [(ss[0].at[0] + ss[1].at[0]) / 2, (ss[0].at[1] + ss[1].at[1]) / 2, (ss[0].at[2] + ss[1].at[2]) / 2], dir: ss[0].dir });
}
console.log(`tower lean ${(th * 180 / Math.PI).toFixed(2)}°, top inner face z = ${(PIVOT[2] + s * (-388 + 14) - 30 * c).toFixed(1)} LDU`);
const tf = t.write({ core: [W], glass: [TDB] }); console.log('tower:', tf.join(' '), 'BOM', JSON.stringify(t.bom()));

// ============================================================== SUPERTREE CANOPY ==============================================================
// On the trunk's open-stud plate: a 3L bar; a 2×2×2 cone upside down on the bar (its hollow stud over the bar, wide end up = the flare); the
// 6×6 webbed dish upside down with its four studs pushed into the cone's underside — a see-through purple lattice funnel, three trunk-widths across.
const cp = new Model('streecanopy', [-60, 0, -60]);
cp.raw('87994', DP, [60, -56, 60], [1, 0, 0, 0, 1, 0, 0, 0, 1]);                                            // bar: +4 (in the open stud below) … −56
cp.raw('3942c', DP, [60, -8, 60], [1, 0, 0, 0, -1, 0, 0, 0, -1]);                                           // cone flipped: tip at −8, wide end at −56
cp.raw('4285b', MAG, [60, -56, 60], [1, 0, 0, 0, -1, 0, 0, 0, -1]);                                         // webbed dish flipped: studs into the cone, rim at −72
const cf = cp.write({ cone: [DP], bowl: [MAG] }); console.log('canopy:', cf.join(' '), 'BOM', JSON.stringify(cp.bom()));
