## 2024-05-18 - useDeferredValue needs React.memo
**Learning:** `useDeferredValue` alone does not prevent child components from re-rendering when the parent re-renders due to the original state updating. When `RecipeGrid` used `useDeferredValue` for search input, every keystroke still caused all `RecipeCard` components to re-render.
**Action:** Always pair `useDeferredValue` with `React.memo` on the child components that render the deferred data (or other heavy children) so they skip re-rendering while the parent is showing stale deferred data.
