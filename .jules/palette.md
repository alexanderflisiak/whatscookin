## 2026-06-17 - Dynamic form inputs require context for screen readers
**Learning:** When using dynamic form arrays (like ingredient lists), visual grouping is not enough for screen readers. Each input must explicitly state its row position and purpose (e.g., 'Ingredient 1 amount') to prevent users from hearing confusing, disconnected prompts.
**Action:** Always append index-based `aria-label`s to individual inputs within a dynamically generated field list, and provide descriptive labels for row-level icon-only actions (like 'Remove ingredient 1').
