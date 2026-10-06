// Germany · Neuschwanstein Castle (2026-10-05, round 1: massing, towers, roofs, windows). Scheme: docs/countries/germany.md §1.3 / §1.5,
// modelled on LEGO 21063 at about 1.25 × its size. Approved by Eric with the research page ("按照你的推荐来").
import { Blueprint } from '../core/builder';
import { placer } from './singapore';
import { mason } from './de-mason';

const WALL = 'White', STONE = 'LightBluishGray', GOLD = 'Tan', GLASS = 'TransBlack';
/** castle colours (Eric 2026-10-06: the real castle reads blue-grey in sun — slate roofs with a blue cast, teal-patinated lower roofs, Tan
 *  sandstone trims, orange-gold dormer faces); the sample scene renders variants side by side */
export const NS_COL = { roof: 'Black', spire: 'Black', lower: 'Black', gate: 'Black', trim: 'DarkBluishGray', dormer: 'DarkTan' };   // Eric 2026-10-06 (second note): Sand Blue read as a toy — use 21063's own palette: black slate roofs and cones (black renders as a deep blue-black here, the sunlit slate), dark grey string courses, Dark Tan dormers, Tan galleries, Dark Red gatehouse
export const NS_BRICK = { color: 'DarkRed' };   // the gatehouse's red brick: 21063's colour (Eric: use the official palette)

/** Neuschwanstein along its ridge. Local frame: x 0..63 west → east (the Palas at the west end, the gatehouse at the east), z 0..21 north →
 *  south, the south front toward +z (the camera, as seen from the Marienbrücke). `y` is the castle floor (the top of the crag).
 *  Palas x 0..23 × z 6..15, five storeys to the cornice at 35, a 45° slate roof to the ridge at 54; the south stair tower on its south front
 *  (x 12..13), the north stair tower behind it (x 7..8) rising to the needle spire. Upper courtyard x 24..40 with the Bower on its south side
 *  and the Knights' house on its north side, the square tower at x 37..40 × z 2..5; lower courtyard x 41..53 behind a curtain wall; the
 *  gatehouse x 54..63. */
export function neuschwanstein(bp: Blueprint, ox: number, y: number, oz: number) {
  bp.tag = 'castle'; const { part } = placer(bp, ox, oz, 0);
  const EDGE = 'DarkBluishGray', ROOF = NS_COL.roof, SPIRE = NS_COL.spire, LOW = NS_COL.lower, GATE = NS_COL.gate, TRIM = NS_COL.trim, DORMER = NS_COL.dormer;
  const m = mason(part, y);

  // ---- Palas ---------------------------------------------------------------------------------------------------------------------------
  // storeys: the ground storey 6 plates (window row 3 + arch row 3), the four above 7 (a band plate, then the same); bands in stone at 6 and 27
  m.shell(0, 23, 6, 15, 0, 34, WALL);
  const SW = [0, 7, 14, 21, 28];   // window row base of each storey
  for (const [h, c] of [[6, TRIM], [13, WALL], [20, WALL], [27, TRIM], [34, TRIM]] as [number, string][]) {
    m.plates(0, 23, 6, 6, h, c); m.plates(0, 23, 15, 15, h, c); m.plates(0, 0, 7, 14, h, c); m.plates(23, 23, 7, 14, h, c);
  }
  for (const h of SW) {
    m.windows('x', 15, 1, [2, 4, 7, 9, 16, 18, 20], h, GLASS, WALL);   // south front; x 10..15 stays solid behind the south stair tower
    m.windows('x', 6, -1, [3, 5, 11, 14, 16, 18, 20], h, GLASS, WALL);  // north front; x 6..9 behind the north stair tower
    if (h < 14 || h > 21) m.windows('z', 0, -1, [8, 10, 12], h, GLASS, WALL);   // west gable (storeys 2–3 sit behind the balcony)
    m.windows('z', 23, 1, [8, 10, 12], h, GLASS, WALL);                 // east gable (the courtyard side)
  }
  // the two-storey balcony on the west front over the Alpsee: a Tan oriel two studs deep on a bracket plate, two arched openings a storey
  m.plates(-2, 0, 7, 14, 13, GOLD);
  m.wall(-2, -2, 7, 14, 14, 28, GOLD); m.wall(-1, -1, 7, 7, 14, 28, GOLD); m.wall(-1, -1, 14, 14, 14, 28, GOLD); m.plates(-2, -2, 7, 14, 20, GOLD);
  for (const h of [14, 21]) m.windows('z', -2, -1, [9, 12], h, GLASS, GOLD, 14);
  m.plates(-2, -1, 7, 14, 28, GOLD); for (let z = 7; z <= 14; z++) part('cheese_1x1', -2, y + 29, z, GOLD, 3);
  // white buttress fins against the foot of the south front (21063), on piers and the two corners
  for (const x of [0, 6, 10, 15, 19, 23]) part('slope75_2x1x3', x, y, 16, WALL, 0);

  // roof: the eaves plate one stud out north and south, five courses of 45° slopes a side, a double-slope ridge; the two gable columns are
  // white so the gables read as walls with the roof between them
  const SOUTH_TOWER = [12, 13], NORTH_TOWER = [7, 8];
  const CHIMNEY: [number, number][] = [[5, 12], [18, 12], [11, 9]];   // white stacks standing in the top course of slopes
  const E = 35;
  for (let x = 0; x <= 23; x++) for (let z = 5; z <= 16; z++) {
    if (z === 16 && SOUTH_TOWER.includes(x)) continue; if (z === 5 && NORTH_TOWER.includes(x)) continue;
    m.plates(x, x, z, z, E, x === 0 || x === 23 ? WALL : z === 5 || z === 16 ? EDGE : ROOF);   // the eaves line in dark grey frames the slate (judge r1: the roof lacked depth against the white)
  }
  for (let k = 0; k < 5; k++) {
    const h = E + 1 + 3 * k;
    for (let x = 0; x <= 23; x++) {
      const c = x === 0 || x === 23 ? WALL : ROOF;
      const dormer = (k === 1 && [3, 8, 17, 21].includes(x)) || (k === 3 && [6, 15, 20].includes(x));   // two staggered rows (judge r1)
      if (k === 4 && CHIMNEY.some(([cx, cz]) => cx === x && cz === 12)) m.wall(x, x, 11, 11, h, h + 3, c);
      else if (!(k === 0 && x >= 11 && x <= 14)) {
        if (dormer) { m.wall(x, x, 15 - k, 16 - k, h, h + 3, DORMER); part('pyramid_1x1', x, y + h + 3, 16 - k, ROOF); m.wall(x, x, 15 - k, 15 - k, h, h + 3, c); }
        else part('slope_1x2', x, y + h, 15 - k, c, 0);
      }
      if (k === 4 && CHIMNEY.some(([cx, cz]) => cx === x && cz === 9)) m.wall(x, x, 10, 10, h, h + 3, c);
      else if (!(k === 0 && NORTH_TOWER.includes(x))) {
        if ((k === 1 && [3, 13, 17].includes(x)) || (k === 3 && [6, 15, 19].includes(x))) { m.wall(x, x, 5 + k, 5 + k, h, h + 3, DORMER); part('pyramid_1x1', x, y + h + 3, 5 + k, ROOF); m.wall(x, x, 6 + k, 6 + k, h, h + 3, c); }
        else part('slope_1x2', x, y + h, 5 + k, c, 2);
      }
      m.wall(x, x, 7 + k, 14 - k, h, h + 3, c);
    }
  }
  for (let x = 1; x <= 22; x++) part('nd_slope_double_2x1', x, y + E + 16, 10, EDGE, 0);
  // corner turrets: the eaves rows run one stud past each gable, and a slim round turret with a slate spire stands on each corner pad —
  // white on the west, sandstone Tan on the courtyard (east) gable, as built
  for (const [tx, tz] of [[-1, 5], [-1, 16], [24, 5], [24, 16]] as [number, number][]) {
    m.plates(tx, tx, tz, tz, E, WALL);   // the pad is part of the eaves row (same colour, so the row is one plate)
    for (let k = 0; k < 3; k++) part('round_1x1', tx, y + E + 1 + 3 * k, tz, tx < 0 ? WALL : GOLD);
    part('cone_1x1', tx, y + E + 10, tz, SPIRE); part('bar_3l', tx, y + E + 13, tz, SPIRE);
  }
  // chimneys
  for (const [cx, cz] of CHIMNEY) { m.wall(cx, cx, cz, cz, E + 13, E + 22, WALL); m.plates(cx, cx, cz, cz, E + 22, STONE); }
  // the gable tops: a white pedestal carrying the knight (west) and the lion (east)
  for (const x of [0, 23]) m.wall(x, x, 10, 11, E + 16, E + 19, WALL);
  part('statuette', 0, y + E + 19, 10, SPIRE); part('statuette', 23, y + E + 19, 11, SPIRE);

  /** a gallery crown on a 4×4 round plate whose middle carries the 2×2 shaft: the eight rim studs alternate Tan 1×1 round bricks (merlons)
   *  and round plates (the gaps) — the corbelled, crenellated ring every Neuschwanstein tower wears */
  const crown = (x0: number, z0: number, h: number, c: string, skip: string[] = []) => {
    const RING: [number, number][] = [[1, 0], [2, 0], [3, 1], [3, 2], [2, 3], [1, 3], [0, 2], [0, 1]];
    RING.forEach(([i, j], k) => { if (!skip.includes(`${i},${j}`)) part(k % 2 ? 'roundplate_1x1' : 'round_1x1', x0 + i, y + h, z0 + j, c); });
  };
  // ---- the two stair towers ------------------------------------------------------------------------------------------------------------
  // south: 2×2 round bricks up the front to the eaves, a Tan gallery of two 4×4 round plates, a short upper stage, a slate spire
  for (let h = 0; h < 36; h += 3) part('roundbrick_2x2', 12, y + h, 16, WALL);
  part('roundplate_4x4', 11, y + 36, 15, GOLD); part('roundplate_4x4', 11, y + 37, 15, GOLD); crown(11, 15, 38, GOLD, ['1,0', '2,0']);   // the two studs over the roof's slope stay bare
  for (let h = 38; h < 53; h += 3) part('roundbrick_2x2', 12, y + h, 16, WALL);
  part('cone_2x2', 12, y + 53, 16, SPIRE); part('round_1x1', 12.5, y + 59, 16.5, SPIRE); part('cone_1x1', 12.5, y + 62, 16.5, SPIRE); part('bar_3l', 12.5, y + 65, 16.5, SPIRE);
  // north: the tallest — round to the ridge, the gallery, the upper stage, a needle spire; a slim stair turret clings to the gallery
  for (let h = 0; h < 54; h += 3) part('roundbrick_2x2', 7, y + h, 4, WALL);
  part('roundplate_4x4', 6, y + 54, 3, GOLD); part('roundplate_4x4', 6, y + 55, 3, GOLD); crown(6, 3, 56, GOLD, ['3,1']);   // the stair turret stands on that stud
  for (let h = 56; h < 68; h += 3) part('roundbrick_2x2', 7, y + h, 4, WALL);
  part('cone_2x2', 7, y + 68, 4, SPIRE); part('round_1x1', 7.5, y + 74, 4.5, SPIRE); part('cone_1x1', 7.5, y + 77, 4.5, SPIRE); part('bar_4l', 7.5, y + 80, 4.5, SPIRE);
  for (let h = 56; h < 68; h += 3) part('round_1x1', 9, y + h, 4, WALL);
  part('cone_1x1', 9, y + 68, 4, SPIRE); part('bar_3l', 9, y + 71, 4, SPIRE);

  // ---- upper courtyard: Bower (south) and Knights' house (north) -------------------------------------------------------------------------
  const house = (x0: number, x1: number, z0: number, z1: number, top: number, front: { at: number; out: 1 | -1; open: number[] }[]) => {
    m.shell(x0, x1, z0, z1, 0, top, WALL);
    for (const hb of [6, 13]) if (hb < top) { m.plates(x0, x1, z0, z0, hb, WALL); m.plates(x0, x1, z1, z1, hb, WALL); m.plates(x0, x0, z0 + 1, z1 - 1, hb, WALL); m.plates(x1, x1, z0 + 1, z1 - 1, hb, WALL); }
    for (const h of [0, 7, 14]) if (h + 6 <= top) for (const f of front) m.windows('x', f.at, f.out, f.open, h, GLASS, WALL);
    // a pitched roof along x: eaves one stud out, courses up from both eaves, a double-slope ridge
    const D = z1 - z0 + 3; const courses = Math.floor((D - 2) / 2);
    for (let x = x0; x <= x1; x++) for (let z = z0 - 1; z <= z1 + 1; z++) m.plates(x, x, z, z, top, LOW);
    for (let k = 0; k < courses; k++) {
      const h = top + 1 + 3 * k;
      for (let x = x0; x <= x1; x++) { part('slope_1x2', x, y + h, z1 - k, LOW, 0); part('slope_1x2', x, y + h, z0 - 1 + k, LOW, 2); if (z0 + 1 + k <= z1 - 1 - k) m.wall(x, x, z0 + 1 + k, z1 - 1 - k, h, h + 3, LOW); }
    }
    for (let x = x0; x <= x1; x++) part('nd_slope_double_2x1', x, y + top + 1 + 3 * courses, z0 - 1 + courses, LOW, 0);
  };
  // The Bower (Kemenate) after 21063 (Eric 2026-10-06: "完完全全不对称…严格参考它"): two white blocks of different heights standing on a tall
  // grey ashlar base with an arched gateway — a 7-wide tower block whose gable faces the front, a lower block with its ridge along the front —
  // dark grey bands at every storey, black roofs, a round turret with a Tan crown rising behind them from the courtyard
  m.shell(26, 39, 13, 19, 0, 10, STONE);
  m.clear(29, 32, 19, 19, 0, 6); part('arch_1x4x2', 29, y, 19, STONE); m.wall(30, 31, 18, 18, 0, 6, EDGE);   // the gateway, dark inside
  m.plates(26, 39, 13, 19, 10, STONE);   // the base's top: a floor the blocks and their glass stand on
  // block A: x 26..32, storeys at 11 / 18 / 25, bands at 17 / 24 / 31, walls to 32; gables front and back over the wall rows
  m.shell(26, 32, 13, 19, 11, 32, WALL);
  for (const h of [17, 24, 31]) { m.plates(26, 32, 13, 13, h, EDGE); m.plates(26, 32, 19, 19, h, EDGE); m.plates(26, 26, 14, 18, h, EDGE); m.plates(32, 32, 14, 18, h, EDGE); }
  for (const h of [11, 18, 25]) { m.windows('x', 19, 1, [28, 30], h, GLASS, WALL, 11); m.windows('z', 26, -1, [16], h, GLASS, WALL, 11); }
  m.plates(25, 32, 13, 19, 32, LOW);
  for (let k = 0; k < 3; k++) for (let z = 13; z <= 19; z++) {
    const hh = 33 + 3 * k; const c = z === 19 || z === 13 ? WALL : LOW;   // white gable fronts
    part('slope_1x2', 25 + k, y + hh, z, c, 3); part('slope_1x2', 31 - k, y + hh, z, c, 1);
    if (27 + k <= 30 - k) m.wall(27 + k, 30 - k, z, z, hh, hh + 3, c);
  }
  for (let z = 13; z <= 19; z++) part('nd_slope_double_2x1', 28, y + 42, z, z === 19 || z === 13 ? WALL : LOW, 1);
  // block B: x 33..39, two storeys, its ridge along the front
  m.shell(33, 39, 14, 19, 11, 24, WALL);
  m.plates(33, 39, 14, 14, 17, EDGE); m.plates(33, 39, 19, 19, 17, EDGE); m.plates(39, 39, 15, 18, 17, EDGE); m.plates(33, 33, 15, 18, 17, EDGE);
  for (const h of [11, 18]) m.windows('x', 19, 1, [35, 37], h, GLASS, WALL, 11);
  m.plates(33, 39, 13, 20, 24, LOW);
  for (let k = 0; k < 3; k++) for (let x = 33; x <= 39; x++) {
    const hh = 25 + 3 * k; const c = x === 39 ? WALL : LOW;
    part('slope_1x2', x, y + hh, 19 - k, c, 0); part('slope_1x2', x, y + hh, 13 + k, c, 2);
    if (15 + k <= 18 - k) m.wall(x, x, 15 + k, 18 - k, hh, hh + 3, c);
  }
  for (let x = 33; x <= 39; x++) part('nd_slope_double_2x1', x, y + 34, 16, x === 39 ? WALL : LOW, 0);
  // the Bower turret, behind block B in the courtyard
  for (let h = 0; h < 36; h += 3) part('roundbrick_2x2', 35, y + h, 10, WALL);
  part('roundplate_4x4', 34, y + 36, 9, GOLD); crown(34, 9, 37, GOLD); part('roundbrick_2x2', 35, y + 37, 10, WALL); part('cone_2x2', 35, y + 40, 10, SPIRE);
  house(26, 35, 2, 7, 20, [{ at: 7, out: 1, open: [28, 30, 33] }, { at: 2, out: -1, open: [28, 30, 33] }]);   // windows on the back too (Eric)

  // ---- square tower --------------------------------------------------------------------------------------------------------------------
  m.shell(37, 40, 2, 5, 0, 40, WALL);
  for (const hb of [13, 27]) { m.plates(37, 40, 2, 2, hb, STONE); m.plates(37, 40, 5, 5, hb, STONE); m.plates(37, 37, 3, 4, hb, STONE); m.plates(40, 40, 3, 4, hb, STONE); }
  m.wall(38, 39, 3, 4, 0, 34, GLASS); for (const h of [16, 23, 30]) { m.clear(38, 39, 5, 5, h, h + 4); m.clear(38, 38, 2, 2, h, h + 4); m.clear(37, 37, 4, 4, h, h + 4); m.clear(40, 40, 3, 3, h, h + 4); }   // slits on all four faces (one wide on the back and sides, so the wall beside each slit bonds across)
  part('plate_6x6', 36, y + 40, 1, WALL);
  for (let x = 36; x <= 41; x++) for (let z = 1; z <= 6; z++) {
    if (x > 36 && x < 41 && z > 1 && z < 6) continue;
    m.wall(x, x, z, z, 41, 44, WALL); if ((x + z) % 2 === 0) m.wall(x, x, z, z, 44, 47, WALL);
  }
  for (let h = 41; h < 50; h += 3) part('roundbrick_2x2', 38, y + h, 3, WALL);
  part('roundplate_4x4', 37, y + 50, 2, GOLD); crown(37, 2, 51, GOLD);
  part('roundbrick_2x2', 38, y + 51, 3, WALL); part('cone_2x2', 38, y + 54, 3, SPIRE);

  // ---- connecting wing, lower courtyard wall -------------------------------------------------------------------------------------------
  // six deep, so windows on both sides fit (each side's glass two studs in, the back's openings offset from the front's)
  house(41, 53, 1, 6, 13, [{ at: 6, out: 1, open: [43, 45, 48, 50] }, { at: 1, out: -1, open: [44, 46, 49, 51] }]);
  // the curtain wall along the south of the lower courtyard, crenellated
  m.wall(40, 53, 19, 19, 0, 9, STONE); for (let x = 40; x <= 53; x += 2) m.wall(x, x, 19, 19, 9, 12, STONE);   // the lower courtyard's wall in grey stone, as in 21063

  // ---- gatehouse -----------------------------------------------------------------------------------------------------------------------
  const BR = NS_BRICK.color;
  m.wall(54, 54, 3, 18, 0, 18, GOLD);                       // the courtyard front in yellow limestone
  m.wall(55, 61, 3, 3, 0, 18, BR); m.wall(55, 61, 18, 18, 0, 18, BR); m.wall(61, 61, 4, 17, 0, 18, BR);
  // the gate pavilion projecting one stud from the outer front, its stepped gable rising over the roof (the real east front)
  m.wall(62, 62, 8, 13, 0, 21, BR); m.wall(62, 62, 9, 12, 21, 24, BR); m.wall(62, 62, 10, 11, 24, 27, BR);
  m.clear(61, 62, 10, 11, 0, 9); m.clear(54, 54, 10, 11, 0, 9);   // the gate passage
  m.wall(62, 62, 9, 9, 0, 9, GOLD); m.wall(62, 62, 12, 12, 0, 9, GOLD); m.plates(62, 62, 9, 12, 9, GOLD);   // Tan limestone gate frame
  m.windows('z', 61, 1, [5, 7, 14, 16], 10, GLASS, BR); m.windows('x', 3, -1, [57], 10, GLASS, BR); m.windows('x', 18, 1, [57], 10, GLASS, BR);
  m.plates(54, 61, 3, 18, 18, GATE);
  for (let k = 0; k < 3; k++) for (let z = 3; z <= 18; z++) {
    const h = 19 + 3 * k; const c = z === 3 || z === 18 ? BR : GATE;
    part('slope_1x2', 60 - k, y + h, z, c, 1); part('slope_1x2', 54 + k, y + h, z, c, 3);
    if (56 + k <= 59 - k) m.wall(56 + k, 59 - k, z, z, h, h + 3, c);
  }
  for (let z = 3; z <= 18; z++) part('nd_slope_double_2x1', 57, y + 28, z, z === 3 || z === 18 ? BR : GATE, 1);
  for (const tz of [2, 18]) {
    for (let h = 0; h < 24; h += 3) part('roundbrick_2x2', 62, y + h, tz, GOLD);
    part('roundplate_4x4', 61, y + 24, tz - 1, GOLD); crown(61, tz - 1, 25, GOLD); part('roundbrick_2x2', 62, y + 25, tz, GOLD); part('cone_2x2', 62, y + 28, tz, SPIRE);   // judge r1: the black caps were the one odd colour; all cones share the slate
  }

  m.flush();
  bp.tag = '';
}
