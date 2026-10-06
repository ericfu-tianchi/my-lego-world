// Pattaya · the elephant (2026-10-06, Eric: the brick block "一点都不像"). Built round the official LEGO elephant head 6245 (the 1990s
// Adventurers / Orient elephants): the head slides down over a neck column of 1 × 2 bricks whose top studs meet the anti-studs in its cavity
// 11 plates above its rim; the neck stands on two jumpers (the cavity is centred between studs). Body 6 × 10 on four 2 × 2 round-brick legs,
// two brick courses, the back rounded with curved slopes, a Dark Red saddle cloth. Our frame: head toward +z, origin = the body's bottom
// centre. Dark Bluish Gray, as Thai elephants are a dark slate grey.
import { Asm, RY } from './asm-ours.mjs';
const G = 72, RED = 320, GOLD = 297;
const a = new Asm('th_elephant', [0, 0, -1]);
// legs: two round bricks each
for (const [lx, lz] of [[-3, -7], [1, -7], [-3, -1], [1, -1]]) for (const yy of [0, 3, 6]) a.up('3941', G, lx, yy, lz);   // judge r3: legs half the shoulder height
a.up('3036', G, -3, 9, -7, 1);                                     // 6 × 8 belly plate
for (const yy of [10, 13]) for (const x of [-3, -1, 1]) a.up('3007', G, x, yy, -7, 1);   // two courses of 2 × 8 bricks along z
// the front top: two jumpers under the neck, tiles round them
a.up('15573', G, -1, 16, -1); a.up('15573', G, -1, 16, 0);
for (const x of [-3, 1]) a.up('3068b', G, x, 16, -1);
// the neck: three 1 × 2 bricks and two plates along z, centred on x 0 (on the jumpers' studs), reaching into the head's cavity
for (const yy of [17, 20, 23]) a.up('3004', G, -0.5, yy, -1, 1);
for (const yy of [26, 27]) a.up('3023', G, -0.5, yy, -1, 1);
a.put('6245', G, RY(0), [0, 17 * 0.4, 0]);
// the back: curved slopes rolling down both flanks; on the spine a Dark Red saddle — a 2 × 4 plate, a 2 × 2 cushion brick, a gold tile
for (const z of [-7, -5]) { a.up('15068', G, -3, 16, z, 3); a.up('15068', G, 1, 16, z, 1); }
for (const x of [-3, 1]) a.up('3068b', G, x, 16, -3);   // under the head's back: flat
a.up('15068', G, -1, 16, -7, 2);   // the rump rolls down at the back
a.up('3022', RED, -1, 16, -5); a.up('3068b', G, -1, 16, -3);
a.up('3003', RED, -1, 17, -5); a.up('3068b', GOLD, -1, 20, -5);
console.log(JSON.stringify(a.write()));
