## 2024-07-01 - Batching Supabase N+1 Queries
**Learning:** Sequential Supabase API calls inside a loop (like finding, creating, and linking ingredients) cause a severe N+1 network waterfall, blocking form submissions.
**Action:** Always batch related entity resolutions into O(1) operations: `.in()` for fetching existing, bulk `insert` for missing, and a final bulk `insert` for bridge records.
