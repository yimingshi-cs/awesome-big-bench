"""Render companion tables from the same release rows used by the website."""
import csv
from collections import defaultdict
from itertools import chain
from io import StringIO

LABS = {'OpenAI':'openai', 'Anthropic':'anthropic', 'Google':'google'}
GENERATIONS = ('previous','current')


def map_evidence(matches, records, matrix, landmarks):
    """Project only reviewed identities; related variants do not claim each other's name."""
    result = {"cells": {}, "landmarks": {}, "reports": {}}
    known_landmarks = set(chain.from_iterable(landmarks.values()))
    for m in matches:
        family, variant = m["family"], m.get("variant")
        key = family + (": " + variant if variant else "")
        picked = [r for r in records if r["family"] == family and
                  (not variant or r["benchmark"] == variant)]
        if not picked or key in result["reports"]:
            raise ValueError(f"Missing or duplicate map evidence: {key}")
        keep = ("vendor", "release", "date", "benchmark", "release_url", "location")
        result["reports"][key] = [{k: r[k] for k in keep} for r in picked]
        if "cell" in m:
            pair = tuple(m["cell"])
            if matrix.get(pair, {}).get("status") != "used":
                raise ValueError(f"Release evidence cannot occupy a cell: {pair}")
            target = "|".join(pair)
            if target in result["cells"]:
                raise ValueError(f"Duplicate map match: {target}")
            result["cells"][target] = key
        if "landmark" in m:
            slug = m["landmark"]
            if slug not in known_landmarks or slug in result["landmarks"]:
                raise ValueError(f"Unknown or duplicate landmark: {slug}")
            result["landmarks"][slug] = key
        if not ("cell" in m or "landmark" in m):
            raise ValueError(f"Unplaced map evidence: {key}")
    return result


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
       '[Homepage name map](https://yiming-shi.com/awesome-big-bench/) · [Complete CSV](../../data/flagship_evaluations.csv) · [Family comparison](families.csv)', '',
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
