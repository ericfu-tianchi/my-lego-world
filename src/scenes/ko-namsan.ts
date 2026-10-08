// Seoul element test scene: N Seoul Tower on Namsan, the red pine, the City Wall and Bugaksan (docs/refs/seoul-namsan/SCHEME.md, BUILD.md).
// ?scene=ko-namsan&noglobe ; ?only=tower | namsan | pine | wall | bugaksan | scrub
// Heights are plates above the ground G the element stands on (the island surface; here the test plate's top). Both hills are solid
// terraces (LA lesson, docs/refs/la-hollywood-sign/BUILD.md): Dark Bluish Gray core, a riser course and a top plate in the zone colour,
// every riser that has room carries a slope facing downhill, scrub on the lips.
import { Blueprint } from '../core/builder';
import { patch, sonamu, Sites, type SceneMeta } from './lib';

/** smooth value noise in [−1, 1]: bilinear between lattice points `s` studs apart (as la-sign.ts) */
function vnoise(x: number, z: number, s: number, seed: number) {
  const fx = x / s, fz = z / s, x0 = Math.floor(fx), z0 = Math.floor(fz), tx = fx - x0, tz = fz - z0; const q = (a: number, b: number) => patch(a, b, 1, seed) * 2 - 1;
  const sx = tx * tx * (3 - 2 * tx), sz = tz * tz * (3 - 2 * tz);
  return (q(x0, z0) * (1 - sx) + q(x0 + 1, z0) * sx) * (1 - sz) + (q(x0, z0 + 1) * (1 - sx) + q(x0 + 1, z0 + 1) * sx) * sz;
}
const k2 = (x: number, z: number) => x + ',' + z;
const DIRV: [number, number][] = [[0, -1], [-1, 0], [0, 1], [1, 0]];   // tree() Dir: 0 −z, 1 −x, 2 +z, 3 +x
/** the sides of a pine at axis point (wx, wz) (world grid corner) on ground h0 where the ground rises a tread or more within its crown's reach:
 *  they are left bare (`skip`), so a pine on a hillside crowns downhill */
export const uphillDirs = (H: (x: number, z: number) => number | null, wx: number, wz: number, h0: number) => DIRV.flatMap(([dx, dz], d) => {
  for (let k = 1; k <= 4; k++) for (const s of [-1, 0, 1]) { const hh = H(Math.floor(wx - 0.5 + dx * (k + 0.5) + dz * s), Math.floor(wz - 0.5 + dz * (k + 0.5) + dx * s)); if (hh !== null && hh - h0 >= 3) return [d as 0 | 1 | 2 | 3]; }
  return []; });

// ---- the shared City Wall (Hanyangdoseong), SCHEME §4 --------------------------------------------------------------------------------
/** City Wall modules along +x from (x0, z), 4 studs long and 1 thick, 7 plates tall, outer face toward +z (south): a Light Bluish Gray
 *  masonry 1 × 4 body (3 plates), a merlon of brick · headlight brick (the gun hole, recess outward) · brick, capped by a Dark Bluish Gray
 *  1 × 3 tile, and a 1-stud gap floored with a tile. `treadOf(x, z)` = the absolute plate top of the ground under a cell; each module needs
 *  its four cells level (throws otherwise), so the ground under a wall is quantised in 4-stud bins. Tag 'wall'. 6 parts per module. */
export function cityWall(bp: Blueprint, x0: number, z: number, modules: number, treadOf: (x: number, z: number) => number) {
  const prev = bp.tag; bp.tag = 'wall';
  for (let m = 0; m < modules; m++) {
    const x = x0 + 4 * m; const y = treadOf(x, z);
    for (let k = 1; k < 4; k++) if (treadOf(x + k, z) !== y) throw new Error(`cityWall: module ${m} at x ${x} is not level (${y} vs ${treadOf(x + k, z)} at x ${x + k})`);
    bp.part('brick_masonry_1x4', x, y, z, 'LightBluishGray');
    bp.part('brick_1x1', x, y + 3, z, 'LightBluishGray'); bp.part('brick_headlight', x + 1, y + 3, z, 'LightBluishGray'); bp.part('brick_1x1', x + 2, y + 3, z, 'LightBluishGray');
    bp.part('tile_1x3', x, y + 6, z, 'DarkBluishGray', 1); bp.part('tile_1x1', x + 3, y + 3, z, 'LightBluishGray');
  }
  bp.tag = prev;
}

// ---- terraced hill grammar (shared by Namsan and Bugaksan) -------------------------------------------------------------------------------
export interface Terrain {
  G: number; x0: number; z0: number; W: number; D: number;
  h: (x: number, z: number) => number | null;            // local cell → plates above G (null: not hill)
  tread: (x: number, z: number) => string;               // top plate colour
  riser: (x: number, z: number) => string;               // the course under it (and the slope covering a riser that faces out of this cell)
  tile?: (x: number, z: number) => boolean;              // finish the top with a tile (paving)
  used: Set<string>;                                     // cells claimed by landmarks, pines, the wall (world cells)
  tag: string; scrub: number;                            // scrub density (1 = LA's sample)
  noCover?: Set<string>;                                 // cells that take no riser cover
  avoid?: Set<string>;                                   // cells a canopy leaf may not reach over (the wall)
  canopy?: number;                                       // share of slope backs that carry a 4 × 3 leaf lying down the slope (low wood canopy)
  scrubColor?: (x: number, z: number) => string;
  round?: (x: number, z: number) => boolean;              // granite: a 3-plate riser is covered by a plate + curved slope (a rounded dome), not a 45°
  core?: (x: number, z: number) => string;                // the column under the riser course (default Dark Bluish Gray; Seoul v2's range shows its cliffs)
}
/** columns, riser covers and scrub. Returns the cells whose riser cover carries scrub on its back (slope backs). */
export function terrain(bp: Blueprint, t: Terrain) {
  const { G, x0, z0, W, D, used } = t; const H = (x: number, z: number) => (x < x0 || z < z0 || x >= x0 + W || z >= z0 + D ? null : t.h(x - x0, z - z0));
  const top = (x: number, z: number) => G + (H(x, z) ?? 0);
  bp.tag = t.tag;
  for (let x = x0; x < x0 + W; x++) for (let z = z0; z < z0 + D; z++) {
    const hh = H(x, z); if (hh === null) continue; const tp = G + hh;
    for (let y = G; y < tp - 1; y++) bp.vox1('brick', x, y, z, y >= tp - 4 ? t.riser(x, z) : t.core?.(x, z) ?? 'DarkBluishGray');
    bp.vox1(t.tile?.(x, z) ? 'tile' : 'plate', x, tp - 1, z, t.tread(x, z));
  }
  // riser covers, every direction: on the lower tread against a riser of 2 (curved 2 × 1), 3 (33° 3 × 1 where the tread is 3 deep, else
  // 45° 2 × 1) or 6 plates (65° 2 × 1 × 2); a 1-deep tread keeps its bare riser course (granite steps on the steep faces)
  const coverTop = new Map<string, number>();   // cell → top of the riser cover standing on it (plates above G)
  const backs = new Set<string>(); const downhill = new Map<string, number>();   // back cell → the leaf rot that fans down its slope
  for (const [dx, dz, rot] of [[0, 1, 0], [1, 0, 1], [-1, 0, 3], [0, -1, 2]] as [number, number, number][]) {
    for (let z = z0; z < z0 + D; z++) for (let x = x0; x < x0 + W; x++) {
      const hx = x - dx, hz = z - dz; const hc = H(x, z), hb = H(hx, hz);
      if (hc === null || hb === null || used.has(k2(x, z)) || t.noCover?.has(k2(x, z))) continue;
      const d = hb - hc; if (d !== 2 && d !== 3 && d !== 6) continue;
      const cells = (n: number) => { const out: [number, number][] = []; for (let k = 0; k < n; k++) { const cx = x + dx * k, cz = z + dz * k; if (H(cx, cz) !== hc || used.has(k2(cx, cz))) return null; out.push([cx, cz]); } return out; };
      const n = d === 3 && cells(3) ? 3 : 2; const cs = cells(n); if (!cs) continue;
      if (patch(x, z, 1, 61) > 0.9) continue;                                 // ≈ 1 in 10 risers left bare: a terrace read, not a ramp
      const key = d === 2 ? 'curve_1x2' : d === 6 ? 'slope65_2x1x2' : n === 3 ? 'slope_1x3' : 'slope_1x2';
      const mx = Math.min(...cs.map((c) => c[0])), mz = Math.min(...cs.map((c) => c[1]));
      const dome = (d === 3 || d === 6) && t.round?.(hx, hz);   // a curved slope has no stud row: nothing grows on its back
      if (dome) { const c = t.riser(hx, hz), r1 = dx ? 1 : 0; let y = top(x, z);   // granite: a rounded dome — (a brick,) a plate, a curved slope on top
        if (d === 6) { bp.part(`brick_1x${n}`, mx, y, mz, c, r1); y += 3; }
        bp.part(`plate_1x${n}`, mx, y, mz, c, r1); bp.part(n === 3 ? 'curve_1x3' : 'curve_1x2', mx, y + 1, mz, c, rot); }
      else bp.part(key, mx, top(x, z), mz, t.riser(hx, hz), rot);
      for (const [cx, cz] of cs) { used.add(k2(cx, cz)); coverTop.set(k2(cx, cz), hc + d); } if (d === 3 && !dome) { backs.add(k2(x, z)); downhill.set(k2(x, z), dz === 1 ? 0 : dx === 1 ? 3 : dx === -1 ? 1 : 2); }   // leaf rot 0 fans +z, 1 −x, 2 −z, 3 +x
    }
  }
  // scrub: Dark Green / Olive Green 3-leaf plates on lips and slope backs, each turned so its leaves reach only toward ground no higher;
  // a 4 × 3 leaf lying downhill on some lips (LA chaparral, in Korean greens)
  // low canopy (lead r5: the slopes must read as wood): on a share of the slope backs a 3-leaf plate and a 4 × 3 leaf lying down the slope
  bp.tag = 'scrub';
  // low canopy (lead r5: the slopes must read as wood): a 3-leaf plate and a 4 × 3 leaf lying downhill, on slope backs and on the lips of
  // bare treads (it hangs over the riser below), wherever its footprint (4 downhill, ±2 across) has no higher ground and no wall
  const FANV = [[0, 1], [-1, 0], [0, -1], [1, 0]];   // leaf rot 0 fans +z, 1 −x, 2 −z, 3 +x
  const room = (x: number, z: number, r: number, hc: number) => { const [fx, fz] = FANV[r];   // hc: the level the leaf lies on
    for (let k = 0; k <= 3; k++) for (let sd = -1; sd <= 1; sd++) { const cx = x + fx * k + fz * sd, cz = z + fz * k + fx * sd; if (cx === x && cz === z) continue; const c = k2(cx, cz);
      const hh = coverTop.get(c) ?? H(cx, cz); if ((hh !== null && hh > hc) || t.avoid?.has(c) || (used.has(c) && !coverTop.has(c))) return false; }
    return true; };
  const leaf = (x: number, y: number, z: number, r: number) => { bp.part('plant_3leaves', x, y, z, 'DarkGreen', r); bp.part('leaves_4x3', x, y + 1, z, patch(x, z, 1, 71) < 0.7 ? 'DarkGreen' : 'Green', r); };
  if (t.canopy) {
    for (const [key, r] of downhill) { const [x, z] = key.split(',').map(Number); if (patch(x, z, 1, 67) >= t.canopy || !room(x, z, r, (H(x, z) ?? 0) + 3)) continue; leaf(x, top(x, z) + 3, z, r); backs.delete(key); }
    for (let z = z0 + 1; z < z0 + D - 1; z++) for (let x = x0 + 1; x < x0 + W - 1; x++) {
      const hc = H(x, z); if (hc === null || used.has(k2(x, z)) || patch(x, z, 1, 79) >= t.canopy) continue;
      const r = [0, 3, 1, 2].find((q) => (H(x + FANV[q][0], z + FANV[q][1]) ?? 99) < hc && room(x, z, q, hc)); if (r === undefined) continue;
      leaf(x, top(x, z), z, r); used.add(k2(x, z));
    }
  }
  const eff = (x: number, z: number) => (H(x, z) ?? -99) + (backs.has(k2(x, z)) ? 3 : 0);
  for (let z = z0 + 1; z < z0 + D - 1; z++) for (let x = x0 + 1; x < x0 + W - 1; x++) {
    const hc = H(x, z); if (hc === null) continue; const back = backs.has(k2(x, z)); if (used.has(k2(x, z)) && !back) continue;
    const lip = back || [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([a, b]) => (H(x + a, z + b) ?? -99) < hc);
    const p = patch(x, z, 1, 29); if (!(p < (lip ? 0.45 : 0.08) * t.scrub)) continue;
    const low = (cx: number, cz: number) => H(cx, cz) !== null && eff(cx, cz) <= eff(x, z) && (!used.has(k2(cx, cz)) || backs.has(k2(cx, cz)));
    const rots = [0, 1, 3, 2].filter((r) => { const sx = r === 0 || r === 3 ? 1 : -1, sz = r <= 1 ? 1 : -1; return low(x + sx, z) && low(x, z + sz) && low(x + sx, z + sz); });
    if (!rots.length) continue;
    const y = top(x, z) + (back ? 3 : 0); const kind = patch(x, z, 1, 31); const r0 = rots[Math.floor(kind * 97) % rots.length];
    const c = t.scrubColor ? t.scrubColor(x, z) : kind < 0.7 ? 'DarkGreen' : 'Green';
    if (kind < 0.35 && rots.includes((r0 + 2) & 3)) { bp.part('plant_3leaves', x, y, z, c, r0); bp.part('plant_3leaves', x, y + 1, z, c === 'DarkGreen' ? 'Green' : 'DarkGreen', (r0 + 2) & 3); }
    else bp.part('plant_3leaves', x, y, z, c, r0);
    used.add(k2(x, z));
  }
  bp.tag = '';
}

// ---- Namsan, SCHEME §3 (r4, the lead 2026-10-06: taller, round-shouldered, a steeper rocky face toward the camera, a wood of small pines) ----
// Hill-local frame 32 × 22 (x west → east, z north → south). The summit plateau 12 × 10 at +20 (x 16..27, z 4..13) carries the tower, axis at
// (22, 9). Treads every 3 plates (+2 … +17) on a rounded dome: the west flank long (≈ 3 studs a tread), the south face toward the camera steep
// (≈ 1.3) with bare granite steps between the slopes, the north and east steeper still (6-plate drops with 65° slopes). The City Wall climbs the
// west spur along z 11 in four 4-stud bins (+5, +8, +11, +14), its top level with the summit.
export const NAMSAN = { W: 32, D: 22, top: 20, axis: [22, 9] as [number, number], plateau: [16, 28, 4, 14] as const, wallZ: 11, wallX: 0, wallModules: 4,
  pines: [[17, 18, 'S'], [24, 20, 'XS'], [30, 16, 'XS'], [10, 19, 'XS'], [8, 6, 'M'], [1, 3, 'XS'], [15, 2, 'XS'], [22, 1, 'XS'], [30, 9, 'XS']] as [number, number, 'XS' | 'S' | 'M'][] };   // axis points; each gets a level 2 × 2 seat
const SPUR = [5, 8, 11, 14];
function namsanFace(x: number, z: number): number | null {
  const [px0, px1, pz0, pz1] = NAMSAN.plateau;
  if (z >= NAMSAN.wallZ - 1 && z <= NAMSAN.wallZ + 1 && x >= 0 && x < px0) return SPUR[Math.floor(x / 4)];   // the wall's spur: level 4-stud bins
  const dx = x < px0 ? (px0 - x) / 2.9 : x >= px1 ? (x - px1 + 1) / 0.67 : 0;
  const dz = z < pz0 ? (pz0 - z) / 0.67 : z >= pz1 ? (z - pz1 + 1) / 1.33 : 0;
  let r = Math.hypot(dx, dz); if (r > 0) r += 0.4 * vnoise(x, z, 4, 17);
  if (r > 6.45) return null;
  return NAMSAN.top - 3 * Math.max(0, Math.min(6, Math.ceil(r - 1e-9)));
}
export function namsanH(x: number, z: number): number | null {
  for (const [px, pz] of NAMSAN.pines) if (x >= px - 1 && x <= px && z >= pz - 1 && z <= pz) return namsanFace(px - 1, pz - 1);
  return namsanFace(x, z);
}
/** Namsan with its tower, pines, scrub and the wall run, its local (0, 0) at world (ox, oz), standing on ground G. Returns the claimed cells. */
/** `dropPines`: indices into NAMSAN.pines the island leaves out (their seats stay level), where a neighbour stands within a crown's reach;
 *  `keepClear`: world cells ("x,z") no canopy leaf may reach over (a neighbour's eave line) */
export function namsan(bp: Blueprint, ox: number, oz: number, G: number, dropPines: number[] = [], keepClear: Set<string> = new Set()) {
  const { W, D, axis, plateau } = NAMSAN; const [px0, px1, pz0, pz1] = plateau; const used = new Set<string>();
  const L = (x: number, z: number) => [x - ox, z - oz] as const;
  const onPlat = (x: number, z: number) => { const [lx, lz] = L(x, z); return lx >= px0 && lx < px1 && lz >= pz0 && lz < pz1; };
  for (let x = ox; x < ox + W; x++) for (let z = oz; z < oz + D; z++) if (onPlat(x, z)) used.add(k2(x, z));
  // ---- tower on the plateau (plates under its ring, tiles elsewhere)
  const ax = ox + axis[0], az = oz + axis[1];
  bp.tag = 'tower'; bp.assembly('seoul_tower', ax - 4, G + NAMSAN.top, az - 4, 'White');
  // ---- the wall run on the spur
  const H = (x: number, z: number) => { const [lx, lz] = L(x, z); return lx < 0 || lz < 0 || lx >= W || lz >= D ? null : namsanH(lx, lz); };
  const wallCells = new Set<string>(); for (let x = ox; x < ox + NAMSAN.wallModules * 4; x++) { used.add(k2(x, oz + NAMSAN.wallZ)); wallCells.add(k2(x, oz + NAMSAN.wallZ)); }
  cityWall(bp, ox + NAMSAN.wallX, oz + NAMSAN.wallZ, NAMSAN.wallModules, (x, z) => G + (H(x, z) ?? -99));
  // ---- a wood of small red pines on their seats; Sites keeps crowns apart; the uphill side of each is bare (`skip`: a pine on a hillside
  // crowns downhill) and no riser cover stands under its pads
  const sites = new Sites(1); const R = { XS: 2.5, S: 3, M: 4 }; let turn = 0; const noCover = new Set<string>();
  for (const [x, z, size] of NAMSAN.pines.filter((_, i) => !dropPines.includes(i))) {
    sites.add('pine', x, z, R[size]);
    for (let a = x - 3; a <= x + 2; a++) for (let b = z - 3; b <= z + 2; b++) (a >= x - 2 && a <= x + 1 && b >= z - 2 && b <= z + 1 ? used : noCover).add(k2(ox + a, oz + b));   // the seat and a ring are taken; the next ring takes no riser cover (pads reach over it), but leaves may grow there
    const h0 = H(ox + x - 1, oz + z - 1) ?? 0;
    sonamu(bp, ox + x, G + h0, oz + z, size, undefined, 2 * turn++, uphillDirs(H, ox + x, oz + z, h0), 'DarkGreen');   // even turns: the flat top fans east–west
  }
  // ---- terrain: zones of Dark Green (pine wood) and Olive Green (lighter mixed wood) in 6-stud patches by column; granite (Light Bluish
  // Gray, a Dark Bluish Gray shadow course) on the north and east risers and in two small south outcrops; the plateau paved Light Bluish Gray
  const wood = (x: number, z: number) => vnoise(x, z, 6, 23) > -0.6;   // ≈ 5/6 Dark Green: a dark pine wood, lighter Green in patches
  // granite gathered on one rocky face toward the camera (lead r5: scattered grey bricks read as noise): the south face under the tower
  const steep = (x: number, z: number) => { const [lx, lz] = L(x, z); return lz >= pz1 - 1 && lx >= 18 && lx <= 27 && Math.hypot((lx - 22.5) / 5.5, (lz - 15) / 4) < 1; };
  const outcrop = (_x: number, _z: number) => false;
  const ring = (x: number, z: number) => Math.hypot(x + 0.5 - ax, z + 0.5 - az) < 4;
  const kerb = (x: number, z: number) => { const [lx, lz] = L(x, z); return lx === px0 || lx === px1 - 1 || lz === pz0 || lz === pz1 - 1; };
  terrain(bp, {
    G, x0: ox, z0: oz, W, D, used, tag: 'namsan', scrub: 1.8, canopy: 0.95, avoid: new Set([...wallCells, ...keepClear]), noCover,
    h: namsanH, round: (x, z) => steep(x, z) || outcrop(x, z),
    tread: (x, z) => (onPlat(x, z) ? (kerb(x, z) ? 'DarkBluishGray' : 'LightBluishGray') : wood(x, z) ? 'DarkGreen' : 'Green'),
    riser: (x, z) => (onPlat(x, z) ? 'LightBluishGray' : steep(x, z) ? (patch(x, z, 2, 53) < 0.35 ? 'DarkBluishGray' : 'LightBluishGray') : outcrop(x, z) ? 'LightBluishGray' : wood(x, z) ? 'DarkGreen' : 'Green'),
    scrubColor: (x, z) => (wood(x, z) ? (patch(x, z, 1, 37) < 0.7 ? 'Green' : 'DarkGreen') : 'DarkGreen'),   // Olive Green rendered khaki-yellow (r1): Green and Dark Green only
    tile: (x, z) => onPlat(x, z) && !ring(x, z),
  });
  // two Dark Red maple shrubs, the one autumn accent (korea.md §1.6)
  bp.tag = 'scrub';
  for (const [lx, lz] of [[14, 15], [24, 20]]) { let done = false;
    for (let r = 0; r < 4 && !done; r++) for (let a = lx - r; a <= lx + r && !done; a++) for (let b = lz - r; b <= lz + r && !done; b++) {
      const x = ox + a, z = oz + b; const hc = H(x, z); if (hc === null || used.has(k2(x, z))) continue;
      if ([-1, 0, 1].some((i) => [-1, 0, 1].some((j) => (H(x + i, z + j) ?? 99) > hc || used.has(k2(x + i, z + j)) && (i || j)))) continue;   // its leaves reach a stud round: level, free ground only
      bp.part('roundplate_1x1', x, G + hc, z, 'DarkRed'); bp.part('plant_3leaves', x, G + hc + 1, z, 'DarkRed', a & 3); used.add(k2(x, z)); done = true; }
  }
  bp.tag = ''; return used;
}

// ---- Bugaksan, SCHEME §5 ---------------------------------------------------------------------------------------------------------
// Back-rim frame 44 × 10 (x along the back edge, z 0 = the back edge, camera at +z), bulging to 13 deep behind the peak. Crest heights in
// 4-stud bins for the wall (11 modules along z 2): ends 17 / 26, the peak 44 on the gate's axis (x 20..23), a steep west flank and a long east shoulder (judge r1: the symmetric version read as a stepped pyramid). The front (south)
// face falls in 3-plate risers on 1-stud treads (≈ 60°), with 65° slopes where two risers meet; granite domes of Light Bluish Gray curved
// slopes break the pine-dark face; the back face drops in 6-plate steps, Dark Bluish Gray.
export const BUGAKSAN = { W: 44, D: 13, wallZ: 2, crest: [17, 20, 26, 32, 38, 44, 38, 29, 26, 26, 23], pines: [[5, 7, 'XS'], [13, 7, 'XS'], [30, 8, 'S'], [38, 7, 'XS'], [22, 10, 'XS']] as [number, number, 'XS' | 'S'][] };   // crest per 4-stud bin, plates above G; pine axis points (each gets a level 2 × 2 seat)
export function bugaksanH(x: number, z: number): number | null {
  for (const [px, pz] of BUGAKSAN.pines) if (x >= px - 3 && x <= px + 2 && z >= pz - 1 && z <= pz) return bugaksanFace(px - 1, pz - 1);   // a level bench 6 × 2 under each pine
  return bugaksanFace(x, z);
}
function bugaksanFace(x: number, z: number): number | null {
  const { W, wallZ, crest } = BUGAKSAN; if (x < 0 || x >= W) return null;
  const c = crest[Math.floor(x / 4)];
  const depth = 10 + (x >= 14 && x < 30 ? Math.round(3 * Math.cos(((x - 21.5) / 8) * (Math.PI / 2)) ** 2) : 0);   // bulge behind the peak
  if (z >= depth || z < 0) return null;
  if (z <= wallZ + 1 && z >= wallZ - 1) return c;                                  // crest walk: the wall's three rows are level per bin
  if (z < wallZ - 1) return c - 6 * (wallZ - 1 - z);                                 // back face: 6-plate steps
  const fall = (c - 2) / (depth - wallZ - 2);                                         // front face: from the crest down to +2 at the front row
  const v = c - fall * (z - wallZ - 1) + 3.2 * vnoise(x, z, 5, 71);   // judge r2: wider noise breaks the stair into masses
  const step = fall > 2.5 ? 6 : 3;   // lead r4: where the face is steep, 6-plate risers on 2-deep treads, so every riser takes a 65° or a granite dome (1-deep 3-plate stairs read as a ziggurat)
  return Math.max(2, Math.min(c, step * Math.round((v - 2) / step) + 2));
}
/** Bugaksan, its local (0, 0) at world (ox, oz) (the island's back edge), ground G. Returns the claimed cells. */
/** `dropPines`, `keepClear`: as namsan */
export function bugaksan(bp: Blueprint, ox: number, oz: number, G: number, dropPines: number[] = [], keepClear: Set<string> = new Set()) {
  const { W, D, wallZ, crest } = BUGAKSAN; const used = new Set<string>();
  const H = (x: number, z: number) => bugaksanH(x - ox, z - oz);
  const wallCells = new Set<string>(); for (let x = ox; x < ox + W; x++) { used.add(k2(x, oz + wallZ)); wallCells.add(k2(x, oz + wallZ)); }
  cityWall(bp, ox, oz + wallZ, crest.length, (x, z) => G + (H(x, z) ?? -99));
  // pines on their seats (smaller than Namsan's: forced perspective), the uphill (north) side bare — the face rises a tread per stud
  const sites = new Sites(1); let turn = 1;
  for (const [x, z, size] of BUGAKSAN.pines.filter((_, i) => !dropPines.includes(i))) {
    sites.add('pine', x, z, size === 'S' ? 3 : 2.5);
    for (let a = x - 4; a <= x + 3; a++) for (let b = z - 2; b <= z; b++) used.add(k2(ox + a, oz + b));   // the seat, and no riser cover under the pads (bare riser courses under the crown)
    const h0 = H(ox + x - 1, oz + z - 1) ?? 0;
    sonamu(bp, ox + x, G + h0, oz + z, size, undefined, 2 * turn++, uphillDirs(H, ox + x, oz + z, h0), 'DarkGreen');
  }
  const granite = (x: number, z: number) => { const lz = z - oz; return lz > wallZ + 1 && vnoise(x - ox, lz, 4, 83) > 0.3; };
  terrain(bp, {
    G, x0: ox, z0: oz, W, D, used, tag: 'bugaksan', scrub: 1.2, canopy: 0.4, avoid: new Set([...wallCells, ...keepClear]),
    h: bugaksanH, round: granite,
    tread: (x, z) => (z - oz < wallZ - 1 ? 'DarkBluishGray' : granite(x, z) ? 'LightBluishGray' : vnoise(x - ox, z - oz, 5, 89) > 0.25 ? 'Green' : 'DarkGreen'),
    riser: (x, z) => (z - oz < wallZ - 1 ? 'DarkBluishGray' : granite(x, z) ? (patch(x, z, 1, 97) < 0.2 ? 'DarkBluishGray' : 'LightBluishGray') : 'DarkGreen'),
    scrubColor: (x, z) => (patch(x, z, 1, 31) < 0.75 ? 'DarkGreen' : 'Green'),
  });
  return used;
}

/** the test scene: `parts` = 'both' (Bugaksan behind, Namsan in front), 'namsan' or 'bugaksan' alone (ko-namsan-hill, ko-bugaksan) */
export const buildKoNamsan = (parts: 'both' | 'namsan' | 'bugaksan' = 'both') => (bp: Blueprint): SceneMeta => {
  const W = parts === 'namsan' ? 34 : 46, D = parts === 'both' ? 40 : parts === 'namsan' ? 24 : 16, G = 1;
  bp.tag = 'ground'; for (let x = 0; x < W; x += 2) for (let z = 0; z < D; z += 8) bp.part('plate_2x8', x, 0, z, 'LightBluishGray');
  if (parts !== 'namsan') bugaksan(bp, 1, 1, G);
  if (parts !== 'bugaksan') namsan(bp, parts === 'namsan' ? 1 : 7, parts === 'namsan' ? 1 : 17, G);
  bp.compact = true; bp.pack();
  const id = parts === 'both' ? 'ko-namsan' : parts === 'namsan' ? 'ko-namsan-hill' : 'ko-bugaksan';
  return { id, title: parts === 'bugaksan' ? 'Bugaksan' : 'Namsan', caption: parts === 'bugaksan' ? 'Bugaksan and the City Wall' : 'N Seoul Tower', subtitle: 'test scene', size: [W, D], center: [W / 2, 30, D / 2], camera: { az: 0.3, el: 0.3, dist: 120 } };
};
