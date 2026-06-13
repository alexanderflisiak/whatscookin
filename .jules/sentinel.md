## 2024-05-18 - [Critical SSRF vulnerability via Scraping Endpoint]
**Vulnerability:** The `/api/scrape` route allowed fetching any user-provided URL unconditionally, creating an SSRF (Server-Side Request Forgery) window into the backend network infrastructure. Furthermore, any resultant unhandled fetch exceptions were leaked directly to the client via `error.message`.
**Learning:** In Next.js App Router applications, unauthenticated proxy or scraping endpoints require stringent validation. By default, standard fetch will happily request `http://localhost:3000` or `169.254.169.254` (cloud metadata).
**Prevention:** Always implement an explicit hostname blocklist (private IP ranges, `localhost`, etc.) and ensure the protocol is restricted strictly to `http` or `https`. When proxying outbound requests, do not echo back raw trace/network errors to client API consumers.

## 2024-06-25 - [SSRF Bypass via IPv6, 0.0.0.0 and Redirect Loops]
**Vulnerability:** The `isUrlSafe` function in `/api/scrape/route.ts` only blocked standard private IPv4 addresses. It could be bypassed using `0.0.0.0`, IPv6 local loopback (`::1`), IPv6 unspecified (`::`), and IPv4-mapped IPv6 addresses (e.g., `::ffff:127.0.0.1` normalized to `::ffff:7f00:1`). Furthermore, standard `fetch` automatically follows redirects, allowing an attacker to bypass initial validation by pointing the scraper to a safe URL that redirects to an internal one.
**Learning:** Node's `URL` parsing handles IPv6 mapping unexpectedly depending on the environment (normalizing dotted-quad mapping to hexadecimal). Relying purely on initial hostname filtering is insufficient when native `fetch` handles redirects transparently.
**Prevention:** Always validate all possible IP representations including IPv6 brackets, mapping, and unique local ranges. Crucially, any proxying `fetch` must set `redirect: 'manual'` so intermediate `Location` headers can be intercepted, resolved contextually, and passed back through the validation loop.
## 2026-06-13 - Denial of Service via Memory Exhaustion
**Vulnerability:** Scraping untrusted URLs using `response.text()` loads the entire response into memory, allowing an attacker to cause memory exhaustion (OOM) by sending an infinitely large response.
**Learning:** `response.text()` has no bounds checking. Untrusted responses must be incrementally read and limited.
**Prevention:** Implement a streaming reader via `response.body.getReader()`, enforce a hard byte limit (e.g., 2MB), and crucially call `await reader.cancel()` if the limit is exceeded to abort the stream.
