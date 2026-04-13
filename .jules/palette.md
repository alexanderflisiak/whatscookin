## 2024-04-13 - Toggle Button Accessibility
**Learning:** In React components like `RecipeGrid.tsx`, UI toggle buttons (like "I'm Lazy Mode") must communicate their active state to screen readers, not just visually via CSS classes.
**Action:** Always add `aria-pressed={state}` alongside `aria-label` and `focus-visible` to interactive toggle buttons so screen readers know if the filter/mode is active.
