## 2026-07-02 - Batched Database Inserts for Many-to-Many Relationships
**Learning:** Implementing many-to-many relationships using loops over an array creates an N+1 network request bottleneck (e.g., querying/inserting each ingredient individually). Batching resolves this but requires deduplicating strings using Sets before sending to the DB to prevent unique constraint errors.
**Action:** Use an `IN` query to fetch existing records, bulk-insert missing unique records, and then bulk-insert the bridge records while preserving duplicates if appropriate for the join table.
