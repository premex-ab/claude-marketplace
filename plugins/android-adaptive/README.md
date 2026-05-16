# android-adaptive

> Instructions to make or update an app's UI so that it adapts to different Android devices including phones, tablets, foldables, laptops, desktop, TV, Auto and XR. It includes how to handle different window sizes, pointing devices (such as mouse) and text entry devices (such as keyboard) using the Compose MediaQuery API. It also covers multi-pane layouts using Navigation3 Scenes, adaptive UI components (such as buttons) with varying target sizes, and adaptive layouts (including navigation areas - nav rails and nav bars) using the Compose Grid and FlexBox APIs.

**Upstream:** [`android/skills/jetpack-compose/adaptive`](https://github.com/android/skills/tree/main/jetpack-compose/adaptive) — mirrored and split into a one-plugin-per-skill layout so you can install skills individually. Auto-synced daily from upstream; the SKILL.md is Google-authored.

## Install

```bash
/plugin install android-adaptive@premex-plugins
```

## What's in the box

- `skills/adaptive/SKILL.md` — the skill definition
- `skills/adaptive/references/` — supporting docs referenced from the skill
- `LICENSE.txt` — upstream Apache-2.0 license text

## Why this repo instead of cloning upstream?

The [top-level README](../../README.md#-android----googles-official-android-agent-skills) explains the rationale in detail. In short: upstream ships one monolithic repo of skills; this repo splits them into individually-installable plugins and auto-syncs daily.

## License

Apache-2.0 — see [`LICENSE.txt`](LICENSE.txt). The skill content is Google-authored; this directory is a packaging wrapper maintained by the Premex marketplace sync.
