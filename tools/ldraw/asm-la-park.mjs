// Pacific Park, Santa Monica Pier (2026-10-04; r2 2026-10-05): the park's rides as one assembly of real parts — the Pacific Wheel
// (tools/ldraw/asm-la-wheel.mjs) and the West Coaster oval on its coloured posts. r2 (Eric: the park read empty): the deck plates, planks and
// railing moved out to the scene (placePier, la-pier.ts), so booths, a cart, benches and people can stand on the deck between the rides.
//   LDRAW_DIR=<main repo>/vendor/ldraw-lib/ldraw node tools/ldraw/asm-la-park.mjs && node tools/ldraw/bake.mjs la_park.ldr --force
// Scheme: docs/refs/la-santa-monica/SCHEME.md §1–3 (signed off 2026-10-04, decision A: the full oval round the wheel). Build notes: BUILD.md.
// Why one assembly: the wheel stands inside the coaster oval; as separate proxies their boxes would overlap. The scene validator sees one
// proxy whose cells are only what stands on the deck (the wheel's four feet, the eight coaster posts: `stands`, printed below and copied
// into catalog LA_PARK_STANDS), so the deck round them is free; check-assemblies / check-asm-studs see every brick.
// Frame: x along the pier (west −, east +), z across (north −, south +), y up; F = 1 is the deck plates' top, which is the LDraw origin
// (r2: the deck plates 0–1 and the planks 1–2 are the scene's). The wheel's centre plane is a cell centre (z −0.5); the oval is centred on z 0 so every track joint
// lies on a grid line and its 2 × 2 post stands on whole studs.
import { Asm } from './asm-ours.mjs';
import { addWheel } from './asm-la-wheel.mjs';
const P = 0.4;
const YEL = 14, BLACK = 0, BLO = 191, RED = 4, MAG = 26, BGREEN = 10, BLUE = 1;
const a = new Asm('la_park', [0, 1 * P, 0]);   // r2: the LDraw origin is the deck plates' top (the deck itself is laid in the scene)
const stands = [];   // what stands on the deck: the scene leaves its planks out there, and the proxy's cells are exactly these (catalog LA_PARK_STANDS)
const reserve = (x0, z0, w, d) => stands.push([x0, z0, w, d]);

// ---- wheel (members first: the scene tags them 'wheel' by index)
const W = { x: 2, z: -0.5 };
const nWheel = addWheel(a, [W.x, 1 * P, W.z]);
for (const sx of [1, -1]) for (const sz of [1, -1]) reserve(W.x + sx * 8 - 1, Math.floor(W.z + sz * 3), 2, 1);   // the four feet (1×2 bricks)

// ---- a seated minifig, in LDraw minifig coordinates (origin at the neck, y down, facing −z): torso 973 with both arms raised (pose u, the
// placement rule in parts/3818.dat — tools/ldraw/minifig-asm.mjs), hands 3820, head 3626c and hair at (0, −24, 0), hips 3815 at (0, 32, 0),
// legs 3816 / 3817 on the hip pin at (0, 44, 0) turned 90° about x (feet forward). Seated, the legs' undersides (which take studs) are 21 LDU
// under the hip origin, so on a surface at height y the hips' origin sits at y + 1.05 studs.
const D2R = Math.PI / 180, mm = (A, B) => [0, 1, 2].flatMap((i) => [0, 1, 2].map((j) => A[i * 3] * B[j] + A[i * 3 + 1] * B[3 + j] + A[i * 3 + 2] * B[6 + j]));
const apv = (M, v) => [0, 1, 2].map((i) => M[i * 3] * v[0] + M[i * 3 + 1] * v[1] + M[i * 3 + 2] * v[2]);
const rX = (q) => [1, 0, 0, 0, Math.cos(q), -Math.sin(q), 0, Math.sin(q), Math.cos(q)], rZ = (q) => [Math.cos(q), -Math.sin(q), 0, Math.sin(q), Math.cos(q), 0, 0, 0, 1];
const TILT = 9.782 * D2R, UP = -135 * D2R;
const ARM = { R: { file: '3818', P: [-15.552, 9, 0], tilt: TILT, hand: [-23.6904, 26.774, -9.8982] }, L: { file: '3819', P: [15.552, 9, 0], tilt: -TILT, hand: [23.6904, 26.774, -9.8982] } };
/** the rider's parts as [id, colour, LDraw matrix, LDraw position] */
function riderParts(o) {
  const out = [['973', o.torso, [1, 0, 0, 0, 1, 0, 0, 0, 1], [0, 0, 0]], ['3815', o.legs, [1, 0, 0, 0, 1, 0, 0, 0, 1], [0, 32, 0]]];
  for (const leg of ['3816', '3817']) out.push([leg, o.legs, [1, 0, 0, 0, 0, 1, 0, -1, 0], [0, 44, 0]]);   // Rx(−90°): a foot at (0, 28, 0) goes to (0, 0, −28)
  for (const side of ['R', 'L']) { const S = ARM[side]; const armM = mm(rZ(S.tilt), rX(UP));
    const d = apv(rZ(-S.tilt), S.hand.map((v, i) => v - S.P[i])); const hp = apv(armM, d).map((v, i) => v + S.P[i]);
    out.push([S.file, o.torso, armM, S.P], ['3820', SKIN, mm(armM, rX(45 * D2R)), hp]); }
  out.push(['3626c', SKIN, [1, 0, 0, 0, 1, 0, 0, 0, 1], [0, -24, 0]], [o.hair[0], o.hair[1], [1, 0, 0, 0, 1, 0, 0, 0, 1], [0, -24, 0]]);
  return out;
}
/** seat a rider in a car (R, at: the car's rotation and local → frame map), hips over the well's row 0 facing the car's front (local −x) */
function rider(R, at, o) {
  const S3 = [1, 0, 0, 0, -1, 0, 0, 0, -1], toFront = [0, 0, -1, 0, 1, 0, 1, 0, 0];   // LDraw ↔ ours; RY(3): +z (the figure's front) → −x
  const hip = [0, -0.4 + 1.05, 0];                                                    // the well's top is 0.4 under the car origin
  for (const [id, col, M, p] of riderParts(o)) {
    const m = mm(toFront, mm(mm(S3, M), S3)); const q = apv(toFront, [p[0] / 20, -(p[1] - 32) / 20, -p[2] / 20]).map((v, i) => v + hip[i]);
    a.put(id, col, mm(R, m), at(q));
  }
}

// ---- West Coaster: 4 × curve 90° R12, 2 × S-ramp (9 plates over 16), 2 × straight 4; west turn high, east turn low
// curves: origin = centre of curvature, quarter NE at r 0; ends 12 out along the quarter's two axes. Ramp: origin = its high end's stud row,
// 0.5 in from the edge, running +x and dropping 3.6. Straight 4: origin centre, studs 1.5 either side.
const F = 1;                                     // the deck plates' top (plates): posts stand here, under a gap in the planks
const LOW = F + 8, HIGH = F + 17;                // track-top at a joint (= the pieces' stud base)
const RYm = (r) => { const c = [1, 0, -1, 0][r & 3], s = [0, 1, 0, -1][r & 3]; return [c, 0, s, 0, 1, 0, -s, 0, c]; };
const TW = -10, TE = 10;                         // turn centres
const nC0 = a.parts.length;
for (const [cx, y, rs] of [[TE, LOW, [0, 3]], [TW, HIGH, [1, 2]]]) for (const r of rs) a.put('25061', BLO, RYm(r), [cx, y * P, 0]);
for (const zc of [-12, 12]) {
  a.put('80562', BLO, RYm(0), [TW + 2, HIGH * P, zc]);
  a.put('34738', BLO, RYm(0), [TW + 4.5, HIGH * P, zc]);
}
// joints: a post of 2×2 round bricks (one colour, as the real columns) capped with a 2×2 round plate of the same colour, whose four studs take
// both track ends' tubes (each tube between two studs). v4 (lead review): the 2×4 cap plates showed bare studs beside the track, and a tile on
// the running surface would stop a car's keel, so only the two 4-stud straights (no tubes of their own) keep a 2×2 tile across their end studs.
const JOINTS = [[TW, -12, 'x', HIGH], [TW + 4, -12, 'x', HIGH], [TE, -12, 'x', LOW], [TE + 12, 0, 'z', LOW], [TE, 12, 'x', LOW], [TW + 4, 12, 'x', HIGH], [TW, 12, 'x', HIGH], [TW - 12, 0, 'z', HIGH]];
const POSTC = [RED, MAG, BGREEN, BLUE];
JOINTS.forEach(([jx, jz, dir, top], i) => {
  const c = POSTC[i % 4]; const n = (top - 2 - F) / 3;
  for (let k = 0; k < n; k++) a.up('3941', c, jx - 1, F + 3 * k, jz - 1);
  a.up('4032a', c, jx - 1, top - 2, jz - 1);
  if (jx === TW || jx === TW + 4) a.up('3068b', BLO, jx - 1, top, jz - 1);
  reserve(jx - 1, jz - 1, 2, 2);
});
// the train: two red cars (the real West Coaster's) on the low east turn's south-east quarter, tangent to the centreline, 42° apart (8.8
// studs of arc, a car is 7.05; nearer, their inner corners meet on the curve). Car origin 2.44 above the track's stud base: the LDraw bogie axle is 17.4 LDU below the car origin and its
// running wheels (r 13.4) sit on the rail tops 18 LDU above the stud base.
// r2 (Eric: the park read empty): one rider in each car, both arms up — the minifig seated the LDraw way (hips on the well's row 0, the legs
// turned 90° at the hip pin so the feet reach forward over row −1), a seat back on row 1 behind the hips, a tile on row 2.
const RIDERS = [{ torso: 322, legs: 272, hair: ['12890', BLACK] }, { torso: 15, legs: 379, hair: ['3901', 308] }];
const SKIN = 14;
for (const [n, deg] of [24, 66].entries()) { const t = (deg * Math.PI) / 180, c = Math.cos(t), s = Math.sin(t);
  const R = [c, 0, s, 0, 1, 0, -s, 0, c], o = [TE + 12 * s, LOW * P + 2.44, 12 * c]; a.put('26021c01', RED, R, o);
  const at = (v) => [0, 1, 2].map((i) => R[i * 3] * v[0] + R[i * 3 + 1] * v[1] + R[i * 3 + 2] * v[2] + o[i]);
  const Rz = [R[2], R[1], -R[0], R[5], R[4], -R[3], R[8], R[7], -R[6]];   // R · (quarter turn): a part's long x along the car's width
  a.put('3004', YEL, Rz, at([1, 0.8, 0])); a.put('3069b', YEL, Rz, at([2, -0.0, 0]));   // seat back (the photo's yellow seats) and the rear row tiled
  a.put('2431', BLACK, Rz, at([-2, 0.4, 0]));                          // the black nose: a 1×4 tile on the end row
  rider(R, at, RIDERS[n]);
}
const nCoaster = a.parts.length - nC0;

const out = a.write();
console.log(`la_park: ${a.parts.length} parts (wheel ${nWheel} first, coaster ${nCoaster} next)`, JSON.stringify(out.bom));
console.log('stands on cells (frame x0, z0, w, d):', JSON.stringify(stands));
