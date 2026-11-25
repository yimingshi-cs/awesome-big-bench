import csv
import json
import unittest
from compiled_guide import ROOT, page

class MapIdentity(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        _,cls.data=page('docs/index.html')
        cls.targets=cls.data['mapBallots']
        cls.by_id={r['slug']:r for r in cls.data['catalog']}

    def test_each_green_cell_resolves_to_distinct_verified_editions_and_ballot(self):
        d=self.data;allowed=json.loads((ROOT/'vote-service/catalog.json').read_text())
        self.assertEqual(set(self.targets),{n['prefix']+'|'+n['suffix'] for n in d['names'] if n['status']=='used'})
        for k,ids in self.targets.items():
            self.assertTrue(ids,k)
            self.assertEqual(len(ids),len(set(ids)),k)
            self.assertEqual(len(ids),len({self.by_id[i]['display_name'] for i in ids}),k)
            if k in d['mapCatalog']:self.assertIn(d['mapCatalog'][k], ids,k)
            for i in ids:
                r=self.by_id[i]
                self.assertIn(i,allowed,k);self.assertTrue(r['primary_url'] and r['date_source_url'],i)

    def test_false_joins_and_documented_aliases(self):
        self.assertEqual(self.targets['Frontier|Bench'],['terminal-bench-3-0'])
        self.assertNotIn('terminal-bench-science',self.targets['Terminal|Bench'])
        self.assertEqual(set(self.targets['Bench|Bench']),{'benchbench-agreement','benchbench-generation'})
        self.assertEqual(self.targets['Agent|Gym'],self.targets['Agent|Eval'])
        self.assertEqual(self.targets['Tool|Bench'],self.targets['Tool|Eval'])
