# android-glance-appwidget-updates-and-memory

> Manages Android AppWidget state updates, background syncs, and RemoteViews bitmap memory limits with Jetpack Glance (androidx.glance:glance-appwidget) and AppWidgetProvider receivers on Android 17 (API 37). Use this skill when configuring Android 17 (API level 37) compileSdk/targetSdk and AndroidManifest.xml widget receivers, refreshing frozen or stale Glance widget UI after CoroutineWorker DataStore preference updates (updateAppWidgetState), downsampling images within the WindowMetrics memory limit for SizeMode.Responsive, SizeMode.Exact, or LazyColumn, sharing content:// URIs with FileProvider, or fixing ActionCallback NoSuchMethodException and AppWidgetProvider ForegroundServiceStartNotAllowedException crashes with WorkManager. Don't use for Glance layout templates (suggest the glance-canonical-layouts skill) or in-app Compose screens.

**Upstream:** [`android/skills/system/glance-appwidget-updates-and-memory`](https://github.com/android/skills/tree/main/system/glance-appwidget-updates-and-memory) — mirrored and split into a one-plugin-per-skill layout so you can install skills individually. Auto-synced daily from upstream; the SKILL.md is Google-authored.

## Install

```bash
/plugin install android-glance-appwidget-updates-and-memory@premex-plugins
```

## What's in the box

- `skills/glance-appwidget-updates-and-memory/SKILL.md` — the skill definition
- `skills/glance-appwidget-updates-and-memory/references/` — supporting docs referenced from the skill
- `LICENSE.txt` — upstream Apache-2.0 license text

## Why this repo instead of cloning upstream?

The [top-level README](../../README.md#-android----googles-official-android-agent-skills) explains the rationale in detail. In short: upstream ships one monolithic repo of skills; this repo splits them into individually-installable plugins and auto-syncs daily.

## License

Apache-2.0 — see [`LICENSE.txt`](LICENSE.txt). The skill content is Google-authored; this directory is a packaging wrapper maintained by the Premex marketplace sync.
