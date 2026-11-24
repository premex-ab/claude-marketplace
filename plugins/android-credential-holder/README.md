# android-credential-holder

> Implement digital credential holder (wallet) registration, presentation, and issuance handling in an Android app using the Jetpack Credential Manager Registry API. Use this skill when building a digital wallet or holder app in an Android project, registering SD-JWT or mdoc credential metadata with RegistryManager and OpenId4VpRegistry, configuring inline issuance entries, registering OpenID4VCI creation options with RegisterCreationOptionsRequest, or handling GET_CREDENTIAL and CREATE_CREDENTIAL intents with PendingIntentHandler. Don't use for requesting credentials as a verifier, issuing credentials from an issuer app, passkeys, or carrier TS.43 phone number verification.

**Upstream:** [`android/skills/identity/digital-credentials/credential-holder`](https://github.com/android/skills/tree/main/identity/digital-credentials/credential-holder) — mirrored and split into a one-plugin-per-skill layout so you can install skills individually. Auto-synced daily from upstream; the SKILL.md is Google-authored.

## Install

```bash
/plugin install android-credential-holder@premex-plugins
```

## What's in the box

- `skills/credential-holder/SKILL.md` — the skill definition
- `skills/credential-holder/references/` — supporting docs referenced from the skill
- `LICENSE.txt` — upstream Apache-2.0 license text

## Why this repo instead of cloning upstream?

The [top-level README](../../README.md#-android----googles-official-android-agent-skills) explains the rationale in detail. In short: upstream ships one monolithic repo of skills; this repo splits them into individually-installable plugins and auto-syncs daily.

## License

Apache-2.0 — see [`LICENSE.txt`](LICENSE.txt). The skill content is Google-authored; this directory is a packaging wrapper maintained by the Premex marketplace sync.
