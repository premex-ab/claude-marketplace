---
name: pair
description: Pairs and connects an Android device to ADB over Wi-Fi by rendering a QR code in the terminal (the same flow as Android Studio's "Pair devices using Wi-Fi"). Use when the user wants to connect, pair, or debug an Android device over Wi-Fi via ADB using a QR code, or mentions "adb wireless debugging", "wireless ADB", "pair phone over wifi", "adb pair QR", or wants Android Studio's Wi-Fi pairing from the terminal. The skill runs a Node.js script that generates the QR, discovers the device via mDNS when scanned, and runs `adb pair` and `adb connect` automatically. Cross-platform (macOS, Linux, Windows).
---

# Pair an Android device to ADB over Wi-Fi via QR code

This skill runs a single Node.js script that reproduces Android Studio's "Pair devices using Wi-Fi" flow:

1. Generates a random service name + password.
2. Encodes them as a Wi-Fi-style QR code (`WIFI:T:ADB;S:<service>;P:<password>;;`) and prints it to the terminal.
3. Listens on the LAN via mDNS for the device's `_adb-tls-pairing._tcp` advertisement.
4. Once the user scans the QR on their phone, matches the advertisement by service name, then runs `adb pair <ip:port> <password>`.
5. Then waits for the device's `_adb-tls-connect._tcp` advertisement and runs `adb connect <ip:port>` to establish the debugging session.

If the user invokes the slash command `/adb-connect:pair`, the command file handles this directly — it uses Claude Code Desktop's Preview pane (when available) or the system browser (CLI) to display the QR via a local HTTP server. Use this skill when the user describes the intent in natural language and you need to orchestrate the flow yourself.

## How to run

The cleanest path is to defer to the slash command at `commands/pair.md` — it runs a single foreground Bash call that does everything end-to-end.

If you must run the script directly (e.g., inline one-off usage), two modes are available:

```bash
# Terminal mode: prints an ASCII QR to stdout, then waits for mDNS.
node "${CLAUDE_PLUGIN_ROOT}/scripts/pair.js"

# Server mode: starts an HTTP server serving the QR as a web page, opens the
# URL in the default browser, then runs mDNS + adb pair + adb connect.
# --port 0 asks the OS to pick any free port.
node "${CLAUDE_PLUGIN_ROOT}/scripts/pair.js" --serve --port 0 --open
```

Do not pipe or redirect terminal-mode output — the ASCII QR must go straight to the user's TTY.

## Prerequisites to verify before running

- **adb** on PATH. The script will error out with install instructions if missing, but it's friendlier to check up front: `command -v adb`.
- **Phone and laptop on the same Wi-Fi network.** mDNS does not cross subnets.
- **Wireless debugging enabled** on the phone: Settings → Developer options → Wireless debugging → ON.

## What the user does during the flow

Tell the user, before running:

> On your phone: open **Settings → Developer options → Wireless debugging → Pair device with QR code**, then scan the QR that appears in the terminal.

The script waits up to 2 minutes for the pairing advertisement, then 30 more seconds for the connect advertisement. If either times out, it prints a diagnostic hint.

## Expected output on success

```
Device found at 192.168.1.42:37129. Running `adb pair`...
Successfully paired to 192.168.1.42:37129 [guid=adb-...]
Waiting for connect service on same device...
connected to 192.168.1.42:41535
Connected. `adb devices` should now list your phone.
```

Confirm with `adb devices` afterwards.

## Failure modes

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Times out waiting for pairing service | Phone on different network, or Wireless debugging not enabled | Check Wi-Fi, re-enable Wireless debugging |
| "Pairing failed: ..." | Wrong password (shouldn't happen with QR), or device cancelled | Re-run the skill; phone may also need "Forget this computer" first |
| "Connect failed" after successful pair | Firewall blocking the ADB connect port, or phone stopped advertising | Run `adb devices` — device may already be listed; if not, retry |
| `adb not found` | Android platform-tools not installed | Script prints install instructions per-platform |
| `npm install` fails on first run | Offline, or npm not on PATH | Ensure Node.js 18+ and npm are installed |

## Notes

- The generated password is per-invocation and is never stored or logged beyond the single `adb pair` call.
- The script does not require root or any system-wide install. Its `node_modules/` lives inside the plugin's `scripts/` directory.
- This does **not** replace `adb connect <ip>:<port>` for reconnecting to a previously-paired device. It's only for the initial pairing. Once paired, the phone is trusted and can be reconnected with plain `adb connect`.
