import json
import unittest
from compiled_guide import ROOT, page

class FeaturedAndGame(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.shell, cls.full=page('docs/index.html')
        cls.zh_shell, cls.zh=page('docs/zh/index.html')
        cls.c={r['slug']:r for r in cls.full['catalog']}

    def test_reading_list_is_an_explicit_subset_and_full_catalog_is_preserved(self):
        featured=self.full['featured']
        self.assertTrue(0<len(featured)<self.full['catalogSize'])
        self.assertEqual(self.full['catalogSize'],len(self.c))
        self.assertEqual(featured,self.zh['featured'])
        self.assertEqual({self.c[k]['domain'] for k in featured},set(self.full['domains']))
        self.assertTrue({'webvoyager','mteb','ocrbench','librispeech','rlbench','c-eval','spider-1-0','spider-2-0-lite'}<=set(featured))
        self.assertEqual(self.c['spider-1-0']['series'],self.c['spider-2-0-lite']['series'])
        self.assertNotEqual(self.c['spider-1-0']['date'],self.c['spider-2-0-lite']['date'])

    def test_game_verdicts_and_game_creation_are_not_conflated(self):
        self.assertIn('Game',self.full['nameGroups']['fields']['Embodied'])
        rows={r['suffix']:r for r in self.full['names'] if r['prefix']=='Game'}
        self.assertEqual(set(rows),{v for vs in self.full['nameGroups']['endings'].values() for v in vs})
        self.assertTrue({'Bench','Arena','Eval','Gym','Dojo'}<={k for k,r in rows.items() if r['status']=='used'})
        for suffix in ('Bench','Arena'):
            pair='Game|'+suffix;slug=self.full['mapCatalog'][pair];self.assertIn('play',self.c[slug]['description'].lower())
            self.assertIn('gamecraft-bench',self.full['nameGroups']['relatedCatalog'][pair])
        self.assertIn('Godot',self.c['gamecraft-bench']['description'])

    def test_single_file_is_a_download_not_an_automatic_request(self):
        for folder,lang in [('','en'),('zh/','zh')]:
            html=(ROOT/'docs'/folder/'index.html').read_text()
            self.assertNotIn('id="part-',html)
            self.assertNotIn('data:font/woff2',html)
            self.assertIn('class="offline-download"',html)
            full=(ROOT/'docs/offline'/f'awesome-big-bench-{lang}.html').read_text()
            self.assertIn('id="part-trends"',full)
            self.assertIn('data:font/woff2',full)
