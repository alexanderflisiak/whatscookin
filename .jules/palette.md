## 2024-05-02 - Accessible Toggle Buttons and Keyboard Focus
**Learning:** For toggle buttons (like "Lazy Mode"), screen readers need `aria-pressed={boolean}` to properly understand their active state. Additionally, explicitly defining focus states (`focus-visible:ring-2`) ensures keyboard-only users can clearly see which interactive element they're currently focused on.
**Action:** Always include `aria-pressed` for toggleable UI elements and verify focus styles (e.g. `focus-visible:outline-none focus-visible:ring-2`) are present and visible on interactive custom components.
