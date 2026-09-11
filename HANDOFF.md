# HANDOFF · My Lego World（2026-09-11，从 lego-world-claude 会话迁出）

> 读这份文件的你，是在 `~/Desktop/My Lego World` 里新开的 Claude Code 会话。上一段对话（约五天、几十轮）的所有决定和细节都在这里。用户是 Eric，中文交流；他签的是"合同"：把 20 个国家做成能发布的乐高世界。先读完再动手。

---
## 0. 一分钟版
- **产品**：Eric 去过的约 20 个国家，每国一座真砖可拼的乐高微缩场景（形态 B：花园式立体岛），可拆解成物理零件堆、一键重建；先做独立网页，最后嵌进他的像素风个人 OS 网站。
- **现状**：v2 代码骨架完成；京都 B（2,918 块）和东京 A（2,221 块）两座样本都通过"零悬空"校验；物理拆解/重建可用；单文件版可离线运行。**但品质只有 5/10**，Eric 明确要求磨到 8.5–9 再发布。
- **刚定下的机制**：独立"乐高大师裁判"Agent 打分驱动迭代（`judge/JUDGE.md`），元件先过关再进场景。第一轮裁判报告在 `docs/judge/round1/report.md`（若不存在，说明裁判那一步没跑完，先跑）。
- **下一步**：等 Eric 确认裁判员 OK → 用裁判回路先把鸟居、人仔、樱花、茶室、塔檐磨到 8 分 → 重搭京都 → 场景级评审 → 写设计规范 → 其余 19 国。

---
## 1. Eric 是谁、怎么合作
- PM，理工背景，写码少；喜欢乐高和"组件化表达"；这是 passion project，也是作品集里"代表我个人"的一件，会公开说明是和 AI 一起做的。之前把我和 Astra（GPT）的 one-shot demo 发到小红书，反响很好。
- **合作方式（他反复强调）**：不要 vibe code 出结果给他看；每个重大技术决策都要"告诉问题 + 给几种方案 + 你的推荐"，他来选；一次只问一个问题（他要求用 grilling 技能一层层对齐）；能自己查到的事实别问他；需要他拍板的留给他，能独立推进的直接做但事后汇报决定。
- 他看不到中间过程（focus 模式），只看最终消息和 artifact。长内容做成 artifact 页面（他会在 artifact 上直接指出排版问题）。汇报里数字放表格，别塞进句子。
- 他会睁着眼挑细节：鸟居不对称、人仔没脸、灰盒子建筑，他都截图指出。**别自我评价"做得不错"，让裁判说话。**
- 组织规则：UI 文案英文，Silicon Valley SaaS 风（"Take it apart"、"Rebuild"）；中文对话里遇到不地道用法要纠正。
- 他的机器：macOS，Chrome，Cloudflare WARP（公司 Zero Trust）。

---
## 2. 决策记录（按时间）
| # | 决策 | 结论 | 备注 |
| --- | --- | --- | --- |
| D1 | 产品不用任何生图 | 每个像素来自零件实例；概念图只用来定方向 | 他两次强调 |
| D2 | 零件可自定义但必须"乐高感" → 后升级为 **必须对应真实零件号** | 112 种，全部在 LDraw 官方库核对通过 | `docs/catalog/ldraw-check.json` |
| D3 | 可拼装性 = **硬门禁** | 校验器 FAIL 则不许构建；"没有任何官方套装是拼不起来的" | `scripts/validate.ts` |
| D4 | 每套允许"定制零件"？ | **按需入库，绝不自造**：每国 ≤ 8 种真实的专属零件（人仔道具、动物、特殊楔形），带编号入库标注"首次用于：X" | 已用：锦鲤 64648 |
| D5 | 架构 | 内核用我的（整数网格、排砖器、真实零件目录、真实海岸线地球）；手感学 Astra（Worker 物理、炸开 + 力度滑条、抛物线重建、点选零件、清单导出） | Astra 的 React/Next 壳不搬 |
| D6 | 工程栈 | TypeScript + Vite 轻壳，无 React；先独立网页，再 iframe/组件嵌入个人 OS（他网站技术栈**未告知**） | |
| D7 | 视觉基调 | 以我 v1 的色彩和拼装质感为基准（比 Astra 的莫兰迪更"乐高"） | |
| D8 | 项目名/目录 | **My Lego World**，`~/Desktop/My Lego World`（git）。旧 v1 `~/Desktop/lego-world-claude` 与 Astra `~/Desktop/lego world` 原样保留作对照，不要删 | 产品名若公开用 LEGO 商标需留意，他知道 |
| D9 | 形态 | 四种打样（A 微缩城市 / B 花园岛 / C 街角故事 / D 明信片天际线）→ 他被 B 打动 → 要求 A、B 各搭一座真砖样本比较 → **2026-09-11 定 B 为主线** | 打样页 docs/03 |
| D10 | 工具箱层 | 允许，但必须是"语法不是模板"：每城 ≥1 手工英雄地标、配角由生成器按城市参数生成、色板每城独立、构图手工、人仔故事定制、相似度检查 | 他担心流水线感 |
| D11 | Blender | 不用 | |
| D12 | SNOT（侧向拼接） | v2 先不做（需半板精度），现代立面用透明板/格栅砖表达 | 裁判可能会逼着上 |
| D13 | 质量机制 | **独立裁判 Agent**：统一八维评分表（20 国拉通）+ 每城设计简报（必备特征/色板/禁忌）；元件先过关（≥8）再入库；场景级第二轮；门禁加权 ≥ 8.5。关键节点两个裁判取低分 | 他同意；**裁判员本身还需他确认** |
| D14 | 手感 | 拆解用 Astra 式：全体同时松手 + 向外冲量 + 力度滑条；重建走抛物线；底板固定 | 已实现 |

**待 Eric 决定 / 提供**：① 裁判员是否 OK（看 round1 报告）；② 个人 OS 网站技术栈（决定 iframe 还是组件）；③ 20 国清单 + 每国最深的记忆画面（已知：日本关东关西、法国、捷克布拉格、新加坡，共约 20 国）；④ 功能范围（点选零件、清单、分享图先进；音效、日暮光、拖零件看预算）。

---
## 3. 代码库地图（`~/Desktop/My Lego World`）
```
CLAUDE.md                 项目硬规则（新会话先读）
HANDOFF.md                本文件
My Lego World.html        单文件离线 App（= dist-single/index.html）
index.html                App 壳（HUD、按钮、滑条）
catalog.html              零件缩略图渲染页（Playwright 用）
vite.config.ts            base './'; worker.format = 'iife'（file:// 下 module worker 会失败）; --mode single 用 vite-plugin-singlefile
src/core/geometry.ts      单位系统：1 = 8mm stud；砖 1.2；板 0.4；凸点 r0.3 h0.18；倒角 0.045。roundedBox / profileExtrude / footprintPrism(带 bevel) / lathe / cornerSlope / pyramid / sideStud
src/core/colors.ts        46 种官方色：LEGO 名+色号、BrickLink 名、hex、用途；Trans* 半透明
src/core/catalog.ts       112 种零件：key、bl（真实编号）、中英文名、w×d×h(板)、studs 模式（all/none/back/center/disc/自定义）、accepts、mask、note、showColor、build()
src/core/builder.ts       Blueprint：part()/fill()/vox1()/clear()/pack()；排砖器（3 板同色→砖，贪心矩形，奇偶层反向扫描错缝，尺寸加权随机）；tag 用于校验报告分组
src/core/validate.ts      可拼装校验（见 §5）
src/core/render.ts        BrickRenderer：每种零件 × 透明度一个 InstancedMesh；makeStudioEnv（程序化环境贴图）；makeLights
src/core/controls.ts      自写 Orbit（拖转/滚轮/双指/shift 平移/自转）
src/physics/worker.ts     Rapier 在 Worker：全体动态 + 爆发速度（∝ strength、随高度增加）；baseplate 固定；每帧 post poses(Float32Array 7n)+awake+simT
src/physics/client.ts     PhysicsClient.start(poses, halfs, fixed, strength, tableY, center)
src/app/main.ts           场景切换、飞入组装、拆解、抛物线重建、shot 模式（?shot=1&scene=&az=&el=&dist=&tx=&ty=&tz=&dismantle=<模拟秒>&strength=）
src/scenes/lib.ts         共享语法：Reserve、patch 噪声、minifig、canopyLayers + CANOPY 图案（S/M/L/pine）、sakura/maple/pine/bush/bamboo、stoneLantern、paperLantern、fenceRun、overhangPlate、spanPlates
src/scenes/kyoto.ts       B 京都（pagoda()、teaHouse() 在文件内）
src/scenes/tokyo.ts       A 东京（街区生成器 fillBlock/tower 在文件内）
src/scenes/index.ts       SCENES 注册表 {kyoto, tokyo}
src/catalog-render.ts     缩略图渲染（window.__thumbs / __meta）
scripts/validate.ts       `npx tsx scripts/validate.ts [scene]` 构建门禁
tools/shot.mjs            无头截图（Playwright 在 tools/node_modules；浏览器在 ~/Library/Caches/ms-playwright）
tools/build-catalog-page.py + catalog-page.css   生成 docs/04
tools/style-protos/gen_all.py   12 张打样图的生成脚本（提示词在里面）
judge/JUDGE.md            裁判规程与八维评分表
judge/briefs/kyoto.md     京都设计简报（必备特征、色板、禁忌、参考）
.claude/agents/lego-judge.md   裁判子 Agent 定义（新会话可用 subagent_type: lego-judge）
docs/01-explainer.html    原理图解（给非程序员）
docs/02-iteration-plan.html    v2 计划、决策看板、新旧架构
docs/03-style-prototypes.html  四形态 × 三城打样（含提示词）
docs/04-parts-catalog.html     零件目录（已批准）
docs/05-samples-ab.html        A/B 样本对比页
docs/catalog/{thumbs,meta.json,ldraw-check.json}
docs/protos/               12 张 gpt-image-2 概念图 + results.json
docs/samples/              A/B 渲染 JPEG
docs/judge/round1/         裁判第一轮渲染集 + report.md
```
已发布的 artifact（Eric 账号私有）：原理图解 https://claude.ai/code/artifact/348b9239-84b7-4d4a-98dc-07a7caaf0ff9 · 计划 https://claude.ai/code/artifact/ba3aacb3-0bbe-4c54-8237-498b08f099a5 · 打样 https://claude.ai/code/artifact/fd4702ed-1784-4015-946c-a04d9dc3dde4 · 零件目录 https://claude.ai/code/artifact/28a1ba2b-ec93-4cdb-b236-2eb47508fbfc · A/B 样本 https://claude.ai/code/artifact/2b831ca3-946c-43ec-a6cd-47a539d76585 · v1 App https://claude.ai/code/artifact/52c33ae1-44ac-4121-a19e-3f61d8735117

---
## 4. 日常命令
```bash
cd "/Users/tianchifu/Desktop/My Lego World"
npx tsc --noEmit -p .                         # 类型检查
npx tsx scripts/validate.ts [kyoto|tokyo]     # 可拼装门禁（必须 PASS）
npx vite build                                # 多文件构建 → dist/（截图用）
(cd dist && python3 -m http.server 8125 --bind 127.0.0.1 &)   # 截图服务器
node tools/shot.mjs out.png "scene=kyoto&az=0.62&el=0.42&dist=86" 1400 900
node tools/shot.mjs out.png "scene=kyoto&dismantle=6&strength=3"          # dismantle = 模拟秒
npx vite build --mode single --outDir dist-single && cp dist-single/index.html "My Lego World.html"
git add -A && git commit -m "..."             # 用户名/邮箱：Eric Fu / ericfu-tianchi@outlook.com（用 -c 传）
```
坐标换算（截图对准某元件）：世界 x = 格 x − W/2，z = 格 z − D/2，y = 板 × 0.4。京都 W=46, D=38；东京 W=48, D=32。

---
## 5. 校验器规则（validate.ts，别改松）
- 每个零件的格子集合按 mask 与 rot 变换到世界坐标（半格允许）；凸点位置来自 catalog 的 studs 模式；`studs: 'center'` 的零件（jumper、圆锥、碟、人仔颈）视为**部件中心一颗凸点**。
- 连接：下件 L 顶面 = 上件 U 底面（同一板高），且 L 的某颗凸点落在 U 的占地内，且 U.accepts。反向（挂在上件底下）同规则。
- 宿主对：glass↔window、door↔doorframe、fig_hands↔fig_torso 同位置同朝向即连接；杆（bar_3l/4l）只能插进 HOLLOW 集合（圆砖、圆板、圆锥、望远镜、花茎、天线、水龙头）或被它们套住。
- 穿插：任意两件占地正面积相交且高度区间相交 → 报错（宿主对、杆与空心件、人仔件之间除外）。
- 接地：y=0 的零件为根；BFS 摸不到的即"floating"。全部 0 才 PASS。
- 报告按 `bp.tag` 分组，先看 by tag 行定位是哪座建筑。

**踩过的坑**（都已修）：1 宽板条整条压在悬挑外会飘 → 用 `overhangPlate`（2 宽条跨边）/`spanPlates`（跨墙到墙，奇数条放中间）；随机撒点的树冠无法保证支撑 → 树冠必须是手工图案 `CANOPY`；人仔头发要放头顶（y+10）；斜坡只有后排有凸点，rot 决定后排在哪侧；光面砖上放东西必飘；栅栏/人仔必须站在有凸点的板上（路面 tile 上不能站人）。

---
## 6. 现状数据与品质诊断（2026-09-11）
| 场景 | 零件 | 规格 | 颜色 | 校验 | 品质（Eric） |
| --- | --- | --- | --- | --- | --- |
| 京都 B | 2,918 | 56 | 28 | PASS | ≈5/10 |
| 东京 A | 2,221 | 53 | 22 | PASS | ≈5/10 |

Eric 点名的问题：鸟居不对称（横梁 1×8 在柱 10/14 上，左出 2 右出 1）；人仔无表情、头发像一团、草帽是碟；茶室是"看不出便利店还是寺庙"的灰盒子；樱花不难看但不好看、四棵一个模子；竹子"看不懂"；整体"中庸"。我的补充：塔的屋面是平板加一圈斜坡，檐角没有翘曲；只看过全景没看过特写；验收只有"能拼"。

---
## 7. 裁判机制（D13）怎么跑
1. 元件级：在小测试板上单独搭元件（可先用场景内特写代替），出正视/侧视/四分之三/特写/剪影（`tools/shot.mjs` 对准坐标）。
2. 调用裁判：`Agent` 工具，subagent_type `lego-judge`（若未加载则 general-purpose 并把 `judge/JUDGE.md` 内容贴进提示），给它简报路径 + 图片路径 + 输出路径。它不看代码。
3. 门禁：每维 ≥ 8，加权 ≥ 8.5。关键节点跑两个裁判取低分。
4. 修完再评，元件最多三轮；入库后才进场景；场景级再评一轮；发布前体验级（组装/拆解/重建定格）。
5. 20 国拉通：评分表统一，差异全在 `judge/briefs/<city>.md`。

---
## 8. 下一步（按顺序）
1. 把 round1 报告拿给 Eric 确认裁判员是否合格；按他意见修 JUDGE.md。
2. 元件回路：鸟居（对称、笠木反宇、贯与额束比例）、人仔（脸的印花几何、三种发型、锥形草帽、相机/伞道具、手臂姿势）、樱花（三种剪影、树干姿态、粉白渐变）、茶室（入母屋顶带翘檐、缘侧栏杆、障子节奏、门帘招牌）、塔檐（弧形斜坡做翘曲）。每个 ≤3 轮到 8 分。
3. 用新元件重搭京都，场景级评审到 8.5。
4. 写一页设计规范（形态 B、底板/尺度、色板规则、人仔规则、多样性规则），然后按规范做其余城市；A 的街区生成器在大都市型城市里嵌入 B 岛上使用。
5. 地球仪入口（v1 有真实海岸线实现，在 lego-world-claude/src/lib/globe.js + landmask.js，待移植）、20 枚图钉、飞入过渡、分享图、LDraw 导出、嵌入个人 OS。

---
## 9. 环境与外部服务的坑
- 截图：Playwright 1.63 装在 `tools/node_modules`，无头 Chromium 用 SwiftShader，物理比真机慢很多（截拆解图用模拟秒）。
- 图片生成（`flyer:image-gen` 技能 → flyer.opuslab.ai）在 Cloudflare Access 后：需要 Eric 先 `cloudflared access login https://flyer.opuslab.ai`（约 24 小时有效）；gen.sh 的 `--out` 下载是坏的，要自己 `curl -sSL -H "cf-access-token: $(cloudflared access token --app https://flyer.opuslab.ai)"` 跟随重定向下载。
- Rebrickable 网页拒绝抓取（403）；核零件号用 `curl https://library.ldraw.org/library/official/parts/<id>.dat | head -1`，请求间隔 0.4 秒。
- 参考作品：Micropolis 标准（TwinLUG）、LEGO Architecture Skyline 设计哲学（Brickset "Designing Skylines"、New Elementary 访谈）、Teddy「Tokyo · City Diorama Series」1,299 块、LEGO Icons 10315 静谧庭园、21060 姬路城、40725 樱花。
- 裁判第一轮引用的技法基线（改京都前先读）：10315 评测 https://www.newelementary.com/2023/07/lego-icons-review-10315-tranquil-garden.html （透明砖叠色做水深、SNOT 石组、印刷锦鲤砖）；21060 评测 https://www.newelementary.com/2023/09/lego-architecture-review-21060-himeji.html （铰链板 + 托架 + 弧形斜坡做反宇檐角、jumper 半格偏移）；40725 评测 https://brickset.com/article/104961/review-40725-cherry-blossoms （Technic 枝干骨架 + 1×1 花瓣圆片做立体树冠）。
- 裁判第一轮结论：加权 4.60/9，不过门禁；元件分：塔 7、鸟居 4、人仔 2、樱花 4、茶室 4、桥与池 3、构图 5；修复顺序：人仔与故事 → 桥与池 → 鸟居 → 地面语汇 → 樱花 → 茶室 → 塔（最后、小心）。裁判建议的新零件（1×12 板 60479、1×12 砖 6112、裙摆圆锥 14918、托盘 4523、雨伞 61482、扫帚 3836、四分之一圆板 27925、6×1 弧形斜坡 42022、铰链板 44302/44567、夹子件 60897）走按需入库，入库前逐个用 LDraw 核编号。

---
## 10. 交接后的第一句话（贴给新会话）
> 读 `HANDOFF.md` 和 `CLAUDE.md`。然后看 `docs/judge/round1/report.md`，用两句话告诉我裁判员的结论，问我是否认可裁判员，再开始元件回路。
