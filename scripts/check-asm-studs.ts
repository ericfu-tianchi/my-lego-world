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

const BY_DESIGN = new Set(['87994', '3957a', '30374', '11055', '61252', '60601', '57585', '73230', '3704', '4274', '26047', '86500', '8181', '3673', '4719c03', '2039', '11090', '4519', '3938', '48729b']);   // 8181 Technic dome: held on its bowl's lip and by the pin above
const want = process.argv.slice(2); let bad = 0;
const studCache = new Map<string, { at: number[]; dir: number[] }[]>();
const PINS: Record<string, { at: number[]; dir: number[] }[]> = { '3673': [{ at: [0, 0, 0], dir: [1, 0, 0] }, { at: [0, 0, 0], dir: [-1, 0, 0] }] };   // a Technic pin joins the two parts it sits half in: its middle at the joint, pointing into each
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
    const B = list[b]; const bb = bakedBox(B.id);
    for (let a = 0; a < n; a++) { if (a === b || (linked[a] && linked[b])) continue;   // every pair: a brick held from below must still mark the plate it clutches above
      for (const s of studs[a]) { const l = appT(B.m, s.at.map((v, i) => v - B.p[i])); const d = appT(B.m, s.dir);
        if (d[1] < 0.9) continue; if (Math.abs(l[1] - bb[1]) > 0.15) continue;   // the stud points up into B's underside, at B's bottom face
        if (l[0] < bb[0] + 0.1 || l[0] > bb[3] - 0.1 || l[2] < bb[2] + 0.1 || l[2] > bb[5] - 0.1) continue;
        linked[b] = true; linked[a] = true; break; }
    }
  }
  const lowest = Math.min(...list.map((mb, i) => app(mb.m, [0, bakedBox(mb.id)[1], 0])[1] + mb.p[1]));
  const loose = list.map((mb, i) => ({ mb, i })).filter(({ mb, i }) => !linked[i] && !BY_DESIGN.has(mb.id) && Math.abs(app(mb.m, [0, bakedBox(mb.id)[1], 0])[1] + mb.p[1] - lowest) > 0.05);
  if (loose.length) { bad++; console.log(`FAIL ${name}: ${loose.length} of ${n} members have no stud joint`); for (const { mb, i } of loose.slice(0, 12)) console.log(`    ${mb.id}#${i} ${mb.color} at (${mb.p.map((v) => v.toFixed(2)).join(', ')})`); }
  else console.log(`ok   ${name}: ${n} members, every one clutched`);
}
console.log(bad ? `FAIL · ${bad} assemblies with unclutched members` : 'PASS · every assembly member sits on a real stud');
process.exit(bad ? 1 : 0);
