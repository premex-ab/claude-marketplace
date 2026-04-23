# android-navigation-3

> Learn how to install and migrate to Jetpack Navigation 3, and how to implement features and patterns such as deep links, multiple backstacks, scenes (dialogs, bottom sheets, list-detail, two-pane, supporting pane), conditional navigation (such as logged-in navigation vs anonymous), returning results from flows, integration with Hilt, ViewModel, Kotlin, and view interoperability.

**Upstream:** [`android/skills/navigation/navigation-3`](https://github.com/android/skills/tree/main/navigation/navigation-3) — mirrored and split into a one-plugin-per-skill layout so you can install skills individually. Auto-synced daily from upstream; the SKILL.md is Google-authored.

## Install

```bash
/plugin install android-navigation-3@premex-plugins
```

## What's in the box

- `skills/navigation-3/SKILL.md` — the skill definition
- `skills/navigation-3/references/` — supporting docs referenced from the skill
- `LICENSE.txt` — upstream Apache-2.0 license text

## Why this repo instead of cloning upstream?

The [top-level README](../../README.md#-android----googles-official-android-agent-skills) explains the rationale in detail. In short: upstream ships one monolithic repo of skills; this repo splits them into individually-installable plugins and auto-syncs daily.

## License

Apache-2.0 — see [`LICENSE.txt`](LICENSE.txt). The skill content is Google-authored; this directory is a packaging wrapper maintained by the Premex marketplace sync.
