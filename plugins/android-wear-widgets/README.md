# android-wear-widgets

> Create, migrate, update, and verify Wear OS widgets using Glance Wear and Remote Compose in an Android project. Use this skill when implementing GlanceWearWidget, GlanceWearWidgetService, WearWidgetDocument, Remote Compose UI primitives (RemoteColumn, RemoteRow, RemoteBox, RemoteText, RemoteImage, RemoteButton), local state with rememberMutableRemoteInt and valueChange, click actions with pendingIntentAction, widget provider XML containers (SMALL and LARGE), rectangular widget picker PNG previews, or migrating legacy ProtoLayout TileService tiles to Wear OS widgets. Don't use for mobile home screen AppWidgetProvider or GlanceAppWidget implementations, watch face complications, or full-screen Wear OS activities.

**Upstream:** [`android/skills/wear/wear-widgets`](https://github.com/android/skills/tree/main/wear/wear-widgets) — mirrored and split into a one-plugin-per-skill layout so you can install skills individually. Auto-synced daily from upstream; the SKILL.md is Google-authored.

## Install

```bash
/plugin install android-wear-widgets@premex-plugins
```

## What's in the box

- `skills/wear-widgets/SKILL.md` — the skill definition
- `skills/wear-widgets/references/` — supporting docs referenced from the skill
- `LICENSE.txt` — upstream Apache-2.0 license text

## Why this repo instead of cloning upstream?

The [top-level README](../../README.md#-android----googles-official-android-agent-skills) explains the rationale in detail. In short: upstream ships one monolithic repo of skills; this repo splits them into individually-installable plugins and auto-syncs daily.

## License

Apache-2.0 — see [`LICENSE.txt`](LICENSE.txt). The skill content is Google-authored; this directory is a packaging wrapper maintained by the Premex marketplace sync.
