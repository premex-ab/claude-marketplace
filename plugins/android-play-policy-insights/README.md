# android-play-policy-insights

> Automated auditor designed to verify Android applications against Google Play Policy domains. It cross-references static code analysis with Play Store declarations to generate deterministic compliance reports, identifying undeclared data collection, architectural risks, and missing disclosures across Permissions and APIs Hygiene, User Account and Identity, and Data Safety and Privacy domains.

**Upstream:** [`android/skills/play/play-policy-insights`](https://github.com/android/skills/tree/main/play/play-policy-insights) — mirrored and split into a one-plugin-per-skill layout so you can install skills individually. Auto-synced daily from upstream; the SKILL.md is Google-authored.

## Install

```bash
/plugin install android-play-policy-insights@premex-plugins
```

## What's in the box

- `skills/play-policy-insights/SKILL.md` — the skill definition
- `LICENSE.txt` — upstream Apache-2.0 license text

## Why this repo instead of cloning upstream?

The [top-level README](../../README.md#-android----googles-official-android-agent-skills) explains the rationale in detail. In short: upstream ships one monolithic repo of skills; this repo splits them into individually-installable plugins and auto-syncs daily.

## License

Apache-2.0 — see [`LICENSE.txt`](LICENSE.txt). The skill content is Google-authored; this directory is a packaging wrapper maintained by the Premex marketplace sync.
