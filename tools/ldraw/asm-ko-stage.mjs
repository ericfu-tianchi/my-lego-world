// Seoul · the BTS ARIRANG comeback stage (Gwanghwamun Square, 2026-03-21): the LED picture frame and the speaker towers as assemblies of
// real parts in our frame (asm-ours.mjs). Scheme: docs/refs/seoul-kpop/SCHEME.md (option B), build notes docs/refs/seoul-kpop/BUILD.md.
//   LDRAW_DIR=<main repo>/vendor/ldraw-lib/ldraw node tools/ldraw/asm-ko-stage.mjs && node tools/ldraw/bake.mjs ko_frame.ldr ko_tower.ldr --hull --force
// r4 (lead, 2026-10-06: the r3 frame read as a chunky doorway round a crowd): the real proportions of real-frame-gate-through.jpg — face 18 × 15
// pixels (border 3 = 1/6 of the width, opening 12 studs × 30 plates = 2.4 minifigs, h/w 0.83 as the real 15 × 18 m), core top G + 41.
// Frame grid (studs; x west → east, z north → south, y plates above the ground G): legs x 0–3 and 15–18, z 0–4; the opening x 3–15; the beam
// over plates 33–41; the face proud on z 4–4.8; a sill + tunnel floor (plates 0–3). Origin = the proxy's footprint bottom centre (x 9, z 2.5).
// Face anchoring (one family only): bricks with a side stud. A side stud on a brick whose bottom is at plate p sits at 8p + 14 LDU; pixel row k
// (1 stud square, row 0 on the deck top G + 3) has its centre at 34 + 20k LDU, so side-stud bricks at p = 5 / 15 / 25 / 35 hold rows 1 / 5 / 9 / 13.
// The scheme's brackets (99780) were dropped: their studs stand 4 LDU proud of a side-stud brick's face, so the two families do not share a plane.
import { Asm, bbox } from './asm-ours.mjs';
const BLACK = 0, LBG = 71, DBG = 72, DRED = 320, DPURPLE = 85, MLAV = 30, DTURQ = 3, DAZURE = 321, TCLEAR = 47;
// the four LED tones in band order R, L, D, G (SCHEME §2.3) — swatch 2026-10-06 (build/swatch-compare.png): Bright Red shouted, Coral read pink;
// two-tone Dark Red / greys is the muted real tone
const TONES = [DRED, LBG, DRED, DBG];
const BACK = DBG;   // the north face: brick courses' back row Dark Bluish Gray between black plate lines — a panel grid, not a black slab (lead r4)

// ---- the mosaic map: 18 × 15 pixels, row 0 at the bottom; legs 3 px, opening 12 px × 12 rows; band k = ⌊(u + rows from the top) / 2⌋
const COLS = 18, ROWS = 15, LEG = 3, OPEN_ROWS = 12, W = 18;
const opening = (c, r) => r < OPEN_ROWS && c >= LEG && c < COLS - LEG;
const tone = (c, r) => { const u = c < COLS / 2 ? COLS / 2 - 1 - c : c - COLS / 2; return TONES[Math.floor((u + (ROWS - 1 - r)) / 2) % 4]; };

const a = new Asm('ko_frame', [W / 2, 0, 2.5]);
const up = (id, c, x, y, z, r = 0) => a.up(id, c, x, y, z, r);
// ---- floor: a 1-deep sill under the face (x 0–18, z 4–5) and the tunnel floor between the legs (x 3–15, z 0–4), plates 0–3, tiled on top
for (const y of [0, 1]) { up('2445', BLACK, 3, y, 0); up('2445', BLACK, 3, y, 2); }
up('60479', BLACK, 0, 0, 4); up('3666', BLACK, 12, 0, 4); up('3666', BLACK, 0, 1, 4); up('60479', BLACK, 6, 1, 4);   // the sill's joint moves from x 12 to x 6
for (let x = 3; x < 15; x += 2) up('87079', BLACK, x, 2, 0, 1);
for (const x of [0, 4, 8, 12]) up('2431', BLACK, x, 2, 4); up('3069b', BLACK, 16, 2, 4);

// ---- legs: 3 × 4 cores. Brick courses at p 0 / 10 / 20 / 30, side-stud courses at p 5 / 15 / 25 (front: three studs south; the two front
// corners also a stud outward / inward for the bead edge; inner face: two studs into the opening), plate pairs between. Every brick course's
// back row (z 0) is its own Dark Bluish Gray 1 × 3.
const ss = { front: [], inner: [], outer: [], edge: [] };
const facingX = (d) => (d > 0 ? 1 : 3);   // 87087 turned so its side stud points +x (r 1) or −x (r 3)
function leg(x0, inward) {
  const xi = inward > 0 ? x0 + 2 : x0, oc = inward > 0 ? x0 : x0 + 2, om = x0 + 1;   // inner column, outer column, middle column
  const xo = inward > 0 ? x0 : x0 + 1;                                                // the 2-wide outer pair
  const course = (y) => { up('3622', BACK, x0, y, 0); up('3002', BLACK, x0, y, 1); up('3622', BLACK, x0, y, 3); };   // back row, 2 × 3, front row (all along x)
  const plateA = (y) => { up('3020', BLACK, xo, y, 0, 1); up('3710', BLACK, xi, y, 0, 1); };                        // along z: crosses the rows
  const sideCourse = (y) => {
    up('3622', BACK, x0, y, 0); up('3003', BLACK, xo, y, 1);
    for (const z of [1, 2]) ss.inner.push(...a.side(up('87087', BLACK, xi, y, z, facingX(inward))));
    for (const [x, d, list] of [[oc, -inward, ss.outer], [xi, inward, ss.edge]]) {   // front corners: studs south + outward / inward
      const rec = up('26604', BLACK, x, y, 3, d > 0 ? 0 : 3); for (const q of a.side(rec)) (q.d[2] === 1 ? ss.front : list).push(q);
    }
    ss.front.push(...a.side(up('87087', BLACK, om, y, 3, 0)));
  };
  course(0); plateA(3); plateA(4); sideCourse(5); plateA(8); plateA(9); course(10); plateA(13); plateA(14); sideCourse(15); plateA(18); plateA(19);
  course(20); plateA(23); plateA(24); sideCourse(25); plateA(28); plateA(29); course(30);
}
leg(0, +1); leg(15, -1);

// ---- beam over the opening (x 0–18, z 0–4), plates 33–41: two plate layers with staggered joints, a brick course whose front row carries
// side studs (row 13; its two corner bricks a stud outward too), two more plate layers, a flat tile top (the thin black rim; no studded cap)
const beamPlates = (y, flip) => { for (const z of [0, 2]) { const f = (z === 0) !== flip; up(f ? '2445' : '3795', BLACK, 0, y, z); up(f ? '3795' : '2445', BLACK, f ? 12 : 6, y, z); } };
beamPlates(33, false); beamPlates(34, true);
const band = [];
{ for (const [x, r] of [[0, 3], [17, 0]]) { const rec = up('26604', BLACK, x, 35, 3, r); for (const q of a.side(rec)) (q.d[2] === 1 ? band : ss.outer).push(q); } }
for (const x of [1, 5, 9, 13]) band.push(...a.side(up('30414', BLACK, x, 35, 3, 0)).filter((q) => q.d[2] === 1));
up('3008', BACK, 0, 35, 0); up('3008', BACK, 8, 35, 0); up('3004', BACK, 16, 35, 0);
up('3004', BLACK, 0, 35, 1); up('3008', BLACK, 2, 35, 1); up('3008', BLACK, 10, 35, 1);
up('3008', BLACK, 0, 35, 2); up('3008', BLACK, 8, 35, 2); up('3004', BLACK, 16, 35, 2);
beamPlates(38, false); beamPlates(39, true);
for (let x = 0; x < 16; x += 4) for (const z of [0, 2]) up('87079', BLACK, x, 40, z); for (const z of [0, 2]) up('3068b', BLACK, 16, 40, z);

// ---- the face: studs-out plates on the side studs, a tile per pixel. Column c's centre is x 0.5 + c; row k's centre 1.7 + k studs above G.
const UP = [0, 1, 0];
const near = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]) < 0.05;
/** mount a plate studs-out on the anchor stud s; `cell` = the plate's own underside point that lands on s (local x runs up the face) */
function plate(id, s, cell) { const b = bbox(id); return a.onStud(id, BLACK, s, UP, 'x', [cell[0], b[1], cell[1]]); }
const pix = (c, r) => [0.5 + c, 1.7 + r, 4];
const facePlates = [];
for (let c = 0; c < COLS; c++) if (c < LEG || c >= COLS - LEG) {          // legs: a 1 × 12 plate per column over rows 0–11, held at rows 1, 5, 9
  const s = ss.front.find((t) => near(t.p, pix(c, 1))); if (!s) throw new Error('no row-1 stud for column ' + c);
  facePlates.push(plate('60479', s, [-4.5, 0]));
}
for (let c = 0; c < COLS; c += 2) {                                       // band: a 2 × 3 plate per two columns over rows 12–14, held at row 13
  const s = band.find((t) => near(t.p, pix(c, 13))); if (!s) throw new Error('no row-13 stud for column ' + c);
  facePlates.push(plate('3021', s, [0, -0.5]));
}
const faceStuds = facePlates.flatMap((r) => a.side(r)).filter((s) => s.d[2] === 1);
let tiles = 0;
for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) {
  if (opening(c, r)) continue;
  const s = faceStuds.find((t) => near(t.p, [pix(c, r)[0], pix(c, r)[1], t.p[2]])); if (!s) throw new Error(`no stud under pixel ${c},${r}`);
  a.onStud('3070b', tone(c, r), s, [1, 0, 0]); tiles++;
}
// ---- bead edge (the real frame's black rim of lamps, outside and round the opening): a vertical studs-out plate on each front corner's side
// studs, a black 1 × 1 round plate on every stud — one bead per pixel row (2.5 plates), up the legs' outer and inner edges and the beam's ends
const sideways = (s) => [Math.round(s.p[1] - 1.7), s];
let beads = 0;
for (const list of [ss.outer, ss.edge]) for (const xFace of [...new Set(list.map((s) => s.p[0].toFixed(1)))]) {
  const col = list.filter((s) => s.p[0].toFixed(1) === xFace).map(sideways);
  const legRow1 = col.find(([k]) => k === 1); const local = (s) => (s.d[0] > 0 ? -0.5 : 0.5) * 0;   // the plate is one stud wide: its stud row on the anchor
  const mounts = [];
  if (legRow1) mounts.push(plate('60479', legRow1[1], [-4.5, local(legRow1[1])]));            // rows 0–11
  const beamRow = col.find(([k]) => k === 13); if (beamRow) mounts.push(plate('3623', beamRow[1], [0, 0]));   // rows 12–14 (beam ends)
  for (const m of mounts) for (const t of a.side(m).filter((q) => Math.abs(q.d[0]) === 1)) { a.onStud('6141', BLACK, t, [0, 0, 1]); beads++; }
}
// ---- inner LED strips: a 2 × 12 plate on each leg's inner side studs (z 1–3, rows 0–11), a two-colour checker of 1 × 1 tiles
for (const [xFace, cA, cB] of [[3, DPURPLE, MLAV], [15, DTURQ, DAZURE]]) {
  const s = ss.inner.find((t) => Math.abs(t.p[0] - xFace) < 0.05 && Math.abs(t.p[1] - 2.7) < 0.05 && Math.abs(t.p[2] - 1.5) < 0.05); if (!s) throw new Error('no inner stud at x ' + xFace);
  const b = bbox('2445'); const local = s.d[0] > 0 ? 0.5 : -0.5;           // local z runs north for the west strip, south for the east one
  const rec = a.onStud('2445', BLACK, s, UP, 'x', [-4.5, b[1], local]);
  for (const t of a.side(rec).filter((q) => Math.abs(q.d[0]) === 1)) { const k = Math.round(t.p[1] - 1.7), j = Math.round(t.p[2] - 1.5); a.onStud('3070b', (k + j) % 2 ? cB : cA, t, [0, 0, 1]); }
}
// ---- moving heads: ten headlight bricks in one even row, hung by their stud in the beam's underside (plates 30–33, x 4–14, z 1), a clear
// round tile on each lens recess (the target image and 41105's light bar are one even row)
for (let x = 4; x < 14; x++) { const h = up('4070', BLACK, x, 30, 1); const s = a.side(h).find((q) => q.d[2] === 1); a.onStud('98138', TCLEAR, s, [1, 0, 0]); }
const out = a.write(); console.log('ko_frame', a.parts.length, 'parts,', tiles, 'face tiles,', beads, 'beads', JSON.stringify(out.bom));

// ---- speaker tower (footprint 2 × 4, x 0–2, z 0–4; origin x 1, z 2): two 2 × 2 ballast plates, a triangular girder (plates 2–32), four 2 × 2
// bricks, a 2 × 4 plate reaching two studs south, a 2 × 4 tile (46); seven grille bricks hung under the overhang at z 3–4 (plates 23–44), a stud
// of air between them and the girder, so the truss reads over its lower half and the array hangs on the crowd side
const t = new Asm('ko_tower', [1, 0, 2]);
t.up('3022', BLACK, 0, 0, 0); t.up('3022', BLACK, 0, 1, 0); t.up('30517', BLACK, 0, 2, 0);
for (const y of [32, 35, 38, 41]) t.up('3003', BLACK, 0, y, 0);
t.up('3020', BLACK, 0, 44, 0, 1); t.up('87079', BLACK, 0, 45, 0, 1);
for (let k = 0; k < 7; k++) t.up('2877', BLACK, 0, 41 - 3 * k, 3);
const to = t.write(); console.log('ko_tower', t.parts.length, 'parts', JSON.stringify(to.bom));
