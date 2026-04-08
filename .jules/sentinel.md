## 2024-05-18 - [Critical SSRF vulnerability via Scraping Endpoint]
**Vulnerability:** The `/api/scrape` route allowed fetching any user-provided URL unconditionally, creating an SSRF (Server-Side Request Forgery) window into the backend network infrastructure. Furthermore, any resultant unhandled fetch exceptions were leaked directly to the client via `error.message`.
**Learning:** In Next.js App Router applications, unauthenticated proxy or scraping endpoints require stringent validation. By default, standard fetch will happily request `http://localhost:3000` or `169.254.169.254` (cloud metadata).
**Prevention:** Always implement an explicit hostname blocklist (private IP ranges, `localhost`, etc.) and ensure the protocol is restricted strictly to `http` or `https`. When proxying outbound requests, do not echo back raw trace/network errors to client API consumers.

## 2024-05-18 - SSRF bypass via IPv6 brackets and manual redirects
**Vulnerability:** The scraper API allowed Server-Side Request Forgery (SSRF) bypasses because `new URL(url).hostname` retained IPv6 brackets, meaning `[::1]` bypassed the `=== '::1'` string check. Also, `fetch` automatically followed redirects, allowing external URLs to redirect to local addresses, bypassing initial filters.
**Learning:** `URL.hostname` format inconsistency for IPv6 must be accounted for (e.g., stripping brackets), and HTTP clients must be explicitly set to `redirect: 'manual'` with subsequent locations re-validated to comprehensively prevent SSRF.
**Prevention:** Always strip `^\[|\]$` from parsed hostnames and validate recursively when following redirects instead of relying on default fetch behavior.
