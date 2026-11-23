"""Directory input labels describe signals, not tasks, file containers or outputs."""
import csv
import json
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
from directory_catalog import validate_modalities


def csv_rows(name):
    with (ROOT / 'data' / name).open(newline='',encoding='utf-8') as stream:
        return list(csv.DictReader(stream))


class ModalityContract(unittest.TestCase):
    def test_validation(self):
        for value in ('Text', 'Image', 'Audio', 'Text + Image', 'Text + Video + Audio',
                      'Text / Audio', 'Image + Proprioception', '—'):
            validate_modalities(value)
        for value in ('Text + code', 'Text + Tools', 'PDF', 'Mixed', 'Evaluation scores',
                      'Text + Text', 'Image + Text', 'Text+Video', 'Text + Image / Audio',
                      '', None):
            with self.subTest(value=value), self.assertRaises(ValueError):
                validate_modalities(value)

    def test_all_sources_not_only_rendered_rows(self):
        for source in ('directory_profiles.csv','arena_directory.csv','reported_directory.csv'):
            for row in csv_rows(source):
                validate_modalities(row['modalities'])
        for edition_file in (ROOT/'data/editions').glob('*.json'):
            for row in json.loads(edition_file.read_text()):
                validate_modalities(row['input_modality'])

    def test_input_vs_output_and_version(self):
        profiles={r['slug']:r['modalities'] for r in csv_rows('directory_profiles.csv')}
        reported={r['reported_family']:r['modalities'] for r in csv_rows('reported_directory.csv')}
        editions={r['slug']:r['input_modality'] for f in (ROOT/'data/editions').glob('*.json')
                  for r in json.loads(f.read_text())}
        self.assertEqual(profiles['humaneval'], 'Text')
        self.assertEqual(profiles['bird'], 'Text')
        self.assertEqual(profiles['graphwalks'], 'Text')
        self.assertEqual(profiles['gaia'], 'Text + Image + Video + Audio')
        self.assertEqual(reported['OpenScore String Quartets'], 'Image')
        self.assertEqual(editions['arc-agi-2'],'Text')
        self.assertEqual(editions['arc-agi-3'],'Text + Image')
        self.assertEqual(editions['osworld'],'Text + Image')
        self.assertEqual(editions['swe-bench-pro-v2'],'Text')
        self.assertEqual(editions['swe-bench-multimodal-v2'],'Text + Image')
        self.assertEqual(editions['tau2-bench'],'Text')
        self.assertEqual(editions['tau3-bench'],'Text / Audio')
        self.assertEqual(reported['GDP.pdf'],'Text + Image')
        self.assertTrue(all(v=='—' for k,v in editions.items() if k.startswith('aa-intelligence-index')))
