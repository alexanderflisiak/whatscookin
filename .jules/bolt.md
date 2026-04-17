## 2024-03-27 - [Fix N+1 DB operations on ingredient saves]
**Learning:** Supabase relational saves performed in loops can cause severe N+1 query network bottlenecks (up to 3 queries per ingredient).
**Action:** Always batch fetch existing relational items using `.in()`, and batch insert using array payloads with `.insert([])`. Never run database queries inside loops.