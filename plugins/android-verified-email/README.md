# android-verified-email

> Provides a complete workflow for implementing verified email retrieval on Android Credential Manager API. Use this skill to integrate a secure, OTP-less email verification flow into an Android app. This skill solves the problem of high-friction sign-up processes by leveraging cryptographically verified credentials from trusted providers like Google.

**Upstream:** [`android/skills/identity/verified-email`](https://github.com/android/skills/tree/main/identity/verified-email) — mirrored and split into a one-plugin-per-skill layout so you can install skills individually. Auto-synced daily from upstream; the SKILL.md is Google-authored.

## Install

```bash
/plugin install android-verified-email@premex-plugins
```

## What's in the box

- `skills/verified-email/SKILL.md` — the skill definition
- `skills/verified-email/references/` — supporting docs referenced from the skill
- `LICENSE.txt` — upstream Apache-2.0 license text

## Why this repo instead of cloning upstream?

The [top-level README](../../README.md#-android----googles-official-android-agent-skills) explains the rationale in detail. In short: upstream ships one monolithic repo of skills; this repo splits them into individually-installable plugins and auto-syncs daily.

## License

Apache-2.0 — see [`LICENSE.txt`](LICENSE.txt). The skill content is Google-authored; this directory is a packaging wrapper maintained by the Premex marketplace sync.
