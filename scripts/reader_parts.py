"""Partition the portable guide at reader-action boundaries, not by language or audience."""
import json
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
    outputs[path]=html.replace('/* DATA */',js_json(core)).replace('<!-- READER PARTS -->','\n'.join(inline))
    return outputs
