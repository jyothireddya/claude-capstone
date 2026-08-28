---
name: Create Implementation Plan
description: Create a prioritized and dependency-ordered implementation plan.
---

# Create Implementation Plan

Follow the Implementation Planner workflow defined in `.claude/agents/implementation-planner.md`.

Read:

- `requirements.md`
- `architecture.md`
- `design-review.md`

Inspect the existing repository structure.

Create a dependency-ordered implementation plan.

Each task must include:

- Task ID
- Description
- Priority
- Dependencies
- Expected files
- Acceptance criteria
- Blocked status

Use priorities:

- P0 - Critical
- P1 - High
- P2 - Medium
- P3 - Low

Identify tasks that cannot begin until another task is completed.

Create or update:

`impl-plan.md`

Do not implement application code.
