## 2026-06-20 - Accessible Dynamic Form Arrays
**Learning:** Visual grouping of dynamic form arrays (like ingredient lists) is insufficient for screen readers. Repeating inputs without context cause confusion.
**Action:** Always append index-based `aria-label`s to individual inputs (e.g., `aria-label="Ingredient ${index + 1} amount"`) and row-level icon-only actions (e.g., remove buttons) to provide explicit context and distinguish repeating fields.
