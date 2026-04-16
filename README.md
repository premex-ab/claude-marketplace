# 🧩 Premex Claude Code Plugins

**A curated marketplace of plugins for [Claude Code](https://claude.com/claude-code)** — practical skills and utilities we use at [Premex](https://github.com/premex-ab) every day, open-sourced so you can use them too.

⚡ Two commands and you're in:

```bash
/plugin marketplace add premex-ab/claude-marketplace
/plugin install <plugin-name>@premex-plugins
```

---

## 📦 What's inside

<table>
<tr>
<td>🚀</td>
<td><a href="#-android-cli-setup"><b>android-cli-setup</b></a></td>
<td>Bootstrap Google's agent-first <code>android</code> CLI and keep it fresh on your laptop + CI.</td>
</tr>
<tr>
<td>🤖</td>
<td><a href="#-android----googles-official-android-agent-skills"><b>android-*</b></a></td>
<td>Every skill from <a href="https://github.com/android/skills">android/skills</a>, auto-mirrored as one plugin per skill.</td>
</tr>
<tr>
<td>🤝</td>
<td><a href="#-github-utils--dependabot-management-in-plain-english"><b>github-utils</b></a></td>
<td>Talk to Dependabot in plain English — Claude translates and posts the commands.</td>
</tr>
</table>

---

<a id="-android-cli-setup"></a>

### 🚀 android-cli-setup — bootstrap Google's agent-first Android CLI

> **One-liner:** Installs Google's new `android` CLI, keeps it current, hands off to the bundled skill.
> **Install:** `/plugin install android-cli-setup@premex-plugins`

Google's [new `android` CLI](https://android-developers.googleblog.com/2026/04/build-android-apps-3x-faster-using-any-agent.html) is an agent-first replacement for the old `sdkmanager` / `avdmanager` / `adb` toolchain — ~70% fewer tokens and ~3x faster. This plugin gets it onto your machine (and your CI runners), keeps it fresh forever, and hands off to Google's bundled skill once setup is done.

<details open>
<summary><b>What's in the box</b></summary>

| Ships with | What you get |
|---|---|
| 🌱 **android-cli-setup** skill | One-time install of the `android` CLI into `~/.local/bin` (no sudo needed), runs `android init` to deposit Google's official `android-cli` skill into `~/.claude/skills/`, hands off. |
| 🔁 **SessionStart hook** | Background refresh throttled to once per 24h — your CLI and bundled skill stay current without you ever running `android update` manually. |
| ⚙️ **android-cli-ci** skill | Working reference workflows for GitHub Actions, GitLab CI, CircleCI, Bitrise, Jenkins, Buildkite, and self-hosted runners — plus a side-by-side migration guide from `sdkmanager` + cmdline-tools setups you probably have today. |
| 🛠️ **Slash commands** | `/android-cli-status`, `/android-cli-update`, `/android-cli-reset` for inspection and manual control. |

</details>

<details>
<summary><b>Ask Claude like this</b></summary>

> 💬 *"set up the android CLI on my laptop"* → plugin bootstraps, then Google's skill takes over.
> 💬 *"migrate our GitHub Actions workflow away from sdkmanager"* → CI skill with a ready-to-paste replacement.

</details>

---

<a id="-android----googles-official-android-agent-skills"></a>

### 🤖 android-* — Google's official Android agent skills, one plugin at a time

> **One-liner:** Every skill from [android/skills](https://github.com/android/skills), mirrored and split so you install only what you want.
> **Install:** `/plugin install <name>@premex-plugins` (pick from the table)

Google publishes open-standard [agent skills](https://agentskills.io/home) covering the hard parts of modern Android development. We mirror, split, and auto-update the catalog so each skill is an individually installable plugin.

<details open>
<summary><b>Available plugins</b></summary>

| Plugin | What it does for you |
|---|---|
| 🛠️ **android-agp-9-upgrade** | Migrates your project to Android Gradle Plugin 9 — breaking changes, built-in Kotlin, KSP/KAPT, the works. |
| 🎨 **android-migrate-xml-views-to-jetpack-compose** | Step-by-step XML → Jetpack Compose migration, theme mapping and View interop included. |
| 🧭 **android-navigation-3** | Jetpack Navigation 3 recipes: deep links, multiple backstacks, scenes, Hilt/ViewModel integration, returning results. |
| 🪓 **android-r8-analyzer** | Finds redundant R8/Proguard keep rules and overly broad package-wide rules. Slims your APK. |
| 💳 **android-play-billing-library-version-upgrade** | Any legacy Google Play Billing Library version → latest stable, with migration logic pre-mapped. |
| 📱 **android-edge-to-edge** | Fixes status/nav bar overlap, IME insets, and system bar legibility — all the adaptive UI gotchas. |

</details>

<details>
<summary><b>Install examples</b></summary>

```bash
/plugin install android-edge-to-edge@premex-plugins
/plugin install android-navigation-3@premex-plugins
# …or any other android-* plugin from the list above
```

</details>

<details>
<summary><b>🔄 Why install ours instead of cloning upstream?</b></summary>

A GitHub Actions workflow in this repo pulls `android/skills` every day, splits each SKILL.md into its own plugin, regenerates the marketplace manifest, and opens an auto-merging PR if anything changed. Upstream ships a new skill → a new plugin lands in your next `/plugin marketplace update`. Zero maintenance on our side or yours.

*Why split?* Claude Code [currently locks skill toggling to the plugin level](https://github.com/anthropics/claude-code/issues/40789) — one-plugin-per-skill is the only way to let you activate skills individually.

</details>

---

<a id="-github-utils--dependabot-management-in-plain-english"></a>

### 🤝 github-utils — Dependabot management in plain English

> **One-liner:** Talk to Claude like a human; it talks to Dependabot for you.
> **Install:** `/plugin install github-utils@premex-plugins`

Claude maps your intent to the right `@dependabot` command and posts it via the `gh` CLI. No more memorizing syntax, no more per-PR commenting.

<details open>
<summary><b>Ask Claude like this</b></summary>

> 💬 *"rebase all dependabot PRs"*
> 💬 *"ignore the major version on #123"*
> 💬 *"show ignore conditions for lodash"*

</details>

---

## 💡 Why this marketplace exists

Because good skills deserve distribution, and spinning up a Claude Code plugin marketplace is surprisingly cheap — a `.claude-plugin/marketplace.json`, a `plugin.json` per plugin, and you're in business. If you're building on top of Claude Code, consider publishing your own.

## 🙋 Requests, issues, contributions

Open an [issue](https://github.com/premex-ab/claude-marketplace/issues). We're a small team with opinions, but useful suggestions land fast.

## 📄 License

Marketplace wrapper and Premex-authored plugins are free to use. Third-party skills shipped here (e.g. `android-skills`) carry their own upstream licenses — see the plugin directory for details (Apache-2.0 for `android-skills`).

---

*Built at [Premex](https://github.com/premex-ab) 🇸🇪.*
