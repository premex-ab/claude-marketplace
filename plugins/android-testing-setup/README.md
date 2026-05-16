# android-testing-setup

> Analyze and create a testing strategy for native Android apps - install testing libraries, set up test infrastructure, create harnesses for unit tests, UI tests, screenshot tests, and end-to-end tests.

**Upstream:** [`android/skills/testing/testing-setup`](https://github.com/android/skills/tree/main/testing/testing-setup) — mirrored and split into a one-plugin-per-skill layout so you can install skills individually. Auto-synced daily from upstream; the SKILL.md is Google-authored.

## Install

```bash
/plugin install android-testing-setup@premex-plugins
```

## What's in the box

- `skills/testing-setup/SKILL.md` — the skill definition
- `skills/testing-setup/references/` — supporting docs referenced from the skill
- `LICENSE.txt` — upstream Apache-2.0 license text

## Why this repo instead of cloning upstream?

The [top-level README](../../README.md#-android----googles-official-android-agent-skills) explains the rationale in detail. In short: upstream ships one monolithic repo of skills; this repo splits them into individually-installable plugins and auto-syncs daily.

## License

Apache-2.0 — see [`LICENSE.txt`](LICENSE.txt). The skill content is Google-authored; this directory is a packaging wrapper maintained by the Premex marketplace sync.
