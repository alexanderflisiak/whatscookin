## 2026-05-28 - Inline form inputs lacking labels
**Learning:** Form inputs inside inline structures (like dynamically generated rows for ingredients) often lack explicit visible text labels to save space, but screen readers still require context.
**Action:** Always add descriptive `aria-label` attributes to these inputs so they are accessible without relying on visible labels.
