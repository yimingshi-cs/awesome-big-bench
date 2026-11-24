"""Render two portable editions from one guide. A changed source sentence needs a new translation."""
from copy import deepcopy
from html import escape
from initial_map import render_map
from reader_parts import render_reader
import json
import re

PUBLIC = 'https://yiming-shi.com/awesome-big-bench/'
CATALOG_TEXT = ('task', 'description', 'input', 'output', 'assessment', 'date_note')


def read_translations(path):
    def unique(pairs):
        values = dict(pairs)
        if len(values) != len(pairs):
            raise ValueError(f'Duplicate translation in {path}')
        return values
    return json.loads(path.read_text(encoding='utf-8'), object_pairs_hook=unique)


def editions(root, shell, source):
    locales = root/'web/locale'
    ui = read_translations(locales/'ui.zh.json')
    catalog = read_translations(locales/'zh-catalog.json')
    evidence = read_translations(locales/'zh-evidence.json')

    def translate(s, table, label):
        if not s: return s
        value = table.get(s)
        if not value:
            raise ValueError(f'Missing Chinese translation [{label}]: {s}')
        return value

    zh = deepcopy(source)
    zh['ui'] = ui
    source['ui'] = {}
    zh['agentPrompt'] = (root/'contribute/agent-prompt.zh.txt').read_text().strip()
    for en, row in zip(source['catalog'], zh['catalog']):
        for k in CATALOG_TEXT:
            if k in row:
                row[k] = translate(row[k], catalog, row['slug'] + '.' + k)
        if en.get('origin') == 'report' and en.get('description'):
            # Report entries use the original publication title as their description.
            # Keep it verbatim in Sources; the translated title is only a reading aid.
            row['source_title'] = en['description']
        row['modalities'] = re.sub(r'[A-Za-z]+', lambda m: ui[m[0]], row['modalities'])
        # Search in either language. Never translate an edition or series identifier.
        en['search_alias'] = ' '.join((row['task'], ui[row['domain']], row['modalities']))
        row['search_alias'] = ' '.join((en['task'], en['modalities']))
    for row in zh['names']:
        row['note'] = translate(row['note'], evidence, 'name: ' + row['name'])
    for name, guide in zh['readingNotes'].items():
        for k in ('kind', 'reading', 'contrast', 'action'):
            if k in guide: guide[k] = translate(guide[k], evidence, name + '.' + k)
        for fact in guide.get('facts', []):
            for k in ('label', 'value'):
                fact[k] = translate(fact[k], evidence, name + '.facts.' + k)
    for rows in zh['mapEvidence']['reports'].values():
        for r in rows:
            if re.search(r'Mercor|third.party|cited measurement|partner evaluation',r.get('location',''),re.I):
                r['show_location'] = True
            for k in ('location', 'qualifier'):
                if k in r: r[k] = translate(r[k], evidence, r['release'] + '.' + k)
    result = {}
    for is_zh, data in [(False, source), (True, zh)]:
        lang = 'zh-Hans' if is_zh else 'en'
        path = 'docs/zh/index.html' if is_zh else 'docs/index.html'
        html = re.sub(r'@@TEXT\[([^\]\n]+)\]@@', lambda m: escape(ui[m[1]] if is_zh else m[1], quote=True), shell)
        html = html.replace('<!-- INITIAL MAP -->', render_map(data, lambda k: ui[k] if is_zh else k))
        for key, value in {
            'LANG': lang, 'TITLE': 'Awesome Big Bench · 评测起名图鉴' if is_zh else 'Awesome Big Bench',
            'CANONICAL': PUBLIC + ('zh/' if is_zh else ''), 'OTHER_LANG': 'en' if is_zh else 'zh-Hans',
            'OTHER_NAME': 'English' if is_zh else '中文', 'OTHER_PATH': '../' if is_zh else 'zh/',
        }.items():
            html = html.replace('@@' + key + '@@', value)
        result.update(render_reader(html, path, data))
    return result
