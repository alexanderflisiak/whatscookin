## 2024-04-24 - React useDeferredValue with memo
**Learning:** `useDeferredValue` does not magically prevent child component re-renders when the parent re-renders due to the original state updating. If a parent re-renders when the immediate state changes, all children re-render synchronously unless they are memoized.
**Action:** Always pair `useDeferredValue` with `React.memo` on the child components that consume the deferred data, or ensure the expensive rendering is structurally isolated to avoid defeating the purpose of the hook.
