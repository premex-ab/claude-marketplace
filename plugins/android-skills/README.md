# android-skills

A Claude Code plugin that mirrors the official [android/skills](https://github.com/android/skills) repository, making the skills discoverable inside Claude Code via this marketplace.

## What this contains

Agent skills (SKILL.md files) covering Android development best practices, including:

- Android Gradle Plugin upgrades
- Jetpack Compose migrations
- Navigation 3
- R8 analysis
- Play Billing Library upgrades
- Edge-to-edge UI

The set is expanded and maintained upstream by Google; this plugin re-ships whatever is currently in the upstream repo.

## How the mirror stays fresh

A scheduled GitHub Actions workflow (`.github/workflows/sync-android-skills.yml` in the marketplace repo) runs daily, fetches the latest upstream skills, flattens them into `skills/<skill-name>/` (Claude Code plugins require skills as direct children of `skills/`), and commits any changes.

End users pick up new skills by running `/plugin marketplace update` in Claude Code.

## Attribution & license

Upstream content © Google LLC, licensed under Apache-2.0. See `LICENSE.txt` for the upstream license text. The wrapper files in this directory are part of the parent marketplace repo.

Source: <https://github.com/android/skills>
