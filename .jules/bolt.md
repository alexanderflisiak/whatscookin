## 2024-05-17 - React.memo with useDeferredValue
**Learning:** Using `useDeferredValue` alone is insufficient to prevent re-renders in mapped children when the parent component re-renders due to state updates (e.g., during search input).
**Action:** Always ensure that child list items are wrapped in `React.memo` when pairing them with a deferred value in the parent component to actually achieve the desired performance benefit and avoid blocking the main thread.
