// South Korea · Seoul island v2 (2026-10-06) — the layout of the approved blockout (docs/refs/seoul-island/LAYOUT-v2.md, table v3 round 2;
// ?scene=seoul-blockout), detailed with the element builders. v1 (30/100, Eric) is in git history before d63c80b.
//   back      ONE range across the whole back: Bugaksan's granite peak behind-left of the gate, the City Wall along its crest, a saddle, and
//             N Seoul Tower on the range's east shoulder (Namsan read as part of the backdrop range; the shoulder ≈ the tower's own height)
//   middle    Gwanghwamun dominating the middle (eaves ≈ 0.4 × the island's width), its palace wall out to the west edge
//   square    shallow; BTS's stage centred on the gate's axis, its top level with the gate's granite base so the arches show over it; the guard
//             on the square's west side; two fans at the barrier
//   Bukchon   on the right in front of the range, flanking the gate: the hanok and its neighbour stepping down the alley to the street, two
//             ginkgos, the hanbok visitor at the alley's foot facing the camera
//   Han       across the whole front: cycle path, lawn (the chimaek pair on the front-left lawn), the bowed granite bank, the Hangang Bus
//   heights   tower tip G + 87.5 (shoulder 44 ≈ tower 43.5) > Bugaksan 74 > gate 50 > ginkgo L ≈ G + 49 > hanok ridge C + 33 = G + 35 > stage 16 = gate base > figures 12
// Island DNA as every set: base 3, two bricks of earth, a capped stone plinth one cell outside, the river two plates below the land.
// Grid: x west → east, z north → south (north at the back); the hero camera looks from the south-south-west (az −0.32, el 0.38).
import { Blueprint } from '../core/builder';
import { Sites, ginkgo, sonamu, patch, type SceneMeta } from './lib';
import { copingWall, GATE, GATE_PRINTS, tagGate } from './ko-palace';
import { placeStageS, STAGE_S_IDOLS, STAGE_S_FANS } from './ko-stage';
import { terrain, uphillDirs, cityWall } from './ko-namsan';
import { vnoise } from './la-sign';
import { placeBukchon, alleyLevel } from './ko-hanok';
import { placeHan } from './ko-hangang';
import { idol, fan, guard, hanbokVisitor, picnicPair } from './ko-life';

const W = 78, D = 72, G = 10, BASE = 3, R = 2;   // r9: 78 wide for the 1.3× gate (Eric: grow, don't squeeze); near-square corners (lead r2)
/** Gwanghwamun's granite base, NW corner (26 × 12; the eaves reach a stud further each way from plate 24 up); its axis x 29 */
const GX = 29 - GATE.axis, GZ = 30 - GATE.base[1];   // r9: the gate keeps its axis (x 29) and its front line (z 30), growing back into the range
/** the stage's local (0, 0): centred on the gate's axis, the LED wall 7 studs in front of the base */
const SX = 29 - 12, SZ = 34;   // centred on the gate's axis, the LED frame 4 studs in front of the base (top G + 31 < the lower eave G + 35); r8: 3 studs north, so the fans stand three rows back from the barrier
/** Bukchon's district origin and courtyard level: the alley's foot (C − 8) meets the street at G */
const KX = 48, KZ = 22, C = G + 2;   // r9: east of the gate's east wall stub   // lead r3: the district two plates above the street (alley clamped to one step), the anchae's ridge G + 35 < the gate's 50
/** the Han strip's first row (the cycle path) */
const HZ = 51;
/** the range: crest height (plates above G) at control x; the City Wall's crest rows z 4–6 (wall on z 5, x 4–51); the tower's pad */
const CREST: [number, number][] = [[0, 26], [8, 48], [16, 70], [24, 89], [30, 80], [36, 62], [42, 48], [48, 40], [54, 44], [58, 44], [66, 44], [70, 36], [78, 26]];   // r9: the peak 89, ~25 over the gate's ridge (64), at x 24 so the west flank can fall to the edge
const WALL = { x0: 16, modules: 9, z: 5 };   // r5: from the west shoulder over the peak to the saddle, one continuous run
const PAD = { x0: 58, x1: 66, z0: 4, z1: 12, h: 44 }, TOWER = { x: 62, z: 8 };   // block-aligned
/** red pines on the range (axis points; each seat is one level 2 × 2 block) */
const PINES: [number, number, 'XS' | 'S'][] = [[9, 13, 'S'], [17, 7, 'XS'], [25, 7, 'XS'], [31, 9, 'XS'], [39, 9, 'S'], [51, 15, 'S'], [67, 13, 'S'], [71, 7, 'XS'], [61, 17, 'XS'], [13, 1, 'XS'], [41, 1, 'XS'], [65, 3, 'XS']];   // odd axis points: each seat is one block
/** the second ginkgo, on the street west of Bukchon (axis point); the visitor at the alley's foot */
const GINKGO2 = { x: 50, z: 45 }, VIS = { x: 67, z: 42.5 };

export function buildSeoul(bp: Blueprint): SceneMeta {
  const k2 = (x: number, z: number) => x + ',' + z; const sites = new Sites(2);
  const inIsland = (x: number, z: number) => {
    if (x < 0 || z < 0 || x >= W || z >= D) return false;
    const cx = Math.min(Math.max(x + 0.5, R), W - R), cz = Math.min(Math.max(z + 0.5, R), D - R);
    return Math.hypot(x + 0.5 - cx, z + 0.5 - cz) <= R;
  };
  const edgeDist = (x: number, z: number) => { for (let r = 1; r <= 3; r++) for (let dx = -r; dx <= r; dx++) for (let dz = -r; dz <= r; dz++) if (Math.max(Math.abs(dx), Math.abs(dz)) === r && !inIsland(x + dx, z + dz)) return r; return 9; };
  const floorOf = (x: number, z: number) => (edgeDist(x, z) <= 3 ? 0 : BASE);
  const earth = (y: number) => (y < 6 ? 'DarkBluishGray' : 'DarkTan');
  const own = new Set<string>();                       // cells whose whole column an element lays (Bukchon, the Han)
  const studs = new Set<string>();                     // island surface cells something stands on: studded plates, never a tile
  const stand = (x: number, z: number, w: number, d: number) => { for (let i = x; i < x + w; i++) for (let j = z; j < z + d; j++) studs.add(k2(i, j)); };
  const white = new Set<string>();                     // the gate's tunnel floors: White tiles flush with the square

  // ---- the range, laid out in 2 × 2 blocks (lead r3: a mountain, not terraces): every block is one tread, so every tread is at least two
  // studs deep and every riser between blocks (3 or 6 plates, 2 + 3k throughout) takes a 45° slope, a 65° slope or a granite dome —
  // terrain()'s covers need a two-deep tread. Crest per 4-stud bin (level under each wall module); the back face drops 6 a block; the
  // front falls to the square with value noise breaking the masses; the flanks fall at most 6 a block to the island's edge.
  const crestAt = (x: number) => { for (let i = 1; i < CREST.length; i++) if (x <= CREST[i][0]) { const t = (x - CREST[i - 1][0]) / (CREST[i][0] - CREST[i - 1][0]); return CREST[i - 1][1] + (CREST[i][1] - CREST[i - 1][1]) * t * t * (3 - 2 * t); } return CREST[CREST.length - 1][1]; };
  const q3 = (v: number) => 3 * Math.round((v - 2) / 3) + 2;
  const rawBin = (x: number) => q3(crestAt(Math.floor(x / 4) * 4 + 2));
  // lead r5 (the summit wall read as separate blocks): along the wall the crest climbs at most 6 plates a 4-stud bin, so each module's
  // masonry starts below its neighbour's merlons and the wall reads as one stepped run; a lower bin is raised toward its higher neighbour
  const wallBins = new Map<number, number>();
  for (let b = WALL.x0 / 4; b < WALL.x0 / 4 + WALL.modules; b++) wallBins.set(b, rawBin(4 * b));
  for (let it = 0, moved = true; moved && it < 30; it++) { moved = false;
    for (const [b, v] of wallBins) { const m = Math.max(v, (wallBins.get(b - 1) ?? -99) - 6, (wallBins.get(b + 1) ?? -99) - 6); if (m !== v) { wallBins.set(b, m); moved = true; } } }
  const binCrest = (x: number) => wallBins.get(Math.floor(x / 4)) ?? rawBin(x);
  const lim = (x: number) => (x < GX - 1 ? GZ + 2 : x < KX ? GZ - 1 : KZ - 3);   // the first row the range may not reach: the palace wall, the gate's eaves, Bukchon
  const onPad = (x: number, z: number) => x >= PAD.x0 && x < PAD.x1 && z >= PAD.z0 && z < PAD.z1;
  const BW = W / 2, CB = Math.floor(WALL.z / 2);                     // blocks across; the crest's block row (z 4–5)
  const onWall = (bx: number) => 2 * bx >= WALL.x0 && 2 * bx < WALL.x0 + 4 * WALL.modules;
  const blockFace = (bx: number, bz: number): number => {
    const x = 2 * bx, z = 2 * bz;
    if (onPad(x, z)) return PAD.h;
    const flank = 2 + 6 * Math.min(bx, BW - 1 - bx);
    const c = x >= PAD.x0 - 2 && x < PAD.x1 + 2 ? PAD.h : binCrest(x);
    if (bz === CB) return onWall(bx) ? c : Math.min(c, flank);
    if (bz < CB) return Math.max(2, Math.min(flank, c - 6 * (CB - bz)));
    const front = x < GX - 1 || x >= KX ? 2 + 6 * Math.floor((lim(x) - 1 - (z + 1)) / 2) : 99;   // judge r3: west of the gate and behind Bukchon the range falls 6 a block to its foot (no sheer wall there; behind the gate the step is hidden)
    const rows = Math.max(1, Math.ceil((lim(x) - z) / 2) + (bz - CB)), t = (bz - CB) / rows;
    const v = c * (1 - Math.pow(t, 1.1)) + 5 * vnoise(x, z, 6, 71);
    return Math.max(2, Math.min(c, flank, front, q3(v)));
  };
  const blocks = new Map<string, number>();
  for (let bx = 0; bx < BW; bx++) for (let bz = 0; 2 * bz < GZ + 5; bz++) blocks.set(k2(bx, bz), blockFace(bx, bz));
  // no drop deeper than one 6-plate riser between neighbouring blocks: a lower block is raised toward its higher neighbour (the crest row
  // and the pad stay fixed); the drop at the range's foot behind the gate stays (it is hidden by the gate)
  for (let it = 0, moved = true; moved && it < 60; it++) { moved = false;
    for (const [key, h] of blocks) { const [bx, bz] = key.split(',').map(Number); if ((bz === CB && onWall(bx)) || onPad(2 * bx, 2 * bz)) continue; let m = h;
      for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const n = blocks.get(k2(bx + dx, bz + dz)); if (n !== undefined && n - 6 > m) m = n - 6; }
      if (m !== h) { blocks.set(key, m); moved = true; } } }
  // the gate's roofs overhang its base by up to four studs at the back: under them the range stays below the lower eave (a hidden step)
  const underEave = (x: number, z: number) => (x >= GX - 5 && x < GX + GATE.base[0] + 5 ? (z >= GZ - 5 ? GATE.lowerEave - 9 : z >= GZ - 7 ? GATE.upperEave - 10 : 99) : 99);
  const rangeH = (x: number, z: number): number | null => { if (!inIsland(x, z) || z >= lim(x)) return null; const h = blocks.get(k2(Math.floor(x / 2), Math.floor(z / 2))); return h === undefined ? null : Math.min(h, underEave(2 * Math.floor(x / 2), 2 * Math.floor(z / 2))); };
  const hill = (x: number, z: number) => rangeH(x, z) !== null;
  const used = new Set<string>();
  for (let x = 0; x < W; x++) for (let z = 0; z < GZ + 5; z++) if (onPad(x, z)) used.add(k2(x, z));
  // the City Wall along the crest, from the west shoulder over the peak to the saddle
  const wallCells = new Set<string>(); for (let x = WALL.x0; x < WALL.x0 + 4 * WALL.modules; x++) { used.add(k2(x, WALL.z)); wallCells.add(k2(x, WALL.z)); }
  cityWall(bp, WALL.x0, WALL.z, WALL.modules, (x, z) => G + (rangeH(x, z) ?? -99));
  // N Seoul Tower on the shoulder's pad
  bp.tag = 'tower'; bp.assembly('seoul_tower_s', TOWER.x - 3, G + PAD.h, TOWER.z - 3, 'White');
  // red pines on their seats, the uphill side bare
  const eaveLine = new Set<string>(); for (let x = GX - 3; x <= GX + 28; x++) for (let z = GZ - 6; z <= GZ + 16; z++) eaveLine.add(k2(x, z));   // a leaf lying downhill reaches 3 studs: none within 6 of the gate
  for (let x = 0; x < GX; x++) for (let z = GZ + 3; z <= GZ + 7; z++) eaveLine.add(k2(x, z));   // the palace wall's coping overhangs a stud each side
  const noCover = new Set<string>(); let turn = 0; const psites = new Sites(1);
  for (const [x, z, size] of PINES) {
    psites.add('pine', x, z, size === 'S' ? 3 : 2.5);
    for (let a = x - 3; a <= x + 2; a++) for (let b = z - 3; b <= z + 2; b++) (a >= x - 2 && a <= x + 1 && b >= z - 2 && b <= z + 1 ? used : noCover).add(k2(a, b));
    const h0 = rangeH(x - 1, z - 1) ?? 0;
    sonamu(bp, x, G + h0, z, size, undefined, 2 * turn++, uphillDirs(rangeH, x, z, h0), 'DarkGreen');
  }
  // granite: the summit above 62 plates and the steep faces (a riser of 6 or more toward the camera) in the upper range; pine wood elsewhere,
  // lighter Green in patches; the back face Dark Bluish Gray rock; the pad paved Light Bluish Gray
  const granite = (x: number, z: number) => { const h = rangeH(x, z) ?? 0; if (onPad(x, z)) return false;   // lead r6: outcrops, never a cap — ≤ 20 % of the face
    // r8 (Eric asked what the grey patches were — they read as random blocks): Bugaksan's bare granite only as a few rounded outcrops
    // clustered on the peak and on its steepest high faces; the lower range all wood
    if (h >= 62 && vnoise(x, z, 4, 89) > -0.1) return true;
    const f = rangeH(x, z + 1); return h >= 60 && f !== null && h - f >= 6 && vnoise(x, z, 5, 83) > 0.6; };   // lead r3: granite ≤ a quarter of the face, the rest pine wood
  const wood = (x: number, z: number) => vnoise(x, z, 6, 23) > -0.5;
  // lead r5 / judge r3 (every tread top a field of studs): tile patches in mixed greens on tread cells that no riser cover or plant can use —
  // no higher neighbour (so no cover stands there), not a seat, not the wall; marked used, so no scrub lands on a tile
  const GREENS = ['DarkGreen', 'Green', 'OliveGreen'];
  const greenTile = new Set<string>();
  for (let x = 1; x < W - 1; x++) for (let z = 1; z < GZ + 4; z++) { const h = rangeH(x, z); if (h === null || used.has(k2(x, z)) || noCover.has(k2(x, z)) || granite(x, z) || onPad(x, z)) continue;
    if ([[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dz]) => (rangeH(x + dx, z + dz) ?? -99) > h)) continue;
    if (patch(x, z, 2, 127) < 0.4) { greenTile.add(k2(x, z)); used.add(k2(x, z)); } }
  terrain(bp, {
    G, x0: 0, z0: 0, W, D: GZ + 5, used, tag: 'range', scrub: 0.5, canopy: 0.75, avoid: new Set([...wallCells, ...eaveLine]), noCover,   // judge r1: scrub and canopy thinned (a fringe of leaves on every lip read as noise)
    h: rangeH, round: granite,
    tread: (x, z) => (onPad(x, z) ? 'LightBluishGray' : granite(x, z) ? 'LightBluishGray' : greenTile.has(k2(x, z)) ? GREENS[Math.floor(patch(x, z, 2, 131) * 3)] : wood(x, z) ? 'DarkGreen' : 'Green'),
    tile: (x, z) => (onPad(x, z) && Math.max(Math.abs(x + 0.5 - TOWER.x), Math.abs(z + 0.5 - TOWER.z)) > 2) || greenTile.has(k2(x, z)),   // r5: the pad (bar the tower's 4 × 4 seat) and the tile patches smooth
    riser: (x, z) => (onPad(x, z) ? 'LightBluishGray' : wood(x, z) ? 'DarkGreen' : 'Green'),   // r8: no grey risers (tall grey faces read as blocks); granite is the rounded caps only
    scrubColor: (x, z) => (patch(x, z, 1, 31) < 0.7 ? 'DarkGreen' : 'Green'),
    core: () => 'DarkGreen',   // judge r1: the back face read as a bare grey cliff — wooded like the front   // a face deeper than the riser course shows wood or rock, not the grey core
  });
  for (const [x, z] of PINES) sites.add('pine', x, z, 2.5, 'range');

  // ---- Gwanghwamun: one assembly (retagged base / gate / roof by height and part, as ko-palace.ts r6), the tunnels floored White, the
  // palace wall out to the west edge, the guard on the square's west side
  bp.tag = 'gate'; const first = bp.parts.length;
  bp.assembly('ko_gwanghwamun', GX - 1, G, GZ - 1, 'LightBluishGray', 0, GATE_PRINTS);   // palace r9: the plaque's print map and the tags come from ko-palace.ts
  tagGate(bp.parts.slice(first), G);
  const tunnel = (i: number) => GATE.tunnels.some(([t, w]) => i >= t && i < t + w);
  for (let i = 0; i < GATE.base[0]; i++) for (let j = 0; j < GATE.base[1]; j++) (tunnel(i) ? white : studs).add(k2(GX + i, GZ + j));
  // the haechi pair: cut with Gwanghwamun r8 (ericf-1006--seoul-palace 79c5ece)
  bp.tag = 'palacewall'; for (const [x, n] of [[0, GX]]) {   // r9: the east side is Bukchon's own wall, two studs from the base
    copingWall(bp, x, GZ + 5, n, G); stand(x, GZ + 5, n, 2); }
  const GUARD = { x: 8, z: 33.5 };
  guard(bp, GUARD.x, G, GUARD.z, 0); stand(GUARD.x - 2, GUARD.z - 1.5, 4, 4);
  for (const x of [7, 17, 27]) sites.add('gate', GX + x, GZ + 7, 7, 'gate');
  sites.add('guard', GUARD.x, GUARD.z, 1, 'guard');

  // ---- the stage on the square, the idols on its deck windows and the two fans at the barrier
  for (const [x, z, w, d] of placeStageS(bp, SX, SZ, G)) stand(SX + x, SZ + z, w, d);
  for (const f of STAGE_S_IDOLS) idol(bp, SX + f.x, G + 3, SZ + f.z, 0, f.i);
  for (const f of STAGE_S_FANS) fan(bp, SX + f.x, G, SZ + f.z, 2, f.i, f.hand);
  for (const x of [5, 12, 19]) sites.add('stage', SX + x, SZ + 5, 4, 'stage');

  // ---- Bukchon in front of the range's east end (its ground from plate 6; the island lays the strata under it), the visitor at the alley's
  // foot facing the camera
  const dist = (x: number, z: number) => { const lx = x - KX, lz = z - KZ; if (lx < 0 || lx > 29 || lz < -3 || lz > 17) return null;
    if (lx <= 16) return lz <= 13 ? (lx <= 5 && lz >= 9 ? -2 : 0) : lz <= 15 ? -2 : null; if (lx <= 20) return Math.max(-2, alleyLevel(lz)); return lz <= 8 ? 0 : -2; };
  placeBukchon(bp, KX, KZ, C, 6, own, 'L', -2);
  hanbokVisitor(bp, VIS.x, G, VIS.z, 0); stand(VIS.x - 1, Math.floor(VIS.z) - 1, 2, 2);
  sites.add('hanok', KX + 9, KZ + 6, 6, 'bukchon'); sites.add('neighbour', KX + 26, KZ + 13, 4, 'bukchon'); sites.add('visitor', VIS.x, VIS.z, 1);
  // granite retaining walls where the district stands above the street or the plinth (Bukchon's terraces), as v1 r1
  bp.tag = 'alley';
  const masoned = new Set<string>();
  for (const [x, z0, z1] of [[16, 4, 14], [21, 4, 9], [21, 12, 18]]) for (let z = z0; z < z1; z++) masoned.add(k2(KX + x, KZ + z));
  for (const [dx, dz] of [[0, 1], [-1, 0], [1, 0], [0, -1]] as [number, number][]) {
    const fc = new Map<string, number>();
    for (const key of own) { const [x, z] = key.split(',').map(Number); const l = dist(x, z); if (l === null) continue; const nx = x + dx, nz = z + dz;
      if (dist(nx, nz) !== null || hill(nx, nz) || masoned.has(key)) continue;
      const out = !inIsland(nx, nz); if (!out && C + l - G < 3) continue; fc.set(key, (C + l) * 100 + (out ? 7 : G - 2)); }
    for (const key of fc.keys()) masoned.add(key);
    const along: [number, number] = dz ? [1, 0] : [0, 1];
    for (const [key, v] of fc) { const [x, z] = key.split(',').map(Number); const top = Math.floor(v / 100), low = v % 100;
      if (fc.get(k2(x - along[0], z - along[1])) === v) continue;
      let n = 1; while (fc.get(k2(x + along[0] * n, z + along[1] * n)) === v) n++;
      for (let i = 0; i < n; ) { const cx = x + along[0] * i, cz = z + along[1] * i, pair = i + 1 < n;
        for (let y = top - 4; y >= low; y -= 3) { bp.clear(cx, y, cz, pair ? along[0] + 1 : 1, 3, pair ? along[1] + 1 : 1); bp.part(pair ? 'brick_masonry_1x2' : 'brick_1x1', cx, y, cz, 'LightBluishGray', pair && along[1] ? 1 : 0); }
        i += pair ? 2 : 1; }
    }
  }

  // ---- the second ginkgo on the street west of Bukchon, its fallen fans on the paving's studs
  { const g = GINKGO2; sites.add('ginkgoM', g.x, g.z, 3.5); stand(g.x - 1, g.z - 1, 2, 2);
    const fall: [number, number][] = []; for (let x = g.x - 4; x <= g.x + 3; x++) for (let z = g.z - 3; z <= g.z + 3; z++) { const d = Math.hypot(x + 0.5 - g.x, z + 0.5 - g.z);
      if (d > 1.6 && d < 3.6 && (x * 7 + z * 3) % 4 === 0 && inIsland(x, z) && !hill(x, z) && dist(x, z) === null && !studs.has(k2(x, z)) && !white.has(k2(x, z))) fall.push([x, z]); }
    fall.forEach(([x, z]) => stand(x, z, 1, 1));
    ginkgo(bp, g.x, G, g.z, 'M', undefined, 1, undefined, fall); }

  // ---- street pieces on the square and the street (lead r3): lamps, a bench, two planters with a small pine
  bp.tag = 'street';
  for (const [x, z] of [[3, 29], [13, 47]] as [number, number][]) { sites.add('lamp', x + 0.5, z + 0.5, 1); bp.assembly('hg_lamp', x, G, z, 'LightBluishGray'); stand(x, z, 1, 1); }
  for (const [x, z] of [[2, 43], [64, 47]] as [number, number][]) { sites.add('bench', x + 2, z + 1, 2); bp.assembly('hg_bench', x, G, z, 'ReddishBrown', 0); stand(x, z, 4, 2); }
  let pt = 0; for (const [x, z] of [[13, 39], [59, 44]] as [number, number][]) { sites.add('planter', x, z, 2.5); bp.part('brick_2x2', x - 1, G, z - 1, 'DarkBluishGray'); stand(x - 1, z - 1, 2, 2); sonamu(bp, x, G + 3, z, 'XS', undefined, 2 * pt++); }
  bp.tag = '';

  // ---- the Han across the front; the chimaek pair on its own mat (ko_picnic) on the front-left lawn
  // r8 (Eric: the pair sat half over the water): the 8 × 6 mat on the lawn's deepest part (the bank bows south there, six lawn rows), a
  // bench and a lamp moved west to make room
  const MATX = 33;
  const han = placeHan(bp, { x0: 0, x1: W, z0: HZ, G, BASE, inIsland, floorOf }, own, sites, { mat: false, buoys: false, matX: MATX, matZ: HZ + 5, matW: 8, matD: 6, boatX: 42, lamps: [5, 18, 49, 70], benches: [22, 58], fleck: 'DarkBlue', fleckShare: 0.07, fleckStretch: 12 });   // lead r5: calm — a few thin long current lines   // judge r1: the boat stood in front of the picnic from the hero camera
  picnicPair(bp, MATX, G, HZ + 5, 0);

  // ---- ground: earth two bricks deep, a plate course at G − 1 — studded where something stands, under the range and the stage; the square,
  // the forecourt and the street a mosaic of Light Bluish Gray slabs (bakseok) laid by hand
  bp.tag = 'terrain';
  const pave = new Set<string>();
  for (let x = 0; x < W; x++) for (let z = 0; z < D; z++) {
    if (!inIsland(x, z)) continue; const f = floorOf(x, z);
    if (own.has(k2(x, z))) { if (dist(x, z) !== null) for (let y = f; y < 6; y++) bp.vox1('brick', x, y, z, earth(y)); continue; }
    for (let y = f; y < G - 1; y++) bp.vox1('brick', x, y, z, earth(y));
    if (hill(x, z)) bp.vox1('plate', x, G - 1, z, 'DarkBluishGray');
    else if (studs.has(k2(x, z))) bp.vox1('plate', x, G - 1, z, 'LightBluishGray');
    else if (!white.has(k2(x, z))) pave.add(k2(x, z));
  }
  for (const [i0, w] of GATE.tunnels) for (let i = i0; i < i0 + w; i += 2) { for (let j = 0; j + 4 <= GATE.base[1]; j += 4) bp.part('tile_2x4', GX + i, G - 1, GZ + j, 'White'); for (let j = GATE.base[1] - GATE.base[1] % 4; j < GATE.base[1]; j += 2) bp.part('tile_2x2', GX + i, G - 1, GZ + j, 'White'); }
  // judge r1 / lead r3 (the square read as one flat grey): bakseok in two greys, and the royal road on the gate's axis raised a plate —
  // Dark Bluish Gray slabs from the centre tunnel to the stage and on from the barrier to the cycle path, the centre tunnel's width
  const [ct, cw] = GATE.tunnels[1]; const axis = (x: number, z: number, w: number, d: number) => x >= GX + ct && x + w <= GX + ct + cw && z >= GZ + GATE.base[1] && z + d <= HZ;
  const SLABS: [string, number, number, number][] = [['tile_2x4', 2, 4, 0], ['tile_2x4', 4, 2, 1], ['tile_2x2', 2, 2, 0], ['tile_1x4', 1, 4, 0], ['tile_1x4', 4, 1, 1], ['tile_1x3', 1, 3, 0], ['tile_1x3', 3, 1, 1], ['tile_1x2', 1, 2, 0], ['tile_1x2', 2, 1, 1]];
  for (let z = 0; z < D; z++) for (let x = 0; x < W; x++) {
    if (!pave.has(k2(x, z))) continue;
    const fits = ([, w, d]: [string, number, number, number]) => { for (let i = 0; i < w; i++) for (let j = 0; j < d; j++) if (!pave.has(k2(x + i, z + j))) return false; return true; };
    // lead r5 (bakseok read as noise): slabs in courses two studs deep parallel to the gate — 4 × 2 slabs along x, every other course
    // starting with a 2 × 2 so the joints stagger; narrower slabs only where a course is interrupted
    const course = Math.floor(z / 2), lead = course % 2 === 1 && x % 4 === 0;
    const order = (lead ? [SLABS[2], SLABS[1]] : [SLABS[1], SLABS[2]]).concat([SLABS[4], SLABS[6], SLABS[8], SLABS[0], SLABS[3], SLABS[5], SLABS[7]]);
    const s = order.find(fits);
    if (!s) { bp.part('tile_1x1', x, G - 1, z, 'LightBluishGray'); pave.delete(k2(x, z)); continue; }
    const [key, w, d, rot] = s;
    if (axis(x, z, w, d)) { for (let i = 0; i < w; i++) for (let j = 0; j < d; j++) bp.vox1('plate', x + i, G - 1, z + j, 'LightBluishGray'); bp.part(key, x, G, z, 'DarkBluishGray', rot); }   // the royal road raised a plate
    else bp.part(key, x, G - 1, z, 'LightBluishGray', rot);   // Eric r7 (the floor read messy): one tone of large slabs in regular courses; only the royal road darker
    for (let i = 0; i < w; i++) for (let j = 0; j < d; j++) pave.delete(k2(x + i, z + j));
  }
  // the plinth: two bricks of stone one cell outside the outline, capped with tiles; along the river one brick lower
  bp.tag = 'plinth';
  for (let x = -1; x <= W; x++) for (let z = -1; z <= D; z++) {
    if (inIsland(x, z)) continue; const nb = [[1, 0], [-1, 0], [0, 1], [0, -1]].filter(([dx, dz]) => inIsland(x + dx, z + dz)); if (!nb.length) continue;
    const top = nb.every(([dx, dz]) => han.isRiver(x + dx, z + dz)) ? han.sideY - 1 : 6;
    for (let y = 0; y < top; y++) bp.vox1('brick', x, y, z, 'DarkBluishGray'); bp.vox1('tile', x, top, z, 'DarkBluishGray');
  }

  bp.tag = ''; bp.compact = true; bp.pack();
  return { id: 'seoul', title: 'South Korea', caption: 'Seoul', subtitle: 'Gwanghwamun · N Seoul Tower · Bukchon · Han River', size: [W, D], center: [W / 2, 16, D / 2 + 2], base: BASE, camera: { az: -0.32, el: 0.32, dist: 134 } };
}
