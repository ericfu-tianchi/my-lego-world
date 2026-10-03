// Plan outline (convex hull of the vertices, our frame x/z in studs) of a baked part — to see the angle and length of a cut edge.
//   node tools/ldraw/hull.mjs 26601 2450
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
for (const id of process.argv.slice(2)) {
  const src = fs.readFileSync(path.join(ROOT, 'src/parts/ldraw', `p${id}.ts`), 'utf8'); const p = JSON.parse(/const p: Baked = (\{.*\});/s.exec(src)[1]);
  const b = Buffer.from(p.pos, 'base64'); const v = new Int16Array(b.buffer, b.byteOffset, b.length / 2); const pts = [];
  for (let i = 0; i < v.length; i += 3) pts.push([Math.round((v[i] / p.q) * 100) / 100, Math.round((v[i + 2] / p.q) * 100) / 100]);
  pts.sort((a, b) => a[0] - b[0] || a[1] - b[1]); const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = []; for (const q of pts) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  const up = []; for (const q of pts.reverse()) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
  console.log(id, [...lo.slice(0, -1), ...up.slice(0, -1)].map((q) => `(${q})`).join(' '));
}
