# 🧩 Premex Claude Code Plugins

**A curated marketplace of plugins for [Claude Code](https://claude.com/claude-code)** — practical skills and utilities we use at [Premex](https://github.com/premex-ab) every day, open-sourced so you can use them too.

⚡ Two commands and you're in:

```bash
/plugin marketplace add premex-ab/claude-marketplace
/plugin install <plugin-name>@premex-plugins
```

---

## 📦 What's inside

### 🤖 android-skills — Google's official Android agent skills, always fresh

Every skill in the [android/skills](https://github.com/android/skills) catalog, live in Claude Code. Google ships these as open-standard [agent skills](https://agentskills.io/home) covering the hard parts of modern Android development — we mirror them here so you install once and forget about it.

| Skill | What it does for you |
|---|---|
| 🛠️ **agp-9-upgrade** | Migrates your project to Android Gradle Plugin 9 — breaking changes, built-in Kotlin, KSP/KAPT, the works. |
| 🎨 **migrate-xml-views-to-jetpack-compose** | Step-by-step XML → Jetpack Compose migration, theme mapping and View interop included. |
| 🧭 **navigation-3** | Jetpack Navigation 3 recipes: deep links, multiple backstacks, scenes, Hilt/ViewModel integration, returning results. |
| 🪓 **r8-analyzer** | Finds redundant R8/Proguard keep rules and overly broad package-wide rules. Slims your APK. |
| 💳 **play-billing-library-version-upgrade** | Any legacy Google Play Billing Library version → latest stable, with migration logic pre-mapped. |
| 📱 **edge-to-edge** | Fixes status/nav bar overlap, IME insets, and system bar legibility — all the adaptive UI gotchas. |

```bash
/plugin install android-skills@premex-plugins
```

**🔄 Why install ours instead of cloning upstream?** A GitHub Actions workflow in this repo pulls `android/skills` every day, flattens it into the directory layout Claude Code's plugin loader expects, validates every SKILL.md, and opens an auto-merging PR if anything changed. Upstream ships new skills → you get them on your next `/plugin marketplace update`. Zero maintenance on our side or yours.

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

*Built at [Premex](https://github.com/premex-ab) 🇸🇪. [Claude Code](https://claude.com/claude-code) is Anthropic's terminal-native agentic coder.*
