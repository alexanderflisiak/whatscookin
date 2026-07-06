
## 2024-07-06 - Dynamic Form Array Accessibility
**Learning:** Using a `<label>` as a generic wrapper for dynamic form arrays containing interactive elements creates invalid HTML and poor screen reader experiences. Visual grouping alone is insufficient for repeating input rows.
**Action:** Always use `<fieldset>` and `<legend>` for structural grouping. Append index-based `aria-label`s to individual inputs (e.g., "Ingredient 1 amount") and icon-only row actions to provide explicit context. Apply flex utilities directly to `<legend>`.
