#!/usr/bin/env bash
# Installs the `android` CLI to ~/.local/bin (user-writable, no sudo) so that
# `android update` can keep it current without prompting.
# Idempotent: safe to re-run.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./common.sh
source "${SCRIPT_DIR}/common.sh"

slug=$(acs_platform_slug)
if [[ "${slug}" == "unsupported" ]]; then
  echo "error: unsupported platform $(uname -sm). Install manually from https://developer.android.com/tools/agents" >&2
  exit 1
fi

target_dir="$(dirname "${ANDROID_CLI_USER_BIN}")"
mkdir -p "${target_dir}"

url="https://redirector.gvt1.com/edgedl/android/cli/latest/${slug}/android"
echo "Downloading android CLI from ${url}..."
curl -fsSL "${url}" -o "${ANDROID_CLI_USER_BIN}"
chmod +x "${ANDROID_CLI_USER_BIN}"

# Trigger the one-time unpack of embedded resources.
ANDROID_CLI_FRESH_INSTALL=1 "${ANDROID_CLI_USER_BIN}" --version >/dev/null 2>&1 || true

if ! command -v android >/dev/null 2>&1; then
  cat <<EOF >&2
warning: 'android' is not on PATH. Add ${target_dir} to your shell startup:
    export PATH="\$HOME/.local/bin:\$PATH"
EOF
fi

installed_version=$("${ANDROID_CLI_USER_BIN}" --version 2>/dev/null || echo "unknown")
echo "Installed android CLI ${installed_version} at ${ANDROID_CLI_USER_BIN}"
acs_log "install.sh completed (version: ${installed_version})"
