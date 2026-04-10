## 2026-04-10 - useDeferredValue needs React.memo
**Learning:** `useDeferredValue` on its own doesn't prevent child components from re-rendering if their parent re-renders. In `RecipeGrid`, updating the `search` state on every keystroke caused the parent to re-render, forcing all `RecipeCard` instances to re-render, which defeated the purpose of deferring the search value.
**Action:** Always pair `useDeferredValue` with `React.memo` on the list child components so they only re-render when their specific props change, properly mitigating rendering bottlenecks.
