## 2026-06-24 - Batched Database Inserts for Related Entities
**Learning:** Submitting form data containing lists of related entities (like ingredients) using a simple loop results in severe N+1 query problems over the network, slowing down the save operation considerably.
**Action:** Always batch related entity resolutions into three O(1) operations: fetch all existing by name using `.in()`, bulk insert the missing ones, and finally bulk insert the bridge/join table records.
