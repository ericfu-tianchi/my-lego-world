// Los Angeles element test scene: Santa Monica Pier over a strip of bay and beach (docs/countries/usa.md §1.12, SCHEME
// docs/refs/la-santa-monica/SCHEME.md). ?scene=la-pier&noglobe; one element with ?only=wheel | coaster | pier | arch
// Grid: x west (sea) → east (land), z north → south (camera side). Levels (plates): sea bed 0–1 (Sand Blue, Dark Blue further out), water
// tiles 1–2 (Trans-Light-Blue: the renderer turns Trans-Clear into frost, so it read as ice; w = 2), sand 0–3 (G = 3), pile caps 7–8, deck plates 8–9, planks 9–10 (D = w + 8). Piles stand on the sea-bed
// plate through gaps in the water tiles, or on the sand.
// The park's rides (wheel + coaster) are one assembly, la_park, standing on the deck; the deck, planks and railing of the whole pier, the arch,
// the 66 sign and the park's life layer (booths, cart, benches, people; r2 2026-10-05) are built here. 
import { Blueprint } from '../core/builder';
import { LA_PARK_STANDS } from '../core/catalog';
import { minifig2, type SceneMeta } from './lib';

const W = 76, D = 44, SHORE = 60;
const PARK = { x: 4, z: 6 };                                   // la_park: 52 × 32
const COASTER = new Set(['25061', '80562', '34738', '3941', '3068b', '26021c01', '3069b', '973', '3815', '3816', '3817', '3818', '3819', '3820', '3626c', '12890', '3901']);   // track, posts, cars and their riders

/** The pier at an offset: (ox, oz) shifts the grid, y0 is the sea-bed plate's level (water tiles at y0 + 1, pile caps y0 + 7, deck
 *  plates y0 + 8, planks y0 + 9). `sand(x, z)` is the sand top under a pile, or null over the sea (the pile then stands on the bed). Returns
 *  the pile cells, which the sea leaves open. */
export function placePier(bp: Blueprint, ox: number, oz: number, y0: number, sand: (x: number, z: number) => number | null) {
  const piles = new Set<string>(); const k = (x: number, z: number) => `${x},${z}`;
  /** a pile on the sea bed (two round bricks) or on the sand (round bricks, then round plates), its top at the cap's underside */
  const pile = (x: number, z: number) => {
    bp.tag = 'pier'; x += ox; z += oz; piles.add(k(x, z)); const s = sand(x, z), cap = y0 + 7;
    if (s === null) { bp.part('round_1x1', x, y0 + 1, z, 'DarkBrown'); bp.part('round_1x1', x, y0 + 4, z, 'DarkBrown'); }
    else { let y = s; while (cap - y >= 3) { bp.part('round_1x1', x, y, z, 'DarkBrown'); y += 3; } while (y < cap) { bp.part('roundplate_1x1', x, y, z, 'DarkBrown'); y++; } }
  };
  /** a bent: piles at the given z cells, cap plates across them (1×8 / 1×6 along z) */
  const bent = (x: number, z0: number, z1: number, at: number[]) => {
    for (const z of at) pile(x, z);
    let z = z0; while (z < z1) { const L = z1 - z >= 8 && (z1 - z) % 6 !== 0 ? 8 : 6; bp.part(`plate_1x${L}`, x + ox, y0 + 7, z + oz, 'DarkBrown'); z += L; }
  };
  // ---- piles and caps
  for (let i = 0; i < 13; i++) bent(PARK.x + 2 + 4 * i, PARK.z, PARK.z + 32, [7, 13, 19, 24, 30, 36]);   // park: 6 piles a bent, bents 4 apart (v2: denser, as the real forest of piles)
  bent(1, 16, 28, [16, 20, 23, 27]);                                                                    // tail
  bent(58, 16, 28, [16, 20, 23, 27]); bent(62, 16, 28, [16, 20, 23, 27]); bent(66, 14, 30, [15, 20, 23, 28]);   // approach + landing

  // ---- park rides: one assembly (wheel + coaster) standing on the deck plates; its proxy takes only the cells of its feet and posts
  const DT = y0 + 9;                                            // the deck plates' top: what stands on the deck stands here, in a gap in the planks
  bp.tag = 'pier'; bp.assembly('la_park', PARK.x + ox, DT, PARK.z + oz, 'ReddishBrown', 0, { '3626c|Yellow': 'face_laugh_ld' });   // the riders laugh
  for (const p of bp.parts) if (p.member?.startsWith('la_park@')) { const id = p.key.slice(3); p.tag = COASTER.has(id) || (id === '4032a' && p.color !== 'LightBluishGray') || (id === '3004' && p.color === 'Yellow') || (id === '2431' && p.color === 'Black') ? 'coaster' : 'wheel'; }   // coloured 2×2 round plates are post caps (grey ones canopies); yellow 1×2 bricks and a black 1×4 tile are the cars' seats and noses

  // ---- deck plates (2 wide, along the pier, from bent to bent; rows staggered) and the cells the planks will cover
  bp.tag = 'pier';
  const P = (key: string, x: number, y: number, z: number, c: string, r = 0) => bp.part(key, x + ox, y0 + y, z + oz, c, r);
  const deckCells: [number, number][] = [];
  for (let x = PARK.x; x < PARK.x + 52; x++) for (let z = PARK.z; z < PARK.z + 32; z++) deckCells.push([x, z]);
  for (let x = 0; x < 4; x++) for (let z = 16; z < 28; z++) deckCells.push([x, z]);
  for (let x = 56; x < 62; x++) for (let z = 16; z < 28; z++) deckCells.push([x, z]);
  for (let x = 62; x < 68; x++) for (let z = 14; z < 30; z++) deckCells.push([x, z]);
  for (let z = PARK.z, i = 0; z < PARK.z + 32; z += 2, i++) { let x = PARK.x; for (const L of i % 2 ? [4, 8, 8, 8, 8, 8, 8] : [8, 8, 8, 8, 8, 8, 4]) { P(`plate_2x${L}`, x, 8, z, 'ReddishBrown', 1); x += L; } }   // every plate spans a bent (4 apart)
  // tail 2×4 on the x 1 bent; approach 2×6 (x 56–62, over the x 58 bent) + 2×6 (62–68, over 62 and 66); the landing's extra rows 2×6
  for (let z = 16; z < 28; z += 2) { P('plate_2x4', 0, 8, z, 'ReddishBrown', 1); P('plate_2x6', 56, 8, z, 'ReddishBrown', 1); P('plate_2x6', 62, 8, z, 'ReddishBrown', 1); }
  for (const z of [14, 28]) P('plate_2x6', 62, 8, z, 'ReddishBrown', 1);
  const busy = new Set<string>(); const take = (x: number, z: number, w = 1, d = 1) => { for (let i = 0; i < w; i++) for (let j = 0; j < d; j++) busy.add(k(x + i, z + j)); };
  /** park frame (x −26…25, z −16…15, as la_park's) → this grid */
  const fx = (x: number) => PARK.x + 26 + x, fz = (z: number) => PARK.z + 16 + z;
  for (const [x, z, w, d] of LA_PARK_STANDS) take(fx(x), fz(z), w, d);

  // ---- railings (Dark Blue): posts of two 1×1 round plates every 3 studs, 1×N tiles on top. A seagull stands on one post's own round plate.
  const RAIL = 1 + 2;                                           // handrail level above the deck plates (plates): two round plates
  const post = (x: number, z: number) => { P('roundplate_1x1', x, 9, z, 'DarkBlue'); P('roundplate_1x1', x, 10, z, 'DarkBlue'); take(x, z); };
  /** handrail tiles along a run of cells, `perch` cells get a round plate (a stud for a gull) instead of a tile */
  const handrail = (axis: 'x' | 'z', fixed: number, from: number, to: number, perch: number[] = []) => {
    let p = from; while (p < to) {
      if (perch.includes(p)) { if (axis === 'x') P('roundplate_1x1', p, 8 + RAIL, fixed, 'DarkBlue'); else P('roundplate_1x1', fixed, 8 + RAIL, p, 'DarkBlue'); p++; continue; }
      let n = 0; while (p + n < to && !perch.includes(p + n) && n < 6) n++;
      if (axis === 'x') P(`tile_1x${n}`, p, 8 + RAIL, fixed, 'DarkBlue', 1); else P(`tile_1x${n}`, fixed, 8 + RAIL, p, 'DarkBlue'); p += n;
    }
  };
  const GULL_RAIL = fx(-2);                                     // a post on the south rail, in front of the wheel
  for (const z of [PARK.z, PARK.z + 31]) { for (let x = PARK.x; x < PARK.x + 52; x += 3) post(x, z); handrail('x', z, PARK.x, PARK.x + 52, z === PARK.z + 31 ? [GULL_RAIL] : []); }   // 17 equal gaps
  for (const x of [PARK.x, PARK.x + 51]) { for (const z of [-13, -10, -7, 6, 9, 12]) post(x, fz(z)); handrail('z', x, fz(-15), fz(-6)); handrail('z', x, fz(6), fz(15)); }   // ends: 12-wide openings for the tail and the approach
  bp.part('seagull', GULL_RAIL + ox, y0 + 8 + RAIL + 1, PARK.z + 31 + oz, 'White', 2);
  for (const z of [16, 27]) {                                    // approach rails: posts every 3 (x 56, 59, 62), a 1×6 + 1×1 tile handrail
    for (const x of [56, 59, 62]) post(x, z);
    P('tile_1x6', 56, 11, z, 'DarkBlue', 1); P('tile_1x1', 62, 11, z, 'DarkBlue');
  }
  bp.tag = 'arch'; const arch = bp.parts.length; bp.assembly('la_arch', 64 + ox, y0 + 9, 14 + oz, 'DarkBlue'); take(64, 15, 2, 2); take(64, 27, 2, 2);
  archLettering(bp, `la_arch@${arch}`);
  bp.assembly('la_sign66', 60 + ox, y0 + 9, 24 + oz, 'DarkBluishGray', 0, { '14769|White': 'route66' }); take(60, 24);
  bp.tag = 'pier';

  // ---- Pacific Park life (r2, Eric: "游乐场感觉有点冷清"): two midway game booths in front of the wheel, an ice-cream cart in the south-east
  // corner, benches and bins at the west end, lamps on the approach, gulls; three people, each doing one legible thing. Tagged 'pier' with the
  // rides: la_park's hull (the wheel and the oval) spans the deck, and the validator lets one element's parts interleave with its own hull.
  const Q = (key: string, x: number, y: number, z: number, c: string, r = 0) => bp.part(key, x + ox, DT + y, z + oz, c, r);   // y above the deck plates
  /** a midway game booth, 5 × 3 (+ the awning's overhang row), open to the south: walls 4 bricks high, a counter, a low shelf with the
   *  prizes, a roof of plates and a striped awning of curved slopes in two colours (the real booths' canvas) */
  const booth = (bx: number, bz: number, wall: string, stripe: [string, string], prize: 'teddy' | 'bottles') => {
    for (let c = 0; c < 4; c++) {
      Q(c % 2 ? 'brick_1x2' : 'brick_1x3', bx, 3 * c, bz, wall, 1); Q(c % 2 ? 'brick_1x3' : 'brick_1x2', bx + (c % 2 ? 2 : 3), 3 * c, bz, wall, 1);   // back wall, bond alternating
      for (const x of [bx, bx + 4]) Q('brick_1x2', x, 3 * c, bz + 1, wall);                                                                         // side walls / front pillars
    }
    Q('brick_1x3', bx + 1, 0, bz + 2, wall, 1);                                                                                                       // counter
    if (prize === 'teddy') { Q('tile_1x1', bx + 1, 3, bz + 2, 'White'); Q('plate_1x1', bx + 2, 3, bz + 2, 'White'); Q('tile_1x1', bx + 3, 3, bz + 2, 'White'); Q('teddy', bx + 2, 4, bz + 2, 'MediumNougat'); }   // a giant teddy sits on the counter, facing the crowd
    else { Q('tile_1x3', bx + 1, 3, bz + 2, 'White', 1); Q('brick_1x3', bx + 1, 0, bz + 1, 'DarkBluishGray', 1); Q('plate_1x3', bx + 1, 3, bz + 1, 'DarkBluishGray', 1); for (let i = 0; i < 3; i++) Q('bottle', bx + 1 + i, 4, bz + 1, 'TransGreen'); }   // ring toss: three bottles on a shelf a plate above the counter
    Q('plate_2x4', bx, 12, bz, wall); Q('plate_2x4', bx + 2, 12, bz, wall); Q('plate_1x4', bx + 4, 12, bz, wall);                                    // roof, its front row the awning's base
    for (let i = 0; i < 5; i++) Q('curve_1x2', bx + i, 13, bz + 2, stripe[i % 2]);                                                                   // the striped awning
    for (const z of [bz, bz + 1]) { Q('tile_1x2', bx, 13, z, wall, 1); Q('tile_1x1', bx + 2, 13, z, wall); Q('tile_1x2', bx + 3, 13, z, wall, 1); }
    take(bx, bz, 5, 3);
  };
  // the pair flanks the wheel (centres x −6 and 10, the wheel's axis at 2), each clear of the sightline past a coaster post from the default camera
  booth(fx(-8), fz(5), 'White', ['BrightRed', 'White'], 'teddy');
  booth(fx(8), fz(5), 'Yellow', ['BrightBlue', 'White'], 'bottles');

  // ice-cream cart (south-east corner, outside the coaster): two wheel plates on 2×2 risers (the wheels clear the planks), a white body with a
  // pink band, a display of scoops, a parasol on a bar in a hollow round plate
  const CX = fx(19), CZ = fz(12);
  for (const x of [CX, CX + 2]) { Q('plate_2x2', x, 0, CZ, 'DarkBluishGray'); Q('plate_2x2', x, 1, CZ, 'DarkBluishGray'); Q('wheelplate_2x2', x, 2, CZ, 'LightBluishGray', 1); Q('cart_wheel_l', x, 2, CZ, 'Black', 1); Q('cart_wheel_r', x, 2, CZ, 'Black', 1); }
  Q('plate_2x4', CX, 3, CZ, 'White', 1); Q('brick_2x4', CX, 4, CZ, 'White', 1); Q('plate_2x4', CX, 7, CZ, 'BrightPink', 1);
  Q('tile_1x2', CX, 8, CZ, 'White', 1); Q('tile_1x1', CX + 3, 8, CZ, 'White');                                                                     // the back of the top (the vendor's side), the parasol's bar between
  Q('roundplate_1x1', CX + 2, 8, CZ, 'White'); Q('bar_4l', CX + 2, 9, CZ, 'White'); Q('umbrella', CX + 2.5 - 3, 16, CZ + 0.5 - 3, 'Yellow');
  for (const [i, c] of [[0, 'BrightPink'], [1, 'White'], [2, 'Yellow'], [3, 'MediumNougat']] as [number, string][]) { Q('roundplate_1x1', CX + i, 8, CZ + 1, 'White'); Q('icecream_scoops', CX + i, 9, CZ + 1, c); }   // the display: four flavours
  take(CX, CZ, 4, 2);
  // west end: two pier benches facing the sea over the rail (north and south, mirrored), a round grey bin beside each
  for (const [z, r] of [[fz(12), 0], [fz(-14), 2]] as [number, number][]) { bp.assembly('la_pierbench', fx(-25) + ox, DT, z + oz, 'ReddishBrown', r); take(fx(-25), z, 4, 2); }
  for (const z of [fz(13), fz(-15)]) { Q('roundbrick_2x2', fx(-20), 0, z, 'LightBluishGray'); Q('roundtile_2x2', fx(-20), 3, z, 'DarkBluishGray'); take(fx(-20), z, 2, 2); }
  // approach: a white lamp each side (round brick, a bar, a frosted globe under a cone), a gull on the south one
  for (const z of [17, 26]) { P('round_1x1', 57, 9, z, 'White'); P('bar_4l', 57, 12, z, 'White'); P('roundplate_1x1', 57, 20, z, 'White'); P('round_1x1', 57, 21, z, 'TransClear'); P('cone_1x1', 57, 24, z, 'White'); take(57, z); }
  bp.part('seagull', 57 + ox, y0 + 27, 26 + oz, 'White', 3);
  // the people: the vendor at the cart, a kid with a cone, a visitor on the approach photographing the wheel
  minifig2(bp, CX + 5.5 + ox, DT, CZ + 1 + oz, 3, { legs: 'DarkBlue', torso: 'White', torsoPrint: 'torso_apron', face: 'face_smile', hair: 'Black', hairKey: 'hair_short', poses: { L: 'd', R: 'u' } }); take(CX + 5, CZ, 1, 2);   // a cell off the cart's end, side-on under the parasol's rim, one arm up calling the crowd
  const KID = { x: fx(17), z: fz(13.5) }; minifig2(bp, KID.x + ox, DT, KID.z + oz, 0, { legs: 'MediumAzure', torso: 'BrightPink', face: 'face_child', hair: 'DarkBrown', hairKey: 'hair_long', hold: [{ key: 'icecream_cone', color: 'Tan', hand: 'R' }] }); take(KID.x - 1, Math.floor(KID.z), 2, 1);
  const PH = { x: 60, z: 19 }; minifig2(bp, PH.x + ox, DT, PH.z + oz, 3, { legs: 'SandBlue', torso: 'SandGreen', torsoPrint: 'torso_tourist', face: 'face_la_grin', hair: 'ReddishBrown', hairKey: 'fig_hair', hold: [{ key: 'camera', color: 'Black', hand: 'R' }] }); take(PH.x, PH.z - 1, 1, 2);   // side-on (rot 3): the legs on cells x 60, z 18–19
  bp.tag = 'pier';

  // ---- planks across the pier (1×N tiles along z) over every free deck cell: staggered lengths, Dark Tan with a scatter of Medium Nougat
  // and Reddish Brown boards (v2's every-7th-row Medium Nougat read as stripes; a hash per board reads as weathered timber)
  const hash = (a: number, b: number) => { let h = (a * 374761393 + b * 668265263) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
  const board = (x: number, z: number) => { const r = hash(x, z * 7 + 3); return r < 0.1 ? 'MediumNougat' : r < 0.15 ? 'ReddishBrown' : 'DarkTan'; };
  const rows = new Map<number, number[]>(); for (const [x, z] of deckCells) if (!busy.has(k(x, z))) (rows.get(x) ?? rows.set(x, []).get(x)!).push(z);
  for (const [x, zs] of rows) {
    zs.sort((a, b) => a - b); let i = 0;
    while (i < zs.length) { let n = 1; while (i + n < zs.length && zs[i + n] === zs[i] + n) n++;
      let z = zs[i]; let left = n; let first = true;
      while (left > 0) { const want = first ? [2, 3, 4, 6, 8][Math.floor(hash(x, zs[i]) * 5)] : [6, 8, 8, 4, 6][Math.floor(hash(x, z) * 5)]; first = false;   // the first board of a run is short or long at random: the joints never line up
        const L = [8, 6, 4, 3, 2, 1].find((l) => l <= Math.min(left, want))!; P(`tile_1x${L}`, x, 9, z, board(x, z)); z += L; left -= L; }
      i += n; }
  }
  bp.tag = ''; return piles;
}

/** The arch's lettering (prints on two members of la_arch): the cartouche's 1×6 brick and the band's eastern raised arch, both facing east
 *  (the land side, where you walk in). Members of one id and colour are told apart by their position: the eastern row. */
function archLettering(bp: Blueprint, group: string) {
  const mine = bp.parts.filter((p) => p.member === group);
  for (const id of ['3009', '14707']) {
    const cand = mine.filter((p) => p.key === `ld_${id}`); const east = Math.max(...cand.map((p) => p.xform!.p[0]));
    for (const p of cand) if (p.xform!.p[0] === east) p.print = id === '3009' ? 'la_arch_cartouche' : 'la_arch_band';
  }
}

export function buildLaPier(bp: Blueprint): SceneMeta {
  const k = (x: number, z: number) => `${x},${z}`;
  const piles = placePier(bp, 0, 0, 0, (x) => (x < SHORE ? null : 3));

  // ---- sea and beach
  bp.tag = 'sea';
  for (let x = 0; x < SHORE; x++) for (let z = 0; z < D; z++) {
    const deep = x + (z % 5) * 0.6 < 22;                          // the bay darkens further out (west)
    bp.vox1('plate', x, 0, z, deep ? 'DarkBlue' : 'SandBlue');
    const ripple = ((x * 7 + z * 13) % 17) === 0;                 // a few trans plates: studs read as ripples (the Kyoto / Shanghai water)
    const foam = x === SHORE - 1 && (z % 3) !== 1;                // the surf line
    if (!piles.has(k(x, z))) bp.vox1(ripple || foam ? 'plate' : 'tile', x, 1, z, foam ? 'White' : 'TransLightBlue');
  }
  bp.tag = 'beach'; for (let x = SHORE; x < W; x++) for (let z = 0; z < D; z++) if (!piles.has(k(x, z))) for (let y = 0; y < 3; y++) bp.vox1('brick', x, y, z, x < SHORE + 2 ? 'DarkTan' : 'Tan');
  for (const key of piles) { const [x, z] = key.split(',').map(Number); if (x >= SHORE) for (let y = 0; y < 3; y++) bp.vox1('brick', x, y, z, x < SHORE + 2 ? 'DarkTan' : 'Tan'); }

  bp.tag = ''; bp.pack();
  return { id: 'la-pier', title: 'Santa Monica Pier', caption: 'Santa Monica Pier', subtitle: 'test scene', size: [W, D], center: [W / 2, 12, D / 2], camera: { az: 0.35, el: 0.22, dist: 120 } };
}
