// Bake real LDraw part geometry into compact TypeScript modules the app can import.
//   node tools/ldraw/bake.mjs 64648 3836 44676 [--force]
// Library: set LDRAW_DIR to an unzipped complete.zip (folder containing parts/, p/, LDConfig.ldr);
// without it, files are fetched from library.ldraw.org one at a time (0.4 s apart) and cached in vendor/ldraw/.
// Output: src/parts/ldraw/p<id>.ts (Int16 positions ×1024 per stud, Int8 normals, Uint16/32 indices, base64) and index.ts.
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
import * as THREE from 'three';
import { LDrawLoader } from 'three/examples/jsm/loaders/LDrawLoader.js';
import { LDrawConditionalLineMaterial } from 'three/examples/jsm/materials/LDrawConditionalLineMaterial.js';
import { mergeGeometries, mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const OUT = path.join(ROOT, 'src/parts/ldraw'); const CACHE = path.join(ROOT, 'vendor/ldraw');
const LIB = process.env.LDRAW_DIR ? path.resolve(process.env.LDRAW_DIR) : null;
const REMOTE = 'https://library.ldraw.org/library/official/'; const LOCAL = 'http://ldraw.local/';
const args = process.argv.slice(2); const force = args.includes('--force'); const ids = args.filter((a) => !a.startsWith('--'));
if (!ids.length) { console.error('usage: node tools/ldraw/bake.mjs <id> [<id>…] [--force]'); process.exit(1); }

globalThis.ProgressEvent ??= class ProgressEvent extends Event { constructor(type, init = {}) { super(type); Object.assign(this, init); } };
let last = 0; const realFetch = globalThis.fetch;
async function readLocal(rel) {
  const tries = [rel, rel.toLowerCase()];
  for (const base of [LIB, CACHE]) if (base) for (const t of tries) { const f = path.join(base, t); if (fs.existsSync(f)) return fs.readFileSync(f); }
  return null;
}
globalThis.fetch = async (url, init) => {
  const u = typeof url === 'string' ? url : (url && typeof url === 'object' && 'url' in url ? url.url : String(url)); if (!u.startsWith(LOCAL)) return realFetch(url, init);
  const rel = decodeURIComponent(u.slice(LOCAL.length)); const hit = await readLocal(rel);
  if (hit) return new Response(hit, { status: 200 });
  if (LIB) return new Response('', { status: 404 }); // full library present: a miss is a real miss
  const wait = Math.max(0, last + 400 - Date.now()); if (wait) await new Promise((r) => setTimeout(r, wait)); last = Date.now();
  const r = await realFetch(REMOTE + rel.toLowerCase(), { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (r.status !== 200) return new Response('', { status: 404 });
  const buf = Buffer.from(await r.arrayBuffer()); const f = path.join(CACHE, rel.toLowerCase()); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, buf);
  return new Response(buf, { status: 200 });
};

const loader = new LDrawLoader(); loader.setPartsLibraryPath(LOCAL); loader.smoothNormals = true; loader.setConditionalLineMaterial(LDrawConditionalLineMaterial);
await loader.preloadMaterials(LOCAL + 'LDConfig.ldr');
const b64 = (arr) => Buffer.from(arr.buffer, arr.byteOffset, arr.byteLength).toString('base64');
const Q = 1024; // quantisation: units per stud

for (const rawId of ids) {
  // an id ending in .ldr is one of our own assemblies (vendor/ldraw/asm/<name>.ldr): real parts positioned by the LDraw minifig standard
  const isAsm = rawId.endsWith('.ldr'); const id = isAsm ? rawId.replace(/\.ldr$/, '') : rawId; const rel = isAsm ? `asm/${rawId}` : `parts/${rawId}.dat`;
  const file = path.join(OUT, `p${id}.ts`); if (fs.existsSync(file) && !force) { console.log(`${id}: exists (use --force)`); continue; }
  const src = await readLocal(rel) ?? (await (await fetch(LOCAL + rel)).text());
  const header = String(src).split('\n')[0].replace(/^0\s*/, '').trim(); if (header.startsWith('=') || header.startsWith('~')) console.warn(`${id}: header "${header}" — alias/moved part, check the canonical id`);
  const g = await loader.loadAsync(LOCAL + rel);
  g.updateMatrixWorld(true); const geos = [];
  g.traverse((o) => { if (!o.isMesh) return; const ge = o.geometry.clone().applyMatrix4(o.matrixWorld); for (const k of Object.keys(ge.attributes)) if (k !== 'position' && k !== 'normal') ge.deleteAttribute(k); geos.push(ge.index ? ge.toNonIndexed() : ge); });
  if (!geos.length) { console.error(`${id}: no mesh`); continue; }
  let geo = mergeGeometries(geos.map((x) => x.index ? x.toNonIndexed() : x), false);
  // LDraw: Y down, 20 LDU per stud → ours: Y up, 1 unit per stud (rotate π about X, scale 1/20)
  geo.applyMatrix4(new THREE.Matrix4().makeScale(1 / 20, -1 / 20, -1 / 20)); if (!geo.hasAttribute('normal')) geo.computeVertexNormals(); // preserve the loader's crease-aware smoothing
  // Re-wind. A sub-part placed with a mirroring matrix (the left arm 3819 is a mirrored 3818, many left/right pairs are) comes out with
  // reversed triangle winding while its normals stay outward (the normal matrix mirrors correctly). Left alone, back-face culling eats
  // those faces and you see the hand's wrist post through the sleeve. Make every triangle's winding agree with its own normals.
  { const P = geo.attributes.position.array, N = geo.attributes.normal.array; let fixed = 0;
    for (let t = 0; t < P.length; t += 9) {
      const ux = P[t + 3] - P[t], uy = P[t + 4] - P[t + 1], uz = P[t + 5] - P[t + 2], vx = P[t + 6] - P[t], vy = P[t + 7] - P[t + 1], vz = P[t + 8] - P[t + 2];
      const gx = uy * vz - uz * vy, gy = uz * vx - ux * vz, gz = ux * vy - uy * vx;
      const nx = N[t] + N[t + 3] + N[t + 6], ny = N[t + 1] + N[t + 4] + N[t + 7], nz = N[t + 2] + N[t + 5] + N[t + 8];
      if (gx * nx + gy * ny + gz * nz < 0) { for (let k = 0; k < 3; k++) { let w = P[t + 3 + k]; P[t + 3 + k] = P[t + 6 + k]; P[t + 6 + k] = w; w = N[t + 3 + k]; N[t + 3 + k] = N[t + 6 + k]; N[t + 6 + k] = w; } fixed++; }
    }
    if (fixed) console.log(`${id}: re-wound ${fixed} of ${P.length / 9} triangles to match their normals`); }
  geo = mergeVertices(geo, 1e-4); geo.computeBoundingBox();
  const bb = geo.boundingBox; const pos = geo.attributes.position.array, nrm = geo.attributes.normal.array, idx = geo.index.array;
  const P = new Int16Array(pos.length), N = new Int8Array(nrm.length);
  for (let i = 0; i < pos.length; i++) P[i] = Math.round(pos[i] * Q); for (let i = 0; i < nrm.length; i++) N[i] = Math.round(nrm[i] * 127);
  const I = geo.attributes.position.count < 65536 ? new Uint16Array(idx) : new Uint32Array(idx);
  const tris = idx.length / 3; const w = bb.max.x - bb.min.x, d = bb.max.z - bb.min.z, h = (bb.max.y - bb.min.y) / 0.4;
  const rec = { id, name: header, tris, q: Q, i32: I instanceof Uint32Array, bbox: [bb.min.x, bb.min.y, bb.min.z, bb.max.x, bb.max.y, bb.max.z].map((v) => +v.toFixed(4)), pos: b64(P), nrm: b64(N), idx: b64(I) };
  fs.writeFileSync(file, `// LDraw part ${id} "${header}" — baked by tools/ldraw/bake.mjs from the LDraw official library (see source part license, ldraw.org). Do not edit.\nimport type { Baked } from '../../core/ldraw';\nconst p: Baked = ${JSON.stringify(rec)};\nexport default p;\n`);
  console.log(`${id}: "${header}" · ${tris} tris · ${geo.attributes.position.count} verts · ${w.toFixed(2)} × ${d.toFixed(2)} studs · ${h.toFixed(2)} plates · ${(fs.statSync(file).size / 1024).toFixed(0)} KB`);
}
// regenerate index
const files = fs.readdirSync(OUT).filter((f) => /^p[a-z0-9_]+\.ts$/.test(f) && f !== 'index.ts').sort();
fs.writeFileSync(path.join(OUT, 'index.ts'), `// Generated by tools/ldraw/bake.mjs — baked LDraw part geometry (see source part license, ldraw.org).\nimport type { Baked } from '../../core/ldraw';\n${files.map((f) => `import ${f.slice(0, -3)} from './${f.slice(0, -3)}';`).join('\n')}\nexport const LDRAW: Record<string, Baked> = { ${files.map((f) => `'${f.slice(1, -3)}': ${f.slice(0, -3)}`).join(', ')} };\n`);
console.log(`index: ${files.length} baked parts`);
