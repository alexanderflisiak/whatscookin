## 2025-01-01 - Batching Database Operations for N+1 Queries
**Learning:** Found an N+1 query problem where saving a recipe with multiple ingredients caused separate read, insert, and bridge insert operations for *each* ingredient inside a loop.
**Action:** Implemented query batching using `in` operator. Deduplicated ingredient names using `Array.from(new Set(names))` for the fetch and bulk insert of missing ingredients, while mapping over the original array with duplicates for the bridge records.
