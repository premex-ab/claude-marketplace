# 🧩 Premex Claude Code Plugins

**A curated marketplace of plugins for [Claude Code](https://claude.com/claude-code)** — practical skills and utilities we use at [Premex](https://github.com/premex-ab) every day, open-sourced so you can use them too.

⚡ Two commands and you're in:

```bash
/plugin marketplace add premex-ab/claude-marketplace
/plugin install <plugin-name>@premex-plugins
```

---

## 📦 What's inside

### 🤖 android-* — Google's official Android agent skills, one plugin at a time

Every skill in the [android/skills](https://github.com/android/skills) catalog, shipped as **individually installable plugins** so you only pay for what you use. Google publishes these as open-standard [agent skills](https://agentskills.io/home) covering the hard parts of modern Android development — we mirror, split, and auto-update them.

| Plugin | What it does for you |
|---|---|
| 🛠️ **android-agp-9-upgrade** | Migrates your project to Android Gradle Plugin 9 — breaking changes, built-in Kotlin, KSP/KAPT, the works. |
| 🎨 **android-migrate-xml-views-to-jetpack-compose** | Step-by-step XML → Jetpack Compose migration, theme mapping and View interop included. |
| 🧭 **android-navigation-3** | Jetpack Navigation 3 recipes: deep links, multiple backstacks, scenes, Hilt/ViewModel integration, returning results. |
| 🪓 **android-r8-analyzer** | Finds redundant R8/Proguard keep rules and overly broad package-wide rules. Slims your APK. |
| 💳 **android-play-billing-library-version-upgrade** | Any legacy Google Play Billing Library version → latest stable, with migration logic pre-mapped. |
| 📱 **android-edge-to-edge** | Fixes status/nav bar overlap, IME insets, and system bar legibility — all the adaptive UI gotchas. |

Install only what you need:

```bash
/plugin install android-edge-to-edge@premex-plugins
/plugin install android-navigation-3@premex-plugins
# …or any other android-* plugin from the list above
```

**🔄 Why install ours instead of cloning upstream?** A GitHub Actions workflow in this repo pulls `android/skills` every day, splits each SKILL.md into its own plugin, regenerates the marketplace manifest, and opens an auto-merging PR if anything changed. Upstream ships a new skill → a new plugin lands in your next `/plugin marketplace update`. Zero maintenance on our side or yours. *Why split?* Claude Code [currently locks skill toggling to the plugin level](https://github.com/anthropics/claude-code/issues/40789) — one-plugin-per-skill is the only way to let you activate skills individually.

### 🚀 android-cli-setup — bootstrap Google's agent-first Android CLI

Google [shipped a new `android` CLI in April 2026](https://android-developers.googleblog.com/2026/04/build-android-apps-3x-faster-using-any-agent.html) — ~70% fewer tokens and ~3x faster than driving the legacy `sdkmanager` / `avdmanager` / `adb` toolchain. This plugin gets it onto your machine (and your CI runners), keeps it fresh forever, and hands off to Google's bundled skill once setup is done.

| Ships with | What you get |
|---|---|
| 🌱 **android-cli-setup** skill | One-time install of the `android` CLI into `~/.local/bin` (no sudo needed), runs `android init` to deposit Google's official `android-cli` skill into `~/.claude/skills/`, hands off. |
| 🔁 **SessionStart hook** | Background refresh throttled to once per 24h — your CLI and bundled skill stay current without you ever running `android update` manually. |
| ⚙️ **android-cli-ci** skill | Working reference workflows for GitHub Actions, GitLab CI, CircleCI, Bitrise, Jenkins, Buildkite, and self-hosted runners — plus a side-by-side migration guide from `sdkmanager` + cmdline-tools setups you probably have today. |
| 🛠️ **Slash commands** | `/android-cli-status`, `/android-cli-update`, `/android-cli-reset` for inspection and manual control. |

```bash
/plugin install android-cli-setup@premex-plugins
```

> 💬 *"set up the android CLI on my laptop"* → plugin bootstraps, then Google's skill takes over.
> 💬 *"migrate our GitHub Actions workflow away from sdkmanager"* → CI skill with a ready-to-paste replacement.

### 🤝 github-utils — Dependabot management in plain English

Talk to Claude like a human; it talks to Dependabot for you.

> 💬 *"rebase all dependabot PRs"*
> 💬 *"ignore the major version on #123"*
> 💬 *"show ignore conditions for lodash"*

Claude maps your intent to the right `@dependabot` command and posts it via the `gh` CLI. No more memorizing syntax, no more per-PR commenting.

```bash
/plugin install github-utils@premex-plugins
```

---

## 💡 Why this marketplace exists

Because good skills deserve distribution, and spinning up a Claude Code plugin marketplace is surprisingly cheap — a `.claude-plugin/marketplace.json`, a `plugin.json` per plugin, and you're in business. If you're building on top of Claude Code, consider publishing your own.

## 🙋 Requests, issues, contributions

Open an [issue](https://github.com/premex-ab/claude-marketplace/issues). We're a small team with opinions, but useful suggestions land fast.

## 📄 License

Marketplace wrapper and Premex-authored plugins are free to use. Third-party skills shipped here (e.g. `android-skills`) carry their own upstream licenses — see the plugin directory for details (Apache-2.0 for `android-skills`).

---

*Built at [Premex](https://github.com/premex-ab) 🇸🇪.*
