# Applying DAGP to a project that doesn't have it yet

Before proposing to *add* DAGP to a project, confirm with the user. Applying DAGP is a choice with opinions attached (it will start producing advice immediately, and the team will need a plan for handling it). Don't silently add it as part of an unrelated fix.

## Minimum application

Root `build.gradle.kts` (or `build.gradle`):

```kotlin
plugins {
  id("com.autonomousapps.dependency-analysis") version "<LATEST>"
}
```

For a **composite / included-build** layout (common with `build-logic`), apply it on the root of each included build.

For **Android projects**, DAGP handles Android out-of-the-box as long as AGP is applied. No extra configuration is required to get `buildHealth` and `projectHealth` tasks.

## Version

Look up the latest stable version just before applying:

- <https://plugins.gradle.org/plugin/com.autonomousapps.dependency-analysis>
- <https://github.com/autonomousapps/dependency-analysis-gradle-plugin/tags> (ignore `variant-artifacts-*` tags)

## Verify the tasks are registered

```bash
./gradlew tasks --group=verification | grep -i health
./gradlew :module:tasks --group=verification | grep -i health
```

Expect `buildHealth` at the root and `projectHealth` + `reason` on each module.

## First baseline run

```bash
./gradlew buildHealth
```

Do **not** immediately propose fixes. The first baseline is usually noisy; inspect the report, group advice by type (see [advice-interpretation.md](advice-interpretation.md)), and propose a triage plan before applying any changes.

## Optional configuration worth knowing about

Most projects don't need this on day one, but it's good to know it exists:

```kotlin
dependencyAnalysis {
  issues {
    all {
      onAny {
        // Escalate all advice to build failures once the team is ready:
        // severity("fail")
      }
    }
    project(":someModule") {
      onUnusedDependencies { exclude("com.example:known-reflected-lib") }
    }
  }
  // bundle groups — treat a set of coordinates as a single logical dep
  structure {
    bundle("kotlin-stdlib") {
      includeGroup("org.jetbrains.kotlin")
    }
  }
}
```

Adding a `structure { bundle(...) }` for closely-related artifacts (e.g., the Kotlin stdlib family, the AndroidX Compose BOM set) significantly reduces false-positive advice noise. It's a good second-step once the initial pass is clean.

## Don't

- Don't enable `severity("fail")` on a project that hasn't had its first clean buildHealth run yet. You'll break CI.
- Don't add `ignore(...)` entries without a code comment explaining why (ideally linking to an upstream issue if applicable — see [upstream-issue.md](upstream-issue.md)).
