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
import { LDRAW } from '../src/parts/ldraw/index';
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
const OVERLAP_TOL = 0.22, TOUCH = 0.06; const INTERLOCK = new Set(['3937|3938', '3938|3937', '11090|4285b', '4285b|11090', '60592|60601', '60601|60592', '61252|3062b', '3062b|61252', '22890|14418', '14418|22890', '60592|38320', '38320|60592', '61252|60478', '60478|61252', '61252|26604', '26604|61252', '24201|3024', '3024|24201', '2540|60470a', '60470a|2540', '3004|6245', '6245|3004', '3023|6245', '6245|3023']); const BARS = new Set(['11090', '87994', '3957', '99784', '63965', '3704', '4519', '3705', '3706', '4274', '57585', '26047', '30374', '3673', '48729b', '60478', '87747', '1997', '18395', '2488', 'th_hose_a', 'th_hose_b', 'th_hose_c', 'th_hose_d', '4085c']);   // 87747: the Sanctuary's eave hooks, a 0.5L bar in a round plate's open stud; 6245 (INTERLOCK): the elephant head is a hollow shell over its neck column
// + Paris: ball joints (22890|14418), window frame and diamond pane (60592|38320), clip round a handle (61252|60478), clip round a lantern handle (61252|26604), a 1×1 plate on the inverted curved slope (24201|3024)
for (const p of ['42511|2496', '2496|42511', '19119|32607', '32607|19119']) INTERLOCK.add(p);   // LA: a skateboard's wheel axles in its deck's clips, a six-stem flower stem's caps
for (const id of ['44294', '60485', '3707', '3737', '32073', '2780']) BARS.add(id);
// roller-coaster track (LA, 2026-10-04): a curve's / ramp's OBB is its whole quarter square / the air under its high end, so the 2×2 joint plate
// on the track's end studs and the post under a ramp's high end sit inside it by design, and a car's bogies straddle the rails
// a raised arch's OBB spans the air over its stepped shoulders and under its own arch, where plates and cheese slopes sit on the shoulder studs (the LA pier arch)
for (const o of ['3024', '54200', '3005']) { INTERLOCK.add(`14707|${o}`); INTERLOCK.add(`${o}|14707`); }   // 3005: r3, the capital's core bricks on the end step
INTERLOCK.add('92950|2431'); INTERLOCK.add('2431|92950');
INTERLOCK.add('26021c01|3004'); INTERLOCK.add('3004|26021c01');   // a coaster car's seat backs stand in its sunken seat well   // … and the tile on the band's studs under the crest's own arch
for (const t of ['25061', '80562', '34738']) for (const o of ['3022', '3068b', '3020', '3941', '4032a', '26021c01']) { INTERLOCK.add(`${t}|${o}`); INTERLOCK.add(`${o}|${t}`); }   // LA Pacific Wheel (2026-10-04): Technic axles and pins through beam holes
for (const p of ['60594|86210', '86210|60594', '60593|60602', '60602|60593']) INTERLOCK.add(p);   // LA Venice: window glass in its frame
for (const id of ['2780', '2496', '2486', '4083', '30055', '3633']) BARS.add(id);   // LA Venice: a Technic pin through a pinhole, skateboard wheels, bar-frame rails and fences
BARS.add('63965a'); for (const p of ['15712|29592', '29592|15712']) INTERLOCK.add(p);   // LA Venice r2: the lamp pole's bar through its collars' hollow studs; a dumbbell's bar in a clip tile's clip
// LA Venice r2, the tail-stall skater (la_skater): a minifig built of its real parts interlocks by design (hips in the torso, arms on the
// torso's pins, hands in the wrists, the head on the neck, the helmet on the head); a locking hinge plate's finger rises over its own end
// only, and a skateboard deck's box spans its clips — both boxes overlap the plate on their studs where the parts do not
{ const FIG = ['970c00', '973', '3818', '3819', '3820', '3626c', '46303']; for (const p of FIG) for (const q of FIG) INTERLOCK.add(`${p}|${q}`);
  for (const p of ['44301b|78329', '78329|44301b', '78329|42511', '42511|78329', '44301b|44302b', '44302b|44301b']) INTERLOCK.add(p); }   // … and the locking hinge's two halves
for (const p of ['3960|93273', '93273|3960']) INTERLOCK.add(p);   // Griffith: a 4×1 double curved slope over a dish's crown (the crown rides inside the slope's hollow arch)
// LA pier r2 (2026-10-05): seated minifigs in the coaster cars — a minifig's parts ride on pins and hinges inside each other (arms in the
// torso's shoulders, hands in the arms, hips under the torso, legs on the hip pin, head on the neck, hair on the head), and the seated
// figure sits in the car's sunken well against its seat back
{ const FIG = ['973', '3815', '3816', '3817', '3818', '3819', '3820', '3626c', '12890', '3901']; for (const x of FIG) for (const y of [...FIG, '26021c01', '3004', '3069b']) { INTERLOCK.add(`${x}|${y}`); INTERLOCK.add(`${y}|${x}`); } }
for (const p of ['26021c01|3069b', '3069b|26021c01']) INTERLOCK.add(p);
{ const FIG = ['3815', '3816', '3817', '11253', '973', '3818', '3819', '3820', '3626c', '87995']; for (const x of FIG) for (const y of FIG) INTERLOCK.add(`${x}|${y}`); }   // LA r3: la_roller is a minifig of real parts — legs on the hip pins, skates on the feet, hair on the head   // … and the tile on the well's rear row
for (const [r, o] of [['87559', '3003'], ['87559', '3022'], ['3961', '3022']]) { INTERLOCK.add(`${r}|${o}`); INTERLOCK.add(`${o}|${r}`); }   // Griffith r2 dome: the 2×2 column through the quarter rings' hole, and under the 8×8 dish's hollow
// LA palms r2 (2026-10-05): a leaf's oriented box is mostly air — a swordleaf fan 10884 is 6 × 6 studs for a 1 × 2 seat, a palm leaf 2518 nine
// studs long and five plates deep for its seat — so fronds interleave with each other and their box covers the hub they hang round. As the
// validator's hull pass lets plants overlap plants, leaf pairs and leaf-over-hub pairs are not clashes here; the blades are checked in close-ups.
// a six-stem flower stem's bar in a hollow stud (1 × 1 round plate, travis brick); two life rings on neighbouring faces of one travis brick: the
// rings run past each other (a pinwheel, ≥ 1.5 LDU apart) but their boxes, which are solid over the ring's hole, meet at the corner
for (const p of ['6141|19119', '4733|19119', '3062b|19119', '30340|30340']) { const [a, b] = p.split('|'); INTERLOCK.add(`${a}|${b}`); INTERLOCK.add(`${b}|${a}`); }
for (const leaf of ['2518', '6148', '10884']) for (const o of ['2518', '6148', '10884', '4032b', '18674', '4733', '30340', '19119', '32607', '6141', '3062b']) { INTERLOCK.add(`${leaf}|${o}`); INTERLOCK.add(`${o}|${leaf}`); }
// LA palms r3 (2026-10-05): a shaft in the hollow stud below (inverted cones with shaft 11610 stacked, the first through a round tile with hole
// into a round plate; classic palm trunk segments 2536b pinned into the core / plate below), a prickly bush threaded upside down on the bar above
// the trunk, its spikes hanging round the top cones and the fans and rings beside it
for (const p of ['11610|11610', '11610|15535', '11610|4032b', '2536b|2536b', '2536b|4032b', '6064b|11610', '6064b|10884', '6064b|30340', '6064b|4733', '11610|10884', '2536b|10884']) { const [a, b] = p.split('|'); INTERLOCK.add(`${a}|${b}`); INTERLOCK.add(`${b}|${a}`); }
for (const p of ['4032a|4285b', '4285b|4032a']) INTERLOCK.add(p);   // Seoul · N Seoul Tower (2026-10-06): a webbed dish studs up on a 2×2 round spacer — its rim lip hangs a plate below its seat at r 2.75–3, far outside the Ø2 spacer, but its box covers the spacer
for (const p of ['11213|27507', '27507|11213']) INTERLOCK.add(p);   // … and its roof: a 6×6 round plate (r 3) inside four corner-round macaroni tiles (r 3–4) — flush, but each tile's square box covers the plate
for (const p of ['87081|27507', '27507|87081', '18674|27925', '27925|18674', '3941|27925', '27925|3941']) INTERLOCK.add(p);   // Seoul v2 tower: macaroni quarter rings round a 4 × 4 round brick and round a 2 × 2 round plate / brick — flush, each ring's square box covers the round part
// Seoul (ko-life, 2026-10-06): a prop in a seated figure's fist (ko_picnic) — the drumstick's bone and the bottle's neck in the hand's clip by
// design; their boxes (the meat, the bottle's body) cover the fist and the forearm they rise from. Checked by eye: build/r2-picnic-*.png.
for (const prop of ['33057', '95228']) for (const o of ['3820', '3818', '3819']) { INTERLOCK.add(`${prop}|${o}`); INTERLOCK.add(`${o}|${prop}`); }
for (const p of ['24201|11477', '4190|6141']) { const [a, b] = p.split('|'); INTERLOCK.add(`${a}|${b}`); INTERLOCK.add(`${b}|${a}`); }   // Seoul · Gwanghwamun: a curved slope on the low step of the 2×1 inverted curve, a round plate on the inverted corner's stud — both boxes span the air over that step / beside the upturn
type OBB = { c: number[]; a: number[][]; h: number[]; id: string };
const obb = (p: { key: string; xform?: { p: number[]; m: number[] } }): OBB => { const id = PARTS[p.key].ldraw!; const b = bodyBox(id); const m = p.xform!.m; return { id, c: p.xform!.p, a: [0, 1, 2].map((j) => [m[j], m[3 + j], m[6 + j]]), h: [(b[3] - b[0]) / 2, (b[4] - b[1]) / 2, (b[5] - b[2]) / 2] }; };
// An arch is mostly air: its bounding box would swallow whatever stands beside its legs or under its crown (the Eiffel Tower's legs lie in
// the arches' planes). Arches are tested as one box per stud-wide column of their real mesh (vertex y-range in that column).
const ARCHES = new Set(['6184', '14707', '6108', '18838', '16577', '3308a', '3307', '15254', '12939', '6060', '6183', '2339', '30099', '13965', '6182', '92950', '3659', '3455', '64449']);   // 64449: the triangular girder, whose columns follow its sloping chords
const columnsCache = new Map<string, number[][]>(); const STEP: Record<string, number> = { '64449': 0.25 };   // column width, studs
function columns(id: string): number[][] {   // local boxes [x0, y0, z0, x1, y1, z1] along the arch's long axis (x or z, whichever is longer)
  const hit = columnsCache.get(id); if (hit) return hit; const bk = LDRAW[id]; const P = new Int16Array(Uint8Array.from(Buffer.from(bk.pos, 'base64')).buffer); const b = bodyBox(id);
  const ax = b[3] - b[0] >= b[5] - b[2] ? 0 : 2; const step = STEP[id] ?? 1, lo = b[ax], n = Math.round((b[ax + 3] - b[ax]) / step); const out: number[][] = [];
  // points: the vertices, plus points every 0.1 stud along each triangle edge, so a long sloping chord shows up in every column it crosses
  const V = (i: number) => [P[i * 3] / bk.q, P[i * 3 + 1] / bk.q, P[i * 3 + 2] / bk.q]; const pts: number[][] = []; const nv = P.length / 3;
  const I = bk.idx ? (bk.i32 ? new Int32Array(Uint8Array.from(Buffer.from(bk.idx, 'base64')).buffer) : new Uint16Array(Uint8Array.from(Buffer.from(bk.idx, 'base64')).buffer)) : Array.from({ length: nv }, (_, i) => i);
  for (let t = 0; t + 2 < I.length; t += 3) for (const [u, w] of [[I[t], I[t + 1]], [I[t + 1], I[t + 2]], [I[t + 2], I[t]]]) { const A = V(u), B = V(w); const k = Math.max(1, Math.ceil(Math.hypot(B[0] - A[0], B[1] - A[1], B[2] - A[2]) / 0.1)); for (let j = 0; j <= k; j++) pts.push(A.map((a, i) => a + (B[i] - a) * j / k)); }
  for (let k = 0; k < n; k++) { let y0 = Infinity, y1 = -Infinity; const c0 = lo + k * step, c1 = c0 + step; for (const q of pts) { const v = q[ax]; if (v < c0 - 1e-3 || v > c1 + 1e-3) continue; const y = q[1]; if (y > b[4]) continue; y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    if (y0 < y1) { const box = [b[0], y0, b[2], b[3], y1, b[5]]; box[ax] = c0 + 0.02 * step; box[ax + 3] = c1 - 0.02 * step; out.push(box); } }
  columnsCache.set(id, out); return out;
}
// parts whose one box would cover air beside them: the 1 × 1 plate with a horizontal clip is its plate plus the clip ring a stud out, which
// stands 0.07 proud of the plate's faces (so it may hang under a plate only where the ring clears that plate's edge)
const SPLIT: Record<string, number[][]> = { '15070': [[-0.5, -0.4, -0.5, 0.5, 0, 0.5], [-0.5, -1.2, 0.5, 0.5, 0, 0.9]],   // Seoul: a 1×1 plate with its tooth hanging down outside one face
  '61252': [[-0.5, -0.4, -0.5, 0.5, 0, 0.5], [-0.5, -0.47, 0.5, 0.5, 0.27, 1.2]], '4733': [[-0.5, -1.2, -0.5, 0.5, 0, 0.5]] };   // 4733: its body; the side studs go into what is mounted on them
/** the boxes a member is tested with: one OBB, or one per column for an arch */
const shapes = (p: { key: string; xform?: { p: number[]; m: number[] } }): OBB[] => {
  const id = PARTS[p.key].ldraw!; if (!ARCHES.has(id) && !SPLIT[id]) return [obb(p)]; const b = bodyBox(id); const m = p.xform!.m; const a = [0, 1, 2].map((j) => [m[j], m[3 + j], m[6 + j]]); const bc = [(b[0] + b[3]) / 2, (b[1] + b[4]) / 2, (b[2] + b[5]) / 2];
  return (SPLIT[id] ?? columns(id)).map((q) => { const lc = [(q[0] + q[3]) / 2 - bc[0], (q[1] + q[4]) / 2 - bc[1], (q[2] + q[5]) / 2 - bc[2]]; const c = [0, 1, 2].map((i) => p.xform!.p[i] + m[i * 3] * lc[0] + m[i * 3 + 1] * lc[1] + m[i * 3 + 2] * lc[2]); return { id, c, a, h: [(q[3] - q[0]) / 2, (q[4] - q[1]) / 2, (q[5] - q[2]) / 2] }; });
};
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
  const bp = new Blueprint(1); for (const k of [key, ...KEYS.filter((g) => HOSTS[g] === key)]) bp.assembly(k, 0, 0, 0, 'White', 0); bp.parts = bp.parts.filter((p) => !p.proxy); const mem = bp.parts.map(obb); const sub = bp.parts.map(shapes); const n = mem.length;
  const adj: number[][] = mem.map(() => []); const clashes: string[] = [];
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
    let g = Infinity; for (const A of sub[i]) for (const B of sub[j]) g = Math.min(g, gap(A, B)); if (g < TOUCH) { adj[i].push(j); adj[j].push(i); }
    if (g < -OVERLAP_TOL && !INTERLOCK.has(mem[i].id + '|' + mem[j].id) && !BARS.has(mem[i].id) && !BARS.has(mem[j].id)) clashes.push(`${mem[i].id}#${i} × ${mem[j].id}#${j} by ${(-g).toFixed(2)}`);
  }
  const low = (o: OBB) => o.c[1] - o.h.reduce((s, h, i) => s + h * Math.abs(o.a[i][1]), 0);
  const seen = new Uint8Array(n); const st: number[] = []; mem.forEach((o, i) => { if (low(o) < TOUCH) { seen[i] = 1; st.push(i); } });
  while (st.length) { const i = st.pop()!; for (const j of adj[i]) if (!seen[j]) { seen[j] = 1; st.push(j); } }
  const floating = mem.map((o, i) => (seen[i] ? '' : `${o.id}#${i}`)).filter(Boolean);
  const ok = !clashes.length && !floating.length; if (!ok) inner++;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${key}: ${n} bricks · ${clashes.length} clashes · ${floating.length} not reached from the ground${clashes.length ? '\n    ' + clashes.slice(0, process.env.ALL ? 9999 : 8).join('\n    ') : ''}${floating.length ? '\n    floating: ' + floating.slice(0, 12).join(' ') : ''}`);
}
console.log(inner ? `FAIL · ${inner} assemblies with inner faults` : 'PASS · inner bricks'); process.exit(bad || inner ? 1 : 0);
