// Paris · Notre-Dame de Paris, west façade (2026-10-03). Scheme v1 signed off by Eric: docs/countries/france.md §1.14. Round 2: glass
// glazing, a spokeless rose, paired tower lancets under pointed arches, stepped flank buttresses, a nave with tall windows and flyers.
import { Blueprint } from '../core/builder';
import { placer } from './singapore';

// Eric r1: glazing is glass, never opaque black. Round 2 rendered both: Trans-Clear reads as white holes, Trans-Black reads as glass — chosen
export const ND_GLASS = { color: 'TransBlack' };   // Eric 2026-10-04 (island r3): "玻璃可以做得更透明一些" ; 2026-10-05, Eric with the façade photo: the glass is a dark smoky grey, not blue — Trans-Black (smoke), over grey backing, not black
const STONE = 'Tan', SHADE = 'LightBluishGray', IRON = 'Black', DOOR = 'ReddishBrown', ROOF = 'LightBluishGray';

/** Notre-Dame west front. Local frame: x 0..19 across the front (north tower x 0..5, centre bay 6..13, south tower 14..19), the façade block
 *  z 0..5 with its wall plane in row 5 looking +z, four buttresses one stud proud in row 6 on the bay lines (x 0, 5, 14, 19), stepped flank
 *  buttresses at x −2..−1 and 20..21, the nave stub behind the centre bay at z −8..−1 with flyers out to x 2 / 17. Plates from `y` (the
 *  parvis): portals 0–28 · Gallery of Kings 28–35 · rose zone 35–53 · open arcade 53–65 · towers 65–80, flat tops with a lattice balustrade to 84. */
export function notreDame(bp: Blueprint, ox: number, y: number, oz: number, rot: number) {
  bp.tag = 'notredame'; const { part, asm } = placer(bp, ox, oz, rot);
  const GLASS = ND_GLASS.color;
  const F = 5, B = 6;   // wall row, buttress row
  // Stone is laid by our own run packer, not the scene's voxel packer: one-stud walls packed by the scene packer fall apart into 1×1 bricks on
  // every other course (it scans those rows right to left and can only grow a run to the right), round 1 had 764 of them.
  const M = new Map<string, { c: string; k: 'brick' | 'plate' }>();
  const K = (x: number, h: number, z: number) => `${x}|${h}|${z}`;
  /** stone over an inclusive box of cells and a half-open plate range [y0, y1) */
  const wall = (x0: number, x1: number, z0: number, z1: number, y0: number, y1: number, color = STONE, skip?: (x: number, h: number, z: number) => boolean) => {
    for (let x = x0; x <= x1; x++) for (let z = z0; z <= z1; z++) for (let h = y0; h < y1; h++) if (!skip?.(x, h, z)) M.set(K(x, h, z), { c: color, k: 'brick' });
  };
  const plates = (x0: number, x1: number, z0: number, z1: number, h: number, color = STONE) => { for (let x = x0; x <= x1; x++) for (let z = z0; z <= z1; z++) M.set(K(x, h, z), { c: color, k: 'plate' }); };
  /** runs of 1×N bricks (three stacked plate cells of one colour) along x, then along z for what is left, then plates the same way; long runs
   *  split 8/6/4/3/2/1 with the first piece shortened on alternate courses so the joints stagger */
  const flush = () => {
    const used = new Set<string>(); const hs = [...new Set([...M.keys()].map((k) => +k.split('|')[1]))].sort((a, b) => a - b);
    const split = (L: number, odd: boolean) => { const out: number[] = []; let r = L; if (odd && L >= 6) { out.push(2); r -= 2; } while (r > 0) { const s = [8, 6, 4, 3, 2, 1].find((v) => v <= r)!; out.push(s); r -= s; } return out; };
    for (const h of hs) {
      const cells = [...M.entries()].filter(([k]) => +k.split('|')[1] === h && !used.has(k)).map(([k, v]) => { const [x, , z] = k.split('|').map(Number); return { x, z, v }; });
      const brickable = (x: number, z: number, c: string) => [0, 1, 2].every((d) => { const v = M.get(K(x, h + d, z)); return !!v && v.k === 'brick' && v.c === c && !used.has(K(x, h + d, z)); });
      for (const kind of ['brick', 'plate'] as const) {
        const ok = (x: number, z: number, c: string) => kind === 'brick' ? brickable(x, z, c) : (!used.has(K(x, h, z)) && M.get(K(x, h, z))?.c === c);
        const take = (x: number, z: number) => { for (let d = 0; d < (kind === 'brick' ? 3 : 1); d++) used.add(K(x, h + d, z)); };
        const odd = Math.floor(h / 3) % 2 === 1;
        for (const axis of ['x', 'z'] as const) {
          const rows = new Map<string, { x: number; z: number; c: string }[]>();
          for (const { x, z, v } of cells) { if (!ok(x, z, v.c)) continue; const rk = axis === 'x' ? `${z}|${v.c}` : `${x}|${v.c}`; (rows.get(rk) ?? rows.set(rk, []).get(rk)!).push({ x, z, c: v.c }); }
          for (const row of rows.values()) {
            row.sort((a, b) => (axis === 'x' ? a.x - b.x : a.z - b.z));
            let i = 0;
            while (i < row.length) {
              let j = i; while (j + 1 < row.length && (axis === 'x' ? row[j + 1].x - row[j].x : row[j + 1].z - row[j].z) === 1) j++;
              const L = j - i + 1;
              if (axis === 'x' && L < 2) { i = j + 1; continue; }   // single cells wait for the z pass
              let at = i;
              for (const n of split(L, odd)) {
                const s = row[at]; if (!ok(s.x, s.z, s.c)) { at += n; continue; }
                // a lone column five bricks tall is one 1×1×5 brick (buttresses, glass slits)
                if (kind === 'brick' && n === 1 && L === 1 && [3, 6, 9, 12].every((d) => brickable(s.x, s.z, s.c) && (() => { const v = M.get(K(s.x, h + d + 2, s.z)); const u = M.get(K(s.x, h + d, s.z)); return !!v && !!u && v.k === 'brick' && u.k === 'brick' && v.c === s.c && u.c === s.c && !used.has(K(s.x, h + d, s.z)) && !used.has(K(s.x, h + d + 1, s.z)) && !used.has(K(s.x, h + d + 2, s.z)) && M.get(K(s.x, h + d + 1, s.z))?.c === s.c; })())) {
                  part('brick_1x1x5', s.x, y + h, s.z, s.c); for (let d = 0; d < 15; d++) used.add(K(s.x, h + d, s.z)); at += n; continue;
                }
                part(`${kind}_1x${n}`, s.x, y + h, s.z, s.c, axis === 'x' ? 1 : 0);
                for (let q = 0; q < n; q++) { const t = row[at + q]; take(t.x, t.z); }
                at += n;
              }
              i = j + 1;
            }
          }
        }
      }
      if (cells.some(({ x, z }) => !used.has(K(x, h, z)))) throw new Error(`notreDame: cells left at ${h}`);
    }
  };
  /** the outer shell of the block between two levels: back wall, the two side walls; the front is drawn per band */
  const shell = (y0: number, y1: number) => { wall(0, 19, 0, 0, y0, y1); wall(0, 0, 1, F - 1, y0, y1); wall(19, 19, 1, F - 1, y0, y1); };
  const BUTT = [0, 5, 14, 19];
  /** a pointed head over the 2-wide opening (a, a+1), 2 plates tall from h, its thick ends on the jambs a−1 and a+2 (nd_head2 assembly) */
  const head2 = (a: number, h: number, z: number) => asm('nd_head2', a - 1, y + h, z, STONE);

  // ---- portals, 0–28 -----------------------------------------------------------------------------------------------------------------
  shell(0, 28);
  // the buttresses carry a statue each in a niche at 16–21 (the real façade's four portal statues), a 1×2 plate bonding the column above
  for (const bx of BUTT) { wall(bx, bx, B, B, 0, 16); part('statuette', bx, y + 16, B, SHADE); part('plate_1x2', bx, y + 21, F, STONE); wall(bx, bx, B, B, 22, 28); }
  // the tower flanks: a corner buttress at each end stepping back twice — two studs proud to 25 under a 45° weathering, one stud proud to the
  // tower top — the two main bands carried round as string courses over the buttress pair
  const COURSE = [28, 53];
  for (const [sx, out, r] of [[-1, -2, 3], [20, 21, 1]] as [number, number, number][]) {
    for (const sz of [0, F]) {
      wall(sx, sx, sz, sz, 0, 80, STONE, (_x, h) => COURSE.includes(h) || (h >= 25 && h < 28)); wall(out, out, sz, sz, 0, 25);
      part('slope_1x2', Math.min(sx, out), y + 25, sz, STONE, r); part('cheese_1x1', sx, y + 80, sz, STONE, r);
    }
    for (const h of COURSE) { part('plate_1x6', sx, y + h, 0, STONE); part('tile_1x4', sx, y + h + 1, 1, STONE); }
  }
  for (const h of [28, 34]) { plates(0, 19, 0, 0, h); plates(0, 0, 1, h === 28 ? F - 1 : 2, h); plates(19, 19, 1, h === 28 ? F - 1 : 2, h); }
  // centre portal: the pointed-arch panel (6 wide, 18 plates, 4-wide opening) in rows 4–5, jamb shafts of 1×1 rounds either side, an inner ring
  // in row 3 (round jambs, pointed head over the door), Light Bluish Gray tympanum above it, Reddish Brown doors with black strap hinges in row 2
  part('nd_panel_arch', 7, y, 4, STONE);
  for (const x of [6, 13]) for (let k = 0; k < 6; k++) part('round_1x1', x, y + 3 * k, F, STONE);
  wall(6, 13, F, F, 18, 28, STONE, (x, h) => h === 21);
  // outer archivolt in the buttress row: shafts of 1×1 rounds, two half pointed arches meeting on the axis, 1×1 bricks over their legs, a
  // 2-deep plate locking it into the wall
  for (const x of [7, 12]) { for (let k = 0; k < 4; k++) part('round_1x1', x, y + 3 * k, B, STONE); part('brick_1x1', x, y + 18, B, STONE); }
  part('nd_arch_half', 7, y + 12, B, STONE, 3); part('nd_arch_half', 10, y + 12, B, STONE, 1);
  part('plate_2x8', 6, y + 21, F, STONE, 1); part('tile_1x8', 6, y + 22, B, STONE, 1);
  for (const x of [8, 11]) for (let k = 0; k < 3; k++) part('round_1x1', x, y + 3 * k, 3, STONE);
  for (const x of [8, 11]) part('plate_1x1', x, y + 9, 3, STONE);
  head2(9, 10, 3);
  wall(8, 11, 3, 3, 12, 18, SHADE);
  const door = (a: number, z: number, h: number) => {   // 2 wide, h plates: wood with two black strap hinges
    for (let k = 0; k < h; k++) for (const x of [a, a + 1]) { if (k === 3 || k === 7) plates(x, x, z, z, k, IRON); else wall(x, x, z, z, k, k + 1, DOOR); }
  };
  door(9, 2, 10);
  // side portals: two half pointed arches (1 × 3 × 3) meeting on the bay axis over a 4-wide opening, legs on the buttress lines; inner ring in
  // row 4, door in row 3; the north (left) portal under its gable
  for (const X of [0, 14]) {
    wall(X, X, F, F, 0, 6); wall(X + 5, X + 5, F, F, 0, 6);
    part('arch_pointed_1x3x3', X, y + 6, F, STONE, 3); part('arch_pointed_1x3x3', X + 3, y + 6, F, STONE, 1);
    for (const x of [X + 1, X + 4]) { part('round_1x1', x, y, 4, STONE); part('round_1x1', x, y + 3, 4, STONE); part('plate_1x1', x, y + 6, 4, STONE); part('plate_1x1', x, y + 7, 4, STONE); }
    head2(X + 2, 8, 4);
    wall(X + 1, X + 4, 4, 4, 10, 15, SHADE);
    door(X + 2, 3, 8);
    part('plate_2x4', X + 1, y + 15, F, STONE, 1); part('plate_1x4', X + 1, y + 15, 4, STONE, 1);   // the hood over the arch, two deep so the gable row is bonded
    wall(X + 1, X + 4, F, F, 16, 28);
  }
  for (const x of [0, 5, 14, 19]) wall(x, x, F, F, 15, 28, STONE, (_x, h) => h === 21);   // above the arch legs (the 3-plate notch over each leg hides behind its buttress)
  // the north portal's gable: a 45° triangle (two 2×1 slopes, a double slope on the axis)
  part('slope_1x2', 1, y + 16, B, STONE, 3); part('slope_1x2', 3, y + 16, B, STONE, 1); part('nd_slope_double_2x1', 2, y + 19, B, STONE, 1);
  part('tile_1x4', 15, y + 16, B, STONE, 1);   // the south hood's front row

  // ---- Gallery of Kings, 28–35 -------------------------------------------------------------------------------------------------------
  const band = (h: number, runs: number[]) => { let x = 0; for (const n of runs) { part(`plate_2x${n}`, x, y + h, F, STONE, 1); x += n; } };   // 2-deep plates along the wall and buttress rows
  band(28, [8, 8, 4]);
  for (let x = 0; x <= 19; x++) part('statuette', x, y + 29, B, SHADE);
  shell(29, 34); wall(0, 19, F, F, 29, 34);
  for (const [x, n] of [[0, 4], [4, 8], [12, 8]]) part(`plate_4x${n}`, x, y + 34, F - 2, STONE, 1);   // the canopy, four deep: it also carries the rose recess and the lancets' glass

  // ---- rose zone, 35–53 --------------------------------------------------------------------------------------------------------------
  shell(35, 53);
  // at 65 the shaft's 1×6 plate bridges each tower's pair of buttresses
  for (const bx of BUTT) { wall(bx, bx, B, B, 35, 80, STONE, (_x, h) => h === 65); wall(bx, bx, F, F, 35, 53); }
  for (const X of [1, 6, 10, 15]) part('nd_fence_lattice', X, y + 35, B, STONE);   // the Virgin's gallery
  // centre: the rose in its 6 × 3 recess (rows 3–5), backed by black in row 2 so the glass reads dark
  wall(6, 13, 3, F, 35, 37); wall(6, 6, 3, F, 37, 53); wall(13, 13, 3, F, 37, 53); part('plate_1x6', 7, y + 37, 3, STONE, 1); part('tile_1x6', 7, y + 37, 4, STONE, 1); part('tile_1x6', 7, y + 37, F, STONE, 1);   // the sill of the rose recess is tiled
  wall(7, 12, 2, 2, 35, 53, IRON);
  asm('nd_rose', 7, y + 38, 3, STONE);
  // tower bays: paired lancets (one 2-wide opening split by a slim bar mullion on a jumper) glazed one row in, a pointed head, a rosette above
  for (const X of [0, 14]) {
    wall(X + 1, X + 4, F, F, 35, 53, STONE, (x, h) => ((x === X + 2 || x === X + 3) && h >= 37) || ((x === X + 1 || x === X + 4) && h >= 45 && h < 48));
    wall(X + 2, X + 3, 4, 4, 35, 45, GLASS);
    part('jumper_1x2', X + 2, y + 37, F, STONE); part('roundplate_open', X + 2.5, y + 38, F, STONE); part('bar_3l', X + 2.5, y + 39, F, STONE);
    head2(X + 2, 45, F); part('plate_1x4', X + 1, y + 47, F, STONE, 1);   // a 1×4 over the head locks the two halves to the jambs
    asm('nd_rosette', X + 2, y + 48, F, STONE);
  }

  // ---- open arcade, 53–65 ------------------------------------------------------------------------------------------------------------
  part('plate_6x6', 0, y + 53, 0, STONE); part('plate_6x6', 14, y + 53, 0, STONE); part('plate_6x8', 6, y + 53, 0, STONE, 1);
  for (const X of [0, 14]) { wall(X, X + 5, 0, 0, 54, 64); wall(X, X, 1, F, 54, 64); wall(X + 5, X + 5, 1, F, 54, 64); wall(X + 1, X + 4, 2, 2, 54, 64, SHADE); }
  for (let x = 1; x <= 18; x++) {
    if (x === 5 || x === 14) continue;
    part('roundplate_open', x, y + 54, F, STONE); part('bar_4l', x, y + 55, F, STONE); part('roundplate_1x1', x, y + 63, F, STONE);
  }
  part('plate_6x6', 0, y + 64, 0, STONE); part('plate_6x6', 14, y + 64, 0, STONE); part('plate_1x8', 6, y + 64, F, STONE, 1);
  part('nd_fence_lattice', 6, y + 65, F, STONE); part('nd_fence_lattice', 10, y + 65, F, STONE);
  // the arcade's floor behind the colonnade is a terrace: tiled
  for (let x = 6; x <= 12; x += 2) for (let z = 0; z <= 2; z += 2) part('tile_2x2', x, y + 54, z, STONE);
  for (let x = 6; x <= 13; x++) part('tile_1x1', x, y + 54, 4, STONE);

  // ---- towers, 65–84 -----------------------------------------------------------------------------------------------------------------
  // A hollow ring with glass in every opening, so the sky shows through. The front face is one pointed arch (two half arches on the corners)
  // over a 4-wide glazed opening, split into two lancets by a slim shaft of 1×1 rounds standing on a jumper in the buttress row in front
  // (the real towers' paired lancets with their colonnettes). The other three faces carry two 1-wide glazed lancets each.
  for (const X of [0, 14]) {
    const slit = (x: number, z: number) => { const fx = x - X; return (z === 0 && (fx === 1 || fx === 4)) || ((fx === 0 || fx === 5) && (z === 1 || z === 4)); };
    for (let h = 65; h < 80; h++) for (let x = X; x <= X + 5; x++) for (let z = 0; z <= F; z++) {
      const ring = x === X || x === X + 5 || z === 0 || z === F; if (!ring) continue;
      const fx = x - X;
      if (z === F && fx >= 1 && fx <= 4 && h >= 68) continue;                     // the front opening, under the arch from 71
      if (z === F && (fx === 0 || fx === 5) && h >= 71 && h < 77) continue;        // the arch legs
      if (slit(x, z) && h >= 68) { wall(x, x, z, z, h, h + 1, GLASS); continue; }
      wall(x, x, z, z, h, h + 1);
    }
    wall(X + 1, X + 4, 4, 4, 65, 80, GLASS);   // the front glazing, one row behind the arch
    part('nd_arch_half', X, y + 71, F, STONE, 3); part('nd_arch_half', X + 3, y + 71, F, STONE, 1);
    part('tile_1x4', X + 1, y + 68, F, STONE, 1);   // the window sill
    // the shaft: a 1×6 plate over the two buttresses at 65, a jumper on the axis, four 1×1 rounds and a round plate to the cornice
    part('plate_1x6', X, y + 65, B, STONE, 1); part('jumper_1x2', X + 2, y + 66, B, STONE); part('tile_1x1', X + 1, y + 66, B, STONE); part('tile_1x1', X + 4, y + 66, B, STONE);
    for (let k = 0; k < 4; k++) part('round_1x1', X + 2.5, y + 67 + 3 * k, B, STONE);
    part('roundplate_1x1', X + 2.5, y + 79, B, STONE);
    part('plate_6x6', X, y + 80, 0, STONE);
    for (const [cx, cz] of [[X, 0], [X + 5, 0], [X, F], [X + 5, F]] as [number, number][]) { part('round_1x1', cx, y + 81, cz, STONE); part('cone_1x1', cx, y + 84, cz, STONE); }
    part('nd_fence_lattice', X + 1, y + 81, 0, STONE); part('nd_fence_lattice', X + 1, y + 81, F, STONE);
    part('nd_fence_lattice', X, y + 81, 1, STONE, 1); part('nd_fence_lattice', X + 5, y + 81, 1, STONE, 1);
    for (const [tx, tz] of [[X + 1, 1], [X + 3, 1], [X + 1, 3], [X + 3, 3]] as [number, number][]) part('tile_2x2', tx, y + 81, tz, ROOF);
    for (const bx of [X, X + 5]) part('cheese_1x1', bx, y + 80, B, STONE);
  }

  // ---- nave stub behind the centre bay ------------------------------------------------------------------------------------------------
  // walls to the eaves at 40, two tall glazed lancets a side (12–34) under pointed heads, a flying buttress at z −8 and −4 each side (a stepped
  // pier, a half pointed arch leaning on the wall, a 1×4 plate tying it in, a pinnacle), a 65° Light Bluish Gray roof to a ridge at 62
  const WIN = (h: number, z: number) => (z === -7 || z === -6 || z === -3 || z === -2) && h >= 12 && h < 34;
  const FLY = [-8, -4];
  for (const [wx, gx] of [[6, 6], [13, 13]]) {
    wall(wx, wx, -8, -1, 0, 40, STONE, (_x, h, z) => WIN(h, z) || (h >= 34 && h < 36) || (h === 36 && FLY.includes(z)));
    for (const z of [-7, -6, -3, -2]) wall(gx, gx, z, z, 12, 34, GLASS);
    asm('nd_head2', wx, y + 34, -8, STONE, 1); asm('nd_head2', wx, y + 34, -4, STONE, 1);
  }
  wall(7, 12, -8, -8, 0, 40);
  for (const z of FLY) {
    // west side: pier x 2..3 stepping to x 3 at 18, the arch leg on it at 27, a filler over the leg, the tie plate at 36, pinnacle
    wall(2, 2, z, z, 0, 15); wall(3, 3, z, z, 0, 27, STONE, (_x, h) => h >= 15 && h < 18); part('slope_1x2', 2, y + 15, z, STONE, 3);
    part('nd_arch_half', 3, y + 27, z, STONE, 3); part('brick_1x1', 3, y + 33, z, STONE); part('plate_1x4', 3, y + 36, z, STONE, 1);
    part('round_1x1', 3, y + 37, z, STONE); part('cone_1x1', 3, y + 40, z, STONE);
    wall(17, 17, z, z, 0, 15); wall(16, 16, z, z, 0, 27, STONE, (_x, h) => h >= 15 && h < 18); part('slope_1x2', 16, y + 15, z, STONE, 1);
    part('nd_arch_half', 14, y + 27, z, STONE, 1); part('brick_1x1', 16, y + 33, z, STONE); part('plate_1x4', 13, y + 36, z, STONE, 1);
    part('round_1x1', 16, y + 37, z, STONE); part('cone_1x1', 16, y + 40, z, STONE);
  }
  part('plate_8x8', 6, y + 40, -8, STONE);
  for (let z = -8; z <= -2; z += 2) {
    part('nd_slope65_2x2', 6, y + 41, z, ROOF, 3); part('nd_slope65_2x2', 12, y + 41, z, ROOF, 1);
    part('nd_slope65_2x2', 7, y + 47, z, ROOF, 3); part('nd_slope65_2x2', 11, y + 47, z, ROOF, 1);
    part('nd_slope65_2x2', 8, y + 53, z, ROOF, 3); part('nd_slope65_2x2', 10, y + 53, z, ROOF, 1);
  }
  for (let z = -8; z <= -1; z++) part('nd_slope_double_2x1', 9, y + 59, z, ROOF, 1);
  wall(8, 11, -8, -1, 41, 47, ROOF); wall(9, 10, -8, -1, 47, 53, ROOF);
  for (const sx of [0, 19]) for (const sz of [1, 4]) for (const [h0, h1] of [[36, 48]]) wall(sx, sx, sz, sz, h0, h1, GLASS);   // after the shells: these cells replace stone
  flush();
  bp.tag = '';
}
