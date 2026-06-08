## 2026-06-08 - Batched Supabase Relations
**Learning:** Iterating with `.single()` and `.insert()` to resolve many-to-many relationships (like recipe ingredients) causes a severe N+1 query problem, exponentially increasing database roundtrips.
**Action:** Always process related arrays by extracting unique identifiers, looking up existing records with a single `.in()` query, bulk inserting the missing records, and finally bulk inserting into the bridge table.
