// Singapore landmarks, v3 rebuild (2026-09-19) from references: docs/countries/singapore.md §1.8 and docs/refs/*-moc/NOTES.md.
// Everything stud-down on the integer grid (half studs only through jumpers); overhangs are plate cantilevers.
import { Blueprint } from '../core/builder';
import { Reserve } from './lib';
import { placer } from './singapore';

/** Merlion v5 (2026-09-25): the whole statue is one studs-out assembly (`merlion_body` + the nozzle `merlion_jet`) on a Dark Blue wave ring —
 *  head one stud forward with headlight-brick eye sockets and mouth, flower-plate scales, a curved-slope mane hood stepping back, two 65° slopes
 *  sweeping up behind as the tail. Faces −x (the bay). `waterY` is the water surface the jet lands on. Footprint x −2..5, z −1..3. */
export function merlion3(bp: Blueprint, ox: number, y: number, oz: number, rot: number, waterY: number, R?: Reserve) {
  bp.tag = 'merlion'; const { part, vox, cell, asm } = placer(bp, ox, oz, rot);
  const W = 'White', DB = 'DarkBlue', STONE = 'LightBluishGray', TB = 'TransLightBlue';
  if (R) { const a = cell(-8, -1), b = cell(5, 4); R.add(Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.abs(b[0] - a[0]) + 1, Math.abs(b[1] - a[1]) + 1); }
  for (let lx = -2; lx <= 5; lx++) for (let lz = -1; lz <= 4; lz++) vox('plate', lx, y, lz, STONE);                                   // kerb 8×6
  for (let lz = -1; lz <= 4; lz++) { part('cheese_1x1', -2, y + 1, lz, lz === 1 ? W : DB, 3); part('cheese_1x1', 5, y + 1, lz, lz === 2 ? W : DB, 1); }   // wave ring leaning inward, a white crest mid-side
  for (let lx = -1; lx <= 4; lx++) { part('cheese_1x1', lx, y + 1, -1, lx === 1 ? W : DB, 2); part('cheese_1x1', lx, y + 1, 4, lx === 2 ? W : DB, 0); }
  for (let lx = -1; lx <= 4; lx++) for (let lz = 0; lz <= 3; lz++) { vox('plate', lx, y + 1, lz, DB); vox('plate', lx, y + 2, lz, DB); }   // Dark Blue core 6×4 under the statue and the tail beside it
  asm('merlion_body', -1, y + 3, 0, W); asm('merlion_jet', -1, y + 3, 0, TB);                                                            // the statue (assembly box x −1..4)
  // jet: a clear-blue column rises from the bay at x −7, then plates step in and up one stud at a time to the mouth (row A, 15 plates up the statue)
  const jy = y + 3 + 15; let cy = waterY; while (cy + 3 <= jy - 9) { part('round_1x1', -7, cy, 1, TB); cy += 3; } while (cy < jy - 9) { part('roundplate_1x1', -7, cy, 1, TB); cy += 1; }
  for (let k = 0; k < 4; k++) { part('plate_1x2', -7 + k, jy - 9 + 2 * k, 1, TB, 1); part('roundplate_1x1', -6 + k, jy - 8 + 2 * k, 1, TB); }   // ends a cell short of the spout (plate_1x2 is 1 wide × 2 deep: rot 1 runs it along x)
  for (const [fx, fz] of [[-8, 1], [-7, 0], [-7, 2]]) part('roundplate_1x1', fx, waterY, fz, W);                                        // foam where the jet lands
  const [jx, jz] = cell(-7, 1); bp.tag = ''; return [jx, jz] as [number, number];
}

/** Marina Bay Sands v9 (2026-09-25): three towers, each the `mbs_core` + `mbs_glass` assembly (two 2-deep slabs of side-stud bricks with
 *  trans-dark-blue plates, the bay slab on hinge bricks leaning in 3°); the SkyPark sits centred on the 6×4 tower tops — four plate layers
 *  with the infinity pool recessed one plate along the bay edge in three sections split by two walkways, palms on the pool deck, the prow
 *  cantilevering 5 studs past the −x tower; the Shoppes podium along the bay side. Bay side is +z. */
export function mbs4(bp: Blueprint, ox: number, y: number, oz: number, rot: number, R?: Reserve, slab = false) {
  bp.tag = 'mbs'; const { part, vox, cell, asm } = placer(bp, ox, oz, rot); const CORE = 'LightBluishGray', GLASS = 'TransDarkBlue', DECK = 'White', POOL = 'TransLightBlue';
  const TW = 6, TX = [0, 9, 18]; const SPAN = TX[2] + TW;
  if (R) { const a = cell(-6, -1), b = cell(SPAN, 8); R.add(Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.abs(b[0] - a[0]) + 1, Math.abs(b[1] - a[1]) + 1); }
  if (slab) for (let lx = -6; lx <= SPAN; lx++) for (let lz = -1; lz <= 8; lz++) vox('plate', lx, y, lz, CORE);
  const y0 = slab ? y + 1 : y;
  for (const tx of TX) { asm('mbs_core', tx, y0, 0, 'White'); asm('mbs_glass', tx, y0, 0, GLASS); }
  const dy = y0 + 49;                                                                                                                      // deck level = tower top
  // layer 0: 2×8 strips in two rows (z 0..1 back, 2..3 bay side) from the prow to the far tower
  for (let lx = -4; lx < SPAN; lx += 8) { const L = Math.min(8, SPAN - lx); part(`plate_2x${L}`, lx, dy, 0, DECK, 1); part(`plate_2x${L}`, lx, dy, 2, DECK, 1); }
  // layer 1: staggered — 1×8 strips on rows 0 and 1, the pool floor (Medium Azure 2×8) under rows 2..3 over the towers, white elsewhere; the prow wedges
  for (let lx = -2; lx < SPAN; lx += 8) { const L = Math.min(8, SPAN - lx); part(`plate_1x${L}`, lx, dy + 1, 0, DECK, 1); part(`plate_1x${L}`, lx, dy + 1, 1, DECK, 1); }
  part('plate_2x2', -2, dy + 1, 2, DECK); for (const lx of [0, 8]) part('plate_2x8', lx, dy + 1, 2, 'MediumAzure', 1); part('plate_2x8', 16, dy + 1, 2, DECK, 1);
  part('wedge_4x2_r', -6, dy + 1, 0, DECK, 2); part('wedge_4x2_l', -6, dy + 1, 2, DECK, 2);
  // layer 2: row 0 and 1 plates (deck structure); rows 2..3 = the pool surface (clear tiles one plate below the deck) in three sections, white walkway tiles between
  const pool = (lx: number) => lx >= 0 && lx < 16 && lx !== 5 && lx !== 10;
  for (let lx = -4; lx < SPAN; lx += 2) { part('plate_1x2', lx, dy + 2, 0, DECK, 1); part('plate_1x2', lx, dy + 2, 1, DECK, 1); }
  for (let lx = -2; lx < SPAN; lx++) for (const lz of [2, 3]) part(pool(lx) ? 'tile_1x1' : 'plate_1x1', lx, dy + 2, lz, pool(lx) ? POOL : DECK);   // pool surface recessed; studs where the deck continues
  // layer 3: the deck top — tiles everywhere except a stud under each palm on row 1 (the pool deck); the prow tip keeps the bare wedge top
  const PALMS = [-3, 1, 4, 7, 12, 15, 19, 22];
  for (let lx = -4; lx < SPAN; lx++) { part('tile_1x1', lx, dy + 3, 0, DECK); part(PALMS.includes(lx) ? 'plate_1x1' : 'tile_1x1', lx, dy + 3, 1, DECK); }
  for (let lx = -2; lx < SPAN; lx++) if (!pool(lx)) for (const lz of [2, 3]) part('tile_1x1', lx, dy + 3, lz, DECK);
  for (const lx of PALMS) part(lx % 2 ? 'plant_3leaves' : 'flower_1x1', lx, dy + 4, 1, lx % 2 ? 'BrightGreen' : 'Green', 2);                // palms along the pool
  // podium — the Shoppes: one brick with glass on the bay face, white tiled top
  for (let lx = -1; lx <= SPAN - 2; lx++) for (let lz = 6; lz <= 7; lz++) for (let d = 0; d < 3; d++) vox('brick', lx, y0 + d, lz, CORE);
  for (let lx = -1; lx + 4 <= SPAN - 1; lx += 4) part('brick_1x4', lx, y0, 8, GLASS, 1);
  for (let lx = -1; lx <= SPAN - 2; lx++) for (let lz = 6; lz <= 8; lz++) vox('tile', lx, y0 + 3, lz, DECK);
  bp.tag = '';
}

/** Supertree v5 (2026-09-25): a green 2×2 round-brick trunk (the real trunk is a living wall) with a Magenta 2×3 plate after every brick
 *  sticking one stud out and turning a quarter each time — the steel arms carrying clinging plants, so the trunk reads wrapped in greenery;
 *  a Magenta ring every second brick; on top a 2×2 jumper, an open-stud round plate and the canopy assembly (bar → flipped cone → flipped
 *  webbed dish = the purple lattice funnel). `phase` rotates the spiral; `skipLedge` leaves one ledge bare for the skyway. */
export function supertree4(bp: Blueprint, x: number, y: number, z: number, bricks: number, R?: Reserve, phase = 0, skipLedge?: number) {
  bp.tag = 'supertree'; const TRUNK = ['Green', 'DarkGreen'], STEEL = 'Magenta'; let ty = y; const ledges: { level: number; dir: number }[] = [];
  const ledge = (level: number, dir: number): [number, number][] => {
    switch (dir & 3) {
      case 0: bp.part('plate_2x3', x - 1, level, z - 1, STEEL, 0); return [[x - 1, z + 1], [x, z + 1]];
      case 1: bp.part('plate_2x3', x - 1, level, z - 1, STEEL, 1); return [[x + 1, z - 1], [x + 1, z]];
      case 2: bp.part('plate_2x3', x - 1, level, z - 2, STEEL, 0); return [[x - 1, z - 2], [x, z - 2]];
      default: bp.part('plate_2x3', x - 2, level, z - 1, STEEL, 1); return [[x - 2, z - 1], [x - 2, z]];
    }
  };
  const PLANTS: [string, string][] = [['leaves_4x3', 'Green'], ['plant_3leaves', 'BrightGreen'], ['plant_3leaves', 'Green'], ['leaves_4x3', 'DarkGreen']];
  for (let k = 0; k < bricks; k++) {
    bp.part('roundbrick_2x2', x - 1, ty, z - 1, TRUNK[k % 2]); ty += 3;
    if (k < bricks - 1) {
      const dir = (phase + k) & 3; const studs = ledge(ty, dir); ledges.push({ level: ty + 1, dir }); ty += 1;
      if (k !== skipLedge) { const [pk, pc] = PLANTS[k % 4]; bp.part(pk, studs[0][0], ty, studs[0][1], pc, dir); bp.part(k % 3 === 1 ? 'flower_1x1' : 'plant_3leaves', studs[1][0], ty, studs[1][1], k % 3 === 1 ? 'Lime' : 'BrightGreen', (dir + 1) & 3); }
    }
  }
  bp.part('jumper_2x2', x - 1, ty, z - 1, STEEL); ty += 1; bp.part('roundplate_open', x, ty, z, STEEL); ty += 1;
  bp.assembly('stree_cone', x - 3, ty, z - 3, 'DarkPurple'); bp.assembly('stree_bowl', x - 3, ty, z - 3, STEEL); ty += 9;
  R?.add(x - 3, z - 3, 6, 6); bp.tag = ''; return { top: ty, ledges };
}
/** OCBC Skyway: a thin grey plate from one tree's plant ledge to the other's, at a level where the west tree's ledge points +x and the
 *  east tree's points −x (phase 0 and 2 with the same brick rhythm). Trunks 6, 8 or 10 apart along x; the landing studs carry no plants. */
export function skywalk4(bp: Blueprint, xa: number, xb: number, z: number, level: number) {
  bp.tag = 'supertree'; const x0 = Math.min(xa, xb) + 1, L = Math.abs(xb - xa) - 2; if (![4, 6, 8].includes(L)) throw new Error('skywalk4: trunks must be 6, 8 or 10 studs apart');
  bp.part(`plate_1x${L}`, x0, level, z - 1, 'LightBluishGray', 1); bp.part(`plate_1x${L}`, x0, level, z, 'LightBluishGray', 1); bp.tag = '';
}
