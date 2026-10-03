// Shikumen lane v3 (2026-10-03) — a terrace of three bays as one assembly (built twice in the scene, facing each other across an open lane)
// and the lane-mouth gatehouse as another, so the lane itself is real ground people can stand in.
//   LDRAW_DIR=<main repo>/vendor/ldraw-lib/ldraw node tools/ldraw/asm-shikumen.mjs && node tools/ldraw/bake.mjs shikumen.ldr --force
// Scheme: docs/countries/china.md §1.9.7. v2 → v3 (Eric 2026-10-03): the set's height table puts houses at ≈ 30 plates (v2 was 40, as tall as
// the Bund's roofs); one assembly for the whole lane made the lane unusable. Embossed grey brick, Dark Red bands at the sill and the heads;
// each door a black opening in a Tan stone frame under a pediment that changes per bay (semicircular arch, triangle of 45° slopes, flat
// entablature); white windows with glass under Dark Red lintels on every face; wall-hung laundry on a bamboo pole between two clips;
// Black pantile roof of 33° slopes and a 45° ridge.
// Row frame: x along the lane (bays at i 0–23), z across: the doors on j 7 (the lane side, +z), the back on j 0. Origin: footprint centre.
import { building, EMBOSSED } from './asm-build.mjs';
import { PLATE } from './asm-ours.mjs';
const TAN = 19, DBG = 72, BLK = 0, WHITE = 15, DRED = 320, LBG = 71, TBLK = 40, BROWN = 70, DTAN = 28, AZURE = 322, GREEN = 2;
const BAYS = 3, BW = 8, TW = BAYS * BW, TD = 8;
const basisR = (ex, ey, ez) => [ex[0], ey[0], ez[0], ex[1], ey[1], ez[1], ex[2], ey[2], ez[2]];
// v4 (Eric 2026-10-03): the whole lane as one assembly again — both terraces face south as real lanes do, the lane between the north row's
// doors and the south row's back is 6 wide, laundry hangs across it on bamboo poles between the two rows (and still on the south row's
// street face), potted plants by the doors, the gatehouse over the lane mouth at the east end.
// Frame: x along the lane (bays at i 0–23, the gatehouse at i 24), z: north row j 0–7, lane j 8–13, south row j 14–21; origin footprint centre.
const LANE = 6, D = 2 * TD + LANE;
const { a, layer, ring } = building('shikumen', TW + 1, D);
const glazed = (id, i, y, j, r = 0) => { const rec = a.up(id, WHITE, i, y, j, r); a.put('60601', TBLK, rec.R, rec.t); };
const ACROSS = [6, 16];                                                         // the x of the laundry lines across the lane
function row(j0, streetLaundry, laneSide) {                                     // laneSide: 'front' (north row) or 'back' (south row)
  const front = j0 + TD - 1, back = j0;
  const bays = Array.from({ length: BAYS }, (_, k) => k * BW);
  const doors = bays.map((b) => b + 3);                                        // the door's two cells: d, d + 1; posts at d − 1 and d + 2
  const frameCell = (i) => doors.some((d) => i >= d - 1 && i <= d + 2);
  const wins = bays.flatMap((b) => [b + 1, b + 5]);                             // two 2-wide windows a bay, both faces
  const winCell = (i) => wins.some((w) => i === w || i === w + 1);
  const endWin = (i, j) => (i === 0 || i === TW - 1) && (j === j0 + 3 || j === j0 + 4);   // a window in each gable end
  const upWin = (i, j) => ((j === front || j === back) && winCell(i)) || endWin(i, j);
  const R = (f) => ring(0, j0, TW, TD, f);
  // ground storey, 0–9: the door frames as tall bricks, windows at the back and the gable ends
  for (let c = 0; c < 3; c++) layer(R((i, j) => ((j === front && frameCell(i)) || (c > 0 && ((j === back && winCell(i)) || endWin(i, j))) ? null : DBG)), 3 * c, 'brick', EMBOSSED);
  for (const d of doors) { a.up('14716', TAN, d - 1, 0, front); a.up('14716', TAN, d + 2, 0, front); a.up('14716', BLK, d, 0, front); a.up('14716', BLK, d + 1, 0, front); }
  for (const w of wins) glazed('60592', w, 3, back); for (const i of [0, TW - 1]) glazed('60592', i, 3, j0 + 3, 1);
  layer(R((i, j) => (j === front && frameCell(i) ? TAN : (j === back && winCell(i)) || endWin(i, j) ? DRED : DBG)), 9, 'plate');   // lintels: stone over the doors, red over the windows
  // the pediments, 10–13: one kind per bay
  layer(R((i, j) => (j === front && frameCell(i) ? null : DBG)), 10, 'brick', EMBOSSED);
  doors.forEach((d, k) => { if (k % 3 === 0) a.up('3659', TAN, d - 1, 10, front); else if (k % 3 === 1) { a.up('3040b', TAN, d - 1, 10, front, 3); a.up('3040b', TAN, d + 1, 10, front, 1); } else a.up('3010', DTAN, d - 1, 10, front); });
  // the sill band, 13: red, white under the windows; laundry plates run out of it
  // laundry (v5, Eric 2026-10-03: a cloth hung in the air with no pole): every line is a bamboo bar held in two horizontal clips whose
  // ring axis runs along the bar. The clip plate's clip sits one stud out along its local +z, the ring's axis along its local x.
  const wallPoles = streetLaundry ? [bays[0] + 5, bays[0] + 8, bays[2], bays[2] + 3] : [];   // street-side lines: two pairs, three cells apart, clips facing out
  const laneJ = laneSide === 'front' ? front : back;
  layer(R((i, j) => ((j === front && wallPoles.includes(i)) || (j === laneJ && ACROSS.includes(i)) ? null : upWin(i, j) ? WHITE : DRED)), 13, 'plate');
  const clipY = 14 * PLATE + 0.4724, yb = 15 * PLATE - 0.1;                    // the clip plate's origin; the ring's centre height
  wallPoles.forEach((i) => { a.up('3023', DRED, i, 13, front, 1); a.put('61252', DRED, [1, 0, 0, 0, 1, 0, 0, 0, 1], [i + 0.5, clipY, front + 1.5]); });   // ring at (i + 0.5, front + 2.5), axis along x
  [[wallPoles[0], WHITE], [wallPoles[2], AZURE]].filter(([i]) => i !== undefined).forEach(([i, cloth]) => { const zb = front + 2.5;
    a.put('30374', BROWN, basisR([0, 0, -1], [-1, 0, 0], [0, 1, 0]), [i, yb, zb]);    // the bar along x from i to i + 4, through both rings
    a.put('11055', cloth, basisR([0, 0, -1], [-1, 0, 0], [0, 1, 0]), [i + 1, yb, zb]); });   // the cloth's clip edge on the bar, i + 1 to i + 3, hanging down
  // across the lane: 1×3 plates run out of the sill band, a clip turned so its ring axis runs across the lane (along z)
  const ROT_X = [0, 0, 1, 0, 1, 0, -1, 0, 0];                                     // local +z → world +x: the clip one stud along +x, its ring axis along z
  for (const i of ACROSS) { if (laneSide === 'front') { a.up('3623', DRED, i, 13, front, 1); a.put('61252', DRED, ROT_X, [i + 0.5, clipY, front + 2.5]); } else { a.up('3623', DRED, i, 13, back - 2, 1); a.put('61252', DRED, ROT_X, [i + 0.5, clipY, back - 1.5]); } }
  // upstairs, 14–20: white windows with glass on every face
  for (let c = 0; c < 2; c++) layer(R((i, j) => (upWin(i, j) ? null : DBG)), 14 + 3 * c, 'brick', EMBOSSED);
  for (const j of [front, back]) for (const w of wins) glazed('60592', w, 14, j); for (const i of [0, TW - 1]) glazed('60592', i, 14, j0 + 3, 1);
  // heads, 20–23: Dark Red lintels over each window, the head band
  layer(R((i, j) => (upWin(i, j) ? null : DBG)), 20, 'brick', EMBOSSED);
  for (const j of [front, back]) for (const w of wins) a.up('3004', DRED, w, 20, j); for (const i of [0, TW - 1]) a.up('3004', DRED, i, 20, j0 + 3, 1);
  layer(R(() => DRED), 23, 'plate');
  // roof, 24–30: 33° slopes three rows deep both sides, a course under the ridge, a 45° double ridge
  for (let i = 0; i < TW; i += 2) { a.up('3298', BLK, i, 24, j0 + TD - 3, 0); a.up('3298', BLK, i, 24, j0, 2); a.up('3043', BLK, i, 27, j0 + 3, 0); }
  layer(new Map(Array.from({ length: TW }, (_, k) => [[`${k},${j0 + 3}`, DBG], [`${k},${j0 + 4}`, DBG]]).flat()), 24, 'brick');
}
row(0, false, 'front'); row(TD + LANE, true, 'back');
// laundry across the lane: a bamboo bar along z through the two rings (at x i + 1.5, z 9.5 and 12.5), a cloth hung between them
ACROSS.forEach((i, k) => { const yb = 15 * PLATE - 0.1, xb = i + 1.5;
  a.put('30374', BROWN, basisR([1, 0, 0], [0, 0, -1], [0, 1, 0]), [xb, yb, TD + 1]);                 // from z 9 to 13
  a.put('11055', [WHITE, AZURE][k], basisR([-1, 0, 0], [0, 0, 1], [0, 1, 0]), [xb, yb, TD + 4]); });   // hangs over z 10–12
// potted plants by the north row's doors
for (const i of [1, 9, 17]) { a.up('3062b', BROWN, i, 0, TD); a.up('32607', GREEN, i, 3, TD); }
// the gatehouse over the lane mouth at the east end: stucco piers on j 8 and j 13, a 1×6 arch, a room with a window, a pediment
{ const X = TW, J = TD;
  for (const j of [J, J + 5]) for (let c = 0; c < 3; c++) a.up('3005', LBG, X, 3 * c, j);
  a.up('3455', LBG, X, 9, J, 1);
  for (let c = 0; c < 2; c++) { a.up('3004', LBG, X, 12 + 3 * c, J, 1); a.up('3004', LBG, X, 12 + 3 * c, J + 4, 1); }
  glazed('60592', X, 12, J + 2, 1);
  a.up('3666', DTAN, X, 18, J, 1);
  a.up('3040b', LBG, X, 19, J, 2); a.up('3040b', LBG, X, 19, J + 4, 0); a.up('3004', LBG, X, 19, J + 2, 1);
  a.up('3040b', LBG, X, 22, J + 1, 2); a.up('3040b', LBG, X, 22, J + 3, 0); }
const out = a.write(); console.log('shikumen:', a.parts.length, 'parts', JSON.stringify(out.bom));
