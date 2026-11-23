"""Build a by-domain, edition-specific report from Wrangler's aggregated D1 JSON export."""
import argparse
import csv
import json
import math
import sys
from pathlib import Path
from statistics import NormalDist

HERE=Path(__file__).resolve().parent
MIN_BALLOTS=20
BANDS=('偏夯','暂难定','偏拉','票数不足','期间新增')
Z=NormalDist().inv_cdf(.975)


def summarize(up,down):
    n=up+down
    if not n:
        return (BANDS[3],None,None,None)
    p=up/n
    center=(p+Z*Z/(2*n))/(1+Z*Z/n)
    radius=(Z/(1+Z*Z/n))*math.sqrt(p*(1-p)/n+Z*Z/(4*n*n))
    lo,hi=max(0,center-radius),min(1,center+radius)
    band=BANDS[3] if n<MIN_BALLOTS else BANDS[0] if lo>.5 else BANDS[2] if hi<.5 else BANDS[1]
    return band,p,lo,hi


def report(data,catalog,campaign,opening=None):
    if not isinstance(data,list) or len(data)!=1 or data[0].get('success') is not True or not isinstance(data[0].get('results'),list):
        raise ValueError('Expected the successful single-query JSON output of counts.sql')
    counts={}
    for row in data[0]['results']:
        if row['campaign']!=campaign: continue
        k=row['edition'];u=row['up'];d=row['down']
        if k not in catalog or k in counts or type(u)!=int or type(d)!=int or u<0 or d<0:
            raise ValueError('Unknown edition, duplicate aggregate or invalid count: '+str(k))
        counts[k]=(u,d)
    out=[]
    for k,(name,domain) in catalog.items():
        u,d=counts.get(k,(0,0));band,share,low,high=summarize(u,d)
        if opening is not None and k not in opening:band=BANDS[4]
        out.append(dict(campaign=campaign,domain=domain,edition=k,name=name,band=band,up=u,down=d,n=u+d,share=share,low=low,high=high))
    # Presentation order within a band, not a claim that adjacent ranks differ.
    return sorted(out,key=lambda x:(x['domain'].casefold(),BANDS.index(x['band']),
                                    -x['low'] if x['band']==BANDS[0] else -x['high'] if x['band']==BANDS[2] else -x['n'],
                                    x['name'].casefold(),x['edition']))


if __name__=='__main__':
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('counts',help='Wrangler JSON output of counts.sql (aggregates only)')
    p.add_argument('--eligible',type=Path,default=HERE/'catalog.json',help='Use the catalog snapshot that belonged to the poll')
    p.add_argument('--campaign',default=json.loads((HERE/'campaign.json').read_text())['id'])
    p.add_argument('--view',choices=['ranked','appendix','all'],default='ranked',help='Default excludes editions below the 20-ballot threshold')
    args=p.parse_args()
    opening=HERE/'rounds'/(args.campaign+'.json')
    if not opening.is_file():p.error('Opening catalog snapshot not found; do not rank an unstarted poll.')
    rows=report(json.loads(Path(args.counts).read_text()),json.loads(args.eligible.read_text()),args.campaign,json.loads(opening.read_text()))
    writer=csv.DictWriter(sys.stdout,fieldnames=['campaign','domain','edition','name','band','up','down','n','share','low','high'],lineterminator='\n')
    writer.writeheader()
    for row in rows:
        eligible=row['band'] in BANDS[:3]
        if (args.view=='ranked' and not eligible) or (args.view=='appendix' and eligible):continue
        writer.writerow({k:('' if v is None else f'{v:.5f}' if k in ['share','low','high'] else v) for k,v in row.items()})
