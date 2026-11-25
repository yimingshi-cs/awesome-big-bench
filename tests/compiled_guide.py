import base64
import json
import re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]

def page(path):
    filename=ROOT/path; text=filename.read_text()
    m=re.search(r'id="payload">(.*?)</script>', text, re.S)
    data=json.loads(m[1])
    lang='zh' if filename.parent.name=='zh' else 'en'
    portable=(ROOT/'docs/offline'/('awesome-big-bench-'+lang+'.html')).read_text()
    other=json.loads(re.search(r'id="payload">(.*?)</script>',portable,re.S)[1])
    for key,mark in data['marks'].items():
        raw=(filename.parent/mark['uri']).read_bytes()
        if raw!=base64.b64decode(other['marks'][key]['uri'].split(',')[1]): raise ValueError('Different logo')
        mark['uri']=other['marks'][key]['uri']
    if data!=other:raise ValueError('Online and offline index diverge')
    if 'id="part-' in text:raise ValueError('Online HTML includes offline parts')
    reports=data['mapEvidence']['reports']={}

    by_slug={r['slug']:r for r in data['catalog']}
    by_pair={r['prefix']+'|'+r['suffix']:r for r in data['names']}
    found=set()
    for key,body in re.findall(r'<script type="application/json" id="part-([a-z0-9-]+)">(.*?)</script>',portable,re.S):
        packet=json.loads(body)
        if key in found or packet['revision']!=data['parts'][key] or packet!=json.loads((filename.parent/'parts'/(key+'.json')).read_text()):
            raise ValueError('Different online and portable data: '+key)
        found.add(key); rows=packet['records']
        if key.startswith('cards-') or key=='directory-index':
            for slug,fields in rows.items(): by_slug.setdefault(slug,{}).update(fields)
            if key=='directory-index':order=list(rows)
        elif key.startswith('reports-'):
            reports.update(rows)
        elif key=='trends':data['months']=rows['months']
        elif key=='name-queries':
            for pair,url in rows.items(): by_pair[pair]['search_url']=url
    if found!=set(data['parts']):raise ValueError('Missing portable data')
    for row in by_slug.values():row.pop('detailTerms',None)
    data['catalog']=[by_slug[k] for k in order]
    if len(data['catalog'])!=data['catalogSize']:raise ValueError('Incomplete directory')
    return text[:m.start()],data
