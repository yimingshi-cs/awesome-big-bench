"""Build the GitHub reading guide and portable (no network required) web edition."""
import argparse
import base64
from collections import defaultdict
from itertools import product
from flagship_reports import history_overview, reports
from historical_evidence import index_reports
from urllib.parse import quote
import csv
import json
import re
import sys
from pathlib import Path
from urllib.parse import urlsplit
from datetime import date

ROOT = Path(__file__).resolve().parents[1]
REPO = "https://github.com/yimingshi-cs/awesome-big-bench"
DOMAINS = ["Coding", "CUA", "Reasoning", "Multimodal", "Embodied", "Safety",
           "Long-context & Memory", "AutoResearch", "RSI", "General"]
LABEL = {}
STATES = {"used": "Same-name AI benchmark", "no_match": "No exact match found"}


def read_csv(file):
    with (ROOT / 'data' / file).open(encoding="utf-8-sig", newline="") as f:
        rows = list(csv.DictReader(f))
        if any(None in r or None in r.values() for r in rows):
            raise ValueError('CSV field count differs from header: '+file)
        return rows


def unique(rows, key):
    result = {key(r): r for r in rows}
    if len(result) != len(rows):
        raise ValueError("Duplicate keys: " + str(key))
    return result


def check_url(value):
    if not value:
        return
    u = urlsplit(value)
    if u.scheme not in {"https", "http"} or not u.netloc:
        raise ValueError("Invalid public source URL: " + value)


def md(s):
    return re.sub(r'([\\|\[\]<>])', r'\\\1', s.replace('\n', ' '))


def link(s, url):
    # Angle-bracket destinations handle legal parentheses in source URLs.
    return f"[{md(s)}](<{url.replace('>', '%3E')}>)"


def render():
    cat = unique(read_csv("famous.csv"), lambda x: x['slug'])
    tasks = unique(read_csv("catalog_tasks.csv"), lambda x: x['slug'])
    if cat.keys() != tasks.keys():
        raise ValueError("Task metadata and catalog slugs differ: "+str(cat.keys() ^ tasks.keys()))
    for slug, x in cat.items():
        if x['status'] != 'verified' or x['domain'] not in DOMAINS or not x['date_source_url']:
            raise ValueError(slug)
        date.fromisoformat(x['date'])
        for k in ('date_source_url', 'affil_source_url', 'logo_source_url'):
            check_url(x[k])
        if x['logo_file']:
            raise ValueError('Use an original-source link; third-party images are not bundled.')
        x.update(tasks[slug])
        if not x.get('primary_url'):
            raise ValueError('Missing project/paper URL: '+slug)
        check_url(x['primary_url'])
        check_url(x['protocol_url'])
        if not all(x.get(k) for k in ('task','description','input','output','assessment','protocol_url')):
            raise ValueError('Missing task: '+slug)

    names = read_csv('names.csv')
    groups = json.loads((ROOT/'data/name_groups.json').read_text())
    for group_key, col in [('fields', 'prefix'), ('endings', 'suffix')]:
        values = [v for members in groups[group_key].values() for v in members]
        unknown = {n[col] for n in names} - set(values)
        if unknown or len(values) != len(set(values)):
            raise ValueError(f'Unassigned or repeated name taxonomy items: {col} {unknown}')
    matrix = unique(names, lambda x: (x['prefix'], x['suffix']))
    prefixes = [p for group in groups['fields'].values() for p in group]
    endings = [e for group in groups['endings'].values() for e in group]
    expected = set(product(prefixes, endings))
    if set(matrix) != expected:
        raise ValueError('A public map needs dated evidence for every prefix × ending')
    with (ROOT/'verification/names/matrix-searches.csv').open(encoding='utf-8',newline='') as f:
        receipts = defaultdict(list)
        for rec in csv.DictReader(f):
            key = rec['prefix'], rec['suffix']
            check_url(rec['query_url'])
            date.fromisoformat(rec['checked_on'])
            if not rec['index'] or not rec['result'] or not rec['query_url']:
                raise ValueError(f'Empty search receipt: {key}')
            receipts[key].append(rec)
    if set(receipts) != expected:
        raise ValueError('Search receipt coverage differs from the matrix')
    for x in names:
        if x['status'] not in STATES or not x['name']:
            raise ValueError(str(x))
        for k in ['source_url','search_url']:
            check_url(x[k])
        if x['status'] == 'used' and not x['source_url']:
            raise ValueError('Missing positive evidence: '+x['name'])
        date.fromisoformat(x['checked_on'])
        if not x['search_url']:
            raise ValueError('Missing search evidence: '+x['name'])

    monthly = read_csv('monthly.csv')
    splits = unique(read_csv('monthly_by_domain.csv'), lambda r: r['month'])
    months = []
    for r in monthly:
        m = r['month']
        counts = {k: int(v) for k,v in splits[m].items() if k not in ('month','total')}
        months.append(dict(month=m, hits=int(r['bench_cs_all']), total=int(r['cs_all']),
                           complete=r['complete']=='yes', counts=counts))
    cat_rows = sorted(cat.values(),key=lambda x:(DOMAINS.index(x['domain']),x['date'],x['name']))
    parts = []
    jumps = []
    for dom in DOMAINS:
        rows = [x for x in cat_rows if x['domain']==dom]
        anchor = 'domain-'+dom.lower().split()[0].replace('autoresearch','ai-research')
        jumps.append(f"[{LABEL.get(dom,dom)}](#{anchor})")
        parts.extend([f'<a id="{anchor}"></a>',f"### {LABEL.get(dom,dom)}","",
                      "| Benchmark · primary source | Given | Must produce | Judged by · protocol |","|---|---|---|---|"])
        for x in rows:
            parts.append(f"| {link(x['name'],x['primary_url'])} | {md(x['input'])} | {md(x['output'])} | {link(x['assessment'],x['protocol_url'])} |")
        if not rows:
            parts.append("| — | No entry selected yet. [Suggest one](CONTRIBUTING.md). | — | — |")
        parts.append('')
    sample = ['| Field | No exact benchmark found |', '|---|---|']
    for domain, members in groups['fields'].items():
        checked = [n for n in names if n['status']=='no_match' and
                   groups['exceptions'].get(n['prefix']+'|'+n['suffix'],domain if n['prefix'] in members else '')==domain]
        if checked:
            sample.append('| '+domain+' | '+', '.join(link(n['name'],n['search_url']) for n in checked[:2])+' |')
    trend = (ROOT/'web/trend-note.md').read_text().strip()
    readme=(ROOT/'web/readme.md').read_text()
    for k,v in [('COUNT',str(len(cat))),('JUMP',' · '.join(jumps)),('CATALOG','\n'.join(parts).strip()),('GRID','\n'.join(sample)),('TREND',trend)]:
        readme=readme.replace('@@'+k+'@@',v)
    # No remote fetches, fonts or trackers, so the downloaded file also works via file://.
    fields=['name','slug','date','date_source_url','first_author_affil','affil_source_url','domain',
            'logo_source_url','task','description','primary_url','input','output','assessment','protocol_url']
    landmarks = json.loads((ROOT/'data/field_landmarks.json').read_text())
    for group, slugs in landmarks.items():
        if group not in groups['fields'] or not set(slugs) <= cat.keys():
            raise ValueError('Unresolved field landmark: '+group)
    # A project already represented by a cell belongs in its detail, not in a field header too.
    def identity(name):
        return name.casefold().replace("’", "'")
    by_name = {identity(x['name']): x['slug'] for x in cat_rows}
    catalog_cells = {"|".join(pair): by_name[identity(x['name'])]
                     for pair, x in matrix.items() if x['status']=='used' and identity(x['name']) in by_name}
    for pair, slug in groups['catalogVersions'].items():
        if slug not in cat or matrix[tuple(pair.split('|'))]['status'] != 'used':
            raise ValueError('Invalid catalog version link: '+pair)
        catalog_cells[pair] = slug
    duplicated = set(catalog_cells.values()) & {s for ids in landmarks.values() for s in ids}
    if duplicated:
        raise ValueError('A field landmark repeats a name cell: '+str(duplicated))
    releases = read_csv('flagship_evaluations.csv')
    for r in releases:
        if not all(r.get(k) for k in ('vendor','release','generation','date','benchmark','family','tier','location','release_url','protocol_url')):
            raise ValueError('Flagship result is missing attribution')
        if r['tier'] not in ('headline','extended') or r['generation'] not in ('current','previous'):
            raise ValueError('Bad release scope')
        date.fromisoformat(r['date'])
        check_url(r['release_url']); check_url(r['protocol_url'])
    observed = {(r['vendor'], r['generation']) for r in releases}
    if observed != set(product(('OpenAI','Anthropic','Google'),('current','previous'))):
        raise ValueError('Expected two generations per vendor')
    matches = json.loads((ROOT/'data/map_report_matches.json').read_text())
    history = read_csv('flagship_history.csv')
    for r in history:
        if r['vendor'] not in ('OpenAI','Anthropic','Google') or not all(r.get(k) for k in ('release','benchmark','family','location','source_url')):
            raise ValueError('History needs a focal model, named evaluation and report location')
        date.fromisoformat(r['date']); check_url(r['source_url'])
        r['release_url'] = r['source_url']
    aliases = json.loads((ROOT/'data/release_family_aliases.json').read_text())
    evidence, coverage_csv, editions_csv = index_reports([*releases,*history], matches, matrix, landmarks, cat, aliases)
    payload = dict(repo=REPO,domains=DOMAINS,nameGroups=groups,fieldLandmarks=landmarks,mapEvidence=evidence,mapCatalog=catalog_cells,catalog=[{k:x[k] for k in fields} for x in cat_rows],names=names,months=months)
    scripts = ('app.js','directory.js','names.js','trends.js','route.js')
    app = '\n'.join((ROOT/'web'/name).read_text() for name in scripts)
    html = (ROOT/'web/page.html').read_text().replace('/* STYLE */',(ROOT/'web/style.css').read_text()).replace('/* APP */',app)
    mark=(ROOT/'docs/bench-mark.svg').read_text().strip()
    mark_uri='data:image/svg+xml,'+quote(mark,safe='')
    font=base64.b64encode((ROOT/'web/assets/manrope-latin.woff2').read_bytes()).decode('ascii')
    font_license=(ROOT/'web/assets/Manrope-OFL.txt').read_text()
    html=html.replace('/* MARK */',mark).replace('/* MARK_URI */',mark_uri).replace('/* FONT */',font)
    html=html.replace('</head>','<!-- Bundled font notice:\n'+font_license.replace('--','—')+'\n-->\n</head>')
    html = html.replace('/* DATA */',json.dumps(payload,ensure_ascii=False,separators=(',',':')).replace('<','\\u003c'))
    masthead = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 136" role="img" aria-label="Awesome Big Bench">'
                '<rect width="960" height="136" rx="10" fill="#e9f8f2"/>'
                +mark.replace('<svg ', '<svg x="28" y="24" width="88" height="88" ',1)
                +'<text x="140" y="91" font-family="Georgia,serif" font-size="62" letter-spacing="-3" fill="#192522">Awesome Big Bench</text></svg>\n')
    outputs={'README.md':readme, 'docs/index.html':html, 'docs/masthead.svg':masthead}
    def slug(v):
        return 'squared' if v=='²' else re.sub(r'[^a-z0-9]+','-',v.lower()).strip('-')
    for prefix in prefixes:
        lines=[f'# {prefix}: name checks','','[Full search receipts](../names/matrix-searches.csv) · [Criteria](../names.md)','']
        for suffix in endings:
            x=matrix[prefix,suffix]
            lines.extend([f'<a name="{slug(suffix)}"></a>',f"## {md(x['name'])}",'',
                          f"**{STATES[x['status']]}** · {x['checked_on']}",'',x['note'],''])
            if x['source_url']:
                lines.extend([link('Primary source' if x['status']=='used' else 'Related source (not a match)',x['source_url']),''])
            links=[];seen=set()
            for rec in receipts[prefix,suffix]:
                label=rec['index']
                if label.lower().startswith(('primary ', 'excluded ', 'additional primary')):continue
                if label in seen:continue
                seen.add(label)
                links.append(link(label,rec['query_url']))
            lines.extend(['Queries: '+' · '.join(links),''])
        outputs['verification/matrix/'+slug(prefix)+'.md']='\n'.join(lines)
    outputs.update(reports(releases))
    outputs['verification/flagships/history/README.md'] = history_overview(history, releases, evidence)
    outputs['verification/flagships/site-coverage.csv'] = coverage_csv
    outputs['verification/flagships/site-editions.csv'] = editions_csv
    return outputs


if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check',action='store_true',help='Fail on stale generated files, without writing them.')
    args=parser.parse_args()
    stale=[]
    for path,text in render().items():
        dest=ROOT/path
        if args.check:
            if not dest.exists() or dest.read_text()!=text: stale.append(path)
        else:
            dest.parent.mkdir(parents=True,exist_ok=True)
            dest.write_text(text,encoding='utf-8')
    if stale: sys.exit('Regenerate with python3 scripts/build_guide.py: '+', '.join(stale))
