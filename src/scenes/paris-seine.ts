// Paris · the Seine: a Pont-Neuf-type stone bridge, a two-level quay and the bouquiniste boxes (round 2, 2026-10-03). Scheme: docs/countries/france.md §1.16.
// Levels from the water surface W (plates), shared by the bridge and the quay (LV): the piers W−1..W+5 (two Dark Bluish Gray waterline plates
// under stone), arch springing W+5, arch tops W+11 with one cornice plate on them, the walk's tiles W+12 (walking surface W+13 = the street quay),
// the parapet W+12..W+17 (a brick, a plate and a Tan tile coping, 4 plates above the walk). The low bank is at W+3. Round 2 (coordinator
// 2026-10-03): taller openings under a slim band, straight half-round towers instead of corbelled bastions, slimmer lanterns.
// Each element is built in its own local box and placed by (x, z) = the box's min corner on the island grid and rot (quarter turns, 1 takes
// +z to +x), so the island can turn it.
import { Blueprint } from '../core/builder';
import { PARTS, footprint } from '../core/catalog';
import '../core/catalog-cz-bridge';   // the pointed 4×4 wedge (cutwaters) and the LDraw 45° inverted slope (consoles, corbels)
import '../core/catalog-cz-square';   // the round 2×2 tile (the bastion's cap upstream)

type Kind = 'brick' | 'plate' | 'tile';
const STONE = ['Tan', 'Tan', 'Tan', 'Tan', 'Tan', 'Tan', 'Tan', 'LightBluishGray'];   // pale cream limestone (pont-neuf.jpg); a few grey stones
const SETTS = ['LightBluishGray', 'LightBluishGray', 'LightBluishGray', 'LightBluishGray', 'LightBluishGray', 'DarkBluishGray'];
const WATERLINE = 'DarkBluishGray';
export const LV = { spring: 5, crown: 11, walk: 13, parapetTop: 17, lowBank: 3 } as const;   // plates above the water surface

/** A local frame: cells (u, v) of an SX × SZ box at rot 0, mapped onto the island grid at (ox, oz) turned `rot`. */
function frame(bp: Blueprint, ox: number, oz: number, rot: number, SX: number, SZ: number) {
  const r = rot & 3;
  const pt = (u: number, v: number): [number, number] => r === 0 ? [u, v] : r === 1 ? [v, SX - u] : r === 2 ? [SX - u, SZ - v] : [SZ - v, u];
  const corner = (u: number, v: number, fw: number, fd: number): [number, number] => { const a = pt(u, v), b = pt(u + fw, v + fd); return [ox + Math.min(a[0], b[0]), oz + Math.min(a[1], b[1])]; };
  const put = (key: string, u: number, y: number, v: number, color: string, pr = 0, print?: string) => {
    const [fw, fd] = footprint(PARTS[key], pr); const [x, z] = corner(u, v, fw, fd); bp.part(key, x, y, z, color, (pr + r) & 3, print); return bp.parts[bp.parts.length - 1];
  };
  const asm = (key: string, u: number, y: number, v: number, color: string, pr = 0) => {
    const [fw, fd] = footprint(PARTS[key], pr); const [x, z] = corner(u, v, fw, fd); const n = bp.parts.length; bp.assembly(key, x, y, z, color, (pr + r) & 3); return bp.parts.slice(n + 1);   // the members
  };
  const vox = (kind: Kind, u: number, y: number, v: number, color: string) => { const [x, z] = corner(u, v, 1, 1); bp.vox1(kind, x, y, z, color); };
  const clear = (u: number, y0: number, v: number, h: number) => { const [x, z] = corner(u, v, 1, 1); bp.clear(x, y0, z, 1, h, 1); };
  return { put, asm, vox, clear };
}
/** runs of 2–5 cells in one colour, so the packer lays long stones instead of a confetti of 1×1s */
function mottler(bp: Blueprint) { let run = 0, col = ''; return (pal: string[]) => { if (run-- <= 0) { run = 1 + Math.floor(bp.rand() * 4); let c = bp.pick(pal); if (c === col) c = bp.pick(pal); col = c; } return col; }; }

// ---- the bridge ------------------------------------------------------------------------------------------------------------------------
/** Box 28 × 14: the river is u 6..21 (three 4-stud openings u 6–9, 12–15, 18–21 on two 2-wide piers u 10–11, 16–17), the banks u 0..5 and
 *  22..27; the vault (deck) rows v 4..9, the parapets v 3 / v 10, the towers v 2–3 / v 10–11, the cutwaters v 0–3 / v 10–13. Camera side +v. */
export const BRIDGE = { SX: 28, SZ: 14, river: 6, vault: 4 } as const;
const PIERS = [10, 16];
const ARCH_U = [5, 11, 17];             // Arch 1×6×2 thick top: legs on the bank (u 5), the piers, the bank (u 22); openings of 4
const TOWER = (u: number) => PIERS.some((p) => u === p || u === p + 1);
const BANK = (u: number) => u <= 5 || u >= 22;
const SEGMENTS = [6, 12, 18];           // the face between the towers over the river: four studs each

export function seineBridge(bp: Blueprint, x: number, y: number, z: number, rot = 0) {
  const W = y; const f = frame(bp, x, z, rot, BRIDGE.SX, BRIDGE.SZ); const m = mottler(bp); const { put, vox, clear } = f;
  const S = W + LV.spring, A = W + LV.crown, K = W + LV.walk - 1;   // springing, arch tops (the cornice plate course), the walk's tile course
  bp.tag = 'bridge';
  // the bridge's own stone replaces the banks and the water it stands in
  for (let u = 0; u < BRIDGE.SX; u++) for (let v = 3; v <= 10; v++) if (BANK(u)) clear(u, W - 1, v, 40);
  for (const p of PIERS) for (let v = 4; v <= 9; v++) for (const u of [p, p + 1]) clear(u, W - 1, v, 1);
  // banks: solid stone under the deck to the cornice course (the end arch legs' pier course at u 5 / 22 to the springing)
  for (let u = 0; u < BRIDGE.SX; u++) if (BANK(u)) for (let v = 3; v <= 10; v++) {
    const leg = (u === 5 || u === 22) && v >= 4 && v <= 9; const top = leg ? S : A;
    vox('plate', u, W - 1, v, WATERLINE); vox('plate', u, W, v, WATERLINE);
    let c = ''; for (let yy = W + 1; yy < top; yy++) { if ((yy - W - 1) % 3 === 0) c = m(STONE); vox('brick', u, yy, v, c); }   // a colour per course, not per column
  }
  // piers: two dark plates at the waterline, four plates of stone to the springing
  for (const p of PIERS) for (let v = 4; v <= 9; v++) for (const u of [p, p + 1]) { vox('plate', u, W - 1, v, WATERLINE); vox('plate', u, W, v, WATERLINE); const c = m(STONE); for (let yy = W + 1; yy < S; yy++) vox(yy < W + 2 ? 'plate' : 'brick', u, yy, v, c); }
  // the vaults: six arches side by side per opening (Arch 1×6×2, thick top), springing high on the piers so the openings are tall near-semicircles
  for (const au of ARCH_U) for (let v = 4; v <= 9; v++) put('arch_1x6x2_thick', au, S, v, v === 4 || v === 9 ? 'Tan' : m(STONE));
  // the cornice: one plate course straight on the arch tops — a 2-wide plate per face segment overhangs the face by a stud (the cornice line)
  for (const u0 of SEGMENTS) { put('plate_2x4', u0, A, 9, 'Tan', 1); put('plate_2x4', u0, A, 3, 'Tan', 1); }
  const segCell = (u: number, v: number) => (v === 3 || v === 4 || v === 9 || v === 10) && SEGMENTS.some((s0) => u >= s0 && u < s0 + 4);
  for (let u = 0; u < BRIDGE.SX; u++) for (let v = 3; v <= 10; v++) {
    if (segCell(u, v) || ((v === 3 || v === 10) && !BANK(u))) continue;
    vox('plate', u, A, v, BANK(u) && (v === 3 || v === 10) ? m(STONE) : 'Tan');
  }
  // the walk: tiled setts over the full length, 6 wide; a stone bench against each tower
  const bench = (u: number, v: number) => TOWER(u) && (v === 4 || v === 9);
  for (let u = 0; u < BRIDGE.SX; u++) for (let v = 4; v <= 9; v++) if (!bench(u, v)) vox('tile', u, K, v, m(SETTS));
  // parapets: a brick of stone, a plate and a Tan tile coping (4 plates above the walk), interrupted by the towers
  for (let u = 0; u < BRIDGE.SX; u++) if (!TOWER(u)) for (const v of [3, 10]) { const c = m(STONE); for (let yy = K; yy < K + 3; yy++) vox('brick', u, yy, v, c); vox('plate', u, K + 3, v, c); vox('tile', u, K + 4, v, 'Tan'); }
  for (const p of PIERS) { bastion(f, p, W, 'down'); bastion(f, p, W, 'up'); }
  bp.tag = '';
}

/** A pier's demi-lune (pont-neuf.jpg): a pointed cutwater (a 4×4 pointed wedge) at the waterline, then a straight half-round tower — 2×2
 *  round bricks against the face, no flare — to the parapet's top, capped with a round plate; a stone bench against it on the walk.
 *  Every tower carries a slim black lantern, upstream and downstream (Eric 2026-10-04: one side only looked like an omission). */
function bastion(f: ReturnType<typeof frame>, p: number, W: number, side: 'up' | 'down') {
  const { put, clear } = f; const dn = side === 'down';
  const K = W + LV.walk - 1, T = W + LV.parapetTop;
  const vw = dn ? 10 : 0, vb = dn ? 10 : 2, vbench = dn ? 9 : 4;
  for (let du = 0; du < 4; du++) for (let dv = 0; dv < 4; dv++) clear(p - 1 + du, W - 1, vw + dv, 1);   // the water under the cutwater
  put('wedge_4x4_pointed', p - 1, W - 1, vw, 'Tan', dn ? 0 : 2);   // one wedge: two stacked read as a pagoda (round 2)
  for (let yy = W + 2; yy < T; yy += 3) put('roundbrick_2x2', p, yy, vb, 'Tan');
  put('plate_1x2', p, K, vbench, 'Tan', 1); put('plate_1x2', p, K + 1, vbench, 'Tan', 1); put('tile_1x2', p, K + 2, vbench, 'Tan', 1);
  // the lantern: a round cap with one centre stud, an open-stud plate, a black 3L post, a small head (black collar, two clear plates, a black pyramid)
  put('roundplate_2x2_jumper', p, T, vb, 'Tan'); const cu = p + 0.5, cv = vb + 0.5;
  put('roundplate_open', cu, T + 1, cv, 'Black'); put('bar_3l', cu, T + 2, cv, 'Black');
  put('roundplate_1x1', cu, T + 7, cv, 'Black'); put('roundplate_1x1', cu, T + 8, cv, 'TransClear'); put('roundplate_1x1', cu, T + 9, cv, 'TransClear'); put('pyramid_1x1', cu, T + 10, cv, 'Black');
}

// ---- the quay --------------------------------------------------------------------------------------------------------------------------
/** The two-level quay along a bank, `len` studs long. Box 5 × len: u 0..2 the low cobbled bank (bas-port) at W+3, u 3 the wall's foot to W+9,
 *  u 4 the ashlar wall to the street (W+13) with the parapet on it (coping tile W+16, top W+17; a bouquiniste box clears the coping it stands on).
 *  The river is at −u. A stair of five equal 2-plate steps runs down the wall from a landing at v 0–1 (a gap in the parapet) to the low bank. */
export function quay(bp: Blueprint, x: number, y: number, z: number, len: number, rot = 0) {
  const W = y; const { put, vox, clear } = frame(bp, x, z, rot, 5, len); const m = mottler(bp);
  const K = W + LV.walk - 1, LB = W + LV.lowBank;
  bp.tag = 'quay';
  for (let u = 0; u < 5; u++) for (let v = 0; v < len; v++) clear(u, W - 1, v, 40);
  const STAIR = 10;                                           // v 0–1 landing at the street, steps v 2–9, five equal rises of 2 plates
  const tread = (v: number) => (v < 2 ? K + 1 : v < STAIR ? K + 1 - 2 * Math.floor(v / 2) : LB);
  for (let v = 0; v < len; v++) {
    // the low bank: a waterline kerb, setts behind it; on the stair rows the steps stand on it
    for (let yy = W - 1; yy < LB - 1; yy++) vox('plate', 0, yy, v, WATERLINE); vox('tile', 0, LB - 1, v, 'LightBluishGray');
    for (const u of [1, 2]) {
      const top = tread(v); const c = v < STAIR ? 'Tan' : 'LightBluishGray';
      for (let yy = W - 1; yy < top - 1; yy++) vox('brick', u, yy, v, c);
      vox('tile', u, top - 1, v, v < STAIR ? 'Tan' : m(SETTS));
    }
  }
  // the ashlar wall in masonry-profile bricks, running bond: u 3 three courses (four at the landing), u 4 four courses
  const wall = (u: number, v0: number, v1: number, courses: number) => {
    for (let k = 0; k < courses; k++) {
      const yy = W - 1 + 3 * k; let v = v0;
      if (k % 2 === 1) { put('brick_1x1', u, yy, v, 'Tan'); v++; }
      for (; v + 1 <= v1; v += 2) put('brick_masonry_1x2', u, yy, v, m(STONE), 3);
      if (v === v1) put('brick_1x1', u, yy, v, 'Tan');
    }
  };
  wall(3, 0, 1, 4); wall(3, 2, len - 1, 3); wall(4, 0, len - 1, 4);
  for (let v = 2; v < len; v++) vox('tile', 3, W + 8, v, 'Tan');                       // the foot's ledge
  // the cornice plates on the wall, a plate course over them, then the parapet (left open at the landing, tiled there)
  for (let v = 0; v < len; v += 6) { const n = Math.min(6, len - v); put(`plate_1x${n === 5 ? 4 : n}`, 4, K - 1, v, 'Tan', 0); if (n === 5) put('plate_1x1', 4, K - 1, v + 4, 'Tan'); }
  put('plate_1x2', 3, K - 1, 0, 'Tan', 0);
  for (const u of [3, 4]) put('tile_1x2', u, K, 0, 'Tan', 0);
  for (let v = 2; v < len; v++) { vox('plate', 4, K, v, 'Tan'); const c = m(STONE); for (let yy = K + 1; yy < K + 4; yy++) vox('brick', 4, yy, v, c); vox('tile', 4, K + 4, v, 'Tan'); }
  bp.tag = '';
}

// ---- the bouquinistes ------------------------------------------------------------------------------------------------------------------
/** The lid display per box: [2×2 poster, 1×2 poster, 1×2 poster] prints and the bottom row [1×2, 1×1, 1×1] — a postcard or two, the rest green
 *  tiles that read as the lid itself (round 2: a row of plain colour blocks under the posters read as signage); books in the box. */
const LIDS: { posters: [string, string, string]; cards: [string, string, string]; books: string[] }[] = [
  { posters: ['seine_poster_cat', 'seine_poster_eiffel', 'seine_poster_sail'], cards: ['DarkGreen', 'White', 'DarkGreen'], books: ['DarkRed', 'Tan', 'DarkBlue', 'White'] },
  { posters: ['seine_poster_map', 'seine_poster_sail', 'seine_poster_eiffel'], cards: ['DarkGreen', 'DarkGreen', 'Tan'], books: ['White', 'DarkBlue', 'Tan', 'DarkRed'] },
  { posters: ['seine_poster_cat', 'seine_poster_eiffel', 'seine_poster_sail'], cards: ['White', 'DarkGreen', 'DarkGreen'], books: ['Tan', 'DarkRed', 'White', 'DarkBlue'] },
];
/** A bouquiniste box on a parapet: (x, z) the box's min corner, y the parapet's plate top (the coping tile under the box is cleared); the
 *  box is 2 × 4, back row u 0 on the parapet, front row u 1 overhanging the pavement, lid open toward +u (the street). Dark Green "vert wagon". */
export function bouquiniste(bp: Blueprint, x: number, y: number, z: number, rot = 0, variant = 0) {
  const { put, asm, clear } = frame(bp, x, z, rot, 2, 4); const G = 'DarkGreen'; const L = LIDS[variant % LIDS.length];
  bp.tag = 'bouquiniste';
  for (let v = 0; v < 4; v++) clear(0, y, v, 1);
  put('brick_2x4', 0, y, 0, G); put('plate_1x4', 0, y + 3, 0, G);
  L.books.forEach((c, v) => put('tile_1x1', 1, y + 3, v, c));
  const mem = asm('seine_lid', 0, y + 4, 0, G).filter((p) => /^ld_30(68b|69b|70b)$/.test(p.key));
  if (mem.length !== 6) throw new Error('seine_lid: expected 6 display tiles, got ' + mem.length);
  mem.slice(0, 3).forEach((p, i) => { p.print = L.posters[i]; p.color = 'Tan'; });
  mem.slice(3).forEach((p, i) => { p.color = L.cards[i]; });
  bp.tag = '';
}
