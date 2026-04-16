## 2024-04-16 - Clean Workspaces for Code Mods
**Learning:** Using temporary Node.js scripts (like `patch.js`) to apply precise string replacements is effective, but leaving them in the repository root pollutes the workspace and fails code reviews.
**Action:** Always delete temporary scripts (e.g., `rm patch.js`) immediately after verifying their execution and before requesting a code review.
