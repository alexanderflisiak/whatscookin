## 2024-06-25 - Batching Database Calls for Many-to-Many Relationships
**Learning:** Iterative database lookups (`.single()`) inside a loop for 'find-or-create' operations on many-to-many relationships (like ingredients in a recipe) create an N+1 query problem, severely impacting performance.
**Action:** Always use batch `select().in()` to find existing records, batch `insert().select()` for missing records, and a single batch `insert()` for the bridge table to reduce database roundtrips from O(N) to O(1).
