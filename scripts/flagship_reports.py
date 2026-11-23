"""Render companion tables from the same release rows used by the website."""
import csv
from collections import defaultdict
from io import StringIO

LABS = {'OpenAI':'openai', 'Anthropic':'anthropic', 'Google':'google'}
GENERATIONS = ('previous','current')


def reports(records):
    groups = defaultdict(list)
    for row in records:
        groups[row['vendor'],row['generation']].append(row)
    fams = sorted({r['family'] for r in records},key=str.casefold)
    buf = StringIO(newline='')
    writer = csv.writer(buf, lineterminator='\n')
    writer.writerow(['family', *(f'{v}_{g}' for v in LABS for g in GENERATIONS)])
    cells = {(r['family'],v,g):set() for (v,g),rows in groups.items() for r in rows}
    for r in records:
        cells[r['family'],r['vendor'],r['generation']].add(r['tier'])
    for f in fams:
        def value(lab,gen):
            tiers=cells.get((f,lab,gen),set())
            return 'headline' if 'headline' in tiers else 'extended' if tiers else ''
        writer.writerow([f, *(value(v,g) for v in LABS for g in GENERATIONS)])
    s=['# Which benchmarks did the flagship releases report?', '',
       'Publicly defined tests reported in six focal releases through **22 November 2026**. A row records a release and evaluation configuration, not necessarily an independent benchmark. Scores are not compared across non-equivalent protocols.', '',
       '[Homepage name map](https://yiming-shi.com/awesome-big-bench/) · [Two-release CSV](../../data/flagship_evaluations.csv) · [Family comparison](families.csv)', '',
       'Earlier general-purpose and reasoning-model releases: [historical sources and limits](history/README.md) · [release records](../../data/flagship_history.csv) · [curation gaps](site-coverage.csv) · [complete web directory](directory-coverage.csv) · [exact labels vs. related editions](site-editions.csv). The homepage uses both inventories; the comparison below is deliberately limited to the two focal releases per lab.', '',
       '| Lab | Release | First release | Headline records | All public records | Distinct families |',
       '|---|---|---|---:|---:|---:|']
    for lab in LABS:
        for gen in reversed(GENERATIONS):
            rows=groups[lab,gen];head=sum(r['tier']=='headline' for r in rows)
            s.append(f"| {lab} | {rows[0]['release']} | {rows[0]['date']} | {head} | {len(rows)} | {len({r['family'] for r in rows})} |")
    s+=['','## What recurred?', '',
        '| Lab | Highlight families in both | Families in both full inventories | Examples in both publications |','|---|---:|---:|---|']
    for v in LABS:
        overlap=lambda pred: sorted({r['family'] for r in groups[v,'previous'] if pred(r)} & {r['family'] for r in groups[v,'current'] if pred(r)},key=str.casefold)
        hi=overlap(lambda r:r['tier']=='headline'); all_=overlap(lambda r:True)
        s.append(f"| {v} | {len(hi)} | {len(all_)} | {', '.join(hi[:6]) or 'No shared launch-highlight family'} |")
    s+=['','“Latest only” means **reported only in the newer of these documents**, not newly created. A family can recur with different versions, subsets, graders or model configurations. Each row links the reported result and the underlying protocol. Comparator names are not treated as new focal releases.', '',
        'One report per lab documents release selection, sources inspected and exclusions: [OpenAI](openai.md) · [Anthropic](anthropic.md) · [Google](google.md). Explicitly internal versions and name-only mentions are excluded. Public protocols may have held-out questions or gated participation.', '',
        '**Family normalization:** source_family preserves the source review’s grouping. The shared index reconciles AA Intelligence Index, Terminal-Bench-Science, No-CoT Reasoning Index, and capitalization of AAV capsid packaging prediction. SEC-bench Pro is not the original suite. Harvey’s own LAB and LAB-AA are separate administrations. Components of an index are not inferred unless results for the focal model were separately documented.','']
    for lab,file in LABS.items():
        s.extend([f'## {lab}','',f'[Sources and coverage]({file}.md)',''])
        for gen in GENERATIONS:
            rows=groups[lab,gen];s.extend([f"### {rows[0]['release']} · {rows[0]['date']}",'','Launch highlights:',''])
            for r in rows:
                if r['tier']=='headline':
                    s.append(f"- [{r['benchmark']}](<{r['protocol_url']}>) — {r['qualifier']} [Release evidence](<{r['release_url']}>).")
            s.append('')
    return {'verification/flagships/README.md':'\n'.join(s),'verification/flagships/families.csv':buf.getvalue()}


def history_overview(history, focal, evidence):
    """Keep published coverage counts in sync with the historical receipts."""
    page=['# Historical release evidence','',
          'Which public benchmarks appear in general-purpose flagship and reasoning-model publications? '
          'This extends the [two-release comparison](../README.md) back to the early GPT, Claude and Gemini lines. '
          'Mini, Flash/Lite, Haiku and specialist coding models are not independent focal releases. '
          'Named major updates and reasoning modes can be separate entries; two variants in a joint report are not necessarily two launches.','',
          '[Historical inventory](../../../data/flagship_history.csv) · [Six focal releases](../../../data/flagship_evaluations.csv) · '
          '[Family gaps](../site-coverage.csv) · [Exact labels and editions](../site-editions.csv)','',
          '| Lab and evidence | Historical release entries with a public result | Historical records | Recent focal records |',
          '|---|---:|---:|---:|']
    for v,slug in LABS.items():
        rows=[r for r in history if r['vendor']==v];n=len({r['release'] for r in rows})
        page.append(f"| [{v}]({slug}.md) | {n} | {len(rows)} | {sum(r['vendor']==v for r in focal)} |")
    page+=['','One historical row identifies a model release, a named evaluation or documented configuration, and its location in a first-party source. '
           'The historical survey and the six focal releases are disjoint. Row counts are not counts of unique benchmarks. '
           'The per-lab notes list the releases, sources and coverage limits, including early releases without an eligible result.','',
           '## Reading the homepage','',
           f"The name map highlights **{len(evidence['cells'])} combinations** and **{len(evidence['landmarks'])} additional field references** with release evidence. "
           'A darker name means that a reviewed release reports a result on that benchmark or a named edition; the underlying score, task set and grader are not inferred to be identical. '
           'Open the item to see the exact label, model and linked report. A lighter taken name is still a real AI benchmark.','',
           'A partner result explicitly reported by the focal lab is attributed to the assessor where identified; a benchmark owner independently testing a model is not enough. '
           'A private runner is not automatically a private test set. A disguised private fork, an unavailable result, an illustrative mention, or another model’s comparison column does not qualify.','',
           '## What is missing?','',
           'Use **not listed** in the [family table](../site-coverage.csv) to find a reported family with no baseline curated-task or name-map match. '
           'All audited families now have a [complete web-directory reference](../directory-coverage.csv); the older comparison tables still measure baseline editorial coverage. '
           'The [edition table](../site-editions.csv) distinguishes an exact name from a related family or a different reported edition. '
           'For example, GDPval-AA is not GDPval, ARC-AGI-3 is not ARC-AGI-2, and Terminal-Bench-Science is not Terminal-Bench 4.0. '
           'Repetition in model reports is a useful lead, not a ranking or an automatic reason to create a new row or column.','']
    return '\n'.join(page)
