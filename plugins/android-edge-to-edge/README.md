# android-edge-to-edge

> Use this skill to migrate your Jetpack Compose app to add adaptive edge-to-edge support and troubleshoot common issues. Use this skill to fix UI components (like buttons or lists) that are obscured by or overlapping with the navigation bar or status bar, fix IME insets, and fix system bar legibility.

**Upstream:** [`android/skills/system/edge-to-edge`](https://github.com/android/skills/tree/main/system/edge-to-edge) — mirrored and split into a one-plugin-per-skill layout so you can install skills individually. Auto-synced daily from upstream; the SKILL.md is Google-authored.

## Install

```bash
/plugin install android-edge-to-edge@premex-plugins
```

## What's in the box

- `skills/edge-to-edge/SKILL.md` — the skill definition
- `LICENSE.txt` — upstream Apache-2.0 license text

## Why this repo instead of cloning upstream?

The [top-level README](../../README.md#-android----googles-official-android-agent-skills) explains the rationale in detail. In short: upstream ships one monolithic repo of skills; this repo splits them into individually-installable plugins and auto-syncs daily.

## License

Apache-2.0 — see [`LICENSE.txt`](LICENSE.txt). The skill content is Google-authored; this directory is a packaging wrapper maintained by the Premex marketplace sync.
