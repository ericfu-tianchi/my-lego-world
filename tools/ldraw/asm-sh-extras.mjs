// Shanghai set dressing v1 (2026-10-03): the things that make the river and the two banks read as Shanghai, each one assembly of real parts.
//   LDRAW_DIR=<main repo>/vendor/ldraw-lib/ldraw node tools/ldraw/asm-sh-extras.mjs && node tools/ldraw/bake.mjs cruise.ldr barge.ldr skyring.ldr bundlamp.ldr modlamp.ldr bike.ldr --force
//   cruise    a Huangpu sightseeing boat, 16 × 4: black waterline, white hull, two glazed decks with a red band, a wedge-plate bow
//   barge     a sand barge, 16 × 4: Dark Red bottom, black hull, a hold heaped with Dark Tan sand, a white wheelhouse and a black stack at the stern
//   skyring   the Lujiazui circular footbridge: a 10 × 10 octagonal ring on four slim columns, its deck tiled white
//   bundlamp  the Bund's cast-iron lamp: a fluted black lamppost, a clear globe between black plates
//   modlamp   a Pudong lamp: a slim grey column, a white disc
//   bike      a Flying Pigeon–style black bicycle, the lane's bicycle against the wall
// Frames: x along the boats (bow toward +x), footprint min corner at (0, 0); origins at the footprint's bottom centre.
import { building, TILES } from './asm-build.mjs';
import { Asm, bbox, PLATE } from './asm-ours.mjs';
import { connectors } from './asm-lib.mjs';
const WHITE = 15, BLK = 0, RED = 4, DRED = 320, DBG = 72, LBG = 71, DTAN = 28, TCLR = 47;
const yaw0 = [1, 0, 0, 0, 1, 0, 0, 0, 1];
const round = (a, id, color, x, y, z, R = yaw0) => a.put(id, color, R, [x, y * PLATE - bbox(id)[1], z]);
const rect = (x0, z0, w, d, c) => { const m = new Map(); for (let i = x0; i < x0 + w; i++) for (let j = z0; j < z0 + d; j++) m.set(`${i},${j}`, c); return m; };
const ringM = (x0, z0, w, d, f) => { const m = new Map(); for (let i = x0; i < x0 + w; i++) for (let j = z0; j < z0 + d; j++) if (i === x0 || i === x0 + w - 1 || j === z0 || j === z0 + d - 1) { const c = f(i, j); if (c !== null) m.set(`${i},${j}`, c); } return m; };

// ---- cruise (v2, Eric 2026-10-03: the bow read as a forked V — the wedge plates were swapped, their points at the outer edges — and the
// boat was as big as the barge): 12 long, hull 8 + bow 4, the two wedge plates' points meeting on the centre line
{
  const { a, layer } = building('cruise', 12, 4);
  const bow = (color, y) => { a.up('41770a', color, 8, y, 0, 1); a.up('41769a', color, 8, y, 2, 1); };
  layer(rect(0, 0, 8, 4, BLK), 0, 'plate'); bow(BLK, 0);
  layer(ringM(0, 0, 8, 4, () => WHITE), 1, 'brick'); for (const y of [1, 2, 3]) bow(WHITE, y);
  layer(rect(0, 0, 8, 4, WHITE), 4, 'plate'); bow(WHITE, 4);
  // lower saloon: glazed (black glass) between white posts, a red band over it
  layer(ringM(1, 0, 6, 4, (i) => ((i === 1 || i === 6 || i === 3) ? WHITE : BLK)), 5, 'brick');
  layer(new Map([...rect(0, 0, 1, 4, WHITE), ...rect(7, 0, 1, 4, WHITE)]), 5, 'plate', TILES);   // the open deck fore and aft, tiled
  layer(rect(0, 0, 8, 4, RED), 8, 'plate');
  layer(rect(0, 0, 8, 4, WHITE), 9, 'plate', TILES);                               // the sun deck, tiled (v3: one saloon — two stood too tall, Eric 2026-10-03)
  const out = a.write(); console.log('cruise:', a.parts.length, 'parts', JSON.stringify(out.bom));
}
// ---- barge
{
  const { a, layer } = building('barge', 16, 4);
  layer(rect(0, 0, 16, 4, DRED), 0, 'plate');
  layer(ringM(0, 0, 16, 4, () => BLK), 1, 'brick');
  layer(new Map([...ringM(0, 0, 16, 4, () => BLK), ...rect(1, 1, 14, 2, DTAN)]), 4, 'plate');   // gunwale and the sand floor of the hold
  layer(new Map([...ringM(4, 0, 12, 4, () => BLK)].filter(([k]) => !k.startsWith('4,'))), 5, 'plate', TILES);   // the gunwale, tiled
  layer(rect(5, 1, 8, 2, DTAN), 5, 'plate'); layer(rect(6, 1, 6, 2, DTAN), 6, 'plate');    // the heap
  for (const x of [5, 11]) a.up('3039', DTAN, x, 7, 1, x === 5 ? 3 : 1);          // its slopes
  // wheelhouse at the stern (x 0–3): white, windows on three sides, a black stack
  layer(ringM(0, 0, 4, 4, (i, j) => ((j === 0 || j === 3) && (i === 1 || i === 2)) || (i === 3 && (j === 1 || j === 2)) ? BLK : WHITE), 5, 'brick');
  layer(rect(0, 0, 4, 4, WHITE), 8, 'plate', TILES);
  const out = a.write(); console.log('barge:', a.parts.length, 'parts', JSON.stringify(out.bom));
}
// ---- skyring
{
  const a = new Asm('skyring', [5, 0, 5]);
  const COLS = [[-4.5, 0.5], [4.5, -0.5], [0.5, 4.5], [-0.5, -4.5]];          // four columns under the ring's arms, a quarter turn apart
  for (const [x, z] of COLS) for (let k = 0; k < 4; k++) round(a, '3062b', WHITE, 5 + x, 3 * k, 5 + z);
  round(a, '6063', WHITE, 5, 12, 5);
  const studs = connectors('6063').filter((c) => c.kind === 'stud' && c.dir[1] < -0.5).map((c) => [c.at[0] / 20, -c.at[2] / 20]);   // the ring's real studs (my guessed pattern missed 28 — check-asm-studs)
  for (const [i, j] of studs) round(a, '3070b', LBG, 5 + i, 13, 5 + j);        // the deck: every stud tiled
  const out = a.write(); console.log('skyring:', a.parts.length, 'parts', JSON.stringify(out.bom));
}
// ---- lamps
{
  const a = new Asm('bundlamp', [1, 0, 1]);
  round(a, '2039', BLK, 1, 0, 1); round(a, '6141', BLK, 1, 21, 1); round(a, '3062b', TCLR, 1, 22, 1); round(a, '6141', BLK, 1, 25, 1);
  const out = a.write(); console.log('bundlamp:', a.parts.length, 'parts', JSON.stringify(out.bom));
}
{
  const a = new Asm('modlamp', [0.5, 0, 0.5]);
  for (let k = 0; k < 4; k++) round(a, '3062b', DBG, 0.5, 3 * k, 0.5); round(a, '4032a', WHITE, 0.5, 12, 0.5);
  const out = a.write(); console.log('modlamp:', a.parts.length, 'parts', JSON.stringify(out.bom));
}
{
  const a = new Asm('bike', [0, 0, 0]);
  const b = bbox('4719c03'); a.put('4719c03', BLK, yaw0, [-(b[0] + b[3]) / 2, -b[1], -(b[2] + b[5]) / 2]);
  const out = a.write(); console.log('bike:', a.parts.length, 'parts', JSON.stringify(out.bom));
}
