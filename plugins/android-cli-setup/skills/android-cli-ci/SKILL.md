---
name: android-cli-ci
description: Use when the user wants to build, test, or deploy an Android app from CI/CD (GitHub Actions, GitLab CI, CircleCI, Bitrise, Jenkins, Buildkite, self-hosted runners), or asks to replace sdkmanager / avdmanager / android-actions/setup-android / reactivecircus/android-emulator-runner with the new agent-first `android` CLI, or is migrating a legacy Android CI pipeline that calls `sdkmanager "platforms;android-X"` before `./gradlew assembleDebug`. Covers install, SDK package management, emulator tests, caching strategy, and a full migration guide from the old cmdline-tools-based setup.
---

# Android CLI in CI/CD

Google's `android` CLI is a 5.4 MB launcher that replaces the 300+ MB cmdline-tools bundle. For CI this means smaller install, faster cold starts, and simpler scripts. It does **not** replace Gradle for building - you still run `./gradlew assembleDebug` or `./gradlew bundleRelease`. What it replaces is: downloading cmdline-tools, unzipping them, accepting licenses, and invoking `sdkmanager` / `avdmanager` / `adb` directly.

Approximate wins vs. the traditional setup:
- Install step: ~1 line instead of ~15
- SDK component download: ~30% faster (CLI parallelises)
- No license-acceptance ceremony (`yes | sdkmanager --licenses` gone)
- One binary to cache; no JDK-inside-SDK fiddling

## When to use this skill

Trigger when the user is:
- Writing or editing `.github/workflows/*.yml`, `.gitlab-ci.yml`, `.circleci/config.yml`, `bitrise.yml`, `Jenkinsfile`, or similar that touches Android builds.
- Migrating from `android-actions/setup-android`, `reactivecircus/android-emulator-runner`, or hand-rolled `sdkmanager` installs.
- Asking how to cache the Android SDK in CI.
- Setting up nightly instrumentation tests that need an emulator on a build machine.
- Building a Docker image for Android CI.

Don't trigger for local dev setup (that's the companion `android-cli-setup` skill) or pure Gradle questions that don't touch the SDK toolchain.

## Core workflow in any CI

### 1. Install the CLI
```bash
curl -fsSL https://dl.google.com/android/cli/latest/linux_x86_64/install.sh | sudo bash
# or for self-hosted macOS runners:
curl -fsSL https://dl.google.com/android/cli/latest/darwin_arm64/install.sh | sudo bash
```
Hosted Linux runners have a writable `/usr/local/bin`, so `sudo` is usually a no-op but harmless. Total download: ~5.4 MB launcher + ~78 MB of embedded resources unpacked on first run into `~/.android/bin/`.

Pass `--no-metrics` on every `android` invocation in CI to opt out of telemetry.

### 2. Install SDK packages
```bash
android --no-metrics sdk install \
  platforms/android-34 \
  build-tools/34.0.0 \
  platform-tools
```
Note the `/` separator (the old `sdkmanager` used `;`, e.g. `"platforms;android-34"`). Package names themselves are unchanged.

### 3. Build with Gradle
```bash
./gradlew --no-daemon assembleDebug
```
Set `ANDROID_HOME` to wherever you want the SDK (default on Linux: `~/Android/Sdk`; pass `--sdk=<path>` to override). Gradle reads `ANDROID_HOME` / `local.properties` the same way it always has.

### 4. Cache between runs
Cache these paths:
- `~/.android/bin/` (CLI launcher state - ~78 MB)
- `$ANDROID_HOME` (the SDK components - can be GBs; cache selectively)
- `~/.gradle/caches/` and `~/.gradle/wrapper/` (Gradle, unchanged from pre-CLI)

Cache key seed: the CLI's version (`android --version`) plus the hash of your `build.gradle`/`libs.versions.toml` that pins SDK platform/build-tools versions.

### 5. Run instrumentation tests (optional)
The `android emulator` subcommands work in CI but need hardware virtualisation on Linux runners. On GitHub-hosted `ubuntu-latest` that means KVM access, which is now enabled by default; confirm with `kvm-ok` or `egrep -c '(vmx|svm)' /proc/cpuinfo`. macOS runners have it natively. See `references/github-actions.md` for a working emulator test workflow.

## Platform-specific references

- **GitHub Actions**: `references/github-actions.md` - install, cache, matrix builds, emulator-backed tests, self-hosted runners.
- **GitLab CI**: `references/gitlab-ci.md` - Docker image, cache config, artifacts.
- **Other CIs (CircleCI, Bitrise, Jenkins, Buildkite, self-hosted)**: `references/other-ci.md`.
- **Migrating from the sdkmanager era**: `references/migration-from-sdkmanager.md` - side-by-side before/after for the common patterns.

Read only the reference(s) relevant to the user's CI platform; they're each self-contained.

## Important gotchas

- **Package syntax changed.** `sdkmanager "platforms;android-34"` → `android sdk install platforms/android-34`. Semicolons → slashes. If you paste an old snippet verbatim you'll get "package not found".
- **No interactive license prompt.** The CLI prints the Terms of Service once on first run and proceeds. CI scripts don't need `yes | ...` anymore. If your pipeline was relying on the prompt as a gate, that gate is gone.
- **`ANDROID_SDK_ROOT` is not fully respected** by current releases - use `ANDROID_HOME` or `--sdk=<path>`.
- **Build still uses Gradle.** Don't look for `android build` - it doesn't exist. Use `./gradlew assembleDebug` / `bundleRelease` / `testDebugUnitTest` as before.
- **Self-hosted runners**: the canonical `/usr/local/bin` install needs sudo. On runners where sudo isn't available, install the binary directly:
  ```bash
  curl -fsSL "https://redirector.gvt1.com/edgedl/android/cli/latest/linux_x86_64/android" -o ~/.local/bin/android
  chmod +x ~/.local/bin/android
  ANDROID_CLI_FRESH_INSTALL=1 android --version  # trigger one-time unpack
  ```
- **Don't run `android init` in CI.** That command installs the agent-facing skill files; CI has no agent. Skip it.
- **Install from `latest/`.** The install URL (`https://dl.google.com/android/cli/latest/<slug>/install.sh`) always pulls the current release; every CI run gets whatever's current.
- **Don't run `android update` mid-job.** Install once at the start; don't re-invoke `update` later in the same job - it'll swap the binary between your `sdk install` step and your build step.

## After handing off

When the user has a working CI pipeline, suggest:
- Bumping platform/build-tools versions in `gradle/libs.versions.toml` via renovate/dependabot.
- Using GitHub Actions' `cache` action with restore-keys so partial hits still save minutes.
- Reading Google's official operational guide at `~/.claude/skills/android-cli/SKILL.md` (if `android init` was run locally) for the full `android` command reference.
