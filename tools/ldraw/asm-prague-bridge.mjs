// Prague · Charles Bridge props (2026-10-02). A cross for the bridge saints: the 4L bar with a 2L cross bar (21699) turned upside down so
// the cross bar sits near the top — a Latin cross. One real part in a pose the scene grid cannot express (a half turn about x).
//   node tools/ldraw/asm-prague-bridge.mjs && LDRAW_DIR=… node tools/ldraw/bake.mjs cross_up.ldr --force
import { Asm } from './asm-ours.mjs';
const a = new Asm('cross_up');
a.put('21699', 16, [1, 0, 0, 0, -1, 0, 0, 0, -1], [0, 4, 0]);   // the bar spans y 0..4 after the flip; the cross bar at 3.4–3.8 (of 4)
console.log(a.write());
