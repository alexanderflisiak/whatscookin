## 2026-05-11 - Supabase N+1 Queries in Form Submissions
**Learning:** In Next.js/React applications, using iterative `.single()` calls within a loop to perform 'find-or-create' logic for many-to-many relationships (like ingredients) creates severe N+1 database roundtrips. This directly blocks the form submission flow.
**Action:** Always rewrite iterative DB calls into batched operations: 1. use `.in()` to batch select existing records, 2. bulk insert missing records, and 3. bulk insert into the bridge table. This reduces the time complexity of network calls from O(N) to O(1).
