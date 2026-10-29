# 22 — Reliability & Resiliency Audit

## Failure Mode & Effects Analysis (FMEA)

| Failure Scenario | Propagation Path | System Behavior | Recovery Mechanism | Reliability Rating |
|:---|:---|:---|:---|:---:|
| **D1 Database Outage / Degradation** | Repositories $\rightarrow$ Use Cases $\rightarrow$ Router | Unhandled exception returns 500 error on API endpoints | Client handles error gracefully via toast notifications | **MODERATE** |
| **External Website Outage in Metadata Scraper** | `fetch(url)` fails or times out in `FetchToolMetadataUseCase` | Caught in use case try-catch; returns fallback title & description | Client allows manual data entry | **HIGH** |
| **Malformed JSON in Request Body** | `request.json()` in router handlers | Explicitly caught; returns 400 `INVALID_JSON` | Immediate client feedback | **HIGH** |
| **Static Asset 404** | `env.ASSETS.fetch(request)` fails | Router intercepts and returns SPA root fallback (`index.html`) | Smooth client-side SPA routing | **HIGH** |
| **Worker Sub-Isolate Crash** | Worker runtime exception | Cloudflare spins up fresh V8 isolate instantaneously | Stateless edge recovery in < 5ms | **EXCELLENT** |

---

## Reliability Gaps

1. **Lack of Global Request Error Boundary:**
   - In `src/adapters/http/router.ts`, `handleRequest()` does not wrap the entire execution in a top-level `try/catch` block.
   - If an unexpected error occurs outside existing inner handler try-catch blocks (e.g. database connection drops), Cloudflare returns an unformatted raw 500 HTML error rather than a predictable JSON error.
2. **Missing Outbound Fetch Timeout:**
   - In `FetchToolMetadataUseCase.ts`, `fetch(toolUrl)` lacks an `AbortSignal.timeout(5000)`. If a remote host hangs, the worker waits until the Cloudflare Worker sub-request deadline (up to 30 seconds), consuming worker execution time.
