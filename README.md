![Awesome Big Bench — a field guide to AI evaluation](docs/masthead.svg)

# Awesome Big Bench

**Pick a benchmark by what it asks a model to do.** Then check the source, look up a name, or bring us a counterexample.

The name comes from a November 2026 conversation: [Xinye Li asked what PhDs can build as foundation models absorb more tasks](https://x.com/vclee8/status/2120212679470268893); [Greg Hu called it 大bench理论, the “Big Bench Theory”](https://x.com/greghxm_1/status/2120436200746242530). This is a reading guide inspired by that exchange, not the [BIG-bench benchmark](https://github.com/google/BIG-bench).

**[Browse benchmarks](https://yiming-shi.com/awesome-big-bench/)** · **[Find a name](https://yiming-shi.com/awesome-big-bench/#names)** · **[Explore trends](https://yiming-shi.com/awesome-big-bench/#trends)** · **[Contribute](CONTRIBUTING.md)**

## Where to start

| If you want to test… | Compare these tasks | What distinguishes them |
|---|---|---|
| Coding | [HumanEval](https://github.com/openai/human-eval) · [SWE-bench](https://www.swebench.com/) | Complete one function vs. repair a real repository. |
| An agent using a computer | [WebArena](https://webarena.dev/) · [OSWorld](https://os-world.github.io/) | Work inside websites vs. operate desktop applications. |
| Memory | [Needle in a Haystack](https://github.com/gkamradt/needle-in-a-haystack) · [LongMemEval](https://github.com/xiaowu0162/LongMemEval) | Retrieve a planted fact vs. answer from a history of conversations. |
| AI research | [MLE-bench](https://github.com/openai/mle-bench) · [PaperBench](https://openai.com/index/paperbench/) | Make an ML competition submission vs. reproduce a published paper. |

The full guide compares inputs, outputs and scoring for **92 benchmarks across ten domains**. Click a benchmark for its original source; click its scoring rule for the protocol. Entries are selected for distinct tasks and useful comparisons, not ranked by popularity.

## Benchmark directory

[Coding](#domain-coding) · [CUA](#domain-cua) · [Reasoning](#domain-reasoning) · [Multimodal](#domain-multimodal) · [Embodied](#domain-embodied) · [Safety](#domain-safety) · [Long-context & Memory](#domain-long-context) · [AutoResearch](#domain-ai-research) · [RSI](#domain-rsi) · [General](#domain-general)

<a id="domain-coding"></a>
### Coding

| Benchmark · primary source | Given | Must produce | Judged by · protocol |
|---|---|---|---|
| [CodeXGLUE](<https://github.com/microsoft/CodeXGLUE>) | Code, text queries or paired snippets, by subtask | Labels, rankings, code or documentation | [Task-specific metrics including accuracy, F1 and BLEU](<https://arxiv.org/abs/2102.04664v1>) |
| [APPS](<https://github.com/hendrycks/apps>) | Programming problem and required input/output behavior | Python solution program | [Fraction of tests passed and all-tests accuracy](<https://arxiv.org/abs/2105.09938v1>) |
| [HumanEval](<https://github.com/openai/human-eval>) | Python function signature, docstring and examples | Function implementation | [Unit-test success, summarized as pass@k](<https://github.com/openai/human-eval>) |
| [MBPP](<https://github.com/google-research/google-research/tree/master/mbpp>) | Short Python task description and test assertions | Python program implementing the requested behavior | [Generated code run against unit tests](<https://arxiv.org/abs/2108.07732v1>) |
| [CodeContests](<https://github.com/google-deepmind/code_contests>) | Programming problem with input/output specification | Complete runnable program | [Program output checked on test cases](<https://github.com/google-deepmind/code_contests>) |
| [EvalPlus](<https://evalplus.github.io/>) | Python synthesis prompts from the underlying benchmark | Python function implementations | [Pass@k under expanded functional test suites](<https://arxiv.org/abs/2305.01210v1>) |
| [BIRD](<https://bird-bench.github.io/>) | Database, schema, question and external knowledge | Executable SQL query | [Execution accuracy and efficiency of correct queries](<https://arxiv.org/abs/2305.03111v1>) |
| [SWE-bench](<https://www.swebench.com/>) | Repository snapshot and corresponding GitHub issue | Patch to the repository | [Required issue-fixing and regression tests must pass](<https://github.com/SWE-bench/SWE-bench/blob/main/swebench/harness/grading.py>) |
| [LiveCodeBench](<https://livecodebench.github.io/>) | Dated contest problem, code or execution example | Program, repair, execution result or predicted output | [Test-case success or answer matching, by subtask](<https://arxiv.org/pdf/2403.07974v1>) |
| [SWE-bench Verified](<https://openai.com/index/introducing-swe-bench-verified/>) | Human-validated issue and matching repository snapshot | Patch to the repository | [Same test-based resolution criterion, on 500 validated issues](<https://openai.com/index/introducing-swe-bench-verified/>) |
| [Terminal-Bench](<https://www.tbench.ai/news/announcement>) | Terminal task instruction and a prepared container | Shell actions and resulting files or system state | [Task-specific tests determine completion](<https://www.tbench.ai/news/announcement>) |

<a id="domain-cua"></a>
### CUA

| Benchmark · primary source | Given | Must produce | Judged by · protocol |
|---|---|---|---|
| [WebShop](<https://webshop-pnlp.github.io/>) | Shopping request and simulated online store | Searches, page actions and final product selection | [Reward for matching requested attributes, options and price](<https://arxiv.org/abs/2207.01206v1>) |
| [API-Bank](<https://github.com/AlibabaResearch/DAMO-ConvAI/tree/main/api-bank>) | User dialogue, API descriptions and execution environment | API calls and follow-up dialogue responses | [API-call correctness; ROUGE-L for follow-up responses](<https://arxiv.org/abs/2304.08244v1>) |
| [Mind2Web](<https://osu-nlp-group.github.io/Mind2Web/>) | Task, webpage snapshot and action history | Target element, operation and optional value | [Element accuracy, operation F1 and step/task success](<https://arxiv.org/abs/2306.06070v1>) |
| [WebArena](<https://webarena.dev/>) | User goal and an interactive replica website | Browser actions and, when requested, a written answer | [Task-specific checks on page state, URL or answer](<https://github.com/web-arena-x/webarena/blob/main/evaluation_harness/evaluators.py>) |
| [ToolBench](<https://github.com/OpenBMB/ToolBench>) | User instruction and available API documentation | Tool-call trajectory and final answer | [ToolEval model judges task pass rate and pairwise wins](<https://arxiv.org/abs/2307.16789v1>) |
| [AgentBench](<https://github.com/THUDM/AgentBench>) | Task, environment state and available actions | Sequence of environment-specific actions or responses | [Environment-specific success or reward, then aggregate scoring](<https://arxiv.org/abs/2308.03688v1>) |
| [GAIA](<https://arxiv.org/abs/2311.12983>) | Real-world question, sometimes with an attached file | Short text, number or list | [Normalized final answer matched against the reference](<https://huggingface.co/spaces/gaia-benchmark/leaderboard/blob/main/scorer.py>) |
| [Berkeley Function-Calling Leaderboard (BFCL)](<https://gorilla.cs.berkeley.edu/blogs/8_berkeley_function_calling_leaderboard.html>) | User request and available function signatures | Function calls with arguments, or no call | [Syntax-tree matching or execution checks by category](<https://gorilla.cs.berkeley.edu/blogs/8_berkeley_function_calling_leaderboard.html>) |
| [OSWorld](<https://os-world.github.io/>) | Natural-language instruction and initialized desktop environment | Desktop actions that change applications or files | [Task-specific execution checks on the resulting state](<https://arxiv.org/pdf/2404.07972v1>) |
| [τ-bench](<https://github.com/sierra-research/tau-bench>) | Simulated customer, domain policy, tools and database | Tool actions and messages to the customer | [Final database state and required reply contents checked](<https://github.com/sierra-research/tau-bench/blob/main/tau_bench/envs/base.py>) |

<a id="domain-reasoning"></a>
### Reasoning

| Benchmark · primary source | Given | Must produce | Judged by · protocol |
|---|---|---|---|
| [ARC-AGI](<https://github.com/fchollet/ARC-AGI>) | Example input/output grid pairs and a test grid | Predicted output grid | [Grid dimensions and all cell values must match](<https://arxiv.org/abs/1911.01547v1>) |
| [MATH](<https://github.com/hendrycks/math>) | Competition math problem | Final mathematical answer, optionally with working | [Normalized final answer compared with the reference](<https://github.com/hendrycks/math>) |
| [GSM8K](<https://github.com/openai/grade-school-math>) | Grade-school math word problem | Numerical final answer, optionally with working | [Final number matched against the reference answer](<https://github.com/openai/grade-school-math>) |
| [BIG-bench Hard](<https://github.com/suzgunmirac/BIG-Bench-Hard>) | Task prompt with choices or short-answer format | Final choice or task-specific answer | [Accuracy against reference answers across 23 tasks](<https://arxiv.org/abs/2210.09261v1>) |
| [GPQA](<https://github.com/idavidrein/gpqa>) | Expert-written science question and four options | One selected answer | [Accuracy against expert-provided answer keys](<https://arxiv.org/pdf/2311.12022v1>) |
| [OlympiadBench](<https://arxiv.org/abs/2402.14008>) | Olympiad problem, sometimes with a diagram | Mathematical or physical answer; some problems request proof | [Reported automatic accuracy covers non-proof final answers](<https://arxiv.org/abs/2402.14008v1>) |
| [FrontierMath](<https://epoch.ai/frontiermath>) | Original advanced mathematics problem | Numerical answer or specified mathematical object | [Verification script checks the answer or its properties](<https://epoch.ai/frontiermath/tiers-1-4/the-benchmark>) |
| [ARC-AGI-2](<https://arcprize.org/blog/announcing-arc-agi-2-and-arc-prize-2025>) | Example input/output grid pairs and a test input | Predicted output grid | [Dimensions and every cell must match the target](<https://arxiv.org/pdf/2505.11831v1>) |

<a id="domain-multimodal"></a>
### Multimodal

| Benchmark · primary source | Given | Must produce | Judged by · protocol |
|---|---|---|---|
| [DocVQA](<https://www.docvqa.org/>) | Document page image and natural-language question | Short answer extracted from the document | [Average Normalized Levenshtein Similarity against reference answers](<https://arxiv.org/abs/2007.00398v1>) |
| [ChartQA](<https://github.com/vis-nlp/ChartQA>) | Chart and natural-language question | Short textual or numerical answer | [Answer accuracy with tolerance for numerical responses](<https://arxiv.org/abs/2203.10244v1>) |
| [ScienceQA](<https://scienceqa.github.io/>) | Science question, choices and optional image or context | Selected answer; explanations can also be generated | [Choice accuracy; explanation quality evaluated separately](<https://arxiv.org/abs/2209.09513v1>) |
| [POPE](<https://arxiv.org/abs/2305.10355>) | Image and yes/no object-presence question | Yes or no | [Accuracy, precision, recall, F1 and yes-answer rate](<https://arxiv.org/abs/2305.10355v1>) |
| [MME](<https://arxiv.org/abs/2306.13394>) | Image and paired yes/no questions | Yes or no for each question | [Per-question accuracy plus accuracy requiring both answers correct](<https://arxiv.org/abs/2306.13394v1>) |
| [MMBench](<https://github.com/open-compass/MMBench>) | Image, question and rotating multiple-choice options | One answer per rotation | [Correct across every rotation in CircularEval](<https://arxiv.org/pdf/2307.06281v1>) |
| [MathVista](<https://mathvista.github.io/>) | Visual math problem and optional answer choices | Choice or free-form mathematical answer | [Extracted answer normalized and matched to reference](<https://arxiv.org/abs/2310.02255v1>) |
| [MMMU](<https://mmmu-benchmark.github.io/>) | College-level subject question and associated visuals | Selected option or open-ended answer | [Choice accuracy or rule-based open-answer matching](<https://arxiv.org/pdf/2311.16502v1>) |
| [MVBench](<https://github.com/OpenGVLab/Ask-Anything/tree/main/video_chat2>) | Video clip and multiple-choice temporal question | Selected answer choice | [Answer accuracy across temporal tasks](<https://arxiv.org/abs/2311.17005v1>) |
| [Video-MME](<https://video-mme.github.io/>) | Video and multiple-choice question; optional audio or subtitles | One selected answer | [Answer accuracy, broken down by video duration](<https://arxiv.org/pdf/2405.21075v1>) |

<a id="domain-embodied"></a>
### Embodied

| Benchmark · primary source | Given | Must produce | Judged by · protocol |
|---|---|---|---|
| [ALFRED](<https://github.com/askforalfred/alfred>) | Household instructions and an egocentric view | Navigation and object-interaction actions | [Full task success and fraction of goal conditions met; path-weighted variants are also reported](<https://arxiv.org/pdf/1912.01734v1>) |
| [CALVIN](<https://github.com/mees/calvin>) | A sequence of language commands and robot observations | Arm and gripper controls for each step | [Environment checks each subtask; report success by chain length and mean completed length](<https://arxiv.org/pdf/2112.03227v1>) |
| [BEHAVIOR-1K](<https://behavior.stanford.edu/>) | An activity specification and simulated observations | Navigation and manipulation actions | [Check final goal conditions for task success; the paper also reports efficiency measures](<https://arxiv.org/pdf/2403.09227v1>) |
| [ManiSkill2](<https://maniskill2.github.io/>) | Simulated robot and object observations; task-specific goal | Continuous robot controls under the chosen controller | [Task-specific simulator success conditions; aggregate success over evaluation episodes](<https://arxiv.org/pdf/2302.04659v1>) |
| [VIMA-Bench](<https://vimalabs.github.io/>) | Multimodal prompt and current scene views | A sequence of pose-parameterized manipulation actions | [Episode success averaged over tasks within each of four generalization levels](<https://arxiv.org/pdf/2210.03094v1>) |
| [FurnitureBench](<https://clvrai.github.io/furniture-bench/>) | Camera views and robot state for an assembly task | Arm motion and gripper actions | [Assembly success across trials and number of completed phases for partial progress](<https://arxiv.org/pdf/2305.12821v1>) |
| [LIBERO](<https://libero-project.github.io/main.html>) | Language instruction and robot observations across tasks | Robot actions in a manipulation episode | [Simulated task success across the learning sequence](<https://arxiv.org/html/2306.03310v1>) |
| [RoboCasa](<https://robocasa.ai/>) | A kitchen task instruction and robot camera observations | Arm, gripper and optional mobile-base actions | [Task-specific environment checks; report the success rate over trials](<https://arxiv.org/pdf/2406.02523v1>) |
| [VLABench](<https://vlabench.github.io/>) | An instruction and visual observations from the simulated scene | Robot actions or an executable skill sequence | [Interactive evaluation reports success and a progress score that gives credit for completed stages](<https://arxiv.org/pdf/2412.18194v1>) |
| [EmbodiedBench](<https://embodiedbench.github.io/>) | Embodied instruction and visual observations in a simulator | High-level plans or lower-level actions, by environment | [Task success rate in the simulator](<https://arxiv.org/pdf/2502.09560v1>) |

<a id="domain-safety"></a>
### Safety

| Benchmark · primary source | Given | Must produce | Judged by · protocol |
|---|---|---|---|
| [RealToxicityPrompts](<https://github.com/allenai/real-toxicity-prompts>) | A sentence fragment from the web | Multiple sampled text continuations | [Perspective toxicity scores; expected maximum toxicity and probability of at least one toxic continuation](<https://arxiv.org/pdf/2009.11462v1>) |
| [TruthfulQA](<https://github.com/sylinrl/TruthfulQA>) | Question targeting a common misconception | Free answer, selected option or candidate answer likelihoods | [Truthfulness and informativeness judgments; separate multiple-choice metrics](<https://github.com/sylinrl/TruthfulQA>) |
| [BBQ](<https://github.com/nyu-mll/BBQ>) | Ambiguous or disambiguated vignette, question and choices | One choice, including “unknown” | [Answer accuracy and stereotype bias by context type](<https://arxiv.org/pdf/2110.08193v1>) |
| [ToxiGen](<https://github.com/microsoft/TOXIGEN>) | One statement about a group | Toxicity label or classifier score | [Compare against labeled examples; the paper reports ROC AUC for detection experiments](<https://arxiv.org/pdf/2203.09509v1>) |
| [MACHIAVELLI](<https://proceedings.mlr.press/v202/pan23a.html>) | A game scene and its available choices | One action choice at each decision point | [Game rewards and annotated trajectory measures for ethical violations, disutility and power](<https://arxiv.org/pdf/2304.03279v1>) |
| [DecodingTrust](<https://github.com/AI-secure/DecodingTrust>) | A scenario-specific prompt, examples or classification input | A generated response or predicted label | [Scenario-specific measures such as accuracy, toxicity scores and group fairness gaps](<https://arxiv.org/pdf/2306.11698v1>) |
| [XSTest](<https://github.com/paul-rottger/xstest>) | A benign prompt with potentially sensitive wording | A free-text reply | [In the original protocol, label compliance, partial refusal or full refusal and report refusal rates](<https://arxiv.org/pdf/2308.01263v1>) |
| [SafetyBench](<https://github.com/thu-coai/SafetyBench>) | A safety question and multiple answer choices | One selected answer | [Accuracy against the answer key, reported by language and safety category](<https://arxiv.org/pdf/2309.07045v1>) |
| [CyberSecEval](<https://arxiv.org/abs/2312.04724v1>) | A coding task or a safety-test request | A code suggestion or short response | [Separate rates of flagged insecure code and of responses judged compliant; not a system penetration test](<https://arxiv.org/pdf/2312.04724v1>) |
| [HarmBench](<https://www.harmbench.org/>) | Test prompt targeting a specified harmful behavior | Model response to the test prompt | [Behavior classifier labels responses; report attack success rate](<https://arxiv.org/pdf/2402.04249v1>) |
| [SALAD-Bench](<https://github.com/OpenSafetyLab/SALAD-BENCH>) | A safety question or a multiple-choice variant | Free-text response or selected options | [MD-Judge labels open responses for safety; the multiple-choice subset uses its answer keys](<https://arxiv.org/pdf/2402.05044v1>) |
| [StrongREJECT](<https://strong-reject.readthedocs.io/en/latest/>) | A benchmark request and the assistant’s response | A graded judgment of the response | [Original rubric combines refusal, specificity and convincingness into a graded score](<https://arxiv.org/pdf/2402.10260v1>) |
| [WMDP](<https://arxiv.org/abs/2403.03218v1>) | A multiple-choice question in one of three domains | One selected answer | [Multiple-choice accuracy per domain; compare utility separately when evaluating unlearning](<https://arxiv.org/pdf/2403.03218v1>) |
| [JailbreakBench](<https://arxiv.org/abs/2404.01318v1>) | A benchmark request describing a disallowed behavior | An assistant response | [Judge whether the response fulfills the disallowed behavior; report the fraction of successful cases](<https://arxiv.org/pdf/2404.01318v1>) |

<a id="domain-long-context"></a>
### Long-context & Memory

| Benchmark · primary source | Given | Must produce | Judged by · protocol |
|---|---|---|---|
| [L-Eval](<https://github.com/OpenLMLab/LEval>) | Long input document and an instruction | Short answer, selected option or extended response | [Exact-match-style scores for closed tasks; overlap metrics, model judging or human review for open tasks](<https://arxiv.org/pdf/2307.11088v1>) |
| [LongBench](<https://github.com/THUDM/LongBench/tree/main/LongBench>) | Long English or Chinese context and task prompt | Answer, summary, label or code completion | [Task-specific scores such as F1, ROUGE or code similarity](<https://github.com/THUDM/LongBench/blob/main/LongBench/eval.py>) |
| [Needle-in-a-Haystack](<https://github.com/gkamradt/needle-in-a-haystack>) | Long passage with a planted fact and question | Answer recalling the planted information | [Original harness: model-graded recall by length and depth](<https://github.com/gkamradt/needle-in-a-haystack/tree/73ffdd4dd2d190d9306d9162a2401ae9a067ddcf>) |
| [InfiniteBench](<https://github.com/OpenBMB/InfiniteBench>) | A long context and task-specific question or instruction | A retrieved value, answer, choice or summary | [Task-specific scoring, including answer matching, QA F1 and ROUGE for summarization](<https://arxiv.org/pdf/2402.13718v1>) |
| [LoCoMo](<https://github.com/snap-research/LoCoMo>) | Multi-session dialogue plus a question or event-summary request | A short answer or an account of relevant events | [QA uses normalized answer F1; event summaries use ROUGE and factual precision/recall measures](<https://arxiv.org/pdf/2402.17753v1>) |
| [RULER](<https://github.com/NVIDIA/RULER>) | Synthetic long context and a task-specific query | Retrieved values, aggregates or short answers | [Reference-string coverage or any-match, depending on task](<https://github.com/NVIDIA/RULER/blob/main/scripts/eval/synthetic/constants.py>) |
| [BABILong](<https://github.com/booydar/babilong>) | A long passage containing task facts, followed by a question | A short answer inferred from those facts | [Compare with the reference answer; report accuracy by reasoning task and context length](<https://arxiv.org/pdf/2406.10149v1>) |
| [HELMET](<https://github.com/princeton-nlp/HELMET>) | Long context and a task-specific query | An answer, ranked passage IDs, summary or task label | [Task-specific metrics by context length; e.g., nDCG@10 for passage ranking and model-based summary grading](<https://arxiv.org/pdf/2410.02694v1>) |
| [LongMemEval](<https://github.com/xiaowu0162/LongMemEval>) | Timestamped chat sessions and a later question | Answer from memory, or an explicit abstention | [Model judge checks correctness against a reference](<https://github.com/xiaowu0162/LongMemEval/blob/main/src/evaluation/evaluate_qa.py>) |
| [LongBench v2](<https://longbench2.github.io/>) | Long context, a question and four options | One selected option | [Answer-key accuracy, with results broken down by difficulty and context length](<https://arxiv.org/pdf/2412.15204v1>) |

<a id="domain-ai-research"></a>
### AutoResearch

| Benchmark · primary source | Given | Must produce | Judged by · protocol |
|---|---|---|---|
| [MLAgentBench](<https://arxiv.org/abs/2310.03302>) | Research brief, files, tools and evaluation metric | Task-specified artifact such as test predictions | [Task-specific objectives scored against benchmark success criteria](<https://arxiv.org/abs/2310.03302v1>) |
| [DiscoveryWorld](<https://arxiv.org/abs/2406.06769>) | Scientific scenario in an interactive simulated world | Experimental actions and discovered explanatory knowledge | [Task completion, procedural progress and explanatory knowledge accuracy](<https://arxiv.org/abs/2406.06769v1>) |
| [DiscoveryBench](<https://github.com/allenai/discoverybench>) | Dataset, metadata and discovery question | Natural-language hypothesis supported by the analysis | [Model-assisted hypothesis match on context, variables and relation](<https://arxiv.org/abs/2407.01725v1>) |
| [LAB-Bench](<https://huggingface.co/datasets/futurehouse/lab-bench>) | Biology research question with answer options | Selected answer or abstention | [Accuracy, precision on attempted questions and coverage](<https://arxiv.org/abs/2407.10362v1>) |
| [DSBench](<https://github.com/LiqiangJing/DSBench>) | Business-analysis spreadsheets or competition modeling datasets | Analysis answers or test-set predictions | [Answer correctness or competition-specific predictive performance](<https://github.com/LiqiangJing/DSBench>) |
| [CORE-Bench](<https://crab.cs.princeton.edu/core-website/>) | Reproducibility questions and a computational research repository | Answers derived from reproduced outputs | [Answers checked against reference results for each task](<https://arxiv.org/abs/2409.11363v1>) |
| [ScienceAgentBench](<https://osu-nlp-group.github.io/ScienceAgentBench/>) | Scientific task, dataset and optional expert guidance | Python program and its executed results | [Task-specific success; code similarity and cost also reported](<https://osu-nlp-group.github.io/ScienceAgentBench/>) |
| [MLE-bench](<https://github.com/openai/mle-bench>) | Competition brief, dataset and submission specification | Submission file with test-set predictions | [Competition metric and medal thresholds from human standings](<https://github.com/openai/mle-bench>) |
| [RE-Bench](<https://github.com/METR/RE-Bench>) | Open-ended ML engineering goal and timed environment | Working solution in the task environment | [Normalized task-specific scores compared with time-budgeted human attempts](<https://arxiv.org/pdf/2411.15114v1>) |
| [PaperBench](<https://openai.com/index/paperbench/>) | ML paper, clarifications and a replication environment | Code, execution instructions and resulting research artifacts | [Model grader scores weighted, author-developed rubric items](<https://arxiv.org/pdf/2504.01848v1>) |

<a id="domain-rsi"></a>
### RSI

| Benchmark · primary source | Given | Must produce | Judged by · protocol |
|---|---|---|---|
| [FrontierRSI](<https://frontier-rsi.org/>) | Open-ended AI engineering objective and fixed compute budget | Training, inference or agent-harness changes | [Task metric normalized to best valid trial; two-trial average](<https://github.com/abundant-ai/frontier-rsi>) |

<a id="domain-general"></a>
### General

| Benchmark · primary source | Given | Must produce | Judged by · protocol |
|---|---|---|---|
| [MMLU](<https://github.com/hendrycks/test>) | Subject question with four answer choices | One selected answer | [Accuracy against the answer key](<https://arxiv.org/pdf/2009.03300v1>) |
| [BIG-bench](<https://github.com/google/BIG-bench>) | Task-specific prompt, sometimes with answer choices | Generated text or scores for candidate answers | [Task-defined metric; no single universal grader](<https://arxiv.org/pdf/2206.04615v1>) |
| [HELM](<https://crfm.stanford.edu/helm/>) | Scenario-specific text prompts or answer choices | Generations or likelihoods, depending on scenario | [Scenario-specific metrics including accuracy, robustness and calibration](<https://arxiv.org/pdf/2211.09110v1>) |
| [AGIEval](<https://github.com/ruixiangcui/AGIEval>) | Exam question, sometimes with supplied answer choices | Selected choice or filled-in answer | [Choice accuracy; exact match or F1 for blanks](<https://arxiv.org/abs/2304.06364v1>) |
| [Chatbot Arena (LMArena)](<https://www.lmsys.org/blog/2023-05-03-arena/>) | User prompt shared with two anonymous models | Two competing conversational responses | [Users vote head-to-head; votes determine relative ratings](<https://www.lmsys.org/blog/2023-05-03-arena/>) |
| [IFEval](<https://github.com/google-research/google-research/tree/master/instruction_following_eval>) | Prompt with one or more verifiable constraints | One generated text response | [Rule checks; strict/loose prompt- and instruction-level accuracy](<https://arxiv.org/abs/2311.07911v1>) |
| [MMLU-Pro](<https://github.com/TIGER-AI-Lab/MMLU-Pro>) | Multisubject question with up to ten options | Selected answer choice | [Accuracy against answer keys across subjects](<https://arxiv.org/abs/2406.01574v1>) |
| [Humanity's Last Exam](<https://www.lastexam.ai/>) | Expert question, sometimes with an image | Selected or short answer with stated confidence | [Paper reports model-judged accuracy and RMS calibration error](<https://arxiv.org/pdf/2501.14249v1>) |

[Source table](data/famous.csv) · [Documented dates](verification/catalog.md) · [Candidates not yet in the guide](data/candidates_unverified.csv). A date identifies the event supported by its source, such as a v1 submission or public release. A project, a call for tasks and a finished release can have different dates.

## Benchmark names

**Even BenchBench is taken twice.** The [2024 paper](https://arxiv.org/abs/2407.13696) asks whether benchmarks agree; the [2026 paper](https://arxiv.org/abs/2603.20807) evaluates automated benchmark generation. Same name, different test.

Some names have no exact benchmark match in the sources checked:

| Field | No exact benchmark found |
|---|---|
| Agents & tools | [GUI-Mock](<https://arxiv.org/search/advanced?advanced=&terms-0-operator=AND&terms-0-term=%22GUI-Mock%22&terms-0-field=all&terms-1-operator=OR&terms-1-term=%22GUI+Mock%22&terms-1-field=all&terms-2-operator=OR&terms-2-term=%22guimock%22&terms-2-field=all&terms-3-operator=OR&terms-3-term=%22GUI-Mocks%22&terms-3-field=all&terms-4-operator=OR&terms-4-term=%22guimocks%22&terms-4-field=all&size=50>) |
| Vision & video | [Vision's Last Exam](<https://arxiv.org/search/advanced?advanced=&terms-0-operator=AND&terms-0-term=%22Vision%27s+Last+Exam%22&terms-0-field=all&terms-1-operator=OR&terms-1-term=%22Vision+Last+Exam%22&terms-1-field=all&terms-2-operator=OR&terms-2-term=%22Vision%E2%80%99s+Last+Exam%22&terms-2-field=all&terms-3-operator=OR&terms-3-term=%22visionslastexam%22&terms-3-field=all&terms-4-operator=OR&terms-4-term=%22visionlastexam%22&terms-4-field=all&size=50>), [Video's Last Exam](<https://arxiv.org/search/advanced?advanced=&terms-0-operator=AND&terms-0-term=%22Video%27s+Last+Exam%22&terms-0-field=all&terms-1-operator=OR&terms-1-term=%22Video+Last+Exam%22&terms-1-field=all&terms-2-operator=OR&terms-2-term=%22Video%E2%80%99s+Last+Exam%22&terms-2-field=all&terms-3-operator=OR&terms-3-term=%22videoslastexam%22&terms-3-field=all&terms-4-operator=OR&terms-4-term=%22videolastexam%22&terms-4-field=all&size=50>) |
| Reasoning & math | [Mathematicians' Last Exam](<https://arxiv.org/search/advanced?advanced=&terms-0-operator=AND&terms-0-term=%22Mathematicians%27+Last+Exam%22&terms-0-field=all&terms-1-operator=OR&terms-1-term=%22Mathematician%27s+Last+Exam%22&terms-1-field=all&terms-2-operator=OR&terms-2-term=%22Mathematicians+Last+Exam%22&terms-2-field=all&terms-3-operator=OR&terms-3-term=%22Mathematician+Last+Exam%22&terms-3-field=all&terms-4-operator=OR&terms-4-term=%22Mathematicians%E2%80%99+Last+Exam%22&terms-4-field=all&terms-5-operator=OR&terms-5-term=%22Mathematician%E2%80%99s+Last+Exam%22&terms-5-field=all&terms-6-operator=OR&terms-6-term=%22mathematicianslastexam%22&terms-6-field=all&terms-7-operator=OR&terms-7-term=%22mathematicianlastexam%22&terms-7-field=all&size=50>), [Reasoning-Mock](<https://arxiv.org/search/advanced?advanced=&terms-0-operator=AND&terms-0-term=%22Reasoning-Mock%22&terms-0-field=all&terms-1-operator=OR&terms-1-term=%22Reasoning+Mock%22&terms-1-field=all&terms-2-operator=OR&terms-2-term=%22reasoningmock%22&terms-2-field=all&terms-3-operator=OR&terms-3-term=%22Reasoning-Mocks%22&terms-3-field=all&terms-4-operator=OR&terms-4-term=%22reasoningmocks%22&terms-4-field=all&size=50>), [Reasoning-Dojo](<https://arxiv.org/search/advanced?advanced=&terms-0-operator=AND&terms-0-term=%22Reasoning-Dojo%22&terms-0-field=all&terms-1-operator=OR&terms-1-term=%22Reasoning+Dojo%22&terms-1-field=all&terms-2-operator=OR&terms-2-term=%22reasoningdojo%22&terms-2-field=all&terms-3-operator=OR&terms-3-term=%22Reasoning-Dojos%22&terms-3-field=all&terms-4-operator=OR&terms-4-term=%22reasoningdojos%22&terms-4-field=all&size=50>) |
| Memory | [Memory-Mock](<https://arxiv.org/search/advanced?advanced=&terms-0-operator=AND&terms-0-term=%22Memory-Mock%22&terms-0-field=all&terms-1-operator=OR&terms-1-term=%22Memory+Mock%22&terms-1-field=all&terms-2-operator=OR&terms-2-term=%22memorymock%22&terms-2-field=all&terms-3-operator=OR&terms-3-term=%22Memory-Mocks%22&terms-3-field=all&terms-4-operator=OR&terms-4-term=%22memorymocks%22&terms-4-field=all&size=50>) |
| Safety | [Alignment's Last Exam](<https://arxiv.org/search/advanced?advanced=&terms-0-operator=AND&terms-0-term=%22Alignment%27s+Last+Exam%22&terms-0-field=all&terms-1-operator=OR&terms-1-term=%22Alignment+Last+Exam%22&terms-1-field=all&terms-2-operator=OR&terms-2-term=%22Alignment%E2%80%99s+Last+Exam%22&terms-2-field=all&terms-3-operator=OR&terms-3-term=%22alignmentslastexam%22&terms-3-field=all&terms-4-operator=OR&terms-4-term=%22alignmentlastexam%22&terms-4-field=all&size=50>) |

[Names by field](https://yiming-shi.com/awesome-big-bench/#names) · [Search records and dates](verification/names.md) · [Report a match](https://github.com/yimingshi-cs/awesome-big-bench/issues/new?template=name.md). Unsearched combinations are not suggestions.

## “Bench” in arXiv titles

Compare the **same nine months** in the pinned arXiv metadata snapshot:

| January–September | CS papers with `bench` in the title | All papers with a CS category | Share |
|---|---:|---:|---:|
| 2020 | 314 | 51,439 | 0.61% |
| 2026 | 6,215 | 149,409 | 4.16% |

[View the illustrated trend](figures/overview.png). The share was **6.81 times as high** in 2026. Across the longer collection (January 2020 through the partial November 2026 pull), the repository contains **17,809 distinct matching IDs**. Titles such as *benchmarking* and *workbench* count, and plenty of actual benchmarks do not have *bench* in their paper titles. The [audit](verification/trends.md) separates the independently rebuilt period from the API extension.

[See the nine chart topics and alternative cover](figures/) · [Monthly counts](data/monthly.csv) · [Collection method](data/README.md) · [Reproduction and discrepancies](verification/trends.md). The title census and the curated directory answer different questions: HumanEval belongs in the directory even though its paper title does not contain “bench”.

## Contribute

Found two papers with the same name, a better starting point for a task, or an incorrect date? [Open an issue](https://github.com/yimingshi-cs/awesome-big-bench/issues/new/choose) with the exact spelling and a primary source. PRs are welcome; [here is how to update both editions](CONTRIBUTING.md).

Compiled with AI assistance; corrections backed by primary sources are welcome. Code and original documentation: [MIT](LICENSE). Original catalog annotations: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Descriptive arXiv metadata remains [CC0](https://info.arxiv.org/help/api/tou.html). Project names and linked artwork belong to their respective owners; third-party logos are not bundled.
