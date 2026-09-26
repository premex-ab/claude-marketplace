# android-android-permissions-security

> Audits, detects gaps, and remediates Android permissions and IPC component security vulnerabilities. Use when reviewing AndroidManifest.xml, defining custom permissions, securing Services, Receivers, and Providers, verifying caller signatures and UID using Binder, or implementing runtime permission flows.

**Upstream:** [`android/skills/security/android-permissions-security`](https://github.com/android/skills/tree/main/security/android-permissions-security) — mirrored and split into a one-plugin-per-skill layout so you can install skills individually. Auto-synced daily from upstream; the SKILL.md is Google-authored.

## Install

```bash
/plugin install android-android-permissions-security@premex-plugins
```

## What's in the box

- `skills/android-permissions-security/SKILL.md` — the skill definition
- `skills/android-permissions-security/references/` — supporting docs referenced from the skill
- `LICENSE.txt` — upstream Apache-2.0 license text

## Why this repo instead of cloning upstream?

The [top-level README](../../README.md#-android----googles-official-android-agent-skills) explains the rationale in detail. In short: upstream ships one monolithic repo of skills; this repo splits them into individually-installable plugins and auto-syncs daily.

## License

Apache-2.0 — see [`LICENSE.txt`](LICENSE.txt). The skill content is Google-authored; this directory is a packaging wrapper maintained by the Premex marketplace sync.
