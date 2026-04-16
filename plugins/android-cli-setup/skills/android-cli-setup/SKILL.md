---
name: android-cli-setup
description: Use when the user wants to scaffold, build, deploy, or manage an Android app from the terminal, or mentions Google's `android` CLI (the agent-first Android tooling that replaces sdkmanager/avdmanager/cmdline-tools), or uses any of its subcommands (`create`, `run`, `sdk`, `emulator`, `skills`, `layout`, `screen`, `docs`, `init`, `describe`, `update`). Installs the CLI into `~/.local/bin/android` if missing, runs `android init` to deposit Google's official `android-cli` skill into `~/.claude/skills/android-cli/`, and hands off. A companion SessionStart hook refreshes the install daily. Skip for pure Android Studio IDE work that doesn't touch a terminal.
---

# Android CLI setup

Google's `android` CLI is an agent-first replacement for the old `adb` / `sdkmanager` / `avdmanager` toolchain. Benchmarks: ~70% fewer tokens, ~3x faster than driving the legacy tools directly. The CLI ships bundled skills including `android-cli`, which it installs into each detected agent's skill directory.

This plugin's job is: get the CLI onto the user's machine once, make sure it stays current forever, and hand off to the installed skill. Everything operational lives in `~/.claude/skills/android-cli/SKILL.md`.

## Pieces that ship with this plugin

- **This skill** - triggers on Android dev intent, performs the one-time bootstrap if needed, confirms freshness on every invocation, then hands off.
- **SessionStart hook** (`hooks/refresh.sh`) - once per 24h, runs `android update && android skills add --skill=android-cli` in the background. Logs to `~/.cache/android-cli-setup/update.log`.
- **PostToolUse hook** (`hooks/touch-marker.sh`) - when the user manually runs `android update` or `android skills add`, resets the refresh marker so SessionStart doesn't redundantly refresh.
- **Slash commands** - `/android-cli-status`, `/android-cli-update`, `/android-cli-reset` for inspection and manual control.

## Workflow

### 1. Detect current state

```bash
command -v android \
  && test -f "$HOME/.claude/skills/android-cli/SKILL.md" \
  && echo READY
```

- If `READY` - skip to step 4.
- If the binary exists but the skill is missing - skip to step 3.
- If neither - continue to step 2.

### 2. Install the CLI (user-local, no sudo)

This plugin prefers `~/.local/bin/android` over the canonical `/usr/local/bin/android` because `android update` needs write access to wherever the binary lives. Sudo-every-update breaks the daily refresh hook; user-local install makes it seamless.

Run the packaged install script:

```bash
bash "${CLAUDE_PLUGIN_ROOT}/scripts/install.sh"
```

It picks the right platform (`darwin_arm64` or `linux_x86_64`), downloads from `https://redirector.gvt1.com/edgedl/android/cli/latest/<slug>/android`, chmods it, and triggers the first-run resource unpack. Windows isn't supported by this script; Windows users should follow the PowerShell command at <https://developer.android.com/tools/agents>.

If `~/.local/bin` isn't on the user's `PATH`, the script warns them; add this to their shell rc:
```
export PATH="$HOME/.local/bin:$PATH"
```

### 3. Run `android init`

```bash
android init
```

`init` auto-detects installed agents (Claude Code via `~/.claude/`, also Codex, Gemini, Antigravity, opencode if present) and writes:

- `~/.claude/skills/android-cli/SKILL.md`
- `~/.claude/skills/android-cli/interact.md`
- `~/.claude/skills/android-cli/journeys.md`

No `--agent` flag needed. If detection somehow misses Claude Code:
```bash
android skills add --skill=android-cli --agent=claude-code
```

List available bundled skills with `android skills list --long`. **Don't auto-install others with `--all`** - this repo already ships per-skill plugins for the bundled skills (`android-navigation-3`, `android-edge-to-edge`, `android-r8-analyzer`, `android-agp-9-upgrade`, `android-migrate-xml-views-to-jetpack-compose`, `android-play-billing-library-version-upgrade`). Double-installing creates duplicate skill triggers in Claude Code.

### 4. Staleness fallback

Before handing off, check how fresh the install is:

```bash
marker="$HOME/.cache/android-cli-setup/last-refresh"
test -f "$marker" && age=$(( $(date +%s) - $(cat "$marker") )) || age=999999999
# Synchronously refresh if marker is older than 7 days or missing.
if [ "$age" -gt 604800 ]; then
  android update >/dev/null 2>&1 || true
  android skills add --skill=android-cli >/dev/null 2>&1 || true
  date +%s > "$marker"
fi
```

In normal use the SessionStart hook keeps the marker within 24h, so this synchronous path almost never runs. It exists so users with flaky session lifetimes (hooks disabled, broken network during startup) still get fresh skills before the operational skill takes over.

### 5. Hand off

Read `~/.claude/skills/android-cli/SKILL.md` and follow it for whatever the user originally asked about - scaffolding a project, running an APK, managing SDK packages, emulators, UI inspection, docs search. That skill is authoritative; this bootstrap has nothing more to add.

## Troubleshooting

- **Hook doesn't fire on session start** - check that the plugin is enabled and `hooks/hooks.json` is loaded. `tail -f ~/.cache/android-cli-setup/update.log` during a fresh session should show a "SessionStart refresh started" line within seconds.
- **`android init` wrote files, but Claude Code doesn't see the skill yet** - Claude Code discovers `~/.claude/skills/` at session start. Open a new session or run `/reload-plugins`.
- **First `android` invocation prints "Downloading Android CLI..."** - the binary lazily unpacks embedded resources on first run. Wait it out once; subsequent calls are instant.
- **Two `android-cli` skills visible in the Skill list** - harmless if both point at the same thing. If they drift (e.g. the plugin-bundled one is ahead of the installed one), run `/android-cli-update` to re-extract the installed copy.
- **Reset everything** - `/android-cli-reset` wipes the user-local install, skill files, and refresh state, then reinstalls clean.

## Why this layered approach

A bare "run the installer" skill works but drifts: Google ships new CLI versions often, and each version may bundle updated skill content. Relying on users to remember `android update` isn't realistic. The SessionStart hook gives us daily currency with zero user attention, and the in-skill staleness check backstops when hooks don't fire. The `/android-cli-*` commands exist so users can inspect and force operations when they need to.
