import * as THREE from 'three';
import { PLATE, STUD_R, STUD_H, mergeGeos, roundedBox, box, cyl, stud, studGrid, profileExtrude, footprintPrism, lathe, cornerSlope, pyramid, sideStud } from './geometry';

// ---- Part catalogue ------------------------------------------------------------
// Every entry maps to a real LEGO design (BrickLink id). Geometry is our own approximation
// at true proportions. `studs` says where the top face offers studs (what can sit on it);
// `accepts` says whether the underside takes studs. The validator uses both.
export type Category = 'brick' | 'brick-mod' | 'plate' | 'plate-mod' | 'tile' | 'slope' | 'curve' | 'round' | 'arch' | 'window' | 'bar' | 'plant' | 'minifig' | 'baseplate';
export type StudPattern = 'all' | 'none' | 'back' | 'center' | 'disc' | ((i: number, j: number) => boolean);
export interface PartDef {
  key: string; bl: string; name: string; zh: string; cat: Category;
  w: number; d: number; h: number;              // studs, studs, plates
  studs: StudPattern; accepts: boolean;        // connection points
  verified: boolean;                            // id checked against the LDraw official library headers (2026-09-11); see docs/catalog/ldraw-check.json for aliases
  mask?: (i: number, j: number) => boolean;    // occupied footprint cells when not the full rectangle
  note?: string; showColor: string;
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
for (const [w, d, bl] of [[1, 1, '3024'], [1, 2, '3023'], [1, 3, '3623'], [1, 4, '3710'], [1, 6, '3666'], [1, 8, '3460'], [2, 2, '3022'], [2, 3, '3021'], [2, 4, '3020'], [2, 6, '3795'], [2, 8, '3034'], [4, 4, '3031'], [4, 6, '3032'], [4, 8, '3035'], [6, 6, '3958'], [6, 8, '3036'], [8, 8, '41539']] as [number, number, string][])
  def({ key: `plate_${w}x${d}`, bl, name: `Plate ${w} x ${d}`, zh: `板 ${w}×${d}`, cat: 'plate', w, d, h: 1, studs: 'all', accepts: true, verified: true, showColor: 'BrightBlue', build: boxPart(w, d, 1) });
def({ key: 'plate_corner_2x2', bl: '2420', name: 'Plate 2 x 2 Corner', zh: '转角板 2×2', cat: 'plate', w: 2, d: 2, h: 1, studs: 'all', accepts: true, verified: true, mask: lMask, showColor: 'BrightBlue', build: lPart(1, true) });

// ---- MODIFIED PLATES -------------------------------------------------------------
def({ key: 'jumper_1x2', bl: '15573', name: 'Plate 1 x 2 with 1 Stud (Jumper)', zh: '半格偏移板 1×2', cat: 'plate-mod', w: 2, d: 1, h: 1, studs: (i) => i === 0, accepts: true, verified: true, showColor: 'BrightBlue', note: '把上面的零件偏移半格，微缩建筑的关键技法', build: () => mergeGeos([roundedBox(2, 0.4, 1), stud(0, 0.2, 0)]) });
def({ key: 'jumper_2x2', bl: '87580', name: 'Plate 2 x 2 with 1 Stud (Jumper)', zh: '半格偏移板 2×2', cat: 'plate-mod', w: 2, d: 2, h: 1, studs: (i, j) => i === 0 && j === 0, accepts: true, verified: true, showColor: 'BrightBlue', note: '中心单凸点', build: () => mergeGeos([roundedBox(2, 0.4, 2), stud(0, 0.2, 0)]) });
def({ key: 'roundplate_1x1', bl: '6141', name: 'Plate Round 1 x 1', zh: '圆板 1×1', cat: 'plate-mod', w: 1, d: 1, h: 1, studs: 'all', accepts: true, verified: true, showColor: 'BrightGreen', note: '树叶、灌木、石子', build: () => mergeGeos([cyl(0.49, 0.4, 20), stud(0, 0.2, 0)]) });
def({ key: 'roundplate_2x2', bl: '4032', name: 'Plate Round 2 x 2', zh: '圆板 2×2', cat: 'plate-mod', w: 2, d: 2, h: 1, studs: 'all', accepts: true, verified: true, showColor: 'BrightGreen', note: '树冠叠塔', build: () => mergeGeos([cyl(0.98, 0.4, 28), ...studGrid(2, 2, 0.2)]) });
def({ key: 'roundplate_4x4', bl: '60474', name: 'Plate Round 4 x 4', zh: '圆板 4×4', cat: 'plate-mod', w: 4, d: 4, h: 1, studs: 'disc', accepts: true, verified: true, showColor: 'BrightGreen', note: '擎天树冠、圆形平台', build: () => mergeGeos([cyl(1.98, 0.4, 40), ...studGrid(4, 4, 0.2, (i, j) => Math.hypot(i + 0.5 - 2, j + 0.5 - 2) < 1.6)]) });
def({ key: 'flower_1x1', bl: '24866', name: 'Plate Round 1 x 1 with Flower Edge', zh: '花瓣板 1×1', cat: 'plate-mod', w: 1, d: 1, h: 1, studs: 'all', accepts: true, verified: true, showColor: 'BrightPink', note: '樱花、花丛、树冠质感', build: () => { const geos = [cyl(0.26, 0.4, 12)]; for (let k = 0; k < 5; k++) { const a = k / 5 * Math.PI * 2; geos.push(cyl(0.21, 0.36, 10, 0.21, Math.cos(a) * 0.3, -0.02, Math.sin(a) * 0.3)); } geos.push(stud(0, 0.2, 0)); return mergeGeos(geos); } });
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
def({ key: 'bar_3l', bl: '87994', name: 'Bar 3L', zh: '杆 3 格', cat: 'bar', w: 1, d: 1, h: 6, studs: 'none', accepts: false, verified: true, showColor: 'PearlGold', note: '插在圆板/圆砖的空心凸点里', build: () => cyl(0.16, 2.4, 10) });
def({ key: 'bar_4l', bl: '30374', name: 'Bar 4L (Lightsaber Blade)', zh: '杆 4 格', cat: 'bar', w: 1, d: 1, h: 8, studs: 'none', accepts: false, verified: true, showColor: 'TransLightBlue', note: '瀑布、光柱、旗杆', build: () => cyl(0.16, 3.2, 10) });
def({ key: 'telescope', bl: '64644', name: 'Minifig Telescope', zh: '望远镜', cat: 'bar', w: 1, d: 1, h: 2, studs: 'none', accepts: true, verified: true, showColor: 'DarkBluishGray', note: '微缩路灯头、烟囱、小塔尖', build: () => mergeGeos([cyl(0.28, 0.5, 14, 0.28, 0, -0.15, 0), cyl(0.38, 0.3, 14, 0.38, 0, 0.25, 0)]) });
def({ key: 'tap_1x1', bl: '4599b', name: 'Tap 1 x 1', zh: '水龙头 1×1', cat: 'bar', w: 1, d: 1, h: 2, studs: 'none', accepts: true, verified: true, showColor: 'LightBluishGray', note: '微缩雕像、路灯、旗杆底座', build: () => mergeGeos([cyl(0.3, 0.4, 12, 0.3, 0, -0.2, 0), cyl(0.14, 0.7, 10, 0.14, 0, 0.35, 0), (() => { const c = new THREE.CylinderGeometry(0.14, 0.14, 0.6, 10); c.rotateX(Math.PI / 2); c.translate(0, 0.55, 0.3); c.deleteAttribute('uv'); return c; })()]) });

// ---- PLANTS -----------------------------------------------------------------------------
def({ key: 'leaves_4x3', bl: '2423', name: 'Plant Leaves 4 x 3', zh: '树叶 4×3', cat: 'plant', w: 4, d: 3, h: 1, studs: (i, j) => j === 0 && (i === 1 || i === 2), accepts: true, verified: true, mask: () => true, showColor: 'Green', note: '树冠、灌木', build: () => { const geos: THREE.BufferGeometry[] = []; for (const [x, z, sx, sz] of [[-1.2, 0.3, 1.1, 0.7], [0, -0.2, 1.0, 1.1], [1.2, 0.3, 1.1, 0.7]]) { const c = cyl(0.8, 0.25, 18); c.scale(sx, 1, sz); c.translate(x, -0.07, z); geos.push(c); } geos.push(box(1.2, 0.3, 1, 0, -0.05, -1.0), ...studGrid(4, 3, 0.1, (i, j) => j === 0 && (i === 1 || i === 2))); return mergeGeos(geos); } });
def({ key: 'plant_3leaves', bl: '32607', name: 'Plant Plate 1 x 1 Round with 3 Leaves', zh: '三叶圆板 1×1', cat: 'plant', w: 1, d: 1, h: 1, studs: 'all', accepts: true, verified: true, showColor: 'BrightGreen', note: '叶片向外悬出一格，不占格', build: () => { const geos = [cyl(0.49, 0.4, 16), stud(0, 0.2, 0)]; for (let k = 0; k < 3; k++) { const a = k / 3 * Math.PI * 2 + 0.4; const leaf = cyl(0.45, 0.12, 12); leaf.scale(1, 1, 0.55); leaf.rotateY(-a); leaf.translate(Math.cos(a) * 0.8, 0.02, Math.sin(a) * 0.8); geos.push(leaf); } return mergeGeos(geos); } });
def({ key: 'flower_stem', bl: '3741', name: 'Plant Flower Stem', zh: '花茎', cat: 'plant', w: 1, d: 1, h: 3, studs: 'none', accepts: true, verified: true, showColor: 'BrightGreen', note: '顶端可插花瓣板', build: () => { const geos = [cyl(0.49, 0.4, 16, 0.49, 0, -0.4, 0)]; for (const [x, z] of [[0, 0], [0.28, 0.16], [-0.28, 0.16]]) geos.push(cyl(0.07, 1.0, 8, 0.07, x, 0.3, z), cyl(0.16, 0.14, 8, 0.16, x, 0.87, z)); return mergeGeos(geos); } });
def({ key: 'bamboo_leaves', bl: '30176', name: 'Plant Bamboo Leaves', zh: '竹叶', cat: 'plant', w: 1, d: 1, h: 2, studs: 'none', accepts: true, verified: true, showColor: 'Lime', note: '竹林、棕榈叶', build: () => { const geos = [cyl(0.3, 0.4, 12, 0.3, 0, -0.2, 0)]; for (let k = 0; k < 4; k++) { const a = k / 4 * Math.PI * 2 + 0.3; const leaf = box(1.4, 0.08, 0.28, 0.75, 0.2, 0); leaf.rotateZ(0.35); leaf.rotateY(-a); geos.push(leaf); } return mergeGeos(geos); } });

// ---- SET-SPECIFIC (按需入库: real parts added for one city, never invented shapes) -------------------
def({ key: 'fish', bl: '64648', name: 'Animal Fish Straight', zh: '鱼（锦鲤）', cat: 'plant', w: 1, d: 1, h: 1, studs: 'none', accepts: true, verified: true, showColor: 'Orange', note: '首次用于：京都。底部一个反凸点，坐在池面的透明板上', build: () => { const body = cyl(0.22, 1.1, 10); body.scale(1, 1, 0.55); body.rotateZ(Math.PI / 2); body.translate(0, -0.05, 0); const tail = box(0.3, 0.22, 0.05, 0.62, -0.02, 0); tail.rotateY(0.6); return mergeGeos([body, tail]); } });

// ---- MINIFIGURE ----------------------------------------------------------------------------
def({ key: 'fig_legs', bl: '970c00', name: 'Minifig Hips and Legs', zh: '人仔腿', cat: 'minifig', w: 2, d: 1, h: 4, studs: 'all', accepts: true, verified: true, showColor: 'DarkBlue', build: () => { const geos: THREE.BufferGeometry[] = []; for (const x of [-0.5, 0.5]) geos.push(box(0.8, 1.15, 0.72, x, -0.8 + 0.575, 0)); geos.push(box(1.9, 0.45, 0.7, 0, 0.8 - 0.225, 0)); return mergeGeos(geos); } });
def({ key: 'fig_torso', bl: '973', name: 'Minifig Torso with Arms', zh: '人仔躯干（含手臂）', cat: 'minifig', w: 2, d: 1, h: 3, studs: 'center', accepts: true, verified: true, showColor: 'BrightRed', build: () => { const s = new THREE.Shape(); s.moveTo(-0.75, -0.6); s.lineTo(0.75, -0.6); s.lineTo(0.95, 0.6); s.lineTo(-0.95, 0.6); s.closePath(); const body = new THREE.ExtrudeGeometry(s, { depth: 0.7, bevelEnabled: false }); body.translate(0, 0, -0.35); body.deleteAttribute('uv'); const geos: THREE.BufferGeometry[] = [body]; for (const side of [-1, 1]) { const arm = cyl(0.23, 0.95, 12); arm.translate(0, -0.35, 0); arm.rotateZ(side * 0.18); arm.translate(side * 1.05, 0.45, 0); geos.push(arm); } geos.push(cyl(0.3, 0.15, 12, 0.3, 0, 0.675, 0)); return mergeGeos(geos); } });
def({ key: 'fig_hands', bl: '3820', name: 'Minifig Hands (pair)', zh: '人仔手', cat: 'minifig', w: 2, d: 1, h: 3, studs: 'none', accepts: false, verified: true, showColor: 'Yellow', note: '装在手臂末端', build: () => { const geos: THREE.BufferGeometry[] = []; for (const side of [-1, 1]) geos.push(cyl(0.2, 0.32, 10, 0.2, side * 1.22, -0.5, 0)); return mergeGeos(geos); } });
def({ key: 'fig_head', bl: '3626c', name: 'Minifig Head', zh: '人仔头', cat: 'minifig', w: 1, d: 1, h: 3, studs: 'center', accepts: true, verified: true, showColor: 'Yellow', build: () => lathe([[0.3, -0.6], [0.5, -0.55], [0.56, -0.42], [0.56, 0.32], [0.5, 0.45], [0.3, 0.48], [0.3, 0.6], [0, 0.6]], 24) });
def({ key: 'fig_hair', bl: '3901', name: 'Minifig Hair (short)', zh: '人仔头发', cat: 'minifig', w: 1, d: 1, h: 2, studs: 'none', accepts: true, verified: true, showColor: 'Black', build: () => { const pts: [number, number][] = [[0, -0.4], [0.6, -0.4], [0.62, -0.2]]; for (let k = 1; k <= 7; k++) { const t = k / 7 * Math.PI / 2; pts.push([0.62 * Math.cos(t), -0.2 + 0.6 * Math.sin(t)]); } return lathe(pts, 24); } });
def({ key: 'fig_kasa', bl: '93059', name: 'Minifig Headgear Hat, Conical Asian', zh: '人仔草帽', cat: 'minifig', w: 2, d: 2, h: 1, studs: 'none', accepts: true, verified: true, showColor: 'Tan', build: () => lathe([[0, -0.2], [1.1, -0.2], [1.1, -0.12], [0.55, 0.05], [0.08, 0.22], [0, 0.22]], 28) });

// ---- BASEPLATES ----------------------------------------------------------------------------
def({ key: 'baseplate_32x32', bl: '3811', name: 'Baseplate 32 x 32', zh: '底板 32×32', cat: 'baseplate', w: 32, d: 32, h: 1, studs: 'all', accepts: false, verified: true, showColor: 'DarkBluishGray', note: '厚度以 1 板近似；底面不可再接', build: boxPart(32, 32, 1) });
def({ key: 'baseplate_16x32', bl: '3857', name: 'Baseplate 16 x 32', zh: '底板 16×32', cat: 'baseplate', w: 16, d: 32, h: 1, studs: 'all', accepts: false, verified: true, showColor: 'DarkBluishGray', note: '与 32×32 拼成 48×32', build: boxPart(16, 32, 1) });

export const PART_LIST = Object.values(PARTS);
export { PLATE, STUD_R, STUD_H };
