## 2024-05-04 - RecipeGrid Accessibility Patterns
**Learning:** Icon-only toggle buttons (like "I'm Lazy Mode") need more than just an `aria-label`; they require an `aria-pressed={state}` attribute to properly convey their active/inactive status to screen readers, especially when the visual indication relies solely on color/background changes.
**Action:** When implementing or updating toggle buttons, always ensure both a descriptive `aria-label` and dynamic `aria-pressed` state are present alongside visual indicators.
