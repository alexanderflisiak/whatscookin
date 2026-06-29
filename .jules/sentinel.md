## 2024-05-18 - [Critical SSRF vulnerability via Scraping Endpoint]
**Vulnerability:** The `/api/scrape` route allowed fetching any user-provided URL unconditionally, creating an SSRF (Server-Side Request Forgery) window into the backend network infrastructure. Furthermore, any resultant unhandled fetch exceptions were leaked directly to the client via `error.message`.
**Learning:** In Next.js App Router applications, unauthenticated proxy or scraping endpoints require stringent validation. By default, standard fetch will happily request `http://localhost:3000` or `169.254.169.254` (cloud metadata).
**Prevention:** Always implement an explicit hostname blocklist (private IP ranges, `localhost`, etc.) and ensure the protocol is restricted strictly to `http` or `https`. When proxying outbound requests, do not echo back raw trace/network errors to client API consumers.

## 2024-06-25 - [SSRF Bypass via IPv6, 0.0.0.0 and Redirect Loops]
**Vulnerability:** The `isUrlSafe` function in `/api/scrape/route.ts` only blocked standard private IPv4 addresses. It could be bypassed using `0.0.0.0`, IPv6 local loopback (`::1`), IPv6 unspecified (`::`), and IPv4-mapped IPv6 addresses (e.g., `::ffff:127.0.0.1` normalized to `::ffff:7f00:1`). Furthermore, standard `fetch` automatically follows redirects, allowing an attacker to bypass initial validation by pointing the scraper to a safe URL that redirects to an internal one.
**Learning:** Node's `URL` parsing handles IPv6 mapping unexpectedly depending on the environment (normalizing dotted-quad mapping to hexadecimal). Relying purely on initial hostname filtering is insufficient when native `fetch` handles redirects transparently.
**Prevention:** Always validate all possible IP representations including IPv6 brackets, mapping, and unique local ranges. Crucially, any proxying `fetch` must set `redirect: 'manual'` so intermediate `Location` headers can be intercepted, resolved contextually, and passed back through the validation loop.

## 2026-06-29 - Prevent DoS via memory exhaustion in URL scraping
**Vulnerability:** The recipe scraper used `await response.text()` to load an arbitrary remote URL's HTML content fully into memory, creating a Denial of Service risk (OOM) if a malicious server sends an excessively large response.
**Learning:** External fetch calls in Next.js without size limits are dangerous because Next.js loads the entire response into server memory by default. Streaming response processing is required when reading untrusted payloads.
**Prevention:** Always use `response.body.getReader()` to stream external responses, tracking byte length incrementally and calling `await reader.cancel()` if a safe limit (e.g., 1MB) is exceeded before returning an error.
