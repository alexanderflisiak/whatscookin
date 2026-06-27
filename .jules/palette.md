## 2026-06-27 - Accessibility for Dynamic Form Arrays
**Learning:** Visual grouping in dynamic form arrays (like ingredient lists) is insufficient for screen readers, causing all fields to sound identical.
**Action:** Always append index-based `aria-label`s to individual inputs (e.g., `Ingredient ${index + 1} amount`) and row-level icon-only actions to provide explicit context and distinguish repeating fields.
