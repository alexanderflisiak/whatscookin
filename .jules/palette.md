## 2024-05-01 - Icon Accessibility Pattern
**Learning:** Icon-only toggle buttons and navigation controls often lack aria attributes and focus-visible outlines, making them confusing for screen readers and keyboard users.
**Action:** Always pair `title` with `aria-label` for icon buttons, use `aria-pressed` for toggles, and append `focus-visible:ring-2 outline-none` to convey focus clearly.
