# android-anr-audit-and-fix

> Audits Android codebases for ANR risks and diagnoses ANR stack dumps. Use this skill when scanning Android code for ANR risks or triaging ANR stack dumps. Don't use for non-ANR crashes, dropped frames, general CPU profiling, or Perfetto system traces.

**Upstream:** [`android/skills/performance/anr-audit-and-fix`](https://github.com/android/skills/tree/main/performance/anr-audit-and-fix) — mirrored and split into a one-plugin-per-skill layout so you can install skills individually. Auto-synced daily from upstream; the SKILL.md is Google-authored.

## Install

```bash
/plugin install android-anr-audit-and-fix@premex-plugins
```

## What's in the box

- `skills/anr-audit-and-fix/SKILL.md` — the skill definition
- `skills/anr-audit-and-fix/references/` — supporting docs referenced from the skill
- `LICENSE.txt` — upstream Apache-2.0 license text

## Why this repo instead of cloning upstream?

The [top-level README](../../README.md#-android----googles-official-android-agent-skills) explains the rationale in detail. In short: upstream ships one monolithic repo of skills; this repo splits them into individually-installable plugins and auto-syncs daily.

## License

Apache-2.0 — see [`LICENSE.txt`](LICENSE.txt). The skill content is Google-authored; this directory is a packaging wrapper maintained by the Premex marketplace sync.
