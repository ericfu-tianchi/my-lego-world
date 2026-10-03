// Prague · catalogue entries for the orloj element (2026-10-02). Append-only; imported by src/scenes/cz-orloj.ts.
import { ldrawPart } from './catalog';

// The two dials: 30209 Bracket 1 × 2 – Dish 4 × 4 turned to face +z (tools/ldraw/asm-prague-orloj.mjs). The box is the bracket plate — its real
// connection, two studs on top, two anti-studs below — and lies in the clock frame's wall; the dish stands 0.1 in front of the wall face,
// centred on the plate's mid-height, ±5 plates. Collision covers the dish only (the plate's own cell is the wall's).
// studs 'none': the stud check reads the baked model, not 30209's plate studs; nothing is built on them (the frame bricks above span the gap)
ldrawPart({ key: 'orloj_dial', id: 'orloj_dial', bl: '30209', name: 'Bracket 1 x 2 - Dish 4 x 4 (dish facing +z)', zh: '支架碟 1×2–4×4（钟盘朝 +z）', cat: 'round', w: 2, d: 1, h: 1, studs: 'none', accepts: true, anchor: 'origin', lift: 1, ext: [-2, 2, 0.5, 1.7], showColor: 'Black', note: '天文钟的两个钟盘：支架板砌在钟框墙里，碟面立在墙前 0.1 格，印花在碟面上（大本钟 10253 的做法，Eric 批准）' });
ldrawPart({ key: 'arch_1x3', id: '4490', bl: '4490', name: 'Arch 1 x 3', zh: '拱 1×3', cat: 'arch', w: 3, d: 1, h: 3, studs: 'all', accepts: true, showColor: 'Tan', note: '钟塔回廊的小连拱：每边两个' });
ldrawPart({ key: 'arch_curved_1x6x2', id: '6183', bl: '6183', name: 'Arch 1 x 6 x 2 with Curved Top', zh: '弧顶拱 1×6×2', cat: 'arch', w: 6, d: 1, h: 6, studs: (i) => i === 2 || i === 3, accepts: true, showColor: 'Tan', note: '天文钟的石檐罩，离钟框两格' });
ldrawPart({ key: 'slope75_2x1x3', id: '4460b', bl: '4460b', name: 'Slope Brick 75 2 x 1 x 3', zh: '75° 斜坡 2×1×3', cat: 'slope', w: 1, d: 2, h: 9, studs: 'back', accepts: true, showColor: 'Black', note: '陡坡屋顶的边：凸点在 −z 一格，坡面朝 +z（与 3685 角件拼成 6×6 → 4×4）' });
ldrawPart({ key: 'slope75_peak_hollow', id: '3688', bl: '3688', name: 'Slope Brick 75 2 x 2 x 2 Quadruple Convex', zh: '75° 四凸坡 2×2×2（顶上空心凸点插杆）', cat: 'slope', w: 2, d: 2, h: 6, studs: 'none', studPoints: [[0, 0]], hollow: true, accepts: true, showColor: 'Black', note: '同一块 3688：顶上空心凸点在正中，插金色细杆当尖顶' });
