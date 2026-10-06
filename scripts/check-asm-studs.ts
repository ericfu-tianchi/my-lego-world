// Real stud connections inside exploded assemblies (2026-10-03, Eric: "自查有没有没插到插槽里、两个零件融合到一起的拼搭"):
// check-assemblies proves no overlaps and that every brick touches its neighbours — but touching is not clutching. Here every member must
// have at least one real stud joint with another member: a stud of one (from the LDraw mould, studs.mjs connectors) sitting on the bottom
// face of the other, inside its footprint, pointing into it — in any orientation, so SNOT joints count. Members held by other means
// (bars in clips, axles, pins, glass in its frame, dishes on their stud's own geometry) are listed in BY_DESIGN and skipped.
//   LDRAW_DIR=<main repo>/vendor/ldraw-lib/ldraw npx tsx scripts/check-asm-studs.ts [assembly …]
import { ASM } from '../src/parts/ldraw/asm/index';
import { bakedBox } from '../src/core/ldraw';
// the moulds come from the vendored LDraw library; default to the main repo's copy so the gate runs without the env var
import path from 'node:path'; import fs from 'node:fs';
if (!process.env.LDRAW_DIR) { for (const c of [path.resolve('vendor/ldraw-lib/ldraw'), path.resolve('../My Lego World/vendor/ldraw-lib/ldraw')]) if (fs.existsSync(c)) { process.env.LDRAW_DIR = c; break; } }
if (!process.env.LDRAW_DIR) throw new Error('check-asm-studs needs LDRAW_DIR (the vendored LDraw library)');
const { connectors } = await import('../tools/ldraw/asm-lib.mjs');
import { HOSTS } from '../src/core/validate';
import { PARTS } from '../src/core/catalog';

const BY_DESIGN = new Set(['th_hose_a', 'th_hose_b', 'th_hose_c', 'th_hose_d', '2488', '1997', '18395', '87747', '87994', '3957a', '30374', '11055', '61252', '60601', '57585', '73230', '3704', '4274', '26047', '86500', '8181', '3673', '4719c03', '2039', '11090', '4519', '3938', '48729b', '42511', '93273']);   // 8181 Technic dome: held on its bowl's lip and by the pin above; 42511 skateboard deck: held by its clips on the wheel axles
// Technic (LA Pacific Wheel, 2026-10-04): an axle or pin joins every beam / plate whose hole it passes through — its axis along that part's hole
// axis (local y), the part's hole centre on the axis, and the two overlapping by more than a bush. Hangers and bushes sit on axles by design.
const AXLES: Record<string, number> = { '3704': 1, '3708': 6, '44294': 3.5, '60485': 4.5, '4519': 1.5, '2780': 1, '3707': 4, '3737': 5, '3706': 3, '32073': 2.5 };   // half-length along local x
for (const id of ['32039', '3713', '32123a', '6536', '3737', '26021c01']) BY_DESIGN.add(id);   // cross blocks turn on their vertex axle; a spoke axle slides through two of them; a coaster car rides on its rails
for (const id of ['973', '3815', '3816', '3817', '3818', '3819', '3820', '3626c', '12890', '3901']) BY_DESIGN.add(id);   // LA pier r2: the coaster riders — a minifig's parts join by pins and hinges, and a seated figure's legs take the well's studs at an angle the stud test does not model
// LA palms r2 (2026-10-05): a leaf's seat — the 1 × 2 plate of a palm leaf 2518 / 6148 or a swordleaf fan 10884 — is its bottom face for a stud
// joint, not the bottom of its box, which is the tip of the drooping blade (LDraw: the seat's underside is 8 LDU below the origin)
const SEAT_BOTTOM: Record<string, number> = { '2518': -0.4, '6148': -0.4, '10884': -0.4 };
const seatBox = (id: string) => { const b = [...bakedBox(id)]; if (SEAT_BOTTOM[id] !== undefined) b[1] = SEAT_BOTTOM[id]; return b; };
for (const id of ['11610', '2536b', '6064b']) BY_DESIGN.add(id);   // LA palms r3: an inverted cone's shaft in the hollow stud below, a palm trunk segment's pin in the core below, a prickly bush threaded on a bar
// parts whose baked box reaches below their bottom face: the ball of a ball-joint plate hangs 0.2 under the plate (the plate's underside is at −0.4)
const BOTTOM: Record<string, number> = { '22890': -0.4 };
const want = process.argv.slice(2); let bad = 0;
const studCache = new Map<string, { at: number[]; dir: number[] }[]>();
const PINS: Record<string, { at: number[]; dir: number[] }[]> = { '3673': [{ at: [0, 0, 0], dir: [1, 0, 0] }, { at: [0, 0, 0], dir: [-1, 0, 0] }], '19119': [{ at: [-0.625, 1.0227, 0.0], dir: [-0.5, 0.866, 0] }, { at: [0.8927, 0.4749, 0.0], dir: [0.9397, 0.342, 0] }, { at: [0.3125, 1.0227, -0.5412], dir: [0.25, 0.866, -0.433] }, { at: [-0.4464, 0.4749, 0.7731], dir: [-0.4698, 0.342, 0.8138] }, { at: [0.3125, 1.0227, 0.5412], dir: [0.25, 0.866, 0.433] }, { at: [-0.4464, 0.4749, -0.7731], dir: [-0.4698, 0.342, -0.8138] }] };   // a Technic pin joins the two parts it sits half in: its middle at the joint, pointing into each; 19119's six stem tips take a 1 × 1 round plate's tube (the caps of 19119c02), from its LDraw file
for (const id of ['86210', '60602', '2496', '32063', '2780']) BY_DESIGN.add(id);   // LA Venice: glass in its frame, the skateboard's clipped wheels, the tower's thin brace beams and their pins
PINS['2780'] = [{ at: [0, 0, 0], dir: [1, 0, 0] }, { at: [0, 0, 0], dir: [-1, 0, 0] }];   // a Technic pin joins the two parts it sits half in
for (const id of ['63965a', '29592']) BY_DESIGN.add(id);   // LA Venice r2: the lamp pole's bar (stub in a round brick's hollow stud, top in the head collar); a dumbbell lying in a clip tile
for (const id of ['973', '3818', '3819', '3820', '3626c', '46303']) BY_DESIGN.add(id);
for (const id of ['3815', '3816', '3817', '11253', '87995']) BY_DESIGN.add(id);   // LA r3, la_roller: the legs on the hips' pins (one swung back), a skate on each foot's hole, the afro on the head   // LA Venice r2, la_skater: a minifig of real parts — torso on the hips' pins, arms on the torso's, hands in the wrists, head and helmet on the neck
const studsOf = (id: string) => { if (PINS[id]) return PINS[id]; let s = studCache.get(id); if (!s) { s = (connectors(id) as { kind: string; at: number[]; dir: number[] }[]).filter((c) => c.kind === 'stud').map((c) => ({ at: [c.at[0] / 20, -c.at[1] / 20, -c.at[2] / 20], dir: [c.dir[0], -c.dir[1], -c.dir[2]] })); studCache.set(id, s); } return s; };
const app = (m: number[], v: number[]) => [0, 1, 2].map((i) => m[i * 3] * v[0] + m[i * 3 + 1] * v[1] + m[i * 3 + 2] * v[2]);
const appT = (m: number[], v: number[]) => [0, 1, 2].map((i) => m[i] * v[0] + m[3 + i] * v[1] + m[6 + i] * v[2]);   // transpose = inverse for a rotation
for (const [name, list] of Object.entries(ASM)) {
  if (want.length && !want.includes(name)) continue;
  if (['merlion_body', 'mbs_core', 'mbstower_core', 'streecanopy_cone', 'streecanopy_bowl'].includes(name) && !want.length) continue;   // retired / hosted Singapore builds, as in check-assemblies
  if (Object.values(PARTS).some((d) => d.ldraw === name && HOSTS[d.key])) continue;   // a hosted assembly (glass in its tower) clutches its host, which this per-assembly pass cannot see
  const n = list.length; const linked = new Array(n).fill(false);
  const studs = list.map((mb) => studsOf(mb.id).map((s) => ({ at: app(mb.m, s.at).map((v, i) => v + mb.p[i]), dir: app(mb.m, s.dir) })));
  for (let b = 0; b < n; b++) {
    const B = list[b]; const bb = seatBox(B.id); if (BOTTOM[B.id] !== undefined) bb[1] = BOTTOM[B.id];
    for (let a = 0; a < n; a++) { if (a === b || (linked[a] && linked[b])) continue;   // every pair: a brick held from below must still mark the plate it clutches above
      for (const s of studs[a]) { const l = appT(B.m, s.at.map((v, i) => v - B.p[i])); const d = appT(B.m, s.dir);
        if (d[1] < 0.9) continue; if (Math.abs(l[1] - bb[1]) > 0.15) continue;   // the stud points up into B's underside, at B's bottom face
        if (l[0] < bb[0] + 0.1 || l[0] > bb[3] - 0.1 || l[2] < bb[2] + 0.1 || l[2] > bb[5] - 0.1) continue;
        linked[b] = true; linked[a] = true; break; }
    }
  }
  for (let ai = 0; ai < n; ai++) { const A = list[ai]; const half = AXLES[A.id]; if (half === undefined) continue; const u = app(A.m, [1, 0, 0]);
    for (let b = 0; b < n; b++) { if (b === ai || AXLES[list[b].id] !== undefined) continue; const B = list[b]; const bb = bakedBox(B.id); const d = appT(B.m, u); if (Math.abs(d[1]) < 0.9) continue;
      const l = appT(B.m, A.p.map((v, i) => v - B.p[i])); const near = (v: number) => Math.abs(v * 2 - Math.round(v * 2)) < 0.2;
      if (!near(l[0]) || !near(l[2]) || l[0] < bb[0] || l[0] > bb[3] || l[2] < bb[2] || l[2] > bb[5]) continue;
      if (Math.min(l[1] + half, bb[4]) - Math.max(l[1] - half, bb[1]) < 0.2) continue;
      linked[ai] = true; linked[b] = true; } }
  // a swordleaf fan 10884 clipped onto a life ring 30340: its C-clip's centre (leaf frame (0, 4, 30) LDU) on the ring's bar — the circle of radius 20
  // LDU round (0, 4, −19) in the ring's frame — within 3 LDU (the clip closes on the 8 LDU bar)
  for (let a = 0; a < n; a++) { if (list[a].id !== '10884') continue; const A = list[a]; const c = app(A.m, [0, -0.2, -1.5]).map((v, i) => v + A.p[i]);
    for (let b = 0; b < n; b++) { if (list[b].id !== '30340') continue; const B = list[b]; const l = appT(B.m, c.map((v, i) => v - B.p[i]));
      if (Math.abs(Math.hypot(l[0], l[2] - 0.95) - 1) < 0.15 && Math.abs(l[1] + 0.2) < 0.15) { linked[a] = true; linked[b] = true; break; } } }
  const lowest = Math.min(...list.map((mb, i) => app(mb.m, [0, bakedBox(mb.id)[1], 0])[1] + mb.p[1]));
  const loose = list.map((mb, i) => ({ mb, i })).filter(({ mb, i }) => !linked[i] && !BY_DESIGN.has(mb.id) && Math.abs(app(mb.m, [0, bakedBox(mb.id)[1], 0])[1] + mb.p[1] - lowest) > 0.05);
  if (loose.length) { bad++; console.log(`FAIL ${name}: ${loose.length} of ${n} members have no stud joint`); for (const { mb, i } of loose.slice(0, 12)) console.log(`    ${mb.id}#${i} ${mb.color} at (${mb.p.map((v) => v.toFixed(2)).join(', ')})`); }
  else console.log(`ok   ${name}: ${n} members, every one clutched`);
}
console.log(bad ? `FAIL · ${bad} assemblies with unclutched members` : 'PASS · every assembly member sits on a real stud');
process.exit(bad ? 1 : 0);
