# Contribute

[Suggest a benchmark](https://github.com/yimingshi-cs/awesome-big-bench/issues/new?template=benchmark.md) or [flag a name](https://github.com/yimingshi-cs/awesome-big-bench/issues/new?template=name.md). Include the exact spelling, a primary source and what it establishes.

## Benchmarks

Edit `data/famous.csv` and `data/catalog_tasks.csv` using the same slug. Distinguish a launch from a paper or software release. Describe the input, expected output and scoring rule, and link the corresponding protocol. Keep unconfirmed candidates out of the accepted directory. For artwork, prefer a link. Only assets in [the mark allowlist](web/assets/marks/manifest.json) may be embedded: document source, permission, attribution and changes. Do not use unlicensed logos, substitute school seals or populate the legacy local-image field.

The details shown from the name map and directory use the same task record. If a score needs interpretation, add a short note to `data/reading_notes.json`: source the distinction, state what a result establishes, and link a genuinely different alternative when it helps someone choose. Distinguish a composite index, a live preference arena and an interactive task suite. The name alone does not identify the scoring method. The card hierarchy draws on [Epoch AI’s benchmark reviews](https://epoch.ai/benchmarks/swe-bench-verified/review) and the [GOV.UK summary list](https://design-system.service.gov.uk/components/summary-list/): show the decision-making information first; keep provenance and dates available on demand.

## Complete web directory

- Add a modality and series key to `data/directory_profiles.csv` for a curated entry. The list uses short input types; inputs, outputs and scoring stay in the detail view. A field shortcut on the name map need not be the project's scientific classification.
- Record materially different benchmark editions in `data/editions/`. Keep every edition visible. Group by field then series, newest edition first. Keep a tested version distinct from a scaffold, tool setting, reprint or spelling variant. An unspecified version in a model comparison does **not** prove the newest edition was tested.
- Cite the benchmark author's version announcement or substantive GitHub/dataset release, the paper submission, or a dated public reference for that edition. Use the available precision. If a source only establishes that it existed by that time, use `available_by`. A repository's initial creation, the end of a contest window, and a model's launch date are not inherently the benchmark's release date. A model card may be published or revised later than its model.
- For new public evaluations in the three release ledgers, add or reconcile the family in `data/reported_directory.csv`. Record field, modality, purpose and the best dated evidence. A sourced reference can be listed before its full editorial card is written; do not fabricate inputs, metrics or exact launch dates. Add later, better date evidence in place. Build validation rejects unprofiled families; each family must resolve to a visible directory row in [the complete coverage crosswalk](verification/flagships/directory-coverage.csv).
- Keep version-specific report labels with the appropriate edition and keep original release snapshots unchanged. For copyright, trademarks and project versus publisher marks, consult [asset credits](web/assets/marks/README.md).

## Names

Edit `data/names.csv` and append dated, repeatable checks to `verification/names/matrix-searches.csv`. Use `used` only for an exact-named AI benchmark or reusable AI evaluation suite with a primary source. A namesake tool, company, course, model, or environment alone does not qualify. Use `no_match` after successful checks found no qualifying benchmark. Keep related projects in the note, not in a third state. A failed lookup is not a negative result. When adding an axis entry to `data/name_groups.json`, research the new combinations before publishing them.

## Flagship releases

Use `data/flagship_evaluations.csv` for model-specific results. Record the exact version, focal release, qualifier, document location, release link and public protocol link. Keep `headline` (the launch highlights) distinct from `extended` (other documented tests). An explicitly internal test is not a public result just because its score appears in a card. Keep notes and exclusions under `verification/flagships/`. The CSV comparison and summary tables rebuild with the site. Link a family to a confirmed name or field landmark in `data/map_report_matches.json` only after checking project identity. For a version-specific entry, use an exact `variant` selector. An alias, a namesake, an index component or a similarly named spin-off does not inherit the highlight.

For earlier mainline releases, add a row to `data/flagship_history.csv` with the exact focal model, benchmark edition, date, official release/report URL and location. Keep the six-release inventory intact. Release pages sometimes cite partners’ measurements: attribute those in the location, do not infer adoption from a competitor column or independent leaderboard. Update the per-lab historical coverage note when a release is added. `data/release_family_aliases.json` reconciles names, not scores or task sets. Check both the family and edition gap tables before adding a second homepage entry.

The [optional CI example](verification/ci/catalog.yml.example) runs the same read-only build and directory tests under GitHub Actions. Auditing new model releases and approving new bibliographic evidence are editorial steps; the site does not silently ingest third-party feeds.

## Rebuild

Run from the root:

```sh
python3 scripts/build_guide.py
python3 scripts/build_guide.py --check
python3 scripts/audit_trends.py
```

Commit the regenerated README and `docs/index.html` with the sources. Open the HTML locally to test it. The public site is served by GitHub Pages from `main:/docs`; no external scripts or fonts are needed. See [data methods](data/README.md) to regenerate the figures.

The comparison table and source details take inspiration from [Awesome CUA](https://awesomecua.com/categories/benchmark/), [Awesome 3D Gaussian Splatting](https://mrnerf.github.io/awesome-3D-gaussian-splatting/) and [Awesome-WAM](https://openmoss.ai/Awesome-WAM/). The interface uses its own HTML, CSS and JavaScript.

The original bench-and-grid mark is shared by the site and repository. Its mint/ink palette draws on [Dots Studio](https://studio.dots.ai/); [Manrope](web/assets/README.md) is locally bundled under the SIL OFL. No Dots artwork or trial fonts are used.
