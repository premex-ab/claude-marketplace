# android-credential-issuer

> Issue digital credentials to user holder wallets from an Android issuer app over OpenID4VCI using Jetpack Credential Manager and hardware-backed Android Keystore attestation. Use this skill when building an Android credential issuer app, provisioning credentials to wallets with CreateDigitalCredentialRequest and CredentialManager.createCredential, constructing OpenID4VCI (openid4vci-v1) credential offer JSON payloads, or configuring and validating android_keystore_attestation certificate chains and c_nonce challenges. Don't use for holder wallet registration (RegistryManager), requesting credentials as a verifier (GetDigitalCredentialOption), passkeys, or carrier TS.43 phone number verification.

**Upstream:** [`android/skills/identity/digital-credentials/credential-issuer`](https://github.com/android/skills/tree/main/identity/digital-credentials/credential-issuer) — mirrored and split into a one-plugin-per-skill layout so you can install skills individually. Auto-synced daily from upstream; the SKILL.md is Google-authored.

## Install

```bash
/plugin install android-credential-issuer@premex-plugins
```

## What's in the box

- `skills/credential-issuer/SKILL.md` — the skill definition
- `skills/credential-issuer/references/` — supporting docs referenced from the skill
- `LICENSE.txt` — upstream Apache-2.0 license text

## Why this repo instead of cloning upstream?

The [top-level README](../../README.md#-android----googles-official-android-agent-skills) explains the rationale in detail. In short: upstream ships one monolithic repo of skills; this repo splits them into individually-installable plugins and auto-syncs daily.

## License

Apache-2.0 — see [`LICENSE.txt`](LICENSE.txt). The skill content is Google-authored; this directory is a packaging wrapper maintained by the Premex marketplace sync.
