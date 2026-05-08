## 2025-02-18 - Supabase ORM N+1 Loops
**Learning:** In `RecipeForm.tsx`, saving recipes with multiple ingredients (e.g., 15 items) using a standard `.single()` lookup and `.insert()` loop creates a severe N+1 problem, resulting in over ~45 database roundtrips.
**Action:** Always refactor iterative Supabase queries by gathering unique values in memory, batching `.in('column', values)` queries, inserting missing records in bulk, and returning them to memory before executing a single final batch insert to the bridge table.
