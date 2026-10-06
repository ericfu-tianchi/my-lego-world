// Santa Monica Pier life layer (LA r2, 2026-10-05; Eric: "游乐场感觉有点冷清"): the small sub-builds that need side studs, as assemblies of
// real parts in our frame (asm-ours.mjs). Everything that is studs-up only (booths, the cart, lamps, bins) is placed in the scene (la-pier.ts).
//   LDRAW_DIR=<main repo>/vendor/ldraw-lib/ldraw node tools/ldraw/asm-la-pier.mjs && node tools/ldraw/bake.mjs la_pierbench.ldr --force
// Frames: footprint min corner at (0, 0), x along the bench, z toward its front (+z), y up in plates; origin at the footprint's bottom centre.
import { Asm, bbox, PLATE } from './asm-ours.mjs';
const DBG = 72, RB = 70;
const only = process.argv.slice(2);
const want = (n) => !only.length || only.includes(n);

// ---- la_pierbench: the pier's wooden bench — dark iron ends, Reddish Brown slat seat and a backrest on brackets (the Venice bench's
// construction, la_bench in asm-la-venice.mjs, in the pier's colours: the real benches along the rail are timber on cast-iron frames)
if (want('la_pierbench')) {
  const a = new Asm('la_pierbench', [2, 0, 1]);
  for (const x of [0, 3]) a.up('3004', DBG, x, 0, 0, 1);
  const br = [1, 3].map((cx) => a.put('99780', RB, [-1, 0, 0, 0, 1, 0, 0, 0, -1], [cx, 4 * PLATE, 0.5]));      // brackets on the back row, upright plates at its back edge
  a.up('3710', RB, 0, 3, 1, 0); a.up('2431', RB, 0, 4, 1, 0);                                                  // seat: a 1×4 plate on the ends' front studs, tiled
  const st = br.flatMap((r) => a.side(r)).filter((s) => s.d[2] !== 0).sort((p, q) => p.p[0] - q.p[0]);
  const tb = bbox('2431'); a.onStud('2431', RB, st[0], [1, 0, 0], 'x', [tb[0] + 0.5, tb[1], (tb[2] + tb[5]) / 2]);   // backrest: a 1×4 tile on the four side studs
  const out = a.write(); console.log('la_pierbench:', a.parts.length, 'parts', JSON.stringify(out.bom));
}
