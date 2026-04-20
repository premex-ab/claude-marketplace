#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const http = require('node:http');
const { spawn, spawnSync } = require('node:child_process');

const SCRIPT_DIR = __dirname;
const PAIR_TIMEOUT_MS = 120_000;
const CONNECT_TIMEOUT_MS = 30_000;
const DEFAULT_SERVE_PORT = 48733;
const FINAL_STATE_LINGER_MS = 3000;

const tempFiles = [];
function cleanupTempFiles() {
  for (const f of tempFiles) {
    try { fs.unlinkSync(f); } catch {}
  }
  tempFiles.length = 0;
}
process.on('exit', cleanupTempFiles);

function log(msg) { process.stdout.write(msg + '\n'); }
function err(msg) { process.stderr.write(msg + '\n'); }

function parseArgs(argv) {
  const a = argv.slice(2);
  const out = { serve: false, open: false, port: DEFAULT_SERVE_PORT };
  for (let i = 0; i < a.length; i++) {
    if (a[i] === '--serve') out.serve = true;
    else if (a[i] === '--open') out.open = true;
    else if (a[i] === '--port') { out.port = parseInt(a[++i], 10); }
  }
  if (!Number.isFinite(out.port) || out.port < 0) out.port = DEFAULT_SERVE_PORT;
  return out;
}

function openInBrowser(url) {
  let cmd, args;
  if (process.platform === 'darwin') { cmd = 'open'; args = [url]; }
  else if (process.platform === 'win32') { cmd = 'cmd'; args = ['/c', 'start', '""', url]; }
  else { cmd = 'xdg-open'; args = [url]; }
  try {
    const child = spawn(cmd, args, { stdio: 'ignore', detached: true });
    child.on('error', () => {});
    child.unref();
    return true;
  } catch {
    return false;
  }
}

function resolvePort(argPort) {
  if (process.env.PORT) {
    const p = parseInt(process.env.PORT, 10);
    if (Number.isFinite(p) && p >= 0) return p;
  }
  return argPort;
}

function ensureDeps() {
  const nm = path.join(SCRIPT_DIR, 'node_modules');
  const ok = fs.existsSync(path.join(nm, 'qrcode')) &&
             fs.existsSync(path.join(nm, 'bonjour-service'));
  if (ok) return;
  log('First-run setup: installing Node dependencies (qrcode, bonjour-service)...');
  const result = spawnSync(
    'npm',
    ['install', '--omit=dev', '--no-audit', '--no-fund', '--loglevel=error'],
    {
      cwd: SCRIPT_DIR,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    }
  );
  if (result.status !== 0) {
    err('Failed to install Node dependencies. Ensure `npm` is available on PATH.');
    process.exit(1);
  }
}

function ensureAdb() {
  const probe = process.platform === 'win32' ? 'where' : 'which';
  const r = spawnSync(probe, ['adb'], { stdio: 'ignore' });
  if (r.status === 0) return;
  err('Error: `adb` not found on PATH.');
  err('Install Android platform-tools:');
  err('  macOS:   brew install android-platform-tools');
  err('  Linux:   sudo apt install adb    (or your distro equivalent)');
  err('  Windows: https://developer.android.com/tools/releases/platform-tools');
  process.exit(1);
}

function randomServiceName() {
  return `ADB_WIFI_${crypto.randomBytes(4).toString('hex')}`;
}

function randomPassword() {
  return crypto.randomBytes(8).toString('hex');
}

function pickIpv4(addresses) {
  if (!addresses || addresses.length === 0) return null;
  return addresses.find(a => /^\d+\.\d+\.\d+\.\d+$/.test(a)) || addresses[0];
}

function runAdb(args) {
  return new Promise((resolve, reject) => {
    const p = spawn('adb', args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '', stderr = '';
    p.stdout.on('data', d => { stdout += d.toString(); });
    p.stderr.on('data', d => { stderr += d.toString(); });
    p.on('error', reject);
    p.on('close', code => {
      if (code === 0) resolve({ stdout, stderr });
      else reject(new Error((stderr || stdout).trim() || `adb exited with code ${code}`));
    });
  });
}

function runPairingFlow({ service, password, onState }) {
  const { Bonjour } = require('bonjour-service');
  const bonjour = new Bonjour();

  return new Promise((resolve) => {
    let settled = false;

    function finish(result) {
      if (settled) return;
      settled = true;
      try { bonjour.destroy(); } catch {}
      onState(result);
      resolve(result);
    }

    const pairTimeout = setTimeout(() => {
      finish({
        state: 'failed',
        message: `Timed out after ${Math.round(PAIR_TIMEOUT_MS/1000)}s waiting for device to advertise pairing service. Ensure the phone is on the same Wi-Fi and Wireless debugging is enabled.`,
      });
    }, PAIR_TIMEOUT_MS);

    process.on('SIGINT', () => finish({ state: 'failed', message: 'Aborted (SIGINT).' }));
    process.on('SIGTERM', () => finish({ state: 'failed', message: 'Aborted (SIGTERM).' }));

    const pairingBrowser = bonjour.find({ type: 'adb-tls-pairing' });
    pairingBrowser.on('up', async (svc) => {
      if (settled) return;
      if (svc.name !== service) return;

      clearTimeout(pairTimeout);

      const host = pickIpv4(svc.addresses);
      const port = svc.port;
      if (!host || !port) {
        return finish({ state: 'failed', message: 'Found pairing service but could not resolve host/port.' });
      }

      onState({ state: 'pairing', message: `Pairing with ${host}:${port}...` });

      try {
        await runAdb(['pair', `${host}:${port}`, password]);
      } catch (e) {
        return finish({ state: 'failed', message: `Pairing failed: ${e.message}` });
      }

      onState({ state: 'paired', message: 'Paired. Waiting for connect service...' });

      const connectBrowser = bonjour.find({ type: 'adb-tls-connect' });
      const connectTimeout = setTimeout(() => {
        finish({ state: 'failed', message: 'Paired, but device did not advertise a connect service. Try `adb connect <ip>:<port>` manually.' });
      }, CONNECT_TIMEOUT_MS);

      connectBrowser.on('up', async (connSvc) => {
        if (settled) return;
        const connHost = pickIpv4(connSvc.addresses);
        if (connHost !== host) return;

        clearTimeout(connectTimeout);
        const connPort = connSvc.port;

        try {
          await runAdb(['connect', `${connHost}:${connPort}`]);
          finish({ state: 'connected', message: `Connected to ${connHost}:${connPort}` });
        } catch (e) {
          finish({ state: 'failed', message: `Connect failed: ${e.message}` });
        }
      });
    });
  });
}

async function runCliMode() {
  const QRCode = require('qrcode');
  const service = randomServiceName();
  const password = randomPassword();
  const qrPayload = `WIFI:T:ADB;S:${service};P:${password};;`;

  log('');
  log('On your Android device:');
  log('  Settings -> Developer options -> Wireless debugging -> Pair device with QR code');
  log('');

  if (process.stdout.isTTY) {
    log('Then scan this QR code:');
    log('');
    const qr = await QRCode.toString(qrPayload, {
      type: 'terminal', small: true, errorCorrectionLevel: 'L',
    });
    process.stdout.write(qr);
  } else {
    const qrDir = path.join(os.homedir(), '.cache', 'adb-connect');
    fs.mkdirSync(qrDir, { recursive: true });
    const qrPath = path.join(qrDir, 'qr.png');
    await QRCode.toFile(qrPath, qrPayload, {
      width: 512, margin: 2, errorCorrectionLevel: 'L',
    });
    tempFiles.push(qrPath);
    log(`QR_PATH=${qrPath}`);
    log('Scan the QR code (displayed in your Claude Code session) from your phone.');
  }

  log(`(service: ${service})`);
  log('');
  log('Waiting for device to advertise pairing service...');

  const result = await runPairingFlow({
    service,
    password,
    onState: (s) => {
      if (s.message) log(s.message);
    },
  });

  process.exit(result.state === 'connected' ? 0 : 1);
}

async function runServeMode(argPort, { openBrowser = false } = {}) {
  const port = resolvePort(argPort);
  const QRCode = require('qrcode');
  const service = randomServiceName();
  const password = randomPassword();
  const qrPayload = `WIFI:T:ADB;S:${service};P:${password};;`;

  const qrDataUrl = await QRCode.toDataURL(qrPayload, {
    width: 512, margin: 2, errorCorrectionLevel: 'L',
  });

  const state = { state: 'waiting', message: 'Waiting for phone to scan QR code...' };

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>ADB Wi-Fi Pairing</title>
<style>
  :root { color-scheme: light dark; }
  body { font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 32px 16px;
         background: #f5f5f7; color: #1a1a1a; min-height: 100vh; box-sizing: border-box;
         display: flex; flex-direction: column; align-items: center; gap: 8px; }
  @media (prefers-color-scheme: dark) { body { background: #1a1a1c; color: #e8e8ea; } }
  h1 { margin: 0; font-size: 22px; font-weight: 600; text-align: center; }
  p { color: inherit; opacity: .75; max-width: 480px; margin: 4px auto; line-height: 1.5; text-align: center; }
  #slot { width: min(70vw, 380px); aspect-ratio: 1/1; background: white;
          padding: 16px; border-radius: 16px; box-shadow: 0 8px 24px rgba(0,0,0,.08); margin: 16px 0;
          display: flex; align-items: center; justify-content: center; box-sizing: border-box; }
  @media (prefers-color-scheme: dark) { #slot { background: #2a2a2c; } }
  #slot img { width: 100%; height: 100%; display: block; }
  .icon { font-size: 120px; line-height: 1; font-weight: 300; }
  .ok { color: #1a7a33; }
  .bad { color: #c92a1e; }
  @media (prefers-color-scheme: dark) {
    .ok { color: #6fdc82; }
    .bad { color: #ff8b7e; }
  }
  #status { padding: 10px 18px; border-radius: 10px; font-weight: 500; font-size: 14px; text-align: center; }
  .waiting { background: rgba(255, 196, 0, .15); color: #b8860b; }
  .pairing, .paired { background: rgba(0, 122, 255, .15); color: #0070f3; }
  .connected { background: rgba(52, 199, 89, .18); color: #1a7a33; }
  .failed { background: rgba(255, 59, 48, .15); color: #c92a1e; }
  @media (prefers-color-scheme: dark) {
    .waiting { color: #ffd567; }
    .pairing, .paired { color: #7fb8ff; }
    .connected { color: #6fdc82; }
    .failed { color: #ff8b7e; }
  }
</style>
</head>
<body>
  <h1>Pair Android device over Wi-Fi</h1>
  <p>Open <b>Settings → Developer options → Wireless debugging → Pair device with QR code</b> on your phone, then scan the code below.</p>
  <div id="slot"><img id="qr" src="${qrDataUrl}" alt="Pairing QR code"/></div>
  <div id="status" class="waiting">Waiting for phone to scan QR code...</div>
  <p id="hint" style="opacity:.55;font-size:13px;margin-top:4px">&nbsp;</p>
  <script>
    const slot = document.getElementById('slot');
    const statusEl = document.getElementById('status');
    const hint = document.getElementById('hint');
    function showIcon(glyph, cls) {
      while (slot.firstChild) slot.removeChild(slot.firstChild);
      const span = document.createElement('span');
      span.className = 'icon ' + cls;
      span.textContent = glyph;
      slot.appendChild(span);
    }
    async function poll() {
      try {
        const r = await fetch('/status', { cache: 'no-store' });
        const s = await r.json();
        statusEl.textContent = s.message || s.state;
        statusEl.className = s.state;
        if (s.state === 'connected') {
          showIcon('\u2713', 'ok');
          hint.textContent = 'You can close this window.';
          return;
        }
        if (s.state === 'failed') {
          showIcon('\u00d7', 'bad');
          hint.textContent = 'You can close this window.';
          return;
        }
      } catch (e) {}
      setTimeout(poll, 1500);
    }
    poll();
  </script>
</body>
</html>`;

  const server = http.createServer((req, res) => {
    if (req.url === '/status') {
      res.writeHead(200, {
        'content-type': 'application/json',
        'cache-control': 'no-store',
      });
      res.end(JSON.stringify(state));
      return;
    }
    if (req.url === '/health') {
      res.writeHead(200, { 'content-type': 'text/plain' });
      res.end('ok');
      return;
    }
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    res.end(html);
  });

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', () => {
      server.off('error', reject);
      resolve();
    });
  }).catch((e) => {
    if (e.code === 'EADDRINUSE') {
      err(`Port ${port} is already in use. Pass --port 0 to pick a free one, or --port <n>.`);
    } else {
      err(`Server error: ${e.message}`);
    }
    process.exit(1);
  });

  const actualPort = server.address().port;
  const url = `http://127.0.0.1:${actualPort}/`;
  log(`PAIR_URL=${url}`);
  log(`PAIR_PORT=${actualPort}`);
  log(`(service: ${service})`);

  if (openBrowser) {
    openInBrowser(url);
    log(`Opened ${url} in your default browser.`);
  }

  const result = await runPairingFlow({
    service,
    password,
    onState: (s) => {
      Object.assign(state, s);
      if (s.message) log(s.message);
    },
  });

  setTimeout(() => {
    // Hard exit: server.close() waits for all HTTP connections to end,
    // but the browser's keep-alive holds them open. The browser already
    // saw the final state via /status polling, so no graceful close needed.
    process.exit(result.state === 'connected' ? 0 : 1);
  }, FINAL_STATE_LINGER_MS);
}

async function main() {
  ensureDeps();
  ensureAdb();
  const args = parseArgs(process.argv);
  if (args.serve) {
    await runServeMode(args.port, { openBrowser: args.open });
  } else {
    await runCliMode();
  }
}

main().catch(e => {
  err('Unexpected error: ' + (e && e.stack || e));
  process.exit(1);
});
