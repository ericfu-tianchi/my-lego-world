// The Bund v1 (2026-10-03) — Customs House, HSBC and the Peace Hotel, one assembly each, authored in our frame (tools/ldraw/asm-ours.mjs).
//   LDRAW_DIR=<main repo>/vendor/ldraw-lib/ldraw node tools/ldraw/asm-bund.mjs && node tools/ldraw/bake.mjs customs.ldr hsbc.ldr peace.ldr --force
// Rusticated granite bases are embossed-brick courses (log bricks are vertical logs and read as fluting, 2026-10-03).
// Scheme: docs/countries/china.md §1.9.6; references docs/refs/shanghai-bund/NOTES.md. The three share one grammar: hollow walls one stud
// thick, every brick course packed into runs that alternate along x and along z so each course bonds across the one below; Tan granite
// with recessed windows (v1's flush Black strips read as stripes — Eric 2026-10-03: the real Bund has no black), Dark Tan string courses, cornices one stud
// proud on plates. Front (the Bund) is −z; cells are (i, j) from the footprint's min corner, the LDraw origin is the footprint's bottom centre.
import { bbox, PLATE } from './asm-ours.mjs';
const TAN = 19, DTAN = 28, BLK = 0, GLASS = 39,   // windows clear glass (drawn with transmission): Sand Blue read as blue, dark grey as solid (Eric 2026-10-03)
   LBG = 71, DBG = 72, WHITE = 15, RED = 4, GREEN = 288, DORANGE = 484;
import { building, facade, yaw, EMBOSSED, TILES } from './asm-build.mjs';

// v3 heights (Eric 2026-10-03: the Bund stood as tall as Jin Mao): the set's height table puts the historic blocks at 22–30 plates to the
// roof and their towers / domes at 44–58, well under the skyscrapers (80–110). Two-course granite bases, two to four storeys.
const round = (a, id, color, x, y, z) => a.put(id, color, yaw(0), [x, y * PLATE - bbox(id)[1], z]);   // a round part centred at (x, z), bottom at plate y
// ===================================================================== Customs House 15 × 10
{
  const W = 15, D = 10; const { a, layer, ring, rect, storeys, band2 } = building('customs', W, D);
  const roof = (y, keep) => layer(rect(0, 0, W, D, (i, j) => (keep(i, j) ? null : LBG)), y, 'plate', TILES);   // tiles over the roof plates, the tower's cells left bare
  const win = facade(W, D, (i) => i % 2 === 0, (j) => j % 2 === 0);
  // base: two courses of granite; the portico in the middle of the front: round columns at 5, 7, 9 in front of a Dark Tan recess
  for (let c = 0; c < 2; c++) { const m = ring(0, 0, W, D, (i, j) => (j === 0 && i >= 5 && i <= 9 ? null : TAN)); for (let i = 5; i <= 9; i++) m.set(`${i},1`, DTAN); layer(m, 3 * c, 'brick', EMBOSSED); for (const i of [5, 7, 9]) a.up('3062b', TAN, i, 3 * c, 0); }
  layer(ring(0, 0, W, D, () => DTAN, 2), 6, 'plate');                         // the string course, two studs deep: it caps the columns
  let y = storeys(0, 0, W, D, win, 7, 2, TAN, GLASS);
  band2(-1, -1, W + 2, D + 2, y, TAN, TAN); y += 1;                         // the cornice, a stud proud all round, its lip tiled
  layer(ring(0, 0, W, D, () => TAN), y, 'brick'); y += 3;                     // attic
  a.up('3033', LBG, 0, y, 0, 1); a.up('3033', LBG, 6, y, 0, 1); a.up('3832', LBG, 12, y, 0, 1); a.up('3666', LBG, 14, y, 0, 1); a.up('3710', LBG, 14, y, 6, 1); y += 1;
  const T0 = 5, TJ = 0; roof(y, (i, j) => i >= T0 && i <= T0 + 4 && j <= TJ + 4);
  // the clock tower, 5 × 5 on the front's middle bays
  const tw = (i, j) => (i === T0 + 2 && (j === TJ || j === TJ + 4)) || (j === TJ + 2 && (i === T0 || i === T0 + 4));
  y = storeys(T0, TJ, 5, 5, tw, y, 2, TAN, GLASS);
  band2(T0 - 1, TJ - 1, 7, 7, y, DTAN, DTAN); y += 1;
  // clock stage: three courses; in the middle one the face centres are bricks with studs on four sides carrying the dials
  for (let c = 0; c < 3; c++) {
    const mid = c === 1; layer(ring(T0, TJ, 5, 5, (i, j) => (mid && tw(i, j) ? null : TAN)), y, 'brick');
    if (mid) for (const [i, j, d] of [[T0 + 2, TJ, [0, 0, -1]], [T0 + 2, TJ + 4, [0, 0, 1]], [T0, TJ + 2, [-1, 0, 0]], [T0 + 4, TJ + 2, [1, 0, 0]]]) {
      const rec = a.up('4733', TAN, i, y, j); const s = a.side(rec).find((q) => q.d[0] === d[0] && q.d[2] === d[2]);
      a.onStud('14769', WHITE, s, [d[2] !== 0 ? 1 : 0, 0, d[0] !== 0 ? 1 : 0]);   // the dial: a white round tile on the side stud
    }
    y += 3;
  }
  layer(ring(T0, TJ, 5, 5, () => DTAN), y, 'plate'); y += 1;
  for (const [di, dj] of [[0, 0], [2, 0], [0, 2], [2, 2]]) a.up('3005', TAN, T0 + 1 + di, y, TJ + 1 + dj); y += 3;   // belfry: four piers, open between
  a.up('11212', DTAN, T0 + 1, y, TJ + 1); y += 1;
  a.up('3062b', TAN, T0 + 2, y, TJ + 2); y += 3; a.up('4589', DTAN, T0 + 2, y, TJ + 2); y += 3; round(a, '87994', LBG, T0 + 2.5, y, TJ + 2.5);   // cupola, flagpole
  const out = a.write(); console.log('customs:', a.parts.length, 'parts, top', y + 3, JSON.stringify(out.bom));
}

// ===================================================================== HSBC 20 × 10
{
  const W = 20, D = 10; const { a, layer, ring, rect, storeys, band2 } = building('hsbc', W, D);
  const roof = (y, keep) => layer(rect(0, 0, W, D, (i, j) => (keep(i, j) ? null : LBG)), y, 'plate', TILES);
  const pav = (i) => i <= 1 || i >= W - 2;                                    // the end pavilions: solid
  const win = facade(W, D, (i) => !pav(i) && i % 2 === 1 && !(i >= 7 && i <= 12), (j) => j % 2 === 1);
  // base: two courses, three arched doors (1×4 arches) in the middle on piers, a Dark Tan recess behind
  for (let c = 0; c < 2; c++) { const m = ring(0, 0, W, D, (i, j) => { if (j !== 0 || i < 4 || i > 15) return TAN; if (c === 1) return null; return [4, 7, 8, 11, 12, 15].includes(i) ? TAN : null; }); for (let i = 4; i <= 15; i++) m.set(`${i},1`, DTAN); layer(m, 3 * c, 'brick', EMBOSSED); }
  for (const i of [4, 8, 12]) a.up('3659', TAN, i, 3, 0);
  layer(ring(0, 0, W, D, () => DTAN, 2), 6, 'plate');
  // three storeys; the frontispiece: six round columns at i 7–12 in front of a recess of windows
  const cols = (i, j) => j === 0 && i >= 7 && i <= 12;
  let y = storeys(0, 0, W, D, (i, j) => win(i, j) || cols(i, j), 7, 3, TAN, GLASS, TAN, cols);
  for (let i = 7; i <= 12; i++) for (let k = 0; k < 4; k++) a.up('3062b', TAN, i, 7 + 3 * k, 0);   // the six columns: four round bricks each, three storeys
  band2(-1, -1, W + 2, D + 2, y, TAN, TAN, (i, j) => j === -1 && i >= 7 && i <= 12); y += 1;   // cornice, a stud proud, its lip tiled except under the pediment; it caps the columns
  a.up('3040b', TAN, 7, y, -1, 3); a.up('3040b', TAN, 11, y, -1, 1); a.up('3004', TAN, 9, y, -1);   // the pediment: 45° slopes on the cornice
  a.up('3040b', TAN, 8, y + 3, -1, 3); a.up('3040b', TAN, 10, y + 3, -1, 1);
  layer(ring(0, 0, W, D, () => TAN), y, 'brick'); y += 3;                     // attic
  a.up('3033', LBG, 0, y, 0, 1); a.up('3033', LBG, 6, y, 0, 1); a.up('3033', LBG, 12, y, 0, 1); a.up('3832', LBG, 18, y, 0, 1); y += 1;
  const I0 = 7, J0 = 2; roof(y, (i, j) => (i >= I0 && i <= I0 + 5 && j >= J0 && j <= J0 + 5) || (j === 0 && i >= 7 && i <= 12));
  const dw = (i, j) => ((i === I0 + 2 || i === I0 + 3) && (j === J0 || j === J0 + 5)) || ((j === J0 + 2 || j === J0 + 3) && (i === I0 || i === I0 + 5));
  y = storeys(I0, J0, 6, 6, dw, y, 1, TAN, GLASS);                            // the drum
  band2(I0 - 1, J0 - 1, 8, 8, y, DTAN, DTAN); y += 1;
  a.up('3958', LBG, I0, y, J0); layer(new Map([...ring(I0, J0, 6, 6, () => LBG)].filter(([k]) => { const [i, j] = k.split(',').map(Number); return !((i === I0 + 1 || i === I0 + 4) && (j === J0 + 1 || j === J0 + 4)); })), y + 1, 'plate', TILES); y += 1;   // the drum's lid, its rim tiled round the dome
  // the dome: a 4×4 round brick, a jumper, a 4×4 inverted dish and a 2×2 dish stacked on centre studs; lantern and red star
  a.up('87081', LBG, I0 + 1, y, J0 + 1); y += 3; a.up('87580', LBG, I0 + 2, y, J0 + 2); y += 1;
  round(a, '3960', LBG, I0 + 3, y, J0 + 3); y += 2; round(a, '4740', LBG, I0 + 3, y, J0 + 3); y += 1;
  round(a, '3062b', LBG, I0 + 3, y, J0 + 3); y += 3; round(a, '11609', RED, I0 + 3, y, J0 + 3);
  const out = a.write(); console.log('hsbc:', a.parts.length, 'parts, top', y + 1, JSON.stringify(out.bom));
}

// ===================================================================== Peace Hotel 10 × 10
{
  const W = 10, D = 10; const { a, layer, ring, rect, storeys, band2 } = building('peace', W, D);
  const roof = (y, keep) => layer(rect(0, 0, W, D, (i, j) => (keep(i, j) ? null : LBG)), y, 'plate', TILES);
  const strip = (k) => [1, 3, 6, 8].includes(k);
  const win = facade(W, D, strip, strip);
  for (let c = 0; c < 2; c++) { const m = ring(0, 0, W, D, (i, j) => (j === 0 && i >= 3 && i <= 6 ? (c === 1 ? null : i === 3 || i === 6 ? TAN : null) : TAN)); for (let i = 3; i <= 6; i++) m.set(`${i},1`, DTAN); layer(m, 3 * c, 'brick', EMBOSSED); }
  a.up('3659', TAN, 3, 3, 0);
  layer(ring(0, 0, W, D, () => DTAN, 2), 6, 'plate');
  let y = storeys(0, 0, W, D, win, 7, 4, TAN, GLASS);
  layer(ring(0, 0, W, D, () => DTAN, 2), y, 'plate'); y += 1;
  a.up('3033', LBG, 0, y, 0); a.up('3030', LBG, 0, y, 6); y += 1; roof(y, (i, j) => i >= 2 && i <= 7 && j >= 2 && j <= 7);
  // the set-back tower stage 6 × 6, one window pair on each face
  const tw = (i, j) => ((i === 4 || i === 5) && (j === 2 || j === 7)) || ((j === 4 || j === 5) && (i === 2 || i === 7));
  y = storeys(2, 2, 6, 6, tw, y, 2, TAN, GLASS);
  a.up('3958', DORANGE, 2, y, 2); layer(ring(2, 2, 6, 6, () => DORANGE), y + 1, 'plate', TILES); y += 1;   // the red-orange trim under the copper roof, its rim tiled
  const Q = [[1, 1, 0], [1, -1, 1], [-1, -1, 2], [-1, 1, 3]];               // the copper pyramid: four 75° corners and a cap, Dark Green
  for (const [sx, sz, q] of Q) a.up('3685', GREEN, sx > 0 ? 5 : 3, y, sz > 0 ? 5 : 3, q); y += 9;
  a.up('3688', GREEN, 4, y, 4); y += 6; round(a, '87994', LBG, 5, y, 5);
  const out = a.write(); console.log('peace:', a.parts.length, 'parts, top', y + 3, JSON.stringify(out.bom));
}
