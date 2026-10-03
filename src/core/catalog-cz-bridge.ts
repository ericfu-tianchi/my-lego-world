// Prague · catalogue entries for the bridge element (2026-10-02). Append-only; imported by src/scenes/cz-bridge.ts.
import { ldrawPart, type Category } from './catalog';

ldrawPart({ key: 'arch_1x8x2_raised', id: '16577', bl: '16577', name: 'Arch 1 x 8 x 2 Raised', zh: '高拱 1×8×2', cat: 'arch', w: 8, d: 1, h: 6, studs: 'all', accepts: true, showColor: 'Tan', note: '拱脚各占一格，净跨 6；比 3308a 的拱腹更高更圆：查理大桥的低拱' });
ldrawPart({ key: 'wedge_4x4_pointed', id: '22391', bl: '22391', name: 'Wedge 4 x 4 Pointed', zh: '尖头楔形砖 4×4', cat: 'brick-mod', w: 4, d: 4, h: 3, studs: (i, j) => j === 0 && (i === 1 || i === 2), mask: (i, j) => j <= 1 || (i >= 1 && i <= 2), accepts: true, showColor: 'Tan', note: '平边在 −z，尖头指向 +z（尖端在 3.5 格）。真零件顶上只有两颗凸点（直边一排的中间两格）：桥墩的分水尖' });
ldrawPart({ key: 'slope_inv_1x2_a', id: '3665a', bl: '3665', name: 'Slope Brick 45 2 x 1 Inverted', zh: '倒斜坡 45° 1×2（LDraw）', cat: 'slope', w: 1, d: 2, h: 3, studs: 'all', accepts: true, showColor: 'DarkBluishGray', note: '高端在 −z（墙里），斜面朝 +z 下方：门洞尖顶、托架' });
// statue study (Eric 2026-10-02: how do we do the bridge statues?)
const FIG = { cat: 'minifig' as Category, studs: 'none' as const, accepts: true, attach: true, anchor: 'origin' as const };
ldrawPart({ ...FIG, key: 'ghost_shroud', id: '2588', bl: '2588', name: 'Minifig Ghost Shroud', zh: '幽灵斗篷（雕像长袍）', w: 2, d: 2, h: 2, showColor: 'Black', note: '套在人仔头上，垂到脚边：一身连帽长袍的剪影' });
ldrawPart({ ...FIG, key: 'fig_cape', id: '4524', bl: '4524', name: 'Minifig Cape', zh: '披风', w: 2, d: 2, h: 2, showColor: 'Black', note: '夹在躯干和头之间（颈部）' });
ldrawPart({ key: 'robe_65_2x2', id: '3678b', bl: '3678b', name: 'Slope Brick 65 2 x 2 x 2 with Centre Tube', zh: '65° 坡 2×2×2（长袍）', cat: 'slope', w: 2, d: 2, h: 6, studs: (i, j) => j === 0, accepts: true, body: true, showColor: 'Black', note: '人仔长袍/裙摆的经典做法：躯干直接插在顶上两颗凸点' });
ldrawPart({ key: 'slope_18_4x2', id: '30363', bl: '30363', name: 'Slope Brick 18 4 x 2', zh: '18° 坡 4×2', cat: 'slope', w: 2, d: 4, h: 3, studs: (_i, j) => j === 0, accepts: true, showColor: 'ReddishBrown', note: '高端（凸点）在 −z，向 +z 缓降：桥墩上游的木制破冰坡' });
// the saints' attributes and the busker's violin
const HELD = { cat: 'accessory' as Category, studs: 'none' as const, accepts: true, held: true, anchor: 'oxz' as const };
ldrawPart({ ...HELD, key: 'cross_up', id: 'cross_up', bl: '21699', bom: ['21699'], name: 'Bar 4L with Cross Bar 2L, upside down (a Latin cross)', zh: '十字架（倒装的带横杆 4L 杆）', w: 2, d: 1, h: 10, ext: [-1, 1, -0.2, 0.2], bar: true, showColor: 'Black', note: '一个真零件转半圈：横杆在上，手握最下端。桥上圣徒的十字架' });
ldrawPart({ ...HELD, key: 'book', id: '33009', bl: '33009', name: 'Minifig Book', zh: '书（合上）', w: 1, d: 2, h: 7, showColor: 'DarkBrown', note: '圣徒手里的书' });
ldrawPart({ ...HELD, key: 'violin', id: '69947', bl: '69947', name: 'Minifig Violin', zh: '小提琴', w: 1, d: 1, h: 9, showColor: 'ReddishBrown', note: '桥上的街头小提琴手' });
ldrawPart({ key: 'star_1x1', id: '11609', bl: '11609', name: 'Plate 1 x 1 Round with Five-Pointed Star Top', zh: '五角星圆板 1×1', cat: 'plate-mod', w: 1, d: 1, h: 1, studs: 'none', accepts: true, anchor: 'origin', showColor: 'PearlGold', note: '金色五角星：内波穆克的星冠（戴在头顶凸点上）' });
ldrawPart({ key: 'arch_1x6_raised', id: '92950', bl: '92950', name: 'Arch 1 x 6 Raised', zh: '高拱 1×6', cat: 'arch', w: 6, d: 1, h: 3, studs: 'all', accepts: true, showColor: 'Tan', note: '拱脚各占一格：查理大桥跨过康帕岛的陆上拱' });
// round 7 (judge 2026-10-03): the bridge tower's steep wedge roof, the saints' cowls and palm, the busker's case
ldrawPart({ key: 'slope75_2x1x3', id: '4460b', bl: '4460b', name: 'Slope Brick 75 2 x 1 x 3', zh: '75° 坡 2×1×3', cat: 'slope', w: 1, d: 2, h: 9, studs: (_i, j) => j === 0, accepts: true, showColor: 'Black', note: '高端（凸点）在 −z，向 +z 陡降：桥塔的楔形陡顶' });
ldrawPart({ key: 'slope45_double_2x1', id: '3044b', bl: '3044b', name: 'Slope Brick 45 2 x 1 Double', zh: '45° 双坡 2×1', cat: 'slope', w: 1, d: 2, h: 3, studs: 'none', accepts: true, showColor: 'Black', note: '屋脊沿 x，向 ±z 两面坡：桥塔屋脊' });
ldrawPart({ ...FIG, key: 'helmet_castle', id: '3844', bl: '3844', name: 'Minifig Helmet Castle with Neck Protector', zh: '骑士头盔', w: 2, d: 2, h: 2, showColor: 'Black', note: '圣瓦茨拉夫：骑士国王的头盔' });
ldrawPart({ ...FIG, key: 'hood', id: '30381', bl: '30381', name: 'Minifig Hood', zh: '兜帽（修士风帽）', w: 2, d: 2, h: 2, showColor: 'Black', note: '套在人仔头上：桥上圣徒的风帽，不读成头发' });
ldrawPart({ ...HELD, key: 'palm_frond', id: '15279', bl: '15279', name: 'Plant Grass Stem (a martyr\'s palm)', zh: '棕榈枝（草茎）', w: 1, d: 1, h: 8, bar: true, showColor: 'Black', note: '殉道者的棕榈枝；手握茎' });
// round 9: the rowing boat's bow, St Christopher's Christ child
ldrawPart({ key: 'wedge_4x2_brick_r', id: '41767', bl: '41767', name: 'Wedge 4 x 2 Right', zh: '楔形砖 4×2 右', cat: 'brick-mod', w: 2, d: 4, h: 3, studs: (i) => i === 1, accepts: true, showColor: 'ReddishBrown', note: '直边在 +x，外侧向 +z 收尖；与左块并排成船头' });
ldrawPart({ key: 'wedge_4x2_brick_l', id: '41768', bl: '41768', name: 'Wedge 4 x 2 Left', zh: '楔形砖 4×2 左', cat: 'brick-mod', w: 2, d: 4, h: 3, studs: (i) => i === 0, accepts: true, showColor: 'ReddishBrown', note: '直边在 −x' });
ldrawPart({ ...FIG, key: 'baby', id: '24067', bl: '24067', name: 'Minifig Bundled Baby with Stud Holder on Back', zh: '襁褓婴儿', w: 1, d: 1, h: 2, showColor: 'Black', note: '背后的反凸点扣在头顶凸点上：圣克里斯托弗肩上的圣婴' });
// round 10: St Wenceslas's sword and shield, St Augustine's heart, St Anthony's Christ child in the arms
ldrawPart({ ...HELD, key: 'sword', id: '3847', bl: '3847', name: 'Minifig Sword Shortsword', zh: '短剑', w: 1, d: 2, h: 10, showColor: 'Black', note: '剑尖朝上，手握剑柄（grip bottom）：圣瓦茨拉夫' });
ldrawPart({ ...HELD, key: 'shield', id: '2586', bl: '2586', name: 'Minifig Shield Ovoid', zh: '椭圆盾', w: 2, d: 1, h: 9, showColor: 'Black', note: '手握盾背中央的把手：圣瓦茨拉夫' });
ldrawPart({ key: 'heart_tile', id: '39739', bl: '39739', name: 'Tile 1 x 1 Heart Shape', zh: '心形光面砖 1×1', cat: 'tile', w: 1, d: 1, h: 1, studs: 'none', accepts: true, anchor: 'origin', lift: 1, showColor: 'PearlGold', note: '圣奥古斯丁手上的燃烧之心（立在手持的 1×1 圆板上）' });
ldrawPart({ ...HELD, key: 'baby_held', id: '24067', bl: '24067', name: 'Minifig Bundled Baby (held)', zh: '襁褓婴儿（抱在手里）', w: 1, d: 2, h: 2, showColor: 'Black', note: '圣安东尼怀里的圣婴' });
ldrawPart({ ...HELD, key: 'roundplate_held', id: '85861', bl: '85861', name: 'Plate 1 x 1 Round with Open Stud (held)', zh: '空心凸点圆板（拿在手里）', w: 1, d: 1, h: 1, studs: 'center', showColor: 'Black', note: '手里托着，上面放心形砖' });
