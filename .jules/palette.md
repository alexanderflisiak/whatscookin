## 2026-06-19 - Accessible Dynamic Input Arrays
**Learning:** Wrapping interactive group headers and buttons inside a generic `<label>` creates redundant and confusing screen reader announcements. Additionally, visual grouping of inputs in dynamic arrays is insufficient; screen reader users need explicit 1:1 index-based context for repeating inputs.
**Action:** Use a semantic `<div>` or `<fieldset>` instead of `<label>` for grouping interactive lists. Always add index-based `aria-label`s (e.g., `Ingredient ${index + 1} amount`) to dynamically mapped inputs and row-level icon-only actions.
