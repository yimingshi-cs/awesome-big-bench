# Harness: a prefix in the CUA group

The [published row](../matrix/harness.md) has eleven dated decisions. Four names refer to scored AI evaluations. The placement next to Agent describes the system being compared; it does not mean every evaluation uses a desktop GUI.

| Name | What the primary source actually evaluates |
|---|---|
| [Harness-Bench](https://arxiv.org/abs/2605.27922) | Whether a model–harness pair delivers correct work on shared tasks and budgets. [Independent reuse](https://arxiv.org/html/2609.38143v2) documents a 106-task configuration; the [maintainers’ repository](https://github.com/Qihoo360/harness-bench) describes an expanded suite. Do not pool results across those settings. |
| [harnesseval](https://github.com/dsifry/harnesseval/blob/main/REPORT.md) | AI code-review systems on real PRs. The public scored experiment reuses earlier datasets; it is not a new dataset. MirroS also uses [HarnessEval](https://mirros.ai/blog/harnesseval) for a workflow, but names its world-model benchmark HarnessEval-W. |
| [harness-exam](https://github.com/kunchenguid/harness-exam) | A practical exam for coding agents, with [task definitions](https://github.com/kunchenguid/harness-exam/tree/main/src/tasks) and a [pass/fail scorecard](https://github.com/kunchenguid/harness-exam/blob/main/src/scorecard.js). |
| [Harness Arena](https://github.com/Ondemand-OSS/harness-arena) | Blind comparisons of deliverables from different harnesses, keeping the model and task fixed. An exact-name hit does not imply widespread adoption. |

Only Harness-Bench is an editorial pick in this release. All four have cards in the full directory. For Gym, squared and RSI, the names are in use for a [framework](https://harnessgym.com/), a [method](https://arxiv.org/abs/2610.14224) and a [research atlas](https://github.com/LucasXinYu/harness-rsi), respectively. These are not positive cells under the map’s benchmark-only rule.

There is no Harness suffix column. Software such as the [LM Evaluation Harness](https://github.com/EleutherAI/lm-evaluation-harness) runs existing evaluations rather than establishing independent benchmarks named X-Harness.
