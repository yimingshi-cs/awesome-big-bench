# Operating the community ballot

**The public website stays on GitHub Pages.** This Worker serves JSON only; its single D1 table is private. A ballot is about a particular directory **edition**, not a model score or a name-map vacancy. There is no results endpoint. No authentication, CAPTCHA, device fingerprint, tracking cookie, IP, email, GitHub identity, user-agent or per-vote timestamp is stored by this application. The hosting platform necessarily handles network requests. Worker observability is disabled in the deployment config.

## Lifecycle

The Worker accepts changes only when explicitly opened **and** an unexpired UTC deadline is configured. Pending is the initial state: `VOTING_OPEN=false`, `CLOSES_AT=""`. It can be deployed indefinitely without opening. A deadline expiring automatically stops changes; disabling early also stops changes. A new poll needs a new campaign ID. Do not reuse an old campaign's ballots.

The Pages client displays both buttons disabled while pending. A participant can recommend (夯) or not recommend (拉) an edition for the task it claims to measure. Vote only on editions you know; don't vote on an edition you made or maintained. There is no required quota of either choice. Reopening the same edition in the same browser lets a participant change or withdraw their vote until close. Skipping it creates nothing. Deliberate repeat voting across browsers is **not** prevented.

## Setup (maintainer)

Stay on **Workers Free**. Do not enable paid features or change billing to run this service. From `vote-service/`, use the official Wrangler CLI with the intended Cloudflare account. Do not put credentials in this repository. Check for an existing database and Worker with the intended name before creating resources; do not repurpose someone else's.

1. Run `python3 catalog.py --check` (regenerate with `python3 catalog.py` after a directory update). This builds the deployment allowlist from the public offline page; no private source is used.
2. If the database does not exist, create it once with `npx wrangler d1 create awesome-big-bench-votes`. Record its actual database ID.
3. Generate the ignored deployment config: `python3 configure.py --database-id "$DATABASE_ID"`. It binds `VOTES`, allows the exact Pages origin `https://yiming-shi.com`, disables Worker logs and leaves voting pending. Optional `--database-name` and `--worker-name` select alternate resource names.
4. Initialize the real database with `npx wrangler d1 execute awesome-big-bench-votes --remote --config wrangler.deploy.json --file schema.sql` and deploy with `npx wrangler deploy --config wrangler.deploy.json`. The migration uses `CREATE TABLE IF NOT EXISTS`; it does not delete existing data.
5. Use the actual HTTPS Worker origin reported by Wrangler. Signed out, GET `/v1/status?entry=gamecraft-bench` from it. Confirm the correct `campaign`, `phase:"pending"`, `closesAt:null` and edition count. The response checks the bound table is readable. Check CORS from the official website origin. No production ballot is needed for this test.
   If the first upload reports a 100% active deployment but the new workers.dev endpoint has no route, inspect `npx wrangler deployments list --config wrangler.deploy.json` and the exact Worker name/origin first. For a missing trigger, run only `npx wrangler triggers deploy --config wrangler.deploy.json`, then repeat the signed-out GET and CORS checks. Do not recreate the database or record a real vote as a health check.
6. The live site uses `https://yiming-shi.com/awesome-big-bench/api` as its API base. One dashboard-managed HTTPS route, `https://yiming-shi.com/awesome-big-bench/api/*`, maps only that subtree to `awesome-big-bench-votes`. Other zone routes, DNS and GitHub Pages hosting are independent. Do not assume the zone has a wildcard rule; inspect its current state. Keep the old workers.dev endpoint compatible with cached and downloaded guides. Confirm the same-origin `GET /awesome-big-bench/api/v1/status?entry=humaneval` and its database-backed state before pointing a page to it. Do not cast production test votes.

### Deploy code or round settings without changing routes

Use `npx wrangler versions upload --config wrangler.deploy.json`, inspect its bindings, and use the returned version ID with `npx wrangler versions deploy <VERSION_ID>@100% --config wrangler.deploy.json --yes`. This is a code/version deployment, not a trigger deployment. Leave the live dashboard-managed route alone. Inspect the current active version before each deployment; a version rollback uses the same command with the previously active version ID. If the project route itself must be removed, remove only the exact project API rule, never any other zone route. To undo a frontend cutover, restore the previous API base and publish the rebuilt guide before removing that project route.

To **open when the post is published**, first choose a closing date/time and set `UNTIL` to an ISO timestamp including its timezone, e.g. an agreed time ending in `+08:00`. Run `python3 control.py open --until "$UNTIL"`, inspect `wrangler.deploy.json`, then upload and deploy the version as above. GET the same-origin `/awesome-big-bench/api/v1/status` and verify `phase:"open"` and the precise `closesAt` timestamp. No Pages redeployment is needed. The first open command also captures the original edition allowlist under `rounds/<campaign-id>.json`; commit it when the opening is confirmed. If a launch is abandoned before it takes effect, use a fresh campaign ID for a different opening cohort. Later accepted editions may join the poll, but appear only in a separate appendix, not in the ranked opening cohort.

To **close early**, run `python3 control.py close` then version-deploy the same config as above and verify `phase:"closed"`. Otherwise the configured deadline closes voting without a scheduler.

## Storage and failure behavior

Each edition gets a separate cryptographically random 256-bit edit key. Only the browser stores that secret. Over HTTPS, the client sends it in the JSON body, never in an address, header, analytics or link. D1 stores only the campaign, edition ID, a scoped SHA-256 digest of the random key, and the current choice. A SQLite primary key and single upsert ensure repeated or concurrent writes from the same capability do not add extra votes; withdrawing deletes that row. Clearing local browser storage loses the ability to edit earlier votes. This is one current vote per retained browser capability per edition, not verified unique people.

Origin checks are for the browser boundary, **not** a claim to identify a voter or prevent abuse. The public API returns only poll state or the submitted capability's own saved choice; no public counts, identities, tokens or per-user history are returned. A timeout may follow a successful write: the client reads the saved choice before claiming success or retrying. When D1 or the network is unavailable, the client does not count a local vote.

## Results for the third post

After closing, use only aggregated data. From `vote-service/`:

```sh
npx wrangler d1 execute awesome-big-bench-votes --remote --config wrangler.deploy.json --file counts.sql --json > poll-counts.json
python3 tally.py poll-counts.json > poll-results.csv
```

`counts.sql` exports campaign, edition, positive/negative counts only. Until publication, keep exported results private. Preserve the voting period, campaign ID and catalog snapshot with the published summary. The default CSV excludes late entries and editions with fewer than 20 ballots. To list low/zero-vote editions separately use `--view appendix`; to retain every row for auditing use `--view all`. Keep old editions in the catalog during a poll; if an edition is renamed or removed, reconcile its stable slug before redeploying/emitting the tally. The tally refuses unknown edition IDs rather than losing votes. To reproduce a past poll, pass its saved snapshot with `--eligible` and its ID with `--campaign`.

Ranks only compare opinions **within a domain and edition**; no family pooling. Include `up`, `down` and `n`. With fewer than 20 ballots, label the edition 票数不足. At or above 20, use a two-sided 95% Wilson interval on the share of up votes: lower limit above 0.5 → 偏夯; upper limit below 0.5 → 偏拉; otherwise 暂难定. Inside a band the display order is descriptive, not evidence that adjacent editions differ. No-vote rows have no share or interval, not a 0% approval rating. Voluntary visitors are not a randomized sample; these bands summarize this poll and are not population confidence guarantees.

## Local checks

`node --test vote-service/tests/*.test.mjs` uses real HTTP, isolated SQLite, and the standard Node.js test runner (Node 22.13+ with `node:sqlite`). `python3 -m unittest discover -s vote-service/tests` checks aggregation and uncertainty bands. To exercise the production Worker runtime, use `wrangler dev --local` and a temporary local D1 database. Never run test ballots on a public production poll.

[Cloudflare D1 prepared statements](https://developers.cloudflare.com/d1/worker-api/prepared-statements/) · [Workers logging](https://developers.cloudflare.com/workers/observability/logs/workers-logs/) · [D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/) · [Wilson interval](https://www.itl.nist.gov/div898/handbook/prc/section2/prc241.htm).
