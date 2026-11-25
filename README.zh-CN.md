[English](README.md) · **简体中文**

<a name="awesome-big-bench"></a>
<h1><a href="https://yiming-shi.com/awesome-big-bench/zh/"><picture><source media="(max-width: 640px)" srcset="docs/masthead-compact.svg"><img src="docs/masthead.svg" width="100%" alt="Awesome Big Bench"></picture></a></h1>

**叫 BenchBench 的论文已经有两篇了。** [2024 年那篇](https://arxiv.org/abs/2407.13696)问：同一批模型换个榜，排名还一致吗？[2026 年那篇](https://arxiv.org/abs/2603.20807)问：让模型自己出题，能不能设计出靠谱的评测？不是续作，是撞名。

**[查名字](https://yiming-shi.com/awesome-big-bench/zh/#names)** · **[看精选评测](https://yiming-shi.com/awesome-big-bench/zh/#directory)** · **[让 Agent 提 PR](#contribute-with-your-agent)**

查过的 **341 个前后缀组合**里，**89 个**已有同名 AI 评测。薄荷绿是已有评测，深绿表示 OpenAI、Anthropic 或 Google 在模型报告里用过；灰格是[查过、暂未找到](verification/names.md)。

<a name="where-to-start"></a>
## 找评测，先看任务

[目录](https://yiming-shi.com/awesome-big-bench/zh/#directory)默认展示 **57 条精选**。[全部 570 条记录](https://yiming-shi.com/awesome-big-bench/zh/#browse?scope=all)里也能查到历史版本和模型发布报告里用过的评测。选榜时可以先看这几组：

| 你想测什么？ | 模型到底要做什么？ |
|---|---|
| 写代码 | [HumanEval](https://yiming-shi.com/awesome-big-bench/zh/#browse?entry=humaneval) 要补全一个函数；[SWE-bench](https://yiming-shi.com/awesome-big-bench/zh/#browse?entry=swe-bench) 要修好已有仓库里的一个问题。 |
| 用电脑 | [WebArena](https://yiming-shi.com/awesome-big-bench/zh/#browse?entry=webarena) 要在网站上办成一件事；[OSWorld](https://yiming-shi.com/awesome-big-bench/zh/#browse?entry=osworld) 要操作桌面应用。 |
| 玩游戏还是做游戏 | [Kaggle Game Arena](https://yiming-shi.com/awesome-big-bench/zh/#names?field=Embodied&prefix=Game&suffix=Arena) 让模型和对手玩已有的游戏；[GameCraft-Bench](https://yiming-shi.com/awesome-big-bench/zh/#browse?entry=gamecraft-bench) 要模型做出一款可玩的游戏。 |
| 记住信息 | [大海捞针](https://yiming-shi.com/awesome-big-bench/zh/#browse?entry=needle-in-a-haystack) 要找回事先埋入的信息；[LongMemEval](https://yiming-shi.com/awesome-big-bench/zh/#browse?entry=longmemeval) 要根据过去的多轮对话回答问题。 |
| 做研究 | [MLE-bench](https://yiming-shi.com/awesome-big-bench/zh/#browse?entry=mle-bench) 要提交机器学习竞赛方案；[PaperBench](https://yiming-shi.com/awesome-big-bench/zh/#browse?entry=paperbench) 要复现一篇已发表的论文。 |

<a name="benchmark-directory"></a>
## 按领域查评测

不离开 GitHub 也可以查：下面按领域整理了 **123 个评测**的输入、输出和评分方法。点名字看原始论文或项目，点最后一列看评分依据。

<a name="domain-coding"></a><a name="coding"></a>
<details>
<summary><strong>编程</strong> · 18</summary>

| 评测 · 原始来源 | 输入 | 模型要给出什么 | 评分方法 · 依据 |
|---|---|---|---|
| [Spider 1.0](<https://yale-lily.github.io/spider>) | 自然语言问题和关系数据库表结构 | 一条 SQL 查询 | [注明评测器：原版比较 SQL 组成部分，后续测试套件比较执行结果。](<https://arxiv.org/abs/1809.08887>) |
| [CodeXGLUE](<https://github.com/microsoft/CodeXGLUE>) | 依子任务而定：代码、文本查询或成对代码片段 | 标签、排序、代码或文档 | [各子任务分别使用准确率、F1、BLEU 等指标](<https://arxiv.org/abs/2102.04664v1>) |
| [APPS](<https://github.com/hendrycks/apps>) | 编程题及输入输出要求 | Python 解题程序 | [分别统计通过的测试比例和通过全部测试的题目比例](<https://arxiv.org/abs/2105.09938v1>) |
| [HumanEval](<https://github.com/openai/human-eval>) | Python 函数签名、文档字符串和示例 | 函数实现 | [以 pass@k 汇总单元测试结果](<https://github.com/openai/human-eval>) |
| [MBPP](<https://github.com/google-research/google-research/tree/master/mbpp>) | 简短的 Python 任务说明和测试断言 | 实现指定行为的 Python 程序 | [对生成的代码运行单元测试](<https://arxiv.org/abs/2108.07732v1>) |
| [CodeContests](<https://github.com/google-deepmind/code_contests>) | 附输入输出规范的编程题 | 完整可运行的程序 | [用测试样例核对程序输出](<https://github.com/google-deepmind/code_contests>) |
| [EvalPlus](<https://evalplus.github.io/>) | 原评测中的 Python 函数生成提示 | Python 函数实现 | [在扩充的功能测试集上计算 pass@k](<https://arxiv.org/abs/2305.01210v1>) |
| [BIRD](<https://bird-bench.github.io/>) | 数据库、表结构、问题及外部知识 | 可执行的 SQL 查询 | [统计执行正确率，并衡量正确查询的效率](<https://arxiv.org/abs/2305.03111v1>) |
| [SWE-bench](<https://www.swebench.com/>) | 仓库快照和对应的 GitHub issue | 仓库补丁 | [修复目标问题的测试以及回归测试均须通过](<https://github.com/SWE-bench/SWE-bench/blob/main/swebench/harness/grading.py>) |
| [LiveCodeBench](<https://livecodebench.github.io/>) | 带日期的竞赛题、代码或执行示例 | 程序、修复方案、执行结果或预测输出 | [按子任务检查测试用例是否通过或答案是否匹配](<https://arxiv.org/pdf/2403.07974v1>) |
| [SciCode](<https://scicode-bench.github.io/>) | 科学问题及各组成部分的要求 | 可执行的 Python 代码 | [用科研人员编写的测试用例分别检验子问题和完整解法](<https://github.com/scicode-bench/SciCode>) |
| [SWE-bench Verified](<https://openai.com/index/introducing-swe-bench-verified/>) | 经人工验证的 issue 及对应的仓库快照 | 仓库补丁 | [对 500 个经验证的 issue，沿用原评测基于测试的解决标准](<https://openai.com/index/introducing-swe-bench-verified/>) |
| [Spider 2.0-Lite](<https://github.com/xlang-ai/Spider2/tree/main/spider2-lite>) | 问题、数据库元数据和参考文档 | 符合目标数据库方言的 SQL | [用 Lite 评测器运行查询，并将结果与参考结果比较。](<https://github.com/xlang-ai/Spider2/tree/main/spider2-lite/evaluation_suite>) |
| [Code Arena · WebDev](<https://arena.ai/leaderboard/code/webdev>) | 同时发给两个模型的网页开发要求 | 可并排试用的两个网页应用 | [用 Bradley–Terry 模型汇总两两投票，没有固定及格线](<https://arena.ai/blog/webdev-arena>) |
| [Terminal-Bench](<https://www.tbench.ai/news/announcement>) | 终端任务说明及准备好的容器 | Shell 操作及产生的文件或系统状态 | [按各任务的测试判定完成情况](<https://www.tbench.ai/news/announcement>) |
| [DeepSWE](<https://deepswe.datacurve.ai/>) | 固定版本的仓库及工程要求 | 已提交的代码修改 | [按任务对应的行为测试计算通过率；v1.1 在干净环境中评定提交的补丁。](<https://deepswe.datacurve.ai/blog/deepswe-v1-1>) |
| [GameCraft-Bench](<https://tongxuluo.github.io/gamecraft-bench-website/>) | 游戏规格、Godot 工作区和共享素材 | 完整游戏项目及可回放的输入记录 | [裁判根据回放，从游戏机制、内容深度、视觉反馈和呈现效果等方面评分](<https://arxiv.org/html/2606.17861v1>) |
| [CWE-bench v2](<https://cwe-bench.com/>) | 代码仓库和防御性审计任务 | 修复已识别缺陷的代码修改 | [通过程序执行安全检查和回归测试](<https://cwe-bench.com/v2>) |

[打开本领域完整目录](https://yiming-shi.com/awesome-big-bench/zh/#browse?domain=Coding&scope=all)

</details>

<a name="domain-cua"></a><a name="cua"></a>
<details>
<summary><strong>电脑操作与工具（CUA）</strong> · 16</summary>

| 评测 · 原始来源 | 输入 | 模型要给出什么 | 评分方法 · 依据 |
|---|---|---|---|
| [WebShop](<https://webshop-pnlp.github.io/>) | 购物需求和模拟网店 | 搜索、页面操作及最终选购的商品 | [按商品属性、选项和价格与要求的匹配程度给分](<https://arxiv.org/abs/2207.01206v1>) |
| [API-Bank](<https://github.com/AlibabaResearch/DAMO-ConvAI/tree/main/api-bank>) | 用户对话、API 说明和执行环境 | API 调用及后续对话回复 | [检查 API 调用是否正确；后续回复用 ROUGE-L](<https://arxiv.org/abs/2304.08244v1>) |
| [Mind2Web](<https://osu-nlp-group.github.io/Mind2Web/>) | 任务、网页快照和操作历史 | 目标元素、操作及可选的输入值 | [统计元素选择准确率、操作 F1、单步及整项任务成功率](<https://arxiv.org/abs/2306.06070v1>) |
| [WebArena](<https://webarena.dev/>) | 用户目标及可交互的网站副本 | 浏览器操作，必要时还需给出书面答案 | [按任务检查页面状态、网址或回答](<https://github.com/web-arena-x/webarena/blob/main/evaluation_harness/evaluators.py>) |
| [ToolBench](<https://github.com/OpenBMB/ToolBench>) | 用户指令及可用 API 的文档 | 工具调用轨迹及最终答案 | [ToolEval 使用模型判断任务通过率和两两比较的胜率](<https://arxiv.org/abs/2307.16789v1>) |
| [AgentBench](<https://github.com/THUDM/AgentBench>) | 任务、环境状态及可选动作 | 一系列针对该环境的动作或回答 | [先按环境判定成功或奖励，再汇总评分](<https://arxiv.org/abs/2308.03688v1>) |
| [GAIA](<https://arxiv.org/abs/2311.12983>) | 现实问题，可能附有文件 | 简短文字、数字或列表 | [将最终答案标准化后与参考答案匹配](<https://huggingface.co/spaces/gaia-benchmark/leaderboard/blob/main/scorer.py>) |
| [WebVoyager](<https://github.com/MinorJerry/WebVoyager>) | 用户请求和带标注的浏览器截图（视觉设置） | 浏览器操作和最终答复 | [按成功完成的任务比例计分，须区分人工评判和自动视觉裁判。](<https://arxiv.org/abs/2401.13919>) |
| [Berkeley Function-Calling Leaderboard (BFCL)](<https://gorilla.cs.berkeley.edu/blogs/8_berkeley_function_calling_leaderboard.html>) | 用户请求及可用函数的签名 | 带参数的函数调用，或不调用 | [按类别使用语法树匹配或执行验证](<https://gorilla.cs.berkeley.edu/blogs/8_berkeley_function_calling_leaderboard.html>) |
| [OSWorld](<https://os-world.github.io/>) | 自然语言指令和初始化后的桌面环境 | 会改变应用或文件状态的桌面操作 | [按具体任务执行检查，验证最终状态](<https://arxiv.org/pdf/2404.07972v1>) |
| [AndroidWorld](<https://google-research.github.io/android_world/>) | 用户指令及配置好的 Android 设备 | 完成任务的界面操作 | [按任务检查最终设备状态](<https://github.com/google-research/android_world>) |
| [τ-bench](<https://github.com/sierra-research/tau-bench>) | 模拟客户、业务规则、工具及数据库 | 工具操作及发给客户的消息 | [检查数据库最终状态和回复中必需的内容](<https://github.com/sierra-research/tau-bench/blob/main/tau_bench/envs/base.py>) |
| [BrowseComp](<https://openai.com/index/browsecomp/>) | 一个问题及联网权限 | 简洁的事实性答案 | [使用项目公布的评分器，对照参考答案判断正误](<https://cdn.openai.com/pdf/5e10f4ab-d6f7-442e-9508-59515c65e35d/browsecomp.pdf>) |
| [Toolathlon](<https://github.com/hkust-nlp/Toolathlon>) | 任务及初始化的软件工作区 | 工具操作及在工作区完成的任务 | [用各任务的专用脚本验证结果](<https://github.com/hkust-nlp/Toolathlon>) |
| [AutomationBench](<https://zapier.com/benchmarks>) | 业务请求及应用初始状态 | 工具操作及多个应用的最终状态 | [用断言检查实际结果和规则遵守情况](<https://arxiv.org/abs/2604.18934>) |
| [Harness-Bench](<https://github.com/Qihoo360/harness-bench>) | 任务指令与工作区材料；扩展任务集中部分任务包含图像 | 交付成果和对任务工作区的修改 | [由各任务的检查器为交付成果评分。报告成绩时注明模型、运行框架、任务集和预算。](<https://arxiv.org/abs/2605.27922>) |

[打开本领域完整目录](https://yiming-shi.com/awesome-big-bench/zh/#browse?domain=CUA&scope=all)

</details>

<a name="domain-reasoning"></a><a name="reasoning"></a>
<details>
<summary><strong>推理</strong> · 10</summary>

| 评测 · 原始来源 | 输入 | 模型要给出什么 | 评分方法 · 依据 |
|---|---|---|---|
| [ARC-AGI](<https://github.com/fchollet/ARC-AGI>) | 几组输入与输出网格，以及一个测试网格 | 预测的输出网格 | [网格尺寸和所有单元格的值都要正确](<https://arxiv.org/abs/1911.01547v1>) |
| [MATH](<https://github.com/hendrycks/math>) | 数学竞赛题 | 最终数学答案，可附解题过程 | [将最终答案标准化后与参考答案比较](<https://github.com/hendrycks/math>) |
| [GSM8K](<https://github.com/openai/grade-school-math>) | 小学数学应用题 | 最终数值，可附计算过程 | [将最终数值与参考答案比较](<https://github.com/openai/grade-school-math>) |
| [BIG-bench Hard](<https://github.com/suzgunmirac/BIG-Bench-Hard>) | 任务提示，带选项或要求简答 | 最终选项或任务要求的答案 | [将 23 项任务的回答与参考答案比较，计算正确率](<https://arxiv.org/abs/2210.09261v1>) |
| [GPQA](<https://github.com/idavidrein/gpqa>) | 专家编写的科学题及四个选项 | 一个选项 | [对照专家提供的答案计算正确率](<https://arxiv.org/pdf/2311.12022v1>) |
| [OlympiadBench](<https://arxiv.org/abs/2402.14008>) | 奥赛题，部分带图 | 数学或物理答案；部分题要求证明 | [自动评分的正确率仅涵盖非证明题的最终答案](<https://arxiv.org/abs/2402.14008v1>) |
| [GameBench](<https://github.com/Joshuaclymer/GameBench>) | 游戏规则和当前局面；多数用文本，Hive 可使用图像 | 当前回合的一步行动 | [依据两两对战的结果，用 Bradley–Terry 模型估计相对实力。](<https://arxiv.org/abs/2406.06613>) |
| [FrontierMath](<https://epoch.ai/frontiermath>) | 原创高等数学题 | 数值答案或指定的数学对象 | [用验证脚本检查答案或其性质](<https://epoch.ai/frontiermath/tiers-1-4/the-benchmark>) |
| [ARC-AGI-2](<https://arcprize.org/blog/announcing-arc-agi-2-and-arc-prize-2025>) | 几组输入与输出网格，以及一个测试输入 | 预测的输出网格 | [尺寸与每个单元格都要与目标网格一致](<https://arxiv.org/pdf/2505.11831v1>) |
| [ARC-AGI-3](<https://arcprize.org/arc-agi/3>) | 来自陌生交互环境的观测 | 达到关卡目标的动作 | [以人类动作数为基准，计算相对人类动作效率（RHAE）](<https://arcprize.org/media/ARC_AGI_3_Technical_Report.pdf>) |

[打开本领域完整目录](https://yiming-shi.com/awesome-big-bench/zh/#browse?domain=Reasoning&scope=all)

</details>

<a name="domain-multimodal"></a><a name="multimodal"></a>
<details>
<summary><strong>多模态</strong> · 13</summary>

| 评测 · 原始来源 | 输入 | 模型要给出什么 | 评分方法 · 依据 |
|---|---|---|---|
| [LibriSpeech](<https://www.openslr.org/12/>) | 英语语音 | 文字转录 | [在指定划分上计算词错误率（WER），越低越好。](<https://www.openslr.org/12/>) |
| [DocVQA](<https://www.docvqa.org/>) | 文档页面图像和自然语言问题 | 从文档中提取的简短答案 | [计算与参考答案的平均归一化编辑相似度（ANLS）](<https://arxiv.org/abs/2007.00398v1>) |
| [ChartQA](<https://github.com/vis-nlp/ChartQA>) | 图表和自然语言问题 | 简短的文字或数值答案 | [计算答案正确率，数值答案允许一定误差](<https://arxiv.org/abs/2203.10244v1>) |
| [ScienceQA](<https://scienceqa.github.io/>) | 科学题、选项，以及可选的图像或背景信息 | 选项，也可生成解释 | [按选项正确率评分；解释质量单独评估](<https://arxiv.org/abs/2209.09513v1>) |
| [POPE](<https://arxiv.org/abs/2305.10355>) | 一张图像及询问某物是否存在的是非题 | 是或否 | [统计准确率、精确率、召回率、F1 及回答「是」的比例](<https://arxiv.org/abs/2305.10355v1>) |
| [MME](<https://arxiv.org/abs/2306.13394>) | 一张图像和一对是非题 | 对每个问题回答是或否 | [分别统计逐题正确率和两题均答对的比例](<https://arxiv.org/abs/2306.13394v1>) |
| [MMBench](<https://github.com/open-compass/MMBench>) | 图像、问题及轮换顺序的选项 | 每次轮换后选一个答案 | [CircularEval 要求每种选项顺序都答对](<https://arxiv.org/pdf/2307.06281v1>) |
| [MathVista](<https://mathvista.github.io/>) | 带视觉信息的数学题，可能附有选项 | 所选选项或自由填写的数学答案 | [提取并标准化答案，与参考答案匹配](<https://arxiv.org/abs/2310.02255v1>) |
| [MMMU](<https://mmmu-benchmark.github.io/>) | 大学水平的学科题及相关视觉材料 | 所选选项或开放式回答 | [选择题计算正确率；开放题用规则进行答案匹配](<https://arxiv.org/pdf/2311.16502v1>) |
| [MVBench](<https://github.com/OpenGVLab/Ask-Anything/tree/main/video_chat2>) | 视频片段及一道关于时序的选择题 | 所选答案 | [统计各项时序任务的回答正确率](<https://arxiv.org/abs/2311.17005v1>) |
| [OCRBench](<https://github.com/Yuliang-Liu/MultimodalOCR>) | 图像和问题或识别指令 | 文字答案或转录 | [由官方评测器判断各类任务的回答是否命中参考答案，汇总得分。](<https://arxiv.org/abs/2305.07895>) |
| [Video-MME](<https://video-mme.github.io/>) | 视频及选择题，可附音频或字幕 | 一个选项 | [按视频时长分别报告回答正确率](<https://arxiv.org/pdf/2405.21075v1>) |
| [LifeEval](<https://arxiv.org/abs/2603.00490>) | 第一人称视频片段和问题 | 对视频问题的回答 | [按能力分类，将回答与标注选项对照评分](<https://arxiv.org/html/2603.00490v1>) |

[打开本领域完整目录](https://yiming-shi.com/awesome-big-bench/zh/#browse?domain=Multimodal&scope=all)

</details>

<a name="domain-embodied"></a><a name="embodied"></a>
<details>
<summary><strong>具身智能</strong> · 11</summary>

| 评测 · 原始来源 | 输入 | 模型要给出什么 | 评分方法 · 依据 |
|---|---|---|---|
| [RLBench](<https://github.com/stepjam/RLBench>) | 典型设置下的任务指令、相机观测和机器人状态 | 机器人动作 | [统计达到各任务成功条件的试验比例。](<https://arxiv.org/abs/1909.12271>) |
| [ALFRED](<https://github.com/askforalfred/alfred>) | 家务指令及第一人称视图 | 移动和操作物体的动作 | [统计任务成功率和满足的目标条件比例，另有按路径加权的指标](<https://arxiv.org/pdf/1912.01734v1>) |
| [CALVIN](<https://github.com/mees/calvin>) | 一系列语言指令和机器人观测 | 每一步的机械臂与夹爪控制指令 | [环境逐项检查，按指令链长度报告成功率，并统计平均完成长度](<https://arxiv.org/pdf/2112.03227v1>) |
| [BEHAVIOR-1K](<https://behavior.stanford.edu/>) | 活动要求和模拟环境观测 | 移动和操作物体的动作序列 | [根据最终是否满足目标条件判定成功；论文还报告效率指标](<https://arxiv.org/pdf/2403.09227v1>) |
| [ManiSkill2](<https://maniskill2.github.io/>) | 模拟的机器人与物体观测，以及具体任务目标 | 在指定控制器下连续输出的机器人控制量 | [模拟器逐任务判定是否成功，再汇总各轮评测的成功率](<https://arxiv.org/pdf/2302.04659v1>) |
| [VIMA-Bench](<https://vimalabs.github.io/>) | 多模态提示和当前场景视图 | 以位姿为参数的一系列操作动作 | [在四个泛化难度级别内分别对各任务的成功率取平均](<https://arxiv.org/pdf/2210.03094v1>) |
| [FurnitureBench](<https://clvrai.github.io/furniture-bench/>) | 摄像头画面及组装任务中的机器人状态 | 机械臂移动和夹爪动作 | [统计组装成功率；未完成时记录已完成的阶段数](<https://arxiv.org/pdf/2305.12821v1>) |
| [LIBERO](<https://libero-project.github.io/main.html>) | 各项任务的语言指令和机器人观测 | 一轮操作中的机器人动作 | [统计学习序列中各项模拟任务的成功率](<https://arxiv.org/html/2306.03310v1>) |
| [RoboCasa](<https://robocasa.ai/>) | 厨房任务指令及机器人摄像头观测 | 机械臂、夹爪及可选的移动底盘动作 | [由环境按任务检查，统计多次试验的成功率](<https://arxiv.org/pdf/2406.02523v1>) |
| [VLABench](<https://vlabench.github.io/>) | 指令及模拟场景中的视觉观测 | 机器人动作或可执行的技能序列 | [交互评测报告成功率；另用进度分为已完成的阶段给分](<https://arxiv.org/pdf/2412.18194v1>) |
| [EmbodiedBench](<https://embodiedbench.github.io/>) | 具身任务指令和模拟器中的视觉观测 | 依环境而定：高层计划或底层动作 | [模拟器中的任务成功率](<https://arxiv.org/pdf/2502.09560v1>) |

[打开本领域完整目录](https://yiming-shi.com/awesome-big-bench/zh/#browse?domain=Embodied&scope=all)

</details>

<a name="domain-safety"></a><a name="safety"></a>
<details>
<summary><strong>安全</strong> · 16</summary>

| 评测 · 原始来源 | 输入 | 模型要给出什么 | 评分方法 · 依据 |
|---|---|---|---|
| [RealToxicityPrompts](<https://github.com/allenai/real-toxicity-prompts>) | 取自网页的句子片段 | 多次采样得到的续写 | [用 Perspective 评估有害程度，统计最高有害分数的期望值及至少出现一次有害续写的概率](<https://arxiv.org/pdf/2009.11462v1>) |
| [TruthfulQA](<https://github.com/sylinrl/TruthfulQA>) | 针对常见误解的问题 | 自由回答、所选选项或各候选答案的似然 | [分别判断真实性和信息量；选择题另有指标](<https://github.com/sylinrl/TruthfulQA>) |
| [BBQ](<https://github.com/nyu-mll/BBQ>) | 含糊或线索充分的短情境、问题与选项 | 选择一项，可选「未知」 | [按情境类型统计回答正确率和刻板印象偏差](<https://arxiv.org/pdf/2110.08193v1>) |
| [ToxiGen](<https://github.com/microsoft/TOXIGEN>) | 一句关于某个群体的话 | 有害性标签或分类器分数 | [对照人工标注；论文以 ROC AUC 报告识别效果](<https://arxiv.org/pdf/2203.09509v1>) |
| [MACHIAVELLI](<https://proceedings.mlr.press/v202/pan23a.html>) | 一段游戏场景及可选行动 | 在每个决策点选一个行动 | [结合游戏奖励与轨迹标注，衡量违规、负效用及权力](<https://arxiv.org/pdf/2304.03279v1>) |
| [DecodingTrust](<https://github.com/AI-secure/DecodingTrust>) | 特定场景的提示词、示例或待分类输入 | 生成的回答或预测标签 | [依场景使用准确率、有害性分数、群体间公平性差距等指标](<https://arxiv.org/pdf/2306.11698v1>) |
| [XSTest](<https://github.com/paul-rottger/xstest>) | 含潜在敏感措辞的无害提示 | 自由文本回答 | [原协议区分作答、部分拒答和完全拒答，并统计拒答率](<https://arxiv.org/pdf/2308.01263v1>) |
| [SafetyBench](<https://github.com/thu-coai/SafetyBench>) | 一道安全问题及多个选项 | 一个选项 | [按语言和安全类别分别对照标准答案计算正确率](<https://arxiv.org/pdf/2309.07045v1>) |
| [CyberSecEval](<https://arxiv.org/abs/2312.04724v1>) | 编程任务或安全测试请求 | 代码建议或简短回答 | [分别统计被标记为不安全的代码比例和被判定为服从请求的回答比例；这不是系统渗透测试](<https://arxiv.org/pdf/2312.04724v1>) |
| [HarmBench](<https://www.harmbench.org/>) | 针对某类有害行为的测试提示 | 模型对测试提示的回答 | [用行为分类器标注回答，统计攻击成功率](<https://arxiv.org/pdf/2402.04249v1>) |
| [SALAD-Bench](<https://github.com/OpenSafetyLab/SALAD-BENCH>) | 安全问题或其选择题版本 | 自由文本回答或所选选项 | [开放题由 MD-Judge 判断安全性；选择题按标准答案评分](<https://arxiv.org/pdf/2402.05044v1>) |
| [StrongREJECT](<https://strong-reject.readthedocs.io/en/latest/>) | 一条评测请求及助手的回答 | 对回答的分级判断 | [原评分标准综合拒答情况、具体程度和说服力，给出分级分数](<https://arxiv.org/pdf/2402.10260v1>) |
| [WMDP](<https://arxiv.org/abs/2403.03218v1>) | 三个领域之一的一道选择题 | 一个选项 | [分领域统计选择题正确率；研究机器遗忘时另行比较实用性](<https://arxiv.org/pdf/2403.03218v1>) |
| [JailbreakBench](<https://arxiv.org/abs/2404.01318v1>) | 描述某类不允许行为的测试请求 | 助手回答 | [判断回答是否满足该请求，统计满足请求的比例](<https://arxiv.org/pdf/2404.01318v1>) |
| [SEC-bench Pro](<https://sec-bench.github.io/>) | 一项受控的软件安全任务 | 可独立验证的任务结果 | [在指定版本和项目划分上计算任务成功率](<https://sec-bench.github.io/>) |
| [WebExploitBench v1.2](<https://agentcyberrange.io/>) | 受控的网页应用评估任务 | 经验证的评估结果 | [在指定测试版本上统计成功情况](<https://deepmind.google/models/evals-methodology/gemini-4-neon/>) |

[打开本领域完整目录](https://yiming-shi.com/awesome-big-bench/zh/#browse?domain=Safety&scope=all)

</details>

<a name="domain-long-context"></a><a name="long-context--memory"></a>
<details>
<summary><strong>长上下文与记忆</strong> · 11</summary>

| 评测 · 原始来源 | 输入 | 模型要给出什么 | 评分方法 · 依据 |
|---|---|---|---|
| [L-Eval](<https://github.com/OpenLMLab/LEval>) | 长文档和一条指令 | 简答、所选选项或较长回答 | [封闭题按答案匹配计分；开放题采用文本重合度、模型评分或人工评阅](<https://arxiv.org/pdf/2307.11088v1>) |
| [LongBench](<https://github.com/THUDM/LongBench/tree/main/LongBench>) | 中英文长文本和任务说明 | 答案、摘要、标签或补全的代码 | [按任务计算 F1、ROUGE 或代码相似度等指标](<https://github.com/THUDM/LongBench/blob/main/LongBench/eval.py>) |
| [Needle-in-a-Haystack](<https://github.com/gkamradt/needle-in-a-haystack>) | 含有预先插入事实的长文及问题 | 复述该事实的答案 | [原评测用模型判断能否正确回忆，按上下文长度和插入深度统计](<https://github.com/gkamradt/needle-in-a-haystack/tree/73ffdd4dd2d190d9306d9162a2401ae9a067ddcf>) |
| [InfiniteBench](<https://github.com/OpenBMB/InfiniteBench>) | 长上下文及具体问题或指令 | 检索值、答案、选项或摘要 | [依任务使用答案匹配、问答 F1、摘要 ROUGE 等指标](<https://arxiv.org/pdf/2402.13718v1>) |
| [LoCoMo](<https://github.com/snap-research/LoCoMo>) | 跨多轮会话的对话记录，以及问题或事件摘要请求 | 简短回答或相关事件的叙述 | [问答采用归一化答案 F1；事件摘要采用 ROUGE 和事实层面的精确率、召回率](<https://arxiv.org/pdf/2402.17753v1>) |
| [RULER](<https://github.com/NVIDIA/RULER>) | 合成的长上下文及任务查询 | 检索值、聚合结果或简答 | [按任务计算参考字符串覆盖率，或是否匹配任一参考答案](<https://github.com/NVIDIA/RULER/blob/main/scripts/eval/synthetic/constants.py>) |
| [BABILong](<https://github.com/booydar/babilong>) | 包含任务相关事实的长文及问题 | 由这些事实推得的简答 | [对照参考答案，按推理任务和上下文长度报告正确率](<https://arxiv.org/pdf/2406.10149v1>) |
| [HELMET](<https://github.com/princeton-nlp/HELMET>) | 长上下文和任务查询 | 答案、排好序的段落编号、摘要或任务标签 | [按上下文长度统计各任务指标，例如段落排序用 nDCG@10，摘要用模型评分](<https://arxiv.org/pdf/2410.02694v1>) |
| [LongMemEval](<https://github.com/xiaowu0162/LongMemEval>) | 带时间戳的多次会话及之后提出的问题 | 根据记忆给出的答案，或明确弃答 | [由模型对照参考答案判断正误](<https://github.com/xiaowu0162/LongMemEval/blob/main/src/evaluation/evaluate_qa.py>) |
| [LongBench v2](<https://longbench2.github.io/>) | 长上下文、问题及四个选项 | 选定的一个选项 | [按标准答案计算正确率，并按难度和上下文长度拆分](<https://arxiv.org/pdf/2412.15204v1>) |
| [Graphwalks](<https://huggingface.co/datasets/openai/graphwalks>) | 有向图、给定节点及查询 | 指定深度上的节点集合或父节点集合 | [将预测的节点集合与参考集合比较，同时注明数据划分和上下文长度](<https://openai.com/index/gpt-4-1/>) |

[打开本领域完整目录](https://yiming-shi.com/awesome-big-bench/zh/#browse?domain=Long-context%20%26%20Memory&scope=all)

</details>

<a name="domain-ai-research"></a><a name="autoresearch"></a>
<details>
<summary><strong>自动化科研</strong> · 11</summary>

| 评测 · 原始来源 | 输入 | 模型要给出什么 | 评分方法 · 依据 |
|---|---|---|---|
| [MLAgentBench](<https://arxiv.org/abs/2310.03302>) | 研究说明、文件、工具及评测指标 | 任务要求的产物，例如测试集预测 | [按各任务的成功标准评估目标完成情况](<https://arxiv.org/abs/2310.03302v1>) |
| [DiscoveryWorld](<https://arxiv.org/abs/2406.06769>) | 交互式模拟世界里的科学情境 | 实验动作及得到的解释 | [评估任务完成情况、实验步骤的进展和对发现的解释是否准确](<https://arxiv.org/abs/2406.06769v1>) |
| [DiscoveryBench](<https://github.com/allenai/discoverybench>) | 数据集、元数据及研究问题 | 由分析支持的自然语言假设 | [借助模型判断假设的背景、变量和关系是否吻合](<https://arxiv.org/abs/2407.01725v1>) |
| [LAB-Bench](<https://huggingface.co/datasets/futurehouse/lab-bench>) | 生物学研究问题及选项 | 所选选项，或弃答 | [统计正确率、已作答题目的正确比例及作答覆盖率](<https://arxiv.org/abs/2407.10362v1>) |
| [DSBench](<https://github.com/LiqiangJing/DSBench>) | 业务分析表格或竞赛建模数据 | 分析答案或测试集预测 | [检查回答是否正确，或按竞赛指标评估预测效果](<https://github.com/LiqiangJing/DSBench>) |
| [CORE-Bench](<https://crab.cs.princeton.edu/core-website/>) | 复现问题及计算研究项目的代码仓库 | 根据复现结果作出的回答 | [逐项对照参考结果检查答案](<https://arxiv.org/abs/2409.11363v1>) |
| [ScienceAgentBench](<https://osu-nlp-group.github.io/ScienceAgentBench/>) | 科研任务、数据及可选的专家指导 | Python 程序及其运行结果 | [按任务判断是否成功；也报告代码相似度和成本](<https://osu-nlp-group.github.io/ScienceAgentBench/>) |
| [MLE-bench](<https://github.com/openai/mle-bench>) | 竞赛说明、数据集和提交格式要求 | 含测试集预测的提交文件 | [按竞赛指标计分，并与人类榜单的奖牌门槛比较](<https://github.com/openai/mle-bench>) |
| [RE-Bench](<https://github.com/METR/RE-Bench>) | 开放式机器学习工程目标及限时环境 | 在任务环境中可运行的解法 | [将各任务分数归一化，与限时作答的人类成绩比较](<https://arxiv.org/pdf/2411.15114v1>) |
| [PaperBench](<https://openai.com/index/paperbench/>) | 机器学习论文、补充说明及复现环境 | 代码、运行说明及得到的研究产物 | [模型按论文作者制定的加权评分细则打分](<https://arxiv.org/pdf/2504.01848v1>) |
| [Terminal-Bench-Science](<https://www.terminal-bench-science.ai/announcement>) | 研究任务、相关输入文件及配置好的终端 | 按任务交付产物，例如重建后的图像或拟合好的模型 | [解决率：所有规定检查均通过的任务比例](<https://www.terminal-bench-science.ai/announcement>) |

[打开本领域完整目录](https://yiming-shi.com/awesome-big-bench/zh/#browse?domain=AutoResearch&scope=all)

</details>

<a name="domain-rsi"></a><a name="rsi"></a>
<details>
<summary><strong>递归自我改进（RSI）</strong> · 2</summary>

| 评测 · 原始来源 | 输入 | 模型要给出什么 | 评分方法 · 依据 |
|---|---|---|---|
| [PostTrainBench](<https://posttrainbench.com/>) | 小型基础模型、目标任务和固定算力 | 后训练后的模型 | [在留出的目标任务上评估，再汇总各个模型与任务组合的成绩](<https://arxiv.org/html/2603.08640v1>) |
| [FrontierRSI](<https://frontier-rsi.org/>) | 开放式 AI 工程目标和固定算力预算 | 对训练、推理流程或智能体运行框架的修改 | [按最佳有效尝试归一化各任务指标，再取两次尝试的平均分](<https://github.com/abundant-ai/frontier-rsi>) |

[打开本领域完整目录](https://yiming-shi.com/awesome-big-bench/zh/#browse?domain=RSI&scope=all)

</details>

<a name="domain-general"></a><a name="general"></a>
<details>
<summary><strong>通用能力</strong> · 15</summary>

| 评测 · 原始来源 | 输入 | 模型要给出什么 | 评分方法 · 依据 |
|---|---|---|---|
| [MMLU](<https://github.com/hendrycks/test>) | 一道学科题及四个选项 | 一个选项 | [按标准答案计算正确率](<https://arxiv.org/pdf/2009.03300v1>) |
| [BIG-bench](<https://github.com/google/BIG-bench>) | 任务提示，部分带有选项 | 生成文本或各候选答案的分数 | [每项任务自行定义指标，没有统一评分器](<https://arxiv.org/pdf/2206.04615v1>) |
| [MTEB](<https://github.com/embeddings-benchmark/mteb>) | 文本查询、段落或句对，取决于子任务 | 嵌入向量 | [各任务使用各自的指标；报告平均分时须注明套件或子集。](<https://arxiv.org/abs/2210.07316>) |
| [HELM](<https://crfm.stanford.edu/helm/>) | 按场景给出的文本提示或选项 | 依场景而定：生成内容或似然 | [按场景分别计算准确率、鲁棒性、校准度等指标](<https://arxiv.org/pdf/2211.09110v1>) |
| [AGIEval](<https://github.com/ruixiangcui/AGIEval>) | 考试题，部分带有选项 | 所选选项或填写的答案 | [选择题算正确率；填空题用精确匹配或 F1](<https://arxiv.org/abs/2304.06364v1>) |
| [Chatbot Arena (LMArena)](<https://www.lmsys.org/blog/2023-05-03-arena/>) | 同时发给两个匿名模型的用户提示 | 两份供比较的对话回答 | [用户两两投票，票数用于计算相对排名](<https://www.lmsys.org/blog/2023-05-03-arena/>) |
| [C-Eval](<https://cevalbenchmark.com/>) | 一道中文题和四个选项 | 选中的答案 | [按选择题正确率计分，比较时注明学科汇总方式和提示设置。](<https://arxiv.org/abs/2305.08322>) |
| [IFEval](<https://github.com/google-research/google-research/tree/master/instruction_following_eval>) | 包含一项或多项可验证约束的提示 | 一段生成的文本 | [按规则检查，在提示级和单条指令级分别统计严格及宽松正确率](<https://arxiv.org/abs/2311.07911v1>) |
| [MMLU-Pro](<https://github.com/TIGER-AI-Lab/MMLU-Pro>) | 涵盖多个学科的问题，每题最多十个选项 | 所选答案 | [按各科标准答案计算正确率](<https://arxiv.org/abs/2406.01574v1>) |
| [Humanity's Last Exam](<https://www.lastexam.ai/>) | 专家编写的问题，部分带图 | 所选选项或简答，以及作答信心 | [论文报告模型判定的正确率和均方根校准误差](<https://arxiv.org/pdf/2501.14249v1>) |
| [Artificial Analysis Intelligence Index](<https://artificialanalysis.ai/methodology/intelligence-benchmarking>) | 模型在该版指数各项组成评测上的成绩 | 一项综合指数得分 | [v5.0.1 用九项评测计算四个分类得分，每类权重为 25%；归一化方式和类内权重随版本而异。](<https://artificialanalysis.ai/methodology/intelligence-benchmarking>) |
| [HealthBench](<https://openai.com/index/healthbench/>) | 最后一条消息来自用户或临床医生的健康对话 | 一段自由文本回答 | [模型按医生制定的加权标准评分，再对各段对话取平均](<https://arxiv.org/pdf/2505.08775v1>) |
| [GDPval](<https://openai.com/index/gdpval/>) | 工作要求和参考资料 | 专业工作成果 | [专家在不知道作者身份的情况下，对比模型与人类的交付物](<https://openai.com/index/gdpval/>) |
| [APEX-Agents](<https://www.mercor.com/blog/introducing-apex-agents/>) | 专业任务说明、文件及办公应用 | 可直接交付客户的答复或成果 | [由专家制定评分细则，统计整项任务通过率及各项标准的平均分](<https://www.mercor.com/apex/methodology/>) |
| [LifeVal](<https://openai.com/index/lifeval/>) | 个人任务、相关背景、参考文件和工具 | 个性化结果或交付物 | [结合任务要求和初始状态，按细则评分](<https://cdn.openai.com/pdf/lifeval.pdf>) |

[打开本领域完整目录](https://yiming-shi.com/awesome-big-bench/zh/#browse?domain=General&scope=all)

</details>

[源数据](data/famous.csv) · [日期依据](verification/catalog.md) · [模型发布报告对照表](verification/flagships/directory-coverage.csv) · [待核查的候选](data/candidates_unverified.csv)

<a name="contribute-with-your-agent"></a>
## 让你的 Agent 补一条

有自己的评测，或者发现我们把两个版本弄混了？把论文或项目链接和你想改的地方交给 Codex、Claude Code 或其他编程 Agent。它核对版本、修改源数据、提 PR，维护者审核合并。**名字里没有 Bench 也能进目录。**

**[复制 PR 提示词](https://yiming-shi.com/awesome-big-bench/zh/#contribute)** · [纯文本](contribute/agent-prompt.zh.txt) · [贡献指南](CONTRIBUTING.md)

<details>
<summary>直接在 GitHub 里查看或复制提示词</summary>

```text
帮我向 https://github.com/yimingshi-cs/awesome-big-bench 补收录一个评测，或纠正一条记录。改动以我提供的说明和公开来源为准；缺其中一项就先问我。

先读 CONTRIBUTING.md，检查现有条目、具体版本和未合并的 PR。用原始论文、项目官网或有日期的版本公告核实，指明出处和版本。新评测即使不符合命名表的组合，也可以进目录；只有找到该名字的直接证据才能改变格子状态，不要为一次投稿直接加行或列。

在新分支修改源数据，不要手改生成的网页。新增或改写的展示文案需同时提供简体中文，保留官方名称、版本、指标和来源链接。运行：
python3 scripts/build_guide.py
python3 vote-service/catalog.py
python3 scripts/build_guide.py --check
python3 vote-service/catalog.py --check
python3 -m unittest discover -s tests

检查 diff。用我已授权的 GitHub 账号将分支推到我的 fork，向 yimingshi-cs/awesome-big-bench:main 提 PR。在 PR 里附上来源和检查结果，把链接给我；由项目维护者审核合并。如果无法提 PR，请给我补丁，并说明还差哪一步。
```

</details>

要纠正已有条目，就点那张卡上的「复制 PR 提示词」，复制的内容会带上具体条目或格子。要给命名表加一整行或一整列，需要核查每一个新组合。

<a name="community-vote"></a>
## 这个版本，你推荐吗？

每张目录卡都有当轮投票状态。开票后，对熟悉的版本点 **👍 夯**或 **👎 拉**就行，不用登录。请跳过你参与制作、评分或维护的版本。截止前，在同一浏览器里可以改票或撤回。

投票期间不展示实时票数。结束后按领域看结果；一版不足 20 票就不排名，不等于这个评测「拉」。[投票与计分规则](vote-service/OPERATIONS.md)。

<a name="bench-in-arxiv-titles"></a>
## arXiv 标题里的 “bench” 多了多少？

只比两年相同的 1–9 月：2020 年，51,439 篇 arXiv 计算机论文里有 314 篇标题含 `bench`（**0.61%**）；2026 年是 149,409 篇中的 6,215 篇（**4.16%**），占比约为原来的 **6.81 倍**。整个数据集（2020-01–2026-11，末月未满）共 17,809 个匹配的论文 ID。这里数的是标题，不是新评测：*benchmarking* 和 *workbench* 都算，HumanEval 这样的名字反而不会命中。[总览图](figures/overview.png)。

[看趋势图](https://yiming-shi.com/awesome-big-bench/zh/#trends) · [下载图表](figures/) · [每月数据](data/monthly.csv) · [统计口径](data/README.md) · [核查记录](verification/trends.md)

<a name="provenance-and-licenses"></a>
## 名字的来历与许可

**为什么叫 Big Bench？** [Xinye Li 问：当基础模型能做的事越来越多，PhD 还能做什么？](https://x.com/vclee8/status/2120212679470268893) [Greg Hu 把这个话题叫作「大 bench 理论」](https://x.com/greghxm_1/status/2120436200746242530)。项目名借自这段讨论，和 [BIG-bench 评测套件](https://github.com/google/BIG-bench) 不是一回事。

[离线 HTML：简体中文](https://yiming-shi.com/awesome-big-bench/offline/awesome-big-bench-zh.html) · [English](https://yiming-shi.com/awesome-big-bench/offline/awesome-big-bench-en.html)。想保存到本机，可以点官网页脚的「下载离线版」。

代码与原创文档采用 [MIT](LICENSE)，原创目录注释采用 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)。arXiv 描述性元数据采用 [CC0](https://info.arxiv.org/help/api/tou.html)；[项目标志](web/assets/marks/)按各自许可使用。

这个项目是我们周末和 AI 一起搓出来的。链接能打开，不代表它就能证明某个版本或分数。你熟悉的方向如果有错，欢迎带上原始出处，让你的 Agent 提个 PR。
