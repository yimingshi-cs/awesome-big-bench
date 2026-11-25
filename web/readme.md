English · [简体中文](README.zh-CN.md)

# <img src="docs/bench-mark.svg" width="32" height="32" alt=""> Awesome Big Bench

<a href="@@SITE@@#names?prefix=SWE&amp;suffix=Bench&amp;edition=swe-bench"><picture><source media="(max-width: 760px)" srcset="docs/masthead-compact.svg"><img src="docs/masthead.svg" width="100%" alt="Name map leading to an edition: SWE-bench is a reported evaluation, AgentDojo is a same-name evaluation, and SWE-Dojo has no exact match in the search. Original SWE-bench grades a repository patch with tests."></picture></a>

<a name="where-to-start"></a>
**[Explore the name map](@@SITE@@#names)** · **[Browse the directory](@@SITE@@#directory)** · **[Contribute a record](@@SITE@@#contribute)**

Check whether a benchmark name is in use, or choose an evaluation by what the model must do and how its work is graded.

## Read the map

Cross a prefix with an ending. **Mint** means we found a same-name AI evaluation. **Dark green** means it also appears in an OpenAI, Anthropic or Google model report. **Grey** means we searched and found no exact evaluation match; it doesn't mean the name is free.

Try [SWE-Dojo](@@SITE@@#names?prefix=SWE&suffix=Dojo): the name leads to an interview-practice site, not a benchmark. In the [SWE × Eval cell](@@SITE@@#names?prefix=SWE&suffix=Eval), [SWE-eval](https://openreview.net/forum?id=aPeeUApKtW) studies how coding agents reach a solution, while [SweEval](https://arxiv.org/abs/2505.17332) studies profanity in generated text. Open a cell for the sources and its [search record](verification/names.md).

<a name="benchmark-directory"></a>
## Choose a benchmark by the task

The [directory](@@SITE@@#directory) opens on editor’s picks. [All @@DIRECTORY_COUNT@@ records](@@SITE@@#browse?scope=all) include earlier editions and evaluations named in model releases. Start with the work you want a model to do:

- **Write a function or fix a repository?** [HumanEval](@@SITE@@#browse?entry=humaneval) gives a Python signature and docstring, then runs unit tests. [SWE-bench](@@SITE@@#browse?entry=swe-bench) gives an issue and a repository. A patch must fix the issue **and** pass the required regression tests. [Inspect the grader](https://github.com/SWE-bench/SWE-bench/blob/main/swebench/harness/grading.py).
- **Submit predictions or reproduce a paper?** [MLE-bench](@@SITE@@#browse?entry=mle-bench) grades a competition submission against human standings. [PaperBench](@@SITE@@#browse?entry=paperbench) asks for a reproduction; its [rubric](https://arxiv.org/pdf/2504.01848v1) scores the individual pieces of research work.

<details>
<summary>Read the field tables here on GitHub: inputs, outputs and scoring</summary>

@@FIELD_LINKS@@

</details>

<a name="contribute-with-your-agent"></a>
## Add or correct a record

**[Copy the PR prompt](@@SITE@@#contribute)** into Codex, Claude Code or another coding agent. On a card, the prompt includes the record ID. An evaluation doesn’t need “bench” in its name to belong here.

Give it the **edition, proposed change and primary source**. For example:

> Check the [SWE-bench Verified record](@@SITE@@#browse?entry=swe-bench-verified). In the [release note](https://openai.com/index/introducing-swe-bench-verified/), the “SWE-bench Verified” section specifies 500 human-reviewed tasks. If that detail is missing, add it to Verified, not to the original edition.

The agent checks for duplicates, edits the bilingual data and runs the checks. It opens a PR for a maintainer to review. [Manual contribution guide](CONTRIBUTING.md) · [PR checklist](.github/pull_request_template.md)

<a name="bench-in-arxiv-titles"></a>
## How often does “bench” turn up in paper titles?

[![Share of arXiv computer-science papers with “bench” in the title, January–September of each year. See the monthly counts for exact values.](docs/masthead-trend.svg)](@@SITE@@#trends)

This counts title matches, **not** new benchmarks: *benchmarking* counts; *HumanEval* doesn’t. [Explore by field](@@SITE@@#trends) · [Monthly counts](data/monthly.csv) · [Collection method](verification/trends.md)

<a name="community-vote"></a><a name="provenance-and-licenses"></a>
[Edition voting rules](vote-service/OPERATIONS.md) · [Sources, offline copies and licenses](guide/sources.md)
