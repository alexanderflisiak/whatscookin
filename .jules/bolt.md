## 2024-05-19 - Avoid Sequential DB Operations
**Learning:** Sequential database operations inside loops in `src/components/RecipeForm.tsx` (e.g., checking for existing ingredients and inserting new ones) lead to N+1 query bottlenecks and poor backend performance.
**Action:** Always batch fetch existing relational items using `.in()`, and batch insert using array payloads with `.insert([])` to significantly reduce database round trips.
