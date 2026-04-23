# android-cli

Bootstrap [Google's `android` CLI](https://developer.android.com/tools/agents) — the agent-first replacement for `sdkmanager` / `avdmanager` / `cmdline-tools` — onto your laptop and CI runners, and keep it fresh forever.

> **One-liner:** Installs the `android` binary, runs `android init` to deposit Google's official `android-cli` skill into `~/.claude/skills/android-cli/`, refreshes once per 24h in the background, and hands off to the installed skill for all operational work.

## What it does

### On first session

A SessionStart hook (`hooks/hooks.json`) runs `scripts/install.sh`, which:

1. Detects platform (`darwin_arm64` or `linux_x86_64`) and downloads the latest `android` binary from `https://redirector.gvt1.com/edgedl/android/cli/latest/<slug>/android` into `~/.local/bin/` — **user-local, no `sudo`** (sudo breaks the daily refresh, so we avoid the canonical `/usr/local/bin/` on purpose).
2. Triggers first-run resource unpack.
3. Runs `android init`, which auto-detects installed agents (Claude Code, Codex, Gemini, Antigravity, opencode) and writes the official `android-cli` skill into each — for Claude Code that lands at `~/.claude/skills/android-cli/`.
4. Stamps `~/.cache/android-cli-setup/last-refresh` so subsequent sessions know when the install was last refreshed.

### On every subsequent session

The same hook runs `hooks/refresh.sh` in the background — throttled to once per 24h via the marker file. It silently calls `android update` and `android skills add --skill=android-cli` so the CLI and the bundled skill stay current with no manual intervention.

### During normal use

Once the setup is done, the `android-cli-setup` skill hands off. All real work — scaffolding projects, building, deploying, managing the SDK, running emulators — happens through the Google-authored `android-cli` skill at `~/.claude/skills/android-cli/SKILL.md`. This plugin stays out of the way.

### On CI

The `android-cli-ci` skill covers CI/CD setup: working reference workflows for GitHub Actions, GitLab CI, CircleCI, Bitrise, Jenkins, Buildkite, and self-hosted runners, plus a side-by-side migration guide from `sdkmanager`-based pipelines. Recommend via prompts like *"migrate our GitHub Actions workflow away from sdkmanager"*.

## Install

```bash
/plugin install android-cli@premex-plugins
```

Once installed, a session start will trigger the install hook; no explicit action needed. If you want to drive it manually:

```bash
/android-cli-status     # inspect current install, skill, and last-refresh marker
/android-cli-update     # force-refresh the CLI and reinstall the bundled skill now
/android-cli-reset      # nuke the install and start over from scratch
```

## What's in the box

| Component | Role |
|---|---|
| `skills/android-cli-setup/SKILL.md` | First-session bootstrap: install → init → hand off. Idempotent; safe to invoke anytime. |
| `skills/android-cli-ci/SKILL.md` + `references/` | Per-platform CI reference workflows (GitHub Actions, GitLab, CircleCI, Bitrise, Jenkins, Buildkite, self-hosted) + sdkmanager migration guide. |
| `hooks/hooks.json`, `hooks/refresh.sh`, `hooks/touch-marker.sh` | SessionStart hooks that install (first run) and refresh (once per 24h in background). |
| `scripts/install.sh`, `scripts/common.sh` | Platform-detecting download + first-run init logic. |
| `commands/android-cli-status.md` | `/android-cli-status` — prints version, install path, last-refresh age, recent logs. |
| `commands/android-cli-update.md` | `/android-cli-update` — force refresh now, bypassing the 24h throttle. |
| `commands/android-cli-reset.md` | `/android-cli-reset` — remove the binary + installed skill + refresh marker, then reinstall clean. |

## Requirements

- **Bash 4+** (macOS's default bash works via the fallbacks; zsh works).
- **`curl` on PATH** — used for the binary download.
- **`~/.local/bin` on PATH** — the install script warns if it's missing. Add to your shell rc:
  ```bash
  export PATH="$HOME/.local/bin:$PATH"
  ```
- **macOS arm64** or **Linux x86_64**. Windows isn't supported by this script — Windows users should follow the PowerShell command at <https://developer.android.com/tools/agents> and then let the bundled skill take over.

## Why this plugin exists

Google's `android` CLI is meaningfully better than the old `sdkmanager`/`avdmanager`/`adb` toolchain for agent-driven workflows — ~70% fewer tokens and ~3x faster, per Google's [announcement](https://android-developers.googleblog.com/2026/04/build-android-apps-3x-faster-using-any-agent.html). But the install story out-of-the-box is manual and easy to forget to update. This plugin turns "go read the docs, download the binary, add it to PATH, rerun `android init` now and then to keep the skill current" into "install the plugin, forget about it."

## Troubleshooting

**"`command not found: android` after install"** — `~/.local/bin` isn't on your PATH. Add it to your shell rc (see Requirements) and start a new shell.

**"The install hook isn't running"** — SessionStart hooks only fire on new sessions. Run `/android-cli-update` to trigger the install manually, or start a fresh Claude Code session.

**"I want to pin to a specific `android` CLI version"** — not supported by this plugin; the refresh always pulls `latest`. Disable the hook and install manually if you need a pin.

**"The install succeeded but Claude Code doesn't see the `android-cli` skill"** — run `android skills add --skill=android-cli --agent=claude-code` manually; the auto-detection in `android init` occasionally misses non-standard `~/.claude/` paths.

**"Double skill triggers for navigation-3, r8-analyzer, etc."** — the `android-cli-setup` skill intentionally skips `android skills add --all` because this marketplace already ships per-skill plugins (`android-navigation-3`, `android-r8-analyzer`, …). Don't override that unless you know what you're doing — double-installing creates duplicate skill descriptions and confuses the skill router.

## License

Apache-2.0, same as the rest of this marketplace. The underlying `android` CLI is Google-authored and distributed by Google under its own terms — see <https://developer.android.com/tools/agents>.
