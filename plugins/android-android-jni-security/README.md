# android-android-jni-security

> Audits, detects, and remediates Android JNI and native C/C++ boundary security vulnerabilities. Use this skill when reviewing, auditing, hardening, or securing Android JNI boundaries, Kotlin external or Java native methods, and C/C++ shared libraries (System.loadLibrary) against buffer overflow, memory pinning, Time-of-Check to Time-of-Use (TOCTOU) file path races, hardcoded C++ cryptographic keys, cross-thread JNI reference and session callback lifecycles, or unhandled pending JVM exceptions and local reference leaks. Don't use for pure managed Kotlin or Java code without native JNI bindings or general reverse-engineering of stripped binaries.

**Upstream:** [`android/skills/security/android-jni-security`](https://github.com/android/skills/tree/main/security/android-jni-security) — mirrored and split into a one-plugin-per-skill layout so you can install skills individually. Auto-synced daily from upstream; the SKILL.md is Google-authored.

## Install

```bash
/plugin install android-android-jni-security@premex-plugins
```

## What's in the box

- `skills/android-jni-security/SKILL.md` — the skill definition
- `skills/android-jni-security/references/` — supporting docs referenced from the skill
- `LICENSE.txt` — upstream Apache-2.0 license text

## Why this repo instead of cloning upstream?

The [top-level README](../../README.md#-android----googles-official-android-agent-skills) explains the rationale in detail. In short: upstream ships one monolithic repo of skills; this repo splits them into individually-installable plugins and auto-syncs daily.

## License

Apache-2.0 — see [`LICENSE.txt`](LICENSE.txt). The skill content is Google-authored; this directory is a packaging wrapper maintained by the Premex marketplace sync.
