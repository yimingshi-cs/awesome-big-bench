import csv, json, re, unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]

class DirectoryContract(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.p=json.loads(re.search(r'id="payload">(.*?)</script>',(ROOT/'docs/index.html').read_text(),re.S)[1])
        cls.cat={r['slug']:r for r in cls.p['catalog']};cls.ev=cls.p['mapEvidence']
    def test_directory_represents_every_audited_family(self):
        def read(p):
            with (ROOT/'verification/flagships'/p).open() as f:return list(csv.DictReader(f))
        ledger=read('site-coverage.csv');seen=read('directory-coverage.csv')
        self.assertEqual({r['reported_family'] for r in ledger},{r['reported_family'] for r in seen})
        for r in seen:self.assertTrue(set(r['directory_slugs'].split('; '))<=self.cat.keys())
        for r in self.cat.values():
            self.assertTrue(r['date_source_url'].startswith(('http://','https://')) and r['date'] and r['series'])
    def test_name_map_is_complete(self):
        ends=sum(self.p['nameGroups']['endings'].values(),[]);self.assertIn('Arena',ends)
        prefixes=sum(self.p['nameGroups']['fields'].values(),[])
        self.assertEqual({(r['prefix'],r['suffix']) for r in self.p['names']},{(a,b) for a in prefixes for b in ends})
    def test_editions_do_not_inherit_family_marking(self):
        self.assertIn('terminal-bench-4-1',self.cat)
        self.assertEqual(self.cat['arc-agi']['display_name'],'ARC-AGI-1')
        by=self.ev['catalog'];records=self.ev['reports']
        if 'terminal-bench-4-1' in by:
            self.assertTrue(all('4.1' in r['benchmark'] for r in records[by['terminal-bench-4-1']]))
        for r in records[by['terminal-bench-4-0']]:self.assertIn('4.0',r['benchmark'])
        for r in records[by['arc-agi-3']]:self.assertIn('ARC-AGI-3',r['benchmark'])

    def test_allowlist_and_name_receipts(self):
        p=self.p; allowed=p['marks'];groups=p['nameGroups']['fields']
        self.assertEqual(len(p['names']),sum(len(v) for v in groups.values())*sum(len(v) for v in p['nameGroups']['endings'].values()))
        for k,m in allowed.items():
            self.assertIn(k,self.cat);self.assertTrue(m['credit'] and m['license_url'] and m['uri'].startswith('data:image/'))
        for n in p['names']:
            if n['suffix']=='Arena' and n['status']=='used':
                self.assertIn(p['mapCatalog'][n['prefix']+'|Arena'],self.cat)

    def test_directories_preserve_sources_and_versions(self):
        self.assertEqual(self.cat['apex-agents-1-1']['series'],self.cat['apex-agents']['series'])
        self.assertEqual(self.cat['terminal-bench-4-1']['date'],'2026-11-09')
        self.assertEqual(self.cat['tau2-bench']['series'],self.cat['tau-bench-2-0-0']['series'])
        self.assertNotEqual(self.cat['tau2-bench']['date'],self.cat['tau-bench-2-0-0']['date'])
        for x in self.cat.values():
            self.assertTrue(x['display_name'] and x['modalities'] and x['date_basis'])
