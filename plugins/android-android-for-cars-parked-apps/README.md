# android-android-for-cars-parked-apps

> Adapt existing Android video streaming apps, games, and web browsers to run as parked apps on Android Auto and Android Automotive OS. Covers manifest configuration, Google Play hardware feature declarations, compatibility mode, back navigation affordances, orientation and display continuity, controllable system bar insets, irregular display cutouts, driver distraction lifecycle handling, MediaSession playback restrictions with CarUxRestrictionsManager, background audio while driving, and browser sensitive data protection. Use this skill when migrating, building, or auditing parked apps for cars to meet Car App Quality guidelines. Don't use for media audio apps, templated Car App Library navigation, point of interest, internet of things, weather, or communication apps designed for use while driving.

**Upstream:** [`android/skills/cars/android-for-cars-parked-apps`](https://github.com/android/skills/tree/main/cars/android-for-cars-parked-apps) — mirrored and split into a one-plugin-per-skill layout so you can install skills individually. Auto-synced daily from upstream; the SKILL.md is Google-authored.

## Install

```bash
/plugin install android-android-for-cars-parked-apps@premex-plugins
```

## What's in the box

- `skills/android-for-cars-parked-apps/SKILL.md` — the skill definition
- `skills/android-for-cars-parked-apps/references/` — supporting docs referenced from the skill
- `LICENSE.txt` — upstream Apache-2.0 license text

## Why this repo instead of cloning upstream?

The [top-level README](../../README.md#-android----googles-official-android-agent-skills) explains the rationale in detail. In short: upstream ships one monolithic repo of skills; this repo splits them into individually-installable plugins and auto-syncs daily.

## License

Apache-2.0 — see [`LICENSE.txt`](LICENSE.txt). The skill content is Google-authored; this directory is a packaging wrapper maintained by the Premex marketplace sync.
