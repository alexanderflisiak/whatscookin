
## 2024-03-29 - [Supabase N+1 Query Anti-Pattern]
**Learning:** Sequential `.from().select().eq().single()` or `.insert()` operations inside loops (e.g. iterating over ingredients when saving a recipe) cause a severe N+1 query bottleneck. This codebase-specific pattern significantly slows down relational inserts.
**Action:** Always batch fetch existing relational items using `.in('field', array)` and batch insert missing items using array payloads with `.insert([])`. This combines many separate round-trips into a few single queries, improving performance.
