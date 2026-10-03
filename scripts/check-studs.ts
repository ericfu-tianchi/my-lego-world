// Build gate: the catalogue's hand-filled stud maps must match the real mould. For every LDraw-baked catalogue part, the up-facing stud
// primitives of the LDraw file are mapped onto the part's canonical cells and compared with what the catalogue declares (hasStud / 'center' /
// studPoints). A declared stud the mould does not have lets the validator connect parts that could never be built (2026-10-03: the 4×4
// pointed wedge 22391 was declared with six studs and really has two — Eric found cheese slopes and pyramids standing on its sloped faces).
//   LDRAW_DIR=… npx tsx scripts/check-studs.ts [key …]
import { execFileSync } from 'node:child_process';
import { PARTS, hasStud, type PartDef } from '../src/core/catalog';
import '../src/core/catalog-cz-bridge'; import '../src/core/catalog-cz-orloj'; import '../src/core/catalog-cz-houses'; import '../src/core/catalog-cz-square';
import { bakedBox } from '../src/core/ldraw';

// parts whose stud semantics are deliberately not the mould's top studs (minifig rig, hosted panes, assemblies) are skipped
const SKIP_CAT = new Set(['minifig']);
const want = new Set(process.argv.slice(2));
let bad = 0, checked = 0;
const studsOf = (id: string): [number, number, number][] => {
  let out = '';
  try { out = execFileSync('node', ['tools/ldraw/studs.mjs', id], { encoding: 'utf8', env: process.env, stdio: ['ignore', 'pipe', 'ignore'] }); } catch { return []; }
  const pts: [number, number, number][] = [];
  for (const line of out.split('\n')) {
    const m = /^\s*stud\s+at \[\s*(\S+)\s+(\S+)\s+(\S+)\]\s+points \[\s*(\S+)\s+(\S+)\s+(\S+)\]/.exec(line); if (!m) continue;
    const [x, y, z, , dy] = m.slice(1).map(Number); if (dy > -0.9) continue;   // only studs pointing up
    pts.push([x / 20, -y / 20, -z / 20]);                                       // LDraw → ours: x, −y, −z (tools/ldraw/asm-ours.mjs)
  }
  return pts;
};
for (const p of Object.values(PARTS) as PartDef[]) {
  if (!p.ldraw || p.member || p.bl === 'asm' || SKIP_CAT.has(p.cat) || (want.size && !want.has(p.key))) continue;
  if (p.studs === 'none' && !p.studPoints) continue;   // declares nothing: cannot over-declare
  const real = studsOf(p.ldraw); if (!real.length && p.studs === 'none') continue;
  const bb = bakedBox(p.ldraw); const cx = p.anchor === 'bbox' || !p.anchor ? (bb[0] + bb[3]) / 2 : 0, cz = p.anchor === 'bbox' || !p.anchor ? (bb[2] + bb[5]) / 2 : 0;
  const realCells = new Set(real.map(([x, , z]) => `${Math.floor(x - cx + p.w / 2 + 1e-6)},${Math.floor(z - cz + p.d / 2 + 1e-6)}`));
  const declared = new Set<string>();
  if (p.studPoints) for (const [x, z] of p.studPoints) declared.add(`${Math.floor(x + p.w / 2 + 1e-6)},${Math.floor(z + p.d / 2 + 1e-6)}`);
  else if (p.studs === 'center') declared.add(`${Math.floor((p.w - 1) / 2)},${Math.floor((p.d - 1) / 2)}`);
  else for (let i = 0; i < p.w; i++) for (let j = 0; j < p.d; j++) if (hasStud(p, i, j)) declared.add(`${i},${j}`);
  checked++;
  // a centre stud between four cells (jumpers, round plates) shows up as a fractional cell; accept any declared cell touching it
  const extra = [...declared].filter((c) => !realCells.has(c) && !(p.studs === 'center' || p.studPoints));
  if (p.studs === 'center' || p.studPoints) { if (!real.length) { bad++; console.log(`✗ ${p.key} (${p.ldraw}): declares a centre stud, the mould has none`); } continue; }
  if (extra.length) { bad++; console.log(`✗ ${p.key} (${p.ldraw}): declares studs the mould does not have at cells ${extra.join(' ')} — mould studs at ${[...realCells].join(' ') || 'none'}`); }
}
console.log(`${bad ? 'FAIL' : 'PASS'} · stud maps of ${checked} LDraw parts${bad ? ` · ${bad} over-declared` : ''}`);
process.exit(bad ? 1 : 0);
