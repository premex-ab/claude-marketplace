# android-appfunctions

> Analyzes Android apps to find user workflows to expose as AppFunctions, such as creating a note, playing media, or sending a message. AI agents, voice commands, and system shortcuts then run them without opening the app UI. Generates Kotlin code with the androidx.appfunctions library, and refines KDoc and the app description so that agents choose and call functions correctly. Use this skill when discovering, implementing, documenting, testing, or upgrading AppFunctions in an Android app, including @AppFunctionDeclaration, @AppFunctionSerializable, @AppFunctionServiceEntryPoint, AppFunctionService, app_metadata.xml, appfn:instructions, adb shell cmd app_function, and legacy @AppFunction or AppFunctionConfiguration.Provider code. Don't use for building agents that call AppFunctions or for remote MCP servers.

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
