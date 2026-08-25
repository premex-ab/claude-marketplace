# android-restore-credentials

> Provides knowledge and workflows to implement Android's Restore Credentials feature using the androidx.credentials library. Use this skill to create, sign in with, and delete restore keys, enabling silent user sign-in on new devices after a restore. It covers version compatibility, dependencies, server-side prerequisites, and the complete client-side implementation for creating, retrieving, and clearing restore keys.

**Upstream:** [`android/skills/identity/restore-credentials`](https://github.com/android/skills/tree/main/identity/restore-credentials) — mirrored and split into a one-plugin-per-skill layout so you can install skills individually. Auto-synced daily from upstream; the SKILL.md is Google-authored.

## Install

```bash
/plugin install android-restore-credentials@premex-plugins
```

## What's in the box

- `skills/restore-credentials/SKILL.md` — the skill definition
- `skills/restore-credentials/references/` — supporting docs referenced from the skill
- `LICENSE.txt` — upstream Apache-2.0 license text

## Why this repo instead of cloning upstream?

The [top-level README](../../README.md#-android----googles-official-android-agent-skills) explains the rationale in detail. In short: upstream ships one monolithic repo of skills; this repo splits them into individually-installable plugins and auto-syncs daily.

## License

Apache-2.0 — see [`LICENSE.txt`](LICENSE.txt). The skill content is Google-authored; this directory is a packaging wrapper maintained by the Premex marketplace sync.
