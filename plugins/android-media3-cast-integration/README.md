# android-media3-cast-integration

> Implements Google Cast support in Android apps using Jetpack Media3. Handles adding build dependencies, updating manifest, configuring OptionsProvider, and managing CastPlayer or RemoteCastPlayer for playback in both Compose and View-based UIs. Use when adding Cast functionality or migrating from legacy Cast SDK to Media3 Cast.

**Upstream:** [`android/skills/media/media3-cast-integration`](https://github.com/android/skills/tree/main/media/media3-cast-integration) — mirrored and split into a one-plugin-per-skill layout so you can install skills individually. Auto-synced daily from upstream; the SKILL.md is Google-authored.

## Install

```bash
/plugin install android-media3-cast-integration@premex-plugins
```

## What's in the box

- `skills/media3-cast-integration/SKILL.md` — the skill definition
- `skills/media3-cast-integration/references/` — supporting docs referenced from the skill
- `LICENSE.txt` — upstream Apache-2.0 license text

## Why this repo instead of cloning upstream?

The [top-level README](../../README.md#-android----googles-official-android-agent-skills) explains the rationale in detail. In short: upstream ships one monolithic repo of skills; this repo splits them into individually-installable plugins and auto-syncs daily.

## License

Apache-2.0 — see [`LICENSE.txt`](LICENSE.txt). The skill content is Google-authored; this directory is a packaging wrapper maintained by the Premex marketplace sync.
