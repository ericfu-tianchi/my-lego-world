// Seoul element test scene: the BTS ARIRANG comeback stage on Gwanghwamun Square (21 March 2026) — the LED picture frame, the speaker towers,
// the deck with its thrust and the crowd barrier (docs/countries/korea.md §1.13, docs/refs/seoul-kpop/SCHEME.md option B, BUILD.md).
// ?scene=ko-stage&noglobe · ?only=frame | towers | deck | figs | standin (LED face: two-tone Dark Red / greys, picked from the swatch in BUILD.md)
// The idols and fans are minifig2 stand-ins at the scheme's formation (the real figures come from the ko-life worktree); the gate behind is a
// plain block stand-in (tag standin, not part of the element) at the island distance, for the "gate through the frame" sightline.
import { Blueprint } from '../core/builder';
import { minifig2, type SceneMeta } from './lib';

/** Stage-local grid: x 0–26 west → east, z 0–18 north → south (the LED face looks south); heights in plates above the square's ground G.
 *  r4 (lead, 2026-10-06): the frame grew to the real proportions (18 wide, opening 12 × 30 plates, core top 41), the towers to 46. */
export const STAGE = { w: 26, d: 18, deck: 3, frameTop: 41, towerTop: 46 } as const;
type Pose = 'd' | 'f' | 'h' | 'u';
/** The nine figures in stage-local coordinates: feet centre (x on a grid line, z on a cell centre), y = plates above G (3 = on the deck),
 *  rot 0 faces south (the crowd, the camera), rot 2 north (the fans watching). A V opening toward the frame: the lead on the thrust, then
 *  pairs 3, 6 and 9 studs either side, each pair two rows further back — every figure in its own column, none behind another from the south.
 *  Poses L / R and the held prop follow SCHEME §5.2 / §5.4. */
export const STAGE_FIGS: { role: 'idol' | 'fan'; n: number; x: number; y: number; z: number; rot: number; poses: { L: Pose; R: Pose }; holds?: 'mic' | 'lightstick'; hand?: 'L' | 'R' }[] = [
  { role: 'idol', n: 1, x: 13, y: 3, z: 13.5, rot: 0, poses: { L: 'u', R: 'f' }, holds: 'mic', hand: 'R' },   // lead, at the thrust's tip
  { role: 'idol', n: 2, x: 10, y: 3, z: 10.5, rot: 0, poses: { L: 'd', R: 'u' } },
  { role: 'idol', n: 3, x: 16, y: 3, z: 10.5, rot: 0, poses: { L: 'u', R: 'f' }, holds: 'mic', hand: 'R' },
  { role: 'idol', n: 4, x: 7, y: 3, z: 8.5, rot: 0, poses: { L: 'd', R: 'u' } },
  { role: 'idol', n: 5, x: 19, y: 3, z: 8.5, rot: 0, poses: { L: 'u', R: 'd' } },
  { role: 'idol', n: 6, x: 4, y: 3, z: 6.5, rot: 0, poses: { L: 'u', R: 'u' } },
  { role: 'idol', n: 7, x: 22, y: 3, z: 6.5, rot: 0, poses: { L: 'u', R: 'u' } },
  { role: 'fan', n: 1, x: 9, y: 0, z: 17.5, rot: 2, poses: { L: 'd', R: 'u' }, holds: 'lightstick', hand: 'R' },
  { role: 'fan', n: 2, x: 17, y: 0, z: 17.5, rot: 2, poses: { L: 'u', R: 'd' }, holds: 'lightstick', hand: 'L' },
];
/** deck cells (stage-local): main deck x 2–24 × z 5–12, thrust x 11–15 × z 12–15; the frame (x 4–22) has its own sill and tunnel floor on z 0–5 */
const onDeck = (x: number, z: number) => (x >= 2 && x < 24 && z >= 5 && z < 12) || (x >= 11 && x < 15 && z >= 12 && z < 15);
/** floor monitors: Black 45° slopes 2 × 1 at the deck's front edge, their faces turned up toward the idols (rot 2) */
const MONITORS: [number, number][] = [[6, 10], [19, 10]];

/** The stage at stage-local (0, 0) = grid (ox, oz) on ground G. `figs` false leaves the figures
 *  to the caller (the island swaps in the real idols and fans at STAGE_FIGS). */
export function placeStage(bp: Blueprint, ox: number, oz: number, G: number, o: { figs?: boolean } = {}) {
  bp.tag = 'frame'; bp.assembly('ko_frame', ox + 4, G, oz, 'Black');
  bp.tag = 'towers'; for (const x of [0, 24]) bp.assembly('ko_tower', ox + x, G, oz, 'Black');   // a stud of air between each tower and the frame (judge r1)
  // deck + thrust: Black, two plate layers and a tile top flush at G + 3; under each idol's feet a 2 × 1 window of studs (the tile left out)
  bp.tag = 'deck';
  const feet = new Set(STAGE_FIGS.filter((f) => f.y === 3).flatMap((f) => [`${f.x - 1},${Math.floor(f.z)}`, `${f.x},${Math.floor(f.z)}`]));
  for (const [x, z] of MONITORS) { feet.add(`${x},${z}`); feet.add(`${x},${z + 1}`); }   // studs under the monitors too
  for (let x = 0; x < STAGE.w; x++) for (let z = 0; z < STAGE.d; z++) {
    if (!onDeck(x, z)) continue;
    bp.vox1('plate', ox + x, G, oz + z, 'Black'); bp.vox1('plate', ox + x, G + 1, oz + z, 'Black');
    bp.vox1(feet.has(`${x},${z}`) ? 'plate' : 'tile', ox + x, G + 2, oz + z, 'Black');
  }
  // crowd barrier: three Black lattice fences on the square's studs, two studs south of the thrust
  for (const [x, z] of MONITORS) { bp.part('slope_1x2', ox + x, G + 3, oz + z, 'Black', 2); bp.part('tile_1x1', ox + x, G + 6, oz + z + 1, 'Black'); }   // a tile caps the slope's one stud (judge r2: it read as a button)
  for (const x of [7, 11, 15]) bp.part('fence_1x4', ox + x, G, oz + 16, 'Black');
  bp.tag = '';
  if (o.figs !== false) {
    bp.tag = 'figs';
    for (const f of STAGE_FIGS) minifig2(bp, ox + f.x, G + f.y, oz + f.z, f.rot, f.role === 'idol'
      ? { legs: 'Black', torso: 'Black', hair: 'Black', poses: f.poses }
      : { legs: 'DarkBlue', torso: 'MediumLavender', hair: 'Black', poses: f.poses });
    bp.tag = '';
  }
}

/** Gwanghwamun stand-in (tag standin, not part of the element): the gate's massing from seoul-palace/SCHEME.md §2 / §5 — granite base 26 × 12
 *  × 17 with three tunnels, two storeys and two roofs, ridge at 45 — as plain voxels, to judge what shows through and over the frame. */
function gateStandin(bp: Blueprint, x0: number, z0: number, G: number) {
  bp.tag = 'standin';
  const box = (x: number, z: number, w: number, d: number, y0: number, h: number, c: string) => bp.fill('brick', x0 + x, G + y0, z0 + z, w, h, d, c);
  box(0, 0, 26, 12, 0, 16, 'LightBluishGray'); bp.fill('plate', x0, G + 16, z0, 26, 1, 12, 'LightBluishGray');   // a plate course ties the tunnel heads
  for (const [x, w, h] of [[3, 4, 13], [10, 6, 14], [19, 4, 13]]) bp.clear(x0 + x, G, z0, w, h, 12);
  // no overhangs (a stand-in has no eave carpentry): each block stands on the one below, the roofs as plain grey masses
  box(1, 1, 24, 10, 17, 7, 'DarkRed'); box(1, 1, 24, 10, 24, 5, 'DarkBluishGray');
  box(2, 2, 22, 8, 29, 6, 'DarkRed'); box(2, 2, 22, 8, 35, 4, 'DarkBluishGray'); box(5, 4, 16, 4, 39, 3, 'DarkBluishGray'); box(6, 5, 14, 2, 42, 3, 'White');
  bp.tag = '';
}

export function buildKoStage(bp: Blueprint): SceneMeta {
  const W = 48, D = 36, G = 1, SX = 3, SZ = 18;
  bp.tag = 'ground'; for (let x = 0; x < W; x += 8) for (let z = 0; z < D; z += 8) bp.part('plate_8x8', x, 0, z, 'LightBluishGray');
  bp.tag = '';
  placeStage(bp, SX, SZ, G);
  // SCHEME §6.1: the frame face 8 studs south of the gate's front, the frame's centre 10 studs west of the gate's axis
  gateStandin(bp, SX + 13 + 10 - 13, SZ + 4 - 8 - 12, G);
  bp.compact = true; bp.pack();   // maximum-area packing: the deck's tile top took 94 parts with the legacy random packer
  return { id: 'ko-stage', title: 'K-pop Stage', caption: 'BTS comeback stage', subtitle: 'test scene', size: [W, D], center: [W / 2, 8, D / 2], camera: { az: 0, el: 0.4, dist: 70 } };
}

// ---- v2 (2026-10-06, docs/refs/seoul-island/LAYOUT-v2.md): the stage at the island's scale — low, in front of Gwanghwamun, its top level
// with the gate's granite base (G + 16), the LED a wall behind the idols, so the gate shows over it as in the composition reference.
/** Stage-local grid: x 0–24, z 0–12; speaker stacks x 0–2 and 22–24 on z 0–2, the LED wall x 3–21 on z 0–2 (face to z 2.8), the deck
 *  x 2–22 × z 3–9 (top G + 3), the barrier on z 10, the fans' feet on z 14.5 / 16.5. */
export const STAGE_S = { w: 24, d: 12, deck: 3, top: 16 } as const;
/** the seven idols in a shallow V opening toward the camera (the lead at the centre front), each in its own column; feet (x on a grid
 *  line, z a cell centre), facing +z; i = ko-life's idol index */
export const STAGE_S_IDOLS: { x: number; z: number; i: number }[] = [
  { x: 12, z: 7.5, i: 0 }, { x: 9, z: 6.5, i: 1 }, { x: 15, z: 6.5, i: 2 }, { x: 6, z: 5.5, i: 3 }, { x: 18, z: 5.5, i: 4 }, { x: 3, z: 4.5, i: 5 }, { x: 21, z: 4.5, i: 6 },
];
/** Eric r8 (2026-10-07): the audience — six fans (five women) three rows back from the barrier (z 10 → feet on z 14.5 / 16.5), in two
 *  staggered rows either side of the royal road's aisle (stage x 9–15, the gate's centre tunnel), facing the stage; i = ko-life's FAN index */
export const STAGE_S_FANS: { x: number; z: number; i: number; hand: 'L' | 'R' }[] = [
  { x: 2, z: 14.5, i: 0, hand: 'R' }, { x: 8, z: 14.5, i: 1, hand: 'L' }, { x: 16, z: 14.5, i: 2, hand: 'R' }, { x: 22, z: 14.5, i: 4, hand: 'L' },
  // the back row two rows behind (a stick held forward from one row back would pass through the fan in front); no skirts there (their
  // tube would land on the cycle path's first row)
  { x: 5, z: 16.5, i: 3, hand: 'R' }, { x: 19, z: 16.5, i: 5, hand: 'L' },   // their sticks between two heads of the row in front
];
/** the stage at stage-local (0, 0) = grid (ox, oz) on ground G, without figures; returns the stage-local cells whose ground must be studded */
export function placeStageS(bp: Blueprint, ox: number, oz: number, G: number): [number, number, number, number][] {
  bp.tag = 'frame'; bp.assembly('ko_frame_s', ox + 3, G, oz, 'Black');
  bp.tag = 'towers'; for (const x of [0, 22]) bp.assembly('ko_tower_s', ox + x, G, oz, 'Black');
  bp.tag = 'deck';
  const feet = new Set(STAGE_S_IDOLS.flatMap((f) => [`${f.x - 1},${Math.floor(f.z)}`, `${f.x},${Math.floor(f.z)}`]));
  for (let x = 2; x < 22; x++) for (let z = 3; z < 9; z++) {
    bp.vox1('plate', ox + x, G, oz + z, 'Black'); bp.vox1('plate', ox + x, G + 1, oz + z, 'Black');
    bp.vox1(feet.has(`${x},${z}`) ? 'plate' : 'tile', ox + x, G + 2, oz + z, 'Black');
  }
  for (const x of [6, 10, 14]) bp.part('fence_1x4', ox + x, G, oz + 10, 'Black');
  bp.tag = '';
  return [[0, 0, 24, 3], [2, 3, 20, 6], [6, 10, 12, 1], ...STAGE_S_FANS.map((f) => [f.x - 1, Math.floor(f.z), 2, 2] as [number, number, number, number])];   // 2 deep: a skirt's tube sits half a stud behind the feet
}
