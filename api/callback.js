/**
 * GitHub OAuth — step 2 of 2.
 *
 * GitHub redirects here with ?code. We swap the code for an access token,
 * optionally check the GitHub login against ALLOWED_GITHUB_LOGIN, then hand
 * the token to the Decap CMS window using the postMessage handshake Decap
 * expects:
 *
 *   popup  -> opener : "authorizing:github"
 *   opener -> popup  : (any message, confirms the channel)
 *   popup  -> opener : "authorization:github:success:{...}"
 */

/** Renders the handshake page. `payload` is embedded as JSON. */
function handshakePage(status, payload) {
  const json = JSON.stringify(payload).replace(/</g, '\\u003c');
  return `<!doctype html>
<html>
  <head><meta charset="utf-8" /><title>Signing in…</title></head>
  <body style="background:#0a0a0a;color:#E0D4C5;font:14px/1.6 -apple-system,Segoe UI,sans-serif;display:grid;place-items:center;height:100vh;margin:0">
    <p>Completing sign in…</p>
    <script>
      (function () {
        var message = 'authorization:github:${status}:' + ${JSON.stringify(json)};
        function receive(e) {
          if (!e.origin) return;
          window.removeEventListener('message', receive, false);
          window.opener.postMessage(message, e.origin);
          window.setTimeout(function () { window.close(); }, 800);
        }
        if (!window.opener) {
          document.body.innerHTML = '<p>Open /admin and sign in from there.</p>';
          return;
        }
        window.addEventListener('message', receive, false);
        window.opener.postMessage('authorizing:github', '*');
      })();
    </script>
  </body>
</html>`;
}

function fail(res, message) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(handshakePage('error', { message }));
}

module.exports = async function handler(req, res) {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;
  const allowedLogin = process.env.ALLOWED_GITHUB_LOGIN;

  if (!clientId || !clientSecret) {
    return fail(res, 'OAuth app credentials are missing on the server.');
  }

  const url = new URL(req.url, 'https://placeholder.local');
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  if (!code) return fail(res, 'GitHub did not return an authorization code.');

  // CSRF: the state we set in /api/auth must come back unchanged.
  const cookies = String(req.headers.cookie || '')
    .split(';')
    .reduce((acc, part) => {
      const i = part.indexOf('=');
      if (i > -1) acc[part.slice(0, i).trim()] = part.slice(i + 1).trim();
      return acc;
    }, {});

  if (!state || !cookies.decap_oauth_state || state !== cookies.decap_oauth_state) {
    return fail(res, 'Login state mismatch. Close this window and try again.');
  }

  // Burn the state cookie.
  res.setHeader(
    'Set-Cookie',
    'decap_oauth_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0'
  );

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    });

    const data = await tokenRes.json();

    if (data.error || !data.access_token) {
      return fail(res, data.error_description || data.error || 'Token exchange failed.');
    }

    // Lock the panel to a single GitHub account.
    if (allowedLogin) {
      const userRes = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `token ${data.access_token}`,
          Accept: 'application/vnd.github+json',
          'User-Agent': 'edwingyasi-admin',
        },
      });
      const user = await userRes.json();

      if (!user || user.login !== allowedLogin) {
        return fail(
          res,
          `This admin panel is restricted. "${user && user.login ? user.login : 'unknown'}" is not authorised.`
        );
      }
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(
      handshakePage('success', { token: data.access_token, provider: 'github' })
    );
  } catch (err) {
    return fail(res, 'Unexpected error during sign in: ' + err.message);
  }
};
