// Blueprint: the instruction sheet for one diorama. Explicit placements plus a voxel volume that the
// packer turns into real bricks / plates / tiles with a staggered bond. Grid: x,z in studs, y in plates,
// rot ∈ {0,1,2,3} quarter turns about Y. Half-stud positions are allowed where a jumper or a minifig neck makes them real.
import { PARTS, footprint, PLATE } from './catalog';
import { PRINTS } from './prints';
import { ASM } from '../parts/ldraw/asm/index';
import { bodyBox } from './ldraw';

/** A part in the scene. An assembly appears twice over (CLAUDE.md rule 12): one `proxy` — the baked assembly as a single hosted box, which only
 *  the validator sees — and one `member` per real brick, which the renderer, the dismantle physics and the part counts see. A member carries its
 *  own `xform`: body-centre position (x, z in studs on the scene grid, y in world units) and row-major 3×3 rotation. */
export interface Placement { key: string; x: number; y: number; z: number; rot: number; color: string; tag?: string; print?: string; xform?: { p: [number, number, number]; m: number[] }; member?: string; proxy?: true }
export type VoxKind = 'brick' | 'plate' | 'tile';

function mulberry32(seed: number) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

const PACK_SIZES: Record<VoxKind, [number, number][]> = {
  brick: [[2, 8], [2, 6], [2, 4], [2, 3], [2, 2], [1, 8], [1, 6], [1, 4], [1, 3], [1, 2], [1, 1]],
  plate: [[2, 8], [2, 6], [2, 4], [2, 3], [2, 2], [1, 8], [1, 6], [1, 4], [1, 3], [1, 2], [1, 1]],
  tile: [[2, 4], [2, 2], [1, 8], [1, 6], [1, 4], [1, 3], [1, 2], [1, 1]],
};

export class Blueprint {
  parts: Placement[] = [];
  private vox = new Map<string, { color: string; kind: VoxKind; tag?: string }>();
  private rng: () => number;
  tag = '';
  compact = false; // deterministic maximum-area packing; legacy samples retain their original packing
  constructor(seed = 1) { this.rng = mulberry32(seed); }
  static key(x: number, y: number, z: number) { return x + ',' + y + ',' + z; }
  rand() { return this.rng(); }
  pick<T>(arr: T[]): T { return arr[Math.floor(this.rng() * arr.length)]; }
  chance(p: number) { return this.rng() < p; }
  /** Explicit part placement. */
  part(key: string, x: number, y: number, z: number, color: string, rot = 0, print?: string) {
    if (!PARTS[key]) throw new Error('Unknown part ' + key);
    if (print) { const pd = PRINTS[print]; if (!pd) throw new Error('Unknown print ' + print); if (!(pd.base.endsWith('*') ? key.startsWith(pd.base.slice(0, -1)) : pd.base === key)) throw new Error(`print ${print} belongs on ${pd.base}, not ${key}`); }
    this.parts.push({ key, x, y, z, rot: ((rot % 4) + 4) % 4, color, tag: this.tag, print }); return this;
  }
  /** An LDraw assembly exploded into its real bricks: the proxy (same grid semantics as `part`) plus every member, transformed by the proxy's
   *  position and rotation. The colour is the proxy's; members keep their own LDraw colours. */
  /** `prints`: decorate members by 'id|colour' → print key (the print's base must be the member's ld_ key), e.g. the Customs House dials */
  assembly(key: string, x: number, y: number, z: number, color: string, rot = 0, prints?: Record<string, string>) {
    const def = PARTS[key]; const list = def?.ldraw ? ASM[def.ldraw] : undefined; if (!list) throw new Error(`${key} is not an exploded assembly — bake its .ldr`);
    if (def.anchor !== 'origin') throw new Error(`${key}: assembly proxies use anchor 'origin'`);
    this.part(key, x, y, z, color, rot); const proxy = this.parts[this.parts.length - 1]; proxy.proxy = true; const r = proxy.rot;
    const [fw, fd] = footprint(def, r); const C = [x + fw / 2, (y + (def.lift ?? 0)) * PLATE, z + fd / 2];
    const cs = [1, 0, -1, 0][r], sn = [0, 1, 0, -1][r]; const R = [cs, 0, sn, 0, 1, 0, -sn, 0, cs];   // rotation about +y by r quarter turns, as the renderer applies it
    const mul = (A: number[], B: number[]) => [0, 1, 2].flatMap((i) => [0, 1, 2].map((j) => A[i * 3] * B[j] + A[i * 3 + 1] * B[3 + j] + A[i * 3 + 2] * B[6 + j]));
    const app = (A: number[], v: number[]) => [0, 1, 2].map((i) => A[i * 3] * v[0] + A[i * 3 + 1] * v[1] + A[i * 3 + 2] * v[2]);
    const group = `${key}@${this.parts.length - 1}`;
    for (const mb of list) {
      const k = `ld_${mb.id}`; if (!PARTS[k]) throw new Error(`member part ${k} not in the catalogue`); const b = bodyBox(mb.id);
      const local = app(mb.m, [(b[0] + b[3]) / 2, (b[1] + b[4]) / 2, (b[2] + b[5]) / 2]).map((v, i) => v + mb.p[i]);   // body centre in the assembly frame
      const w = app(R, local); const p: [number, number, number] = [C[0] + w[0], C[1] + w[1], C[2] + w[2]];
      const print = prints?.[`${mb.id}|${mb.color || color}`]; if (print && PRINTS[print]?.base !== k) throw new Error(`print ${print} belongs on ${PRINTS[print]?.base}, not ${k}`);
      this.parts.push({ key: k, x, y, z, rot: r, color: mb.color || color, tag: this.tag, member: group, xform: { p, m: mul(R, mb.m) }, print });
    }
    return this;
  }
  /** Voxel fill; h in plates; packed later. */
  fill(kind: VoxKind, x0: number, y0: number, z0: number, w: number, h: number, d: number, color: string) {
    for (let x = x0; x < x0 + w; x++) for (let y = y0; y < y0 + h; y++) for (let z = z0; z < z0 + d; z++) this.vox.set(Blueprint.key(x, y, z), { color, kind, tag: this.tag });
    return this;
  }
  vox1(kind: VoxKind, x: number, y: number, z: number, color: string) { this.vox.set(Blueprint.key(x, y, z), { color, kind, tag: this.tag }); return this; }
  clear(x0: number, y0: number, z0: number, w: number, h: number, d: number) { for (let x = x0; x < x0 + w; x++) for (let y = y0; y < y0 + h; y++) for (let z = z0; z < z0 + d; z++) this.vox.delete(Blueprint.key(x, y, z)); return this; }
  hasVox(x: number, y: number, z: number) { return this.vox.has(Blueprint.key(x, y, z)); }
  voxAt(x: number, y: number, z: number) { return this.vox.get(Blueprint.key(x, y, z)); }
  /** Convert the voxel volume to parts: bricks where 3 matching plates stack, else plates / tiles. */
  pack() {
    const layers = new Map<number, [number, number][]>();
    for (const k of this.vox.keys()) { const [x, y, z] = k.split(',').map(Number); if (!layers.has(y)) layers.set(y, []); layers.get(y)!.push([x, z]); }
    const ys = [...layers.keys()].sort((a, b) => a - b); const used = new Set<string>();
    for (const y of ys) {
      const cells = layers.get(y)!; const flip = (y % 2) === 1;
      cells.sort((a, b) => (a[1] - b[1]) || (!this.compact && flip ? b[0] - a[0] : a[0] - b[0]));
      const brickOk = (x: number, z: number): string | null => {
        const k0 = Blueprint.key(x, y, z); const v0 = this.vox.get(k0); if (!v0 || v0.kind !== 'brick' || used.has(k0)) return null;
        for (let dy = 1; dy < 3; dy++) { const k = Blueprint.key(x, y + dy, z); const v = this.vox.get(k); if (!v || v.kind !== 'brick' || v.color !== v0.color || used.has(k)) return null; }
        return v0.color;
      };
      for (const [x, z] of cells) {
        const color = brickOk(x, z); if (!color) continue;
        const [fw, fd] = this.bestRect(x, z, (cx, cz) => brickOk(cx, cz) === color, PACK_SIZES.brick, flip);
        for (let cx = x; cx < x + fw; cx++) for (let cz = z; cz < z + fd; cz++) for (let dy = 0; dy < 3; dy++) used.add(Blueprint.key(cx, y + dy, cz));
        this.emit('brick', x, y, z, fw, fd, color, this.vox.get(Blueprint.key(x, y, z))!.tag);
      }
      for (const [x, z] of cells) {
        const k0 = Blueprint.key(x, y, z); if (used.has(k0)) continue;
        const v0 = this.vox.get(k0)!; const kind: VoxKind = v0.kind === 'tile' ? 'tile' : 'plate';
        const ok = (cx: number, cz: number) => { const k = Blueprint.key(cx, y, cz); const v = this.vox.get(k); return !!v && !used.has(k) && v.color === v0.color && (v.kind === 'tile') === (kind === 'tile'); };
        const [fw, fd] = this.bestRect(x, z, ok, PACK_SIZES[kind], flip);
        for (let cx = x; cx < x + fw; cx++) for (let cz = z; cz < z + fd; cz++) used.add(Blueprint.key(cx, y, cz));
        this.emit(kind, x, y, z, fw, fd, v0.color, v0.tag);
      }
    }
    this.vox.clear(); return this;
  }
  private bestRect(x: number, z: number, ok: (cx: number, cz: number) => boolean, sizes: [number, number][], flip: boolean): [number, number] {
    const fits: [number, number, number][] = [];
    for (const [a, b] of sizes) for (const [fw, fd] of (a === b ? [[a, b]] : [[a, b], [b, a]]) as [number, number][]) {
      let good = true;
      for (let cx = x; cx < x + fw && good; cx++) for (let cz = z; cz < z + fd; cz++) if (!ok(cx, cz)) { good = false; break; }
      if (good) fits.push([fw, fd, fw * fd]);
    }
    fits.sort((p, q) => q[2] - p[2] || (flip ? q[0] - p[0] : p[0] - q[0]));
    const r = this.rng(); const i = this.compact ? 0 : fits.length > 2 && r > 0.85 ? 2 : fits.length > 1 && r > 0.6 ? 1 : 0;
    return [fits[i][0], fits[i][1]];
  }
  private emit(kind: VoxKind, x: number, y: number, z: number, fw: number, fd: number, color: string, tag?: string) {
    const rot = fw <= fd ? 0 : 1; const key = fw <= fd ? `${kind}_${fw}x${fd}` : `${kind}_${fd}x${fw}`;
    this.parts.push({ key, x, y, z, rot, color, tag });
  }
  stats() { const types = new Set<string>(), colors = new Set<string>(); const real = this.parts.filter((p) => !p.proxy); for (const p of real) { types.add(p.key); colors.add(p.color); } return { parts: real.length, types: types.size, colors: colors.size }; }
}
