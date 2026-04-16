#!/usr/bin/env bash
# Shared paths and helpers for the android-cli-setup plugin.
# Source this file from hooks and the install script.

export ANDROID_CLI_USER_BIN="${HOME}/.local/bin/android"
export ANDROID_CLI_STATE_DIR="${HOME}/.cache/android-cli-setup"
export ANDROID_CLI_MARKER="${ANDROID_CLI_STATE_DIR}/last-refresh"
export ANDROID_CLI_LOG="${ANDROID_CLI_STATE_DIR}/update.log"

# Refresh at most once every 24h in the SessionStart hook.
export ANDROID_CLI_REFRESH_INTERVAL=86400
# The setup skill forces a synchronous refresh if the marker is older than 7 days.
export ANDROID_CLI_STALE_THRESHOLD=604800

mkdir -p "${ANDROID_CLI_STATE_DIR}"

acs_marker_age_seconds() {
  if [[ ! -f "${ANDROID_CLI_MARKER}" ]]; then
    echo "999999999"
    return
  fi
  local last now
  last=$(cat "${ANDROID_CLI_MARKER}" 2>/dev/null || echo 0)
  now=$(date +%s)
  echo $((now - last))
}

acs_touch_marker() {
  date +%s > "${ANDROID_CLI_MARKER}"
}

acs_log() {
  echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] $*" >> "${ANDROID_CLI_LOG}"
}

# Detect platform slug for the Android CLI download URLs.
# Echoes e.g. darwin_arm64, linux_x86_64, or "unsupported".
acs_platform_slug() {
  local os arch
  os=$(uname -s)
  arch=$(uname -m)
  case "${os}/${arch}" in
    Darwin/arm64) echo "darwin_arm64" ;;
    Linux/x86_64) echo "linux_x86_64" ;;
    *) echo "unsupported" ;;
  esac
}
