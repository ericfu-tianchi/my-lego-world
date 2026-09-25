// B · Kyoto v5 — a floating garden island with breathing room. Pond as the calm centre, five-roof pagoda on the knoll (NE), grey tile
// and vermilion like Kiyomizu's; thatched tea house (NW), the tallest cherry on the SW lawn, torii at the front, karesansui (SE).
// Story layer: three people, each doing one legible thing. Vocabulary: real LDraw moulds + our own prints; spacing enforced by Sites.
import { Blueprint } from '../core/builder';
import { Reserve, Sites, patch, minifig2, holdUmbrella, lowTable, tree, hipCorners, railing, bamboo, bush, stoneLantern, paperLantern, overhangPlate, spanPlates, type SceneMeta } from './lib';

export function buildKyoto(bp: Blueprint): SceneMeta {
  const W = 56, D = 44; const R = new Reserve(); const ground = new Sites(2), canopy = new Sites(2);
  // ---- island shape: main ellipse + SW lobe (big cherry / stream) + NE lobe (knoll) + front entrance lobe
  const inIsland = (x: number, z: number) => {
    if (x < 0 || z < 0 || x >= W || z >= D) return false; const cx = x + 0.5, cz = z + 0.5;
    return ((cx - 28) / 27) ** 2 + ((cz - 22) / 20.5) ** 2 < 1 || Math.hypot(cx - 10, cz - 34) < 9 || Math.hypot(cx - 44, cz - 10) < 10 || Math.hypot(cx - 29, cz - 40) < 8;
  };
  const edgeDist = (x: number, z: number) => { for (let r = 1; r <= 3; r++) for (let dx = -r; dx <= r; dx++) for (let dz = -r; dz <= r; dz++) if (Math.max(Math.abs(dx), Math.abs(dz)) === r && !inIsland(x + dx, z + dz)) return r; return 9; };
  const HILL: [number, number] = [42, 12]; // knoll centre; 19×19 rounded square carries the 16×16 plinth
  const inHill = (x: number, z: number) => Math.max(Math.abs(x + 0.5 - HILL[0]), Math.abs(z + 0.5 - HILL[1])) < 9.5 && inIsland(x, z) && edgeDist(x, z) > 2;
  const inTerrace = (x: number, z: number) => edgeDist(x, z) <= 2 && z < 36 && !(x > 26 && x < 37 && z > 34);
  const POND: [number, number, number, number] = [23, 29, 11, 7];   // the calm centre: a fat koi pond, not a canal
  const BR = { x: 29, w: 6, z0: 23, z1: 34 };                          // the bridge's footprint; its approach pads stay dry land inside the pond outline
  const onRamp = (x: number, z: number) => x >= BR.x && x < BR.x + BR.w && (z >= BR.z0 - 1 && z <= BR.z0 + 1 || z >= BR.z1 - 1 && z <= BR.z1 + 1);
  const inPond = (x: number, z: number) => !onRamp(x, z) && (((x + 0.5 - POND[0]) / POND[2]) ** 2 + ((z + 0.5 - POND[1]) / POND[3]) ** 2 < 1 || Math.hypot(x + 0.5 - 15, z + 0.5 - 34) < 5);
  const inStream = (x: number, z: number) => x < 12 && z >= 28 && z <= 31 && !inPond(x, z) && inIsland(x, z); // pond spills west, then off the cliff
  const isWater = (x: number, z: number) => inIsland(x, z) && (inPond(x, z) || inStream(x, z));
  const waterStud = (x: number, z: number) => patch(x, z, 1, 33) < 0.2 && inPond(x, z);   // the pond surface is mostly smooth tile; these cells get a plate, and only they can carry lilies, koi and birds
  const groundTop = (x: number, z: number) => (inHill(x, z) ? 13 : inTerrace(x, z) ? 7 : 10); const G = groundTop;
  const grass = (x: number, z: number) => (patch(x, z, 3, 7) < 0.22 ? 'Green' : 'BrightGreen');   // two greens only: Lime read as random squares
  const BASE = 3;  // the island floats: the interior starts three plates above the table datum, so it is ~2 bricks of earth, not 3½
  const floorOf = (x: number, z: number) => (edgeDist(x, z) <= 3 ? 0 : BASE);  // the outer wall hangs lower, so the rim reads thick from any angle
  // strata must land on whole brick layers measured from BASE, or the packer is forced to emit plates and the count explodes
  const earth = (y: number) => (y < 6 ? 'DarkBluishGray' : y < 9 ? 'ReddishBrown' : 'MediumNougat');

  // ---- terrain (solid, but thin: hollowing with a lattice made MORE parts, because the packer turns a solid volume into 2x8 bricks
  // and a lattice into ragged 1x1s. The honest saving is depth — official landscape dioramas are about two bricks of earth.)
  bp.tag = 'terrain';
  for (let x = 0; x < W; x++) for (let z = 0; z < D; z++) {
    if (!inIsland(x, z)) continue;
    if (isWater(x, z)) { const top = 6; for (let y = floorOf(x, z); y < top; y++) bp.vox1('brick', x, y, z, earth(y)); bp.vox1('plate', x, top, z, patch(x, z, 2, 5) < 0.4 ? 'DarkAzure' : 'MediumAzure'); bp.vox1(waterStud(x, z) ? 'plate' : 'tile', x, top + 1, z, 'TransLightBlue'); R.add(x, z, 1, 1); continue; }
    const gt = groundTop(x, z); for (let y = floorOf(x, z); y < gt - 1; y++) bp.vox1('brick', x, y, z, earth(y)); bp.vox1('plate', x, gt - 1, z, grass(x, z));
  }
  // waterfall: a sheet from the stream surface down to a small pool on the table (the table counts as ground), a little foam where it lands
  for (let z = 28; z <= 31; z++) { bp.vox1('plate', -1, 0, z, 'TransLightBlue'); for (let y = 1; y < 7; y++) bp.vox1('brick', -1, y, z, 'TransLightBlue'); bp.vox1('plate', -1, 7, z, 'TransLightBlue'); }
  for (const [x, z] of [[-2, 27], [-2, 28], [-2, 29], [-2, 30], [-2, 31], [-2, 32], [-3, 28], [-3, 29], [-3, 30], [-3, 31]] as [number, number][]) bp.vox1('plate', x, 0, z, 'TransLightBlue');
  bp.part('roundplate_1x1', -2, 1, 28, 'White'); bp.part('flower_1x1', -2, 1, 30, 'White'); bp.part('roundplate_1x1', -3, 1, 31, 'White');   // foam
  // plinth: the bottom two bricks of stone step one cell outside the island footprint, so the ragged voxel rim reads as a finished stand
  for (let x = -1; x <= W; x++) for (let z = -1; z <= D; z++) {
    if (inIsland(x, z) || (x === -1 && z >= 28 && z <= 31)) continue;
    if (![[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dz]) => inIsland(x + dx, z + dz))) continue;
    for (let y = 0; y < 6; y++) bp.vox1('brick', x, y, z, 'DarkBluishGray');
    bp.vox1('tile', x, 6, z, 'DarkBluishGray');   // capped: no bare studs on the ledge
  }
  for (const [x, z] of [[1, 27], [1, 32], [2, 28]] as [number, number][]) if (inIsland(x, z) && !isWater(x, z)) { bp.part('roundplate_1x1', x, G(x, z), z, 'White'); R.add(x, z, 1, 1); } // spray on the lip

  // ---- landmarks (registered for spacing)
  ground.add('pagoda', HILL[0], HILL[1], 8); pagoda(bp, HILL[0], HILL[1], 13, R);
  ground.add('teahouse', 13, 14, 5.5); // body; the eave lip is covered by the reserve
  teaHouse(bp, 8, 10, 10, R);
  ground.add('zen', 42.5, 32.5, 5.5); karesansui(bp, 38, 29, R, (x, z) => inIsland(x, z) && G(x, z) === 10); // only on the main level

  // ---- torii at the entrance: pillars x 29 & 34 (axis 31.5 = bridge axis), plinths, black kasagi with upturned ends
  bp.tag = 'torii'; const tz = 42, ty = 10; ground.add('torii', 31.5, tz, 4); R.add(26, 41, 12, 3);   // on the front lobe, clear of the bridge: it must read in the silhouette
  for (const px of [29, 34]) { bp.part('jumper_2x2', px - 0.5, ty, tz - 0.5, 'LightBluishGray'); for (let k = 0; k < 5; k++) bp.part('round_1x1', px, ty + 1 + k * 3, tz, 'BrightRed'); }   // 5 bricks: a torii is taller than it is wide
  bp.part('plate_1x8', 28, ty + 16, tz, 'BrightRed', 1); for (const px of [29, 34]) bp.part('round_1x1', px, ty + 17, tz, 'BrightRed'); bp.part('brick_1x2', 31, ty + 17, tz, 'BrightRed', 1);
  bp.part('brick_1x6', 29, ty + 20, tz, 'BrightRed', 1);   // 島木 stays red: only the top beam is black (Eric)
  bp.part('plate_1x8', 28, ty + 23, tz, 'Black', 1); bp.part('curve_1x2', 27, ty + 24, tz, 'Black', 1); bp.part('curve_1x2', 35, ty + 24, tz, 'Black', 3);   // 笠木: one stud past the nuki each side, a gentle one-plate 反り — 1×4 wings read as ponytails (Eric)
  bp.part('songbird', 31, ty + 24, tz, 'White', 1);

  // ---- stepping stones: front edge → torii → bridge ramp; north bank → tea house veranda / hill steps / zen
  bp.tag = 'path';
  const stone = (x: number, z: number) => { const y = G(x, z); if (![[0, 0], [1, 0], [0, 1], [1, 1]].every(([a, b]) => inIsland(x + a, z + b) && !isWater(x + a, z + b) && G(x + a, z + b) === y)) return; bp.part('roundtile_2x2', x, y, z, patch(x, z, 1, 3) < 0.3 ? 'DarkBluishGray' : 'LightBluishGray'); R.add(x, z, 2, 2); };
  // 飛石: through the torii, up to the bridge; from the bridge west to the tea-house step; a short branch east to the karesansui
  for (const [x, z] of [[31, 43], [31, 39], [31, 36], [31, 20], [28, 19], [25, 19], [22, 19], [19, 20], [16, 21], [12, 22], [35, 20], [38, 24], [40, 27]] as [number, number][]) stone(x, z);

  // ---- taiko bridge over the pond's narrow east end: two 1×8×2 arches, 6-wide deck, hump, posts with giboshi, stepped ramps
  bp.tag = 'bridge'; const bx = BR.x, bz = 25; ground.add('bridge', 31.5, 28.5, 4); R.add(bx, bz - 3, 6, 14);
  bp.part('arch_1x8x2', bx, 10, bz, 'BrightRed', 1); bp.part('arch_1x8x2', bx + 5, 10, bz, 'BrightRed', 1);
  bp.part('plate_2x8', bx, 16, bz, 'BrightRed'); bp.part('plate_2x8', bx + 2, 16, bz, 'BrightRed'); bp.part('plate_2x8', bx + 4, 16, bz, 'BrightRed');   // deck on the arch tops
  bp.part('plate_4x4', bx + 1, 17, bz + 2, 'BrightRed'); bp.part('plate_2x4', bx + 1, 18, bz + 3, 'BrightRed', 1);                                          // hump: +1, +2
  for (const x of [bx, bx + 5]) {                                                                                                            // railings: three posts, a continuous handrail, gold giboshi over each post
    for (const z of [bz, bz + 3, bz + 7]) bp.part('round_1x1', x, 17, z, 'BrightRed');
    bp.part('plate_1x8', x, 20, bz, 'BrightRed'); for (const z of [bz, bz + 3, bz + 7]) bp.part('roundplate_1x1', x, 21, z, 'PearlGold');
    bp.part('tile_1x2', x, 17, bz + 1, 'BrightRed'); bp.part('tile_1x2', x, 17, bz + 4, 'BrightRed'); bp.part('tile_1x1', x, 17, bz + 6, 'BrightRed');   // deck between posts, no bare studs
  }
  bp.part('tile_2x4', bx + 1, 17, bz, 'BrightRed', 1); bp.part('tile_2x4', bx + 1, 17, bz + 6, 'BrightRed', 1);                             // deck ends
  bp.part('tile_1x4', bx + 1, 18, bz + 2, 'BrightRed', 1); bp.part('tile_1x4', bx + 1, 18, bz + 5, 'BrightRed', 1);                          // first hump step
  bp.part('tile_1x4', bx + 1, 19, bz + 3, 'BrightRed', 1);                                                                                   // crown, north row (the south row keeps its studs: someone stands there)
  for (const [z, top] of [[bz - 3, 12], [bz - 2, 14], [bz - 1, 16], [bz + 8, 16], [bz + 9, 14], [bz + 10, 12]] as [number, number][]) for (let x = bx; x < bx + 6; x++) for (let y = 10; y < top; y++) bp.vox1('plate', x, y, z, 'BrightRed');   // three flat steps of two plates up to the deck, bridge-red

  // ---- trees (sakura v4: leaning trunk, unequal limbs, staggered clusters). The tallest on the open SW lawn where nothing crowds
  // its canopy; a medium one beside the tea house with its roof side and bamboo side left bare; one on the east terrace over the edge.
  const plant = (name: string, x: number, z: number, r: number) => { ground.add(name, x, z, 1.5); canopy.add(name, x, z, r); };
  plant('sakura-SW', 8, 36, 7); tree(bp, 8, G(8, 36), 36, 'L', R, 0);           // leans toward the pond and the viewer
  plant('sakura-N', 21, 9, 5); tree(bp, 21, G(21, 9), 9, 'M', R, 1, 1);          // leans north-east away from the house; roof side bare
  plant('sakura-E', 50, 27, 6); tree(bp, 50, G(50, 27), 27, 'M', R, 2);          // limbs toward the garden, air over the cliff
  plant('pine', 29, 3, 3); tree(bp, 29, G(29, 3), 3, 'M', R, 1, undefined, 'pine');   // pine clouds on the same leaning armature
  bp.tag = 'bamboo'; ground.add('bamboo', 4, 23, 2); bamboo(bp, 3, G, 22, [5, 7, 4, 6, 3, 5, 2], R);   // a grove on the west terrace above the waterfall
  for (const [x, z] of [[22, 17], [46, 22], [36, 38]] as [number, number][]) if (inIsland(x, z) && !isWater(x, z) && !isWater(x + 1, z + 1) && !R.has(x, z) && !R.has(x + 1, z + 1)) bush(bp, x, G(x, z), z, undefined, R);

  // ---- lanterns
  ground.add('lantern-N', 37, 23, 1); stoneLantern(bp, 36, G(36, 23), 23, R);
  ground.add('lantern-S', 18, 39, 1); stoneLantern(bp, 17, G(17, 39), 39, R);
  bp.tag = 'lantern'; ground.add('chochin', 9, 22, 1); paperLantern(bp, 9, G(9, 22), 22, 'lantern_kyo', 0); R.add(9, 22, 1, 1); // off the veranda's SW corner

  // ---- people. Three, far apart, each doing one legible thing: a parasol on the bridge, a monk sweeping the gravel, a visitor framing the pagoda.
  bp.tag = 'minifig';
  holdUmbrella(bp, 32, 19, 29.5, 0, { legs: 'DarkRed', torso: 'White', face: 'face_smile', torsoPrint: 'torso_kimono_red', hair: 'Black', hairKey: 'hair_highbun' }, 'L', 'BrightRed'); // on the bridge crown: white kimono, red collar, bun; the parasol arm is level so the canopy clears the bun
  minifig2(bp, 42, 11, 36.5, 2, { legs: 'DarkTan', torso: 'DarkTan', face: 'face_calm', torsoPrint: 'torso_monk', hold: [{ key: 'pushbroom', color: 'ReddishBrown' }] }, R); // standing on the karesansui's stone kerb, broom head on the sand
  ground.add('visitor', 22.5, 38.5, 1); minifig2(bp, 22.5, G(22, 38), 38.5, 2, { legs: 'DarkTan', torso: 'Tan', face: 'face_grin', torsoPrint: 'torso_kimono_indigo', hair: 'DarkBrown', hairKey: 'hair_short', hold: [{ key: 'camera', color: 'Black', hand: 'R' }] }, R); // tan yukata, framing the pagoda
  bp.tag = 'ground'; bp.part('cat', 14, 13, 18, 'White', 0);   // a white cat on the engawa deck, beside the door

  // ---- pond life: lily pads and lotus at the west end, koi swimming east, duckling, frog
  bp.tag = 'pond'; const nearBridge = (x: number) => x >= bx - 1 && x <= bx + 6;
  const lilies: [number, number][] = []; for (let x = 13; x <= 36; x++) for (let z = 20; z <= 36; z++) if (waterStud(x, z) && !nearBridge(x)) lilies.push([x, z]);
  const taken = new Reserve(); const free = (x: number, z: number, w: number, d: number) => { for (let i = 0; i < w; i++) for (let j = 0; j < d; j++) if (!inPond(x + i, z + j) || nearBridge(x + i) || taken.has(x + i, z + j)) return false; return true; };
  let fishN = 0, padN = 0, duck = false;
  for (const [x, z] of lilies) {
    if (taken.has(x, z)) continue;
    if (padN < 5 && x < 24 && free(x, z, 2, 2)) { bp.part('lilypad', x, 8, z, bp.pick(['Green', 'BrightGreen'])); if (padN === 0) bp.part('lotus', x, 11, z, 'BrightPink'); else if (padN === 1) bp.part('frog', x + 0.5, 11, z + 0.5, 'BrightGreen', 1); else if (padN === 2) bp.part('lotus', x, 11, z, 'White'); taken.add(x - 1, z - 1, 4, 4); padN++; continue; }
    if (fishN < 4 && x >= 21 && free(x, z, 1, 3)) { bp.part('fish', x, 8, z, ['Orange', 'White', 'Orange', 'BrightRed'][fishN], 0); taken.add(x - 1, z - 1, 3, 5); fishN++; continue; }
    if (!duck && [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]].every(([a, b]) => inPond(x + a, z + b) && !taken.has(x + a, z + b))) { bp.part('duckling', x, 8, z, 'Yellow', 3); taken.add(x - 1, z - 1, 3, 3); duck = true; continue; }
    if (bp.chance(0.5)) { bp.part('flower_1x1', x, 8, z, bp.pick(['BrightPink', 'White'])); taken.add(x, z, 1, 1); }
  }
  // bank: a few stones and grass tufts along the shoreline, never a ring
  bp.tag = 'bank';
  for (let x = 0; x < W; x++) for (let z = 0; z < D; z++) { if (!inIsland(x, z) || isWater(x, z) || R.has(x, z)) continue; const near = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dz]) => isWater(x + dx, z + dz)); if (!near) continue; const r = patch(x, z, 2, 21); if (r < 0.3) bp.part('nugget', x, G(x, z), z, bp.chance(0.6) ? 'LightBluishGray' : 'DarkBluishGray', Math.floor(bp.rand() * 4)); else if (r < 0.45) { bp.part('roundplate_1x1', x, G(x, z), z, 'Green'); bp.part('grass_stem', x, G(x, z) + 1, z, bp.pick(['BrightGreen', 'Lime'])); } else continue; R.add(x, z, 1, 1); }

  // ---- flower beds (east of the tea house, by the torii) and a butterfly
  bp.tag = 'ground';
  for (const [x, z, c] of [[18, 12, 'White'], [18, 14, 'Yellow'], [16, 16, 'BrightPink'], [26, 36, 'White'], [27, 34, 'Lavender'], [22, 38, 'Yellow'], [45, 20, 'White'], [47, 23, 'BrightPink']] as [number, number, string][]) if (inIsland(x, z) && !isWater(x, z) && !R.has(x, z)) { bp.part('flower_stem', x, G(x, z), z, 'BrightGreen'); bp.part('flower_small', x, G(x, z) + 3, z, c); R.add(x, z, 1, 1); }
  if (!R.has(16, 13)) { bp.part('flower_1x1', 16, G(16, 13), 13, 'BrightPink'); bp.part('butterfly', 16, G(16, 13) + 1, 13, 'Lavender', 1); R.add(16, 13, 1, 1); }
  bp.part('songbird', 46, G(46, 25), 25, 'DarkPink', 2); R.add(46, 25, 1, 2);
  bp.part('songbird', 20, G(20, 12), 12, 'White', 0); R.add(20, 12, 1, 2);
  bp.part('butterfly', 43, G(43, 26) + 1, 26, 'White', 2); bp.part('flower_1x1', 43, G(43, 26), 26, 'White'); R.add(43, 26, 1, 1);
  // fallen petals under each cherry, and mossy tufts along the stepping stones — the garden's ground layer, all real plant elements
  bp.tag = 'petals';
  for (const [tx, tz] of [[21, 9], [8, 36], [50, 27]] as [number, number][]) for (let k = 0; k < 7; k++) {
    const a = k * 2.39, r = 2 + (k % 3); const px = Math.round(tx + Math.cos(a) * r), pz = Math.round(tz + Math.sin(a) * r);
    if (!inIsland(px, pz) || isWater(px, pz) || R.has(px, pz)) continue;
    bp.part('flower_1x1', px, G(px, pz), pz, bp.pick(['BrightPink', 'White', 'BrightPink'])); R.add(px, pz, 1, 1);
  }
  bp.tag = 'tufts';
  for (const [x, z] of [[29, 34], [33, 33], [26, 27], [36, 29], [21, 16], [17, 20], [13, 24], [44, 17], [48, 24], [40, 20], [24, 12], [12, 30], [34, 16], [30, 12]] as [number, number][]) {
    if (!inIsland(x, z) || isWater(x, z) || R.has(x, z)) continue;
    bp.part('roundplate_1x1', x, G(x, z), z, 'Green'); bp.part('grass_stem', x, G(x, z) + 1, z, bp.pick(['BrightGreen', 'Lime', 'Green'])); R.add(x, z, 1, 1);
  }
  bp.tag = ''; bp.pack();
  return { id: 'kyoto', title: 'Japan', caption: 'Kyoto', subtitle: 'Five-roof pagoda · torii · taiko bridge · sakura in bloom', size: [W, D], center: [W / 2, 11, D / 2], base: BASE, camera: { az: 0.62, el: 0.42, dist: 100 } };
}

/** Five-roof pagoda. cx, cz = centre stud line; y0 = plate level of the hill surface. Two-step stone plinth, tiers shrink in width and height. */
function pagoda(bp: Blueprint, cx: number, cz: number, y0: number, R: Reserve) {
  bp.tag = 'pagoda'; const tiers = [12, 10, 8, 6]; const wallH = [5, 4, 4, 3]; const ROOF = 'DarkBluishGray', BEAM = 'DarkRed', PILLAR = 'BrightRed'; // grey tile, dark-red timber, vermilion pillars: Kiyomizu-dera, not a glazed Chinese roof
  bp.fill('plate', cx - 8, y0, cz - 8, 16, 1, 16, 'LightBluishGray'); bp.fill('plate', cx - 7, y0 + 1, cz - 7, 14, 1, 14, 'LightBluishGray'); R.add(cx - 9, cz - 9, 18, 18);
  let y = y0 + 2;
  tiers.forEach((S, ti) => {
    const x0 = cx - S / 2, z0 = cz - S / 2;
    overhangPlate(bp, x0 - 1, z0 - 1, S + 2, S + 2, y, BEAM); // floor / walkway
    if (ti > 0) railing(bp, x0 - 1, z0 - 1, S + 2, S + 2, y + 1, PILLAR);   // symmetric fence runs with posts, corner caps
    const wy = y + 1, H = wallH[ti];
    const pil = new Set([0, S - 1]); if (S >= 8) { const k = Math.round((S - 1) / 3); pil.add(k); pil.add(S - 1 - k); }   // three bays, mirror-symmetric: pillar k pairs with S-1-k
    for (let x = x0; x < x0 + S; x++) for (let z = z0; z < z0 + S; z++) {
      const edge = x === x0 || x === x0 + S - 1 || z === z0 || z === z0 + S - 1; if (!edge) continue;
      const isPil = (pil.has(x - x0) && (z === z0 || z === z0 + S - 1)) || (pil.has(z - z0) && (x === x0 || x === x0 + S - 1));
      if (isPil) { bp.part('round_1x1', x, wy, z, PILLAR); for (let k = 3; k < H; k++) bp.part('roundplate_1x1', x, wy + k, z, PILLAR); continue; }
      const door = ti === 0 && z === z0 + S - 1 && Math.abs(x + 0.5 - cx) < 1.6;
      for (let dy = 0; dy < H; dy++) { let c = 'White'; if (door && dy < 3) c = 'DarkBrown'; else if (dy === 3) c = 'DarkBrown'; bp.vox1(dy < 3 ? 'brick' : 'plate', x, wy + dy, z, c); }
    }
    bp.fill('plate', x0 - 1, wy + H, z0 - 1, S + 2, 1, S + 2, BEAM); // bracket layer
    const ry = wy + H + 1, Rw = S + 4, rx0 = cx - Rw / 2, rz0 = cz - Rw / 2;
    overhangPlate(bp, rx0, rz0, Rw, Rw, ry, ROOF);
    for (const [x, z, rot] of [[rx0 + Rw - 1, rz0 + Rw - 1, 3], [rx0 + Rw - 1, rz0, 3], [rx0, rz0, 1], [rx0, rz0 + Rw - 1, 1]] as [number, number, number][]) bp.part('cheese_1x1', x, ry + 1, z, ROOF, rot);   // eave tips flick outward along x on both sides: mirror-symmetric, all four read the same (Eric)
    for (let i = 3; i < Rw - 3; i++) { bp.part('slope_1x2', rx0 + i, ry + 1, rz0 + 1, ROOF, 2); bp.part('slope_1x2', rx0 + i, ry + 1, rz0 + Rw - 3, ROOF, 0); bp.part('slope_1x2', rx0 + 1, ry + 1, rz0 + i, ROOF, 3); bp.part('slope_1x2', rx0 + Rw - 3, ry + 1, rz0 + i, ROOF, 1); }
    hipCorners(bp, 'slope_corner_2x2', rx0 + 1, rz0 + 1, Rw - 2, Rw - 2, ry + 1, ROOF);
    const inner = Rw - 6; if (inner > 0) bp.fill('brick', rx0 + 3, ry + 1, rz0 + 3, inner, 3, inner, BEAM);
    y = ry + 4;
  });
  bp.part('slope_2x2', cx - 2, y, cz - 2, ROOF, 2); bp.part('slope_2x2', cx, y, cz - 2, ROOF, 2); bp.part('slope_2x2', cx - 2, y, cz, ROOF, 0); bp.part('slope_2x2', cx, y, cz, ROOF, 0);
  const fy = y + 3; bp.part('roundplate_2x2', cx - 1, fy, cz - 1, 'PearlGold'); bp.part('cone_2x2', cx - 1, fy + 1, cz - 1, 'PearlGold'); bp.part('bar_3l', cx - 0.5, fy + 7, cz - 0.5, 'PearlGold');
  for (let k = 0; k < 3; k++) bp.part('roundplate_1x1', cx - 0.5, fy + 8 + k * 2, cz - 0.5, 'PearlGold'); bp.part('cone_1x1', cx - 0.5, fy + 13, cz - 0.5, 'PearlGold');
  bp.tag = '';
}

/** Thatched tea house (茶室): dark timber posts, earth-tan walls, lattice door, white shoji windows, deep thatched hip roof with a
 *  bamboo ridge, engawa veranda with a low table, paper lanterns hanging from the eave, a sign brick over the door. */
function teaHouse(bp: Blueprint, x0: number, z0: number, y0: number, R: Reserve) {
  bp.tag = 'teahouse'; const hw = 8, hd = 6, WALL = 21; const hx0 = x0 + 1, hz0 = z0 + 1; // house body 8 wide × 6 deep (a tea house is low and wide, not a tower); veranda at +z
  bp.fill('plate', x0, y0, z0, hw + 2, 1, hd + 4, 'ReddishBrown'); R.add(x0 - 2, z0 - 2, hw + 6, hd + 8); // floor plate under house and veranda
  bp.fill('plate', x0, y0 + 1, z0 + hd + 1, hw + 2, 2, 3, 'ReddishBrown');                                    // engawa: the veranda deck rides two plates above the garden
  bp.part('plate_1x4', x0 + 3, y0, z0 + hd + 4, 'ReddishBrown', 1); bp.part('plate_1x4', x0 + 3, y0 + 1, z0 + hd + 4, 'ReddishBrown', 1);   // two-plate step down to the stepping stones
  const TIMBER = 'DarkBrown', EARTH = 'Tan';
  for (let x = hx0; x < hx0 + hw; x++) for (let z = hz0; z < hz0 + hd; z++) {
    const edge = x === hx0 || x === hx0 + hw - 1 || z === hz0 || z === hz0 + hd - 1; if (!edge) continue;
    const corner = (x === hx0 || x === hx0 + hw - 1) && (z === hz0 || z === hz0 + hd - 1);
    if (corner) { for (let k = 0; k < WALL; k += 3) bp.part('round_1x1', x, y0 + 1 + k, z, TIMBER); continue; }
    const front = z === hz0 + hd - 1, back = z === hz0, side = !front && !back;
    const inDoor = front && x >= hx0 + 2 && x <= hx0 + 5;                    // 4-wide lattice door, centred, full height 18
    const inWin = (side && (z === hz0 + 2 || z === hz0 + 3)) || (back && (x === hx0 + 3 || x === hx0 + 4)); // 1×2×3 shoji at 1 brick up
    for (let dy = 0; dy < WALL; dy++) {
      if (inDoor) continue; if (inWin && dy >= 3 && dy < 12) continue;
      bp.vox1(dy === 15 ? 'plate' : 'brick', x, y0 + 1 + dy, z, dy === 15 ? TIMBER : EARTH); // a timber band at eye level
    }
  }
  bp.part('doorframe_1x4x6', hx0 + 2, y0 + 1, hz0 + hd - 1, TIMBER); bp.part('door_lattice', hx0 + 2, y0 + 1, hz0 + hd - 1, TIMBER);
  bp.part('brick_1x4', hx0 + 2, y0 + 19, hz0 + hd - 1, 'DarkBrown', 3, 'sign_saryo'); // 1×4 brick runs along x at rot 3, printed +x face turns to +z
  for (const [x, z, rot] of [[hx0, hz0 + 2, 1], [hx0 + hw - 1, hz0 + 2, 1], [hx0 + 3, hz0, 0]] as [number, number, number][]) { bp.part('window_1x2x3', x, y0 + 4, z, TIMBER, rot); bp.part('pane_lattice_1x2x3', x, y0 + 4, z, 'White', rot); }
  // roof: eave plates 2 out, 33° hip ring with 3×3 corners, inner block, ridge of double slopes with cheese eaves
  const ry = y0 + 1 + WALL, RW = hw + 4, RD = hd + 4, rx0 = hx0 - 2, rz0 = hz0 - 2; const THATCH = 'DarkTan', RIDGE = 'ReddishBrown';
  spanPlates(bp, rx0 - 1, rz0 - 1, RW + 2, RD + 2, ry, THATCH); // one exposed stud of eave lip all round; clips sit on it
  hipCorners(bp, 'slope_corner_3x3', rx0, rz0, RW, RD, ry + 1, THATCH);
  for (let x = rx0 + 3; x < rx0 + RW - 3; x += 2) { const two = x + 2 <= rx0 + RW - 3; bp.part(two ? 'slope_2x3' : 'slope_1x3', x, ry + 1, rz0, THATCH, 2); bp.part(two ? 'slope_2x3' : 'slope_1x3', x, ry + 1, rz0 + RD - 3, THATCH, 0); if (!two) break; }
  for (let z = rz0 + 3; z < rz0 + RD - 3; z += 2) { const two = z + 2 <= rz0 + RD - 3; bp.part(two ? 'slope_2x3' : 'slope_1x3', rx0, ry + 1, z, THATCH, 3); bp.part(two ? 'slope_2x3' : 'slope_1x3', rx0 + RW - 3, ry + 1, z, THATCH, 1); if (!two) break; }
  bp.fill('brick', rx0 + 3, ry + 1, rz0 + 3, RW - 6, 3, RD - 6, THATCH);           // inner block 4 × 4
  bp.part('ridge_2x2', rx0 + 3, ry + 4, rz0 + 4, RIDGE); bp.part('ridge_4x2', rx0 + 5, ry + 4, rz0 + 4, RIDGE); for (let x = rx0 + 3; x < rx0 + RW - 3; x += 2) { bp.part('cheese_1x2', x, ry + 4, rz0 + 3, THATCH, 2); bp.part('cheese_1x2', x, ry + 4, rz0 + RD - 4, THATCH, 0); }
  // veranda: low table with tea things, lanterns hanging from the front eave
  lowTable(bp, x0 + 3, y0 + 3, z0 + hd + 2, 'ReddishBrown', [{ key: 'cup', color: 'White', dx: -0.5, dz: -0.5, rot: 1 }, { key: 'cup', color: 'White', dx: 0.5, dz: -0.5, rot: 3 }, { key: 'swirl_1x1', color: 'BrightGreen', dx: -0.5, dz: 0.5 }]); // west end of the veranda: two cups (handles outward), matcha soft-serve
  // paper lanterns standing on the two veranda posts — a clip-hung lantern needs a cantilever that always brushes the eave
  for (const px of [x0 + 1, x0 + hw]) { bp.part('round_1x1', px, y0 + 3, z0 + hd + 3, 'ReddishBrown'); bp.part('round_1x1', px, y0 + 6, z0 + hd + 3, 'ReddishBrown'); paperLantern(bp, px, y0 + 9, z0 + hd + 3, 'lantern_kyo', 0); }
  bp.tag = '';
}

/** Karesansui: white sand with raked lines (grille tiles every other row), a 3:2:1 rock group leaning together, moss at the feet. */
function karesansui(bp: Blueprint, zx: number, zz: number, R: Reserve, inIsland: (x: number, z: number) => boolean) {
  bp.tag = 'zen'; const zw = 10, zd = 8; R.add(zx - 1, zz - 1, zw + 2, zd + 2);
  for (let x = zx; x < zx + zw; x++) for (let z = zz; z < zz + zd; z++) { if (!inIsland(x, z)) continue; bp.vox1('plate', x, 9, z, 'White'); }
  const rocks = new Reserve(); rocks.add(zx + 3, zz + 2, 2, 2); rocks.add(zx + 5, zz + 3, 2, 2); rocks.add(zx + 2, zz + 4, 1, 1);
  const moss: [number, number][] = [[zx + 2, zz + 2], [zx + 5, zz + 2], [zx + 3, zz + 5]]; for (const [x, z] of moss) rocks.add(x, z, 1, 1);
  for (let z = zz; z < zz + zd; z++) for (let x = zx; x < zx + zw; x++) {
    if (!inIsland(x, z)) continue; const edge = x === zx || x === zx + zw - 1 || z === zz || z === zz + zd - 1;
    if (edge) { bp.vox1('plate', x, 10, z, 'DarkBluishGray'); continue; } if (rocks.has(x, z)) continue;
    const rake = (z - zz) % 2 === 0; // every other row is a raked line: 1×2 grille tiles laid along x
    if (rake && x + 1 < zx + zw - 1 && !rocks.has(x + 1, z) && inIsland(x + 1, z)) { bp.part('grilletile_1x2', x, 10, z, 'LightBluishGray', 0); x++; } else bp.vox1('tile', x, 10, z, 'White');
  }
  bp.part('brick_2x2', zx + 3, 10, zz + 2, 'DarkBluishGray'); bp.part('dome_2x2', zx + 3, 13, zz + 2, 'DarkBluishGray');   // 主石: upright 2×2 brick under a dome — tall stone
  bp.part('slope_2x2', zx + 5, 10, zz + 3, 'DarkBluishGray', 3);                                                              // 伏石 leaning toward the main stone
  bp.part('nugget', zx + 2, 10, zz + 4, 'LightBluishGray', 2);                                                                // 添石
  for (const [x, z] of moss) bp.part('roundplate_1x1', x, 10, z, 'Green'); // moss at the feet
  for (let x = zx; x + 4 <= zx + zw; x += 4) bp.part('fence_lattice_1x4x2', x, 11, zz, 'ReddishBrown'); // bamboo lattice along the back
  bp.tag = '';
}
