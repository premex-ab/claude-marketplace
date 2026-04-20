---
description: Pair an Android device to ADB over Wi-Fi. Opens a QR in Claude Code Desktop's Preview pane (when available) or the system browser (CLI). One blocking Bash call per path — no polling.
allowed-tools: Bash, Read, Edit, Write, mcp__Claude_Preview__preview_start, mcp__Claude_Preview__preview_stop, mcp__Claude_Preview__preview_list
---

Run the Android Wi-Fi pairing flow. The script owns the whole lifecycle; Claude's job is to launch it the right way for the current environment and report the final result.

Pick the path by whether `mcp__Claude_Preview__preview_start` is in your current toolset:

- **Available → Desktop path** (QR in the Preview pane)
- **Not available → CLI path** (QR in the system browser)

Tell the user up front: "A browser tab (or Preview pane) will open with the QR code. Scan it from **Settings → Developer options → Wireless debugging → Pair device with QR code** on your phone."

---

## CLI path (no preview MCP)

Single blocking Bash call with `timeout: 180000` (3 min):

```
node "${CLAUDE_PLUGIN_ROOT}/scripts/pair.js" --serve --port 0 --open
```

The script installs deps on first run, starts the HTTP server, opens the URL in the default browser, runs mDNS + `adb pair` + `adb connect`, then exits with the result on stdout. Report the final line — `Connected to HOST:PORT` (exit 0) or the error line (exit 1) — and suggest `adb devices` on success.

---

## Desktop path (preview MCP available)

Do **not** spawn background bash processes. Use `preview_start` for the server, then one blocking `curl` long-poll for the result.

### D.1. Pre-install deps (first run only)

```bash
if [ ! -d "$CLAUDE_PLUGIN_ROOT/scripts/node_modules" ]; then
  (cd "$CLAUDE_PLUGIN_ROOT/scripts" && npm install --omit=dev --no-audit --no-fund --loglevel=error)
fi
```

### D.2. Resolve the plugin root

`echo "$CLAUDE_PLUGIN_ROOT"` → capture as `PLUGIN_ROOT`.

### D.3. Ensure `.claude/launch.json` has the `adb-connect-qr` entry

`launch.json` supports variables only for `${workspaceFolder}`; splat an absolute path for `program`. Use `autoPort: false` + a fixed port (48733) so we know exactly where to `curl`.

Target entry:

```json
{
  "name": "adb-connect-qr",
  "program": "<PLUGIN_ROOT>/scripts/pair.js",
  "args": ["--serve", "--port", "48733"],
  "port": 48733,
  "autoPort": false
}
```

If `.claude/launch.json` is missing: create it with `"version": "0.0.1"` and this entry in `configurations`. If present: Read + parse, merge the entry (add or update `program`/`args` in place, don't touch any other configuration), Write back with 2-space indent.

### D.4. Start the preview server

Call `mcp__Claude_Preview__preview_start` with `{ "name": "adb-connect-qr" }`. Desktop auto-opens the Preview pane on `http://127.0.0.1:48733/`, which serves the QR page with live status.

### D.5. Block until pairing completes (or fails)

One Bash call, with `timeout: 180000`:

```bash
curl -sf --max-time 170 http://127.0.0.1:48733/wait-for-complete
```

This long-polls the server — it returns only when the pairing flow reaches a terminal state. Response is JSON: `{"state": "connected"|"failed"|"timeout", "message": "<text>"}`. No polling loop in Claude.

### D.6. Clean up

Call `mcp__Claude_Preview__preview_list`, find the server id for `adb-connect-qr`, call `mcp__Claude_Preview__preview_stop` on it. (The script exits itself ~3s after terminal state; `preview_stop` also tears down anything still running.)

### D.7. Report outcome

- `connected`: "Connected to HOST:PORT" (extract from `message`), suggest `adb devices`.
- `failed`: relay the `message`.
- `timeout`: explain the phone never scanned the QR; suggest re-running and checking Wi-Fi + Wireless debugging.

---

## Notes

- Desktop path writes to the user's project `.claude/launch.json`. It's additive (preserves other entries). If the file has unrelated entries the user cares about, the merge doesn't touch them.
- Port 48733 is fixed on the Desktop path because `preview_start` needs a stable port in `launch.json`. If it's occupied, `preview_start` fails with a clear error — retry after freeing the port.
