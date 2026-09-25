// Print the stud / anti-stud connection points of an LDraw part or assembly in LDU, part frame (Y down, 20 LDU per stud, 8 per plate).
//   LDRAW_DIR=... node tools/ldraw/studs.mjs 87087 4733 mymodel.ldr
// Walks type-1 references recursively; a `stud*.dat` primitive marks a stud (its local +y axis points INTO the host, tip at -4 in prim frame),
// `stud4*.dat` marks an anti-stud tube (underside). Output: kind, position of the stud base (on the host face), direction the stud points.
import fs from 'node:fs'; import path from 'node:path';
import { fileURLToPath } from 'node:url';
const LIB = process.env.LDRAW_DIR; const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
function find(rel) { for (const base of [LIB, path.join(ROOT, 'vendor/ldraw')]) if (base) for (const sub of ['', 'parts', 'p', 'parts/s', 'p/48', 'asm', 'models']) for (const t of [rel, rel.toLowerCase()]) { const f = path.join(base, sub, t); if (fs.existsSync(f)) return f; } return null; }
function mul(A, B) { const R = new Array(12).fill(0); for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) R[r * 3 + c] = A[r * 3] * B[c] + A[r * 3 + 1] * B[3 + c] + A[r * 3 + 2] * B[6 + c]; for (let r = 0; r < 3; r++) R[9 + r] = A[r * 3] * B[9] + A[r * 3 + 1] * B[10] + A[r * 3 + 2] * B[11] + A[9 + r]; return R; }
const I = [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0];
function apply(M, p) { return [M[0] * p[0] + M[1] * p[1] + M[2] * p[2] + M[9], M[3] * p[0] + M[4] * p[1] + M[5] * p[2] + M[10], M[6] * p[0] + M[7] * p[1] + M[8] * p[2] + M[11]]; }
function rot(M, v) { return [M[0] * v[0] + M[1] * v[1] + M[2] * v[2], M[3] * v[0] + M[4] * v[1] + M[5] * v[2], M[6] * v[0] + M[7] * v[1] + M[8] * v[2]]; }
const out = [];
function walk(rel, M, depth) {
  rel = rel.replace(/\\/g, "/"); const base = path.basename(rel).toLowerCase();
  if (/^stud(2|2a|6|6a|p01|10|15|17a|18a)?\.dat$/.test(base) || base === 'stud.dat') { const p = apply(M, [0, 0, 0]); const d = rot(M, [0, -1, 0]); out.push({ kind: 'stud', at: p, dir: d }); return; }
  if (/^stud(3|4|4a|4h|4f|4o|4s|12)\.dat$/.test(base)) { const p = apply(M, [0, 0, 0]); const d = rot(M, [0, 1, 0]); out.push({ kind: 'tube', at: p, dir: d }); return; }
  if (depth > 6) return; const f = find(rel); if (!f) return;
  for (const line of fs.readFileSync(f, 'utf8').split('\n')) { const t = line.trim().split(/\s+/); if (t[0] !== '1' || t.length < 15) continue; const [, , x, y, z, a, b, c, d, e, g, h, i, j] = t.map(Number); const sub = t.slice(14).join(' '); walk(sub, mul(M, [a, b, c, d, e, g, h, i, j, x, y, z]), depth + 1); }
}
for (const id of process.argv.slice(2)) { out.length = 0; const rel = id.endsWith('.ldr') || id.endsWith('.dat') ? id : id + '.dat'; walk(rel, I, 0);
  const f = (v) => v.map((n) => (Math.abs(n) < 1e-6 ? 0 : +n.toFixed(2)).toString().padStart(7)).join(' ');
  console.log(`== ${id}  (${out.filter((o) => o.kind === 'stud').length} studs, ${out.filter((o) => o.kind === 'tube').length} tubes)`);
  for (const o of out) console.log(`  ${o.kind.padEnd(5)} at [${f(o.at)}]  points [${f(o.dir)}]`); }
