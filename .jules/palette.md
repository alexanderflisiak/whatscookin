
## 2026-04-14 - RecipeGrid Toolbar Buttons Keyboard and ARIA Accessibility
**Learning:** The app has a pattern of using icon-only buttons for toolbar actions (like Surprise Me and Lazy Mode) without ARIA labels, `aria-pressed` states, or explicit focus rings, which creates an inaccessible experience for screen reader and keyboard users.
**Action:** Always ensure `aria-label` attributes are added to icon-only interactive elements. Use `aria-pressed` for toggle states. Implement explicit focus indicators using Tailwind utilities like `focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:outline-none` to make elements clearly selectable.
