## 2026-06-11 - Batched Supabase Many-to-Many Operations
**Learning:** In RecipeForm.tsx, saving a recipe with many ingredients used an iterative approach with `.single()` lookups and `.insert()` inside a loop. This caused an N+1 query problem and significant latency for recipes with many ingredients.
**Action:** When implementing find-or-create logic for many-to-many relationships in Supabase, use batch `select(...).in()` to find existing items, deduplicate missing items before inserting, and perform batch `insert()` for new records and bridge table entries.
