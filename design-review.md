# Design Review

## Summary

The corrected architecture is consistent with the approved requirements and the human-approved existing dependency-free Node.js baseline. It accurately identifies `server.js` as the login implementation, excludes the unrelated `src/index.js` example, and reflects the remediated scope: a JSON login endpoint supporting both `application/json` and `application/x-www-form-urlencoded` submission paths, with out-of-scope session management removed.

`npm test` was executed and passed: 23 login tests passed, 0 failed, 0 skipped. 24 tests total including 1 unrelated placeholder test in `src/tests/app.test.js`.

## Requirements Coverage

| Requirement | Architecture coverage | Implementation and test evidence |
| --- | --- | --- |
| FR-001 | Server-rendered login interface contains email and password inputs. | `loginPage()`; `FR-001 — login form renders email and password credential fields` test. |
| FR-002 | The form posts to `POST /login` through a Login action. | `loginPage()` and login handler; `FR-002 — login form provides a POST /login submission action with Login button` test. |
| FR-003 | Valid credentials return HTTP 200 with `{ "message": "Login successful" }`. | Credential validator and login handler; `FR-003 — valid credentials return HTTP 200 with login successful message` test. |
| FR-004 | Invalid credentials return HTTP 401 with `{ "error": "Invalid email or password" }`. | Login handler; `FR-004 — invalid credentials return HTTP 401 with error message` test. |

The design also documents input validation, request-size and content-type controls, and dual content-type support. These are evidenced baseline behaviors, not additional approved product requirements. Requirements and architecture correctly retain unspecified validation rules, identity-provider choices, session policy, deployment topology, and non-functional requirements as `Not Found`.

## Findings

No blocking design defects were found.

The architecture correctly represents the active implementation's component boundaries, request flow, runtime, and applicable security controls. The stated default credential source, dual content-type support, JSON response contract, and request parsing behavior are consistent with the remediated `server.js`. The test suite exercises required login behavior and relevant baseline error paths, including form-encoded submission, malformed JSON, missing fields, and unsupported content types.

Post-sync observations (informational, no design defects):

- The `escapeHtml` helper was dead code in `server.js` and has been removed. `loginPage()` is static HTML with no user-controlled content; no runtime escaping was needed. Architecture section 7 has been updated accordingly.
- The test suite has been expanded from 6 to 23 login-specific tests covering additional JSON and form-encoded edge cases, routing, content-type handling, and server construction. This strengthens regression coverage without changing the approved design.
- A `Dockerfile` based on `node:20-alpine` has been added to the repository. It exposes port 3000 and uses `npm start` as the entry point. This is consistent with the approved baseline. TLS, secrets injection, and orchestration remain outside the approved scope.

## Risks

- Direct configured credential comparison is appropriate only for the approved local baseline; password storage, hashing, and an identity provider are `Not Found`.
- No session management is provided by the login endpoint; post-login state management is outside the approved scope.
- CSRF protection, rate limiting, lockout, audit logging, secret rotation, authorization, accessibility, availability, and observability requirements are `Not Found`.
- The baseline's validation and HTTP response behavior may need revision if the currently open product questions are later approved.

## Recommendations

- Preserve the current dependency-free Node.js baseline and its focused test coverage for the approved local login scope.
- Resolve the open requirements questions before treating validation, authentication, session persistence, deployment, or security controls as production commitments.
- Before production use or expansion beyond the local baseline, obtain human approval for credential handling, TLS and secure-cookie policy, CSRF and abuse protections, session persistence, and operational monitoring.

## Approved Design Decisions

- Use `server.js` as the active human-approved Node.js login baseline, with built-in HTTP and test modules and no declared dependencies.
- Accept both `application/json` and `application/x-www-form-urlencoded` in `POST /login` to align the backend handler with the rendered form submission path and JSON API clients.
- Return JSON from `POST /login` for both success (`HTTP 200`) and failure (`HTTP 401`, `HTTP 400`, `HTTP 413`, `HTTP 415`), using a uniform error contract.
- Limit implementation to FR-001 through FR-004 scope; exclude session management, /account, and /logout as out-of-scope for this phase.
- Exclude `src/index.js` from this login architecture because it is unrelated to the active entry point and has an undeclared Express dependency.

## Review Status

APPROVED
