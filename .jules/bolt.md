## 2024-05-15 - Batched find-or-create for ingredients
**Learning:** The `RecipeForm` was doing N+1 queries when saving ingredients (O(N) `.select()` then `.insert()` for ingredients, then `.insert()` for recipe_ingredients).
**Action:** Always use batch `in()` queries and deduplication via `Set` to implement a batched find-or-create pattern, drastically reducing Supabase API roundtrips during relation saving.
