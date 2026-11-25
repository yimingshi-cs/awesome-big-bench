"""Build the GitHub reading guide and portable (no network required) web edition."""
import argparse
import base64
from collections import defaultdict
from itertools import product
from flagship_reports import history_overview, reports
from historical_evidence import index_reports, norm
from directory_catalog import assemble_directory
from site_locale import editions
from readme_guides import render_readmes
import io
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
    agent_prompt=(ROOT/'contribute/agent-prompt.txt').read_text(encoding='utf-8').strip()
    # No remote fetches, fonts or trackers, so the downloaded file also works via file://.
    fields=['name','slug','date','date_source_url','first_author_affil','affil_source_url','domain',
            'logo_source_url','task','description','primary_url','input','output','assessment','protocol_url']
    landmarks = json.loads((ROOT/'data/field_landmarks.json').read_text())
    placed = [slug for slugs in landmarks.values() for slug in slugs]
    if len(placed) != len(set(placed)):
        raise ValueError('A project repeats in homepage field headers')
    for group, slugs in landmarks.items():
        if group not in groups['fields'] or not set(slugs) <= cat.keys():
            raise ValueError('Unresolved field landmark: '+group)
    # A project already represented by a cell belongs in its detail, not in a field header too.
    def identity(name):
        return name.casefold().replace("’", "'")
    by_name = {identity(x['name']): x['slug'] for x in cat_rows}
    catalog_cells = {"|".join(pair): by_name[identity(x['name'])]
                     for pair, x in matrix.items() if x['status']=='used' and identity(x['name']) in by_name}
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
    # Keep the curated README and historical coverage indicators stable. The
    # complete web directory also includes short, attributed release references.
    rows = [*releases,*history]
    _, coverage_csv, editions_csv = index_reports(rows, matches, matrix, landmarks, cat, aliases)
    profiles=read_csv('directory_profiles.csv'); reported=read_csv('reported_directory.csv')
    recorded = {norm(r['reported_family']) for r in csv.DictReader(io.StringIO(coverage_csv))}
    profiled = {norm(r['reported_family']) for r in reported}
    if recorded != profiled: raise ValueError('Update release-directory profiles: '+str(recorded ^ profiled))
    edition_records = [r for source in sorted((ROOT/'data/editions').glob('*.json')) for r in json.loads(source.read_text())]
    arena_records=read_csv('arena_directory.csv')
    directory,strict,placements = assemble_directory(cat,profiles,reported,edition_records,DOMAINS,check_url,arena_records)
    arena_by_pair={r['prefix']+'|Arena':r for r in arena_records}
    positive_arena={r['prefix']+'|Arena' for r in names if r['suffix']=='Arena' and r['status']=='used'}
    if arena_by_pair.keys()!=positive_arena:raise ValueError('Arena directory is missing a checked name')
    for pair,ar in arena_by_pair.items(): catalog_cells[pair]=ar['slug']
    for pair, slug in groups['catalogVersions'].items():
        if slug not in directory or matrix[tuple(pair.split('|'))]['status'] != 'used':
            raise ValueError('Invalid catalog version link: '+pair)
        catalog_cells[pair] = slug
    for pair, slugs in groups['relatedCatalog'].items():
        if pair not in catalog_cells or not set(slugs) <= directory.keys() or catalog_cells[pair] in slugs:
            raise ValueError('Invalid related catalog reference: '+pair)
    duplicated = set(catalog_cells.values()) & {s for ids in landmarks.values() for s in ids}
    if duplicated:
        raise ValueError('A field landmark repeats a name cell: '+str(duplicated))
    for pair,alternatives in groups.get('secondarySources',{}).items():
        if pair not in catalog_cells: raise ValueError('Unknown namesake '+pair)
        for item in alternatives:
            if not all(item.get(k) for k in ('en','zh','url')): raise ValueError('Incomplete namesake '+pair)
            check_url(item['url'])
    evidence, _, _ = index_reports(rows,matches,matrix,landmarks,directory,aliases,strict)
    # For the bibliography, preserve the focal release attribution, not an
    # operational how-to. Do not turn risk assessments into task recipes.
    restricted={evidence['catalog'][k] for k,x in directory.items()
                if x['origin']=='report' and x['domain']=='Safety' and k in evidence['catalog']}
    for key in restricted:
        evidence['reports'][key]=[{a:(v.split('#')[0] if a=='release_url' else v) for a,v in r.items()
                                   if a not in ('location','qualifier')} for r in evidence['reports'][key]]
    out=io.StringIO(newline='');writer=csv.writer(out,lineterminator='\n')
    writer.writerow(['reported_family','directory_entries','directory_slugs','profile'])
    for f,slugs in sorted(placements.items(),key=lambda it:it[0].casefold()):
        writer.writerow([f,'; '.join(directory[k]['display_name'] for k in slugs),'; '.join(slugs),
                         'release reference' if all(directory[k]['origin']=='report' for k in slugs) else 'task or edition'])
    directory_coverage=out.getvalue()
    guidance = json.loads((ROOT/'data/reading_notes.json').read_text())
    for slug, note in guidance.items():
        if slug not in cat or not note.get('reading') or not note.get('url'):
            raise ValueError('Unresolved or unsourced reading note: '+slug)
        check_url(note['url'])
        if 'facts' in note:
            if len(note['facts'])!=2 or not all(f.get('label') and f.get('value') for f in note['facts']):
                raise ValueError('A fact pair needs two labeled values: '+slug)
            for f in note['facts']: check_url(f.get('url'))
        if 'compare' in note and (note['compare'] not in cat or note['compare'] == slug or not note.get('contrast')):
            raise ValueError('Invalid comparison: '+slug)
    mark_manifest=ROOT/'web/assets/marks/manifest.json'
    marks={}
    if mark_manifest.exists():
        for k,item in json.loads(mark_manifest.read_text()).items():
            asset=mark_manifest.parent/item['file']
            if asset.suffix.lower() not in ('.png','.svg','.webp') or asset.resolve().parent!=mark_manifest.parent.resolve():
                raise ValueError('Unknown mark format/location: '+str(asset))
            check_url(item['source']);check_url(item['license_url'])
            mime={'.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp'}[asset.suffix.lower()]
            marks[k]={**item,'uri':'data:'+mime+';base64,'+base64.b64encode(asset.read_bytes()).decode()}
    directory_fields=fields+['series','modalities','date_basis','date_note','display_name','display_date','edition_order','origin','aliases','reported_family','alternative_dates']
    ballot_config=json.loads((ROOT/'vote-service/campaign.json').read_text())
    if not re.fullmatch(r'[-a-z0-9]{1,64}',ballot_config['id']):
        raise ValueError('Invalid ballot identifier')
    if ballot_config['api']:
        url=urlsplit(ballot_config['api'])
        project_api=ballot_config['api']=='https://yiming-shi.com/awesome-big-bench/api'
        if (url.scheme!='https' or not url.hostname or url.username or url.password or url.query or url.fragment or (not project_api and url.path not in ('','/'))):
            raise ValueError('Use an HTTPS service origin or the exact official project API')
    picks=json.loads((ROOT/'web/editors-picks.json').read_text())
    pick_ids=[k for ids in picks.values() for k in ids]
    if set(picks)!=set(DOMAINS) or len(pick_ids)!=len(set(pick_ids)) or any(directory.get(k,{}).get('domain')!=d for d,ids in picks.items() for k in ids):
        raise ValueError('Featured entries must be unique, present and correctly grouped by field.')
    ballot_targets=json.loads((ROOT/'data/map_ballot_targets.json').read_text())
    used_pairs={'|'.join(pair) for pair,n in matrix.items() if n['status']=='used'}
    if set(ballot_targets)!=used_pairs:
        raise ValueError('Every taken name (and no unclaimed name) needs a ballot target: '+str(used_pairs^set(ballot_targets)))
    for pair, ids in ballot_targets.items():
        if not isinstance(ids,list) or not ids or len(ids)!=len(set(ids)) or not set(ids)<=directory.keys():
            raise ValueError(f'Invalid edition choice for {pair}: {ids}')
    payload = dict(mapBallots=ballot_targets,featured=pick_ids,ballotConfig=ballot_config,agentPrompt=agent_prompt,readingNotes=guidance,repo=REPO,domains=DOMAINS,nameGroups=groups,fieldLandmarks=landmarks,
                   mapEvidence=evidence,mapCatalog=catalog_cells,marks=marks,catalog=[{k:x[k] for k in directory_fields if k in x} for x in directory.values()],names=names,months=months)
    scripts = ('language.js','app.js','parts.js','ballot.js','cards.js','contribute.js','directory.js','names.js','trends.js','route.js')
    app = '\n'.join((ROOT/'web'/name).read_text() for name in scripts)
    html = (ROOT/'web/page.html').read_text().replace('/* APPEARANCE */',(ROOT/'web/theme.js').read_text().strip()).replace('/* STYLE */','\n'.join((ROOT/'web'/css).read_text() for css in ('style.css','ballot.css','theme.css'))).replace('/* APP */',app)
    mark=(ROOT/'docs/bench-mark.svg').read_text().strip()
    mark_uri='data:image/svg+xml,'+quote(mark,safe='')
    font=base64.b64encode((ROOT/'web/assets/manrope-latin.woff2').read_bytes()).decode('ascii')
    font_license=(ROOT/'web/assets/Manrope-OFL.txt').read_text()
    html=html.replace('/* MARK */',mark).replace('/* MARK_URI */',mark_uri).replace('/* FONT */',font)
    html=html.replace('</head>','<!-- Bundled font notice:\n'+font_license.replace('--','—')+'\n-->\n</head>')
    localized_pages = editions(ROOT, html, payload)
    outputs={**render_readmes(ROOT,payload,cat_rows,mark,md,link), **localized_pages}
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
    outputs['verification/flagships/directory-coverage.csv'] = directory_coverage
    return outputs


if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check',action='store_true',help='Fail on stale generated files, without writing them.')
    args=parser.parse_args()
    stale=[]
    for path,text in render().items():
        dest=ROOT/path
        blob=text if isinstance(text,bytes) else text.encode('utf-8')
        if args.check:
            if not dest.exists() or dest.read_bytes()!=blob: stale.append(path)
        else:
            dest.parent.mkdir(parents=True,exist_ok=True)
            dest.write_bytes(blob)
    if stale: sys.exit('Regenerate with python3 scripts/build_guide.py: '+', '.join(stale))
