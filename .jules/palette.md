## 2024-06-22 - Accessible Dynamic Form Arrays
**Learning:** Using visual grouping is insufficient for screen readers in dynamic form arrays (like ingredient lists). Wrapping headers and buttons in a `<label>` element is invalid and confuses screen readers.
**Action:** Always append index-based `aria-label`s to individual inputs (e.g., `aria-label="Ingredient ${index + 1} amount"`) and row-level icon-only actions. Use generic semantic containers (like `<fieldset>` and `<div id="...">`) with `aria-labelledby` for grouped layout content rather than a generic `<label>`.
