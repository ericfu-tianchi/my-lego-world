// Exploded assemblies (CLAUDE.md rule 12), `npx tsx scripts/check-assemblies.ts`:
// 1. members (geometry × xform) reproduce the baked monolith exactly, bbox per rotation;
// 2. inside each assembly — where the scene validator only sees one proxy box — no two bricks interpenetrate and every brick is reached from
//    the ground through bricks it touches. Bodies are oriented boxes (`bodyBox`: bbox without top studs); a side stud or a clip sinks
//    0.2 stud into its neighbour, so a pair may overlap by up to OVERLAP_TOL along an axis. Hinge base + top interlock by design.
import * as THREE from 'three';
import { Blueprint } from '../src/core/builder';
import { PARTS, geometryFor, footprint, PLATE } from '../src/core/catalog';
import { ASM } from '../src/parts/ldraw/asm/index';
import { bodyBox } from '../src/core/ldraw';
import { HOSTS } from '../src/core/validate';
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
console.log(bad ? `FAIL · ${bad} mismatches` : `PASS · ${KEYS.length} assemblies × 4 rotations`);

// interlocks: hinge halves, a clip round a dish spoke; BARS: a bar through a hollow stud or tube, an axle through axle holes, a Technic
// half pin in a pin hole, a three-axle bush's axles in axle holes, a round plate's side handle; a window frame and its glass; a clip
// plate under a round brick (the clip rises beside the brick, z 0.8–1.5; the OBB covers the gap)
// (the Pearl's beams, 2026-10-03)
const OVERLAP_TOL = 0.22, TOUCH = 0.06; const INTERLOCK = new Set(['3937|3938', '3938|3937', '11090|4285b', '4285b|11090', '60592|60601', '60601|60592', '61252|3062b', '3062b|61252']); const BARS = new Set(['11090', '87994', '3957', '99784', '63965', '3704', '4519', '3705', '3706', '4274', '57585', '26047', '30374', '3673', '48729b']);
type OBB = { c: number[]; a: number[][]; h: number[]; id: string };
const obb = (p: { key: string; xform?: { p: number[]; m: number[] } }): OBB => { const id = PARTS[p.key].ldraw!; const b = bodyBox(id); const m = p.xform!.m; return { id, c: p.xform!.p, a: [0, 1, 2].map((j) => [m[j], m[3 + j], m[6 + j]]), h: [(b[3] - b[0]) / 2, (b[4] - b[1]) / 2, (b[5] - b[2]) / 2] }; };
const dot = (u: number[], v: number[]) => u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
const cross = (u: number[], v: number[]) => [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
/** largest separation along any SAT axis (negative = penetration depth along the least-penetrating axis) */
function gap(A: OBB, B: OBB) { const d = [0, 1, 2].map((i) => B.c[i] - A.c[i]); let best = -Infinity;
  const axes = [...A.a, ...B.a]; for (const u of A.a) for (const v of B.a) { const c = cross(u, v); if (Math.hypot(...c) > 1e-6) axes.push(c.map((x) => x / Math.hypot(...c))); }
  for (const L of axes) { const ra = A.h.reduce((s, h, i) => s + h * Math.abs(dot(A.a[i], L)), 0), rb = B.h.reduce((s, h, i) => s + h * Math.abs(dot(B.a[i], L)), 0); best = Math.max(best, Math.abs(dot(d, L)) - ra - rb); }
  return best; }
let inner = 0;
// retired v5/v9 builds kept only for the before/after scene ?scene=sg-v3; their inner clashes are why they were rebuilt
const RETIRED = new Set(['merlion_body', 'mbs_core']);
for (const key of KEYS.filter((k) => !HOSTS[k] && !RETIRED.has(k))) {   // a hosted assembly (glass in its tower) is audited together with its host
  const bp = new Blueprint(1); for (const k of [key, ...KEYS.filter((g) => HOSTS[g] === key)]) bp.assembly(k, 0, 0, 0, 'White', 0); bp.parts = bp.parts.filter((p) => !p.proxy); const mem = bp.parts.map(obb); const n = mem.length;
  const adj: number[][] = mem.map(() => []); const clashes: string[] = [];
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
    const g = gap(mem[i], mem[j]); if (g < TOUCH) { adj[i].push(j); adj[j].push(i); }
    if (g < -OVERLAP_TOL && !INTERLOCK.has(mem[i].id + '|' + mem[j].id) && !BARS.has(mem[i].id) && !BARS.has(mem[j].id)) clashes.push(`${mem[i].id}#${i} × ${mem[j].id}#${j} by ${(-g).toFixed(2)}`);
  }
  const low = (o: OBB) => o.c[1] - o.h.reduce((s, h, i) => s + h * Math.abs(o.a[i][1]), 0);
  const seen = new Uint8Array(n); const st: number[] = []; mem.forEach((o, i) => { if (low(o) < TOUCH) { seen[i] = 1; st.push(i); } });
  while (st.length) { const i = st.pop()!; for (const j of adj[i]) if (!seen[j]) { seen[j] = 1; st.push(j); } }
  const floating = mem.map((o, i) => (seen[i] ? '' : `${o.id}#${i}`)).filter(Boolean);
  const ok = !clashes.length && !floating.length; if (!ok) inner++;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${key}: ${n} bricks · ${clashes.length} clashes · ${floating.length} not reached from the ground${clashes.length ? '\n    ' + clashes.slice(0, 8).join('\n    ') : ''}${floating.length ? '\n    floating: ' + floating.slice(0, 12).join(' ') : ''}`);
}
console.log(inner ? `FAIL · ${inner} assemblies with inner faults` : 'PASS · inner bricks'); process.exit(bad || inner ? 1 : 0);
