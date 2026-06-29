## 2026-06-29 - Fix N+1 Query in Recipe Form
**Learning:** Inserting ingredients individually in a for-loop causes severe N+1 query bottlenecks over the network when saving forms with related entity lists. It also runs the risk of race conditions when creating same ingredient simultaneously.
**Action:** Batch related entity resolutions into three O(1) operations: fetch all existing entities by name using an `.in()` query, bulk insert any missing entities, and finally bulk insert the many-to-many bridge/join table records.
