[English](README.md) · 简体中文

# <img src="docs/bench-mark.svg" width="32" height="32" alt=""> Awesome Big Bench

<a href="https://yiming-shi.com/awesome-big-bench/zh/#names?prefix=SWE&amp;suffix=Bench&amp;edition=swe-bench"><picture><source media="(max-width: 760px)" srcset="docs/masthead-compact.zh-CN.svg"><img src="docs/masthead.zh-CN.svg" width="100%" alt="从命名表到评测版本：SWE-bench 有模型报告记录，AgentDojo 已有同名评测，SWE-Dojo 查过但没找到同名评测。原版 SWE-bench 用测试给仓库补丁评分。"></picture></a>

<a name="where-to-start"></a>
**[打开命名表](https://yiming-shi.com/awesome-big-bench/zh/#names)** · **[按领域找评测](https://yiming-shi.com/awesome-big-bench/zh/#directory)** · **[投稿或纠错](https://yiming-shi.com/awesome-big-bench/zh/#contribute)**

给新评测起名，先查有没有重名；为模型选评测，按任务查它的输入、输出和评分依据。

## 怎样读命名表

把前缀和后缀交叉来看。**薄荷绿**表示已有同名 AI 评测；**深绿**表示还在 OpenAI、Anthropic 或 Google 的模型报告里找到了使用记录；**灰色**表示查过、暂时没找到同名评测，不保证名字可用。

点开 [SWE-Dojo](https://yiming-shi.com/awesome-big-bench/zh/#names?prefix=SWE&suffix=Dojo)：同名网站做的是面试练习，所以这格仍是灰色。[SWE × Eval](https://yiming-shi.com/awesome-big-bench/zh/#names?prefix=SWE&suffix=Eval) 则对应两项完全不同的工作：[SWE-eval](https://openreview.net/forum?id=aPeeUApKtW) 研究编程助手解决问题的过程，[SweEval](https://arxiv.org/abs/2505.17332) 研究模型在写作中怎么使用粗口。每格都能查到来源和[检索记录](verification/names.md)。

<a name="benchmark-directory"></a>
## 从模型要做的事开始选

[评测目录](https://yiming-shi.com/awesome-big-bench/zh/#directory)默认展示编辑精选。[全部 631 条记录](https://yiming-shi.com/awesome-big-bench/zh/#browse?scope=all)还收录了历史版本和模型发布报告中用到的评测。比如：

- **写出一个函数，还是修好一个仓库？** [HumanEval](https://yiming-shi.com/awesome-big-bench/zh/#browse?entry=humaneval) 给出 Python 函数签名和说明，用单元测试检查实现。[SWE-bench](https://yiming-shi.com/awesome-big-bench/zh/#browse?entry=swe-bench) 给的是 GitHub issue 和仓库；补丁既要解决问题，也要通过规定的回归测试。[看评分代码](https://github.com/SWE-bench/SWE-bench/blob/main/swebench/harness/grading.py)。
- **交一份竞赛预测，还是复现一篇论文？** [MLE-bench](https://yiming-shi.com/awesome-big-bench/zh/#browse?entry=mle-bench) 把模型的竞赛成绩和人类选手比较。[PaperBench](https://yiming-shi.com/awesome-big-bench/zh/#browse?entry=paperbench) 则按[评分细则](https://arxiv.org/pdf/2504.01848v1)逐项检查论文复现到了哪一步。

<details>
<summary>留在 GitHub 阅读：按领域查输入、输出和评分方法</summary>

- <a name="domain-coding"></a><a name="coding"></a>[编程](guide/benchmarks.zh-CN.md#domain-coding)
- <a name="domain-cua"></a><a name="cua"></a>[电脑操作与工具（CUA）](guide/benchmarks.zh-CN.md#domain-cua)
- <a name="domain-reasoning"></a><a name="reasoning"></a>[推理](guide/benchmarks.zh-CN.md#domain-reasoning)
- <a name="domain-multimodal"></a><a name="multimodal"></a>[多模态](guide/benchmarks.zh-CN.md#domain-multimodal)
- <a name="domain-embodied"></a><a name="embodied"></a>[具身智能](guide/benchmarks.zh-CN.md#domain-embodied)
- <a name="domain-safety"></a><a name="safety"></a>[安全](guide/benchmarks.zh-CN.md#domain-safety)
- <a name="domain-long-context"></a><a name="long-context--memory"></a>[长上下文与记忆](guide/benchmarks.zh-CN.md#domain-long-context)
- <a name="domain-ai-research"></a><a name="autoresearch"></a>[自动化科研](guide/benchmarks.zh-CN.md#domain-ai-research)
- <a name="domain-rsi"></a><a name="rsi"></a>[递归自我改进（RSI）](guide/benchmarks.zh-CN.md#domain-rsi)
- <a name="domain-general"></a><a name="general"></a>[通用能力](guide/benchmarks.zh-CN.md#domain-general)

</details>

<a name="contribute-with-your-agent"></a>
## 补充评测，或纠正一条记录

**[复制 PR 提示词](https://yiming-shi.com/awesome-big-bench/zh/#contribute)**，交给 Codex、Claude Code 或其他编程助手。从条目卡片上复制，提示词会自带记录编号。名字里没有「Bench」的评测也欢迎。

说清楚**哪个版本、改什么、依据在哪**。比如：

> 请核对 [SWE-bench Verified 的条目](https://yiming-shi.com/awesome-big-bench/zh/#browse?entry=swe-bench-verified)。[官方发布说明的「SWE-bench Verified」一节](https://openai.com/index/introducing-swe-bench-verified/)写的是 500 道经人工复核的题。如果缺了这条信息，请补在 Verified 版本，不要改到原版上。

助手先查重，再修改中英文数据、运行检查并提 PR，由维护者审核。[手动投稿指南](CONTRIBUTING.md) · [PR 核对清单](.github/pull_request_template.md)

<a name="bench-in-arxiv-titles"></a>
## 论文标题里的「bench」变多了吗？

[![逐年比较 1 至 9 月 arXiv 计算机论文标题中出现「bench」的比例。准确计数见逐月数据。](docs/masthead-trend.zh-CN.svg)](https://yiming-shi.com/awesome-big-bench/zh/#trends)

这里数的是**标题，不是新评测**：*benchmarking* 算一次，*HumanEval* 却不会命中。[按领域看趋势](https://yiming-shi.com/awesome-big-bench/zh/#trends) · [逐月数据](data/monthly.csv) · [统计口径](verification/trends.md)

<a name="community-vote"></a><a name="provenance-and-licenses"></a>
[版本投票规则](vote-service/OPERATIONS.md) · [数据来源、离线版与许可](guide/sources.zh-CN.md)
