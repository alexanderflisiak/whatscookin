1. **Optimize `RecipeCard.tsx`**
   - Modify `src/components/RecipeCard.tsx` to wrap the `RecipeCard` component with `React.memo`.
   - Add a comment explaining that `React.memo` is paired with `useDeferredValue` in the parent `RecipeGrid` to prevent unnecessary re-renders during search typing.
2. **Update Bolt Journal**
   - Append an entry to `.jules/bolt.md` documenting the learning about pairing `useDeferredValue` with `React.memo` on child components.
3. **Verify Changes**
   - Run `pnpm install` and `pnpm build` to verify that there are no type or build errors.
4. **Complete pre-commit steps**
   - Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.
