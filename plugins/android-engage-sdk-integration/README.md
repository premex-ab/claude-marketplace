# android-engage-sdk-integration

> Helps developers integrate, debug, and resolve Play Engage SDK implementation issues. Use when adding Engage SDK support, generating publishing code, mapping data classes to entities, or fixing SDK-related errors.

**Upstream:** [`android/skills/play/engage-sdk-integration`](https://github.com/android/skills/tree/main/play/engage-sdk-integration) — mirrored and split into a one-plugin-per-skill layout so you can install skills individually. Auto-synced daily from upstream; the SKILL.md is Google-authored.

## Install

```bash
/plugin install android-engage-sdk-integration@premex-plugins
```

## What's in the box

- `skills/engage-sdk-integration/SKILL.md` — the skill definition
- `skills/engage-sdk-integration/references/` — supporting docs referenced from the skill
- `LICENSE.txt` — upstream Apache-2.0 license text

## Why this repo instead of cloning upstream?

The [top-level README](../../README.md#-android----googles-official-android-agent-skills) explains the rationale in detail. In short: upstream ships one monolithic repo of skills; this repo splits them into individually-installable plugins and auto-syncs daily.

## License

Apache-2.0 — see [`LICENSE.txt`](LICENSE.txt). The skill content is Google-authored; this directory is a packaging wrapper maintained by the Premex marketplace sync.
