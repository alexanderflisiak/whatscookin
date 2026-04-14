## 2024-04-14 - React.memo with useDeferredValue
**Learning:** When using `useDeferredValue` to defer expensive UI updates (like list filtering during search typing), you must pair it with `React.memo` on the list's child components (e.g., list items). `useDeferredValue` alone does not prevent children from re-rendering when the parent re-renders due to the original state updating.
**Action:** Always wrap child list components in `React.memo` when utilizing `useDeferredValue` in the parent list component.
