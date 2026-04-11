## 2024-04-11 - React.memo with useDeferredValue
**Learning:** When using `useDeferredValue` to defer expensive UI updates (like list filtering during search typing), you must pair it with `React.memo` on the list's child components. `useDeferredValue` alone does not prevent children from re-rendering when the parent re-renders due to the original state updating.
**Action:** Always wrap child components of lists optimized with `useDeferredValue` in `React.memo()`.
