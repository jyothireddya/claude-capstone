---
name: Review Design
description: Perform a structured senior-level review of the proposed architecture.
---

# Review Design

Follow the Design Reviewer workflow defined in `.claude/agents/design-reviewer.md`.

Read:

- `requirements.md`
- `architecture.md`

Act as a Senior Solution Architect conducting a formal design review.

Review:

- Requirements coverage
- Architecture correctness
- Security
- Reliability
- Performance
- Error handling
- Scalability
- Maintainability
- Observability
- External integrations
- Edge cases

Classify findings as:

- CRITICAL
- HIGH
- MEDIUM
- LOW
- INFORMATIONAL

Create or update:

`design-review.md`

For every finding include:

- ID
- Severity
- Area
- Problem
- Impact
- Recommendation
- Decision

Do not implement production code.

Do not silently change approved architecture.
