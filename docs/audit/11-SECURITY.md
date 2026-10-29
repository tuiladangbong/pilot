# 11 — Security & Vulnerability Assessment

## Critical Findings Breakdown

### 1. P0 Critical: Broken Curator Authentication & Hardcoded Secret Fallback (`AUD-SEC-001`)

- **Location:** `src/adapters/http/curatorAuth.ts` lines 24-27, 39-42.
- **Severity:** P0 (Critical - Immediate Exploitation Risk)
- **CWE:** CWE-287 (Improper Authentication), CWE-798 (Use of Hard-coded Credentials), CWE-208 (Timing Attack).

#### Evidence 1: Header Spoofing Bypass (lines 24-27)
```typescript
  // 1. Check Cloudflare Access header
  const cfAccessEmail = request.headers.get('cf-access-authenticated-user-email');
  if (cfAccessEmail && cfAccessEmail.trim() !== '') {
    return { isCurator: true, email: cfAccessEmail.trim() };
  }
```
**Mechanics:**
The application blindly trusts the incoming HTTP header `cf-access-authenticated-user-email`. Any anonymous HTTP client on the internet sending:
```bash
curl -X POST https://pilot.nodbits.com/api/tools \
  -H "cf-access-authenticated-user-email: attacker@evil.com" \
  -H "Content-Type: application/json" \
  -d '{"title":"Malicious Resource","url":"https://evil.com"}'
```
will be granted full curator/admin privileges unless Cloudflare Access Zero Trust explicitly strips and replaces this header at the edge. Trusting an unverified HTTP header without validating Cloudflare Access's signed JWT token (`cf-access-jwt-assertion`) is a critical security vulnerability.

#### Evidence 2: Hardcoded Secret Fallback (lines 39-42)
```typescript
  const expectedToken = deps.curatorToken || 'pilot_curator_secret_2026';
  if (providedToken && providedToken === expectedToken) {
    return { isCurator: true, email: 'curator@pilot' };
  }
```
**Mechanics:**
If `CURATOR_TOKEN` or `ADMIN_TOKEN` is not configured as an environment variable in Cloudflare Workers secrets, `deps.curatorToken` is undefined, causing the system to accept `'pilot_curator_secret_2026'`. Any attacker inspecting the source code or guessing common strings can seize curator write access.

#### Evidence 3: Non-Constant-Time Token Comparison (line 40)
`providedToken === expectedToken` uses JavaScript's standard string comparison, which terminates at the first differing byte. This exposes the secret to timing side-channel analysis. Constant-time comparison (`crypto.timingSafeEqual`) must be used.

---

### 2. P1 High: Server-Side Request Forgery (SSRF) via Redirect Following (`AUD-SEC-002`)

- **Location:** `src/modules/tools/application/FetchToolMetadataUseCase.ts` lines 39-47, `src/modules/tools/domain/Tool.ts` (`isPrivateOrBlockedHost`).
- **Severity:** P1 (High)
- **CWE:** CWE-918 (Server-Side Request Forgery).

#### Evidence
```typescript
// FetchToolMetadataUseCase.ts
const response = await fetch(toolUrl, {
  headers: {
    'User-Agent': 'Mozilla/5.0 ... PilotBot/1.0',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  },
  redirect: 'follow', // <-- BLIND REDIRECT FOLLOWING
});
```
**Mechanics:**
The domain layer validates that the initial hostname is not private (`isPrivateOrBlockedHost`). However, because `fetch(url, { redirect: 'follow' })` is configured, an attacker can supply a public domain that returns an HTTP 302 redirect pointing to:
- `http://169.254.169.254/latest/meta-data/` (Cloud provider metadata)
- `http://127.0.0.1:8787/` (Internal worker endpoints)
- `http://10.0.0.1/` (Internal VPC services)

The V8 `workerd` fetch implementation will follow the redirect without re-evaluating `isPrivateOrBlockedHost` on the redirect target URL.

**Remediation:**
Set `redirect: 'manual'`. If status is 301/302/307/308, inspect the `Location` response header, re-run `isPrivateOrBlockedHost` on the destination URL, and limit the maximum redirect hops to 3.

---

### 3. P2 Moderate: Insecure Client-Side Modals & Secret Storage (`AUD-SEC-004`)

- **Location:** `public/app.js` lines 1450-1500 (`localStorage.getItem('pilot_curator_token')`).
- **Severity:** P2 (Moderate)
- **Mechanics:**
The curator secret key is stored in browser `localStorage`. Any Cross-Site Scripting (XSS) vulnerability or third-party script injection would allow extraction of the curator token.
