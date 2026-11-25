[English](README.md) · 简体中文

# <img src="docs/bench-mark.svg" width="32" height="32" alt=""> Awesome Big Bench

<a name="where-to-start"></a>
给评测起名，先[查查有没有重名](@@SITE@@#names)；给模型选评测，可以[按任务找](@@SITE@@#directory)。也欢迎[补上你的评测](#contribute-with-your-agent)。

<a name="论文标题里的bench变多了吗"></a><a name="bench-in-arxiv-titles"></a>

[![每年 1–9 月，arXiv 计算机论文中标题含 bench 的比例，2020 至 2026 年。](docs/masthead-trend.zh-CN.svg)](@@SITE@@#trends)

图里数的是标题里出现「bench」的论文，不是新发布的评测。[逐月数据](data/monthly.csv) · [统计口径](verification/trends.md)

<a name="read-the-map"></a><a name="怎样读命名表"></a>

<a href="@@SITE@@#names?prefix=SWE&amp;suffix=Bench&amp;edition=swe-bench"><picture><source media="(max-width: 760px)" srcset="docs/masthead-compact.zh-CN.svg"><img src="docs/masthead.zh-CN.svg" width="100%" alt="SWE-bench 在模型报告中出现过；SWE-Dojo 暂未找到同名 AI 评测。附原版 SWE-bench 的任务和评分。"></picture></a>

薄荷绿表示已有同名评测，深绿表示 OpenAI、Anthropic 或 Google 也在模型报告里用过它；灰色表示查过，没找到同名评测。

<a name="从模型要做的事开始选"></a><a name="benchmark-directory"></a>@@FIELD_ANCHORS@@

[完整目录（@@DIRECTORY_COUNT@@ 条）](@@SITE@@#browse?scope=all) · [在 GitHub 看分领域对照表](guide/benchmarks.zh-CN.md)

<a name="补充评测或纠正一条记录"></a><a name="contribute-with-your-agent"></a>

## 漏了哪个评测？哪条写错了？

把下面这段贴给 Codex 或 Claude Code，再发给它一篇论文或一个官网链接就行。你自己做的评测也欢迎。

```text
帮我给这个 GitHub 仓库补评测或纠错：
https://github.com/yimingshi-cs/awesome-big-bench

如果我没说清是哪个版本、要改什么，或者没给来源，先问我。
按 CONTRIBUTING.md 查重，用原论文或官方发布说明核对这条改动。
更新中英文条目，重新生成文件并跑完检查。
从我的 fork 提一个 PR，写清改了什么、依据在哪，把链接发给我。
```

<a name="community-vote"></a><a name="provenance-and-licenses"></a>

[自己提 PR](CONTRIBUTING.md) · [数据来源、离线版与许可](guide/sources.zh-CN.md)
