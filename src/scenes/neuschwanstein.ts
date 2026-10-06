// Germany · Neuschwanstein as a floating island (layout A, docs/countries/germany.md §1.6; first assembly 2026-10-05). 96 × 60.
// The crag fills the back: a plateau at 42 plates carrying the castle along its ridge, falling in a grey cliff to the valley at 12. On the
// right the Pöllat gorge cuts down to the valley between the crag and the east rock; the Marienbrücke spans it, the waterfall drops under it
// and a stream runs out of the gorge across the meadow to the Alpsee at the front-left. Scale rule: everything on the crag is castle scale,
// everything in the valley minifig scale (germany.md §1.5).
import { Blueprint } from '../core/builder';
import { patch, type SceneMeta } from './lib';
import { PARTS, footprint } from '../core/catalog';
import { neuschwanstein } from './de-castle';
import { farmhouse, maypole, carriage, marienbruecke } from './de-valley';
import { swan } from './prague-swan';
import { minifig2 } from './lib';
import { bench } from './prague-square';

export const NS = { W: 96, D: 60, BASE: 3, VG: 12, CT: 42, WS: 9 };   // island base · valley top · crag top (castle floor) · lake surface

/** island outline, drawn from the land: the crag's long back, the gorge mouth pinching the right side, the lake bay rounding the front-left */
const OUTLINE: [number, number][] = [[3, 6], [9, 1], [30, 0], [60, 1], [84, 0], [92, 2], [96, 8], [96, 31], [93, 37], [96, 45], [93, 56], [80, 60], [62, 59], [46, 60], [28, 60], [13, 58], [4, 51], [0, 41], [1, 24], [0, 14]];
const inPoly = (px: number, pz: number) => { let c = false; for (let a = 0, b = OUTLINE.length - 1; a < OUTLINE.length; b = a++) { const [xa, za] = OUTLINE[a], [xb, zb] = OUTLINE[b]; if ((za > pz) !== (zb > pz) && px < ((xb - xa) * (pz - za)) / (zb - za) + xa) c = !c; } return c; };
export const inIsland = (x: number, z: number) => inPoly(x + 0.5, z + 0.5);

export function buildNeuschwanstein(bp: Blueprint): SceneMeta {
  const { W, D, BASE, VG, CT, WS } = NS;
  bp.compact = true;
  const edgeDist = (x: number, z: number) => { for (let r = 1; r <= 3; r++) for (let dx = -r; dx <= r; dx++) for (let dz = -r; dz <= r; dz++) if (Math.max(Math.abs(dx), Math.abs(dz)) === r && !inIsland(x + dx, z + dz)) return r; return 9; };
  // ---- terrain heights (plates) -------------------------------------------------------------------------------------------------------
  const dRect = (x: number, z: number, x0: number, x1: number, z0: number, z1: number) => Math.hypot(Math.max(x0 - x, 0, x - x1), Math.max(z0 - z, 0, z - z1));
  // The crag (profile v3): a plateau that hugs the castle's front (the cliff drops right under the Palas, as it does); a band of bare rock —
  // one 9-plate riser clad in 75° slopes, two where a buttress runs lower — then forested ledges, 2 studs deep and 6 plates apart, each wide
  // enough for a row of spruces, down to the valley. The distance wanders a little so the rock band breaks into buttresses and gullies.
  const front = (x: number) => (x <= 36 ? 24 : 26);
  const dPlat = (x: number, z: number) => Math.hypot(Math.max(9 - x, 0, x - 80), Math.max(3 - z, 0, z - front(x)));
  // the retaining wall: under the curtain wall and the lower courtyard the castle stands on a sheer wall of grey ashlar, two risers tall,
  // the most characteristic stretch of the real south front (ns-marienbruecke-2024.jpg; judge r1)
  const masonry = (x: number, z: number) => x >= 48 && x <= 77 && z > front(x);
  const rockZone = (x: number, z: number) => !masonry(x, z) && patch(x, z, 5, 61) < 0.4;   // outcrops of bare rock; forest everywhere else, up to the walls
  const profile = (d0: number, x: number, z: number) => {
    if (d0 <= 0) return CT;
    if (masonry(x, z)) { if (d0 <= 1.5) return CT - 18; const d = d0 - 1.5 + (patch(x, z, 4, 41) - 0.5) * 1.4; return CT - 18 - 6 * Math.ceil(d / 2 - 0.01); }
    if (rockZone(x, z)) { if (d0 <= 2) return CT - 9; if (d0 <= 4) return CT - 18; }   // exact 2-stud treads, so 75° slopes clad them whole
    const top = rockZone(x, z) ? CT - 18 : CT; const d = d0 - (rockZone(x, z) ? 4 : 0) + (patch(x, z, 4, 41) - 0.5) * 1.4;
    return top - 6 * Math.ceil(d / 2 - 0.01);
  };
  const crag = (x: number, z: number) => profile(dPlat(x, z), x, z);
  const eastRock = (x: number, z: number) => profile(dRect(x, z, 90, 95, 3, 31), x, z);
  // the gorge head: rock at the crag's height behind the gorge, joining the crag and the east rock, its face at z 13; the fall drops in front of it at z 14
  const head = (x: number, z: number) => (x >= 81 && x <= 95 && z >= 2 && z <= 13 ? CT : VG);
  const gorge = (x: number, z: number) => x >= 84 && x <= 89 && z >= 14 && z <= 36;
  // the Marienbrücke's two lips, notched six plates so the arch's legs stand on them and its deck meets the path
  const lip = (x: number, z: number) => (x === 83 || x === 90) && z >= 15 && z <= 17;
  // the road: up the cliff face from the valley eastward, then north along the gorge edge to the gatehouse's gate
  const road = (x: number, z: number): number | undefined => {
    if (z >= 15 && z <= 18 && x >= 76 && x <= 83 && !lip(x, z)) return CT;   // the top: the gate, and the path on to the bridge
    if (z >= 32 && z <= 33 && x >= 48 && x <= 81) return VG + Math.round(((x - 48) / 33) * 18);
    if (x >= 80 && x <= 81 && z >= 19 && z <= 31) return VG + 18 + Math.round(((31 - z) / 13) * 12);
    return undefined;
  };
  const height = (x: number, z: number) => {
    if (lip(x, z)) return CT - 6;
    const r = road(x, z); if (r !== undefined) return r;
    if (gorge(x, z)) return VG;
    return Math.max(VG, crag(x, z), eastRock(x, z), head(x, z));
  };
  const H = new Map<string, number>(); const hk = (x: number, z: number) => `${x},${z}`;
  for (let x = 0; x < W; x++) for (let z = 0; z < D; z++) if (inIsland(x, z)) H.set(hk(x, z), height(x, z));
  const h = (x: number, z: number) => H.get(hk(x, z)) ?? 0;

  // ---- valley water: the Alpsee bay at the front-left and the stream from the gorge to it -----------------------------------------------
  const lake = (x: number, z: number) => ((x - 30) / 25) ** 2 + ((z - 50.5) / 7) ** 2 < 1 || ((x - 16) / 9) ** 2 + ((z - 51) / 6) ** 2 < 1;
  // the Pöllat: out of the fall's pool along the gorge floor, then across the meadow to the lake's east tip
  const STREAM: [number, number][] = [[86.5, 16], [86.5, 37], [81, 41], [72, 44], [62, 45], [55, 48]];
  const segDist = (px: number, pz: number) => { let best = 99; for (let i = 0; i + 1 < STREAM.length; i++) { const [ax, az] = STREAM[i], [bx, bz] = STREAM[i + 1]; const vx = bx - ax, vz = bz - az; const t = Math.max(0, Math.min(1, ((px - ax) * vx + (pz - az) * vz) / (vx * vx + vz * vz))); best = Math.min(best, Math.hypot(px - ax - t * vx, pz - az - t * vz)); } return best; };
  const pool = (x: number, z: number) => x >= 85 && x <= 88 && z >= 15 && z <= 18;
  const stream = (x: number, z: number) => pool(x, z) || !lake(x, z) && segDist(x + 0.5, z + 0.5) <= 1.4 && (z >= 16) && (!(x >= 81 && z <= 36) || gorge(x, z));

  // strata in whole brick layers counted so the valley's top brick (8..10, under the surface plate at 11) is one band
  const SWANS: [number, number][] = [[35, 51], [38, 52]];   // in front of the girl at the jetty's end
  const JETTY: [number, number][] = [[35, 44], [36, 44], [35, 48], [36, 48]];   // the jetty's four posts stand on the lake bed
  const FALL: [number, number][] = [[86, 15], [87, 15]];   // the lower fall stands on the pool's bed
  const STONES: [number, number][] = [[86, 24], [85, 30], [87, 34], [80, 41], [67, 44], [58, 46]];   // boulders in the stream, white water beside them
  const FOAM: [number, number][] = [[85, 16], [88, 16], [86, 17], [87, 17], [85, 18]];   // foam round the foot of the fall
  // the gravel lane from the farmhouse along the lake's north shore to the foot of the castle road
  const LANE: [number, number][] = [[8, 46], [12, 43], [22, 41.5], [34, 40], [44, 37.5], [49, 34.5]];
  const lane = (x: number, z: number) => { let best = 99; for (let i = 0; i + 1 < LANE.length; i++) { const [ax, az] = LANE[i], [bx, bz] = LANE[i + 1]; const vx = bx - ax, vz = bz - az; const t = Math.max(0, Math.min(1, ((x + 0.5 - ax) * vx + (z + 0.5 - az) * vz) / (vx * vx + vz * vz))); best = Math.min(best, Math.hypot(x + 0.5 - ax - t * vx, z + 0.5 - az - t * vz)); } return best <= 0.9; };
  const earth = (y: number) => (y < 5 ? 'DarkBluishGray' : y < 8 ? 'ReddishBrown' : 'MediumNougat');
  // rock in the band under the castle, soil on the forested ledges below it (21063: grey = cliff, dark tan = soil)
  const rockC = (x: number, y: number, z: number) => masonry(x, z) && y >= CT - 18 ? 'LightBluishGray' : (!rockZone(x, z) || y < CT - 18 ? (patch(x, z, 6, 13) < 0.25 ? 'DarkBluishGray' : 'DarkTan') : patch(x, z, 6, 13) < 0.35 ? 'LightBluishGray' : 'DarkBluishGray');   // colour patches by column, 6 wide, not per course: per-course patches broke the faces into 1×1 bricks
  const part75 = (x: number, y: number, z: number, r: number, c: string) => bp.part('slope75_2x1x3', x, y, z, c, r);
  bp.tag = 'terrain';
  const tops: { x: number; z: number; y: number; kind: string }[] = []; const slab: [number, number, number, string][] = [];
  /** lay cells of one layer as 1×N runs along `axis`, joints staggered row by row, never a lone 1×1 left at a run's end */
  const runs = (cells: { x: number; z: number; key: string; color: string }[], y: number, axis: 'x' | 'z') => {
    const rows = new Map<string, typeof cells>();
    for (const c of cells) { const rk = `${axis === 'x' ? c.z : c.x}|${c.key}|${c.color}`; (rows.get(rk) ?? rows.set(rk, []).get(rk)!).push(c); }
    for (const row of rows.values()) {
      row.sort((a, b) => (axis === 'x' ? a.x - b.x : a.z - b.z));
      let i = 0;
      while (i < row.length) {
        let j = i; while (j + 1 < row.length && (axis === 'x' ? row[j + 1].x - row[j].x : row[j + 1].z - row[j].z) === 1) j++;
        let r = j - i + 1, at = i; const odd = (axis === 'x' ? row[i].z : row[i].x) % 2 === 1;
        if (odd && r >= 5) { bp.part(`${row[at].key}_1x3`, row[at].x, y, row[at].z, row[at].color, axis === 'x' ? 1 : 0); at += 3; r -= 3; }
        while (r > 0) { const n = [8, 6, 4, 3, 2, 1].find((v) => v <= r && r - v !== 1)!; bp.part(`${row[at].key}_1x${n}`, row[at].x, y, row[at].z, row[at].color, axis === 'x' ? 1 : 0); at += n; r -= n; }
        i = j + 1;
      }
    }
  };
  for (let x = 0; x < W; x++) for (let z = 0; z < D; z++) {
    if (!inIsland(x, z)) continue;
    const f = edgeDist(x, z) <= 3 ? 0 : BASE; const t = h(x, z);
    if (lake(x, z) || stream(x, z)) {
      // water as Kyoto lays it (a coloured bed under light-blue tiles): the lake deep blue in the middle, azure toward the shore, an opaque
      // turquoise (Light Aqua) rim for the shallows; the stream over Medium Azure, one plate below the meadow
      const isLake = lake(x, z); const s = isLake ? WS : VG - 1;
      for (let y = f; y < s - 2; y++) bp.vox1('brick', x, y, z, earth(y));
      const rimCell = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dz]) => !lake(x + dx, z + dz));
      const deep = isLake && ((x - 30) / 20) ** 2 + ((z - 50.5) / 4.5) ** 2 < 1;
      const c = isLake && rimCell ? 'LightAqua' : 'TransLightBlue';
      bp.vox1('plate', x, s - 2, z, !isLake ? 'MediumAzure' : deep ? 'DarkBlue' : 'DarkAzure'); if (!JETTY.some(([a, b]) => a === x && b === z) && !FALL.some(([a, b]) => a === x && b === z)) bp.vox1(SWANS.some(([a, b]) => a === x && b === z) || FOAM.some(([a, b]) => a === x && b === z) || STONES.some(([a, b]) => a === x && b === z) ? 'plate' : 'tile', x, s - 1, z, c);
      continue;
    }
    // a shell, not a block: the top brick and plate everywhere, every cell that shows on a face, the island's rim; the inside stays hollow
    // and the top layers span it, held at the faces (rule 10: a solid crag would cost ten thousand bricks)
    const rim = edgeDist(x, z) <= 1;
    const nb = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]].map(([dx, dz]) => (inIsland(x + dx, z + dz) ? (lake(x + dx, z + dz) || stream(x + dx, z + dz) ? WS - 2 : h(x + dx, z + dz)) : 0));
    // a face column is solid from the floor, so it holds the hollow top layers beside it; a 1×1 pillar every 4 studs holds the crag's middle
    // only the plateau is hollow (a slab over a small pocket stacks into loose towers); its slab is laid below by our own runs, crossing the
    // runs of the surface above so the whole deck interlocks and hangs from the face columns round it
    const face = rim || t < CT - 3 || x > 82 || road(x, z) !== undefined || nb.some((n) => n < t - 4);
    const plat = t >= CT - 3 && x <= 82;   // the plateau's slab layer (t−4..t−2) is ours on every column, faces included, so it reaches the walls
    // the lake's and the stream's banks are stone where the water cuts the meadow (judge r1: a brown earth section showed round the lake)
    const bank = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dz]) => lake(x + dx, z + dz) || stream(x + dx, z + dz));
    const colorAt = (y: number) => (bank && y >= WS - 2 && y < VG ? (patch(x, z, 2, 113) < 0.5 ? 'LightBluishGray' : 'DarkBluishGray') : y < VG ? earth(y) : !(rim || nb.some((n) => n <= y)) ? 'DarkBluishGray' : rockC(x, y, z));
    if (plat) slab.push([x, z, t - 4, colorAt(t - 4) === colorAt(t - 3) && colorAt(t - 3) === colorAt(t - 2) ? colorAt(t - 4) : 'DarkBluishGray']);
    // only cells that show take the strata / rock colours; hidden ones are one grey so the packer can lay long bricks through them
    if (face) for (let y = f; y < (plat ? t - 4 : t - 1); y++) bp.vox1('brick', x, y, z, colorAt(y));
    tops.push({ x, z, y: t - 1, kind: road(x, z) !== undefined ? 'road' : t === VG && lane(x, z) ? 'lane' : t >= CT && x >= 9 && x <= 80 && z >= 3 && z <= 29 ? 'plateau' : t > VG ? 'slope' : 'meadow' });
  }
  // the plinth: two bricks of stone one cell outside the island, capped with tiles (series DNA)
  for (let x = -1; x <= W; x++) for (let z = -1; z <= D; z++) {
    if (inIsland(x, z)) continue; if (![[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dz]) => inIsland(x + dx, z + dz))) continue;
    for (let y = 0; y < 6; y++) bp.vox1('brick', x, y, z, 'DarkBluishGray'); bp.vox1('tile', x, 6, z, 'DarkBluishGray');
  }

  // ---- the castle on the plateau --------------------------------------------------------------------------------------------------------
  neuschwanstein(bp, 12, CT, 6);

  // ---- the gorge: the Marienbrücke over it, the fall under the bridge, foam in its pool ------------------------------------------------
  marienbruecke(bp, 83, CT - 6, 15);
  bp.tag = 'water';
  // the fall in two drops (marienbruecke-gorge.jpg): the upper ribbon of clear bricks down the head wall to a rock ledge at 25, white water on
  // the ledge, the lower ribbon one stud forward into a 4 × 4 pool; streaked light blue where the water thins
  const ribbon = (z: number, y0: number, y1: number) => { for (let yy = y0; yy < y1; yy += 3) for (const x of [86, 87]) bp.part('brick_1x1', x, yy, z, (yy / 3 + x) % 3 === 0 ? 'TransLightBlue' : 'TransClear'); };
  ribbon(14, VG, 24); for (const x of [86, 87]) bp.part('plate_1x1', x, 24, 14, 'TransClear'); ribbon(15, VG - 2, 25);
  bp.part('brick_2x2', 86, 25, 14, 'DarkBluishGray'); bp.part('roundplate_1x1', 86, 28, 15, 'White'); bp.part('roundplate_1x1', 87, 28, 15, 'White');
  ribbon(14, 28, CT - 2);
  for (const [fx, fz] of FOAM) bp.part('roundplate_1x1', fx, VG - 1, fz, 'White');

  // ---- the valley: the farmhouse with its maypole, the carriage at the foot of the castle road, swans on the Alpsee ------------------------
  farmhouse(bp, 2, VG, 34, 0);
  maypole(bp, 16, VG, 42);
  carriage(bp, 50, VG, 41, 1, 'LightBluishGray');
  // the waterfall's white water: foam on the pool, stones in the stream with a fleck of white beside each
  bp.tag = 'water';
  for (const [sx, sz] of STONES) { bp.part('roundplate_1x1', sx, VG - 1, sz, 'DarkBluishGray'); }
  bp.tag = 'pebbles';
  for (let x = 40; x < 90; x++) for (let z = 36; z < D; z++) {
    if (!inIsland(x, z) || stream(x, z) || lake(x, z) || h(x, z) !== VG || lane(x, z) || ![[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dz]) => stream(x + dx, z + dz))) continue;
    if ((x + 2 * z) % 3 !== 0 || bp.parts.some((p) => p.tag !== 'terrain' && p.tag !== 'pebbles' && p.y >= VG && Math.abs(p.x - x) < 4 && Math.abs(p.z - z) < 4)) continue;
    bp.part('roundtile_1x1', x, VG, z, (x + z) % 2 ? 'LightBluishGray' : 'DarkBluishGray');
  }
  // the jetty: four posts on the lake bed, a plank deck level with the shore, a rowing boat tied alongside
  bp.tag = 'jetty';
  for (const [jx, jz] of JETTY) bp.part('round_1x1', jx, WS - 1, jz, 'DarkBrown');
  bp.part('plate_2x4', 35, VG - 1, 44, 'ReddishBrown'); bp.part('plate_1x2', 35, VG - 1, 48, 'ReddishBrown', 1);
  bp.part('tile_2x2', 35, VG, 44, 'ReddishBrown'); bp.part('tile_1x2', 35, VG, 46, 'ReddishBrown', 1);   // the end rows keep their studs for the girl
  // a bench on the lakeshore, a woodpile against the farmhouse's east wall
  bench(bp, 39, VG, 42, 0);   // on the shore facing the lake (Eric: by the farmhouse it hung over the island's edge)
  bp.tag = 'woodpile'; for (const yy of [VG, VG + 3]) for (const wz of [36, 38]) bp.part('brick_log_1x2', 12, yy, wz, 'DarkBrown', 0);
  // pebbles and a few green reeds on the lake's rim
  bp.tag = 'shore';
  let nShore = 0;
  for (let x = 0; x < W; x++) for (let z = 40; z < D; z++) {
    if (!inIsland(x, z) || lake(x, z) || stream(x, z) || lane(x, z) || h(x, z) !== VG || ![[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dz]) => lake(x + dx, z + dz))) continue;
    if (Math.hypot(x - 36, z - 46) < 4 || Math.hypot(x - 58, z - 55) < 4 || bp.parts.some((p) => p.tag !== 'terrain' && p.y >= VG && Math.abs(p.x - x) < 3 && Math.abs(p.z - z) < 3)) continue;   // the girl and the photographer stand here later
    const r = patch(x, z, 1, 107);
    if (r < 0.12) { for (const [dx, dz] of [[0, 0], [1, 0], [0, 1]]) if (h(x + dx, z + dz) === VG && !lake(x + dx, z + dz) && !lane(x + dx, z + dz)) bp.part('roundtile_1x1', x + dx, VG, z + dz, dx + dz === 0 ? 'DarkBluishGray' : 'LightBluishGray'); nShore++; }   // stones in threes, not a dotted line (judge r2)
    else if (r > 0.9) { bp.part('roundplate_open', x, VG, z, 'Green'); bp.part('grass_stem', x, VG + 1, z, 'Green'); nShore++; }
  }
  bp.tag = 'cow'; bp.part('cow', 82, VG, 50, 'DarkTan', 1); for (const k of ['cow_fill', 'cow_saddle']) bp.part(k, 82, VG, 50, 'DarkTan', 1);   // a brick and a tile fill the saddle seat flush: a whole cow, not a ride (Eric)
  // valley spruces at minifig scale on the island's edges, framing the meadow without crowding the castle
  bp.tag = 'pines'; for (const [px, pz] of [[77, 56], [64, 57]] as [number, number][]) bp.part('pine_large', px, VG, pz, 'DarkGreen');
  bp.tag = 'swans'; for (const [sx, sz] of SWANS) swan(bp, sx, WS, sz, 0);
  bp.tag = 'girl'; minifig2(bp, 36, VG, 48, 0, { legs: 'DarkGreen', torso: 'White', face: 'face_smile', hair: 'Yellow', hairKey: 'hair_long', hold: [{ key: 'baguette', color: 'Tan', hand: 'R' }] });
  bp.tag = 'photographer'; minifig2(bp, 58, VG, 55, 2, { legs: 'DarkBlue', torso: 'DarkRed', face: 'face_smile', hair: 'DarkBrown', hairKey: 'hair_short', hold: [{ key: 'camera', color: 'Black', hand: 'R' }] });
  bp.tag = 'coachman'; minifig2(bp, 63, VG, 42, 0, { legs: 'Black', torso: 'DarkGreen', face: 'face_smile', hair: 'DarkBrown', hairKey: 'hair_short' });   // judge r2 self-check: a whip (3L bar) stood in front of his face; he waits by his horses empty-handed

  // flowers in clusters of three (white, yellow, red) along both sides of the lane, never scattered (judge r1)
  bp.tag = 'flowers';
  const FLOWERS = ['White', 'Yellow', 'BrightRed'];
  for (let i = 0; i + 1 < LANE.length; i++) {
    const [ax, az] = LANE[i], [bx, bz] = LANE[i + 1]; const L = Math.hypot(bx - ax, bz - az); const nx = -(bz - az) / L, nz = (bx - ax) / L;
    for (let t = 3; t < L - 1; t += 6) {
      const side = (i + Math.round(t)) % 2 ? 1 : -1; const cx = Math.round(ax + (bx - ax) * t / L + nx * 2.2 * side), cz = Math.round(az + (bz - az) * t / L + nz * 2.2 * side);
      const cells: [number, number][] = [[cx, cz], [cx + 1, cz], [cx, cz + 1]];
      if (!cells.every(([x, z]) => inIsland(x, z) && h(x, z) === VG && !lake(x, z) && !stream(x, z) && !lane(x, z) && !bp.parts.some((p) => p.tag !== 'terrain' && p.y >= VG && Math.abs(p.x - x) < 3 && Math.abs(p.z - z) < 3))) continue;
      cells.forEach(([x, z], k) => bp.part('flower_1x1', x, VG, z, FLOWERS[(k + i) % 3]));
    }
  }
  // ---- the cliff: a 75° slope on every 2-stud tread under a 9-plate riser, a 45° slope under a 3-plate one --------------------------------
  bp.tag = 'rock';
  const clad = new Set<string>();
  // cells already taken by a model standing on the ground (the farmhouse at the crag's foot) take no cladding
  for (const p of bp.parts) { if (p.member || p.tag === 'terrain') continue; const d = PARTS[p.key]; if (!d) continue; const [fw, fd] = footprint(d, p.rot); for (let x = Math.floor(p.x); x < Math.ceil(p.x + fw); x++) for (let z = Math.floor(p.z); z < Math.ceil(p.z + fd); z++) clad.add(`${x},${z}`); }
  for (const { x, z, y, kind } of tops) {
    if (kind === 'road' || clad.has(`${x},${z}`)) continue;
    const t = y + 1;
    for (const [dx, dz, r] of [[0, 1, 0], [1, 0, 1], [0, -1, 2], [-1, 0, 3]] as [number, number, number][]) {
      const up = h(x - dx, z - dz) - t; if (up !== 9 && up !== 6) continue;
      if (up === 6 && patch(x, z, 5, 121) <= 0.55 && patch(x, z, 3, 127) < 0.5) continue;   // inside a stand of trees half the ledges stay flat for the trunks
      if (!inIsland(x + dx, z + dz) || h(x + dx, z + dz) !== t || clad.has(`${x + dx},${z + dz}`) || road(x + dx, z + dz) !== undefined || road(x - dx, z - dz) !== undefined) continue;
      const mx = Math.min(x, x + dx), mz = Math.min(z, z + dz);
      if (up === 9) part75(mx, t, mz, r, patch(x, z, 3, 29) < 0.3 ? 'LightBluishGray' : 'DarkBluishGray');
      else bp.part('slope65_2x1x2', mx, t, mz, patch(x, z, 3, 131) < 0.35 ? 'DarkBluishGray' : patch(x, z, 2, 137) < 0.5 ? 'DarkTan' : 'OliveGreen', r);   // 21063's earth: dark tan soil, olive grass, grey rock
      clad.add(`${x},${z}`); clad.add(`${x + dx},${z + dz}`); break;
    }
  }

  // ---- the crag forest: spruces at castle scale (a jagged 2×2 cone, a 1×1 cone on the taller ones) on the ledges the slopes left, never on
  // the plateau or the road
  bp.tag = 'forest';
  const trees: [number, number][] = [];
  const free = (x: number, z: number, t: number) => inIsland(x, z) && h(x, z) === t && !clad.has(`${x},${z}`) && road(x, z) === undefined && !gorge(x, z) && !lake(x, z) && !stream(x, z);
  for (const { x, z, y, kind } of tops) {
    if (kind !== 'slope') continue; const t = y + 1;
    if (![[0, 0], [1, 0], [0, 1], [1, 1]].every(([dx, dz]) => free(x + dx, z + dz, t))) continue;
    // stands of trees with bare slope between them (judge r1: one spruce per ledge read as a nursery)
    if (patch(x, z, 5, 121) > (x > 88 ? 0.45 : 0.68) || trees.some(([a, b]) => Math.hypot(a - x, b - z) < 2.3) || patch(x, z, 2, 47) < 0.12) continue;
    const c = patch(x, z, 4, 53) < 0.3 ? 'Green' : 'DarkGreen';
    // a mixed forest (Eric: the slope's trees were all one kind): jagged-cone spruces, a taller pyramid spruce where a 4 × 4 ledge allows,
    // low leafy shrubs of three greens between them
    const r = patch(x, z, 1, 151);
    const roomy = [-1, 0, 1, 2].every((dx) => [-1, 0, 1, 2].every((dz) => inIsland(x + dx, z + dz) && h(x + dx, z + dz) <= t && !clad.has(`${x + dx},${z + dz}`)));
    if (r < 0.22) { bp.part('roundplate_2x2', x, t, z, 'Green'); bp.part('roundplate_1x1', x, t + 1, z, 'BrightGreen'); bp.part('roundplate_1x1', x + 1, t + 1, z + 1, 'OliveGreen'); bp.part('flower_1x1', x + 1, t + 1, z, 'Green'); }
    else if (r > 0.82 && roomy) bp.part('pine_small', x, t, z, 'DarkGreen');
    else { bp.part('spruce_cone', x, t, z, c); if ((x + z) % 3 !== 0) bp.part('cone_1x1', x + 0.5, t + 9, z + 0.5, c); }
    trees.push([x, z]);
    for (const [dx, dz] of [[0, 0], [1, 0], [0, 1], [1, 1]]) clad.add(`${x + dx},${z + dz}`);
  }

  // ---- surfaces: studs exactly under what stands on them, smooth elsewhere ------------------------------------------------------------
  const studCells = new Set<string>();
  for (const p of bp.parts) { if (p.member) continue; const d = PARTS[p.key]; if (!d) continue; const [fw, fd] = footprint(d, p.rot); for (let x = Math.floor(p.x); x < Math.ceil(p.x + fw); x++) for (let z = Math.floor(p.z); z < Math.ceil(p.z + fd); z++) studCells.add(`${x},${z},${p.y}`); }
  bp.tag = 'terrain';
  for (const sy of [...new Set(slab.map((c) => c[2]))]) runs(slab.filter((c) => c[2] === sy).map(([x, z, , color]) => ({ x, z, key: 'brick', color })), sy, 'z');
  const deck = new Map<number, { x: number; z: number; key: string; color: string }[]>();
  for (const { x, z, y, kind } of tops) {
    const studs = studCells.has(`${x},${z},${y + 1}`);
    const steep = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dz]) => h(x + dx, z + dz) <= y - 5);
    const c = kind === 'lane' ? (patch(x, z, 2, 91) < 0.3 ? 'DarkTan' : 'Tan') : kind === 'road' ? 'LightBluishGray' : kind === 'plateau' ? 'LightBluishGray'
      : kind === 'slope' ? (steep && rockZone(x, z) && y >= CT - 19 ? rockC(x, y, z) : patch(x, z, 2, 17) < 0.5 ? 'OliveGreen' : 'Green')
      : 'Green';   // one green (judge r2: two greens read as a checkerboard); Olive renders khaki and read as paths
    const k = studs || (kind !== 'road' && kind !== 'lane') ? 'plate' : 'tile';   // the plateau deck is all plates: one kind and colour per row keeps its runs long, and long runs are what hold the hollow slab
    if (kind === 'plateau') (deck.get(y) ?? deck.set(y, []).get(y)!).push({ x, z, key: k, color: c }); else bp.vox1(k, x, y, z, c);
  }
  for (const [dy, cells] of deck) runs(cells, dy, 'x');
  // over the deck: the castle's courtyards paved in smooth stone, the ledges round the walls in grass (the deck below stays one colour so
  // its runs hold the hollow slab)
  const court = (x: number, z: number) => x >= 36 && x <= 65 && z >= 8 && z <= 24;   // the upper and lower courtyards
  const pave: { x: number; z: number; key: string; color: string }[] = [];
  // the hollow insides of the buildings get no paving (nobody sees it; part cap 10,000)
  const INSIDE: [number, number, number, number][] = [[0, 23, 6, 15], [26, 35, 2, 7], [41, 53, 1, 6], [26, 39, 13, 19], [37, 40, 2, 5], [54, 62, 3, 18]];
  const inside = (x: number, z: number) => INSIDE.some(([a, b, c, d]) => x - 12 > a && x - 12 < b && z - 6 > c && z - 6 < d);
  for (const { x, z, y, kind } of tops) {
    if (kind !== 'plateau' || studCells.has(`${x},${z},${y + 1}`) || inside(x, z)) continue;
    pave.push({ x, z, key: court(x, z) ? 'tile' : 'plate', color: court(x, z) ? ((x + z) % 9 === 0 ? 'DarkBluishGray' : 'LightBluishGray') : patch(x, z, 3, 83) < 0.4 ? 'OliveGreen' : 'Green' });
  }
  runs(pave, CT, 'z');
  // trees on the plateau's grass round the walls (Eric: the back read bare): spruces and shrubs, only on the margins behind and beside the buildings (their hollow interiors are deck too)
  bp.tag = 'forest';
  const grass = new Set(pave.filter((c) => c.key === 'plate').map((c) => `${c.x},${c.z}`)); const topTrees: [number, number][] = [];
  for (const { x, z } of pave) {
    if (![[0, 0], [1, 0], [0, 1], [1, 1]].every(([dx, dz]) => grass.has(`${x + dx},${z + dz}`))) continue;
    if (!(z <= 5 || x <= 8 || x >= 79) || patch(x, z, 4, 161) > 0.6 || topTrees.some(([a, b]) => Math.hypot(a - x, b - z) < 3)) continue;
    const r = patch(x, z, 1, 163);
    if (r < 0.3) { bp.part('roundplate_2x2', x, CT + 1, z, 'Green'); bp.part('roundplate_1x1', x, CT + 2, z, 'BrightGreen'); bp.part('flower_1x1', x + 1, CT + 2, z + 1, 'OliveGreen'); }
    else { const c = r < 0.6 ? 'Green' : 'DarkGreen'; bp.part('spruce_cone', x, CT + 1, z, c); if (r > 0.75) bp.part('cone_1x1', x + 0.5, CT + 10, z + 0.5, c); }
    topTrees.push([x, z]); for (const [dx, dz] of [[0, 0], [1, 0], [0, 1], [1, 1]]) grass.delete(`${x + dx},${z + dz}`);
  }
  bp.tag = ''; bp.pack();
  return { id: 'neuschwanstein', title: 'Neuschwanstein', caption: 'Neuschwanstein', subtitle: 'the castle on its crag · the Pöllat gorge · the Alpsee', size: [W, D], center: [W / 2, 30, D / 2], base: BASE, camera: { az: 0.15, el: 0.36, dist: 150 }, viewDist: 150 };
}
