---
name: Prepare Pull Request
description: Prepare the final production-ready Pull Request and changelog.
---

# Prepare Pull Request

Follow the Pull Request Agent workflow defined in `.claude/agents/pull-request.md`.

Read:

- `requirements.md`
- `architecture.md`
- `design-review.md`
- `impl-plan.md`
- `code-review.md`
- `verification-report.md`

Inspect:

- Git status
- Git diff
- Changed files
- Test results

Prepare the Pull Request with exactly these sections:

## Summary

Provide a 2-3 sentence overview of what was built and why.

## Changes Made

List every added or modified file and explain why it changed.

## Test Evidence

Include actual test commands and results.

Include CI links only when they actually exist.

## Known Limitations

Document:

- Not Found items
- Out-of-scope items
- Known issues
- Remaining limitations

## Reviewer Checklist

Create a checklist covering:

- Requirements
- Architecture
- Design review
- Implementation
- Code review
- Unit tests
- Integration tests
- Documentation
- Security
- Secrets
- Known limitations

Also prepare the appropriate `CHANGELOG.md` entry.

Do not invent information.

Do not commit, push, or merge without explicit human approval.
