# Cloudflare cost estimate – Modern Software Engineer Simulator

Status: Phase 2 estimate | 23 November 2026 | Prices from Cloudflare docs (Workers pricing page last updated 2 Oct 2026). Verify before deploying.

## TL;DR

| Setup | Who it is for | Realistic monthly cost |
|---|---|---|
| **A. Static game, chosen architecture (ADR 001/002)** | Semester MVP up to millions of players | **$0** |
| A + custom domain | Want `something.com` instead of `*.workers.dev` / `*.pages.dev` | **≈ $0.90/month** (~$10–11/year for `.com`, at cost) |
| B. Hypothetical cloud saves (Worker + D1), sensible sync | Only if accounts/device sync become a requirement | **$0** up to ~10k daily players, then **$5–10** up to ~100k |
| B with naive 10 s server sync | Anti-pattern, shown to explain cost drivers | $24 at 10k DAU, **$676** at 100k DAU |

The architecture is a static client-side app, and Cloudflare does not bill for static asset requests or bandwidth. Hosting costs nothing at any realistic scale. Money is only spent if the team adds a backend, which the requirements do not call for. Even then, the cost depends far more on **how often the client syncs** than on how many players there are.

---

## 1. What the architecture actually needs

From `architecture.md`, `hosting.md` and the ADRs:

- Build output: static HTML/CSS/JS from Vite + React + TypeScript.
- **No backend, no database, no API.** The game state lives in `localStorage` (ADR 002).
- Autosave every 10 s happens **locally** (`mvp.md`), so it causes no network traffic.
- After the first page load the game makes no network requests, because tick, offline progress and achievements are all computed in the browser.

So the Cloudflare products involved are **static assets hosting** (Workers Static Assets or Pages), **builds**, and optionally **DNS/Registrar**.

> Cloudflare now steers new projects to **Workers with static assets** over Pages. Billing for static files is the same on both: free and unlimited.

## 2. Scenario A: static hosting (the chosen architecture)

### 2.1 Line items

| Item | Free plan allowance | Our expected usage | Cost |
|---|---|---|---|
| Static asset requests | **Unlimited, not billed** | All traffic | $0 |
| Bandwidth / egress | **Unlimited, not billed** (no egress fees) | ~1 MB per monthly player (see 2.2) | $0 |
| Files per deployment | 20,000 files (Free), 100,000 (Paid) | < 50 files for a Vite build | $0 |
| Max file size | 25 MiB per file | Largest bundle < 1 MB | $0 |
| Builds (Pages) | 500 builds/month, 1 concurrent, 20 min timeout | ~5–20 pushes/day for a student team, about 150–600/month | $0 (see note) |
| Builds (Workers Builds) | 3,000 build minutes/month | ~2 min per build (`npm ci` + `vite build`) → ~1,500 builds | $0 |
| Preview deployments | Included | Per branch/PR | $0 |
| HTTPS / TLS certificate | Included | Yes | $0 |
| DDoS protection, CDN | Included | Yes | $0 |
| Web Analytics (privacy-friendly, no cookies) | Included | Optional | $0 |
| Zero Trust Access (lock preview URLs to the team) | Free up to 50 users | Optional | $0 |
| Custom domain via Cloudflare Registrar | At-cost: registry + ICANN fee, no markup | Optional, 1 domain | ~$10–11/year for `.com` |

**Build-limit note:** 500 Pages builds per month only becomes tight if every push on every branch triggers a build during a deadline crunch. Workers Builds (3,000 minutes) leaves more headroom. Either way the fix is to build only `master` and PR branches, not to pay.

### 2.2 Traffic assumptions

| Assumption | Value | Reasoning |
|---|---|---|
| First visit download | ~300 KB gzipped | React + game code + CSS + a font/sound or two |
| Returning visit | ~50 KB | Hashed Vite assets are cached by the browser; only `index.html` and revalidations |
| Sessions per player per month | ~10 | Short 5–15 min sessions per `software-engineer-simulator.md` |
| **Bandwidth per monthly active player (MAU)** | **≈ 0.75 MB → rounded to 1 MB** | 300 KB + 9 × 50 KB |

### 2.3 Scaling by player count (static only)

| MAU | Bandwidth / month | Requests / month (~20 per visit) | Cloudflare cost |
|---|---|---|---|
| 100 (team + testers) | 0.1 GB | 20k | **$0** |
| 1,000 (course + friends) | 1 GB | 200k | **$0** |
| 10,000 (posted on Reddit/HN once) | 10 GB | 2M | **$0** |
| 100,000 | 100 GB | 20M | **$0** |
| 1,000,000 | ~1 TB | 200M | **$0** |

No Cloudflare plan upgrade is needed at any of these levels. The $20/month Pro plan adds WAF rules, image optimisation and more builds, none of which this game needs.

### 2.4 Semester budget (Scenario A)

| | Without domain | With `.com` domain |
|---|---|---|
| Hosting | $0 | $0 |
| Database / backend | $0 | $0 |
| Domain | – | ~$10–11 (one-off for the year) |
| **Total for a 6-month semester** | **$0** | **≈ $11** |

Cloudflare bills in USD. Private (non-business) accounts in Germany also pay 19 % VAT, which only matters for the domain.

---

## 3. Scenario B: hypothetical cloud saves (not in scope)

`architecture.md` §6 sketches a possible future API (`GET/PUT /api/v1/save`). This section shows what that would cost on Cloudflare, so the team can judge the "AI suggested a backend" option with numbers. **It is not a recommendation to build it.**

### 3.1 Stack and prices

| Component | Free plan | Workers Paid ($5/month minimum) |
|---|---|---|
| Worker requests | 100,000/day (hard cap, then error 1027) | 10M/month included, then **$0.30 per million** |
| Worker CPU time | 10 ms per request | 30M CPU-ms/month included, then **$0.02 per million CPU-ms** |
| D1 rows written | 100,000/day | 50M/month included, then **$1.00 per million** |
| D1 rows read | 5M/day | 25B/month included (effectively unlimited for us) |
| D1 storage | 5 GB total | 5 GB included, then $0.75/GB-month; **10 GB max per database** |
| KV writes (not recommended here) | **1,000/day** | 1M/month included, then **$5.00 per million** |

**Why D1 and not KV:** KV's free tier allows only 1,000 writes a day. A naive 10 s sync uses that up with **about 3 player-hours a day**, and paid KV writes cost 5× more than D1 rows. KV is built for read-heavy, rarely-written data, and save games are the reverse.

### 3.2 Model assumptions

- Each daily active player (DAU) plays **30 min/day** and loads once per day.
- Each server sync is 1 Worker request + 1 D1 row written (upsert by player ID, primary key only).
- ~2 ms CPU per request (JSON validation; D1 wait time is not billed as CPU).
- ~2 KB per save, with stored players ≈ 5 × DAU.
- Local autosave stays at 10 s. Only the **server sync** interval changes.

| Sync policy | Requests per player-hour |
|---|---|
| Naive: send every local autosave (10 s) | 360 |
| Every 60 s + on `visibilitychange`/tab close | ~62 |
| Every 5 min + on tab close (recommended) | ~14 |

### 3.3 Monthly cost by DAU and sync policy

| DAU | 10 s sync | 60 s sync | **5 min sync** |
|---|---|---|---|
| 100 | $0 (Free) | $0 (Free) | **$0 (Free)** |
| 1,000 | $5 (exceeds Free daily cap) | $0 (Free) | **$0 (Free)** |
| 10,000 | $23.86 | $5 | **$0 (Free, ~80k req/day)** |
| 100,000 | $676 | $77 | **$9.56** |
| 1,000,000 | $7,201 ¹ | $1,212 ¹ | **$247** ¹ |

¹ At 1M DAU a single D1 database breaks down before the bill does. Average write throughput is 200–2,000 writes/s, with spikes above that, and stored saves approach the 10 GB per-database limit. That tier needs sharding or per-player Durable Objects (§4.3).

Breakdown of the 100,000 DAU column:

| Line item | 10 s sync | 60 s sync | 5 min sync |
|---|---|---|---|
| Base (Workers Paid) | $5.00 | $5.00 | $5.00 |
| Requests over 10M | $159.90 (543M req) | $25.80 (96M) | $4.20 (24M) |
| CPU over 30M ms | $21.12 | $3.24 | $0.36 |
| D1 writes over 50M | $490.00 (540M rows) | $43.00 (93M) | $0 (21M) |
| D1 storage | $0 (~1 GB) | $0 | $0 |
| **Total** | **$676.02** | **$77.04** | **$9.56** |

**Takeaway:** at a fixed player count, the sync interval moves the cost by a factor of about 70. Debouncing server writes is the main way to control cost. This matches the elapsed-time design the architecture already uses: the server only needs a recent snapshot, not every tick.

### 3.4 Abuse and cost-risk notes

- Cheating is out of scope (`architecture.md` §7), but **cost abuse** is not. A script hammering `PUT /save` on the Paid plan costs ~$0.30 per million requests plus D1 writes. That is cheap, but it is not zero.
- Mitigations available on Free: one rate-limiting rule (e.g. 1 save per player per 30 s), Turnstile (free) on account creation, and validating the payload size before writing.
- On the **Free** plan the risk is availability rather than cost: once the daily cap is hit, the API returns errors until 00:00 UTC. Because saves stay in `localStorage` too, the game keeps working.

---

## 4. Scaling vs. player locality and the CDN

### 4.1 How Cloudflare serves the static game

- Anycast network in **330+ cities**. Every plan, Free included, is served from the same network, and there are **no regional price tiers or egress fees**.
- Hashed Vite assets are cached at the edge and in the browser. After the first ~300 KB the game runs fully offline, so latency only affects how quickly **first load** happens and has no effect on gameplay.
- **Exceptions:**
  - **Mainland China:** serving from inside China (China Network) needs an Enterprise plan and an ICP licence. Chinese players get the game from nearby PoPs (Hong Kong, Singapore, Japan) with higher and more variable latency.
  - **Free/Pro in some high-cost regions:** traffic can be routed to a farther data center than for Business/Enterprise customers. That adds tens of milliseconds to a one-time load, which is irrelevant for an idle game.

### 4.2 Static hosting: cost by player region and provider

Assuming ~1 MB per MAU (section 2.2):

| Provider | 10k MAU (10 GB) | 100k MAU (100 GB) | 1M MAU (1 TB) | 10M MAU (10 TB) | Does player region change the price? |
|---|---|---|---|---|---|
| **Cloudflare Workers/Pages** | $0 | $0 | $0 | $0 | **No.** Flat $0 worldwide |
| GitHub Pages | $0 | $0, at the 100 GB/month soft limit | Over the soft limit; GitHub may ask you to move | Not suitable | No, but capped. Fastly CDN behind it |
| Netlify Free | $0 | Likely exceeds Free credits (credit-based; bandwidth consumes credits, site pauses when they run out) | Paid plan required | Paid plan required | No (credit-based) |
| AWS S3 + CloudFront (pay-as-you-go) | $0 (1 TB/month always-free) | $0 | ~$0, right at the free 1 TB | ~$770–1,080 ² | **Yes.** Per-GB rates differ by edge region |

² 9 TB over the free tier at roughly $0.085/GB (North America/Europe) up to ~$0.11–0.12/GB (Asia-Pacific, South America, India). The range is the spread between an all-EU player base and a mostly APAC/LatAm one. Verify current CloudFront rates and flat-rate plans before quoting.

Only Cloudflare stays at $0 whatever the scale or the player mix, which is the main reason it is the better choice when growth or a global audience is possible. For a semester project with a public repo, GitHub Pages is equally free (see `hosting.md`).

### 4.3 Backend (Scenario B): locality affects latency, not price

On Cloudflare, Workers and D1 cost the same wherever the player is. Locality changes **latency** and **data residency**:

| Player base (10k DAU, 5 min sync) | Monthly cost | Save write latency (user → nearest PoP → D1 primary in Western Europe) | Notes |
|---|---|---|---|
| 90 % DACH/EU (expected audience) | $0 | ~10–40 ms | Set D1 location hint `weur`; optionally EU jurisdiction for GDPR |
| 50 % EU / 50 % North America | $0 | EU ~20 ms, US East ~90–120 ms, US West ~150 ms | Fine for background saves |
| Global (EU / NA / APAC / LatAm) | $0 | APAC/Oceania ~200–300 ms per write | Use D1 read replicas for `GET /save` on load; writes still go to the primary |
| 1M DAU global | ~$247 (5 min sync) | as above | Single D1 not viable → shard D1 by player ID, or use **one Durable Object per player** (created near the player, SQLite-backed, same $1/M rows-written pricing) |

Because saves run in the background and `localStorage` remains the source of truth while playing, even 300 ms writes are invisible to the player. A database far from the player is a user-experience problem only for the first **load** on a new device.

---

## 5. Recommendation

1. **Deploy the MVP as static assets on Cloudflare Workers (or Pages) on the Free plan. Expected cost: $0.** Build only `master` and PRs to stay well inside build limits.
2. A custom domain is optional: ~$10–11/year for `.com` via Cloudflare Registrar. Don't change the domain later without a plan, because `localStorage` saves are tied to the origin (`hosting.md`).
3. Do **not** add Workers Paid, KV, D1 or Pro for the MVP. None of them serve a current requirement.
4. If cloud saves are ever required: use Worker + D1, **sync every few minutes plus on tab close**, never on every autosave. That keeps it free up to ~10k DAU and around $10/month at 100k DAU.

## Sources (checked 2026-11-23)

- Workers pricing: https://developers.cloudflare.com/workers/platform/pricing/
- Workers limits: https://developers.cloudflare.com/workers/platform/limits/
- Static assets billing and limits: https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/
- Pages limits: https://developers.cloudflare.com/pages/platform/limits/
- Workers Builds limits: https://developers.cloudflare.com/workers/ci-cd/builds/limits-and-pricing/
- D1 limits: https://developers.cloudflare.com/d1/platform/limits/
- Cloudflare Registrar: https://developers.cloudflare.com/registrar
- Plans overview: https://www.cloudflare.com/plans/

Section 3 uses this model: requests/month = DAU × 0.5 h × 30 days × syncs per hour + DAU × 30 loads; each request costs 2 ms CPU and 1 D1 row written. Treat all figures as estimates; latency values are typical round-trip ranges, not measurements.
