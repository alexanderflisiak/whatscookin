## 2026-05-20 - Optimizing Supabase Many-to-Many Inserts
**Learning:** Iterative `.single()` and `.insert()` database calls inside loops for many-to-many relationship mapping (e.g. ingredients) create a massive O(N) performance bottleneck with Supabase.
**Action:** Use batching via `.in('column', values)` for selects and pass arrays directly to `.insert()` for writes to reduce query load from O(N) to O(1).
