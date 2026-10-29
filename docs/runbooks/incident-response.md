# Operational Runbook: Incident Triage & Response

## 1. Severity Classifications

| Level | Definition | Response SLA | Escalation Target |
|:---|:---|:---:|:---|
| **SEV-1 (Critical)** | Production outage, 5xx error rate > 5%, curator credential compromise | < 15 minutes | Lead Architect / Security Auditor |
| **SEV-2 (Major)** | Degradation in search performance, metadata fetcher failure, partial catalog unavailability | < 1 hour | On-call Engineer |
| **SEV-3 (Minor)** | Minor UI styling glitch, broken favicon links, non-blocking telemetry gaps | Next Business Day | Engineering Backlog |

---

## 2. Real-Time Production Triage

### Tailing Production Edge Logs
To inspect live request traces, errors, and unhandled exceptions:
```bash
wrangler tail pilot --format=pretty
```
Filter logs by correlation ID (`X-Request-Id` or `cf-ray`):
```bash
wrangler tail pilot --search="<REQUEST_ID>"
```

---

## 3. Incident Playbooks

### Playbook A: Curator Token Compromise
If a curator key is suspected to be leaked:
1. Immediately rotate the secret via Wrangler CLI:
   ```bash
   wrangler secret put CURATOR_TOKEN
   # Enter new high-entropy 64-character secret
   ```
2. Redeploy the worker to invalidate active runtime isolates:
   ```bash
   npm run deploy
   ```
3. Audit recent catalog modifications in D1:
   ```bash
   wrangler d1 execute pilot-db --remote --command="SELECT id, title, type, updated_at FROM resources ORDER BY updated_at DESC LIMIT 25;"
   ```

### Playbook B: Edge Deployment Rollback
If a newly deployed worker release exhibits critical regressions:
1. Identify previous deployment ID:
   ```bash
   wrangler deployments list
   ```
2. Rollback immediately:
   ```bash
   wrangler rollback [DEPLOYMENT_ID]
   ```
3. Verify liveness:
   ```bash
   curl -I https://pilot.nodbits.com/api/health
   ```
