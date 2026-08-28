const assert = require('node:assert/strict');
const test = require('node:test');
const { createLoginServer } = require('../server');

async function runningServer(options = {}) {
  const server = createLoginServer({
    credentials: { email: 'user@example.com', password: 'correct-password' },
    ...options
  });
  await new Promise((resolve) => server.listen(0, resolve));
  const address = server.address();
  return { server, baseUrl: `http://127.0.0.1:${address.port}` };
}

async function request(baseUrl, path, options = {}) {
  return fetch(`${baseUrl}${path}`, { redirect: 'manual', ...options });
}

// FR-001: credential field consumption
test('FR-001 — login form renders email and password credential fields', async (t) => {
  const running = await runningServer();
  t.after(() => running.server.close());
  const response = await request(running.baseUrl, '/');
  const body = await response.text();
  assert.equal(response.status, 200);
  assert.match(body, /name="email"/);
  assert.match(body, /name="password"/);
});

// FR-002: submission to POST /login
test('FR-002 — login form provides a POST /login submission action with Login button', async (t) => {
  const running = await runningServer();
  t.after(() => running.server.close());
  const response = await request(running.baseUrl, '/');
  const body = await response.text();
  assert.equal(response.status, 200);
  assert.match(body, /<form method="post" action="\/login">/);
  assert.match(body, /<button type="submit">Log in<\/button>/);
});

// FR-003: valid-credential success contract
test('FR-003 — valid credentials return HTTP 200 with login successful message', async (t) => {
  const running = await runningServer();
  t.after(() => running.server.close());
  const response = await request(running.baseUrl, '/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'user@example.com', password: 'correct-password' })
  });
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.message, 'Login successful');
});

// FR-004: invalid-credential error contract
test('FR-004 — invalid credentials return HTTP 401 with error message', async (t) => {
  const running = await runningServer();
  t.after(() => running.server.close());
  const response = await request(running.baseUrl, '/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'user@example.com', password: 'wrong-password' })
  });
  const body = await response.json();
  assert.equal(response.status, 401);
  assert.equal(body.error, 'Invalid email or password');
});

// Form-encoded submission path coverage
test('form-encoded submission path is accepted and returns HTTP 200 for valid credentials', async (t) => {
  const running = await runningServer();
  t.after(() => running.server.close());
  const formBody = new URLSearchParams({ email: 'user@example.com', password: 'correct-password' });
  const response = await request(running.baseUrl, '/login', {
    method: 'POST',
    body: formBody
  });
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.message, 'Login successful');
});

// Malformed and incomplete input handling coverage
test('malformed and incomplete input returns a controlled invalid-credentials response', async (t) => {
  const running = await runningServer();
  t.after(() => running.server.close());

  // Missing password field in JSON body
  const missingPassword = await request(running.baseUrl, '/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'user@example.com' })
  });
  assert.equal(missingPassword.status, 400);

  // Malformed JSON body
  const malformedJson = await request(running.baseUrl, '/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: 'not-valid-json'
  });
  assert.equal(malformedJson.status, 400);

  // Unsupported content type
  const unsupported = await request(running.baseUrl, '/login', {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: 'email=user@example.com&password=correct-password'
  });
  assert.equal(unsupported.status, 415);
});
