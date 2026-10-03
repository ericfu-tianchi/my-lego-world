import * as THREE from 'three';
import { PLATE, STUD_R, STUD_H, mergeGeos, roundedBox, box, cyl, stud, studGrid, profileExtrude, footprintPrism, lathe, cornerSlope, pyramid, sideStud } from './geometry';
import { ldrawGeometry, bakedBox, bodyBox, hasBaked, bakedName as LDRAW_NAME, type Anchor } from './ldraw';
import { ASM } from '../parts/ldraw/asm/index';

// ---- Part catalogue ------------------------------------------------------------
// Every entry maps to a real LEGO design (BrickLink id). Geometry is our own approximation
// at true proportions. `studs` says where the top face offers studs (what can sit on it);
// `accepts` says whether the underside takes studs. The validator uses both.
export type Category = 'brick' | 'brick-mod' | 'plate' | 'plate-mod' | 'tile' | 'slope' | 'curve' | 'round' | 'arch' | 'window' | 'bar' | 'plant' | 'minifig' | 'accessory' | 'animal' | 'baseplate';
export type StudPattern = 'all' | 'none' | 'back' | 'center' | 'disc' | ((i: number, j: number) => boolean);
export interface PartDef {
  key: string; bl: string; name: string; zh: string; cat: Category;
  w: number; d: number; h: number;              // studs, studs, plates
  studs: StudPattern; accepts: boolean;        // connection points
  studPoints?: [number, number][];             // explicit mould connectors relative to centre (e.g. branching foliage)
  verified: boolean;                            // id checked against the LDraw official library headers (2026-09-11); see docs/catalog/ldraw-check.json for aliases
  mask?: (i: number, j: number) => boolean;    // occupied footprint cells when not the full rectangle
  note?: string; showColor: string;
  gripMate?: string;                           // exact co-located rig frame for a rigidly aligned held part
  held?: boolean;                               // accessory held in a minifig hand (connects through fig_hands, may sit at half-stud positions)
  hollow?: boolean;                             // has a hollow stud / clip / hole that takes a bar
  clip?: boolean;                               // the bar is gripped by a clip that reaches into the neighbouring cell
  hand?: boolean;                               // a minifig hand: held accessories connect to it
  attach?: boolean;                             // rides on a minifig body part it touches (hands on a torso)
  body?: boolean;                               // minifig legs / torso: hands may overlap it, held things may not
  bom?: string[];                               // real part numbers behind an assembly (torso + arms)
  ext?: [number, number, number, number];       // true footprint rectangle [x0, x1, z0, z1] around the part centre (studs), used for interpenetration tests
  extY?: [number, number];                      // true vertical extent in plates, relative to the placement level — collision uses the real geometry, connection uses the declared box
  loop?: number;                                // plates a grippable loop / bar pokes above the part box (lantern handle)
  bar?: boolean;                                // is a bar (3.18 mm) that plugs into hollow parts
  ldraw?: string;                               // geometry baked from this LDraw file (L1 specialty moulds)
  anchor?: Anchor; lift?: number;               // how the baked geometry sits in the part box (ldrawPart); an assembly proxy needs both to place its members
  member?: boolean;                             // a real brick generated from an assembly's member list (key ld_<id>): rendered and simulated, never placed by hand
  build: () => THREE.BufferGeometry;
}
export const CATEGORIES: { id: Category; zh: string; en: string; blurb: string }[] = [
  { id: 'brick', zh: '基础砖', en: 'Bricks', blurb: '结构主体。排砖器把体积打包成这些规格。' },
  { id: 'brick-mod', zh: '改造砖', en: 'Modified bricks', blurb: '圆柱、侧凸点、木纹、格栅：塔身、灯笼、木屋的词汇。' },
  { id: 'plate', zh: '板', en: 'Plates', blurb: '地面、楼板、屋顶板；三块板等于一块砖。' },
  { id: 'plate-mod', zh: '改造板', en: 'Modified plates', blurb: 'jumper 做半格偏移，圆板做树冠，楔形板做船头和斜街。' },
  { id: 'tile', zh: '光面砖', en: 'Tiles', blurb: '没有凸点的收尾层：水面、路面、屋脊。上面不能再放东西。' },
  { id: 'slope', zh: '斜坡', en: 'Slopes', blurb: '屋顶与山体。只有后排有凸点，斜面上不能放东西。' },
  { id: 'curve', zh: '弧形斜坡', en: 'Curved slopes', blurb: '柔和的屋脊、车顶、现代建筑的曲面。' },
  { id: 'round', zh: '圆锥、圆顶、碟', en: 'Cones, domes, dishes', blurb: '塔尖、穹顶、伞、灯笼盖。' },
  { id: 'arch', zh: '拱与围栏', en: 'Arches & fences', blurb: '桥、骑楼拱廊、栏杆。' },
  { id: 'window', zh: '门窗', en: 'Windows & doors', blurb: '人仔尺度建筑用；微缩尺度用透明板代替。' },
  { id: 'bar', zh: '杆件与小配件', en: 'Bars & small details', blurb: '天线、旗杆、路灯、水龙头做微缩细节。' },
  { id: 'plant', zh: '植物', en: 'Plants', blurb: '树叶、花茎、竹叶，配合圆板做各种树。' },
  { id: 'accessory', zh: '人仔道具', en: 'Accessories', blurb: '手里拿的、桌上放的：扫帚、茶杯、相机、雨伞。人仔比例的生活层。' },
  { id: 'animal', zh: '动物', en: 'Animals', blurb: '锦鲤、猫、鸟、蛙：庭园里的活物。' },
  { id: 'minifig', zh: '人仔', en: 'Minifigure', blurb: '按颜色分件，每件是一个物理零件。' },
  { id: 'baseplate', zh: '底板', en: 'Baseplates', blurb: '每座城市的桌面。' },
];

export const PARTS: Record<string, PartDef> = {};
const cache = new Map<string, THREE.BufferGeometry>();
function def(p: PartDef) { if (PARTS[p.key]) throw new Error('duplicate part ' + p.key); PARTS[p.key] = p; }
export function geometryFor(key: string): THREE.BufferGeometry {
  let g = cache.get(key);
  if (!g) { const p = PARTS[key]; if (!p) throw new Error('Unknown part ' + key); g = p.build(); g.computeBoundingSphere(); cache.set(key, g); }
  return g;
}
export function footprint(p: PartDef, rot: number): [number, number] { return rot % 2 === 0 ? [p.w, p.d] : [p.d, p.w]; }
/** Does the top face offer a stud at canonical cell (i, j)? */
export function hasStud(p: PartDef, i: number, j: number): boolean {
  const s = p.studs;
  if (s === 'all') return !p.mask || p.mask(i, j);
  if (s === 'none') return false;
  if (s === 'back') return j === 0;
  if (s === 'center') return i === Math.floor((p.w - 1) / 2) && j === Math.floor((p.d - 1) / 2) && (p.w % 2 === 1 && p.d % 2 === 1);
  if (s === 'disc') return Math.hypot(i + 0.5 - p.w / 2, j + 0.5 - p.d / 2) < p.w / 2 - 0.4;
  return s(i, j);
}

// ---- helpers -------------------------------------------------------------------
/** L1 specialty mould: real LDraw geometry (baked), stud semantics filled by hand. `lift` raises the mesh by whole plates. */
export function ldrawPart(p: Omit<PartDef, 'build' | 'verified' | 'ldraw'> & { id: string; lift?: number; anchor?: Anchor }) {
  const { id, lift, anchor, ...rest } = p; if (PARTS[rest.key]) delete PARTS[rest.key];
  let ext = rest.ext; let extY = rest.extY;
  const bb = bakedBox(id), lf = lift ?? 0, an = anchor ?? 'bbox';
  if (!extY) extY = an === 'origin' ? [+(lf + bb[1] / PLATE).toFixed(2), +(lf + bb[4] / PLATE).toFixed(2)] : [lf, +(lf + (bb[4] - bb[1]) / PLATE).toFixed(2)];
  if (!ext && (rest.cat === 'minifig' || rest.cat === 'accessory' || rest.cat === 'animal')) { // small parts: true rectangle from the baked bbox
    ext = an !== 'bbox' ? [bb[0], bb[3], bb[2], bb[5]] : [-(bb[3] - bb[0]) / 2, (bb[3] - bb[0]) / 2, -(bb[5] - bb[2]) / 2, (bb[5] - bb[2]) / 2];
    ext = ext.map((v) => +v.toFixed(2)) as [number, number, number, number];
  }
  def({ ...rest, ext, extY, verified: true, ldraw: id, anchor: an, lift: lf, build: () => ldrawGeometry(id, p.h, lf, an) });
}
const boxPart = (w: number, d: number, h: number, studs = true) => () => { const H = h * PLATE; const geos = [roundedBox(w, H, d)]; if (studs) geos.push(...studGrid(w, d, H / 2)); return mergeGeos(geos); };
// Slopes: canonical studs on the back row (z<0), slope descends toward +z.
const slopePart = (w: number, d: number, h: number, backRows: number, lip: number, studRows: number) => () => {
  const H = h * PLATE, z0 = -d / 2, z1 = d / 2;
  const g = profileExtrude((s) => { s.moveTo(z0, -H / 2); s.lineTo(z1, -H / 2); s.lineTo(z1, -H / 2 + lip); s.lineTo(z0 + backRows, H / 2); s.lineTo(z0, H / 2); }, w);
  return mergeGeos(studRows > 0 ? [g, ...studGrid(w, d, H / 2, (_i, j) => j < studRows)] : [g]);
};
const cheeseProfile = (s: THREE.Shape) => { s.moveTo(-0.5, -0.4); s.lineTo(0.5, -0.4); s.lineTo(0.5, -0.25); s.lineTo(-0.35, 0.4); s.lineTo(-0.5, 0.4); };
const curveProfile = (depth: number) => (s: THREE.Shape) => { const z0 = -depth / 2, z1 = depth / 2; s.moveTo(z0, -0.4); s.lineTo(z1, -0.4); s.lineTo(z1, -0.28); s.quadraticCurveTo(z1 - depth * 0.28, 0.3, z0 + depth * 0.32, 0.4); s.lineTo(z0, 0.4); };
const doubleCurveProfile = (depth: number) => (s: THREE.Shape) => { const z0 = -depth / 2, z1 = depth / 2; s.moveTo(z0, -0.4); s.lineTo(z1, -0.4); s.lineTo(z1, -0.28); s.quadraticCurveTo(depth * 0.22, 0.42, 0.25, 0.4); s.lineTo(-0.25, 0.4); s.quadraticCurveTo(-depth * 0.22, 0.42, z0, -0.28); };
const ridgeProfile = (depth: number, H: number) => (s: THREE.Shape) => { const z0 = -depth / 2, z1 = depth / 2; s.moveTo(z0, -H / 2); s.lineTo(z1, -H / 2); s.lineTo(z1, -H / 2 + 0.3); s.lineTo(0.2, H / 2); s.lineTo(-0.2, H / 2); s.lineTo(z0, -H / 2 + 0.3); };
const invProfile = (depth: number, w: number) => () => { const H = 1.2; const g = profileExtrude((s) => { s.moveTo(-depth / 2, -H / 2); s.lineTo(-depth / 2 + 1, -H / 2); s.lineTo(depth / 2, H / 2 - 0.3); s.lineTo(depth / 2, H / 2); s.lineTo(-depth / 2, H / 2); }, w); return mergeGeos([g, ...studGrid(w, depth, H / 2)]); };
const archPart = (len: number, h: number, ry: number, legs = 0.5) => () => {
  const H = h * PLATE; const s = new THREE.Shape(); const L = len / 2, inner = L - legs;
  s.moveTo(-L, -H / 2); s.lineTo(-L, H / 2); s.lineTo(L, H / 2); s.lineTo(L, -H / 2); s.lineTo(inner, -H / 2); s.lineTo(inner, -H / 2 + 0.05);
  s.absellipse(0, -H / 2 + 0.05, inner, ry, 0, Math.PI, false); s.lineTo(-inner, -H / 2); s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: 1, bevelEnabled: false, curveSegments: 14 }); g.translate(0, 0, -0.5); g.deleteAttribute('uv');
  return mergeGeos([g, ...studGrid(len, 1, H / 2)]);
};
const lPoly: [number, number][] = [[0, 0], [2, 0], [2, 1], [1, 1], [1, 2], [0, 2]];
const lPart = (h: number, studs: boolean) => () => { const H = h * PLATE; const geos = [footprintPrism(lPoly, H, 2, 2)]; if (studs) geos.push(...studGrid(2, 2, H / 2, (i, j) => !(i === 1 && j === 1))); return mergeGeos(geos); };
const lMask = (i: number, j: number) => !(i === 1 && j === 1);
const insidePoly = (pts: [number, number][], x: number, z: number) => { let c = false; for (let a = 0, b = pts.length - 1; a < pts.length; b = a++) { const [xa, za] = pts[a], [xb, zb] = pts[b]; if ((za > z) !== (zb > z) && x < ((xb - xa) * (z - za)) / (zb - za) + xa) c = !c; } return c; };
const wedgePart = (pts: [number, number][], w: number, d: number) => () => mergeGeos([footprintPrism(pts, PLATE, w, d), ...studGrid(w, d, PLATE / 2, (i, j) => insidePoly(pts, i + 0.5, j + 0.5))]);
const grooves = (w: number, y0: number, count: number, gap: number, z: number, along = 'x') => { const out: THREE.BufferGeometry[] = []; for (let k = 0; k < count; k++) out.push(along === 'x' ? box(w, 0.08, 0.06, 0, y0 + k * gap, z) : box(0.06, 0.08, w, z, y0 + k * gap, 0)); return out; };

// ---- BRICKS ---------------------------------------------------------------------
for (const [w, d, bl] of [[1, 1, '3005'], [1, 2, '3004'], [1, 3, '3622'], [1, 4, '3010'], [1, 6, '3009'], [1, 8, '3008'], [2, 2, '3003'], [2, 3, '3002'], [2, 4, '3001'], [2, 6, '2456'], [2, 8, '3007']] as [number, number, string][])
  def({ key: `brick_${w}x${d}`, bl, name: `Brick ${w} x ${d}`, zh: `砖 ${w}×${d}`, cat: 'brick', w, d, h: 3, studs: 'all', accepts: true, verified: true, showColor: 'BrightRed', build: boxPart(w, d, 3) });
def({ key: 'brick_1x1x5', bl: '2453b', name: 'Brick 1 x 1 x 5', zh: '砖 1×1×5', cat: 'brick', w: 1, d: 1, h: 15, studs: 'all', accepts: true, verified: true, showColor: 'BrightRed', note: '细柱、塔身', build: boxPart(1, 1, 15) });
def({ key: 'brick_1x2x2', bl: '3245c', name: 'Brick 1 x 2 x 2', zh: '砖 1×2×2', cat: 'brick', w: 2, d: 1, h: 6, studs: 'all', accepts: true, verified: true, showColor: 'BrightRed', build: boxPart(2, 1, 6) });
def({ key: 'brick_corner_2x2', bl: '2357', name: 'Brick 2 x 2 Corner', zh: '转角砖 2×2', cat: 'brick', w: 2, d: 2, h: 3, studs: 'all', accepts: true, verified: true, mask: lMask, showColor: 'BrightRed', build: lPart(3, true) });

// ---- MODIFIED BRICKS -------------------------------------------------------------
def({ key: 'round_1x1', bl: '3062b', name: 'Brick Round 1 x 1', zh: '圆砖 1×1', cat: 'brick-mod', w: 1, d: 1, h: 3, studs: 'all', accepts: true, verified: true, showColor: 'Yellow', note: '柱子、树干、塔身', build: () => mergeGeos([cyl(0.49, 1.2, 20), stud(0, 0.6, 0)]) });
def({ key: 'roundbrick_2x2', bl: '3941', name: 'Brick Round 2 x 2', zh: '圆砖 2×2', cat: 'brick-mod', w: 2, d: 2, h: 3, studs: 'all', accepts: true, verified: true, showColor: 'Yellow', build: () => mergeGeos([cyl(0.98, 1.2, 28), ...studGrid(2, 2, 0.6)]) });
def({ key: 'brick_snot_1x1', bl: '87087', name: 'Brick 1 x 1 with Stud on Side', zh: '侧凸点砖 1×1', cat: 'brick-mod', w: 1, d: 1, h: 3, studs: 'all', accepts: true, verified: true, showColor: 'LightBluishGray', note: '侧向拼接（SNOT）入口，v2 先作装饰凸点', build: () => mergeGeos([roundedBox(1, 1.2, 1), stud(0, 0.6, 0), sideStud(0, 0.1, 0.5)]) });
def({ key: 'brick_headlight', bl: '4070', name: 'Brick 1 x 1 with Headlight', zh: '车灯砖 1×1', cat: 'brick-mod', w: 1, d: 1, h: 3, studs: 'all', accepts: true, verified: true, showColor: 'LightBluishGray', note: '微缩窗、空调机', build: () => mergeGeos([roundedBox(1, 1.2, 0.7), stud(0, 0.6, 0), sideStud(0, 0.05, 0.35)].map((g, k) => { if (k === 0) g.translate(0, 0, -0.15); return g; })) });
def({ key: 'brick_grille_1x2', bl: '2877', name: 'Brick 1 x 2 with Grille', zh: '格栅砖 1×2', cat: 'brick-mod', w: 2, d: 1, h: 3, studs: 'all', accepts: true, verified: true, showColor: 'LightBluishGray', note: '幕墙、百叶', build: () => mergeGeos([roundedBox(2, 1.2, 0.88), ...studGrid(2, 1, 0.6), ...grooves(2, -0.42, 4, 0.28, 0.5), ...grooves(2, -0.42, 4, 0.28, -0.5)]) });
def({ key: 'brick_log_1x2', bl: '30136', name: 'Brick 1 x 2 Log', zh: '木纹砖 1×2', cat: 'brick-mod', w: 2, d: 1, h: 3, studs: 'all', accepts: true, verified: true, showColor: 'ReddishBrown', note: '木屋、栅栏、树干', build: () => { const logs: THREE.BufferGeometry[] = []; for (const y of [-0.3, 0.3]) for (const z of [-0.2, 0.2]) { const c = new THREE.CylinderGeometry(0.3, 0.3, 2, 14); c.rotateZ(Math.PI / 2); c.translate(0, y, z); c.deleteAttribute('uv'); logs.push(c); } return mergeGeos([roundedBox(2, 1.2, 0.5), ...logs, ...studGrid(2, 1, 0.6)]); } });

// ---- PLATES ---------------------------------------------------------------------
for (const [w, d, bl] of [[1, 1, '3024'], [1, 2, '3023'], [1, 3, '3623'], [1, 4, '3710'], [1, 6, '3666'], [1, 8, '3460'], [2, 2, '3022'], [2, 3, '3021'], [2, 4, '3020'], [2, 6, '3795'], [2, 8, '3034'], [4, 4, '3031'], [4, 6, '3032'], [4, 8, '3035'], [4, 10, '3030'], [4, 12, '3029'], [6, 6, '3958'], [6, 8, '3036'], [8, 8, '41539']] as [number, number, string][])
  def({ key: `plate_${w}x${d}`, bl, name: `Plate ${w} x ${d}`, zh: `板 ${w}×${d}`, cat: 'plate', w, d, h: 1, studs: 'all', accepts: true, verified: true, showColor: 'BrightBlue', build: boxPart(w, d, 1) });
def({ key: 'plate_corner_2x2', bl: '2420', name: 'Plate 2 x 2 Corner', zh: '转角板 2×2', cat: 'plate', w: 2, d: 2, h: 1, studs: 'all', accepts: true, verified: true, mask: lMask, showColor: 'BrightBlue', build: lPart(1, true) });

// ---- MODIFIED PLATES -------------------------------------------------------------
def({ key: 'jumper_1x2', bl: '15573', name: 'Plate 1 x 2 with 1 Stud (Jumper)', zh: '半格偏移板 1×2', cat: 'plate-mod', w: 2, d: 1, h: 1, studs: 'center', accepts: true, verified: true, showColor: 'BrightBlue', note: '把上面的零件偏移半格，微缩建筑的关键技法', build: () => mergeGeos([roundedBox(2, 0.4, 1), stud(0, 0.2, 0)]) });
def({ key: 'jumper_2x2', bl: '87580', name: 'Plate 2 x 2 with 1 Stud (Jumper)', zh: '半格偏移板 2×2', cat: 'plate-mod', w: 2, d: 2, h: 1, studs: 'center', accepts: true, verified: true, showColor: 'BrightBlue', note: '中心单凸点', build: () => mergeGeos([roundedBox(2, 0.4, 2), stud(0, 0.2, 0)]) });
def({ key: 'roundplate_1x1', bl: '6141', name: 'Plate Round 1 x 1', zh: '圆板 1×1', cat: 'plate-mod', w: 1, d: 1, h: 1, studs: 'all', accepts: true, verified: true, showColor: 'BrightGreen', note: '树叶、灌木、石子', build: () => mergeGeos([cyl(0.49, 0.4, 20), stud(0, 0.2, 0)]) });
def({ key: 'roundplate_2x2', bl: '4032', name: 'Plate Round 2 x 2', zh: '圆板 2×2', cat: 'plate-mod', w: 2, d: 2, h: 1, studs: 'all', accepts: true, verified: true, showColor: 'BrightGreen', note: '树冠叠塔', build: () => mergeGeos([cyl(0.98, 0.4, 28), ...studGrid(2, 2, 0.2)]) });
def({ key: 'roundplate_4x4', bl: '60474', name: 'Plate Round 4 x 4', zh: '圆板 4×4', cat: 'plate-mod', w: 4, d: 4, h: 1, studs: 'disc', accepts: true, verified: true, showColor: 'BrightGreen', note: '擎天树冠、圆形平台', build: () => mergeGeos([cyl(1.98, 0.4, 40), ...studGrid(4, 4, 0.2, (i, j) => Math.hypot(i + 0.5 - 2, j + 0.5 - 2) < 1.6)]) });
def({ key: 'flower_1x1', bl: '24866', name: 'Plate Round 1 x 1 with Flower Edge', zh: '花瓣板 1×1', cat: 'plant', w: 1, d: 1, h: 1, studs: 'all', accepts: true, verified: true, showColor: 'BrightPink', note: '樱花、花丛、树冠质感', build: () => { const geos = [cyl(0.26, 0.4, 12)]; for (let k = 0; k < 5; k++) { const a = k / 5 * Math.PI * 2; geos.push(cyl(0.21, 0.36, 10, 0.21, Math.cos(a) * 0.3, -0.02, Math.sin(a) * 0.3)); } geos.push(stud(0, 0.2, 0)); return mergeGeos(geos); } });
const wedgeR: [number, number][] = [[0, 0], [4, 0], [4, 1], [0, 2]], wedgeL: [number, number][] = [[0, 0], [4, 0], [4, 2], [0, 1]];
def({ key: 'wedge_4x2_r', bl: '41769', name: 'Wedge Plate 4 x 2 Right', zh: '楔形板 4×2 右', cat: 'plate-mod', w: 4, d: 2, h: 1, studs: 'all', accepts: true, verified: true, mask: (i, j) => insidePoly(wedgeR, i + 0.5, j + 0.5), showColor: 'White', note: '船头、斜向街区', build: wedgePart(wedgeR, 4, 2) });
def({ key: 'wedge_4x2_l', bl: '41770', name: 'Wedge Plate 4 x 2 Left', zh: '楔形板 4×2 左', cat: 'plate-mod', w: 4, d: 2, h: 1, studs: 'all', accepts: true, verified: true, mask: (i, j) => insidePoly(wedgeL, i + 0.5, j + 0.5), showColor: 'White', build: wedgePart(wedgeL, 4, 2) });
const wedge33: [number, number][] = [[0, 0], [3, 0], [3, 1], [1, 3], [0, 3]];
def({ key: 'wedge_3x3', bl: '2450', name: 'Wedge Plate 3 x 3 Cut Corner', zh: '切角板 3×3', cat: 'plate-mod', w: 3, d: 3, h: 1, studs: 'all', accepts: true, verified: true, mask: (i, j) => insidePoly(wedge33, i + 0.5, j + 0.5), showColor: 'White', note: '圆角地台、岸线', build: wedgePart(wedge33, 3, 3) });

// ---- TILES ----------------------------------------------------------------------
for (const [w, d, bl] of [[1, 1, '3070b'], [1, 2, '3069b'], [1, 3, '63864'], [1, 4, '2431'], [1, 6, '6636'], [1, 8, '4162'], [2, 2, '3068b'], [2, 4, '87079']] as [number, number, string][])
  def({ key: `tile_${w}x${d}`, bl, name: `Tile ${w} x ${d}`, zh: `光面砖 ${w}×${d}`, cat: 'tile', w, d, h: 1, studs: 'none', accepts: true, verified: true, showColor: 'LightBluishGray', build: boxPart(w, d, 1, false) });
def({ key: 'roundtile_1x1', bl: '98138', name: 'Tile Round 1 x 1', zh: '圆光面砖 1×1', cat: 'tile', w: 1, d: 1, h: 1, studs: 'none', accepts: true, verified: true, showColor: 'DarkBluishGray', note: '鹅卵石、井盖、路灯头', build: () => cyl(0.49, 0.4, 20) });
def({ key: 'roundtile_2x2', bl: '14769', name: 'Tile Round 2 x 2', zh: '圆光面砖 2×2', cat: 'tile', w: 2, d: 2, h: 1, studs: 'none', accepts: true, verified: true, showColor: 'DarkBluishGray', note: '圆顶收口、广场', build: () => cyl(0.98, 0.4, 28) });
def({ key: 'grilletile_1x2', bl: '2412b', name: 'Tile 1 x 2 Grille', zh: '格栅光面砖 1×2', cat: 'tile', w: 2, d: 1, h: 1, studs: 'none', accepts: true, verified: true, showColor: 'LightBluishGray', note: '幕墙、格栅、瓦垄', build: () => mergeGeos([roundedBox(2, 0.3, 1).translate(0, -0.05, 0), ...grooves(2, 0.13, 3, 0.0, 0).map((g, k) => { g.translate(0, 0, (k - 1) * 0.33); return g; })]) });

// ---- SLOPES ---------------------------------------------------------------------
def({ key: 'cheese_1x1', bl: '54200', name: 'Slope 30 1 x 1 x 2/3', zh: '奶酪斜坡 1×1', cat: 'slope', w: 1, d: 1, h: 2, studs: 'none', accepts: true, verified: true, showColor: 'DarkTurquoise', note: '屋角、微缩屋顶、小装饰', build: () => profileExtrude(cheeseProfile, 1) });
def({ key: 'cheese_1x2', bl: '85984', name: 'Slope 30 1 x 2 x 2/3', zh: '奶酪斜坡 1×2', cat: 'slope', w: 2, d: 1, h: 2, studs: 'none', accepts: true, verified: true, showColor: 'DarkTurquoise', build: () => profileExtrude(cheeseProfile, 2) });
def({ key: 'pyramid_1x1', bl: '22388', name: 'Slope 45 1 x 1 x 2/3 Quadruple Convex Pyramid', zh: '金字塔 1×1', cat: 'slope', w: 1, d: 1, h: 2, studs: 'none', accepts: true, verified: true, showColor: 'DarkTurquoise', note: '塔尖、屋顶收口', build: () => { const g = pyramid(1, 0.8); return g; } });
def({ key: 'slope_1x2', bl: '3040', name: 'Slope 45 2 x 1', zh: '斜坡 45° 1×2', cat: 'slope', w: 1, d: 2, h: 3, studs: 'back', accepts: true, verified: true, showColor: 'DarkTurquoise', build: slopePart(1, 2, 3, 1, 0.3, 1) });
def({ key: 'slope_2x2', bl: '3039', name: 'Slope 45 2 x 2', zh: '斜坡 45° 2×2', cat: 'slope', w: 2, d: 2, h: 3, studs: 'back', accepts: true, verified: true, showColor: 'DarkTurquoise', build: slopePart(2, 2, 3, 1, 0.3, 1) });
def({ key: 'slope_4x2', bl: '3037', name: 'Slope 45 2 x 4', zh: '斜坡 45° 4×2', cat: 'slope', w: 4, d: 2, h: 3, studs: 'back', accepts: true, verified: true, showColor: 'DarkTurquoise', build: slopePart(4, 2, 3, 1, 0.3, 1) });
def({ key: 'slope_1x3', bl: '4286', name: 'Slope 33 3 x 1', zh: '斜坡 33° 1×3', cat: 'slope', w: 1, d: 3, h: 3, studs: 'back', accepts: true, verified: true, showColor: 'DarkTurquoise', build: slopePart(1, 3, 3, 1, 0.25, 1) });
def({ key: 'slope_2x3', bl: '3298', name: 'Slope 33 3 x 2', zh: '斜坡 33° 2×3', cat: 'slope', w: 2, d: 3, h: 3, studs: 'back', accepts: true, verified: true, showColor: 'DarkTurquoise', build: slopePart(2, 3, 3, 1, 0.25, 1) });
def({ key: 'slope_65_2x1x2', bl: '60481', name: 'Slope 65 2 x 1 x 2', zh: '陡坡 65° 2×1×2', cat: 'slope', w: 2, d: 1, h: 6, studs: 'back', accepts: true, verified: true, showColor: 'DarkTurquoise', note: '尖顶、教堂塔楼', build: () => { const H = 2.4; const g = profileExtrude((s) => { s.moveTo(-0.5, -H / 2); s.lineTo(0.5, -H / 2); s.lineTo(0.5, -H / 2 + 0.3); s.lineTo(0.18, H / 2); s.lineTo(-0.5, H / 2); }, 2); return mergeGeos([g, ...studGrid(2, 1, H / 2, () => true).map((st) => { st.translate(0, 0, -0.16); return st; })]); } });
def({ key: 'ridge_2x2', bl: '3300', name: 'Slope 33 2 x 2 Double', zh: '双坡屋脊 2×2', cat: 'slope', w: 2, d: 2, h: 3, studs: 'none', accepts: true, verified: true, showColor: 'DarkOrange', note: '屋脊收口', build: () => profileExtrude(ridgeProfile(2, 1.2), 2) });
def({ key: 'ridge_4x2', bl: '3299', name: 'Slope 33 2 x 4 Double', zh: '双坡屋脊 4×2', cat: 'slope', w: 4, d: 2, h: 3, studs: 'none', accepts: true, verified: true, showColor: 'DarkOrange', build: () => profileExtrude(ridgeProfile(2, 1.2), 4) });
def({ key: 'slope_corner_2x2', bl: '3045', name: 'Slope 45 2 x 2 Double Convex', zh: '屋角斜坡 2×2', cat: 'slope', w: 2, d: 2, h: 3, studs: 'none', accepts: true, verified: true, showColor: 'DarkTurquoise', note: '四坡屋顶的外角', build: () => cornerSlope(2, 3, 0.3) });
def({ key: 'slope_corner_3x3', bl: '3675', name: 'Slope 33 3 x 3 Double Convex', zh: '屋角斜坡 3×3', cat: 'slope', w: 3, d: 3, h: 3, studs: 'none', accepts: true, verified: true, showColor: 'DarkTurquoise', build: () => cornerSlope(3, 3, 0.3) });
def({ key: 'slope_inv_1x2', bl: '3665', name: 'Slope Inverted 45 2 x 1', zh: '倒斜坡 45° 1×2', cat: 'slope', w: 1, d: 2, h: 3, studs: 'all', accepts: true, verified: true, showColor: 'DarkRed', note: '屋檐下撑、悬挑', build: invProfile(2, 1) });
def({ key: 'slope_inv_2x2', bl: '3660', name: 'Slope Inverted 45 2 x 2', zh: '倒斜坡 45° 2×2', cat: 'slope', w: 2, d: 2, h: 3, studs: 'all', accepts: true, verified: true, showColor: 'DarkRed', build: invProfile(2, 2) });

// ---- CURVED SLOPES ---------------------------------------------------------------
def({ key: 'curve_1x2', bl: '11477', name: 'Slope Curved 2 x 1', zh: '弧形斜坡 1×2', cat: 'curve', w: 1, d: 2, h: 2, studs: 'none', accepts: true, verified: true, showColor: 'White', note: '柔和屋檐、车顶', build: () => profileExtrude(curveProfile(2), 1) });
def({ key: 'curve_2x2', bl: '15068', name: 'Slope Curved 2 x 2', zh: '弧形斜坡 2×2', cat: 'curve', w: 2, d: 2, h: 2, studs: 'none', accepts: true, verified: true, showColor: 'White', build: () => profileExtrude(curveProfile(2), 2) });
def({ key: 'curve_1x3', bl: '50950', name: 'Slope Curved 3 x 1', zh: '弧形斜坡 1×3', cat: 'curve', w: 1, d: 3, h: 2, studs: 'none', accepts: true, verified: true, showColor: 'White', build: () => profileExtrude(curveProfile(3), 1) });
def({ key: 'curve_1x4', bl: '61678', name: 'Slope Curved 4 x 1', zh: '弧形斜坡 1×4', cat: 'curve', w: 1, d: 4, h: 2, studs: 'none', accepts: true, verified: true, showColor: 'White', note: '现代建筑曲面、船体', build: () => profileExtrude(curveProfile(4), 1) });
def({ key: 'curve_1x4_double', bl: '93273', name: 'Slope Curved 4 x 1 Double', zh: '双弧斜坡 1×4', cat: 'curve', w: 1, d: 4, h: 2, studs: 'none', accepts: true, verified: true, showColor: 'White', note: '圆拱屋脊、榴莲剧院', build: () => profileExtrude(doubleCurveProfile(4), 1) });

// ---- CONES / DOMES / DISHES --------------------------------------------------------
def({ key: 'cone_1x1', bl: '4589', name: 'Cone 1 x 1', zh: '圆锥 1×1', cat: 'round', w: 1, d: 1, h: 3, studs: 'center', accepts: true, verified: true, showColor: 'Yellow', note: '塔尖、树顶、灯', build: () => mergeGeos([cyl(0.49, 1.2, 20, 0.3), stud(0, 0.6, 0)]) });
def({ key: 'cone_2x2', bl: '3942c', name: 'Cone 2 x 2 x 2', zh: '圆锥 2×2×2', cat: 'round', w: 2, d: 2, h: 6, studs: 'center', accepts: true, verified: true, showColor: 'Yellow', build: () => mergeGeos([cyl(0.98, 2.4, 28, 0.3), stud(0, 1.2, 0)]) });
def({ key: 'dish_2x2', bl: '4740', name: 'Dish 2 x 2 Inverted (Radar)', zh: '碟 2×2', cat: 'round', w: 2, d: 2, h: 1, studs: 'center', accepts: true, verified: true, showColor: 'LightBluishGray', note: '灯笼盖、伞、穹顶', build: () => { const pts: [number, number][] = [[0, -0.2], [0.98, -0.2], [0.98, -0.12]]; for (let k = 1; k <= 6; k++) { const t = k / 6; pts.push([0.98 * (1 - t), -0.12 + 0.32 * Math.sin(t * Math.PI / 2)]); } return mergeGeos([lathe(pts, 28), stud(0, 0.2, 0)]); } });
def({ key: 'dish_4x4', bl: '3960', name: 'Dish 4 x 4 Inverted (Radar)', zh: '碟 4×4', cat: 'round', w: 4, d: 4, h: 1, studs: 'center', accepts: true, verified: true, showColor: 'BrightRed', note: '大伞、穹顶', build: () => { const pts: [number, number][] = [[0, -0.2], [1.98, -0.2], [1.98, -0.1]]; for (let k = 1; k <= 8; k++) { const t = k / 8; pts.push([1.98 * (1 - t), -0.1 + 0.3 * Math.sin(t * Math.PI / 2)]); } return mergeGeos([lathe(pts, 40), stud(0, 0.2, 0)]); } });
def({ key: 'dome_2x2', bl: '553c', name: 'Brick Round 2 x 2 Dome Top', zh: '圆顶砖 2×2', cat: 'round', w: 2, d: 2, h: 3, studs: 'none', accepts: true, verified: true, showColor: 'White', note: '穹顶、树冠、石头', build: () => { const pts: [number, number][] = [[0, -0.6], [0.98, -0.6], [0.98, -0.15]]; for (let k = 1; k <= 8; k++) { const t = k / 8 * Math.PI / 2; pts.push([0.98 * Math.cos(t), -0.15 + 0.75 * Math.sin(t)]); } return lathe(pts, 28); } });

// ---- ARCHES & FENCES ---------------------------------------------------------------
def({ key: 'arch_1x4', bl: '3659', name: 'Arch 1 x 4', zh: '拱 1×4', cat: 'arch', w: 4, d: 1, h: 3, studs: 'all', accepts: true, verified: true, showColor: 'Tan', note: '骑楼拱廊、桥', build: archPart(4, 3, 0.85) });
def({ key: 'arch_1x6', bl: '3455', name: 'Arch 1 x 6', zh: '拱 1×6', cat: 'arch', w: 6, d: 1, h: 3, studs: 'all', accepts: true, verified: true, showColor: 'Tan', build: archPart(6, 3, 0.85) });
def({ key: 'arch_1x4x2', bl: '6182', name: 'Arch 1 x 4 x 2', zh: '拱 1×4×2', cat: 'arch', w: 4, d: 1, h: 6, studs: 'all', accepts: true, verified: true, showColor: 'Tan', build: archPart(4, 6, 1.1) });
def({ key: 'arch_1x6x2', bl: '3307', name: 'Arch 1 x 6 x 2', zh: '拱 1×6×2', cat: 'arch', w: 6, d: 1, h: 6, studs: 'all', accepts: true, verified: true, showColor: 'Tan', note: '查理大桥、太鼓桥', build: archPart(6, 6, 1.3) });
def({ key: 'fence_1x4', bl: '3633', name: 'Fence 1 x 4 x 1', zh: '栅栏 1×4×1', cat: 'arch', w: 4, d: 1, h: 3, studs: 'none', accepts: true, verified: true, showColor: 'ReddishBrown', build: () => { const geos: THREE.BufferGeometry[] = []; for (const x of [-1.75, -0.9, 0, 0.9, 1.75]) geos.push(box(0.18, 1.2, 0.3, x, 0, 0)); for (const y of [-0.28, 0.42]) geos.push(box(4, 0.16, 0.3, 0, y, 0)); return mergeGeos(geos); } });
def({ key: 'fence_1x4x2', bl: '30055', name: 'Fence 1 x 4 x 2 Spindled', zh: '栏杆 1×4×2', cat: 'arch', w: 4, d: 1, h: 6, studs: 'none', accepts: true, verified: true, showColor: 'White', note: '阳台、桥栏', build: () => { const geos: THREE.BufferGeometry[] = [box(0.3, 2.4, 0.3, -1.85, 0, 0), box(0.3, 2.4, 0.3, 1.85, 0, 0), box(4, 0.25, 0.3, 0, 1.075, 0), box(4, 0.2, 0.3, 0, -1.1, 0)]; for (const x of [-1.1, -0.37, 0.37, 1.1]) geos.push(cyl(0.11, 1.95, 10, 0.11, x, -0.05, 0)); return mergeGeos(geos); } });

// ---- WINDOWS & DOORS ------------------------------------------------------------------
const frame = (w: number, H: number, depth = 0.9) => [box(w, 0.2, depth, 0, -H / 2 + 0.1, 0), box(w, 0.2, depth, 0, H / 2 - 0.1, 0), box(0.2, H, depth, -w / 2 + 0.1, 0, 0), box(0.2, H, depth, w / 2 - 0.1, 0, 0)];
def({ key: 'window_1x2x2', bl: '60592', name: 'Window 1 x 2 x 2 Frame', zh: '窗框 1×2×2', cat: 'window', w: 2, d: 1, h: 6, studs: 'all', accepts: true, verified: true, showColor: 'White', build: () => mergeGeos([...frame(2, 2.4), box(0.14, 2.4, 0.9, 0, 0, 0), ...studGrid(2, 1, 1.2)]) });
def({ key: 'glass_1x2x2', bl: '60601', name: 'Glass for Window 1 x 2 x 2', zh: '窗玻璃 1×2×2', cat: 'window', w: 2, d: 1, h: 6, studs: 'none', accepts: false, verified: true, showColor: 'TransLightBlue', note: '装在窗框内，不单独连接', build: () => { const g = new THREE.BoxGeometry(1.7, 2.1, 0.12); g.deleteAttribute('uv'); return g; } });
def({ key: 'window_1x4x3', bl: '3853', name: 'Window 1 x 4 x 3 Frame', zh: '窗框 1×4×3', cat: 'window', w: 4, d: 1, h: 9, studs: 'all', accepts: true, verified: true, showColor: 'White', build: () => mergeGeos([...frame(4, 3.6), box(0.14, 3.6, 0.9, 0, 0, 0), box(4, 0.14, 0.9, 0, 0.6, 0), ...studGrid(4, 1, 1.8)]) });
def({ key: 'glass_1x4x3', bl: '60603', name: 'Glass for Window 1 x 4 x 3', zh: '窗玻璃 1×4×3', cat: 'window', w: 4, d: 1, h: 9, studs: 'none', accepts: false, verified: true, showColor: 'TransLightBlue', build: () => { const g = new THREE.BoxGeometry(3.7, 3.3, 0.12); g.deleteAttribute('uv'); return g; } });
def({ key: 'doorframe_1x4x6', bl: '60596', name: 'Door Frame 1 x 4 x 6', zh: '门框 1×4×6', cat: 'window', w: 4, d: 1, h: 18, studs: 'all', accepts: true, verified: true, showColor: 'White', build: () => { const H = 7.2; return mergeGeos([box(4, 0.25, 0.9, 0, H / 2 - 0.125, 0), box(0.25, H, 0.9, -1.875, 0, 0), box(0.25, H, 0.9, 1.875, 0, 0), box(4, 0.2, 0.9, 0, -H / 2 + 0.1, 0), ...studGrid(4, 1, H / 2)]); } });
def({ key: 'door_1x4x6', bl: '60616', name: 'Door 1 x 4 x 6 with Stud Handle', zh: '门扇 1×4×6', cat: 'window', w: 4, d: 1, h: 18, studs: 'none', accepts: false, verified: true, showColor: 'ReddishBrown', note: '装在门框内', build: () => mergeGeos([box(3.4, 6.7, 0.25, 0, -0.1, 0), box(2.6, 3.0, 0.12, 0, 1.2, 0.18), box(2.6, 2.2, 0.12, 0, -1.9, 0.18), cyl(0.18, 0.3, 10, 0.18, 1.1, -0.2, 0.3)]) });

// ---- BARS & SMALL DETAILS -------------------------------------------------------------
def({ key: 'antenna_1x4', bl: '3957', name: 'Antenna 1 x 4', zh: '天线 1×4', cat: 'bar', w: 1, d: 1, h: 8, studs: 'none', accepts: true, verified: true, showColor: 'LightBluishGray', note: '旗杆、塔尖、路灯', build: () => { const H = 3.2; return mergeGeos([cyl(0.49, 0.4, 16, 0.49, 0, -H / 2 + 0.2, 0), cyl(0.14, H - 0.4, 10, 0.14, 0, 0.2, 0), cyl(0.2, 0.3, 10, 0.2, 0, H / 2 - 0.15, 0)]); } });
def({ key: 'bar_3l', bl: '87994', name: 'Bar 3L', zh: '杆 3 格', cat: 'bar', w: 1, d: 1, h: 6, studs: 'none', accepts: false, held: true, bar: true, ext: [-0.16, 0.16, -0.16, 0.16], verified: true, showColor: 'PearlGold', note: '插在圆板/圆砖的空心凸点里', build: () => cyl(0.16, 2.4, 10) });
def({ key: 'bar_4l', bl: '30374', name: 'Bar 4L (Lightsaber Blade)', zh: '杆 4 格', cat: 'bar', w: 1, d: 1, h: 8, studs: 'none', accepts: false, held: true, bar: true, ext: [-0.16, 0.16, -0.16, 0.16], verified: true, showColor: 'TransLightBlue', note: '瀑布、光柱、旗杆', build: () => cyl(0.16, 3.2, 10) });
def({ key: 'telescope', bl: '64644', name: 'Minifig Telescope', zh: '望远镜', cat: 'bar', w: 1, d: 1, h: 2, studs: 'none', accepts: true, verified: true, showColor: 'DarkBluishGray', note: '微缩路灯头、烟囱、小塔尖', build: () => mergeGeos([cyl(0.28, 0.5, 14, 0.28, 0, -0.15, 0), cyl(0.38, 0.3, 14, 0.38, 0, 0.25, 0)]) });
def({ key: 'tap_1x1', bl: '4599b', name: 'Tap 1 x 1', zh: '水龙头 1×1', cat: 'bar', w: 1, d: 1, h: 2, studs: 'none', accepts: true, verified: true, showColor: 'LightBluishGray', note: '微缩雕像、路灯、旗杆底座', build: () => mergeGeos([cyl(0.3, 0.4, 12, 0.3, 0, -0.2, 0), cyl(0.14, 0.7, 10, 0.14, 0, 0.35, 0), (() => { const c = new THREE.CylinderGeometry(0.14, 0.14, 0.6, 10); c.rotateX(Math.PI / 2); c.translate(0, 0.55, 0.3); c.deleteAttribute('uv'); return c; })()]) });

// ---- PLANTS -----------------------------------------------------------------------------
def({ key: 'flower_stem', bl: '3741', name: 'Plant Flower Stem', zh: '花茎', cat: 'plant', w: 1, d: 1, h: 3, studs: 'center', accepts: true, verified: true, showColor: 'BrightGreen', note: '顶端可插花瓣板', build: () => { const geos = [cyl(0.49, 0.4, 16, 0.49, 0, -0.4, 0)]; for (const [x, z] of [[0, 0], [0.28, 0.16], [-0.28, 0.16]]) geos.push(cyl(0.07, 1.0, 8, 0.07, x, 0.3, z), cyl(0.16, 0.14, 8, 0.16, x, 0.87, z)); return mergeGeos(geos); } });
def({ key: 'bamboo_leaves', bl: '30176', name: 'Plant Bamboo Leaves', zh: '竹叶', cat: 'plant', w: 1, d: 1, h: 2, studs: 'none', accepts: true, verified: true, showColor: 'Lime', note: '竹林、棕榈叶', build: () => { const geos = [cyl(0.3, 0.4, 12, 0.3, 0, -0.2, 0)]; for (let k = 0; k < 4; k++) { const a = k / 4 * Math.PI * 2 + 0.3; const leaf = box(1.4, 0.08, 0.28, 0.75, 0.2, 0); leaf.rotateZ(0.35); leaf.rotateY(-a); geos.push(leaf); } return mergeGeos(geos); } });

// ---- SET-SPECIFIC (按需入库: real parts added for one city, never invented shapes) -------------------

// ---- MINIFIGURE ----------------------------------------------------------------------------

// ---- BASEPLATES ----------------------------------------------------------------------------
def({ key: 'baseplate_32x32', bl: '3811', name: 'Baseplate 32 x 32', zh: '底板 32×32', cat: 'baseplate', w: 32, d: 32, h: 1, studs: 'all', accepts: false, verified: true, showColor: 'DarkBluishGray', note: '厚度以 1 板近似；底面不可再接', build: boxPart(32, 32, 1) });
def({ key: 'baseplate_16x32', bl: '3857', name: 'Baseplate 16 x 32', zh: '底板 16×32', cat: 'baseplate', w: 16, d: 32, h: 1, studs: 'all', accepts: false, verified: true, showColor: 'DarkBluishGray', note: '与 32×32 拼成 48×32', build: boxPart(16, 32, 1) });


// ---- MINIFIG RIG (real LDraw minifig parts posed per the LDraw minifig standard; baked by tools/ldraw/minifig-asm.mjs) ----
// Stack: legs y..y+6, torso y+6..y+9, head y+9..y+12, hair/hat y+12. Hands are separate parts at the wrist per arm pose
// (d down · f forward 45° · h forward 90° · u raised); held accessories grip the hand, never the body.
ldrawPart({ key: 'fig_legs', id: '970c00', bl: '970c00', name: 'Minifig Hips and Legs', zh: '人仔腿', cat: 'minifig', w: 2, d: 1, h: 6, studs: 'all', accepts: true, anchor: 'origin', lift: 5, body: true, ext: [-0.97, 0.97, -0.5, 0.55], showColor: 'DarkBlue' });
for (const pose of ['d', 'f', 'h', 'u'].flatMap((l) => ['d', 'f', 'h', 'u'].map((r) => l + r)))
  ldrawPart({ key: `fig_torso_${pose}`, id: `figtorso_${pose}`, bl: '973', bom: ['973', '3818', '3819'], name: `Minifig Torso with Arms (L ${pose[0]}, R ${pose[1]})`, zh: `人仔躯干（左${pose[0]} 右${pose[1]}）`, cat: 'minifig', w: 2, d: 1, h: 3, studs: 'all', accepts: true, anchor: 'origin', lift: 3, body: true, ext: [-0.95, 0.95, -0.5, 0.5], showColor: 'BrightRed' }); // ext = body only; arms are covered by the hands
for (const l of ['d', 'f', 'h', 'u']) for (const r of ['d', 'f', 'h', 'u'])
  ldrawPart({ key: `fig_hands_${l}${r}`, id: `fighands_${l}${r}`, bl: '3820', bom: ['3820', '3820'], name: `Minifig Hands (L ${l}, R ${r})`, zh: '人仔手（一对）', cat: 'minifig', w: 2, d: 1, h: 3, studs: 'none', accepts: false, anchor: 'origin', lift: 3, hand: true, attach: true, showColor: 'Yellow', note: '与躯干同格同高：手的位置来自 LDraw 官方装配，永远不会与手臂脱节' });
ldrawPart({ key: 'fig_head', id: '3626c', bl: '3626c', name: 'Minifig Head', zh: '人仔头', cat: 'minifig', w: 1, d: 1, h: 3, studs: 'center', accepts: true, anchor: 'origin', lift: 3, body: true, showColor: 'Yellow' });
ldrawPart({ key: 'fig_hair', id: '3901', bl: '3901', name: 'Minifig Hair Male', zh: '发型·短发', cat: 'minifig', w: 2, d: 2, h: 2, studs: 'none', accepts: true, attach: true, anchor: 'origin', showColor: 'Black' });
ldrawPart({ key: 'hair_tousled', id: '62810', bl: '62810', name: 'Minifig Hair Short Tousled with Side Parting', zh: '发型·侧分乱发', cat: 'minifig', w: 2, d: 2, h: 2, studs: 'none', accepts: true, attach: true, anchor: 'origin', showColor: 'DarkBrown' });
ldrawPart({ key: 'hair_short', id: '40233', bl: '40233', name: 'Minifig Hair Short Tousled', zh: '发型·短乱发', cat: 'minifig', w: 2, d: 2, h: 2, studs: 'none', accepts: true, attach: true, anchor: 'origin', showColor: 'DarkOrange' });
ldrawPart({ key: 'leaves_4x3', id: '2423', bl: '2423', name: 'Plant Leaves 4 x 3', zh: '树叶 4×3', cat: 'plant', w: 1, d: 1, h: 1, studs: 'center', accepts: true, anchor: 'origin', lift: 1, showColor: 'Green', note: '只占茎根一格，叶片向 +z 伸出三格半' });

// ---- L1 SPECIALTY MOULDS (geometry baked from the LDraw official library; stud semantics by hand) ------------------------
// Shared life layer — open to every country.
const ACC = { cat: 'accessory' as Category, studs: 'none' as StudPattern, accepts: true, held: true, anchor: 'oxz' as Anchor };
ldrawPart({ ...ACC, key: 'cup', id: '3899', bl: '3899', name: 'Minifig Cup', zh: '茶杯', w: 1, d: 1, h: 3, showColor: 'White', note: '手持或放在桌上；生活层' });
ldrawPart({ ...ACC, key: 'goblet', id: '2343', bl: '2343', name: 'Minifig Goblet', zh: '高脚杯', w: 1, d: 1, h: 5, showColor: 'TransClear' });
ldrawPart({ ...ACC, key: 'camera', id: '30089b', bl: '30089', name: 'Minifig Camera Snapshot', zh: '相机', w: 2, d: 1, h: 3, showColor: 'Black', note: '游客举相机' });
ldrawPart({ ...ACC, key: 'pushbroom', id: '3836', bl: '3836', name: 'Minifig Pushbroom', zh: '扫帚', w: 2, d: 1, h: 11, showColor: 'ReddishBrown', note: '手柄在手里，刷头落地' });
ldrawPart({ ...ACC, key: 'hand_fan', id: '93553', bl: '93553', name: 'Minifig Hand Fan', zh: '折扇', w: 2, d: 1, h: 5, showColor: 'White', note: '首次用于：京都' });
ldrawPart({ ...ACC, key: 'tray', id: '29635', bl: '29635', name: 'Minifig Serving Tray 2 x 3', zh: '托盘 2×3', w: 3, d: 2, h: 2, studs: 'none', showColor: 'ReddishBrown', note: '光面托盘（LDraw 无凸点）：杯碗只能放在旁边的桌面上' });
ldrawPart({ ...ACC, key: 'rice_bowl', id: '34172', bl: '34172', name: 'Minifig Rice Bowl', zh: '饭碗', w: 1, d: 1, h: 2, studs: 'none', showColor: 'White', note: '首次用于：京都' });
ldrawPart({ ...ACC, key: 'teapot', id: '23986', bl: '23986', name: 'Minifig Teapot', zh: '茶壶', w: 2, d: 2, h: 4, showColor: 'DarkGreen', note: '首次用于：京都' });
ldrawPart({ ...ACC, key: 'swirl_1x1', id: '15470', bl: '15470', name: 'Plate 1 x 1 Round with Swirled Top', zh: '旋顶圆板（抹茶冰）', w: 1, d: 1, h: 2, held: false, showColor: 'BrightGreen', note: 'NPU：抹茶软冰、和菓子' });
ldrawPart({ ...ACC, key: 'lantern', id: '37776', bl: '37776', name: 'Minifig Lantern', zh: '提灯', w: 1, d: 1, h: 5, bar: true, loop: 1, accepts: false, showColor: 'Black', note: '盒子只算灯体 5 板；顶部提手（杆）伸出盒外，挂进夹子或握在手里' });
ldrawPart({ ...ACC, key: 'bottle', id: '95228', bl: '95228', name: 'Minifig Bottle 1 x 1 x 2', zh: '瓶子', w: 1, d: 1, h: 6, showColor: 'TransGreen', note: '清酒瓶、水瓶' });
ldrawPart({ ...ACC, key: 'basket', id: '4523', bl: '4523', name: 'Minifig Container D-Basket', zh: '篓', w: 2, d: 2, h: 4, studs: 'none', showColor: 'ReddishBrown' });
ldrawPart({ ...ACC, key: 'umbrella', id: '4094b', bl: '4094', name: 'Minifig Umbrella', zh: '伞面', w: 6, d: 6, h: 4, held: false, accepts: false, hollow: true, studs: 'none', showColor: 'BrightRed', note: '中心孔套在竖杆上（杆在手里）' });
ldrawPart({ key: 'seat_2x2', id: '4079', bl: '4079', name: 'Minifig Seat 2 x 2', zh: '座椅 2×2', cat: 'accessory', w: 2, d: 2, h: 6, studs: (_i, j) => j === 1, accepts: true, showColor: 'ReddishBrown', note: '长凳、缘侧坐具' });
ldrawPart({ key: 'barrel_2x2', id: '2489', bl: '2489', name: 'Barrel 2 x 2 x 1 2/3', zh: '木桶 2×2', cat: 'accessory', w: 2, d: 2, h: 5, studs: 'none', accepts: true, showColor: 'ReddishBrown', note: '手水、酒桶' });
const ANI = { cat: 'animal' as Category, studs: 'none' as StudPattern, accepts: true, anchor: 'oxz' as Anchor };
ldrawPart({ ...ANI, anchor: 'bbox', key: 'fish', id: '64648', bl: '64648', name: 'Animal Fish Straight', zh: '鱼（锦鲤）', w: 1, d: 3, h: 3, showColor: 'Orange', note: '首次用于：京都。底部反凸点坐在池面的透明板上' });
// Footprint = the part's real connection, not its body: one socket → 1×1, two anti-studs → 1×2. An even box centres the origin on a
// stud boundary and the socket lands between two studs (the bird on the torii, Eric 2026-09-18). `ext` still covers the overhanging body.
ldrawPart({ ...ANI, key: 'cat', id: '11602', bl: '11602', name: 'Animal Cat Sitting', zh: '猫（坐）', w: 1, d: 2, h: 7, showColor: 'White', note: '底部两个反凸点，1×2' });
ldrawPart({ ...ANI, key: 'songbird', id: '41835', bl: '41835', name: 'Animal Bird Songbird', zh: '小鸟', w: 1, d: 1, h: 4, lift: -0.5, showColor: 'DarkPink', note: '一个底座套一个凸点：1×1，身体悬出；下沉半板让脚座贴板面' });
ldrawPart({ ...ANI, key: 'frog', id: '33320', bl: '33320', name: 'Animal Frog', zh: '青蛙', w: 1, d: 1, h: 3, showColor: 'BrightGreen' });
ldrawPart({ ...ANI, key: 'butterfly', id: '80674', bl: '80674', name: 'Animal Butterfly with Stud Tube', zh: '蝴蝶', w: 1, d: 1, h: 2, showColor: 'Lavender', note: '一个套管套一个凸点：1×1' });
ldrawPart({ ...ANI, key: 'duckling', id: '49661', bl: '49661', name: 'Animal Duckling', zh: '小鸭', w: 1, d: 1, h: 4, showColor: 'Yellow' });
const PLT = { cat: 'plant' as Category, accepts: true };
ldrawPart({ ...PLT, key: 'flower_7', id: '32606', bl: '32606', name: 'Plant Flower with 7 Alternate Petals with Bar and Pin Hole', zh: '七瓣花（带杆）', w: 1, d: 1, h: 2, studs: 'none', accepts: false, bar: true, hollow: true, showColor: 'BrightPink', note: '杆插进空心凸点（1×1 圆板、花瓣板、花茎）；顶孔可再插' });
ldrawPart({ ...PLT, key: 'leaves_6x5', id: '2417', bl: '2417', name: 'Plant Leaves 6 x 5', zh: '树叶 6×5', w: 1, d: 1, h: 1, studs: 'center', hollow: true, anchor: 'origin', lift: 1, showColor: 'Green', note: '只占茎根一格，叶片向外悬出五格；官方樱花/松树做法（10315 用白色当樱花）' });
ldrawPart({ ...PLT, key: 'flower_small', id: '3742', bl: '3742', name: 'Plant Flower', zh: '小花簇', w: 1, d: 1, h: 1, studs: 'none', showColor: 'White', note: '插在花茎顶上' });
ldrawPart({ ...PLT, key: 'grass_stem', id: '15279', bl: '15279', name: 'Plant Grass Stem', zh: '草茎', w: 1, d: 1, h: 8, studs: 'none', accepts: false, bar: true, showColor: 'BrightGreen', note: '杆插进空心凸点' });
ldrawPart({ ...PLT, key: 'lilypad', id: '4727', bl: '4727', name: 'Plant Flower 2 x 2 Leaves', zh: '睡莲叶 2×2', w: 2, d: 2, h: 3, studs: 'center', hollow: true, showColor: 'Green' });
ldrawPart({ ...PLT, key: 'lotus', id: '4728', bl: '4728', name: 'Plant Flower 2 x 2 with Hollow Stud', zh: '莲花 2×2', w: 2, d: 2, h: 3, studs: 'center', hollow: true, showColor: 'BrightPink' });
ldrawPart({ key: 'fence_lattice_1x4x2', id: '3185', bl: '3185', name: 'Fence Lattice 1 x 4 x 2', zh: '竹垣栅栏 1×4×2', cat: 'arch', w: 4, d: 1, h: 6, studs: 'none', accepts: true, showColor: 'ReddishBrown', note: '竹垣、露地围栏' });
ldrawPart({ key: 'arch_1x8x2', id: '3308a', bl: '3308', name: 'Arch 1 x 8 x 2', zh: '拱 1×8×2', cat: 'arch', w: 8, d: 1, h: 6, studs: 'all', accepts: true, showColor: 'BrightRed', note: '太鼓桥的拱腹' });
ldrawPart({ key: 'rock_4x4', id: '30294c01', bl: '30294', name: 'Rock 4 x 4 x 3', zh: '岩石 4×4×3', cat: 'brick-mod', w: 4, d: 4, h: 9, studs: (i, j) => i >= 1 && i <= 2 && j >= 1 && j <= 2, accepts: true, showColor: 'DarkBluishGray', note: '石组主石' });
ldrawPart({ key: 'nugget', id: '35646', bl: '35646', name: 'Rock 1.25 x 1.25 x 1.2 Nugget', zh: '小石块', cat: 'brick-mod', w: 1, d: 1, h: 3, studs: 'none', accepts: true, showColor: 'LightBluishGray', note: '添石、河石' });
ldrawPart({ key: 'clip_v', clip: true, id: '4085c', bl: '4085c', name: 'Plate 1 x 1 with Clip Vertical', zh: '竖夹板 1×1', cat: 'plate-mod', w: 1, d: 1, h: 1, studs: 'none', accepts: true, hollow: true, showColor: 'Black', note: '夹竖杆：挂提灯、立幟旗；夹口伸出格外 0.7' });
ldrawPart({ key: 'clip_h', clip: true, id: '61252', bl: '61252', name: 'Plate 1 x 1 with Clip Horizontal', zh: '横夹板 1×1', cat: 'plate-mod', w: 1, d: 1, h: 1, studs: 'none', accepts: true, hollow: true, showColor: 'Black' });
ldrawPart({ key: 'flag_trapezoid', clip: true, id: '44676b', bl: '44676', name: 'Flag 2 x 2 Trapezoid', zh: '梯形旗 2×2（幟）', cat: 'plate-mod', w: 1, d: 3, h: 5, studs: 'none', accepts: false, hollow: true, showColor: 'DarkBlue', note: '夹子夹住竖杆，做幟旗与暖帘布' });
ldrawPart({ key: 'flag_square', clip: true, id: '11055', bl: '11055', name: 'Flag 2 x 2 Square', zh: '方旗 2×2', cat: 'plate-mod', w: 1, d: 3, h: 5, studs: 'none', accepts: false, hollow: true, showColor: 'White' });
ldrawPart({ key: 'window_1x2x3', id: '60593', bl: '60593', name: 'Window 1 x 2 x 3 Frame', zh: '窗框 1×2×3', cat: 'window', w: 2, d: 1, h: 9, studs: 'all', accepts: true, anchor: 'origin', lift: 9, showColor: 'DarkBrown' });   // origin at the top: frame and pane share it, so the pane hangs from the hinge line
ldrawPart({ key: 'pane_lattice_1x2x3', id: 'pane_lattice', bl: '2529', name: 'Window 1 x 2 x 3 Pane Latticed', zh: '格子窗扇 1×2×3（障子）', cat: 'window', w: 2, d: 1, h: 9, studs: 'none', accepts: false, anchor: 'origin', lift: 9, showColor: 'White', note: '装在 1×2×3 窗框里；白色 = 障子。烘的是转进框平面并居中的装配，和窗框同原点' });
ldrawPart({ key: 'door_lattice', id: '92589', bl: '92589', name: 'Door 1 x 4 x 6 Lattice', zh: '格子门 1×4×6', cat: 'window', w: 4, d: 1, h: 18, studs: 'none', accepts: false, showColor: 'DarkBrown', note: '装在 1×4×6 门框里' });
// Kyoto-exclusive moulds (≤ 12 per country)
ldrawPart({ key: 'fig_kasa', id: '93059', bl: '93059', name: 'Minifig Hat Conical Asian', zh: '人仔草帽', cat: 'minifig', w: 3, d: 3, h: 2, studs: 'none', accepts: true, attach: true, anchor: 'origin', showColor: 'Tan' });
ldrawPart({ key: 'hair_topknot', id: '93562', bl: '93562', name: 'Minifig Hair Female with Top Knot Bun and Forelock', zh: '发型·高髻', cat: 'minifig', w: 2, d: 2, h: 2, studs: 'none', accepts: true, attach: true, anchor: 'origin', showColor: 'Black', note: '首次用于：京都' });
ldrawPart({ key: 'hair_highbun', id: '27186', bl: '27186', name: 'Minifig Hair with Large High Bun', zh: '发型·大圆髻', cat: 'minifig', w: 2, d: 2, h: 2, studs: 'none', accepts: true, attach: true, anchor: 'origin', showColor: 'Black', note: '首次用于：京都' });
ldrawPart({ key: 'hair_long', id: '12890', bl: '12890', name: 'Minifig Hair Female Long Straight', zh: '发型·长直发', cat: 'minifig', w: 2, d: 2, h: 2, studs: 'none', accepts: true, attach: true, anchor: 'origin', showColor: 'Black' });

// ---- CHERRY-TREE VOCABULARY (the elements LEGO's own sakura builds are made of: 10315, 10281, 21060, 40725) -----------------
ldrawPart({ cat: 'plant' as Category, accepts: true, key: 'plant_3leaves', id: '32607', bl: '32607', name: 'Plate 1 x 1 Round with 3 Leaves', zh: '三叶圆板 1×1', w: 1, d: 1, h: 1, studs: 'center', anchor: 'origin', lift: 1, showColor: 'BrightGreen', note: '花萼，也是花团挂到枝上的接口（10315）' });
ldrawPart({ cat: 'plant' as Category, accepts: true, key: 'petal_1x1', id: '24866', bl: '24866', name: 'Plate 1 x 1 with 5 Petals', zh: '五瓣花 1×1', w: 1, d: 1, h: 1, studs: 'none', hollow: true, anchor: 'origin', lift: 1, showColor: 'BrightPink', note: '官方樱花的花本体；顶面空心凸点可再插花' });
ldrawPart({ key: 'travis_1x1', id: '4733', bl: '4733', name: 'Brick 1 x 1 with Studs on Four Sides', zh: '四面凸点砖 1×1', cat: 'brick-mod', w: 1, d: 1, h: 3, studs: 'all', accepts: true, hollow: true, showColor: 'ReddishBrown', note: '五个空心凸点 = 五向插杆接口；官方拼树的树心' });
ldrawPart({ key: 'roundplate_open', id: '85861', bl: '85861', name: 'Plate 1 x 1 Round with Open Stud', zh: '空心凸点圆板 1×1', cat: 'plate-mod', w: 1, d: 1, h: 1, studs: 'all', accepts: true, hollow: true, showColor: 'ReddishBrown' });
ldrawPart({ key: 'angle_bar', id: '65578', bl: '65578', name: 'Plate 1 x 1 Round with Angled Bar', zh: '斜杆圆板 1×1', cat: 'plate-mod', w: 1, d: 1, h: 3, studs: 'center', accepts: false, bar: true, anchor: 'oxz', showColor: 'ReddishBrown', note: '杆插进空心凸点，花板斜伸出去（40725 的组花做法）' });
ldrawPart({ key: 'crown_5pt', id: '39262', bl: '39262', name: 'Minifig Crown with 5 Points', zh: '五爪冠（花瓣）', cat: 'plant', w: 1, d: 1, h: 3, studs: 'center', accepts: true, hollow: true, anchor: 'oxz', showColor: 'White', note: '40725 用它当五片花瓣，中心再落一朵五瓣花' });


// ---- SINGAPORE VOCABULARY (2026-09-18) — life layer first (open to every country), then Singapore-exclusive moulds ---------------
// Held food and tools. The frypan is gripped by its handle (−z canonical); the ice-cream cone by its shaft, its scoops sit on the cone's stud.
ldrawPart({ ...ACC, key: 'frypan', id: '4528', bl: '4528', name: 'Minifig Frypan', zh: '煎锅', w: 2, d: 3, h: 2, showColor: 'Black', note: '把手朝 −z；手握把手。首次用于：新加坡（小贩炒锅）' });
ldrawPart({ ...ACC, key: 'icecream_cone', id: '11610', bl: '11610', name: 'Cone 1 x 1 Inverted with Shaft', zh: '冰淇淋筒', w: 1, d: 1, h: 4.5, studs: 'center', accepts: false, showColor: 'Tan', note: '杆在手里；盒高 4.5 板 = 真实高度，顶上凸点正好接 6254 冰淇淋球' });
ldrawPart({ ...ACC, key: 'icecream_scoops', id: '6254', bl: '6254', name: 'Minifig Food Ice Cream Scoops', zh: '冰淇淋球', w: 1, d: 1, h: 4, held: false, showColor: 'White', note: '底部反凸点坐在筒的凸点上' });
ldrawPart({ ...ACC, key: 'popsicle', id: '30222', bl: '30222', name: 'Minifig Food Popsicle', zh: '雪条', w: 1, d: 1, h: 6, showColor: 'Coral', note: '棍在下，握棍；推车招牌上的展示品' });
ldrawPart({ ...ANI, key: 'otter', id: '67631', bl: '67631', name: 'Animal Otter', zh: '水獭', w: 1, d: 1, h: 4, showColor: 'ReddishBrown', note: '一个底座套一个凸点：1×1，身体前后各悬出一格半；头朝 +z。首次用于：新加坡（滨海湾水獭）' });
// Classic LEGO palm. 2536b trunk segments are exactly 4 plates tall and stack at 4. The palm top 2566b was baked and rejected: its leaf slots
// need a 25° tilt our grid has not got, and used as a pedestal its four slot lips read as a claw holding a disc. Instead a bar in the last
// segment's core (the hole meant for the top's pin) carries a 1×1 round plate and a 2×2 round-plate hub; the 1×2-plate-based leaves mount on that.
ldrawPart({ ...PLT, key: 'palm_trunk', id: '2536b', bl: '2536b', name: 'Plant Tree Palm Trunk with Short Indented Connector', zh: '椰树干段', w: 2, d: 2, h: 4, studs: 'center', hollow: true, anchor: 'origin', extY: [0, 4], showColor: 'ReddishBrown', note: '段高 4 板，叠段间距 4；底部销钉插进下一段的管芯或 2×2 圆板的中孔（碰撞只算段身）；顶部管芯是 3.18 杆孔（原本给顶帽 2566b 的销钉）' });
ldrawPart({ ...PLT, key: 'palm_leaf_l', id: '2518', bl: '2518', name: 'Plant Tree Palm Leaf Large', zh: '椰树叶·大', w: 2, d: 1, h: 1, studs: 'all', anchor: 'origin', lift: 1, extY: [0, 1.5], showColor: 'Green', note: '叶座是 1×2 板（两凸点、两反凸点），叶片向 +x 伸出 8 格并下垂 5 板；碰撞只算叶座，叶片靠渲染自查' });
ldrawPart({ ...PLT, key: 'palm_leaf_s', id: '6148', bl: '6148', name: 'Plant Palm Leaf Small', zh: '椰树叶·小', w: 2, d: 1, h: 1, studs: 'all', anchor: 'origin', lift: 1, extY: [0, 1.5], showColor: 'Green', note: '同上，伸出 7 格、下垂 4 板' });
// Shophouse and street furniture
ldrawPart({ key: 'shutter_1x2x3', id: 'shutter_closed', bl: '3856', name: 'Window 1 x 2 x 3 Shutter (closed)', zh: '百叶窗扇 1×2×3（关）', cat: 'window', w: 2, d: 1, h: 9, studs: 'none', accepts: false, anchor: 'origin', lift: 9, showColor: 'DarkGreen', note: '装在 1×2×3 窗框上，贴着窗框 +z 面关闭；与窗框同格同原点（宿主规则）。娘惹店屋的百叶' });
ldrawPart({ key: 'shutter_open_1x2x3', id: 'shutter_open', bl: '3856', name: 'Window 1 x 2 x 3 Shutter (open)', zh: '百叶窗扇 1×2×3（开）', cat: 'window', w: 2, d: 1, h: 9, studs: 'none', accepts: false, anchor: 'origin', lift: 9, showColor: 'DarkGreen', note: '同一扇 3856，绕 −x 侧铰链向外转 90°，垂直于立面；与窗框同格同原点。店屋一扇推开的百叶（Eric 10-01）' });
ldrawPart({ key: 'shutter_open_r_1x2x3', id: 'shutter_open_r', bl: '3856', name: 'Window 1 x 2 x 3 Shutter (open, right hinge)', zh: '百叶窗扇 1×2×3（开，右铰）', cat: 'window', w: 2, d: 1, h: 9, studs: 'none', accepts: false, anchor: 'origin', lift: 9, showColor: 'DarkGreen', note: '同一扇 3856 挂在窗框 +x 侧，向外转 90°；和左铰那扇成一对，左右对称地推开' });
ldrawPart({ key: 'plate_4x4_cut', id: '30503', bl: '30503', name: 'Plate 4 x 4 without Corner', zh: '切角板 4×4', cat: 'plate-mod', w: 4, d: 4, h: 1, studs: 'all', accepts: true, anchor: 'origin', lift: 1, mask: (i, j) => i + j <= 3, showColor: 'White', note: '对角切去 (+x,+z) 一角；圆角岸线、甲板端头' });
ldrawPart({ key: 'roundplate_6x6', id: '11213', bl: '11213', name: 'Plate 6 x 6 Round with Hole', zh: '圆板 6×6（中孔）', cat: 'plate-mod', w: 6, d: 6, h: 1, studs: 'all', accepts: true, anchor: 'origin', lift: 1, mask: (i, j) => Math.hypot(i + 0.5 - 3, j + 0.5 - 3) < 2.9, showColor: 'LightBluishGray', note: '擎天树冠顶：1→2→4→6 逐级张开的最后一级' });
ldrawPart({ key: 'wheelplate_2x2', id: '4600', bl: '4600', name: 'Plate 2 x 2 with 2 Wheel Pins', zh: '轮销板 2×2', cat: 'plate-mod', w: 2, d: 2, h: 1, studs: 'all', accepts: true, anchor: 'origin', lift: 1, ext: [-1.7, 1.7, -1, 1], showColor: 'LightBluishGray', note: '±x 各一根轮销；轮子是与它同格同原点的装配件' });
ldrawPart({ key: 'cart_wheel_l', id: 'cart_wheel_l', bl: '4624', name: 'Wheel Rim 6.4 x 8 on the +x pin', zh: '小轮（+x 销）', cat: 'accessory', w: 2, d: 2, h: 1, studs: 'none', accepts: false, anchor: 'origin', lift: 1, showColor: 'Black', note: '与 4600 同格同原点；轮底比板底低 0.9 板，所以推车停在一块地色 2×2 板上（轮子离地 0.1 板）' });
ldrawPart({ key: 'cart_wheel_r', id: 'cart_wheel_r', bl: '4624', name: 'Wheel Rim 6.4 x 8 on the -x pin', zh: '小轮（−x 销）', cat: 'accessory', w: 2, d: 2, h: 1, studs: 'none', accepts: false, anchor: 'origin', lift: 1, showColor: 'Black' });
// Marina Bay Sands v10 (2026-10-01): the SkyPark hull and the tower
ldrawPart({ key: 'curve_inv_6x1', id: '42023', bl: '42023', name: 'Slope Curved 6 x 1 Inverted', zh: '反弧坡 6×1', cat: 'curve', w: 1, d: 6, h: 3, studs: (_i, j) => j < 4, accepts: true, showColor: 'White', note: '高端在 −z（j 0），薄端在 +z；顶面四个凸点在高端一侧。挂在板下做船底的弧：金沙空中花园的悬挑' });
ldrawPart({ key: 'plate_4x6_round', id: '3766', bl: '3766', name: 'Plate 4 x 6 with Rounded Ends', zh: '圆头板 4×6', cat: 'plate-mod', w: 6, d: 4, h: 1, studs: 'all', accepts: true, anchor: 'origin', lift: 1, mask: (i, j) => !((i === 0 || i === 5) && (j === 0 || j === 3)), showColor: 'White', note: '两端半圆：空中花园的船头与船尾' });
ldrawPart({ key: 'tile_quarter_1x1', id: '25269', bl: '25269', name: 'Tile 1 x 1 Quarter Circle', zh: '四分之一圆光面砖 1×1', cat: 'tile', w: 1, d: 1, h: 1, studs: 'none', accepts: true, showColor: 'White', note: '圆角在 (+x, +z)，rot 1 → (+x, −z)，2 → (−x, −z)，3 → (−x, +z)。圆头板上的收口（27925 是 2×2 的空心"通心粉"瓦，不是实心四分之一圆）' });
ldrawPart({ key: 'mbs10_tower', id: 'mbs10_tower', bl: 'asm', bom: ['30414', '11211', '3069b', '2412b', '3937', '3938', '3666', '6636'], name: 'Marina Bay Sands hotel tower (two leaves, the back one leaning on hinges)', zh: '金沙酒店塔（两片墙，后片立在铰链砖上内倾）', cat: 'brick', w: 6, d: 4, h: 45, studs: (_i, j) => j === 3, accepts: true, anchor: 'origin', ext: [-3, 3, -2, 2.4], showColor: 'White', note: '每片墙 1 格厚：1×4 / 1×2 侧凸点砖错缝，1×2 透明光面砖对齐成格；海湾侧一片直立（j 3），后片脚在 j 0、顶靠到前片背面。顶面只有前片一排凸点' });
ldrawPart({ key: 'merlion6', id: 'merlion6', bl: 'asm', bom: ['87087', '26604', '3700', '25269', '42022', '11477', '54200', '98138', '6141', '11212', '3666', '3710', '3005', '3004', '3622', '3010', '3023', '3024', '3070b'], name: 'Merlion statue (studs-out sculpture)', zh: '鱼尾狮（侧凸点雕塑）', cat: 'brick-mod', w: 7, d: 5, h: 39, studs: 'none', accepts: true, anchor: 'origin', ext: [-4.6, 3.5, -2.8, 2.8], showColor: 'White', note: '面向 +x。尾巴在背后脚下（x −1..0）卷起；身体 x 1..6 × z 1..4；鬃毛竖立的弧坡厚端在 16.5 板（下摆外翻 1.2 格）；嘴在 26 板，喷口在 x 6；见 tools/ldraw/asm-merlion.mjs' });
ldrawPart({ key: 'grove6', id: 'grove6', bl: 'asm', bom: ['3062b', '87087', '32607', '4032a', '15535', '4519', '3943b', '4285b', '11090', '87994', '3021', '3710', '3623', '48336'], name: 'Supertree Grove: three Supertrees and the OCBC Skyway', zh: '擎天树林：三棵擎天树与 OCBC 天桥', cat: 'round', w: 16, d: 13, h: 49, studs: 'none', accepts: true, anchor: 'origin', ext: [-9.4, 10.4, -7.9, 8.9], showColor: 'Magenta', note: '树干 x 3..5 / 12..14（z 3..5）与矮树 x 7..9（z 9..11）；树冠 6×6 网格碟 + 8 根外翻细杆；天桥在第二道种植环（20 板）上；见 tools/ldraw/asm-grove.mjs' });

export const PART_LIST = Object.values(PARTS);
export { PLATE, STUD_R, STUD_H };

// ---- SINGAPORE STUDS-OUT ASSEMBLIES (2026-09-19, tools/ldraw/asm-singapore.mjs → vendor/ldraw/asm/*.ldr → bake). Real parts on real side studs
// (87087 / 26604 / 11211), baked per colour and hosted on the body part; the scene grid sees one 3×3 or 6×2 box. Eric lifted the no-SNOT rule.
ldrawPart({ key: 'merlion_body', id: 'merlion_body', bl: 'asm', bom: ['26604', '87087', '3005', '24866', '6141', '3020', '3710', '3023', '3024', '3623', '3021', '4070', '11477', '49307', '3040b', '54200', '60481a'], name: 'Merlion statue (studs-out assembly, white)', zh: '鱼尾狮（侧凸点装配，白）', cat: 'brick-mod', w: 6, d: 3, h: 25, studs: 'none', accepts: true, anchor: 'origin', ext: [-3.6, 3, -2.3, 2.5], showColor: 'White', note: 'x −1..4：头 −1..1 前伸一格、身 0..2、鬃毛罩 2..3（宽 −1..3）、尾 3..4。鳞片 = 侧凸点上的花瓣板/圆板；眼与嘴 = 车灯砖的凹槽；鬃毛 = 柱顶弧坡逐级后退；尾 = 两块 65° 陡坡上扬' });
ldrawPart({ key: 'merlion_jet', id: 'merlion_jet', bl: 'asm', bom: ['6141'], name: 'Merlion nozzle (trans-light blue round plate in the mouth recess)', zh: '鱼尾狮喷口（嘴槽里的透明浅蓝圆板）', cat: 'brick-mod', w: 6, d: 3, h: 25, studs: 'none', accepts: false, anchor: 'origin', ext: [-3.6, 3, -2.3, 2.5], showColor: 'TransLightBlue', note: '宿主 merlion_body' });
ldrawPart({ key: 'mbs_core', id: 'mbstower_core', bl: 'asm', bom: ['11211', '3004', '3023', '3937', '3938'], name: 'MBS tower core (two 2-deep slabs of side-stud bricks, the bay slab on hinge bricks leaning in 3°)', zh: '金沙塔芯（两片 2 格厚侧凸点砖板，海湾侧一片立在铰链砖上内倾 3°）', cat: 'brick', w: 6, d: 5, h: 49, studs: 'all', accepts: true, anchor: 'origin', ext: [-3, 3, -3.1, 3.05], showColor: 'White', note: '21057 的技法 + 真实的纸牌倾斜：后板直立，前板站在三块 1×2 铰链砖上向内靠到板顶相接；顶面 6×4，空中花园正好压在上面' });
ldrawPart({ key: 'mbs_glass', id: 'mbstower_glass', bl: 'asm', bom: ['3023'], name: 'MBS tower glazing (trans-dark blue 1×2 plates)', zh: '金沙玻璃幕墙（透明深蓝 1×2 板）', cat: 'brick', w: 6, d: 5, h: 49, studs: 'none', accepts: false, anchor: 'origin', ext: [-3, 3, -3.1, 3.05], showColor: 'TransDarkBlue', note: '宿主 mbs_core' });
ldrawPart({ key: 'stree_cone', id: 'streecanopy_cone', bl: 'asm', bom: ['87994', '3942c'], name: 'Supertree canopy stem (3L bar + cone 2×2×2 upside down)', zh: '擎天树冠茎（杆 + 倒置圆锥）', cat: 'round', w: 6, d: 6, h: 9, studs: 'none', accepts: false, bar: true, anchor: 'origin', showColor: 'DarkPurple', note: '杆插进树干顶的空心凸点圆板；圆锥倒置套在杆上，宽口朝上就是树冠的喇叭口' });
ldrawPart({ key: 'stree_bowl', id: 'streecanopy_bowl', bl: 'asm', bom: ['4285b'], name: 'Supertree canopy (6×6 webbed dish upside down, studs into the cone)', zh: '擎天树冠（倒扣的 6×6 网格碟，凸点插进圆锥底）', cat: 'round', w: 6, d: 6, h: 9, studs: 'none', accepts: false, anchor: 'origin', showColor: 'Magenta', note: '宿主 stree_cone；辐条镂空 = 紫色钢格网' });
// Members of the exploded assemblies (bp.assembly): every real brick an assembly is made of, keyed ld_<LDraw id>, geometry in the LDraw frame
// centred on its body box. Registered after PART_LIST so the catalogue page lists the moulds we place by hand, not these.
for (const id of new Set(Object.values(ASM).flat().map((m) => m.id))) {
  if (!hasBaked(id)) continue;   // a member list whose parts are not baked yet (minifig rigs never explode); bp.assembly throws if it is used
  const b = bodyBox(id); let name = LDRAW_NAME(id); const moved = /^~Moved to (\S+)/.exec(name); if (moved) name = LDRAW_NAME(moved[1]);   // 3023 → 3023b: same mould, BrickLink keeps 3023
  const basic = /^(Brick|Plate|Tile)\s+\d+\s+x\s+\d+(\s+x\s+\d+)?$/.test(name);
  def({ key: `ld_${id}`, bl: id, name, zh: name, cat: basic ? (/^Tile/.test(name) ? 'tile' : /^Plate/.test(name) ? 'plate' : 'brick') : 'brick-mod', w: Math.max(1, Math.round(b[3] - b[0])), d: Math.max(1, Math.round(b[5] - b[2])), h: +((b[4] - b[1]) / PLATE).toFixed(2),
    studs: 'none', accepts: false, verified: true, ldraw: id, anchor: 'raw', member: true, showColor: 'White', build: () => ldrawGeometry(id, 0, 0, 'raw') });
}

// ---- PRAGUE VOCABULARY (2026-10-02) — Gothic spires and stone (Týn Church first; shared with the Old Town Hall and the Bridge Tower) -----------
ldrawPart({ key: 'slope75_corner_2x2x3', id: '3685', bl: '3685', name: 'Slope Brick 75 2 x 2 x 3 Double Convex', zh: '75° 双凸角坡 2×2×3', cat: 'slope', w: 2, d: 2, h: 9, studs: (i, j) => i === 0 && j === 0, accepts: true, showColor: 'DarkBluishGray', note: '凸点在 (−x, −z) 角，两个低坡面朝 +x、+z；rot 1 → 凸点 (−x, +z)…与 hipCorners 同规则。一个凸点在内角；四块拼成 4×4 → 2×2 的陡塔顶（泰恩、桥塔）' });
ldrawPart({ key: 'slope75_peak_2x2x2', id: '3688', bl: '3688', name: 'Slope Brick 75 2 x 2 x 2 Quadruple Convex', zh: '75° 四凸坡 2×2×2', cat: 'slope', w: 2, d: 2, h: 6, studs: 'none', studPoints: [[0, 0]], accepts: true, showColor: 'DarkBluishGray', note: '四面收成尖，顶上一个空心凸点在正中：塔顶在中轴上接 1×1 圆砖' });
ldrawPart({ key: 'ski_pole', id: '90540', bl: '90540', name: 'Minifig Ski Pole', zh: '滑雪杖（尖顶）', cat: 'bar', w: 1, d: 1, h: 7, studs: 'none', accepts: false, bar: true, showColor: 'PearlGold', note: '杆插进圆锥顶的孔：哥特尖塔的金色尖顶（10253 大本钟的做法）' });
ldrawPart({ key: 'arch_pointed_1x3x3', id: '13965', bl: '13965', name: 'Arch 1 x 3 x 3 Pointed', zh: '尖拱 1×3×3', cat: 'arch', w: 1, d: 3, h: 9, studs: 'all', accepts: true, showColor: 'DarkBluishGray', note: '哥特尖拱窗（21061 巴黎圣母院）。LDraw 里它沿 z 摆：rot 1 横放在立面上' });
ldrawPart({ key: 'window_round_1x2x3', id: '30044', bl: '30044', name: 'Window 1 x 2 x 2 2/3 with Rounded Top', zh: '圆顶窗框 1×2×2⅔', cat: 'window', w: 2, d: 1, h: 8, studs: 'none', studPoints: [[0, 0]], accepts: true, showColor: 'DarkBluishGray', note: '塔身上层的长窗；圆顶正中只有一颗凸点（LDraw）' });
ldrawPart({ key: 'statuette', id: '90398', bl: '90398', name: 'Minifig Statuette', zh: '小雕像', cat: 'accessory', w: 1, d: 1, h: 5, studs: 'none', accepts: true, anchor: 'bbox', showColor: 'PearlGold', note: '底座套一个凸点。泰恩山墙的金色圣母、查理大桥的黑色雕像' });
ldrawPart({ key: 'slope75_2x1x3', id: '4460b', bl: '4460b', name: 'Slope Brick 75 2 x 1 x 3', zh: '75° 陡坡 2×1×3', cat: 'slope', w: 1, d: 2, h: 9, studs: 'back', accepts: true, showColor: 'DarkBluishGray', note: '凸点在高端（−z），坡面朝 +z。泰恩山墙三角：两块背对背' });
ldrawPart({ key: 'tyn_medallion', id: 'tyn_medallion', bl: 'asm', bom: ['11211', '14769'], name: 'Gable medallion (1×2 side-stud brick + 2×2 round Pearl Gold tile)', zh: '山墙金色圣母圆盘（侧凸点砖 + 2×2 金色圆砖片）', cat: 'brick-mod', w: 2, d: 1, h: 3, studs: 'all', accepts: true, anchor: 'origin', ext: [-1, 1, -0.5, 0.9], extY: [0, 5.5], showColor: 'DarkBluishGray', note: '圆盘挂在两颗侧凸点上，朝 +z，比砖高出一凸点；见 tools/ldraw/asm-prague-tyn.mjs' });
// Prague life layer: the painter's brush and palette, the busker's saxophone (the violin read as a club held upright: it needs a chin pose minifigs cannot strike)
ldrawPart({ ...ACC, key: 'paintbrush', id: '93552', bl: '93552', name: 'Minifig Paint Brush', zh: '画笔', w: 1, d: 1, h: 6, showColor: 'ReddishBrown', note: '画家右手' });
ldrawPart({ ...ACC, key: 'palette', id: '93551', bl: '93551', name: 'Minifig Paint Palette', zh: '调色板', w: 2, d: 2, h: 2, showColor: 'Tan', note: '画家左手' });
ldrawPart({ ...ACC, key: 'saxophone', id: '13808', bl: '13808', name: 'Minifig Saxophone', zh: '萨克斯', w: 1, d: 2, h: 8, showColor: 'PearlGold', note: '查理大桥上的爵士街头艺人' });
