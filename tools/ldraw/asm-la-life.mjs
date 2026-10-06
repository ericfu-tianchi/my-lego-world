// LA life layer (2026-10-04): the skateboard as the three real parts it is — the deck 42511 (proxy colour) and two black trolley wheels 2496
// in its clips — so the wheels stay black whatever the deck colour (the shortcut 42511c01 bakes into one mesh of one colour).
//   LDRAW_DIR=<main repo>/vendor/ldraw-lib/ldraw node tools/ldraw/asm-la-life.mjs && node tools/ldraw/bake.mjs skateboard.ldr palm_burst.ldr --force
// Frame: LDraw, origin on the deck's top face at its centre (as 42511c01), length along x, the two foot studs at x ±10.
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..'); const ASM = path.join(ROOT, 'vendor/ldraw/asm'); fs.mkdirSync(ASM, { recursive: true });
fs.writeFileSync(path.join(ASM, 'skateboard.ldr'), [
  '0 Skateboard: deck 42511 with two trolley wheels 2496 (as 42511c01)', '0 Name: skateboard.ldr',
  '1 16 0 0 0 1 0 0 0 1 0 0 0 1 42511.dat',
  '1 0 29.6 14.3 0 0 0 1 0 1 0 -1 0 0 2496.dat',
  '1 0 -29.6 14.3 0 0 0 1 0 1 0 -1 0 0 2496.dat',
].join('\n') + '\n');
console.log('skateboard.ldr written');

// Fan-palm head (2026-10-04, after Miniland's palms: a radial burst of short fronds): the six-stem flower stem 19119 — three stems at 30°
// from vertical, three at 70° — each stem capped with a three-leaf round plate 32607, the way 19119c02 caps them with 33291 (same 1 × 1
// round plate with a tube). Each cap is turned about its stem so its three leaves fan outward, away from the axis. The bar under the hub
// goes into a hollow stud. Frame: LDraw, origin at the hub's base (the bar hangs 10 LDU below it).
{
  const caps = [   // from 19119c02.dat: position and matrix of each stem's cap
    [-16.5, -27.383, 0, [0.866025, 0.5, 0, -0.5, 0.866025, 0, 0, 0, 1]],
    [25.372, -12.235, 0, [0.34202, -0.939693, 0, 0.939693, 0.34202, 0, 0, 0, 1]],
    [8.25, -27.383, 14.289, [-0.433013, -0.25, 0.866025, -0.5, 0.866025, 0, -0.75, -0.433013, -0.5]],
    [-12.686, -12.235, -21.973, [-0.17101, 0.469846, 0.866025, 0.939693, 0.34202, 0, -0.296198, 0.813798, -0.5]],
    [8.25, -27.383, -14.289, [-0.433013, -0.25, -0.866025, -0.5, 0.866025, 0, 0.75, 0.433013, -0.5]],
    [-12.686, -12.235, 21.973, [-0.17101, 0.469846, -0.866025, 0.939693, 0.34202, 0, 0.296198, -0.813798, -0.5]],
  ];
  const mul = (A, B) => [0, 1, 2].flatMap((i) => [0, 1, 2].map((j) => A[i * 3] * B[j] + A[i * 3 + 1] * B[3 + j] + A[i * 3 + 2] * B[6 + j]));
  const app = (A, v) => [0, 1, 2].map((i) => A[i * 3] * v[0] + A[i * 3 + 1] * v[1] + A[i * 3 + 2] * v[2]);
  const ry = (a) => [Math.cos(a), 0, Math.sin(a), 0, 1, 0, -Math.sin(a), 0, Math.cos(a)];
  const f = (n) => String(Math.round(n * 1e5) / 1e5);
  const lines = ['0 Fan-palm head: flower stem 19119 with six three-leaf plates 32607 (as 19119c02)', '0 Name: palm_burst.ldr', '1 16 0 0 0 1 0 0 0 1 0 0 0 1 19119.dat'];
  for (const [x, y, z, M] of caps) {
    // the leaves of 32607 fan toward +x / −z in its own frame: pick the turn about the stem that points them most nearly outward
    let best = null;
    for (let k = 0; k < 24; k++) { const R = mul(M, ry(k * Math.PI / 12)); const d = app(R, [1, 0, -1]); const out = (d[0] * x + d[2] * z) / Math.hypot(x, z) / Math.hypot(...d); if (!best || out > best[0]) best = [out, R]; }
    lines.push(`1 16 ${f(x)} ${f(y)} ${f(z)} ${best[1].map(f).join(' ')} 32607.dat`);
  }
  fs.writeFileSync(path.join(ASM, 'palm_burst.ldr'), lines.join('\n') + '\n'); console.log('palm_burst.ldr written');
}

// ---- Palms round 2 (2026-10-05, Eric: "上头很收着 很小 … 多给我几个版本 我比较"): four fuller crowns to compare, all on the same thin trunk.
// Every crown's frame: LDraw, origin on the trunk's top face at the axis (the trunk's last 1 × 1 round brick; its stud at y −4..0).
//   A `palm_crown_a` — the classic LEGO palm, bigger: palm leaves 2518 / 6148 in four tiers of two, each tier a 2 × 2 round plate 4032 turned
//     45° on the single centre stud of the round jumper 18674 below (the leaf seats' four studs carry that jumper): eight fronds, eight ways.
//   B `palm_crown_b` — the hybrid: C's swordleaf fans alternating with A's small palm leaves 6148 tier by tier (the long arching frond of
//     the classic palm with the fan's texture), C's six-fan 19119 on top. (Miniland's burst scaled up — a travis brick with five 19119 bursts, capped
//     with 6255 / 30176 / 10884 — was tried three times and always read as a round topiary ball: rejected.)
//   C `palm_crown_c` — fan fronds: swordleaf fans 10884 (each one a palmate fan) on the tiered hub of A, Dark Tan → Olive → Green upward,
//     and six more fans on a 19119 on top (each on a stem tip through its seat's anti-stud): a drooping dome of fans over the dead ones.
//   D `palm_crown_d` — Full Plate Builds' palm (fullplatebuilds.com, 2018): a travis brick with a life ring 30340 on each side stud, five
//     swordleaves 10884 clipped round each ring, the lowest Dark Tan and the next Olive (the dead fronds hanging over the trunk), a 19119
//     burst of six 32607 on two 1 × 1 round bricks above the rings.
{
  const f = (n) => String(Math.round(n * 1e5) / 1e5);
  const mul = (A, B) => [0, 1, 2].flatMap((i) => [0, 1, 2].map((j) => A[i * 3] * B[j] + A[i * 3 + 1] * B[3 + j] + A[i * 3 + 2] * B[6 + j]));
  const app = (A, v) => [0, 1, 2].map((i) => A[i * 3] * v[0] + A[i * 3 + 1] * v[1] + A[i * 3 + 2] * v[2]);
  const add = (a, b) => a.map((v, i) => v + b[i]); const sc = (a, s) => a.map((v) => v * s);
  const cross = (u, v) => [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
  const norm = (v) => sc(v, 1 / Math.hypot(...v));
  const ry = (deg) => { const a = deg * Math.PI / 180; return [Math.cos(a), 0, Math.sin(a), 0, 1, 0, -Math.sin(a), 0, Math.cos(a)]; };
  const cols = (x, y, z) => [x[0], y[0], z[0], x[1], y[1], z[1], x[2], y[2], z[2]];   // matrix whose columns are the images of the local axes
  const C = { Green: 2, BrightGreen: 10, DarkGreen: 288, OliveGreen: 330, DarkTan: 28, DarkBrown: 308, ReddishBrown: 70 };
  const model = (name, title) => { const L = [`0 ${title}`, `0 Name: ${name}.ldr`]; const put = (id, col, p, M) => L.push(`1 ${C[col] ?? col} ${p.map(f).join(' ')} ${M.map(f).join(' ')} ${id}.dat`); return { L, put, write: () => { fs.writeFileSync(path.join(ASM, `${name}.ldr`), L.join('\n') + '\n'); console.log(`${name}.ldr written (${L.length - 2} parts)`); } }; };
  // 19119's six stem caps, from 19119c02.dat (position and matrix of each 1 × 1 round cap, origin on the cap's top face)
  const CAPS = [
    [-16.5, -27.383, 0, [0.866025, 0.5, 0, -0.5, 0.866025, 0, 0, 0, 1]],
    [25.372, -12.235, 0, [0.34202, -0.939693, 0, 0.939693, 0.34202, 0, 0, 0, 1]],
    [8.25, -27.383, 14.289, [-0.433013, -0.25, 0.866025, -0.5, 0.866025, 0, -0.75, -0.433013, -0.5]],
    [-12.686, -12.235, -21.973, [-0.17101, 0.469846, 0.866025, 0.939693, 0.34202, 0, -0.296198, 0.813798, -0.5]],
    [8.25, -27.383, -14.289, [-0.433013, -0.25, -0.866025, -0.5, 0.866025, 0, 0.75, 0.433013, -0.5]],
    [-12.686, -12.235, 21.973, [-0.17101, 0.469846, -0.866025, 0.939693, 0.34202, 0, 0.296198, -0.813798, -0.5]],
  ];
  /** a 19119 whose bar is in a hollow stud: hub base at `o`, its local axes by matrix R; cap(i, low) → [id, colour, leafDir] per stem
   *  (low = one of the three 70° stems). Each cap is turned about its stem so its leaves point away from the stem's own axis. */
  const burst = (m, o, R, cap) => {
    m.put('19119', 'Green', o, R);
    CAPS.forEach(([x, y, z, M], i) => {
      const low = y > -20; const [id, col, dir] = cap(i, low);
      const seat = id === '30176' ? [0, 24, 0] : id === '10884' ? [0, 8, 10] : [0, 8, 0];   // the cap's anti-stud, in its own frame: it sits on the stem tip
      let best = null;
      for (let k = 0; k < 24; k++) { const Rk = mul(M, ry(k * 15)); const d = app(Rk, dir); const out = (d[0] * x + d[2] * z) / Math.hypot(x, z) / Math.hypot(...d); if (!best || out > best[0]) best = [out, Rk]; }
      const tip = add([x, y, z], app(M, [0, 8, 0]));   // where 19119c02's 1 × 1 cap has its anti-stud
      const p = add(tip, sc(app(best[1], seat), -1));
      m.put(id, col, add(o, app(R, p)), mul(R, best[1]));
    });
  };
  /** tiered hub (A, C): tier k = round plate 2 × 2 (turned θk) + two leaves on its halves + round jumper; returns the top stud's y */
  const tiers = (m, spec, hub = 'Green') => {   // hub: colour of the round plates and jumpers (A shows its core: Dark Tan, the trunk running on)
    let y = 0;
    for (const [deg, id, col] of spec) {
      const kind = id === '10884' ? 'fan' : 'palm';
      const R = ry(deg); m.put('4032b', hub, [0, y - 8, 0], R);
      // 2518 / 6148 seat along x (studs x ±10), blade toward +x: halves at z ∓10. 10884 seat along z (studs z ±10), fan toward −z: halves at x ∓10.
      const off = kind === 'palm' ? [0, 0, -10] : [-10, 0, 0];
      m.put(id, col, add([0, y - 16, 0], app(R, off)), R);
      m.put(id, col, add([0, y - 16, 0], app(R, sc(off, -1))), mul(R, ry(180)));
      m.put('18674', hub, [0, y - 24, 0], R); y -= 24;
    }
    return y;
  };

  { const m = model('palm_crown_a', 'Palm crown A: classic palm leaves 2518 / 6148, four tiers of two on 45°-turned round plates');
    const top = tiers(m, [[0, '2518', 'Green'], [45, '2518', 'Green'], [90, '6148', 'Green'], [135, '6148', 'BrightGreen']], 'DarkTan');
    m.put('32607', 'BrightGreen', [0, top - 8, 0], [1, 0, 0, 0, 1, 0, 0, 0, 1]); m.write(); }

  { const m = model('palm_crown_b', 'Palm crown B: swordleaf fans and small palm leaves alternating on the tiered hub, six fans on a six-stem flower stem on top');
    const y = tiers(m, [[0, '10884', 'DarkTan'], [45, '6148', 'Green'], [90, '10884', 'OliveGreen'], [135, '6148', 'Green']]);
    m.put('6141', 'Green', [0, y - 8, 0], [1, 0, 0, 0, 1, 0, 0, 0, 1]);
    burst(m, [0, y - 12, 0], ry(30), (i) => ['10884', i % 2 ? 'Green' : 'DarkGreen', [0, 0, -1]]);   // six fans on the stems: they spread from the top and droop (a fan stands square to its seat's stud), the dome
    m.write(); }

  { const m = model('palm_crown_c', 'Palm crown C: swordleaf fans 10884 on a tiered hub, six more on a six-stem flower stem on top');
    const top = tiers(m, [[0, '10884', 'DarkTan'], [45, '10884', 'OliveGreen'], [90, '10884', 'Green']]);
    m.put('6141', 'Green', [0, top - 8, 0], [1, 0, 0, 0, 1, 0, 0, 0, 1]);   // hollow stud for the burst's bar
    burst(m, [0, top - 8 - 4, 0], ry(15), (i) => ['10884', i % 2 ? 'Green' : 'DarkGreen', [0, 0, -1]]);   // six fans on the stems (20° / 60° above horizontal), drooping over the tiers: the dome
    m.write(); }

  { const m = model('palm_crown_d', 'Palm crown D: travis brick, four life rings, twenty swordleaves (after Full Plate Builds), a burst on top');
    m.put('3062b', 'DarkTan', [0, -24, 0], [1, 0, 0, 0, 1, 0, 0, 0, 1]);   // one more trunk brick, so the hanging fronds clear the walk
    m.put('4733', 'Green', [0, -48, 0], [1, 0, 0, 0, 1, 0, 0, 0, 1]);    // body y −48..−24, side studs at y −38
    const UP = [0, -1, 0];
    for (let s = 0; s < 4; s++) {
      const d = app(ry(90 * s), [1, 0, 0]); const h = cross(UP, d);   // tangential
      const beta = 20 * Math.PI / 180; const u = norm(add(sc(h, Math.cos(beta)), sc(UP, Math.sin(beta))));   // the ring sticks out sideways and up (a pinwheel)
      // ring local: −y → d (its anti-stud on the side stud), −z → u (towards the ring's centre), x = y × z
      const Ly = sc(d, -1), Lz = sc(u, -1), Lx = cross(Ly, Lz); const R = cols(Lx, Ly, Lz);
      const o = add([0, -38, 0], sc(d, 10 + 8));   // ring bottom (local y 8) on the brick face
      m.put('30340', 'Green', o, R);
      // five leaves clipped round the ring (centre (0, 4, −19), radius 20), the tab's arc (φ 90°) left free; each fan points away from the ring's
      // centre, tilted out of the ring's plane (away from the trunk) by α, its droop outward
      const leaves = [];
      for (const phi of [150, 210, 270, 330, 30]) {
        const a = phi * Math.PI / 180; const P = [20 * Math.cos(a), 4, -19 + 20 * Math.sin(a)]; const t = [-Math.sin(a), 0, Math.cos(a)], r = [Math.cos(a), 0, Math.sin(a)];
        const Pw = add(o, app(R, P)), tw = app(R, t), rw = app(R, r);
        const alpha = 40 * Math.PI / 180; const blade = norm(add(sc(rw, Math.cos(alpha)), sc(d, Math.sin(alpha))));
        const x = sc(tw, -1), z = sc(blade, -1); let y = cross(z, x);
        let M = cols(x, y, z); if (y[1] < 0 && blade[1] < 0.3) { M = cols(tw, cross(z, tw), z); }   // the fan's droop goes down / outward, never up
        const pos = add(Pw, sc(app(M, [0, 4, 30]), -1));
        leaves.push({ pos, M, low: blade[1] });
      }
      leaves.sort((p, q) => q.low - p.low);   // most downward first
      leaves.forEach((l, i) => m.put('10884', i === 0 ? 'DarkTan' : i === 1 ? 'OliveGreen' : 'Green', l.pos, l.M));
    }
    m.put('3062b', 'Green', [0, -72, 0], [1, 0, 0, 0, 1, 0, 0, 0, 1]); m.put('3062b', 'Green', [0, -96, 0], [1, 0, 0, 0, 1, 0, 0, 0, 1]);   // two 1 × 1 round bricks lift the top burst clear of the rings (the top one's stud is hollow)
    burst(m, [0, -100, 0], ry(15), (i) => ['32607', i % 2 ? 'Green' : 'BrightGreen', [1, 0, -1]]);
    m.write(); }
}

// ---- Palms round 3 (2026-10-05, Eric: "都一般般…网上随便一查，人家做的都特别好"): copies of the two brick palms he chose
// (docs/refs/la-palms-eric/eric-ref-1.png, eric-ref-2.png). Each is the whole palm, trunk included; frame: LDraw, origin on the ground's top
// face at the axis. Parts read from the photos:
//   fronds: swordleaf fans 10884 (five pointed blades, the C-clip tube at the root shows end-on in the photos), Dark Green / Green / Lime;
//   V1 (ref-2 #4): a slim trunk of inverted 1 × 1 cones with shaft 11610 (each shaft in the hollow stud below, wide end up: the flared
//     segments), Dark Brown, on a 2 × 2 round tile with hole 15535; a Tan prickly bush 6064 upside down on a bar 30374 above the trunk (the
//     dry straw skirt — Full Plate Builds' "bush upside down"); two travis bricks 4733, a life ring 30340 on each side stud and swordleaves
//     clipped round the rings, each fan turned about its clip to point the way the photo's do: lime hanging, green out, dark green up;
//   V2 (ref-2 #1, ref-1 #1): classic palm trunk segments 2536b in Dark Brown on a 2 × 2 round plate, a bar 87994 in the top core with a
//     1 × 1 round plate, then fourteen swordleaves stacked on the axis, each on the seat stud of the one below (studs showing, as in the
//     photo), turned 137.5° a fan: Dark Tan, Lime, Green, Dark Green upward;
//   V3 (ref-1 #3): V1's trunk in Reddish Brown, no skirt, one travis brick: a green crown with lime hanging under it.
{
  const f = (n) => String(Math.round(n * 1e5) / 1e5);
  const mul = (A, B) => [0, 1, 2].flatMap((i) => [0, 1, 2].map((j) => A[i * 3] * B[j] + A[i * 3 + 1] * B[3 + j] + A[i * 3 + 2] * B[6 + j]));
  const app = (A, v) => [0, 1, 2].map((i) => A[i * 3] * v[0] + A[i * 3 + 1] * v[1] + A[i * 3 + 2] * v[2]);
  const add = (a, b) => a.map((v, i) => v + b[i]); const sc = (a, s) => a.map((v) => v * s); const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const cross = (u, v) => [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
  const norm = (v) => sc(v, 1 / Math.hypot(...v));
  const ry = (deg) => { const a = deg * Math.PI / 180; return [Math.cos(a), 0, Math.sin(a), 0, 1, 0, -Math.sin(a), 0, Math.cos(a)]; };
  const cols = (x, y, z) => [x[0], y[0], z[0], x[1], y[1], z[1], x[2], y[2], z[2]];
  const I = [1, 0, 0, 0, 1, 0, 0, 0, 1], FLIP = [1, 0, 0, 0, -1, 0, 0, 0, -1];   // FLIP: upside down (half turn about x)
  const C = { Green: 2, Lime: 27, DarkGreen: 288, DarkTan: 28, Tan: 19, DarkBrown: 308, ReddishBrown: 70 };
  const model = (name, title) => { const L = [`0 ${title}`, `0 Name: ${name}.ldr`]; const put = (id, col, p, M) => L.push(`1 ${C[col] ?? col} ${p.map(f).join(' ')} ${M.map(f).join(' ')} ${id}.dat`); return { L, put, write: () => { fs.writeFileSync(path.join(ASM, `${name}.ldr`), L.join('\n') + '\n'); console.log(`${name}.ldr written (${L.length - 2} parts)`); } }; };
  const UP = [0, -1, 0];
  /** slim trunk: round plate 4032b + round tile with hole 15535 (the first shaft, 13 LDU, through the tile's hole into the plate's) + n cones 11610 stacked shaft-in-stud; returns the y of the top cone's stud top */
  const coneTrunk = (m, n, col) => { m.put('4032b', col, [0, -8, 0], I); m.put('15535', col, [0, -16, 0], I); let o = -16 - 19.5; for (let k = 0; k < n; k++) { m.put('11610', col, [0, o, 0], I); if (k < n - 1) o -= 23.5; } return o - 4; };
  /** a swordleaf 10884 clipped on a life ring's bar at ring point P (tangent t), turned about the bar so its blades point as near `want` as
   *  the clip allows (square to the bar), its droop downward */
  const clipFan = (m, col, P, t, want) => {
    const b = norm(add(want, sc(t, -dot(want, t)))); const z = sc(b, -1);
    let x = t; let y = cross(z, x); if (y[1] < 0) { x = sc(t, -1); y = cross(z, x); }
    const M = cols(x, y, z); m.put('10884', col, add(P, sc(app(M, [0, 4, 30]), -1)), M);
  };
  /** four life rings on a travis brick whose top face is at y = T; ring s on side stud s, turned to stick out sideways (pinwheel) and tilted
   *  β up; fans(P, outward) → [colour, want] or null per clip slot φ (the tab's arc, φ 90°, stays free) */
  const ringSet = (m, T, beta, slots, fans, spin = 0, ringCol = 'Green') => {   // spin: the travis brick's own turn on the stud below (a 1 × 1 brick turns on one stud)
    for (let s = 0; s < 4; s++) {
      const d = app(ry(90 * s + spin), [1, 0, 0]); const h = cross(UP, d); const be = beta * Math.PI / 180;
      const u = norm(add(sc(h, Math.cos(be)), sc(UP, Math.sin(be))));
      const Ly = sc(d, -1), Lz = sc(u, -1), Lx = cross(Ly, Lz); const R = cols(Lx, Ly, Lz);
      const o = add([0, T + 10, 0], sc(d, 10 + 8)); m.put('30340', ringCol, o, R);
      const pts = slots.map((phi) => { const a = phi * Math.PI / 180; return { P: add(o, app(R, [20 * Math.cos(a), 4, -19 + 20 * Math.sin(a)])), t: app(R, [-Math.sin(a), 0, Math.cos(a)]) }; });
      pts.sort((p, q) => q.P[1] - p.P[1]);   // lowest first
      pts.forEach((p, i) => { const out = norm([p.P[0], 0, p.P[2]]); const r = fans(i, out); if (r) clipFan(m, r[0], p.P, p.t, r[1]); });
    }
  };
  const mix = (a, wa, b, wb) => norm(add(sc(a, wa), sc(b, wb)));
  const DOWN = [0, 1, 0];

  { const m = model('palm2_v1', 'Palm V1 (after ref-2 #4): cone trunk, tan straw skirt, lime / green / dark green swordleaves on life rings');
    const ys = coneTrunk(m, 8, 'DarkBrown');
    m.put('30374', 'DarkBrown', [0, ys - 66, 0], I);   // bar 4L: 14 LDU down in the top cone's hollow stud, up through the bush into the travis brick
    m.put('6064b', 'Tan', [0, ys - 52, 0], FLIP);     // prickly bush upside down: its stud on the cone's stud, the spikes hanging 6.5 plates
    const T1 = ys - 52 - 24; m.put('4733', 'Green', [0, T1, 0], I);
    ringSet(m, T1, -35, [150, 270, 30], (i, out) => (i === 0 ? ['Lime', mix(DOWN, 1, out, 0.35)] : ['Green', mix(out, 1, UP, 0.15)]));
    m.put('3062b', 'Green', [0, T1 - 24, 0], I);   // a round brick between the two travis bricks: room for both ring sets
    const T2 = T1 - 48; m.put('4733', 'DarkGreen', [0, T2, 0], ry(45));   // turned 45° on the stud below, so its rings sit between the lower ones
    ringSet(m, T2, 35, [150, 270, 30], (i, out) => ['DarkGreen', mix(out, 1, UP, 1.1)], 45, 'DarkGreen');
    m.write(); }

  { const m = model('palm2_v2', 'Palm V2 (after ref-2 #1): classic trunk segments 2536b, a spiral of swordleaves stacked on one stud each');
    m.put('4032b', 'DarkBrown', [0, -8, 0], I); let y = -8; const N = 7;   // 7 (r3, was 5): the lowest fans clear the walk's lamps (26 plates), as real Washingtonias tower over the lamps
    for (let k = 0; k < N; k++) { m.put('2536b', 'DarkBrown', [0, y, 0], ry(k * 90)); y -= 32; }   // segment pin in the plate's hole / the core below
    m.put('87994', 'DarkBrown', [0, y, 0], I);   // bar 3L down in the top segment's core, its tip flush with the neck plate's underside
    m.put('6141', 'DarkBrown', [0, y - 8, 0], I); y -= 8;
    // a swordleaf has one anti-stud, under the seat stud at z +10: stacked on the axis, each fan sits on the stud of the fan below and turns
    // freely about it — a spiral rosette, 1 plate a fan, turned 137.5° (the golden angle) a fan so no two point the same way
    const cols2 = ['DarkTan', 'DarkTan', 'Lime', 'Lime', 'Lime', 'Green', 'Green', 'Green', 'Green', 'DarkGreen', 'DarkGreen', 'DarkGreen', 'DarkGreen', 'DarkGreen'];
    cols2.forEach((col, k) => { const R = ry(k * 137.5); m.put('10884', col, add([0, y - 8, 0], app(R, [0, 0, -10])), R); y -= 8; });
    m.write(); }

  { const m = model('palm2_v3', 'Palm V3 (after ref-1 #3): reddish-brown cone trunk, green crown over hanging lime');
    const ys = coneTrunk(m, 10, 'ReddishBrown');
    const T1 = ys - 24; m.put('4733', 'Green', [0, T1, 0], I);   // travis brick on the top cone's stud
    ringSet(m, T1, 15, [150, 210, 270, 330, 30], (i, out) => (i < 2 ? ['Lime', mix(DOWN, 1, out, 0.3)] : ['Green', mix(out, 1, UP, i === 4 ? 1.2 : 0.4)]));
    m.write(); }
}
