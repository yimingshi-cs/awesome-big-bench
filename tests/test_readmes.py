"""The two repository entry points are language editions of one reading guide."""
import csv
import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class BilingualReadmes(unittest.TestCase):
    def test_language_switches_and_localized_actions(self):
        for file, counterpart, stem, prompt in [
                ('README.md', 'README.zh-CN.md', 'awesome-big-bench/', 'agent-prompt.txt'),
                ('README.zh-CN.md', 'README.md', 'awesome-big-bench/zh/', 'agent-prompt.zh.txt')]:
            body = (ROOT/file).read_text()
            self.assertIn(f']({counterpart})', body.splitlines()[0])
            for route in ['#names', '#directory', '#contribute']:
                self.assertIn('https://yiming-shi.com/'+stem+route, body)
            self.assertIn((ROOT/'contribute'/prompt).read_text().strip(), body)
            self.assertNotIn('@@', body)
            for asset in re.findall(r'(?:src|srcset)="(docs/masthead[^"]*)"', body):
                self.assertTrue((ROOT/asset).exists(), asset)

    def test_same_table_records_protocols_and_working_legacy_targets(self):
        with (ROOT/'data/catalog_tasks.csv').open() as f:
            records = list(csv.DictReader(f))
        for file in ['README.md','README.zh-CN.md']:
            text = (ROOT/file).read_text()
            for r in records:
                self.assertIn(f"(<{r['primary_url']}>)",text,r['slug'])
                self.assertIn(f"(<{r['protocol_url']}>)",text,r['slug'])
            self.assertEqual(text.count('<summary><strong>'),len(json.loads((ROOT/'web/editors-picks.json').read_text())))
            for dom in ['coding','cua','reasoning','multimodal','embodied','safety','long-context','ai-research','rsi','general']:
                self.assertIn(f'name="domain-{dom}"',text)
            self.assertIn('verification/trends.md',text)
            self.assertIn('vote-service/OPERATIONS.md',text)
            self.assertIn('web/assets/marks/',text)
            self.assertIn('contribute-with-your-agent',text)


if __name__ == '__main__':
    unittest.main()
