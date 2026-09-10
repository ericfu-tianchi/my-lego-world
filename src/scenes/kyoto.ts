// B · Kyoto — a floating garden island. Five-roof pagoda on a hill, torii, stepped taiko bridge over a koi pond,
// tea house with paper lanterns, karesansui garden, waterfall off the west cliff, sakura in bloom.
import { Blueprint } from '../core/builder';
import { Reserve, patch, minifig, sakura, maple, pine, bush, bamboo, stoneLantern, paperLantern, overhangPlate, spanPlates, type SceneMeta } from './lib';

export function buildKyoto(bp: Blueprint): SceneMeta {
  const W = 46, D = 38; const R = new Reserve();
  // ---- island shape: main ellipse + two lobes
  const inIsland = (x: number, z: number) => {
    if (x < 0 || z < 0 || x >= W || z >= D) return false; const cx = x + 0.5, cz = z + 0.5;
    const e = ((cx - 23) / 22) ** 2 + ((cz - 19) / 17.5) ** 2 < 1; const l1 = Math.hypot(cx - 8, cz - 26) < 8; const l2 = Math.hypot(cx - 38, cz - 10) < 9;
    return e || l1 || l2;
  };
  const edgeDist = (x: number, z: number) => { for (let r = 1; r <= 3; r++) for (let dx = -r; dx <= r; dx++) for (let dz = -r; dz <= r; dz++) if (Math.max(Math.abs(dx), Math.abs(dz)) === r && !inIsland(x + dx, z + dz)) return r; return 9; };
  const inHill = (x: number, z: number) => Math.hypot(x + 0.5 - 34, z + 0.5 - 11) < 10 && inIsland(x, z) && edgeDist(x, z) > 2;
  const inTerrace = (x: number, z: number) => edgeDist(x, z) <= 2 && z < 30 && !(x > 10 && x < 20 && z > 29); // lower rim except the front
  const inPond = (x: number, z: number) => ((x + 0.5 - 14) / 7) ** 2 + ((z + 0.5 - 25) / 4.5) ** 2 < 1;
  const inStream = (x: number, z: number) => x < 7 && z >= 22 && z <= 25 && !inPond(x, z) && inIsland(x, z);
  const isWater = (x: number, z: number) => inIsland(x, z) && (inPond(x, z) || inStream(x, z));
  const groundTop = (x: number, z: number) => (inHill(x, z) ? 13 : inTerrace(x, z) ? 7 : 10); // plate level ON WHICH things stand
  const grass = (x: number, z: number) => { const r = patch(x, z, 3, 7); return r < 0.22 ? 'Green' : r < 0.25 ? 'Lime' : 'BrightGreen'; };
  const earth = (x: number, z: number, y: number) => y < 3 ? 'DarkBluishGray' : y < 6 ? 'DarkBrown' : (patch(x, z, 4, y) < 0.18 ? 'MediumNougat' : 'ReddishBrown');

  // ---- terrain
  bp.tag = 'terrain';
  for (let x = 0; x < W; x++) for (let z = 0; z < D; z++) {
    if (!inIsland(x, z)) continue;
    if (isWater(x, z)) { const top = inStream(x, z) ? 5 : 7; for (let y = 0; y < top; y++) bp.vox1('brick', x, y, z, earth(x, z, y)); bp.vox1('plate', x, top, z, 'DarkAzure'); bp.vox1(patch(x, z, 1, 33) < 0.16 && inPond(x, z) ? 'plate' : 'tile', x, top + 1, z, 'TransLightBlue'); R.add(x, z, 1, 1); continue; }
    const gt = groundTop(x, z); for (let y = 0; y < gt - 1; y++) bp.vox1('brick', x, y, z, earth(x, z, y)); bp.vox1('plate', x, gt - 1, z, grass(x, z));
  }
  // waterfall: trans bricks from the table up to the stream lip, foam at the foot
  for (let z = 22; z <= 25; z++) for (let y = 0; y < 6; y++) bp.vox1('brick', -1, y, z, 'TransLightBlue');
  for (const [x, z] of [[-2, 22], [-2, 25], [-3, 23], [-3, 24], [-2, 27], [-4, 22]]) bp.part('roundplate_1x1', x, 0, z, 'White');
  bp.part('roundplate_1x1', -2, 0, 23, 'TransLightBlue'); bp.part('roundplate_1x1', -2, 0, 24, 'TransLightBlue');

  // ---- paths (tan tiles replace grass plates), stairs
  bp.tag = 'path';
  const tilePath = (x0: number, z0: number, w: number, d: number) => { for (let x = x0; x < x0 + w; x++) for (let z = z0; z < z0 + d; z++) { if (!inIsland(x, z) || isWater(x, z)) continue; const gt = groundTop(x, z); bp.vox1('tile', x, gt - 1, z, patch(x, z, 2, 11) < 0.25 ? 'DarkTan' : 'Tan'); R.add(x, z, 1, 1); } };
  tilePath(11, 31, 3, 5); tilePath(11, 15, 3, 4); tilePath(14, 16, 9, 2); tilePath(26, 16, 9, 2);
  for (const [x, n] of [[23, 1], [24, 2], [25, 3]] as [number, number][]) for (let z = 16; z < 18; z++) { for (let k = 0; k < n; k++) bp.vox1('plate', x, 10 + k, z, 'LightBluishGray'); R.add(x, z, 1, 1); }
  bp.part('round_1x1', 22, 10, 15, 'LightBluishGray'); bp.part('round_1x1', 22, 10, 18, 'LightBluishGray'); bp.part('roundtile_1x1', 22, 13, 15, 'DarkBluishGray'); bp.part('roundtile_1x1', 22, 13, 18, 'DarkBluishGray'); R.add(22, 15, 1, 4);

  // ---- torii (pillars x=12 & 16, z=33)
  bp.tag = 'torii'; const tz = 33, ty = 10;
  for (const px of [10, 14]) for (let k = 0; k < 3; k++) bp.part('round_1x1', px, ty + k * 3, tz, 'BrightRed');
  bp.part('plate_1x8', 8, ty + 9, tz, 'BrightRed', 1); // nuki x 8..15
  for (const px of [10, 14]) bp.part('round_1x1', px, ty + 10, tz, 'BrightRed'); bp.part('brick_1x1', 12, ty + 10, tz, 'BrightRed'); // gakuzuka
  bp.part('plate_1x8', 8, ty + 13, tz, 'Black', 1); bp.part('plate_1x6', 9, ty + 14, tz, 'BrightRed', 1); // kasagi + shimaki
  bp.part('cheese_1x1', 8, ty + 14, tz, 'Black', 1); bp.part('cheese_1x1', 15, ty + 14, tz, 'Black', 3);
  R.add(7, 32, 10, 3);

  // ---- stepped taiko bridge over the pond (x 13..15, z 19..30)
  bp.tag = 'bridge';
  for (let k = 0; k < 11; k++) { const z = 19 + k; const y = 10 + Math.min(k, 10 - k); bp.part('plate_2x3', 11, y, z, 'BrightRed', 1); const pz = k < 5 ? z : z + 1; if (k !== 5 && k % 2 === 0) { bp.part('roundplate_1x1', 11, y + 1, pz, 'DarkRed'); bp.part('roundplate_1x1', 13, y + 1, pz, 'DarkRed'); } R.add(11, z, 3, 2); }
  // note: plate_2x3 rot1 → footprint 3 (x) × 2 (z): row k covers z..z+1 and overlaps row k+1 by one row
  // ---- pagoda on the hill
  pagoda(bp, 34, 9, 13, R);

  // ---- tea house (west, ground level)
  teaHouse(bp, 8, 4, 10, R);

  // ---- karesansui (zen garden), front right
  bp.tag = 'zen'; const zx = 27, zz = 26, zw = 10, zd = 7;
  const rocks = new Reserve(); rocks.add(30, 28, 2, 2); rocks.add(32, 28, 2, 2); rocks.add(34, 30, 1, 1); rocks.add(29, 31, 1, 1);
  for (let x = zx; x < zx + zw; x++) for (let z = zz; z < zz + zd; z++) { if (!inIsland(x, z)) continue; bp.vox1('plate', x, 9, z, 'Tan'); R.add(x, z, 1, 1); if (rocks.has(x, z)) continue; const edge = x === zx || x === zx + zw - 1 || z === zz || z === zz + zd - 1; const rr = Math.hypot(x + 0.5 - 32, z + 0.5 - 29); if (edge) bp.vox1('plate', x, 10, z, 'DarkBluishGray'); else if (Math.abs(rr - 2.6) < 0.5 || Math.abs(rr - 4.2) < 0.5) bp.part('roundtile_1x1', x, 10, z, 'LightBluishGray'); else bp.vox1('tile', x, 10, z, 'Tan'); }
  bp.part('slope_2x2', 30, 10, 28, 'DarkBluishGray', 2); bp.part('dome_2x2', 32, 10, 28, 'DarkBluishGray'); bp.part('cheese_1x1', 31, 13, 29, 'LightBluishGray', 3); bp.part('roundplate_1x1', 34, 10, 30, 'Green'); bp.part('roundplate_1x1', 29, 10, 31, 'Green');
  for (const x of [zx, zx + 4]) bp.part('fence_1x4', x, 11, zz + zd - 1, 'ReddishBrown'); bp.part('fence_1x4', zx + zw - 1, 11, zz + 1, 'ReddishBrown', 1);

  // ---- trees
  const G = (x: number, z: number) => groundTop(x, z);
  sakura(bp, 5, G(5, 16), 16, 'M', R); sakura(bp, 4, G(4, 26), 26, 'L', R); sakura(bp, 45, G(45, 11), 11, 'M', R); sakura(bp, 22, G(22, 33), 33, 'S', R);
  maple(bp, 40, G(40, 24), 24, R); pine(bp, 23, G(23, 8), 8, R); pine(bp, 36, G(36, 19), 19, R); pine(bp, 3, G(3, 12), 12, R);
  bamboo(bp, 19, G, 4, [4, 5, 3, 4], R);
  sakura(bp, 30, G(30, 22), 22, 'M', R);
  for (const [x, z] of [[23, 26], [38, 27], [26, 31], [17, 12], [22, 9], [24, 29], [19, 30]] as [number, number][]) if (inIsland(x, z) && !R.has(x, z) && !R.has(x + 1, z + 1)) bush(bp, x, G(x, z), z, undefined, R);

  // ---- lanterns
  stoneLantern(bp, 8, G(8, 31), 31, R); stoneLantern(bp, 15, G(15, 31), 31, R); stoneLantern(bp, 24, G(24, 12), 12, R);

  // ---- fences: hill back edge, east rim
  bp.tag = 'fence';
  for (let x = 28; x < 40; x += 4) if ([0, 1, 2, 3].every((i) => inHill(x + i, 1))) { bp.part('fence_1x4', x, 13, 1, 'ReddishBrown'); R.add(x, 1, 4, 1); }

  // ---- people
  bp.tag = 'minifig';
  minifig(bp, 12.5, 16, 24.5, 0, { legs: 'DarkBlue', torso: 'BrightRed', hat: 'kasa' }, R);      // on the bridge crown
  minifig(bp, 15.5, 10, 30.5, 0, { legs: 'Black', torso: 'White', hair: 'Black' }, R);            // by the pond
  minifig(bp, 27.5, G(27, 34), 34.5, 3, { legs: 'DarkRed', torso: 'Yellow', hair: 'DarkOrange' }, R);
  minifig(bp, 14.5, 11, 10.5, 2, { legs: 'DarkTan', torso: 'DarkTurquoise', hair: 'ReddishBrown' }, R); // tea house veranda
  minifig(bp, 26.5, G(26, 20), 20.5, 0, { legs: 'DarkBluishGray', torso: 'Lavender', hair: 'Black' }, R);  // below the hill

  // ---- parasol by the tea house
  bp.tag = 'parasol'; bp.part('roundplate_2x2', 21, 10, 12, 'DarkBluishGray'); bp.part('round_1x1', 21, 11, 12, 'White'); bp.part('round_1x1', 21, 14, 12, 'White'); bp.part('dish_4x4', 19.5, 17, 10.5, 'BrightRed'); bp.part('roundplate_1x1', 21, 18, 12, 'BrightRed'); R.add(19, 10, 5, 5);

  // pond life: lily pads and koi on the transparent plates
  bp.tag = 'pond';
  for (let x = 7; x <= 21; x++) for (let z = 21; z <= 29; z++) if (inPond(x, z) && patch(x, z, 1, 33) < 0.16 && !(x >= 11 && x <= 13)) { const r = bp.rand(); if (r < 0.45) bp.part('roundplate_1x1', x, 9, z, bp.pick(['BrightGreen', 'Green'])); else if (r < 0.6) bp.part('flower_1x1', x, 9, z, bp.pick(['White', 'BrightPink'])); else if (r < 0.85) bp.part('fish', x, 9, z, bp.pick(['Orange', 'White', 'BrightRed']), Math.floor(bp.rand() * 4)); }
  // bank stones
  for (let x = 0; x < W; x++) for (let z = 0; z < D; z++) { if (!inIsland(x, z) || isWater(x, z) || R.has(x, z)) continue; const near = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dz]) => isWater(x + dx, z + dz)); if (near && bp.chance(0.5)) { bp.part(bp.chance(0.6) ? 'roundplate_1x1' : 'roundtile_1x1', x, groundTop(x, z), z, bp.chance(0.6) ? 'LightBluishGray' : 'DarkBluishGray'); R.add(x, z, 1, 1); } }

  // ---- ground cover on free grass
  bp.tag = 'ground';
  for (let x = 0; x < W; x++) for (let z = 0; z < D; z++) {
    if (!inIsland(x, z) || isWater(x, z) || R.has(x, z)) continue; const r = bp.rand(); const y = groundTop(x, z);
    if (r < 0.03) bp.part('flower_1x1', x, y, z, bp.pick(['White', 'Yellow', 'Lavender', 'BrightPink'])); else if (r < 0.055) bp.part('roundplate_1x1', x, y, z, bp.pick(['Green', 'DarkGreen', 'Lime'])); else if (r < 0.062) bp.part('roundtile_1x1', x, y, z, 'LightBluishGray');
  }
  bp.tag = ''; bp.pack();
  return { id: 'kyoto', title: 'Japan', caption: 'Kyoto', subtitle: 'Five-roof pagoda · torii · taiko bridge · sakura in bloom', size: [W, D], center: [W / 2, 11, D / 2], camera: { az: 0.62, el: 0.42, dist: 86 } };
}

/** Five-roof pagoda. cx, cz = centre stud line; y0 = plate level of the plinth. */
function pagoda(bp: Blueprint, cx: number, cz: number, y0: number, R: Reserve) {
  bp.tag = 'pagoda'; const tiers = [12, 10, 8, 6]; const ROOF = 'DarkTurquoise', BEAM = 'DarkRed', PILLAR = 'BrightRed';
  const plinth = 14; bp.fill('plate', cx - plinth / 2, y0, cz - plinth / 2, plinth, 1, plinth, 'LightBluishGray'); R.add(cx - 8, cz - 8, 16, 16);
  let y = y0 + 1;
  tiers.forEach((S, ti) => {
    const x0 = cx - S / 2, z0 = cz - S / 2;
    overhangPlate(bp, x0 - 1, z0 - 1, S + 2, S + 2, y, BEAM); // floor / walkway
    if (ti > 0) { // railing around the walkway on the floor plate's outer ring
      for (let i = 1; i + 4 <= S + 1; i += 4) { bp.part('fence_1x4', x0 - 1 + i, y + 1, z0 - 1, PILLAR); bp.part('fence_1x4', x0 - 1 + i, y + 1, z0 + S, PILLAR); bp.part('fence_1x4', x0 - 1, y + 1, z0 - 1 + i, PILLAR, 1); bp.part('fence_1x4', x0 + S, y + 1, z0 - 1 + i, PILLAR, 1); }
      for (const [x, z] of [[x0 - 1, z0 - 1], [x0 + S, z0 - 1], [x0 - 1, z0 + S], [x0 + S, z0 + S]]) bp.part('roundplate_1x1', x, y + 1, z, PILLAR);
    }
    const wy = y + 1; // walls
    const n = S >= 10 ? 3 : S >= 6 ? 1 : 0; const pil = new Set([0, S - 1]); for (let k = 1; k <= n; k++) pil.add(Math.round(k * (S - 1) / (n + 1)));
    for (let x = x0; x < x0 + S; x++) for (let z = z0; z < z0 + S; z++) {
      const edge = x === x0 || x === x0 + S - 1 || z === z0 || z === z0 + S - 1; if (!edge) continue;
      const isPil = (pil.has(x - x0) && (z === z0 || z === z0 + S - 1)) || (pil.has(z - z0) && (x === x0 || x === x0 + S - 1));
      if (isPil) { bp.part('round_1x1', x, wy, z, PILLAR); bp.part('roundplate_1x1', x, wy + 3, z, PILLAR); bp.part('roundplate_1x1', x, wy + 4, z, PILLAR); continue; }
      const door = ti === 0 && z === z0 + S - 1 && Math.abs(x + 0.5 - cx) < 1.6;
      for (let dy = 0; dy < 5; dy++) { let c = 'White'; if (door && dy < 3) c = 'DarkBrown'; else if (dy === 3) c = 'DarkBrown'; bp.vox1(dy < 3 ? 'brick' : 'plate', x, wy + dy, z, c); }
    }
    bp.fill('plate', x0 - 1, wy + 5, z0 - 1, S + 2, 1, S + 2, BEAM); // beam / bracket layer
    // roof: plate S+4, kicked corners, slope ring, convex corners, hidden fill
    const ry = wy + 6, Rw = S + 4, rx0 = cx - Rw / 2, rz0 = cz - Rw / 2;
    overhangPlate(bp, rx0, rz0, Rw, Rw, ry, ROOF);
    for (const [x, z, rot] of [[rx0, rz0, 0], [rx0 + Rw - 1, rz0, 0], [rx0, rz0 + Rw - 1, 2], [rx0 + Rw - 1, rz0 + Rw - 1, 2]] as [number, number, number][]) bp.part('cheese_1x1', x, ry + 1, z, ROOF, rot);
    for (let i = 3; i < Rw - 3; i++) { bp.part('slope_1x2', rx0 + i, ry + 1, rz0 + 1, ROOF, 2); bp.part('slope_1x2', rx0 + i, ry + 1, rz0 + Rw - 3, ROOF, 0); bp.part('slope_1x2', rx0 + 1, ry + 1, rz0 + i, ROOF, 3); bp.part('slope_1x2', rx0 + Rw - 3, ry + 1, rz0 + i, ROOF, 1); }
    bp.part('slope_corner_2x2', rx0 + Rw - 3, ry + 1, rz0 + Rw - 3, ROOF, 0); bp.part('slope_corner_2x2', rx0 + 1, ry + 1, rz0 + Rw - 3, ROOF, 1); bp.part('slope_corner_2x2', rx0 + 1, ry + 1, rz0 + 1, ROOF, 2); bp.part('slope_corner_2x2', rx0 + Rw - 3, ry + 1, rz0 + 1, ROOF, 3);
    const inner = Rw - 6; if (inner > 0) bp.fill('brick', rx0 + 3, ry + 1, rz0 + 3, inner, 3, inner, BEAM);
    y = ry + 4;
  });
  // cap: four 2x2 slopes meeting at the centre, then the sōrin finial
  bp.part('slope_2x2', cx - 2, y, cz - 2, ROOF, 2); bp.part('slope_2x2', cx, y, cz - 2, ROOF, 2); bp.part('slope_2x2', cx - 2, y, cz, ROOF, 0); bp.part('slope_2x2', cx, y, cz, ROOF, 0);
  const fy = y + 3; bp.part('roundplate_2x2', cx - 1, fy, cz - 1, 'PearlGold'); bp.part('cone_2x2', cx - 1, fy + 1, cz - 1, 'PearlGold'); bp.part('bar_3l', cx - 0.5, fy + 7, cz - 0.5, 'PearlGold');
  for (let k = 0; k < 3; k++) bp.part('roundplate_1x1', cx - 0.5, fy + 8 + k * 2, cz - 0.5, 'PearlGold'); bp.part('cone_1x1', cx - 0.5, fy + 13, cz - 0.5, 'PearlGold');
  bp.tag = '';
}

/** Tea house with engawa veranda, shoji front, grille-brick lattice windows, hipped roof and paper lanterns. */
function teaHouse(bp: Blueprint, x0: number, z0: number, y0: number, R: Reserve) {
  bp.tag = 'teahouse'; const w = 9, d = 8; // platform incl. 2-row veranda at the front (+z)
  bp.fill('plate', x0, y0, z0, w, 1, d, 'ReddishBrown'); R.add(x0 - 1, z0 - 1, w + 2, d + 2);
  const hx0 = x0 + 1, hz0 = z0, hw = 7, hd = 5;
  for (let x = hx0; x < hx0 + hw; x++) for (let z = hz0; z < hz0 + hd; z++) {
    const edge = x === hx0 || x === hx0 + hw - 1 || z === hz0 || z === hz0 + hd - 1; if (!edge) continue;
    const corner = (x === hx0 || x === hx0 + hw - 1) && (z === hz0 || z === hz0 + hd - 1);
    if (corner) { bp.part('round_1x1', x, y0 + 1, z, 'ReddishBrown'); bp.part('round_1x1', x, y0 + 4, z, 'ReddishBrown'); continue; }
    const front = z === hz0 + hd - 1;
    if (front) { for (let dy = 0; dy < 6; dy++) bp.vox1('brick', x, y0 + 1 + dy, z, dy < 5 ? ((x - hx0) % 2 ? 'White' : 'DarkBrown') : 'ReddishBrown'); continue; }
    for (let dy = 0; dy < 6; dy++) bp.vox1('brick', x, y0 + 1 + dy, z, 'Tan');
  }
  // lattice windows on the side walls: grille bricks replacing tan at eye level
  for (const z of [hz0 + 1]) { bp.clear(hx0, y0 + 4, z, 1, 3, 2); bp.part('brick_grille_1x2', hx0, y0 + 4, z, 'DarkBrown', 1); bp.clear(hx0 + hw - 1, y0 + 4, z, 1, 3, 2); bp.part('brick_grille_1x2', hx0 + hw - 1, y0 + 4, z, 'DarkBrown', 1); }
  // roof: overhanging plate, slopes to a ridge, ridge caps
  const ry = y0 + 7; spanPlates(bp, hx0 - 1, hz0 - 1, hw + 2, hd + 2, ry, 'DarkBluishGray');
  for (let x = hx0 - 1; x < hx0 + hw + 1; x++) { bp.part('slope_1x2', x, ry + 1, hz0 - 1, 'DarkBluishGray', 2); bp.part('slope_1x2', x, ry + 1, hz0 + hd - 1, 'DarkBluishGray', 0); }
  bp.fill('brick', hx0 - 1, ry + 1, hz0 + 1, hw + 2, 3, hd - 2, 'DarkBluishGray');
  for (let x = hx0 - 1; x < hx0 + hw + 1; x += 4) if (x + 4 <= hx0 + hw + 1) bp.part('ridge_4x2', x, ry + 4, hz0 + 1, 'Black'); else bp.part('ridge_2x2', x, ry + 4, hz0 + 1, 'Black');
  bp.fill('tile', hx0 - 1, ry + 4, hz0 + 3, hw + 2, 1, 1, 'Black');
  // veranda posts and paper lanterns
  for (const x of [x0 + 1, x0 + w - 2]) { bp.part('round_1x1', x, y0 + 1, z0 + d - 1, 'ReddishBrown'); bp.part('round_1x1', x, y0 + 4, z0 + d - 1, 'ReddishBrown'); }
  paperLantern(bp, x0 + 2, y0 + 1, z0 + d - 1); paperLantern(bp, x0 + w - 3, y0 + 1, z0 + d - 1);
  bp.part('roundtile_1x1', x0 + 4, y0, z0 + d, 'LightBluishGray'); bp.part('roundtile_1x1', x0 + 5, y0, z0 + d + 1, 'LightBluishGray'); R.add(x0 + 4, z0 + d, 2, 2);
  bp.tag = '';
}
