# Android CLI on other CI systems

Core pattern is identical everywhere: install the CLI, call `android sdk install <packages>`, build with Gradle. Differences are just how each CI caches, handles secrets, and runs emulators.

## CircleCI

```yaml
version: 2.1
jobs:
  build:
    docker:
      - image: cimg/openjdk:21.0
    resource_class: large
    steps:
      - checkout
      - restore_cache:
          keys:
            - android-sdk-v1-{{ checksum "gradle/libs.versions.toml" }}
            - android-sdk-v1-
      - run:
          name: Install Android CLI
          command: curl -fsSL https://dl.google.com/android/cli/latest/linux_x86_64/install.sh | sudo bash
      - run:
          name: Install SDK
          command: |
            android --no-metrics sdk install \
              platforms/android-34 \
              build-tools/34.0.0 \
              platform-tools
      - save_cache:
          key: android-sdk-v1-{{ checksum "gradle/libs.versions.toml" }}
          paths:
            - ~/.android/bin
            - ~/Android/Sdk
      - run: ./gradlew --no-daemon assembleDebug
      - store_artifacts:
          path: app/build/outputs/apk/debug
```

For emulator jobs use `machine:` executor with `android.v27` resource class (KVM-enabled).

## Bitrise

Bitrise historically relies on its "Install Android tools" step, which downloads cmdline-tools. Replace that step with a "Script" step:

```yaml
- script@1:
    title: Install Android CLI
    inputs:
    - content: |-
        #!/usr/bin/env bash
        set -euo pipefail
        curl -fsSL https://dl.google.com/android/cli/latest/linux_x86_64/install.sh | sudo bash
        android --no-metrics sdk install \
          platforms/android-34 \
          build-tools/34.0.0 \
          platform-tools
```

Then use Bitrise's existing `gradle-runner` step for the build. Bitrise's standard stack already has `$ANDROID_HOME` pointed at `/opt/android-sdk`, and the CLI respects that env var.

Bitrise's emulator stack still uses `reactivecircus`-style tooling under the hood; switching that is a bigger project - do it only if you need features the CLI gives you that the existing stack doesn't.

## Jenkins

For a Linux agent:

```groovy
pipeline {
  agent { label 'linux-android' }
  environment {
    ANDROID_HOME = "${env.WORKSPACE}/android-sdk"
  }
  stages {
    stage('Install CLI') {
      steps {
        sh '''
          [ -x ~/.local/bin/android ] || {
            mkdir -p ~/.local/bin
            curl -fsSL "https://redirector.gvt1.com/edgedl/android/cli/latest/linux_x86_64/android" \
              -o ~/.local/bin/android
            chmod +x ~/.local/bin/android
            ANDROID_CLI_FRESH_INSTALL=1 ~/.local/bin/android --version
          }
        '''
      }
    }
    stage('SDK') {
      steps {
        sh '~/.local/bin/android --no-metrics --sdk=$ANDROID_HOME sdk install platforms/android-34 build-tools/34.0.0 platform-tools'
      }
    }
    stage('Build') {
      steps { sh './gradlew --no-daemon assembleDebug' }
      post { always { archiveArtifacts artifacts: 'app/build/outputs/apk/**/*.apk' } }
    }
  }
}
```

Use the user-local install because Jenkins agents typically run as a service account that can't sudo.

## Buildkite

```yaml
steps:
  - label: ":android: Build"
    plugins:
      - docker#v5:
          image: eclipse-temurin:21-jdk-jammy
          volumes:
            - "android-sdk:/root/.android-sdk"
          environment:
            - ANDROID_HOME=/root/.android-sdk
    command: |
      apt-get update -qq && apt-get install -y -qq curl
      curl -fsSL https://dl.google.com/android/cli/latest/linux_x86_64/install.sh | bash
      android --no-metrics --sdk=$ANDROID_HOME sdk install platforms/android-34 build-tools/34.0.0 platform-tools
      ./gradlew --no-daemon assembleDebug
```

Buildkite's docker plugin supports named volumes, which makes SDK caching across runs trivial.

## Self-hosted runners (any CI)

Install the CLI once on the runner machine, not per-job:

```bash
sudo curl -fsSL "https://redirector.gvt1.com/edgedl/android/cli/latest/linux_x86_64/android" \
  -o /usr/local/bin/android
sudo chmod +x /usr/local/bin/android
ANDROID_CLI_FRESH_INSTALL=1 android --version
```

Then pipelines just run `android sdk install ...` and `./gradlew ...`. Schedule a cron (e.g., `@weekly`) that runs `android update` on the runner so it stays current between deploys.

Point `ANDROID_HOME` at a shared location like `/var/lib/ci/android-sdk` and give your CI user write access so `android sdk install` can update it. Don't put the SDK inside the workspace directory - you'll redownload it every run.

## Firebase Test Lab / device farms

For real-device testing, don't run emulators in CI. Build the APK + AndroidTest APK, upload to Firebase Test Lab:

```bash
./gradlew --no-daemon assembleDebug assembleDebugAndroidTest
gcloud firebase test android run \
  --type instrumentation \
  --app app/build/outputs/apk/debug/app-debug.apk \
  --test app/build/outputs/apk/androidTest/debug/app-debug-androidTest.apk
```

The `android` CLI plays no role here - it's just pre-build SDK management.
