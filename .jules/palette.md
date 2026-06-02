## 2025-06-02 - Proper ARIA State for Toggle Buttons
**Learning:** When using standard buttons that behave as toggles (like "Lazy Mode" filters), `aria-label` is not enough for screen readers to convey that the button is currently active.
**Action:** Always apply `aria-pressed={state}` to toggle buttons to properly communicate their active state to screen readers.
