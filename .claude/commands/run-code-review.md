---
name: Run Code Review
description: Perform the complete production code review checklist.
---

# Run Code Review

Follow the Code Reviewer workflow defined in `.claude/agents/code-reviewer.md`.

Read:

- `requirements.md`
- `architecture.md`
- `design-review.md`
- `impl-plan.md`

Inspect the implementation and tests.

Review the following areas:

## Correctness

Verify that the implementation satisfies the requirements.

## Security

Check:

- Secrets
- Input validation
- Authentication
- Authorization
- Sensitive information

## Error Handling

Check:

- API failures
- Missing files
- Empty repositories
- Not Found
- Missing fields
- Invalid input
- Network failures
- Permission failures

## Test Coverage

Check:

- Happy path
- Not Found
- Missing fields
- Invalid input
- Empty input
- API failures
- Integration scenarios

## Code Clarity

Check:

- Function names
- Variable names
- Complexity
- Readability

## DRY

Identify duplicated logic.

## Dependency Safety

Inspect dependency definitions and identify known dependency risks when
evidence is available.

Create:

`code-review.md`

Classify findings as:

- CRITICAL
- HIGH
- MEDIUM
- LOW
- INFO

Do not modify source code during the review.
