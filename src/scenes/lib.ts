// Shared building grammar: reusable techniques, never finished buildings. Every function emits real parts
// and keeps stud connectivity (each piece sits on a stud of the piece below, or is a hollow-stud/bar pair).
import { Blueprint } from '../core/builder';
import { PARTS, footprint, PLATE } from '../core/catalog';
import { RIG } from '../parts/ldraw/minifig-rig';

/** `glow`: the scene's night mode (Shanghai, 2026-10-03) — which bricks light up after dark and in what colour (null: stays dark). */
export type GlowRule = (tag: string, color: string, key: string) => number | null;
export interface SceneMeta { id: string; title: string; caption: string; subtitle: string; size: [number, number]; center: [number, number, number]; base?: number; camera?: { az: number; el: number; dist: number }; viewDist?: number /* the set view's camera distance when the radius rule (2.15 × footprint radius) crops a tall or wide set */; glow?: GlowRule }
export interface SceneDef { seed: number; build: (bp: Blueprint) => SceneMeta }

export const key2 = (x: number, z: number) => x + ',' + z;
/** Deterministic patch noise for colour variation. */
export function patch(x: number, z: number, size: number, seed: number) { const px = Math.floor(x / size), pz = Math.floor(z / size); let h = (px * 73856093) ^ (pz * 19349663) ^ (seed * 83492791); h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }

/** Occupancy map for ground-level placement (what is reserved by structures, paths, water). */
export class Reserve {
  set = new Set<string>();
  add(x0: number, z0: number, w: number, d: number) { for (let x = x0; x < x0 + w; x++) for (let z = z0; z < z0 + d; z++) this.set.add(key2(x, z)); }
  has(x: number, z: number) { return this.set.has(key2(x, z)); }
}

// ---- minifigure (rig) ---------------------------------------------------------------------------------------
export interface FigOpts { legs: string; torso: string; hair?: string; hairKey?: string; hat?: 'kasa'; skin?: string; face?: string; torsoPrint?: string; headTurn?: 1 | 3 /* the head turned a quarter on the neck stud (a real minifig head turns): 1 = to the figure's left, 3 = right */ }

// ---- trees ------------------------------------------------------------------------------------------
type Piece = [number, number, '2x2' | '1x1' | 'flower' | 'cone'];
/** Canopy assembled from round plates on a half-stud grid centred on the trunk (2x2 plate tube over the trunk stud).
 *  Every listed piece rests on a stud of the layer below; layouts are hand-designed like real LEGO trees. */
export function canopyLayers(bp: Blueprint, x: number, y0: number, z: number, layers: Piece[][], colors: string[], reserve?: Reserve) {
  const ox = x - 0.5, oz = z - 0.5; // base 2x2 round plate centred on the trunk cell
  bp.part('roundplate_2x2', ox, y0, oz, bp.pick(colors)); reserve?.add(x - 1, z - 1, 3, 3);
  layers.forEach((layer, i) => { for (const [dx, dz, k] of layer) { const px = ox + dx, pz = oz + dz; if (k === '2x2') bp.part('roundplate_2x2', px, y0 + 1 + i, pz, bp.pick(colors)); else if (k === 'cone') bp.part('cone_1x1', px, y0 + 1 + i, pz, bp.pick(colors)); else bp.part(k === 'flower' ? 'flower_1x1' : 'roundplate_1x1', px, y0 + 1 + i, pz, bp.pick(colors)); if (reserve) reserve.add(Math.floor(px), Math.floor(pz), k === '2x2' ? 3 : 2, k === '2x2' ? 3 : 2); } });
}
const Q4: Piece[] = [[-1, -1, '2x2'], [1, -1, '2x2'], [-1, 1, '2x2'], [1, 1, '2x2']];                      // 4x4 block over the base
const CROSS: Piece[] = [[0, 0, '2x2'], [-2, 0, '2x2'], [2, 0, '2x2'], [0, -2, '2x2'], [0, 2, '2x2']];          // 6-wide cross over Q4
const CORNERS1: Piece[] = [[-1, -1, 'flower'], [2, -1, '1x1'], [-1, 2, '1x1'], [2, 2, 'flower']];                // corners of the cross (on Q4 studs)
const TIPS: Piece[] = [[-2, 0, 'flower'], [3, 1, '1x1'], [0, -2, '1x1'], [1, 3, 'flower']];                       // on the cross arms
export const CANOPY = {
  S: [Q4, [[0, 0, '2x2'], [-1, 1, 'flower'], [2, 0, 'flower']] as Piece[], [[0, 0, '1x1'], [1, 1, 'flower']] as Piece[]],
  M: [Q4, [...CROSS, ...CORNERS1], [...Q4, ...TIPS], [[0, 0, '2x2'], [-1, 0, 'flower'], [2, 1, '1x1']] as Piece[]],
  L: [Q4, [...CROSS, ...CORNERS1], [[-3, 0, '2x2'], [3, 0, '2x2'], [0, -3, '2x2'], [0, 3, '2x2'], ...Q4] as Piece[], [...CROSS, [-3, 1, 'flower'], [4, 0, '1x1'], [1, -3, '1x1'], [0, 4, 'flower']] as Piece[], [...Q4], [[0, 0, '2x2'], [-1, 0, 'flower'], [2, 1, 'flower']] as Piece[]],
  pine: [Q4, [[0, 0, '2x2'], [-1, 0, '1x1'], [2, 1, '1x1'], [0, -1, '1x1'], [1, 2, '1x1']] as Piece[], [[-1, 0, '2x2'], [1, -1, '2x2']] as Piece[], [[0, 0, '2x2']] as Piece[], [[0, 0, '1x1'], [1, 1, '1x1']] as Piece[], [[0, 0, 'cone']] as Piece[]],
};
const PINK = ['BrightPink', 'BrightPink', 'BrightPink', 'DarkPink', 'White', 'BrightPink', 'Pink'];
/** @deprecated v1 canopy tree, kept for the Tokyo sample. New countries use `sakura5`. */
export function sakura(bp: Blueprint, x: number, y: number, z: number, size: 'S' | 'M' | 'L', reserve?: Reserve) {
  const trunk = size === 'L' ? 3 : size === 'M' ? 2 : 1; bp.tag = 'sakura';
  for (let k = 0; k < trunk; k++) bp.part('round_1x1', x, y + k * 3, z, 'ReddishBrown');
  canopyLayers(bp, x, y + trunk * 3, z, CANOPY[size], PINK.filter((c) => c !== 'Pink'), reserve); bp.tag = '';
}
/** Low bush: 2x2 round plate on the grass with a few round plates on top. */
export function bush(bp: Blueprint, x: number, y: number, z: number, colors = ['Green', 'DarkGreen', 'BrightGreen'], reserve?: Reserve) {
  bp.part('roundplate_2x2', x, y, z, bp.pick(colors)); bp.part('roundplate_1x1', x, y + 1, z, bp.pick(colors)); bp.part('roundplate_1x1', x + 1, y + 1, z + 1, bp.pick(colors)); if (bp.chance(0.5)) bp.part('flower_1x1', x + 1, y + 1, z, bp.pick(['BrightPink', 'White', 'Magenta'])); reserve?.add(x, z, 2, 2);
}
export function bamboo(bp: Blueprint, x: number, yOrGround: number | ((x: number, z: number) => number), z: number, heights: number[], reserve?: Reserve) {
  bp.tag = 'bamboo'; const offs: [number, number][] = [[0, 0], [1, 1], [2, 0], [1, -1], [0, 2], [2, 2], [3, 1]];
  heights.forEach((h, i) => { const [dx, dz] = offs[i % offs.length]; const y = typeof yOrGround === 'function' ? yOrGround(x + dx, z + dz) : yOrGround; for (let k = 0; k < h; k++) { bp.part('round_1x1', x + dx, y + k * 4, z + dz, k % 2 ? 'Lime' : 'BrightGreen'); bp.part('roundplate_1x1', x + dx, y + k * 4 + 3, z + dz, 'Green'); } bp.part('bamboo_leaves', x + dx, y + h * 4, z + dz, 'Lime'); reserve?.add(x + dx, z + dz, 1, 1); });
  bp.tag = '';
}
// ---- garden furniture -----------------------------------------------------------------------------------
/** Stone lantern (tōrō): every piece on the centre stud of the piece below. */
export function stoneLantern(bp: Blueprint, x: number, y: number, z: number, reserve?: Reserve) {
  // A tōrō is one vertical axis. Every 1→2→1 width change goes through a 2×2 jumper (centre stud on top, tube over the stud below),
  // so nothing sits on a corner of the piece under it: base → post → 中台 → 火袋 → 笠 → 宝珠, all centred on the post.
  bp.tag = 'lantern'; const STONE = 'LightBluishGray';
  bp.part('jumper_2x2', x - 0.5, y, z - 0.5, STONE);                                  // 基礎: 2×2 jumper, centre stud carries the post
  bp.part('round_1x1', x, y + 1, z, STONE); bp.part('round_1x1', x, y + 4, z, STONE);   // 竿
  bp.part('jumper_2x2', x - 0.5, y + 7, z - 0.5, STONE);                              // 中台, tube over the post's stud
  bp.part('brick_1x1', x, y + 8, z, 'DarkBluishGray');                                // 火袋
  bp.part('dish_2x2', x - 0.5, y + 11, z - 0.5, STONE);                                // 笠
  bp.part('roundplate_1x1', x, y + 12, z, STONE); bp.part('cone_1x1', x, y + 13, z, STONE);   // 宝珠
  reserve?.add(x - 1, z - 1, 3, 3); bp.tag = '';
}
/** Paper lantern: base plate, trans-orange round brick, black cap. */
export function paperLantern(bp: Blueprint, x: number, y: number, z: number, print?: string, rot = 0) { bp.part('roundplate_1x1', x, y, z, 'Black'); bp.part('round_1x1', x, y + 1, z, 'TransOrange', rot, print); bp.part('roundplate_1x1', x, y + 4, z, 'Black'); }
export function fenceRun(bp: Blueprint, x: number, y: number, z: number, count: number, rot: number, color = 'ReddishBrown', reserve?: Reserve) {
  for (let i = 0; i < count; i++) { const fx = rot % 2 ? x : x + i * 4, fz = rot % 2 ? z + i * 4 : z; bp.part('fence_1x4', fx, y, fz, color, rot); reserve?.add(fx, fz, rot % 2 ? 1 : 4, rot % 2 ? 4 : 1); }
}

/** Plate layer W×D laid as 2-wide strips: the two x-strips run the full width (they carry the corners), the
 *  z-strips fill the middle of the sides, the interior is voxel-filled. An overhang of 1 stud stays connected because
 *  every strip has half its width over the support. */
export function overhangPlate(bp: Blueprint, x0: number, z0: number, W: number, D: number, y: number, color: string) {
  const strips = (len: number): number[] => { const out: number[] = []; let rest = len; for (const s of [8, 6, 4, 3, 2]) while (rest >= s) { out.push(s); rest -= s; } if (rest === 1) { out[out.length - 1] -= 1; out.push(2); } return out; };
  let x = x0; for (const s of strips(W)) { bp.part(s === 1 ? 'plate_1x2' : `plate_2x${s}`, x, y, z0, color, 1); bp.part(s === 1 ? 'plate_1x2' : `plate_2x${s}`, x, y, z0 + D - 2, color, 1); x += s; }
  if (D > 4) { let z = z0 + 2; for (const s of strips(D - 4)) { bp.part(s === 1 ? 'plate_1x2' : `plate_2x${s}`, x0, y, z, color, 0); bp.part(s === 1 ? 'plate_1x2' : `plate_2x${s}`, x0 + W - 2, y, z, color, 0); z += s; } }
  if (W > 4 && D > 4) bp.fill('plate', x0 + 2, y, z0 + 2, W - 4, 1, D - 4, color);
}
/** Plate layer laid as strips that span the full depth D (wall to wall), for roofs over hollow rooms.
 *  Strip widths are 2 with any odd leftover placed in the middle, never on an overhanging edge. */
export function spanPlates(bp: Blueprint, x0: number, z0: number, W: number, D: number, y: number, color: string) {
  const split = (len: number): number[] => { const out: number[] = []; let rest = len; for (const s of [8, 6, 4, 3, 2, 1]) while (rest >= s) { out.push(s); rest -= s; } return out; };
  const widths: number[] = []; const pairs = Math.floor(W / 2); for (let i = 0; i < pairs; i++) widths.push(2); if (W % 2 === 1) widths.splice(Math.floor(pairs / 2), 0, 1);
  let x = x0;
  for (const w of widths) { let z = z0; for (const s of split(D)) { const key = w === 2 ? (s === 1 ? 'plate_1x2' : `plate_2x${s}`) : `plate_1x${s}`; bp.part(key, x, y, z, color, w === 2 && s === 1 ? 1 : 0); z += s; } x += w; }
}

/** `spanPlates` turned a quarter: strips 2 deep (z) spanning the full width W (x), for roofs whose bearing walls run along z. */
export function spanPlatesX(bp: Blueprint, x0: number, z0: number, W: number, D: number, y: number, color: string) {
  const split = (len: number): number[] => { const out: number[] = []; let rest = len; for (const s of [8, 6, 4, 3, 2, 1]) while (rest >= s) { out.push(s); rest -= s; } return out; };
  const depths: number[] = []; const pairs = Math.floor(D / 2); for (let i = 0; i < pairs; i++) depths.push(2); if (D % 2 === 1) depths.splice(Math.floor(pairs / 2), 0, 1);
  let z = z0;
  for (const d of depths) { let x = x0; for (const s of split(W)) { const key = d === 2 ? (s === 1 ? 'plate_1x2' : `plate_2x${s}`) : `plate_1x${s}`; bp.part(key, x, y, z, color, d === 2 ? (s === 1 ? 0 : 1) : 1); x += s; } z += d; }
}

// ---- v2 grammar (2026-09-11): story layer with prints and held accessories, LDraw plant vocabulary ---------------------
/** Rotate a canonical offset (dx toward +x, dz toward +z) by rot quarter turns about Y (matches the renderer). */
export const rotv = (dx: number, dz: number, rot: number): [number, number] => { switch (rot & 3) { case 0: return [dx, dz]; case 1: return [dz, -dx]; case 2: return [-dx, -dz]; default: return [-dz, dx]; } };
export type Pose = 'd' | 'f' | 'h' | 'u';
export interface Hold { key: string; color: string; hand?: 'L' | 'R'; pose?: Pose; grip?: 'mid' | 'ground' | 'bottom'; rot?: number; print?: string; dx?: number; dy?: number; dz?: number }
export interface FigOpts2 extends FigOpts { hold?: Hold[]; poses?: { L?: Pose; R?: Pose } }
/** How each accessory sits in a hand: the arm pose that makes the grip real, and where the part's centre goes relative to the wrist. */
/** How each accessory sits in a hand: arm pose, the point of the part (relative to its box centre, canonical orientation) that goes into the
 *  hand's clip, and the part's rotation relative to the body per side so the part swings outward, never into the torso. */
type HoldDefault = Partial<Hold> & { gp?: [number, number, number]; rotL?: number; rotR?: number; shaft?: boolean /* the hand wraps a bar-sized neck or handle at gp, so only the height is checked */ };
const HOLD_DEFAULTS: Record<string, HoldDefault> = {
  pushbroom: { pose: 'f', grip: 'ground' }, bar_4l: { pose: 'f', grip: 'bottom' }, bar_3l: { pose: 'f', grip: 'bottom' },
  lantern: { pose: 'f', gp: [0, 1.3, 0] },                                  // the carrying loop above the body — that is what the hand closes on (gp is centre-relative)
  camera: { pose: 'h', gp: [-0.9, -0.08, -0.31] },                           // the hand closes on the side handle (a right-hand prop: the grip bar is on the camera's −x side), lens forward
  hand_fan: { pose: 'h', gp: [0, -0.85, 0] },                                // handle in the clip, blade standing in front of the chest
  cup: { pose: 'f', gp: [0, 0, -0.8], rotL: 3, rotR: 1 },                   // handle (−z canonical) turned toward the body, cup swings outward
  goblet: { pose: 'f', gp: [0, -0.4, 0] }, rice_bowl: { pose: 'f', gp: [0, -0.35, 0], dz: 0.2 }, bottle: { pose: 'f', gp: [0, 1.2, 0], shaft: true },   // held by the neck teapot: { pose: 'f', gp: [0, 0, 0.8], rotL: 1, rotR: 3 },
  tray: { pose: 'h', gp: [0, -0.34, -1.1] },                                // gripped by its near edge, its floor resting on the hands basket: { pose: 'f', gp: [0, 0.9, 0] },
  frypan: { pose: 'f', gp: [0, 0, -1.15], shaft: true },                    // the hand wraps the handle (−z canonical); pan level at waist height 2.7 studs in front — over a 5-plate stove
  icecream_cone: { pose: 'f', gp: [0, -0.57, 0], shaft: true },              // the cone's shaft in the clip, cone upright, scoops on its stud
  popsicle: { pose: 'f', gp: [0, -0.8, 0] },                                 // held by the stick
  paintbrush: { pose: 'f', gp: [0, -0.6, 0], shaft: true },                  // held low on the handle, bristles up
  palette: { pose: 'f', gp: [-0.9, 0, 0] },                                   // the thumb edge in the clip, the palette flat in front
  saxophone: { pose: 'f', gp: [0, -0.92, 0], shaft: true },                   // the LDraw origin is the grip on the body tube
  takeaway_cup: { pose: 'f', gp: [0, -0.7, 0], shaft: true },               // the tapered foot of the cup sits in the hand's clip, the dome lid up (Shanghai)
  briefcase: { pose: 'd', gp: [0, 0.72, 0], shaft: true, rotL: 1, rotR: 1 },   // the clip round the handle bar (its centre 0.72 above the box centre, from the mould), the case turned front-to-back so the bar runs through the clip — side-on, the bar crossed the clip and the hand missed it (Eric 2026-10-03)
};
/** Minifig v2: real LDraw legs / torso-with-posed-arms / hands / head, printed face and torso, any hair, accessories gripped in the hand.
 *  Feet centred at (cx, cz), plate level y, faces +z at rot 0. Returns wrist centres (world) for stacking more onto a held bar. */
export function minifig2(bp: Blueprint, cx: number, y: number, cz: number, rot: number, o: FigOpts2, reserve?: Reserve) {
  // feet on studs (2026-10-03, Eric: no figure stood with its feet in the studs): the legs are 2 × 1, so along the shoulders the centre sits on a
  // grid line (the two foot holes on two stud centres) and across it on a cell centre. Snap to that, never in between.
  if ((rot & 1) === 0) { cx = Math.round(cx); cz = Math.floor(cz) + 0.5; } else { cx = Math.floor(cx) + 0.5; cz = Math.round(cz); }
  reserve?.add(Math.floor(cx - 1), Math.floor(cz - 1), 3, 3);
  const holds = o.hold ?? []; const poses: { L: Pose; R: Pose } = { L: o.poses?.L ?? 'd', R: o.poses?.R ?? 'd' }; const held: Record<string, number> = {};
  for (const h of holds) { const side = h.hand ?? 'R'; const dflt = HOLD_DEFAULTS[h.key] ?? {}; poses[side] = h.pose ?? dflt.pose ?? 'f'; if (h.key === 'tray') { poses.L = 'h'; poses.R = 'h'; } }
  const place = (key: string, yy: number, color: string, print?: string, ox = 0, oz = 0, r = rot) => { const [fw, fd] = footprint(PARTS[key], r); const [dx, dz] = rotv(ox, oz, rot); bp.part(key, cx + dx - fw / 2, yy, cz + dz - fd / 2, color, r, print); };
  const skin = o.skin ?? 'Yellow';
  place('fig_legs', y, o.legs); place(`fig_torso_${poses.L}${poses.R}`, y + 6, o.torso, o.torsoPrint); place(`fig_hands_${poses.L}${poses.R}`, y + 6, skin); const hr = (rot + (o.headTurn ?? 0)) & 3; place('fig_head', y + 9, skin, o.face, 0, 0, hr);
  if (o.hat === 'kasa') place('fig_kasa', y + 12, 'Tan', undefined, 0, 0, hr); else if (o.hair) place(o.hairKey ?? 'fig_hair', y + 12, o.hair, undefined, 0, 0, hr);
  const torsoY = (y + 9) * PLATE; // torso origin (the neck) in world height
  const gripOf = (side: 'L' | 'R') => RIG.grip[`${side.toLowerCase()}${poses[side]}` as keyof typeof RIG.grip] as readonly [number, number, number];
  for (const h of holds) {
    const side = h.hand ?? 'R'; const dflt = HOLD_DEFAULTS[h.key] ?? {}; const def = PARTS[h.key]; const H = def.h * PLATE; const G = gripOf(side);
    const grip = h.grip ?? dflt.grip ?? 'mid'; const dx = h.dx ?? dflt.dx ?? 0, dy = h.dy ?? dflt.dy ?? 0, dz = h.dz ?? dflt.dz ?? 0;
    // an offset moves the part's grip point away from the hand's clip: past ~1/3 stud the hand closes on air (2026-10-03, Eric: the saxophone floated beside the hand)
    if (Math.hypot(dx, dy, dz) > 0.35) throw new Error(`grip offset: ${h.key} is moved ${Math.hypot(dx, dy, dz).toFixed(2)} studs away from the hand's clip — change the pose, the rotation or gp, not the offset`);
    const rel = h.rot ?? (side === 'L' ? dflt.rotL : dflt.rotR) ?? dflt.rot ?? 0; const gp = dflt.gp ?? [0, 0, 0]; const [gx, gz] = rotv(gp[0], gp[2], rel); // part grip point → hand clip centre
    let centerY = torsoY + G[1] - gp[1] + dy;
    if (grip === 'ground') centerY = y * PLATE + H / 2; else if (grip === 'bottom') centerY = torsoY + G[1] + H / 2 - 0.25;
    const py = Math.round((centerY - H / 2) / PLATE * 2) / 2; held[h.key] = py;
    // A hand grips a part at its surface. If the grip point sits deep inside the part's box the hand would be buried in it; if it sits
    // off the part the hand closes on air. Neither can be built, and both only show up in a close-up — so fail the build instead.
    // gp is measured from the box centre; the vertical extent is the real baked geometry when we have it.
    const e = def.ext ?? [-def.w / 2, def.w / 2, -def.d / 2, def.d / 2]; const lo = (def.extY ? def.extY[0] * PLATE : 0) - H / 2, hi = (def.extY ? def.extY[1] * PLATE : H) - H / 2;
    const shaft = !!def.bar || !!dflt.shaft || Math.min(e[1] - e[0], e[3] - e[2]) <= 0.4;   // a bar or a neck is gripped around its axis, so only the height matters
    const inset = Math.min(shaft ? 0.3 : Math.min(gp[0] - e[0], e[1] - gp[0], gp[2] - e[2], e[3] - gp[2]), gp[1] - lo, hi - gp[1]);
    if (inset > 0.45) throw new Error(`grip buried: ${h.key} is held ${inset.toFixed(2)} studs inside its own body — set gp to a point on its surface (edge, handle or shaft)`);
    if (inset < -0.25) throw new Error(`grip off-part: ${h.key} grip point is ${(-inset).toFixed(2)} studs outside the part — the hand would close on air`);
    place(h.key, py, h.color, h.print, G[0] - gx + dx, G[2] - gz + dz, (rel + rot) & 3);
  }
  const grips: Record<'L' | 'R', [number, number, number]> = { L: [0, 0, 0], R: [0, 0, 0] };
  for (const side of ['L', 'R'] as const) { const G = gripOf(side); const [dx, dz] = rotv(G[0], G[2], rot); grips[side] = [cx + dx, torsoY + G[1], cz + dz]; }
  return { y, grips, poses, held, cx, cz, rot };
}
/** Umbrella held up: 4L bar gripped low in a forward hand, canopy pushed onto its top, clear of the hair. */
export function holdUmbrella(bp: Blueprint, cx: number, y: number, cz: number, rot: number, o: FigOpts2, hand: 'L' | 'R', color: string, reserve?: Reserve) {
  const fig = minifig2(bp, cx, y, cz, rot, { ...o, hold: [...(o.hold ?? []), { key: 'bar_4l', color: 'Black', hand, pose: 'h' }] }, reserve); // arm level: the classic minifig parasol pose, canopy clear of any hairpiece
  const [gx, , gz] = fig.grips[hand]; const barTop = fig.held.bar_4l + PARTS.bar_4l.h;  // the canopy's hollow stud slides over the bar's top plate
  bp.part('umbrella', gx - 3, barTop - 1, gz - 3, color); return fig;
}
/** Nobori banner: a 4L bar standing in a hollow round plate, a trapezoid flag clipped to it (printable), for shop fronts and temple paths. */
export function banner(bp: Blueprint, x: number, y: number, z: number, rot: number, cloth: string, print?: string, pole = 'ReddishBrown') {
  bp.part('roundplate_1x1', x, y, z, 'DarkBluishGray'); bp.part('bar_4l', x, y + 1, z, pole);
  // flag: 1 × 3 footprint with the clip at its +z end (canonical); put that end on the pole so the cloth trails toward -z
  const [dx, dz] = rotv(0, -1, rot); const [fw, fd] = footprint(PARTS.flag_trapezoid, rot);
  bp.part('flag_trapezoid', x + 0.5 + dx - fw / 2, y + 4, z + 0.5 + dz - fd / 2, cloth, rot, print);
}
/** Low table: 1×1 round brick leg + 2×2 plate top, with what's on it. */
export function lowTable(bp: Blueprint, x: number, y: number, z: number, top: string, items: { key: string; color: string; dx: number; dz: number; print?: string; rot?: number }[]) {
  bp.part('round_1x1', x, y, z, 'DarkBrown'); bp.part('plate_2x2', x - 0.5, y + 3, z - 0.5, top);
  for (const it of items) { const [fw, fd] = footprint(PARTS[it.key], it.rot ?? 0); bp.part(it.key, x + it.dx - fw / 2 + 0.5, y + 4, z + it.dz - fd / 2 + 0.5, it.color, it.rot ?? 0, it.print); }
}
/** Blossom: hollow 1×1 round plate + 7-petal flower pinned into it. */
export function blossom(bp: Blueprint, x: number, y: number, z: number, plate: string, flower: string) { bp.part('roundplate_1x1', x, y, z, plate); bp.part('flower_7', x, y + 1, z, flower); }
const SAKURA_PLATE = ['BrightPink', 'BrightPink', 'White', 'DarkPink'], SAKURA_FLOWER = ['BrightPink', 'White', 'BrightPink', 'DarkPink', 'BrightPink'];

// ---- layout: breathing room is a rule, not a taste ------------------------------------------------------------------------
/** Registered footprints with a clearance radius; placing something too close throws, so crowding fails the build like a floating brick. */
export class Sites {
  private list: { name: string; x: number; z: number; r: number; group?: string }[] = [];
  constructor(public gap = 2) {}
  /** A long landmark (a terrace, a row of towers) registers as several sites sharing a `group`; members of one group do not check each other. */
  add(name: string, x: number, z: number, r: number, group?: string) {
    for (const s of this.list) { if (group && s.group === group) continue; const d = Math.hypot(s.x - x, s.z - z); const need = s.r + r + this.gap; if (d < need) throw new Error(`crowded: ${name} (${x},${z}) is ${d.toFixed(1)} from ${s.name} (${s.x},${s.z}); needs ${need}`); }
    this.list.push({ name, x, z, r, group });
  }
}

// ---- trees v3 (after LEGO Icons 10315 / 10281 and the gpt-image-2 reference): thin trunk, branch plates cantilevered
// at different heights in different directions, one blossom cluster per branch tip, air between clusters, crown on top --------
type Dir = 0 | 1 | 2 | 3; // branch direction: 0 → -z, 1 → -x, 2 → +z, 3 → +x  (rotv(0,-1,dir))
const SAKURA_LEAF = ['BrightPink', 'BrightPink', 'White', 'BrightPink', 'BrightPink'], SAKURA_BLOOM = ['BrightPink', 'DarkPink', 'White', 'BrightPink'];
/** One blossom cluster on a branch tip cell (tx, tz) at plate level y, fanning toward `dir`. Every piece rests on a stud below. */
function cluster(bp: Blueprint, tx: number, y: number, tz: number, dir: Dir, mid: [number, number], big: boolean) {
  bp.part('leaves_6x5', tx, y, tz, bp.pick(SAKURA_LEAF), (dir + 2) & 3);         // tip leaf fans outward
  bp.part('flower_1x1', tx, y + 1, tz, bp.pick(SAKURA_BLOOM));                     // on the leaf's stem stud
  bp.part('flower_7', tx, y + 2, tz, bp.pick(SAKURA_BLOOM));                       // pinned into the flower plate's hollow stud
  if (mid[0] !== tx || mid[1] !== tz) { bp.part('leaves_6x5', mid[0], y, mid[1], bp.pick(SAKURA_LEAF), (dir + 3) & 3); bp.part('flower_1x1', mid[0], y + 1, mid[1], bp.pick(SAKURA_BLOOM)); if (big) bp.part('flower_7', mid[0], y + 2, mid[1], bp.pick(SAKURA_BLOOM)); } // mid leaf fans sideways
}
/** Sakura v3. size S: 2 branch levels, M: 3, L: 4 (top ≈ 30 plates). dirs: main branch direction per level, default pinwheel.
 *  Each level is a node: a 2×2 plate on the trunk stud carries the main 1×2 branch (cluster at its tip and middle), a side leaf
 *  on the perpendicular cell and a pinned blossom on the diagonal — dense clusters, air between levels, trunk stays readable. */
/** @deprecated v3, kept for the parts sheet and the tree comparison scene. New countries use `sakura5`. */
export function sakura3(bp: Blueprint, x: number, y: number, z: number, size: 'S' | 'M' | 'L', reserve?: Reserve, dirs?: Dir[]) {
  bp.tag = 'sakura'; const levels = size === 'L' ? 4 : size === 'M' ? 3 : 2; const step = size === 'L' ? 6 : 5; const d = dirs ?? ([3, 0, 1, 2] as Dir[]);
  let ty = y;
  for (let k = 0; k < levels; k++) {
    const bricks = Math.floor(step / 3), rem = step % 3; for (let b = 0; b < bricks; b++) bp.part('round_1x1', x, ty + b * 3, z, k === 0 ? 'DarkBrown' : 'ReddishBrown'); for (let r = 0; r < rem; r++) bp.part('roundplate_1x1', x, ty + bricks * 3 + r, z, 'ReddishBrown'); ty += step;
    const dir = d[k % 4]; const [ux, uz] = rotv(0, -1, dir); const d2 = ((dir + (k % 2 ? 1 : 3)) & 3) as Dir; const [vx, vz] = rotv(0, -1, d2);
    bp.part('plate_2x2', Math.min(x, x + ux, x + vx), ty, Math.min(z, z + uz, z + vz), 'ReddishBrown');                       // node on the trunk stud (tube over stud is not needed: corner cell is the trunk)
    bp.part('plate_1x2', Math.min(x + ux, x + 2 * ux), ty + 1, Math.min(z + uz, z + 2 * uz), 'ReddishBrown', ux ? 1 : 0);          // main branch, one cell on the node
    cluster(bp, x + 2 * ux, ty + 2, z + 2 * uz, dir, [x + ux, z + uz], k < levels - 1 && k % 2 === 0);
    if (size !== 'S') { bp.part('leaves_6x5', x + vx, ty + 1, z + vz, bp.pick(SAKURA_LEAF), (d2 + 2) & 3); bp.part('flower_1x1', x + vx, ty + 2, z + vz, bp.pick(SAKURA_BLOOM)); } // side leaf
    blossom(bp, x + ux + vx, ty + 1, z + uz + vz, bp.pick(SAKURA_LEAF), bp.pick(SAKURA_BLOOM));                                  // diagonal blossom
    ty += 1; // trunk continues on the node's corner cell
  }
  bp.part('round_1x1', x, ty, z, 'ReddishBrown'); bp.part('roundplate_2x2', x - 0.5, ty + 3, z - 0.5, bp.pick(SAKURA_LEAF)); // crown hub (tube over stud)
  for (const [dx, dz] of [[-0.5, -0.5], [0.5, -0.5], [0.5, 0.5], [-0.5, 0.5]]) { if (bp.chance(0.5)) blossom(bp, x + dx, ty + 4, z + dz, bp.pick(SAKURA_LEAF), bp.pick(SAKURA_BLOOM)); else bp.part('flower_1x1', x + dx, ty + 4, z + dz, bp.pick(SAKURA_BLOOM)); }
  reserve?.add(x - 1, z - 1, 3, 3); bp.tag = '';
}
/** Japanese garden pine v3: layered flat "cloud" tiers of 6×5 leaves on a dark trunk, tiers rotated and thinning upward, cone top. */
/** @deprecated flat cloud tiers, kept for the parts sheet; new countries use sakura5(..., 'pine'). New countries use `sakura5`. */
export function pine3(bp: Blueprint, x: number, y: number, z: number, tiers = 3, reserve?: Reserve) {
  bp.tag = 'pine'; let ty = y; const hx = x - 0.5, hz = z - 0.5;
  for (let t = 0; t < tiers; t++) {
    const seg = t === 0 ? 6 : 4; const bricks = Math.floor(seg / 3); for (let b = 0; b < bricks; b++) bp.part('round_1x1', x, ty + b * 3, z, 'DarkBrown'); for (let r = 0; r < seg % 3; r++) bp.part('roundplate_1x1', x, ty + bricks * 3 + r, z, 'DarkBrown'); ty += seg;
    bp.part('roundplate_2x2', hx, ty, hz, 'DarkGreen');
    const corners: [number, number, number][] = [[hx, hz, 0], [hx + 1, hz, 1], [hx + 1, hz + 1, 2], [hx, hz + 1, 3]];
    corners.forEach(([sx, sz, rot], i) => { if (t === tiers - 1 && i % 2 === 1) return; bp.part(t === 0 ? 'leaves_6x5' : 'leaves_4x3', sx, ty + 1, sz, i % 2 ? 'Green' : 'DarkGreen', (rot + 2 + t) & 3); });
    bp.part('jumper_2x2', hx, ty + 2, hz, 'DarkGreen'); ty += 3;
  }
  bp.part('roundplate_1x1', x, ty, z, 'DarkGreen'); bp.part('cone_1x1', x, ty + 1, z, 'DarkGreen');
  reserve?.add(x - 1, z - 1, 3, 3); bp.tag = '';
}

// ---- cherry trees, built the way LEGO's own sakura sets are built -----------------------------------------------------------
// sakuraA — LEGO Icons 10315 Tranquil Garden: flat blossom clusters tiled at different heights and rotations (study, kept for ?scene=trees).

/** One blossom cluster, after LEGO 10315 step 143: a 3-leaf plate as the calyx, a 6x5 leaf as the branchlet mass, a 5-petal
 *  flower pressed onto the leaf's centre stud and a 7-petal flower pinned into that. Four real elements, every one on a stud. */
export function blossomCluster(bp: Blueprint, x: number, y: number, z: number, rot: number, leaf: string, petal: string, pin: string) {
  bp.part('plant_3leaves', x, y, z, 'ReddishBrown');
  bp.part('leaves_6x5', x, y + 1, z, leaf, rot);
  bp.part('petal_1x1', x, y + 2, z, petal);
  bp.part('flower_7', x, y + 3, z, pin);
}
/** Sakura A — 10315: a bare tapered trunk, then tiers of branch plates carrying overlapping flat clusters, with loose flowers
 *  on the spare branch studs. White is the structural colour: it separates the pink blossoms instead of letting them mass. */
/** @deprecated 10315 tiling study, kept for the tree comparison scene. New countries use `sakura5`. */
export function sakuraA(bp: Blueprint, x: number, y: number, z: number, size: 'S' | 'M' | 'L', reserve?: Reserve) {
  bp.tag = 'sakura'; const LEAF = ['White', 'White', 'BrightPink', 'White'], BLOOM = ['BrightPink', 'DarkPink', 'BrightPink', 'White'];
  let cx = x, cz = z, ty = y;
  if (size !== 'S') { bp.part('roundbrick_2x2', cx - 0.5, ty, cz - 0.5, 'DarkBrown'); ty += 3; cx -= 0.5; cz -= 0.5; }
  const bare = size === 'L' ? 3 : 2;
  for (let k = 0; k < bare; k++) { bp.part('round_1x1', cx, ty, cz, k ? 'ReddishBrown' : 'DarkBrown'); ty += 3; }
  const tiers = size === 'S' ? 1 : 2;
  for (let t = 0; t < tiers; t++) {
    const hx = cx - 0.5, hz = cz - 0.5, reach = t === 0 && size !== 'S' ? 3 : 2;
    bp.part('roundplate_2x2', hx, ty, hz, 'ReddishBrown');
    const arms: [number, number, number, number, number][] = [                 // [plate x, plate z, plate rot, tip x, tip z]
      [hx, hz - (reach - 1), 0, hx, hz - (reach - 1)],
      [hx + 1, hz + 1, 0, hx + 1, hz + reach],
      [hx - (reach - 1), hz + 1, 1, hx - (reach - 1), hz + 1],
      [hx + 1, hz, 1, hx + reach, hz],
    ];
    arms.forEach(([ax, az, r, tx, tz], i) => {
      bp.part(reach === 3 ? 'plate_1x3' : 'plate_1x2', ax, ty + 1, az, 'ReddishBrown', r);
      blossomCluster(bp, tx, ty + 2, tz, (i + 2) & 3, bp.pick(LEAF), bp.pick(BLOOM), bp.pick(BLOOM));
      if (reach === 3) { const mx = (ax === tx ? ax : (ax + tx) / 2 | 0), mz = (az === tz ? az : (az + tz) / 2 | 0);  // a loose flower on the spare middle stud
        if (mx !== tx || mz !== tz) { bp.part('petal_1x1', mx, ty + 2, mz, bp.pick(BLOOM)); bp.part('flower_7', mx, ty + 3, mz, bp.pick(BLOOM)); } }
    });
    if (t < tiers - 1) { cx = hx; cz = hz; bp.part('round_1x1', cx, ty + 2, cz, 'ReddishBrown'); bp.part('round_1x1', cx, ty + 5, cz, 'ReddishBrown'); ty += 8; }  // clear air between tiers
    else { blossomCluster(bp, cx, ty + 2, cz, 0, 'White', bp.pick(BLOOM), bp.pick(BLOOM)); }
  }
  reserve?.add(Math.floor(x) - 2, Math.floor(z) - 2, 5, 5); bp.tag = '';
}

// ---- sakura v4 — the LEGO Masters way, on the 10315 cluster ---------------------------------------------------------------------
// What makes a brick cherry tree read as a tree rather than a coat rack (10315, 21060, 40725, LEGO Masters garden builds):
//   · the trunk leans — it steps one stud sideways at every fork instead of rising as a pole;
//   · limbs are unequal — three per fork, different lengths, never a symmetric pinwheel; one direction can be left bare (a wall side);
//   · one cluster per tip, at staggered heights, so neighbouring leaves interleave into a broad canopy without touching;
//   · white is a structural colour — it separates the pink masses and reads as light on petals;
//   · loose blossoms sit on the bare branch studs, so the branches read as flowering wood, not sticks carrying discs.
// Every connection is a real stud: hub plate on the trunk stud, branch plates on hub studs, calyx on the tip stud, leaf on the calyx,
// flower plate on the leaf's centre stud, 7-petal flower pinned in the flower plate.
type Limb = { dir: Dir; len: 2 | 3 | 4; lift: 0 | 2 | 4 };   // branch plate length; plates under the tip cluster (staggers leaf height by whole clusters)
const SAKURA4: Record<'S' | 'M' | 'L', { trunk: number; gap: number; tiers: Limb[][]; big: boolean }> = {
  L: { trunk: 12, gap: 6, big: true, tiers: [[{ dir: 3, len: 4, lift: 0 }, { dir: 2, len: 3, lift: 2 }, { dir: 0, len: 2, lift: 4 }], [{ dir: 3, len: 2, lift: 2 }, { dir: 2, len: 3, lift: 0 }, { dir: 1, len: 3, lift: 4 }]] },
  M: { trunk: 6, gap: 6, big: true, tiers: [[{ dir: 3, len: 3, lift: 0 }, { dir: 2, len: 2, lift: 2 }, { dir: 1, len: 2, lift: 4 }], [{ dir: 3, len: 2, lift: 0 }, { dir: 0, len: 2, lift: 2 }]] },
  S: { trunk: 6, gap: 0, big: false, tiers: [[{ dir: 3, len: 2, lift: 0 }, { dir: 2, len: 2, lift: 2 }, { dir: 0, len: 2, lift: 4 }]] },
};
const S4_LEAF = ['White', 'White', 'White', 'BrightPink', 'BrightPink'], S4_BLOOM = ['BrightPink', 'DarkPink', 'BrightPink', 'White'];
/** One blossom cluster on a tip stud: calyx → 6×5 leaf fanning `rot`-ward → (big) a 4×3 leaf crossed over it → 5-petal flower plate →
 *  7-petal flower pinned in. The crossed second leaf is what turns a flat disc into a blossom mass. */
export type Foliage = 'sakura' | 'pine' | 'raintree' | 'linden' | 'plane';   // add a kind per country: leaf colours + whether tips carry flowers
// linden (Prague): dense late-summer green, darker than the rain tree
const PINE_LEAF = ['DarkGreen', 'DarkGreen', 'Green'], RAIN_LEAF = ['Green', 'Green', 'DarkGreen', 'BrightGreen'], LINDEN_LEAF = ['Green', 'DarkGreen', 'Green', 'DarkGreen', 'BrightGreen'];   // rain tree: fresh green umbrella (Singapore)
const PLANE_LEAF = ['OliveGreen', 'OliveGreen', 'DarkTan', 'MediumNougat', 'BrightLightOrange'];   // Shanghai plane tree in autumn: ochre, not yellow (china.md §1.9.7)
function cluster4(bp: Blueprint, tx: number, y: number, tz: number, rot: number, big: boolean, kind: Foliage = 'sakura') {
  const LEAF = kind === 'pine' ? PINE_LEAF : kind === 'raintree' ? RAIN_LEAF : kind === 'linden' ? LINDEN_LEAF : kind === 'plane' ? PLANE_LEAF : S4_LEAF;
  bp.part('plant_3leaves', tx, y, tz, kind === 'sakura' ? 'ReddishBrown' : 'DarkBrown');
  bp.part(big ? 'leaves_6x5' : 'leaves_4x3', tx, y + 1, tz, bp.pick(LEAF), rot);
  let top = y + 2;
  if (big) { bp.part('leaves_4x3', tx, top, tz, bp.pick(LEAF), (rot + (bp.chance(0.5) ? 1 : 3)) & 3); top++; }
  if (kind !== 'sakura') { bp.part('leaves_4x3', tx, top, tz, bp.pick(LEAF), (rot + 2) & 3); return; }   // pine clouds and rain-tree umbrellas are three leaves deep, no flower
  bp.part('petal_1x1', tx, top, tz, bp.pick(S4_BLOOM));
  bp.part('flower_7', tx, top + 1, tz, bp.pick(S4_BLOOM));
}
/** Sakura v4. (x, z) = trunk cell at ground level y. `turn` rotates the whole limb pattern (so three trees never match);
 *  `skip` leaves that world direction bare (the side facing a roof or wall). Canopy radius ≈ L 7 · M 6 · S 4 studs; height ≈ L 30 · M 22 · S 14 plates. */
/** @deprecated v4 leaning trunk, kept for the comparison scene. New countries use `sakura5`. */
export function sakura4(bp: Blueprint, x: number, y: number, z: number, size: 'S' | 'M' | 'L', reserve?: Reserve, turn = 0, skip?: Dir | Dir[], kind: Foliage = 'sakura') {
  bp.tag = kind; const spec = SAKURA4[size]; const bare = new Set<Dir>(skip === undefined ? [] : Array.isArray(skip) ? skip : [skip]); const bare0 = [...bare][0];
  const TRUNK = kind === 'pine' ? 'DarkBrown' : 'ReddishBrown';
  const W = (lx: number, lz: number): [number, number] => { const [dx, dz] = rotv(lx, lz, turn); return [x + dx, z + dz]; };
  const corner = (cells: [number, number][]): [number, number] => [Math.min(...cells.map((c) => c[0])), Math.min(...cells.map((c) => c[1]))];
  let lx = 0, lz = 0, ty = y;
  { const [bx, bz] = corner([W(-1, -1), W(0, -1), W(-1, 0), W(0, 0)]); bp.part('roundbrick_2x2', bx, ty, bz, 'DarkBrown'); ty += 3; }   // root flare; trunk rises from its corner stud
  for (let k = 0; k < spec.trunk; k += 3) { const [wx, wz] = W(lx, lz); bp.part('round_1x1', wx, ty, wz, k === 0 ? 'DarkBrown' : TRUNK); ty += 3; }
  spec.tiers.forEach((limbs, t) => {
    const [hx, hz] = corner([W(lx, lz), W(lx + 1, lz), W(lx, lz + 1), W(lx + 1, lz + 1)]); bp.part('plate_2x2', hx, ty, hz, TRUNK);   // fork: 2×2 plate on the trunk stud
    for (const limb of limbs) {
      const wd = ((limb.dir + turn) & 3) as Dir; if (bare.has(wd)) continue;
      const root: [number, number] = limb.dir === 3 ? [lx + 1, lz] : limb.dir === 2 ? [lx, lz + 1] : [lx, lz];           // each limb leaves from its own hub stud
      const [ux, uz] = rotv(0, -1, limb.dir); const cells: [number, number][] = []; for (let k = 0; k < limb.len; k++) cells.push(W(root[0] + ux * k, root[1] + uz * k));
      const [px, pz] = corner(cells); bp.part(`plate_1x${limb.len}`, px, ty + 1, pz, TRUNK, cells[0][0] !== cells[limb.len - 1][0] ? 1 : 0);
      const [tx, tz] = cells[limb.len - 1];
      if (limb.lift === 4) { bp.part('round_1x1', tx, ty + 2, tz, TRUNK); bp.part('roundplate_1x1', tx, ty + 5, tz, TRUNK); }   // a twig rising from the tip
      else for (let s = 0; s < limb.lift; s++) bp.part('roundplate_1x1', tx, ty + 2 + s, tz, TRUNK);
      cluster4(bp, tx, ty + 2 + limb.lift, tz, (wd + 2) & 3, spec.big, kind);
      if (kind === 'sakura') for (let k = 1; k < limb.len - 1; k++) { const [mx, mz] = cells[k]; bp.part('petal_1x1', mx, ty + 2, mz, bp.pick(S4_BLOOM)); if (k % 2) bp.part('flower_7', mx, ty + 3, mz, bp.pick(S4_BLOOM)); }   // loose blossoms along the branch
    }
    lx += 1; lz += 1; ty += 1;                                                                                             // the trunk continues on the hub's diagonal stud: the lean
    if (t < spec.tiers.length - 1) { for (let k = 0; k < spec.gap; k += 3) { const [wx, wz] = W(lx, lz); bp.part('round_1x1', wx, ty + k, wz, TRUNK); } ty += spec.gap; }
  });
  const [cx, cz] = W(lx, lz); bp.part('round_1x1', cx, ty, cz, TRUNK); bp.part('roundplate_open', cx, ty + 3, cz, TRUNK);   // leader
  cluster4(bp, cx, ty + 4, cz, bare0 !== undefined ? (bare0 + 2) & 3 : (1 + turn) & 3, false, kind);                       // crown fans away from the bare side
  if (kind === 'pine') bp.part('cone_1x1', cx, ty + 7, cz, 'DarkGreen');                                                    // pine tip
  reserve?.add(x - 2, z - 2, 6, 6); bp.tag = '';
}

// ---- roof and railing helpers: the four-way symmetries a scene must never hand-rotate ------------------------------------------
/** Four hip-roof corner slopes with the high vertex toward the ridge. `cornerSlope` puts its high point at (−x, −z), so
 *  SE = rot 0, NE = rot 1, NW = rot 2, SW = rot 3. Hand-rotating these got two corners backwards in two buildings (Eric, 2026-09-18). */
export function hipCorners(bp: Blueprint, part: 'slope_corner_2x2' | 'slope_corner_3x3', x0: number, z0: number, W: number, D: number, y: number, color: string) {
  const s = PARTS[part].w;
  bp.part(part, x0 + W - s, y, z0 + D - s, color, 0); bp.part(part, x0 + W - s, y, z0, color, 1); bp.part(part, x0, y, z0, color, 2); bp.part(part, x0, y, z0 + D - s, color, 3);
}
/** Railing around a walkway of W × D cells: corner caps, fence 1×4 segments and round-brick posts laid out symmetrically on each
 *  side — the run never leaves an odd short gap at one end. */
export function railing(bp: Blueprint, x0: number, z0: number, W: number, D: number, y: number, color: string) {
  const layout = (n: number): ('F' | 'P' | '.')[] => {          // fill n inner cells with 4-long fences and 1-cell posts, mirror-symmetric
    const out: ('F' | 'P' | '.')[] = new Array(n).fill('.'); let lo = 0, hi = n - 1;
    while ((hi - lo + 1) % 4 !== 0 && lo < hi) { out[lo] = 'P'; out[hi] = 'P'; lo++; hi--; }
    for (let i = lo; i + 3 <= hi; i += 4) out[i] = 'F';
    if ((hi - lo + 1) % 4 !== 0) for (let i = lo; i <= hi; i++) if (out[i] === '.') out[i] = 'P';
    return out;
  };
  const run = (n: number, cell: (i: number) => [number, number], alongX: boolean) => {
    layout(n).forEach((k, i) => { const [cx, cz] = cell(i + 1); if (k === 'F') bp.part('fence_1x4', cx, y, cz, color, alongX ? 0 : 1); else if (k === 'P') bp.part('round_1x1', cx, y, cz, color); });
  };
  run(W - 2, (i) => [x0 + i, z0], true); run(W - 2, (i) => [x0 + i, z0 + D - 1], true);
  run(D - 2, (i) => [x0, z0 + i], false); run(D - 2, (i) => [x0 + W - 1, z0 + i], false);
  for (const [cx, cz] of [[x0, z0], [x0 + W - 1, z0], [x0, z0 + D - 1], [x0 + W - 1, z0 + D - 1]]) bp.part('roundplate_1x1', cx, y, cz, color);
}

// ---- sakura v5 — symmetric about its own axis --------------------------------------------------------------------------------
// Eric (2026-09-18): a trunk stuck on one corner of a round stump, and a crown heavy on one side, read as mistakes. So: the trunk is a
// 2×2 round column centred on the axis point (x, z); at each fork the four corner studs each carry one branch plate (a pinwheel that
// alternates direction between forks so it never swirls); the next trunk segment rides on the four inner plate ends; the crown sits on
// a 2×2 jumper's centre stud. Unequal limb lengths and staggered tip heights keep it from reading mechanical; `skip` leaves a side bare.
type Limb5 = { len: 2 | 3 | 4; lift: 0 | 2 | 4 };
const SAKURA5: Record<'S' | 'M' | 'L', { trunk: number; gap: number; tiers: Limb5[][]; big: boolean }> = {
  L: { trunk: 4, gap: 2, big: true, tiers: [[{ len: 4, lift: 0 }, { len: 3, lift: 2 }, { len: 4, lift: 4 }, { len: 3, lift: 2 }], [{ len: 3, lift: 2 }, { len: 4, lift: 0 }, { len: 3, lift: 4 }, { len: 4, lift: 2 }], [{ len: 2, lift: 0 }, { len: 3, lift: 2 }, { len: 2, lift: 4 }, { len: 3, lift: 2 }]] },
  M: { trunk: 3, gap: 1, big: true, tiers: [[{ len: 3, lift: 0 }, { len: 2, lift: 2 }, { len: 3, lift: 4 }, { len: 2, lift: 2 }], [{ len: 2, lift: 0 }, { len: 2, lift: 2 }, { len: 2, lift: 4 }, { len: 2, lift: 2 }]] },
  S: { trunk: 2, gap: 0, big: false, tiers: [[{ len: 2, lift: 0 }, { len: 2, lift: 2 }, { len: 2, lift: 4 }, { len: 2, lift: 2 }]] },
};
const RAINTREE: Record<'S' | 'M' | 'L', { trunk: number; gap: number; tiers: Limb5[][]; big: boolean }> = {   // the umbrella: tiers widen upward, a tall clear trunk under them (Samanea saman)
  L: { trunk: 7, gap: 1, big: true, tiers: [[{ len: 2, lift: 0 }, { len: 3, lift: 2 }, { len: 2, lift: 4 }, { len: 3, lift: 2 }], [{ len: 4, lift: 2 }, { len: 4, lift: 0 }, { len: 4, lift: 2 }, { len: 4, lift: 0 }]] },
  M: { trunk: 4, gap: 1, big: true, tiers: [[{ len: 2, lift: 0 }, { len: 2, lift: 2 }, { len: 2, lift: 0 }, { len: 2, lift: 2 }], [{ len: 3, lift: 2 }, { len: 3, lift: 0 }, { len: 3, lift: 2 }, { len: 3, lift: 0 }]] },
  S: { trunk: 3, gap: 0, big: false, tiers: [[{ len: 2, lift: 0 }, { len: 2, lift: 2 }, { len: 2, lift: 0 }, { len: 2, lift: 2 }]] },
};
const LINDEN: Record<'S' | 'M' | 'L', { trunk: number; gap: number; tiers: Limb5[][]; big: boolean }> = {   // the linden's broad oval crown: the widest tier in the middle, a rounded top (a narrowing stack read as a pine, 2026-10-02)
  L: { trunk: 4, gap: 2, big: true, tiers: [[{ len: 3, lift: 2 }, { len: 3, lift: 0 }, { len: 3, lift: 4 }, { len: 3, lift: 2 }], [{ len: 4, lift: 0 }, { len: 4, lift: 2 }, { len: 4, lift: 4 }, { len: 4, lift: 2 }], [{ len: 3, lift: 2 }, { len: 3, lift: 4 }, { len: 3, lift: 2 }, { len: 3, lift: 0 }]] },
  M: { trunk: 3, gap: 1, big: true, tiers: [[{ len: 3, lift: 0 }, { len: 3, lift: 2 }, { len: 3, lift: 4 }, { len: 3, lift: 2 }], [{ len: 3, lift: 2 }, { len: 3, lift: 0 }, { len: 3, lift: 2 }, { len: 3, lift: 4 }]] },
  S: { trunk: 3, gap: 1, big: true, tiers: [[{ len: 2, lift: 0 }, { len: 2, lift: 2 }, { len: 2, lift: 4 }, { len: 2, lift: 2 }], [{ len: 2, lift: 2 }, { len: 2, lift: 0 }, { len: 2, lift: 2 }, { len: 2, lift: 4 }]] },   // two tiers: a small linden still reads as an oval, not a flat disc
};
/** (x, z) is the axis point — a grid corner; the 2×2 trunk covers cells (x−1..x, z−1..z).
 *  `tree` is the generic entry (kind picks the foliage: 'sakura' | 'pine', extend `Foliage` for maple, plane, olive, palm…); `sakura5` is its Kyoto-era name. */
export function tree(bp: Blueprint, x: number, y: number, z: number, size: 'S' | 'M' | 'L', reserve?: Reserve, turn = 0, skip?: Dir | Dir[], kind: Foliage = 'sakura') {
  bp.tag = kind; const spec = (kind === 'raintree' || kind === 'plane' ? RAINTREE : kind === 'linden' ? LINDEN : SAKURA5)[size]; const bare = new Set<Dir>(skip === undefined ? [] : Array.isArray(skip) ? skip : [skip]);
  const TRUNK = kind === 'sakura' ? 'ReddishBrown' : kind === 'plane' ? 'DarkTan' : 'DarkBrown';   // plane bark: a pale mottled grey-tan
  const CELLS: [number, number][] = [[x - 1, z - 1], [x, z - 1], [x, z], [x - 1, z]];   // NW NE SE SW
  const DIRS_A: Dir[] = [0, 3, 2, 1], DIRS_B: Dir[] = [1, 0, 3, 2];                      // outward directions per cell, two pinwheels
  let ty = y;
  const PLANE_BARK = ['DarkTan', 'LightBluishGray', 'Tan', 'DarkTan', 'White'];   // the plane tree's mottled camouflage bark, course by course
  let nSeg = 0; const seg = (dark = false) => { bp.part('roundbrick_2x2', x - 1, ty, z - 1, kind === 'plane' ? PLANE_BARK[nSeg++ % PLANE_BARK.length] : dark ? 'DarkBrown' : TRUNK); ty += 3; };
  for (let k = 0; k < spec.trunk; k++) seg(k === 0);
  spec.tiers.forEach((limbs, t) => {
    const dirs = t % 2 ? DIRS_B : DIRS_A;
    limbs.forEach((limb, i) => {
      const ci = (i + turn) & 3; const [cx, cz] = CELLS[ci]; const d = dirs[ci]; if (bare.has(d)) return;
      const [ux, uz] = rotv(0, -1, d); const cells: [number, number][] = []; for (let k = 0; k < limb.len; k++) cells.push([cx + ux * k, cz + uz * k]);
      const px = Math.min(...cells.map((c) => c[0])), pz = Math.min(...cells.map((c) => c[1]));
      bp.part(`plate_1x${limb.len}`, px, ty, pz, TRUNK, ux ? 1 : 0);
      const [tx, tz] = cells[limb.len - 1];
      if (limb.lift === 4) { bp.part('round_1x1', tx, ty + 1, tz, TRUNK); bp.part('roundplate_1x1', tx, ty + 4, tz, TRUNK); }
      else for (let s = 0; s < limb.lift; s++) bp.part('roundplate_1x1', tx, ty + 1 + s, tz, TRUNK);
      cluster4(bp, tx, ty + 1 + limb.lift, tz, (d + 2) & 3, spec.big, kind);
      if (kind === 'linden') for (let k = 1; k < limb.len - 1; k++) { const [mx, mz] = cells[k]; bp.part(k === 1 ? 'leaves_6x5' : 'leaves_4x3', mx, ty + 1, mz, bp.pick(LINDEN_LEAF), (d + (i % 2 ? 1 : 3)) & 3); }   // a linden is leafy along the whole limb, not only at the tips: the crown reads as one mass
      if (kind === 'sakura') for (let k = 1; k < limb.len - 1; k++) { const [mx, mz] = cells[k]; if (k === 1 && limb.len >= 3 && spec.big) { bp.part('leaves_4x3', mx, ty + 1, mz, bp.pick(S4_LEAF), (d + (i % 2 ? 1 : 3)) & 3); bp.part('petal_1x1', mx, ty + 2, mz, bp.pick(S4_BLOOM)); } else { bp.part('petal_1x1', mx, ty + 1, mz, bp.pick(S4_BLOOM)); if (k % 2) bp.part('flower_7', mx, ty + 2, mz, bp.pick(S4_BLOOM)); } }   // a side leaf on the first free stud of every long limb, loose blossoms after
    });
    ty += 1;                                                          // the trunk continues on the four inner plate ends
    for (let k = 0; k < spec.gap; k++) seg();
  });
  bp.part('jumper_2x2', x - 1, ty, z - 1, TRUNK);                      // leader: centre stud
  cluster4(bp, x - 0.5, ty + 1, z - 0.5, (turn + 1) & 3, false, kind);
  if (kind === 'pine') bp.part('cone_1x1', x - 0.5, ty + 4, z - 0.5, 'DarkGreen');
  reserve?.add(x - 2, z - 2, 4, 4); bp.tag = '';
}
export const sakura5 = tree;

// ---- palm — the classic LEGO palm, built the way plate-based palms are when the top's slots cannot tilt on our grid ---------------------
// 2×2 round plate base (the trunk's pin drops into its centre hole) → trunk segments 2536b, exactly 4 plates each → a 3L bar in the last segment's
// core (the hole made for the palm top's pin) carrying a 1×1 round plate and a 2×2 round-plate hub → two large leaves on the hub (opposite
// directions) and two small leaves crossing them one plate up (each leaf base is a 1×2 plate with two studs and two anti-studs) → coconuts and a
// young frond on the spare studs. (x, z) = axis point. The real palm top 2566b was tried and cut: see catalog.ts.
export function palm(bp: Blueprint, x: number, y: number, z: number, segments = 4, turn = 0, reserve?: Reserve) {
  bp.tag = 'palm'; const TRUNK = 'ReddishBrown';
  bp.part('roundplate_2x2', x - 1, y, z - 1, 'DarkTan'); let ty = y + 1;
  for (let k = 0; k < segments; k++) { bp.part('palm_trunk', x - 1, ty, z - 1, TRUNK); ty += 4; }
  bp.part('bar_3l', x - 0.5, ty - 5, z - 0.5, TRUNK);                                   // hidden in the top segment's core, tip flush with the hub's underside
  bp.part('roundplate_1x1', x - 0.5, ty, z - 0.5, TRUNK); ty += 1;                     // neck on the bar, resting on the segment's top
  bp.part('roundplate_2x2', x - 1, ty, z - 1, 'Green'); ty += 1;                       // hub: tube over the neck's stud
  const at = (rot: number): [number, number] => (rot === 0 ? [x - 1, z - 1] : rot === 2 ? [x - 1, z] : rot === 1 ? [x - 1, z - 1] : [x, z - 1]);   // box corner per blade direction: 0 → +x, 2 → −x, 1 → −z, 3 → +z
  for (const r of [turn & 3, (turn + 2) & 3]) { const [lx, lz] = at(r); bp.part('palm_leaf_l', lx, ty, lz, bp.pick(['Green', 'Green', 'DarkGreen']), r); }
  for (const r of [(turn + 1) & 3, (turn + 3) & 3]) { const [lx, lz] = at(r); bp.part('palm_leaf_s', lx, ty + 1, lz, bp.pick(['Green', 'BrightGreen']), r); }
  bp.part('plant_3leaves', x - 1, ty + 2, z - 1, 'BrightGreen'); bp.part('roundplate_1x1', x, ty + 2, z - 1, 'ReddishBrown'); bp.part('roundplate_1x1', x - 1, ty + 2, z, 'ReddishBrown');   // young frond, two coconuts
  reserve?.add(x - 2, z - 2, 4, 4); bp.tag = '';
}
