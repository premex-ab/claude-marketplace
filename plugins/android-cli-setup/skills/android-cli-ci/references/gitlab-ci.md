# Android CLI in GitLab CI

## Minimal `.gitlab-ci.yml`

```yaml
image: eclipse-temurin:21-jdk-jammy

variables:
  GRADLE_USER_HOME: "$CI_PROJECT_DIR/.gradle"
  ANDROID_HOME: "$CI_PROJECT_DIR/.android-sdk"

cache:
  key:
    files:
      - gradle/libs.versions.toml
      - gradle/wrapper/gradle-wrapper.properties
  paths:
    - .gradle/caches
    - .gradle/wrapper
    - .android-sdk
    - "$HOME/.android/bin"

before_script:
  - apt-get update -qq && apt-get install -y -qq curl
  - curl -fsSL https://dl.google.com/android/cli/latest/linux_x86_64/install.sh | bash
  - android --no-metrics --sdk=$ANDROID_HOME sdk install
      platforms/android-34
      build-tools/34.0.0
      platform-tools

build:
  stage: build
  script:
    - ./gradlew --no-daemon assembleDebug
  artifacts:
    paths:
      - app/build/outputs/apk/debug/*.apk
    expire_in: 1 week

test:
  stage: test
  script:
    - ./gradlew --no-daemon testDebugUnitTest
  artifacts:
    when: always
    reports:
      junit: "**/build/test-results/**/TEST-*.xml"
```

Key notes:
- We put the SDK under `$CI_PROJECT_DIR/.android-sdk` instead of `~/Android/Sdk` so GitLab's per-project cache picks it up. Pass `--sdk=$ANDROID_HOME` and set `ANDROID_HOME` so Gradle finds it.
- Docker image runs as root, so the `install.sh` write to `/usr/local/bin` needs no sudo.
- `$HOME/.android/bin` holds the CLI's unpacked launcher (~78 MB) - cache it to skip the unpack on every job.

## Shared runner with a Docker executor

If your shared runner runs Docker, bake the CLI into the image:

```dockerfile
FROM eclipse-temurin:21-jdk-jammy
RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates \
 && curl -fsSL https://dl.google.com/android/cli/latest/linux_x86_64/install.sh | bash \
 && apt-get clean && rm -rf /var/lib/apt/lists/*
```

Push to your registry, reference it in `image:`. This drops the install step from the pipeline entirely and makes cold runs faster.

## Emulator tests on GitLab

Emulator jobs need KVM access. Use a runner with `--privileged` (or the Docker socket) and a host that exposes `/dev/kvm`:

```yaml
instrumentation:
  stage: test
  tags: [kvm]      # runner tag for a KVM-capable host
  script:
    - android --no-metrics --sdk=$ANDROID_HOME sdk install
        platforms/android-34
        build-tools/34.0.0
        emulator
        system-images/android-34/google_apis/x86_64
    - android --no-metrics emulator create --profile=medium_phone
    - android --no-metrics emulator start medium_phone &
    - adb wait-for-device shell 'while [[ -z $(getprop sys.boot_completed) ]]; do sleep 1; done'
    - ./gradlew --no-daemon connectedDebugAndroidTest
  after_script:
    - adb devices | awk '/emulator/ {print $1}' | xargs -I{} android --no-metrics emulator stop {}
```

For GitLab-hosted SaaS runners, emulator tests are painful - nested virtualisation isn't available. Use Firebase Test Lab or a self-hosted runner with KVM instead.

## Caching caveats

GitLab's cache is per-project by default. If the SDK cache grows beyond ~2 GB, consider splitting:
- One cache entry for `$ANDROID_HOME/platforms/android-34` (small, stable)
- Another for `$ANDROID_HOME/system-images/` (large, only instrumentation jobs need it)

Use `cache:policy: pull` on build jobs that only need the SDK to build (not install new packages), so they don't re-upload the cache.
