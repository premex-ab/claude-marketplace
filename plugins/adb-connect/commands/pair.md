---
description: Pair an Android device to ADB over Wi-Fi. Opens a QR code in the browser; the script handles mDNS discovery, adb pair, and adb connect end-to-end.
allowed-tools: Bash
---

Run the Wi-Fi pairing flow. This is a **single blocking Bash call** — the script owns the whole lifecycle (starts an HTTP server, opens a browser with the QR code, waits for the phone to scan, runs `adb pair` and `adb connect`, exits with the result). Do not poll. Do not orchestrate. Do not spawn background processes.

Run exactly this via the Bash tool with `timeout: 180000` (3 minutes):

```
node "${CLAUDE_PLUGIN_ROOT}/scripts/pair.js" --serve --port 0 --open
```

- `--serve`: starts the HTTP server that renders the QR page.
- `--port 0`: OS picks a free port (no conflicts).
- `--open`: the script opens the URL in the user's default browser (macOS `open`, Linux `xdg-open`, Windows `start`).

On first run the script silently `npm install`s `qrcode` and `bonjour-service` into `scripts/node_modules/` (~20s). Subsequent runs skip that.

Before starting, tell the user: "A browser tab will open with the QR code. Scan it from **Settings → Developer options → Wireless debugging → Pair device with QR code** on your phone."

After the command returns, report the last meaningful line of its output to the user:

- On success (exit 0): something like `Connected to 10.0.1.136:33985`. Suggest `adb devices` to verify.
- On failure (exit 1): the error line the script printed — usually a timeout, pair-failure, or missing `adb`.
