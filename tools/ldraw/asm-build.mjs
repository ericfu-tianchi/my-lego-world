// Shared grammar for brick-built (non-sculpted) buildings: hollow walls one stud thick, each layer packed into runs that alternate along x
// and z so it bonds across the one below, giant-order walls of tall 1×1 bricks. Used by asm-bund.mjs and asm-shikumen.mjs.
import { Asm } from './asm-ours.mjs';
const BRICK = { 1: '3005', 2: '3004', 3: '3622', 4: '3010', 6: '3009', 8: '3008' };
const PLT = { 1: '3024', 2: '3023', 3: '3623', 4: '3710', 6: '3666', 8: '3460' };
export const TILES = { 1: '3070b', 2: '3069b', 3: '63864', 4: '2431', 6: '6636', 8: '4162' };   // a smooth roof
export const EMBOSSED = { 1: '3005', 2: '98283', 4: '15533' };
const fit = (L, T) => { while (!T[L]) L--; return L; };
const appR = (A, v) => [0, 1, 2].map((i) => A[i * 3] * v[0] + A[i * 3 + 1] * v[1] + A[i * 3 + 2] * v[2]);
export const yaw = (deg) => { const t = (deg * Math.PI) / 180, c = Math.cos(t), s = Math.sin(t); return [c, 0, s, 0, 1, 0, -s, 0, c]; };

/** a building: cells keyed "i,j" → LDraw colour, packed course by course */
export function building(name, W, D) {
  const a = new Asm(name, [W / 2, 0, D / 2]); let n = 0;
  /** pack one layer of cells (Map "i,j" → colour) at plate y; kind 'brick' (3 plates) or 'plate'. Greedy in reading order: each run goes
   *  along x on even layers and along z on odd ones, but a cell that would make a 1-long run that way runs the other way instead — so a
   *  wall's face row packs into long bricks on every layer, and the corners overlap alternately (the bond). `T0` swaps the brick set
   *  (EMBOSSED: the grey-brick texture of a shikumen wall) */
  const layer = (cells, y, kind, T0) => {
    const T = T0 ?? (kind === 'brick' ? BRICK : PLT); const alongX = n++ % 2 === 0; const used = new Set();
    const run = (i, j, dx, dz) => { const col = cells.get(`${i},${j}`); let L = 1; while (L < 8 && cells.get(`${i + dx * L},${j + dz * L}`) === col && !used.has(`${i + dx * L},${j + dz * L}`)) L++; return fit(L, T); };
    const keys = [...cells.keys()].map((k) => k.split(',').map(Number)).sort((p, q) => (alongX ? p[1] - q[1] || p[0] - q[0] : p[0] - q[0] || p[1] - q[1]));
    for (const [i, j] of keys) { if (used.has(`${i},${j}`)) continue;
      let dx = alongX ? 1 : 0, dz = alongX ? 0 : 1; let L = run(i, j, dx, dz); if (L === 1) { const L2 = run(i, j, dz, dx); if (L2 > 1) { [dx, dz] = [dz, dx]; L = L2; } }
      for (let k = 0; k < L; k++) used.add(`${i + dx * k},${j + dz * k}`);
      a.up(T[L], cells.get(`${i},${j}`), i, y, j, dx ? 0 : 1); }
  };
  /** the cells of a rectangle's outline (ring `t` thick) */
  const ring = (i0, j0, w, d, colorAt, t = 1) => { const m = new Map(); for (let i = i0; i < i0 + w; i++) for (let j = j0; j < j0 + d; j++) { const inner = i >= i0 + t && i < i0 + w - t && j >= j0 + t && j < j0 + d - t; if (!inner) { const c = colorAt(i, j); if (c !== null) m.set(`${i},${j}`, c); } } return m; };
  const rect = (i0, j0, w, d, colorAt) => { const m = new Map(); for (let i = i0; i < i0 + w; i++) for (let j = j0; j < j0 + d; j++) { const c = colorAt(i, j); if (c !== null) m.set(`${i},${j}`, c); } return m; };
  /** a giant-order wall: every cell a column of tall 1×1 bricks (1×1×3 for 9 plates, 1×1×5 for 15), bonded by the plate courses
   *  above and below — the continuous piers and window strips of the real facades, in a fifth of the parts of 1×1 courses */
  const wall = (cells, y, h) => { const stack = { 9: ['14716'], 15: ['2453b'], 18: ['14716', '14716'], 30: ['2453b', '2453b'] }[h];
    for (const [k, col] of cells) { const [i, j] = k.split(',').map(Number); let yy = y; for (const id of stack) { a.up(id, col, i, yy, j); yy += id === '14716' ? 9 : 15; } } };
  /** `n` storeys of a block's outline from plate y, 4 plates each: a brick course with every window cell left open and the glass one stud
   *  behind it (the reveal), then a plate course over the lot (sill and lintel, and the bond); `skip` cells stay empty (columns stand
   *  there). Returns the plate y above. */
  const storeys = (i0, j0, w, d, isWin, y, n, wallC, glassC, sillC = wallC, skip = () => false) => {
    const inward = (i, j) => (j === j0 ? [i, j + 1] : j === j0 + d - 1 ? [i, j - 1] : i === i0 ? [i + 1, j] : [i - 1, j]);
    for (let s = 0; s < n; s++, y += 4) {
      const m = ring(i0, j0, w, d, (i, j) => (isWin(i, j) || skip(i, j) ? null : wallC)); const p = ring(i0, j0, w, d, (i, j) => (skip(i, j) ? null : sillC));
      for (const k of ring(i0, j0, w, d, () => 1).keys()) { const [i, j] = k.split(',').map(Number); if (!isWin(i, j)) continue; const [ii, jj] = inward(i, j); m.set(`${ii},${jj}`, glassC); p.set(`${ii},${jj}`, sillC); }
      layer(m, y, 'brick'); layer(p, y + 3, 'plate');
      for (const k of ring(i0, j0, w, d, () => 1).keys()) { const [i, j] = k.split(',').map(Number); if (isWin(i, j) && !skip(i, j)) a.up('3070b', sillC, i, y, j); }   // a smooth sill in each opening (bare studs read as rubble)
    }
    return y;
  };
  /** a 2-wide band round a rectangle in 2×N plates that each span both rows, so the outer row is clutched to the inner one — a ring packed
   *  row by row leaves the outer row of a proud cornice held by nothing (check-asm-studs, 2026-10-03). `cap`: tile the outer row (no bare
   *  studs on a cornice's lip) in that colour. */
  const band2 = (i0, j0, w, d, y, color, cap, skip = () => false) => {
    const P2 = { 2: '3022', 3: '3021', 4: '3020', 6: '3795', 8: '3034', 10: '3832', 12: '2445', 16: '4282' };
    const run = (len, put) => { let k = 0; while (k < len) { let L = Math.min(16, len - k); while (!P2[L] || (len - k - L === 1)) L--; put(k, L); k += L; } };
    for (const j of [j0, j0 + d - 2]) run(w, (k, L) => a.up(P2[L], color, i0 + k, y, j, 0));
    for (const i of [i0, i0 + w - 2]) run(d - 4, (k, L) => a.up(P2[L], color, i, y, j0 + 2 + k, 1));
    if (cap !== undefined) layer(ring(i0, j0, w, d, (i, j) => (skip(i, j) ? null : cap)), y + 1, 'plate', TILES);
  };
  return { a, layer, ring, rect, wall, storeys, band2 };
}
/** window pattern on a facade: is the cell (i, j) of a W × D ring a window? windows on `odd` positions along each face, never on corners */
export const facade = (W, D, winX, winZ) => (i, j) => { const corner = (i === 0 || i === W - 1) && (j === 0 || j === D - 1); if (corner) return false;
  if (j === 0 || j === D - 1) return winX(i); return winZ(j); };

