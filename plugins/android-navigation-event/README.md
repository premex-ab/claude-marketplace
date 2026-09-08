# android-navigation-event

> Intercept back gestures and run Predictive Back animations using the NavigationEvent (androidx.navigationevent) library in Compose Android. Handles Activity setup, parent-child dispatcher scoping in `ViewPagers` or tabs, Compose `NavigationBackHandler`, and migration from legacy `BackHandler` on SDK 36+.

**Upstream:** [`android/skills/navigation/navigation-event`](https://github.com/android/skills/tree/main/navigation/navigation-event) — mirrored and split into a one-plugin-per-skill layout so you can install skills individually. Auto-synced daily from upstream; the SKILL.md is Google-authored.

## Install

```bash
/plugin install android-navigation-event@premex-plugins
```

## What's in the box

- `skills/navigation-event/SKILL.md` — the skill definition
- `skills/navigation-event/references/` — supporting docs referenced from the skill
- `LICENSE.txt` — upstream Apache-2.0 license text

## Why this repo instead of cloning upstream?

The [top-level README](../../README.md#-android----googles-official-android-agent-skills) explains the rationale in detail. In short: upstream ships one monolithic repo of skills; this repo splits them into individually-installable plugins and auto-syncs daily.

## License

Apache-2.0 — see [`LICENSE.txt`](LICENSE.txt). The skill content is Google-authored; this directory is a packaging wrapper maintained by the Premex marketplace sync.
