## 2024-06-11 - Batch Many-to-Many Operations
**Learning:** Iterating with `.single()` lookups in a loop for many-to-many relationships (like ingredients in a recipe) creates an N+1 database problem.
**Action:** Batching operations using `.in()` and `.insert()` arrays reduces database roundtrips from O(N) to O(1), and deduplicating missing values using a Set prevents constraint violations during batch insertions of repeated items.
