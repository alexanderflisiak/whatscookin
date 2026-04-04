## 2024-05-18 - [Critical SSRF vulnerability via Scraping Endpoint]
**Vulnerability:** The `/api/scrape` route allowed fetching any user-provided URL unconditionally, creating an SSRF (Server-Side Request Forgery) window into the backend network infrastructure. Furthermore, any resultant unhandled fetch exceptions were leaked directly to the client via `error.message`.
**Learning:** In Next.js App Router applications, unauthenticated proxy or scraping endpoints require stringent validation. By default, standard fetch will happily request `http://localhost:3000` or `169.254.169.254` (cloud metadata).
**Prevention:** Always implement an explicit hostname blocklist (private IP ranges, `localhost`, etc.) and ensure the protocol is restricted strictly to `http` or `https`. When proxying outbound requests, do not echo back raw trace/network errors to client API consumers.

## 2025-04-04 - [SSRF Bypass via IPv6 and 0.0.0.0]
**Vulnerability:** The SSRF protection in `/api/scrape` correctly blocked IPv4 loopback and private IPs, but failed to block the `0.0.0.0` meta-address, `::1` (IPv6 loopback), and other IPv6 private/link-local spaces. This allowed an attacker to bypass the IPv4 filters and still access local/internal services.
**Learning:** Node's `fetch` and underlying OS network stacks will often map `0.0.0.0` to localhost, and readily accept IPv6 connections. A purely IPv4-based blocklist is fundamentally incomplete and creates a false sense of security.
**Prevention:** When implementing custom SSRF protection, always include both IPv4 (including the `0.0.0.0` bypass) and their IPv6 equivalents (e.g., `::1`, `fc00::/7`, `fe80::/10`, and IPv4-mapped like `::ffff:`). Normalize inputs (like removing brackets from IPv6 hostnames) before matching.
