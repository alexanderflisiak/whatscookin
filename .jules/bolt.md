## 2024-06-18 - N+1 Queries in Form Submissions
**Learning:** Submitting a form with a dynamic list of related entities (like ingredients) can cause severe N+1 query problems (O(N) network calls) if handled sequentially inside a loop.
**Action:** Always extract identifiers, deduplicate them using a Set, and use `.in()` queries to batch fetch/insert operations, reducing the roundtrips to O(1).
