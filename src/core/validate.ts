// Buildability gate. A blueprint passes only if every part is reachable from the ground (y = 0)
// through real stud connections, nothing interpenetrates, and every part exists in the catalogue.
import { PARTS, footprint, hasStud, PLATE, type PartDef } from './catalog';
import type { Placement } from './builder';

export interface Issue { kind: 'floating' | 'overlap' | 'unknown' | 'below-ground'; index: number; other?: number; msg: string }
export interface Report { ok: boolean; parts: number; floating: number; overlaps: number; issues: Issue[] }

interface Item { i: number; p: Placement; def: PartDef; x0: number; x1: number; z0: number; z1: number; y0: number; y1: number; cells: [number, number][]; studs: [number, number][] }

const HOSTS: Record<string, string> = { glass_1x2x2: 'window_1x2x2', glass_1x4x3: 'window_1x4x3', door_1x4x6: 'doorframe_1x4x6', fig_hands: 'fig_torso' };
const BARS = new Set(['bar_3l', 'bar_4l']);
const HOLLOW = new Set(['round_1x1', 'roundplate_1x1', 'roundbrick_2x2', 'cone_1x1', 'cone_2x2', 'telescope', 'flower_stem', 'plant_3leaves', 'flower_1x1', 'antenna_1x4', 'tap_1x1']);
const EPS = 1e-6;

/** Rotate a canonical cell offset (ox, oz) about the part centre by rot quarter turns. */
function rotOffset(ox: number, oz: number, rot: number): [number, number] { switch (rot & 3) { case 0: return [ox, oz]; case 1: return [oz, -ox]; case 2: return [-ox, -oz]; default: return [-oz, ox]; } }

export function toItems(parts: Placement[]): Item[] {
  return parts.map((p, i) => {
    const def = PARTS[p.key]; const [fw, fd] = def ? footprint(def, p.rot) : [1, 1];
    const cx = p.x + fw / 2, cz = p.z + fd / 2; const cells: [number, number][] = []; const studs: [number, number][] = [];
    if (def) for (let a = 0; a < def.w; a++) for (let b = 0; b < def.d; b++) {
      if (def.mask && !def.mask(a, b)) continue;
      const [ox, oz] = rotOffset(a + 0.5 - def.w / 2, b + 0.5 - def.d / 2, p.rot); const wx = cx + ox, wz = cz + oz;
      cells.push([wx, wz]); if (def.studs !== 'center' && hasStud(def, a, b)) studs.push([wx, wz]);
    }
    if (def && def.studs === 'center') studs.push([cx, cz]); // single centre stud (jumpers, cones, dishes, minifig neck)
    return { i, p, def, x0: p.x, x1: p.x + fw, z0: p.z, z1: p.z + fd, y0: p.y, y1: p.y + (def ? def.h : 1), cells, studs };
  });
}
const overlapRect = (a: Item, b: Item) => Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0) > EPS && Math.min(a.z1, b.z1) - Math.max(a.z0, b.z0) > EPS;
/** any two occupied cells intersect with positive area */
const cellsShare = (a: Item, b: Item) => { for (const [ax, az] of a.cells) for (const [bx, bz] of b.cells) if (Math.abs(ax - bx) < 1 - EPS && Math.abs(az - bz) < 1 - EPS) return true; return false; };
const inFootprint = (it: Item, wx: number, wz: number) => { for (const [cx, cz] of it.cells) if (Math.abs(wx - cx) < 0.5 + EPS && Math.abs(wz - cz) < 0.5 + EPS) return true; return false; };
/** lower L directly under upper U: does a real connection exist? */
function connected(L: Item, U: Item): boolean {
  if (!cellsShare(L, U)) return false;
  if (HOSTS[U.p.key] || HOSTS[L.p.key]) return false; // hosted parts connect via co-location, not stacking
  if (BARS.has(U.p.key)) return HOLLOW.has(L.p.key);          // bar plugged into a hollow stud below
  if (BARS.has(L.p.key)) return HOLLOW.has(U.p.key);          // hollow-stud part pushed onto a bar
  if (!U.def.accepts) return false;
  for (const [sx, sz] of L.studs) if (inFootprint(U, sx, sz)) return true;
  return false;
}

export function validate(parts: Placement[]): Report {
  const items = toItems(parts); const issues: Issue[] = [];
  for (const it of items) { if (!it.def) issues.push({ kind: 'unknown', index: it.i, msg: `unknown part ${it.p.key}` }); if (it.y0 < 0) issues.push({ kind: 'below-ground', index: it.i, msg: `${it.p.key} at y=${it.y0}` }); }
  const valid = items.filter((it) => it.def);
  // index by bottom / top plate level
  const byTop = new Map<number, Item[]>(), byBottom = new Map<number, Item[]>();
  for (const it of valid) { (byTop.get(it.y1) ?? byTop.set(it.y1, []).get(it.y1)!).push(it); (byBottom.get(it.y0) ?? byBottom.set(it.y0, []).get(it.y0)!).push(it); }
  const adj: number[][] = items.map(() => []);
  for (const U of valid) for (const L of byTop.get(U.y0) ?? []) if (connected(L, U)) { adj[U.i].push(L.i); adj[L.i].push(U.i); }
  // hosted parts (glass in frame, hands on torso) and bars passing through hollow parts
  const byPos = new Map<string, Item[]>(); for (const it of valid) { const k = `${it.p.x},${it.p.y},${it.p.z},${it.p.rot}`; (byPos.get(k) ?? byPos.set(k, []).get(k)!).push(it); }
  for (const it of valid) {
    const host = HOSTS[it.p.key]; if (!host) continue;
    const mates = (byPos.get(`${it.p.x},${it.p.y},${it.p.z},${it.p.rot}`) ?? []).filter((m) => m.p.key === host);
    for (const m of mates) { adj[it.i].push(m.i); adj[m.i].push(it.i); }
  }
  // overlap check (interpenetration), with allowed pairs
  const allowedPair = (a: Item, b: Item) => (HOSTS[a.p.key] === b.p.key) || (HOSTS[b.p.key] === a.p.key) || (BARS.has(a.p.key) && HOLLOW.has(b.p.key)) || (BARS.has(b.p.key) && HOLLOW.has(a.p.key)) || (a.def.cat === 'minifig' && b.def.cat === 'minifig');
  const sorted = [...valid].sort((a, b) => a.y0 - b.y0); let overlaps = 0;
  for (let a = 0; a < sorted.length; a++) {
    const A = sorted[a];
    for (let b = a + 1; b < sorted.length; b++) {
      const B = sorted[b]; if (B.y0 >= A.y1) break;
      if (!cellsShare(A, B) || allowedPair(A, B)) continue;
      // bars through hollow parts are handled above; everything else interpenetrating is an error
      overlaps++; issues.push({ kind: 'overlap', index: A.i, other: B.i, msg: `${A.p.key}@(${A.p.x},${A.p.y},${A.p.z}) overlaps ${B.p.key}@(${B.p.x},${B.p.y},${B.p.z})` });
    }
  }
  // bars: also connect to hollow parts they pass through
  for (const bar of valid.filter((it) => BARS.has(it.p.key))) for (const h of valid) if (HOLLOW.has(h.p.key) && h.y0 < bar.y1 && h.y1 > bar.y0 && cellsShare(bar, h)) { adj[bar.i].push(h.i); adj[h.i].push(bar.i); }
  // reachability from the ground
  const seen = new Uint8Array(items.length); const stack: number[] = [];
  for (const it of valid) if (it.y0 === 0) { seen[it.i] = 1; stack.push(it.i); }
  while (stack.length) { const i = stack.pop()!; for (const j of adj[i]) if (!seen[j]) { seen[j] = 1; stack.push(j); } }
  let floating = 0;
  for (const it of valid) if (!seen[it.i]) { floating++; issues.push({ kind: 'floating', index: it.i, msg: `${it.p.key} ${it.p.color} @(${it.p.x},${it.p.y},${it.p.z}) rot${it.p.rot}${it.p.tag ? ' [' + it.p.tag + ']' : ''} not connected to ground` }); }
  return { ok: issues.length === 0, parts: parts.length, floating, overlaps, issues };
}
export function summarize(r: Report, max = 25): string {
  const lines = [`${r.ok ? 'PASS' : 'FAIL'} · ${r.parts} parts · ${r.floating} floating · ${r.overlaps} overlaps`];
  const byTag = new Map<string, number>(); for (const is of r.issues) { const m = /\[(.*?)\]/.exec(is.msg); const t = m ? m[1] : (is.kind); byTag.set(t, (byTag.get(t) ?? 0) + 1); }
  if (r.issues.length) lines.push('  by tag: ' + [...byTag.entries()].sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}×${v}`).join(', '));
  for (const is of r.issues.slice(0, max)) lines.push('  - ' + is.msg);
  if (r.issues.length > max) lines.push(`  … ${r.issues.length - max} more`);
  return lines.join('\n');
}
export { PLATE };
