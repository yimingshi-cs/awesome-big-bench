[← 项目首页](../README.zh-CN.md) · [English](benchmarks.md)

# 按任务选评测

同一领域的评测，也可能要求模型做完全不同的事。先看几组例子，再按领域查具体的输入、输出和评分办法。

| 你想测什么？ | 模型到底要做什么？ |
|---|---|
| 写代码 | [HumanEval](@@SITE@@#browse?entry=humaneval) 要补全一个函数；[SWE-bench](@@SITE@@#browse?entry=swe-bench) 要修好已有仓库里的一个问题。 |
| 用电脑 | [WebArena](@@SITE@@#browse?entry=webarena) 要在网站上办成一件事；[OSWorld](@@SITE@@#browse?entry=osworld) 要操作桌面应用。 |
| 玩游戏还是做游戏 | [Kaggle Game Arena](@@SITE@@#names?field=Embodied&prefix=Game&suffix=Arena) 让模型和对手玩已有的游戏；[GameCraft-Bench](@@SITE@@#browse?entry=gamecraft-bench) 要模型做出一款可玩的游戏。 |
| 记住信息 | [Needle in a Haystack](@@SITE@@#browse?entry=needle-in-a-haystack) 要找回事先埋入的信息；[LongMemEval](@@SITE@@#browse?entry=longmemeval) 要根据过去的多轮对话回答问题。 |
| 做研究 | [MLE-bench](@@SITE@@#browse?entry=mle-bench) 要提交机器学习竞赛方案；[PaperBench](@@SITE@@#browse?entry=paperbench) 要复现一篇已发表的论文。 |

## 分领域对照表

这里整理了 @@COUNT@@ 个评测的任务和评分依据。评测名称链接到原始论文或项目，评分方法链接到具体协议。[在线目录](@@SITE@@#directory)默认展示 @@FEATURED@@ 条精选；[全部 @@DIRECTORY_COUNT@@ 条记录](@@SITE@@#browse?scope=all)也包括历史版本和模型发布报告里提到的评测。

@@CATALOG@@

[目录源数据](../data/famous.csv) · [日期依据](../verification/catalog.md) · [模型报告对照表](../verification/flagships/directory-coverage.csv) · [待核查的候选](../data/candidates_unverified.csv)
