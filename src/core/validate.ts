// Buildability gate. A blueprint passes only if every part is reachable from the ground (y = 0)
// through real stud connections, nothing interpenetrates, and every part exists in the catalogue.
import { PARTS, footprint, hasStud, PLATE, type PartDef } from './catalog';
import type { Placement } from './builder';

export interface Issue { kind: 'floating' | 'overlap' | 'unknown' | 'below-ground'; index: number; other?: number; msg: string }
export interface Report { ok: boolean; parts: number; floating: number; overlaps: number; issues: Issue[] }

interface Item { i: number; p: Placement; def: PartDef; x0: number; x1: number; z0: number; z1: number; y0: number; y1: number; cells: [number, number][]; studs: [number, number][]; rect?: [number, number, number, number] }

export const HOSTS: Record<string, string> = { glass_1x2x2: 'window_1x2x2', glass_1x4x3: 'window_1x4x3', door_1x4x6: 'doorframe_1x4x6', pane_lattice_1x2x3: 'window_1x2x3', door_lattice: 'doorframe_1x4x6', shutter_1x2x3: 'window_1x2x3', cart_wheel_l: 'wheelplate_2x2', cart_wheel_r: 'wheelplate_2x2', merlion_jet: 'merlion_body', mbs_glass: 'mbs_core', stree_bowl: 'stree_cone' };
const BARS = new Set(['bar_3l', 'bar_4l']);
const isBar = (it: Item) => BARS.has(it.p.key) || !!it.def.bar;
const isHollow = (it: Item) => HOLLOW.has(it.p.key) || !!it.def.hollow;
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
    if (def?.studPoints) { studs.length = 0; for (const [x, z] of def.studPoints) { const [dx, dz] = rotOffset(x, z, p.rot); studs.push([cx + dx, cz + dz]); } }
    let rect: [number, number, number, number] | undefined;
    if (def?.ext) { const e = def.ext; const cs = [[e[0], e[2]], [e[1], e[2]], [e[0], e[3]], [e[1], e[3]]].map(([ox, oz]) => rotOffset(ox, oz, p.rot)); rect = [cx + Math.min(...cs.map((c) => c[0])), cx + Math.max(...cs.map((c) => c[0])), cz + Math.min(...cs.map((c) => c[1])), cz + Math.max(...cs.map((c) => c[1]))]; }
    return { i, p, def, x0: p.x, x1: p.x + fw, z0: p.z, z1: p.z + fd, y0: p.y, y1: p.y + (def ? def.h : 1), cells, studs, rect };
  });
}
const overlapRect = (a: Item, b: Item) => Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0) > EPS && Math.min(a.z1, b.z1) - Math.max(a.z0, b.z0) > EPS;
/** any two occupied cells intersect with positive area */
const cellsShare = (a: Item, b: Item) => { for (const [ax, az] of a.cells) for (const [bx, bz] of b.cells) if (Math.abs(ax - bx) < 1 - EPS && Math.abs(az - bz) < 1 - EPS) return true; return false; };
/** interpenetration test: true rectangles when a small part declares one (minifig parts, accessories, animals), cells otherwise */
const SKIN = 0.15;   // bounding rectangles are conservative hulls of rounded parts; allow 1.2 mm of apparent overlap
const VSKIN = 0.5;   // plates: the depth a stud sits inside the part above it
const rectOf = (it: Item): [number, number, number, number] => it.rect ?? [it.x0, it.x1, it.z0, it.z1];
/** Vertical extent for collision: the real baked geometry where we know it, the declared box otherwise. */
const spanOf = (it: Item): [number, number] => (it.def.extY ? [it.p.y + it.def.extY[0], it.p.y + it.def.extY[1]] : [it.y0, it.y1]);
const bodiesIntersect = (a: Item, b: Item) => { if (!a.rect && !b.rect) return cellsShare(a, b); const A = rectOf(a), B = rectOf(b); return Math.min(A[1], B[1]) - Math.max(A[0], B[0]) > SKIN && Math.min(A[3], B[3]) - Math.max(A[2], B[2]) > SKIN; };
const inFootprint = (it: Item, wx: number, wz: number) => { for (const [cx, cz] of it.cells) if (Math.abs(wx - cx) < 0.5 + EPS && Math.abs(wz - cz) < 0.5 + EPS) return true; return false; };
/** lower L directly under upper U: does a real connection exist? */
function connected(L: Item, U: Item): boolean {
  if (!cellsShare(L, U) && !L.def.studPoints) return false;
  if (HOSTS[U.p.key] || HOSTS[L.p.key]) return false; // hosted parts connect via co-location, not stacking
  if (isBar(U)) return isHollow(L);                           // bar plugged into a hollow stud below
  if (isBar(L)) return isHollow(U);                           // hollow-stud part pushed onto a bar
  if (!U.def.accepts) return false;
  for (const [sx, sz] of L.studs) if (inFootprint(U, sx, sz)) return true;
  return false;
}

export function validate(all: Placement[], base = 0): Report {
  const parts = all.filter((p) => !p.member);   // an exploded assembly is checked as its proxy box; its members are positioned by the LDraw model
  const items = toItems(parts); const issues: Issue[] = [];
  for (const it of items) { if (!it.def) issues.push({ kind: 'unknown', index: it.i, msg: `unknown part ${it.p.key}` }); if (it.y0 < -6) issues.push({ kind: 'below-ground', index: it.i, msg: `${it.p.key} at y=${it.y0}` }); }
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
  // minifig rig: hands ride on the torso/legs they touch; held accessories grip a hand (never the body)
  const near = (a: Item, b: Item, reach: number, slack = 0) => { if (!(b.y0 < a.y1 + slack + EPS && b.y1 > a.y0 - slack - EPS)) return false; for (const [ax, az] of a.cells) for (const [bx, bz] of b.cells) if (Math.abs(ax - bx) <= reach + EPS && Math.abs(az - bz) <= reach + EPS) return true; return false; };
  for (const it of valid) if (it.def.attach) for (const b of valid) if (b.def.body && near(it, b, 1.6, 4)) { adj[it.i].push(b.i); adj[b.i].push(it.i); } // a hand hangs ≤ 1.2 studs off the torso cells; a raised arm lifts it above the torso box
  const rectTouch = (a: Item, b: Item, m: number) => { const A = rectOf(a), B = rectOf(b); return Math.min(A[1], B[1]) - Math.max(A[0], B[0]) > -m && Math.min(A[3], B[3]) - Math.max(A[2], B[2]) > -m; };
  for (const it of valid) if (it.def.held) for (const h of valid) if (h.def.hand && (!it.def.gripMate || (h.p.key===it.def.gripMate && h.p.rot===it.p.rot && Math.abs((h.x0+h.x1-it.x0-it.x1)/2)<EPS && Math.abs((h.z0+h.z1-it.z0-it.z1)/2)<EPS && h.y0===it.y0)) && h.y0 < it.y1 + 1.5 && h.y1 > it.y0 - 1.5 && rectTouch(it, h, 0.4)) { adj[it.i].push(h.i); adj[h.i].push(it.i); } // the part sits in the hand's clip
  // overlap check (interpenetration), with allowed pairs
  const allowedPair = (a: Item, b: Item) => (HOSTS[a.p.key] === b.p.key) || (HOSTS[b.p.key] === a.p.key) || (!!HOSTS[a.p.key] && HOSTS[a.p.key] === HOSTS[b.p.key])   // two colour groups of one assembly share a host
    || (isBar(a) && isHollow(b)) || (isBar(b) && isHollow(a))
    || (!!a.def.body && !!b.def.body)                                              // one minifig's own legs / torso / head stack into each other
    || (!!a.def.attach && (!!b.def.body || !!b.def.attach)) || (!!b.def.attach && (!!a.def.body || !!a.def.attach))   // hands and hair ride on the body
    || (!!a.def.held && !!b.def.hand) || (!!b.def.held && !!a.def.hand);            // the grip
  const sorted = [...valid].sort((a, b) => spanOf(a)[0] - spanOf(b)[0]); let overlaps = 0;
  const maxTop = Math.max(...valid.map((it) => spanOf(it)[1] - spanOf(it)[0]), 1);
  for (let a = 0; a < sorted.length; a++) {
    const A = sorted[a]; const SA = spanOf(A);
    for (let b = a + 1; b < sorted.length; b++) {
      const B = sorted[b]; const SB = spanOf(B); if (SB[0] >= SA[0] + maxTop) break;
      if (SB[0] >= SA[1] - VSKIN || SB[1] <= SA[0] + VSKIN) continue;  // a stud always pokes ~0.45 plates into the part above; that is a connection, not a clash
      if (!bodiesIntersect(A, B) || allowedPair(A, B)) continue;
      // bars through hollow parts are handled above; everything else interpenetrating is an error
      overlaps++; issues.push({ kind: 'overlap', index: A.i, other: B.i, msg: `${A.p.key}@(${A.p.x},${A.p.y},${A.p.z}) overlaps ${B.p.key}@(${B.p.x},${B.p.y},${B.p.z})` });
    }
  }
  // bars: also connect to hollow parts they pass through; a clip reaches one cell beyond its plate
  const clipReach = (a: Item, b: Item) => { for (const [ax, az] of a.cells) for (const [bx, bz] of b.cells) if (Math.abs(ax - bx) <= 1.25 + EPS && Math.abs(az - bz) <= 1.25 + EPS) return true; return false; };
  for (const bar of valid.filter(isBar)) for (const h of valid) if (isHollow(h) && h.y0 <= bar.y1 + (bar.def.loop ?? 0) + EPS && h.y1 >= bar.y0 - EPS && (cellsShare(bar, h) || (h.def.clip && clipReach(bar, h)))) { adj[bar.i].push(h.i); adj[h.i].push(bar.i); } // touching counts: a lantern loop pokes above its box into the clip
  // reachability from the ground
  const seen = new Uint8Array(items.length); const stack: number[] = [];
  for (const it of valid) if (it.y0 === base || it.y0 === 0) { seen[it.i] = 1; stack.push(it.i); }   // the scene's ground level, and the table under a floating island
  while (stack.length) { const i = stack.pop()!; for (const j of adj[i]) if (!seen[j]) { seen[j] = 1; stack.push(j); } }
  let floating = 0;
  for (const it of valid) if (!seen[it.i]) { floating++; issues.push({ kind: 'floating', index: it.i, msg: `${it.p.key} ${it.p.color} @(${it.p.x},${it.p.y},${it.p.z}) rot${it.p.rot}${it.p.tag ? ' [' + it.p.tag + ']' : ''} not connected to ground` }); }
  return { ok: issues.length === 0, parts: all.filter((p) => !p.proxy).length, floating, overlaps, issues };
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
