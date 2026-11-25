"""Freeze the public directory IDs used by the ballot worker and its tally."""
import argparse
from html.parser import HTMLParser
import json
import re
from pathlib import Path

HERE = Path(__file__).resolve().parent


class PayloadParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.capturing = False
        self.data = []

    def handle_starttag(self, tag, attrs):
        if tag == "script" and dict(attrs).get("id") == "payload":
            self.capturing = True

    def handle_endtag(self, tag):
        if tag == "script":
            self.capturing = False

    def handle_data(self, data):
        if self.capturing:
            self.data.append(data)


def snapshot():
    parser = PayloadParser()
    parser.feed((HERE.parent / "docs" / "index.html").read_text())
    core=json.loads("".join(parser.data))
    index=json.loads((HERE.parent/'docs/parts/directory-index.json').read_text())
    if index['revision']!=core['parts']['directory-index']:raise ValueError('Stale full directory index')
    home={x['slug']:x for x in core['catalog']}
    entries=[{**home.get(k,{}),**v} for k,v in index['records'].items()]
    if len(entries)!=core['catalogSize']:raise ValueError('Incomplete ballot directory')
    out = {}
    for x in entries:
        slug = x["slug"]
        if not re.fullmatch(r"[a-z0-9][a-z0-9-]{0,149}", slug) or slug in out:
            raise ValueError(f"Invalid or duplicate ballot ID: {slug}")
        out[slug] = [x.get("display_name") or x["name"], x["domain"]]
    return json.dumps(dict(sorted(out.items())), ensure_ascii=False, indent=None, separators=(",", ":"))+"\n"


if __name__ == "__main__":
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--check", action="store_true")
    args = p.parse_args()
    target = HERE / "catalog.json"
    result = snapshot()
    if args.check:
        if not target.exists() or target.read_text() != result:
            raise SystemExit("Ballot catalog differs from the directory. Run python3 vote-service/catalog.py.")
    else:
        target.write_text(result)
