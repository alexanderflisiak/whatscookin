## 2024-05-19 - Missing `aria-pressed` on custom toggle buttons
**Learning:** Custom toggle buttons implemented with visual cues (like background color changes) often lack the semantic `aria-pressed` attribute, which is necessary for screen readers to convey the current state of the toggle. This is a common pattern for "mode" switches (like "Lazy Mode").
**Action:** Always verify that interactive elements functioning as toggles have `aria-pressed={state}` applied, in addition to appropriate `aria-label`s and `focus-visible` styles.
