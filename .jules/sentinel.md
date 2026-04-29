## 2024-05-20 - InstructionParser ReDoS
**Vulnerability:** A ReDoS vulnerability was present in `TIME_REGEX` in `InstructionParser.tsx` because of multiple adjacent optional quantifiers `\s*(?:-|to)?\s*(\d+(?:\.\d+)?)?\s*`.
**Learning:** This regex allowed catastrophic backtracking. For strings like `"10   x"`, the engine would check many combinations of spaces across the optional blocks.
**Prevention:** Group optional segments into a single non-capturing block (e.g. `(?:\s*(?:-|to)\s*(\d+(?:\.\d+)?))?`) to prevent ambiguity and ensure linear evaluation.
