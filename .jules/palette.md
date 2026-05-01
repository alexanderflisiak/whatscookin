
## 2024-05-01 - Icon-Only Action Bar Accessibility Pattern
**Learning:** Found a specific pattern in the application's top action bars (like in `RecipeGrid.tsx` for 'Surprise Me' and 'Lazy Mode') where icon-only buttons lacked proper screen reader context and keyboard navigation visibility. Toggle buttons also failed to broadcast their active state.
**Action:** When implementing or updating icon-only action buttons, always pair descriptive `aria-label`s with `focus-visible:outline-none focus-visible:ring-2` styles. For toggle buttons, crucially include `aria-pressed={state}` to announce active states to screen readers.
