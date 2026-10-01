// Assembly DSL in OUR frame (x right, y UP, z toward the viewer; 1 unit = 1 stud, a plate = 0.4) for sculpted studs-out builds.
// asm-lib.mjs works in the LDraw frame and is kept for the older assemblies; this one lets a design be written in the scene's own terms
// (plates up, studs across) and converts once on write: LDraw p = 20·S·t, M = S·R·S with S = diag(1, −1, −1) — the inverse of the bake.
// Part geometry facts come from the baked bbox (src/parts/ldraw/p<id>.ts, already in our frame) and the LDraw connectors (studs.mjs).
//   const a = new Asm('merlion'); a.up('3005', 15, 0, 0, 0); a.side(rec) → studs; a.onStud('3070b', 15, stud, { along }); a.write();
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
import { connectors, ASM } from './asm-lib.mjs';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const PLATE = 0.4;
const bboxCache = new Map();
/** footprint body [x0, x1, z0, z1] for parts whose bbox includes a protrusion bigger than a side stud (snapping would misplace them) */
export const BODY = { '48336': [-1, 1, -0.5, 0.5], '2540': [-1, 1, -0.5, 0.5], '32607': [-0.5, 0.5, -0.5, 0.5] };
/** baked bbox of a part in our frame relative to its LDraw origin: [x0, y0, z0, x1, y1, z1] (bake it first) */
export function bbox(id) {
  if (bboxCache.has(id)) return bboxCache.get(id);
  const f = path.join(ROOT, 'src/parts/ldraw', `p${id}.ts`); if (!fs.existsSync(f)) throw new Error(`${id} not baked — node tools/ldraw/bake.mjs ${id}`);
  const b = JSON.parse(/"bbox":(\[[^\]]*\])/.exec(fs.readFileSync(f, 'utf8'))[1]); bboxCache.set(id, b); return b;
}
// ---- 3×3 rotations (row-major) ----
export const I = [1, 0, 0, 0, 1, 0, 0, 0, 1];
export const mul = (A, B) => [0, 1, 2].flatMap((i) => [0, 1, 2].map((j) => A[i * 3] * B[j] + A[i * 3 + 1] * B[3 + j] + A[i * 3 + 2] * B[6 + j]));
export const app = (A, v) => [0, 1, 2].map((i) => A[i * 3] * v[0] + A[i * 3 + 1] * v[1] + A[i * 3 + 2] * v[2]);
export const add = (a, b) => a.map((v, i) => v + b[i]); export const sub = (a, b) => a.map((v, i) => v - b[i]); export const scl = (a, k) => a.map((v) => v * k);
export const cross = (u, v) => [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
/** about +y by r quarter turns, the renderer's convention (r = 1 takes +z to +x) */
export const RY = (r) => { const c = [1, 0, -1, 0][r & 3], s = [0, 1, 0, -1][r & 3]; return [c, 0, s, 0, 1, 0, -s, 0, c]; };
/** the rotation whose columns are the images of local x, y, z */
export const basis = (ex, ey, ez) => [ex[0], ey[0], ez[0], ex[1], ey[1], ez[1], ex[2], ey[2], ez[2]];
const S = [1, -1, -1];
const fmt = (n) => { const r = Math.round(n * 1e4) / 1e4; return Object.is(r, -0) ? '0' : String(r); };

export class Asm {
  constructor(name, origin = [0, 0, 0]) { this.name = name; this.parts = []; this.origin = origin; }   // origin: the point that becomes the LDraw origin (a proxy's footprint bottom centre)
  /** raw placement: local point v goes to R·v + t (our frame) */
  put(id, color, R, t, tag) { const rec = { id, color, R, t, tag }; this.parts.push(rec); return rec; }
  /** studs-up part, footprint min corner (x, z) in studs, bottom at plate level y, r quarter turns; footprint from the bbox body */
  up(id, color, x, y, z, r = 0, tag) {
    const b = bbox(id).slice(); const R = RY(r); const snap = (v) => Math.round(v * 2) / 2;
    b[0] = snap(b[0]); b[3] = snap(b[3]); b[2] = snap(b[2]); b[5] = snap(b[5]);    // the body: side studs (0.2 proud) are not footprint
    if (BODY[id]) [b[0], b[3], b[2], b[5]] = BODY[id];
    const lc = [(b[0] + b[3]) / 2, b[1], (b[2] + b[5]) / 2];                        // local footprint centre at the bottom
    const w = Math.round(b[3] - b[0]), d = Math.round(b[5] - b[2]); const [fw, fd] = r % 2 ? [d, w] : [w, d];
    const t = sub([x + fw / 2, y * PLATE, z + fd / 2], app(R, lc)); return this.put(id, color, R, t, tag);
  }
  /** world studs of a placed part that do not point up: [{ p (stud base on the face), d (unit outward) }] */
  side(rec) {
    return connectors(rec.id).filter((c) => c.kind === 'stud').map((c) => ({ p: add(app(rec.R, [c.at[0] / 20, -c.at[1] / 20, -c.at[2] / 20]), rec.t), d: app(rec.R, [c.dir[0], -c.dir[1], -c.dir[2]]).map((v) => Math.round(v)) }))
      .filter((s) => s.d[1] < 0.5);
  }
  /** mount a part by its underside on a stud: local +y → s.d (outward); local `axis` ('x' | 'z') → `along` (unit, in the wall plane);
   *  `cell` = the local point of the part's underside that sits on the stud (default: bottom centre of the bbox) */
  onStud(id, color, s, along, axis = 'x', cell, tag) {
    const b = bbox(id); const ey = s.d; let ex, ez;
    if (axis === 'x') { ex = along; ez = cross(ex, ey); } else { ez = along; ex = cross(ey, ez); }
    const R = basis(ex, ey, ez); const c = cell ?? [(b[0] + b[3]) / 2, b[1], (b[2] + b[5]) / 2];
    return this.put(id, color, R, sub(s.p, app(R, c)), tag);
  }
  /** side studs that nothing is mounted on — an exposed side stud is almost always a mistake on a sculpture (a missing scale, a strand that
   *  landed beside its stud). A stud counts as covered when the point 0.1 out from it lies inside another part's bbox. */
  exposed() {
    const inside = (rec, w) => { const b = bbox(rec.id); const l = [0, 1, 2].map((i) => rec.R[i] * (w[0] - rec.t[0]) + rec.R[3 + i] * (w[1] - rec.t[1]) + rec.R[6 + i] * (w[2] - rec.t[2])); return l[0] > b[0] && l[0] < b[3] && l[1] > b[1] && l[1] < b[4] && l[2] > b[2] && l[2] < b[5]; };
    const out = []; for (const rec of this.parts) for (const s of this.side(rec)) { const w = add(s.p, scl(s.d, 0.1)); if (!this.parts.some((o) => o !== rec && inside(o, w))) out.push({ id: rec.id, p: s.p.map((v) => +v.toFixed(2)), d: s.d }); }
    return out;
  }
  /** write the .ldr in the LDraw frame */
  write() {
    fs.mkdirSync(ASM, { recursive: true }); const fn = `${this.name}.ldr`;
    const lines = this.parts.map(({ id, color, R, t }) => { const M = R.map((v, k) => S[Math.floor(k / 3)] * S[k % 3] * v); const p = t.map((v, i) => S[i] * (v - this.origin[i]) * 20); return `1 ${color} ${p.map(fmt).join(' ')} ${M.map(fmt).join(' ')} ${id}.dat`; });
    fs.writeFileSync(path.join(ASM, fn), [`0 ${this.name} — assembly of real parts (My Lego World, tools/ldraw/asm-ours.mjs)`, `0 Name: ${fn}`, ...lines, ''].join('\n'));
    const bom = new Map(); for (const p of this.parts) bom.set(p.id, (bom.get(p.id) ?? 0) + 1); return { file: fn, bom: [...bom.entries()] };
  }
}
