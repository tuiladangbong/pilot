# 23 — Observability, Telemetry & Logging Audit

## Observability Maturity Level: Level 1 (Initial / Rudimentary)

```
+-------------------------------------------------------------------------+
|                  OBSERVABILITY SCORECARD: 45 / 100                      |
+-------------------------------------------------------------------------+
| Structured Logging:          [ ] NO    (Unstructured console statements)  |
| Distributed Tracing:         [ ] NO    (No OpenTelemetry or traceparent)  |
| Metrics Instrumentation:     [ ] NO    (No Prometheus / edge metrics)    |
| Error Reporting / Sentry:    [ ] NO    (Exceptions not captured to APM)  |
| Request Correlation IDs:     [ ] NO    (No request ID propagation)        |
| Health Probe Endpoints:      [X] YES   (/api/health, /api/db-health)      |
+-------------------------------------------------------------------------+
```

---

## Detailed Deficiencies (`AUD-OBS-001`)

1. **No Correlation / Request IDs:**
   - Neither `src/index.ts` nor `src/adapters/http/router.ts` extracts `cf-ray` or injects an `X-Request-Id` header into response headers or log entries.
   - When production users encounter errors, engineers cannot locate the corresponding log record in Cloudflare Dashboard.
2. **Missing APM / Crash Reporting:**
   - If an unhandled exception or database failure occurs, no event is transmitted to Sentry, Datadog, or Cloudflare Logpush.
   - Incident detection relies entirely on user complaints or manual log tailing (`wrangler tail`).
3. **Absence of Business Metrics:**
   - No tracking of search query latencies, zero-result search terms, curator curation rates, or popular tool clicks.

---

## Observability Remediation Plan
1. **Request Correlation:** Attach `cf-ray` as `requestId` to all outgoing JSON responses and errors.
2. **Structured Edge Logger:** Create a lightweight logger adapter emitting structured JSON (`timestamp`, `level`, `requestId`, `method`, `path`, `status`, `durationMs`).
3. **Cloudflare Tail Worker / Logpush:** Configure Cloudflare Logpush or Worker Analytics Engine for zero-overhead metric aggregation.
