// Blueprint: the instruction sheet for one diorama. Explicit placements plus a voxel volume that the
// packer turns into real bricks / plates / tiles with a staggered bond. Grid: x,z in studs, y in plates,
// rot ∈ {0,1,2,3} quarter turns about Y. Half-stud positions are allowed where a jumper or a minifig neck makes them real.
import { PARTS } from './catalog';

export interface Placement { key: string; x: number; y: number; z: number; rot: number; color: string; tag?: string }
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
  constructor(seed = 1) { this.rng = mulberry32(seed); }
  static key(x: number, y: number, z: number) { return x + ',' + y + ',' + z; }
  rand() { return this.rng(); }
  pick<T>(arr: T[]): T { return arr[Math.floor(this.rng() * arr.length)]; }
  chance(p: number) { return this.rng() < p; }
  /** Explicit part placement. */
  part(key: string, x: number, y: number, z: number, color: string, rot = 0) {
    if (!PARTS[key]) throw new Error('Unknown part ' + key);
    this.parts.push({ key, x, y, z, rot: ((rot % 4) + 4) % 4, color, tag: this.tag }); return this;
  }
  /** Voxel fill; h in plates; packed later. */
  fill(kind: VoxKind, x0: number, y0: number, z0: number, w: number, h: number, d: number, color: string) {
    for (let x = x0; x < x0 + w; x++) for (let y = y0; y < y0 + h; y++) for (let z = z0; z < z0 + d; z++) this.vox.set(Blueprint.key(x, y, z), { color, kind, tag: this.tag });
    return this;
  }
  vox1(kind: VoxKind, x: number, y: number, z: number, color: string) { this.vox.set(Blueprint.key(x, y, z), { color, kind, tag: this.tag }); return this; }
  clear(x0: number, y0: number, z0: number, w: number, h: number, d: number) { for (let x = x0; x < x0 + w; x++) for (let y = y0; y < y0 + h; y++) for (let z = z0; z < z0 + d; z++) this.vox.delete(Blueprint.key(x, y, z)); return this; }
  hasVox(x: number, y: number, z: number) { return this.vox.has(Blueprint.key(x, y, z)); }
  /** Convert the voxel volume to parts: bricks where 3 matching plates stack, else plates / tiles. */
  pack() {
    const layers = new Map<number, [number, number][]>();
    for (const k of this.vox.keys()) { const [x, y, z] = k.split(',').map(Number); if (!layers.has(y)) layers.set(y, []); layers.get(y)!.push([x, z]); }
    const ys = [...layers.keys()].sort((a, b) => a - b); const used = new Set<string>();
    for (const y of ys) {
      const cells = layers.get(y)!; const flip = (y % 2) === 1;
      cells.sort((a, b) => (a[1] - b[1]) || (flip ? b[0] - a[0] : a[0] - b[0]));
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
    const r = this.rng(); const i = fits.length > 2 && r > 0.85 ? 2 : fits.length > 1 && r > 0.6 ? 1 : 0;
    return [fits[i][0], fits[i][1]];
  }
  private emit(kind: VoxKind, x: number, y: number, z: number, fw: number, fd: number, color: string, tag?: string) {
    const rot = fw <= fd ? 0 : 1; const key = fw <= fd ? `${kind}_${fw}x${fd}` : `${kind}_${fd}x${fw}`;
    this.parts.push({ key, x, y, z, rot, color, tag });
  }
  stats() { const types = new Set<string>(), colors = new Set<string>(); for (const p of this.parts) { types.add(p.key); colors.add(p.color); } return { parts: this.parts.length, types: types.size, colors: colors.size }; }
}
