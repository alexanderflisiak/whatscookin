## 2024-05-18 - Missing Memoization with useDeferredValue
**Learning:** `useDeferredValue` does not prevent child components from re-rendering on its own. When the parent re-renders due to the original state updating, children will also re-render unless explicitly memoized. In `RecipeGrid`, a deferred search value was used, but the `RecipeCard` components were re-rendering anyway because they weren't wrapped in `React.memo()`.
**Action:** Always pair `useDeferredValue` with `React.memo` on the child components that depend on the deferred value, to actually gain the performance benefit.
