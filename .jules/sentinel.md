## 2024-05-24 - Unbounded Response Reading in External Fetch
**Vulnerability:** The API route `src/app/api/scrape/route.ts` used `await response.text()` to read the entire body of user-provided external URLs into memory at once.
**Learning:** This approach leaves the application vulnerable to Denial-of-Service (DoS) via memory exhaustion (OOM), as an attacker could provide a URL that returns an infinitely streaming or gigabyte-sized response.
**Prevention:** Always use streaming readers (`response.body.getReader()`) combined with hard byte limits (e.g., `1024 * 1024` for 1MB) when fetching and parsing untrusted external payloads.
