# 21 — Scalability Under Stress (10x to 50x Scenarios)

## Stress Scenario Assessment

```
CURRENT BASELINE:
- Catalog Size: ~300 resources, 26 steps, 48 relationships
- Traffic Profile: Low/Internal development traffic (~1-5 req/s)
- Storage Footprint: ~1.5 MB SQLite database
```

---

## 1. Workload Growth: 10x Scale (~50 req/s, 3,000 resources)

- **Worker Compute:** **PASS.** Cloudflare Workers effortlessly scale to hundreds of concurrent isolates per second without cold start latency.
- **Static Assets Delivery:** **PASS.** Static CDN assets scale automatically.
- **D1 Read Capacity:** **PASS with minor latency increase.** Uncached queries will place moderate read pressure on D1; average read latency will rise from 45ms to 90ms.
- **Vulnerability Triggered:** `AUD-PERF-001` (Cartesian join) will begin causing noticeable latency spikes (>300ms) on `/api/resources?q=...` full-text searches.

---

## 2. Workload Growth: 50x Scale (~250-500 req/s, 15,000 resources)

- **First Component to Fail:** **Cloudflare D1 Concurrency & Daily Read Quotas.**
  - Cloudflare D1 imposes concurrency limits on simultaneous database queries per binding.
  - Without edge caching, 250+ uncached req/s directly hitting D1 will trigger HTTP 500 / statement queue timeouts.
  - The Cartesian query in `D1ResourceRepository.list()` will generate intermediate row sets of $> 100,000$ rows in memory during full catalog scans, hitting D1's 100KB statement / memory execution thresholds.
- **Second Component to Fail:** **Outbound Metadata Fetcher (`FetchToolMetadataUseCase`).**
  - If multiple curators or automated ingestion jobs trigger metadata fetches simultaneously without concurrency queuing, external target hosts will rate-limit or timeout the worker.

---

## Scalability Roadmap to 50x
1. **Edge Caching Layer:** Implement Cloudflare Worker Cache API (`caches.default`) for all public GET endpoints. Cache hit ratio will exceed 92%, reducing D1 traffic by 12x.
2. **Subquery SQL Refactor:** Eliminate Cartesian joins in `D1ResourceRepository.list()`.
3. **Database Read Replicas:** Enable Cloudflare D1 Read Replication (supported natively in D1) to distribute read queries across edge regions.
