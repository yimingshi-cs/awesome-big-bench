[← Project home](../README.md) · [简体中文](sources.zh-CN.md)

# Sources and licenses

This started as a weekend project built with AI assistance. A link to the right paper isn't always evidence for a particular edition, task or scoring rule. The [field tables](benchmarks.md) link the claims to their sources. Download an offline copy in [English](https://yiming-shi.com/awesome-big-bench/offline/awesome-big-bench-en.html) or [Chinese](https://yiming-shi.com/awesome-big-bench/offline/awesome-big-bench-zh.html) from the website footer. To suggest a correction from GitHub, use the [plain-text PR prompt](../contribute/agent-prompt.txt).

## How the name map works

Of 341 prefix–suffix combinations checked, 89 have a same-name AI evaluation. On the [name map](https://yiming-shi.com/awesome-big-bench/#names), mint marks a match; dark green means it also appears in an OpenAI, Anthropic or Google model report. Grey means [we searched but found no exact match](../verification/names.md), not that a name is available. Select a cell for the evidence and search record.

For example, two groups independently used the name BenchBench. The [2024 paper](https://arxiv.org/abs/2407.13696) studies whether benchmarks agree on model rankings. The [2026 paper](https://arxiv.org/abs/2603.20807) studies whether models can design good benchmarks themselves.

## “Bench” in arXiv titles

In January–September 2020, 314 of 51,439 arXiv CS papers had `bench` in the title (**0.61%**). In the same nine months of 2026, it was 6,215 of 149,409 (**4.16%**): a **6.81×** increase in share. The 2020-01–2026-11 collection (partial final month) contains 17,809 matching paper IDs. This counts titles, not new benchmarks: *benchmarking* and *workbench* qualify; *HumanEval* does not. [Overview chart](../figures/overview.png).

[Interactive chart](https://yiming-shi.com/awesome-big-bench/#trends) · [Figures](../figures/) · [Monthly counts](../data/monthly.csv) · [Collection method](../data/README.md) · [Audit](../verification/trends.md)

## Community vote

Votes are about a specific edition: would you recommend it for the task it claims to measure? When voting is open, choose **👍 Recommend** or **👎 Wouldn’t recommend** on its card. No sign-in is required. Skip editions you helped make, grade or maintain. You can change or withdraw your vote in the same browser before the cutoff.

Totals stay hidden during voting. Results are grouped by field; editions with fewer than 20 votes are left unranked. [Voting and tally rules](../vote-service/OPERATIONS.md)

## Where the name came from

[Xinye Li asked what PhDs can build as foundation models absorb more tasks](https://x.com/vclee8/status/2120212679470268893). [Greg Hu](https://x.com/greghxm_1/status/2120436200746242530) called it 大 bench 理论, the “Big Bench Theory.” The project name is a nod to that exchange; it is not the [BIG-bench evaluation suite](https://github.com/google/BIG-bench).

Code and original documentation: [MIT](../LICENSE). Original annotations: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Descriptive arXiv metadata: [CC0](https://info.arxiv.org/help/api/tou.html). [Project marks](../web/assets/marks/) retain their respective rights.

## How this reading guide was designed

[Excalidraw](https://github.com/excalidraw/excalidraw#readme) links its product showcase to the editor; our opening illustration opens the actual map cell. [Dive into Deep Learning](https://github.com/d2l-ai/d2l-zh#readme) puts an equation, a figure, code and a notebook next to its edition links to show how the book works; our two panels show the map and the edition record you can read from it. The [lm-evaluation-harness task guide](https://github.com/EleutherAI/lm-evaluation-harness/blob/main/docs/new_task_guide.md) uses worked examples before its submission checklist; our contribution section uses one edition-specific correction before linking the PR checklist. Our figures are drawn from this project’s own data.
