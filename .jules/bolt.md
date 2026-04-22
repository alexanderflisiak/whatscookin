## 2024-05-15 - React.memo with useDeferredValue
**Learning:** `useDeferredValue` does not prevent a component's children from re-rendering when the parent re-renders due to the original state updating. If a parent (like `RecipeGrid`) defers a value (like search) and renders children (like `RecipeCard`), those children will re-render on every keystroke unless they are explicitly wrapped in `React.memo`.
**Action:** Always pair `useDeferredValue` with `React.memo` on the child components that render the deferred list to achieve the intended performance benefits.
