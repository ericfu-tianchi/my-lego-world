// Seoul v2 (2026-10-06, docs/refs/seoul-island/LAYOUT-v2.md): the comeback stage at the island's new scale — low, in front of Gwanghwamun,
// r1 its top level with the gate's granite base (G + 16); Eric r7: taller, top G + 31, so the screen reads. The LED
// became a wall behind the idols; Eric r8: a hollow picture frame again (the gate through its opening); the same face technique as ko_frame.
//   LDRAW_DIR=<main repo>/vendor/ldraw-lib/ldraw node tools/ldraw/asm-ko-stage-s.mjs && node tools/ldraw/bake.mjs ko_frame_s.ldr ko_tower_s.ldr --hull --force
// LED wall grid (studs; x west → east, z north → south, y plates above the ground G): x 0–18, z 0–2 (back row z 0 Dark Bluish Gray, front
// row z 1 Black), the face proud on z 2–2.8. Courses: bricks at 0, side-stud bricks at 5, 10, 15, 20, 25 (rows 1, 3, 5, 7, 9), two staggered
// 2-wide plate layers between, a tile top at 30 → 31. Pixel row k (1 stud square, row 0 on the deck top G + 3) has its centre at 1.7 + k
// studs: rows 0–9.
// Origin = the footprint's bottom centre (9, 0, 1).
import { Asm, bbox } from './asm-ours.mjs';
const BLACK = 0, LBG = 71, DBG = 72;
const RED = 4, DPURPLE = 85, MLAV = 30, DTURQ = 3, DAZURE = 321, TCLEAR = 47;
const TONES = [RED, LBG, RED, DBG];   // lead r3: the LED read as a black box from the hero camera — Bright Red with greys, as the reference
const COLS = 18, ROWS = 10;   // Eric r7: the screen read too short — 10 rows, top G + 31 (below the scaled gate's lower eave)
// Eric r8 (2026-10-07: the real frame is hollow — real-frame-gate-through.jpg): a picture frame again, as ko_frame r4 at this scale. Legs
// three columns wide (1/6 of the width, as the real frame), the opening 12 studs × 8 pixel rows (G + 3 to G + 23) under a two-row beam;
// the gate is seen through it. The opening has its own floor flush with the deck (plates 0–3).
const LEG = 3, OPEN_ROWS = 8;
const opening = (c, r) => r < OPEN_ROWS && c >= LEG && c < COLS - LEG;
const tone = (c, r) => { const u = c < COLS / 2 ? COLS / 2 - 1 - c : c - COLS / 2; return TONES[Math.floor((u + (ROWS - 1 - r)) / 2) % 4]; };
const a = new Asm('ko_frame_s', [COLS / 2, 0, 1]);
const up = (id, c, x, y, z, r = 0) => a.up(id, c, x, y, z, r);
const front = [], inner = [];
const LEGS = [[0, +1], [COLS - LEG, -1]];   // [x0, inward]
// ---- legs (x 0–3 and 15–18, z 0–2) to plate 23: brick courses whose front row carries side studs, 2 × 3 plate pairs between them
const legBricks = (x0, y) => { up('3622', DBG, x0, y, 0); up('3622', BLACK, x0, y, 1); };
const legSide = (x0, inward, y, strip) => {
  up('3622', DBG, x0, y, 0);
  const xi = inward > 0 ? x0 + LEG - 1 : x0;   // the column on the opening's edge
  for (let x = x0; x < x0 + LEG; x++) {
    if (x === xi && strip) { const rec = up('26604', BLACK, x, y, 1, inward > 0 ? 0 : 3); for (const q of a.side(rec)) (q.d[2] === 1 ? front : inner).push(q); }   // studs south + into the opening
    else front.push(...a.side(up('87087', BLACK, x, y, 1, 0)).filter((q) => q.d[2] === 1));
  }
};
const legPlate = (x0, y) => up('3021', BLACK, x0, y, 0);
for (const [x0, inward] of LEGS) {
  legBricks(x0, 0); legPlate(x0, 3); legPlate(x0, 4);
  for (const p of [5, 10, 15, 20]) { legSide(x0, inward, p, p === 5 || p === 15); if (p < 20) { legPlate(x0, p + 3); legPlate(x0, p + 4); } }
}
// ---- the beam over the opening (plates 23–31): two full-width 2-wide plate layers with staggered joints, a side-stud course, two more, a tile top
const back = (y) => { up('3008', DBG, 0, y, 0); up('3008', DBG, 8, y, 0); up('3004', DBG, 16, y, 0); };
const sideCourse = (y) => { back(y); for (let x = 0; x < COLS; x++) front.push(...a.side(up('87087', BLACK, x, y, 1, 0)).filter((q) => q.d[2] === 1)); };
const plates = (y, flip) => { up(flip ? '3034' : '3832', BLACK, 0, y, 0); up(flip ? '3832' : '3034', BLACK, flip ? 8 : 10, y, 0); };
plates(23, false); plates(24, true); sideCourse(25); plates(28, false); plates(29, true);
for (const x of [0, 4, 8, 12]) up('87079', BLACK, x, 30, 0); up('3068b', BLACK, 16, 30, 0);
// ---- the opening's floor (x 3–15, z 0–3), flush with the deck: two plate layers, staggered, and a tile top
up('60479', BLACK, 3, 0, 0); up('2445', BLACK, 3, 0, 1); up('2445', BLACK, 3, 1, 0); up('60479', BLACK, 3, 1, 2);
for (const x of [3, 7, 11]) { up('87079', BLACK, x, 2, 0); up('2431', BLACK, x, 2, 2); }
// ---- the face: a 1 × 4 plate studs-out per leg column at rows 1 and 5 (rows 0–7), a 1 × 2 per column at row 9 (rows 8–9), a 1 × 1 tile per pixel
const near = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]) < 0.05;
const pix = (c, r) => [0.5 + c, 1.7 + r, 2];
const cols = [];
for (let c = 0; c < COLS; c++) for (const [row, id, off] of [[1, '3710', -0.5], [5, '3710', -0.5], [9, '3023', 0.5]]) {   // rows 0–3, 4–7 (1 × 4 plates) and 8–9 (a 1 × 2)
  if (opening(c, row)) continue;
  const s = front.find((t) => near(t.p, pix(c, row))); if (!s) throw new Error(`no row-${row} stud for column ${c}`);
  const b = bbox(id); cols.push(a.onStud(id, BLACK, s, [0, 1, 0], 'x', [off, b[1], 0])); }
const faceStuds = cols.flatMap((r) => a.side(r)).filter((s) => s.d[2] === 1);
for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) {
  if (opening(c, r)) continue;
  const s = faceStuds.find((t) => near(t.p, [pix(c, r)[0], pix(c, r)[1], t.p[2]])); if (!s) throw new Error(`no stud under pixel ${c},${r}`);
  a.onStud('3070b', tone(c, r), s, [1, 0, 0]);
}
// ---- inner LED strips (the real frame's coloured edge strips): a 1 × 4 plate studs-out on each leg's inner side studs (rows 0–3, 4–7), a
// two-colour checker of 1 × 1 tiles — purples on the west edge, teals on the east
for (const [xFace, cA, cB] of [[LEG, DPURPLE, MLAV], [COLS - LEG, DTURQ, DAZURE]]) for (const row of [1, 5]) {
  const s = inner.find((t) => Math.abs(t.p[0] - xFace) < 0.05 && Math.abs(t.p[1] - (1.7 + row)) < 0.15); if (!s) throw new Error(`no inner stud at x ${xFace} row ${row}`);
  const rec = a.onStud('3710', BLACK, s, [0, 1, 0], 'x', [-0.5, bbox('3710')[1], 0]);
  for (const t of a.side(rec).filter((q) => Math.abs(q.d[0]) === 1)) { const k = Math.round(t.p[1] - 1.7); a.onStud('3070b', k % 2 ? cB : cA, t, [0, 0, 1]); }
}
// ---- moving heads: ten headlight bricks hung by their stud in the beam's underside (plates 20–23, x 4–14, z 1), a clear round tile on each lens
for (let x = 4; x < 14; x++) { const h = up('4070', BLACK, x, 20, 1); const s = a.side(h).find((q) => q.d[2] === 1); a.onStud('98138', TCLEAR, s, [1, 0, 0]); }
const out = a.write(); console.log('ko_frame_s', a.parts.length, 'parts', JSON.stringify(out.bom), 'exposed', JSON.stringify(a.exposed()));

// ---- speaker stack (2 × 2, origin x 1, z 1): two ballast plates, nine courses of a grille brick (south, the crowd side) in front of a 1 × 2
// brick, a 2 × 2 plate and a 2 × 2 tile → 31
const t = new Asm('ko_tower_s', [1, 0, 1]);
t.up('3022', BLACK, 0, 0, 0); t.up('3022', BLACK, 0, 1, 0);
for (let k = 0; k < 9; k++) { t.up('3004', BLACK, 0, 2 + 3 * k, 0); t.up('2877', BLACK, 0, 2 + 3 * k, 1); }
t.up('3022', BLACK, 0, 29, 0); t.up('3068b', BLACK, 0, 30, 0);
const to = t.write(); console.log('ko_tower_s', t.parts.length, 'parts', JSON.stringify(to.bom));
