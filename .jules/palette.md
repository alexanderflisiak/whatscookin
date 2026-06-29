## 2024-06-29 - Accessible Dynamic Forms
**Learning:** When using dynamic form arrays (like ingredient lists), visual grouping is not enough for screen readers. Using a generic `<label>` to wrap inputs is invalid HTML semantics.
**Action:** Always use `<fieldset>` and `<legend>` to group related inputs, and append index-based `aria-label`s to individual inputs (e.g., "Ingredient 1 amount") and icon-only actions (like "Remove ingredient 1") to provide clear context.
