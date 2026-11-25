[← Project home](../README.md) · [简体中文](sources.zh-CN.md)

# Sources and licenses

This started as a weekend project built with AI assistance. A link to the right paper isn't always evidence for a particular edition, task or scoring rule. The [field tables](benchmarks.md) link the claims to their sources. Download an offline copy in [English](@@OFFLINE@@-en.html) or [Chinese](@@OFFLINE@@-zh.html) from the website footer. To suggest a correction from GitHub, use the [plain-text PR prompt](../contribute/agent-prompt.txt).

## How the name map works

Of @@COMBINATIONS@@ prefix–suffix combinations checked, @@TAKEN@@ have a same-name AI evaluation. On the [name map](@@SITE@@#names), mint marks a match; dark green means it also appears in an OpenAI, Anthropic or Google model report. Grey means [we searched but found no exact match](../verification/names.md), not that a name is available. Select a cell for the evidence and search record.

For example, two groups independently used the name BenchBench. The [2024 paper](https://arxiv.org/abs/2407.13696) studies whether benchmarks agree on model rankings. The [2026 paper](https://arxiv.org/abs/2603.20807) studies whether models can design good benchmarks themselves.

## “Bench” in arXiv titles

@@TREND@@

[Interactive chart](@@SITE@@#trends) · [Figures](../figures/) · [Monthly counts](../data/monthly.csv) · [Collection method](../data/README.md) · [Audit](../verification/trends.md)

## Community vote

Votes are about a specific edition: would you recommend it for the task it claims to measure? When voting is open, choose **👍 Recommend** or **👎 Wouldn’t recommend** on its card. No sign-in is required. Skip editions you helped make, grade or maintain. You can change or withdraw your vote in the same browser before the cutoff.

Totals stay hidden during voting. Results are grouped by field; editions with fewer than 20 votes are left unranked. [Voting and tally rules](../vote-service/OPERATIONS.md)

## Where the name came from

[Xinye Li asked what PhDs can build as foundation models absorb more tasks](https://x.com/vclee8/status/2120212679470268893). [Greg Hu](https://x.com/greghxm_1/status/2120436200746242530) called it 大 bench 理论, the “Big Bench Theory.” The project name is a nod to that exchange; it is not the [BIG-bench evaluation suite](https://github.com/google/BIG-bench).

Code and original documentation: [MIT](../LICENSE). Original annotations: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Descriptive arXiv metadata: [CC0](https://info.arxiv.org/help/api/tou.html). [Project marks](../web/assets/marks/) retain their respective rights.

## Design references

[Excalidraw](https://github.com/excalidraw/excalidraw#readme) and [Dive into Deep Learning](https://github.com/d2l-ai/d2l-zh#readme) show readers what they can open. Our figures link to the trend chart and a benchmark record. The worked correction in the contribution guide draws on the [lm-evaluation-harness task guide](https://github.com/EleutherAI/lm-evaluation-harness/blob/main/docs/new_task_guide.md). Both figures use this project's own data.
