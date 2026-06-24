## 2024-05-24 - Dynamic Form Array Accessibility
**Learning:** Visual grouping of dynamic form arrays (like ingredient lists) is insufficient for screen readers. Inputs and row-level icon-only actions need explicit context to distinguish repeating fields.
**Action:** Always append index-based `aria-label`s to individual inputs (e.g., `aria-label="Ingredient ${index + 1} amount"`) and row-level actions (e.g., remove buttons) within dynamic arrays.
