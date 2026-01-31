import { Router, Request, Response } from 'express';

const router = Router();

const IPA_FILENAME = process.env.IPA_FILENAME || 'SherpaMoMo.ipa';
const BUNDLE_ID = process.env.BUNDLE_ID || 'app.vercel.sherpamomo';
const APP_TITLE = process.env.APP_TITLE || 'Sherpa MoMo';
const BUNDLE_VERSION = process.env.BUNDLE_VERSION || '1.0.0';

const OTA_BASE = '/ipainstall';

function getManifestUrl(req: Request): string {
  const protocol = req.get('x-forwarded-proto') || req.protocol || 'http';
  const host = req.get('host');
  return `${protocol}://${host}${OTA_BASE}/manifest.plist`;
}

function getBaseUrl(req: Request): string {
  const protocol = req.get('x-forwarded-proto') || req.protocol || 'http';
  const host = req.get('host');
  return `${protocol}://${host}${OTA_BASE}`;
}

// Install page at GET /ipainstall
router.get('/', (req: Request, res: Response) => {
  const manifestUrl = getManifestUrl(req);

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <meta name="theme-color" content="#f5f5f7">
    <title>Install ${APP_TITLE}</title>
    <style>
      *, *::before, *::after { box-sizing: border-box; }
      :root {
        --bg: #f5f5f7;
        --card: #ffffff;
        --text: #1d1d1f;
        --text-secondary: #6e6e73;
        --primary: #1d1d1f;
        --accent: #d4af37;
        --accent-hover: #c4a02e;
        --radius: 14px;
        --shadow: 0 4px 24px rgba(0,0,0,0.06);
        --font: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", sans-serif;
      }
      @media (prefers-color-scheme: dark) {
        :root {
          --bg: #000000;
          --card: #1c1c1e;
          --text: #f5f5f7;
          --text-secondary: #98989d;
          --primary: #f5f5f7;
          --shadow: 0 4px 24px rgba(0,0,0,0.4);
        }
      }
      html { -webkit-text-size-adjust: 100%; }
      body {
        margin: 0;
        min-height: 100vh;
        font-family: var(--font);
        font-size: 17px;
        line-height: 1.47;
        font-weight: 400;
        color: var(--text);
        background: var(--bg);
        -webkit-font-smoothing: antialiased;
        padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
        padding-top: max(40px, env(safe-area-inset-top));
        padding-bottom: max(40px, env(safe-area-inset-bottom));
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
      }
      .container { max-width: 400px; width: 100%; padding: 0 24px; }
      .card {
        background: var(--card);
        border-radius: var(--radius);
        box-shadow: var(--shadow);
        padding: 32px 28px;
        margin-bottom: 24px;
      }
      h1 {
        margin: 0 0 8px;
        font-size: 28px;
        font-weight: 600;
        letter-spacing: -0.02em;
        color: var(--text);
      }
      .subtitle {
        margin: 0 0 28px;
        font-size: 15px;
        color: var(--text-secondary);
        font-weight: 400;
      }
      .install-link {
        display: inline-block;
        text-decoration: none;
        -webkit-tap-highlight-color: transparent;
      }
      .install-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        min-height: 52px;
        padding: 14px 28px;
        font-family: var(--font);
        font-size: 17px;
        font-weight: 600;
        color: #ffffff;
        background: #000000;
        border: none;
        border-radius: 12px;
        cursor: pointer;
        transition: background 0.2s ease, transform 0.1s ease;
        -webkit-tap-highlight-color: transparent;
      }
      .install-btn:hover { background: #1d1d1f; }
      .install-btn:active { transform: scale(0.98); }
      .footnote {
        margin: 0;
        font-size: 13px;
        color: var(--text-secondary);
        line-height: 1.4;
      }
      .icon {
        width: 64px;
        height: 64px;
        margin: 0 auto 20px;
        border-radius: 16px;
        overflow: hidden;
        display: block;
      }
      .icon img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="card">
        <div class="icon" aria-hidden="true">
          <img src="https://expo.dev/_next/image?url=https%3A%2F%2Fexpo.dev%2Fcdn-cgi%2Fimage%2Fwidth%3D512%2Fhttps%3A%2F%2Fstorage.googleapis.com%2Fprofile-image-storage-production%2Fbb142a8a-8821-4988-9e65-b6322a67481d.png&w=1080&q=75" alt="" width="64" height="64">
        </div>
        <h1>Install ${APP_TITLE}</h1>
        <p class="subtitle">Open this page in Safari on your iPhone, then tap below to add the app to your home screen.</p>
        <a href="itms-services://?action=download-manifest&url=${encodeURIComponent(manifestUrl)}" class="install-link">
          <button type="button" class="install-btn">Install App</button>
        </a>
      </div>
      <p class="footnote">The app will appear on your home screen after installation. You may need to trust the developer in Settings → General → VPN &amp; Device Management.</p>
    </div>
  </body>
</html>`;

  res.set('Content-Type', 'text/html');
  res.send(html);
});

// Manifest at GET /ipainstall/manifest.plist
router.get('/manifest.plist', (req: Request, res: Response) => {
  const baseUrl = getBaseUrl(req);
  const ipaUrl = `${baseUrl}/public/${IPA_FILENAME}`;

  const plist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>items</key>
  <array>
    <dict>
      <key>assets</key>
      <array>
        <dict>
          <key>kind</key>
          <string>software-package</string>
          <key>url</key>
          <string>${ipaUrl}</string>
        </dict>
      </array>
      <key>metadata</key>
      <dict>
        <key>bundle-identifier</key>
        <string>${BUNDLE_ID}</string>
        <key>bundle-version</key>
        <string>${BUNDLE_VERSION}</string>
        <key>kind</key>
        <string>software</string>
        <key>title</key>
        <string>${APP_TITLE}</string>
      </dict>
    </dict>
  </array>
</dict>
</plist>`;

  res.set({
    'Content-Type': 'application/xml',
    'Content-Disposition': 'inline',
    'Cache-Control': 'public, max-age=3600'
  });
  res.send(plist);
});

export default router;
