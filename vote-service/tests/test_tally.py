import sys, unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from tally import summarize, report

class SurveyReport(unittest.TestCase):
    def test_predeclared_bands(self):
        self.assertEqual(summarize(16,4)[0],'偏夯')
        self.assertEqual(summarize(14,6)[0],'暂难定')
        self.assertEqual(summarize(4,16)[0],'偏拉')
        self.assertEqual(summarize(3,0)[0],'票数不足')
        self.assertEqual(summarize(0,0),('票数不足',None,None,None))
        self.assertAlmostEqual(summarize(16,4)[2],.584,places=3)
        self.assertAlmostEqual(summarize(16,4)[3],.919,places=3)

    def test_editions_and_empty_denominators(self):
        r=report([dict(success=True,results=[dict(campaign='a',edition='v2',up=16,down=4),dict(campaign='b',edition='v1',up=8,down=0)])],{'v1':['Test 1','Coding'],'v2':['Test 2','Coding']},'a')
        self.assertEqual([(x['edition'],x['n']) for x in r],[('v2',20),('v1',0)])

    def test_invalid_export_not_a_zero_vote_poll(self):
        with self.assertRaises(ValueError):report([],{},'a')
        with self.assertRaises(ValueError):report([dict(success=True,results=[dict(campaign='a',edition='typo',up=1,down=0)])],{},'a')

    def test_late_addition_is_not_ranked_even_with_enough_votes(self):
        result=report([{'success':True,'results':[{'campaign':'a','edition':'later','up':80,'down':2}]}],
                      {'later':['Later','Coding']},'a',opening={})
        self.assertEqual(result[0]['band'],'期间新增')
        self.assertEqual(result[0]['n'],82)
