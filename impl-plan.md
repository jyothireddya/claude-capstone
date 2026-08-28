# Implementation Plan

## 1. Overview

The human-approved Node.js login baseline is already implemented in `server.js` and its active behavior is covered by the focused tests in `test/server.test.js`. On 2026-08-26, `npm test` passed all 11 tests. As of the current documentation sync, the test suite has been expanded to 23 login-specific tests (24 total including the unrelated placeholder in `src/tests/app.test.js`). This plan therefore does not propose a second login implementation, new dependencies, external authentication, persistence, or production security features.

The work is limited to reconciling verified implementation evidence with the approved requirements and architecture, strengthening narrowly useful regression coverage, and synchronizing the SDLC documentation. All requirements that remain `Not Found` stay out of scope.

## 2. Task Breakdown

### IP-001 - Verify and record the approved baseline

| Field | Detail |
| --- | --- |
| Task ID | IP-001 |
| Title | Verify and record the approved baseline |
| Description | Verify that `server.js` remains the active dependency-free login entry point and that `npm test` passes. Record traceable evidence that the existing login form, Login action, valid-login account access, and invalid-credential error satisfy FR-001 through FR-004. Treat the unrelated `src/index.js` example and `src/tests/app.test.js` placeholder as non-login evidence. No application behavior is to be added by this task. |
| Priority | P0 |
| Dependencies | None |
| Acceptance Criteria | `npm test` passes; FR-001 through FR-004 each reference existing implementation and login-test evidence; evidence explicitly identifies `server.js` and `test/server.test.js` as the baseline surfaces; unrelated Customer Order Service files are not claimed as login coverage. |

### IP-002 - Reconcile only demonstrated baseline drift

| Field | Detail |
| --- | --- |
| Task ID | IP-002 |
| Title | Reconcile only demonstrated baseline drift |
| Description | Compare the verified `server.js` request flow and test evidence with the approved architecture. Make a minimal correction only if a reproducible mismatch is found in the approved baseline, such as the login form, `POST /login`, credential outcome, session-backed `/account` access, or invalid-credential error. If no mismatch is found, record that no application-code change is required. Do not convert `Not Found` production concerns into work. |
| Priority | P1 |
| Dependencies | IP-001 |
| Acceptance Criteria | Any code change is limited to a reproduced mismatch with FR-001 through FR-004 or the approved baseline architecture; no new package, provider, persistence layer, account capability, or production control is introduced; no mismatch results in an explicit no-change verification record; affected focused tests pass. |

### IP-003 - Add focused regression coverage for existing login behavior

| Field | Detail |
| --- | --- |
| Task ID | IP-003 |
| Title | Add focused regression coverage for existing login behavior |
| Description | Extend `test/server.test.js` only where current assertions leave a meaningful gap in the approved baseline. Prioritize confirming that the rendered Login action submits the form to `POST /login` and that invalid-login responses preserve the submitted email without rendering the submitted password. Retain the existing valid-login, invalid-credential, session, logout, and request-handling tests. Do not add test cases for product behavior marked `Not Found`. |
| Priority | P1 |
| Dependencies | IP-001; IP-002 only if a baseline correction is needed |
| Acceptance Criteria | Tests assert the form method, action, and Login control for FR-001 and FR-002; an invalid-login test proves the password value is absent from the response while the email may be retained; all existing login tests continue to pass; no test asserts unspecified provider, network, account-state, persistence, or production-security behavior. |

### IP-004 - Synchronize completion and verification documentation

| Field | Detail |
| --- | --- |
| Task ID | IP-004 |
| Title | Synchronize completion and verification documentation |
| Description | Update the verification and review artifacts with the final test command, results, requirement traceability, and any narrowly corrected baseline behavior. Preserve the approved architecture's distinction between evidenced local behavior and `Not Found` production concerns. Document the unrelated placeholder test separately so it is not represented as login coverage. |
| Priority | P2 |
| Dependencies | IP-001, IP-002, IP-003 |
| Acceptance Criteria | Documentation reflects the actual code and test results; FR-001 through FR-004 have clear implementation and test evidence; any code change or explicit no-change decision is recorded accurately; unresolved product and production concerns remain `Not Found`; no credentials, secrets, or fabricated verification claims are included. |

## 3. Dependencies

`IP-001 -> IP-002 -> IP-003 -> IP-004`

IP-002 is a conditional task: it produces an application-code change only when verification identifies a reproducible mismatch. IP-003 can begin after IP-001 when no correction is needed; if IP-002 changes the baseline, IP-003 follows that change. IP-004 depends on the final test evidence from the preceding tasks.

## 4. Testing Strategy

Run `npm test` as the baseline and post-change verification command. Keep tests in `test/server.test.js` focused on the active `server.js` service. The suite currently contains 23 login tests covering FR-001 through FR-004, JSON and form-encoded edge cases, routing behavior, content-type negotiation, body-size limits, and server construction validation.

- Preserve evidence for the four approved outcomes: credential entry, Login action, valid login with account access, and invalid-login error.
- Add regression assertions for the rendered form's `POST /login` submission semantics and for non-redisplay of a submitted password after an invalid login.
- Retain current coverage for sessions, logout, expiry, cookie handling, unsupported methods and content types, and oversized requests as evidenced baseline behavior, not as expanded product requirements.
- Do not add tests for validation policy, external providers, network failures, persistence, rate limiting, CSRF, TLS deployment, account states, or other items marked `Not Found`.

## 5. Definition of Done

- The active login baseline is verified through a passing `npm test` run.
- FR-001 through FR-004 have traceable implementation and focused test evidence.
- Any implementation change addresses a demonstrated mismatch only; otherwise the no-change result is documented.
- The focused form-submission and password-non-redisplay regression coverage is passing.
- Documentation accurately distinguishes verified local baseline behavior from `Not Found` product and production concerns.
- No application code outside the approved baseline and no unrelated Customer Order Service artifact is represented as part of the login implementation.
