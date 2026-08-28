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

// JSON — missing password field
test('POST /login JSON missing password field returns 400', async (t) => {
  const running = await runningServer();
  t.after(() => running.server.close());
  const response = await request(running.baseUrl, '/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'user@example.com' })
  });
  const body = await response.json();
  assert.equal(response.status, 400);
  assert.equal(body.error, 'Invalid email or password');
});

// JSON — missing email field
test('POST /login JSON missing email field returns 400', async (t) => {
  const running = await runningServer();
  t.after(() => running.server.close());
  const response = await request(running.baseUrl, '/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: 'correct-password' })
  });
  const body = await response.json();
  assert.equal(response.status, 400);
  assert.equal(body.error, 'Invalid email or password');
});

// JSON — malformed body
test('POST /login JSON malformed body returns 400', async (t) => {
  const running = await runningServer();
  t.after(() => running.server.close());
  const response = await request(running.baseUrl, '/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: 'not-valid-json'
  });
  const body = await response.json();
  assert.equal(response.status, 400);
  assert.equal(body.error, 'Invalid email or password');
});

// JSON — invalid email format (fails regex)
test('POST /login JSON invalid email format returns 400', async (t) => {
  const running = await runningServer();
  t.after(() => running.server.close());
  const response = await request(running.baseUrl, '/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'not-an-email', password: 'correct-password' })
  });
  const body = await response.json();
  assert.equal(response.status, 400);
  assert.equal(body.error, 'Invalid email or password');
});

// JSON — whitespace-only email trimmed to empty
test('POST /login JSON whitespace-only email returns 400', async (t) => {
  const running = await runningServer();
  t.after(() => running.server.close());
  const response = await request(running.baseUrl, '/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: '   ', password: 'correct-password' })
  });
  const body = await response.json();
  assert.equal(response.status, 400);
  assert.equal(body.error, 'Invalid email or password');
});

// JSON — whitespace-only password: server does not trim passwords, so it reaches
// credential validation and returns 401 (wrong credentials)
test('POST /login JSON whitespace-only password returns 401', async (t) => {
  const running = await runningServer();
  t.after(() => running.server.close());
  const response = await request(running.baseUrl, '/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'user@example.com', password: '   ' })
  });
  const body = await response.json();
  assert.equal(response.status, 401);
  assert.equal(body.error, 'Invalid email or password');
});

// JSON — wrong email returns 401
test('POST /login JSON wrong email returns 401', async (t) => {
  const running = await runningServer();
  t.after(() => running.server.close());
  const response = await request(running.baseUrl, '/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'other@example.com', password: 'correct-password' })
  });
  const body = await response.json();
  assert.equal(response.status, 401);
  assert.equal(body.error, 'Invalid email or password');
});

// JSON — unsupported content type returns 415
test('POST /login unsupported content type returns 415', async (t) => {
  const running = await runningServer();
  t.after(() => running.server.close());
  const response = await request(running.baseUrl, '/login', {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: 'email=user@example.com&password=correct-password'
  });
  const body = await response.json();
  assert.equal(response.status, 415);
  assert.equal(body.error, 'Invalid email or password');
});

// Body stream exceeds 10000 bytes returns 413
test('POST /login rejects when streamed body exceeds 10000 bytes', async (t) => {
  const running = await runningServer();
  t.after(() => running.server.close());
  const largeBody = JSON.stringify({ email: 'user@example.com', password: 'x'.repeat(10000) });
  const response = await request(running.baseUrl, '/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: largeBody
  });
  const body = await response.json();
  assert.equal(response.status, 413);
  assert.equal(body.error, 'Invalid email or password');
});

// Form-encoded — wrong password returns 401
test('POST /login form-encoded wrong password returns 401', async (t) => {
  const running = await runningServer();
  t.after(() => running.server.close());
  const response = await request(running.baseUrl, '/login', {
    method: 'POST',
    body: new URLSearchParams({ email: 'user@example.com', password: 'wrong-password' })
  });
  const body = await response.json();
  assert.equal(response.status, 401);
  assert.equal(body.error, 'Invalid email or password');
});

// Form-encoded — missing email returns 400
test('POST /login form-encoded missing email returns 400', async (t) => {
  const running = await runningServer();
  t.after(() => running.server.close());
  const response = await request(running.baseUrl, '/login', {
    method: 'POST',
    body: new URLSearchParams({ password: 'correct-password' })
  });
  const body = await response.json();
  assert.equal(response.status, 400);
  assert.equal(body.error, 'Invalid email or password');
});

// Form-encoded — missing password returns 400
test('POST /login form-encoded missing password returns 400', async (t) => {
  const running = await runningServer();
  t.after(() => running.server.close());
  const response = await request(running.baseUrl, '/login', {
    method: 'POST',
    body: new URLSearchParams({ email: 'user@example.com' })
  });
  const body = await response.json();
  assert.equal(response.status, 400);
  assert.equal(body.error, 'Invalid email or password');
});

// Form-encoded — invalid email format returns 400
test('POST /login form-encoded invalid email format returns 400', async (t) => {
  const running = await runningServer();
  t.after(() => running.server.close());
  const response = await request(running.baseUrl, '/login', {
    method: 'POST',
    body: new URLSearchParams({ email: 'not-an-email', password: 'correct-password' })
  });
  const body = await response.json();
  assert.equal(response.status, 400);
  assert.equal(body.error, 'Invalid email or password');
});

// Routing — unknown route returns 404
test('GET /unknown route returns 404', async (t) => {
  const running = await runningServer();
  t.after(() => running.server.close());
  const response = await request(running.baseUrl, '/nonexistent');
  assert.equal(response.status, 404);
  assert.match(response.headers.get('content-type'), /text\/html/);
});

// Routing — wrong method returns 404
test('PUT /login returns 404', async (t) => {
  const running = await runningServer();
  t.after(() => running.server.close());
  const response = await request(running.baseUrl, '/login', { method: 'PUT' });
  assert.equal(response.status, 404);
});

// Server construction — missing credentials throws
test('createLoginServer throws when credentials are not provided', () => {
  const originalEmail = process.env.LOGIN_EMAIL;
  const originalPassword = process.env.LOGIN_PASSWORD;
  delete process.env.LOGIN_EMAIL;
  delete process.env.LOGIN_PASSWORD;
  try {
    assert.throws(
      () => createLoginServer(),
      { message: 'LOGIN_EMAIL and LOGIN_PASSWORD must be set' }
    );
  } finally {
    if (originalEmail !== undefined) process.env.LOGIN_EMAIL = originalEmail;
    if (originalPassword !== undefined) process.env.LOGIN_PASSWORD = originalPassword;
  }
});

// Content-Type with charset parameter is accepted
test('POST /login accepts application/json with charset parameter', async (t) => {
  const running = await runningServer();
  t.after(() => running.server.close());
  const response = await request(running.baseUrl, '/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ email: 'user@example.com', password: 'correct-password' })
  });
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.message, 'Login successful');
});

// GET / Content-Type is text/html
test('GET / response Content-Type is text/html', async (t) => {
  const running = await runningServer();
  t.after(() => running.server.close());
  const response = await request(running.baseUrl, '/');
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /text\/html/);
});
