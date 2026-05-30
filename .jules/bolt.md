## 2024-05-30 - N+1 Query Bottleneck in Supabase Data Loading
**Learning:** Found an O(N) N+1 query problem when parsing ingredients in a recipe form. Using `.single()` in a loop creates multiple database round trips, scaling linearly with the number of ingredients. Batching can drastically reduce requests to O(1) database round trips.
**Action:** Always prefer batched Supabase statements (`.select().in()`) and batched inserts instead of iterative loop inserts. Remember to deduplicate input arrays prior to batch inserts to prevent unique constraint violations on duplicate ingredients.
