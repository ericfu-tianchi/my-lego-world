// Paris · Notre-Dame west façade (2026-10-03, docs/countries/france.md §1.14): the rose and the small side rosettes.
//   LDRAW_DIR=… node tools/ldraw/asm-paris-nd.mjs && node tools/ldraw/bake.mjs nd_rose.ldr nd_rosette.ldr --force
// nd_rose — brick-built, no print, no spokes (round 2). A Black 1×4 brick with four side studs, raised on two Black 1×4 bricks and a 1×4 plate
// at the back of a 6 × 3 × 15-plate recess, carries a Trans-Black 6×6 round plate on one side stud (its centre one stud above). On the glass:
// a Tan 2×2 round tile (the centre disc), twelve Tan five-petal plates (the petal ring), eight Tan 1×1 round tiles (the outer ring).
// Proxy: footprint x −3..3, z 0..3 (front +z), 15 plates.
// nd_rosette — the small rosette over each pair of tower-bay lancets: a Tan 1×2 brick with two side studs carries a Black 2×2 round plate
// by its lower row (round 2: bare glass). Glass colour: ND_GLASS=40 Trans-Black (chosen) or 47 Trans-Clear.
import { Asm, RY, basis } from './asm-ours.mjs';
const PLATE = 0.4, TAN = 19, BLACK = 72, GLASS = +(process.env.ND_GLASS ?? 40);   // 2026-10-05 (Eric, façade photo): smoky Trans-Black glass over Dark Bluish Gray backing (72), not black;   // 40 Trans-Black (chosen, round 2), 47 Trans-Clear (round 2: glazing is glass, not opaque black)
{
  // round 2 (Eric / coordinator): a rose, not a wheel — no spokes. A Trans glass 6×6 round plate on the side stud; the support and carrier
  // are Black so the glass reads dark, not as tan brick.
  const a = new Asm('nd_rose', [0, 0, 1.5]);
  a.up('3010', BLACK, -2, 0, 0, 0); a.up('3010', BLACK, -2, 3, 0, 0); a.up('3710', BLACK, -2, 6, 0, 0);
  let car = a.up('30414', BLACK, -2, 7, 0, 0); let studs = a.side(car).filter((s) => s.d[2] === 1);
  if (studs.length !== 4) { a.parts.pop(); car = a.up('30414', BLACK, -2, 7, 0, 2); studs = a.side(car).filter((s) => s.d[2] === 1); }
  if (studs.length !== 4) throw new Error('30414: no +z side studs');
  studs.sort((p, q) => p.p[0] - q.p[0]);
  const s = studs[1];
  a.onStud('11213', GLASS, s, [1, 0, 0], 'x', [-0.5, -0.4, -0.5]);
  const c = [0, s.p[1] - 0.5, s.p[2]];
  if (Math.abs(c[1] - 7.5 * PLATE) > 1e-6) throw new Error('rose centre ' + c[1] / PLATE + ' plates, want 7.5');
  const face = c[2] + 0.4;
  // centre disc: a Tan 2×2 round tile on the four inner studs; the petals: Tan five-petal plates on the twelve studs of the next ring (r 1.6
  // and 2.1); the outer ring: Tan 1×1 round tiles on the eight rim studs (r 2.5). Glass shows between the lobes and round the rim.
  a.onStud('14769', TAN, { p: [0, c[1], face], d: [0, 0, 1] }, [1, 0, 0], 'x');
  for (const [u, v] of [[1.5, 0.5], [1.5, -0.5], [-1.5, 0.5], [-1.5, -0.5], [0.5, 1.5], [-0.5, 1.5], [0.5, -1.5], [-0.5, -1.5], [1.5, 1.5], [1.5, -1.5], [-1.5, 1.5], [-1.5, -1.5]])
    a.onStud('24866', TAN, { p: [u, c[1] + v, face], d: [0, 0, 1] }, [1, 0, 0], 'x');
  for (const [u, v] of [[2.5, 0.5], [2.5, -0.5], [-2.5, 0.5], [-2.5, -0.5], [0.5, 2.5], [-0.5, 2.5], [0.5, -2.5], [-0.5, -2.5]])
    a.onStud('98138', TAN, { p: [u, c[1] + v, face], d: [0, 0, 1] }, [1, 0, 0], 'x');
  console.log(a.write());
}
{
  const a = new Asm('nd_rosette', [1, 0, 0.5]);
  let brick = a.up('11211', BLACK, 0, 0, 0, 0); let studs = a.side(brick).filter((s) => s.d[2] === 1);
  if (studs.length !== 2) { a.parts.length = 0; brick = a.up('11211', BLACK, 0, 0, 0, 2); studs = a.side(brick).filter((s) => s.d[2] === 1); }
  if (studs.length !== 2) throw new Error('11211: no +z side studs');
  const mid = [(studs[0].p[0] + studs[1].p[0]) / 2, studs[0].p[1] + 0.5, studs[0].p[2]];
  a.onStud('4032a', GLASS, { p: mid, d: [0, 0, 1] }, [1, 0, 0], 'x');                   // black glass, hung by its lower row
  // round 2: the four tan tiles read as beads and hid the glass; the bare glass disc reads as the small round window
  console.log(a.write());
}
// nd_head2 — a pointed head over a 2-wide opening: two inverted curved slopes 2×1 (24201) whose thick ends stand on the jambs and whose thin
// ends meet on the axis (round 3: the thick end is the one with the stud a plate lower — LDraw −z — so the earlier turn had them backwards),
// a 1×1 plate on each thick end's low stud bringing the top flush. Proxy: x −2..2, z 0..1, 2 plates, four studs on top.
{
  const a = new Asm('nd_head2', [0, 0, 0.5]);
  a.up('24201', TAN, -2, 0, 0, 1); a.up('24201', TAN, 0, 0, 0, 3);
  a.up('3024', TAN, -2, 1, 0, 0); a.up('3024', TAN, 1, 1, 0, 0);
  console.log(a.write());
}
