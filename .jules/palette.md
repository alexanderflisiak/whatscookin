## 2024-10-24 - Dynamic Array Form Inputs
**Learning:** In dynamic form arrays (like ingredient rows) where a single visual heading exists but individual inputs lack explicit `<label>` associations, screen readers fail to contextualize the fields.
**Action:** Always provide explicit `aria-label` attributes indexed to their position (e.g., "Amount for ingredient 1") for row-based inputs, and apply standard `focus-visible:ring-2` to support keyboard navigation.
