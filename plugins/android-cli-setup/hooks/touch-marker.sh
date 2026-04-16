#!/usr/bin/env bash
# PostToolUse hook for Bash: if the tool call ran `android update` or
# `android skills add`, reset the refresh marker so SessionStart doesn't
# re-refresh on the very next session.
set -eu

# shellcheck source=../scripts/common.sh
source "${CLAUDE_PLUGIN_ROOT}/scripts/common.sh"

# Hooks receive the tool invocation as JSON on stdin; `tool_input.command` is
# the shell command for the Bash tool. We only care about whether that command
# contained an android refresh, so a grep on the raw input is good enough.
input=$(cat 2>/dev/null || echo "")

if echo "${input}" | grep -qE 'android[[:space:]]+(update|skills[[:space:]]+add)'; then
  acs_touch_marker
  acs_log "marker touched after manual android update/skills add"
fi

exit 0
