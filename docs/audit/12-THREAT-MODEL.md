# 12 — Threat Model & Attack Surface

## Threat Model (STRIDE Framework)

| STRIDE Category | Threat Description | Attacker Persona | Likelihood | Impact | Current Defense | Residual Risk |
|:---|:---|:---|:---:|:---:|:---|:---:|
| **Spoofing** | Forging `cf-access-authenticated-user-email` header or brute-forcing hardcoded token | Anonymous Internet User | **High** | **Critical** | None in application code (`curatorAuth.ts`) | **HIGH (P0 - AUD-SEC-001)** |
| **Tampering** | Deleting or overwriting existing catalog tools and prompts | Malicious Visitor | **High** | **Critical** | Bypassed if header is spoofed | **HIGH (Direct consequence of P0)** |
| **Repudiation** | Mutating catalog data with forged identity without audit logs | Rogue Curator | **Medium** | **High** | No structured mutation logging | **MEDIUM (Lack of audit trail)** |
| **Information Disclosure** | Scraping internal network metadata via SSRF | External Attacker | **Medium** | **High** | Initial domain check only (bypassed via 302 redirect) | **HIGH (P1 - AUD-SEC-002)** |
| **Denial of Service** | DoS attack via Cartesian join queries (`/api/resources?q=...`) or outbound scraper flooding | Spammer / Botnet | **High** | **High** | Cloudflare DDoS protection (edge layer only); no app rate limiting | **HIGH (P1 - AUD-PERF-001)** |
| **Elevation of Privilege** | Elevating from unauthenticated visitor to curator role | Unauthenticated Visitor | **High** | **Critical** | Single header injection grants curator role | **HIGH (P0 - AUD-SEC-001)** |

---

## Trust Boundaries Diagram

```mermaid
graph TD
    subgraph Untrusted_Zone ["Untrusted Internet"]
        PublicUser["Public Web Visitor"]
        Bot["Automated Scraper / Bot"]
        Attacker["Malicious Threat Actor"]
    end

    subgraph Edge_Zone ["Cloudflare Edge Perimeter"]
        CFWAF["Cloudflare WAF / DDoS Mitigation"]
        Assets["Workers Static Assets"]
    end

    subgraph Application_Zone ["Worker Execution Context (workerd)"]
        WorkerRouter["Worker Router & Middleware"]
        AuthBoundary{"Curator Auth Boundary<br/>(VULNERABLE)"}
        UseCases["Business Use Cases"]
        MetadataScraper["Tool Metadata Scraper"]
    end

    subgraph Storage_Zone ["Persistent Storage"]
        D1DB[("Cloudflare D1 SQLite Database")]
    end

    subgraph External_Web ["External Web"]
        ThirdPartySite["Target Websites / Metadata Endpoints"]
    end

    PublicUser & Bot & Attacker --> CFWAF
    CFWAF --> Assets
    CFWAF --> WorkerRouter
    WorkerRouter --> AuthBoundary
    AuthBoundary -->|Mutating Ops| UseCases
    WorkerRouter -->|Public Read Ops| UseCases
    UseCases --> D1DB
    MetadataScraper -->|Outbound Fetch (Blind Redirect)| ThirdPartySite
```
