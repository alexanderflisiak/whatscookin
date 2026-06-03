## 2024-06-03 - Batching Supabase N+1 Queries
**Learning:** For many-to-many relationships (like recipe ingredients), iterative `.single()` lookups inside a loop result in O(N) database calls, causing significant latency.
**Action:** Replace iterative lookups with batch operations: use `.in()` to find existing records, deduplicate to prevent constraint errors, batch `.insert()` missing items, and batch `.insert()` bridge records to reduce operations to O(1) roundtrips.
