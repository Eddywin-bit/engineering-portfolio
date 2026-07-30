/**
 * GitHub OAuth — step 1 of 2.
 *
 * Decap CMS opens this in a popup. We bounce the browser to GitHub's
 * consent screen and remember a random `state` in a short-lived cookie
 * so /api/callback can prove the response came back from the same flow.
 *
 * Vercel does not provide Decap's Git Gateway, so this pair of functions
 * IS the OAuth provider. No Netlify site or Cloudflare Worker needed.
 *
 * Required environment variables (Vercel → Settings → Environment Variables):
 *   GITHUB_OAUTH_CLIENT_ID
 *   GITHUB_OAUTH_CLIENT_SECRET
 *   ALLOWED_GITHUB_LOGIN      (optional but recommended, e.g. Eddywin-bit)
 */

const crypto = require('crypto');

module.exports = function handler(req, res) {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;

  if (!clientId) {
    res.status(500).send(
      'GITHUB_OAUTH_CLIENT_ID is not set on this deployment. ' +
        'Add it in Vercel → Settings → Environment Variables, then redeploy.'
    );
    return;
  }

  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const origin = `${proto}://${host}`;

  const state = crypto.randomBytes(16).toString('hex');

  // Host-only, HttpOnly, 10 minute lifetime. Lax is required: GitHub
  // redirects back with a top-level GET, which Lax still sends.
  res.setHeader(
    'Set-Cookie',
    `decap_oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`
  );

  const authUrl =
    'https://github.com/login/oauth/authorize' +
    `?client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(origin + '/api/callback')}` +
    `&scope=${encodeURIComponent('repo,user:email')}` +
    `&state=${encodeURIComponent(state)}`;

  res.writeHead(302, { Location: authUrl });
  res.end();
};
