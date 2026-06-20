## 2026-06-20 - Supabase N+1 batching for Ingredients
**Learning:** Saving multiple relational items (like ingredients in a recipe form) by running sequential DB queries in a 'for' loop causes an N+1 network performance bottleneck and locks the main execution thread longer than necessary.
**Action:** Batch network queries using Supabase `.in()` for reads and passing an array of objects for `.insert()` to perform the bulk operations in a single network round-trip, significantly speeding up database interaction.
