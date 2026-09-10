// Buildability check: every part must connect through stud/anti-stud contact to a grounded part (y=0).
// Usage: node tools/validate.mjs [japan|singapore]
import fs from 'fs';
const files = ['src/lib/colors.js', 'src/lib/parts.js', 'src/lib/builder.js', 'src/scenes/japan.js', 'src/scenes/singapore.js'];
let src = 'const THREE = {};\n' + files.map((f) => fs.readFileSync(f, 'utf8').replace(/^import[^;]+;\s*$/gm, '')).join('\n');
src += '\nglobalThis.__X = { Blueprint, PARTS, footprint, buildJapan, buildSingapore };';
(0, eval)(src);
const { Blueprint, PARTS, footprint, buildJapan, buildSingapore } = globalThis.__X;

const NO_STUDS = /^(tile_|cheese_|curve_|dome_|slope_corner_|cheese_corner_|fence_|glass_|bar_|lamp_|fig_hair|fig_kasa|fig_hands|antenna_|slope_1x1$)/;
const BACK_ROW = /^slope_(1x2|2x2|1x3|2x3|1x4)$/;
// does part `b` (below) offer studs anywhere inside the overlap rectangle?
function studsIn(b, ox0, ox1, oz0, oz1) {
  if (NO_STUDS.test(b.p.id)) return false;
  if (b.p.id === 'dish_2x2' || b.p.id === 'dish_4x4' || b.p.id === 'fig_head' || b.p.id === 'fig_torso' || b.p.id === 'cone_1x1' || b.p.id === 'cone_2x2') {
    const cx = (b.x0 + b.x1) / 2, cz = (b.z0 + b.z1) / 2; return cx > ox0 - 1e-6 && cx < ox1 + 1e-6 && cz > oz0 - 1e-6 && cz < oz1 + 1e-6;
  }
  if (BACK_ROW.test(b.p.id)) {
    // stud row is canonical z=0 row; rot 0 → min z row, 1 → min x col, 2 → max z row, 3 → max x col
    const r = b.p.rot; let sx0 = b.x0, sx1 = b.x1, sz0 = b.z0, sz1 = b.z1;
    if (r === 0) sz1 = b.z0 + 1; else if (r === 2) sz0 = b.z1 - 1; else if (r === 1) sx1 = b.x0 + 1; else sx0 = b.x1 - 1;
    return Math.min(sx1, ox1) > Math.max(sx0, ox0) && Math.min(sz1, oz1) > Math.max(sz0, oz0);
  }
  return true;
}
function analyze(name, build, seed) {
  const bp = new Blueprint(seed); build(bp);
  const items = bp.parts.map((p, i) => { const P = PARTS[p.id]; const [fw, fd] = footprint(P, p.rot); return { i, p, x0: p.x, x1: p.x + fw, z0: p.z, z1: p.z + fd, y0: p.y, y1: p.y + P.h }; });
  const byTop = new Map(); for (const it of items) { if (!byTop.has(it.y1)) byTop.set(it.y1, []); byTop.get(it.y1).push(it); }
  const adj = items.map(() => []); let looseLinks = 0, strictLinks = 0;
  for (const a of items) {
    for (const b of byTop.get(a.y0) || []) {
      const ox0 = Math.max(a.x0, b.x0), ox1 = Math.min(a.x1, b.x1), oz0 = Math.max(a.z0, b.z0), oz1 = Math.min(a.z1, b.z1);
      if (ox1 <= ox0 + 1e-6 || oz1 <= oz0 + 1e-6) continue;
      looseLinks++;
      if (studsIn(b, ox0, ox1, oz0, oz1)) { strictLinks++; adj[a.i].push(b.i); adj[b.i].push(a.i); }
    }
  }
  const seen = new Uint8Array(items.length); const stack = [];
  for (const it of items) if (it.y0 === 0) { seen[it.i] = 1; stack.push(it.i); }
  while (stack.length) { const i = stack.pop(); for (const j of adj[i]) if (!seen[j]) { seen[j] = 1; stack.push(j); } }
  const floating = items.filter((it) => !seen[it.i]);
  const byId = {}; for (const f of floating) byId[f.p.id] = (byId[f.p.id] || 0) + 1;
  const offGrid = items.filter((it) => !Number.isInteger(it.p.x) || !Number.isInteger(it.p.z)).length;
  console.log(`\n${name}: ${items.length} parts · ${floating.length} not connected to ground (${(floating.length / items.length * 100).toFixed(1)}%) · ${offGrid} placed on half-stud offsets`);
  console.log('  worst offenders:', Object.entries(byId).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([k, v]) => `${k}×${v}`).join(', '));
  // sample locations of floating parts to identify structures
  const zones = {}; for (const f of floating) { const k = `x${Math.floor(f.x0 / 8) * 8} z${Math.floor(f.z0 / 8) * 8} y${Math.floor(f.y0 / 10) * 10}`; zones[k] = (zones[k] || 0) + 1; }
  console.log('  zones:', Object.entries(zones).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([k, v]) => `[${k}]×${v}`).join(' '));
}
const which = process.argv[2];
if (!which || which === 'japan') analyze('Kyoto', buildJapan, 7);
if (!which || which === 'singapore') analyze('Singapore', buildSingapore, 11);
