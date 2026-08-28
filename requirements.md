# Requirements

## 1. User Stories

### US-001: Login

> As a registered user, I want to log in with my email and password so that I can access my account.

**Source:** `capstone-user-story.md`

## 2. Business Objective

Enable a registered user to authenticate with an email address and password and access the user's account when the credentials are valid.

The business objective is derived from US-001. No further business outcomes, account types, or post-login destination are specified: `Not Found`.

## 3. Actors

| Actor | Role | Traceability |
| --- | --- | --- |
| Registered user | Enters login credentials and initiates login to access the account. | US-001; AC-001, AC-002 |
| Authentication system | Implied system responsibility for validating credentials and determining login success or failure. Its identity, interface, and implementation are `Not Found`. | US-001; AC-003, AC-004 |

## 4. Functional Requirements

| ID | Requirement | Traceability | Status |
| --- | --- | --- | --- |
| FR-001 | The system shall allow the registered user to enter an email address and password. | US-001; AC-001 | Required by source story |
| FR-002 | The system shall provide a Login action that the registered user can select after entering credentials. | US-001; AC-002 | Required by source story |
| FR-003 | When the supplied credentials are valid, the system shall log the user in and provide access to the user's account. | US-001; AC-003 | Required by source story |
| FR-004 | When the supplied credentials are invalid, the system shall show the user an error message. | US-001; AC-004 | Required by source story |

The following details are not defined by the source story: validation rules for email and password fields, error-message content, account landing destination, session duration, logout behavior, and account-state handling (`Not Found`).

## 5. Non-Functional Requirements

| ID | Requirement | Traceability | Status |
| --- | --- | --- | --- |
| NFR-001 | Non-functional requirements for performance, availability, accessibility, security controls, compatibility, scalability, observability, and maintainability are `Not Found` in the supplied user story. | US-001 | Requires clarification |

No non-functional requirement is asserted beyond the functional behavior explicitly stated in US-001. In particular, credential storage, transport protection, password masking, rate limiting, lockout, and audit logging are `Not Found` and require approval before being treated as scope.

Technology requirements are `Not Found` in both the user story and the authoritative Confluence page. No technology, framework, language, build tool, or authentication provider is required by the available sources.

## 6. Assumptions

The following assumptions are limited to what is necessary to interpret the story and are not additional business requirements:

- The actor has an account that is already registered, because US-001 identifies the actor as a registered user.
- A mechanism exists to determine whether submitted credentials are valid or invalid, because AC-003 and AC-004 require different outcomes. The mechanism, ownership, and integration are `Not Found`.
- Access to an account means the user is considered logged in; the exact destination and available account capabilities are `Not Found`.

## 7. Edge Cases

The user story does not define expected behavior for these cases. They must not be implemented or treated as acceptance criteria without clarification:

- Email or password is empty: expected behavior `Not Found`.
- Email format is invalid: expected behavior `Not Found`.
- Email or password contains leading/trailing whitespace: expected behavior `Not Found`.
- Credentials differ only by letter case: expected behavior `Not Found`.
- The account is disabled, locked, unverified, or does not exist: expected behavior `Not Found`.
- The authentication service is unavailable or returns a network/API failure: expected behavior `Not Found`.
- The user submits the form repeatedly or concurrently: expected behavior `Not Found`.

## 8. Acceptance Criteria

The following criteria are reproduced from `capstone-user-story.md` and traced to the functional requirements:

| ID | Acceptance criterion | Covered by |
| --- | --- | --- |
| AC-001 | User can enter email and password. | FR-001 |
| AC-002 | User can click the Login button. | FR-002 |
| AC-003 | User is logged in with valid credentials. | FR-003 |
| AC-004 | User sees an error message with invalid credentials. | FR-004 |

## 9. Open Questions

Clarification is needed before architecture or implementation decisions are approved:

1. What validation rules apply to the email and password fields, including empty values and malformed email addresses?
2. What exact error message or error behavior should occur for invalid credentials, and should it avoid revealing whether an account exists?
3. Where should a successfully authenticated user be taken, and what does account access include?
4. What authentication, session, logout, and credential-protection requirements apply?
5. Are account states such as disabled, locked, unverified, or nonexistent in scope, and what should each display?
6. What should happen when the authentication provider or network is unavailable?
7. What performance, availability, accessibility, browser/device compatibility, logging, and audit expectations apply?
8. Are password recovery, registration, remember-me, multi-factor authentication, or rate limiting in scope? Current scope: `Not Found`.

No clarification is required to record the baseline requirements above. Human approval is required before adding behavior from these open questions or advancing to architecture with those details treated as defined scope.

## 10. Confluence Sources

Retrieved at runtime on 2026-08-26 via the connected Atlassian MCP server, scoped to the authoritative space referenced by the Requirements Analyst (`jyothi1`, https://jyothiannapureddy6-1786346826609.atlassian.net/wiki/spaces/jyothi1/overview).

| Page | URL | Relevant requirements obtained |
| --- | --- | --- |
| GitHub Copilot Capstone Project | https://jyothiannapureddy6-1786346826609.atlassian.net/wiki/spaces/jyothi1/pages/425992/GitHub+Copilot+Capstone+Project | Reproduces the same US-001 Login user story and the same four acceptance criteria as `capstone-user-story.md`. No additional functional, non-functional, or technology requirements are present on this page. No conflicts with `capstone-user-story.md` were found. |

The expected page title `Claude Code Capstone Project` returned no result in the authoritative `jyothi1` space at runtime. This is not treated as a conflict because the available title variant contains aligned project requirements. Other pages found in the connected Atlassian site (e.g. `automated-documentation-sync-login - Technical Profile (Auto-Generated)` in the separate `jyothi` space, and `Capstone-Project` in the separate `codemiecpa` space) are outside the `jyothi1` space designated as authoritative for this project and describe a different/broader technical profile (Express, PostgreSQL, Jest, Docker) or a different login story (username-based). They are not treated as requirements for this pipeline without explicit human approval to expand scope or change the authoritative source.
