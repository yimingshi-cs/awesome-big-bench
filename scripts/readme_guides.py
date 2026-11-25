"""Render the English and Chinese GitHub reading guides from the same source rows."""
from html import escape
import json
from urllib.parse import quote


# These comparison sentences describe the source-table family, before the web
# directory resolves that family to individual editions with their own wording.
FAMILY_ZH = {
    'Dated contest problem, code or execution example': '带日期的竞赛题、代码或执行示例',
    'Program, repair, execution result or predicted output': '程序、修复方案、执行结果或预测输出',
    'Test-case success or answer matching, by subtask': '按子任务检查测试用例是否通过或答案是否匹配',
    'Pass rate under task-specific behavioral tests; v1.1 grades the submitted patch in a clean environment.': '按任务对应的行为测试计算通过率；v1.1 在干净环境中评定提交的补丁。',
    'A model’s results on the component evaluations for one index version': '模型在该版指数各项组成评测上的成绩',
    'One composite index score': '一项综合指数得分',
    'In v5.0.1, nine evaluations feed four categories weighted 25% each; normalization and within-category weights are version-specific.': 'v5.0.1 用九项评测计算四个分类得分，每类权重为 25%；归一化方式和类内权重随版本而异。',
}


# Both panels use the same source rows as the website. The smaller plate is
# recomposed, not a scaled-down desktop image with unreadably small labels.
FIGURE_STYLE = """<style>
svg{--paper:#f4f7ef;--ink:#163b32;--quiet:#47655c;--line:#c1cec3;--cell:#f0f2ef;--mint:#b4e6cc;--deep:#185e49;--panel:#123c32;--cream:#f7f8e8;--tag:#b5dac9;--bar:#66ae8d;--accent:#185e49}
@media(prefers-color-scheme:dark){svg{--paper:#1d302a;--ink:#edf5e9;--quiet:#c0d2c4;--line:#567166;--cell:#34403c;--mint:#376d56;--deep:#174637;--panel:#0e241e;--bar:#77c5a1;--accent:#b6f0c9}}
text{font-family:Arial,"PingFang SC","Microsoft YaHei",sans-serif;fill:var(--ink)}
.serif{font-family:Georgia,"Songti SC","Noto Serif CJK SC",serif}.quiet{fill:var(--quiet)}.cream{fill:var(--cream)}.tag{fill:var(--tag)}
</style>"""


class Plate:
    def __init__(self, width, height, title, desc):
        self.parts = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" role="img" aria-labelledby="title desc">',
                      f'<title id="title">{escape(title)}</title><desc id="desc">{escape(desc)}</desc>', FIGURE_STYLE]
        self.rect(.75, .75, width-1.5, height-1.5, 'paper', radius=14, stroke='line')

    def rect(self, x, y, w, h, color, radius=0, stroke=None):
        border = f' stroke="var(--{stroke})"' if stroke else ''
        self.parts.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{radius}" fill="var(--{color})"{border}/>')

    def text(self, x, y, value, size, style='', weight=400, anchor='start', tracking=0):
        self.parts.append(f'<text x="{x}" y="{y}" font-size="{size}" class="{style}" font-weight="{weight}" text-anchor="{anchor}" letter-spacing="{tracking}">{escape(value)}</text>')

    def line(self, x1, y1, x2, y2, color='line'):
        self.parts.append(f'<path d="M{x1},{y1} L{x2},{y2}" stroke="var(--{color})"/>')

    def finish(self):
        return '\n'.join([*self.parts, '</svg>', ''])


def masthead(payload, compact, zh):
    def t(en, cn):
        return cn if zh else en
    names = {(n['prefix'], n['suffix']): n for n in payload['names']}
    reported = payload['mapEvidence']['cells']
    rows = ('SWE', 'Agent') if compact else ('SWE', 'Agent', 'Robo')
    cols = ('Bench', 'Dojo') if compact else ('Bench', 'Eval', 'Dojo')
    plate = Plate(390 if compact else 1000, 362 if compact else 344,
                  t('From a name to an evaluation', '从名字查到评测'),
                  t('An excerpt from the name map next to the original SWE-bench protocol.', '命名表示例及原版 SWE-bench 的任务和评分方式。'))
    text = plate.text
    x = 16 if compact else 28
    text(x, 26 if compact else 36, t('01   /   NAME MAP', '01   /   命名表'), 14, 'quiet', 700, tracking=1.3)
    text(x, 61 if compact else 88, t('Is the name taken?', '这个名字有人用吗？'), 31 if compact else 43, 'serif', 500)
    gx, gy, cw, ch = (72, 94, 148, 37) if compact else (113, 139, 142, 45)
    for j, suffix in enumerate(cols):
        text(gx+(j+.5)*cw, gy-8, suffix, 16 if compact else 18, 'quiet', 600, 'middle')
    for i, prefix in enumerate(rows):
        y = gy+i*ch
        text(gx-11, y+ch/2+3, prefix, 15 if compact else 17, 'quiet', 600, 'end')
        for j, suffix in enumerate(cols):
            row = names[prefix, suffix]
            key = f'{prefix}|{suffix}'
            level = 'deep' if key in reported else 'mint' if row['status']=='used' else 'cell'
            bx, bw = gx+j*cw, cw-5
            plate.parts.append(f'<g data-cell="{key}" data-state="{level}">')
            plate.rect(bx, y, bw, ch-5, level, 4, 'line')
            # A solid diamond, a dot and an empty cell distinguish states without hue.
            symbol = {'deep': '◆', 'mint': '•', 'cell': '–'}[level]
            text(bx+9, y+ch/2+3, symbol, 15, 'cream' if level=='deep' else 'quiet', 600)
            text(bx+bw/2+5, y+ch/2+3, row['name'], 16 if compact else 17,
                 'cream' if level=='deep' else '', 600, 'middle')
            plate.parts.append('</g>')
    legend_y = 192 if compact else 313
    for lx, symbol, label in zip((x, 128, 247) if compact else (x, 195, 362),
                                  ('◆', '•', '–'),
                                  (t('In a report','报告有记录'), t('Evaluation','有同名评测'), t('No match','暂未找到'))):
        text(lx, legend_y, symbol+'  '+label, 15 if compact else 17, 'quiet', 600)

    # This is the original edition, not an assertion that every mapped release
    # used that edition; the report marker above belongs to the name cell.
    if compact:
        plate.rect(9, 211, 372, 142, 'panel', 9)
        text(22, 235, t('02   /   ORIGINAL EDITION', '02   /   原版评测'), 13, 'tag', 700, tracking=1.1)
        text(22, 271, 'SWE-bench', 33, 'serif cream')
        plate.line(22, 284, 366, 284, 'quiet')
        text(22, 311, t('Repository + issue  →  patch', '给定仓库和 issue，提交补丁'), 18, 'cream', 600)
        text(22, 337, t('Scored by issue-fixing and regression tests.', '评分：修复问题的测试和回归测试都要通过。'), 16, 'tag')
    else:
        plate.rect(567, 12, 421, 320, 'panel', 10)
        text(594, 45, t('02   /   ORIGINAL EDITION', '02   /   原版评测'), 14, 'tag', 700, tracking=1.3)
        text(592, 105, 'SWE-bench', 50, 'serif cream')
        plate.line(594, 125, 961, 125, 'quiet')
        for i,(label,value) in enumerate([
            (t('INPUT','输入'),t('Repository snapshot + GitHub issue','仓库快照和对应的 GitHub issue')),
            (t('OUTPUT','输出'),t('A patch to the repository','修复问题的补丁')),
            (t('SCORING','评分'),t('Issue-fixing + regression tests','修复问题的测试和回归测试都要通过')),
        ]):
            text(594, 150+i*59, label, 12, 'tag', 700, tracking=1.2)
            text(594, 175+i*59, value, 21, 'cream', 500)
    return plate.finish()


def jan_to_sep(months, year):
    rows = [m for m in months if m['month'].startswith(str(year)+'-') and m['month'][5:] <= '09']
    if {m['month'][5:] for m in rows}!={f'{n:02d}' for n in range(1,10)} or len(rows)!=9 or not all(m['complete'] for m in rows):
        raise ValueError(f'Incomplete January–September comparison in {year}')
    hits = sum(m['hits'] for m in rows)
    total = sum(m['total'] for m in rows)
    return hits, total, hits/total


def trend_plate(months, zh):
    years = range(2020,2027)
    rates = [jan_to_sep(months, y)[2] for y in years]
    title = 'arXiv 计算机论文中标题含 bench 的比例' if zh else 'Share of arXiv CS titles containing “bench”'
    period = '每年 1–9 月' if zh else 'January–September of each year'
    plate = Plate(590, 214, title, '; '.join(f'{y}: {v:.2%}' for y,v in zip(years,rates)))
    plate.text(19, 29, title, 20, weight=600)
    plate.text(19, 54, period, 17, 'quiet')
    plate.line(19, 173.5, 570, 173.5)
    for i,(year,rate) in enumerate(zip(years,rates)):
        x, height = 25+i*79, round(rate/max(rates)*96,1)
        plate.rect(x, 173-height, 54, height, 'accent' if year==2026 else 'bar', radius=2)
        plate.text(x+27, 163-height, f'{rate:.2%}', 18, weight=600, anchor='middle')
        plate.text(x+27, 199, str(year), 18, 'quiet', anchor='middle')
    return plate.finish()


def trend_excerpt(months, zh):
    h0,n0,s0=jan_to_sep(months,2020);h1,n1,s1=jan_to_sep(months,2026)
    first=min(m['month'] for m in months);last=max(months,key=lambda m:m['month'])
    interval=f"{first}–{last['month']}"
    if zh:
        return (f'只比两年相同的 1–9 月：2020 年，{n0:,} 篇 arXiv 计算机论文里有 {h0:,} 篇标题含 `bench`（**{s0:.2%}**）；'
                f'2026 年是 {n1:,} 篇中的 {h1:,} 篇（**{s1:.2%}**），占比约为原来的 **{s1/s0:.2f} 倍**。'
                f'整个数据集（{interval}，{"末月完整" if last["complete"] else "末月未满"}）共 {sum(m["hits"] for m in months):,} 个匹配的论文 ID。'
                '这里数的是标题，不是新评测：*benchmarking* 和 *workbench* 都算，HumanEval 这样的名字反而不会命中。[总览图](../figures/overview.png)。')
    return (f'In January–September 2020, {h0:,} of {n0:,} arXiv CS papers had `bench` in the title (**{s0:.2%}**). '
            f'In the same nine months of 2026, it was {h1:,} of {n1:,} (**{s1:.2%}**): a **{s1/s0:.2f}×** increase in share. '
            f'The {interval} collection ({"complete" if last["complete"] else "partial"} final month) contains {sum(m["hits"] for m in months):,} matching paper IDs. '
            'This counts titles, not new benchmarks: *benchmarking* and *workbench* qualify; *HumanEval* does not. [Overview chart](../figures/overview.png).')


def render_readmes(root, payload, cat_rows, _mark, md, link):
    translations={**FAMILY_ZH, **json.loads((root/'web/locale/zh-catalog.json').read_text())}
    labels=json.loads((root/'web/locale/ui.zh.json').read_text())
    outputs={}
    counts={'COMBINATIONS':len(payload['names']),'TAKEN':sum(n['status']=='used' for n in payload['names']),
            'COUNT':len(cat_rows),'FEATURED':len(payload['featured']),'DIRECTORY_COUNT':len(payload['catalog'])}
    for zh in (False, True):
        site='https://yiming-shi.com/awesome-big-bench/'+('zh/' if zh else '')
        sections=[]
        field_links=[]
        suffix='.zh-CN' if zh else ''
        outputs[f'docs/masthead{suffix}.svg'] = masthead(payload,False,zh)
        outputs[f'docs/masthead-compact{suffix}.svg'] = masthead(payload,True,zh)
        outputs[f'docs/masthead-trend{suffix}.svg'] = trend_plate(payload['months'],zh)
        for domain in payload['domains']:
            records=[r for r in cat_rows if r['domain']==domain]
            label=labels[domain] if zh else domain
            anchor='domain-'+domain.lower().split()[0].replace('autoresearch','ai-research')
            old_heading=domain.lower().replace(' & ', '--').replace(' ', '-')
            aliases=f'<a name="{anchor}"></a><a name="{old_heading}"></a>'
            field_links.append(f'- {aliases}[{label}](guide/benchmarks{suffix}.md#{anchor})')
            sections.extend([aliases,f'### {label} · {len(records)}','',
                             '| 评测 · 原始来源 | 输入 | 模型要给出什么 | 评分方法 · 依据 |' if zh else '| Benchmark · original source | Input | Expected output | Scoring · protocol |',
                             '|---|---|---|---|'])
            for r in records:
                a,b,c=(translations[r[k]] if zh else r[k] for k in ('input','output','assessment'))
                sections.append(f"| {link(r['name'],r['primary_url'])} | {md(a)} | {md(b)} | {link(c,r['protocol_url'])} |")
            full='打开本领域完整目录' if zh else 'Browse all entries in this field'
            sections.extend(['',f'[{full}]({site}#browse?domain={quote(domain,safe="")}&scope=all)',''])
        substitutions={**counts,'CATALOG':'\n'.join(sections).rstrip(),'FIELD_LINKS':'\n'.join(field_links),
                       'SITE':site,'OFFLINE':'https://yiming-shi.com/awesome-big-bench/offline/awesome-big-bench',
                       'TREND':trend_excerpt(payload['months'],zh)}
        for template, dest in [('readme','README'),('readme-benchmarks','guide/benchmarks'),('readme-sources','guide/sources')]:
            body=(root/'web'/f'{template}{suffix}.md').read_text()
            for key,value in substitutions.items():
                body=body.replace('@@'+key+'@@',str(value))
            if '@@' in body:raise ValueError(f'Unresolved variable in {template}{suffix}')
            outputs[f'{dest}{suffix}.md']=body
    return outputs
