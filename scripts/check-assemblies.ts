// Exploded assemblies must reproduce their baked monolith exactly: members (geometry × xform) vs proxy, bbox per rotation. `npx tsx scripts/check-assemblies.ts`
import * as THREE from 'three';
import { Blueprint } from '../src/core/builder';
import { PARTS, geometryFor, footprint, PLATE } from '../src/core/catalog';
import { ASM } from '../src/parts/ldraw/asm/index';
const KEYS = Object.values(PARTS).filter((d) => d.anchor === 'origin' && d.ldraw && ASM[d.ldraw] && ASM[d.ldraw].every((m) => PARTS['ld_' + m.id])).map((d) => d.key); let bad = 0;
for (const rot of [0, 1, 2, 3]) for (const key of KEYS) {
  const bp = new Blueprint(1); bp.assembly(key, 10, 5, 7, 'White', rot);
  const [proxy, ...mem] = bp.parts; const def = PARTS[key]; const [fw, fd] = footprint(def, proxy.rot);
  const box = new THREE.Box3(); const m = new THREE.Matrix4(), q = new THREE.Quaternion();
  const g = geometryFor(key).clone(); q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), proxy.rot * Math.PI / 2); m.compose(new THREE.Vector3(proxy.x + fw / 2, (proxy.y + def.h / 2) * PLATE, proxy.z + fd / 2), q, new THREE.Vector3(1, 1, 1)); g.applyMatrix4(m); g.computeBoundingBox();
  const mb = new THREE.Box3(); let maxErr = 0;
  for (const p of mem) { const gg = geometryFor(p.key).clone(); const x = p.xform!; const r = new THREE.Matrix4().set(x.m[0], x.m[1], x.m[2], x.p[0], x.m[3], x.m[4], x.m[5], x.p[1], x.m[6], x.m[7], x.m[8], x.p[2], 0, 0, 0, 1); gg.applyMatrix4(r); gg.computeBoundingBox(); mb.union(gg.boundingBox!); }
  const a = g.boundingBox!, b = mb; maxErr = Math.max(...[a.min.x - b.min.x, a.min.y - b.min.y, a.min.z - b.min.z, a.max.x - b.max.x, a.max.y - b.max.y, a.max.z - b.max.z].map(Math.abs));
  if (maxErr > 0.01) bad++; if (rot === 0 || maxErr > 0.01) console.log(`${maxErr > 0.01 ? 'FAIL' : 'ok  '} ${key} rot ${rot}: ${mem.length} members · bbox err ${maxErr.toFixed(4)}`);
}
console.log(bad ? `FAIL · ${bad} mismatches` : `PASS · ${KEYS.length} assemblies × 4 rotations`); process.exit(bad ? 1 : 0);
