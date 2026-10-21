# android-projected-hardware

> Provides instructions and workflows for accessing and managing hardware on Android XR projected devices, such as audio glasses and display glasses. Use this skill when building experiences for intelligent eyewear in an Android app and you need to access device hardware like the camera and microphone, handle glasses-specific runtime permissions, or manage connection lifecycles using projected context.

**Upstream:** [`android/skills/xr/projected-hardware`](https://github.com/android/skills/tree/main/xr/projected-hardware) — mirrored and split into a one-plugin-per-skill layout so you can install skills individually. Auto-synced daily from upstream; the SKILL.md is Google-authored.

## Install

```bash
/plugin install android-projected-hardware@premex-plugins
```

## What's in the box

- `skills/projected-hardware/SKILL.md` — the skill definition
- `skills/projected-hardware/references/` — supporting docs referenced from the skill
- `LICENSE.txt` — upstream Apache-2.0 license text

## Why this repo instead of cloning upstream?

The [top-level README](../../README.md#-android----googles-official-android-agent-skills) explains the rationale in detail. In short: upstream ships one monolithic repo of skills; this repo splits them into individually-installable plugins and auto-syncs daily.

## License

Apache-2.0 — see [`LICENSE.txt`](LICENSE.txt). The skill content is Google-authored; this directory is a packaging wrapper maintained by the Premex marketplace sync.
