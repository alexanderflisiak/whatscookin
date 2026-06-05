## 2024-05-09 - Supabase Batching to avoid N+1 DB Calls
**Learning:** Found an N+1 query issue in `RecipeForm.tsx` where ingredient processing looped with `.single()` lookups and inserts, resulting in O(N) database roundtrips (e.g., 15 calls for 5 items).
**Action:** Use batch `select(...).in(...)` to find existing records, deduplicate missing values to prevent constraint violations, batch `insert` missing records with `.select()` to get IDs, and finally batch `insert` the bridge table. This reduces operations to O(1) (e.g., 3 calls).
