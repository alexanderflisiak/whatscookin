## 2024-04-19 - React.memo with useDeferredValue
**Learning:** `useDeferredValue` does not automatically prevent child components from re-rendering when the parent re-renders due to the original state updating. It only defers the new value from being passed down. To actually prevent expensive UI updates during typing (like in list filtering), the child components (e.g., list items) must be wrapped in `React.memo()`.
**Action:** Always pair `useDeferredValue` with `React.memo` on child components when the goal is to optimize rendering performance of large lists.
