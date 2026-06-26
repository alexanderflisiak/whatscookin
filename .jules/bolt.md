## 2026-06-26 - Fix N+1 Query in Form Submission
**Learning:** Submitting forms with dynamic lists (like recipe ingredients) using a loop of individual `select` and `insert` calls creates severe N+1 network bottlenecks.
**Action:** Always batch related entity resolutions into O(1) operations: fetch existing via `.in()`, bulk insert missing, and bulk insert bridge records.
