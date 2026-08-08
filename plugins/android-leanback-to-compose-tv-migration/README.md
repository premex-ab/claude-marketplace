# android-leanback-to-compose-tv-migration

> Provides instructions and architectural patterns for migrating Android TV applications from legacy Leanback UI Toolkit, Android Views, or Support Fragments to Jetpack Compose for TV (androidx.tv). Use this skill for Leanback to Compose migrations, including browse screen, settings screen, authentication screen, login screen, or video playback screen migrations, or when replacing BrowseSupportFragment, LeanbackSettingsFragment, PreferenceFragment, BaseLeanbackPreferenceFragmentCompat, VideoSupportFragment, GuidedStepSupportFragment, SearchSupportFragment, VerticalGridSupportFragment, Presenter, ArrayObjectAdapter, or CursorMapper with modern Compose equivalents, implementing immersive carousels with focus memory, Media3 video playback with PlayerSurface, or custom 10-foot hero layouts.

**Upstream:** [`android/skills/tv/leanback-to-compose-tv-migration`](https://github.com/android/skills/tree/main/tv/leanback-to-compose-tv-migration) — mirrored and split into a one-plugin-per-skill layout so you can install skills individually. Auto-synced daily from upstream; the SKILL.md is Google-authored.

## Install

```bash
/plugin install android-leanback-to-compose-tv-migration@premex-plugins
```

## What's in the box

- `skills/leanback-to-compose-tv-migration/SKILL.md` — the skill definition
- `skills/leanback-to-compose-tv-migration/references/` — supporting docs referenced from the skill
- `LICENSE.txt` — upstream Apache-2.0 license text

## Why this repo instead of cloning upstream?

The [top-level README](../../README.md#-android----googles-official-android-agent-skills) explains the rationale in detail. In short: upstream ships one monolithic repo of skills; this repo splits them into individually-installable plugins and auto-syncs daily.

## License

Apache-2.0 — see [`LICENSE.txt`](LICENSE.txt). The skill content is Google-authored; this directory is a packaging wrapper maintained by the Premex marketplace sync.
