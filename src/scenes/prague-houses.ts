// Prague · the house row in front of Týn and the Old Town Hall wing, round 1 (2026-10-02). Scheme: docs/countries/czechia.md §1.16, §1.18.
import { Blueprint } from '../core/builder';
import { placer } from './singapore';
import { ROOF } from './prague-lib';
import '../core/catalog-cz-houses';

const WHITE = 'White', ORANGE = 'DarkOrange';
const BELL = ['LightBluishGray', 'LightBluishGray', 'LightBluishGray', 'DarkBluishGray', 'LightBluishGray', 'LightBluishGray'];   // the Stone Bell's grey Gothic ashlar
const HALL = ['Tan', 'Tan', 'DarkTan', 'Tan', 'Tan', 'DarkTan'];                                            // the Hall's warm sandstone

/** The row in front of Týn, real order, left to right: House at the Stone Bell (x 0..5), Týn School (x 6..15), House at the White Unicorn
 *  (x 16..23); all 8 deep (z 0..7), fronts on z 7 facing +z, string courses projecting to z 8. Plates from `y`: arcade 0–18, storeys 19–27
 *  and 28–36, ceiling and cornice 36, roofs above (ridges ≈ 47 / 41 / 43). The backs of the two pastel houses are hidden by Týn and not built. */
export function houseRow(bp: Blueprint, ox: number, y: number, oz: number, rot: number) {
  bp.tag = 'houses'; const P = placer(bp, ox, oz, rot); const { part } = P; const vox = (x: number, yy: number, z: number, c: string) => P.vox('brick', x, y + yy, z, c);
  const kit = tools(bp, P, y);

  // ---- House at the Stone Bell: grey stone tower-house, Gothic portal, paired pointed windows on two floors, a steep black slate hip ----
  const bell = kit.mottle(BELL);
  for (let yy = 0; yy < 18; yy++) for (let x = 0; x <= 5; x++) for (let z = 0; z <= 7; z++) {
    const edge = x === 0 || x === 5 || z === 0 || z === 7; if (!edge) continue;
    if (z === 7 && x >= 1 && x <= 4) continue;   // the portal
    vox(x, yy, z, bell(x, yy, z));
  }
  part('doorframe_1x4x6', 1, y, 7, 'DarkBluishGray', 0); part('door_1x4x6', 1, y, 7, 'DarkBrown', 0);
  part('plate_6x8', 0, y + 18, 0, 'DarkBluishGray');
  // two floors, each a pair of tall Gothic lights side by side in the stone face (round-topped frames, dark glass behind)
  for (const wy of [19, 28]) for (const wx of [1, 3]) { part('window_round_1x2x3', wx, y + wy, 7, 'DarkBluishGray', 0); part('brick_1x2', wx, y + wy, 6, 'Black', 1); part('brick_1x2', wx, y + wy + 3, 6, 'Black', 1); part('plate_1x2', wx, y + wy + 6, 6, 'Black', 1); part('plate_1x2', wx, y + wy + 7, 6, 'Black', 1); }
  // the course between the floors: a 2×2 plate over each lower light, resting on the dark backing behind it (z 6) — the round-topped frame
  // has only one centre stud, so the stone and the upper light are carried by the plate, not by the frame
  for (const wx of [1, 3]) part('plate_2x2', wx, y + 27, 6, 'LightBluishGray');
  for (let yy = 19; yy < 37; yy++) {
    for (let z = 0; z < 7; z++) { vox(0, yy, z, bell(0, yy, z)); vox(5, yy, z, bell(5, yy, z)); } for (let x = 1; x <= 4; x++) vox(x, yy, 0, bell(x, yy, 0));
    for (const x of [0, 5]) vox(x, yy, 7, bell(x, yy, 7));
    if (yy === 36) for (let x = 1; x <= 4; x++) vox(x, yy, 7, bell(x, yy, 7));   // the stone course over the upper pair of lights
  }
  part('plate_6x8', 0, y + 37, 0, 'DarkBluishGray');
  // a steep black slate roof: one ring of 75° slopes with double-convex corners (the Týn helmet's mould), the 4 × 6 top closed with tiles
  kit.ring('slope75_corner_2x2x3', 'slope75_2x1x3', 2, 0, 0, 6, 8, 38, ROOF);
  part('tile_2x4', 1, y + 47, 1, ROOF, 0); part('tile_2x4', 3, y + 47, 1, ROOF, 0); part('tile_2x2', 1, y + 47, 5, ROOF); part('tile_2x2', 3, y + 47, 5, ROOF);

  // ---- Týn School: cream plaster, two white arches, three white-framed windows a storey, a crown of five round gablets ----
  kit.arcade(6, 15, 'Tan', [7, 11], [9]);
  kit.storeys(6, 15, 'Tan', [7, 10, 13], { quoins: true });
  kit.sideWall(15, 'Tan');
  kit.ceiling(6, 15, 36, WHITE);
  // the crown, symmetric on the 10-wide front: a round-topped gablet in the middle (a white 1×6 curved-top arch over a cream field, a
  // white spike finial on its axis through a jumper) and a white scroll on each shoulder (a curved slope falling outward from a cream base)
  part('arch_round_1x6x2', 8, y + 37, 7, WHITE, 0); part('brick_1x4', 9, y + 37, 6, 'Tan', 1); part('plate_1x4', 9, y + 40, 6, 'Tan', 1); part('tile_1x4', 9, y + 41, 6, 'Tan', 1);   // the cream field fills the arch's opening from behind, a tile on top
  kit.strip('tile', 6, 8, 6, 1, 37, WHITE); kit.strip('tile', 13, 15, 6, 1, 37, WHITE);
  part('jumper_1x2', 10, y + 43, 7, WHITE); part('roundplate_1x1', 10.5, y + 44, 7, WHITE); part('cone_1x1', 10.5, y + 45, 7, WHITE);
  for (const [sx, r] of [[6, 3], [14, 1]] as [number, number][]) { part('brick_1x2', sx, y + 37, 7, 'Tan', 1); part('curve_1x2', sx, y + 40, 7, WHITE, r); }
  // the roof one row back, behind the crown's field row (z 6): slopes z 0..5, ridge tiles on z 2..3
  for (let x = 6; x <= 14; x += 2) { part('slope_2x3', x, y + 37, 3, ORANGE, 0); part('slope_2x3', x, y + 37, 0, ORANGE, 2); }
  part('tile_2x4', 6, y + 40, 2, ORANGE, 1); part('tile_2x4', 10, y + 40, 2, ORANGE, 1); part('tile_2x2', 14, y + 40, 2, ORANGE);

  // ---- House at the White Unicorn: Light Nougat, two arches, two tall windows a storey with small pediments, the house sign, a hip roof ----
  // warmer salmon-ochre than the Týn School's cream; the Týn School's white pilaster at the party wall separates the two
  kit.arcade(16, 23, 'Nougat', [16, 20], [18]);
  kit.storeys(16, 23, 'Nougat', [17, 21], { sign: 19, pediments: true });
  kit.sideWall(23, 'Nougat');
  kit.ceiling(16, 23, 36, WHITE);
  // a Baroque gable facing the square: white scrolls (curved slopes) on the shoulders, a Nougat field with a small dark attic light, a
  // pediment step with white cheese slopes, a white finial on the axis — in front of a pitched Dark Orange roof whose ridge runs back
  part('curve_1x2', 16, y + 37, 7, WHITE, 3); part('curve_1x2', 22, y + 37, 7, WHITE, 1);
  for (let x = 18; x <= 21; x++) { P.vox('plate', x, y + 37, 7, 'Nougat'); P.vox('plate', x, y + 38, 7, 'Nougat'); }
  part('brick_1x1', 18, y + 39, 7, 'Nougat'); part('brick_grille_1x2', 19, y + 39, 7, 'Black'); part('brick_1x1', 21, y + 39, 7, 'Nougat');
  part('plate_1x4', 18, y + 42, 7, WHITE, 1);
  part('cheese_1x1', 18, y + 43, 7, WHITE, 3); part('plate_1x2', 19, y + 43, 7, 'Nougat', 1); part('cheese_1x1', 21, y + 43, 7, WHITE, 1);
  part('jumper_1x2', 19, y + 44, 7, WHITE); part('pyramid_1x1', 19.5, y + 45, 7, WHITE);   // on the jumper's centre stud: the gable's axis
  for (let z = 1; z <= 6; z++) { part('slope_1x3', 16, y + 37, z, ORANGE, 3); part('slope_1x3', 21, y + 37, z, ORANGE, 1); for (const x of [19, 20]) for (let d = 0; d < 3; d++) P.vox('brick', x, y + 37 + d, z, ORANGE); }
  for (const z of [1, 3, 5]) part('ridge_2x2', 19, y + 40, z, ORANGE, 1);
  bp.tag = '';
}

/** The Old Town Hall wing at the right end of the row (x 24..33 in the row's frame, z 0..7): sandstone, two pointed windows below, three
 *  white-framed windows above, a hip roof (ridge ≈ 34). The clock tower stands in front of its left part (the Orloj element). */
export function hallWing(bp: Blueprint, ox: number, y: number, oz: number, rot: number) {
  bp.tag = 'hallwing'; const P = placer(bp, ox, oz, rot); const { part } = P; const vox = (x: number, yy: number, z: number, c: string) => P.vox('brick', x, y + yy, z, c);
  const kit = tools(bp, P, y); const stone = kit.mottle(HALL);
  const X0 = 24, X1 = 33;
  const front = (x: number, yy: number) => (yy >= 3 && yy < 12 && ((x >= 25 && x <= 27) || (x >= 30 && x <= 32))) || (yy >= 15 && yy < 21 && [25, 26, 28, 29, 31, 32].includes(x));
  const east = (z: number, yy: number) => yy >= 15 && yy < 21 && [1, 2, 5, 6].includes(z);
  for (let yy = 0; yy < 27; yy++) for (let x = X0; x <= X1; x++) for (let z = 0; z <= 7; z++) {
    const edge = x === X0 || x === X1 || z === 0 || z === 7; if (!edge) continue;
    if (z === 7 && front(x, yy)) continue; if (x === X1 && z > 0 && z < 7 && east(z, yy)) continue;
    vox(x, yy, z, stone(x, yy, z));
  }
  for (const x of [25, 30]) {
    part('arch_pointed_1x3x3', x, y + 3, 7, 'DarkTan', 1); for (let k = 0; k < 4; k++) part('brick_1x3', x, y + 3 * k, 6, 'Black', 1);   // dark glass behind the whole opening
    for (let c = x; c <= x + 2; c++) { P.vox('plate', c, y, 7, 'DarkTan'); P.vox('plate', c, y + 1, 7, 'DarkTan'); P.vox('tile', c, y + 2, 7, 'DarkTan'); }   // a smooth sill under the opening
  }
  for (const x of [25, 28, 31]) { part('window_1x2x2', x, y + 15, 7, WHITE, 0); part('glass_1x2x2', x, y + 15, 7, 'TransBlack', 0); }
  for (const z of [1, 5]) { part('window_1x2x2', X1, y + 15, z, WHITE, 1); part('glass_1x2x2', X1, y + 15, z, 'TransBlack', 1); }
  // dark rooms behind the upper windows, hanging from the roof plates
  for (const x of [25, 28, 31]) for (let k = 0; k < 4; k++) part('brick_1x2', x, y + 15 + 3 * k, 6, 'Black', 1);
  for (let k = 0; k < 4; k++) { part('brick_1x2', X1 - 1, y + 15 + 3 * k, 1, 'Black', 0); part('brick_1x1', X1 - 1, y + 15 + 3 * k, 5, 'Black'); }   // (z 6 is the front room's)
  kit.ceiling(X0, X1, 27, 'DarkTan');
  kit.hip33(X0, 0, 10, 8, 28, 'DarkOrange');
  bp.tag = '';
}

type Placer = ReturnType<typeof placer>;
function tools(bp: Blueprint, P: Placer, y: number) {
  const { part } = P; const vox = (x: number, yy: number, z: number, c: string) => P.vox('brick', x, y + yy, z, c);
  /** a strip of plates along x at row z0 (depth 1 or 2 along z), lengths 8 / 6 / 4 / 3 / 2 / 1 */
  const strip = (kind: 'plate' | 'tile', x0: number, x1: number, z0: number, depth: 1 | 2, yy: number, color: string) => {
    let x = x0; while (x <= x1) {
      const left = x1 - x + 1; const L = [8, 6, 4, 3, 2, 1].find((n) => n <= left)!;
      const a = Math.min(L, depth), b = Math.max(L, depth); const key = `${kind}_${a}x${b}`;
      part(key, x, y + yy, z0, color, L > depth ? 1 : 0); x += L;
    }
  };
  /** plates running front to back (z 0..7) across x0..x1 at level yy: every plate rests on the front wall, so none floats */
  /** the top plate course, front to back, shifted one row forward so its front edge is a cornice one stud proud (z 8) with a tile cap */
  const ceiling = (x0: number, x1: number, yy: number, color: string) => { let x = x0; while (x <= x1) { const w = x1 - x + 1 >= 2 ? 2 : 1; part(`plate_${w}x8`, x, y + yy, 1, color, 0); x += w; } strip('tile', x0, x1, 8, 1, yy + 1, color); };
  /** colour per run of 2–4 cells along a course, one colour per brick height, so the packer lays real 1×N bricks */
  const mottle = (palette: string[]) => { const memo = new Map<string, string>(); return (x: number, yy: number, z: number) => {
    const course = Math.floor(yy / 3); const run = Math.floor((x + z * 7 + course * 3) / 3); const k = `${course},${run},${x === 0 || x === 5 ? 'side' : z}`;
    if (!memo.has(k)) memo.set(k, bp.pick(palette)); return memo.get(k)!; }; };
  /** an arcade house from x0 to x1: White 1×4×2 arches starting at `arches` on piers (0–12) in the plaster colour, a three-deep walkway behind
   *  (a minifig with its hands needs three), a Dark Tan rear wall at z 3 with a door, a White ceiling of front-to-back plates that also makes the first string course (projecting to z 8) */
  const arcade = (x0: number, x1: number, color: string, arches: number[], doors: number[]) => {
    const piers = new Set<number>(); for (const a of arches) { piers.add(a); piers.add(a + 3); }
    for (let x = x0; x <= x1; x++) {
      const end = !piers.has(x) && !arches.some((a) => x > a && x < a + 3);   // a wall cell beside the arches (the Týn School's end bays)
      if (piers.has(x)) for (let yy = 0; yy < 12; yy++) vox(x, yy, 7, color);
      if (end) for (let yy = 0; yy < 18; yy++) vox(x, yy, 7, color);
      for (let yy = 0; yy < 18; yy++) if (!doors.some((d) => x >= d && x < d + 4)) vox(x, yy, 3, 'DarkTan');
    }
    for (const a of arches) part('arch_1x4x2_ld', a, y + 12, 7, WHITE, 0);
    for (const d of doors) { part('doorframe_1x4x6', d, y, 3, 'DarkTan', 0); part('door_1x4x6', d, y, 3, 'ReddishBrown', 0); }
    let x = x0; while (x <= x1) { const w = x1 - x + 1 >= 2 ? 2 : 1; part(`plate_${w}x6`, x, y + 18, 3, WHITE, 0); x += w; }
    strip('tile', x0, x1, 8, 1, 19, WHITE);
  };
  /** two storeys of plaster with white 1×2×2 window frames starting at `wins` (19–25, 28–34), a projecting white string course at 27 */
  const storeys = (x0: number, x1: number, color: string, wins: number[], o: { sign?: number; pediments?: boolean; quoins?: boolean } = {}) => {
    const inWin = (x: number) => wins.some((w) => x === w || x === w + 1);
    for (const base of [19, 28]) {
      for (let x = x0; x <= x1; x++) for (let yy = base; yy < base + 8; yy++) {
        if (inWin(x) && yy < base + (o.pediments ? 8 : 6)) continue;   // the frame (6), and the pediment (2) on the White Unicorn
        if (o.sign !== undefined && base === 19 && (x === o.sign || x === o.sign + 1) && yy < base + 3) continue;
        vox(x, yy, 7, o.quoins && x === x1 ? WHITE : color);   // a white pilaster on the party-wall side: the break between the two houses
      }
      // a white frame and dark glass; a small white pediment over each on the White Unicorn
      for (const w of wins) {
        part('window_1x2x2', w, y + base, 7, WHITE, 0); part('glass_1x2x2', w, y + base, 7, 'TransBlack', 0);
        if (o.pediments) { part('cheese_1x1', w, y + base + 6, 7, WHITE, 3); part('cheese_1x1', w + 1, y + base + 6, 7, WHITE, 1); }
        // a dark room behind the glass: the lower one stands on the arcade ceiling, the upper one hangs from the cornice plates
        part('brick_1x2', w, y + base, 6, 'Black', 1); part('brick_1x2', w, y + base + 3, 6, 'Black', 1); part('plate_1x2', w, y + base + 6, 6, 'Black', 1); part('plate_1x2', w, y + base + 7, 6, 'Black', 1);
      }
    }
    if (o.sign !== undefined) part('brick_1x2', o.sign, y + 19, 7, 'DarkRed', 3, 'sign_unicorn');
    strip('plate', x0, x1, 7, 2, 27, WHITE); strip('tile', x0, x1, 8, 1, 28, WHITE);
  };
  /** the side wall at x from the arcade ceiling to the cornice; below the ceiling a pier behind the rear wall carries it */
  const sideWall = (x: number, color: string) => { for (let yy = 0; yy < 18; yy++) for (let z = 0; z < 3; z++) vox(x, yy, z, 'DarkTan'); for (let z = 0; z < 3; z++) vox(x, 18, z, color); for (let yy = 19; yy < 36; yy++) for (let z = 1; z < 7; z++) vox(x, yy, z, color); };   // z 1..6 above the arcade: the cornice plates (z 1..8) close its top
  /** four symmetric corners (hipCorners: SE 0, NE 1, NW 2, SW 3) */
  const corners = (key: string, s: number, x0: number, z0: number, W: number, D: number, yy: number, color: string) => {
    part(key, x0 + W - s, y + yy, z0 + D - s, color, 0); part(key, x0 + W - s, y + yy, z0, color, 1); part(key, x0, y + yy, z0, color, 2); part(key, x0, y + yy, z0 + D - s, color, 3);
  };
  /** one hip ring of side slopes `side` (1 wide, `s` deep) with corners `corner` (s × s) on a W × D footprint */
  const ring = (corner: string, side: string, s: number, x0: number, z0: number, W: number, D: number, yy: number, color: string) => {
    corners(corner, s, x0, z0, W, D, yy, color);
    for (let x = x0 + s; x < x0 + W - s; x++) { part(side, x, y + yy, z0 + D - s, color, 0); part(side, x, y + yy, z0, color, 2); }
    for (let z = z0 + s; z < z0 + D - s; z++) { part(side, x0, y + yy, z, color, 3); part(side, x0 + W - s, y + yy, z, color, 1); }
  };
  /** 45° hip: rings of 2×1 slopes with double-convex corners stepping in one stud per brick, a 2-wide ridge on top */
  const hip45 = (x0: number, z0: number, W: number, D: number, yy: number, color: string) => {
    while (W > 2 && D > 2) {
      corners('slope_corner_2x2', 2, x0, z0, W, D, yy, color);
      for (let x = x0 + 2; x < x0 + W - 2; x++) { part('slope_1x2', x, y + yy, z0 + D - 2, color, 0); part('slope_1x2', x, y + yy, z0, color, 2); }
      for (let z = z0 + 2; z < z0 + D - 2; z++) { part('slope_1x2', x0, y + yy, z, color, 3); part('slope_1x2', x0 + W - 2, y + yy, z, color, 1); }
      x0++; z0++; W -= 2; D -= 2; yy += 3;
    }
    if (W === 2 && D === 4) part('ridge_4x2', x0, y + yy, z0, color, 1); else if (W === 2 && D === 2) part('ridge_2x2', x0, y + yy, z0, color);
  };
  /** 33° hip: one ring of 3×1 slopes with 3×3 corners; the centre left open is filled with a brick course and a double slope ridge */
  const hip33 = (x0: number, z0: number, W: number, D: number, yy: number, color: string) => {
    corners('slope_corner_3x3', 3, x0, z0, W, D, yy, color);
    for (let x = x0 + 3; x < x0 + W - 3; x++) { part('slope_1x3', x, y + yy, z0 + D - 3, color, 0); part('slope_1x3', x, y + yy, z0, color, 2); }
    for (let z = z0 + 3; z < z0 + D - 3; z++) { part('slope_1x3', x0, y + yy, z, color, 3); part('slope_1x3', x0 + W - 3, y + yy, z, color, 1); }
    const cw = W - 6, cd = D - 6; if (cw <= 0 || cd <= 0) return;
    // the side slopes' stud rows round the centre are capped with tiles, so the hip reads finished from above
    for (let x = x0 + 3; x < x0 + W - 3; x++) { part('tile_1x1', x, y + yy + 3, z0 + D - 3, color); part('tile_1x1', x, y + yy + 3, z0 + 2, color); }
    for (let z = z0 + 3; z < z0 + D - 3; z++) { part('tile_1x1', x0 + 2, y + yy + 3, z, color); part('tile_1x1', x0 + W - 3, y + yy + 3, z, color); }
    for (let x = x0 + 3; x < x0 + 3 + cw; x++) for (let z = z0 + 3; z < z0 + 3 + cd; z++) for (let d = 0; d < 3; d++) vox(x, yy + d, z, color);
    if (cw === 2 && cd === 2) part('ridge_2x2', x0 + 3, y + yy + 3, z0 + 3, color); else if (cw === 4 && cd === 2) part('ridge_4x2', x0 + 3, y + yy + 3, z0 + 3, color, 0);
  };
  return { strip, ceiling, mottle, arcade, storeys, sideWall, ring, hip45, hip33 };
}
