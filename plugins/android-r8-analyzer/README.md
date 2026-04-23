# android-r8-analyzer

> Analyzes Android build files and R8 keep rules to identify redundancies, broad package-wide rules, and rules that subsume library consumer keep rules. Use when developers want to optimize their app's size, remove redundant or overly broad keep rules, or troubleshoot Proguard configurations.

**Upstream:** [`android/skills/performance/r8-analyzer`](https://github.com/android/skills/tree/main/performance/r8-analyzer) — mirrored and split into a one-plugin-per-skill layout so you can install skills individually. Auto-synced daily from upstream; the SKILL.md is Google-authored.

## Install

```bash
/plugin install android-r8-analyzer@premex-plugins
```

## What's in the box

- `skills/r8-analyzer/SKILL.md` — the skill definition
- `skills/r8-analyzer/references/` — supporting docs referenced from the skill
- `LICENSE.txt` — upstream Apache-2.0 license text

## Why this repo instead of cloning upstream?

The [top-level README](../../README.md#-android----googles-official-android-agent-skills) explains the rationale in detail. In short: upstream ships one monolithic repo of skills; this repo splits them into individually-installable plugins and auto-syncs daily.

## License

Apache-2.0 — see [`LICENSE.txt`](LICENSE.txt). The skill content is Google-authored; this directory is a packaging wrapper maintained by the Premex marketplace sync.
