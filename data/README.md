# What the trend counts

One unit is **one arXiv ID** with at least one `cs.*` category and a title containing the case-insensitive substring `bench`. Primary and cross-listed CS papers count once each. This includes *benchmarking*, *SWE-bench*, *MMBench*, and *workbench*. A benchmark with no matching word in its paper title can be absent; a paper evaluating an existing benchmark can be present.

The archive starts in January 2020. The collection cutoff is **November 20, 2026**, not a claim that all submissions through that date had already appeared. The latest retained v1 submission is November 19. November is a partial month.

## Sources and dates

- **17,010 snapshot matches:** [frozen revision of the public arXiv metadata mirror](https://huggingface.co/datasets/librarian-bots/arxiv-metadata-snapshot/tree/c428226b689a0e17db2cd55265133b9eca15d97f/data). Use the timestamp of `versions[].version == "v1"` (UTC) for the month. The searchable title and categories are the metadata available in the snapshot, not necessarily those printed on v1. Neither arXiv ID prefixes nor metadata update dates are substitutes for submission dates.
- **799 API-labelled matches:** dated October 11–November 19, including 23 on or before October 22. There is overlap in **dates**, not in retained IDs. See the [arXiv API manual](https://info.arxiv.org/help/api/user-manual.html).
- **Reproduction boundary:** the source snapshot independently reproduces the 17,010 matching IDs and all 81 full monthly totals from January 2020 through September 2026. The API-only months can be recalculated against the archived counts; the archive does not preserve the underlying API collection logs or the full denominator ID list. See the [audit and the live-query discrepancy](../verification/trends.md).

## Files

| File | Contents |
|---|---|
| [arxiv_bench.jsonl](arxiv_bench.jsonl) | One positive match per line: ID, title, v1 date, categories, first author, versioned rule labels and source. No abstracts; papers not matching the title filter are not included. |
| [monthly.csv](monthly.csv) | Numerators and all-paper denominators for all CS and six core CS categories. Derived shares are **fractions**: multiply by 100 to display percentages. `complete=no` means partial calendar month, not an error. |
| [monthly_by_domain.csv](monthly_by_domain.csv) | Counts of exclusive primary rule assignments. Across domains, including Other, the monthly counts sum to `bench_cs_all`. |
| [monthly_by_subtag.csv](monthly_by_subtag.csv) | Counts of overlapping topic tags across **all** matching papers, including incidental hits. The cards count non-incidental tags **within the named primary domain(s)**. |

`core` means any of `cs.AI, cs.CL, cs.CV, cs.LG, cs.RO, cs.SE`, not just the primary category. For any period, use **sum of matched papers / sum of all CS papers**. Averaging the published monthly percentages gives a different statistic. For example, Jan–Oct 2026 is 4.2060% pooled, but 4.1577% if months are weighted equally.

## How to read the domain labels

Classifier **`heuristic-v3-contextual-2026-11-20`** uses keyword rules over titles and abstracts, according to the producer. `domains_fired` and `subtags` retain all keyword hits, including incidental mentions. `subtags_incidental` identifies incidental hits; `domains_strong` contains the domain hits eligible to become the primary. Choose the first **strong** match in this order, or Other if none qualifies:

`RSI → AutoResearch → Embodied → Safety → Long-context & Memory → CUA → Coding → Multimodal → Reasoning → Other`.

For example, [SWE-bench](https://arxiv.org/abs/2310.06770) has an incidental long-context mention and a strong Coding hit. It counts once in Coding, not Long-context & Memory. All monthly labels are derived from the archived record-level outputs. The primary labels and subtag tables can change with a classifier revision; the title-keyword corpus does not.

| Domain | v2 (producer-reported) | v3 (recounted from every row) |
|---|---:|---:|
| Coding | 961 | 967 |
| CUA | 594 | 600 |
| Reasoning | 909 | 934 |
| Multimodal | 2,992 | 3,034 |
| Embodied | 1,080 | 1,080 |
| Safety | 689 | 675 |
| Long-context & Memory | 461 | 308 |
| AutoResearch | 108 | 108 |
| RSI | 38 | 38 |
| Other | 9,977 | 10,065 |

These are rough labels, not the population of benchmarks in each field. **Other is not synonymous with non-LLM**: 632 Other titles literally contain “large language model.” Its membership includes [FinBen](https://arxiv.org/abs/2402.12659) as well as [NAS-Bench-201](https://arxiv.org/abs/2001.00326). The curated directory's “General” category is not a corpus classifier bucket.

**What the reported spot-checks mean.** The original collection notes report 47/50 judgements consistent with **v2** rules (seed 20261121), an earlier targeted 102-paper coding audit with about 23 misses that informed v2, and agreement on 14 title-matched items in an earlier 29-item curated list. None is an accuracy estimate for v3 across 17,809 papers. The cited classifier source, rule text, annotated samples and flip journal were not in that producer Git tree. We can verify the released v3 traces and counts, not rerun title+abstract classification or certify its accuracy.

## Reproduce the cards

From the repository root:

```sh
python3 scripts/audit_trends.py
python3 scripts/plot_trends.py
```

The audit uses only the Python standard library. The plotter needs Matplotlib and an installed Chinese font (e.g., Noto Sans CJK SC; specify a different family with `--font`). The [Chinese card set](../figures/) includes a monthly share overview and eight field charts. An [alternative cover](../figures/overview-with-milestones.png) pairs the same curve with 20 separately labelled public milestones ([dated sources](../figures/credits.md)). The field charts show v3 rule-assigned matches **per 1,000 all-CS papers**, with tag counts printed below. They are not release timelines. See the [audit](../verification/trends.md) for the independent upstream replay command.
