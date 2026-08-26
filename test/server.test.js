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

function form(email, password) {
  return new URLSearchParams({ email, password });
}

test('renders the login form', async (t) => {
  const running = await runningServer();
  t.after(() => running.server.close());
  const response = await request(running.baseUrl, '/');
  const body = await response.text();
  assert.equal(response.status, 200);
  assert.match(body, /<form method="post" action="\/login">/);
  assert.match(body, /name="email"/);
  assert.match(body, /name="password"/);
  assert.match(body, /<button type="submit">Log in<\/button>/);
});

test('logs in with valid credentials and protects the account page', async (t) => {
  const running = await runningServer();
  t.after(() => running.server.close());
  const login = await request(running.baseUrl, '/login', { method: 'POST', body: form('user@example.com', 'correct-password') });
  const cookie = login.headers.get('set-cookie').split(';', 1)[0];
  const account = await request(running.baseUrl, '/account', { headers: { cookie } });
  assert.equal(login.status, 303);
  assert.equal(login.headers.get('location'), '/account');
  assert.equal(account.status, 200);
  assert.match(await account.text(), /Signed in as user@example.com/);
});

test('rejects invalid credentials with a generic error', async (t) => {
  const running = await runningServer();
  t.after(() => running.server.close());
  const password = 'wrong-password';
  const response = await request(running.baseUrl, '/login', { method: 'POST', body: form('user@example.com', password) });
  const body = await response.text();
  assert.equal(response.status, 401);
  assert.match(body, /Invalid email or password/);
  assert.match(body, /name="email" type="email" value="user@example\.com"/);
  assert.doesNotMatch(body, new RegExp(`type="password"[^>]*value="${password}"`));
  assert.doesNotMatch(body, new RegExp(password));
});

test('rejects missing fields and malformed email addresses', async (t) => {
  const running = await runningServer();
  t.after(() => running.server.close());
  const missing = await request(running.baseUrl, '/login', { method: 'POST', body: form('', '') });
  const malformed = await request(running.baseUrl, '/login', { method: 'POST', body: form('not-an-email', 'anything') });
  assert.equal(missing.status, 400);
  assert.equal(malformed.status, 400);
  assert.match(await malformed.text(), /Enter a valid email and password/);
});

test('redirects unauthenticated users and invalidates sessions on logout', async (t) => {
  const running = await runningServer();
  t.after(() => running.server.close());
  const initial = await request(running.baseUrl, '/account');
  const login = await request(running.baseUrl, '/login', { method: 'POST', body: form('user@example.com', 'correct-password') });
  const cookie = login.headers.get('set-cookie').split(';', 1)[0];
  const logout = await request(running.baseUrl, '/logout', { method: 'POST', headers: { cookie } });
  const afterLogout = await request(running.baseUrl, '/account', { headers: { cookie } });
  assert.equal(initial.status, 303);
  assert.equal(logout.status, 303);
  assert.equal(afterLogout.status, 303);
  assert.equal(afterLogout.headers.get('location'), '/');
});

test('treats malformed session cookies as unauthenticated', async (t) => {
  const running = await runningServer();
  t.after(() => running.server.close());
  const response = await request(running.baseUrl, '/account', { headers: { cookie: 'session=%E0%A4%A' } });
  assert.equal(response.status, 303);
  assert.equal(response.headers.get('location'), '/');
});

test('sets explicit session attributes and honors session expiry', async (t) => {
  const running = await runningServer({ sessionLifetimeMs: 25 });
  t.after(() => running.server.close());
  const login = await request(running.baseUrl, '/login', { method: 'POST', body: form('user@example.com', 'correct-password') });
  const cookieHeader = login.headers.get('set-cookie');
  const cookie = cookieHeader.split(';', 1)[0];
  assert.match(cookieHeader, /HttpOnly/);
  assert.match(cookieHeader, /SameSite=Lax/);
  assert.match(cookieHeader, /Path=\//);
  assert.match(cookieHeader, /Max-Age=1/);
  assert.doesNotMatch(cookieHeader, /Secure/);
  await new Promise((resolve) => setTimeout(resolve, 40));
  const expired = await request(running.baseUrl, '/account', { headers: { cookie } });
  assert.equal(expired.status, 303);
});

test('adds Secure only when explicitly enabled', async (t) => {
  const running = await runningServer({ secureCookies: true });
  t.after(() => running.server.close());
  const login = await request(running.baseUrl, '/login', { method: 'POST', body: form('user@example.com', 'correct-password') });
  assert.match(login.headers.get('set-cookie'), /Secure/);
});

test('rejects unsupported login methods and content types', async (t) => {
  const running = await runningServer();
  t.after(() => running.server.close());
  const getLogin = await request(running.baseUrl, '/login');
  const jsonLogin = await request(running.baseUrl, '/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: 'user@example.com', password: 'correct-password' })
  });
  assert.equal(getLogin.status, 405);
  assert.equal(getLogin.headers.get('allow'), 'POST');
  assert.equal(jsonLogin.status, 415);
});

test('rejects oversized login bodies with a controlled response', async (t) => {
  const running = await runningServer();
  t.after(() => running.server.close());
  const response = await request(running.baseUrl, '/login', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: `email=user%40example.com&password=${'x'.repeat(10_000)}`
  });
  assert.equal(response.status, 413);
});