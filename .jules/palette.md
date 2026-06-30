## 2026-06-30 - Dynamic Form Array Accessibility
**Learning:** Visual grouping of dynamic input lists with a generic `<label>` wrapper is invalid HTML and inaccessible to screen readers. Furthermore, individual inputs in dynamic lists lack context without explicit labels.
**Action:** Use `<fieldset>` and `<legend>` to semantically group dynamic lists (applying flexbox directly to the legend), and append index-based `aria-label`s to individual inputs and row-level actions to provide explicit context.
