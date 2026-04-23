## 2024-05-14 - React.memo with useDeferredValue
**Learning:** `useDeferredValue` does not magically prevent child components from re-rendering when the parent state updates. It only defers the update of the specific value passed to it. To actually prevent re-renders of list items during search typing, the child components (like `RecipeCard`) must be wrapped in `React.memo()`.
**Action:** Always pair `useDeferredValue` with `React.memo` on the child components that use the deferred value to ensure performance benefits.
