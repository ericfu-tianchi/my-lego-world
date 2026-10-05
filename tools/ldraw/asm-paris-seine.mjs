// Paris · bouquiniste lid (2026-10-03, docs/countries/france.md §1.16). The lid of a bouquiniste box, opened: two Hinge 1 × 2 (3937 base +
// 3938 top) on the box's back row, both tops turned up a quarter about the hinge axle so their studs face the street (+x); the lid (a 2 × 4
// plate with a 1 × 4 plate above it, tied together by the tiles that bridge the two) stands on those studs, and its face carries the display:
// a 2 × 2 poster, two 1 × 2 posters (portrait), and a bottom row of plain postcards. Colour 16 tiles take the box's colour in the scene, which
// recolours / prints them (src/scenes/paris-seine.ts). Proxy: footprint x 0..1 (the hinge row), z 0..4, 3 plates; the lid stands in front (+x).
//   LDRAW_DIR=… node tools/ldraw/asm-paris-seine.mjs && node tools/ldraw/bake.mjs seine_lid.ldr --force
import { Asm, RY, mul, app, add, sub } from './asm-ours.mjs';
const G = 288, INH = 16;                                   // Dark Green; inherit
const a = new Asm('seine_lid', [0.5, 0, 2]);
const PIVOT_Y = 3 * 0.4 - 0.5;                              // the hinge axle: 10 LDU (half a stud) under the base's top face, at the cell centre
const RZ = [0, 1, 0, -1, 0, 0, 0, 0, 1];                    // a quarter turn about +z taking up (+y) to the street (+x)
const hingeStuds = [];
for (const z of [0, 2]) {
  const base = a.up('3937', G, 0, 0, z, 1);                 // length along z
  const pivot = [0.5, PIVOT_Y, 0];
  const R = mul(RZ, base.R); const t = add(pivot, app(RZ, sub(base.t, pivot)));
  const top = a.put('3938', G, R, t);
  hingeStuds.push(...a.side(top).filter((s) => s.d[0] === 1));
}
if (hingeStuds.length !== 4) throw new Error('expected 4 street-facing hinge studs, got ' + hingeStuds.length);
const mid = (ps) => ps.reduce((s, p) => add(s, p), [0, 0, 0]).map((v) => v / ps.length);
const face = mid(hingeStuds.map((s) => s.p));               // x = the hinge plates' face, y = the axle, z = 2
const D = [1, 0, 0];
// the lid: local x along −z (so the print 'up' of every tile below is world up), local −z row on the hinge studs
const lid = a.onStud('3020', G, { p: face, d: D }, [0, 0, -1], 'x', [0, -0.4, 0.5]);
const lidTop = a.onStud('3710', G, { p: add(face, [0, 2, 0]), d: D }, [0, 0, -1], 'x', [0, -0.4, 0]);
const studs = [...a.side(lid), ...a.side(lidTop)].filter((s) => s.d[0] === 1);
if (studs.length !== 12) throw new Error('expected 12 lid studs, got ' + studs.length);
const at = (c, r) => { const z = 0.5 + c, y = face[1] + r; const s = studs.find((q) => Math.abs(q.p[2] - z) < 0.01 && Math.abs(q.p[1] - y) < 0.01); if (!s) throw new Error(`no lid stud at col ${c} row ${r}`); return s.p; };
// the display, in member order the scene relies on (paris-seine.ts LID_SLOTS): 2×2 poster, 1×2 poster, 1×2 poster, 1×2 card, 1×1 card, 1×1 card
a.onStud('3068b', INH, { p: mid([at(0, 1), at(1, 1), at(0, 2), at(1, 2)]), d: D }, [0, 0, -1], 'x');
a.onStud('3069b', INH, { p: mid([at(2, 1), at(2, 2)]), d: D }, [0, 1, 0], 'x');
a.onStud('3069b', INH, { p: mid([at(3, 1), at(3, 2)]), d: D }, [0, 1, 0], 'x');
a.onStud('3069b', INH, { p: mid([at(0, 0), at(1, 0)]), d: D }, [0, 0, -1], 'x');
a.onStud('3070b', INH, { p: at(2, 0), d: D }, [0, 0, -1], 'x');
a.onStud('3070b', INH, { p: at(3, 0), d: D }, [0, 0, -1], 'x');
console.log(a.write(), 'lid face x', face[0].toFixed(2), 'axle y', face[1].toFixed(2));
void RY;
