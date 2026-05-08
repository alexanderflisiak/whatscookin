## 2024-06-25 - RecipeGrid Accessibility Polish
**Learning:** Icon-only buttons (like the Randomizer and Lazy Mode toggles) require both descriptive `aria-label`s for screen readers and distinct `focus-visible` ring styles for keyboard navigation. Toggle states must explicitly communicate their status using `aria-pressed`.
**Action:** Always add `aria-label`, `focus-visible:ring-2` (and `outline-none`), and conditional `aria-pressed` to interactive icon elements that lack visible text, relying on standard Tailwind utilities.
