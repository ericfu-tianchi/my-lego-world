// Shared building grammar: reusable techniques, never finished buildings. Every function emits real parts
// and keeps stud connectivity (each piece sits on a stud of the piece below, or is a hollow-stud/bar pair).
import { Blueprint } from '../core/builder';
import { PARTS, footprint } from '../core/catalog';

export interface SceneMeta { id: string; title: string; caption: string; subtitle: string; size: [number, number]; center: [number, number, number]; camera?: { az: number; el: number; dist: number } }
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

// ---- minifigure --------------------------------------------------------------------------------
export interface FigOpts { legs: string; torso: string; hair?: string; hat?: 'kasa'; skin?: string }
/** Minifig standing with its feet centred at (cx, cz) on plate level y. rot faces: 0 → +z. */
export function minifig(bp: Blueprint, cx: number, y: number, cz: number, rot: number, o: FigOpts, reserve?: Reserve) {
  reserve?.add(Math.floor(cx - 1), Math.floor(cz - 1), 3, 3);
  const place = (key: string, yy: number, color: string) => { const [fw, fd] = footprint(PARTS[key], rot); bp.part(key, cx - fw / 2, yy, cz - fd / 2, color, rot); };
  const skin = o.skin ?? 'Yellow';
  place('fig_legs', y, o.legs); place('fig_torso', y + 4, o.torso); place('fig_hands', y + 4, skin); place('fig_head', y + 7, skin);
  if (o.hat === 'kasa') place('fig_kasa', y + 10, 'Tan'); else if (o.hair) place('fig_hair', y + 10, o.hair);
}

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
export function sakura(bp: Blueprint, x: number, y: number, z: number, size: 'S' | 'M' | 'L', reserve?: Reserve) {
  const trunk = size === 'L' ? 3 : size === 'M' ? 2 : 1; bp.tag = 'sakura';
  for (let k = 0; k < trunk; k++) bp.part('round_1x1', x, y + k * 3, z, 'ReddishBrown');
  canopyLayers(bp, x, y + trunk * 3, z, CANOPY[size], PINK.filter((c) => c !== 'Pink'), reserve); bp.tag = '';
}
export function maple(bp: Blueprint, x: number, y: number, z: number, reserve?: Reserve) {
  bp.tag = 'maple'; for (let k = 0; k < 2; k++) bp.part('round_1x1', x, y + k * 3, z, 'DarkBrown');
  canopyLayers(bp, x, y + 6, z, CANOPY.M, ['Orange', 'BrightRed', 'Orange', 'DarkOrange', 'BrightLightOrange'], reserve); bp.tag = '';
}
export function pine(bp: Blueprint, x: number, y: number, z: number, reserve?: Reserve) {
  bp.tag = 'pine'; bp.part('round_1x1', x, y, z, 'ReddishBrown'); canopyLayers(bp, x, y + 3, z, CANOPY.pine, ['DarkGreen', 'Green', 'DarkGreen'], reserve); bp.tag = '';
}
/** Low bush: 2x2 round plate on the grass with a few round plates on top. */
export function bush(bp: Blueprint, x: number, y: number, z: number, colors = ['Green', 'DarkGreen', 'BrightGreen'], reserve?: Reserve) {
  bp.part('roundplate_2x2', x, y, z, bp.pick(colors)); bp.part('roundplate_1x1', x, y + 1, z, bp.pick(colors)); bp.part('roundplate_1x1', x + 1, y + 1, z + 1, bp.pick(colors)); if (bp.chance(0.5)) bp.part('flower_1x1', x + 1, y + 1, z, bp.pick(['BrightPink', 'White', 'Magenta'])); reserve?.add(x, z, 2, 2);
}
export function bamboo(bp: Blueprint, x: number, yOrGround: number | ((x: number, z: number) => number), z: number, heights: number[], reserve?: Reserve) {
  bp.tag = 'bamboo'; const offs: [number, number][] = [[0, 0], [1, 1], [2, 0], [1, -1], [0, 2]];
  heights.forEach((h, i) => { const [dx, dz] = offs[i % offs.length]; const y = typeof yOrGround === 'function' ? yOrGround(x + dx, z + dz) : yOrGround; for (let k = 0; k < h; k++) { bp.part('round_1x1', x + dx, y + k * 4, z + dz, k % 2 ? 'Lime' : 'BrightGreen'); bp.part('roundplate_1x1', x + dx, y + k * 4 + 3, z + dz, 'Green'); } bp.part('bamboo_leaves', x + dx, y + h * 4, z + dz, 'Lime'); reserve?.add(x + dx, z + dz, 1, 1); });
  bp.tag = '';
}
// ---- garden furniture -----------------------------------------------------------------------------------
/** Stone lantern (tōrō): every piece on the centre stud of the piece below. */
export function stoneLantern(bp: Blueprint, x: number, y: number, z: number, reserve?: Reserve) {
  bp.tag = 'lantern'; bp.part('plate_2x2', x, y, z, 'LightBluishGray'); bp.part('round_1x1', x, y + 1, z, 'LightBluishGray'); bp.part('round_1x1', x, y + 4, z, 'LightBluishGray');
  bp.part('plate_2x2', x, y + 7, z, 'LightBluishGray'); bp.part('brick_1x1', x, y + 8, z, 'DarkBluishGray'); bp.part('dish_2x2', x, y + 11, z, 'LightBluishGray'); bp.part('roundplate_1x1', x + 0.5, y + 12, z + 0.5, 'LightBluishGray');
  reserve?.add(x, z, 2, 2); bp.tag = '';
}
/** Paper lantern: base plate, trans-orange round brick, black cap. */
export function paperLantern(bp: Blueprint, x: number, y: number, z: number) { bp.part('roundplate_1x1', x, y, z, 'Black'); bp.part('round_1x1', x, y + 1, z, 'TransOrange'); bp.part('roundplate_1x1', x, y + 4, z, 'Black'); }
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
