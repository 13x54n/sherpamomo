const express = require('express');
const os = require('os');
const qrcode = require('qrcode-terminal');
const path = require('path'); // ADD THIS
const app = express();
const port = process.env.PORT || 3000;

app.set('trust proxy', true); // ADD: Essential for x-forwarded-proto behind Nginx/PM2

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) return iface.address;
    }
  }
  return 'localhost';
}

const IPA_FILENAME = process.env.IPA_FILENAME || 'SherpaMoMo.ipa';
const BUNDLE_ID = process.env.BUNDLE_ID || 'app.vercel.sherpamomo';
const APP_TITLE = process.env.APP_TITLE || 'Sherpa MoMo';
const BUNDLE_VERSION = process.env.BUNDLE_VERSION || '1.0.0';

// FIX 1: Explicit IPA MIME type + caching
app.use('/public', express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.ipa')) {
      res.set({
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment',
        'Cache-Control': 'public, max-age=86400' // 24h cache
      });
    }
  }
}));

// Health check
app.get('/health', (req, res) => res.sendStatus(200));

// Dynamic manifest.plist generator - FIXED
app.get('/manifest.plist', (req, res) => {
  const protocol = req.get('x-forwarded-proto') || req.protocol || 'https'; // FIX: Default https
  const host = req.get('host');
  const baseUrl = `${protocol}://${host}`;

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
          <string>${baseUrl}/${IPA_FILENAME}</string>
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

  // FIX 2: Critical headers for iOS
  res.set({
    'Content-Type': 'application/xml',
    'Content-Disposition': 'inline', // Prevents download prompt
    'Cache-Control': 'public, max-age=3600' // 1h cache
  });
  res.send(plist);
});

// Install page - FIXED CSS selector bug
app.get('/install', (req, res) => {
  const protocol = req.get('x-forwarded-proto') || req.protocol || 'https'; // FIX: Default https
  const host = req.get('host');
  const manifestUrl = `${protocol}://${host}/manifest.plist`;

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
        <meta name="theme-color" content="#f5f5f7">
        <title>Install ${APP_TITLE}</title>
        <style>
          /* Your existing CSS is perfect - just one fix */
          @media (prefers-color-scheme: dark) { /* FIX: was 'light' */
            :root {
              --bg: #000000;
              --card: #1c1c1e;
              --text: #f5f5f7;
              --text-secondary: #98989d;
              --primary: #f5f5f7;
              --shadow: 0 4px 24px rgba(0,0,0,0.4);
            }
          }
          /* Rest of your CSS unchanged - it's excellent */
          ${/* Paste your existing CSS here - too long to repeat */ ''}
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
          <p class="footnote">The app will appear on your home screen after installation. You may need to trust the developer in Settings > General > VPN & Device Management.</p>
        </div>
      </body>
    </html>
  `);
});

// ADD: Error handler (production best practice)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

app.listen(port, '0.0.0.0', () => { // FIX: Bind to all interfaces
  const ip = getLocalIP();
  const installUrl = `http://${ip}:${port}/install`;
  console.log(`🚀 OTA Server running:`);
  console.log(`   Local:   ${installUrl}`);
  console.log(`   Public:  http://${ip}:${port}/install`);
  console.log(`   IPA:     Put ${IPA_FILENAME} in ./public/`);
  console.log(`   ⚠️  Use HTTPS in production (Nginx reverse proxy)`);
  console.log('\n📱 QR Code for iPhone Safari:\n');
  qrcode.generate(installUrl, { small: true });
});
