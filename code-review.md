# Code Review

## Summary

This review covers the remediated login implementation following the initial review cycle. Three findings were identified in the initial review (CR-001 High, CR-002 Medium, CR-003 Medium). All three have been addressed. The implementation satisfies FR-001 through FR-004. The `npm test` suite passes with 23 login tests and 0 failures (24 total including 1 unrelated placeholder test).

## Correctness

The login form renders email and password fields and a POST /login action (FR-001, FR-002). Valid credentials return HTTP 200 with `{ "message": "Login successful" }` (FR-003). Invalid credentials return HTTP 401 with `{ "error": "Invalid email or password" }` (FR-004). Both `application/json` and `application/x-www-form-urlencoded` submission paths are handled. All controlled error paths (malformed input, unsupported content type, oversized body) return the invalid-credentials JSON contract.

## Security

`loginPage()` renders static HTML with no dynamic user-controlled content, eliminating the reflected-XSS attack surface. Generic error responses do not distinguish between missing credentials and invalid credentials, preventing user-enumeration. No session identifiers, cookies, or authentication tokens are issued by the login endpoint. No credentials, passwords, or secrets are present in source code or tests.

## Error Handling

Controlled JSON responses cover: malformed JSON body, incomplete payload (missing email or password), malformed email format, unsupported content type (415), oversized request body (413), and invalid credentials (401). The error contract `{ "error": "Invalid email or password" }` is used uniformly for all failure paths that are not HTTP-level protocol errors.

## Test Coverage

`npm test` passes: 23 login tests passed; 0 failed, cancelled, skipped, or todo. The `src/tests/app.test.js` placeholder adds 1 unrelated passing test (24 total). Login test breakdown by area:

FR acceptance tests (4):
- FR-001: login form renders email and password credential fields.
- FR-002: login form provides a POST /login submission action with Login button.
- FR-003: valid credentials return HTTP 200 with login successful message.
- FR-004: invalid credentials return HTTP 401 with error message.

JSON submission edge cases (9):
- Form-encoded submission path returns HTTP 200 for valid credentials.
- JSON missing password field returns 400.
- JSON missing email field returns 400.
- JSON malformed body returns 400.
- JSON invalid email format returns 400.
- JSON whitespace-only email returns 400.
- JSON whitespace-only password returns 401.
- JSON wrong email returns 401.
- Content-Type with charset parameter is accepted.

Form-encoded edge cases (4):
- Form-encoded wrong password returns 401.
- Form-encoded missing email returns 400.
- Form-encoded missing password returns 400.
- Form-encoded invalid email format returns 400.

Protocol and routing (4):
- Unsupported content type returns 415.
- Streamed body exceeding 10000 bytes returns 413.
- Unknown route returns 404 with text/html content type.
- Wrong method (PUT /login) returns 404.

Server construction (1):
- `createLoginServer` throws when credentials are not provided.

GET / smoke test (1):
- GET / response Content-Type is text/html.

## Code Quality

The login server is dependency-free, small, and uses focused helpers (`readBody`, `loginPage`, `sendHtml`, `sendJson`, `createCredentialValidator`). Out-of-scope logic (session management, /account, /logout) has been removed. The `escapeHtml` helper was dead code (never called) and has been removed, reducing the code surface area without affecting behavior.

## Findings

### Initial Review (addressed in remediation)

- CR-001 (High): Rendered login form submission path was not aligned with backend handling. The POST /login endpoint returned HTTP 303 redirect instead of the approved JSON response contract. **Remediated.** POST /login now returns HTTP 200 with `{ "message": "Login successful" }` for valid credentials and HTTP 401 with `{ "error": "Invalid email or password" }` for invalid credentials.
- CR-002 (Medium): Out-of-scope logic was present in earlier implementation (session management, /account handler, /logout handler). **Remediated.** Out-of-scope routes and session logic removed; implementation is limited to FR-001 through FR-004.
- CR-003 (Medium): Missing test coverage for form submission path and missing FR traceability. **Remediated.** Tests updated to 6 tests with explicit FR-001 through FR-004 traceability and form-encoded submission coverage.

### Re-review Findings

F-001 Low: The unrelated `src/index.js` Express scaffold and placeholder test remain in the repository. They are not part of the login architecture and do not affect correctness or security of the login implementation.

F-002 Resolved: The `escapeHtml` helper function was dead code (never called) and has been removed from `server.js`. `loginPage()` renders static HTML with no user-controlled content, so no runtime escaping is required. The removal is correct and reduces code surface area.

F-003 Informational: A `Dockerfile` has been added to the repository using `node:20-alpine`, exposing port 3000, with `npm start` as the container entry point. This is consistent with the approved baseline. TLS termination, secrets injection, and orchestration configuration are outside the approved scope and are not addressed by this Dockerfile.

## Overall Result

APPROVED
