# Benchmark name checks · 22 November 2026

The homepage opens on the full **27 × 11** matrix. The two colors answer one question: **did we find an AI evaluation using this name?**

- **Green:** an original paper, task suite, implementation or scored evaluation identifies a benchmark of this name. A published earlier name is labelled as such in the cell details.
- **Light grey:** the recorded searches did not establish such a benchmark. An unrelated repository, commercial service, model or training-only environment does not use up the name for this purpose. This is not a domain-registration or trademark search.

The 297 decisions and dates are in [names.csv](../data/names.csv). The [2,314 individual query and source records](names/matrix-searches.csv) include failed requests marked as failures. Click a cell on the [name map](https://yiming-shi.com/awesome-big-bench/) for its evidence or to report a correction on GitHub.

## Coverage

All combinations were checked. Search variants included joined, spaced, hyphenated and possessive forms. We retained meaningful distinctions (e.g. “²”/“squared” versus the bare stem). We inspected likely matches to distinguish an evaluation from a term that merely appears in a paper or package. The matrix groups the **prefix** by topic, not every project carrying that prefix. The directory classifies the actual benchmarks.

| Prefixes checked | Sources and limits |
|---|---|
| SWE, Coders, Agent, GUI, Tool, MM, Vision, Video, Embodied | Public web discovery, the pinned arXiv title scan, project/dataset searches and Crossref. Live arXiv/OpenAlex failures are labelled; they are not evidence of absence. |
| Robo, Robots, Reasoning, Mathematicians, Memory, Alignment, Research, Researchers, Scientists | Fixed arXiv titles, OpenAlex titles and Hugging Face datasets; selected repositories, Spaces and primary material were inspected to resolve plausible uses. |
| Bench, BenchBench, Benchmark, Benchmarks, Benches, Meta, Frontier, Humanity, Awesome | Fixed arXiv titles, GitHub repository names, Hugging Face datasets and Europe PMC title searches. Additional Crossref queries and primary sources are recorded where used. |

The arXiv scan used the relevant row groups of [this pinned metadata release](https://huggingface.co/datasets/librarian-bots/arxiv-metadata-snapshot/tree/c428226b689a0e17db2cd55265133b9eca15d97f/data) and the later title-census supplement. It is not a live, all-time index. Other searches are dated and their ranking and coverage can change.

[Previous narrow search](names/search-log.csv) · [Previous field checks](names/field-checks-2026-11.csv). Those earlier checks recorded other uses as a separate category; the current binary verdicts apply only to AI benchmarks.
