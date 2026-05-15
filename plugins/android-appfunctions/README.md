# android-appfunctions

> Analyzes Android apps to identify key user workflows for AppFunctions such as creating a note, playing media, or sending an automated or AI agent triggered message, voice commands, or system shortcuts, without needing to open the app UI. Generates Kotlin code to expose these workflows to the Android system, allowing agents to discover and execute them on-device. Also refines KDoc documentation to ensure AI agents correctly understand and use the provided functionality.

**Upstream:** [`android/skills/device-ai/appfunctions`](https://github.com/android/skills/tree/main/device-ai/appfunctions) — mirrored and split into a one-plugin-per-skill layout so you can install skills individually. Auto-synced daily from upstream; the SKILL.md is Google-authored.

## Install

```bash
/plugin install android-appfunctions@premex-plugins
```

## What's in the box

- `skills/appfunctions/SKILL.md` — the skill definition
- `skills/appfunctions/references/` — supporting docs referenced from the skill
- `LICENSE.txt` — upstream Apache-2.0 license text

## Why this repo instead of cloning upstream?

The [top-level README](../../README.md#-android----googles-official-android-agent-skills) explains the rationale in detail. In short: upstream ships one monolithic repo of skills; this repo splits them into individually-installable plugins and auto-syncs daily.

## License

Apache-2.0 — see [`LICENSE.txt`](LICENSE.txt). The skill content is Google-authored; this directory is a packaging wrapper maintained by the Premex marketplace sync.
