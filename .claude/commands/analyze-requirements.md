---
name: Analyze Requirements
description: Analyze a User Story, ask clarification questions, and create approved requirements.
---

# Analyze Requirements

Analyze the provided User Story and any supporting documents.

Follow the Requirements Analyst workflow defined in `.claude/agents/requirements-analyst.md`.

## Instructions

1. Read the User Story from `capstone-user-story.md`.
2. Identify the business objective.
3. Identify actors and systems.
4. Identify inputs and outputs.
5. Identify functional requirements.
6. Identify non-functional requirements.
7. Identify assumptions and constraints.
8. Identify dependencies.
9. Identify edge cases.
10. Identify ambiguous or missing information.

Ask the human clarification questions before finalizing requirements.

After the human provides answers, present the proposed requirements for
approval.

After approval, create or update:

`requirements.md`

Do not implement application code.
