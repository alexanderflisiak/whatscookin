## 2024-06-14 - Batch Supabase Operations for Many-to-Many Relations
**Learning:** Iterating and querying/inserting database records one by one in a loop creates an N+1 query problem, severely impacting performance for forms with many items (like ingredients).
**Action:** Use batch `select(...).in(...)` to fetch existing records, deduplicate new items using `Set`, batch insert missing items, and finally batch insert the junction table rows. This reduces O(N) database roundtrips to O(1) constant roundtrips.
