## 2024-06-18 - Improve Dynamic Form Array Accessibility
**Learning:** Visual grouping is insufficient for screen readers in dynamic form arrays. Users navigating repeating inputs need explicit context to distinguish fields.
**Action:** Always append index-based `aria-label`s to individual inputs (e.g., `aria-label="Ingredient ${index + 1} amount"`) and row-level icon-only actions (e.g., remove buttons) to provide clear context.
