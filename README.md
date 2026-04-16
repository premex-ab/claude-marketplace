# Premex Claude Code Plugins

Custom Claude Code plugin marketplace for Premex.

## Plugins

### github-utils
GitHub utilities for managing Dependabot PRs and other GitHub workflows.

### android-skills
Mirror of the official [android/skills](https://github.com/android/skills) repository — AI-optimised agent skills for Android development (AGP upgrades, Jetpack Compose migration, Navigation 3, R8 analysis, Play Billing upgrades, edge-to-edge). Auto-synced daily from upstream via a scheduled GitHub Actions workflow.

## Installation

Add this marketplace to Claude Code:

```bash
/plugin marketplace add premex-ab/claude-marketplace
```

Then install plugins:

```bash
/plugin install github-utils@premex-plugins
/plugin install android-skills@premex-plugins
```
