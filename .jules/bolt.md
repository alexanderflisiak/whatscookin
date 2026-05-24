## 2025-01-20 - Batching Many-to-Many Relationships in Supabase
**Learning:** When saving many-to-many relationships (like ingredients for a recipe) in Supabase, using a loop with `.single()` lookups and inserts creates a severe N+1 query bottleneck. The loop makes 3 queries (select, insert ingredient, insert recipe_ingredient) per ingredient, resulting in 15+ database roundtrips for a typical recipe.
**Action:** Always use batch operations for many-to-many saves. Instead of a loop:
1. Extract unique values (`[...new Set(...)]`)
2. Use `.in()` to find existing records in one query
3. Batch insert missing records with `.select()` in one query
4. Batch insert all bridge table records in one query
This reduces the complexity from O(N) to O(1) database calls.