"""Partition the portable guide at reader-action boundaries, not by language or audience."""
import json
import base64
import re
from collections import Counter
from copy import deepcopy
from pathlib import PurePosixPath
from hashlib import sha256


def js_json(x):
    return json.dumps(x, ensure_ascii=False, separators=(',', ':')).replace('<', '\\u003c')


DETAIL = ('description','input','output','assessment','date_note','alternative_dates',
          'affil_source_url','first_author_affil','logo_source_url','protocol_url','source_title','reported_family')


def render_reader(html, path, data):
    # Each inline part also has a small HTTP sibling for readers who click before
    # the rest of the HTML arrives. Opening the HTML alone requires no sibling.
    base = PurePosixPath(path).parent
    core = deepcopy(data)
    reports = core['mapEvidence'].pop('reports')
    refs = core['mapEvidence']
    refs['vendors'] = {k: [v for v in ('OpenAI','Anthropic','Google') if any(r['vendor']==v for r in rs)] for k,rs in reports.items()}
    refs['parts'] = {}
    parts = {}
    # These repeatable search URLs remain available in the portable archive and
    # the original CSV. Name cards link directly to the dated search evidence.
    parts['name-queries']={r['prefix']+'|'+r['suffix']:r.pop('search_url') for r in core['names']}
    directory=parts['directory-index']={}
    for row in core['catalog']:
        id_='cards-'+str(core['domains'].index(row['domain']))
        item={k:row.pop(k) for k in DETAIL if k in row}
        # Full-text search must keep matching protocol terms even before the
        # detail has loaded. Only normalized words, not full prose, are needed.
        words=' '.join(item.get(k,'') for k in ('description','input','output','assessment'))
        row['detailTerms']=' '.join(dict.fromkeys(words.split()))
        parts.setdefault(id_,{})[row['slug']]=item
        directory[row['slug']]={k:row.pop(k) for k in ('detailTerms','search_alias','aliases','modalities','task','edition_order') if k in row}
    # The first view needs the featured reading list and the projects reachable
    # from the map, not every historical release record.
    first=set(core['featured'])|set(core['marks'])|set(core['mapCatalog'].values())
    for group in [core['fieldLandmarks'],core['nameGroups']['relatedCatalog']]:
        for ids in group.values(): first.update(ids)
    first.update(n['compare'] for n in core['readingNotes'].values() if n.get('compare'))
    core['catalogSize']=len(core['catalog'])
    core['seriesSizes']=dict(Counter(x['series'] for x in core['catalog'] if x['slug'] in first))
    series_sizes=Counter(x['series'] for x in core['catalog'])
    core['seriesSizes']={s:series_sizes[s] for s in core['seriesSizes']}
    parts['trends']={'months':core.pop('months'), 'timeline':[
        {k:x[k] for k in ('slug','date','name','domain','primary_url')} for x in core['catalog']
        if x['origin']!='report' and x['date_basis']!='available_by']}
    initial=[]
    for x in core['catalog']:
        if x['slug'] in first:
            if x['slug'] in core['featured']:
                x.update({k:v for k,v in directory[x['slug']].items() if k in ('task','edition_order','modalities')})
            initial.append(x)
        else: directory[x['slug']].update(x)
    core['catalog']=initial
    group=0; size=0
    for key, rows in sorted(reports.items()):
        weight=len(js_json(rows).encode())
        if size and size+weight>32000:group+=1;size=0
        id_=f'reports-{group}'
        refs['parts'][key]=id_;parts.setdefault(id_,{})[key]=rows;size+=weight
    outputs={};inline=[];core['parts']={}
    for id_, part in parts.items():
        body=js_json(part)
        # The revision is a cache key, not a security check. Never mix old HTML
        # with new rows when Pages and browser caches update at different times.
        rev=sha256(body.encode()).hexdigest()[:16]
        core['parts'][id_]=rev
        packet=js_json({'revision':rev,'records':part})
        outputs[str(base/'parts'/(id_+'.json'))]=packet
        inline.append(f'<script type="application/json" id="part-{id_}">{packet}</script><script>readerArrived("{id_}")</script>')
    offline_name='awesome-big-bench-'+('zh' if base.name=='zh' else 'en')+'.html'
    prefix='../' if base.name=='zh' else ''
    portable=html.replace('@@OFFLINE@@',offline_name).replace('<html lang=', '<html data-edition="offline" lang=')
    other='awesome-big-bench-'+('en' if base.name=='zh' else 'zh')+'.html'
    portable=re.sub(r'href="[^"]+" class="language-switch"',f'href="{other}" class="language-switch"',portable)
    # A saved copy has no separate download to offer. Keep its canonical website handy.
    portable=re.sub(r'<a class="offline-download"[^>]*>[^<]*</a>', '', portable)
    html=html.replace('@@OFFLINE@@',prefix+'offline/'+offline_name)
    outputs['docs/offline/'+offline_name]=portable.replace('/* DATA */',js_json(core)).replace('<!-- READER PARTS -->','\n'.join(inline))
    # Online HTML is a separate artifact, not a portable file with a delayed tail.
    prefix='../' if base.name=='zh' else ''
    app=re.search(r'<script>(.*?)</script><!-- READER PARTS -->',html,re.S)
    if not app:raise ValueError('Missing runtime script boundary')
    runtime=app[1].rstrip()
    outputs['docs/assets/reader.js']=runtime+'\n'
    version=sha256(runtime.encode()).hexdigest()[:12]
    html=html[:app.start()]+html[app.end():]
    html=html.replace('</head>',f'<script>if(location.protocol==="file:") location.replace("{prefix}offline/{offline_name}"+location.hash)</script><script defer src="{prefix}assets/reader.js?v={version}"></script></head>')
    # Do not put fonts or image bytes between a mobile visitor and the map.
    font=re.search(r'data:font/woff2;base64,([A-Za-z0-9+/=]+)',html)
    if not font:raise ValueError('Missing bundled font')
    outputs['docs/assets/manrope.woff2']=base64.b64decode(font[1])
    html=html.replace(font[0],prefix+'assets/manrope.woff2')
    for mark in core['marks'].values():
        src=mark['file'];outputs['docs/assets/marks/'+src]=base64.b64decode(mark['uri'].split(',',1)[1])
        mark['uri']=prefix+'assets/marks/'+src
    outputs[path]=html.replace('/* DATA */',js_json(core))
    return outputs
