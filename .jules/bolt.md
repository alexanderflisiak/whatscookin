## 2026-06-22 - Batched Database Inserts for Ingredients
**Learning:** The recipe save process was making 3 database calls per ingredient (N+1 problem) in a loop, severely impacting performance for recipes with many ingredients.
**Action:** Replaced loop with batched operations: 1 read for existing ingredients, 1 bulk insert for missing ingredients, and 1 bulk insert for the bridge table. Always use `in` filters and bulk `insert` arrays instead of loop queries.
