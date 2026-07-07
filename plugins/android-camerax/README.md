# android-camerax

> Provide technical guidance for Android camera development with CameraX. Use when implementing camera features, handling asynchronous recording lifecycles, wiring low-level hardware interop using CameraX, or integrating ML Kit or Media3 effects.

**Upstream:** [`android/skills/camera/camerax`](https://github.com/android/skills/tree/main/camera/camerax) — mirrored and split into a one-plugin-per-skill layout so you can install skills individually. Auto-synced daily from upstream; the SKILL.md is Google-authored.

## Install

```bash
/plugin install android-camerax@premex-plugins
```

## What's in the box

- `skills/camerax/SKILL.md` — the skill definition
- `skills/camerax/references/` — supporting docs referenced from the skill
- `LICENSE.txt` — upstream Apache-2.0 license text

## Why this repo instead of cloning upstream?

The [top-level README](../../README.md#-android----googles-official-android-agent-skills) explains the rationale in detail. In short: upstream ships one monolithic repo of skills; this repo splits them into individually-installable plugins and auto-syncs daily.

## License

Apache-2.0 — see [`LICENSE.txt`](LICENSE.txt). The skill content is Google-authored; this directory is a packaging wrapper maintained by the Premex marketplace sync.
