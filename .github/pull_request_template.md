**Reader-visible change** (benchmark name, edition or map cell):

**Primary source and what it establishes** (link the specific section, release or repository event):

**Validation** (include the outcome, not just a checklist):
- `python3 scripts/build_guide.py`
- `python3 scripts/build_guide.py --check`
- `python3 -m unittest discover -s tests`

For a trend-data change, also run the trend audit. Include the regenerated files in the PR. Review and merge belong to the maintainer.
