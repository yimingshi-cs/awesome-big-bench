"""Prepare a change to an existing ballot config. Deployment is a separate, explicit action."""
from datetime import datetime, timezone
from pathlib import Path
import argparse
import json

HERE=Path(__file__).resolve().parent
p=argparse.ArgumentParser(description=__doc__)
p.add_argument('state',choices=['open','close'])
p.add_argument('--until',help='Required when opening: an ISO date-time with an explicit timezone')
args=p.parse_args()
path=HERE/'wrangler.deploy.json'
config=json.loads(path.read_text());values=config['vars']
if values['CAMPAIGN_ID']!=json.loads((HERE/'campaign.json').read_text())['id']:
    p.error('Campaign ID differs from the website')
now=datetime.now(timezone.utc)
if args.state=='open':
    if not args.until:p.error('Use --until to set a public deadline before opening')
    end=datetime.fromisoformat(args.until.replace('Z','+00:00'))
    if not end.tzinfo or end<=now:p.error('Use a future deadline with a timezone')
    snapshots=HERE/'rounds';snapshots.mkdir(exist_ok=True)
    origin=snapshots/(values['CAMPAIGN_ID']+'.json')
    if not origin.exists():
        origin.write_text((HERE/'catalog.json').read_text())
    values['VOTING_OPEN']='true'
else:
    if args.until:p.error('--until only applies to opening')
    if not values.get('CLOSES_AT'):p.error('This ballot has not opened')
    end=min(datetime.fromisoformat(values['CLOSES_AT'].replace('Z','+00:00')),now)
    values['VOTING_OPEN']='false'
values['CLOSES_AT']=end.astimezone(timezone.utc).isoformat(timespec='seconds').replace('+00:00','Z')
path.write_text(json.dumps(config,indent=2)+'\n')
print('Prepared:',args.state,values['CAMPAIGN_ID'],values['CLOSES_AT'],'(not deployed)')
