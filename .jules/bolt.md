## 2024-05-24 - Batching Supabase Queries for N-to-N Relations
**Learning:** For many-to-many relationships (e.g., ingredients in a recipe), iterating with `.single()` lookups in a loop creates an N+1 query problem, causing O(N) database roundtrips. Batching the `select().in()`, followed by deduplicating and batch `insert()`, reduces the roundtrips to O(1) and significantly improves performance.
**Action:** When saving lists of items that require find-or-create logic in Supabase, always use batch `select().in()` and batch `insert()` arrays instead of iterating over individual items.
