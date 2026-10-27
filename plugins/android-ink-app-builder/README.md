# android-ink-app-builder

> Adds inking and freehand drawing capabilities to an Android app using Jetpack Ink (androidx.ink) and Compose. Use this skill when implementing stylus or touch drawing surfaces, rendering wet and dry ink strokes, configuring stock brushes (pressure pen, marker, highlighter), implementing geometry-based erasing, linear undo and redo history, or stroke persistence with Room. Delivers working Compose and ViewModel implementations. Don't use for View-based (XML) inking or programmatic custom BrushFamily creation. For custom BrushFamily creation, custom tip shapes, or behavior node graphs, suggest the ink-custom-brush-builder skill.

**Upstream:** [`android/skills/jetpack-compose/ink/ink-app-builder`](https://github.com/android/skills/tree/main/jetpack-compose/ink/ink-app-builder) — mirrored and split into a one-plugin-per-skill layout so you can install skills individually. Auto-synced daily from upstream; the SKILL.md is Google-authored.

## Install

```bash
/plugin install android-ink-app-builder@premex-plugins
```

## What's in the box

- `skills/ink-app-builder/SKILL.md` — the skill definition
- `skills/ink-app-builder/references/` — supporting docs referenced from the skill
- `LICENSE.txt` — upstream Apache-2.0 license text

## Why this repo instead of cloning upstream?

The [top-level README](../../README.md#-android----googles-official-android-agent-skills) explains the rationale in detail. In short: upstream ships one monolithic repo of skills; this repo splits them into individually-installable plugins and auto-syncs daily.

## License

Apache-2.0 — see [`LICENSE.txt`](LICENSE.txt). The skill content is Google-authored; this directory is a packaging wrapper maintained by the Premex marketplace sync.
