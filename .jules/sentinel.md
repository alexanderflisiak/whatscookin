## 2024-05-18 - [Critical SSRF vulnerability via Scraping Endpoint]
**Vulnerability:** The `/api/scrape` route allowed fetching any user-provided URL unconditionally, creating an SSRF (Server-Side Request Forgery) window into the backend network infrastructure. Furthermore, any resultant unhandled fetch exceptions were leaked directly to the client via `error.message`.
**Learning:** In Next.js App Router applications, unauthenticated proxy or scraping endpoints require stringent validation. By default, standard fetch will happily request `http://localhost:3000` or `169.254.169.254` (cloud metadata).
**Prevention:** Always implement an explicit hostname blocklist (private IP ranges, `localhost`, etc.) and ensure the protocol is restricted strictly to `http` or `https`. When proxying outbound requests, do not echo back raw trace/network errors to client API consumers.

## 2024-06-25 - [SSRF Bypass via IPv6, 0.0.0.0 and Redirect Loops]
**Vulnerability:** The `isUrlSafe` function in `/api/scrape/route.ts` only blocked standard private IPv4 addresses. It could be bypassed using `0.0.0.0`, IPv6 local loopback (`::1`), IPv6 unspecified (`::`), and IPv4-mapped IPv6 addresses (e.g., `::ffff:127.0.0.1` normalized to `::ffff:7f00:1`). Furthermore, standard `fetch` automatically follows redirects, allowing an attacker to bypass initial validation by pointing the scraper to a safe URL that redirects to an internal one.
**Learning:** Node's `URL` parsing handles IPv6 mapping unexpectedly depending on the environment (normalizing dotted-quad mapping to hexadecimal). Relying purely on initial hostname filtering is insufficient when native `fetch` handles redirects transparently.
**Prevention:** Always validate all possible IP representations including IPv6 brackets, mapping, and unique local ranges. Crucially, any proxying `fetch` must set `redirect: 'manual'` so intermediate `Location` headers can be intercepted, resolved contextually, and passed back through the validation loop.

## 2025-05-18 - Untrusted URL Denial of Service via Response Buffering
**Vulnerability:** The scraper route (`src/app/api/scrape/route.ts`) buffered untrusted responses entirely into memory using `await response.text()`.
**Learning:** This exposes the server to memory exhaustion DoS attacks if a user submits a URL pointing to an infinitely large or extremely massive text payload.
**Prevention:** Replace `response.text()` with a streaming reader using `response.body.getReader()`. Process the chunks incrementally and enforce a hard byte limit (e.g., 1MB) to prevent OOM errors when interacting with user-controlled external resources.
