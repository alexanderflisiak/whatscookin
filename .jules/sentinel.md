## 2024-05-18 - [Critical SSRF vulnerability via Scraping Endpoint]
**Vulnerability:** The `/api/scrape` route allowed fetching any user-provided URL unconditionally, creating an SSRF (Server-Side Request Forgery) window into the backend network infrastructure. Furthermore, any resultant unhandled fetch exceptions were leaked directly to the client via `error.message`.
**Learning:** In Next.js App Router applications, unauthenticated proxy or scraping endpoints require stringent validation. By default, standard fetch will happily request `http://localhost:3000` or `169.254.169.254` (cloud metadata).
**Prevention:** Always implement an explicit hostname blocklist (private IP ranges, `localhost`, etc.) and ensure the protocol is restricted strictly to `http` or `https`. When proxying outbound requests, do not echo back raw trace/network errors to client API consumers.
## 2025-02-12 - Math.random() in client-side arrays
**Vulnerability:** Insecure `Math.random()` was used for selecting an item from an array in `RandomizerModal.tsx`.
**Learning:** `Math.random()` is not cryptographically secure, and shouldn't be used where predictable randomness might pose a risk. Use `window.crypto.getRandomValues()` instead.
**Prevention:** For index selection from an array, use `const randomIndex = window.crypto.getRandomValues(new Uint32Array(1))[0] % data.length;` to properly compute random array indexes in client-side code.
