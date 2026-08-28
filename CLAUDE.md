# Claude Code Capstone Project Instructions

## Project

This project implements an Agentic SDLC pipeline for the
Automated Documentation Sync use case.

Claude Code agents are used throughout the software development
lifecycle.

## SDLC Workflow

The approved workflow is:

1. Requirements
2. Architecture
3. Design Review
4. Implementation Planning
5. Implementation
6. Code Review
7. Verification
8. Pull Request

## Agent Responsibilities

Use the following agents for their corresponding SDLC stages:

- Requirements Analyst — `.claude/agents/requirements-analyst.md`
- Solution Architect — `.claude/agents/solution-architect.md`
- Design Reviewer — `.claude/agents/design-reviewer.md`
- Implementation Planner — `.claude/agents/implementation-planner.md`
- Implementation Agent — `.claude/agents/implementation.md`
- Code Reviewer — `.claude/agents/code-reviewer.md`
- Verification Agent — `.claude/agents/verification.md`
- Pull Request Agent — `.claude/agents/pull-request.md`

Do not skip an SDLC stage without human approval.

## Slash Commands

Use the following slash commands to invoke each SDLC stage:

- `/analyze-requirements` — Run the Requirements Analyst
- `/design-architecture` — Run the Solution Architect
- `/review-design` — Run the Design Reviewer
- `/create-implementation-plan` — Run the Implementation Planner
- `/run-code-review` — Run the Code Reviewer
- `/verify-solution` — Run the Verification Agent
- `/prepare-pr` — Run the Pull Request Agent
- `/documentation-sync` — Synchronize SDLC documentation

## Human-in-the-Loop

The human is the final decision maker.

Claude must:

- Ask clarification questions when requirements are unclear.
- Avoid inventing business requirements.
- Request human approval for significant architectural decisions.
- Respect approved requirements and architecture.
- Report uncertainty instead of guessing.

## SDLC Artifacts

The following documents are the official SDLC artifacts:

- requirements.md
- architecture.md
- design-review.md
- impl-plan.md
- code-review.md
- verification-report.md
- CHANGELOG.md

Each stage must use the outputs from the previous stage.

## Traceability

Requirements must trace back to the User Story.

Architecture must trace back to approved requirements.

Design review must evaluate the architecture.

Implementation planning must trace back to the approved architecture.

Implementation must follow the approved implementation plan.

Code review must evaluate the implementation against requirements
and architecture.

Verification must provide evidence that requirements are satisfied.

The Pull Request must accurately represent the completed work.

## Security

Never commit or expose:

- Passwords
- API keys
- Access tokens
- Private keys
- Connection strings
- Credentials
- Secrets

Do not place secrets in:

- Source code
- Logs
- Tests
- Documentation
- Pull Request descriptions

## Error Handling

The implementation must consider:

- Missing files
- Empty repositories
- Missing fields
- Invalid input
- Not Found scenarios
- API failures
- Network failures
- Permission failures
- Partial synchronization failures

Errors must be handled gracefully and provide useful diagnostic information
without exposing sensitive information.

## Testing

New functionality must include appropriate tests.

Tests should cover:

- Happy paths
- Invalid input
- Empty input
- Missing files
- Not Found cases
- Missing fields
- API failures
- Other relevant edge cases

Do not remove or weaken tests simply to make them pass.

## Code Quality

Prefer:

- Small focused functions
- Meaningful names
- Clear separation of responsibilities
- Reusable logic
- Minimal duplication
- Simple and maintainable designs

Avoid:

- Unnecessary dependencies
- Unnecessary complexity
- Dead code
- Hard-coded secrets
- Unapproved functionality

## Documentation

Documentation must reflect the actual implementation.

Do not invent information.

When required information cannot be determined, use:

`Not Found`

Documentation should be:

- Clear
- Accurate
- Consistent
- Traceable
- Testable where applicable

## Automated Documentation Sync

The solution must maintain consistency between:

- Requirements
- Architecture
- Implementation
- Tests
- Final documentation

When implementation changes affect documentation, identify the affected
documentation and synchronize it.

## Scope Control

Do not implement functionality that is outside the approved requirements
or architecture without human approval.

If a requested change conflicts with an approved design, explain the
conflict before proceeding.

## Git and Pull Requests

Before creating a Pull Request:

- Review the Git diff.
- Confirm tests have been executed.
- Confirm verification has been completed.
- Check for secrets.
- Identify known limitations.
- Ensure the PR description reflects actual changes.

Do not commit, push, or merge changes unless explicitly requested by the
human.
