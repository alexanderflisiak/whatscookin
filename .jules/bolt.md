## 2024-05-12 - React.memo with useDeferredValue
**Learning:** When using `useDeferredValue` to optimize list rendering based on fast state updates (like search inputs), child components receiving the deferred value (or rendered within the same parent) must be wrapped in `React.memo`. Otherwise, the parent's original state update will trigger re-renders in all children, bypassing the deferral.
**Action:** Always verify memoization on child components when implementing `useDeferredValue` in a parent component.
