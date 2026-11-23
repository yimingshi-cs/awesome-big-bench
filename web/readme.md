# <img src="docs/bench-mark.svg" width="32" height="32" alt=""> Awesome Big Bench

**Is that benchmark name taken?** Two different papers already use *BenchBench*: one [compares how benchmarks rank models](https://arxiv.org/abs/2407.13696); the other [tests how models design benchmarks](https://arxiv.org/abs/2603.20807).

**[Check a name](https://yiming-shi.com/awesome-big-bench/#names)** · **[Browse the directory](https://yiming-shi.com/awesome-big-bench/#directory)** · **[Contribute with your agent](#contribute-with-your-agent)**

The **name map** checks @@COMBINATIONS@@ prefix–ending pairs. @@TAKEN@@ have a documented same-name AI evaluation. Grey means we searched and found no exact match, not that a name is reserved or guaranteed free. Select a cell for its [dated search record](verification/names.md).

The **directory** has @@DIRECTORY_COUNT@@ entries, including benchmark editions and publicly documented evaluations from OpenAI, Anthropic and Google releases. A benchmark can belong in the directory without fitting any cell on the map.

The name comes from a November 2026 conversation: [Xinye Li asked what PhDs can build as foundation models absorb more tasks](https://x.com/vclee8/status/2120212679470268893); [Greg Hu called it 大bench理论, the “Big Bench Theory”](https://x.com/greghxm_1/status/2120436200746242530). This is a reading guide inspired by that exchange, not the [BIG-bench benchmark](https://github.com/google/BIG-bench).

## Contribute with your agent

Have a benchmark of your own? Found a citation that points to the wrong edition? Give **Codex, Claude Code or another coding agent** your paper or project link and one sentence about the change. No issue form is required. Your agent checks the sources and opens a pull request; a maintainer reviews and merges it.

**[Copy a PR prompt](https://yiming-shi.com/awesome-big-bench/#contribute)** · [Plain-text prompt](contribute/agent-prompt.txt) · [Contribution guide](CONTRIBUTING.md)

For a correction, open the name or edition on the website and choose **Copy PR prompt**. That copy already identifies the cell or record you mean. New benchmarks go in the directory first; a new row or column requires checking all of its combinations.

<details>
<summary>Read or copy the prompt here</summary>

```text
@@AGENT_PROMPT@@
```

</details>

## Community vote

Would you recommend this edition to someone measuring the same task? On a [directory card](https://yiming-shi.com/awesome-big-bench/#directory), **👍 夯** means yes and **👎 拉** means no. Vote only on editions you know and skip those you helped design, grade or maintain. No sign-in or quota; you can change or withdraw your choice in the same browser while the poll is open.

The card shows the live voting status. Results stay hidden during collection. After closing, report the up/down counts by domain and edition. Fewer than 20 votes means **not ranked**, not “poor”. [Ballot and tally method](vote-service/OPERATIONS.md).

## Where to start

| If you want to test… | Compare these tasks | What distinguishes them |
|---|---|---|
| Coding | [HumanEval](https://github.com/openai/human-eval) · [SWE-bench](https://www.swebench.com/) | Complete one function vs. repair a real repository. |
| An agent using a computer | [WebArena](https://webarena.dev/) · [OSWorld](https://os-world.github.io/) | Work inside websites vs. operate desktop applications. |
| Memory | [Needle in a Haystack](https://github.com/gkamradt/needle-in-a-haystack) · [LongMemEval](https://github.com/xiaowu0162/LongMemEval) | Retrieve a planted fact vs. answer from a history of conversations. |
| AI research | [MLE-bench](https://github.com/openai/mle-bench) · [PaperBench](https://openai.com/index/paperbench/) | Make an ML competition submission vs. reproduce a published paper. |

The curated tables below compare inputs, outputs and scoring for **@@COUNT@@ benchmarks across ten domains**. Click a benchmark for its original source; click its scoring rule for the protocol. Entries here are selected for distinct tasks. The [full web directory](https://yiming-shi.com/awesome-big-bench/#directory) also includes release-specific editions and every publicly documented family in our three-lab survey. [Coverage crosswalk](verification/flagships/directory-coverage.csv).

## Benchmark directory

@@JUMP@@

@@CATALOG@@

[Source table](data/famous.csv) · [Documented dates](verification/catalog.md) · [Candidates not yet in the guide](data/candidates_unverified.csv). A date identifies the event supported by its source, such as a v1 submission or public release. A project, a call for tasks and a finished release can have different dates.

## “Bench” in arXiv titles

@@TREND@@

[Charts](figures/) · [Monthly counts](data/monthly.csv) · [Collection method](data/README.md) · [Reproduction and discrepancies](verification/trends.md). The title census includes papers whose titles contain “bench”; the directory is a catalog of evaluations, including names such as HumanEval.

## Provenance and licenses

This project started as a weekend, AI-assisted build. A working link can still point to the wrong benchmark, release or scoring rule. Corrections with primary sources are welcome. Code and original documentation: [MIT](LICENSE). Original catalog annotations: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Descriptive arXiv metadata remains [CC0](https://info.arxiv.org/help/api/tou.html). Project names and marks belong to their owners; [credited marks](web/assets/marks/) retain their respective terms.
