## 2026-06-11 - Accessible Inline Filter Controls
**Learning:** Inline filter controls (search bar, filter toggles) need explicit `aria-label` when visual labels are omitted. Toggle buttons specifically need `aria-pressed={state}` to convey active status, and icon-only buttons need `aria-hidden="true"` on the icon with `focus-visible:ring-2` to support screen readers and keyboard navigation.
**Action:** Always apply `aria-label` to form inputs without explicit labels, `aria-pressed` for toggle buttons, and ensure proper `aria-hidden` and focus indicators on icon-only buttons.
