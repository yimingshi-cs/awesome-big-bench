"""Build the GitHub reading guide and portable (no network required) web edition."""
import argparse
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
STATES = {"used": "Documented use", "near": "Related use", "no_match": "No match in checked sources",
          "partial": "Incomplete search", "unchecked": "Not checked"}


def read_csv(file):
    with (ROOT / 'data' / file).open(encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


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
    for x in names:
        if x['status'] not in STATES or not x['name']:
            raise ValueError(str(x))
        for k in ['source_url','search_url']:
            check_url(x[k])
        if x['status'] in ('used','near') and not x['source_url']:
            raise ValueError('Missing positive evidence: '+x['name'])
        if x['status'] != 'unchecked':
            date.fromisoformat(x['checked_on'])
        if x['status'] in ('partial','no_match') and not x['search_url']:
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
    for domain, prefixes in groups['fields'].items():
        checked = [n for n in names if n['status']=='no_match' and
                   groups['exceptions'].get(n['prefix']+'|'+n['suffix'],domain if n['prefix'] in prefixes else '')==domain]
        if checked:
            sample.append('| '+domain+' | '+', '.join(link(n['name'],n['search_url']) for n in checked)+' |')
    trend = (ROOT/'web/trend-note.md').read_text().strip()
    readme=(ROOT/'web/readme.md').read_text()
    for k,v in [('COUNT',str(len(cat))),('JUMP',' · '.join(jumps)),('CATALOG','\n'.join(parts).strip()),('GRID','\n'.join(sample)),('TREND',trend)]:
        readme=readme.replace('@@'+k+'@@',v)
    # No remote fetches, fonts or trackers, so the downloaded file also works via file://.
    fields=['name','slug','date','date_source_url','first_author_affil','affil_source_url','domain',
            'logo_source_url','task','description','primary_url','input','output','assessment','protocol_url']
    payload = dict(repo=REPO,domains=DOMAINS,nameGroups=groups,catalog=[{k:x[k] for k in fields} for x in cat_rows],names=names,months=months)
    scripts = ('app.js','directory.js','names.js','trends.js','route.js')
    app = '\n'.join((ROOT/'web'/name).read_text() for name in scripts)
    html = (ROOT/'web/page.html').read_text().replace('/* STYLE */',(ROOT/'web/style.css').read_text()).replace('/* APP */',app)
    html = html.replace('/* DATA */',json.dumps(payload,ensure_ascii=False,separators=(',',':')).replace('<','\\u003c'))
    return {'README.md':readme, 'docs/index.html':html}


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
