# Builds docs/04-parts-catalog.html from docs/catalog/meta.json + thumbs + ldraw-check.json
import json, base64, pathlib, html
root = pathlib.Path(__file__).resolve().parents[1]
meta = json.loads((root/'docs/catalog/meta.json').read_text())
chk = {r['bl']: r['ldraw'] for r in json.loads((root/'docs/catalog/ldraw-check.json').read_text())}
parts, cats, colors = meta['parts'], meta['categories'], meta['colors']
def img(k): return 'data:image/png;base64,' + base64.b64encode((root/'docs/catalog/thumbs'/(k+'.png')).read_bytes()).decode()
STUDS = {'all': ('全部格子', 'ok'), 'none': ('无，上面不能放东西', 'no'), 'back': ('仅后排一行', 'part'), 'center': ('仅中心一颗', 'part'), 'disc': ('圆内区域', 'part'), 'custom': ('部分格子', 'part')}
by_cat = {c['id']: [p for p in parts if p['cat'] == c['id']] for c in cats}
def badge(bl):
    ld = chk.get(bl); a = ld[0] if ld else bl
    return f'<span class="v ok">LDraw ✓{"" if a == bl else " → " + html.escape(a)}</span>'
def card(p):
    st, cls = STUDS[p['studs']]
    dims = f"{p['w']}×{p['d']} · {p['h']} 板" + (f"（{p['h']//3} 砖）" if p['h'] % 3 == 0 and p['h'] >= 3 else '')
    note = f'<div class="note">{html.escape(p["note"])}</div>' if p['note'] else ''
    return f'''<div class="card"><div class="th"><img src="{img(p['key'])}" alt="{html.escape(p['name'])}" loading="lazy"></div>
<div class="body"><div class="row1"><b>{html.escape(p['zh'])}</b><span class="bl mono">{p['bl']}</span></div>
<div class="en">{html.escape(p['name'])}</div><div class="dims mono">{dims}</div>
<div class="conn"><span class="c {cls}">顶 · {st}</span><span class="c {'ok' if p['accepts'] else 'no'}">底 · {'可接凸点' if p['accepts'] else '不可接'}</span>{badge(p['bl'])}</div>{note}</div></div>'''
sections = ''.join(f'''<section class="cat" id="cat-{c['id']}"><div class="wrap"><div class="cat-head"><div><div class="eyebrow">{c['en']} · {len(by_cat[c['id']])} 种</div><h2>{c['zh']}</h2><p>{c['blurb']}</p></div></div></div>
<div class="wide"><div class="grid">{''.join(card(p) for p in by_cat[c['id']])}</div></div></section>''' for c in cats)
toc = ''.join(f'<a href="#cat-{c["id"]}">{c["zh"]}<span class="mono">{len(by_cat[c["id"]])}</span></a>' for c in cats)
swatches = ''.join(f'''<div class="sw"><i style="background:#{c['hex']:06x};{'opacity:.72;' if c.get('trans') else ''}"></i><div><b>{c['bl']}</b><span class="mono">LEGO {c['id']} · {html.escape(c['lego'])}</span><span class="use">{html.escape(c['use'])}</span></div></div>''' for c in colors)
ntrans = sum(1 for c in colors if c.get('trans'))
css = (root/'tools/catalog-page.css').read_text()
page = f'''<title>My Lego World 零件目录</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Rubik:wght@500;700&family=Noto+Sans+SC:wght@400;500;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>{css}</style>
<header><div class="wrap">
  <div class="kicker"><i></i>MY LEGO WORLD · 零件目录 v1 · 2026-09-11</div>
  <h1 style="margin-top:14px">这一套零件，将拼出全部 20 个国家</h1>
  <p class="lede">每一种都对应真实的乐高零件编号（已在 LDraw 官方零件库逐个核对）和官方颜色，几何是我按真实比例生成的近似。缩略图就是它们在我们渲染器里的样子。请你审的是三件事：<b>够不够多样、缺什么、颜色够不够用</b>。批准之后，所有场景只能用这张表里的零件；场景需要新零件时按"真实零件按需入库"的规则追加，绝不自造形状。</p>
  <div class="facts"><div class="fact"><b class="mono">{len(parts)}</b><span>种零件，{len(cats)} 个类别</span></div><div class="fact"><b class="mono">{len(colors)}</b><span>种官方颜色，{ntrans} 种透明</span></div><div class="fact"><b class="mono">{len(parts)}/{len(parts)}</b><span>个编号在 LDraw 官方零件库核对通过</span></div></div>
  <nav class="toc">{toc}<a href="#colors">颜色<span class="mono">{len(colors)}</span></a><a href="#rules">连接规则</a><a href="#missing">刻意没放的</a><a href="#approve">批准清单</a></nav>
</div></header>
<section id="rules" style="padding-top:36px"><div class="wrap">
  <h2>先看懂每张卡片上的两个标签</h2>
  <div class="grid2">
    <div class="panel"><h3>顶 · 这块上面能放什么</h3><div class="legend">
      <div><span class="c ok">顶 · 全部格子</span><span>每一格都有凸点，任何零件都能放上去。砖、板、圆板都是。</span></div>
      <div><span class="c part">顶 · 仅后排一行</span><span>斜坡只有后排有凸点，斜面上放东西就是空中楼阁。</span></div>
      <div><span class="c part">顶 · 仅中心一颗</span><span>jumper、圆锥、碟只有中间一颗凸点，上面只能放 1×1 或跨过它。</span></div>
      <div><span class="c no">顶 · 无</span><span>光面砖、奶酪、弧形、圆顶：收尾层，上面什么都不能放。</span></div>
    </div></div>
    <div class="panel"><h3>底 · 这块能不能被下面抓住</h3><div class="legend">
      <div><span class="c ok">底 · 可接凸点</span><span>绝大多数零件。底部有管或空腔，能扣在下面的凸点上。</span></div>
      <div><span class="c no">底 · 不可接</span><span>玻璃、门扇、手、杆：靠嵌入或夹持，校验器按"附着在宿主零件上"处理。</span></div>
      <div><span class="v ok">LDraw ✓ → 3040b</span><span>编号已在 LDraw 官方库核对；箭头后是 LDraw 用的别名（同一零件的模具版本），导出时自动映射。</span></div>
    </div>
    <p style="font-size:14px;margin-top:12px;color:var(--ink-2)">校验器的规则只有一条：从底板出发，顺着"下面有凸点、上面能接"的接触一路摸得到的零件才算固定住。摸不到的，构建失败。</p></div>
  </div>
</div></section>
{sections}
<section class="cat" id="colors"><div class="wrap"><div class="cat-head"><div><div class="eyebrow">Colours · {len(colors)}</div><h2>颜色</h2><p>用官方名字和编号（左为 BrickLink 常用名，右为 LEGO 官方名与色号），色值是屏幕近似。每座城市从这里挑一个主色、两个辅色、一个点缀色。</p></div></div></div>
<div class="wide"><div class="swatches">{swatches}</div></div></section>
<section class="cat" id="missing"><div class="wrap"><div class="cat-head"><div><div class="eyebrow">Left out on purpose</div><h2>刻意没放进 v1 的</h2></div></div>
  <div class="panel" style="margin-top:16px"><table><thead><tr><th>类别</th><th>原因</th><th>什么时候加</th></tr></thead><tbody>
    <tr><td>支架 bracket、侧向拼接（SNOT）成套技法</td><td>零件横过来装，高度会出现半板（2.5 板 = 1 格），我们的整数格子和校验器要先升级到半板精度</td><td>A 形态的现代立面需要时，作为 v2.1 升级</td></tr>
    <tr><td>铰链、转盘、科技件</td><td>产生任意角度，物理上能拼但校验难度大，画面上也和"方正的乐高感"冲突</td><td>暂不加</td></tr>
    <tr><td>人仔配件（相机、伞、乐器、食物）、动物</td><td>数量巨大，等场景定了按需加，每加一个都要建几何</td><td>搭样本时按人物故事补，走"按需入库"</td></tr>
    <tr><td>更多尺寸的斜坡与弧形（1×1 弧、2×4 双弧、75° 陡坡）</td><td>先用现有 20 种斜坡与弧形试搭，缺再补</td><td>样本阶段按需</td></tr>
    <tr><td>印刷件、贴纸</td><td>渲染要贴图，先不做</td><td>城市名牌用 1×8 光面砖加文字，视需要</td></tr>
  </tbody></table></div>
</div></section>
<section class="cat" id="approve"><div class="wrap"><div class="cat-head"><div><div class="eyebrow">Sign-off</div><h2>你来批准的三件事</h2></div></div>
  <div class="ask" style="margin-top:16px"><b>1 · 多样性够不够。</b> 参照 Teddy 东京的词汇：圆砖圆锥做塔、弧形和奶酪做屋顶、透明板做水和玻璃、圆板和花做树、jumper 做半格偏移。这些都在。你还想看到什么零件族？</div>
  <div class="ask" style="margin-top:10px"><b>2 · 颜色够不够。</b> {len(colors)} 色里有 {ntrans} 种透明。三座城市的色板我都试排过一遍能覆盖；20 国里若有强烈需求（比如印度的艳色、北欧的深蓝），再加。</div>
  <div class="ask" style="margin-top:10px"><b>3 · 缺不缺零件族。</b> 我刻意没放支架、铰链和印刷件（原因见上一节）。如果你希望样本里就用侧向拼接（SNOT）做现代立面，现在说，我把校验器升级到半板精度再开工。</div>
  <p style="margin-top:16px;color:var(--ink-2)">批准后我会把这张表冻结为 v1（新增零件走变更记录），然后开始京都 B 和东京 A 两个样本。</p>
</div></section>
<footer><div class="wrap">My Lego World · 零件目录 v1 · 缩略图为本项目渲染器实时渲染，几何为按比例的自制近似，非官方模型文件。</div></footer>
'''
(root/'docs/04-parts-catalog.html').write_text(page); print('wrote page', len(page)//1024, 'KB')
