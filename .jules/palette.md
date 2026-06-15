## 2026-06-15 - Active States on Icon Toggle Buttons
**Learning:** When using visually styled icon-only buttons as toggles (e.g., 'Lazy Mode' turning orange), the visual state is not conveyed to screen readers. Relying solely on colors for active states is an accessibility gap.
**Action:** Always use the `aria-pressed={state}` attribute on toggle buttons to explicitly communicate their active/inactive state to assistive technologies.
