## 2024-04-12 - ARIA and Focus Visibility for Icon-Only Toggles
**Learning:** Icon-only toggle buttons (like "Lazy Mode" and "Surprise Me" in the search bar) lacked clear semantic meaning for screen readers and visible focus states for keyboard users.
**Action:** Always add `aria-label` to icon-only buttons, `aria-pressed={state}` to toggle buttons, and use Tailwind utility classes `focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:outline-none` for visible keyboard focus indicators.
