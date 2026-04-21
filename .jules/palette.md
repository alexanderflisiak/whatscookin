
## 2024-04-21 - Icon Button Keyboard Accessibility
**Learning:** Icon-only buttons across the app often lacked proper `aria-label` attributes and visible keyboard focus indicators, making them difficult for screen reader and keyboard-only users to navigate.
**Action:** Apply Tailwind's `focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:outline-none` utilities and semantic `aria-label` or `aria-pressed` attributes to all new interactive icon components.
