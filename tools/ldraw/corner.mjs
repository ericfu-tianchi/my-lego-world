// Which footprint corners of a baked part are cut away (round / missing corners)? Prints, for each bbox corner in our frame (x, z),
// whether the body reaches it — used to orient corner-round moulds without guessing.   node tools/ldraw/corner.mjs 3063b 79491 27925
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export function corners(id) {
  const src = fs.readFileSync(path.join(ROOT, 'src/parts/ldraw', `p${id}.ts`), 'utf8'); const p = JSON.parse(/const p: Baked = (\{.*\});/s.exec(src)[1]);
  const b = Buffer.from(p.pos, 'base64'); const v = new Int16Array(b.buffer, b.byteOffset, b.length / 2); const [x0, y0, z0, x1, y1, z1] = p.bbox; const out = {};
  for (const [sx, sz] of [[1, 1], [1, -1], [-1, -1], [-1, 1]]) { const cx = sx > 0 ? x1 : x0, cz = sz > 0 ? z1 : z0; let hit = false;
    for (let i = 0; i < v.length; i += 3) { const x = v[i] / p.q, z = v[i + 2] / p.q; if (Math.abs(x - cx) < 0.12 && Math.abs(z - cz) < 0.12) { hit = true; break; } }
    out[`${sx > 0 ? '+' : '-'}x${sz > 0 ? '+' : '-'}z`] = hit; }
  return out;
}
if (process.argv[1] === fileURLToPath(import.meta.url)) for (const id of process.argv.slice(2)) console.log(id, JSON.stringify(corners(id)));
