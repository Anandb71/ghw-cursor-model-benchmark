# Cursor model benchmark (MLH GHW Hacktoberfest, Cursor Challenge 2)

One identical prompt ([PROMPT.md](PROMPT.md)) was run through three models with the Cursor CLI
(`cursor-agent -p --model <id> --force --trust`), each in its own empty folder under `runs/`, all on Oct 13, 2026.
Each model wrote `duration.js` (`parseDuration` / `formatDuration`) plus its own tests.
To grade fairly, every implementation was also run against the same independent 22-case grader (`grader/grade.test.mjs`)
and a handful of extra edge-case probes. Full CLI transcripts are in `runs/<model>.log`.

## Results

| Model (Cursor id) | Wall time | Own tests | Independent grader (22) | LOC impl / tests | Edge-case behaviour |
|---|---|---|---|---|---|
| Claude Sonnet 4.5 (`claude-4.5-sonnet`) | 119 s | 14/14 pass | 22/22 | 88 / 100 | Strict (rejects `1H`, `.5h`); `formatDuration(1.5)` → `1ms` (drops fraction) |
| Gemini 3.1 Pro (`gemini-3.1-pro`) | 75 s | 4/4 pass | 22/22 | 74 / 45 | Lenient (accepts `1H`, `.5h`); `formatDuration(1.5)` → `1.5ms` |
| Grok 4.7 High (`grok-4.7-high`) | 169 s | 7/7 pass | 22/22 | 94 / 60 | Strict (rejects `1H`, `.5h`); `formatDuration(1.5)` → `1.5ms` |

All three reject `5x`, `h1`, `1h-30m`, `1e3s`, empty/whitespace input, and sum repeated units (`1h 1h` = 2h).

## Pros and cons

**Claude Sonnet 4.5**
- Pros: by far the most thorough self-written test suite (14 tests, 100 lines); strict, predictable parsing.
- Cons: silently truncates fractional milliseconds when formatting, so `parse(format(x))` is not always lossless.

**Gemini 3.1 Pro**
- Pros: fastest (75 s) and the most compact implementation; forgiving input (case-insensitive units, leading-dot decimals).
- Cons: thinnest tests (4 grouped tests); leniency was not asked for and could accept input a caller would want rejected.

**Grok 4.7 High**
- Pros: correct on every grader case and probe, keeps fractional ms on round-trip, strict validation, readable code.
- Cons: slowest of the three (169 s) and the largest implementation; mid-sized test suite (7 tests).

**Takeaway:** for a small, well-specified task all three produced working code first try. They differed in speed,
how much testing they volunteered, and judgment on unspecified edge cases.
