## 2024-05-24 - Accessible Icon Toggle Buttons
**Learning:** Icon-only toggle buttons (like the "Lazy Mode" filter) rely solely on color/background changes to indicate their active state visually, which screen readers miss entirely. Additionally, custom buttons often lack keyboard focus styles when default browser outlines are removed.
**Action:** Always apply `aria-pressed={state}` to toggle buttons, ensure descriptive `aria-label`s are present alongside `title` attributes, and use `focus-visible:ring-2` to restore clear keyboard navigation.
