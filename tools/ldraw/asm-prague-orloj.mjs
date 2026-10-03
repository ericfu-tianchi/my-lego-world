// Prague · the Orloj's two dials (2026-10-02). One real part, 30209 Bracket 1 × 2 – Dish 4 × 4, turned half round so the dish faces +z:
// the bracket plate sits in the clock frame's wall like any plate, the dish stands in front of the frame with its face to the square.
// A single-part model (the pane_lattice / shutter_closed way), baked as one hosted mould so the dial print rides on it.
//   node tools/ldraw/asm-prague-orloj.mjs && LDRAW_DIR=… node tools/ldraw/bake.mjs orloj_dial.ldr --force
import { Asm, RY } from './asm-ours.mjs';
const a = new Asm('orloj_dial'); a.put('30209', 16, RY(2), [0, 0, 0]);
console.log(a.write());
