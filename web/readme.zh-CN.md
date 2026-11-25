[English](README.md) · **简体中文**

<a name="awesome-big-bench"></a>
@@HERO@@

**叫 BenchBench 的论文已经有两篇了。** [2024 年那篇](https://arxiv.org/abs/2407.13696)问：同一批模型换个榜，排名还一致吗？[2026 年那篇](https://arxiv.org/abs/2603.20807)问：让模型自己出题，能不能设计出靠谱的评测？不是续作，是撞名。

**[查名字](https://yiming-shi.com/awesome-big-bench/zh/#names)** · **[看精选评测](https://yiming-shi.com/awesome-big-bench/zh/#directory)** · **[让 Agent 提 PR](#contribute-with-your-agent)**

查过的 **@@COMBINATIONS@@ 个前后缀组合**里，**@@TAKEN@@ 个**已有同名 AI 评测。薄荷绿是已有评测，深绿表示 OpenAI、Anthropic 或 Google 在模型报告里用过；灰格是[查过、暂未找到](verification/names.md)。

<a name="where-to-start"></a>
## 找评测，先看任务

[目录](https://yiming-shi.com/awesome-big-bench/zh/#directory)默认展示 **@@FEATURED@@ 条精选**。[全部 @@DIRECTORY_COUNT@@ 条记录](https://yiming-shi.com/awesome-big-bench/zh/#browse?scope=all)里也能查到历史版本和模型发布报告里用过的评测。选榜时可以先看这几组：

| 你想测什么？ | 模型到底要做什么？ |
|---|---|
| 写代码 | [HumanEval](https://yiming-shi.com/awesome-big-bench/zh/#browse?entry=humaneval) 要补全一个函数；[SWE-bench](https://yiming-shi.com/awesome-big-bench/zh/#browse?entry=swe-bench) 要修好已有仓库里的一个问题。 |
| 用电脑 | [WebArena](https://yiming-shi.com/awesome-big-bench/zh/#browse?entry=webarena) 要在网站上办成一件事；[OSWorld](https://yiming-shi.com/awesome-big-bench/zh/#browse?entry=osworld) 要操作桌面应用。 |
| 玩游戏还是做游戏 | [Kaggle Game Arena](https://yiming-shi.com/awesome-big-bench/zh/#names?field=Embodied&prefix=Game&suffix=Arena) 让模型和对手玩已有的游戏；[GameCraft-Bench](https://yiming-shi.com/awesome-big-bench/zh/#browse?entry=gamecraft-bench) 要模型做出一款可玩的游戏。 |
| 记住信息 | [大海捞针](https://yiming-shi.com/awesome-big-bench/zh/#browse?entry=needle-in-a-haystack) 要找回事先埋入的信息；[LongMemEval](https://yiming-shi.com/awesome-big-bench/zh/#browse?entry=longmemeval) 要根据过去的多轮对话回答问题。 |
| 做研究 | [MLE-bench](https://yiming-shi.com/awesome-big-bench/zh/#browse?entry=mle-bench) 要提交机器学习竞赛方案；[PaperBench](https://yiming-shi.com/awesome-big-bench/zh/#browse?entry=paperbench) 要复现一篇已发表的论文。 |

<a name="benchmark-directory"></a>
## 按领域查评测

不离开 GitHub 也可以查：下面按领域整理了 **@@COUNT@@ 个评测**的输入、输出和评分方法。点名字看原始论文或项目，点最后一列看评分依据。

@@CATALOG@@

[源数据](data/famous.csv) · [日期依据](verification/catalog.md) · [模型发布报告对照表](verification/flagships/directory-coverage.csv) · [待核查的候选](data/candidates_unverified.csv)

<a name="contribute-with-your-agent"></a>
## 让你的 Agent 补一条

有自己的评测，或者发现我们把两个版本弄混了？把论文或项目链接和你想改的地方交给 Codex、Claude Code 或其他编程 Agent。它核对版本、修改源数据、提 PR，维护者审核合并。**名字里没有 Bench 也能进目录。**

**[复制 PR 提示词](https://yiming-shi.com/awesome-big-bench/zh/#contribute)** · [纯文本](contribute/agent-prompt.zh.txt) · [贡献指南](CONTRIBUTING.md)

<details>
<summary>直接在 GitHub 里查看或复制提示词</summary>

```text
@@AGENT_PROMPT@@
```

</details>

要纠正已有条目，就点那张卡上的「复制 PR 提示词」，复制的内容会带上具体条目或格子。要给命名表加一整行或一整列，需要核查每一个新组合。

<a name="community-vote"></a>
## 这个版本，你推荐吗？

每张目录卡都有当轮投票状态。开票后，对熟悉的版本点 **👍 夯**或 **👎 拉**就行，不用登录。请跳过你参与制作、评分或维护的版本。截止前，在同一浏览器里可以改票或撤回。

投票期间不展示实时票数。结束后按领域看结果；一版不足 20 票就不排名，不等于这个评测「拉」。[投票与计分规则](vote-service/OPERATIONS.md)。

<a name="bench-in-arxiv-titles"></a>
## arXiv 标题里的 “bench” 多了多少？

@@TREND@@

[看趋势图](https://yiming-shi.com/awesome-big-bench/zh/#trends) · [下载图表](figures/) · [每月数据](data/monthly.csv) · [统计口径](data/README.md) · [核查记录](verification/trends.md)

<a name="provenance-and-licenses"></a>
## 名字的来历与许可

**为什么叫 Big Bench？** [Xinye Li 问：当基础模型能做的事越来越多，PhD 还能做什么？](https://x.com/vclee8/status/2120212679470268893) [Greg Hu 把这个话题叫作「大 bench 理论」](https://x.com/greghxm_1/status/2120436200746242530)。项目名借自这段讨论，和 [BIG-bench 评测套件](https://github.com/google/BIG-bench) 不是一回事。

[离线 HTML：简体中文](https://yiming-shi.com/awesome-big-bench/offline/awesome-big-bench-zh.html) · [English](https://yiming-shi.com/awesome-big-bench/offline/awesome-big-bench-en.html)。想保存到本机，可以点官网页脚的「下载离线版」。

代码与原创文档采用 [MIT](LICENSE)，原创目录注释采用 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)。arXiv 描述性元数据采用 [CC0](https://info.arxiv.org/help/api/tou.html)；[项目标志](web/assets/marks/)按各自许可使用。

这个项目是我们周末和 AI 一起搓出来的。链接能打开，不代表它就能证明某个版本或分数。你熟悉的方向如果有错，欢迎带上原始出处，让你的 Agent 提个 PR。
