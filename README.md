**English** · [简体中文](README.zh-CN.md)

<a name="awesome-big-bench"></a>
<h1><a href="https://yiming-shi.com/awesome-big-bench/"><picture><source media="(max-width: 640px)" srcset="docs/masthead-compact.svg"><img src="docs/masthead.svg" width="100%" alt="Awesome Big Bench"></picture></a></h1>

**Two unrelated papers are called BenchBench.** The [2024 paper](https://arxiv.org/abs/2407.13696) asks whether benchmarks agree on model rankings. The [2026 paper](https://arxiv.org/abs/2603.20807) asks whether models can design good benchmarks themselves.

**[Check a name](https://yiming-shi.com/awesome-big-bench/#names)** · **[Browse benchmarks](https://yiming-shi.com/awesome-big-bench/#directory)** · **[Contribute](#contribute-with-your-agent)**

Of **341 names checked**, **89** already have an AI evaluation. Mint marks a name in use; dark green means it also appears in an OpenAI, Anthropic or Google model report. Grey means [we looked but found no exact match](verification/names.md).

## Where to start

The [directory](https://yiming-shi.com/awesome-big-bench/#directory) opens on **57 editor’s picks**. Switch to [all 570 entries](https://yiming-shi.com/awesome-big-bench/#browse?scope=all) to search earlier editions and evaluations documented in model releases. These pairs test different things:

| If you care about… | What the model actually has to do |
|---|---|
| Writing code | [HumanEval](https://yiming-shi.com/awesome-big-bench/#browse?entry=humaneval): finish a function. [SWE-bench](https://yiming-shi.com/awesome-big-bench/#browse?entry=swe-bench): fix an issue in an existing repository. |
| Using a computer | [WebArena](https://yiming-shi.com/awesome-big-bench/#browse?entry=webarena): complete a task on a website. [OSWorld](https://yiming-shi.com/awesome-big-bench/#browse?entry=osworld): operate desktop applications. |
| Games | [Kaggle Game Arena](https://yiming-shi.com/awesome-big-bench/#names?field=Embodied&prefix=Game&suffix=Arena): play an existing game against another model. [GameCraft-Bench](https://yiming-shi.com/awesome-big-bench/#browse?entry=gamecraft-bench): build a playable game. |
| Remembering | [Needle in a Haystack](https://yiming-shi.com/awesome-big-bench/#browse?entry=needle-in-a-haystack): retrieve a planted fact. [LongMemEval](https://yiming-shi.com/awesome-big-bench/#browse?entry=longmemeval): answer from past conversations. |
| Doing research | [MLE-bench](https://yiming-shi.com/awesome-big-bench/#browse?entry=mle-bench): make an ML competition submission. [PaperBench](https://yiming-shi.com/awesome-big-bench/#browse?entry=paperbench): reproduce a published paper. |

## Benchmark directory

For reading on GitHub: expand a field to compare **123 benchmarks** by input, output and scoring. Each name links to the original paper or project; the last column links to its evaluation protocol.

<a name="domain-coding"></a><a name="coding"></a>
<details>
<summary><strong>Coding</strong> · 18</summary>

| Benchmark · original source | Input | Expected output | Scoring · protocol |
|---|---|---|---|
| [Spider 1.0](<https://yale-lily.github.io/spider>) | A question and a relational schema | One SQL query | [Report the evaluator: original exact-set match or later test-suite execution accuracy.](<https://arxiv.org/abs/1809.08887>) |
| [CodeXGLUE](<https://github.com/microsoft/CodeXGLUE>) | Code, text queries or paired snippets, by subtask | Labels, rankings, code or documentation | [Task-specific metrics including accuracy, F1 and BLEU](<https://arxiv.org/abs/2102.04664v1>) |
| [APPS](<https://github.com/hendrycks/apps>) | Programming problem and required input/output behavior | Python solution program | [Fraction of tests passed and all-tests accuracy](<https://arxiv.org/abs/2105.09938v1>) |
| [HumanEval](<https://github.com/openai/human-eval>) | Python function signature, docstring and examples | Function implementation | [Unit-test success, summarized as pass@k](<https://github.com/openai/human-eval>) |
| [MBPP](<https://github.com/google-research/google-research/tree/master/mbpp>) | Short Python task description and test assertions | Python program implementing the requested behavior | [Generated code run against unit tests](<https://arxiv.org/abs/2108.07732v1>) |
| [CodeContests](<https://github.com/google-deepmind/code_contests>) | Programming problem with input/output specification | Complete runnable program | [Program output checked on test cases](<https://github.com/google-deepmind/code_contests>) |
| [EvalPlus](<https://evalplus.github.io/>) | Python synthesis prompts from the underlying benchmark | Python function implementations | [Pass@k under expanded functional test suites](<https://arxiv.org/abs/2305.01210v1>) |
| [BIRD](<https://bird-bench.github.io/>) | Database, schema, question and external knowledge | Executable SQL query | [Execution accuracy and efficiency of correct queries](<https://arxiv.org/abs/2305.03111v1>) |
| [SWE-bench](<https://www.swebench.com/>) | Repository snapshot and corresponding GitHub issue | Patch to the repository | [Required issue-fixing and regression tests must pass](<https://github.com/SWE-bench/SWE-bench/blob/main/swebench/harness/grading.py>) |
| [LiveCodeBench](<https://livecodebench.github.io/>) | Dated contest problem, code or execution example | Program, repair, execution result or predicted output | [Test-case success or answer matching, by subtask](<https://arxiv.org/pdf/2403.07974v1>) |
| [SciCode](<https://scicode-bench.github.io/>) | A scientific problem and its component specifications | Executable Python code | [Scientist-authored test cases assess subproblems and full solutions](<https://github.com/scicode-bench/SciCode>) |
| [SWE-bench Verified](<https://openai.com/index/introducing-swe-bench-verified/>) | Human-validated issue and matching repository snapshot | Patch to the repository | [Same test-based resolution criterion, on 500 validated issues](<https://openai.com/index/introducing-swe-bench-verified/>) |
| [Spider 2.0-Lite](<https://github.com/xlang-ai/Spider2/tree/main/spider2-lite>) | A question, database metadata and reference documentation | SQL for the target database dialect | [Compare query results with the reference under the Lite execution evaluator.](<https://github.com/xlang-ai/Spider2/tree/main/spider2-lite/evaluation_suite>) |
| [Code Arena · WebDev](<https://arena.ai/leaderboard/code/webdev>) | The same user-supplied web development brief for two models | Two runnable web apps for side-by-side comparison | [Pairwise user votes are aggregated into Bradley–Terry ratings; there is no fixed pass mark.](<https://arena.ai/blog/webdev-arena>) |
| [Terminal-Bench](<https://www.tbench.ai/news/announcement>) | Terminal task instruction and a prepared container | Shell actions and resulting files or system state | [Task-specific tests determine completion](<https://www.tbench.ai/news/announcement>) |
| [DeepSWE](<https://deepswe.datacurve.ai/>) | A repository at a fixed revision and an engineering brief | A committed code change | [Pass rate under task-specific behavioral tests; v1.1 grades the submitted patch in a clean environment.](<https://deepswe.datacurve.ai/blog/deepswe-v1-1>) |
| [GameCraft-Bench](<https://tongxuluo.github.io/gamecraft-bench-website/>) | A game specification, Godot workspace and shared assets | A complete game project and replayable input traces | [A judge scores the replay for game mechanics, content depth, visual feedback and presentation.](<https://arxiv.org/html/2606.17861v1>) |
| [CWE-bench v2](<https://cwe-bench.com/>) | Repository and defensive audit task | Code changes resolving the identified weakness | [Programmatic security and regression checks](<https://cwe-bench.com/v2>) |

[Browse all entries in this field](https://yiming-shi.com/awesome-big-bench/#browse?domain=Coding&scope=all)

</details>

<a name="domain-cua"></a><a name="cua"></a>
<details>
<summary><strong>CUA</strong> · 16</summary>

| Benchmark · original source | Input | Expected output | Scoring · protocol |
|---|---|---|---|
| [WebShop](<https://webshop-pnlp.github.io/>) | Shopping request and simulated online store | Searches, page actions and final product selection | [Reward for matching requested attributes, options and price](<https://arxiv.org/abs/2207.01206v1>) |
| [API-Bank](<https://github.com/AlibabaResearch/DAMO-ConvAI/tree/main/api-bank>) | User dialogue, API descriptions and execution environment | API calls and follow-up dialogue responses | [API-call correctness; ROUGE-L for follow-up responses](<https://arxiv.org/abs/2304.08244v1>) |
| [Mind2Web](<https://osu-nlp-group.github.io/Mind2Web/>) | Task, webpage snapshot and action history | Target element, operation and optional value | [Element accuracy, operation F1 and step/task success](<https://arxiv.org/abs/2306.06070v1>) |
| [WebArena](<https://webarena.dev/>) | User goal and an interactive replica website | Browser actions and, when requested, a written answer | [Task-specific checks on page state, URL or answer](<https://github.com/web-arena-x/webarena/blob/main/evaluation_harness/evaluators.py>) |
| [ToolBench](<https://github.com/OpenBMB/ToolBench>) | User instruction and available API documentation | Tool-call trajectory and final answer | [ToolEval model judges task pass rate and pairwise wins](<https://arxiv.org/abs/2307.16789v1>) |
| [AgentBench](<https://github.com/THUDM/AgentBench>) | Task, environment state and available actions | Sequence of environment-specific actions or responses | [Environment-specific success or reward, then aggregate scoring](<https://arxiv.org/abs/2308.03688v1>) |
| [GAIA](<https://arxiv.org/abs/2311.12983>) | Real-world question, sometimes with an attached file | Short text, number or list | [Normalized final answer matched against the reference](<https://huggingface.co/spaces/gaia-benchmark/leaderboard/blob/main/scorer.py>) |
| [WebVoyager](<https://github.com/MinorJerry/WebVoyager>) | A user request and annotated browser screenshots in the visual setting | Browser actions and a final answer | [Task success rate; distinguish human judgments from the automated visual judge.](<https://arxiv.org/abs/2401.13919>) |
| [Berkeley Function-Calling Leaderboard (BFCL)](<https://gorilla.cs.berkeley.edu/blogs/8_berkeley_function_calling_leaderboard.html>) | User request and available function signatures | Function calls with arguments, or no call | [Syntax-tree matching or execution checks by category](<https://gorilla.cs.berkeley.edu/blogs/8_berkeley_function_calling_leaderboard.html>) |
| [OSWorld](<https://os-world.github.io/>) | Natural-language instruction and initialized desktop environment | Desktop actions that change applications or files | [Task-specific execution checks on the resulting state](<https://arxiv.org/pdf/2404.07972v1>) |
| [AndroidWorld](<https://google-research.github.io/android_world/>) | A user instruction and a configured Android device | UI actions that complete the requested task | [Task-specific checks of the resulting device state](<https://github.com/google-research/android_world>) |
| [τ-bench](<https://github.com/sierra-research/tau-bench>) | Simulated customer, domain policy, tools and database | Tool actions and messages to the customer | [Final database state and required reply contents checked](<https://github.com/sierra-research/tau-bench/blob/main/tau_bench/envs/base.py>) |
| [BrowseComp](<https://openai.com/index/browsecomp/>) | A question and access to the web | A concise factual answer | [Answer correctness against a reference, using the documented grader](<https://cdn.openai.com/pdf/5e10f4ab-d6f7-442e-9508-59515c65e35d/browsecomp.pdf>) |
| [Toolathlon](<https://github.com/hkust-nlp/Toolathlon>) | A task and an initialized software workspace | Tool actions and a completed workspace task | [Task-specific scripts verify the outcome](<https://github.com/hkust-nlp/Toolathlon>) |
| [AutomationBench](<https://zapier.com/benchmarks>) | Business request and starting application state | Tool actions and final state across apps | [Assertions check outcomes and policy compliance](<https://arxiv.org/abs/2604.18934>) |
| [Harness-Bench](<https://github.com/Qihoo360/harness-bench>) | Task instructions and workspace materials; some tasks in the expanded suite include images | Completed work products and changes to the task workspace | [Task-specific checkers score the delivered work. Record the model, harness, task set and budget with the result.](<https://arxiv.org/abs/2605.27922>) |

[Browse all entries in this field](https://yiming-shi.com/awesome-big-bench/#browse?domain=CUA&scope=all)

</details>

<a name="domain-reasoning"></a><a name="reasoning"></a>
<details>
<summary><strong>Reasoning</strong> · 10</summary>

| Benchmark · original source | Input | Expected output | Scoring · protocol |
|---|---|---|---|
| [ARC-AGI](<https://github.com/fchollet/ARC-AGI>) | Example input/output grid pairs and a test grid | Predicted output grid | [Grid dimensions and all cell values must match](<https://arxiv.org/abs/1911.01547v1>) |
| [MATH](<https://github.com/hendrycks/math>) | Competition math problem | Final mathematical answer, optionally with working | [Normalized final answer compared with the reference](<https://github.com/hendrycks/math>) |
| [GSM8K](<https://github.com/openai/grade-school-math>) | Grade-school math word problem | Numerical final answer, optionally with working | [Final number matched against the reference answer](<https://github.com/openai/grade-school-math>) |
| [BIG-bench Hard](<https://github.com/suzgunmirac/BIG-Bench-Hard>) | Task prompt with choices or short-answer format | Final choice or task-specific answer | [Accuracy against reference answers across 23 tasks](<https://arxiv.org/abs/2210.09261v1>) |
| [GPQA](<https://github.com/idavidrein/gpqa>) | Expert-written science question and four options | One selected answer | [Accuracy against expert-provided answer keys](<https://arxiv.org/pdf/2311.12022v1>) |
| [OlympiadBench](<https://arxiv.org/abs/2402.14008>) | Olympiad problem, sometimes with a diagram | Mathematical or physical answer; some problems request proof | [Reported automatic accuracy covers non-proof final answers](<https://arxiv.org/abs/2402.14008v1>) |
| [GameBench](<https://github.com/Joshuaclymer/GameBench>) | Game rules and the current state; most are text, Hive can use an image | A move or action for the current turn | [Aggregate pairwise game outcomes with a Bradley–Terry rating model.](<https://arxiv.org/abs/2406.06613>) |
| [FrontierMath](<https://epoch.ai/frontiermath>) | Original advanced mathematics problem | Numerical answer or specified mathematical object | [Verification script checks the answer or its properties](<https://epoch.ai/frontiermath/tiers-1-4/the-benchmark>) |
| [ARC-AGI-2](<https://arcprize.org/blog/announcing-arc-agi-2-and-arc-prize-2025>) | Example input/output grid pairs and a test input | Predicted output grid | [Dimensions and every cell must match the target](<https://arxiv.org/pdf/2505.11831v1>) |
| [ARC-AGI-3](<https://arcprize.org/arc-agi/3>) | Observations from an unfamiliar interactive environment | Actions that reach the level goals | [Relative Human Action Efficiency (RHAE), using human action baselines](<https://arcprize.org/media/ARC_AGI_3_Technical_Report.pdf>) |

[Browse all entries in this field](https://yiming-shi.com/awesome-big-bench/#browse?domain=Reasoning&scope=all)

</details>

<a name="domain-multimodal"></a><a name="multimodal"></a>
<details>
<summary><strong>Multimodal</strong> · 13</summary>

| Benchmark · original source | Input | Expected output | Scoring · protocol |
|---|---|---|---|
| [LibriSpeech](<https://www.openslr.org/12/>) | Spoken English audio | A text transcript | [Word error rate on the specified split; lower is better.](<https://www.openslr.org/12/>) |
| [DocVQA](<https://www.docvqa.org/>) | Document page image and natural-language question | Short answer extracted from the document | [Average Normalized Levenshtein Similarity against reference answers](<https://arxiv.org/abs/2007.00398v1>) |
| [ChartQA](<https://github.com/vis-nlp/ChartQA>) | Chart and natural-language question | Short textual or numerical answer | [Answer accuracy with tolerance for numerical responses](<https://arxiv.org/abs/2203.10244v1>) |
| [ScienceQA](<https://scienceqa.github.io/>) | Science question, choices and optional image or context | Selected answer; explanations can also be generated | [Choice accuracy; explanation quality evaluated separately](<https://arxiv.org/abs/2209.09513v1>) |
| [POPE](<https://arxiv.org/abs/2305.10355>) | Image and yes/no object-presence question | Yes or no | [Accuracy, precision, recall, F1 and yes-answer rate](<https://arxiv.org/abs/2305.10355v1>) |
| [MME](<https://arxiv.org/abs/2306.13394>) | Image and paired yes/no questions | Yes or no for each question | [Per-question accuracy plus accuracy requiring both answers correct](<https://arxiv.org/abs/2306.13394v1>) |
| [MMBench](<https://github.com/open-compass/MMBench>) | Image, question and rotating multiple-choice options | One answer per rotation | [Correct across every rotation in CircularEval](<https://arxiv.org/pdf/2307.06281v1>) |
| [MathVista](<https://mathvista.github.io/>) | Visual math problem and optional answer choices | Choice or free-form mathematical answer | [Extracted answer normalized and matched to reference](<https://arxiv.org/abs/2310.02255v1>) |
| [MMMU](<https://mmmu-benchmark.github.io/>) | College-level subject question and associated visuals | Selected option or open-ended answer | [Choice accuracy or rule-based open-answer matching](<https://arxiv.org/pdf/2311.16502v1>) |
| [MVBench](<https://github.com/OpenGVLab/Ask-Anything/tree/main/video_chat2>) | Video clip and multiple-choice temporal question | Selected answer choice | [Answer accuracy across temporal tasks](<https://arxiv.org/abs/2311.17005v1>) |
| [OCRBench](<https://github.com/Yuliang-Liu/MultimodalOCR>) | An image and a question or recognition instruction | A text answer or transcription | [Count answers accepted by the official evaluator across its task categories.](<https://arxiv.org/abs/2305.07895>) |
| [Video-MME](<https://video-mme.github.io/>) | Video and multiple-choice question; optional audio or subtitles | One selected answer | [Answer accuracy, broken down by video duration](<https://arxiv.org/pdf/2405.21075v1>) |
| [LifeEval](<https://arxiv.org/abs/2603.00490>) | First-person video segment and question | Answer to the video question | [Answers scored against annotated choices, by capability](<https://arxiv.org/html/2603.00490v1>) |

[Browse all entries in this field](https://yiming-shi.com/awesome-big-bench/#browse?domain=Multimodal&scope=all)

</details>

<a name="domain-embodied"></a><a name="embodied"></a>
<details>
<summary><strong>Embodied</strong> · 11</summary>

| Benchmark · original source | Input | Expected output | Scoring · protocol |
|---|---|---|---|
| [RLBench](<https://github.com/stepjam/RLBench>) | A task instruction, camera observations and robot state in a common observation setting | Robot actions | [Fraction of trials that satisfy each task’s success conditions.](<https://arxiv.org/abs/1909.12271>) |
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

[Browse all entries in this field](https://yiming-shi.com/awesome-big-bench/#browse?domain=Embodied&scope=all)

</details>

<a name="domain-safety"></a><a name="safety"></a>
<details>
<summary><strong>Safety</strong> · 16</summary>

| Benchmark · original source | Input | Expected output | Scoring · protocol |
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
| [SEC-bench Pro](<https://sec-bench.github.io/>) | A controlled software-security task | An independently verifiable task result | [Task success rate on the specified version and project split](<https://sec-bench.github.io/>) |
| [WebExploitBench v1.2](<https://agentcyberrange.io/>) | Controlled web application assessment | Verified assessment outcome | [Success on the named test version](<https://deepmind.google/models/evals-methodology/gemini-4-neon/>) |

[Browse all entries in this field](https://yiming-shi.com/awesome-big-bench/#browse?domain=Safety&scope=all)

</details>

<a name="domain-long-context"></a><a name="long-context--memory"></a>
<details>
<summary><strong>Long-context &amp; Memory</strong> · 11</summary>

| Benchmark · original source | Input | Expected output | Scoring · protocol |
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
| [Graphwalks](<https://huggingface.co/datasets/openai/graphwalks>) | Directed graph plus a node and query | Set of nodes at the requested depth or parents | [Predicted node set scored against the reference; report split and length](<https://openai.com/index/gpt-4-1/>) |

[Browse all entries in this field](https://yiming-shi.com/awesome-big-bench/#browse?domain=Long-context%20%26%20Memory&scope=all)

</details>

<a name="domain-ai-research"></a><a name="autoresearch"></a>
<details>
<summary><strong>AutoResearch</strong> · 11</summary>

| Benchmark · original source | Input | Expected output | Scoring · protocol |
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
| [Terminal-Bench-Science](<https://www.terminal-bench-science.ai/announcement>) | A research task, its input files and a configured terminal | A task-specific artifact such as a reconstructed image or a fitted model | [Resolution rate: share of tasks whose required checks all pass](<https://www.terminal-bench-science.ai/announcement>) |

[Browse all entries in this field](https://yiming-shi.com/awesome-big-bench/#browse?domain=AutoResearch&scope=all)

</details>

<a name="domain-rsi"></a><a name="rsi"></a>
<details>
<summary><strong>RSI</strong> · 2</summary>

| Benchmark · original source | Input | Expected output | Scoring · protocol |
|---|---|---|---|
| [PostTrainBench](<https://posttrainbench.com/>) | Small base model, target task and fixed compute | Post-trained model | [Held-out target performance aggregated across model–task pairs](<https://arxiv.org/html/2603.08640v1>) |
| [FrontierRSI](<https://frontier-rsi.org/>) | Open-ended AI engineering objective and fixed compute budget | Training, inference or agent-harness changes | [Task metric normalized to best valid trial; two-trial average](<https://github.com/abundant-ai/frontier-rsi>) |

[Browse all entries in this field](https://yiming-shi.com/awesome-big-bench/#browse?domain=RSI&scope=all)

</details>

<a name="domain-general"></a><a name="general"></a>
<details>
<summary><strong>General</strong> · 15</summary>

| Benchmark · original source | Input | Expected output | Scoring · protocol |
|---|---|---|---|
| [MMLU](<https://github.com/hendrycks/test>) | Subject question with four answer choices | One selected answer | [Accuracy against the answer key](<https://arxiv.org/pdf/2009.03300v1>) |
| [BIG-bench](<https://github.com/google/BIG-bench>) | Task-specific prompt, sometimes with answer choices | Generated text or scores for candidate answers | [Task-defined metric; no single universal grader](<https://arxiv.org/pdf/2206.04615v1>) |
| [MTEB](<https://github.com/embeddings-benchmark/mteb>) | Text queries, passages or sentence pairs, depending on the task | Embedding vectors | [Use each task’s metric and identify the suite or subset behind any reported average.](<https://arxiv.org/abs/2210.07316>) |
| [HELM](<https://crfm.stanford.edu/helm/>) | Scenario-specific text prompts or answer choices | Generations or likelihoods, depending on scenario | [Scenario-specific metrics including accuracy, robustness and calibration](<https://arxiv.org/pdf/2211.09110v1>) |
| [AGIEval](<https://github.com/ruixiangcui/AGIEval>) | Exam question, sometimes with supplied answer choices | Selected choice or filled-in answer | [Choice accuracy; exact match or F1 for blanks](<https://arxiv.org/abs/2304.06364v1>) |
| [Chatbot Arena (LMArena)](<https://www.lmsys.org/blog/2023-05-03-arena/>) | User prompt shared with two anonymous models | Two competing conversational responses | [Users vote head-to-head; votes determine relative ratings](<https://www.lmsys.org/blog/2023-05-03-arena/>) |
| [C-Eval](<https://cevalbenchmark.com/>) | A Chinese question and four answer options | The selected option | [Multiple-choice accuracy; specify the subject aggregation and prompting setup.](<https://arxiv.org/abs/2305.08322>) |
| [IFEval](<https://github.com/google-research/google-research/tree/master/instruction_following_eval>) | Prompt with one or more verifiable constraints | One generated text response | [Rule checks; strict/loose prompt- and instruction-level accuracy](<https://arxiv.org/abs/2311.07911v1>) |
| [MMLU-Pro](<https://github.com/TIGER-AI-Lab/MMLU-Pro>) | Multisubject question with up to ten options | Selected answer choice | [Accuracy against answer keys across subjects](<https://arxiv.org/abs/2406.01574v1>) |
| [Humanity's Last Exam](<https://www.lastexam.ai/>) | Expert question, sometimes with an image | Selected or short answer with stated confidence | [Paper reports model-judged accuracy and RMS calibration error](<https://arxiv.org/pdf/2501.14249v1>) |
| [Artificial Analysis Intelligence Index](<https://artificialanalysis.ai/methodology/intelligence-benchmarking>) | A model’s results on the component evaluations for one index version | One composite index score | [In v5.0.1, nine evaluations feed four categories weighted 25% each; normalization and within-category weights are version-specific.](<https://artificialanalysis.ai/methodology/intelligence-benchmarking>) |
| [HealthBench](<https://openai.com/index/healthbench/>) | A health conversation ending in a user or clinician message | One free-text response | [A model grader checks weighted physician-written criteria; scores are averaged across conversations.](<https://arxiv.org/pdf/2505.08775v1>) |
| [GDPval](<https://openai.com/index/gdpval/>) | Work brief and reference materials | A professional work product | [Expert blind comparisons of model and human deliverables](<https://openai.com/index/gdpval/>) |
| [APEX-Agents](<https://www.mercor.com/blog/introducing-apex-agents/>) | A professional brief, files and workplace applications | A client-ready answer or work product | [Expert rubrics: full-task pass rate and mean criterion score](<https://www.mercor.com/apex/methodology/>) |
| [LifeVal](<https://openai.com/index/lifeval/>) | Personal task, context, reference files and tools | Personalized outcome or artifact | [Rubric-based grading against the task and starting state](<https://cdn.openai.com/pdf/lifeval.pdf>) |

[Browse all entries in this field](https://yiming-shi.com/awesome-big-bench/#browse?domain=General&scope=all)

</details>

[Source table](data/famous.csv) · [Dates and their sources](verification/catalog.md) · [Model-release coverage](verification/flagships/directory-coverage.csv) · [Candidates under review](data/candidates_unverified.csv)

## Contribute with your agent

A missing benchmark does **not** need “bench” in its name. Give your agent a paper or project link and the change you want. It checks the edition, edits the source data and opens a pull request. The maintainer reviews it.

**[Copy the PR prompt](https://yiming-shi.com/awesome-big-bench/#contribute)** · [Plain text](contribute/agent-prompt.txt) · [Contribution guide](CONTRIBUTING.md)

<details>
<summary>Read or copy the prompt on GitHub</summary>

```text
Help me contribute one benchmark addition or correction to https://github.com/yimingshi-cs/awesome-big-bench. Use the public source and change I provide. If either is missing, ask me before editing.

Read CONTRIBUTING.md. Check the existing name, edition and open PRs. Verify the claim against the original paper, project or dated release; cite the exact section or version. A new benchmark belongs in the Directory even if its name does not fit the map. Only change a map verdict with evidence for that exact name; don't add a row or column for a single submission.

Edit the source data on a new branch, not the generated page by hand. Supply Simplified Chinese for new or revised display copy; keep official names, editions, metrics and source links intact. Run:
python3 scripts/build_guide.py
python3 vote-service/catalog.py
python3 scripts/build_guide.py --check
python3 vote-service/catalog.py --check
python3 -m unittest discover -s tests

Inspect the diff. Using my authorized GitHub account, push the branch to my fork and open a pull request against yimingshi-cs/awesome-big-bench:main. Include the evidence and checks, then give me the PR link. Leave review and merge to the maintainer. If you can't open a PR, give me the patch and the remaining step.
```

</details>

Correcting an existing record? Use **Copy PR prompt** on that card; the copy includes the exact entry or name pair. New rows or columns need evidence for every new combination.

## Community vote

Would you recommend this **edition** for the task it claims to measure? Each directory card shows whether voting is open. When it is, choose **👍 Recommend** or **👎 Wouldn’t recommend**. No sign-in is required. Skip editions you helped make or maintain; you can change or withdraw your vote in the same browser before the cutoff.

Totals stay hidden during voting. Results are grouped by field; editions with fewer than 20 votes are left unranked. [Voting and tally rules](vote-service/OPERATIONS.md).

## “Bench” in arXiv titles

In January–September 2020, 314 of 51,439 arXiv CS papers had `bench` in the title (**0.61%**). In the same nine months of 2026, it was 6,215 of 149,409 (**4.16%**): a **6.81×** increase in share. The 2020-01–2026-11 collection (partial final month) contains 17,809 matching paper IDs. This counts titles, not new benchmarks: *benchmarking* and *workbench* qualify; *HumanEval* does not. [Overview chart](figures/overview.png).

[Explore the trend](https://yiming-shi.com/awesome-big-bench/#trends) · [Charts](figures/) · [Monthly counts](data/monthly.csv) · [Collection method](data/README.md) · [Audit](verification/trends.md)

## Provenance and licenses

**Why “Big Bench”?** [Xinye Li asked what PhDs can build as foundation models absorb more tasks](https://x.com/vclee8/status/2120212679470268893). [Greg Hu called it 大bench理论, the “Big Bench Theory”](https://x.com/greghxm_1/status/2120436200746242530). The name is a nod to that exchange, not the [BIG-bench evaluation suite](https://github.com/google/BIG-bench).

[Offline HTML: English](https://yiming-shi.com/awesome-big-bench/offline/awesome-big-bench-en.html) · [简体中文](https://yiming-shi.com/awesome-big-bench/offline/awesome-big-bench-zh.html). To save a file for offline use, choose **Download offline guide** in the website footer.

Code and original documentation: [MIT](LICENSE). Original annotations: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Descriptive arXiv metadata: [CC0](https://info.arxiv.org/help/api/tou.html). [Project marks](web/assets/marks/) retain their respective rights.

This started as a weekend project built with AI assistance. A link can point to the right paper but the wrong edition or scoring rule. If you spot one, send the original source with your correction.
