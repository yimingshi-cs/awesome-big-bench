# Catalog sources

The [directory](../data/famous.csv) records a documented date for each benchmark. The [task table](../data/catalog_tasks.csv) records its input, output, scoring method and primary protocol. Join by slug. Candidates are kept in [a separate table](../data/candidates_unverified.csv).

A v1 date is the first arXiv submission, not necessarily the public launch. When a different event has stronger dated evidence, its type is recorded below. An affiliation is shown only if the source supports the first-listed person's attribution; a publisher, host or email address is not an affiliation. The project links identify resources; this repository does not distribute their logos.

| Benchmark | Dated event | What happened |
|---|---|---|
| DocVQA | [2020-03-16](<https://rrc.cvc.uab.cat/?ch=17&com=downloads>) | Availability of the first training set; the test set followed on April 20. |
| CodeXGLUE | [2020-09-28](<https://www.microsoft.com/en-us/research/publication/codexglue-a-machine-learning-benchmark-dataset-for-code-understanding-and-generation/>) | Microsoft tool listing, followed the next day by its public announcement. |
| BIG-bench | [2021-05-07](<https://welmworkshop.github.io/>) | Initial results presented at the ICLR workshop; the full preprint followed in June 2022. |
| CodeContests | [2022-02-02](<https://deepmind.google/blog/competitive-programming-with-alphacode/>) | Original AlphaCode announcement naming the competition dataset. |
| BEHAVIOR-1K | [2022-08-15](<https://openreview.net/forum?id=_8DoIe8G3t>) | Public blind CoRL submission, not an environment release. |
| ManiSkill2 | [2022-08-15](<https://github.com/mani-skill/ManiSkill/releases/tag/v0.2.0>) | Public software release v0.2.0; not necessarily the initial launch. |
| VIMA-Bench | [2022-09-29](<https://openreview.net/forum?id=hzjQWjPC04A>) | Blind ICLR paper became public. VIMA is the policy and VIMA-Bench is the evaluation suite. |
| Chatbot Arena (LMArena) | [2023-05-03](<https://www.lmsys.org/blog/2023-05-03-arena/>) | Dated announcement of the arena; voting had already started. |
| LongBench | [2023-07-31](<https://github.com/THUDM/LongBench/issues/1>) | Public integration discussion: the project was available by this date. |
| Needle-in-a-Haystack | [2023-11-08](<https://x.com/GregKamradt/status/1722386725635580292>) | Original author announcement (UTC); the code followed. |
| Berkeley Function-Calling Leaderboard (BFCL) | [2024-02-26](<https://gorilla.cs.berkeley.edu/blog.html>) | First leaderboard announcement. Later paper and leaderboard versions are separate events. |
| SWE-bench Verified | [2024-08-13](<https://openai.com/index/introducing-swe-bench-verified/>) | Public release of the 500-item human-validated subset, not new human grading of patches. |
| Humanity's Last Exam | [2025-01-23](<https://scale.com/blog/humanitys-last-exam-results>) | Release of the exam and results, one day before the arXiv v1 submission. |
| ARC-AGI-2 | [2025-03-24](<https://arcprize.org/blog/announcing-arc-agi-2-and-arc-prize-2025>) | Benchmark launch, before the technical paper. |
| Terminal-Bench | [2025-05-19](<https://www.tbench.ai/news/announcement>) | Core-v0 announcement, not the v1.0 or v2.0 release. |
| FrontierRSI | [2026-11-18](<https://x.com/quasicoh/status/2123114502065627580>) | Public project announcement. This suite tests prerequisites for AI improvement, not confirmed recursive gains. |

For any correction, link the dated announcement, paper version, protocol or repository record that should replace the current evidence.

### Additional task references

- [Toolathlon paper](https://arxiv.org/abs/2510.25726) (29 October 2025): the original project; the [maintainers](https://github.com/hkust-nlp/Toolathlon) date Toolathlon-Verified separately. The CUA link covers both, with report versions kept distinct.
- [APEX-Agents](https://www.mercor.com/blog/introducing-apex-agents/) (21 January 2026): Mercor's professional agent tasks, not the APEX umbrella or its tool-free assessment. See the [grading method](https://www.mercor.com/apex/methodology/).
- [ARC-AGI-3 technical report](https://arxiv.org/abs/2603.24621) (v1, 24 March 2026): the directory classifies the interactive task as Reasoning. Its homepage shortcut is under Coding for readers building programmatic solvers; the metric is human-relative action efficiency, not code correctness.
- [BrowseComp](https://openai.com/index/browsecomp/) (10 April 2025), [AndroidWorld](https://arxiv.org/abs/2405.14573) (paper v1, 23 May 2024) and [SciCode](https://arxiv.org/abs/2407.13168) (paper v1, 18 July 2024) cover web research, phone control and scientific coding. Of these three, only BrowseComp is a homepage field reference.
- [Terminal-Bench-Science 0.1](https://www.terminal-bench-science.ai/announcement), released 27 August 2026: 70 researcher-contributed workflows. The terminal is the interface; task-specific tests grade scientific artifacts. Count the Science 0.1 label under this family, never under the original Terminal-Bench.
