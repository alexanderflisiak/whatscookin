
## 2024-06-04 - Batching many-to-many insertions in Supabase
**Learning:** In Supabase/PostgreSQL, doing iterative `.single()` reads and `.insert()` inside a loop for a many-to-many relationship (like saving ingredients for a recipe) leads to an N+1 query bottleneck. The performance degradation scales poorly with the number of items.
**Action:** Always batch these operations. Use `select().in()` to find existing records in one go, determine missing records by comparing unique names, use a single `.insert().select()` for the missing ones, build a Map of all IDs, and perform one final `.insert()` array into the bridge table. This reduces network roundtrips from O(N) to O(1).
