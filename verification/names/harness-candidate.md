# Should Harness be on the name map?

**Candidate for a prefix row, not a suffix column.** This is a placement decision, not a completed row of verdicts.

- [Harness-Bench](https://arxiv.org/abs/2605.27922) evaluates model–harness configurations on the same set of tasks under shared budgets. The harness (the layer managing tools, state and execution) is an experimental variable.
- [Harness Arena](https://github.com/Ondemand-OSS/harness-arena) holds the model and task constant and uses blind human judgments to compare harnesses. Public evaluation rules establish a name match; they do not establish wide adoption.
- The widely used [LM Evaluation Harness](https://github.com/EleutherAI/lm-evaluation-harness) runs many evaluations. Its existence is not evidence that a benchmark called “LM Harness” occupies a grid cell. Likewise [AgentHarness](https://github.com/ApodexAI/AgentHarness) runs other benchmarks, and [FrontierHarness Eval](https://frontierharness.org/about/) cannot be shortened to “FrontierHarness” to establish a match.
- [HarnessDev](https://arxiv.org/abs/2609.01437) illustrates a third question: can the model *build* a harness that performs well on held-out tasks? It need not fit a map cell to be considered for the directory.

A Harness prefix would add 11 checks at today's axes; a Harness suffix would now add 30, including Game. Recommend a prefix only after the full row has dated receipts. Revisit the suffix if several domains have independently documented benchmarks whose formal names end in Harness, rather than just runners. Neither axis was added in this release.
