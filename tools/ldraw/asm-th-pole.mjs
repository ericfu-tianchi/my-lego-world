// Pattaya · two concrete power poles along Beach Road and the cables sagging between them (2026-10-06, Eric: 电线杆挂杂乱电线; judge r3:
// whips read as tentacles; Eric: the cable ends "融进去了" — must meet their clips, hang loose and random). Each pole: round bricks to 40
// plates with two cross-arms (1 × 3 plates along z, threaded through it) at 30 and 37; on the arm studs vertical-clip plates (4085c) facing the
// other pole; between them Hose Flexible 11.5L cables bent along their hang (gen-th-hose.mjs), each solved so its bar tips land exactly in a
// clip jaw on each pole — one cable runs from a top arm down to a low arm, so the bundle crosses at different depths.
// Our frame: origin = the 10 × 1 footprint's bottom centre; pole A in cell 0, pole B in cell 9.
import { Asm, RY } from './asm-ours.mjs';
const C = 71, D = 72, K = 0;
const a = new Asm('th_pole', [5, 0, 0.5]);
const LOW = 30, TOP = 37;
const pole = (px) => {
  let y = 0; const brick = (n) => { for (let k = 0; k < n; k++) { a.up('3062b', C, px, y, 0); y += 3; } };
  brick(10); a.up('3623', D, px, y, -1, 1); y += 1;      // 30: low arm
  brick(2); a.up('3623', D, px, y, -1, 1); y += 1;       // 37: top arm
  a.up('4073', C, px, y, 0);
};
pole(0); pole(9);
// clips on the arms, facing the other pole (A: +x, B: −x); a clip jaw sits 0.7 stud outside its cell
const CL = [[TOP, -1], [TOP, 0], [LOW, 1], [LOW, -1]];
const used = new Set(); const clip = (px, y, z, r) => { const k = px + ',' + y + ',' + z; if (used.has(k)) return; used.add(k); a.up('4085c', K, px, y + 1, z, r); };
// [A arm, A lane, hose, B arm, B lane]
const CABLES = [[TOP, -1, 'th_hose_a', TOP, -1], [TOP, 0, 'th_hose_c', LOW, 0], [LOW, 1, 'th_hose_a', LOW, 1], [LOW, -1, 'th_hose_a', LOW, -1]];
for (const [ya, za, id, yb, zb] of CABLES) {
  clip(0, ya, za, 1); clip(9, yb, zb, 3);
  a.put(id, K, RY(0), [1.0, (ya + 2) * 0.4 - 0.2, za + 0.5]);   // the near tip in pole A's clip jaw (cell edge, 0.2 below the clip plate's top)
}
console.log(JSON.stringify(a.write()));
