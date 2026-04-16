# Android CLI in GitHub Actions

## Minimal build workflow

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

      - name: Install Android CLI
        run: |
          curl -fsSL https://dl.google.com/android/cli/latest/linux_x86_64/install.sh | sudo bash
          android --version

      - name: Cache Android SDK
        uses: actions/cache@v4
        with:
          path: |
            ~/.android/bin
            ~/Android/Sdk
          key: android-sdk-${{ runner.os }}-${{ hashFiles('gradle/libs.versions.toml', '**/build.gradle*') }}
          restore-keys: |
            android-sdk-${{ runner.os }}-

      - name: Install SDK packages
        run: |
          android --no-metrics sdk install \
            platforms/android-34 \
            build-tools/34.0.0 \
            platform-tools

      - uses: gradle/actions/setup-gradle@v4

      - name: Build
        run: ./gradlew --no-daemon assembleDebug

      - uses: actions/upload-artifact@v4
        with:
          name: app-debug
          path: app/build/outputs/apk/debug/*.apk
```

Replace `android-actions/setup-android@v3` with the two-step "install CLI + install packages". The install URL uses `latest/` so you don't need to track a cmdline-tools version anymore; every run grabs the current CLI release.

## Emulator-backed instrumentation tests

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

      - name: Install Android CLI
        run: curl -fsSL https://dl.google.com/android/cli/latest/linux_x86_64/install.sh | sudo bash

      - name: Install SDK + system image
        run: |
          android --no-metrics sdk install \
            platforms/android-34 \
            build-tools/34.0.0 \
            platform-tools \
            emulator \
            system-images/android-34/google_apis/x86_64

      - name: Create and start emulator
        run: |
          android --no-metrics emulator create --profile=medium_phone
          android --no-metrics emulator start medium_phone &
          # Wait for boot - reuse adb from the SDK
          adb wait-for-device shell 'while [[ -z $(getprop sys.boot_completed) ]]; do sleep 1; done'

      - name: Run instrumentation tests
        run: ./gradlew --no-daemon connectedDebugAndroidTest

      - name: Stop emulator
        if: always()
        run: |
          adb devices | awk '/emulator/ {print $1}' | xargs -I{} android --no-metrics emulator stop {}
```

If you're currently using `reactivecircus/android-emulator-runner@v2`, this replaces its install-and-boot step. You lose its `script:` inline-run convenience; you keep everything else. For simple cases `reactivecircus/android-emulator-runner` is still less code - switch when you want finer control or want to drop the action dependency.

## Matrix over SDK versions

```yaml
    strategy:
      fail-fast: false
      matrix:
        api: [29, 33, 34, 35]
    steps:
      - uses: actions/checkout@v4
      - run: curl -fsSL https://dl.google.com/android/cli/latest/linux_x86_64/install.sh | sudo bash
      - run: |
          android --no-metrics sdk install \
            platforms/android-${{ matrix.api }} \
            build-tools/34.0.0 \
            platform-tools
      - run: ./gradlew --no-daemon lintDebug -Pandroid.compileSdk=${{ matrix.api }}
```

## Self-hosted runners (no sudo)

If your runner user can't sudo into `/usr/local/bin`, install the binary directly into a user-writable dir on `PATH`:

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

For repeatable containers, bake the CLI into a base image:

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
