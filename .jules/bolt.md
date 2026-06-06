## 2024-05-18 - N+1 Queries in Form Submissions
**Learning:** In `RecipeForm.tsx`, saving ingredients involves finding or creating each ingredient and then creating a bridge record. Doing this in a loop results in O(N) database roundtrips (N+1 queries), significantly blocking the response when inserting multiple ingredients.
**Action:** Use Supabase's `in` filter and bulk inserts to process the 'find-or-create' operations in O(1) batched requests. Deduplicate items to prevent constraint violations from repeated items before bulk inserting, and batch insert into the bridge table.
