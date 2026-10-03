// Prague · the Old Town Hall tower and the Astronomical Clock, round 1 (2026-10-02). Scheme v1 signed off by Eric: docs/countries/czechia.md
// §1.14 and §1.18 (tiers Týn 96 > Hall 87 > Bridge Tower 62; dials printed on 4 × 4 dishes; the Hall wing — built with the houses — stands
// behind the tower at the right end of the row).
import { Blueprint } from '../core/builder';
import { placer } from './singapore';
import { ROOF, GOLD, SLATE_STONE } from './prague-lib';

// warm sandstone of the Hall tower (Muzeum LEGA model; hall-tower-*.jpg): Tan with Dark Tan; above the clock the rough stone turns reddish brown
// judge r1 (2026-10-02): random patches read as blotches — the shaft is a Tan field; Dark Tan only in the quoins and as a sparse accent, one
// stone in nine, evenly spread (a regular stagger, not noise)
const SAND_LOW = ['Tan'];
const SAND_HIGH = ['Tan'];
const FRAME = ['Black', 'Black', 'DarkBrown', 'DarkBluishGray'];   // the almost-black Gothic frame of the Orloj
const COPPER = 'SandGreen';

/** Old Town Hall tower. Local frame: tower x 0..7, z 0..7, the clock on the +z face; the Orloj frame stands one stud proud (z 8) over cells
 *  x 1..6, the hood two studs proud (z 10). Plates from `y`: 0–6 base · 6–35 Orloj · 35–46 hood, copper pinnacle to 55 · 43–49 windows ·
 *  49–55 turret clock band · 55–58 corbels · 58 gallery 10 × 10 · parapet, four corner turrets · hipped slate roof 6 × 6 → 4 × 4 → point, tip ≈ 87. */
export function orloj(bp: Blueprint, ox: number, y: number, oz: number, rot: number) {
  bp.tag = 'orloj'; const { part, vox } = placer(bp, ox, oz, rot);
  // one stone course round the 8 × 8 ring at level y0 (runs of one colour, so the packer lays real 1×N bricks); skip(x, z) leaves a cell open
  const ring: [number, number][] = [];
  for (let x = 0; x < 8; x++) ring.push([x, 0]); for (let z = 1; z < 8; z++) ring.push([7, z]); for (let x = 6; x >= 0; x--) ring.push([x, 7]); for (let z = 6; z > 0; z--) ring.push([0, z]);
  // dark stones come in short runs, scattered; the ground colour (palette[0]) in long ones
  const course = (y0: number, palette: string[], skip: (x: number, z: number) => boolean = () => false) => {
    ring.forEach(([x, z], i) => {
      if (skip(x, z)) return; const c = y0 / 3;
      const corner = (x === 0 || x === 7) && (z === 0 || z === 7);
      const accent = palette.length === 1 && !corner && (i + 4 * c) % 9 === 0;
      const quoin = corner && y0 >= 6 ? (c % 2 ? 'DarkTan' : 'Tan') : accent ? 'DarkTan' : bp.pick(palette);   // dressed corner stones, long and short
      for (let d = 0; d < 3; d++) vox('brick', x, y + y0 + d, z, quoin);
    });
  };
  const faceCell = (x: number, z: number) => (z === 0 || z === 7) ? x : z;   // position along whichever face the ring cell is on
  const midFace = (x: number, z: number) => { const k = faceCell(x, z); return (k === 3 || k === 4) && !((x === 0 || x === 7) && (z === 0 || z === 7)); };

  // ---- shaft: base, two plain stages behind the clock, the window stage, the turret-clock band
  for (let c = 0; c < 2; c++) course(3 * c, ['DarkBluishGray', 'DarkBluishGray', 'DarkTan']);
  for (let c = 2; c < 14; c++) course(3 * c, SAND_LOW, (x, z) => c >= 8 && c < 10 && midFace(x, z) && (x === 0 || x === 7));   // 6–42; a small window on each side face at 24–30
  for (const [wx, wz, r] of [[7, 3, 1], [0, 3, 3]] as [number, number, number][]) { part('window_1x2x2', wx, y + 24, wz, SLATE_STONE, r); part('glass_1x2x2', wx, y + 24, wz, 'TransBlack', r); }
  part('plate_8x8', 0, y + 42, 0, 'DarkTan');                                                             // a floor and a string course
  for (let c = 0; c < 2; c++) course(43 + 3 * c, SAND_HIGH, (x, z) => midFace(x, z) && z !== 7 && z !== 0 ? false : midFace(x, z) && z === 0);   // 43–49: the back window
  for (const [wx, wz, r] of [[3, 0, 2]] as [number, number, number][]) { part('window_1x2x2', wx, y + 43, wz, SLATE_STONE, r); part('glass_1x2x2', wx, y + 43, wz, 'TransBlack', r); }
  // 49–55: the front window over the copper pinnacle; the turret clocks on the two side faces (the pinnacle would cover one on the front)
  for (let c = 0; c < 2; c++) course(49 + 3 * c, SAND_HIGH, (x, z) => midFace(x, z) && z !== 0);
  part('window_1x2x2', 3, y + 49, 7, SLATE_STONE, 0); part('glass_1x2x2', 3, y + 49, 7, 'TransBlack', 0);
  part('brick_1x2x2', 7, y + 49, 3, 'Black', 1, 'orloj_turret_clock'); part('brick_1x2x2', 0, y + 49, 3, 'Black', 3, 'orloj_turret_clock');
  // corbels under the gallery: 45° inverted slopes on the six middle cells of each face, stone 1×1 on the corners
  for (let k = 1; k <= 6; k++) { part('slope_inv_1x2', k, y + 55, 7, 'Tan', 0); part('slope_inv_1x2', k, y + 55, -1, 'Tan', 2); part('slope_inv_1x2', -1, y + 55, k, 'Tan', 3); part('slope_inv_1x2', 7, y + 55, k, 'Tan', 1); }
  for (const [cx, cz] of [[0, 0], [7, 0], [0, 7], [7, 7]]) part('brick_1x1', cx, y + 55, cz, 'DarkTan');
  // ---- gallery: a 10 × 10 floor of four plates, a parapet of post · two 1×3 arches · post on each side, four stone corner turrets
  const G = y + 58; part('plate_4x10', -1, G, -1, SLATE_STONE, 1); part('plate_4x10', -1, G, 3, SLATE_STONE, 1); part('plate_2x8', -1, G, 7, SLATE_STONE, 1); part('plate_2x2', 7, G, 7, SLATE_STONE);
  // ---- crown (Eric 2026-10-03: it must not read as Týn). The real one (hall-tower-daduzi.jpg, prague-orloj-lego-a.png): an arcaded gallery on
  // corbels, four fat stone bartizans corbelled out at the corners with conical slate caps, and a steep slate roof with a ridge, two gold
  // finials at the ridge ends and a dormer — a house roof on a tower, not a needle. Slate here is the photo's dark grey, not Týn's black.
  const SLATE_HALL = 'DarkBluishGray';
  for (const [bx, bz] of [[-1, -1], [7, -1], [-1, 7], [7, 7]] as [number, number][]) {                  // bartizans: 2 × 2 stone drums, slate cones, gold tips
    part('roundbrick_2x2', bx, G + 1, bz, 'Tan'); part('roundbrick_2x2', bx, G + 4, bz, 'DarkTan'); part('cone_2x2', bx, G + 7, bz, SLATE_HALL);
    axisPart(bp, ox, oz, rot, bx + 1, bz + 1, G + 13, 'bar_3l', GOLD);
  }
  part('arch_1x3', 1, G + 1, 8, 'Tan'); part('arch_1x3', 4, G + 1, 8, 'Tan'); part('arch_1x3', 1, G + 1, -1, 'Tan'); part('arch_1x3', 4, G + 1, -1, 'Tan');   // the arcade between them
  part('arch_1x3', -1, G + 1, 1, 'Tan', 1); part('arch_1x3', -1, G + 1, 4, 'Tan', 1); part('arch_1x3', 8, G + 1, 1, 'Tan', 1); part('arch_1x3', 8, G + 1, 4, 'Tan', 1);
  // roof: a 6 × 6 ring of 75° slopes (6 → 4), then a ridge roof running x 2..5: 75° slopes front and back, vertical gable ends, a ridge, a
  // gold finial on a jumper at each end of the ridge (a dormer did not fit the 75° slope; the real one is small)
  const R0 = G + 1;
  part('slope75_corner_2x2x3', 1, R0, 1, SLATE_HALL, 2); part('slope75_corner_2x2x3', 5, R0, 1, SLATE_HALL, 1); part('slope75_corner_2x2x3', 1, R0, 5, SLATE_HALL, 3); part('slope75_corner_2x2x3', 5, R0, 5, SLATE_HALL, 0);
  for (const sx of [3, 4]) { part('slope75_2x1x3', sx, R0, 5, SLATE_HALL, 0); part('slope75_2x1x3', sx, R0, 1, SLATE_HALL, 2); }
  for (const sz of [3, 4]) { part('slope75_2x1x3', 5, R0, sz, SLATE_HALL, 1); part('slope75_2x1x3', 1, R0, sz, SLATE_HALL, 3); }
  for (let x = 2; x <= 5; x++) for (let z = 2; z <= 5; z++) vox('plate', x, R0 + 9, z, SLATE_HALL);
  const R1 = R0 + 10;
  for (let x = 2; x <= 5; x++) { part('slope75_2x1x3', x, R1, 4, SLATE_HALL, 0); part('slope75_2x1x3', x, R1, 2, SLATE_HALL, 2); }
  part('jumper_1x2', 2, R1 + 9, 3, SLATE_HALL, 1); part('jumper_1x2', 5, R1 + 9, 3, SLATE_HALL, 1); part('ridge_2x2', 3, R1 + 9, 3, SLATE_HALL);
  for (const fx of [2, 5]) { axisPart(bp, ox, oz, rot, fx + 0.5, 4, R1 + 10, 'round_1x1', SLATE_HALL); axisPart(bp, ox, oz, rot, fx + 0.5, 4, R1 + 12, 'bar_3l', GOLD); }

  // ---- the Orloj: a 6-wide frame one stud proud (z 8, x 1..6) from 6 to 35
  for (let x = 1; x <= 6; x++) for (let yy = 0; yy < 6; yy++) vox('brick', x, y + yy, 8, 'DarkBluishGray');   // its footing, part of the base
  const dialAt = new Set([10, 22]);   // the two bracket plates (dial centres at 10.5 and 22.5)
  let fc = 0;
  for (let yy = 6; yy < 35; yy++) {
    if (yy % 3 === 0) fc = (fc + 1 + Math.floor(bp.rand() * 2)) % FRAME.length;
    for (let x = 1; x <= 6; x++) {
      if (dialAt.has(yy) && (x === 3 || x === 4)) continue;                          // the bracket plate
      if ((yy === 9 || yy === 21 || yy === 28) && (x === 1 || x === 6 || (yy === 28 && (x === 3 || x === 4)))) continue;   // ledge plates
      if (yy >= 29 && yy < 32 && (x === 2 || x === 5)) continue;                     // apostle windows
      const edge = x === 1 || x === 6;
      if (edge && (yy === 15 || yy === 27)) continue;                                // niche canopies over the figures
      if (yy >= 16 && yy < 18) { vox('plate', x, y + yy, 8, edge ? 'DarkTan' : 'DarkBrown'); continue; }  // the band between the dials
      vox('brick', x, y + yy, 8, edge ? (Math.floor(yy / 3) % 2 ? 'Tan' : 'DarkTan') : FRAME[fc]);   // a stone surround (pilasters) round the dark frame
    }
  }
  for (const [px, py] of [[1, 15], [6, 15], [1, 27], [6, 27]]) { part('plate_1x2', px, y + py, 8, 'Tan'); part('pyramid_1x1', px, y + py + 1, 9, 'Tan'); }   // each figure stands under a small pointed stone canopy
  part('orloj_dial', 3, y + 10, 8, 'Black', 0, 'orloj_calendar');
  part('orloj_dial', 3, y + 22, 8, 'Black', 0, 'orloj_astro');
  // figures either side of both dials on ledges one stud out: gold Vanity and Miser at the calendar, gold Turk left and white Death right of the clock
  // painted figures (muted colours, a little gold): calendar — the Angel (gold) left, the Philosopher right; clock — the Miser (Dark Tan) left, Death (bone white) right
  for (const [lx, ly, color] of [[1, 9, GOLD], [6, 9, 'MediumNougat'], [1, 21, 'DarkTan'], [6, 21, 'White']] as [number, number, string][]) { part('plate_1x2', lx, y + ly, 8, 'Black'); part('statuette', lx, y + ly + 1, 9, color); }
  // apostle windows (two blue openings) and the stone angel between them on a jumper over the clock's axis
  part('brick_1x1', 2, y + 29, 8, 'MediumBlue'); part('brick_1x1', 5, y + 29, 8, 'MediumBlue');
  part('plate_2x2', 3, y + 28, 8, 'Black'); part('jumper_1x2', 3, y + 29, 9, 'Black'); axisPart(bp, ox, oz, rot, 4, 9.5, y + 30, 'statuette', 'LightBluishGray');   // the stone angel, facing the square
  // ---- the hood: two plates carry the curved-top stone arch two studs out over the clock; the hood's stone mass behind it; a stepped copper
  // roof; the copper pinnacle runs up the wall on the clock's axis
  for (const px of [1, 6]) part('plate_1x3', px, y + 35, 8, 'Tan');
  for (let x = 2; x <= 5; x++) for (const z of [8, 9]) vox('plate', x, y + 35, z, 'Tan');
  part('arch_curved_1x6x2', 1, y + 36, 10, 'Tan');
  for (let x = 1; x <= 6; x++) for (let d = 0; d < 6; d++) { vox('brick', x, y + 36 + d, 8, 'Tan'); if (d >= 3) vox('brick', x, y + 36 + d, 9, 'Tan'); }   // open under the canopy: the arch stands free in front
  // the stone canopy is a small steep gable, its ridge running out from the wall: 45° slopes on both sides, a ridge on top. Only the spire
  // behind it is copper (Eric 2026-10-03: a green block read as nothing; a slim green spire reads)
  part('plate_2x6', 1, y + 42, 8, 'Tan', 1); part('plate_1x6', 1, y + 42, 10, 'Tan', 1);
  for (const z of [9, 10]) { part('slope_1x2', 1, y + 43, z, 'DarkTan', 3); part('slope_1x2', 5, y + 43, z, 'DarkTan', 1); }
  part('ridge_2x2', 3, y + 43, 9, 'DarkTan', 1);
  // the copper pinnacle up the wall on the clock's axis, in front of the window
  part('jumper_1x2', 3, y + 43, 8, 'Tan');
  axisPart(bp, ox, oz, rot, 4, 8.5, y + 44, 'roundplate_1x1', COPPER); axisPart(bp, ox, oz, rot, 4, 8.5, y + 45, 'cone_1x1', COPPER); axisPart(bp, ox, oz, rot, 4, 8.5, y + 47, 'bar_3l', COPPER);   // a slim copper spire, tip at 53
  bp.tag = '';
}

/** a 1×1 part centred on a local point between studs (lx at a grid line, lz a cell centre or grid line), the way a jumper's centre stud places it */
function axisPart(bp: Blueprint, ox: number, oz: number, rot: number, lx: number, lz: number, y: number, key: string, color: string, lrot = 0) {
  const r = rot & 3; const [dx, dz] = r === 0 ? [lx, lz] : r === 1 ? [lz, -lx] : r === 2 ? [-lx, -lz] : [-lz, lx];
  bp.part(key, ox + dx - 0.5, y, oz + dz - 0.5, color, (lrot + rot) & 3);
}
