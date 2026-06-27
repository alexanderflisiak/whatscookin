## 2026-06-27 - Resolving N+1 Database Writes on Form Submission
**Learning:** Saving forms with related entity lists over HTTP sequentially (like ingredients) creates a massive N+1 bottleneck, causing severe network waterfalls.
**Action:** Batch related entities into O(1) bulk operations: fetch existing via `.in()`, bulk insert missing entities, and bulk insert bridge records.
