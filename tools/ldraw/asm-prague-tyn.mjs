// Týn Church gable medallion (2026-10-02): the gilded Madonna in her aureole on the gable between the towers (Eric's photo, 2026-10-02).
//   LDRAW_DIR=… node tools/ldraw/asm-prague-tyn.mjs && node tools/ldraw/bake.mjs tyn_medallion.ldr --force
// A 1×2 brick with two studs on its side faces the square; a 2×2 round Pearl Gold tile hangs on those two studs by its lower row, so the
// disc is centred on the 2-wide brick and rises one stud above it. Proxy: footprint x 0..2, z 0..1, 3 plates; the disc stands 1 plate proud at +z.
import { Asm, RY } from './asm-ours.mjs';
const a = new Asm('tyn_medallion', [1, 0, 0.5]);
let brick = a.up('11211', 72, 0, 0, 0, 0);
let studs = a.side(brick).filter((s) => s.d[2] === 1);
if (studs.length !== 2) { a.parts.length = 0; brick = a.up('11211', 72, 0, 0, 0, 2); studs = a.side(brick).filter((s) => s.d[2] === 1); }
if (studs.length !== 2) throw new Error('11211: no +z side studs in either turn');
const mid = [(studs[0].p[0] + studs[1].p[0]) / 2, studs[0].p[1] + 0.5, studs[0].p[2]];
a.onStud('14769', 297, { p: mid, d: [0, 0, 1] }, [1, 0, 0], 'x');
console.log(a.write(), studs.map((s) => s.p));
void RY;
