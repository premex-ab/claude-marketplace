# adb-connect

Pair and connect an Android device to ADB over Wi-Fi by scanning a QR code from the terminal. Works like Android Studio's **Pair devices using Wi-Fi** — but from Claude Code, on macOS, Linux, and Windows.

## What it does

1. Generates a random service name + password, encodes them as a Wi-Fi QR (`WIFI:T:ADB;S:<name>;P:<password>;;`), and renders the QR in your terminal.
2. Listens on the LAN via mDNS for your device's `_adb-tls-pairing._tcp` advertisement.
3. When you scan the QR on the phone, matches the advertisement by service name and runs `adb pair <ip>:<port> <password>` automatically.
4. Waits for the `_adb-tls-connect._tcp` advertisement from the same device and runs `adb connect <ip>:<port>`.

That's it — no manual IP lookup, no typing pairing codes.

## Requirements

- **Node.js 18+** (already required by Claude Code, so you have it).
- **adb** on PATH (Android SDK platform-tools).
- Phone and laptop on the **same Wi-Fi network**.
- Phone has **Developer options → Wireless debugging** enabled.

### Installing adb

| Platform | Command |
|----------|---------|
| macOS    | `brew install android-platform-tools` |
| Linux    | `sudo apt install adb` (or your distro's package) |
| Windows  | Download from [developer.android.com/tools/releases/platform-tools](https://developer.android.com/tools/releases/platform-tools) and add to PATH |

## Usage

In Claude Code:

```
/adb-connect:pair
```

The command picks the right delivery channel for your environment:

- **Claude Code Desktop** → QR opens in the **Preview pane** via the built-in [preview MCP](https://code.claude.com/docs/en/desktop#configure-preview-servers). Adds an `adb-connect-qr` entry to your project's `.claude/launch.json` on first run.
- **Claude Code CLI** → QR opens in your **system default web browser** (`open` / `xdg-open` / `start`).

Either way, the page shows the QR and live pairing status (`waiting → pairing → paired → connected`). The script watches for the phone's mDNS advertisements, runs `adb pair` and `adb connect` after a successful scan, then exits with the result. Claude makes **one** blocking call per path — no polling, no background shells.

On your phone: **Settings → Developer options → Wireless debugging → Pair device with QR code** and scan. Pairing and connection happen automatically within a few seconds.

### Running the script directly (no Claude Code)

```bash
node plugins/adb-connect/scripts/pair.js
```

In a terminal this renders the QR as ASCII directly — same flow, no server, no browser. Useful as a plain CLI tool.

## How it works under the hood

This plugin is a single Node.js script (`scripts/pair.js`) that:

- Uses [`qrcode`](https://www.npmjs.com/package/qrcode) to render the Wi-Fi QR as UTF-8 block characters in the terminal.
- Uses [`bonjour-service`](https://www.npmjs.com/package/bonjour-service) — a pure-JS mDNS library — to discover the phone's advertised ADB services. This sidesteps the per-OS differences between `dns-sd` (macOS), `avahi-browse` (Linux), and Bonjour (Windows).
- Shells out to `adb pair` and `adb connect` via `child_process.spawn`.

On first run the script runs `npm install` in its own `scripts/` directory to fetch those two dependencies. No global installs, no Python, no platform-specific tooling.

## Troubleshooting

**Times out waiting for pairing service.** Your phone and laptop must be on the same Wi-Fi network, and mDNS must not be blocked between them (some guest networks and enterprise Wi-Fi do block it). Check that Wireless debugging is actually enabled on the phone.

**`adb pair` fails with "Failed".** Your phone may have a stale pairing for this computer. On the phone, tap **Forget** under Wireless debugging → IP address and port → paired devices, then re-run the skill.

**`adb` not found.** Install Android platform-tools (see table above) and make sure it's on your PATH.

**`npm install` fails on first run.** You need Node 18+ and `npm` on PATH. Check `node --version` and `npm --version`.
