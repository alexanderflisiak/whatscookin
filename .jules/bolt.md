## 2024-05-18 - Batching Database Requests to fix N+1 in RecipeForm
**Learning:** In RecipeForm.tsx, saving ingredients executed up to 3 DB queries per ingredient, causing an N+1 performance bottleneck.
**Action:** Batch related DB operations using `in()`, mass `insert()`, and local maps to reduce DB roundtrips from O(N) to O(1).
