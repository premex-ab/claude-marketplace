#!/usr/bin/env bash
# SessionStart hook: refresh the android CLI and its android-cli skill once per
# ANDROID_CLI_REFRESH_INTERVAL (24h by default). Does the network work in the
# background so session startup never waits on it.
set -eu

# shellcheck source=../scripts/common.sh
source "${CLAUDE_PLUGIN_ROOT}/scripts/common.sh"

# Nothing to refresh if the CLI isn't installed yet.
command -v android >/dev/null 2>&1 || exit 0

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
