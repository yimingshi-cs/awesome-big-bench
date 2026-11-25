# Benchmark name checks · 25 November 2026

The homepage opens on the full **30 × 11** matrix. The map distinguishes names already used by an AI benchmark from names that still look open.

- **Green:** an original paper, task suite, implementation or scored evaluation identifies a benchmark of this name. A published earlier name is labelled as such in the cell details.
- **Dark green:** a taken name whose benchmark family appears in at least one of the reviewed [flagship or reasoning-model reports](flagships/). Open the name for the exact versions. The accent marks documented use, not a quality score.
- **Light grey:** the recorded searches did not establish such a benchmark. An unrelated repository, commercial service, model or training-only environment does not use up the name for this purpose. This is not a domain-registration or trademark search.

The 330 decisions and dates are in [names.csv](../data/names.csv). The [2,494 individual query and source records](names/matrix-searches.csv) include failed requests marked as failures. Click a cell on the [name map](https://yiming-shi.com/awesome-big-bench/) for its evidence or to report a correction on GitHub.

## Arena column

All 29 prefix combinations were researched. Fifteen have a documented same-name AI evaluation; fourteen did not yield a qualifying match. See [the decisions, edge cases and search scope](names/arena-candidates.md). Dojo, Gym and Arena are grouped as naming **venues**, not scoring methods.

## Matrix revision

Four prefixes (Researchers, Awesome, Benchmarks and Benches) and two endings (Mock and Last Code Exam) were retired; this is a display decision, not a change of verdict. In particular, [Humanity’s Last Code Exam](https://arxiv.org/abs/2506.12713) remains a real benchmark. The [previous 297-cell snapshot](https://github.com/yimingshi-cs/awesome-big-bench/tree/98d7b4530d9a5dc3e3e4fe376a546946883fded4) preserves those records.

The [previous 300-cell edition](https://github.com/yimingshi-cs/awesome-big-bench/tree/9c148290d62919513023bc7fc77082789f66ea21) also includes the retired Coders row. No verdict was changed by removing that row.

That edition added Terminal, CWE, Long, PostTrain, GDP, Life and Automation, plus the ending **val**. For 207 retained pairs, the previous evidence and check dates stand. For 93 new pairs we scanned the 1,719,231-title arXiv snapshot plus 798 additional records and queried GitHub names, Hub datasets and bibliographic indexes; capped results and unsuccessful requests are recorded. A same-name tool or different spelling is not a positive. For example, CWEval belongs at CWE × val; LifeEval and LifeVal are distinct.

## Coverage of the preceding searches

All combinations were checked. Search variants included joined, spaced, hyphenated and possessive forms. We retained meaningful distinctions (e.g. “²”/“squared” versus the bare stem). We inspected likely matches to distinguish an evaluation from a term that merely appears in a paper or package. The matrix groups the **prefix** by topic, not every project carrying that prefix. The directory classifies the actual benchmarks.

| Prefixes checked | Sources and limits |
|---|---|
| SWE, Coders, Agent, GUI, Tool, MM, Vision, Video, Embodied | Public web discovery, the pinned arXiv title scan, project/dataset searches and Crossref. Live arXiv/OpenAlex failures are labelled; they are not evidence of absence. |
| Robo, Robots, Reasoning, Mathematicians, Memory, Alignment, Research, Researchers, Scientists | Fixed arXiv titles, OpenAlex titles and Hugging Face datasets; selected repositories, Spaces and primary material were inspected to resolve plausible uses. |
| Bench, BenchBench, Benchmark, Benchmarks, Benches, Meta, Frontier, Humanity, Awesome | Fixed arXiv titles, GitHub repository names, Hugging Face datasets and Europe PMC title searches. Additional Crossref queries and primary sources are recorded where used. |

The arXiv scan used the relevant row groups of [this pinned metadata release](https://huggingface.co/datasets/librarian-bots/arxiv-metadata-snapshot/tree/c428226b689a0e17db2cd55265133b9eca15d97f/data) and the later title-census supplement. It is not a live, all-time index. Other searches are dated and their ranking and coverage can change.

[Previous narrow search](names/search-log.csv) · [Previous field checks](names/field-checks-2026-11.csv). Those earlier checks recorded other uses as a separate category; the current binary verdicts apply only to AI benchmarks.

### Game row · 25 November 2026

The homepage groups Game under Embodied for browsing. Membership in this row does not turn a text-based strategic game into a physical robotics task. Five names have positive evaluation evidence; six had no qualifying hit in the dated searches. [Receipts for all eleven combinations](matrix/game.md). The [Kaggle platform](https://www.kaggle.com/game-arena) rates game play, as does the separate [human–model GameArena](https://arxiv.org/abs/2412.06394); [GameCraft-Bench](https://arxiv.org/abs/2606.17861) instead evaluates game creation.
