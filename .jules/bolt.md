## 2025-01-28 - N+1 Query Bottleneck on Form Saves
**Learning:** Saving a form with a list of related entities (like recipe ingredients) using a for-loop of individual insert/select queries creates severe N+1 network bottlenecks over the network.
**Action:** Always batch related entity resolutions into O(1) operations: fetch all existing entities by name using an `.in()` query, bulk insert missing entities, and finally bulk insert the many-to-many bridge/join table records.
