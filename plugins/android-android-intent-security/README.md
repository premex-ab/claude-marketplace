# android-android-intent-security

> Best practices for Android Intent security. Use this skill when auditing component configurations in AndroidManifest.xml activities, services, receivers) or source code handling incoming Intents (getIntent, getParcelableExtra) to prevent Intent Redirection and unauthorized access.

**Upstream:** [`android/skills/security/android-intent-security`](https://github.com/android/skills/tree/main/security/android-intent-security) — mirrored and split into a one-plugin-per-skill layout so you can install skills individually. Auto-synced daily from upstream; the SKILL.md is Google-authored.

## Install

```bash
/plugin install android-android-intent-security@premex-plugins
```

## What's in the box

- `skills/android-intent-security/SKILL.md` — the skill definition
- `LICENSE.txt` — upstream Apache-2.0 license text

## Why this repo instead of cloning upstream?

The [top-level README](../../README.md#-android----googles-official-android-agent-skills) explains the rationale in detail. In short: upstream ships one monolithic repo of skills; this repo splits them into individually-installable plugins and auto-syncs daily.

## License

Apache-2.0 — see [`LICENSE.txt`](LICENSE.txt). The skill content is Google-authored; this directory is a packaging wrapper maintained by the Premex marketplace sync.
