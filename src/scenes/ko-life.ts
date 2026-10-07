// Seoul element test scene: every Seoul figure, alone on a grey plate (docs/refs/seoul-real/BUILD.md). ?scene=ko-life&noglobe
// The seven idols in the stage scheme's mirrored formation on a plain black deck (docs/refs/seoul-kpop/SCHEME.md §5.2), the two fans with
// light sticks in front of it, the royal gate guard on his granite stand, the hanbok visitor with her camera, and the chimaek picnic pair
// (an assembly: minifig2 cannot sit) on a patch of lawn. The island stage imports the helpers below.
import { Blueprint } from '../core/builder';
import { minifig2, type FigOpts2, type SceneMeta } from './lib';

const SKIN = 'Yellow';   // one skin for every Seoul figure (the series' figures are all Yellow; the scheme's Light Nougat idols would stand apart from the guard and the visitor)

// ---- idols (decision A, korea.md §1.7): seven, one stage outfit per variant, no names. r8 (Eric 2026-10-07): hair coloured and styled
// per member, a confident face (face_ko_idol2), and one choreography: the three on the west (the viewer's left) raise their outer hand, the
// three on the east mirror them, the centre holds the mic at his mouth. i = the formation's idol 1…7 − 1 (0 the centre; odd west, even east)
/** BTS outfit variant (Eric picked B, 2026-10-07): A = the ARIRANG black / dark-red jacket with gold frogging, B = white & gold suits */
export const BTS_VARIANT: 'A' | 'B' = 'B';
const OUTFIT = { A: { torso: 'Black', legs: 'Black', print: 'torso_ko_idol_a' }, B: { torso: 'White', legs: 'White', print: 'torso_ko_idol_b' } }[BTS_VARIANT];
type Pose = NonNullable<FigOpts2['poses']>['L'];
const UP_W: { L: Pose; R: Pose } = { L: 'd', R: 'u' }, UP_E: { L: Pose; R: Pose } = { L: 'u', R: 'd' };   // facing +z the right hand is on the west
const IDOL: { at: [number, number]; poses: { L: Pose; R: Pose }; mic?: boolean; hairKey: string; hair: string }[] = [
  { at: [10, 10.5], poses: { L: 'd', R: 'f' }, mic: true, hairKey: 'hair_midtousled', hair: 'Black' },   // centre, the mic at his mouth
  { at: [7, 8.5], poses: UP_W, hairKey: 'hair_sweptback', hair: 'LightBluishGray' },   // silver
  { at: [13, 8.5], poses: UP_E, hairKey: 'hair_tousled', hair: 'Tan' },                // platinum blonde
  { at: [4, 6.5], poses: UP_W, hairKey: 'hair_messy', hair: 'BrightPink' },            // pastel pink
  { at: [16, 6.5], poses: UP_E, hairKey: 'hair_wavy', hair: 'SandBlue' },              // ash blue
  { at: [8, 5.5], poses: UP_W, hairKey: 'hair_tousled', hair: 'DarkRed' },             // red
  { at: [12, 5.5], poses: UP_E, hairKey: 'hair_short', hair: 'MediumLavender' },       // lavender
];
/** formation feet (x, z) of idol i in the stage frame (SCHEME §5.2: the deck's west edge x 0, its north edge z 0, the figures facing +z) */
export const IDOL_AT = IDOL.map((d) => d.at);
export function idol(bp: Blueprint, x: number, y: number, z: number, rot: number, i: number) {
  const d = IDOL[i]; bp.tag = 'idols';
  minifig2(bp, x, y, z, rot, { legs: OUTFIT.legs, torso: OUTFIT.torso, torsoPrint: OUTFIT.print, skin: SKIN, face: 'face_ko_idol2', hair: d.hair, hairKey: d.hairKey, poses: d.poses, wrists: { L: d.poses.L === 'u', R: d.poses.R === 'u' } /* r3: a raised hand turned a quarter, the C open outward */, hold: d.mic ? [{ key: 'mic', color: 'Black', hand: 'R' }] : [] });
  bp.tag = '';
}

// ---- fans (SCHEME §5.4): backs to the camera, watching the stage; the light stick upright in the outer hand, held forward toward the stage
// (the scheme's raised `u` arm cannot hold it: that clip's bore runs front–back, and a stick lying front–back beside the raised hand passes
// through the head). The globe, at head height beside the head, is what the camera sees over their shoulders.
// Eric r8 (2026-10-07): six fans, mostly women — long hair or a bun, two in skirts; one man (index 2)
const FAN: FigOpts2[] = [
  { legs: 'DarkBlue', torso: 'MediumLavender', torsoPrint: 'torso_ko_hoodie', skin: SKIN, face: 'face_smile', hair: 'Black', hairKey: 'hair_long' },
  { legs: 'Black', skirt: 'Black', torso: 'White', torsoPrint: 'torso_ko_hoodie', skin: SKIN, face: 'face_smile', hair: 'DarkBrown', hairKey: 'hair_long' },
  { legs: 'Black', torso: 'DarkBluishGray', torsoPrint: 'torso_ko_jacket', skin: SKIN, face: 'face_grin', hair: 'Black', hairKey: 'hair_short' },
  { legs: 'DarkBlue', torso: 'Black', torsoPrint: 'torso_ko_jacket', skin: SKIN, face: 'face_smile', hair: 'Black', hairKey: 'hair_highbun' },
  { legs: 'Tan', skirt: 'Tan', torso: 'SandBlue', torsoPrint: 'torso_ko_jacket', skin: SKIN, face: 'face_smile', hair: 'Black', hairKey: 'hair_long' },
  { legs: 'DarkBlue', torso: 'MediumLavender', torsoPrint: 'torso_ko_hoodie', skin: SKIN, face: 'face_grin', hair: 'DarkBrown', hairKey: 'hair_topknot' },
];
// r2: Trans-Purple (the scheme's choice) renders at 0.62 opacity as a pale frosted cup — the pipeline's trans trap, even on one 1 × 1. An
// opaque Medium Lavender round brick reads as the lit purple globe.
const GLOBE = 'MediumLavender';
/** fan i, feet at (x, z) facing rot (2 = north, toward a stage to the north); hand: the one holding the stick (the outer one) */
export function fan(bp: Blueprint, x: number, y: number, z: number, rot: number, i: number, hand: 'L' | 'R' = i === 0 ? 'L' : 'R') {
  bp.tag = 'fans'; const n0 = bp.parts.length;
  minifig2(bp, x, y, z, rot, { ...FAN[i], hold: [{ key: 'lightstick_hilt', color: 'Black', hand }] });
  const hilt = bp.parts.slice(n0).find((p) => p.key === 'lightstick_hilt')!;
  // r4 (judge: a tall 1 × 1 round brick with its stud read as a purple can): a squat lamp — two 1 × 1 round plates on the hilt's top stud,
  // a 1 × 1 round tile on them, smooth on top
  // v2 r5 (judge r3: a lavender cylinder read as a cup): the ARMY Bomb's white globe with its lavender glow band on the black hilt
  bp.part('roundplate_1x1', hilt.x, hilt.y + 4.5, hilt.z, 'White'); bp.part('roundplate_1x1', hilt.x, hilt.y + 5.5, hilt.z, GLOBE); bp.part('roundtile_1x1', hilt.x, hilt.y + 6.5, hilt.z, 'White');
  bp.tag = '';
}

// ---- the royal gate guard (sumunjang; seoul-hangang SCHEME §5): red robe (skirt), black wide-brim hat with the pinned-up side at the back,
// the woldo upright in his right fist — r3 (judge: the halberd read European): a red spear pole with a crescent blade clipped round it under
// the spearhead, the crescent turned outward — its butt on a Light Bluish Gray 4 × 4 plate, the granite stand he and the pole share
export function guard(bp: Blueprint, x: number, y: number, z: number, rot: number) {
  bp.tag = 'guard';
  const r = rot & 3, cx = r % 2 ? Math.floor(x) + 0.5 : Math.round(x), cz = r % 2 ? Math.round(z) : Math.floor(z) + 0.5;   // minifig2's snap
  // the stand: the skirt's 2 × 2 (half a stud behind the feet) and the pole's butt (1.07 to the right, 1.51 in front) on one 4 × 4
  const [sx, sz] = [[-2, -1.5], [-1.5, -2], [-2, -2.5], [-2.5, -2]][r]; bp.part('plate_4x4', cx + sx, y, cz + sz, 'LightBluishGray');
  const n0 = bp.parts.length;
  minifig2(bp, cx, y + 1, cz, rot, { legs: 'BrightRed', skirt: 'BrightRed', torso: 'BrightRed', torsoPrint: 'torso_ko_guard', skin: SKIN, face: 'face_ko_guard', hair: 'Black', hairKey: 'hat_brimback', poses: { L: 'd' }, hold: [{ key: 'woldo_pole', color: 'BrightRed', hand: 'R' }] });
  const pole = bp.parts.slice(n0).find((p) => p.key === 'woldo_pole')!;
  bp.part('woldo_blade', pole.x, pole.y, pole.z, 'FlatSilver', pole.rot);   // the crescent clipped round the shaft: one origin, one cell (HOSTS)
  bp.tag = '';
}

// ---- the hanbok visitor (seoul-hanok SCHEME §4): Dark Pink chima (skirt), white jeogori with the red bow, hair in a bun, the camera raised
export function hanbokVisitor(bp: Blueprint, x: number, y: number, z: number, rot: number) {
  bp.tag = 'visitor';
  minifig2(bp, x, y, z, rot, { legs: 'DarkPink', skirt: 'DarkPink', torso: 'White', torsoPrint: 'torso_ko_hanbok', skin: SKIN, face: 'face_smile', hair: 'Black', hairKey: 'hair_bun', poses: { L: 'd' }, hold: [{ key: 'camera', color: 'Black', hand: 'R' }] });
  bp.tag = '';
}

// ---- the chimaek picnic pair (seoul-hangang SCHEME §4): one exploded assembly (tools/ldraw/asm-ko-life.mjs), 8 × 6 on the lawn's studs,
// facing +z at rot 0; r8: on cushions, the legs ending on the mat
export function picnicPair(bp: Blueprint, x: number, y: number, z: number, rot: number) {
  bp.tag = 'picnic';
  bp.assembly('ko_picnic', x, y, z, 'White', rot, { '973|SandBlue': 'torso_ko_hoodie_m', '973|DarkGreen': 'torso_ko_jacket_m', '3626c|Yellow': 'face_grin_m', '3068b|White': 'ko_chicken_box_m' });
  bp.tag = '';
}

export function buildKoLife(bp: Blueprint): SceneMeta {
  const W = 56, D = 32; bp.tag = 'ground'; for (let x = 0; x < W; x += 8) for (let z = 0; z < D; z += 8) bp.part('plate_8x8', x, 0, z, 'LightBluishGray');
  bp.tag = 'deck'; bp.fill('plate', 0, 1, 2, 21, 1, 12, 'Black');   // a plain black deck for the formation (stage frame: x 0, z 0 = deck x 0, z 2 − 2)
  bp.tag = 'lawn'; bp.fill('plate', 40, 1, 4, 12, 1, 10, 'Green');
  bp.tag = ''; bp.pack();

  IDOL.forEach((d, i) => idol(bp, d.at[0], 2, d.at[1] + 1, 0, i));   // the deck's top is y 2; stage frame z + 1 keeps the back row on the deck
  fan(bp, 7, 1, 18.5, 2, 0); fan(bp, 13, 1, 18.5, 2, 1);   // facing the deck; the sticks in the outer hands (her left at −x, his right at +x)
  guard(bp, 27, 1, 8, 0);
  hanbokVisitor(bp, 34, 1, 8.5, 0);
  picnicPair(bp, 42, 2, 6, 0);
  return { id: 'ko-life', title: 'Seoul figures', caption: 'Seoul figures', subtitle: 'test scene', size: [W, D], center: [W / 2, 4, D / 2], camera: { az: 0.2, el: 0.35, dist: 60 } };
}
