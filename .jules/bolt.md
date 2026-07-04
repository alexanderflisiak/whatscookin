## 2024-06-03 - Batching Supabase Inserts
**Learning:** For-loops issuing `.select().single()` and `.insert()` repeatedly per array element cause severe N+1 bottlenecks on the network (very slow for large ingredient lists from recipe scrapers).
**Action:** Always batch related entity resolutions by executing an `.in()` query first, then bulk insert missing items, and finally bulk insert to the bridge table.
