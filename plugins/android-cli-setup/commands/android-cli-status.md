---
description: Show Android CLI version, skill location, last refresh, and recent log entries
allowed-tools: Bash(command:*), Bash(android:*), Bash(test:*), Bash(cat:*), Bash(ls:*), Bash(tail:*), Bash(date:*), Bash(shasum:*)
---

## Android CLI status

- Binary on PATH: !`command -v android 2>/dev/null || echo "NOT INSTALLED"`
- Version: !`android --version 2>/dev/null || echo "n/a"`
- Installed skill files: !`ls -la ~/.claude/skills/android-cli/ 2>/dev/null || echo "not present"`
- SKILL.md checksum: !`shasum -a 256 ~/.claude/skills/android-cli/SKILL.md 2>/dev/null | cut -c1-16 || echo "n/a"`
- Last refresh marker: !`test -f ~/.cache/android-cli-setup/last-refresh && date -r "$(cat ~/.cache/android-cli-setup/last-refresh)" || echo "never"`
- Recent log entries: !`tail -10 ~/.cache/android-cli-setup/update.log 2>/dev/null || echo "no log yet"`

Summarise the status in one sentence: is it installed, what version, when was it last refreshed, and flag anything that looks wrong (missing binary, stale marker >7 days, log errors).
