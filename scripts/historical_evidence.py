"""Join release disclosures to displayed projects without treating name fragments as matches."""
import csv
import re
import unicodedata
from collections import defaultdict
from io import StringIO

LAB_ORDER = ('OpenAI','Anthropic','Google')


def norm(value):
    return ''.join(c for c in unicodedata.normalize('NFKC', value).casefold()
                   if c.isalnum() or c=='+')


def index_reports(rows, selectors, matrix, landmarks, catalog, aliases):
    """A generic family can show named variants. A version-specific entry must match its variant."""
    cells = {'|'.join(pair): r['name'] for pair,r in matrix.items() if r['status']=='used'}
    landmark_ids = {slug for slugs in landmarks.values() for slug in slugs}
    by_family, by_variant = defaultdict(set), defaultdict(set)
    normalized = {}
    alias_keys = {norm(k):v for k,v in aliases.items()}
    canonical = {}
    for label in [*(m['family'] for m in selectors), *aliases.values(),
                  *(x['name'] for x in catalog.values()), *cells.values()]:
        canonical.setdefault(norm(label),label)
    for i,r in enumerate(rows):
        raw = alias_keys.get(norm(r['family']),r['family'])
        # Some sources shorten the family label to SEC-Bench while explicitly testing Pro.
        if norm(raw)=='secbench' and norm(r['benchmark'])=='secbenchpro': raw='SEC-bench Pro'
        family = canonical.setdefault(norm(raw),raw)
        normalized[i] = family
        by_family[norm(family)].add(i)
        by_variant[norm(r['benchmark'])].add(i)
    def exact(label):
        return by_family[norm(label)] | by_variant[norm(label)]
    targets = {'cells': {k:exact(v) for k,v in cells.items()},
               'catalog': {k:exact(v['name']) for k,v in catalog.items()}}
    for m in selectors:
        family = m['family']
        keys = by_family[norm(family)]
        # Restrict specific ARC, SWE and similar editions; never assign by prefix alone.
        if m.get('exactLabelOnly'):
            keys = keys & by_variant[norm(catalog[m['catalog']]['name'])]
        elif 'versionPattern' in m:
            exp = re.compile(m['versionPattern'],re.I)
            keys = {i for i in keys if exp.search(rows[i]['benchmark'])}
        elif 'variant' in m:
            keys = keys & by_variant[norm(m['variant'])]
        if not keys and not m.get('exactLabelOnly'):
            raise ValueError('Unmatched release selector: '+str(m))
        for kind,k in [('cells','|'.join(m.get('cell',[]))),('catalog',m.get('landmark') or m.get('catalog'))]:
            if not k: continue
            if k not in targets[kind]: raise ValueError('Release highlight not in catalog/map: '+k)
            targets[kind][k] = targets[kind][k] | keys if m.get('also') else set(keys)
    payload = {'cells':{},'landmarks':{},'catalog':{},'reports':{}}
    projected, located, by_record = {},defaultdict(set),defaultdict(set)
    for kind,entries in targets.items():
        for k,ids in entries.items():
            if not ids: continue
            sig = tuple(sorted(ids))
            if sig not in projected:
                key=str(len(projected));projected[sig]=key
                # Link to the actual section/page, including a card page where the release inventory has one.
                pairs={}
                for i in sig:
                    r=rows[i];url=r['release_url']; proto=r.get('protocol_url','')
                    if '#page=' in proto and 'card' in r['location'].lower(): url=proto
                    v={field:r[field] for field in ('vendor','release','date','benchmark','location')}
                    v['release_url']=url
                    if r.get('qualifier'): v['qualifier']=r['qualifier']
                    pairs.setdefault((v['vendor'],v['release'],v['benchmark'],url,v['location'],v.get('qualifier','')),v)
                payload['reports'][key]=list(pairs.values())
            val=projected[sig];payload[kind][k]=val
            if kind=='catalog' and k in landmark_ids:payload['landmarks'][k]=val
            for i in sig:
                label = cells[k] if kind=='cells' else catalog[k]['name']
                located[normalized[i]].add(label); by_record[i].add(label)
    families=defaultdict(list)
    for i,r in enumerate(rows):families[normalized[i]].append(r)
    buf=StringIO(newline='')
    w=csv.writer(buf,lineterminator='\n')
    w.writerow(['reported_family','on_site','matched_entries','labs','release_count','example_release','report_url'])
    def order(it):
        f,rr=it
        return (bool(located[f]),-len({r['vendor'] for r in rr}),
                -len({(r['vendor'],r['release']) for r in rr}),f.casefold())
    for f,rr in sorted(families.items(),key=order):
        newest=max(rr,key=lambda r:r['date'])
        w.writerow([f,'yes' if located[f] else 'not listed','; '.join(sorted(located[f])),
                    '; '.join(l for l in LAB_ORDER if any(r['vendor']==l for r in rr)),
                    len({(r['vendor'],r['release']) for r in rr}),newest['release'],newest['release_url']])
    details=StringIO(newline='')
    versions=csv.writer(details,lineterminator='\n')
    versions.writerow(['family','reported_label','site_status','site_entries','labs','releases','example_source'])
    labels=defaultdict(list)
    for i,r in enumerate(rows): labels[normalized[i],r['benchmark']].append(i)
    for (family,label),indices in sorted(labels.items(),key=lambda x:(x[0][0].casefold(),x[0][1].casefold())):
        entries=set().union(*(by_record[i] for i in indices))
        status=('listed name' if norm(label) in {norm(x) for x in entries} else
                'linked family / different label' if entries else
                'another edition in family' if located[family] else 'not listed')
        rr=[rows[i] for i in indices];example=max(rr,key=lambda r:r['date'])
        versions.writerow([family,label,status,'; '.join(sorted(entries or located[family])),
                           '; '.join(l for l in LAB_ORDER if any(r['vendor']==l for r in rr)),
                           len({(r['vendor'],r['release']) for r in rr}),example['release_url']])
    return payload,buf.getvalue(),details.getvalue()
