# HANDOFF — My Lego World（形态 B · 20 国乐高世界）

- **任务**: 把 Eric 去过的约 20 个国家做成"真砖可拼、可拆解、可重建"的乐高微缩场景网页（最终嵌入他的像素风个人 OS 网站）。**日本（京都）已收尾 = Eric 8 分**；**新加坡：第一版完成（元件 + 岛 + 人仔 + 印花，2,944 块 PASS），评审页已发，等 Eric 放行后跑裁判**。
- **as-of**: 2026-09-19 凌晨。工作目录 `~/Desktop/My Lego World`。

## 新加坡 · 第一版完成（2026-09-19）— 停在检查点：Eric 看 v1，过了就跑裁判
- **评审页「滨海湾 v1」**: https://claude.ai/artifact/XjLurKgGjvrHogBRyYJuM6 （24 张渲染包 + 自查清单 + 我自己不满意的五点）。Eric 说"够" → 跑裁判 v4（`.claude/agents/lego-judge.md`，锚点京都 v10，渲染包在 scratchpad `pack2/`——session 消失后按 HANDOFF 机位重渲到 `docs/judge/singapore-round1/`），按报告改一轮，再出终版评审页。说"不够" → 按他指的改。
- **经过**: 元件包 v1 被 Eric 判 20 分（太草稿），于是金沙 / 鱼尾狮 / 擎天树推倒重做各三版、两版、三版，小贩摊改档口；然后拼岛 `src/scenes/singapore-island.ts`（`?scene=singapore`）。**流程更正已进 CLAUDE.md**：只在研究页和送裁判前两处找 Eric，中间自己迭代。
- **场景**: 56×44、base 3、一层地平 G 10、水面 8；超椭圆岛形；潟湖 (30,24) r 9×6.5 + 7 宽水道到前缘；带凸点的浅灰步道两圈 + 两条街；金沙 (33,2)；擎天树 L 形 (9,8)h7 / (16,8)h6 天桥 / (20,14)h5；店屋 (4,30) rot 1；档口 (12,36) rot 1；鱼尾狮 (40,23) 朝西，水柱 (37,23)；雨树 (50,26)；椰树 (45,14)(50,39)；推车 (34,38) + 大叔 (37.5,40.5)；游客 (18.5,25.5) rot 1；水獭 (24,31)(26,34)；八哥在档口顶。`Sites.add(..., group)` 让长地标拆成多个点位互不检查。
- **统计** `npx tsx scripts/stats.ts singapore`：2,944 块 · 82 种 · 30 色 · 专用件 13.8% / 63% 种 · LDraw 126 块 32 种 · 印花 12 款 17 块（0.6%，偏少）。金沙 735 块。
- **建造笔记** 全在 `docs/countries/singapore.md` §2（每个元件怎么做、试过什么、为什么砍）。关键教训：金沙玻璃板用透明 1×2 jumper 每层退半格（`jumper_1x2` 目录语义已改为中心凸点）；擎天树冠 1→2→4→6 圆板逐级张开、6×6 圆板 11213 新烘；鱼尾狮 S 形靴（倒斜坡做胸）；档口后墙 16 板让顶板落在墙上、`spanPlatesX` 给转了 90° 的建筑铺顶；步道必须是带凸点的板不能是光面砖，否则推车 / 水獭 / 基座没得连；树不能站在英雄机位到地标的视线上。
- **渲染机位（W 56 D 44 → 世界 x = 格 x − 28，z = 格 z − 22）**: 英雄 `az=0.62&el=0.42&dist=100`；俯视 el 1.45；象限 前右 `az=0.9&el=0.3&dist=55&tx=14&ty=5&tz=8`、前左 `az=5.6 … tx=-16`、后左 `az=3.9&dist=60&tx=-14&ty=8&tz=-12`、后右 `az=2.5&dist=65&tx=14&ty=10&tz=-12`；金沙 `only=mbs&az=0.5&el=0.2&dist=60&tx=14&ty=12&tz=-16`；鱼尾狮 `only=merlion,terrain&az=5.2&el=0.15&dist=22&tx=14&ty=6&tz=2`；树林 `only=supertree&az=3.9&el=0.1&dist=46&tx=-16&ty=10&tz=-12`；店屋 `only=shophouse&az=1.3&el=0.2&dist=30&tx=-20&ty=6&tz=0`；档口 `only=hawker&az=1.2&el=0.2&dist=26&tx=-13&ty=5&tz=14`；小贩 `az=1.5&el=0.15&dist=15&tx=-14.5&ty=4.5&tz=13.5`（侧 az 0.3）；大叔 `az=0.2&el=0.12&dist=17&tx=9.5&ty=4&tz=18.5`（侧 az 1.4）；游客 `az=1.3&el=0.12&dist=13&tx=-9.5&ty=4&tz=3.5`（侧 az 0.1）；剪影加 `&sil=1`。
- **没做 / 待定**: 螺旋桥（水道口留空）、晾衣竿、`index.html` 的 Singapore 按钮（Eric 过了再加）、拆解动画性能（D20）。

## 2026-09-18 深夜 · 新加坡研究阶段（Eric 已审过：整体 OK，四样必备，系列一致）
- 研究页 `docs/countries/singapore.md` §1（元素表：实物 / 21057 做法 / MOC 技法 / 我们借什么；色板；布局与三层；≤12 印花；开放问题）；简报提案 `judge/briefs/singapore.md` v1。评审页 artifact 已发。
- 地标提案：金沙（主角，三塔三明治透明砖 + 悬挑甲板）、擎天树林 ×3（洋红/深紫圆砖 + 倒扣 4×4 碟冠 + 天桥）、鱼尾狮（白，透明杆水柱）、螺旋桥（两拱 + 白栏栅/圆板交替）、娘惹店屋 ×3（粉彩 + 五脚基 + 百叶 3856）、小贩摊（煎锅 4528 + 火 + 印刷体招牌「鸡饭」）、雨树 `tree('raintree')` + 椰树 2536b/2518/6148 + 兰花；人仔 3（小贩、游客、冰淇淋大叔）；水獭 67631 ×2。
- 参考图 `docs/refs/singapore-composition.png` 已取到（Flyer 下载要 `cloudflared access login https://flyer.opuslab.ai`；`~/.cloudflared` 里遗留的 .lock 会卡住登录，删掉再登）。
- Eric 定了：整体 OK；必备金沙 + 擎天树 + 鱼尾狮 + 店屋/小贩摊；与京都同尺度同气质；白天、草坪 + 湾边步道按提案；他的新加坡记忆未答，生活层留一个位。**不要在本 session 开工**，新 session 按上面「第一件事」执行。

## 2026-09-18 深夜 · 去日本化 + 研究阶段 + 前端只留京都（v11）
- Eric：CLAUDE.md 必须通用，日本细节不能写在规则里。改法：`sakura5` → 通用 `tree(kind)`（`Foliage` 每国加一种叶花配方，`sakura5` 只是别名）；字体规则改成"按当地实物的字"；规则 11 改成**研究阶段**——每国先写 `docs/countries/<country>.md` §1（实物 / 官方套装 / 乐高大师技法 / 借什么 / 色板），Eric 审过才开工。日本细节全部搬到 `docs/countries/japan.md`（研究表 + 搭建笔记），模板 `docs/countries/_template.md`。playbook / JUDGE.md / 简报模板同步去掉日本专名（例子保留但标"例"）。
- 前端：`index.html` 只留 `Japan · Kyoto` 一个按钮；`?scene=kyoto-refined`、`?scene=tokyo`、`partsheet`、`trees` 仍可用 URL 打开，代码先留着，以后再删。
- tokyo.ts 改用 `minifig2`（旧 `minifig` 包装已删）。

## 2026-09-18 收尾 · 日本定稿 v10（Eric：8 分；3,237 块 PASS）
- **状态**：Kyoto 原版 `?scene=kyoto` 即日本样板，Eric 判 8 分，收尾。裁判包与 8 分锚点图：`docs/judge/reference/kyoto-v10/`（30 张）。Codex 候选 `?scene=kyoto-refined` 归档不再动。
- **收尾做的**：全元件特写巡检无穿模；基座顶面盖光面砖；文档全部重读并统一（CLAUDE.md 规则 1/5/7/11 与工作流、playbook v2 + 语法速查、JUDGE.md v4、简报模板与京都简报 v4、裁判 agent 提示）；lib.ts 删掉无人用的 sakura2 / sakuraD / pine / pine2 / maple / hangLantern / minifig 包装，其余旧树函数标 @deprecated。
- **裁判 v4 校准**：8 分锚点 = 京都 v10 的图；6 分 = 第二轮；门禁改为「合规 + 规整全过、加权 ≥ 8.0、每维 ≥ 7」；不扣真零件形状、渲染遮挡、不存在的模具；每维要写与锚点的差距。Eric 对实机的判断优先于裁判。
- **下一个国家怎么开始**：读 `docs/country-playbook.md` → **先写研究页** `docs/countries/<country>.md`（从 `_template.md` 复制；实物、官方套装、乐高大师技法、色板）给 Eric 审 → 复制 `judge/briefs/_TEMPLATE.md` 写简报 → 先在测试场做元件（`?scene=partsheet`，`?only=` 单看）→ 再拼岛 → 自查渲染 → 评审页 → 裁判。人仔 2–3、树用 `tree(kind)`（为该国加一种叶花）、屋角 `hipCorners`、栏杆 `railing`、灯 `stoneLantern`、字体按当地实物选栈。
- **未做（排在后面）**：拆解动画卡顿优化（D20）；地球仪入口与 20 枚图钉；LDraw 署名页；Tokyo A 样板还是 v1 语法。

## 2026-09-18 夜 · Eric 第三批三条（v9，3,143 块 PASS）
1. 小鸟浮在凸点上：底座套环太薄、视觉上脚座架在凸点顶 → `songbird` lift −0.5 下沉半板。2. 塔檐角 cheese 四向旋转看着乱 → 改镜像：+x 侧两角朝 +x（rot 3），−x 侧朝 −x（rot 1）。3. 大樱花更茂盛：L 规格三层分叉（trunk 4 段、层间 2 段）、长枝第一个空凸点放侧叶 4×3 + 花。其余 Eric 说"都很好了"。

## 2026-09-18 夜 · Eric 第二批四条（v8，3,112 块 PASS）
1. 鸟居像双马尾：1×4 弧形翼 → 1×2 弧形斜坡做轻微反り；比例 笠木 10 > 贯 8 > 島木 6。2. 汉字 low：Mincho 打印体 → 扁額改深漆底金字（Weibei SC 碑体，`PLAQUE` 字体栈），灯笼「京」改隶书墨红（`BRUSH`）。3. 瀑布：水帘落到桌面小水潭（透明板 10 块）+ 三点白色水花；校验器把桌面 y=0 也当地面根。4. 塔柱不对称：柱位改成镜像三间（k 与 S-1-k 配对）。规则进 JUDGE.md 规整审查（查实物比例、字要像手写匾、水要有落点）与 playbook。

## 2026-09-18 晚 · Eric 自查九条（v7，3,125 块 PASS）
裁判第三轮 6.15 后 Eric 自己看模型挑出九处，两轮裁判都没点到。全部按根因改，并写进 CLAUDE.md 规则 7、JUDGE.md「规整审查」、playbook：
1. 引桥台阶：cheese 锯齿 + 灰色 → 三级等高平板、桥红。2. 石灯笼：1×1 骑在 2×2 角上 → 全部居中（jumper 2×2 做 1→2→1 过渡）。3. 窗扇卡在窗口：LDraw 2529 的原点在铰链边、且薄边朝 x → 烘了转进框平面并居中的装配 `pane_lattice.ldr`，窗框与窗扇都 `anchor:'origin', lift 9` 共原点。4. 两座屋顶四角朝向：手写 rot 把 NE/SW 弄反 → `hipCorners()` 统一（SE0 NE1 NW2 SW3），塔檐 cheese 角同样四向旋转对称。5. 相机穿手：握点在机身 → 握点改到侧把手 `gp [-0.9,-0.08,-0.31]`（右手道具）。6. 鸟居只有笠木黑，島木改红。7/8. 樱花不均衡、树干骑在圆墩角上 → `sakura5`：2×2 圆砖树干居中、四角各一枝（两种风车交替）、冠落在 jumper 中心凸点。9. 塔栏杆长短不一 → `railing()` 对称分段、两端立柱。
- 新工具：`?only=tag,tag` 只渲一个元件（干净的特写与剪影）。`jumper_2x2` 的凸点语义改为 'center'。
- kyoto-refined 的石灯笼挪到 (51,25) 以适配新灯笼底座。

## 2026-09-18 · 裁判第二轮 6.01 → 按裁判全改（v6，3,013 块 PASS）
- 裁判包在 `docs/judge/round2/`（21 张）与 `docs/judge/round3/`（28 张，机位修正 + 缘侧/枯山水俯视/飛石路线/元件剪影）。报告 `report.md` 在各目录；子代理无写权限时由我转录。
- 第二轮五条合规不过（穿插/抓握/内部外露/字像印刷/随机撒点）里，两条是它看错（腿件孔与髋部台阶是真零件；僧人手臂其实前伸），一条是我渲染包拍坏（撑伞人正面卡进笠木、桥拍成塔、鸟居裁掉笠木）。规程 v3 已补：真零件形状不算外露；出包前每张自查、相机从岛外朝内。
- v6 改动（全部在 kyoto.ts / lib.ts / prints.ts）：草地去 Lime；飛石连成线（鸟居→桥→茶室台阶，支线到枯山水）；耙痕格栅改浅灰；池稍圆；**岛底两砖石质基座外扩一格**（plinth，+120 块）；鸟居前移到前缘瓣、加高一砖、笠木两端 1×4 弧形斜坡；桥面光面砖 + 柱顶 1×8 板扶手 + 珍珠金擬宝珠 + 引桥改石灰；撑伞人改白底红领和服 + 盘发、伞手平举（h 姿势，伞面高过发髻）；僧人站到枯山水石缘、帚头落砂；游客换浅褐浴衣（藏青领蓝花印花重画）、相机握点外移让手露出；松改 `sakura4(..., 'pine')`（三层叶云 + 锥顶）；竹七根；L 樱花树干 +1 砖高过屋脊；茶室缘侧抬两板 + 台阶，猫上缘侧；瀑布连到溪口；招牌改奶白底黑字。
- 相机方位（tools/shot.mjs 与 controls.ts）：position = target + (sin(az)·c, sin(el)·dist, cos(az)·c)。**az 0 在 +z，π/2 在 +x，π 在 −z，3π/2 在 −x。** 拍元件先算它在岛的哪一侧，相机放岛外那一侧。

## 2026-09-17/18 · Kyoto v5（Fable 接手；Codex 在 09-16 做的候选版留在 `?scene=kyoto-refined`，文档在 `docs/kyoto-refinement/`）
Eric 的四条：手/手持、樱花与整体、参考官方套装、连接结构；外加招牌字太糙。全部按根因改，Kyoto 原版 2,868 块 PASS。
1. **从外面看见手腕柱** → 根因在烘焙：LDraw 的左臂 3819 是镜像的 3818，镜像矩阵让三角形绕向反转，背面剔除把袖子吃掉。`bake.mjs` 现在保留 loader 法线并把每个三角形重绕到与法线一致；渲染器对 LDraw 模具双面绘制兜底（`matOpaqueDS`）。全部 92 个烘焙件用新库（2026-09-18 complete.zip）重烘。
2. **树** → `sakura4`（lib.ts）：倾斜树干、三根不等枝、枝头错层 0/2/4 板、6×5 叶上再压一片 4×3 交叉叶、枝上散花、一侧可留空（`skip`）、`turn` 旋转整棵。京都三棵：SW 草坪 L、茶室旁 M（屋顶侧留空）、东阶地 M。测试场 `?scene=trees` 左三棵 v4，右两棵是 A（10315 平铺）和 v3 对照。
3. **整体** → 五重塔改灰瓦白墙深红木朱红柱（清水寺配色，Dark Turquoise 违反自己简报里的"禁琉璃瓦"）；茶室 6×6 → 8×6（低而宽）；竹林挪到西阶地瀑布上方；第三个人仔（举相机看塔的游客，(23.5,36.5)）；招牌「茶寮」明朝体黑漆板 px360，灯笼「京」同步。
4. **碰撞真实几何**（09-16 深夜已做，记在此）：`extY` 纵向真实范围、`VSKIN` 0.5 板；LDraw 原点在顶面，落在凸点上的件要 `lift`；抓握点 `gp` 必须在零件表面，否则 `grip buried` 抛错。
5. **文件**：`judge/briefs/kyoto.md` v3（Codex 的简报归档到 docs/kyoto-refinement/）；新增 `docs/country-playbook.md`（跨国家做法一页）与 `judge/briefs/_TEMPLATE.md`；CLAUDE.md 规则 1/2/6/7/10 更新。
- 下一步：Eric 看评审页 → 跑裁判第二轮（渲染包到 `docs/judge/round2/`）→ 改一轮 → 停。

## 检查点 #1 → v3 做了什么（2026-09-11 晚，Eric 挑的四条问题）
1. **人仔手不握东西、手臂笔直、脸衣服 generic** → 根因在零件层：手工人仔模型太粗。改为真 LDraw 人仔件（970c00 腿、973 躯干 + 3818/3819 手臂按姿势旋转、3820 手、3626c 头、3901/62810/40233 发型），`tools/ldraw/minifig-asm.mjs` 生成 12 种手臂姿势组合 + 8 种手；握持点用 3820 文件头里的夹心坐标（`src/parts/ldraw/minifig-rig.ts`）；`HOLD_DEFAULTS` 给每种道具定姿势、抓握点、左右旋转。脸和和服印花重画（眉毛、眼白、双层领、腰带结、樱花纹）。
2. **零件穿插（人仔嵌进灯笼、手穿栏杆、扫帚穿身体）** → 根因在校验器：小零件按整格判断太粗，且允许 held×人仔重叠。改为真实矩形 `ext`（从 LDraw bbox 自动算，人仔身体手填），`bodiesIntersect` 容差 0.15 格；只允许 手×身体、道具×手。四个穿插全部被抓出并修掉。
3. **树丑（平摊叶层）** → 根因在语法：`sakura3`（细干、每层一个 2×2 节点 + 主枝 1×2 + 侧叶 + 对角花、层间留空、树冠）、`pine3`（雲形层、上小下大）。参考 10315/10281 做法 + gpt-image-2 参考图 `docs/refs/sakura-element.png`。
4. **拥挤、无呼吸感、无层次** → 根因在布局规则缺失：`Sites` 类把间距写成硬约束（近了就 throw，场景不生成）；岛放大到 56×44；池塘做中心；三个高度层（塔 > 大樱花 > 茶室 > 人）；6 个人仔分到 6 个区；CLAUDE.md 硬规则 6、JUDGE.md 合规清单加"无穿插 / 抓握真实 / 呼吸感 / 树有枝有层次"。参考图 `docs/refs/kyoto-composition.png`。
- v3 数据：2,998 块 · 103 种 · PASS；专用件 46 种（45%）、162 块（**5.4%，目标 8–12% 仍未达**——岛变大后地形占比更高）；印花 12 款。
- 评审页（检查点 #2）：见本 session 最后一条消息里的 artifact 链接（"京都 v3 问题报告"）。

## 检查点 #2 → v4（2026-09-11 深夜，Eric 挑的三条）
1. **人仔手臂脱节、动作僵硬** → 根因：我按记忆写的 LDraw 装配矩阵，顺序反了。真正的规则在 `parts/3818.dat` 的 !HELP 和 `parts/973c01.dat` 里：**先绕 X 轴抬臂，再绕 Z 轴 9.782° 贴合躯干**（M = Rz·Rx），手随臂刚性旋转。重写 `tools/ldraw/minifig-asm.mjs`：输出 16 种姿势的 `figtorso_<l><r>`（躯干+双臂，服装色）和 `fighands_<l><r>`（双手，肤色），两者都在**躯干坐标系**里、都用 anchor 'origin' 放在同一格 → 结构上不可能脱节。抓握点取自 3820 文件头的夹心坐标。
2. **专用件只有 5.4%** → 根因：岛是实心土方，光地形吃掉一半预算。先试空心+井字墙 → **反而更多**（排砖器在实心体上出 2×8，在格栅上出 1×1；3,013 → 3,186，已记入 CLAUDE.md 规则 7）。正解是**减薄**：内部从 y=3 起（约 2 块砖土层），外圈 3 格挂到 y=0 让边缘厚实；地层色带必须对齐整块砖高。再加园艺密度（落花、草丛、睡莲、鱼、鸟、蝶）。结果 2,856 块、专用件 7.8%。
3. **樱花树丑** → 等 Eric 选定参考套装后重做（研究员在查 40725 / 10315 / 10281 / 21060 等的官方拼法）。
- 同时加了 `SceneMeta.base`（场景声明自己的地面层），校验器按它判根。

## TL;DR 当前状态（v2 时写的，v3 见上）
今天 Eric 看了 11 张 910060 寿司店（BrickLink Designer Program 官方套装）的照片后拍板：**放开 LDraw 全库的真实模具 + 自绘印花，仍禁自造形状**（三层制）。据此做了：LDraw 导入管线（`tools/ldraw/bake.mjs`）、目录 113 → 153 种（40 种 LDraw 烘入）、印花系统（`src/core/prints.ts`，Canvas 矢量贴层）、校验器新规则（手持道具、夹子夹杆、宿主窗扇/格子门）、裁判 v2（`judge/JUDGE.md`）、京都 v2 场景重写（2,684 块，PASS）。渲染包 16 张 + 评审页 artifact 已发给 Eric。**下一步要等 Eric 看完评审页说"过"才跑裁判第二轮**（他在每个节点 in the loop，见 CLAUDE.md）。

## 已完成
**决策（Eric 拍板，按时间；D1–D14 见 git 历史里的旧 HANDOFF）**
- D15 三层零件制：L1 官方模具（含专用件，几何从 LDraw 库导入）、L2 装饰件（真模具 + 自绘印花，≤12 款/国、≤40 块/国）、L3 自造禁止。目标：专用件 8–12% 块数、30–35% 种类。
- D16 "在保证正确、合理、不巨量耗 token 的前提下尽可能多用零件"（Eric 原话）。
- D17 裁判由我自行分析优化（v2 已写），大方向不变；裁判只写零件类型不写编号。
- D18 流程：重搭 → 评审页给 Eric → 裁判一轮（测裁判）→ 我改一轮 → 停 → Eric 判断架构是否有问题；有问题回退改架构。
- D19 Eric 要求所有回复极简（结论 + 要他定的那一件事；长内容进 artifact）。
- D20 拆解动画卡顿：已实测原因（见 Gotchas），Eric 说不急，排在裁判之后。

**产出（本 session）**
- `tools/ldraw/bake.mjs`：从 LDraw 库烘几何 → `src/parts/ldraw/p<id>.ts`（Int16/Int8/Uint16 base64）+ `index.ts`。`src/core/ldraw.ts` 解码；`ldrawPart()` 在 catalog 里登记（anchor 'bbox' | 'origin'）。
- `src/core/prints.ts`：14 款印花（脸 ×5、躯干 ×4、茶寮招牌、幟旗「茶寮」、幟旗「桜」、锦鲤印花砖、灯笼「京」）；`face: top | front | side | cyl`，`both` 双面。渲染器按 (零件, 透明, 印花) 分批，贴层跟随实例矩阵。
- 校验器：`held`（道具在手里，允许半格）、`hollow/bar/clip` 标志（夹子伸出一格 `clipReach`）、宿主 pane_lattice_1x2x3→window_1x2x3、door_lattice→doorframe_1x4x6。
- 语法 v2（`src/scenes/lib.ts`）：`minifig2`（印花脸/躯干、任意发型、手持）、`holdUmbrella`、`banner`（幟旗）、`hangLantern`（夹子挂提灯）、`lowTable`、`blossom`、`sakura2`（枝干 + 6×5 叶 + 七瓣花）、`pine2`（四叶一层）。
- 场景：`src/scenes/kyoto.ts` v2（48×40 岛、对称鸟居、拱桥、茅葺茶室 + 格子门 + 障子、枯山水 + 4×4 岩、飛石、7 个人仔各有事做、猫/鸟/蛙/鸭/鱼/蝶）；`src/scenes/partsheet.ts` 隐藏测试场景（`?scene=partsheet`）。
- 裁判：`judge/JUDGE.md` v2（评分锚点、合规清单、8 维新权重、渲染包规格、只写零件类型）、`judge/briefs/kyoto.md` v2、`.claude/agents/lego-judge.md`。
- 评审页：定制零件三层制 https://claude.ai/code/artifact/d16906b7-046a-4d67-9252-3caeb595c9c8 ；京都 v2 检查点（见本 session 最后一条消息里的链接）。
- 京都 v2 数据：2,684 块 · 94 种 · 28 色 · PASS；专用件 37 种（39%）、167 块（**6.2%，目标 8–12% 未达**）；印花 12 款 15 块；LDraw 导入 33 种 150 块。

## 进行中
- 停在：**等 Eric 看京都 v2 评审页**。他说"过"→ 跑裁判 v2 第二轮（用 `lego-judge` 子 agent，渲染包在 scratchpad `kyoto-v2/`，需重渲到 `docs/judge/round2/`）→ 我按报告改一轮 → 再出评审页 → 停。他说"有问题"→ 回退改架构/决策。
- 未提交：本 session 所有改动都未 commit（Eric 决定）。`git status` 会很长：CLAUDE.md、.gitignore（+vendor/ldraw/）、judge/*、src/core/{builder,catalog,ldraw,prints,render,validate}.ts、src/scenes/{lib,kyoto,partsheet,index}.ts、src/app/main.ts、src/parts/ldraw/*（42 个烘好文件 1.5 MB）、tools/ldraw/bake.mjs、参考图/（11 张照片，Eric 的）。
- 建议提交信息：`feat: three-tier parts (LDraw import + prints), judge v2, Kyoto v2 rebuild`。

## Next steps
0. **Eric 检查点 #2**：他看 v3。过 → 跑裁判 v2 第二轮（渲染包在 scratchpad `kyoto-v3/`，要重渲到 `docs/judge/round2/`）→ 改一轮 → 停。回退 → 按他指的层级改。
1. （旧）Eric 检查点 #1 → 裁判第二轮（先 `npx vite build` + 起 8125 + 用 `tools/shot.mjs` 把 16 张渲到 `docs/judge/round2/`，再起 `lego-judge`，把 JUDGE.md、brief、图路径给它，报告写到 `docs/judge/round2/report.md`）。
2. 按报告改一轮（预计：专用件密度提到 8%+、茶室层高、樱花密度、桥面弧度、石组比例），出评审页，停。
3. 拆解动画优化（D20）：CCD 关、4 次迭代、物理 30 Hz + 主线程插值、settled 判定、可选地形固定。半天到一天。
4. 设计规范一页（形态 B、尺度分层、色板规则、人仔规则、印花规范）→ 其余 19 国。
5. 后置：地球仪入口、20 枚图钉、分享图、LDraw 导出、嵌入个人 OS；在 App 的 About 里给 LDraw.org 署名（CC BY 2.0）。

## 资源索引
- `CLAUDE.md` 项目硬规则（三层制、检查点流程）。`judge/JUDGE.md` v2、`judge/briefs/kyoto.md` v2。
- LDraw 全库（已解压，session 结束会消失）：`/private/tmp/claude-501/.../scratchpad/ldraw-lib/ldraw`；重新获取：`curl -L -o complete.zip https://library.ldraw.org/library/updates/complete.zip`（~145 MB）并解压，`export LDRAW_DIR=<解压目录>/ldraw`。没有它 bake 会逐文件下载（0.4 s/文件，缓存到 `vendor/ldraw/`）。
- 零件名索引：`awk 'FNR==1{sub(/^0 +/,""); print FILENAME "\t" $0; nextfile}' $LDRAW_DIR/parts/*.dat > names.tsv`，再 grep（注意 LDraw 名字里数字间是**双空格**，如 `Window  1 x  2 x  3`）。
- 参考：Brickset 910060 评测 https://brickset.com/article/129972/review-910060-sushi-restaurant ；10315 / 21060 / 71741 清单见三层制评审页来源栏。
- 旧目录 `~/Desktop/lego-world-claude`（v1）、`~/Desktop/lego world`（Astra）原样保留，不要删。

**命令**
```bash
cd "/Users/tianchifu/Desktop/My Lego World"
npx tsc --noEmit -p .                                   # 类型检查
npx tsx scripts/validate.ts [kyoto|tokyo|partsheet]     # 门禁，必须 PASS
LDRAW_DIR=.../ldraw-lib/ldraw node tools/ldraw/bake.mjs 3899 4094b   # 烘新零件 → 再在 catalog.ts 用 ldrawPart() 登记
npx vite build && (cd dist && python3 -m http.server 8125 --bind 127.0.0.1 &)
node tools/shot.mjs out.png "scene=kyoto&az=0.62&el=0.42&dist=90" 1600 1000
node tools/shot.mjs out.png "scene=kyoto&az=0.62&el=0.3&dist=90&sil=1"          # 剪影
node tools/shot.mjs out.png "scene=kyoto&az=0&el=0.15&dist=20&tx=-11&ty=6&tz=14" # 对准元件：世界 x=格x−W/2, z=格z−D/2, y=板×0.4（京都 W48 D40）
node tools/shot.mjs out.png "scene=partsheet&az=0.35&el=0.75&dist=78"            # 零件表测试场景
```

## Gotchas
- **minifig2 是唯一的人仔入口**（老 `minifig()` 只是包装）。腿 y、躯干 y+6、头 y+9、发/帽 y+12；手是独立零件按姿势放在腕点（bbox 中心），道具中心 = 夹心点 `RIG.grip[side+pose]` − 道具抓握点 `gp`。姿势 d/f/h/u；竖直物用 f（前伸 45°），托盘/相机用 h。要新道具就在 `HOLD_DEFAULTS` 加一行。
- **`ext` 真实矩形**：LDraw 小零件自动从 bbox 算；`anchor: 'oxz'` 让道具以自己的连接凸点为中心（杯子把手偏出去）；鱼用 bbox 锚。容差 SKIN=0.15。误报时先看是不是把手/尾巴，别放宽容差。
- **`Sites` 间距**：注册半径要按实际体量，圆形近似对长方形（茶室）偏保守，用"主体半径 + Reserve 管出檐"。站在地标里的人仔（缘侧店家、桥上撑伞）不要单独注册。
- **树节点**：`sakura3` 每层 = 2×2 板节点 + 1×2 主枝 + 侧叶 + 对角花；最上一层朝向要避开屋檩高度（大樱花用 dirs [3,2,0,1]）。
- **提灯挂法**：`hangLantern` 夹子在檩缘凸点上，灯体盒 5 板放在檩板之下（y = eave − 6），提手 `loop: 1` 伸进夹子；校验器夹杆规则允许"碰到"。
- **零件 w/d 方向**：目录里 `brick_1x4`/`plate_1x8`/`tile_1x2` 的 w=1（x 向）、d=4（z 向），rot 0 沿 z；沿 x 摆要 rot 1 或 3。`grilletile_1x2`、`cheese_1x2`、`brick_1x2` 例外（w=2）。印花 `side` 面在 +x；rot 3 把 +x 转到 +z（朝观众）。
- **LDraw 几何锚点**：默认 bbox 居中、底面齐部件盒底；发型/帽子用 `anchor: 'origin'`（LDraw 原点在头顶凸点）。6×5 叶子只占茎根一格（`leaves_6x5` w1 d1，anchor origin），叶片朝 rot 的反向伸出，用 `(rot+2)&3` 让它向外。
- **夹子与旗**：`clip_v`（4085）夹**横**杆、`clip_h`（61252）夹竖杆；旗 44676 的夹环是横向的，夹竖杆，夹子在部件 +z 端 → `banner()` 把 +z 端放在杆上。校验器 `clipReach` 允许夹子伸出 1.25 格。
- **手持**：`held` 零件放在手心位置 (cx±1.25, cz)，grip mid/top/bottom 决定高度；与人仔部件的穿插被允许。伞 = 4L 杆 bottom-grip + 伞面在杆顶 y+12（高于发型）。
- **spanPlates 出檐**：屋顶板条 2 宽、跨全深；外侧条靠上面的斜坡"压住"才算连接。要留出檐边挂灯笼就把板条起点外扩 1 格（`rx0-1`），斜坡环不动。
- **排砖器随机性**：`bp.pick/chance/rand` 序列变化会改变 `pack()` 的分块，进而改变"哪块板浮空"。一个元件挪位置可能让别处 FAIL，属正常，按报告修。
- **岛形与地平**：`groundTop` 三级（土丘 13 / 主层 10 / 阶地 7）；阶地 = 距岛缘 ≤2 格。放东西前先算 `G(x,z)`，并确认 `inIsland`。土丘现在是 19×19 圆角方（塔基 16×16 要全落在丘上）。
- **印花规则**：定义在 prints.ts，`base` 必须与 `bp.part` 的 key 一致（Blueprint 会 throw）。每国 ≤12 款：京都用了 12（`nobori_sakura` 已定义未用）。
- **拆解卡顿原因**（Node 基准，本机）：京都 2,918 刚体每步 23–35 ms（预算 16.7）；1,951 薄件全开 CCD；主线程无插值；永不入睡（12 s 后 2,739 醒）→ settled 永不触发。方案见 D20。
- **裁判报告里的编号别信**：round1 把 61482 写成雨伞（LDraw 是手铐）；v2 起裁判只写类型。伞 = 4094b，相机 = 30089b，扫帚 = 3836。
- 其余旧 Gotchas（校验器规则、Worker file://、Playwright SwiftShader 慢、Flyer 生图 Cloudflare、Rebrickable 403）仍有效，见 git 历史 `becf8b2` 的 HANDOFF。

## 自检
1. `npx tsx scripts/validate.ts` → 三行 PASS（kyoto 2,684、tokyo 2,221、partsheet 255）。
2. `npx vite build` 成功；`?scene=partsheet` 能看到 40 个新零件 + 6 个带脸人仔。
3. `judge/JUDGE.md` 第一行含 "v2"。
4. `git status` 很长但没有 `src/parts/ldraw/p6255.ts`（已删，太重）。
