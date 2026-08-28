# Local Demo Limitations

This login server is a dependency-free local demonstration. It uses credentials
provided through `LOGIN_EMAIL` and `LOGIN_PASSWORD` (or test-only options) and
keeps sessions in process memory. It is not a production authentication
provider, credential store, or durable session service.

The default server uses `http://localhost` so it cannot set a `Secure` cookie
without making the local demo unusable. Pass `secureCookies: true` when the
server is placed behind HTTPS. HTTPS termination, external authentication,
durable persistence, MFA, and recovery flows are outside this demo's scope.