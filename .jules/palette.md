## 2024-04-12 - Truncated Render Methods in Exploration
**Learning:** `read_file` or `cat` may truncate before reaching the JSX `return` block in large Next.js components.
**Action:** When identifying UI elements for accessibility updates (like buttons in `RecipeGrid.tsx`), always use `grep -n -C 5` with unique text strings to locate the exact JSX structure and confirm current attributes before planning edits.
