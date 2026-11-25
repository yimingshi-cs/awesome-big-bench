[← 项目首页](../README.zh-CN.md) · [English](sources.md)

# 数据来源与许可

这个项目是我们周末和 AI 一起做的。目录难的地方不只是找到一篇论文，还要确认这篇论文能不能证明某个版本、任务或计分规则。[分领域对照表](benchmarks.zh-CN.md)保留了原始来源。离线阅读可在官网页脚下载[中文版](https://yiming-shi.com/awesome-big-bench/offline/awesome-big-bench-zh.html)或[英文版](https://yiming-shi.com/awesome-big-bench/offline/awesome-big-bench-en.html)。发现出处用错了，也可以直接把[纯文本提示词](../contribute/agent-prompt.zh.txt)交给编程助手。

## 怎样判断一个名字有没有人用

[命名表](https://yiming-shi.com/awesome-big-bench/zh/#names)查过 341 个前后缀组合，89 个找到了同名 AI 评测。薄荷绿表示已有评测；深绿表示还在 OpenAI、Anthropic 或 Google 的模型报告中找到使用记录。灰色只表示按[这些方法](../verification/names.md)查过、暂时没找到，不保证名字可用。点开格子可以看原始来源和检索记录。

例如，BenchBench 这个名字至少有两组研究者用过：[2024 年的论文](https://arxiv.org/abs/2407.13696)研究不同评测给出的模型排名是否一致；[2026 年的论文](https://arxiv.org/abs/2603.20807)研究模型自己设计评测的能力。名字相同，任务不同。

<picture><source media="(max-width: 640px)" srcset="../docs/masthead-compact.svg"><img src="../docs/masthead.svg" width="100%" alt="命名表示例：SWE、Game、Harness 三行与 Bench、Dojo、Exam 三列"></picture>

## arXiv 标题里的 bench

只比两年相同的 1–9 月：2020 年，51,439 篇 arXiv 计算机论文里有 314 篇标题含 `bench`（**0.61%**）；2026 年是 149,409 篇中的 6,215 篇（**4.16%**），占比约为原来的 **6.81 倍**。整个数据集（2020-01–2026-11，末月未满）共 17,809 个匹配的论文 ID。这里数的是标题，不是新评测：*benchmarking* 和 *workbench* 都算，HumanEval 这样的名字反而不会命中。[总览图](../figures/overview.png)。

[交互趋势图](https://yiming-shi.com/awesome-big-bench/zh/#trends) · [图表文件](../figures/) · [每月数据](../data/monthly.csv) · [统计口径](../data/README.md) · [核查记录](../verification/trends.md)

## 社区投票

投票针对具体版本。开票时，可以在条目上点「👍 夯」或「👎 拉」，表示是否推荐它用来测它声称的任务。无需登录；请跳过你参与制作、评分或维护的版本。截止前，在同一浏览器里可以改票或撤回。

投票期间不展示实时票数。结束后按领域看结果；不足 20 票的版本不参与排名，不等于不推荐。[投票与计分规则](../vote-service/OPERATIONS.md)

## 项目名与许可

[Xinye Li 问](https://x.com/vclee8/status/2120212679470268893)，当基础模型能做的事越来越多，PhD 还能做什么？[Greg Hu](https://x.com/greghxm_1/status/2120436200746242530)给这场讨论起了个名字：「大 bench 理论」。Awesome Big Bench 的名字借自这里，和 [BIG-bench 评测套件](https://github.com/google/BIG-bench)不是同一个项目。

代码与原创文档采用 [MIT](../LICENSE)，原创目录注释采用 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)。arXiv 描述性元数据采用 [CC0](https://info.arxiv.org/help/api/tou.html)；[项目标志](../web/assets/marks/)按各自许可使用。
