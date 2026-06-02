## 2024-05-18 - Optimize many-to-many relationship saves in Supabase
**Learning:** Saving many-to-many relationships (like recipe ingredients) iteratively using `.single()` in a loop causes an N+1 query bottleneck. Batching reduces database roundtrips from O(N) to O(1) (e.g., 3 roundtrips max: fetch existing, insert missing, insert bridge table).
**Action:** When handling arrays of related entities, always use batch operations (`.in()`, array `.insert()`) instead of iterating through and saving them one by one. Deduplicate items to avoid constraint violations during bulk insertion.
