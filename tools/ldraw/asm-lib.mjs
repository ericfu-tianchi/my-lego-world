// Tiny LDraw assembly DSL: place real parts studs-up on a stud/plate grid, or attach them to another placed part's side studs (SNOT),
// then write one .ldr per colour group into vendor/ldraw/asm/ for bake.mjs. Frame: LDraw (x right, y DOWN, z toward viewer; 20 LDU / stud,
// 8 LDU / plate; part origin = top-face centre for bricks and plates).
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const LIB = process.env.LDRAW_DIR; const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const ASM = path.join(ROOT, 'vendor/ldraw/asm');
function find(rel) { rel = rel.replace(/\\/g, '/'); for (const base of [LIB, path.join(ROOT, 'vendor/ldraw')]) if (base) for (const sub of ['', 'parts', 'p', 'parts/s', 'p/48', 'asm']) for (const t of [rel, rel.toLowerCase()]) { const f = path.join(base, sub, t); if (fs.existsSync(f)) return f; } return null; }
const mul = (A, B) => { const R = new Array(12).fill(0); for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) R[r * 3 + c] = A[r * 3] * B[c] + A[r * 3 + 1] * B[3 + c] + A[r * 3 + 2] * B[6 + c]; for (let r = 0; r < 3; r++) R[9 + r] = A[r * 3] * B[9] + A[r * 3 + 1] * B[10] + A[r * 3 + 2] * B[11] + A[9 + r]; return R; };
const apply = (M, p) => [M[0] * p[0] + M[1] * p[1] + M[2] * p[2] + M[9], M[3] * p[0] + M[4] * p[1] + M[5] * p[2] + M[10], M[6] * p[0] + M[7] * p[1] + M[8] * p[2] + M[11]];
const rotv = (M, v) => [M[0] * v[0] + M[1] * v[1] + M[2] * v[2], M[3] * v[0] + M[4] * v[1] + M[5] * v[2], M[6] * v[0] + M[7] * v[1] + M[8] * v[2]];
export const I3 = [1, 0, 0, 0, 1, 0, 0, 0, 1];
/** rotation about LDraw Y by k quarter turns (k=1: +x → -z ... chosen so that our scene rot 1 == this) */
export const RY = (k) => [[1, 0, 0, 0, 1, 0, 0, 0, 1], [0, 0, 1, 0, 1, 0, -1, 0, 0], [-1, 0, 0, 0, 1, 0, 0, 0, -1], [0, 0, -1, 0, 1, 0, 1, 0, 0]][k & 3];
/** matrix that maps the part's local -y (its stud direction, "up") onto world direction d, keeping x horizontal where possible */
export function facing(d) {
  const [dx, dy, dz] = d;
  if (dy < -0.5) return I3;                                   // up
  if (dy > 0.5) return [1, 0, 0, 0, -1, 0, 0, 0, -1];          // down
  if (dz < -0.5) return [1, 0, 0, 0, 0, -1, 0, 1, 0];          // -z  (local +y → +z)
  if (dz > 0.5) return [1, 0, 0, 0, 0, 1, 0, -1, 0];           // +z
  if (dx > 0.5) return [0, -1, 0, 1, 0, 0, 0, 0, 1];           // +x  (local +y → -x)
  return [0, 1, 0, -1, 0, 0, 0, 0, 1];                         // -x
}
/** studs / tubes of a part file in the part's own frame */
export function connectors(part) {
  const out = []; const walk = (rel, M, depth) => {
    rel = rel.replace(/\\/g, '/'); const base = path.basename(rel).toLowerCase();
    if (/^stud(2|2a|6|6a|p01|10|15|17a|18a)?\.dat$/.test(base)) { out.push({ kind: 'stud', at: apply(M, [0, 0, 0]), dir: rotv(M, [0, -1, 0]) }); return; }
    if (/^stud(3|4|4a|4h|4f|4o|4s|12)\.dat$/.test(base)) { out.push({ kind: 'tube', at: apply(M, [0, 0, 0]), dir: rotv(M, [0, 1, 0]) }); return; }
    if (depth > 6) return; const f = find(rel); if (!f) return;
    for (const line of fs.readFileSync(f, 'utf8').split('\n')) { const t = line.trim().split(/\s+/); if (t[0] !== '1' || t.length < 15) continue; const n = t.slice(2, 14).map(Number); walk(t.slice(14).join(' '), mul(M, [n[3], n[4], n[5], n[6], n[7], n[8], n[9], n[10], n[11], n[0], n[1], n[2]]), depth + 1); }
  }; walk(part.endsWith('.dat') ? part : part + '.dat', [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0], 0); return out;
}
/** heights (LDU, top face to bottom) of parts we attach sideways */
/** distance (LDU) from a part's origin to the face that goes against the host: bricks/plates/tiles have the origin at the top face (body 0..h),
 *  curved slopes and cheese have it at the bottom face (body -h..0) so their offset is 0 (measured with tools/ldraw/bbox.mjs) */
export const THICK = { '3024': 8, '3023': 8, '3710': 8, '3623': 8, '24866': 8, '6141': 8, '3070b': 8, '3069b': 8, '98138': 8, '54200': 0, '11477': 0, '15068': 0, '49307': 0, '3005': 24, '3004': 24, '3040b': 24, '3665': 24 };
/** quarter turn about the stud axis that puts a 1×2 curved slope's or cheese's high end UP when hung on a face pointing `dir` */
export const hangSpin = (dir) => (dir[2] < 0 ? 2 : dir[2] > 0 ? 0 : dir[0] > 0 ? 1 : 3);   // checked in a render 2026-09-19: the first guess hung them thick-end down
export class Model {
  constructor(name, shift = [0, 0, 0]) { this.name = name; this.lines = []; this.placed = []; this.shift = shift; }   // shift (LDU) applied on write so the LDraw origin is the footprint's bottom centre
  /** studs-up part: footprint min corner (sx, sz) in studs, bottom at plate level py, height hp plates, quarter turns k */
  up(part, color, sx, sz, py, hp, w, d, k = 0) {
    const [fw, fd] = k % 2 ? [d, w] : [w, d]; const M = RY(k); const pos = [20 * (sx + fw / 2), -8 * (py + hp), 20 * (sz + fd / 2)];
    return this.raw(part, color, pos, M);
  }
  raw(part, color, pos, M) { const rec = { part, color, pos, M }; this.placed.push(rec); this.lines.push({ color, text: (sh) => `1 ${color} ${pos.map((v, i) => f(v + sh[i])).join(' ')} ${M.map(f).join(' ')} ${part}.dat` }); return rec; }
  /** world-frame side studs of a placed part (studs that do not point up) */
  sideStuds(rec) { const M = [...rec.M, ...rec.pos]; return connectors(rec.part).filter((c) => c.kind === 'stud').map((c) => ({ at: apply(M, c.at), dir: rotv(M, c.dir).map((v) => Math.round(v)) })).filter((s) => s.dir[1] > -0.5); }   // world-frame filter: a plate hung on a wall has its stud pointing sideways
  /** attach `part` by its underside onto a stud {at, dir}; `spin` quarter turns about the stud axis */
  attach(part, color, stud, spin = 0) {
    const t = THICK[part]; if (t === undefined) throw new Error('THICK missing for ' + part);
    const pos = [stud.at[0] + stud.dir[0] * t, stud.at[1] + stud.dir[1] * t, stud.at[2] + stud.dir[2] * t];
    const M = mul3(facing(stud.dir), RY(spin)); return this.raw(part, color, pos, M);
  }
  /** write one .ldr per colour code, sharing the origin; returns the file names */
  write(groups) { fs.mkdirSync(ASM, { recursive: true }); const files = [];
    for (const [suffix, colors] of Object.entries(groups)) { const ls = this.lines.filter((l) => colors.includes(l.color)).map((l) => l.text(this.shift)); if (!ls.length) continue; const fn = `${this.name}_${suffix}.ldr`;
      fs.writeFileSync(path.join(ASM, fn), [`0 ${this.name} ${suffix} — assembly of real parts (My Lego World)`, `0 Name: ${fn}`, ...ls, ''].join('\n')); files.push(fn); }
    return files; }
  bom() { const m = new Map(); for (const p of this.placed) m.set(p.part, (m.get(p.part) ?? 0) + 1); return [...m.entries()]; }
}
const mul3 = (A, B) => { const R = new Array(9).fill(0); for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) R[r * 3 + c] = A[r * 3] * B[c] + A[r * 3 + 1] * B[3 + c] + A[r * 3 + 2] * B[6 + c]; return R; };
const f = (n) => (Math.abs(n) < 1e-9 ? '0' : Number.isInteger(n) ? String(n) : n.toFixed(3));
/** pick the quarter turn of a side-stud part so that its studs point in the wanted directions (array of [dx,dz]) */
export function turnFor(part, want) { const cs = connectors(part).filter((c) => c.kind === 'stud' && c.dir[1] > -0.5);
  for (let k = 0; k < 4; k++) { const M = RY(k); const dirs = cs.map((c) => rotv(M, c.dir).map(Math.round)); if (want.every(([dx, dz]) => dirs.some((d) => d[0] === dx && d[2] === dz)) && dirs.length === want.length) return k; }
  throw new Error(`no turn of ${part} gives ${JSON.stringify(want)}`); }
