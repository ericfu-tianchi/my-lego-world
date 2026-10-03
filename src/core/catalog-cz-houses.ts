// Prague · catalogue entries for the house row (2026-10-02). Append-only; imported by src/scenes/cz-houses.ts and src/scenes/prague-houses.ts.
import { ldrawPart } from './catalog';
// The procedural arch_1x4x2 has half-stud legs (a 3-wide opening that leaves the pier studs showing under the arch); the real 6182 has 1-stud legs
// and a 2-wide opening that lands exactly on the piers — the arcade uses the real mould.
ldrawPart({ key: 'arch_1x4x2_ld', id: '6182', bl: '6182', name: 'Arch 1 x 4 x 2', zh: '拱 1×4×2（真实模具）', cat: 'arch', w: 4, d: 1, h: 6, studs: 'all', accepts: true, showColor: 'White', note: '腿宽 1 格、开口 2 格：老城广场拱廊' });
// The Týn School crown (round 6, 2026-10-03). 6091 was the wrong mould: it is a 1 × 2 with a stud on a low end and a quarter-round on the
// other — on the crown it read as a white piece standing on nothing (Eric). 6191 is symmetric: a 1 × 4 whose top arches over its full
// length? No — 6191's top is a barrel across its width, so from the front it reads as a flat vault. 6183 is the gablet: a 1 × 6 arch whose top
// curves down to both ends, flat at the crown with two studs (LDraw stud at ±10 LDU), so a finial sits on the axis through a jumper.
ldrawPart({ key: 'arch_round_1x6x2', id: '6183', bl: '6183', name: 'Arch 1 x 6 x 2 with Curved Top', zh: '弧顶拱 1×6×2', cat: 'arch', w: 6, d: 1, h: 6, studs: (i) => i === 2 || i === 3, accepts: true, showColor: 'White', note: '两端弧形下落、拱顶中间两个凸点：泰恩学校屋顶的圆顶山花，顶上用跳板接尖顶' });
