```markdown
# Mid-Mod Radar – End-to-End Architecture

Mid-Mod Radar is split into three independently deployable services that share a single Supabase project.

```text
Apply
└────────────────────────────┘
┌─────────────────┐        ┌──────────────────────┐        ┌──────────────────────┐
│  midmodradar-   │        │  midmodradar-agent   │        │    MidMod-Radar      │
│     scraper     │        │ (enrichment pipeline)│        │   (NextJS/Vite app)  │
└──────┬──────────┘        └───────────┬──────────┘        └───────────┬──────────┘
       │   writes raw_listings/raw_photos          reads houses/*  │
       │                                            + storage       │
       ▼                                                          ▼
                ┌────────────────────────────┐
                │        Supabase            │
                │  • Postgres (tables)       │
                │  • Storage  (images)       │
                │  • Edge Functions (opt)    │
                └────────────────────────────┘
```

## 1. Source Repositories

| Folder                | Purpose                                                                                                                                                           | Primary Tables / Buckets                                                    |
|-----------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------|
| `midmodradar-scraper` | Scrapes external architecture sites (e.g. USModernist.org), extracts basic metadata, downloads photos, and populates `raw_listings` + `raw_images` in Supabase.      | `raw_listings`, `raw_images`, `public.listing-photos` storage bucket          |
| `midmodradar-agent`   | Pulls unprocessed rows from `raw_listings`, runs a Letta-based pipeline to normalise addresses, enrich architect & style data, run vision classification on photos, and finally persists canonical records into `houses` + dimension tables. | `houses`, `architects`, `styles`, `features`, `techniques`, `materials`, + link tables (`house_styles`, …) |
| `MidMod-Radar`        | Public consumer web-app. Uses Supabase client-side to query the curated `houses` view and stream images from storage; implements search / filters / auth.             | read-only on all curated tables; S3 storage reads                           |

### Supabase as the Source-of-Truth

| Raw ingest stage | Enriched stage |
|------------------|----------------|
| `raw_listings`   | `houses`       |
| `raw_images`     | `house_photos` |

All three repos point to the same Supabase project but use different keys:
*   **scraper** – `SUPABASE_SERVICE_ROLE` (full insert rights)
*   **agent** – `SUPABASE_SERVICE_KEY` (full read/write + Edge Function exec)
*   **web app** – `VITE_SUPABASE_ANON_KEY` (RLS-protected read-only)

## 2. Data Flow in Detail

### Scraping (`midmodradar-scraper`)
*   `worker.py` reads `.seeds.json`, fetches detail pages with polite rate-limit utilities in `utils.session`.
*   `parser.py` produces a `ListingPreview` object.
*   Images are downloaded → resized (max-width 1600px) → uploaded to `public.listing-photos` via Supabase Storage (`images.py`).
*   `db.py` inserts into `raw_listings` (deduping on primary key) and bulk-inserts photo rows into `raw_images`.
*   Flag `processed=false` so the agent can pick it up later.

### Enrichment (`midmodradar-agent`)
*   A scheduled job (e.g. GitHub Actions, cron, or Docker service) polls for `raw_listings.processed=false`.
*   Each listing is sent through `pipeline/letta_orchestrator.py`, which:
    *   Caches expensive calls with Redis (`pipeline/infra.py`).
    *   Talks to external APIs (address normalisation, ATTOM property data, etc.).
    *   Delegates AI/ML work (style classification, architect validation) to Letta Supervisor groups.
*   Once the JSON in-memory block is returned with a `pipeline_status=completed`, `scripts/test_pipeline_full.py` (or production save routine) writes into:
    *   `architects` (upsert)
    *   `houses`
    *   `house_photos` (+ link to Storage path)
    *   `house_styles`, `house_features`, …
*   The corresponding `raw_listings` row is marked `processed=true`.

### Consumption (`MidMod-Radar`)
*   Vite/React front-end initialises Supabase with `VITE_SUPABASE_URL` & `VITE_SUPABASE_ANON_KEY`.
*   Queries are made to a Postgres `rpc` view or directly to `houses` filtered by RLS to only expose approved records.
*   Images are pulled straight from the CDN URL returned by Storage.
*   Optional realtime channel can push new houses live.

## 3. Running Locally

### Prerequisites
*   Node ≥ 20.x (front-end)
*   Python 3.9+ with `poetry` or `pip`
*   Docker (if you want local Supabase & Redis)
*   Supabase project w/ the schema & storage buckets created (`supabase/migrations` in each repo)

### Environment Variables

| Variable                                     | `scraper` | `agent`                                  | `web`    |
|----------------------------------------------|-----------|------------------------------------------|----------|
| `SUPABASE_URL`                               | ✓         | ✓                                        | `VITE_…` |
| `SUPABASE_SERVICE_ROLE`                      | ✓         | –                                        | –        |
| `SUPABASE_SERVICE_KEY`                       | –         | ✓                                        | –        |
| `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` | –         | –                                        | ✓        |
| `REDIS_URL`                                  | –         | ✓ (defaults to `redis://localhost:6379/0`) | –        |

Create a `.env` file in each repo (samples exist as `.env-example`).

### Quick-start

(Assuming "Apply" was part of a UI element, it's omitted here. "Run dev" implies development run.)

**Run dev**

1.  **Spin up infra**
    ```bash
    # from midmodradar-agent/ or root docker-compose.yml
    docker compose up -d
    ```
2.  **Run scraper against the USModernist seed list**
    ```bash
    cd midmodradar-scraper
    python run_usmodernist_scraper.py --limit 50
    ```
3.  **Kick off enrichment**
    ```bash
    cd ../midmodradar-agent
    python scripts/test_pipeline_full.py          # or your production entrypoint
    ```
4.  **Launch front-end**
    ```bash
    cd ../MidMod-Radar
    pnpm i && pnpm dev
    ```

## 4. Deployment / CI

| Component | Deploy Target                      | Notes                        |
|-----------|------------------------------------|------------------------------|
| Scraper   | GitHub Actions + fly.io cron / ECS task | Stateless; schedule hourly     |
| Agent     | Docker service (ECS/Fargate) + Redis Elasticache | Needs Supabase service key   |
| Web App   | Vercel / Netlify / Cloudflare      | Just supply `VITE_` env vars |

Database migrations live in `supabase/migrations/` in each Python service; use `supabase db push` or the Supabase CLI in CI.

## 5. Troubleshooting

*   **Duplicate listings** – scraper checks `raw_listings.id` before insert; ensure your parser sets a stable deterministic ID.
*   **Pipeline stalls** – look at Redis keys `rate_limit:*` and Letta group logs.
*   **Images missing** – verify Storage bucket policy (public) and that `file_path` matches the CDN URL your front-end constructs.
*   **RLS errors** – confirm the `anon` role has `select` policies on the `houses_view`.

## 6. Future Improvements / Next Steps

*   **Typed RPC layer** – Generate TypeScript types from Supabase to keep the front-end in sync with Postgres.
*   **Incremental scraper** – Store `last_seen_at` per source URL and only re-scrape changed pages.
*   **Observability** – Ship scraper & agent logs to OpenTelemetry + Grafana.
*   **Auto-invalidations** – When photos change, clear CDN cache via Edge Functions.

Happy hacking!
```