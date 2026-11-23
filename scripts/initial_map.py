"""The map is useful before JS: each cell links to its dated search evidence."""
import re
from html import escape


def anchor(s):
    return 'squared' if s == '²' else re.sub('[^a-z0-9]+', '-', s.lower()).strip('-')


def render_map(data, label):
    groups = data['nameGroups']
    families = list(groups['endings'].items())
    rows = {(r['prefix'], r['suffix']): r for r in data['names']}
    refs = {r['slug']: r for r in data['catalog']}
    evidence = data['mapEvidence']
    width = 1 + sum(len(items) for _, items in families)
    cells = ['<colgroup><col class="prefix-col"></colgroup>']
    cells.extend(f'<colgroup span="{len(items)}"></colgroup>' for _, items in families)
    cells.append('<thead><tr><th scope="col" rowspan="2" class="prefix-label">'+escape(label('Prefix'))+'</th>')
    for family, items in families:
        cells.append(f'<th scope="colgroup" class="family-head" colspan="{len(items)}">{escape(label(family))}</th>')
    cells.append('</tr><tr>')
    for _, items in families:
        for j, s in enumerate(items):
            cls = '' if j else ' class="family-start"'
            cells.append(f'<th scope="col"{cls}>{escape(s)}</th>')
    cells.append('</tr></thead>')
    for field, prefixes in groups['fields'].items():
        cells.append(f'<tbody><tr><th class="field-band" scope="rowgroup" colspan="{width}"><div class="field-landmarks"><strong>{escape(label(field))}</strong><span>')
        for slug in data['fieldLandmarks'].get(field, []):
            x=refs[slug]
            cls=' class="reported"' if slug in evidence['landmarks'] else ''
            # Until the interactive guide arrives, go straight to the primary source.
            cells.append(f'<a{cls} href="{escape(x["primary_url"])}">{escape(x["name"])}</a>')
        cells.append('</span></div></th></tr>')
        for p in prefixes:
            cells.append(f'<tr><th scope="row" class="prefix-label">{escape(p)}</th>')
            for _, items in families:
                for j, s in enumerate(items):
                    n=rows[p,s]; name=n['name']; used=n['status']=='used'
                    key = evidence['cells'].get(p+'|'+s)
                    state = ('yes' if used else 'no') + (' reported' if key else '')
                    cls = '' if j else ' class="family-start"'
                    status = label('Taken' if used else 'Looks open')
                    if key: status += ' · ' + label('In OpenAI, Anthropic or Google releases')
                    receipt=data['repo'] + '/blob/main/verification/matrix/' + anchor(p) + '.md#' + anchor(s)
                    shown=escape(name)
                    if name.lower().startswith(p.lower()) and len(name)>len(p)+1:
                        shown=escape(name[:len(p)])+'<wbr>'+escape(name[len(p):])
                    cells.append(f'<td{cls}><a class="map-cell {state}" href="{escape(receipt)}" aria-label="{escape(name+": "+status)}"><span>{shown}</span></a></td>')
            cells.append('</tr>')
        cells.append('</tbody>')
    return ''.join(cells)
