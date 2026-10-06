// Los Angeles element test scene: the HOLLYWOOD letters and the Mount Lee mast on a sample of the hill's south face (docs/countries/usa.md
// §1.12, docs/refs/la-hollywood-sign/SCHEME.md §1–2, build notes BUILD.md). ?scene=la-sign&noglobe ; ?only=letters | mast | hill
// v3 (2026-10-05, after the lead's review of v2): the letters copy Brickman's proven build — White plates studs-up, the face = their sides,
// 1 stud thick, on slim Light Bluish Gray legs. Heights are plates above the island ground G (here the test plate's top).
import { Blueprint } from '../core/builder';
import { patch, type SceneMeta } from './lib';

export const W = 50, D = 26, G = 1;                     // sample 50 × 26 (x west → east, z north → south); G = the test plate's top
const ZL = 8;                                      // the letters' row (1 stud deep); trail z 7 behind their feet, bench z 6–9, the face drops from z 10
const LEG = 3;                                     // plates of grey leg under each letter's bottom row (a 1 × 1 round brick)
// ---- letter bitmaps: 1 stud across × 1 plate up, 10 plates tall; [column, lowest plate row, highest] — rounded corners are the missing
// corner plates of O / D, the W has real V notches, the Y two arms on a two-wide stem. legs: the columns standing on legs.
type Glyph = { w: number; cols: [number, number, number][]; legs: number[] };
const GLYPH: Record<string, Glyph> = {
  H: { w: 3, cols: [[0, 0, 9], [1, 4, 5], [2, 0, 9]], legs: [0, 2] },
  O: { w: 3, cols: [[0, 1, 8], [1, 0, 1], [1, 8, 9], [2, 1, 8]], legs: [0, 2] },
  L: { w: 3, cols: [[0, 0, 9], [1, 0, 1], [2, 0, 1]], legs: [0, 2] },
  Y: { w: 4, cols: [[0, 5, 9], [1, 0, 6], [2, 0, 6], [3, 5, 9]], legs: [1, 2] },
  W: { w: 5, cols: [[0, 2, 9], [1, 0, 3], [2, 2, 6], [3, 0, 3], [4, 2, 9]], legs: [1, 3] },
  D: { w: 3, cols: [[0, 0, 9], [1, 0, 1], [1, 8, 9], [2, 1, 8]], legs: [0, 2] },
};
// the row: letter, x, bench (plates above G) — 1-stud gaps; the benches climb west → east and the 2nd O stays level with the W (the dip)
export const ROW: [string, number, number][] = [['H', 2, 26], ['O', 6, 26], ['L', 10, 27], ['L', 14, 27], ['Y', 18, 28], ['W', 23, 28], ['O', 29, 28], ['O', 33, 29], ['D', 37, 30]];
export const benchAt = (x: number) => { let b = 26; for (const [, lx, lb] of ROW) if (x >= lx - 1) b = lb; return b; };
export const MAST: [number, number] = [43, 1];            // mast footprint corner (4 × 2: dish rack x 43, tower x 45–46)
export const SUMMIT = 50;                          // r2: Mount Lee 4 plates higher so it stands clear as the highest of the three rounded summits
const OAK: [number, number] = [6, 20];
const PLATES = [8, 6, 4, 3, 2, 1];
/** chaparral masses: low-frequency blobs, denser low on the face, where the dark clumps gather (gullies); elsewhere sparse */
const scrubZone = (x: number, z: number) => z > 0 && vnoise(x, z, 6, 41) + (z > 12 ? 0.15 : 0) > -0.2;

/** smooth value noise in [−1, 1] from lib's patch(): bilinear between lattice points `s` studs apart */
export function vnoise(x: number, z: number, s: number, seed: number) {
  const fx = x / s, fz = z / s, x0 = Math.floor(fx), z0 = Math.floor(fz), tx = fx - x0, tz = fz - z0; const q = (a: number, b: number) => patch(a, b, 1, seed) * 2 - 1;
  const sx = tx * tx * (3 - 2 * tx), sz = tz * tz * (3 - 2 * tz);
  return (q(x0, z0) * (1 - sx) + q(x0 + 1, z0) * sx) * (1 - sz) + (q(x0, z0 + 1) * (1 - sx) + q(x0 + 1, z0 + 1) * sx) * sz;
}
/** the hill's top surface (plates above G) per cell: 3-plate treads down the face, 2-plate treads up the ridge, the bench flat per letter,
 *  the shoulder east of the D climbing to the summit plateau; a trail tread at 20 (z 16–17) with a ramp corridor at x 1–2 */
export function heights() {
  const h: number[][] = [];
  for (let x = 0; x < W; x++) {
    h.push([]);
    for (let z = 0; z < D; z++) {
      let v: number; const b = benchAt(x);
      const sh = (zz: number) => Math.min(SUMMIT, 2 * Math.round((30 + 2.2 * (x - 40) + 1.5 * (9 - zz)) / 2));
      const top = x > 40 ? sh(9) : b;
      if (x > 40 && z <= 9) v = sh(z);
      else if (z >= 6 && z <= 9) v = b;
      else if (z <= 5) { const cap = 40 + (x > 28 ? Math.min(3, (x - 28) * 0.3) : 0) + vnoise(x, z, 6, 3); v = Math.min(cap, b + 2 + (5 - z) * 1.9 + vnoise(x, z, 5, 7) * 1.5); v = b + 2 * Math.max(1, Math.round((v - b) / 2)); }
      else { const f = top - 3 - (z - 10) * 1.55 + vnoise(x, z, 5, 11) * 2.4; v = top - 3 * Math.max(1, Math.round((top - f) / 3)); }
      h[x].push(Math.max(3, v));
    }
  }
  for (let x = 0; x <= 18; x++) for (const z of [16, 17]) h[x][z] = 20;
  for (const x of [1, 2]) { for (let z = 10; z <= 12; z++) h[x][z] = 23; for (let z = 13; z <= 15; z++) h[x][z] = 20; }
  for (let it = 0; it < 6; it++) for (let x = 0; x < W; x++) for (let z = 0; z < D; z++) for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const nx = x + dx, nz = z + dz; if (nx < 0 || nz < 0 || nx >= W || nz >= D) continue; if (h[x][z] - h[nx][nz] > 6) h[nx][nz] = h[x][z] - 6;
  }
  return h;
}
/** one letter: per plate row, each run of filled cells becomes 1 × N plates (lengths alternate by row so runs bond across the joints) */
function letter(bp: Blueprint, ch: string, x0: number, yb: number, zl = ZL) {
  const g = GLYPH[ch]; const filled = (c: number, r: number) => g.cols.some(([cc, a, b]) => cc === c && r >= a && r <= b);
  for (let r = 0; r < 10; r++) {
    let c = 0;
    while (c < g.w) {
      if (!filled(c, r)) { c++; continue; }
      let n = 0; while (c + n < g.w && filled(c + n, r)) n++;
      let left = n; let k = c; let first = true;
      while (left > 0) { const pick = PLATES.filter((p) => p <= left); const len = first && r % 2 && pick.length > 1 && left > 2 ? pick[1] : pick[0]; bp.part(`plate_1x${len}`, x0 + k, yb + r, zl, 'White', 1); k += len; left -= len; first = false; }
      c += n;
    }
  }
  for (const c of g.legs) {                         // legs: a 1 × 1 round brick, plus round plates up to the column's lowest row
    const low = Math.min(...g.cols.filter(([cc]) => cc === c).map(([, a]) => a));
    bp.part('round_1x1', x0 + c, yb - LEG, zl, 'LightBluishGray'); for (let k = 0; k < low; k++) bp.part('roundplate_1x1', x0 + c, yb + k, zl, 'LightBluishGray');
  }
}

/** The hill with the letters, the mast, the oak and the trail. `H(x, z)` is a cell's hill top in plates above G (absolute grid cells), or
 *  null where there is no hill; columns are laid from y0 up (the test plate's top, or the island's surface course). The sign's own pieces
 *  (letters, mast, oak, trail) stand at the sample's cells shifted by (ox, oz); the region [x0, x1) × [z0, z1) bounds the terrain loops.
 *  `core(x, z, y)` colours a hidden column brick; `scrub` scales the chaparral density (1 = the sample). Returns the cells the sign claimed. */
export function placeSign(bp: Blueprint, o: { ox: number; oz: number; G: number; y0: number; x0: number; x1: number; z0: number; z1: number; H: (x: number, z: number) => number | null; core?: (x: number, z: number, y: number) => string; scrub?: number;
  tread?: (x: number, z: number) => string; zone?: (x: number, z: number) => boolean; sides?: boolean; brown?: boolean; slope?: (x: number, z: number) => string;
  /** (island r2, Eric: "稍微有点太过杂乱了") scrub only inside the zones, as whole clumps: one colour per clump (`clump`), no lone shrub where no neighbour is planted, more 4 × 3 leaf masses */
  calm?: boolean; clump?: (x: number, z: number) => string }) {
  const { ox, oz, G, y0, x0, x1, z0, z1, H } = o; const dens = o.scrub ?? 1;
  const hill = (x: number, z: number) => x >= x0 && x < x1 && z >= z0 && z < z1 && H(x, z) !== null;
  const h = (x: number, z: number) => H(x, z) ?? 0;
  const top = (x: number, z: number) => G + h(x, z);
  const used = new Set<string>(), backs = new Set<string>(); const k2 = (x: number, z: number) => x + ',' + z;
  // ---- terrain: every column solid from the plate up (Dark Bluish Gray core, hidden): a hollow two-brick shell fragmented under the packer
  // (BUILD.md). Top plate = tread colour (Dark Tan, Tan in patches), the course under it Dark Tan.
  bp.tag = 'hill';
  for (let x = x0; x < x1; x++) for (let z = z0; z < z1; z++) {
    if (!hill(x, z)) continue; const t = top(x, z);
    for (let y = y0; y < t - 1; y++) bp.vox1('brick', x, y, z, y >= t - 4 ? 'DarkTan' : o.core ? o.core(x, z, y) : 'DarkBluishGray');
    bp.vox1('plate', x, t - 1, z, o.tread ? o.tread(x, z) : patch(x, z, 2, 5) < 0.08 ? 'Tan' : 'DarkTan');
  }
  for (let x = 41 + ox; x < x1; x++) for (let z = oz; z <= 4 + oz; z++) if (hill(x, z) && h(x, z) === SUMMIT) bp.vox1('plate', x, top(x, z) - 1, z, 'MediumNougat');
  // the trail: Medium Nougat tiles flush with the treads, along the letters' feet (behind them) and along the tread at 20, with two ramps
  for (let x = ox; x < 41 + ox; x++) { bp.vox1('tile', x, top(x, 7 + oz) - 1, 7 + oz, 'MediumNougat'); used.add(k2(x, 7 + oz)); }
  for (let x = 1 + ox; x <= 18 + ox; x++) { bp.vox1('tile', x, top(x, 17 + oz) - 1, 17 + oz, 'MediumNougat'); used.add(k2(x, 17 + oz)); }
  bp.tag = 'trail';
  for (const [zr, y] of [[10, 23], [13, 20]] as [number, number][]) { const zz = zr + oz; bp.part('slope_2x3', 1 + ox, G + y, zz, 'MediumNougat'); for (let z = zz; z < zz + 3; z++) { used.add(k2(1 + ox, z)); used.add(k2(2 + ox, z)); } }
  // ---- letters, mast, oak first (they claim their cells)
  bp.tag = 'letters';
  for (const [ch, lx, b] of ROW) { letter(bp, ch, lx + ox, G + b + LEG, ZL + oz); for (let x = lx - 1 + ox; x <= lx + GLYPH[ch].w + ox; x++) for (let z = 6 + oz; z <= 9 + oz; z++) used.add(k2(x, z)); }
  bp.tag = 'mast'; bp.assembly('la_mast', MAST[0] + ox, G + SUMMIT, MAST[1] + oz, 'BrightRed');
  for (let x = MAST[0] - 2 + ox; x < MAST[0] + 5 + ox; x++) for (let z = MAST[1] - 1 + oz; z < MAST[1] + 4 + oz; z++) used.add(k2(x, z));
  bp.tag = 'oak'; { const [ox2, oz2] = [OAK[0] + ox, OAK[1] + oz]; for (let x = ox2 - 2; x <= ox2 + 2; x++) for (let z = oz2 - 2; z <= oz2 + 4; z++) used.add(k2(x, z));
    const y = top(ox2, oz2);   // a coast live oak at real scale (≈ 0.6 H): short Dark Brown trunk, a broad low crown of crossed leaves
    bp.part('round_1x1', ox2, y, oz2, 'DarkBrown'); bp.part('leaves_4x3', ox2, y + 3, oz2, 'DarkGreen', 0); bp.part('leaves_4x3', ox2, y + 4, oz2, 'OliveGreen', 1);
    bp.part('leaves_4x3', ox2, y + 5, oz2, 'DarkGreen', 3); bp.part('plant_3leaves', ox2, y + 6, oz2, 'DarkGreen'); }
  const nearOak = (x: number, z: number) => Math.abs(x - OAK[0] - ox) <= 4 && z - OAK[1] - oz >= -3 && z - OAK[1] - oz <= 5;   // (island) the oak's crown reaches past its claimed cells
  // ---- riser covers: every 3-plate step of the face gets a slope on the lower tread (33° 3-deep where the tread is 3 deep, else 45°
  // 2-deep), 6-plate drops a 65° slope, ridge steps a curved slope — so the face reads as one hill at hero distance. Dark Tan.
  bp.tag = 'hill';
  for (let z = z0 + 1; z < z1; z++) for (let x = x0; x < x1; x++) {
    if (used.has(k2(x, z)) || !hill(x, z) || !hill(x, z - 1) || (o.sides && nearOak(x, z))) continue;
    const d = h(x, z - 1) - h(x, z); if (d <= 0) continue;
    const free = (n: number) => { for (let k = 0; k < n; k++) { const zz = z + k; if (zz >= z1 || used.has(k2(x, zz)) || !hill(x, zz) || h(x, zz) !== h(x, z)) return false; } return true; };
    const col = o.slope ? o.slope(x, z) : 'DarkTan';   // Tan slopes rendered near white beside Dark Tan treads (v3 first render)
    if (z <= 6 + oz && d === 2 && free(2)) { bp.part('curve_1x2', x, top(x, z), z, 'DarkTan'); used.add(k2(x, z)); used.add(k2(x, z + 1)); continue; }
    if (z < 10 + oz) continue;
    if (d === 6 && free(1)) { if (x + 1 < x1 && hill(x + 1, z) && hill(x + 1, z - 1) && h(x + 1, z - 1) - h(x + 1, z) === 6 && !used.has(k2(x + 1, z)) && h(x + 1, z) === h(x, z)) { bp.part('slope_65_2x1x2', x, top(x, z), z, col); used.add(k2(x, z)); used.add(k2(x + 1, z)); } continue; }
    if (d !== 3) continue;
    if (free(3) && z + 2 < z1) { bp.part('slope_1x3', x, top(x, z), z, col); for (let k = 0; k < 3; k++) used.add(k2(x, z + k)); backs.add(k2(x, z)); }
    else if (free(2) && z + 1 < z1) { bp.part('slope_1x2', x, top(x, z), z, col); for (let k = 0; k < 2; k++) used.add(k2(x, z + k)); backs.add(k2(x, z)); }
  }
  // ---- (island) risers facing east, west and north get the same covers, turned: the hill reads as a hill from every side, not a ziggurat
  if (o.sides) for (const [dx, dz, rot] of [[1, 0, 1], [-1, 0, 3], [0, -1, 2]] as [number, number, number][]) {
    for (let z = z0; z < z1; z++) for (let x = x0; x < x1; x++) {
      const hx = x - dx, hz = z - dz;   // the higher neighbour behind the riser
      if (used.has(k2(x, z)) || !hill(x, z) || !hill(hx, hz) || nearOak(x, z)) continue;
      const d = h(hx, hz) - h(x, z);
      if (d === 6) {                                  // a 6-plate riser: a 65° slope two wide along it, when the next cell along has the same step
        const px = x + (dz ? 1 : 0), pz = z + (dx ? 1 : 0);
        if (hill(px, pz) && hill(px - dx, pz - dz) && !used.has(k2(px, pz)) && h(px, pz) === h(x, z) && h(px - dx, pz - dz) - h(px, pz) === 6) { bp.part('slope_65_2x1x2', x, top(x, z), z, o.slope ? o.slope(x, z) : 'DarkTan', rot); used.add(k2(x, z)); used.add(k2(px, pz)); }
        continue;
      }
      if (d !== 3 && d !== 2) continue;
      const cells = (n: number) => { const out: [number, number][] = []; for (let k = 0; k < n; k++) { const cx = x + dx * k, cz = z + dz * k; if (!hill(cx, cz) || used.has(k2(cx, cz)) || h(cx, cz) !== h(x, z)) return null; out.push([cx, cz]); } return out; };
      const n = d === 2 ? 2 : cells(3) ? 3 : 2; const cs = cells(n); if (!cs) continue;
      const mx = Math.min(...cs.map((c) => c[0])), mz = Math.min(...cs.map((c) => c[1]));
      bp.part(d === 2 ? 'curve_1x2' : n === 3 ? 'slope_1x3' : 'slope_1x2', mx, top(x, z), mz, o.slope ? o.slope(x, z) : 'DarkTan', rot);
      for (const [cx, cz] of cs) used.add(k2(cx, cz)); if (d === 3) backs.add(k2(x, z));
    }
  }
  // ---- chaparral: dark clumps gathered in the scrub zones (gullies), on tread lips and slope backs; sparse elsewhere. Dark Green 3-leaf
  // plates (single, or a Dark Green + Olive Green pair turned 180°), Olive Green singles, a 4 × 3 leaf lying downhill on some lips.
  bp.tag = 'scrub'; const planted = new Set<string>();
  for (let z = z0 + 1; z < z1 - 1; z++) for (let x = x0 + 1; x < x1 - 1; x++) {
    if (!hill(x, z)) continue;
    const back = backs.has(k2(x, z)); if (used.has(k2(x, z)) && !back) continue;
    const eff = (cx: number, cz: number) => h(cx, cz) + (backs.has(k2(cx, cz)) ? 3 : 0);
    const lip = back || h(x, z) > h(x, z + 1); const p = patch(x, z, 1, 29);
    const inZone = o.zone ? o.zone(x, z) : scrubZone(x - ox, z - oz);
    if (o.calm && !inZone) continue;
    if (!(inZone ? p < Math.min(0.97, (lip ? 0.95 : 0.7) * dens) : p < (lip ? 0.3 : 0.06) * dens)) continue;
    const y = top(x, z) + (back ? 3 : 0); const kind = patch(x, z, 1, 31);
    const cc = o.clump ? o.clump(x, z) : 'DarkGreen';   // calm: the clump's one colour
    const nbPlanted = planted.has(k2(x - 1, z)) || planted.has(k2(x, z - 1)) || planted.has(k2(x - 1, z - 1)) || planted.has(k2(x + 1, z - 1));
    const low = (cx: number, cz: number) => cx >= x0 && cz >= z0 && cx < x1 && cz < z1 && hill(cx, cz) && eff(cx, cz) <= eff(x, z) && (!used.has(k2(cx, cz)) || (backs.has(k2(cx, cz)) && eff(cx, cz) < eff(x, z))) && !planted.has(k2(cx, cz));
    // a 3-leaf plate's leaves reach ~0.9 stud into one quadrant (rot 0 +x+z, 1 −x+z, 2 −x−z, 3 +x−z): only toward ground no higher
    const rots = [0, 1, 3, 2].filter((r) => { const sx = r === 0 || r === 3 ? 1 : -1, sz = r <= 1 ? 1 : -1; return low(x + sx, z) && low(x, z + sz) && low(x + sx, z + sz); });
    if (!rots.length) {                             // no room for leaves: in the gully bands below the letters, a compact shrub of two round plates (Dark Green, sometimes an Olive top)
      if (o.calm) { if (nbPlanted && z >= 10 + oz) { bp.part('roundplate_1x1', x, y, z, 'DarkGreen'); bp.part('roundplate_1x1', x, y + 1, z, 'DarkGreen'); used.add(k2(x, z)); planted.add(k2(x, z)); } continue; }   // only inside a clump, in its colour
      if (z >= 10 + oz && vnoise(x, z, 4, 43) > 0.15 && kind < 0.75) { bp.part('roundplate_1x1', x, y, z, o.brown && kind < 0.3 ? 'DarkBrown' : 'DarkGreen'); bp.part('roundplate_1x1', x, y + 1, z, kind < 0.15 ? 'OliveGreen' : 'DarkGreen'); used.add(k2(x, z)); planted.add(k2(x, z)); }
      continue;
    }
    const r0 = rots[Math.floor(kind * 97) % rots.length];
    if (o.calm) {                                   // a clump: 4 × 3 leaf masses lying downhill where they fit, else a pair of 3-leaf plates, all one colour
      if (!back && lip && kind < 0.45 && z + 4 < z1 && [-1, 0, 1].every((dx) => [0, 1, 2, 3, 4].every((dz) => low(x + dx, z + dz)))) bp.part('leaves_4x3', x, y, z, cc, 0);
      else { bp.part('plant_3leaves', x, y, z, cc, r0); if (rots.includes((r0 + 2) & 3) && kind < 0.7) bp.part('plant_3leaves', x, y + 1, z, cc, (r0 + 2) & 3); }
      used.add(k2(x, z)); planted.add(k2(x, z)); continue;
    }
    if (kind < 0.4) { bp.part('plant_3leaves', x, y, z, 'DarkGreen', r0); if (rots.includes((r0 + 2) & 3)) bp.part('plant_3leaves', x, y + 1, z, 'OliveGreen', (r0 + 2) & 3); }
    else if (kind < 0.75) bp.part('plant_3leaves', x, y, z, 'DarkGreen', r0);
    else if (kind < 0.82) bp.part('plant_3leaves', x, y, z, 'OliveGreen', r0);
    else if (!back && lip && z + 4 < z1 && [-1, 0, 1].every((dx) => [0, 1, 2, 3, 4].every((dz) => low(x + dx, z + dz)))) bp.part('leaves_4x3', x, y, z, 'DarkGreen', 0);
    else continue;
    used.add(k2(x, z)); planted.add(k2(x, z));
  }
  bp.tag = ''; return used;
}

export function buildLaSign(bp: Blueprint): SceneMeta {
  bp.tag = 'ground'; for (let x = 0; x < W; x += 8) for (let z = 0; z < D; z += 8) bp.part('plate_8x8', x, 0, z, 'LightBluishGray');
  const h = heights();
  placeSign(bp, { ox: 0, oz: 0, G, y0: G, x0: 0, x1: W, z0: 0, z1: D, H: (x, z) => h[x][z] });
  bp.compact = true; bp.pack();
  return { id: 'la-sign', title: 'Hollywood Sign', caption: 'Hollywood Sign', subtitle: 'test scene', size: [W, D], center: [W / 2, 30, D / 2], camera: { az: 0.25, el: 0.2, dist: 90 } };
}
