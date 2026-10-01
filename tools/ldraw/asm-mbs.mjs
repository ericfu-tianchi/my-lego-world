// Marina Bay Sands hotel tower, v10 (2026-10-01) — one tower of real parts; the scene places it three times (src/scenes/singapore-v4.ts).
//   LDRAW_DIR="$PWD/vendor/ldraw-lib/ldraw" node tools/ldraw/asm-mbs.mjs && node tools/ldraw/bake.mjs mbs10_tower.ldr --force
// The real tower is two leaves: a straight leaf on the bay side and a back leaf that leans out at the foot and meets it under the SkyPark
// ("deck of cards"; docs/refs/mbs-moc/real-mbs-jays-photo.jpg). Here both leaves are 1-stud walls of 1×4 / 1×2 side-stud bricks laid in
// running bond, faced with 1×2 trans tiles on an aligned grid (a tile may bridge two bricks, so the glass grid stays square while the bricks
// stagger); the 4-LDU gap between tile rows reads as the floor lines. One course of dark grille tiles is the mechanical floor (the dark slit
// a quarter of the way up the real towers). The back leaf stands on three 1×2 hinge bricks and leans in until its top inner edge touches the
// bay leaf's back face — a wedge of daylight between the leaves, widest at the foot.
// Colour (swatch test 2026-10-01, five pairs side by side): trans-light-blue tiles over Dark Bluish Gray bricks read as the real grey-green
// curtain wall with dark floor lines; over white they read as aqua ice, trans-black reads brown, opaque Sand Green reads as paint.
// LDraw frame: x right, y DOWN, bay = −z. Bay leaf in z 0..20, back leaf foot in z 60..80. 6 studs wide, 45 plates tall.
import { Model, turnFor, RY } from './asm-lib.mjs';
const C = { core: +(process.env.CORE ?? 72), glass: +(process.env.GLASS ?? 43), band: 72 };
const COURSES = 15, BAND = 5;                                           // bay leaf: 15 brick courses = 45 plates; the band is course 5 from the ground
const t = new Model(process.env.NAME ?? 'mbs10', [-60, 0, -40]);                            // origin = footprint (x 0..120, z 0..80) bottom centre
const mid = (a, b) => a.map((v, i) => (v + b[i]) / 2);

/** one course of a 1-stud wall at cell row sz, bottom plate py: 1×4 + 1×2 side-stud bricks swapping ends every course; returns the face studs */
function course(m, c, sz, py, dir) {
  const k4 = turnFor('30414', [[0, dir], [0, dir], [0, dir], [0, dir]]), k2 = turnFor('11211', [[0, dir], [0, dir]]);
  const recs = c % 2 === 0 ? [m.up('30414', C.core, 0, sz, py, 3, 4, 1, k4), m.up('11211', C.core, 4, sz, py, 3, 2, 1, k2)]
                           : [m.up('11211', C.core, 0, sz, py, 3, 2, 1, k2), m.up('30414', C.core, 2, sz, py, 3, 4, 1, k4)];
  return recs.flatMap((r) => m.sideStuds(r)).filter((s) => s.dir[2] === dir).sort((a, b) => a.at[0] - b.at[0]);
}
/** 1×2 tiles on an aligned grid: studs 0+1, 2+3, 4+5 of the course */
function glaze(m, studs, band) {
  if (studs.length !== 6) throw new Error('expected 6 face studs, got ' + studs.length);
  for (let i = 0; i < 6; i += 2) m.attach(band ? '2412b' : '3069b', band ? C.band : C.glass, { at: mid(studs[i].at, studs[i + 1].at), dir: studs[i].dir });
}

// ---- bay leaf: straight, on the ground -------------------------------------------------------------------------------------------------
for (let c = 0; c < COURSES; c++) glaze(t, course(t, c, 0, 3 * c, -1), c === BAND);

// ---- back leaf: built upright in its own model, then rotated about the hinge axle ------------------------------------------------------
const b = new Model('mbs10_back');
const BACK = 13;                                                        // 13 courses + a 1×6 plate + a 1×6 tile cap, so the tilted top stays under the SkyPark
for (let c = 0; c < BACK; c++) glaze(b, course(b, c, 3, 3 + 3 * c, 1), 3 + 3 * c === 3 * BAND);
b.up('3666', C.core, 0, 3, 3 + 3 * BACK, 1, 6, 1); b.up('6636', C.core, 0, 3, 4 + 3 * BACK, 1, 6, 1);
// hinge axle: 10 LDU below the base's top face, at the cell centre (as measured for 3937/3938 in v9). The top inner edge of the leaf
// (z 60, y = −24 − 24·BACK − 16 upright) must land on the bay leaf's back face z = 20.
const PIVOT = [0, -14, 70]; const top = [0, -24 - 24 * BACK - 16, 60];
const dz = top[2] - PIVOT[2], dy = top[1] - PIVOT[1]; let th = 0;
for (let i = 0; i < 60; i++) th = Math.asin(Math.min(1, (PIVOT[2] + dz * Math.cos(th) - 20) / -dy));   // z(θ) = Pz + dz·cosθ + dy·sinθ = 20
const cs = Math.cos(th), sn = Math.sin(th);
const R = [1, 0, 0, 0, cs, -sn, 0, sn, cs];                             // about +x: a point above the axle (dy < 0) moves toward −z (the bay leaf)
const lean = (p) => { const y = p[1] - PIVOT[1], z = p[2] - PIVOT[2]; return [p[0], PIVOT[1] + cs * y - sn * z, PIVOT[2] + sn * y + cs * z]; };
const mul3 = (A, B) => { const O = new Array(9).fill(0); for (let r = 0; r < 3; r++) for (let q = 0; q < 3; q++) O[r * 3 + q] = A[r * 3] * B[q] + A[r * 3 + 1] * B[3 + q] + A[r * 3 + 2] * B[6 + q]; return O; };
for (let x = 0; x < 6; x += 2) { t.up('3937', C.core, x, 3, 0, 3, 2, 1); t.raw('3938', C.core, lean([20 * x + 20, -24, 70]), mul3(R, RY(0))); }
for (const p of b.placed) t.raw(p.part, p.color, lean(p.pos), mul3(R, p.M));
const zTop = PIVOT[2] + dz * cs + dy * sn, yTop = Math.min(...b.placed.map((p) => lean(p.pos)[1]));
console.log(`back leaf leans ${(th * 180 / Math.PI).toFixed(2)}°; top inner edge z = ${zTop.toFixed(2)} LDU (bay leaf back face 20); highest part origin y = ${yTop.toFixed(1)} (bay leaf top −${24 * COURSES})`);
const files = t.write({ tower: [C.core, C.glass, C.band] }); console.log('mbs:', files.join(' '), 'BOM', JSON.stringify(t.bom()));
