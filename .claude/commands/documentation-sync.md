---
name: documentation-sync
description: Synchronizes project documentation with approved requirements, architecture, implementation, tests, and verification results.
---

# Documentation Sync

## Purpose

Maintain consistency between the project's SDLC documentation and the
actual implementation.

## When to Use

Use this command when:

- Requirements change.
- Architecture changes.
- Implementation changes.
- Tests change expected behavior.
- Documentation becomes outdated.
- A verification step identifies documentation inconsistencies.
- A Pull Request needs accurate documentation.
- The final documentation needs quality validation.

## Source of Truth

Use the following priority order:

1. Human-approved requirements
2. Human-approved architecture
3. Approved design decisions
4. Actual implementation
5. Actual test results
6. Verification results

Never invent information to fill a documentation gap.

## SDLC Artifacts

The following documents may be synchronized:

- `requirements.md`
- `architecture.md`
- `design-review.md`
- `impl-plan.md`
- `code-review.md`
- `verification-report.md`
- `CHANGELOG.md`
- `README.md`

## Step 1 — Discover

Identify:

- Documentation files
- Source files
- Test files
- Configuration files
- Generated documentation
- Relevant Git changes

Determine which documents are affected by the current change.

## Step 2 — Compare

Compare documentation against the actual project state.

Check for:

- Missing sections
- Outdated information
- Contradictory information
- Missing requirements
- Incorrect component descriptions
- Incorrect data flow
- Missing implementation details
- Missing test evidence
- Incorrect examples
- Broken references

## Step 3 — Requirements Traceability

Verify that every documented requirement has a corresponding implementation
or is explicitly identified as:

- Not Implemented
- Out of Scope
- Not Found

Do not mark a requirement as implemented without evidence.

## Step 4 — Architecture Traceability

Compare `architecture.md` with the actual implementation.

Identify:

- Components described but not implemented
- Components implemented but not documented
- Different technology choices
- Different data flows
- Missing integrations
- Architecture drift

Report architecture drift instead of silently changing approved architecture.

## Step 5 — Implementation Documentation

Check whether documentation correctly describes:

- APIs
- Components
- Configuration
- Data flow
- Error handling
- External dependencies
- Synchronization behavior

Only document behavior that actually exists.

## Step 6 — Test Documentation

Compare documentation with actual test results.

Verify:

- Test commands
- Test scenarios
- Test coverage
- Failed tests
- Skipped tests
- Integration tests

Never fabricate test results.

## Step 7 — Synchronization

When an inconsistency is found:

1. Identify the affected document.
2. Identify the source of truth.
3. Explain the difference.
4. Determine whether the documentation or implementation should change.
5. Ask the human when the correct behavior is unclear.
6. Update documentation only when the change is supported.

## Not Found Handling

If information cannot be determined from the repository or approved
requirements, use:

`Not Found`

Do not guess.
