# android-android-profiler

> Records and analyzes Android performance data and diagnoses performance bottlenecks across user apps, system apps, and system services, even if the user does not explicitly mention profiling or traces. Use when: recording system traces, CPU call stacks, Vulkan GPU/DRM memory, or Java/native heap profiles; analyzing Perfetto traces for UI jank, frame drops, ANRs, or app startup latency issues; investigating CPU bottlenecks, IPC/Binder storms, or thread scheduling stalls; diagnosing battery drain, modem power rails, and kernel wake locks; debugging memory pressure, Low Memory Kills (LMK), OOMs, leaks, and allocation churn; performing A/B baseline trace comparisons to find regressions; executing ad hoc PerfettoSQL queries on Android traces.

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
