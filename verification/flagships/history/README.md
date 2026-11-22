# Historical release evidence

Which public benchmarks appear in general-purpose flagship and reasoning-model publications? This extends the [two-release comparison](../README.md) back to the early GPT, Claude and Gemini lines. Mini, Flash/Lite, Haiku and specialist coding models are not independent focal releases. Named major updates and reasoning modes can be separate entries; two variants in a joint report are not necessarily two launches.

[Historical inventory](../../../data/flagship_history.csv) · [Six focal releases](../../../data/flagship_evaluations.csv) · [Family gaps](../site-coverage.csv) · [Exact labels and editions](../site-editions.csv)

| Lab and evidence | Historical release entries with a public result | Historical records | Recent focal records |
|---|---:|---:|---:|
| [OpenAI](openai.md) | 28 | 619 | 58 |
| [Anthropic](anthropic.md) | 20 | 674 | 200 |
| [Google](google.md) | 17 | 279 | 89 |

One historical row identifies a model release, a named evaluation or documented configuration, and its location in a first-party source. The historical survey and the six focal releases are disjoint. Row counts are not counts of unique benchmarks. The per-lab notes list the releases, sources and coverage limits, including early releases without an eligible result.

## Reading the homepage

The name map highlights **10 combinations** and **16 additional field references** with release evidence. A darker name means that a reviewed release reports a result on that benchmark or a named edition; the underlying score, task set and grader are not inferred to be identical. Open the item to see the exact label, model and linked report. A lighter taken name is still a real AI benchmark.

A partner result explicitly reported by the focal lab is attributed to the assessor where identified; a benchmark owner independently testing a model is not enough. A private runner is not automatically a private test set. A disguised private fork, an unavailable result, an illustrative mention, or another model’s comparison column does not qualify.

## What is missing?

Use **not listed** in the [family table](../site-coverage.csv) to find a reported family with no standalone directory or name-map match. The [edition table](../site-editions.csv) distinguishes an exact name from a related family or a different reported edition. For example, GDPval-AA is not GDPval, ARC-AGI-3 is not ARC-AGI-2, and Terminal-Bench-Science is not Terminal-Bench 4.0. Repetition in model reports is a useful lead, not a ranking or an automatic reason to create a new row or column.
