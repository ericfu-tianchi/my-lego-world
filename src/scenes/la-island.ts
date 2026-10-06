// USA · Los Angeles island v2 (2026-10-05) — one slice of LA from the sea to the hills (docs/countries/usa.md §1.4, §1.12; elements from the
// test scenes la-pier, la-venice, la-sign, la-life, la-griffith). v2 after the lead's review of v1 (a rectangle, a ziggurat, the wheel in
// front of the letters):
//   outline  a smooth closed curve through hand-placed points: the hills bulge at the back, the land corners round, the pier's tail runs
//            off the straight west edge; the plinth follows it
//   sea      Santa Monica Bay as one smooth concave shore: x 14 under the hills, sweeping out under the pier (whose east third stands on the
//            beach, as the real one does) and back east at the front; three broken surf lines, a Dark Tan wet-sand edge
//   pier     Santa Monica Pier (the hero), the landing on the beach with the arch and the 66 sign, flat 2-plate steps down to the sand
//   beach    the widest band: from the bay to Venice, the lifeguard tower, the surfer at the open waterline, two umbrellas with towels
//   Venice   the Ocean Front Walk at the hills' foot with six fan palms at pitch 8, the roller-skater; the bowl (the skater on the coping),
//            Muscle Beach (the lifter), the three art walls
//   hills    a ridge with a west peak, a saddle and Mount Lee (the mast), a lower spur to Griffith; the south face cut by spurs and gullies
//            running down it at a slant, the back and the west flank stepping down to the plinth and the sea; dark chaparral dominant
//   Griffith the observatory on its terrace at G + 8 (GRIFFITH below), lower than the letters and to their right
//   heights  wheel 80.5 ≫ mast / whip 64 / 76 > summit 46 > letters 29–43 > Griffith ≈ 46 on its terrace > palms ≈ 40 > tower 29 > walls 17
// Island DNA as every set: base 3, two bricks of earth, a capped stone plinth one cell outside, water two plates below the land.
// Grid: x west → east, z north → south (north at the back); the camera looks from the south-south-east so the wheel stands clear of the letters.
import { Blueprint } from '../core/builder';
import { PARTS, footprint } from '../core/catalog';
import { Reserve, Sites, patch, minifig2, fanPalm, rotv, type SceneMeta } from './lib';
import { placePier } from './la-pier';
import { placeVenice } from './la-venice';
import { placeSign, benchAt, vnoise, SUMMIT } from './la-sign';
import { SURFER, LIFTER } from './la-life';

const N = 6;                                          // rows of hill back-slope north of the sign sample (its z 0 is island z N)
const W = 110, D = 82, G = 10, BASE = 3, BED = 6, WATER = 7;
/** Griffith Observatory's terrace: level at G + 8 (top plate at G + 7), cells x 80..109, z 6..35 (30 × 30, as la-griffith.ts) */
export const GRIFFITH = { x: 80, z: N, w: 30, d: 30, level: G + 8 };
// the sea: opaque Sand Blue tiles (the muted blue-grey of the bay), deepening to Dark Blue offshore in one wavy band, a scatter of Trans-Clear
// glints, three broken surf lines; laid by hand as 2×2 / 1×2 / 1×1 tiles. Swatches in docs/refs/la-island/build: sea-1..6 (trans tiles over a bed:
// Trans-Light-Blue icy, Trans-Clear frost, Trans-Dark-Blue royal, Trans-Black murky; Trans-Medium Blue read well but its tile sizes are
// unconfirmed), v3-sea-A..C (opaque mixes: Dark Blue-dominant read navy, patchy mixes read as blocks)
const SEA_NEAR = 'SandBlue', SEA_FAR = 'DarkBlue';
const SHALLOW = 3.4;                                  // studs of Trans-Light-Blue shallows out from the waterline (r3: 4.4 read icy from the default camera)
const SANDY = 2.2;                                    // r3: only this inner strip has the Tan sand shelf under it; further out the Trans-Light-Blue lies on Sand Blue
const SIDE_Y = 4;                                    // the sea's side wall shows water from this plate up (the plinth along the sea tops out here)
const SIGN_X = 28;                                   // the sign sample's cell (0, 0) on the island: letters x 30..68, mast x 71..74

type Pt = [number, number];
/** a closed Catmull-Rom curve through the points, sampled */
function closedSpline(P: Pt[], n = 12): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i < P.length; i++) {
    const p0 = P[(i - 1 + P.length) % P.length], p1 = P[i], p2 = P[(i + 1) % P.length], p3 = P[(i + 2) % P.length];
    for (let k = 0; k < n; k++) { const t = k / n, t2 = t * t, t3 = t2 * t;
      out.push([0, 1].map((j) => 0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3)) as Pt); }
  }
  return out;
}
const inside = (poly: Pt[], x: number, z: number) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, zi] = poly[i], [xj, zj] = poly[j]; if ((zi > z) !== (zj > z) && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) c = !c; } return c; };
/** piecewise-linear through knots [t, v], eased between knots */
const knots = (K: Pt[]) => (t: number) => { if (t <= K[0][0]) return K[0][1]; for (let i = 1; i < K.length; i++) if (t <= K[i][0]) { const [a, va] = K[i - 1], [b, vb] = K[i]; const u = (t - a) / (b - a); const s = u * u * (3 - 2 * u); return va + (vb - va) * s; } return K[K.length - 1][1]; };

// the outline, clockwise from the north-west: the hills' bulging back edge, the land's rounded east and south-east, the sea's south and west
const OUTLINE = closedSpline([[13, 9], [21, 3.2], [32, 1], [44, 2.6], [56, 0.9], [70, 0.2], [81, 1.6], [93, 0.5], [105, 0.6], [109.8, 4],
  [110.3, 16], [110.3, 40], [110.3, 60], [109.6, 72], [105.5, 79.4], [96, 81.9], [82, 82.3], [66, 81.8], [50, 82.1], [32, 81.3], [16, 80.9],
  [7, 80.2], [1.5, 76], [-0.4, 66], [-0.4, 50], [0.3, 38], [2, 25], [6, 15]]);   // r2: six rows deeper in the south, a beach wide enough to read (Venice's is 100 m)
/** the shore (the first beach cell's x) by row: under the hills, out under the pier, back east at the front */
const shore = knots([[0, 13], [8, 15], [16, 19], [24, 25], [30, 33], [36, 41], [44, 46], [58, 48], [68, 49], [74, 53], [82, 62]]);
/** the ridge's crest height (plates above G) along x: a west peak, a saddle, Mount Lee round the mast, the spur falling east */
// r2 (judge r2 §5.3): three rounded summits, Mount Lee the highest — the west peak over the O-L-L, the middle one over the O-O, Lee round the mast
const RIDGE = knots([[16, 24], [26, 36], [32, 42], [36, 45], [40, 43], [45, 37], [50, 36], [54, 41], [57, 46], [60, 44], [64, 42], [67, 48], [69, 50], [76, 50], [79, 38], [84, 16], [96, 11], [110, 8]]);

export function buildLa(bp: Blueprint): SceneMeta {
  const R = new Reserve(); const sites = new Sites(2); const k2 = (x: number, z: number) => x + ',' + z;
  const inIsland = (x: number, z: number) => x >= 0 && z >= 0 && x < W && z < D && inside(OUTLINE, x + 0.5, z + 0.5);
  const isSea = (x: number, z: number) => inIsland(x, z) && x < shore(z + 0.5);
  const edgeDist = (x: number, z: number) => { for (let r = 1; r <= 3; r++) for (let dx = -r; dx <= r; dx++) for (let dz = -r; dz <= r; dz++) if (Math.max(Math.abs(dx), Math.abs(dz)) === r && !inIsland(x + dx, z + dz)) return r; return 9; };
  const floorOf = (x: number, z: number) => (edgeDist(x, z) <= 3 ? 0 : BASE);
  const earth = (y: number) => (y < 6 ? 'DarkBluishGray' : 'DarkTan');
  /** chessboard distance from every cell to the nearest cell matching `src` (BFS) */
  const distTo = (src: (x: number, z: number) => boolean) => { const d = new Map<string, number>(); let q: Pt[] = [];
    for (let x = -1; x <= W; x++) for (let z = -1; z <= D; z++) if (src(x, z)) { d.set(k2(x, z), 0); q.push([x, z]); }
    for (let r = 1; q.length; r++) { const nq: Pt[] = []; for (const [x, z] of q) for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) { const nx = x + dx, nz = z + dz; if (nx < -1 || nz < -1 || nx > W || nz > D || d.has(k2(nx, nz))) continue; d.set(k2(nx, nz), r); nq.push([nx, nz]); } q = nq; }
    return (x: number, z: number) => d.get(k2(x, z)) ?? 99; };
  const dOut = distTo((x, z) => !inIsland(x, z)), dSea = distTo(isSea);

  // ---- the shore, r2 (Eric: "增加质感或者增加厚度…让海岸更具感觉"; judge r2: a stepped diagonal, white specks): p = studs from the
  // waterline measured square to the shore curve (land ≥ 0, sea < 0). From the sea in: Dark Blue offshore, Sand Blue, two continuous surf
  // lines of White 1 × N tiles parallel to the curve, Trans-Light-Blue shallows over a Tan sand shelf, a White foam fringe, then wet sand
  // flush with the water (Dark Tan tiles), a plate higher studded Dark Tan, a plate higher the dry beach — no wall at the waterline.
  const pOf = (x: number, z: number) => { const zc = z + 0.5; return (x - shore(zc)) / Math.hypot(1, shore(zc + 0.5) - shore(zc - 0.5)); };
  const along = (x: number, z: number) => z + 0.55 * x;   // a coordinate running along the shore, for the breaks in the surf lines
  const seaColour = (x: number, z: number, q: number) => {
    if (q <= 1.1) return 'White';                                                                  // the foam fringe
    if (q < SHALLOW) return 'TransLightBlue';                                                       // the shallows: sand through the water
    return q >= 13 + 3 * vnoise(x, z, 9, 19) ? SEA_FAR : SEA_NEAR;
  };
  /** the beach's top (plates) at a plain sand cell: flush with the water at the line, a plate up, then the dry beach at G */
  const sandTop = (x: number, z: number) => { if (R.has(x, z)) return G; const p = pOf(x, z); return p < 1.4 ? WATER + 1 : p < 2.8 ? WATER + 2 : G; };
  /** the sand's surface course: wet Dark Tan tiles at the line, studded Dark Tan above; the dry beach studded Tan with smooth Tan tile streaks
   *  and soft drifts of Light Nougat (dry, wind-blown) and Dark Tan (damp hollows), stretched along the shore */
  const sandSurface = (x: number, z: number, t: number): ['plate' | 'tile', string] => {
    if (t === WATER + 1) return [propCells.has(k2(x, z)) ? 'plate' : 'tile', 'DarkTan'];
    if (t === WATER + 2) return ['plate', 'DarkTan'];
    const a = along(x, z), b = (x - 0.55 * z) * 2.2;                                                 // stretched along the shore
    const pale = vnoise(a, b, 7, 81) > 0.42, damp = vnoise(a + 40, b, 6, 83) > 0.55, smooth = !propCells.has(k2(x, z)) && vnoise(a, b * 1.5, 5, 85) > 0.3;
    const col = pale ? 'LightNougat' : damp ? 'DarkTan' : 'Tan';
    return [smooth ? 'tile' : 'plate', col];
  };
  const propCells = new Set<string>();                 // cells the beach props stand on: always studded
  // the surf lines: a path one stud wide traced along the curve at a fixed distance offshore, running south in a column and east in a row,
  // every turn a White macaroni tile (2 × 2 quarter ring) with a 1 × 1 quarter tile in the sea colour filling its inner corner, the straight
  // runs White 1 × N tiles — so each line reads as one smooth wavy crest along the bay instead of a staircase of specks
  const surfCell = new Set<string>(), surfMac: [number, number, number][] = [], macCells = new Set<string>();
  const seaFree = (x: number, z: number) => isSea(x, z) && !surfCell.has(k2(x, z)) && !macCells.has(k2(x, z));
  for (const [k, seed, gap] of [[5.6, 71, -0.55], [9.8, 73, -0.3]] as [number, number, number][]) {
    const xT = (zc: number) => shore(zc) - k * Math.hypot(1, shore(zc + 0.5) - shore(zc - 0.5));
    const on = (x: number, z: number) => vnoise(along(x, z), 0, 5, seed) > gap;               // long runs with a few breaks
    let z = 0, x = Math.round(xT(0.5) - 0.5), south = true;
    for (let guard = 0; guard < 400 && z < D && x < W; guard++) {
      if (south) {
        if (xT(z + 1) - (x + 0.5) > 1 && z + 2 <= D) {                                            // turn east: the ring's centre at (x + 2, z)
          const cs: Pt[] = [[x, z], [x + 1, z], [x, z + 1], [x + 1, z + 1]];
          if (on(x, z) && cs.every(([a, b]) => seaFree(a, b))) { surfMac.push([x, z, 3]); cs.forEach(([a, b]) => macCells.add(k2(a, b))); }
          south = false; x += 2; z += 1;
        } else { if (on(x, z) && seaFree(x, z)) surfCell.add(k2(x, z)); z++; }
      } else {
        if (xT(z + 1.5) - (x + 0.5) < 0.5) {                                                       // turn south: the ring's centre at (x, z + 2)
          const cs: Pt[] = [[x, z], [x + 1, z], [x, z + 1], [x + 1, z + 1]];
          if (on(x, z) && cs.every(([a, b]) => seaFree(a, b))) { surfMac.push([x, z, 1]); cs.forEach(([a, b]) => macCells.add(k2(a, b))); }
          south = true; x += 1; z += 2;
        } else { if (on(x, z) && seaFree(x, z)) surfCell.add(k2(x, z)); x++; }
      }
    }
  }

  // ---- the hills: heights in plates above G, in sample rows zs = z − N (letters on zs 8, their bench zs 6..9)
  const crest = (x: number) => 2.5 + 1.3 * Math.sin(x / 7);
  const hill = new Map<string, number>();
  /** Mount Lee as a dome round its summit pad (r2: a 4-plate block stood on a cliff): 2 plates down for every 1⅓ studs out, east of the
   *  letters' bench only, so the D keeps its footing */
  const lee = (x: number, zs: number) => SUMMIT - 2 * Math.ceil(Math.max(0, Math.hypot(x - (SIGN_X + 44), (zs - 2) / 0.8) - 3.5) * 0.75);
  const raw = (x: number, zs: number): number | null => { const v = raw0(x, zs); return v !== null && x > SIGN_X + 40 ? Math.max(v, lee(x, zs)) : v; };
  const raw0 = (x: number, zs: number): number | null => {
    if (zs > 25) return null;
    if (x >= GRIFFITH.x && zs >= 0) return null;                                       // the terrace
    const Rx = 2 * Math.round(RIDGE(x) / 2), zc = crest(x);                            // even, so the crest steps 2 plates and takes curved slopes
    const q23 = (d: number) => (d < 7 ? 2 * Math.max(0, Math.round(d / 2)) : 3 * Math.round(d / 3));   // 2-plate steps round the summit, 3 lower down
    if (zs <= zc) return Rx - q23(4.5 * (zc - zs));                                    // the back slope
    const letters = x >= SIGN_X + 1 && x <= SIGN_X + 41, b = benchAt(x - SIGN_X);
    const rate = 1.55 * (1 + 0.55 * vnoise(x + 0.6 * zs, 3, 8, 17));                    // spurs and gullies: the fall rate varies along a slant
    const gully = 3 * Math.max(0, vnoise(x - 0.4 * zs, 5, 5, 23));
    if (letters) {
      if (zs >= 6 && zs <= 9) return b;
      if (zs < 6) { const v = Math.min(Rx, b + 2 + (5 - zs) * 1.9 + vnoise(x, zs, 5, 7) * 1.5); return b + 2 * Math.max(1, Math.round((v - b) / 2)); }
      const f = b - 3 - (zs - 10) * rate + vnoise(x, zs, 5, 11) * 2.4 - gully; return b - 3 * Math.max(1, Math.round((b - f) / 3));
    }
    const f = Rx - (zs - zc) * rate * 1.25 + vnoise(x, zs, 5, 11) * 2 - gully; return Rx - q23(Math.max(0, Rx - f));
  };
  for (let x = 0; x < W; x++) for (let z = 0; z < D; z++) { if (!inIsland(x, z) || isSea(x, z)) continue; const v = raw(x, z - N); if (v !== null) hill.set(k2(x, z), Math.round(v)); }
  for (let it = 0; it < 6; it++) for (const [key, v] of hill) { const [x, z] = key.split(',').map(Number); for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nk = k2(x + dx, z + dz); const nv = hill.get(nk); if (nv !== undefined && v - nv > 6) hill.set(nk, v - 6); } }
  for (const [key, v] of hill) { const [x, z] = key.split(',').map(Number); hill.set(key, Math.min(v, 6 * Math.round(dOut(x, z) + 1.2 * vnoise(x, z, 4, 67)) - 3, 3 * Math.round(dSea(x, z) + 1.8 * vnoise(x, z, 4, 61)))); }   // noisy, so the flanks break into spurs instead of rings   // the back and the west flank step down to the plinth and the bay
  // r3 (Eric: the cliff from Mount Lee down to the Griffith terrace): the east flank steps down to the terrace about 8 plates a stud, as the
  // other flanks step to the plinth and the bay, instead of the ridge's 30-plate wall at the terrace's edge
  { const ter = (x: number, z: number) => x >= GRIFFITH.x && z >= GRIFFITH.z && z < GRIFFITH.z + GRIFFITH.d && inIsland(x, z); const dTer = distTo(ter);
    for (const [key, v] of hill) { const [x, z] = key.split(',').map(Number); hill.set(key, Math.min(v, GRIFFITH.level - G + 3 * Math.round((8 * dTer(x, z) - 2 + 1.5 * vnoise(x, z, 4, 71)) / 3))); } }
  const force = (x: number, zs: number, v: number) => { if (hill.has(k2(x, zs + N))) hill.set(k2(x, zs + N), v); };
  for (let x = SIGN_X + 1; x <= SIGN_X + 41; x++) for (let zs = 6; zs <= 9; zs++) force(x, zs, benchAt(x - SIGN_X));   // the letters' bench
  for (let x = SIGN_X; x <= SIGN_X + 18; x++) for (const zs of [16, 17]) force(x, zs, 20);                             // the trail tread
  for (const x of [SIGN_X + 1, SIGN_X + 2]) { for (let zs = 10; zs <= 12; zs++) force(x, zs, 23); for (let zs = 13; zs <= 15; zs++) force(x, zs, 20); }   // its ramps
  for (let x = SIGN_X + 41; x <= SIGN_X + 46; x++) for (let zs = 0; zs <= 4; zs++) force(x, zs, SUMMIT);                // Mount Lee's summit round the mast (r3: to the mast's east side, x 74)
  for (const [key, v] of hill) if (v < 3) hill.delete(key);
  const H = (x: number, z: number): number | null => hill.get(k2(x, z)) ?? null;
  const terrace = (x: number, z: number) => x >= GRIFFITH.x && z >= GRIFFITH.z && z < GRIFFITH.z + GRIFFITH.d && inIsland(x, z);
  const topOf = (x: number, z: number) => { if (!inIsland(x, z)) return -99; if (isSea(x, z)) return WATER + 1; if (terrace(x, z)) return GRIFFITH.level; const h = H(x, z); return h === null ? G : G + h; };
  const nbTop = (x: number, z: number) => Math.min(...[[1, 0], [-1, 0], [0, 1], [0, -1]].map(([dx, dz]) => topOf(x + dx, z + dz)));

  // ---- the pier: park x 4..55, z 40..71 over the bay and the beach; approach x 56..61, landing x 62..67 (z 48..63) on the sand
  const PZ = 28 + N;
  bp.tag = 'pier'; const piles = placePier(bp, 0, PZ, BED, (x, z) => (isSea(x, z) ? null : sandTop(x, z)));
  sites.add('pier', 30, 56, 16, 'pier'); sites.add('landing', 65, 56, 4, 'pier');
  const own = new Set<string>();
  bp.tag = 'pier';                                    // flat steps of equal rise from the landing (deck top G + 6) down to the sand, deck colours
  for (let z = PZ + 14; z < PZ + 30; z++) { for (const x of [68, 69]) { bp.fill('plate', x, G, z, 1, 3, 1, 'ReddishBrown'); bp.vox1('tile', x, G + 3, z, 'DarkTan'); } for (const x of [70, 71]) { bp.vox1('plate', x, G, z, 'ReddishBrown'); bp.vox1('tile', x, G + 1, z, 'DarkTan'); } }
  R.add(56, PZ + 14, 16, 16);

  // ---- Venice: the walk at the hills' foot (x 60..109, z 36..46), the bowl, Muscle Beach and the art walls south of it, the tower on the beach
  const PALMS = [62, 70, 78, 86, 94, 102];            // palm axes (pitch 8); pockets one cell west of each
  const ROLL: Pt = [64, N + 30.5];                    // the roller-skater on the walk's back row; r3: seen from the default camera through the gap between the lamp (65) and the palm (70)
  const L = { walk: { x0: 60, x1: W, z0: N + 30, pockets: PALMS.map((p) => p - 1), lamps: [65, 81, 97, 105], benches: [72, 88], skater: [[ROLL[0], N + 30]] as [number, number][] },
    bowl: { x: 74, z: N + 43 }, gym: { x: 95, z: N + 43 }, tower: { x: 62, z: N + 62 }, walls: { x: 80, z: N + 57 } };   // the walls west of Muscle Beach's line of sight from the default camera (judge r1: the lifter was hidden)
  placeVenice(bp, L, own);
  const bowlCell = (x: number, z: number) => x >= L.bowl.x && x < L.bowl.x + 19 && z >= L.bowl.z && z < L.bowl.z + 12;
  for (const dx of [5, 14]) sites.add('bowl', L.bowl.x + dx, L.bowl.z + 6, 5, 'bowl'); sites.add('gym', L.gym.x + 7, L.gym.z + 5, 5); for (const dx of [4, 13, 22]) sites.add('walls', L.walls.x + dx, L.walls.z + 3, 3, 'walls'); sites.add('tower', L.tower.x + 3, L.tower.z + 3, 3);
  R.add(L.bowl.x, L.bowl.z - 2, 19, 14); R.add(L.gym.x, L.gym.z, 14, 10); R.add(L.walls.x, L.walls.z, 26, 7); R.add(L.tower.x, L.tower.z, 19, 7);

  // ---- Walk of Fame (la-griffith.ts): a 20 × 4 Hollywood Blvd sidewalk at the hills' foot (x 58..77, z 32..35), one plate proud like the
  // walk: a pale row, a charcoal band with four star tiles every five studs, a dark kerb
  const SX = 58, SZ = N + 26;
  bp.tag = 'walkoffame';
  for (const k of [0, 1, 2, 3]) bp.part('tile_2x2', SX + 1 + 5 * k, G, SZ + 1, 'Black', 0, 'walk_star');
  for (let i = 0; i < 20; i++) for (let j = 0; j < 4; j++) { own.add(k2(SX + i, SZ + j)); bp.vox1('plate', SX + i, G - 1, SZ + j, 'DarkBluishGray'); const star = j >= 1 && j <= 2 && (i - 1) % 5 <= 1 && i >= 1 && i <= 17; if (!star) bp.vox1('tile', SX + i, G, SZ + j, j === 3 ? 'DarkBluishGray' : j === 0 ? 'LightBluishGray' : 'Black'); }

  // ---- the beach corner (r2, Eric: "没看出那是沙滩…加东西"): the LA beach kit grouped in front of the lifeguard tower, as Venice's sand
  // reads in docs/refs/la-venice/real-tower-18/19 and the official beach sets (60328, 31118, 41709): the red rescue board and a life ring
  // at the tower, two umbrellas with striped towels, a cooler, a sandcastle with its bucket, two surfboards stuck upright, a volleyball net;
  // a crab and a starfish on the wet sand. Everything on studs at G (the props' cells stay studded, see propCells).
  bp.tag = 'beach';
  /** a surfboard stuck upright: a 2-brick round post with a vertical clip on a round plate, the board's rail in the clip (the same rail the
   *  surfer's hand holds), its tail on the sand. Clip on cell (cx, cz), jaw toward rotv(0, 1, r), its bore 0.9 out; the board stands past
   *  the jaw, set 0.3 nearer than gp says so the rail's face sits in the C (checked top-down, r2 close-ups). */
  const board = (cx: number, cz: number, r: number, c: string) => {
    for (const k of [0, 3]) bp.part('round_1x1', cx, G + k, cz, 'White'); bp.part('roundplate_1x1', cx, G + 6, cz, 'White'); bp.part('clip_v', cx, G + 7, cz, 'White', r);
    const rb = (r + 1) & 3, [fw, fd] = rb & 1 ? [1, 2] : [2, 1], [jx, jz] = rotv(0, 0.6, r), [gx, gz] = rotv(0.85, -0.1, rb);
    bp.part('la_board_clip', cx + 0.5 + jx - gx - fw / 2, G, cz + 0.5 + jz - gz - fd / 2, c, rb); R.add(cx - 1, cz - 1, 5, 3);
  };
  /** a beach umbrella (the Prague café's build: open-stud round plate, two 4L bars on a round brick, the canopy) with a striped towel of two
   *  1 × 4 tiles beside it */
  const umbrella = (x: number, z: number, c: string, towel: [string, string]) => {
    sites.add('umbrella' + x, x + 0.5, z + 0.5, 2.5);
    bp.part('roundplate_open', x, G, z, 'White'); bp.part('bar_4l', x, G + 1, z, c === 'White' ? 'LightBluishGray' : 'White'); bp.part('round_1x1', x, G + 7, z, c); bp.part('bar_4l', x, G + 9, z, c === 'White' ? 'LightBluishGray' : 'White');
    bp.part('umbrella', x - 2.5, G + 16, z - 2.5, c);
    bp.part('tile_1x4', x + 1, G, z - 1, towel[0]); bp.part('tile_1x4', x + 2, G, z - 1, towel[1]); R.add(x - 1, z - 2, 5, 6);
  };
  board(63, 76, 1, 'BrightRed');                                                        // the lifeguards' rescue board at the tower's foot
  bp.part('la_lifering', 67, G, 76, 'BrightRed'); R.add(66, 75, 3, 4);                  // a ring lying by the ramp
  umbrella(72, 78, 'Yellow', ['Coral', 'White']);
  bp.part('brick_1x2', 69, G, 80, 'MediumAzure'); bp.part('tile_1x2', 69, G + 3, 80, 'White'); R.add(69, 80, 1, 2);   // a cooler
  // a sandcastle on its mound: a 4 × 4 round plate, a round 2 × 2 keep with two cone-roofed 1 × 1 turrets on its diagonal, two lower
  // turrets on the mound's rim studs, the bucket that moulded it beside
  bp.part('roundplate_4x4', 77, G, 76, 'Tan'); bp.part('roundbrick_2x2', 78, G + 1, 77, 'Tan');
  for (const [x, z, y] of [[78, 77, G + 4], [79, 78, G + 4], [77, 77, G + 1], [80, 78, G + 1]]) { bp.part('round_1x1', x, y, z, 'Tan'); bp.part('cone_1x1', x, y + 3, z, 'Tan'); }
  bp.part('la_bucket', 82, G, 79, 'BrightRed'); R.add(76, 75, 8, 6); sites.add('castle', 79, 78, 2);
  umbrella(86, 77, 'Coral', ['MediumAzure', 'White']);
  board(91, 76, 1, 'Orange'); board(91, 78, 1, 'MediumAzure');                          // two boards stuck upright, a pair of surfers' kit
  // a beach volleyball net: two White posts (two round bricks), a Black 1 × 8 plate across them, two Black square-lattice fences for the mesh, a
  // White 1 × 8 tile for the band — the net's top about a minifig and a quarter high, as the real 2.43 m net stands over a player
  { const NX = 99, NZ = 78; sites.add('net', NX + 4, NZ + 0.5, 3);
    for (const x of [NX, NX + 7]) for (const k of [0, 3]) bp.part('round_1x1', x, G + k, NZ, 'White');
    bp.part('plate_1x8', NX, G + 6, NZ, 'Black', 1); bp.part('la_fence_square', NX, G + 7, NZ, 'Black'); bp.part('la_fence_square', NX + 4, G + 7, NZ, 'Black');
    bp.part('tile_1x8', NX, G + 13, NZ, 'White', 1); R.add(NX - 1, NZ - 1, 10, 3); }

  // ---- the hills (columns from the surface course G − 1), letters, mast, oak, trail; covers on risers facing every way.
  // r2 (Eric: "有那种真实的有点杂乱的感觉了，但感觉稍微有点太过杂乱了"): the chaparral in coherent bands running down the gullies at a slant,
  // dense inside and none outside; the ground under a band Dark Green, between bands bare Dark Tan, every riser cover the colour of its band;
  // the scrub all Dark Green (Olive Green clumps read as yellow crop rows on the treads), no lone specks — two colours on the face, not five
  const zone = (x: number, z: number) => vnoise(x - 0.55 * z, z * 0.6, 4.5, 41) > -0.18;
  placeSign(bp, { ox: SIGN_X, oz: N, G, y0: G - 1, x0: 0, x1: W, z0: 0, z1: N + 26, H, scrub: 1.6, sides: true, zone, calm: true,
    tread: (x, z) => (zone(x, z) ? 'DarkGreen' : 'DarkTan'), slope: (x, z) => (zone(x, z) ? 'DarkGreen' : 'DarkTan'),
    core: () => 'DarkTan' });   // one colour through the column: mixed core colours split the packer's bricks into plates
  sites.add('sign', SIGN_X + 21, N + 8, 18); sites.add('griffith', GRIFFITH.x + 15, GRIFFITH.z + 14, 12);
  // ---- Griffith Observatory on the terrace, as la-griffith.ts: the building 28 × 20 a row in from the terrace's back, lawn panels round an
  // E–W and an N–S path, the monument on its paved island over the crossing, a stud of paving round the rim
  { const TX = GRIFFITH.x, TZ = GRIFFITH.z, TW = GRIFFITH.w, TD = GRIFFITH.d, TOP = GRIFFITH.level, X0 = TX + 1, Z0 = TZ + 2;
    bp.tag = 'griffith'; bp.assembly('griffith', X0, TOP, Z0 - 1, 'White');
    const island = (i: number, j: number) => i >= 12 && i <= 15 && j >= 21 && j <= 24;
    for (let i = 0; i < 28; i++) for (let j = 19; j < 27; j++) { if (island(i, j)) continue; const path = j === 22 || j === 23 || i === 13 || i === 14 || i === 0 || i === 27; bp.vox1(path ? 'tile' : 'plate', X0 + i, TOP, Z0 + j, path ? 'LightBluishGray' : 'Green'); }
    for (let x = TX; x < TX + TW; x++) for (let z = TZ; z < TZ + TD; z++) if ((x === TX || z === TZ || x === TX + TW - 1 || z === TZ + TD - 1) && inIsland(x, z)) bp.vox1('tile', x, TOP, z, 'LightBluishGray');
    bp.assembly('griffith_monument', X0 + 12, TOP, Z0 + 21, 'White'); }

  // ---- palms on the walk
  PALMS.forEach((x, i) => { sites.add('palm' + i, x, L.walk.z0 + 7, 3); fanPalm(bp, x, G, L.walk.z0 + 7, { turn: i }, R); });

  // ---- life layer: four people, each in motion
  bp.tag = 'minifig';
  { const [x, z] = [58, 72]; sites.add('surfer', x, z, 1); bp.tag = 'surfer'; minifig2(bp, x, G, z, 0, SURFER, R); }                   // walking out of the surf with his board, at the open waterline
  // the skater (a tail stall on the bowl's coping, board and figure tilted together on two hinges) is la_skater, placed by placeVenice
  { const [x, z] = [L.gym.x + 7, L.gym.z + 6]; bp.tag = 'lifter'; minifig2(bp, x, G + 2, z, 0, LIFTER, R); }                            // curls in the pen
  { const [x, z] = ROLL; sites.add('roller', x, z, 1); bp.tag = 'roller'; R.add(x - 2, z - 2, 4, 4);                                  // r3 (Eric): gliding west on one skate, the other leg raised back (la_roller, a minifig of real parts)
    bp.assembly('la_roller', x, G + 1, Math.floor(z), 'White', 0, { '973|White': 'torso_la_rainbow_m', '3626c|Yellow': 'face_la_shades_m' }); }

  // ---- terrain: earth two bricks deep, sea, beach, the surfaces the elements do not lay themselves
  bp.tag = 'terrain'; const waterTiles = new Map<string, string>();
  // laid last, so every part standing on the ground is known: those cells stay studded (a smooth tile holds nothing)
  for (const pl of bp.parts) { if (pl.member || pl.y < WATER || pl.y > G + 1) continue; const [fw, fd] = footprint(PARTS[pl.key], pl.rot);
    for (let x = Math.floor(pl.x); x < Math.ceil(pl.x + fw); x++) for (let z = Math.floor(pl.z); z < Math.ceil(pl.z + fd); z++) propCells.add(k2(x, z)); }
  for (let x = 0; x < W; x++) for (let z = 0; z < D; z++) {
    if (!inIsland(x, z)) continue;
    const f = floorOf(x, z);
    if (isSea(x, z)) {
      const q = -pOf(x, z), shallow = q < SHALLOW, edge = dOut(x, z) <= 1;
      // the water's thickness shows in the side wall over the lowered plinth: Trans-Light Blue over the sand shelf, Trans-Dark Blue offshore
      const side = shallow ? 'TransLightBlue' : 'TransDarkBlue', under = shallow ? 'Tan' : SEA_FAR;
      for (let y = f; y < BED; y++) bp.vox1('brick', x, y, z, y < SIDE_Y ? earth(y) : edge ? side : under);
      bp.vox1('plate', x, BED, z, edge ? side : shallow && q < SANDY ? 'Tan' : SEA_NEAR);   // the sand shelf under the inner shallows, the sea's blue-grey under the rest and offshore
      if (piles.has(k2(x, z)) || macCells.has(k2(x, z))) continue;
      waterTiles.set(k2(x, z), surfCell.has(k2(x, z)) ? 'White' : seaColour(x, z, q));
      continue;
    }
    if (bowlCell(x, z)) { for (let y = f; y < BASE; y++) bp.vox1('brick', x, y, z, earth(y)); continue; }   // the bowl lays its own earth from BASE
    const steps = x >= 68 && x < 72 && z >= PZ + 14 && z < PZ + 30;
    const plain = !terrace(x, z) && H(x, z) === null && !own.has(k2(x, z)) && !steps;
    const t = plain ? sandTop(x, z) : G;
    for (let y = f; y < t - 1; y++) bp.vox1('brick', x, y, z, earth(y));
    if (terrace(x, z)) {                               // the Griffith terrace: the hill's earth, solid to G + 7
      for (let y = G - 1; y < GRIFFITH.level - 1; y++) bp.vox1('brick', x, y, z, nbTop(x, z) <= y ? 'DarkTan' : 'DarkBluishGray');
      bp.vox1('plate', x, GRIFFITH.level - 1, z, 'DarkTan'); continue;
    }
    if (H(x, z) !== null) continue;   // the hill lays its own column
    if (own.has(k2(x, z))) continue;   // the elements lay their surfaces
    if (steps) { bp.vox1('plate', x, G - 1, z, 'Tan'); continue; }   // under the steps
    const [kind, col] = sandSurface(x, z, t); bp.vox1(kind, x, t - 1, z, col);
  }
  for (const [x, z, r] of surfMac) {                   // the crests' turns: the hole cell beside the ring's centre takes a quarter tile
    const [hx, hz] = [[0, 0], [0, 1], [1, 1], [1, 0]][r];
    bp.part('la_macaroni', x, WATER, z, 'White', r); bp.part('tile_quarter_1x1', x + hx, WATER, z + hz, seaColour(x + hx, z + hz, -pOf(x + hx, z + hz)), r);
  }
  // the water's tiles by hand, longest first along the run (White surf up to 1 × 4, the sea 2 × 2 / 1 × 2 / 1 × 1: Trans-Light-Blue comes in
  // no bigger tiles)
  bp.tag = 'terrain';
  for (let z = 0; z < D; z++) for (let x = 0; x < W; x++) {
    const c = waterTiles.get(k2(x, z)); if (!c) continue; const f = (a: number, b: number) => waterTiles.get(k2(a, b)) === c;
    const take = (cells: Pt[]) => { for (const [a, b] of cells) waterTiles.delete(k2(a, b)); };
    if (c !== 'White' && f(x + 1, z) && f(x, z + 1) && f(x + 1, z + 1)) { bp.part('tile_2x2', x, WATER, z, c); take([[x, z], [x + 1, z], [x, z + 1], [x + 1, z + 1]]); continue; }
    let nx = 1; while (nx < (c === 'White' ? 4 : 2) && f(x + nx, z)) nx++;
    let nz = 1; while (nz < (c === 'White' ? 4 : 2) && f(x, z + nz)) nz++;
    if (nx >= nz && nx > 1) { bp.part(`tile_1x${nx}`, x, WATER, z, c, 1); take(Array.from({ length: nx }, (_, i) => [x + i, z] as Pt)); }
    else if (nz > 1) { bp.part(`tile_1x${nz}`, x, WATER, z, c); take(Array.from({ length: nz }, (_, i) => [x, z + i] as Pt)); }
    else { bp.part('tile_1x1', x, WATER, z, c); take([[x, z]]); }
  }
  // the plinth: two bricks of stone one cell outside the outline, capped with tiles; along the sea one brick lower, so the water's
  // thickness shows above it as the official dioramas show it
  for (let x = -1; x <= W; x++) for (let z = -1; z <= D; z++) {
    if (inIsland(x, z)) continue; const nb = [[1, 0], [-1, 0], [0, 1], [0, -1]].filter(([dx, dz]) => inIsland(x + dx, z + dz)); if (!nb.length) continue;
    const top = nb.every(([dx, dz]) => isSea(x + dx, z + dz)) ? SIDE_Y - 1 : 6;
    for (let y = 0; y < top; y++) bp.vox1('brick', x, y, z, 'DarkBluishGray'); bp.vox1('tile', x, top, z, 'DarkBluishGray');
  }

  bp.tag = ''; bp.compact = true; bp.pack();
  return { id: 'la', title: 'United States', caption: 'Los Angeles', subtitle: 'Santa Monica Pier · Venice · Hollywood Hills', size: [W, D], center: [W / 2, 18, D / 2], base: BASE, camera: { az: 0.5, el: 0.45, dist: 190 } };
}
