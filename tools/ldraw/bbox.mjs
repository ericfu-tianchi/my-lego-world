// Vertex bounding box of LDraw parts (LDU, part frame, Y down): which way does the body extend from the origin?
//   LDRAW_DIR=... node tools/ldraw/bbox.mjs 11477 54200 3024
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const LIB = process.env.LDRAW_DIR; const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
function find(rel) { rel = rel.replace(/\\/g, '/'); for (const base of [LIB, path.join(ROOT, 'vendor/ldraw')]) if (base) for (const sub of ['', 'parts', 'p', 'parts/s', 'p/48', 'asm']) for (const t of [rel, rel.toLowerCase()]) { const f = path.join(base, sub, t); if (fs.existsSync(f)) return f; } return null; }
const mul = (A, B) => { const R = new Array(12).fill(0); for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) R[r * 3 + c] = A[r * 3] * B[c] + A[r * 3 + 1] * B[3 + c] + A[r * 3 + 2] * B[6 + c]; for (let r = 0; r < 3; r++) R[9 + r] = A[r * 3] * B[9] + A[r * 3 + 1] * B[10] + A[r * 3 + 2] * B[11] + A[9 + r]; return R; };
const apply = (M, p) => [M[0] * p[0] + M[1] * p[1] + M[2] * p[2] + M[9], M[3] * p[0] + M[4] * p[1] + M[5] * p[2] + M[10], M[6] * p[0] + M[7] * p[1] + M[8] * p[2] + M[11]];
for (const id of process.argv.slice(2)) {
  const bb = [Infinity, Infinity, Infinity, -Infinity, -Infinity, -Infinity]; let n = 0;
  const walk = (rel, M, depth) => { if (depth > 8) return; const f = find(rel); if (!f) return;
    for (const line of fs.readFileSync(f, 'utf8').split('\n')) { const t = line.trim().split(/\s+/);
      if (t[0] === '1' && t.length >= 15) { const v = t.slice(2, 14).map(Number); walk(t.slice(14).join(' '), mul(M, [v[3], v[4], v[5], v[6], v[7], v[8], v[9], v[10], v[11], v[0], v[1], v[2]]), depth + 1); }
      else if ((t[0] === '3' || t[0] === '4') && t.length >= 11) { const k = t[0] === '3' ? 3 : 4; for (let i = 0; i < k; i++) { const p = apply(M, [+t[2 + 3 * i], +t[3 + 3 * i], +t[4 + 3 * i]]); for (let a = 0; a < 3; a++) { bb[a] = Math.min(bb[a], p[a]); bb[3 + a] = Math.max(bb[3 + a], p[a]); } n++; } } } };
  walk(id.endsWith('.dat') || id.endsWith('.ldr') ? id : id + '.dat', [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0], 0);
  console.log(`${id.padEnd(8)} x[${bb[0]}, ${bb[3]}]  y[${bb[1]}, ${bb[4]}]  z[${bb[2]}, ${bb[5]}]  (${n} verts)`);
}
