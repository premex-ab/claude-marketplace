#!/usr/bin/env bash
# SessionStart hook: ensure the android CLI and its android-cli skill are
# installed and fresh. Installs eagerly on the first session so Claude has the
# CLI available before any tool call; refreshes at most once per
# ANDROID_CLI_REFRESH_INTERVAL (24h by default, in the background).
set -eu

# shellcheck source=../scripts/common.sh
source "${CLAUDE_PLUGIN_ROOT}/scripts/common.sh"

# Ensure ~/.local/bin is on PATH so `command -v android` finds user-local installs.
case ":${PATH}:" in
  *":${HOME}/.local/bin:"*) ;;
  *) export PATH="${HOME}/.local/bin:${PATH}" ;;
esac

# ── Eager install: if the binary is missing, install synchronously. ──────────
# Background install would race with the user's first `android` command in the
# same session, so we block session startup briefly (typically <2s on a fast
# connection) to guarantee the CLI is ready.
if ! command -v android >/dev/null 2>&1; then
  acs_log "binary missing on SessionStart; running install.sh"
  if bash "${CLAUDE_PLUGIN_ROOT}/scripts/install.sh" >>"${ANDROID_CLI_LOG}" 2>&1; then
    acs_log "install completed"
    acs_touch_marker
  else
    acs_log "install failed (exit $?); skipping refresh"
    exit 0
  fi
fi

# ── Skill deposit: run `android init` if the skill hasn't landed yet. ────────
if [[ ! -f "${HOME}/.claude/skills/android-cli/SKILL.md" ]]; then
  acs_log "android-cli skill missing; running 'android init'"
  android init >>"${ANDROID_CLI_LOG}" 2>&1 || acs_log "android init failed (exit $?)"
fi

# ── Throttled background refresh ─────────────────────────────────────────────
age=$(acs_marker_age_seconds)
if (( age < ANDROID_CLI_REFRESH_INTERVAL )); then
  exit 0
fi

(
  acs_log "SessionStart refresh started (marker age: ${age}s)"
  old_version=$(android --version 2>/dev/null || echo "unknown")

  if android update >/dev/null 2>&1; then
    new_version=$(android --version 2>/dev/null || echo "unknown")
    if [[ "${old_version}" != "${new_version}" ]]; then
      acs_log "binary updated: ${old_version} -> ${new_version}"
    else
      acs_log "binary already current (${new_version})"
    fi
  else
    acs_log "android update failed (exit $?)"
  fi

  if android skills add --skill=android-cli >/dev/null 2>&1; then
    acs_log "android-cli skill re-installed"
  else
    acs_log "android skills add failed (exit $?)"
  fi

  acs_touch_marker
  acs_log "SessionStart refresh complete"
) </dev/null >/dev/null 2>&1 &

# Detach so this process doesn't linger in the session's process group.
disown 2>/dev/null || true
exit 0
