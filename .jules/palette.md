
## 2026-07-07 - Dynamic Form Array Accessibility
**Learning:** Grouping dynamic form arrays visually is insufficient for screen readers. A `<label>` element cannot wrap interactive content like buttons or multiple inputs.
**Action:** Always use `<fieldset>` with a direct `<legend>` child for grouping dynamic form rows. Ensure the `<legend>` retains the layout by applying utility classes directly to it. Additionally, always append index-based `aria-label`s to individual inputs (e.g., `aria-label="Ingredient ${index + 1} amount"`) and icon-only row actions (like remove buttons) to provide explicit context for screen reader users navigating repeating fields.
