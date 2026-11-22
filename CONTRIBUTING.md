# Contribute

[Suggest a benchmark](https://github.com/yimingshi-cs/awesome-big-bench/issues/new?template=benchmark.md) or [flag a name](https://github.com/yimingshi-cs/awesome-big-bench/issues/new?template=name.md). Include the exact spelling, a primary source and what it establishes.

## Benchmarks

Edit `data/famous.csv` and `data/catalog_tasks.csv` using the same slug. Distinguish a launch from a paper or software release. Describe the input, expected output and scoring rule, and link the corresponding protocol. Keep unconfirmed candidates out of the accepted directory. For artwork, link to the owner’s source; do not add third-party logos or populate the reserved local-image field.

## Names

Edit `data/names.csv` and append dated, repeatable checks to `verification/names/matrix-searches.csv`. Use `used` only for an exact-named AI benchmark or reusable AI evaluation suite with a primary source. A namesake tool, company, course, model, or environment alone does not qualify. Use `no_match` after successful checks found no qualifying benchmark. Keep related projects in the note, not in a third state. A failed lookup is not a negative result. When adding an axis entry to `data/name_groups.json`, research the new combinations before publishing them.

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
