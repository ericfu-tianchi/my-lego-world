// Minifig rig: real LDraw minifig parts posed exactly the way the LDraw standard says, written as small .ldr assemblies and baked.
//   node tools/ldraw/minifig-asm.mjs            (needs LDRAW_DIR like bake.mjs)
// Source of truth: parts/973c01.dat (torso + arms + hands, rest pose) and the !HELP block in parts/3818.dat:
//   "Place at -15.552 9 0 relative to torso · then rotate about x to give the elevation · then rotate 9.782 about z to align
//    with the slope of the torso · 0 = upper arm vertical · -45 = lower arm horizontal · -90 = upper arm horizontal · -135 = lower arm vertical"
// So M_arm = Rz(tilt) · Rx(theta), and the hand rides the same rotation about the shoulder point (its own rest matrix is Rx(45) further).
// Output: figtorso_<L><R>.ldr (torso + both arms, garment colour) and fighands_<L><R>.ldr (both hands, skin colour), both in torso
// coordinates so they can be placed at the same grid cell with anchor 'origin' and can never come apart. Plus src/parts/ldraw/minifig-rig.ts.
// Wrist (2026-10-04, Eric approved for LA): a real minifig hand turns in the arm on its wrist pin. In 3820 the pin is the 4-4cylc on the hand's
// local z axis through its origin, so a turn is Rz(90°) on the hand's own matrix: the grip point barely moves, the clip axis (hand-local y)
// swings to hand-local x — left-right in every arm pose. fighands_<L><R>_<wL><wR>.ldr, w = t (turned a quarter) or 0.
// Two more arm angles (the shoulder pin turns all the way round): b +45° (arm swung back until the forearm hangs plumb — the clip runs
// front-to-back, a board or a weight carried at the side) and k +90° (upper arm straight back, a skater's balance arm).
// Pre-turned holds: figheld_<name>.ldr — one real part turned so its grip axis lies along the clip (a board on edge, a weight lying
// across the hand, a board stood on its tail). One brick each, baked as one part; minifig2 places them like any held accessory.
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url'; import { spawnSync } from 'node:child_process';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..'); const ASM = path.join(ROOT, 'vendor/ldraw/asm'); fs.mkdirSync(ASM, { recursive: true });

const D = Math.PI / 180, TILT = 9.782 * D;
const POSE = { d: 0, f: -45, h: -90, u: -135, b: 45, k: 90 };   // arm elevation, degrees (negative swings forward)
const BASE = ['d', 'f', 'h', 'u'];
const PAIRS = BASE.flatMap((l) => BASE.map((r) => l + r));       // all 16 combinations of the first four poses
// Further torsos and wrist-turned hands are baked only where a scene uses them (each is ~25 / 12 KB in the app): add the pair or the
// '<pair>_<wL><wR>' key here and re-run. The catalogue registers whatever RIG.extra lists.
const EXTRA_TORSO = ['kf', 'fk'];
const EXTRA_HANDS = ['kf', 'fk', 'hf_tt', 'df_0t'];   // df_0t: the Venice lifter r3, one dumbbell across the right fist, the left arm relaxed   // hf_tt: the Venice lifter, both wrists turned so a dumbbell lies across each fist   // e.g. 'hf_tt': both wrists turned
const HELD = {   // name → [part, LDraw matrix]: the part turned so its grip axis lies along the clip
  surfboard_up: ['90397', [-1, 0, 0, 0, 0, 1, 0, 1, 0]],   // standing on its tail: nose up (+y), deck (studs) facing +z, rails left and right
  dumbbell_x: ['29592', [0, 1, 0, -1, 0, 0, 0, 0, 1]],      // lying left-right: the bar (its y) along x, a weight either side of a turned fist
};
const SIDE = {
  R: { file: '3818.dat', P: [-15.552, 9, 0], tilt: +TILT, hand: [-23.6904, 26.774, -9.8982] },   // minifig's right = LDraw -x
  L: { file: '3819.dat', P: [15.552, 9, 0], tilt: -TILT, hand: [23.6904, 26.774, -9.8982] },
};
const GRIP = [0, -0.8229, -9.8948];                            // centre of the hand's grip, from the !HELP block in 3820.dat

const mul = (A, B) => { const C = []; for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) C[r * 3 + c] = A[r * 3] * B[c] + A[r * 3 + 1] * B[3 + c] + A[r * 3 + 2] * B[6 + c]; return C; };
const ap = (M, v) => [M[0] * v[0] + M[1] * v[1] + M[2] * v[2], M[3] * v[0] + M[4] * v[1] + M[5] * v[2], M[6] * v[0] + M[7] * v[1] + M[8] * v[2]];
const rotX = (a) => [1, 0, 0, 0, Math.cos(a), -Math.sin(a), 0, Math.sin(a), Math.cos(a)];
const rotZ = (a) => [Math.cos(a), -Math.sin(a), 0, Math.sin(a), Math.cos(a), 0, 0, 0, 1];
const fmt = (n) => (Math.abs(n) < 1e-9 ? 0 : +n.toFixed(4));
const line = (colour, pos, M, file) => `1 ${colour} ${pos.map(fmt).join(' ')} ${M.map(fmt).join(' ')} ${file}`;
const ours = (v) => [+(v[0] / 20).toFixed(4), +(-v[1] / 20).toFixed(4), +(-v[2] / 20).toFixed(4)];   // LDraw → our units (y up, +z front)

/** Arm and hand placement for one side at one elevation (and wrist turn), in torso coordinates. */
function posed(side, pose, turned = false) {
  const S = SIDE[side], th = POSE[pose] * D, Rz = rotZ(S.tilt), Rx = rotX(th);
  const armM = mul(Rz, Rx);
  const dRest = ap(rotZ(-S.tilt), S.hand.map((v, i) => v - S.P[i]));   // hand offset from the shoulder, before the torso-slope tilt
  const handPos = ap(armM, ap(rotX(-th), ap(Rx, dRest))).map((v, i) => v + S.P[i]); // = P + Rz·Rx·dRest
  const handM = mul(mul(armM, rotX(45 * D)), rotZ(turned ? 90 * D : 0));   // the hand's own rest matrix is 45° further about x; the wrist turns about its z
  const grip = ap(handM, GRIP).map((v, i) => v + handPos[i]);
  return { arm: { pos: S.P, M: armM, file: S.file }, hand: { pos: handPos, M: handM, file: '3820.dat' }, grip, axis: ap(handM, [0, 1, 0]) };
}

const files = []; const rig = { grip: {}, axis: {}, extra: { torso: EXTRA_TORSO, hands: EXTRA_HANDS, held: Object.keys(HELD) }, note: 'grip = centre of the hand clip in torso coordinates (units: studs, y up, +z front); place a held part there. axis = the clip\'s bore direction (unit). Keys: side + pose, + t for a wrist turned a quarter' };
for (const pair of [...PAIRS, ...EXTRA_TORSO]) {
  const [l, r] = [pair[0], pair[1]]; const L = posed('L', l), R = posed('R', r);
  fs.writeFileSync(path.join(ASM, `figtorso_${pair}.ldr`), [`0 Minifig Torso with Arms (left ${l}, right ${r})`, `0 Name: figtorso_${pair}.ldr`,
    line(16, [0, 0, 0], [1, 0, 0, 0, 1, 0, 0, 0, 1], '973.dat'), line(16, L.arm.pos, L.arm.M, L.arm.file), line(16, R.arm.pos, R.arm.M, R.arm.file)].join('\n') + '\n');
  files.push(`figtorso_${pair}.ldr`);
}
for (const key of [...PAIRS, ...EXTRA_HANDS]) {
  const [l, r] = [key[0], key[1]]; const [wl, wr] = key.length > 2 ? [key[3] === 't', key[4] === 't'] : [false, false]; const L = posed('L', l, wl), R = posed('R', r, wr);
  fs.writeFileSync(path.join(ASM, `fighands_${key}.ldr`), [`0 Minifig Hands (left ${l}${wl ? ' wrist turned' : ''}, right ${r}${wr ? ' wrist turned' : ''})`, `0 Name: fighands_${key}.ldr`,
    line(16, L.hand.pos, L.hand.M, L.hand.file), line(16, R.hand.pos, R.hand.M, R.hand.file)].join('\n') + '\n');
  files.push(`fighands_${key}.ldr`);
}
for (const [name, [id, M]] of Object.entries(HELD)) { fs.writeFileSync(path.join(ASM, `figheld_${name}.ldr`), [`0 ${name} (${id} turned for the hand's clip)`, `0 Name: figheld_${name}.ldr`, line(16, [0, 0, 0], M, `${id}.dat`)].join('\n') + '\n'); files.push(`figheld_${name}.ldr`); }
const unit = (v) => { const n = Math.hypot(...v); return v.map((x) => +(x / n).toFixed(4)); };
for (const side of ['L', 'R']) for (const pose of Object.keys(POSE)) for (const t of [false, true]) {
  const k = side.toLowerCase() + pose + (t ? 't' : ''); const P = posed(side, pose, t); rig.grip[k] = ours(P.grip); rig.axis[k] = unit(ours(P.axis));
}
fs.writeFileSync(path.join(ROOT, 'src/parts/ldraw/minifig-rig.ts'), `// Generated by tools/ldraw/minifig-asm.mjs — minifig rig anchors in torso coordinates (studs; y up; +z = front).\nexport const RIG = ${JSON.stringify(rig, null, 2)} as const;\n`);
console.log('assemblies:', files.length); console.log('grips:', JSON.stringify(rig.grip));
// Bake. bake.mjs treats every .ldr as an exploded assembly: it writes a member list and queues the member moulds. A rig is never exploded
// (the torso's arms ride on the shoulder pins, not on studs), so the member lists and any moulds queued only for them are removed again.
const OUT = path.join(ROOT, 'src/parts/ldraw'); const before = new Set(fs.readdirSync(OUT));
const r = spawnSync('node', [path.join(ROOT, 'tools/ldraw/bake.mjs'), ...files, '--force'], { stdio: 'inherit', env: process.env }); if (r.status) process.exit(r.status);
for (const f of fs.readdirSync(OUT)) if (!before.has(f) && /^p\d/.test(f)) fs.rmSync(path.join(OUT, f));   // 973, 3818…, and the held moulds' plain bakes
for (const f of fs.readdirSync(path.join(OUT, 'asm'))) if (/^fig(torso|hands|held)_/.test(f)) fs.rmSync(path.join(OUT, 'asm', f));
{ const pf = fs.readdirSync(OUT).filter((f) => /^p[a-z0-9_]+\.ts$/.test(f) && f !== 'index.ts').sort();   // the same index bake.mjs writes
  fs.writeFileSync(path.join(OUT, 'index.ts'), `// Generated by tools/ldraw/bake.mjs — baked LDraw part geometry (see source part license, ldraw.org).\nimport type { Baked } from '../../core/ldraw';\n${pf.map((f) => `import ${f.slice(0, -3)} from './${f.slice(0, -3)}';`).join('\n')}\nexport const LDRAW: Record<string, Baked> = { ${pf.map((f) => `'${f.slice(1, -3)}': ${f.slice(0, -3)}`).join(', ')} };\n`);
  const af = fs.readdirSync(path.join(OUT, 'asm')).filter((f) => f.endsWith('.ts') && f !== 'index.ts').sort(); const v = (f) => 'a_' + f.slice(0, -3);
  fs.writeFileSync(path.join(OUT, 'asm/index.ts'), `// Generated by tools/ldraw/bake.mjs — member lists of our LDraw assemblies.\nimport type { Member } from '../../../core/ldraw';\n${af.map((f) => `import ${v(f)} from './${f.slice(0, -3)}';`).join('\n')}\nexport const ASM: Record<string, Member[]> = { ${af.map((f) => `'${f.slice(0, -3)}': ${v(f)}`).join(', ')} };\n`); }
