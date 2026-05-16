## 2024-03-24 - Form Input Accessibility
**Learning:** When form inputs (like dynamically generated inline rows in `RecipeForm.tsx`) lack explicit visible text `<label>` elements, screen reader accessibility degrades significantly. In Next.js/React applications, these types of grid/inline layouts are common but often overlook accessibility.
**Action:** Always verify that input groups without explicit label elements are supplemented with clear, descriptive `aria-label` attributes to ensure screen reader users can identify the purpose of each field.
