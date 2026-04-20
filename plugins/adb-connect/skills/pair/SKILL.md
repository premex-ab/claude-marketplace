---
name: pair
description: Pairs and connects an Android device to ADB over Wi-Fi by rendering a QR code in the browser (or terminal as fallback) — the same flow as Android Studio's "Pair devices using Wi-Fi". Use when the user wants to connect, pair, or debug an Android device over Wi-Fi via ADB, or says "pair my phone over wifi", "connect android over wifi", "wireless adb", "wireless adb setup", "adb wireless debugging", "adb pair QR", "scan QR to connect phone", "debug android without usb", or "android studio wifi pairing from cli".
---

# Pair an Android device to ADB over Wi-Fi via QR code

Invoke the `/adb-connect:pair` slash command (full spec in `commands/pair.md`). If that slash command isn't available in the current session, run the same Bash call directly:

```
node "${CLAUDE_PLUGIN_ROOT}/scripts/pair.js" --serve --port 0 --open
```

Use `timeout: 180000` (3 minutes). The script owns the whole lifecycle — starts an HTTP server, opens the QR in the user's default browser, runs `adb pair` and `adb connect` via mDNS, and exits with the result. Do not poll, do not background, do not orchestrate.

Before running, tell the user: "A browser tab will open with the QR code. Scan it from **Settings → Developer options → Wireless debugging → Pair device with QR code** on your phone."

After the command returns, report its final line to the user — `Connected to HOST:PORT` on success, or the error line on failure.
