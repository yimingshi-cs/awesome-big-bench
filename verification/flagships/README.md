# Which benchmarks did the flagship releases report?

Publicly defined tests reported in six focal releases through **22 November 2026**. A row records a release and evaluation configuration, not necessarily an independent benchmark. Scores are not compared across non-equivalent protocols.

[Homepage name map](https://yiming-shi.com/awesome-big-bench/) · [Two-release CSV](../../data/flagship_evaluations.csv) · [Family comparison](families.csv)

Earlier general-purpose and reasoning-model releases: [historical sources and limits](history/README.md) · [release records](../../data/flagship_history.csv) · [family gaps](site-coverage.csv) · [exact labels vs. related editions](site-editions.csv). The homepage uses both inventories; the comparison below is deliberately limited to the two focal releases per lab.

| Lab | Release | First release | Headline records | All public records | Distinct families |
|---|---|---|---:|---:|---:|
| OpenAI | GPT-6.2 Astra and Sol | 2026-11-17 | 12 | 40 | 39 |
| OpenAI | GPT-6.1 Sol | 2026-09-29 | 5 | 18 | 16 |
| Anthropic | Claude Fable 5.2 / Claude Mythos 5.2 | 2026-11-09 | 15 | 109 | 91 |
| Anthropic | Claude Fable 5.1 / Claude Mythos 5.1 | 2026-09-01 | 9 | 91 | 72 |
| Google | Gemini 4 Carbon | 2026-10-28 | 25 | 42 | 42 |
| Google | Gemini 4 Argon | 2026-10-13 | 5 | 47 | 47 |

## What recurred?

| Lab | Highlight families in both | Families in both full inventories | Examples in both publications |
|---|---:|---:|---|
| OpenAI | 2 | 9 | AutomationBench, Terminal-Bench-Science |
| Anthropic | 4 | 60 | AutomationBench, Humanity’s Last Exam, OSWorld, Terminal-Bench-Science |
| Google | 2 | 30 | Gray Swan IPI, Vals Index |

“Latest only” means **reported only in the newer of these documents**, not newly created. A family can recur with different versions, subsets, graders or model configurations. Each row links the reported result and the underlying protocol. Comparator names are not treated as new focal releases.

One report per lab documents release selection, sources inspected and exclusions: [OpenAI](openai.md) · [Anthropic](anthropic.md) · [Google](google.md). Explicitly internal versions and name-only mentions are excluded. Public protocols may have held-out questions or gated participation.

**Family normalization:** source_family preserves the source review’s grouping. The shared index reconciles AA Intelligence Index, Terminal-Bench-Science, No-CoT Reasoning Index, and capitalization of AAV capsid packaging prediction. SEC-bench Pro is not the original suite. Harvey’s own LAB and LAB-AA are separate administrations. Components of an index are not inferred unless results for the focal model were separately documented.

## OpenAI

[Sources and coverage](openai.md)

### GPT-6.1 Sol · 2026-09-29

Launch highlights:

- [DeepSWE v1.1](<https://deepswe.datacurve.ai/>) — Sol; agentic repository work, with reasoning-effort and cost comparisons. [Release evidence](<https://openai.com/index/introducing-gpt-6-1-sol/>).
- [GDP.pdf](<https://surgehq.ai/benchmarks/gdp-pdf>) — Sol; complex professional documents, not GDPval. [Release evidence](<https://openai.com/index/introducing-gpt-6-1-sol/>).
- [AutomationBench 1.0.6](<https://zapier.com/benchmarks>) — Sol; end-to-end business workflows. [Release evidence](<https://openai.com/index/introducing-gpt-6-1-sol/>).
- [OSWorld 2.0](<https://osworld-v2.xlang.ai/>) — Sol; offline set, v2026.08.08 release, partial reward. [Release evidence](<https://openai.com/index/introducing-gpt-6-1-sol/>).
- [Terminal-Bench Science 0.1](<https://www.terminal-bench-science.ai/>) — Sol; scientific workflows in a terminal. [Release evidence](<https://openai.com/index/introducing-gpt-6-1-sol/>).

### GPT-6.2 Astra and Sol · 2026-11-17

Launch highlights:

- [Agents’ Last Exam v1.1](<https://github.com/rdi-berkeley/agents-last-exam/tree/main/releases/v1.1>) — Astra and Sol; chart title specifies v1.1. [Release evidence](<https://openai.com/index/introducing-gpt-6-2-astra-sol/>).
- [Terminal-Bench-Science 0.1](<https://www.terminal-bench-science.ai/>) — Astra and Sol; agentic scientific workflows. [Release evidence](<https://openai.com/index/introducing-gpt-6-2-astra-sol/>).
- [Vals Science Index v1](<https://www.vals.ai/benchmarks/science_index>) — Composite; the launch reports the index, not standalone results on every component. [Release evidence](<https://openai.com/index/introducing-gpt-6-2-astra-sol/>).
- [Artificial Analysis Intelligence Index v5.0.1](<https://artificialanalysis.ai/methodology/intelligence-benchmarking>) — Astra and Sol; composite, not nine separately reported release metrics. [Release evidence](<https://openai.com/index/introducing-gpt-6-2-astra-sol/>).
- [BenchCAD 2.1 Core](<https://benchcad.com/blog/benchcad-2-1>) — Core track; do not conflate with the customized-harness track. [Release evidence](<https://openai.com/index/introducing-gpt-6-2-astra-sol/>).
- [AutomationBench 1.0.6](<https://zapier.com/benchmarks>) — Astra and Sol; business workflows. [Release evidence](<https://openai.com/index/introducing-gpt-6-2-astra-sol/>).
- [FrontierCode 2.0](<https://cognition.com/blog/frontier-code-2.0>) — Cognition’s version 2.0; not the separately run FrontierCode-AA implementation. [Release evidence](<https://openai.com/index/introducing-gpt-6-2-astra-sol/>).
- [LifeVal](<https://openai.com/index/lifeval/>) — Astra and Sol. The visible figure has no version suffix; do not turn its front-end asset ID into an edition. [Release evidence](<https://openai.com/index/introducing-gpt-6-2-astra-sol/>).
- [Harvey LAB-AA v1.1](<https://artificialanalysis.ai/evaluations/harvey-lab-aa>) — Artificial Analysis implementation; base-model results reported, in addition to a law-specific configuration. [Release evidence](<https://openai.com/index/introducing-gpt-6-2-astra-sol/>).
- [AA-AnalystAgent](<https://artificialanalysis.ai/evaluations/aa-analyst-agent>) — Astra; success on all five independent attempts. [Release evidence](<https://openai.com/index/introducing-gpt-6-2-astra-sol/>).
- [AA-3D](<https://artificialanalysis.ai/methodology/aa-3d>) — Astra and Sol; blinded preferences on generated interactive 3D scenes. [Release evidence](<https://openai.com/index/introducing-gpt-6-2-astra-sol/>).
- [DeepBinary](<https://openai.com/index/introducing-gpt-6-2-astra-sol/#cybersecurity-capabilities>) — Astra and Sol; launch configuration with cybersecurity safeguards disabled. [Release evidence](<https://openai.com/index/introducing-gpt-6-2-astra-sol/>).

## Anthropic

[Sources and coverage](anthropic.md)

### Claude Fable 5.1 / Claude Mythos 5.1 · 2026-09-01

Launch highlights:

- [AutomationBench](<https://assets.claude.com/0339e6a7c5c7b87f5c07798616dc32c215d14235.pdf#page=195>) — Zapier private held-out tasks; production safeguards [Release evidence](<https://www.anthropic.com/claude-fable-and-mythos-5-1>).
- [CursorBench 3.2.0](<https://assets.claude.com/0339e6a7c5c7b87f5c07798616dc32c215d14235.pdf#page=172>) — Cursor production harness [Release evidence](<https://www.anthropic.com/claude-fable-and-mythos-5-1>).
- [GDPval-AA v2](<https://assets.claude.com/0339e6a7c5c7b87f5c07798616dc32c215d14235.pdf#page=193>) — Independent Artificial Analysis grading [Release evidence](<https://www.anthropic.com/claude-fable-and-mythos-5-1>).
- [Humanity's Last Exam](<https://assets.claude.com/0339e6a7c5c7b87f5c07798616dc32c215d14235.pdf#page=176>) — No tools [Release evidence](<https://www.anthropic.com/claude-fable-and-mythos-5-1>).
- [Humanity's Last Exam](<https://assets.claude.com/0339e6a7c5c7b87f5c07798616dc32c215d14235.pdf#page=176>) — With tools [Release evidence](<https://www.anthropic.com/claude-fable-and-mythos-5-1>).
- [OSWorld 2.0](<https://assets.claude.com/0339e6a7c5c7b87f5c07798616dc32c215d14235.pdf#page=188>) — Partial-credit scoring; August 2026 task release [Release evidence](<https://www.anthropic.com/claude-fable-and-mythos-5-1>).
- [OSWorld 2.0](<https://assets.claude.com/0339e6a7c5c7b87f5c07798616dc32c215d14235.pdf#page=188>) — Strict scoring; August 2026 task release [Release evidence](<https://www.anthropic.com/claude-fable-and-mythos-5-1>).
- [Terminal-Bench 4.0](<https://assets.claude.com/0339e6a7c5c7b87f5c07798616dc32c215d14235.pdf#page=171>) — Fable and Mythos configurations; public named task release, standard Claude Code execution; comparator runs called an internal setup, not a private benchmark version [Release evidence](<https://www.anthropic.com/claude-fable-and-mythos-5-1>).
- [Terminal-Bench-Science 0.1](<https://assets.claude.com/0339e6a7c5c7b87f5c07798616dc32c215d14235.pdf#page=171>) — Research workflow tasks; public named task release, standard Claude Code execution; comparator runs called an internal setup, not a private benchmark version [Release evidence](<https://www.anthropic.com/claude-fable-and-mythos-5-1>).

### Claude Fable 5.2 / Claude Mythos 5.2 · 2026-11-09

Launch highlights:

- [AA-Briefcase v1.1](<https://assets.claude.com/27d60918d218125e7504bc7354c4b4626ec56b11.pdf#page=239>) — Elo [Release evidence](<https://www.anthropic.com/claude-fable-and-mythos-5-2>).
- [AA-Briefcase v1.1](<https://assets.claude.com/27d60918d218125e7504bc7354c4b4626ec56b11.pdf#page=239>) — Rubric [Release evidence](<https://www.anthropic.com/claude-fable-and-mythos-5-2>).
- [AutomationBench](<https://assets.claude.com/27d60918d218125e7504bc7354c4b4626ec56b11.pdf#page=240>) — Zapier private held-out AutomationBench 1.0.6; 657 tasks per effort level [Release evidence](<https://www.anthropic.com/claude-fable-and-mythos-5-2>).
- [CVE Rediscovery](<https://assets.claude.com/27d60918d218125e7504bc7354c4b4626ec56b11.pdf#page=253>) — Mythos; October 2026 cohort; one attempt per advisory; no safeguards (provenance only); 1,829 advisories; publicly specified advisory cohort and rule, no internal-version designation in §8.19 [Release evidence](<https://www.anthropic.com/claude-fable-and-mythos-5-2>).
- [Chartography (no tools)](<https://assets.claude.com/27d60918d218125e7504bc7354c4b4626ec56b11.pdf#page=229>) — No tools; original public tasks and official answer ranges, same judge as Surge leaderboard; separate Anthropic-redrawn charts excluded [Release evidence](<https://www.anthropic.com/claude-fable-and-mythos-5-2>).
- [CyScenarioBench](<https://assets.claude.com/27d60918d218125e7504bc7354c4b4626ec56b11.pdf#page=49>) — Mythos; controlled security evaluation; lab-specific tasks, not a common cross-vendor task set; developed by Irregular, withheld tasks, pre-release Mythos snapshot; not Anthropic’s own internal task set [Release evidence](<https://www.anthropic.com/claude-fable-and-mythos-5-2>).
- [De novo binder design (24 hr)](<https://assets.claude.com/27d60918d218125e7504bc7354c4b4626ec56b11.pdf#page=251>) — Mythos; 24-hour condition; safeguards off; not deployed Fable performance [Release evidence](<https://www.anthropic.com/claude-fable-and-mythos-5-2>).
- [FrontierCode 2.0](<https://assets.claude.com/27d60918d218125e7504bc7354c4b4626ec56b11.pdf#page=208>) — Fable; xhigh effort in launch table [Release evidence](<https://www.anthropic.com/claude-fable-and-mythos-5-2>).
- [FrontierSWE v2](<https://assets.claude.com/27d60918d218125e7504bc7354c4b4626ec56b11.pdf#page=212>) — 34 tasks [Release evidence](<https://www.anthropic.com/claude-fable-and-mythos-5-2>).
- [Humanity’s Last Exam (with tools)](<https://assets.claude.com/27d60918d218125e7504bc7354c4b4626ec56b11.pdf#page=216>) — With tools [Release evidence](<https://www.anthropic.com/claude-fable-and-mythos-5-2>).
- [OSWorld 2.1 (offline set, partial)](<https://assets.claude.com/27d60918d218125e7504bc7354c4b4626ec56b11.pdf#page=234>) — 82 tasks from offline release; partial checkpoint credit [Release evidence](<https://www.anthropic.com/claude-fable-and-mythos-5-2>).
- [Remote Labor Index (RLI)](<https://assets.claude.com/27d60918d218125e7504bc7354c4b4626ec56b11.pdf#page=242>) — High effort [Release evidence](<https://www.anthropic.com/claude-fable-and-mythos-5-2>).
- [RoboDojo Sim](<https://robodojo-benchmark.com/>) — Anthropic internal runs of public simulator; highest available effort; not a physical-robot benchmark score; public simulator/protocol, internal execution only—not called an internal version [Release evidence](<https://www.anthropic.com/claude-fable-and-mythos-5-2>).
- [Terminal-Bench-Science 0.1](<https://assets.claude.com/27d60918d218125e7504bc7354c4b4626ec56b11.pdf#page=211>) — Fable and Mythos configurations [Release evidence](<https://www.anthropic.com/claude-fable-and-mythos-5-2>).
- [WANDR (relaxed score)](<https://assets.claude.com/27d60918d218125e7504bc7354c4b4626ec56b11.pdf#page=219>) — Anthropic modified evaluation; relaxed score, not the original Perplexity protocol; public benchmark and disclosed recipe changes, not the provider’s leaderboard or an explicitly private version [Release evidence](<https://www.anthropic.com/claude-fable-and-mythos-5-2>).

## Google

[Sources and coverage](google.md)

### Gemini 4 Argon · 2026-10-13

Launch highlights:

- [Vals Index](<https://www.vals.ai/benchmarks/vals_index>) — Launch does not name a version. Do not substitute Carbon’s v2.2 index or a later Vals leaderboard. [Release evidence](<https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-argon/>).
- [ERQA](<https://github.com/embodiedreasoning/ERQA>) — Embodied Reasoning QA; the public protocol tests visual and physical reasoning. [Release evidence](<https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-argon/>).
- [RareBench (Gamow Labs)](<https://gamowlabs.com/rarebench-0-1>) — External partner’s held-out clinical cases; benchmark and metric independently defined. Do not confuse with unrelated RareBench projects. [Release evidence](<https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-argon/>).
- [LabBench (Gamow Labs)](<https://gamowlabs.com/labbench-benchmarking-ai-wet-lab-decisions>) — External partner’s held-out lab decisions, not Edison/FutureHouse LABBench2. [Release evidence](<https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-argon/>).
- [Gray Swan Indirect Prompt Injection Benchmark](<https://www.grayswan.ai/blog/your-ai-agent-can-be-compromised-youd-never-know>) — Third-party adaptive human-authored prompt-injection evaluation. [Release evidence](<https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-argon/>).

### Gemini 4 Carbon · 2026-10-28

Launch highlights:

- [Artificial Analysis Intelligence Index v5.0](<https://artificialanalysis.ai/articles/artificial-analysis-intelligence-index-v5/>) — Tool-enabled index; components not automatically counted as stand-alone launch benchmarks. [Release evidence](<https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-carbon/>).
- [Vals Index v2.2](<https://www.vals.ai/benchmarks/vals_index>) — v2.2 as labelled; an economic-task index. [Release evidence](<https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-carbon/>).
- [SWE-sweep](<https://swesweep.com/>) — Mini-SWE-agent harness; subtask-weighted reward. [Release evidence](<https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-carbon/>).
- [FrontierSWE 2](<https://www.frontierswe.com/>) — Proximal public leaderboard. [Release evidence](<https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-carbon/>).
- [Terminal-Bench 4.0 (AA)](<https://www.tbench.ai/news/terminal-bench-4-0>) — Artificial Analysis run of v4.0; not v4.1. [Release evidence](<https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-carbon/>).
- [Agents’ Last Exam v1.1](<https://agents-last-exam.org/leaderboard>) — 122-task October 17 release, before October 26 revision; five-hour ALE-Claw runs; averaged rubric score. [Release evidence](<https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-carbon/>).
- [OSWorld 2.1](<https://github.com/xlang-ai/OSWorld-V2/releases>) — Offline/no-internet 82-task subset, partial credit, best overall of three single-attempt runs, 500 steps. [Release evidence](<https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-carbon/>).
- [AutomationBench](<https://zapier.com/benchmarks>) — Zapier leaderboard, private set. Distinct scoring provenance from AutomationBench-AA. [Release evidence](<https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-carbon/>).
- [Vending-Bench 2](<https://andonlabs.com/evals/vending-bench-2>) — Ending bank balance; Andon Labs leaderboard. [Release evidence](<https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-carbon/>).
- [Chartography](<https://surgehq.ai/benchmarks/chartography>) — No tools. [Release evidence](<https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-carbon/>).
- [Blueprint-Bench 2](<https://andonlabs.com/evals/blueprint-bench-2>) — Andon Labs similarity score. [Release evidence](<https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-carbon/>).
- [GraphWalks](<https://huggingface.co/datasets/openai/graphwalks>) — BFS F1, 200 items in the 256k–1M token bucket; no ≤128k result in the release table. [Release evidence](<https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-carbon/>).
- [RiemannBench](<https://surgehq.ai/benchmarks/riemann-bench>) — Surge AI leaderboard. [Release evidence](<https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-carbon/>).
- [Terminal-Bench Science 0.1 (AA)](<https://www.terminal-bench-science.ai/>) — Artificial Analysis result, not Argon’s self-computed run. [Release evidence](<https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-carbon/>).
- [CWE-bench v1](<https://cwe-bench.com/?v=v1>) — Methodology resolves unversioned chart label to v1. Fairwind cyber configuration. [Release evidence](<https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-carbon/>).
- [ExploitGym](<https://www.cybergym.io/exploitgym/>) — Fairwind cyber configuration; capability evaluation, not resistance to misuse. [Release evidence](<https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-carbon/>).
- [SEC-bench Pro](<https://sec-bench.github.io/>) — Fairwind cyber configuration; May 2026 JavaScript-engine split (183 tasks). [Release evidence](<https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-carbon/>).
- [Gray Swan Indirect Prompt Injection Benchmark](<https://www.grayswan.ai/blog/your-ai-agent-can-be-compromised-youd-never-know>) — Third-party adaptive human-authored prompt-injection evaluation. [Release evidence](<https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-carbon/>).
- [WebDev Arena](<https://arena.ai/blog/webdev-arena>) — Arena human preferences for web-development output. [Release evidence](<https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-carbon/>).
- [CursorBench 4.0](<https://cursor.com/cursorbench>) — Original 4.0, not Neon’s 4.1; evaluation record referenced by release. [Release evidence](<https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-carbon-now-available/>).
- [WANDR](<https://arxiv.org/abs/2608.14747>) — Perplexity research-agent retrieval evaluation. [Release evidence](<https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-carbon-now-available/>).
- [Multimodal Knowledge Agent (MKA)](<https://blog.google/innovation-and-ai/models-and-research/gemini-models/multimodal-knowledge-agent-benchmark/>) — Agentic multimodal work; Google–Artificial Analysis collaboration. [Release evidence](<https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-carbon-now-available/>).
- [ExploitBench](<https://arxiv.org/abs/2605.14153>) — Safety rollout explicitly mentions using tasks as environment seeds, not a canonical capability score; separate direct capability assessment in safety report §7.1.1. [Release evidence](<https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-carbon-now-available/>).
- [CyScenarioBench](<https://irregular.com/publications/cyscenariobench>) — Publicly documented Irregular / Google benchmark. Release uses scenarios for safeguard evaluation; separate capability assessment in safety report §3.2.2. [Release evidence](<https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-carbon-now-available/>).
- [Agentic honesty benchmark](<https://storage.googleapis.com/deepmind-media/gemini/gemini_4_carbon_safety_report.pdf#page=70>) — Report-defined 375 tasks across five categories; strict task pass rather than a self-rating. Argon in this November comparison is not an October release claim. [Release evidence](<https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-carbon-now-available/>).
