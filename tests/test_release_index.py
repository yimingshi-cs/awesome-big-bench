"""Evidence boundaries that matter to a reader picking a name or a reference."""
import csv
import unittest
from io import StringIO
from pathlib import Path
import sys
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
from historical_evidence import index_reports


def row(benchmark,family):
    return dict(vendor='OpenAI',release='Example release',date='2020-01-01',
                benchmark=benchmark,family=family,release_url='https://example.org/report',location='Table 1')


class ReleaseIndexTest(unittest.TestCase):
    def test_families_and_versions(self):
        rows=[row('CWE-bench v1','CWE-bench'),row('ARC-AGI-3','ARC-AGI'),
              row('ARC-AGI-2','ARC-AGI'),row('GDPval-AA','GDPval-AA'),
              row('LifeVal','LifeVal'),row('The Tool Decathlon','The Tool Decathlon')]
        cells={('CWE','Bench'):{'name':'CWE-bench','status':'used'},
               ('GDP','val'):{'name':'GDPval','status':'used'},
               ('Life','Eval'):{'name':'LifeEval','status':'used'},
               ('Life','val'):{'name':'LifeVal','status':'used'}}
        cat={s:{'name':n} for s,n in [('cwe2','CWE-bench v2'),('arc2','ARC-AGI-2'),('tool','Toolathlon')]}
        selection=[{'family':'ARC-AGI','variant':'ARC-AGI-2','landmark':'arc2'}]
        p,table,editions=index_reports(rows,selection,cells,{'Reasoning':['arc2']},cat,{'The Tool Decathlon':'Toolathlon'})
        self.assertEqual(set(p['cells']),{'CWE|Bench','Life|val'})
        self.assertNotIn('cwe2',p['catalog'])
        self.assertEqual(p['catalog']['arc2'],p['landmarks']['arc2'])
        self.assertEqual([r['benchmark'] for r in p['reports'][p['catalog']['arc2']]],['ARC-AGI-2'])
        self.assertIn('tool',p['catalog'])
        coverage={r['reported_family']:r for r in csv.DictReader(StringIO(table))}
        self.assertEqual(coverage['GDPval-AA']['on_site'],'not listed')
        labels={r['reported_label']:r for r in csv.DictReader(StringIO(editions))}
        self.assertEqual(labels['ARC-AGI-3']['site_status'],'another edition in family')


if __name__=='__main__':unittest.main()
