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


def masthead(payload, mark, compact):
    """A small *real* section of the map, not a decorative/fictitious heatmap."""
    rows, cols = ('SWE', 'Game', 'Harness'), ('Bench', 'Dojo', 'Exam')
    names = {(n['prefix'], n['suffix']): n for n in payload['names']}
    reported = payload['mapEvidence']['cells']
    w, h = (440, 223) if compact else (900, 218)
    grid_x, grid_y, cw, ch = (84, 90, 112, 38) if compact else (438, 47, 146, 47)
    ink = '#183930'
    svg = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" role="img" aria-labelledby="title desc">',
           '<title id="title">Awesome Big Bench</title>',
           '<desc id="desc">A sample of the benchmark name map: the SWE, Game and Harness rows, and the Bench, Dojo and Exam endings.</desc>',
           f'<rect width="{w}" height="{h}" rx="14" fill="#eef8f3"/>']
    def txt(x, y, text, size, *, family='Arial, sans-serif', fill=ink, anchor='start', weight=500, extra=''):
        svg.append(f'<text x="{x}" y="{y}" font-family="{family}" font-size="{size}" font-weight="{weight}" text-anchor="{anchor}" fill="{fill}" {extra}>{escape(text)}</text>')
    if compact:
        svg.append(mark.replace('<svg ', '<svg x="14" y="14" width="34" height="34" ',1))
        txt(59,42,'Awesome Big Bench',33,family='Georgia, serif',weight=600,extra='letter-spacing="-1.7"')
        svg.append('<path d="M15 60H425" fill="none" stroke="#cadfd4"/>')
    else:
        svg.append(mark.replace('<svg ', '<svg x="30" y="19" width="36" height="36" ',1))
        txt(27,114,'Awesome',65,family='Georgia, serif',extra='letter-spacing="-3.8"')
        txt(27,183,'Big',69,family='Georgia, serif',extra='letter-spacing="-3.8"')
        txt(138,183,'Bench',69,family='Georgia, serif',extra='font-style="italic" letter-spacing="-3.8"',fill='#12694e')
        svg.append('<path d="M336 20V198" fill="none" stroke="#cadecf"/>')
    for j, col in enumerate(cols):
        txt(grid_x+(j+.5)*cw-2, grid_y-10, col, 14 if compact else 16, anchor='middle', weight=600)
    for i, pref in enumerate(rows):
        y=grid_y+ch*i
        txt(grid_x-10, y+ch/2+3, pref, 14 if compact else 16, anchor='end', weight=600)
        for j, col in enumerate(cols):
            n = names[pref, col]
            bright = f'{pref}|{col}' in reported
            fill, stroke = ('#17664f', '#17664f') if bright else (('#a8e3ce','#90cfb7') if n['status']=='used' else ('#f7f9f7','#c8d3cc'))
            x=grid_x+cw*j
            svg.append(f'<rect x="{x}" y="{y}" width="{cw-5}" height="{ch-5}" rx="5" fill="{fill}" stroke="{stroke}"/>')
            txt(x+(cw-5)/2, y+ch/2+3, n['name'], 14 if compact else 17, anchor='middle', weight=600, fill='#ffffff' if bright else ink)
    return '\n'.join([*svg,'</svg>',''])


def trend_excerpt(months, zh):
    def period(year):
        rows=[m for m in months if m['month'].startswith(year+'-') and 1 <= int(m['month'][5:7]) <= 9]
        if len(rows)!=9 or not all(m['complete'] for m in rows):
            raise ValueError(f"Incomplete January–September comparison in {year}")
        hits=sum(m['hits'] for m in rows);total=sum(m['total'] for m in rows)
        return hits, total, hits/total
    h0,n0,s0=period('2020');h1,n1,s1=period('2026')
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


def render_readmes(root, payload, cat_rows, mark, md, link):
    translations={**FAMILY_ZH, **json.loads((root/'web/locale/zh-catalog.json').read_text())}
    labels=json.loads((root/'web/locale/ui.zh.json').read_text())
    outputs={'docs/masthead.svg':masthead(payload,mark,False),
             'docs/masthead-compact.svg':masthead(payload,mark,True)}
    counts={'COMBINATIONS':len(payload['names']),'TAKEN':sum(n['status']=='used' for n in payload['names']),
            'COUNT':len(cat_rows),'FEATURED':len(payload['featured']),'DIRECTORY_COUNT':len(payload['catalog'])}
    for zh in (False, True):
        site='https://yiming-shi.com/awesome-big-bench/'+('zh/' if zh else '')
        sections=[]
        field_links=[]
        suffix='.zh-CN' if zh else ''
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
