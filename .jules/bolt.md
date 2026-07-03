## 2024-07-03 - Supabase N+1 Anti-Pattern
**Learning:** Sequential `.select()` and `.insert()` Supabase queries within a frontend form submission loop (like ingredients) creates a severe N+1 network bottleneck.
**Action:** Always batch related entity resolutions into O(1) operations using `.in()` for fetching and bulk `.insert()` for missing entities and bridge tables.
