const http = require('node:http');
const crypto = require('node:crypto');

const SESSION_COOKIE = 'session';
const MAX_BODY_SIZE = 10_000;
const DEFAULT_SESSION_LIFETIME_MS = 15 * 60 * 1000;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function parseCookies(request) {
  const cookies = {};
  for (const part of (request.headers.cookie || '').split(';').filter(Boolean)) {
    const separator = part.indexOf('=');
    if (separator < 0) continue;
    const name = part.slice(0, separator).trim();
    try {
      cookies[name] = decodeURIComponent(part.slice(separator + 1).trim());
    } catch {
      // A malformed cookie is treated as absent.
    }
  }
  return cookies;
}

function readForm(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    let settled = false;
    request.setEncoding('utf8');
    request.on('data', (chunk) => {
      if (settled) return;
      body += chunk;
      if (body.length > MAX_BODY_SIZE) {
        settled = true;
        request.resume();
        const error = new Error('Request body too large');
        error.code = 'BODY_TOO_LARGE';
        reject(error);
      }
    });
    request.on('end', () => {
      if (!settled) resolve(new URLSearchParams(body));
    });
    request.on('error', (error) => {
      if (!settled) reject(error);
    });
  });
}

function createCredentialValidator(credentials) {
  return {
    async validate({ email, password }) {
      return email === credentials.email && password === credentials.password;
    }
  };
}

function loginPage(message = '', email = '') {
  const error = message ? `<p role="alert">${escapeHtml(message)}</p>` : '';
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Log in</title></head>
<body><main><h1>Log in</h1>${error}
<form method="post" action="/login">
<label for="email">Email</label><input id="email" name="email" type="email" value="${escapeHtml(email)}" required>
<label for="password">Password</label><input id="password" name="password" type="password" required>
<button type="submit">Log in</button></form></main></body></html>`;
}

function sendHtml(response, statusCode, body, headers = {}) {
  response.writeHead(statusCode, { 'Content-Type': 'text/html; charset=utf-8', ...headers });
  response.end(body);
}

function redirect(response, location, headers = {}) {
  response.writeHead(303, { Location: location, ...headers });
  response.end();
}

function createLoginServer(options = {}) {
  const credentials = options.credentials || {
    email: process.env.LOGIN_EMAIL,
    password: process.env.LOGIN_PASSWORD
  };
  if (!credentials.email || !credentials.password) {
    throw new Error('LOGIN_EMAIL and LOGIN_PASSWORD must be set');
  }

  const sessionLifetimeMs = options.sessionLifetimeMs || DEFAULT_SESSION_LIFETIME_MS;
  const secureCookies = options.secureCookies === true;
  const validator = options.credentialValidator || createCredentialValidator(credentials);
  const sessions = new Map();

  function cleanupExpiredSessions(now = Date.now()) {
    for (const [sessionId, session] of sessions) {
      if (session.expiresAt <= now) sessions.delete(sessionId);
    }
  }

  function sessionCookie(value, maxAgeSeconds = Math.max(1, Math.floor(sessionLifetimeMs / 1000))) {
    const attributes = [
      `${SESSION_COOKIE}=${encodeURIComponent(value)}`,
      'HttpOnly',
      'SameSite=Lax',
      'Path=/',
      `Max-Age=${maxAgeSeconds}`
    ];
    if (secureCookies) attributes.push('Secure');
    return attributes.join('; ');
  }

  const cleanupTimer = setInterval(cleanupExpiredSessions, sessionLifetimeMs);
  cleanupTimer.unref();
  const server = http.createServer(async (request, response) => {
    cleanupExpiredSessions();
    const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
    const cookies = parseCookies(request);
    const storedSession = cookies[SESSION_COOKIE] && sessions.get(cookies[SESSION_COOKIE]);
    const session = storedSession && storedSession.expiresAt > Date.now() ? storedSession : undefined;
    if (storedSession && !session) sessions.delete(cookies[SESSION_COOKIE]);

    if (url.pathname === '/login' && request.method !== 'POST') {
      response.setHeader('Allow', 'POST');
      return sendHtml(response, 405, 'Method Not Allowed');
    }

    if (url.pathname === '/logout' && request.method !== 'POST') {
      response.setHeader('Allow', 'POST');
      return sendHtml(response, 405, 'Method Not Allowed');
    }

    if (request.method === 'GET' && url.pathname === '/') {
      return session ? redirect(response, '/account') : sendHtml(response, 200, loginPage());
    }

    if (request.method === 'POST' && url.pathname === '/login') {
      const contentType = (request.headers['content-type'] || '').split(';', 1)[0].trim().toLowerCase();
      if (contentType !== 'application/x-www-form-urlencoded') {
        return sendHtml(response, 415, 'Unsupported Media Type');
      }
      if (Number(request.headers['content-length']) > MAX_BODY_SIZE) {
        return sendHtml(response, 413, 'Request Entity Too Large');
      }
      let form;
      try {
        form = await readForm(request);
      } catch (error) {
        return sendHtml(response, error.code === 'BODY_TOO_LARGE' ? 413 : 400, loginPage('Invalid request.'));
      }
      const email = form.get('email')?.trim() || '';
      const password = form.get('password') || '';
      if (!email || !password || !emailPattern.test(email)) {
        return sendHtml(response, 400, loginPage('Enter a valid email and password.', email));
      }
      if (!await validator.validate({ email, password })) {
        return sendHtml(response, 401, loginPage('Invalid email or password.', email));
      }
      const sessionId = crypto.randomUUID();
      sessions.set(sessionId, { email, expiresAt: Date.now() + sessionLifetimeMs });
      return redirect(response, '/account', {
        'Set-Cookie': sessionCookie(sessionId)
      });
    }

    if (request.method === 'GET' && url.pathname === '/account') {
      return session
        ? sendHtml(response, 200, `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Account</title></head><body><main><h1>Account</h1><p>Signed in as ${escapeHtml(session.email)}</p><form method="post" action="/logout"><button type="submit">Log out</button></form></main></body></html>`)
        : redirect(response, '/');
    }

    if (request.method === 'POST' && url.pathname === '/logout') {
      if (cookies[SESSION_COOKIE]) sessions.delete(cookies[SESSION_COOKIE]);
      return redirect(response, '/', {
        'Set-Cookie': sessionCookie('', 0)
      });
    }

    sendHtml(response, 404, 'Not Found');
  });

  server.on('close', () => clearInterval(cleanupTimer));
  return server;
}

if (require.main === module) {
  const port = Number(process.env.PORT || 3000);
  let server;
  try {
    server = createLoginServer();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
  server.listen(port, () => console.log(`Login server listening on http://localhost:${port}`));
}

module.exports = { createLoginServer, createCredentialValidator, loginPage };