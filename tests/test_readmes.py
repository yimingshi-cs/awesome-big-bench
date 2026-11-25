"""The landing page stays actionable; the linked reading guide keeps the full evidence."""
import csv
import json
import re
import unittest
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
            for route in ['#names', '#directory', '#contribute', '#trends']:
                self.assertIn('https://yiming-shi.com/'+stem+route, text)
            # No full tables or multi-page prompt before the contribution entry.
            self.assertLess(text.index(stem+'#directory'), text.index(stem+'#contribute'))
            self.assertLess(text.index(stem+'#contribute'), text.index('<details>'))
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
                self.assertIn(f'{guide_path}#{target}', landing)
                self.assertIn(f'name="{target}"', guide)

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
