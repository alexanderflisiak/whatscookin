
## 2026-04-07 - Concurrent Supabase Fetching
**Learning:** The Supabase JavaScript client returns `{ data, error }` objects rather than throwing promise rejections for query failures. When executing independent queries sequentially (e.g., fetching a recipe, then its ingredients, then tags), it causes unnecessary network waterfalls.
**Action:** Always batch independent Supabase queries using `Promise.all` in Next.js Server Components or `useEffect` load operations. Remember to manually check the destructured error properties (e.g., `const [{ error: err1 }] = await Promise.all(...)`) since `Promise.all` won't short-circuit on standard Supabase query errors.
