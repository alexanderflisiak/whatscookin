## 2024-05-18 - N+1 Query Batching in Supabase
**Learning:** Processing many-to-many relationships iteratively using `.single()` lookups inside loops creates severe N+1 query bottlenecks and network latency.
**Action:** Always batch lookups using `.in()` and batch inserts with array payloads to reduce operations from O(N) to O(1).
