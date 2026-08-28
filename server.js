const http = require('node:http');

const MAX_BODY_SIZE = 10_000;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function readBody(request) {
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
      if (!settled) resolve(body);
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

function loginPage() {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Log in</title></head>
<body><main><h1>Log in</h1>
<form method="post" action="/login">
<label for="email">Email</label><input id="email" name="email" type="email" required>
<label for="password">Password</label><input id="password" name="password" type="password" required>
<button type="submit">Log in</button></form></main></body></html>`;
}

function sendHtml(response, statusCode, body) {
  response.writeHead(statusCode, { 'Content-Type': 'text/html; charset=utf-8' });
  response.end(body);
}

function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(body));
}

function createLoginServer(options = {}) {
  const credentials = options.credentials || {
    email: process.env.LOGIN_EMAIL,
    password: process.env.LOGIN_PASSWORD
  };
  if (!credentials.email || !credentials.password) {
    throw new Error('LOGIN_EMAIL and LOGIN_PASSWORD must be set');
  }

  const validator = options.credentialValidator || createCredentialValidator(credentials);

  const server = http.createServer(async (request, response) => {
    const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);

    if (request.method === 'GET' && url.pathname === '/') {
      return sendHtml(response, 200, loginPage());
    }

    if (request.method === 'POST' && url.pathname === '/login') {
      const contentType = (request.headers['content-type'] || '').split(';', 1)[0].trim().toLowerCase();

      if (contentType !== 'application/x-www-form-urlencoded' && contentType !== 'application/json') {
        return sendJson(response, 415, { error: 'Invalid email or password' });
      }

      if (Number(request.headers['content-length']) > MAX_BODY_SIZE) {
        return sendJson(response, 413, { error: 'Invalid email or password' });
      }

      let email, password;
      try {
        const rawBody = await readBody(request);
        if (contentType === 'application/json') {
          let parsed;
          try {
            parsed = JSON.parse(rawBody);
          } catch {
            return sendJson(response, 400, { error: 'Invalid email or password' });
          }
          email = (typeof parsed?.email === 'string' ? parsed.email : '').trim();
          password = typeof parsed?.password === 'string' ? parsed.password : '';
        } else {
          const form = new URLSearchParams(rawBody);
          email = (form.get('email') || '').trim();
          password = form.get('password') || '';
        }
      } catch (error) {
        return sendJson(response, error.code === 'BODY_TOO_LARGE' ? 413 : 400, { error: 'Invalid email or password' });
      }

      if (!email || !password || !emailPattern.test(email)) {
        return sendJson(response, 400, { error: 'Invalid email or password' });
      }

      if (!await validator.validate({ email, password })) {
        return sendJson(response, 401, { error: 'Invalid email or password' });
      }

      return sendJson(response, 200, { message: 'Login successful' });
    }

    sendHtml(response, 404, 'Not Found');
  });

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
