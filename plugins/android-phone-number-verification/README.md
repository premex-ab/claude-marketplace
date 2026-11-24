# android-phone-number-verification

> Verify user phone numbers without SMS in an Android app using the Credential Manager DigitalCredential API, OpenID4VP, and carrier-issued TS.43 tokens. Use this skill whenever the user asks to verify phone numbers without SMS, implement carrier-based phone number verification in an Android project, perform a TelephonyManager.getSimCarrierId carrier precheck, or request a TS.43 Digital Credential using CredentialManager, GetDigitalCredentialOption, GetCredentialRequest, DigitalCredential, and dc-authorization+sd-jwt DCQL queries. Produces Android client-side carrier precheck and Credential Manager TS.43 token request code alongside backend OpenID4VP and DCQL request construction and token exchange logic. Don't use for SMS OTP, TelephonyManager.getLine1Number reads, digital wallet holder registration, or issuing credentials to wallets.

**Upstream:** [`android/skills/identity/digital-credentials/phone-number-verification`](https://github.com/android/skills/tree/main/identity/digital-credentials/phone-number-verification) — mirrored and split into a one-plugin-per-skill layout so you can install skills individually. Auto-synced daily from upstream; the SKILL.md is Google-authored.

## Install

```bash
/plugin install android-phone-number-verification@premex-plugins
```

## What's in the box

- `skills/phone-number-verification/SKILL.md` — the skill definition
- `skills/phone-number-verification/references/` — supporting docs referenced from the skill
- `LICENSE.txt` — upstream Apache-2.0 license text

## Why this repo instead of cloning upstream?

The [top-level README](../../README.md#-android----googles-official-android-agent-skills) explains the rationale in detail. In short: upstream ships one monolithic repo of skills; this repo splits them into individually-installable plugins and auto-syncs daily.

## License

Apache-2.0 — see [`LICENSE.txt`](LICENSE.txt). The skill content is Google-authored; this directory is a packaging wrapper maintained by the Premex marketplace sync.
