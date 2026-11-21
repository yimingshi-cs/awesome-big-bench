![Awesome Big Bench — a field guide to AI evaluation](docs/masthead.svg)

# Awesome Big Bench

**Pick a benchmark by what it asks a model to do.** Then check the source, look up a name, or bring us a counterexample.

The name comes from a November 2026 conversation: [Xinye Li asked what PhDs can build as foundation models absorb more tasks](https://x.com/vclee8/status/2120212679470268893); [Greg Hu called it 大bench理论, the “Big Bench Theory”](https://x.com/greghxm_1/status/2120436200746242530). This is a reading guide inspired by that exchange, not the [BIG-bench benchmark](https://github.com/google/BIG-bench).

**[Browse benchmarks](https://yimingshi-cs.github.io/awesome-big-bench/)** · **[Find a name](https://yimingshi-cs.github.io/awesome-big-bench/#names)** · **[Explore trends](https://yimingshi-cs.github.io/awesome-big-bench/#trends)** · **[Contribute](CONTRIBUTING.md)**

## Where to start

| If you want to test… | Compare these tasks | What distinguishes them |
|---|---|---|
| Coding | [HumanEval](https://github.com/openai/human-eval) · [SWE-bench](https://www.swebench.com/) | Complete one function vs. repair a real repository. |
| An agent using a computer | [WebArena](https://webarena.dev/) · [OSWorld](https://os-world.github.io/) | Work inside websites vs. operate desktop applications. |
| Memory | [Needle in a Haystack](https://github.com/gkamradt/needle-in-a-haystack) · [LongMemEval](https://github.com/xiaowu0162/LongMemEval) | Retrieve a planted fact vs. answer from a history of conversations. |
| AI research | [MLE-bench](https://github.com/openai/mle-bench) · [PaperBench](https://openai.com/index/paperbench/) | Make an ML competition submission vs. reproduce a published paper. |

The full guide compares inputs, outputs and scoring for **@@COUNT@@ benchmarks across ten domains**. Click a benchmark for its original source; click its scoring rule for the protocol. Entries are selected for distinct tasks and useful comparisons, not ranked by popularity.

## Benchmark directory

@@JUMP@@

@@CATALOG@@

[Source table](data/famous.csv) · [Documented dates](verification/catalog.md) · [Candidates not yet in the guide](data/candidates_unverified.csv). A date identifies the event supported by its source, such as a v1 submission or public release. A project, a call for tasks and a finished release can have different dates.

## Benchmark names

**Even BenchBench is taken twice.** The [2024 paper](https://arxiv.org/abs/2407.13696) asks whether benchmarks agree; the [2026 paper](https://arxiv.org/abs/2603.20807) evaluates automated benchmark generation. Same name, different test.

Some names have no exact benchmark match in the sources checked:

@@GRID@@

[Names by field](https://yimingshi-cs.github.io/awesome-big-bench/#names) · [Search records and dates](verification/names.md) · [Report a match](https://github.com/yimingshi-cs/awesome-big-bench/issues/new?template=name.md). Unsearched combinations are not suggestions.

## “Bench” in arXiv titles

@@TREND@@

[See the nine chart topics and alternative cover](figures/) · [Monthly counts](data/monthly.csv) · [Collection method](data/README.md) · [Reproduction and discrepancies](verification/trends.md). The title census and the curated directory answer different questions: HumanEval belongs in the directory even though its paper title does not contain “bench”.

## Contribute

Found two papers with the same name, a better starting point for a task, or an incorrect date? [Open an issue](https://github.com/yimingshi-cs/awesome-big-bench/issues/new/choose) with the exact spelling and a primary source. PRs are welcome; [here is how to update both editions](CONTRIBUTING.md).

Compiled with AI assistance; corrections backed by primary sources are welcome. Code and original documentation: [MIT](LICENSE). Original catalog annotations: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Descriptive arXiv metadata remains [CC0](https://info.arxiv.org/help/api/tou.html). Project names and linked artwork belong to their respective owners; third-party logos are not bundled.
