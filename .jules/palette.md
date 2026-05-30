## 2024-05-30 - ARIA Labels for Dynamic Inline/Grid Forms
**Learning:** In dynamic, inline form patterns (like adding rows of ingredients), explicitly adding visible `<label>` elements for every input inside the row can clutter the UI. However, omitting them breaks accessibility.
**Action:** When working with repeating input rows, always add descriptive `aria-label` attributes to the inline inputs (e.g., `aria-label="Ingredient 1 amount"`) and ensure icon-only buttons (like remove row) have both `aria-label` and `title` attributes.
