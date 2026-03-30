## 2024-05-18 - [Critical SSRF vulnerability via Scraping Endpoint]
**Vulnerability:** The `/api/scrape` route allowed fetching any user-provided URL unconditionally, creating an SSRF (Server-Side Request Forgery) window into the backend network infrastructure. Furthermore, any resultant unhandled fetch exceptions were leaked directly to the client via `error.message`.
**Learning:** In Next.js App Router applications, unauthenticated proxy or scraping endpoints require stringent validation. By default, standard fetch will happily request `http://localhost:3000` or `169.254.169.254` (cloud metadata).
**Prevention:** Always implement an explicit hostname blocklist (private IP ranges, `localhost`, etc.) and ensure the protocol is restricted strictly to `http` or `https`. When proxying outbound requests, do not echo back raw trace/network errors to client API consumers.

## 2024-05-20 - [Missing Authentication on API Routes]
**Vulnerability:** The `/api/scrape` route lacked authentication checks, allowing any anonymous user to trigger the scraping functionality.
**Learning:** In this application, `src/lib/supabase/middleware.ts` explicitly excludes `/api` routes from Supabase authentication middleware checks. This means all API routes are unauthenticated by default.
**Prevention:** Always manually protect API routes by instantiating `createClient` from `@/lib/supabase/server` and verifying user presence via `await supabase.auth.getUser()` before processing requests.
