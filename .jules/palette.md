## 2024-06-23 - Accessible Dynamic Form Arrays
**Learning:** Visual grouping is insufficient for screen readers in dynamic form arrays (like ingredients).
**Action:** Always use `<fieldset>`/`<legend>` for the group, and add index-based `aria-label`s to individual inputs (e.g., `aria-label="Ingredient ${index + 1} amount"`) and row-level icon-only actions to provide explicit context.
