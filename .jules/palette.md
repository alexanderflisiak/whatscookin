## 2024-04-07 - Add accessibility to toggle buttons
**Learning:** Icon-only toggle buttons need both `aria-label` for identification and `aria-pressed` to communicate their current state to assistive technologies, along with clear visual focus indicators for keyboard navigation.
**Action:** Always include `aria-pressed` for buttons that toggle state (like the lazy filter) and standard focus-visible classes (`focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:outline-none`) for all icon-only interactive elements.
