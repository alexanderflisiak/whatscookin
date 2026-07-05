## 2024-05-24 - Semantic Form Grouping and Dynamic List ARIA
**Learning:** Visual grouping of dynamic form arrays (like ingredient lists) is insufficient for screen readers. Additionally, using `<label>` to wrap a list of inputs and buttons is invalid HTML and harms accessibility.
**Action:** Always use `<fieldset>` with a flex-styled `<legend>` for semantic grouping of dynamic input lists, and append index-based `aria-label`s to individual inputs and row-level icon-only actions to provide explicit context.
