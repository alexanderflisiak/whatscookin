## 2024-04-10 - Adding Accessibility States to Icon Buttons
**Learning:** For interactive icon-only buttons (like "Surprise Me" and "Lazy Mode" filters), relying solely on `title` or color changes is insufficient for screen readers and keyboard users. Toggle buttons also need explicit state announcement.
**Action:** Always add `aria-label` and `focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:outline-none` to icon buttons. For toggle filters, strictly apply `aria-pressed={state}` to ensure state transitions are properly announced by assistive technology.
