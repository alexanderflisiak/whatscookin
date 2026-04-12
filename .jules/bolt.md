
## 2024-11-20 - useDeferredValue needs React.memo
**Learning:** `useDeferredValue` does not prevent child components from re-rendering if they aren't memoized. When `RecipeGrid` uses `useDeferredValue` for search to prevent blocking the main thread during typing, the whole `RecipeGrid` still re-renders when the original `search` state changes. If `RecipeCard` components in the list aren't wrapped in `React.memo()`, they will all re-render on every keystroke anyway, defeating the purpose of the deferral.
**Action:** When deferring expensive computations or list filtering in a parent component, always pair it with `React.memo()` on the individual list items to prevent cascading re-renders.
