#!/usr/bin/env python3
"""Reconcile the archived title corpus, summary tables and (optionally) HF parquet."""
import argparse
import calendar
import csv
import json
from collections import Counter, defaultdict
from datetime import date
from email.utils import parsedate_to_datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CORE = set("cs.AI cs.CL cs.CV cs.LG cs.RO cs.SE".split())
PRIORITY = ["RSI", "AutoResearch", "Embodied", "Safety", "Long-context & Memory",
            "CUA", "Coding", "Multimodal", "Reasoning"]
START = date(2020, 1, 1)
CLASSIFIER_VERSION = "heuristic-v3-contextual-2026-11-20"


def read_csv(name):
    with (ROOT / "data" / name).open(encoding="utf8", newline="") as stream:
        return list(csv.DictReader(stream))


def read_papers():
    with (ROOT / "data/arxiv_bench.jsonl").open(encoding="utf8") as stream:
        return [json.loads(line) for line in stream]


def require(condition, msg):
    if not condition:
        raise ValueError(msg)


def audit():
    rows = read_papers()
    totals, domains, subtags = map(read_csv, ["monthly.csv", "monthly_by_domain.csv", "monthly_by_subtag.csv"])
    months = [r["month"] for r in totals]
    end = date.fromisoformat(totals[-1]["data_through"])
    expected = [f"{y}-{m:02d}" for y in range(START.year, end.year + 1) for m in range(1, 13)
                if START <= date(y, m, 1) <= end]
    require(months == expected, "Missing, duplicated, or unordered months in monthly.csv")
    require(all([r["month"] for r in tab] == months for tab in (domains, subtags)),
            "The three summaries must cover the same months in the same order")
    domain_keys, tag_keys = set(domains[0]) - {"month", "total"}, set(subtags[0]) - {"month"}
    require(domain_keys == set(PRIORITY) | {"Other"}, "Unexpected domain set")
    seen = set()
    n_all, n_core = Counter(), Counter()
    dom, tags = defaultdict(Counter), defaultdict(Counter)
    sources = defaultdict(Counter)
    for r in rows:
        ident = r["id"]
        require(ident not in seen, f"Duplicate ID: {ident}")
        seen.add(ident)
        day = date.fromisoformat(r["date"])
        require(START <= day <= end, f"Date outside window: {ident}")
        cats = r["categories"].split()
        require("bench" in r["title"].lower() and any(c.startswith("cs.") for c in cats),
                f"Title/category filter failed: {ident}")
        require(cats[0] == r["primary_category"], f"Primary category disagrees with categories: {ident}")
        require(r["classifier_version"] == CLASSIFIER_VERSION, f"Unexpected classifier version: {ident}")
        fired, strong = r["domains_fired"], r["domains_strong"]
        require(len(fired) == len(set(fired)) and set(fired) <= set(PRIORITY), f"Unknown or repeated domains: {ident}")
        require(len(strong) == len(set(strong)) and set(strong) <= set(fired), f"Strong-domain trace: {ident}")
        primary = next((d for d in PRIORITY if d in strong), "Other")
        require(r["domain"] == primary, f"Priority on strong domains: {ident}")
        all_tags, incidental = r["subtags"], r["subtags_incidental"]
        require(len(all_tags) == len(set(all_tags)) and set(all_tags) <= tag_keys, f"Subtags: {ident}")
        require(len(incidental) == len(set(incidental)) and set(incidental) <= set(all_tags), f"Incidental subtags: {ident}")
        m = r["date"][:7]
        n_all[m] += 1
        n_core[m] += bool(CORE.intersection(cats))
        dom[m][r["domain"]] += 1
        tags[m].update(r["subtags"])
        sources[r["source"]][r["date"]] += 1
    periods = defaultdict(list)
    for t, d, s in zip(totals, domains, subtags):
        m = t["month"]
        first = date.fromisoformat(m + "-01")
        last = first.replace(day=calendar.monthrange(first.year, first.month)[1])
        require(t["data_through"] == min(last, end).isoformat(), f"Cutoff drift: {m}")
        require(t["complete"] == ("yes" if last <= end else "no"), f"Complete flag: {m}")
        for scope, n in (("all", n_all[m]), ("core", n_core[m])):
            denom = int(t[f"cs_{scope}"])
            require(n == int(t[f"bench_cs_{scope}"]) and 0 <= n <= denom, f"Numerator: {m}/{scope}")
            require(f"{n / denom:.6f}" == t[f"share_cs_{scope}"], f"Share: {m}/{scope}")
        require(int(t["cs_core"]) <= int(t["cs_all"]), f"Category denominator ordering: {m}")
        require(int(d["total"]) == n_all[m] and all(int(d[k]) == dom[m][k] for k in domain_keys), f"Domains: {m}")
        require(all(int(s[k]) == tags[m][k] for k in tag_keys), f"Subtags: {m}")
        if t["complete"] == "yes":
            periods[m[:4]].append(t)
    print(f"{len(seen):,} unique qualifying IDs; {len(months)} monthly rows × 3 tables match.")
    print("Period (full months only) | months | matches | cs denominator | matches/month | pooled % | mean monthly %")
    for year, a in periods.items():
        n, d = (sum(int(t[k]) for t in a) for k in ("bench_cs_all", "cs_all"))
        print(f"{year} | {len(a)} | {n} | {d} | {n/len(a):.2f} | {100*n/d:.4f} | "
              f"{100*sum(int(t['bench_cs_all'])/int(t['cs_all']) for t in a)/len(a):.4f}")
    season = {}
    for year in ("2020", "2026"):
        group = [t for t in totals if t["month"][:4] == year and t["month"][5:] <= "09"]
        n, d = (sum(int(t[k]) for t in group) for k in ("bench_cs_all", "cs_all"))
        season[year] = n / d
        require(len(group) == 9, f"Incomplete Jan–Sep period: {year}")
        print(f"{year} Jan–Sep: {n:,}/{d:,} = {100*n/d:.4f}%")
    print(f"Jan–Sep share ratio, 2026 to 2020: {season['2026']/season['2020']:.4f}x")
    for src, counts in sources.items():
        print(f"{src}: {sum(counts.values()):,}; {min(counts)} to {max(counts)}")
    print(f"Primary domains ({CLASSIFIER_VERSION}):", dict(Counter(r["domain"] for r in rows)))
    return rows, totals


def compare_snapshot(paths, rows, totals):
    """Optional independent scan; uses latest snapshot metadata, bucketed by v1 timestamp."""
    import pyarrow.parquet as pq
    files = sorted(p for i in paths for p in ([i] if i.is_file() else i.glob("*.parquet")))
    require(files, "No parquet files found")
    full = defaultdict(Counter)
    title_diffs, category_diffs = set(), set()
    upstream_matches = {}
    seen_shards = set()
    frozen = {r["id"]: r for r in rows if r["source"] == "snapshot"}
    api = {r["id"]: r for r in rows if r["source"] == "api"}
    last = date.fromisoformat(totals[-1]["data_through"])
    for f in files:
        require(f.name not in seen_shards, f"Repeated shard {f.name}")
        seen_shards.add(f.name)
        for b in pq.ParquetFile(f).iter_batches(columns=["id","title","categories","versions"], batch_size=8192):
            for r in b.to_pylist():
                cats = (r["categories"] or "").split()
                if not any(c.startswith("cs.") for c in cats):
                    continue
                stamp = next(v["created"] for v in r["versions"] if v["version"] == "v1")
                day = parsedate_to_datetime(stamp).date()
                if not START <= day <= last:
                    continue
                month = day.isoformat()[:7]
                full[month]["cs_all"] += 1
                full[month]["primary_cs"] += cats[0].startswith("cs.")
                full[month]["cs_core"] += bool(CORE.intersection(cats))
                if "bench" in (r["title"] or "").lower():
                    require(r["id"] not in upstream_matches, f"Duplicate upstream match {r['id']}")
                    upstream_matches[r["id"]] = day.isoformat()
                    if r["id"] in frozen:
                        retained = frozen[r["id"]]
                        if " ".join(r["title"].split()) != " ".join(retained["title"].split()):
                            title_diffs.add(r["id"])
                        if cats != retained["categories"].split():
                            category_diffs.add(r["id"])
                    full[month]["bench_cs_all"] += 1
                    full[month]["bench_cs_core"] += bool(CORE.intersection(cats))
    print(f"Independent parquet scan: {len(files)} files, {len(upstream_matches)} matches")
    for label, ids in (("upstream not frozen",set(upstream_matches)-set(frozen)),
                       ("frozen not upstream",set(frozen)-set(upstream_matches)),
                       ("date disagreements",{i for i in frozen.keys() & upstream_matches.keys() if frozen[i]["date"] != upstream_matches[i]}),
                       ("title disagreements after normalizing whitespace", title_diffs),
                       ("category-list disagreements", category_diffs),
                       ("API rows present in snapshot matches", set(api) & set(upstream_matches))):
        print(f"{label}: {len(ids)} (examples: {', '.join(sorted(ids)[:6])})")
    print("Diagnostic: January 2020, all-CS =", full["2020-01"]["cs_all"], "; primary-CS =", full["2020-01"]["primary_cs"])
    print("Month | differences (archive minus independent snapshot; late API dates will differ)")
    for t in totals:
        ds = {k:int(t[k])-full[t["month"]][k] for k in ("bench_cs_all","bench_cs_core","cs_all","cs_core")}
        if any(ds.values()): print(f"{t['month']}: {ds}")


if __name__ == "__main__":
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--snapshot-parquet", type=Path, nargs="+", help="also scan local shards of the original HF snapshot (requires pyarrow)")
    args = p.parse_args()
    rows, totals = audit()
    if args.snapshot_parquet:
        compare_snapshot(args.snapshot_parquet, rows, totals)
