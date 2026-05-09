## 2024-05-10 - Toggle Button Accessibility

**Learning:** When making icon-only interactive elements accessible, it's crucial to explicitly pair descriptive `aria-label`s with standard `aria-pressed={state}` attributes for toggle buttons. This is required to effectively convey the active state to screen readers.
**Action:** Always apply `aria-pressed={state}` to toggle buttons, ensure descriptive `aria-label`s are used for icon-only buttons, and use standard focus styles like `focus-visible:ring-2` (often paired with `outline-none` and a specific ring color) to provide clear visual feedback for keyboard navigation.
