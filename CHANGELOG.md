# Changelog

All notable changes to this project are documented in this file.

---

## [Unreleased] — 2026-08-28

### Documentation Sync

SDLC documentation synchronized to reflect implementation changes since the previous documentation review. All six SDLC artifacts updated where stale content was found.

---

## Implementation Changes (post initial code review)

### M-001 — Removed dead code: `escapeHtml`

- **File:** `server.js`
- **Change:** Removed the `escapeHtml` helper function, which was never called anywhere in the codebase.
- **Impact:** None on runtime behavior. `loginPage()` renders static HTML with no user-controlled content; no escaping is required. Reduces code surface area.
- **Traceability:** CLAUDE.md code quality guidance ("Avoid dead code").

### M-002 — Expanded test suite from 6 to 23 login-specific tests

- **File:** `test/server.test.js`
- **Change:** Added 17 new login tests covering JSON edge cases, form-encoded edge cases, protocol and routing behavior, server construction validation, and content-type negotiation. Total is now 23 login tests plus 1 unrelated placeholder (24 via `npm test`).
- **New test areas:**
  - JSON: missing password, missing email, malformed body, invalid email format, whitespace-only email, whitespace-only password, wrong email, charset parameter in Content-Type.
  - Form-encoded: wrong password, missing email, missing password, invalid email format.
  - Protocol/routing: unsupported content type (415), oversized body (413), unknown route (404), wrong method PUT (404).
  - Server construction: throws when credentials are absent.
  - GET / smoke test: Content-Type is text/html.
- **Traceability:** IP-003 (add focused regression coverage for existing login behavior).

### M-003 — Added Dockerfile for containerized deployment

- **File:** `Dockerfile` (new)
- **Change:** Added a `Dockerfile` based on `node:20-alpine`. Sets working directory to `/app`, copies `package*.json` and `server.js`, sets `NODE_ENV=production`, exposes port 3000, and runs `npm start` as the container entry point.
- **Impact:** Enables deployment as a Docker container. TLS termination, secrets injection via environment variables, and orchestration remain the caller's responsibility.
- **Traceability:** Consistent with approved Node.js baseline; no new application behavior.

---

## Documentation Changes — 2026-08-28

### architecture.md

- **Section 5 (Technology Choices):** Added `Containerization` row documenting the `node:20-alpine`-based `Dockerfile`, working directory, exposed port, and entry point.
- **Section 7 (Security):** Removed stale "HTML escaping" entry from the list of evidenced controls. Replaced with an accurate statement that `loginPage()` is static HTML requiring no runtime escaping, and that `escapeHtml` was dead code that has been removed.

### design-review.md

- **Summary:** Updated test count from 6 to 23 login tests (24 total).
- **Findings:** Added three post-sync observations: `escapeHtml` removal (F-002 Resolved), Dockerfile addition (F-003 Informational), and expanded test suite.

### impl-plan.md

- **Section 1 (Overview):** Updated stale test count from "11 tests" to reflect the current 23 login tests (24 total).
- **Section 4 (Testing Strategy):** Added a sentence noting the suite now contains 23 login tests and listing the covered areas.

### code-review.md

- **Summary:** Updated test count from 6 to 23 login tests (24 total).
- **Test Coverage:** Expanded from a flat 6-item list to a grouped breakdown by area covering all 23 login tests.
- **Code Quality:** Added note about `escapeHtml` removal.
- **Re-review Findings:** Added F-002 (escapeHtml dead code removal, Resolved) and F-003 (Dockerfile addition, Informational).

### verification-report.md

- **Summary:** Updated test count from 6 to 23 login tests (24 total).
- **Unit Test Results:** Expanded test breakdown to list all 23 login tests grouped by area.
- **Integration Test Results:** Updated to note the expanded loopback coverage.
- **Edge Cases:** Expanded from 4 to 18 verified edge case entries.
- **Security Verification:** Removed stale "HTML escaping in `loginPage()`" statement; replaced with accurate description of the static-HTML XSS mitigation and noted the `escapeHtml` dead-code removal.
- **Failed Checks:** Updated count from 6 to 23.
- **Known Limitations:** Added note about Dockerfile scope.

### CHANGELOG.md

- Created this file to record all implementation and documentation changes.

---

## Code Review Remediations (prior cycle, for traceability)

### CR-001 (High) — Remediated

POST /login returned HTTP 303 redirect instead of the approved JSON response contract. Remediated: POST /login now returns HTTP 200 with `{ "message": "Login successful" }` for valid credentials and HTTP 401 with `{ "error": "Invalid email or password" }` for invalid credentials.

### CR-002 (Medium) — Remediated

Out-of-scope logic (session management, /account handler, /logout handler) was present in an earlier implementation. Remediated: out-of-scope routes and session logic removed; implementation is limited to FR-001 through FR-004.

### CR-003 (Medium) — Remediated

Missing test coverage for form submission path and missing FR traceability. Remediated: tests were initially updated to 6 tests with explicit FR-001 through FR-004 traceability and form-encoded submission coverage. Subsequently expanded to 23 login tests (M-002).

---

## Notes

- All test counts above refer to tests in `test/server.test.js` unless otherwise noted. The unrelated placeholder in `src/tests/app.test.js` is excluded from login test counts.
- Requirements in `requirements.md` are unchanged; no new functional requirements have been added.
- `requirements.md` open questions (validation rules, error message policy, session behavior, production security) remain `Not Found` and are not in scope.
