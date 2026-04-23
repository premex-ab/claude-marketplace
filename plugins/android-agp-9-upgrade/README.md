# android-agp-9-upgrade

> Upgrades, or migrates, an Android project to use Android Gradle Plugin (AGP) version 9. Do not use this skill for migrating Kotlin Multiplatform (KMP) projects.

**Upstream:** [`android/skills/build/agp/agp-9-upgrade`](https://github.com/android/skills/tree/main/build/agp/agp-9-upgrade) — mirrored and split into a one-plugin-per-skill layout so you can install skills individually. Auto-synced daily from upstream; the SKILL.md is Google-authored.

## Install

```bash
/plugin install android-agp-9-upgrade@premex-plugins
```

## What's in the box

- `skills/agp-9-upgrade/SKILL.md` — the skill definition
- `skills/agp-9-upgrade/references/` — supporting docs referenced from the skill
- `LICENSE.txt` — upstream Apache-2.0 license text

## Why this repo instead of cloning upstream?

The [top-level README](../../README.md#-android----googles-official-android-agent-skills) explains the rationale in detail. In short: upstream ships one monolithic repo of skills; this repo splits them into individually-installable plugins and auto-syncs daily.

## License

Apache-2.0 — see [`LICENSE.txt`](LICENSE.txt). The skill content is Google-authored; this directory is a packaging wrapper maintained by the Premex marketplace sync.
