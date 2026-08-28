---
name: Verify Solution
description: Run comprehensive code, requirements, and documentation verification.
---

# Verify Solution

Follow the Verification Agent workflow defined in `.claude/agents/verification.md`.

Read:

- `requirements.md`
- `architecture.md`
- `design-review.md`
- `impl-plan.md`
- `code-review.md`

Inspect the implementation and tests.

Run the appropriate:

- Build
- Unit tests
- Integration tests
- Linting
- Other project verification commands

Verify every approved functional and non-functional requirement.

Check:

- Happy paths
- Missing files
- Empty repository
- Not Found
- Missing fields
- Invalid input
- API failures
- Permission failures

Also verify the final documentation for:

- Completeness
- Accuracy
- Consistency
- Required sections
- Requirements traceability

Create:

`verification-report.md`

Use actual command output as evidence.

Never fabricate test results.

Do not hide failures.

Do not modify application code during verification.
