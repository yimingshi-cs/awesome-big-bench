**English** · [简体中文](README.zh-CN.md)

<a name="awesome-big-bench"></a>
@@HERO@@

**Two unrelated papers are called BenchBench.** The [2024 paper](https://arxiv.org/abs/2407.13696) asks whether benchmarks agree on model rankings. The [2026 paper](https://arxiv.org/abs/2603.20807) asks whether models can design good benchmarks themselves.

**[Check a name](https://yiming-shi.com/awesome-big-bench/#names)** · **[Browse benchmarks](https://yiming-shi.com/awesome-big-bench/#directory)** · **[Contribute](#contribute-with-your-agent)**

Of **@@COMBINATIONS@@ names checked**, **@@TAKEN@@** already have an AI evaluation. Mint marks a name in use; dark green means it also appears in an OpenAI, Anthropic or Google model report. Grey means [we looked but found no exact match](verification/names.md).

## Where to start

The [directory](https://yiming-shi.com/awesome-big-bench/#directory) opens on **@@FEATURED@@ editor’s picks**. Switch to [all @@DIRECTORY_COUNT@@ entries](https://yiming-shi.com/awesome-big-bench/#browse?scope=all) to search earlier editions and evaluations documented in model releases. These pairs test different things:

| If you care about… | What the model actually has to do |
|---|---|
| Writing code | [HumanEval](https://yiming-shi.com/awesome-big-bench/#browse?entry=humaneval): finish a function. [SWE-bench](https://yiming-shi.com/awesome-big-bench/#browse?entry=swe-bench): fix an issue in an existing repository. |
| Using a computer | [WebArena](https://yiming-shi.com/awesome-big-bench/#browse?entry=webarena): complete a task on a website. [OSWorld](https://yiming-shi.com/awesome-big-bench/#browse?entry=osworld): operate desktop applications. |
| Games | [Kaggle Game Arena](https://yiming-shi.com/awesome-big-bench/#names?field=Embodied&prefix=Game&suffix=Arena): play an existing game against another model. [GameCraft-Bench](https://yiming-shi.com/awesome-big-bench/#browse?entry=gamecraft-bench): build a playable game. |
| Remembering | [Needle in a Haystack](https://yiming-shi.com/awesome-big-bench/#browse?entry=needle-in-a-haystack): retrieve a planted fact. [LongMemEval](https://yiming-shi.com/awesome-big-bench/#browse?entry=longmemeval): answer from past conversations. |
| Doing research | [MLE-bench](https://yiming-shi.com/awesome-big-bench/#browse?entry=mle-bench): make an ML competition submission. [PaperBench](https://yiming-shi.com/awesome-big-bench/#browse?entry=paperbench): reproduce a published paper. |

## Benchmark directory

For reading on GitHub: expand a field to compare **@@COUNT@@ benchmarks** by input, output and scoring. Each name links to the original paper or project; the last column links to its evaluation protocol.

@@CATALOG@@

[Source table](data/famous.csv) · [Dates and their sources](verification/catalog.md) · [Model-release coverage](verification/flagships/directory-coverage.csv) · [Candidates under review](data/candidates_unverified.csv)

## Contribute with your agent

A missing benchmark does **not** need “bench” in its name. Give your agent a paper or project link and the change you want. It checks the edition, edits the source data and opens a pull request. The maintainer reviews it.

**[Copy the PR prompt](https://yiming-shi.com/awesome-big-bench/#contribute)** · [Plain text](contribute/agent-prompt.txt) · [Contribution guide](CONTRIBUTING.md)

<details>
<summary>Read or copy the prompt on GitHub</summary>

```text
@@AGENT_PROMPT@@
```

</details>

Correcting an existing record? Use **Copy PR prompt** on that card; the copy includes the exact entry or name pair. New rows or columns need evidence for every new combination.

## Community vote

Would you recommend this **edition** for the task it claims to measure? Each directory card shows whether voting is open. When it is, choose **👍 Recommend** or **👎 Wouldn’t recommend**. No sign-in is required. Skip editions you helped make or maintain; you can change or withdraw your vote in the same browser before the cutoff.

Totals stay hidden during voting. Results are grouped by field; editions with fewer than 20 votes are left unranked. [Voting and tally rules](vote-service/OPERATIONS.md).

## “Bench” in arXiv titles

@@TREND@@

[Explore the trend](https://yiming-shi.com/awesome-big-bench/#trends) · [Charts](figures/) · [Monthly counts](data/monthly.csv) · [Collection method](data/README.md) · [Audit](verification/trends.md)

## Provenance and licenses

**Why “Big Bench”?** [Xinye Li asked what PhDs can build as foundation models absorb more tasks](https://x.com/vclee8/status/2120212679470268893). [Greg Hu called it 大bench理论, the “Big Bench Theory”](https://x.com/greghxm_1/status/2120436200746242530). The name is a nod to that exchange, not the [BIG-bench evaluation suite](https://github.com/google/BIG-bench).

[Offline HTML: English](https://yiming-shi.com/awesome-big-bench/offline/awesome-big-bench-en.html) · [简体中文](https://yiming-shi.com/awesome-big-bench/offline/awesome-big-bench-zh.html). To save a file for offline use, choose **Download offline guide** in the website footer.

Code and original documentation: [MIT](LICENSE). Original annotations: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Descriptive arXiv metadata: [CC0](https://info.arxiv.org/help/api/tou.html). [Project marks](web/assets/marks/) retain their respective rights.

This started as a weekend project built with AI assistance. A link can point to the right paper but the wrong edition or scoring rule. If you spot one, send the original source with your correction.
