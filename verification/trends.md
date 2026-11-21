# Trend audit · corpus frozen November 20, 2026

**Publishable result:** In January–September 2020, 314 of 51,439 arXiv papers with a CS category had “bench” in their title (0.6104%). In the same nine months of 2026, it was 6,215 of 149,409 (4.1597%). The share was **6.81 times as high**. Both periods reproduce from the same [archived upstream metadata revision](https://huggingface.co/datasets/librarian-bots/arxiv-metadata-snapshot/tree/c428226b689a0e17db2cd55265133b9eca15d97f/data); neither depends on the later API supplement.

## What was checked and corrected

| Item | Earlier wording or assumption | Finding and action | Evidence |
|---|---|---|---|
| Entire corpus | 17,809 papers, sometimes described as benchmarks | **Keep 17,809 paper IDs**, not 17,809 benchmarks. All are unique and pass the title, date and CS-category tests; 914 are CS cross-lists with a non-CS primary category. | [Full corpus](../data/arxiv_bench.jsonl); [audit code](../scripts/audit_trends.py) |
| Source join | “Snapshot through October 22, API after October 22” | Snapshot: 17,010 positives; API: 799, of which 23 have v1 dates on or before October 22. Zero duplicate IDs. These are not disjoint date ranges. | Frozen revision and JSONL `source`, `date`, `id` |
| End date | “Through November 20” | Collection cutoff, not a full November 20 UTC submission day. Latest included paper is dated November 19; 546 November rows, partial month. | [One last-day example](https://arxiv.org/abs/2611.26565v1) |
| 7× | 2020 full year to 2026 Jan–Oct | Original arithmetic is consistent with the stored counts: **6.84×** (0.6146% → 4.2060%). Use the **6.81× Jan–Sep comparison** for a matched, independently reconstructed period. | Annual table below and upstream replay |
| Monthly denominators | “All counts are reproducible from these files” | All 83 monthly numerators, domain/subtag aggregates and stored share calculations reproduce locally. **Denominators require all papers**, not just positive rows. Independent source scan reproduces all 81 full months through 2026-09. Late API data have a different evidence level. | [Monthly counts](../data/monthly.csv); diagnostic below |
| Domain counts | Nine fields plus Other | All ten buckets sum to 17,809. They describe automatic label assignments, not field sizes, unique benchmarks, or research interest. | [By-domain counts](../data/monthly_by_domain.csv) |
| “Other” | Mostly non-LLM | Drop this characterization: 632 v3 Other titles literally contain “large language model”. Both [NAS-Bench-201](https://arxiv.org/abs/2001.00326) and [FinBen](https://arxiv.org/abs/2402.12659) are Other; [MMShopBench](https://arxiv.org/abs/2607.29002) is also Other despite being multimodal. | Frozen paper rows + linked papers |
| Classification accuracy | Originally 44/50 for an earlier ruleset; producer later reports 47/50 for v2 | Neither is a v3 accuracy estimate. The latter measures consistency with v2 rules on a small sample (seed 20261121); the sample and judgements are not present at the cited revision. | [Data methods](../data/README.md) |

## Annual arithmetic

The share pools paper counts; it does not average month-level rates. The 2026 row excludes November. The arithmetic below uses the frozen monthly file, not a fresh search count.

| Period | Months | Title matches | All CS papers | Matches / month | Pooled share |
|---|---:|---:|---:|---:|---:|
| 2020 | 12 | 439 | 71,428 | 36.58 | 0.6146% |
| 2021 | 12 | 639 | 77,524 | 53.25 | 0.8243% |
| 2022 | 12 | 755 | 82,121 | 62.92 | 0.9194% |
| 2023 | 12 | 1,312 | 100,040 | 109.33 | 1.3115% |
| 2024 | 12 | 2,415 | 125,494 | 201.25 | 1.9244% |
| 2025 | 12 | 4,485 | 152,210 | 373.75 | 2.9466% |
| 2026 Jan–Oct | 10 | 7,218 | 171,612 | 721.80 | 4.2060% |
| 2026 Nov, partial | — | 546 | 11,852 | — | 4.6068% |

## Reconciliation after the v3 classifier update (November 21)

Compared all 17,809 records from the v3 dataset with the earlier audited archive by paper ID. Every ID, title, v1 date, primary arXiv category, list of arXiv categories, first-author string and collection-source label is identical. The complete monthly census (including both denominators and cutoffs) is unchanged. **661 papers changed primary topic** between the original public-facing guide's rules and v3. This is a labelling revision, not a change to arXiv coverage or the 6.81× result.

| v3 primary label | Papers | v3 primary label | Papers |
|---|---:|---|---:|
| Coding | 967 | Safety | 675 |
| CUA | 600 | Long-context & Memory | 308 |
| Reasoning | 934 | AutoResearch | 108 |
| Multimodal | 3,034 | RSI | 38 |
| Embodied | 1,080 | Other | 10,065 |

Version: `heuristic-v3-contextual-2026-11-20` on every record. The priority order operates on **strong** domain hits, not all hits: 1,688 papers match multiple domains, 1,625 match multiple **strong** domains, 153 retain incidental subtags, and 65 match domains only incidentally. Applying priority to all domain hits instead would change 129 primary labels; e.g. [SWE-bench](https://arxiv.org/abs/2310.06770) fires long-context and coding rules, but only Coding is strong. For each ID, the audit checks strong hits against all hits and recomputes the primary from strong hits; it also reconciles monthly domain and inclusive subtag totals. Finer tags can overlap. The corpus contains 38 titles with “workbench”.

The v3 collection notes retain useful history: targeted n=102 recall work, a v2 consistency sample, and agreement on 14 in-corpus items from an earlier 29-item curated set. They do not validate how well v3 classifies all papers. Its keyword implementation, underlying abstracts, spot-check labels and intermediate flip journal were not supplied in that Git tree; the version checks above test **internal consistency** of v3 outputs rather than rerunning the classifier from source text.

## Independent source replay

1. Obtain the 11 upstream Parquet shards from the [pinned revision](https://huggingface.co/datasets/librarian-bots/arxiv-metadata-snapshot/tree/c428226b689a0e17db2cd55265133b9eca15d97f/data). The dataset is CC0. To run the optional replay, use a Python environment with PyArrow.
2. From the repository root, run:

   ```sh
   python3 scripts/audit_trends.py --snapshot-parquet /path/to/parquet-shards
   ```

   Without the option, the script checks only this repository's archive (no dependencies or network). With it, the script independently selects all CS-category articles and title matches, groups by UTC v1 date, compares paper IDs and dates, and prints month-level differences.
3. This audit checked row-group metadata across **all 11 shards**. Groups whose latest metadata update predates 2020 cannot contain v1 submissions dated 2020 or later. The surviving **29 groups from 6 shards** were scanned using the ID, title, categories, and version-history columns. The independently selected 17,010 matching IDs and their v1 dates, whitespace-normalized titles and ordered categories agree exactly with the repository's `source=snapshot` rows. For every month from January 2020 to September 2026, **all four counts** (matches and denominators, any CS and core CS) agree exactly.
4. In October the upstream snapshot supplies **750 matches / 16,834 CS papers**. The stored full month is **1,003 / 22,203**: the supplement contributes 253 archived paper IDs and 5,369 additional denominator counts. In November the entire **546 / 11,852** is API-derived. The 799 positive IDs are present; the complete API request list, retrieval timestamps, and denominator IDs are not.

### Why not replace the October denominator with a fresh search?

A November 20 spot-check using the [official API and its documented date filter](https://info.arxiv.org/help/api/user-manual.html) returned **21,835** for [all CS in October 2026](https://export.arxiv.org/api/query?search_query=cat%3Acs.%2A%20AND%20submittedDate%3A%5B202610010000%20TO%20202610312359%5D&max_results=1), versus **22,203** in the archive. A control on [January 2020](https://export.arxiv.org/api/query?search_query=cat%3Acs.%2A%20AND%20submittedDate%3A%5B202001010000%20TO%20202001312359%5D&max_results=1) returned **3,854** versus **4,268** independently counted from the snapshot (which includes cross-lists; its primary-CS-only total is 3,186). A live search and a frozen metadata scan are therefore not interchangeable in these checks. The cause of either difference was not established. Do not infer that the archive double-counted exactly 368 papers, and do not splice in the live figure. Preserve the frozen October/November values and call them archive estimates pending a full, ID-level API replay.

## Chart usage

[Overview + eight Chinese cards](../figures/) and their [drawing code](../scripts/plot_trends.py) use the same audited monthly totals. Overall: percent of all CS papers. By domain: v3 primary assignments per 1,000 CS papers. Printed task-tag totals exclude incidental tags and are restricted to the named domain(s); the separate monthly subtag table retains all hits. The November point is hollow; it is not an extrapolation. The [alternate cover](../figures/overview-with-milestones.png) includes a separate panel of 20 curated projects, with [dated event sources](../figures/credits.md). Curated events are **not observations on these curves**. Changes in these series do not by themselves establish why benchmarking increased, whether a field is popular, or how many names are available.
