---
description: Remove the Android CLI binary, installed skill, and refresh state, then reinstall from scratch
allowed-tools: Bash(rm:*), Bash(curl:*), Bash(chmod:*), Bash(test:*), Bash(android:*), Bash(ls:*), Bash(bash:*)
---

## Reset Android CLI

This removes the user-local install only. A system-wide `/usr/local/bin/android` (from the curl-pipe install) is left alone - tell the user to remove it manually with `sudo rm /usr/local/bin/android` if they want a clean slate.

### 1. Remove state
```
rm -f "$HOME/.local/bin/android"
rm -rf "$HOME/.claude/skills/android-cli"
rm -rf "$HOME/.cache/android-cli-setup"
```

### 2. Reinstall
```
bash "${CLAUDE_PLUGIN_ROOT}/scripts/install.sh"
```

### 3. Re-register the skill with all detected agents
```
android init
```

### 4. Confirm
Run `/android-cli-status` after this command to verify the new install looks right.

Ask before proceeding if the user has any uncommitted Android work that depends on the current SDK state - `android init` doesn't touch `~/.android/`, but a fresh binary may pull a different SDK snapshot on first invocation.
