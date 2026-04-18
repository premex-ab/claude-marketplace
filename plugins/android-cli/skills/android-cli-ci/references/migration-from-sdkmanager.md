# Migrating Android CI from sdkmanager to `android` CLI

This guide shows the common "before" patterns most Android CI pipelines have today, and the "after" equivalents using the `android` CLI. Apply in place of a full rewrite - the migration is step-by-step and you can do it in one PR or several.

## What changes

| Legacy tool | CLI replacement |
|-------------|-----------------|
| `cmdline-tools/bin/sdkmanager` | `android sdk install / list / update / remove` |
| `cmdline-tools/bin/avdmanager` | `android emulator create / list / remove` |
| `emulator -avd <name>` | `android emulator start <name>` (and `stop`) |
| `yes \| sdkmanager --licenses` | Nothing (auto-accepted, non-interactive) |
| `adb install <apk>` | `android run --apks=<apk>` (for agent workflows - CI usually keeps `adb install`) |
| Downloading cmdline-tools zip manually | `curl install.sh \| bash` |

What **doesn't** change: Gradle. You still run `./gradlew assembleDebug` etc. The CLI manages the SDK around Gradle; it doesn't replace Gradle itself.

## Package name syntax

`sdkmanager` used semicolons, the CLI uses slashes. Otherwise identical.

| Legacy | New |
|--------|-----|
| `"platforms;android-34"` | `platforms/android-34` |
| `"build-tools;34.0.0"` | `build-tools/34.0.0` |
| `"platform-tools"` | `platform-tools` |
| `"system-images;android-34;google_apis;x86_64"` | `system-images/android-34/google_apis/x86_64` |
| `"extras;google;Android_Emulator_Hypervisor_Driver"` | `extras/google/Android_Emulator_Hypervisor_Driver` |

When scripting the migration, a `sed 's/;/\//g'` on quoted package args gets you 95% of the way.

## GitHub Actions: before and after

### Before (android-actions/setup-android)
```yaml
steps:
  - uses: actions/checkout@v4
  - uses: actions/setup-java@v4
    with: { distribution: temurin, java-version: '21' }
  - uses: android-actions/setup-android@v3
    with:
      cmdline-tools-version: 11076708
      packages: 'platforms;android-34 build-tools;34.0.0 platform-tools'
  - run: ./gradlew --no-daemon assembleDebug
```

### After (premex-ab/setup-android-cli)
```yaml
steps:
  - uses: actions/checkout@v4
  - uses: actions/setup-java@v4
    with: { distribution: temurin, java-version: '21' }
  - uses: premex-ab/setup-android-cli@v1
    with:
      packages: |
        platforms/android-34
        build-tools/34.0.0
        platform-tools
  - run: ./gradlew --no-daemon assembleDebug
```

Same shape as before, one action-to-action swap. No `cmdline-tools-version` to track (the action always pulls the current CLI release). Package names use slashes instead of semicolons; no license flag needed; `--no-metrics` is the default.

If you prefer to avoid the action, the manual equivalent is:

```yaml
  - name: Install Android CLI
    run: curl -fsSL https://dl.google.com/android/cli/latest/linux_x86_64/install.sh | sudo bash
  - name: Install SDK
    run: |
      android --no-metrics sdk install \
        platforms/android-34 \
        build-tools/34.0.0 \
        platform-tools
```

### Before (hand-rolled cmdline-tools)
```yaml
      - name: Set up Android SDK
        run: |
          mkdir -p "$ANDROID_HOME/cmdline-tools"
          cd "$ANDROID_HOME/cmdline-tools"
          curl -o tools.zip https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip
          unzip tools.zip
          mv cmdline-tools latest
          yes | "$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager" --licenses
          "$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager" \
            "platforms;android-34" \
            "build-tools;34.0.0" \
            "platform-tools"
```

### After
```yaml
      - name: Install Android CLI + SDK
        run: |
          curl -fsSL https://dl.google.com/android/cli/latest/linux_x86_64/install.sh | sudo bash
          android --no-metrics sdk install \
            platforms/android-34 \
            build-tools/34.0.0 \
            platform-tools
```

~15 lines → 5 lines, and no license flag because there's no prompt.

## GitLab CI: before and after

### Before
```yaml
image: openjdk:21

variables:
  ANDROID_HOME: "/opt/android-sdk"

before_script:
  - apt-get update -qq && apt-get install -y -qq curl unzip
  - mkdir -p "$ANDROID_HOME/cmdline-tools"
  - cd "$ANDROID_HOME/cmdline-tools"
  - curl -o t.zip https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip
  - unzip t.zip && mv cmdline-tools latest && rm t.zip
  - cd $CI_PROJECT_DIR
  - export PATH="$ANDROID_HOME/cmdline-tools/latest/bin:$PATH"
  - yes | sdkmanager --licenses >/dev/null
  - sdkmanager "platforms;android-34" "build-tools;34.0.0" "platform-tools"
```

### After
```yaml
image: eclipse-temurin:21-jdk-jammy

variables:
  ANDROID_HOME: "$CI_PROJECT_DIR/.android-sdk"

before_script:
  - apt-get update -qq && apt-get install -y -qq curl
  - curl -fsSL https://dl.google.com/android/cli/latest/linux_x86_64/install.sh | bash
  - android --no-metrics --sdk=$ANDROID_HOME sdk install
      platforms/android-34 build-tools/34.0.0 platform-tools
```

## Emulator tests: before and after

### Before (reactivecircus/android-emulator-runner)
```yaml
      - uses: reactivecircus/android-emulator-runner@v2
        with:
          api-level: 34
          target: google_apis
          arch: x86_64
          script: ./gradlew connectedDebugAndroidTest
```

### After (premex-ab/setup-android-cli + explicit emulator control)
```yaml
      - uses: premex-ab/setup-android-cli@v1
        with:
          packages: |
            platforms/android-34
            build-tools/34.0.0
            platform-tools
            emulator
            system-images/android-34/google_apis/x86_64
      - name: Boot emulator
        run: |
          android --no-metrics emulator create --profile=medium_phone
          android --no-metrics emulator start medium_phone &
          adb wait-for-device shell 'while [[ -z $(getprop sys.boot_completed) ]]; do sleep 1; done'
      - run: ./gradlew --no-daemon connectedDebugAndroidTest
      - name: Stop
        if: always()
        run: adb devices | awk '/emulator/ {print $1}' | xargs -I{} android --no-metrics emulator stop {}
```

`reactivecircus/android-emulator-runner` is denser. Migrate only if you want:
- fewer third-party action dependencies,
- explicit control over the AVD profile (`android emulator create --list-profiles`),
- or to share install steps between build and emulator jobs.

## Caching: before and after

### Before
```yaml
      - uses: actions/cache@v4
        with:
          path: |
            ~/.android/avd
            ~/.android/adb*
            $ANDROID_HOME/cmdline-tools
            $ANDROID_HOME/platforms
            $ANDROID_HOME/build-tools
            $ANDROID_HOME/platform-tools
          key: sdk-v1-${{ hashFiles('**/*.gradle*') }}
```

### After
```yaml
      - uses: actions/cache@v4
        with:
          path: |
            ~/.android/bin
            ~/Android/Sdk
          key: sdk-v2-${{ hashFiles('gradle/libs.versions.toml', '**/build.gradle*') }}
```

The CLI's own state lives at `~/.android/bin/`; the SDK lives at `$ANDROID_HOME` (default `~/Android/Sdk` on Linux). Cache both. Bump the cache key version when you bump the CLI - a new launcher may change the bin layout.

## Script migration checklist

- [ ] Find every `sdkmanager`, `avdmanager`, and `emulator` invocation in your CI files.
- [ ] Replace semicolons with slashes in package names.
- [ ] Drop `yes | sdkmanager --licenses` entirely.
- [ ] Replace cmdline-tools download/unzip/PATH-setup with `install.sh`.
- [ ] Add `--no-metrics` to every `android` invocation in CI.
- [ ] Update cache paths (`~/.android/bin` instead of `$ANDROID_HOME/cmdline-tools`).
- [ ] Bump cache keys so the old cache doesn't confuse the new setup.
- [ ] Remove `android-actions/setup-android` or `reactivecircus/android-emulator-runner` from your dependencies file/list, after you've confirmed the new setup works.
- [ ] Keep `./gradlew` commands exactly as they were.

## When NOT to migrate

- Your existing CI works, nobody's asked for a change, and the SDK is already cached effectively. The CLI is faster but not dramatically so for steady-state CI; the win is setup simplicity, not throughput.
- You rely on a specific `sdkmanager` flag that has no CLI equivalent yet (unlikely, but worth scanning your scripts).
- You're on a locked-down network where adding `dl.google.com/android/cli/` to an allowlist is hard but `dl.google.com/android/repository/` is already allowed.

For everything else, the migration is cheap and pays for itself in shorter workflow files.
