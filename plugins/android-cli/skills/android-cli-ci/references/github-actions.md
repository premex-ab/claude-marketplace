# Android CLI in GitHub Actions

## Recommended: `premex-ab/setup-android-cli@v1`

The [`premex-ab/setup-android-cli`](https://github.com/premex-ab/setup-android-cli) composite action wraps everything (download, unpack, `ANDROID_HOME`, caching, problem matchers). Use it as a drop-in replacement for `android-actions/setup-android`.

### Minimal build workflow

```yaml
name: Android build

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: '21'

      - uses: premex-ab/setup-android-cli@v1
        with:
          packages: |
            platforms/android-34
            build-tools/34.0.0
            platform-tools

      - uses: gradle/actions/setup-gradle@v4

      - name: Build
        run: ./gradlew --no-daemon assembleDebug

      - uses: actions/upload-artifact@v4
        with:
          name: app-debug
          path: app/build/outputs/apk/debug/*.apk
```

The action handles caching of `~/.android/bin` and `$ANDROID_HOME` keyed by OS, arch, and the hash of `**/libs.versions.toml` / `**/build.gradle*`. You don't need a separate `actions/cache` step for the SDK.

### Inputs you'll reach for

| Input | Purpose |
|---|---|
| `packages` | Space- or newline-separated SDK packages (slash syntax). |
| `sdk-path` | Override the SDK install location (defaults to `~/Android/Sdk` on Linux, `~/Library/Android/sdk` on macOS). |
| `cache` | Set to `'false'` to disable SDK caching (if you manage it yourself). |
| `no-metrics` | Defaults to `'true'`; pass `'false'` only if you explicitly want telemetry. |
| `install-url-base` | Point at an internal mirror for air-gapped runners. |

### Emulator-backed instrumentation tests

Modern `ubuntu-latest` runners ship with KVM enabled. Confirm with `egrep -c '(vmx|svm)' /proc/cpuinfo` - a value `> 0` means virtualisation works.

```yaml
  instrumentation:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { distribution: temurin, java-version: '21' }

      - name: Enable KVM
        run: |
          echo 'KERNEL=="kvm", GROUP="kvm", MODE="0666"' | sudo tee /etc/udev/rules.d/99-kvm.rules
          sudo udevadm control --reload-rules
          sudo udevadm trigger --name-match=kvm

      - uses: premex-ab/setup-android-cli@v1
        with:
          packages: |
            platforms/android-34
            build-tools/34.0.0
            platform-tools
            emulator
            system-images/android-34/google_apis/x86_64

      - name: Create and start emulator
        run: |
          android --no-metrics emulator create --profile=medium_phone
          android --no-metrics emulator start medium_phone &
          adb wait-for-device shell 'while [[ -z $(getprop sys.boot_completed) ]]; do sleep 1; done'

      - name: Run instrumentation tests
        run: ./gradlew --no-daemon connectedDebugAndroidTest

      - name: Stop emulator
        if: always()
        run: |
          adb devices | awk '/emulator/ {print $1}' | xargs -I{} android --no-metrics emulator stop {}
```

If you're currently using `reactivecircus/android-emulator-runner@v2`, this replaces its install-and-boot step. You lose its `script:` inline-run convenience; you keep everything else. For simple cases `reactivecircus/android-emulator-runner` is still less code - switch when you want finer control or want to drop the extra action dependency.

### Matrix over SDK versions

```yaml
    strategy:
      fail-fast: false
      matrix:
        api: [29, 33, 34, 35]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { distribution: temurin, java-version: '21' }
      - uses: premex-ab/setup-android-cli@v1
        with:
          packages: |
            platforms/android-${{ matrix.api }}
            build-tools/34.0.0
            platform-tools
      - run: ./gradlew --no-daemon lintDebug -Pandroid.compileSdk=${{ matrix.api }}
```

## Manual install (no action)

If you can't or don't want to use `premex-ab/setup-android-cli` (e.g. air-gapped, custom ordering of steps, debugging), the raw install is a one-liner:

```yaml
      - name: Install Android CLI
        run: |
          curl -fsSL https://dl.google.com/android/cli/latest/linux_x86_64/install.sh | sudo bash
          android --no-metrics sdk install \
            platforms/android-34 \
            build-tools/34.0.0 \
            platform-tools

      - name: Cache Android SDK
        uses: actions/cache@v4
        with:
          path: |
            ~/.android/bin
            ~/Android/Sdk
          key: android-sdk-${{ runner.os }}-${{ hashFiles('gradle/libs.versions.toml', '**/build.gradle*') }}
          restore-keys: |
            android-sdk-${{ runner.os }}-
```

The action above does the same, plus problem matchers and a job summary.

## Self-hosted runners (no sudo)

`premex-ab/setup-android-cli@v1` already installs into `$RUNNER_TOOL_CACHE` (no sudo required), so self-hosted runners work out of the box.

If you must install manually on a sudo-less runner, download the raw binary into a user-writable dir on `PATH`:

```yaml
      - name: Install Android CLI (user-local)
        run: |
          mkdir -p "$HOME/.local/bin"
          curl -fsSL \
            "https://redirector.gvt1.com/edgedl/android/cli/latest/linux_x86_64/android" \
            -o "$HOME/.local/bin/android"
          chmod +x "$HOME/.local/bin/android"
          echo "$HOME/.local/bin" >> "$GITHUB_PATH"
          ANDROID_CLI_FRESH_INSTALL=1 "$HOME/.local/bin/android" --version
```

## Docker-based workflows

For repeatable containers, bake the CLI into a base image. The action isn't useful inside a Dockerfile - use the install script directly:

```dockerfile
FROM eclipse-temurin:21-jdk-jammy
RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates \
 && curl -fsSL https://dl.google.com/android/cli/latest/linux_x86_64/install.sh | bash \
 && rm -rf /var/lib/apt/lists/*
ENV ANDROID_HOME=/opt/android-sdk
RUN android --no-metrics --sdk=$ANDROID_HOME sdk install \
      platforms/android-34 build-tools/34.0.0 platform-tools
```

`bash` inside `FROM` works without sudo because Docker builds run as root by default.
