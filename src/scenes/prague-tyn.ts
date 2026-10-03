// Prague · Týn Church west front, round 1 (2026-10-02). Scheme v1 signed off by Eric: docs/countries/czechia.md §1.13.
import { Blueprint } from '../core/builder';
import { placer } from './singapore';
import { spire as spireAt } from './prague-lib';

// stone from tyn-from-square.jpg: grey-beige ashlar, darker with height (the upper stages are weathered); Tan is the warm accent, not a half
// judge r1: a random collage read wrong — the photo's shafts are one grey-beige ashlar field with the dark weathering on the corners and buttresses
const STONE_LOW = ['LightBluishGray', 'LightBluishGray', 'LightBluishGray', 'LightBluishGray', 'LightBluishGray', 'Tan', 'DarkTan'];
const STONE_HIGH = ['LightBluishGray', 'LightBluishGray', 'LightBluishGray', 'LightBluishGray', 'Tan', 'Tan', 'DarkTan'];
// Eric 2026-10-02: the spires are darker than Dark Bluish Gray — slate is near-black; the gallery and corbels stay dark grey stone
const SLATE = 'DarkBluishGray', ROOF = 'Black', GOLD = 'PearlGold';

/** Týn west front. Local frame: x 0..15 across the front (south tower x 0..5, the gap x 6..9, north tower x 10..15), towers z 6..11 with the
 *  front face at z 11 looking +z, the nave roof stub behind at z 0..5; galleries overhang one stud on every side. Plates from `y`:
 *  0–36 shaft · 36 band · 37–49 lower stage · 49 band · 50–59 upper stage · 59–62 corbels · 62 gallery · helmet, nine points, tip ≈ 96. */
export function tyn(bp: Blueprint, ox: number, y: number, oz: number, rot: number) {
  bp.tag = 'tyn'; const { part, vox, asm } = placer(bp, ox, oz, rot);
  // one course of stone round a W × D ring at y0: runs of 1–4 cells in one colour, so the packer lays real 1×N bricks
  const course = (x0: number, z0: number, W: number, D: number, y0: number, skip: (x: number, z: number) => boolean) => {
    const ring: [number, number][] = [];
    for (let x = x0; x < x0 + W; x++) ring.push([x, z0]);
    for (let z = z0 + 1; z < z0 + D; z++) ring.push([x0 + W - 1, z]);
    for (let x = x0 + W - 2; x >= x0; x--) ring.push([x, z0 + D - 1]);
    for (let z = z0 + D - 2; z > z0; z--) ring.push([x0, z]);
    const palette = y0 < 36 ? STONE_LOW : STONE_HIGH; const long = y0 < 36 ? 4 : 3;   // behind the houses the runs are long: fewer bricks where nobody looks
    let left = 0, color = palette[0];
    for (const [x, z] of ring) {
      if (left === 0) { left = long + Math.floor(bp.rand() * 3); color = bp.pick(palette); }
      left--; if (skip(x, z)) continue;
      const quoin = y0 >= 37 && (x === x0 || x === x0 + W - 1) && (z === z0 || z === z0 + D - 1);   // above the houses the corners are dressed stone: each shaft reads as its own prism
      for (let d = 0; d < 3; d++) vox('brick', x, y + y0 + d, z, quoin && W === 6 ? 'DarkTan' : color);
    }
  };
  const band = (x0: number, z0: number, W: number, D: number, y0: number) => { for (let x = x0; x < x0 + W; x++) for (let z = z0; z < z0 + D; z++) if (x === x0 || z === z0 || x === x0 + W - 1 || z === z0 + D - 1) vox('plate', x, y + y0, z, 'DarkTan'); };

  const Z0 = 6, Z1 = 11;   // tower depth rows; front face at Z1
  /** the four symmetric points of a square of side s whose min corner is (x0, z0) */
  const corners = (x0: number, z0: number, s: number): [number, number][] => [[x0, z0], [x0 + s - 1, z0], [x0, z0 + s - 1], [x0 + s - 1, z0 + s - 1]];
  /** a spire on the axis cell (x, z) from level h: `n` 1×1 round bricks, a cone, a gold ski pole sunk one plate into the cone's hole */
  const spire4 = (x: number, z: number, h: number, n: number) => { for (let k = 0; k < n; k++) part('round_1x1', x, y + h + 3 * k, z, ROOF); part('cone_1x1', x, y + h + 3 * n, z, ROOF); part('bar_3l', x, y + h + 3 * n - 1, z, GOLD); };   // a thin gold needle pushed down the cone's bar hole: the last two plates show

  for (const X of [0, 10]) {
    const inner = X === 0 ? 5 : 10;   // the face toward the gap is covered by the middle block below the gable
    const onFace = (x: number, z: number) => (z === Z1 || z === Z0) ? x - X : (x === X || x === X + 5) ? z - Z0 : -1;
    const window = (x: number, z: number) => onFace(x, z) === 2 || onFace(x, z) === 3;
    for (let c = 0; c < 12; c++) course(X, Z0, 6, 6, 3 * c, () => false);
    band(X, Z0, 6, 6, 36);
    // lower stage: a 2-wide black grille window on each free face at 40–43
    for (let c = 0; c < 4; c++) course(X, Z0, 6, 6, 37 + 3 * c, (x, z) => c === 1 && window(x, z) && x !== inner);
    part('plate_6x6', X, y + 49, Z0, 'DarkTan');   // a full floor: the louvres stand on it
    // upper stage: a round-topped frame with Reddish Brown louvres behind it on each free face (50–58), a stone plate above
    for (let c = 0; c < 3; c++) course(X, Z0, 6, 6, 50 + 3 * c, (x, z) => window(x, z) && x !== inner);
    // faces: front +z (rot 0), back −z (rot 2), the outer side (rot 1 east / 3 west); local min corners of each 2-wide piece
    const faces: { at: [number, number]; r: number; back: [number, number] }[] = [
      { at: [X + 2, Z1], r: 0, back: [X + 2, Z1 - 1] }, { at: [X + 2, Z0], r: 2, back: [X + 2, Z0 + 1] },
      X === 0 ? { at: [X, Z0 + 2], r: 3, back: [X + 1, Z0 + 2] } : { at: [X + 5, Z0 + 2], r: 1, back: [X + 4, Z0 + 2] },
    ];
    for (const f of faces) {
      part('brick_grille_1x2', f.at[0], y + 40, f.at[1], 'Black', f.r);
      part('window_round_1x2x3', f.at[0], y + 50, f.at[1], SLATE, f.r);
      part('brick_grille_1x2', f.back[0], y + 50, f.back[1], 'ReddishBrown', f.r); part('brick_grille_1x2', f.back[0], y + 53, f.back[1], 'ReddishBrown', f.r); part('plate_1x2', f.back[0], y + 56, f.back[1], 'ReddishBrown', f.r + 1); part('plate_1x2', f.back[0], y + 57, f.back[1], 'ReddishBrown', f.r + 1);
      part('plate_1x2', f.at[0], y + 58, f.at[1], 'LightBluishGray', f.r + 1);   // plate_1x2 is 1 × 2 canonically: a quarter turn lays it along the face
    }
    // corbels: 45° inverted slopes on the four middle cells of each face carry the gallery's overhang; stone 1×1 on the corners
    for (let k = 1; k <= 4; k++) { part('slope_inv_1x2', X + k, y + 59, Z1, SLATE, 0); part('slope_inv_1x2', X + k, y + 59, Z0 - 1, SLATE, 2); if (X === 0) part('slope_inv_1x2', X - 1, y + 59, Z0 + k, SLATE, 3); else part('slope_inv_1x2', X + 5, y + 59, Z0 + k, SLATE, 1); }   // no corbels over the gable side: the gable's pinnacles stand there
    for (const [cx, cz] of corners(X, Z0, 6)) part('brick_1x1', cx, y + 59, cz, 'DarkTan');
    // gallery: one 8 × 8 plate, a parapet of post / 1×4 fence / post on each side, corner turrets on the overhang corners
    part('plate_8x8', X - 1, y + 62, Z0 - 1, SLATE);
    for (const [px, pz] of [[X, Z0 - 1], [X + 5, Z0 - 1], [X, Z1 + 1], [X + 5, Z1 + 1], [X - 1, Z0], [X - 1, Z1], [X + 6, Z0], [X + 6, Z1]] as [number, number][]) part('roundplate_1x1', px, y + 63, pz, SLATE), part('roundplate_1x1', px, y + 64, pz, SLATE), part('roundplate_1x1', px, y + 65, pz, SLATE);
    part('fence_1x4', X + 1, y + 63, Z1 + 1, SLATE, 0); part('fence_1x4', X + 1, y + 63, Z0 - 1, SLATE, 0); part('fence_1x4', X - 1, y + 63, Z0 + 1, SLATE, 1); part('fence_1x4', X + 6, y + 63, Z0 + 1, SLATE, 1);
    for (const [cx, cz] of corners(X - 1, Z0 - 1, 8)) spire4(cx, cz, 63, 1);            // outer corner turrets, tip ≈ 75
    for (const [cx, cz] of corners(X, Z0, 6)) spire4(cx, cz, 63, 4);                    // inner ring on the walkway corners, tip ≈ 84
    // helmet on the tower's axis: four 75° corner slopes (4 → 2), two 2×2 round bricks, the 75° peak (2 → its centre stud), 1×1, cone, gold
    part('slope75_corner_2x2x3', X + 1, y + 63, Z0 + 1, ROOF, 2); part('slope75_corner_2x2x3', X + 3, y + 63, Z0 + 1, ROOF, 1);
    part('slope75_corner_2x2x3', X + 1, y + 63, Z0 + 3, ROOF, 3); part('slope75_corner_2x2x3', X + 3, y + 63, Z0 + 3, ROOF, 0);
    part('roundbrick_2x2', X + 2, y + 72, Z0 + 2, ROOF); part('cone_2x2', X + 2, y + 75, Z0 + 2, ROOF);   // a short 2-wide drum, then 2 → 1 in one taper; the cone's centre stud is on the axis
    axis(bp, ox, oz, rot, X + 3, Z0 + 3, y + 81);
  }

  // the middle block between the towers (x 6..9): flush to 36 behind the houses, then set back one stud so the two shafts read as two, with a
  // tall window; above it the steep triangular gable (Eric 2026-10-02: "图里的三角形"). The gable is the front end of the steep nave roof:
  // 75° slopes back to back (4 → 2) under a 75° peak (2 → point) — the side profile of those slopes is the triangle — in dark stone at the
  // front, near-black slate behind; slender pinnacles at its two feet, the gilded Madonna's aureole hung on side studs in front of it,
  // a pinnacle with a gold needle on the apex.
  const F = Z1 - 1;   // the recessed front row
  for (let c = 0; c < 12; c++) course(6, Z0, 4, 6, 3 * c, () => false);
  const floor4 = (yy: number) => { part('plate_4x4', 6, y + yy, Z0, 'DarkTan'); part('plate_1x4', 6, y + yy, F, 'DarkTan', 1); };
  floor4(36);
  for (let x = 6; x <= 9; x++) vox('plate', x, y + 36, Z1, 'DarkTan');   // the ledge in front of the recess
  for (let c = 0; c < 4; c++) course(6, Z0, 4, 5, 37 + 3 * c, (x, z) => c > 0 && z === F && (x === 7 || x === 8));
  part('window_round_1x2x3', 7, y + 40, F, SLATE); part('plate_1x2', 7, y + 48, F, 'DarkTan', 1);
  for (let k = 0; k < 4; k++) part('brick_1x2', 7, y + 37 + 3 * k, F - 1, 'Black', 1);   // dark glass behind the window
  floor4(49);
  // nave behind: stone walls to 48, two plates of floor, then the same roof
  for (let c = 0; c < 16; c++) course(6, 0, 4, 6, 3 * c, () => false);
  part('plate_4x6', 6, y + 48, 0, 'DarkTan'); part('plate_4x6', 6, y + 49, 0, 'DarkTan');
  for (let z = 0; z <= F - 1; z++) {
    const c = z === F - 1 ? SLATE : ROOF;   // the gable's face is stone; the roof behind it slate
    part('slope75_2x1x3', 6, y + 50, z, c, 3); part('slope75_2x1x3', 8, y + 50, z, c, 1);
  }
  for (let z = 0; z <= F - 2; z += 2) part('slope75_peak_2x2x2', 7, y + 59, z, z === F - 2 ? SLATE : ROOF);
  axis(bp, ox, oz, rot, 8, F - 1, y + 65, SLATE);
  // in front of the gable: two pinnacles at its feet and the Madonna's aureole on a 1×2 brick between them
  spireAt(part, 6, y + 50, F, 1, SLATE); spireAt(part, 9, y + 50, F, 1, SLATE);
  part('brick_1x2', 7, y + 50, F, SLATE, 1); asm('tyn_medallion', 7, y + 53, F, SLATE);
  bp.tag = '';
}

/** The helmet's needle on the axis point between four studs: a 1×1 round brick on the peak's centre stud, a cone, the gold ski pole.
 *  (lx, lz) is the local grid corner the axis passes through. */
function axis(bp: Blueprint, ox: number, oz: number, rot: number, lx: number, lz: number, y: number, color = 'Black') {
  const r = rot & 3; const [dx, dz] = r === 0 ? [lx, lz] : r === 1 ? [lz, -lx] : r === 2 ? [-lx, -lz] : [-lz, lx];
  const cx = ox + dx - 0.5, cz = oz + dz - 0.5;
  bp.part('round_1x1', cx, y, cz, color); bp.part('cone_1x1', cx, y + 3, cz, color); bp.part('bar_3l', cx, y + 2, cz, 'PearlGold');
}
