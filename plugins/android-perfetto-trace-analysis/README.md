# android-perfetto-trace-analysis

> Analyzes Perfetto traces to find the root cause of latency, memory, or jank issues in Android apps. Use when the user provides a Perfetto trace file and asks any question, ongoing investigation, or open-ended request to analyze its contents.

**Upstream:** [`android/skills/profilers/perfetto-trace-analysis`](https://github.com/android/skills/tree/main/profilers/perfetto-trace-analysis) — mirrored and split into a one-plugin-per-skill layout so you can install skills individually. Auto-synced daily from upstream; the SKILL.md is Google-authored.

## Install

```bash
/plugin install android-perfetto-trace-analysis@premex-plugins
```

## What's in the box

- `skills/perfetto-trace-analysis/SKILL.md` — the skill definition
- `skills/perfetto-trace-analysis/references/` — supporting docs referenced from the skill
- `LICENSE.txt` — upstream Apache-2.0 license text

## Why this repo instead of cloning upstream?

The [top-level README](../../README.md#-android----googles-official-android-agent-skills) explains the rationale in detail. In short: upstream ships one monolithic repo of skills; this repo splits them into individually-installable plugins and auto-syncs daily.

## License

Apache-2.0 — see [`LICENSE.txt`](LICENSE.txt). The skill content is Google-authored; this directory is a packaging wrapper maintained by the Premex marketplace sync.
