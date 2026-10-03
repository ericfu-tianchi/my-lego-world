// Decorated elements (L2): a real mould carries one of our own flat prints, drawn with Canvas 2D code — never a generated
// image. Conventions follow LEGO pad printing: flat faces only, ≤ 4 flat colours, no gradients, short legible text, never over studs.
// A print is rendered as a thin decal geometry that rides on the part's instance matrix; physics and the validator ignore it.
import * as THREE from 'three';
import { PLATE, mergeGeos } from './geometry';
import type { PartDef } from './catalog';

export type Face = 'top' | 'front' | 'side' | 'cyl';
export interface PrintDef {
  key: string; base: string; zh: string; face: Face; colors: string[]; firstUse: string;
  /** decal rectangle in studs (w × h) and offsets; defaults derive from the base part */
  rect?: { w?: number; h?: number; x?: number; y?: number; z?: number; r?: number; theta?: number };
  px?: number; // canvas pixels per stud (default 128)
  both?: boolean; // print both faces (flags, banners) — the back reads mirrored, like real printed cloth
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void;
}
export const PRINTS: Record<string, PrintDef> = {};
function def(p: PrintDef) { if (PRINTS[p.key]) throw new Error('duplicate print ' + p.key); PRINTS[p.key] = p; }
export const PRINT_LIST = () => Object.values(PRINTS);

// Kyoto signage is Japanese Mincho (明朝体): thin horizontals, weighted verticals, generous spacing. Bold Song faces look like a stamp.
const SANS = '"PingFang SC","Hiragino Sans GB","Heiti SC","Noto Sans CJK SC","Helvetica Neue",Arial,sans-serif';   // typeset boards (hawker signs)
const SERIF = '"Hiragino Mincho ProN","Hiragino Mincho Pro","YuMincho","Yu Mincho","Songti SC","Noto Serif CJK JP","Noto Serif CJK SC",serif';
// Plaques and lanterns are lettered, not typeset: 魏碑 (carved-stone script) for a 扁額, 隸書 brush for paper. Typeset Mincho read as a
// modern shop sign (Eric, 2026-09-18).
const PLAQUE = '"Weibei SC","Weibei TC","Toppan Bunkyu Midashi Mincho","Baoli SC","Hiragino Mincho ProN",serif';
const BRUSH = '"Baoli SC","Baoli TC","Weibei SC","Klee","Hiragino Mincho ProN",serif';
const INK = '#1B1B1B', DARKRED = '#7A1F1F', WHITE = '#F4F4F4', GOLD = '#C9A227', ORANGE = '#FE8A18';

/** Decal geometry for a print on a given base part, in the part's canonical frame (part centred on its box, front = +z). */
export function decalGeometry(p: PrintDef, part: PartDef): THREE.BufferGeometry {
  const H = part.h * PLATE; const r = p.rect ?? {};
  if (p.face === 'top') { const g = new THREE.PlaneGeometry(r.w ?? part.w - 0.16, r.h ?? part.d - 0.16); g.rotateX(-Math.PI / 2); g.translate(0, (r.y ?? H / 2) + 0.003, r.z ?? 0); return g; }
  if (p.face === 'front') { const g = new THREE.PlaneGeometry(r.w ?? part.w - 0.12, r.h ?? H - 0.12); g.translate(0, r.y ?? 0, (r.z ?? part.d / 2) + 0.003); return g; }
  if (p.face === 'side') { const g = new THREE.PlaneGeometry(r.w ?? part.d - 0.12, r.h ?? H - 0.12); g.rotateY(Math.PI / 2); g.translate((r.x ?? part.w / 2) + 0.003, r.y ?? 0, r.z ?? 0); if (!p.both) return g; const b = g.clone(); b.rotateY(Math.PI); b.translate(0, 0, 2 * (r.z ?? 0)); return mergeGeos([g, b]); }
  const rad = (r.r ?? part.w / 2 - 0.01) + 0.004, th = r.theta ?? Math.PI * 0.62; // wrapped around a cylinder, centred on +z
  const g = new THREE.CylinderGeometry(rad, rad, r.h ?? H * 0.6, 24, 1, true, -th / 2, th); g.translate(0, r.y ?? 0, 0); return g;
}
const texCache = new Map<string, THREE.CanvasTexture>();
/** Canvas texture for a print (browser only). */
export function printTexture(p: PrintDef, part: PartDef, anisotropy = 4): THREE.CanvasTexture {
  const ck = p.key + '|' + part.key; const hit = texCache.get(ck); if (hit) return hit;
  const px = p.px ?? 128; const r = p.rect ?? {}; const H = part.h * PLATE;
  let w: number, h: number;
  if (p.face === 'top') { w = r.w ?? part.w - 0.16; h = r.h ?? part.d - 0.16; } else if (p.face === 'front') { w = r.w ?? part.w - 0.12; h = r.h ?? H - 0.12; } else if (p.face === 'side') { w = r.w ?? part.d - 0.12; h = r.h ?? H - 0.12; } else { const rad = r.r ?? part.w / 2; w = rad * (r.theta ?? Math.PI * 0.62); h = r.h ?? H * 0.6; }
  const c = document.createElement('canvas'); c.width = Math.max(32, Math.round(w * px)); c.height = Math.max(32, Math.round(h * px));
  const ctx = c.getContext('2d')!; ctx.clearRect(0, 0, c.width, c.height); p.draw(ctx, c.width, c.height);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = anisotropy; t.flipY = true; texCache.set(ck, t); return t;
}

// ---- helpers ------------------------------------------------------------------------------------------------
const dot = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number, c: string) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); };
const arc = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number, a0: number, a1: number, lw: number, c: string) => { ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(x, y, r, a0, a1); ctx.stroke(); };
const text = (ctx: CanvasRenderingContext2D, s: string, x: number, y: number, size: number, c: string, weight = 'bold') => { ctx.fillStyle = c; ctx.font = `${weight} ${size}px ${SERIF}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(s, x, y); };
/** Characters set one by one, centred as a group with tracking (fraction of size) — the way a sign painter spaces kanji. */
const kanji = (ctx: CanvasRenderingContext2D, s: string, cx: number, cy: number, size: number, c: string, tracking = 0.35, weight = 'normal', family = SERIF) => {
  const chars = [...s]; const pitch = size * (1 + tracking); const x0 = cx - (chars.length - 1) * pitch / 2;
  chars.forEach((ch, i) => { ctx.fillStyle = c; ctx.font = `${weight} ${size}px ${family}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(ch, x0 + i * pitch, cy); });
};

// ---- minifig faces (base: fig_head, wrapped print). Eyebrows, eye highlights, mouth shapes — official-minifig register, ≤ 4 colours -----
const FACE = { face: 'cyl' as Face, base: 'fig_head', rect: { r: 0.65, h: 0.78, y: -0.02, theta: Math.PI * 0.62 }, px: 220 };
const eyes = (ctx: CanvasRenderingContext2D, w: number, h: number, ry = 0.42, r = 0.05, brows: 'flat' | 'raised' | 'none' = 'flat') => {
  dot(ctx, w * 0.36, h * ry, w * r, INK); dot(ctx, w * 0.64, h * ry, w * r, INK); dot(ctx, w * 0.375, h * (ry - 0.03), w * 0.016, WHITE); dot(ctx, w * 0.655, h * (ry - 0.03), w * 0.016, WHITE);
  if (brows === 'flat') { ctx.strokeStyle = INK; ctx.lineWidth = w * 0.028; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(w * 0.29, h * 0.3); ctx.lineTo(w * 0.42, h * 0.29); ctx.moveTo(w * 0.58, h * 0.29); ctx.lineTo(w * 0.71, h * 0.3); ctx.stroke(); }
  if (brows === 'raised') { arc(ctx, w * 0.36, h * 0.33, w * 0.08, Math.PI * 1.15, Math.PI * 1.85, w * 0.028, INK); arc(ctx, w * 0.64, h * 0.33, w * 0.08, Math.PI * 1.15, Math.PI * 1.85, w * 0.028, INK); }
};
def({ key: 'face_smile', zh: '脸·微笑', colors: ['Black', 'White'], firstUse: 'Kyoto', ...FACE, draw: (ctx, w, h) => { eyes(ctx, w, h); arc(ctx, w / 2, h * 0.5, w * 0.19, Math.PI * 0.18, Math.PI * 0.82, w * 0.035, INK); } });
def({ key: 'face_calm', zh: '脸·闭目安然', colors: ['Black'], firstUse: 'Kyoto', ...FACE, draw: (ctx, w, h) => { arc(ctx, w * 0.36, h * 0.42, w * 0.07, Math.PI * 1.15, Math.PI * 1.85, w * 0.035, INK); arc(ctx, w * 0.64, h * 0.42, w * 0.07, Math.PI * 1.15, Math.PI * 1.85, w * 0.035, INK); ctx.strokeStyle = INK; ctx.lineWidth = w * 0.025; ctx.beginPath(); ctx.moveTo(w * 0.3, h * 0.31); ctx.lineTo(w * 0.42, h * 0.3); ctx.moveTo(w * 0.58, h * 0.3); ctx.lineTo(w * 0.7, h * 0.31); ctx.stroke(); arc(ctx, w / 2, h * 0.56, w * 0.13, Math.PI * 0.2, Math.PI * 0.8, w * 0.03, INK); } });
def({ key: 'face_laugh', zh: '脸·大笑', colors: ['Black', 'Dark Red', 'White'], firstUse: 'Kyoto', ...FACE, draw: (ctx, w, h) => { arc(ctx, w * 0.36, h * 0.41, w * 0.06, Math.PI * 1.1, Math.PI * 1.9, w * 0.035, INK); arc(ctx, w * 0.64, h * 0.41, w * 0.06, Math.PI * 1.1, Math.PI * 1.9, w * 0.035, INK); eyes(ctx, w, h, 0.99, 0.0001, 'raised'); ctx.fillStyle = DARKRED; ctx.beginPath(); ctx.arc(w / 2, h * 0.56, w * 0.17, 0, Math.PI); ctx.closePath(); ctx.fill(); ctx.fillStyle = WHITE; ctx.fillRect(w * 0.36, h * 0.56, w * 0.28, h * 0.055); arc(ctx, w / 2, h * 0.56, w * 0.17, 0, Math.PI, w * 0.02, INK); dot(ctx, w * 0.2, h * 0.6, w * 0.05, '#E9967A'); dot(ctx, w * 0.8, h * 0.6, w * 0.05, '#E9967A'); } });
def({ key: 'face_glasses', zh: '脸·眼镜与胡须', colors: ['Black', 'White'], firstUse: 'Kyoto', ...FACE, draw: (ctx, w, h) => { eyes(ctx, w, h, 0.42, 0.04, 'flat'); arc(ctx, w * 0.36, h * 0.42, w * 0.115, 0, Math.PI * 2, w * 0.028, INK); arc(ctx, w * 0.64, h * 0.42, w * 0.115, 0, Math.PI * 2, w * 0.028, INK); ctx.fillStyle = INK; ctx.fillRect(w * 0.47, h * 0.405, w * 0.06, h * 0.028); ctx.beginPath(); ctx.ellipse(w / 2, h * 0.6, w * 0.15, h * 0.045, 0, 0, Math.PI * 2); ctx.fill(); arc(ctx, w / 2, h * 0.6, w * 0.12, Math.PI * 0.25, Math.PI * 0.75, w * 0.03, INK); } });
def({ key: 'face_child', zh: '脸·孩子', colors: ['Black', 'Coral', 'White'], firstUse: 'Kyoto', ...FACE, draw: (ctx, w, h) => { eyes(ctx, w, h, 0.44, 0.06, 'none'); arc(ctx, w / 2, h * 0.5, w * 0.16, Math.PI * 0.15, Math.PI * 0.85, w * 0.04, INK); dot(ctx, w * 0.22, h * 0.58, w * 0.05, '#F0857F'); dot(ctx, w * 0.78, h * 0.58, w * 0.05, '#F0857F'); } });
def({ key: 'face_grin', zh: '脸·露齿笑', colors: ['Black', 'White'], firstUse: 'Kyoto', ...FACE, draw: (ctx, w, h) => { eyes(ctx, w, h, 0.42, 0.05, 'raised'); ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(w / 2, h * 0.54, w * 0.16, 0, Math.PI); ctx.closePath(); ctx.fill(); ctx.fillStyle = WHITE; ctx.fillRect(w * 0.37, h * 0.545, w * 0.26, h * 0.06); } });

// ---- minifig torsos (base: fig_torso_*, front print; torso colour shows through) — layered collars, obi with knot, patterns -------------
const TORSO = { face: 'front' as Face, base: 'fig_torso_*', rect: { w: 1.42, h: 1.08, y: 0, z: 0.5 }, px: 200 };
const kimono = (inner: string, outer: string, obi: string, knot: string, motif?: (ctx: CanvasRenderingContext2D, w: number, h: number) => void) => (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  // two collar layers (inner white line under the outer collar), obi band with a centre knot
  ctx.lineCap = 'butt';
  ctx.strokeStyle = inner; ctx.lineWidth = w * 0.13; ctx.beginPath(); ctx.moveTo(w * 0.26, 0); ctx.lineTo(w * 0.5, h * 0.52); ctx.moveTo(w * 0.74, 0); ctx.lineTo(w * 0.5, h * 0.52); ctx.stroke();
  ctx.strokeStyle = outer; ctx.lineWidth = w * 0.065; ctx.beginPath(); ctx.moveTo(w * 0.3, 0); ctx.lineTo(w * 0.52, h * 0.5); ctx.moveTo(w * 0.7, 0); ctx.lineTo(w * 0.5, h * 0.46); ctx.stroke();
  motif?.(ctx, w, h);
  ctx.fillStyle = obi; ctx.fillRect(0, h * 0.6, w, h * 0.24); ctx.fillStyle = knot; ctx.fillRect(w * 0.4, h * 0.62, w * 0.2, h * 0.2); ctx.fillStyle = obi; ctx.fillRect(w * 0.46, h * 0.66, w * 0.08, h * 0.12);
};
const petals = (c: string) => (ctx: CanvasRenderingContext2D, w: number, h: number) => { for (const [x, y] of [[0.14, 0.3], [0.22, 0.48], [0.82, 0.22], [0.86, 0.44], [0.12, 0.92]]) { for (let k = 0; k < 5; k++) { const a = k / 5 * Math.PI * 2; dot(ctx, w * x + Math.cos(a) * w * 0.03, h * y + Math.sin(a) * w * 0.03, w * 0.018, c); } } };
def({ key: 'torso_kimono_red', zh: '和服·白底红领樱花纹', colors: ['Dark Red', 'White', 'Coral'], firstUse: 'Kyoto', ...TORSO, draw: kimono(WHITE, DARKRED, DARKRED, '#E8A090', petals('#F0857F')) });   // the obi knot is a lighter red, not a gold buckle
def({ key: 'torso_kimono_indigo', zh: '浴衣·浅底藏青领蓝花', colors: ['Dark Blue', 'White', 'Gold'], firstUse: 'Kyoto', ...TORSO, draw: kimono('#1B3A6B', WHITE, '#1B3A6B', '#6C8FD6', petals('#4C7BC9')) });   // knot a lighter blue: a gold square read as a belt buckle   // for a light torso (Tan / White): indigo collar and flowers read; on Dark Blue nothing did
def({ key: 'torso_monk', zh: '僧衣·袈裟', colors: ['Orange', 'White', 'Dark Brown'], firstUse: 'Kyoto', ...TORSO, draw: (ctx, w, h) => { ctx.strokeStyle = WHITE; ctx.lineWidth = w * 0.09; ctx.beginPath(); ctx.moveTo(w * 0.3, 0); ctx.lineTo(w * 0.5, h * 0.42); ctx.moveTo(w * 0.7, 0); ctx.lineTo(w * 0.5, h * 0.42); ctx.stroke(); ctx.fillStyle = ORANGE; ctx.beginPath(); ctx.moveTo(w * 0.6, 0); ctx.lineTo(w, 0); ctx.lineTo(w, h * 0.5); ctx.lineTo(w * 0.36, h); ctx.lineTo(0, h); ctx.lineTo(0, h * 0.7); ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#7A3E10'; ctx.lineWidth = w * 0.02; ctx.beginPath(); ctx.moveTo(w * 0.62, 0); ctx.lineTo(0, h * 0.72); ctx.moveTo(w, h * 0.5); ctx.lineTo(w * 0.36, h); ctx.stroke(); ctx.fillStyle = '#7A3E10'; ctx.fillRect(w * 0.42, h * 0.62, w * 0.14, h * 0.12); } });
def({ key: 'torso_apron', zh: '店家·围裙', colors: ['White', 'Dark Red', 'Dark Blue'], firstUse: 'Kyoto', ...TORSO, draw: (ctx, w, h) => { ctx.strokeStyle = WHITE; ctx.lineWidth = w * 0.1; ctx.beginPath(); ctx.moveTo(w * 0.28, 0); ctx.lineTo(w * 0.5, h * 0.4); ctx.moveTo(w * 0.72, 0); ctx.lineTo(w * 0.5, h * 0.4); ctx.stroke(); ctx.fillStyle = '#E4CD9E'; ctx.fillRect(w * 0.2, h * 0.36, w * 0.6, h * 0.64); ctx.strokeStyle = '#E4CD9E'; ctx.lineWidth = w * 0.05; ctx.beginPath(); ctx.moveTo(w * 0.27, h * 0.36); ctx.lineTo(w * 0.4, 0); ctx.moveTo(w * 0.73, h * 0.36); ctx.lineTo(w * 0.6, 0); ctx.stroke(); ctx.fillStyle = DARKRED; ctx.fillRect(w * 0.2, h * 0.36, w * 0.6, h * 0.05); text(ctx, '茶', w / 2, h * 0.7, h * 0.3, DARKRED); } });
def({ key: 'torso_happi', zh: '法被·藏青白襟', colors: ['White', 'Dark Red'], firstUse: 'Kyoto', ...TORSO, draw: (ctx, w, h) => { ctx.fillStyle = WHITE; ctx.fillRect(w * 0.18, 0, w * 0.1, h); ctx.fillRect(w * 0.72, 0, w * 0.1, h); ctx.strokeStyle = WHITE; ctx.lineWidth = w * 0.06; ctx.beginPath(); ctx.moveTo(w * 0.32, 0); ctx.lineTo(w * 0.5, h * 0.35); ctx.moveTo(w * 0.68, 0); ctx.lineTo(w * 0.5, h * 0.35); ctx.stroke(); text(ctx, '祭', w / 2, h * 0.62, h * 0.32, WHITE); ctx.fillStyle = DARKRED; ctx.fillRect(0, h * 0.86, w, h * 0.14); } });

// ---- signage & garden prints ----------------------------------------------------------------------------------------------
def({ key: 'sign_saryo', zh: '茶寮扁額「茶寮」（1×4 砖长侧面）', colors: ['Dark Brown', 'Gold'], firstUse: 'Kyoto', face: 'side', base: 'brick_1x4', px: 360, draw: (ctx, w, h) => {
  ctx.fillStyle = '#26160C'; ctx.fillRect(0, 0, w, h);                                                       // dark lacquered plaque (扁額)
  ctx.strokeStyle = GOLD; ctx.lineWidth = h * 0.03; ctx.strokeRect(h * 0.08, h * 0.08, w - h * 0.16, h - h * 0.16);
  ctx.lineWidth = h * 0.01; ctx.strokeRect(h * 0.15, h * 0.15, w - h * 0.3, h - h * 0.3);
  kanji(ctx, '茶寮', w / 2, h * 0.53, h * 0.6, GOLD, 0.5, 'normal', PLAQUE);
} });
def({ key: 'nobori_cha', zh: '幟旗「茶」（梯形旗侧面）', colors: ['White'], firstUse: 'Kyoto', face: 'side', base: 'flag_trapezoid', both: true, rect: { w: 2.2, h: 1.7, x: 0.12, y: 0.05, z: -0.35 }, px: 160, draw: (ctx, w, h) => { text(ctx, '茶', w * 0.5, h * 0.28, h * 0.36, WHITE); text(ctx, '寮', w * 0.5, h * 0.7, h * 0.36, WHITE); } });
def({ key: 'nobori_sakura', zh: '幟旗「桜」', colors: ['Dark Red'], firstUse: 'Kyoto', face: 'side', base: 'flag_trapezoid', both: true, rect: { w: 2.2, h: 1.7, x: 0.12, y: 0.05, z: -0.35 }, px: 160, draw: (ctx, w, h) => { text(ctx, '桜', w * 0.5, h * 0.5, h * 0.44, DARKRED); dot(ctx, w * 0.5, h * 0.88, h * 0.05, DARKRED); } });
def({ key: 'koi_tile', zh: '锦鲤印花（1×2 透明光面砖）', colors: ['Orange', 'White', 'Black'], firstUse: 'Kyoto', face: 'top', base: 'tile_1x2', px: 160, draw: (ctx, w, h) => { ctx.fillStyle = ORANGE; ctx.beginPath(); ctx.ellipse(w * 0.42, h * 0.5, w * 0.26, h * 0.26, 0, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.moveTo(w * 0.66, h * 0.5); ctx.lineTo(w * 0.86, h * 0.22); ctx.lineTo(w * 0.8, h * 0.5); ctx.lineTo(w * 0.86, h * 0.78); ctx.closePath(); ctx.fill(); dot(ctx, w * 0.5, h * 0.4, w * 0.07, WHITE); dot(ctx, w * 0.24, h * 0.44, w * 0.025, INK); } });
def({ key: 'lantern_kyo', zh: '灯笼「京」（1×1 圆砖）', colors: ['Black'], firstUse: 'Kyoto', face: 'cyl', base: 'round_1x1', rect: { r: 0.49, h: 1.0, y: 0, theta: Math.PI * 0.7 }, px: 360, draw: (ctx, w, h) => { kanji(ctx, '京', w / 2, h * 0.5, h * 0.5, DARKRED, 0, 'normal', BRUSH); ctx.fillStyle = INK; ctx.fillRect(0, h * 0.1, w, h * 0.03); ctx.fillRect(0, h * 0.87, w, h * 0.03); } });

// ---- Singapore (2026-09-18) — 10 designs. Lettering follows the real objects: a hawker signboard is *printed* bold Hei on yellow (typeset is
// the real thing here); a shophouse plaque is gold calligraphy on black lacquer. Merlion and MBS carry no text. -----------------------------
const HEI = '"PingFang SC","Heiti SC","Hiragino Sans GB","Noto Sans CJK SC","Microsoft YaHei",sans-serif';
const AZURE = '#36AEBF', DKGRAY = '#6C6E68', TAN = '#E4CD9E', DKPINK = '#C870A0', GREEN = '#237841', DKBLUE = '#0A3463', YELLOW = '#F2CD37';
def({ key: 'face_hawker', zh: '脸·小贩（咧嘴笑、汗珠）', colors: ['Black', 'White', 'Medium Azure'], firstUse: 'Singapore', ...FACE, draw: (ctx, w, h) => { eyes(ctx, w, h, 0.42, 0.05, 'raised'); ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(w / 2, h * 0.54, w * 0.17, 0, Math.PI); ctx.closePath(); ctx.fill(); ctx.fillStyle = WHITE; ctx.fillRect(w * 0.36, h * 0.545, w * 0.28, h * 0.06); ctx.fillStyle = AZURE; ctx.beginPath(); ctx.moveTo(w * 0.82, h * 0.22); ctx.lineTo(w * 0.86, h * 0.34); ctx.arc(w * 0.82, h * 0.34, w * 0.04, 0, Math.PI); ctx.closePath(); ctx.fill(); } });
def({ key: 'face_uncle', zh: '脸·大叔（胡子、笑纹）', colors: ['Black', 'Dark Bluish Gray'], firstUse: 'Singapore', ...FACE, draw: (ctx, w, h) => { eyes(ctx, w, h, 0.41, 0.045, 'flat'); ctx.strokeStyle = INK; ctx.lineWidth = w * 0.02; ctx.beginPath(); ctx.moveTo(w * 0.27, h * 0.47); ctx.lineTo(w * 0.31, h * 0.5); ctx.moveTo(w * 0.73, h * 0.47); ctx.lineTo(w * 0.69, h * 0.5); ctx.stroke(); ctx.fillStyle = DKGRAY; ctx.beginPath(); ctx.ellipse(w * 0.42, h * 0.56, w * 0.09, h * 0.035, -0.25, 0, Math.PI * 2); ctx.ellipse(w * 0.58, h * 0.56, w * 0.09, h * 0.035, 0.25, 0, Math.PI * 2); ctx.fill(); arc(ctx, w / 2, h * 0.56, w * 0.14, Math.PI * 0.22, Math.PI * 0.78, w * 0.03, INK); } });
def({ key: 'torso_hawker', zh: '小贩·围裙搭毛巾', colors: ['Tan', 'Dark Red', 'Black'], firstUse: 'Singapore', ...TORSO, draw: (ctx, w, h) => { ctx.fillStyle = TAN; ctx.fillRect(w * 0.2, h * 0.34, w * 0.6, h * 0.66); ctx.strokeStyle = TAN; ctx.lineWidth = w * 0.06; ctx.beginPath(); ctx.moveTo(w * 0.27, h * 0.34); ctx.lineTo(w * 0.38, 0); ctx.moveTo(w * 0.73, h * 0.34); ctx.lineTo(w * 0.62, 0); ctx.stroke(); ctx.strokeStyle = INK; ctx.lineWidth = w * 0.018; ctx.strokeRect(w * 0.34, h * 0.62, w * 0.32, h * 0.22); ctx.beginPath(); ctx.moveTo(w * 0.2, h * 0.56); ctx.lineTo(w * 0.8, h * 0.56); ctx.stroke(); ctx.fillStyle = DARKRED; ctx.beginPath(); ctx.moveTo(w * 0.06, 0); ctx.lineTo(w * 0.3, 0); ctx.lineTo(w * 0.22, h * 0.3); ctx.lineTo(w * 0.02, h * 0.3); ctx.closePath(); ctx.fill(); } });   // tan apron, pocket, a red towel over the shoulder
// Eric 10-01/02: the tourist should look Nanyang, and bright — the brown sogan read dull. A vivid Peranakan-style batik shirt: magenta
// ground (the torso colour), the kawung flower in yellow with an azure heart on a diagonal grid, a yellow placket and open collar.
def({ key: 'torso_batik', zh: '游客·洋红底黄花 batik 衫（南洋蜡染）', colors: ['Yellow', 'Medium Azure'], firstUse: 'Singapore', ...TORSO, draw: (ctx, w, h) => {
  const s = w * 0.3;
  for (let gy = -1; gy <= Math.ceil(h / s) + 1; gy++) for (let gx = -1; gx <= Math.ceil(w / s) + 1; gx++) {
    const cx = gx * s + (gy % 2 ? s / 2 : 0), cy = gy * s * 0.9;
    for (let k = 0; k < 4; k++) { ctx.save(); ctx.translate(cx, cy); ctx.rotate(Math.PI / 4 + k * Math.PI / 2); ctx.fillStyle = YELLOW; ctx.beginPath(); ctx.ellipse(s * 0.24, 0, s * 0.2, s * 0.11, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
    dot(ctx, cx, cy, s * 0.09, AZURE);
  }
  ctx.fillStyle = YELLOW; ctx.fillRect(w * 0.47, h * 0.28, w * 0.06, h * 0.72);                                                    // placket
  ctx.fillStyle = AZURE; ctx.beginPath(); ctx.moveTo(w * 0.32, 0); ctx.lineTo(w * 0.5, h * 0.3); ctx.lineTo(w * 0.68, 0); ctx.closePath(); ctx.fill();   // open collar
} });
def({ key: 'torso_vendor', zh: '冰淇淋大叔·白衫蓝领', colors: ['Medium Azure', 'Black'], firstUse: 'Singapore', ...TORSO, draw: (ctx, w, h) => { ctx.strokeStyle = AZURE; ctx.lineWidth = w * 0.08; ctx.beginPath(); ctx.moveTo(w * 0.3, 0); ctx.lineTo(w * 0.5, h * 0.26); ctx.lineTo(w * 0.7, 0); ctx.stroke(); ctx.fillStyle = AZURE; ctx.fillRect(0, h * 0.86, w, h * 0.14); ctx.fillRect(w * 0.6, h * 0.42, w * 0.22, h * 0.2); ctx.strokeStyle = INK; ctx.lineWidth = w * 0.015; ctx.beginPath(); for (const y of [0.4, 0.55, 0.7]) { ctx.moveTo(w * 0.5 - w * 0.012, h * y); ctx.lineTo(w * 0.5 + w * 0.012, h * y); } ctx.stroke(); dot(ctx, w * 0.71, h * 0.47, w * 0.03, WHITE); } });   // vendor's white shirt: azure collar, pocket badge, belt band
// Shanghai 2026-10-03: the Pudong office worker in a suit (Eric: 白领打工人，而且要穿西装) — on a Dark Bluish Gray torso: the white shirt
// as a V between the lapels, a dark red tie, the jacket's two buttons
// Shanghai 2026-10-03 (Eric: the Customs House dials want hands): a clock face on the 2×2 round tile — black ring, twelve hour marks,
// the hands at ten past ten; drawn on the tile's top face, which faces outward where the tile sits on the tower's side studs
def({ key: 'clock_customs', zh: '海关钟面·刻度与指针', colors: ['Black'], firstUse: 'Shanghai', base: 'ld_14769', face: 'top', rect: { w: 1.9, h: 1.9 }, px: 160, draw: (ctx, w, h) => {
  const cx = w / 2, cy = h / 2, R = w * 0.47; ctx.strokeStyle = INK; ctx.lineWidth = w * 0.035; ctx.beginPath(); ctx.arc(cx, cy, R * 0.94, 0, Math.PI * 2); ctx.stroke();
  for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; const r0 = k % 3 ? R * 0.74 : R * 0.66; ctx.lineWidth = k % 3 ? w * 0.025 : w * 0.045; ctx.beginPath(); ctx.moveTo(cx + Math.sin(a) * r0, cy - Math.cos(a) * r0); ctx.lineTo(cx + Math.sin(a) * R * 0.86, cy - Math.cos(a) * R * 0.86); ctx.stroke(); }
  ctx.lineCap = 'round'; const hand = (a: number, len: number, wd: number) => { ctx.lineWidth = wd; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.sin(a) * len, cy - Math.cos(a) * len); ctx.stroke(); };
  hand((10 / 12) * Math.PI * 2 + (10 / 60) * (Math.PI / 6), R * 0.45, w * 0.06); hand((10 / 60) * Math.PI * 2, R * 0.66, w * 0.04); dot(ctx, cx, cy, w * 0.04, INK);
} });
def({ key: 'torso_suit', zh: '白领·西装白衬衫暗红领带', colors: ['White', 'Dark Red', 'Black'], firstUse: 'Shanghai', ...TORSO, draw: (ctx, w, h) => { ctx.fillStyle = WHITE; ctx.beginPath(); ctx.moveTo(w * 0.32, 0); ctx.lineTo(w * 0.5, h * 0.5); ctx.lineTo(w * 0.68, 0); ctx.closePath(); ctx.fill(); ctx.fillStyle = DARKRED; ctx.beginPath(); ctx.moveTo(w * 0.47, h * 0.04); ctx.lineTo(w * 0.53, h * 0.04); ctx.lineTo(w * 0.55, h * 0.36); ctx.lineTo(w * 0.5, h * 0.46); ctx.lineTo(w * 0.45, h * 0.36); ctx.closePath(); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = w * 0.018; ctx.beginPath(); ctx.moveTo(w * 0.32, 0); ctx.lineTo(w * 0.5, h * 0.5); ctx.lineTo(w * 0.68, 0); ctx.moveTo(w * 0.5, h * 0.5); ctx.lineTo(w * 0.5, h); ctx.stroke(); dot(ctx, w * 0.56, h * 0.62, w * 0.022, INK); dot(ctx, w * 0.56, h * 0.78, w * 0.022, INK); } });   // shirt V, tie, lapel lines, two buttons
def({ key: 'sign_chickenrice', zh: '小贩招牌「鸡饭 CHICKEN RICE」（1×6 砖长侧面，中英双语，印刷体）', colors: ['Yellow', 'Black', 'Red'], firstUse: 'Singapore', face: 'side', base: 'brick_1x6', px: 360, draw: (ctx, w, h) => {
  ctx.fillStyle = '#F2CD37'; ctx.fillRect(0, 0, w, h); ctx.strokeStyle = '#C91A09'; ctx.lineWidth = h * 0.06; ctx.strokeRect(h * 0.05, h * 0.05, w - h * 0.1, h - h * 0.1);
  kanji(ctx, '鸡饭', w * 0.3, h * 0.5, h * 0.62, '#111', 0.1, 'bold', SANS);                                                                           // Singapore hawker boards are typeset: bold Hei, Chinese big
  ctx.fillStyle = '#C91A09'; ctx.font = `bold ${h * 0.24}px ${SANS}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('CHICKEN', w * 0.74, h * 0.36); ctx.fillText('RICE', w * 0.74, h * 0.66);   // English smaller, stacked, as on the real boards
} });
def({ key: 'plaque_shophouse', zh: '店屋牌匾「金福」（1×4 砖长侧面，黑漆金字）', colors: ['Black', 'Gold'], firstUse: 'Singapore', face: 'side', base: 'brick_1x4', px: 360, draw: (ctx, w, h) => {
  ctx.fillStyle = '#141414'; ctx.fillRect(0, 0, w, h); ctx.strokeStyle = GOLD; ctx.lineWidth = h * 0.035; ctx.strokeRect(h * 0.08, h * 0.08, w - h * 0.16, h - h * 0.16);
  kanji(ctx, '金福', w / 2, h * 0.53, h * 0.62, GOLD, 0.5, 'normal', PLAQUE);                                                    // carved-script calligraphy in gold on lacquer, as on Chinatown and Joo Chiat shopfronts
} });
def({ key: 'cart_side', zh: '冰淇淋推车侧面（2×2 砖正面）', colors: ['Medium Azure', 'Tan', 'Bright Pink', 'White'], firstUse: 'Singapore', face: 'front', base: 'brick_2x2', px: 240, draw: (ctx, w, h) => {
  ctx.fillStyle = AZURE; ctx.fillRect(0, 0, w, h * 0.16);
  ctx.fillStyle = TAN; ctx.beginPath(); ctx.moveTo(w * 0.36, h * 0.5); ctx.lineTo(w * 0.64, h * 0.5); ctx.lineTo(w * 0.5, h * 0.94); ctx.closePath(); ctx.fill();
  dot(ctx, w * 0.42, h * 0.42, w * 0.11, '#E4ADC8'); dot(ctx, w * 0.58, h * 0.42, w * 0.11, WHITE); dot(ctx, w * 0.5, h * 0.29, w * 0.11, '#E4ADC8');
} });
def({ key: 'tile_majolica', zh: '娘惹马约利卡瓷砖（1×2 光面砖顶面）', colors: ['White', 'Dark Pink', 'Green', 'Medium Azure'], firstUse: 'Singapore', face: 'top', base: 'tile_1x2', px: 200, draw: (ctx, w, h) => {
  ctx.fillStyle = WHITE; ctx.fillRect(0, 0, w, h); const n = Math.round(w / h);
  for (let i = 0; i < n; i++) { const cx = (i + 0.5) * h, cy = h / 2, s = h; ctx.strokeStyle = AZURE; ctx.lineWidth = s * 0.06; ctx.strokeRect(i * s + s * 0.05, s * 0.05, s * 0.9, s * 0.9);
    for (let k = 0; k < 4; k++) { const a = k / 4 * Math.PI * 2; ctx.fillStyle = GREEN; ctx.beginPath(); ctx.ellipse(cx + Math.cos(a + Math.PI / 4) * s * 0.3, cy + Math.sin(a + Math.PI / 4) * s * 0.3, s * 0.1, s * 0.05, a + Math.PI / 4, 0, Math.PI * 2); ctx.fill(); dot(ctx, cx + Math.cos(a) * s * 0.17, cy + Math.sin(a) * s * 0.17, s * 0.1, DKPINK); }
    dot(ctx, cx, cy, s * 0.07, YELLOW); }
} });
def({ key: 'merlion_eye', zh: '鱼尾狮眼（1×1 砖正面，两侧各一块）', colors: ['Dark Bluish Gray', 'Black'], firstUse: 'Singapore', face: 'front', base: 'brick_1x1', px: 240, draw: (ctx, w, h) => {
  ctx.strokeStyle = DKGRAY; ctx.lineWidth = w * 0.09; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(w * 0.18, h * 0.3); ctx.quadraticCurveTo(w * 0.5, h * 0.12, w * 0.82, h * 0.3); ctx.stroke();   // brow ridge
  ctx.fillStyle = INK; ctx.beginPath(); ctx.ellipse(w * 0.5, h * 0.55, w * 0.2, h * 0.16, 0, 0, Math.PI * 2); ctx.fill(); dot(ctx, w * 0.56, h * 0.5, w * 0.05, WHITE);                                   // eye with a highlight
} });
def({ key: 'merlion_scales', zh: '鱼尾狮鱼身鳞片（任意砖的长侧面，两面）', colors: ['Light Bluish Gray'], firstUse: 'Singapore', face: 'side', base: 'brick_*', both: true, px: 240, draw: (ctx, w, h) => {
  ctx.strokeStyle = '#7F878C'; ctx.lineWidth = h * 0.05; const rows = 4, r = h / rows * 0.55, pitch = r * 2.1;
  for (let row = 0; row < rows; row++) { const cy = h * ((row + 0.35) / rows); for (let cx = (row % 2 ? pitch / 2 : 0) - pitch; cx < w + pitch; cx += pitch) { ctx.beginPath(); ctx.arc(cx, cy, r, Math.PI * 0.12, Math.PI * 0.88); ctx.stroke(); } }
} });
// ---- Prague (2026-10-02) ---------------------------------------------------------------------------------------------------------------
// House signs (domovní znamení) are painted emblems over the arcade, no lettering needed: the house is named after its sign. The White
// Unicorn: a white rearing unicorn on a dark red cartouche with a gold frame — three flat colours, read at thumbnail by silhouette alone.
def({ key: 'sign_unicorn', zh: '房屋标志「白独角兽」（1×2 砖长侧面，暗红底白独角兽金边）', colors: ['Dark Red', 'White', 'Gold'], firstUse: 'Prague', face: 'side', base: 'brick_1x2', px: 360, draw: (ctx, w, h) => {
  ctx.fillStyle = DARKRED; ctx.fillRect(0, 0, w, h); ctx.strokeStyle = GOLD; ctx.lineWidth = h * 0.06; ctx.strokeRect(h * 0.07, h * 0.07, w - h * 0.14, h - h * 0.14);
  const s = h * 0.78, cx = w / 2, cy = h * 0.55; const P = (x: number, y: number): [number, number] => [cx + x * s, cy + y * s];
  ctx.fillStyle = WHITE; ctx.beginPath();
  // rearing unicorn facing right: hind legs, body, raised forelegs, neck, head, horn
  const pts: [number, number][] = [[-0.42, 0.38], [-0.34, 0.08], [-0.2, -0.02], [0.08, -0.06], [0.18, -0.22], [0.3, -0.3], [0.36, -0.24], [0.27, -0.12], [0.3, -0.02], [0.4, 0.06], [0.35, 0.1], [0.24, 0.03], [0.17, 0.08], [0.1, 0.16], [-0.06, 0.16], [-0.18, 0.2], [-0.24, 0.38], [-0.3, 0.38], [-0.28, 0.2], [-0.36, 0.38]];
  ctx.moveTo(...P(...pts[0])); for (const p of pts.slice(1)) ctx.lineTo(...P(...p)); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = GOLD; ctx.lineWidth = h * 0.05; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(...P(0.33, -0.28)); ctx.lineTo(...P(0.46, -0.44)); ctx.stroke();   // the horn, gilded like the real sign
} });

// ---- PRAGUE · the Astronomical Clock (2026-10-02). Painted dials, four flat colours each; no numerals at this size — the painted gold ticks
// and hands read, Schwabacher figures would not (rule 1: cut what cannot be read at thumbnail size). Both dials ride on orloj_dial (30209).
const ORLOJ_BLUE = '#5A93DB', ORLOJ_DUSK = '#B5652B', ORLOJ_NIGHT = '#1B2A34', ORLOJ_GOLD = '#C9A227', ORLOJ_BROWN = '#582A12';
def({ key: 'orloj_astro', zh: '天文钟·天文盘（蓝色白昼、两侧棕橙晨昏、底部黑夜、偏心金色黄道环、太阳针与月亮）', colors: ['Medium Blue', 'Dark Orange', 'Black', 'Pearl Gold'], firstUse: 'Czechia', face: 'front', base: 'orloj_dial', px: 160, rect: { w: 3.84, h: 3.84, y: 0, z: 1.72 }, draw: (ctx, w, h) => {
  // orloj-dial-closeup.jpg: a black ring of 24 gold ticks; inside, the blue day disc; the dawn (left) and dusk (right) zones are brown-orange
  // crescents wrapped round the black night circle low in the dial; the gold zodiac ring hangs off-centre toward the top; the sun rides the
  // gold hand, the moon (black with a gold rim) its own hand. Four flat colours, nothing finer than a tick.
  const cx = w / 2, cy = h / 2, R = w * 0.49;
  dot(ctx, cx, cy, R, ORLOJ_NIGHT);
  for (let k = 0; k < 24; k++) { const a = k / 24 * Math.PI * 2; ctx.strokeStyle = ORLOJ_GOLD; ctx.lineWidth = w * 0.022; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * R * 0.85, cy + Math.sin(a) * R * 0.85); ctx.lineTo(cx + Math.cos(a) * R * 0.97, cy + Math.sin(a) * R * 0.97); ctx.stroke(); }
  const r = R * 0.8; ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip();
  ctx.fillStyle = ORLOJ_BLUE; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = ORLOJ_DUSK; ctx.beginPath(); ctx.arc(cx, cy + r * 0.5, r * 0.82, 0, Math.PI * 2); ctx.fill();     // dawn and dusk
  ctx.fillStyle = ORLOJ_NIGHT; ctx.beginPath(); ctx.arc(cx, cy + r * 0.62, r * 0.58, 0, Math.PI * 2); ctx.fill();   // night
  ctx.restore();
  arc(ctx, cx, cy, r, 0, Math.PI * 2, w * 0.022, ORLOJ_GOLD);
  const zx = cx + r * 0.08, zy = cy - r * 0.3, zr = r * 0.6;                                // the eccentric zodiac ring, toward the top
  arc(ctx, zx, zy, zr, 0, Math.PI * 2, w * 0.095, ORLOJ_GOLD); arc(ctx, zx, zy, zr, 0, Math.PI * 2, w * 0.012, ORLOJ_NIGHT);
  for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2; ctx.strokeStyle = ORLOJ_NIGHT; ctx.lineWidth = w * 0.012; ctx.beginPath(); ctx.moveTo(zx + Math.cos(a) * (zr - w * 0.035), zy + Math.sin(a) * (zr - w * 0.035)); ctx.lineTo(zx + Math.cos(a) * (zr + w * 0.035), zy + Math.sin(a) * (zr + w * 0.035)); ctx.stroke(); }
  ctx.strokeStyle = ORLOJ_GOLD; ctx.lineCap = 'round'; ctx.lineWidth = w * 0.03; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx - r * 0.62, cy - r * 0.62); ctx.stroke();   // the sun hand
  dot(ctx, cx - r * 0.47, cy - r * 0.47, w * 0.06, ORLOJ_GOLD);                                                                                                         // the sun
  ctx.lineWidth = w * 0.02; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + r * 0.72, cy - r * 0.4); ctx.stroke();                                                  // the moon hand
  dot(ctx, cx + r * 0.6, cy - r * 0.33, w * 0.05, ORLOJ_GOLD); dot(ctx, cx + r * 0.6, cy - r * 0.33, w * 0.035, ORLOJ_NIGHT);                                           // the moon
  dot(ctx, cx, cy, w * 0.035, ORLOJ_GOLD);
} });
def({ key: 'orloj_calendar', zh: '天文钟·日历盘（金底，十二个棕色圆框，中心金色）', colors: ['Pearl Gold', 'Reddish Brown', 'Black'], firstUse: 'Czechia', face: 'front', base: 'orloj_dial', px: 160, rect: { w: 3.84, h: 3.84, y: 0, z: 1.72 }, draw: (ctx, w, h) => {
  const cx = w / 2, cy = h / 2, R = w * 0.49;
  dot(ctx, cx, cy, R, ORLOJ_GOLD); arc(ctx, cx, cy, R * 0.97, 0, Math.PI * 2, w * 0.02, ORLOJ_NIGHT);
  for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2 - Math.PI / 2; dot(ctx, cx + Math.cos(a) * R * 0.72, cy + Math.sin(a) * R * 0.72, R * 0.17, ORLOJ_BROWN); dot(ctx, cx + Math.cos(a) * R * 0.72, cy + Math.sin(a) * R * 0.72, R * 0.1, ORLOJ_GOLD); }   // the twelve months
  arc(ctx, cx, cy, R * 0.47, 0, Math.PI * 2, w * 0.018, ORLOJ_NIGHT); dot(ctx, cx, cy, R * 0.3, ORLOJ_BROWN); dot(ctx, cx, cy, R * 0.16, ORLOJ_GOLD);   // the city arms at the centre, as a medallion
} });
def({ key: 'orloj_turret_clock', zh: '市政厅塔钟（黑底金针，1×2×2 砖正面）', colors: ['Black', 'Pearl Gold'], firstUse: 'Czechia', face: 'front', base: 'brick_1x2x2', px: 200, draw: (ctx, w, h) => {
  const cx = w / 2, cy = h / 2, R = Math.min(w, h) * 0.46;
  dot(ctx, cx, cy, R, ORLOJ_NIGHT); arc(ctx, cx, cy, R * 0.94, 0, Math.PI * 2, R * 0.06, ORLOJ_GOLD);
  for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2; dot(ctx, cx + Math.cos(a) * R * 0.75, cy + Math.sin(a) * R * 0.75, R * 0.06, ORLOJ_GOLD); }
  ctx.strokeStyle = ORLOJ_GOLD; ctx.lineCap = 'round'; ctx.lineWidth = R * 0.09; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx, cy - R * 0.62); ctx.stroke(); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + R * 0.4, cy + R * 0.1); ctx.stroke();
} });

// ---- Prague life layer (2026-10-02): the busker on the bridge, the painter on Kampa, the visitor under the clock
def({ key: 'torso_busker', zh: '街头小提琴手·白衬衫暗红马甲黑领结', colors: ['White', 'Black'], firstUse: 'Prague', ...TORSO, draw: (ctx, w, h) => { ctx.fillStyle = WHITE; ctx.beginPath(); ctx.moveTo(w * 0.36, 0); ctx.lineTo(w * 0.64, 0); ctx.lineTo(w * 0.56, h); ctx.lineTo(w * 0.44, h); ctx.closePath(); ctx.fill(); ctx.fillStyle = INK; ctx.beginPath(); ctx.moveTo(w * 0.42, h * 0.08); ctx.lineTo(w * 0.5, h * 0.13); ctx.lineTo(w * 0.42, h * 0.18); ctx.closePath(); ctx.moveTo(w * 0.58, h * 0.08); ctx.lineTo(w * 0.5, h * 0.13); ctx.lineTo(w * 0.58, h * 0.18); ctx.closePath(); ctx.fill(); for (const y of [0.4, 0.58, 0.76]) dot(ctx, w * 0.5, h * y, w * 0.02, INK); } });   // on a Dark Red torso: the waistcoat is the torso colour, the shirt shows down the middle
def({ key: 'torso_painter', zh: '画家·白罩衫溅色暗红围巾', colors: ['Dark Red', 'Blue', 'Yellow'], firstUse: 'Prague', ...TORSO, draw: (ctx, w, h) => { ctx.fillStyle = DARKRED; ctx.beginPath(); ctx.moveTo(w * 0.3, 0); ctx.lineTo(w * 0.7, 0); ctx.lineTo(w * 0.58, h * 0.16); ctx.lineTo(w * 0.42, h * 0.16); ctx.closePath(); ctx.fill(); ctx.fillRect(w * 0.44, h * 0.14, w * 0.08, h * 0.3); for (const [x, y, c] of [[0.3, 0.6, '#0055BF'], [0.66, 0.5, '#F2CD37'], [0.72, 0.78, DARKRED], [0.36, 0.84, '#F2CD37'], [0.6, 0.68, '#0055BF']] as [number, number, string][]) dot(ctx, w * x, h * y, w * 0.035, c); } });   // a scarf knotted at the neck, paint dabs on the smock (White torso)
def({ key: 'torso_tourist', zh: '游客·沙绿 T 恤双肩包背带', colors: ['Dark Brown', 'White'], firstUse: 'Prague', ...TORSO, draw: (ctx, w, h) => { ctx.strokeStyle = '#352100'; ctx.lineWidth = w * 0.07; ctx.beginPath(); ctx.moveTo(w * 0.24, 0); ctx.lineTo(w * 0.2, h * 0.92); ctx.moveTo(w * 0.76, 0); ctx.lineTo(w * 0.8, h * 0.92); ctx.stroke(); ctx.strokeStyle = WHITE; ctx.lineWidth = w * 0.03; ctx.beginPath(); ctx.arc(w * 0.5, 0, w * 0.13, 0, Math.PI); ctx.stroke(); } });   // backpack straps over a plain tee (Sand Green torso)
def({ key: 'canvas_tyn', zh: '画布·泰恩双塔剪影（画家的画，1×2×2 砖正面）', colors: ['Bright Light Blue', 'Black', 'Dark Orange'], firstUse: 'Prague', face: 'front', base: 'brick_1x2x2', px: 320, draw: (ctx, w, h) => {
  ctx.fillStyle = '#9FC3E9'; ctx.fillRect(w * 0.06, h * 0.06, w * 0.88, h * 0.62);
  ctx.fillStyle = INK; for (const cx of [0.4, 0.6]) { ctx.fillRect(w * (cx - 0.06), h * 0.42, w * 0.12, h * 0.3); ctx.beginPath(); ctx.moveTo(w * (cx - 0.07), h * 0.43); ctx.lineTo(w * cx, h * 0.12); ctx.lineTo(w * (cx + 0.07), h * 0.43); ctx.closePath(); ctx.fill(); for (const dx of [-0.07, 0.07]) { ctx.beginPath(); ctx.moveTo(w * (cx + dx - 0.02), h * 0.44); ctx.lineTo(w * (cx + dx), h * 0.3); ctx.lineTo(w * (cx + dx + 0.02), h * 0.44); ctx.closePath(); ctx.fill(); } }
  ctx.fillStyle = '#A95500'; ctx.fillRect(w * 0.06, h * 0.68, w * 0.88, h * 0.26);
} });   // the view the painter is copying: Týn's two dark spires over red roofs
