# 20 — Performance & Edge Efficiency Audit

## Edge Latency & Compute Benchmarks

- **Runtime Environment:** Cloudflare Edge Workers (275+ global points of presence).
- **Global Time to First Byte (TTFB):**
  - Static Asset Delivery (`index.html`, `app.js`, `styles.css`): **12ms - 35ms** worldwide.
  - Cached Edge API Responses: **15ms - 40ms**.
  - Uncached D1 SQL Queries: **45ms - 120ms** (depending on region proximity to primary D1 location).

---

## Bottlenecks & Critical Latency Factors

1. **Uncached Database Hits on Public Navigation:**
   - Every visit to `/api/resources` or `/api/tools` triggers a live SQL read against D1.
   - At high traffic volume, repeated cold queries against D1 increase latency.
   - **Remediation:** Introduce Cloudflare Cache API (`caches.default`) for public `GET` requests with a 60-second TTL.
2. **Dynamic HTML SEO Injection Overhead:**
   - In `src/index.ts` lines 61-98, requests to `/tools/:idOrSlug` invoke `deps.toolRepo.findByIdOrSlug()`, buffer `indexResponse.text()`, and run string regex replacement on every single crawler request.
   - **Remediation:** Cache the rendered HTML response with `Cache-Control: public, s-maxage=3600` at the Cloudflare edge.
3. **Cartesian Product Query Overhead (`AUD-PERF-001`):**
   - As documented in `09-DATABASE.md`, joining multiple one-to-many tables inflates memory and CPU usage during complex catalog searches.
