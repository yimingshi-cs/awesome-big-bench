"""Write a local Wrangler config. Does not create or change remote resources."""
import argparse
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlsplit
from uuid import UUID
import json
import re

HERE = Path(__file__).resolve().parent
p = argparse.ArgumentParser(description=__doc__)
p.add_argument("--database-id", required=True, type=UUID)
p.add_argument("--database-name", default="awesome-big-bench-votes")
p.add_argument("--worker-name", default="awesome-big-bench-votes")
p.add_argument("--closes-at", default="", help="ISO timestamp with timezone (e.g. 2026-12-07T16:00:00Z)")
p.add_argument("--origin", action="append", help="Allowed HTTPS Pages origin; repeat to add another")
p.add_argument("--open", action="store_true", help="Allow ballot changes until the cutoff; off by default")
args = p.parse_args()
end = datetime.fromisoformat(args.closes_at.replace("Z", "+00:00")) if args.closes_at else None
if end is not None and end.tzinfo is None:
    p.error("--closes-at needs an explicit timezone")
if args.open and (not end or end <= datetime.now(timezone.utc)):
    p.error("--open requires a future --closes-at")
origins = args.origin or ["https://yiming-shi.com"]
for origin in origins:
    u = urlsplit(origin)
    if u.scheme != "https" or not u.hostname or u.username or u.password or u.query or u.fragment or u.path:
        p.error("Use an exact HTTPS origin, without a trailing slash")
for name in (args.database_name, args.worker_name):
    if not re.fullmatch(r"[a-z0-9-]{1,63}", name):
        p.error("Invalid resource name")
config = {
    "name": args.worker_name, "main":"worker.mjs", "compatibility_date":"2025-09-01",
    "workers_dev": True, "preview_urls":False, "observability":{"enabled":False},
    "d1_databases":[{"binding":"VOTES","database_name":args.database_name,"database_id":str(args.database_id)}],
    "vars":{
        "CAMPAIGN_ID":json.loads((HERE/"campaign.json").read_text())["id"],
        "CLOSES_AT":end.astimezone(timezone.utc).isoformat(timespec="seconds").replace("+00:00","Z") if end else "",
        "ALLOWED_ORIGINS":",".join(origins),"VOTING_OPEN":"true" if args.open else "false"
    }
}
out=HERE/"wrangler.deploy.json"
out.write_text(json.dumps(config,indent=2)+"\n")
print(out)
