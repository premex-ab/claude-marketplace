# android-credential-verifier

> Request and verify digital credentials (such as ISO mdoc mobile driver's licenses and SD-JWT credentials) from a holder wallet in an Android app or WebView using Jetpack Credential Manager. Use this skill when building a digital credential verifier app in an Android project, constructing OpenID4VP (openid4vp-v1-unsigned) and Digital Credential Query Language (dcql_query) requests, calling CredentialManager.getCredential with GetDigitalCredentialOption, requesting multiple credentials simultaneously, or bridging WebView navigator.credentials.get requests with WebViewCompat.WebMessageListener. Don't use for holder wallet registration, issuing credentials over OpenID4VCI, passkeys, or carrier TS.43 phone number verification.

**Upstream:** [`android/skills/identity/digital-credentials/credential-verifier`](https://github.com/android/skills/tree/main/identity/digital-credentials/credential-verifier) — mirrored and split into a one-plugin-per-skill layout so you can install skills individually. Auto-synced daily from upstream; the SKILL.md is Google-authored.

## Install

```bash
/plugin install android-credential-verifier@premex-plugins
```

## What's in the box

- `skills/credential-verifier/SKILL.md` — the skill definition
- `skills/credential-verifier/references/` — supporting docs referenced from the skill
- `LICENSE.txt` — upstream Apache-2.0 license text

## Why this repo instead of cloning upstream?

The [top-level README](../../README.md#-android----googles-official-android-agent-skills) explains the rationale in detail. In short: upstream ships one monolithic repo of skills; this repo splits them into individually-installable plugins and auto-syncs daily.

## License

Apache-2.0 — see [`LICENSE.txt`](LICENSE.txt). The skill content is Google-authored; this directory is a packaging wrapper maintained by the Premex marketplace sync.
