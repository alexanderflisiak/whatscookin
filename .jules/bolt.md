## 2024-07-07 - Batched DB Inserts on Forms
**Learning:** Sequential DB inserts in loops (N+1 queries) for related entities (like ingredients) during form submission significantly slow down response time due to multiple network roundtrips.
**Action:** Always batch related entity resolutions into three O(1) operations: bulk fetch existing, bulk insert missing, and bulk insert bridge records. Deduplicate names before fetch/insert to avoid constraints, but retain duplicates for bridge table.
