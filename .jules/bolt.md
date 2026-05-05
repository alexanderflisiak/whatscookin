## 2024-05-15 - [Batching Many-to-Many Supabase Inserts]
**Learning:** The previous iterative "find-or-create" loop in Supabase for relationships like ingredients triggered N+1 database queries, which blocks the main thread with unnecessary round trips. A 10-ingredient recipe required roughly 30 API queries.
**Action:** Always batch "find-or-create" operations in Supabase for many-to-many relationships using `.in()` to query for existing entries, and map remaining ones for a single `.insert().select()` query. This drops N queries down to 2 or 3 O(1) queries.
