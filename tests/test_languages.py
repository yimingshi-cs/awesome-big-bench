"""Language changes reader text, not the identity of a benchmark, source, or vote."""
import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


from compiled_guide import page


class Languages(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.en_html, cls.en = page('docs/index.html')
        cls.zh_html, cls.zh = page('docs/zh/index.html')

    def test_shareable_pages_and_prompt(self):
        for html, lang in [(self.en_html, 'en'), (self.zh_html, 'zh-Hans')]:
            self.assertIn(f'<html lang="{lang}">', html)
            self.assertNotIn('@@TEXT', html)
            for alt in ['en', 'zh-Hans']:
                self.assertIn(f'rel="alternate" hreflang="{alt}"', html)
        self.assertIn('暂未找到同名评测', self.zh_html)
        self.assertIn('已有同名评测', self.zh_html)
        self.assertIn('In OpenAI, Anthropic or Google releases', self.en_html)
        for filename, payload in [('agent-prompt.txt', self.en), ('agent-prompt.zh.txt', self.zh)]:
            self.assertEqual(payload['agentPrompt'], (ROOT/'contribute'/filename).read_text().strip())

    def test_map_is_already_readable_before_scripts(self):
        for html, data in [(self.en_html, self.en), (self.zh_html, self.zh)]:
            markup = html.split('id="name-map">', 1)[1].split('</table>', 1)[0]
            self.assertEqual(markup.count('class="map-cell '), len(data['names']))
            self.assertEqual(markup.count('class="map-cell yes'), sum(r['status']=='used' for r in data['names']))
            self.assertIn('/verification/matrix/swe.md#dojo', markup)
            self.assertIn('aria-label="SWE-Dojo:', markup)

    def test_editions_and_evidence_are_identical(self):
        for key in ['months','nameGroups','fieldLandmarks','mapCatalog','ballotConfig','domains']:
            self.assertEqual(self.en[key], self.zh[key], key)
        left, right = self.en['catalog'], self.zh['catalog']
        self.assertEqual(len(left), len(right))
        for en, zh in zip(left,right):
            for k in en:
                if k not in {'task','description','assessment','input','output','date_note','modalities','search_alias'}:
                    self.assertEqual(en[k],zh[k],(k,en['slug']))
            if en['origin']=='report' and en.get('description'):
                self.assertEqual(en['description'],zh['source_title'])
        self.assertEqual([{k:v for k,v in r.items() if k!='note'} for r in self.en['names']],
                         [{k:v for k,v in r.items() if k!='note'} for r in self.zh['names']])
        self.assertTrue(all(re.search(r'[\u3400-\u9fff]', n['note']) for n in self.zh['names'] if n['note']))
        for section in ['cells','catalog','landmarks']:
            self.assertEqual(self.en['mapEvidence'][section],self.zh['mapEvidence'][section])
        for group, rows in self.en['mapEvidence']['reports'].items():
            other=self.zh['mapEvidence']['reports'][group]
            self.assertEqual(len(rows),len(other))
            for a,b in zip(rows,other):
                for key in ['vendor','release','date','benchmark','release_url']:
                    self.assertEqual(a[key],b[key])

    def test_search_modalities_and_metrics(self):
        h=next(r for r in self.zh['catalog'] if r['slug']=='humaneval')
        self.assertEqual(h['modalities'],'文本')
        self.assertIn('pass@k',h['assessment'].lower())
        osw=next(r for r in self.zh['catalog'] if r['slug']=='osworld')
        self.assertEqual(osw['modalities'],'文本 + 图像')
        for row in self.zh['catalog']:
            if row['task']: self.assertRegex(row['task'],r'[\u3400-\u9fff]')
