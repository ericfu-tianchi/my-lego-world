// Singapore landmarks, v4 (2026-10-01): rebuilt on the exploded-assembly pipeline (every brick a brick, CLAUDE.md rule 12).
import { Blueprint } from '../core/builder';
import { Reserve } from './lib';
import { placer } from './singapore';

/** Marina Bay Sands v10. Proportions from docs/refs/mbs-moc/real-mbs-jays-photo.jpg: SkyPark 34 long ≈ 1.7 × tower height, towers 6 wide with
 *  4-stud gaps, the cantilever one tower-width past the north tower (−x), the south end a 2-stud rounded lip. Three `mbs10_tower` assemblies
 *  (straight bay leaf + back leaf leaning on hinges, trans tiles on side studs); the SkyPark is a white hull: a brick course whose underside
 *  sweeps up to the cantilever tip on inverted 6×1 curved slopes, a 4-wide binding plate course with round-ended plates fore and aft, and a
 *  tiled deck — grey observation deck at the tip, the infinity pool flush along the bay edge over the middle tower, palms on the pool deck,
 *  trees on the back half, two white lift-core pavilions. The Shoppes podium: the towers' glass over a dark backing under a saw-tooth white roof. Bay side is +z.
 *  Local footprint x 0..34, z 0..9 (towers z 0..4, deck z 1..5, walk z 5, podium z 6..9); 45 + 5 plates. */
export function mbs10(bp: Blueprint, ox: number, y: number, oz: number, rot: number, R?: Reserve) {
  bp.tag = 'mbs'; const { part, vox, cell, asm } = placer(bp, ox, oz, rot);
  const W = 'White', DECK = 'LightBluishGray', POOL = 'MediumAzure', GLASS = 'TransLightBlue', BACKING = 'DarkBluishGray';
  if (R) { const a = cell(0, 0), b = cell(33, 8); R.add(Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.abs(b[0] - a[0]) + 1, Math.abs(b[1] - a[1]) + 1); }
  const TX = [6, 16, 26]; for (const tx of TX) asm('mbs10_tower', tx, y, 0, W);
  const H = y + 45;
  /** a row of 1×N parts along +x from x0 to x1 at row z, lengths in order */
  const run = (kind: 'brick' | 'tile', z: number, yy: number, x0: number, lens: number[], color: string) => { let x = x0; for (const L of lens) { part(`${kind}_1x${L}`, x, yy, z, color, 1); x += L; } };
  // ---- hull: one brick course (H..H+3); the cantilever's underside is four inverted curved slopes, thin end at the tip (outer rows one stud shorter: the tip is round)
  // (the tip's first stud is the round plate alone: thinner, and nothing pokes out of its curve)
  for (const z of [2, 3]) part('curve_inv_6x1', 1, H, z, W, 3);
  for (const z of [1, 4]) part('curve_inv_6x1', 2, H, z, W, 3);
  run('brick', 1, H, 8, [8, 8, 8], W); run('brick', 2, H, 7, [6, 8, 8, 3], W); run('brick', 3, H, 7, [3, 8, 8, 6], W); run('brick', 4, H, 8, [8, 8, 8], W);
  // ---- binding course (H+3): every row of the hull hangs from a 4-wide plate; round ends fore and aft
  part('plate_4x6_round', 0, H + 3, 1, W); part('plate_4x12', 6, H + 3, 1, W, 1); part('plate_4x10', 18, H + 3, 1, W, 1); part('plate_4x6_round', 28, H + 3, 1, W);
  // ---- deck (H+4): what is on the real SkyPark, top to bottom of the plan
  const D = H + 4; const used = new Set<string>(); const take = (x: number, z: number) => used.add(x + ',' + z);
  // round ends: quarter-circle tiles step round the round plate's curve (the corner cells of the plate are not there)
  const Q = (x: number, z: number, r: number, c: string) => part('tile_quarter_1x1', x, D, z, c, r);
  Q(0, 2, 2, DECK); Q(0, 3, 3, DECK); Q(1, 1, 2, DECK); Q(1, 4, 3, DECK); part('tile_1x2', 1, D, 2, DECK); part('tile_2x4', 2, D, 1, DECK, 1); part('tile_2x4', 2, D, 3, DECK, 1);   // observation deck at the tip
  Q(33, 2, 1, W); Q(33, 3, 0, W); Q(32, 1, 1, W); Q(32, 4, 0, W); part('tile_1x2', 32, D, 2, W);                                                                 // south lip                                                                     // south lip
  for (let x = 0; x < 6; x++) for (let z = 1; z < 5; z++) take(x, z); for (let x = 32; x < 34; x++) for (let z = 1; z < 5; z++) take(x, z);
  run('tile', 4, D, 12, [8, 6], POOL); for (let x = 12; x < 26; x++) take(x, 4);                                                                       // the infinity pool, flush with the bay edge
  // trees are 8 m on a 194 m tower: one flower plate (a crown seen from above) on a stud of the deck; palms along the pool, the grove behind
  for (const x of [13, 16, 19, 22, 25]) { part('plate_1x1', x, D, 3, W); part('flower_1x1', x, D + 1, 3, 'BrightGreen'); take(x, 3); }
  const TREES: [number, number, string][] = [[11, 1, 'Green'], [12, 2, 'DarkGreen'], [14, 1, 'DarkGreen'], [15, 2, 'Green'], [17, 1, 'Green'], [18, 2, 'DarkGreen'], [20, 1, 'DarkGreen'], [21, 2, 'Green'], [23, 1, 'Green'], [24, 2, 'DarkGreen'], [26, 1, 'DarkGreen']];
  for (const [x, z, c] of TREES) { part('plate_1x1', x, D, z, W); part('flower_1x1', x, D + 1, z, c); take(x, z); }
  for (const px of [7, 28]) { part('plate_2x2', px, D, 2, W); part('plate_2x2', px, D + 1, 2, W); part('tile_2x2', px, D + 2, 2, W); take(px, 2); take(px + 1, 2); take(px, 3); take(px + 1, 3); }   // lift-core pavilions
  for (let z = 1; z < 5; z++) { let x = 6; while (x < 32) { if (used.has(x + ',' + z)) { x++; continue; } let L = 0; while (x + L < 32 && !used.has(x + L + ',' + z) && L < 8) L++; const fit = [8, 6, 4, 3, 2, 1].find((n) => n <= L)!; part(`tile_1x${fit}`, x, D, z, W, 1); x += fit; } }
  // ---- walk and the Shoppes podium: smoked glass storey, white roof, saw-tooth of 1×2 cheese slopes
  for (let x = 2; x < 34; x++) vox('tile', x, y, 5, DECK);
  for (let x = 2; x + 4 <= 34; x += 4) part('brick_1x4', x, y, 8, GLASS, 1);
  for (let x = 2; x < 34; x++) for (const [z, c] of [[6, W], [7, BACKING]] as const) for (let d = 0; d < 3; d++) vox('brick', x, y + d, z, c);   // dark backing behind the glass, as on the towers
  for (let x = 2; x < 34; x++) for (const z of [6, 7, 8]) vox('plate', x, y + 3, z, W);
  for (let x = 2; x < 34; x++) { part('cheese_1x2', x, y + 4, 7, W, 1); vox('tile', x, y + 4, 6, W); }
  bp.tag = '';
}

/** Merlion v6: the statue (`merlion6`, one studs-out assembly, faces +x) on a Dark Blue wave plinth ringed with cheese slopes leaning in
 *  (a white crest every third), on a grey stone kerb; the jet leaves the nozzle at the front of the open mouth and falls in a parabola —
 *  each stud forward a vertical run of 1×1 round plates, joined to the next run by a 1×2 plate — into the water at `waterY`, with foam.
 *  Local box: kerb x −1..7 × z −1..5 at plate y; statue x 0..7 × z 0..5 from y + 3 (37 plates); the jet from x 7 at y + 29 down to the water. */
export function merlion6(bp: Blueprint, ox: number, y: number, oz: number, rot: number, waterY: number, reach = 9, R?: Reserve) {
  bp.tag = 'merlion'; const { part, vox, cell, asm } = placer(bp, ox, oz, rot);
  const W = 'White', DB = 'DarkBlue', STONE = 'LightBluishGray', TLB = 'TransLightBlue';
  if (R) { const a = cell(-1, -1), b = cell(7, 5); R.add(Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.abs(b[0] - a[0]) + 1, Math.abs(b[1] - a[1]) + 1); }
  for (let x = -1; x <= 7; x++) for (let z = -1; z <= 5; z++) vox('plate', x, y, z, STONE);
  for (let x = 0; x < 7; x++) for (let z = 0; z < 5; z++) { vox('plate', x, y + 1, z, DB); vox('plate', x, y + 2, z, DB); }
  let k = 0; const crest = () => (k++ % 3 === 1 ? W : DB);
  for (let x = -1; x <= 7; x++) { part('cheese_1x1', x, y + 1, -1, crest(), 0); part('cheese_1x1', x, y + 1, 5, crest(), 2); }   // high end inward
  for (let z = 0; z < 5; z++) { part('cheese_1x1', -1, y + 1, z, crest(), 1); part('cheese_1x1', 7, y + 1, z, crest(), 3); }
  asm('merlion6', 0, y + 3, 0, W);
  // jet: from the nozzle (statue plate 26, x 6, z 2) forward; drops grow by one plate every other stud — a parabola on the plate grid
  const top = y + 3 + 26; const T = [top]; for (let i = 0; i < reach; i++) T.push(Math.max(waterY, T[i] - Math.max(1, Math.round(0.45 * (i + 0.5)) + (i > 4 ? 1 : 0))));
  T[reach] = waterY;
  for (let i = 0; i < reach; i++) {
    const x = 7 + i; const lo = i === reach - 1 ? waterY : T[i + 1] + 1;
    for (let lv = T[i]; lv > lo; lv--) part('roundplate_1x1', x, lv, 2, TLB);
    if (i < reach - 1) part('plate_1x2', x, lo, 2, TLB, 1); else part('roundplate_1x1', x, lo, 2, TLB);
  }
  const lx = 7 + reach - 1; for (const [fx, fz] of [[lx + 1, 2], [lx, 1], [lx, 3], [lx - 1, 1]]) part('roundplate_1x1', fx, waterY, fz, W);   // foam
  bp.tag = '';
}
