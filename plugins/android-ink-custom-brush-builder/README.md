# android-ink-custom-brush-builder

> Creates custom BrushFamily definitions for an Android app using Jetpack Ink (androidx.ink 1.1.0-alpha03 and higher). Use this skill when configuring custom BrushTip shapes, adding pressure, tilt, speed, or noise sensitivity using BrushBehavior node graphs, creating multi-coat layered brushes, applying tiling or particle stamping textures, configuring SlidingWindowModel input smoothing, or serializing brushes. Delivers complete Kotlin BrushFamily, BrushCoat, BrushTip, BrushPaint, and BrushBehavior implementations. Don't use for View-based (XML) inking, Compose drawing surface setup, or stock brush selection. For Compose drawing surface setup, InProgressStrokes wet and dry rendering, eraser, or persistence, suggest the ink-app-builder skill.

**Upstream:** [`android/skills/jetpack-compose/ink/ink-custom-brush-builder`](https://github.com/android/skills/tree/main/jetpack-compose/ink/ink-custom-brush-builder) — mirrored and split into a one-plugin-per-skill layout so you can install skills individually. Auto-synced daily from upstream; the SKILL.md is Google-authored.

## Install

```bash
/plugin install android-ink-custom-brush-builder@premex-plugins
```

## What's in the box

- `skills/ink-custom-brush-builder/SKILL.md` — the skill definition
- `skills/ink-custom-brush-builder/references/` — supporting docs referenced from the skill
- `LICENSE.txt` — upstream Apache-2.0 license text

## Why this repo instead of cloning upstream?

The [top-level README](../../README.md#-android----googles-official-android-agent-skills) explains the rationale in detail. In short: upstream ships one monolithic repo of skills; this repo splits them into individually-installable plugins and auto-syncs daily.

## License

Apache-2.0 — see [`LICENSE.txt`](LICENSE.txt). The skill content is Google-authored; this directory is a packaging wrapper maintained by the Premex marketplace sync.
