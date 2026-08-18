# android-android-profiler

> Manages Android performance profiling and debugging. Triggers when the user asks to record or analyze Android performance data, such as system traces, heap dumps, method recordings, callstack samples, memory allocations, or investigate bottlenecks, jank, memory leaks, and app startup issues on Android, or when the user asks to write, debug, or execute ad-hoc SQL queries. Applies to both user and system apps or services.

**Upstream:** [`android/skills/profilers/android-profiler`](https://github.com/android/skills/tree/main/profilers/android-profiler) — mirrored and split into a one-plugin-per-skill layout so you can install skills individually. Auto-synced daily from upstream; the SKILL.md is Google-authored.

## Install

```bash
/plugin install android-android-profiler@premex-plugins
```

## What's in the box

- `skills/android-profiler/SKILL.md` — the skill definition
- `skills/android-profiler/references/` — supporting docs referenced from the skill
- `LICENSE.txt` — upstream Apache-2.0 license text

## Why this repo instead of cloning upstream?

The [top-level README](../../README.md#-android----googles-official-android-agent-skills) explains the rationale in detail. In short: upstream ships one monolithic repo of skills; this repo splits them into individually-installable plugins and auto-syncs daily.

## License

Apache-2.0 — see [`LICENSE.txt`](LICENSE.txt). The skill content is Google-authored; this directory is a packaging wrapper maintained by the Premex marketplace sync.
