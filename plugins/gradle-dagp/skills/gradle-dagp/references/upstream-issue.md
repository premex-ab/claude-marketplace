# Filing an upstream DAGP issue — draft, confirm, submit

**Read this entire reference before opening any `gh issue create` command.**

Upstream bug reports against [autonomousapps/dependency-analysis-gradle-plugin](https://github.com/autonomousapps/dependency-analysis-gradle-plugin) are posted via `gh`, which means they appear **under the user's GitHub identity**. The user is personally the author of whatever you file. That's the guardrail: draft → show to the user → wait for explicit approval → submit.

Never call `gh issue create` until the user has reviewed the exact text you intend to post.

## Before filing — rule out non-bugs

Most of the time, "DAGP is wrong" turns out not to be a DAGP bug. Check first:

1. **Stale state.** `./gradlew clean buildHealth --rerun-tasks` and re-examine.
2. **Outdated DAGP.** If the project is several versions behind, bump and re-run. The bug may already be fixed.
3. **Annotation / KAPT / KSP / generated sources.** DAGP analyzes bytecode. A dependency used only by generated code is hard to attribute without help — check whether you need `kapt(...)` / `ksp(...)` instead of removal.
4. **Android resources or manifest entries.** A library contributing only resources can be missed.
5. **Reflection / ServiceLoader / Class.forName.** Invisible to static analysis. Not a bug — declare `compileOnly` or add an `ignore()` with a comment.
6. **Multi-variant Android modules.** A dep used only in `debug` or one flavor can look unused when advice is rolled up wrong.
7. **Plugin interactions.** KSP, Hilt, Dagger, Realm, Glide, Dagger-Hilt, Moshi codegen, kotlinx-serialization — all have known interaction patterns. Search the DAGP issues page before filing.

If after all of the above the bug still reproduces, it's worth filing.

## Minimal repro

The single highest-value thing in a DAGP issue is a minimal repro. Before drafting the issue text, try to reproduce the bug in a stripped-down module:

- Strip to one source file that uses the flagged dep.
- Remove unrelated plugins and dependencies.
- Confirm `buildHealth` still reports the same wrong advice.
- Ideally: produce a runnable sample project (a `repro/` folder, a gist, or a small GitHub repo).

If a minimal repro isn't feasible (real-world code depends on proprietary plugins, etc.), describe the setup precisely and acknowledge the limitation in the issue text.

## Gather the diagnostics

Before drafting, collect:

- **DAGP version** (from the applied plugin version).
- **Gradle version** (`./gradlew --version`).
- **AGP version** (if Android).
- **Kotlin / JVM target** versions.
- **`./gradlew :mod:reason --id <coord>` full output** for the offending dep.
- **Relevant `build.gradle[.kts]` excerpts** — the module's dependency block, any convention plugin it applies, and the top of `settings.gradle[.kts]`.
- **Any `dependencyAnalysis { ... }` configuration** in the project.
- **The specific advice** from `advice.json` for the affected module/dep.
- **What was expected** vs. what DAGP reported.

## Issue template to draft

Draft text along these lines, then hand it to the user for review:

```markdown
### Description

DAGP is [incorrectly flagging / missing] `<coordinate>` in module `<path>` as `<advice>`. Expected: `<expected>`.

### Environment

- DAGP: `<version>`
- Gradle: `<version>`
- AGP: `<version>` (if Android)
- Kotlin: `<version>`
- JDK: `<version>`
- OS: `<os>`

### Repro

<link to minimal repro repo, or inline minimal module>

1. `./gradlew :<mod>:projectHealth`
2. Observe: `<actual advice>`

### Expected

`<what DAGP should have said, and why>`

### `reason` output

<paste full `./gradlew :<mod>:reason --id <coord>` output>

### Relevant config

<module build file excerpt>
<convention plugin excerpt if applicable>
<dependencyAnalysis block if present>

### Additional notes

<anything else — similar issue links, workaround found, suspicion about root cause>
```

## Show the user

Present the draft with a clear prompt:

> Here's the upstream issue I'd like to file against autonomousapps/dependency-analysis-gradle-plugin. It will post under your GitHub account. Please review the title and body — do you want to submit, edit, or cancel?

Do not proceed without an explicit "submit" or equivalent from the user. If they edit, re-show the updated draft and ask again. "Looks fine, go ahead" counts; silence or vague acknowledgement does not.

## Submit

Once explicitly approved, write the approved body text to a file and file with `gh`. Using `--body-file` (instead of `--body` inline) preserves markdown formatting and code blocks reliably:

```bash
# Write the approved draft to disk (use the Write tool, not shell heredocs, so you
# can re-show it to the user for one last confirmation if they asked to tweak it).
# Then file the issue:
gh issue create \
  --repo autonomousapps/dependency-analysis-gradle-plugin \
  --title "<approved title>" \
  --body-file /tmp/dagp-issue-body.md
```

Post-submission: give the user the issue URL so they can subscribe / follow up. Offer to add a `// DAGP bug: <issue-url>` comment next to the workaround in the local codebase, so future readers know why the ignore / manual exception exists.

## Work around in the meantime

While upstream investigates, keep the local project buildable. Options:

- **`dependencyAnalysis { ignoreKtx() }` / `issues { onUnusedDependencies { exclude(...) } }`** — explicit ignore in the DSL. Always pair with a comment linking to the upstream issue.
- **Manual declaration** — just declare the dep as DAGP wants, or ignore the advice, depending on which is more accurate.

The comment is important. Future contributors seeing `exclude("com.example:lib")` should be able to trace it back to why.
