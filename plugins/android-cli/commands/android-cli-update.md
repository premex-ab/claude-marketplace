---
description: Force-refresh the Android CLI binary and re-install the android-cli skill now
allowed-tools: Bash(android:*), Bash(date:*), Bash(cat:*), Bash(shasum:*), Bash(test:*)
---

## Force-refresh Android CLI

Capture the current state, run the refresh, then report what changed.

### Before
- Version: !`android --version 2>/dev/null || echo "NOT INSTALLED"`
- SKILL.md checksum: !`shasum -a 256 ~/.claude/skills/android-cli/SKILL.md 2>/dev/null | cut -c1-16 || echo "n/a"`

### Refresh

Run these in order:

```
android update
android skills add --skill=android-cli
date +%s > ~/.cache/android-cli-setup/last-refresh
```

### After
- Version: !`android --version 2>/dev/null || echo "NOT INSTALLED"`
- SKILL.md checksum: !`shasum -a 256 ~/.claude/skills/android-cli/SKILL.md 2>/dev/null | cut -c1-16 || echo "n/a"`

Compare before/after values. Tell the user whether the binary version changed, whether the skill file changed, and remind them that if the skill content changed they may want to start a new session so Claude Code picks up the updated SKILL.md.
