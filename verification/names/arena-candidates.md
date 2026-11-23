# Arena name checks · 23 November 2026

**15 documented names; 14 with no qualifying match.** Each of the 29 existing prefixes was checked. The map groups names, not scoring methods: a preference arena and a test with deterministic answers can both occupy a cell.

| Prefix | Name as found | What it measures |
|---|---|---|
| SWE | [SWE Arena](https://bigcomputer-project.github.io/blog/swe-arena.html) | Compare model-generated software solutions in interactive head-to-head sessions. A distinct project from the WebDev track of Code Arena. |
| Agent | [Agent Arena](https://arena.ai/blog/agent-arena-methodology) | Arena reports real-world agent outcomes under this name. An unrelated robotics evaluation framework is also published as Agent-Arena. |
| Tool | [ToolArena](https://github.com/KatherLab/ToolArena) | Agents implement tools from repositories; task-specific tests check the resulting implementations. |
| Reasoning | [reasoning-arena](https://github.com/andrewbondman/reasoning-arena) | A public multi-provider benchmark grades reasoning tasks, tracking accuracy, latency and cost. The paper about a same-name trace-tournament training method is not the basis for this match. |
| MM | [mm-arena](https://github.com/h-a-forster/mm-arena) | Market-making games compare language agents with a Bayesian reference. Here “mm” means market making, not multimodal; the exact name is still taken. |
| Vision | [Vision Arena](https://arena.ai/leaderboard/vision) | Users compare model answers to visual prompts. The VisionArena paper separately documents preference data and distinguishes its automated VisionArena-Bench subset. |
| Video | [Video-Arena](https://arxiv.org/abs/2610.14158) | Video understanding is tested with game recordings and recorded state as ground truth, not a human preference vote. |
| Embodied | [Embodied Arena](https://arxiv.org/abs/2509.15273) | A unified evaluation platform for models on embodied AI tasks. |
| Robo | [RoboArena](https://robo-arena.github.io/) | A distributed, real-world evaluation suite for generalist robot policies. |
| Alignment | [Alignment Arena](https://github.com/iamhamidrezaee/Alignment-Arena) | A published dataset and scoring pipeline compare social bias in masked language models. |
| Memory | [MemoryArena](https://arxiv.org/abs/2602.16313) | An agent must reuse memory from an earlier session to complete a later, dependent task. |
| Research | [ResearchArena](https://arxiv.org/abs/2406.10291) | This benchmark measures finding, selecting and organizing research literature. A separate evaluation of research agents also uses ResearchArena. |
| PostTrain | [PostTrain Arena](https://posttrain.com/) | Measures how much a collection of training environments changes a fixed model’s performance on a held-out suite. Distinct from PostTrainBench. |
| Life | [LifeArena](https://www.designarena.ai/methodology/personal-assistant) | Real users compare personal assistants on their own tasks. Recent head-to-head preferences determine the ranking. |
| Bench | [BenchArena](https://github.com/edu-ap/bench-arena) | A public agent benchmark compares execution approaches by accuracy, time and token usage. A different BenchArena project describes only a mock benchmark engine. |

## Other combinations

No qualifying same-name benchmark was found for: **Terminal, CWE, GUI, Automation, Mathematicians, Robots, Long, Scientists, GDP, Frontier, Humanity, Meta, Benchmark, BenchBench**. These are scoped negative searches, not assertions of unused brands.

- [Frontier Arena](https://frontierarena.org/benchmarks/) already has a named public project; its inventory is unpublished. It is not recommended as an unclaimed brand. [GUI Testing Arena](https://arxiv.org/abs/2412.18426), [RobotArena Infinity](https://arxiv.org/abs/2510.23571) and [Long Range Arena](https://arxiv.org/abs/2011.04006) are real projects with different names.
- Exact names can also be reused across fields or teams. [mm-arena](https://github.com/h-a-forster/mm-arena) is market-making, not multimodal. [Reasoning Arena](https://arxiv.org/abs/2606.09380) describes a training method, but a separately implemented same-name evaluation makes the cell positive. Two distinct research-agent evaluations use ResearchArena.

## Evidence coverage

For every prefix: scanned 1,720,029 deduplicated arXiv titles (including the 798-record supplement); queried GitHub repository names for joined and hyphenated spellings (58 successful responses; at most 100 records per request); and queried Hugging Face datasets and Spaces for both spellings (116 successful responses, at most 50 items each). The existing first-party checks for SWE, Robo, Embodied and Video were retained. For the other 25 cells, additional web searches targeted joined, spaced and hyphenated forms, followed by source review. Ranking, search caps and snapshot dates limit negative conclusions. A substring or repository name alone is not a positive.

[Query and source receipts](matrix-searches.csv) · [Full decision table](../../data/names.csv) · [Name map](https://yiming-shi.com/awesome-big-bench/#names)
