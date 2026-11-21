#!/usr/bin/env python3
"""Render nine Chinese social cards from the archived arXiv data. Requires matplotlib and a CJK font."""
import argparse
from collections import Counter
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib import font_manager, ticker
from audit_trends import ROOT, audit, read_csv

INK="#162C36"; MUTED="#435F69"; TEAL="#006C6A"; LIGHT="#9CC7C2"; GRID="#D7E4E3"
PAPER="#FAFCFC"; BLUE="#385F9A"
DOMAINS = [
 ("coding","代码能力",["Coding"],[("code_generation","代码生成"),("competitive_programming","竞赛编程"),("repo_level_swe","仓库级工程"),("terminal","终端操作")]),
 ("cua","电脑操作与工具使用",["CUA"],[("tool_calling","调用工具"),("os_desktop","桌面操作"),("web","浏览网页"),("mobile","移动设备")]),
 ("reasoning","推理与数学",["Reasoning"],[("general_reasoning","一般推理"),("math","数学"),("knowledge_exam","知识考试")]),
 ("multimodal","多模态",["Multimodal"],[("image","图像"),("audio","音频"),("video","视频")]),
 ("embodied","具身智能",["Embodied"],[("robotics","机器人"),("embodied_agent","具身智能体"),("vla","视觉–语言–动作")]),
 ("safety","安全",["Safety"],[("alignment","对齐"),("harm_safety","危害与安全"),("jailbreak","越狱"),("cybersecurity","网络安全")]),
 ("long-context-memory","长上下文与记忆",["Long-context & Memory"],[("long_context","长上下文"),("memory","记忆")]),
 ("autoresearch-rsi","自动化研究与自我改进",["AutoResearch","RSI"],[("ai_scientist","AI 科学家"),("science_agent","科学研究智能体"),("rsi","递归自我改进"),("mle_engineering","机器学习工程")]),
]
DPI=135


def style(font):
    options=[font] if font else ["Noto Sans CJK SC","Source Han Sans SC","PingFang SC","Heiti TC","Microsoft YaHei","Arial Unicode MS"]
    for name in options:
        try:
            f=font_manager.findfont(name, fallback_to_default=False)
            if not Path(f).is_file() or ord("题") not in font_manager.get_font(f).get_charmap(): continue
        except ValueError: continue
        plt.rcParams.update({"font.family":[name,"DejaVu Sans"],"axes.unicode_minus":False})
        return
    raise SystemExit("A Chinese font is required; pass --font 'Name of installed CJK font'.")


def sheet(small, title, subtitle):
    fig=plt.figure(figsize=(8,10),dpi=DPI,facecolor=PAPER)
    def label(x,y,s,size=12,bold=False,c=INK,**kw):
        return fig.text(x,y,s,ha="left",va="center",size=size,color=c,weight="bold" if bold else "normal",**kw)
    label(.072,.951,"AWESOME BIG BENCH",15,True,TEAL)
    fig.text(.928,.951,small,ha="right",va="center",size=12,color=MUTED)
    fig.add_artist(plt.Line2D([.072,.928],[.922,.922],transform=fig.transFigure,c=TEAL,lw=1))
    label(.072,.866,title,28,True)
    label(.072,.807,subtitle,13)
    return fig,label


def timeline(fig,totals,series,unit):
    x=list(range(len(totals)))
    cutoff=max(i for i,r in enumerate(totals) if r["complete"]=="yes")
    ax=fig.add_axes([.103,.458,.811,.248],facecolor=PAPER)
    ax.spines[:].set_visible(False); ax.grid(axis="y",ls="-",lw=.65,color=GRID); ax.set_axisbelow(True)
    max_y=max(max(s) for name,s,cl in series)
    for name,ys,cl in series:
        ax.plot(x[:cutoff+1],ys[:cutoff+1],color=cl,lw=2,label=name)
        if cutoff<len(x)-1:
            ax.plot(x[cutoff:],ys[cutoff:],color=cl,ls=(0,(2,2)),lw=1.4)
            ax.scatter(x[-1],ys[-1],s=38,facecolors=PAPER,edgecolors=cl,linewidths=1.6,zorder=4)
        if len(series)==1:
            ax.fill_between(x[:cutoff+1],0,ys[:cutoff+1],color=LIGHT,alpha=.27)
    ax.set_ylim(0,max_y*1.10 if max_y else 1);ax.set_xlim(-1,len(x)+.5)
    ticks=[i for i,r in enumerate(totals) if r["month"].endswith("-01")]
    ax.set_xticks(ticks,[totals[i]["month"][:4] for i in ticks]); ax.yaxis.set_major_locator(ticker.MaxNLocator(nbins=4,min_n_ticks=3))
    ax.tick_params(axis="both",which="both",length=0,pad=7,labelsize=10.5,colors=MUTED)
    fig.text(.072,.747,unit,fontsize=13,color=MUTED)
    if len(series)>1:
        ax.legend(frameon=False,ncol=2,loc="upper left",bbox_to_anchor=(0,.99),fontsize=9)
    fig.text(.072,.408,"每个点是一个月；2026 年 10 月含 API 补录，11 月空心点为部分月。",size=11,color=MUTED)


def footer(fig,lab,end,last):
    fig.add_artist(plt.Line2D([.072,.928],[.102,.102],transform=fig.transFigure,c=GRID,lw=1))
    lab(.072,.075,"来源：arXiv 元数据快照 + API ／ github.com/yimingshi-cs/awesome-big-bench",10,c=MUTED)
    lab(.072,.046,f"采集截止 {end}；最后一条记录的 v1 日期为 {last}。",10,c=MUTED)


def comparable_period(totals, yr):
    rs=[t for t in totals if t["complete"]=="yes" and t["month"].startswith(yr) and t["month"][5:] <= "09"]
    n=sum(int(t["bench_cs_all"]) for t in rs);d=sum(int(t["cs_all"]) for t in rs)
    return n,d,100*n/d


def overview(out, rows, totals):
    a,b=comparable_period(totals,"2020"),comparable_period(totals,"2026")
    fig,lab=sheet("arXiv 标题观察 ／ 总览","有多少 CS 论文，把 bench 写进标题？",f"从 2020 年至 2026 年 11 月，档案共收录 {len(rows):,} 篇命中论文。")
    timeline(fig,totals,[("月占比",[100*int(t["bench_cs_all"])/int(t["cs_all"]) for t in totals],TEAL)],"每月占比（标题命中数 ÷ 当月全部 CS 论文，%）")
    lab(.072,.352,"比较同一段月份",16,True)
    lab(.072,.299,"2020 年 1–9 月",13,c=MUTED);lab(.495,.299,"2026 年 1–9 月",13,c=MUTED)
    lab(.072,.250,f"{a[2]:.2f}%",27,True,TEAL);lab(.495,.250,f"{b[2]:.2f}%",27,True,TEAL)
    lab(.072,.203,f"{a[0]:,} / {a[1]:,} 篇",12);lab(.495,.203,f"{b[0]:,} / {b[1]:,} 篇",12)
    lab(.072,.145,"统计标题含 bench 的论文（含交叉分类），不是新发布的 benchmark 数量。",12)
    footer(fig,lab,totals[-1]["data_through"],max(r["date"] for r in rows))
    fig.savefig(out/"overview.png",dpi=DPI,facecolor=PAPER);plt.close(fig)


def discipline(out, rows, totals, domains, domain_totals):
    slug, title, keys, fields=domains
    sub=[r for r in rows if r["domain"] in keys]
    counts=Counter(t for r in sub for t in r["subtags"] if t not in r["subtags_incidental"])
    split=" ／ ".join(f"{k}：{sum(r['domain']==k for r in sub):,}" for k in keys)
    fig,lab=sheet("arXiv 标题观察 ／ 领域",title,f"标题含 bench，且由 v3 规则归为本类的论文：{len(sub):,} 篇。")
    series=[(k,[1000*int(row[k])/int(t["cs_all"]) for row,t in zip(domain_totals,totals)],color)
            for k,color in zip(keys,(TEAL,BLUE))]
    timeline(fig,totals,series,"每千篇 CS 论文中，标题命中且归入本类的篇数")
    lab(.072,.348,"这批论文命中了哪些任务标签？",16,True)
    by_tag=[(label,counts[tag]) for tag,label in fields]
    for j,(s,n) in enumerate(by_tag):
        x=.072 if j%2==0 else .51; y=.282-(j//2)*.068
        lab(x,y,s,12);fig.text(x+.34,y,f"{n:,}",ha="right",va="center",size=17,weight="bold",color=TEAL)
    note="按规则标签，不计顺带提及；同一篇可命中多项。"
    if len(keys)>1:
        lab(.072,.166,split,12,c=MUTED);lab(.072,.131,note,10.8,c=MUTED)
    else:lab(.072,.153,note,11.4,c=MUTED)
    footer(fig,lab,totals[-1]["data_through"],max(r["date"] for r in rows))
    fig.savefig(out/(slug+".png"),dpi=DPI,facecolor=PAPER);plt.close(fig)


# Dated editorial sample, not additional observations in the density series.
MILESTONES = ("mmlu","big-bench","humaneval","helm","chatbot-arena","libero","mmbench","longbench",
              "swe-bench","gpqa","gaia","harmbench","ruler","mle-bench","re-bench","humanitys-last-exam",
              "arc-agi-2","paperbench","terminal-bench","frontier-rsi")
def write_milestone_sources(out, items):
    """Use the same ordered records as the chart, with links to each dated event."""
    lines = [
        "# Sources for the timeline cover", "",
        "The [cover](overview-with-milestones.png) pairs two independent series: the monthly share of arXiv CS papers with “bench” in the title, and a selection of 20 named projects. The projects are examples, not the observations behind the line or a popularity ranking. A date records the cited public event; it may be a paper submission, announcement or earlier call for tasks, not a final release.", "",
        "[Trend data and methods](../data/README.md) · [Paper-level audit](../verification/trends.md) · [Catalog notes](../data/famous.csv). The cover uses project names and dates only; no third-party artwork is reproduced.", "",
        "| Project | Date | Dated source |", "|---|---|---|",
    ]
    for r in items:
        name = r["name"].replace("|", "&#124;")
        lines.append(f"| {name} | {r['date']} | [Primary record](<{r['date_source_url']}>) |")
    (out / "credits.md").write_text("\n".join(lines) + "\n", encoding="utf8")


def milestones(out, totals):
    catalog={r["slug"]:r for r in read_csv("famous.csv")}
    items=sorted((catalog[k] for k in MILESTONES),key=lambda r:(r["date"],r["name"]))
    a,b = comparable_period(totals,"2020"),comparable_period(totals,"2026")
    fig,lab=sheet("arXiv 标题观察 ／ 时间线","论文标题里的 bench，变多了",f"同样是 1–9 月：2020 年占 {a[2]:.2f}%，2026 年占 {b[2]:.2f}%。")
    ax=fig.add_axes([.103,.637,.811,.132],facecolor=PAPER)
    xs=list(range(len(totals))); ys=[100*int(t["bench_cs_all"])/int(t["cs_all"]) for t in totals]
    full=sum(t["complete"]=="yes" for t in totals)
    ax.spines[:].set_visible(False);ax.set_axisbelow(True);ax.grid(axis="y",color=GRID,lw=.65)
    ax.plot(xs[:full],ys[:full],lw=1.8,c=TEAL);ax.fill_between(xs[:full],0,ys[:full],color=LIGHT,alpha=.27)
    ax.plot(xs[full-1:],ys[full-1:],lw=1.4,ls=":",c=TEAL)
    ax.scatter(xs[-1],ys[-1],s=35,edgecolors=TEAL,facecolors=PAPER,zorder=4)
    jan=[i for i,r in enumerate(totals) if r["month"].endswith("-01")]
    ax.set_xticks(jan,[totals[i]["month"][:4] for i in jan]);ax.set_ylim(0,max(ys)*1.05)
    ax.set_yticks([0,2,4],["0%","2%","4%"]);ax.set_xlim(-1,len(xs)+.5)
    ax.tick_params(length=0,colors=MUTED,labelsize=9,pad=4)
    lab(.072,.588,"每月标题命中数 ÷ 全部 CS 论文；空心点是未满月的 2026 年 11 月。",11,c=MUTED)
    lab(.072,.532,"20 个代表作的公开记录",18,True)
    lab(.072,.495,"按有据可查的日期排序：有些是论文提交，有些是发布公告或征题记录。",11,c=MUTED)
    for j,r in enumerate(items):
        x=.072+(j%4)*.219; y=.443-(j//4)*.078
        fig.add_artist(plt.Line2D([x,x+.193],[y+.027,y+.027],transform=fig.transFigure,c=GRID,lw=.8))
        lab(x,y+.002,r["date"].replace("-","."),9.4,c=TEAL)
        display={"chatbot-arena":"Chatbot Arena"}.get(r["slug"],r["name"])
        lab(x,y-.023,display,10 if len(display)>14 else 11.2,True)
    fig.add_artist(plt.Line2D([.072,.928],[.073,.073],transform=fig.transFigure,c=GRID,lw=.8))
    lab(.072,.048,"数据与日期出处：github.com/yimingshi-cs/awesome-big-bench ／ figures/credits.md",9,c=MUTED)
    lab(.072,.023,"采集截止 2026-11-20。上方统计标题，不是对下方项目逐月计数。",9,c=MUTED)
    fig.savefig(out/"overview-with-milestones.png",dpi=DPI,facecolor=PAPER);plt.close(fig)
    write_milestone_sources(out, items)


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out",type=Path,default=ROOT/"figures")
    parser.add_argument("--font",help="installed Chinese font family (otherwise detected)")
    args=parser.parse_args();style(args.font);args.out.mkdir(exist_ok=True,parents=True)
    rows,totals=audit();domain_totals=read_csv("monthly_by_domain.csv")
    overview(args.out,rows,totals)
    milestones(args.out,totals)
    for spec in DOMAINS:discipline(args.out,rows,totals,spec,domain_totals)
    print(f"Wrote two overview variants + eight domain cards to {args.out}")


if __name__ == "__main__":
    main()
