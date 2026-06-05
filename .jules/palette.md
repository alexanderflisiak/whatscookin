## 2024-05-15 - Missing ARIA labels in mapped inline form fields
**Learning:** Found an accessibility pattern specific to this app where complex array-mapped fields (like `ingredients` with separate amount, unit, and name inputs) lack visible `<label>` text for visual compactness, resulting in no accessible name for screen readers.
**Action:** Always verify that inline fields without visible `<label>` elements have descriptive `aria-label`s, especially in dynamically mapped array lists like ingredients or instruction steps. Use `aria-hidden="true"` on their corresponding decorative icons.
