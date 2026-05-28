## 2024-05-24 - Supabase N+1 Queries on Form Submission
**Learning:** Found an N+1 database roundtrip bottleneck when inserting many-to-many relationships (Recipe Ingredients). Doing iterative `.single()` lookups and `.insert()` inside a `for...of` loop triggers N queries (e.g. 15 calls for 5 ingredients) resulting in poor latency on save.
**Action:** Always use batch operations for many-to-many relations with Supabase:
1. Extract unique values using `Set`
2. Fetch existing records using `.in('column', values)`
3. Batch insert missing records by filtering the unique list against existing records
4. Batch insert all bridge records at once
This reduces the DB operations from O(N) to O(1) (typically 3 DB calls max).
