# android-camera1-to-camerax

> Use this skill to migrate legacy Android camera implementations (Camera1 or raw Camera2 APIs) to CameraX. CameraX is a lifecycle-aware Jetpack library built on top of Camera2 that resolves camera rotation issues and handles device dependencies.

**Upstream:** [`android/skills/camera/camera1-to-camerax`](https://github.com/android/skills/tree/main/camera/camera1-to-camerax) — mirrored and split into a one-plugin-per-skill layout so you can install skills individually. Auto-synced daily from upstream; the SKILL.md is Google-authored.

## Install

```bash
/plugin install android-camera1-to-camerax@premex-plugins
```

## What's in the box

- `skills/camera1-to-camerax/SKILL.md` — the skill definition
- `LICENSE.txt` — upstream Apache-2.0 license text

## Why this repo instead of cloning upstream?

The [top-level README](../../README.md#-android----googles-official-android-agent-skills) explains the rationale in detail. In short: upstream ships one monolithic repo of skills; this repo splits them into individually-installable plugins and auto-syncs daily.

## License

Apache-2.0 — see [`LICENSE.txt`](LICENSE.txt). The skill content is Google-authored; this directory is a packaging wrapper maintained by the Premex marketplace sync.
