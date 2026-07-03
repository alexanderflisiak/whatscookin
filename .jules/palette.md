## 2024-05-20 - Dynamic Form Array Accessibility
**Learning:** Visual grouping of dynamic form arrays (like ingredient lists) is insufficient for screen readers; using a `<label>` as a generic header wrapper produces invalid/inaccessible HTML.
**Action:** Always use `<fieldset>` and `<legend>` for grouped layouts, explicitly associate standard inputs with `htmlFor`, and append index-based `aria-label`s to dynamic repeating fields and their icon-only action buttons.
