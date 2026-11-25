"""The landing page stays actionable; the linked reading guide keeps the full evidence."""
import csv
import json
import re
import unittest
from xml.etree import ElementTree as ET
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]


class BilingualReadmes(unittest.TestCase):
    def test_landing_routes_and_counterparts(self):
        for suffix, counterpart, stem in [
            ('', 'README.zh-CN.md', 'awesome-big-bench/'),
            ('.zh-CN', 'README.md', 'awesome-big-bench/zh/'),
        ]:
            text = (ROOT/f'README{suffix}.md').read_text()
            self.assertIn(f']({counterpart})', text.splitlines()[0])
            for route in ['#names', '#directory', '#trends']:
                self.assertIn('https://yiming-shi.com/'+stem+route, text)
            # Lead with the trend, keep the linked product preview, then let a reader
            # copy one complete prompt without navigating to the web app.
            intro, trend = text.split(f'](docs/masthead-trend{suffix}.svg)', 1)
            self.assertNotIn('<picture>', intro)
            self.assertNotIn('## ', intro)
            self.assertIn('](#contribute-with-your-agent)', intro)
            self.assertIn('edition=swe-bench"><picture>', trend)
            self.assertLess(trend.index('<picture>'), trend.index('```text'))
            prompts = re.findall(r'^```text\n(.*?)\n```$', text, re.M | re.S)
            self.assertEqual(len(prompts), 1)
            for required in ['yimingshi-cs/awesome-big-bench',
                             'CONTRIBUTING.md', 'PR', 'fork']:
                self.assertIn(required, prompts[0])
            self.assertNotIn('|---', text)
            self.assertIn('name="contribute-with-your-agent"', text)
            self.assertIn(f'guide/sources{suffix}.md', text)

    def test_field_navigation_preserves_each_table_and_source(self):
        with (ROOT/'data/catalog_tasks.csv').open() as f:
            records = list(csv.DictReader(f))
        domains = json.loads((ROOT/'web/editors-picks.json').read_text())
        for suffix in ['', '.zh-CN']:
            guide_path = f'guide/benchmarks{suffix}.md'
            guide = (ROOT/guide_path).read_text()
            landing = (ROOT/f'README{suffix}.md').read_text()
            tables = guide[guide.index('\n### '):]
            rows = [line for line in tables.splitlines() if line.startswith('| ')]
            self.assertEqual(len(rows), len(records)+len(domains))
            for r in records:
                self.assertTrue(any(f"(<{r['primary_url']}>)" in line and f"(<{r['protocol_url']}>)" in line
                                    for line in rows), r['slug'])
            for domain in ['coding','cua','reasoning','multimodal','embodied','safety','long-context','ai-research','rsi','general']:
                target = f'domain-{domain}'
                self.assertIn(f'name="{target}"', landing)
                self.assertIn(f']({guide_path})', landing)
                self.assertIn(f'name="{target}"', guide)

    def test_figures_show_the_underlying_records(self):
        # Check public artifacts against the map and the complete monthly counts,
        # including the recomposed mobile view. Colour alone cannot identify a cell.
        with (ROOT/'data/names.csv').open() as f:
            names = {r['prefix']+'|'+r['suffix']:r for r in csv.DictReader(f)}
        page = (ROOT/'docs/index.html').read_text()
        reported = json.loads(re.search(r'id="payload">(.*?)</script>', page, re.S)[1])['mapEvidence']['cells']
        with (ROOT/'data/monthly.csv').open() as f:
            months = list(csv.DictReader(f))
        for suffix in ['', '.zh-CN']:
            landing = (ROOT/f'README{suffix}.md').read_text()
            for compact in ['', '-compact']:
                path = f'docs/masthead{compact}{suffix}.svg'
                self.assertIn(path,landing)
                cells = ET.parse(ROOT/path).findall('.//{*}g[@data-cell]')
                self.assertEqual(len(cells),4 if compact else 9)
                for g in cells:
                    key = g.attrib['data-cell']
                    row = names[key]
                    state = 'deep' if key in reported else 'mint' if row['status']=='used' else 'cell'
                    self.assertEqual(g.attrib['data-state'],state)
                    self.assertEqual([t.text for t in g.findall('{*}text')], [{'deep':'◆','mint':'•','cell':'–'}[state], row['name']])
            trend = ET.parse(ROOT/f'docs/masthead-trend{suffix}.svg')
            labels = [el.text for el in trend.findall('.//{*}text')]
            for year in range(2020,2027):
                rows = [m for m in months if m['month'][:4]==str(year) and m['month'][5:]<='09']
                self.assertEqual(len(rows),9)
                self.assertTrue(all(r['complete']=='yes' for r in rows))
                expected = sum(int(r['bench_cs_all']) for r in rows)/sum(int(r['cs_all']) for r in rows)
                self.assertEqual(labels[labels.index(str(year))-1],f'{expected:.2%}')

    def test_reference_links_and_local_files(self):
        for suffix, prompt in [('', 'agent-prompt.txt'), ('.zh-CN','agent-prompt.zh.txt')]:
            sources = (ROOT/f'guide/sources{suffix}.md').read_text()
            for path in ['verification/trends.md','vote-service/OPERATIONS.md','web/assets/marks/',
                         'figures/overview.png','data/monthly.csv','contribute/'+prompt]:
                self.assertIn('](../'+path+')', sources)
            for file in [ROOT/f'README{suffix}.md',ROOT/f'guide/benchmarks{suffix}.md',ROOT/f'guide/sources{suffix}.md']:
                text = file.read_text()
                self.assertNotIn('@@', text)
                for link in [*re.findall(r'\]\((<[^>]+>|[^)]+)\)', text), *re.findall(r'(?:src|srcset)="([^"]+)"', text)]:
                    url = urlsplit(link.strip('<>'))
                    if not url.scheme and url.path:
                        self.assertTrue((file.parent/url.path).exists(), (file,link))


if __name__ == '__main__':
    unittest.main()
