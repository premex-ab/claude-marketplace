---
name: gradle-dagp
description: Use when analyzing or fixing Gradle module dependencies with the autonomousapps dependency-analysis-gradle-plugin (DAGP) — buildHealth, projectHealth, fixDependencies, reason, advice.json. Trigger on unused dependencies, api-vs-implementation, transitive / misused-transitive dependencies, redundant plugins (kapt / kotlin-jvm / java-library), or any request to clean up Gradle module dependencies for a JVM or Android project. Do not pipe advice straight through fixDependencies — this skill guides investigative triage, convention-plugin awareness, batched reviewable PRs, and upstream bug filing when DAGP is wrong.
metadata:
  author: Premex
  keywords:
    - gradle
    - dependency-analysis
    - autonomousapps
    - DAGP
    - buildHealth
    - projectHealth
    - fixDependencies
    - api
    - implementation
    - convention-plugin
---

# Gradle DAGP — analyze & fix module dependencies

This skill applies the [autonomousapps dependency-analysis-gradle-plugin](https://github.com/autonomousapps/dependency-analysis-gradle-plugin) to clean up Gradle module dependencies. DAGP outputs precise, structured advice — but blindly applying it can make a codebase worse, not better.

The point of this skill is to use DAGP's advice as a **starting point for thinking**, not as a script to run.

## Philosophy — read before running anything

DAGP tells you what is technically unused, misused, or misconfigured. It does **not** know the code's intent. Three guardrails:

1. **The goal is architecture, build speed, and maintainability — not a green buildHealth.** A module that passes DAGP but leaks transitive APIs to every consumer has worse architecture, not better.
2. **`implementation → api` is not always the right fix.** DAGP flags a type from a dependency as part of the module's public ABI. The right response is often to *not* expose that type (refactor callers, wrap it, change the return type), not to promote the dep to `api`. Exposing third-party types creates upgrade coupling across every consumer.
3. **DAGP can be wrong.** Kapt/KSP stubs, reflection, `Class.forName`, Android resources, service loaders, and some build-script DSL can all confuse the analysis. If applying advice breaks the build and investigation shows DAGP is at fault, file an upstream issue — but **draft it and get user approval before submitting** (it posts under the user's identity). See [references/upstream-issue.md](references/upstream-issue.md).

When in doubt, run `:module:reason --id <coord>` and read. DAGP's `reason` output is the best debugging tool this plugin ships.

## Workflow

Follow the stages below in order. Each stage has a detailed reference — pull them in only when you need them, so context stays lean.

### 1. Verify DAGP is applied and at the latest stable version

Look for `com.autonomousapps.dependency-analysis` in the root `build.gradle[.kts]`, `settings.gradle[.kts]`, or `buildSrc` / `build-logic` convention plugins. If it's missing, ask before adding (see [references/apply-dagp.md](references/apply-dagp.md)).

If applied, compare the declared version against the latest stable on the [Gradle plugin portal](https://plugins.gradle.org/plugin/com.autonomousapps.dependency-analysis) or the [GitHub releases / tags](https://github.com/autonomousapps/dependency-analysis-gradle-plugin/tags) (ignore `variant-artifacts-*` tags — those are a separate artifact, not the core plugin). Always look this up live rather than relying on a version in this file — newer DAGP versions fix analysis bugs and can change what advice is produced. If behind, propose the version bump as its own small PR first, re-run `buildHealth`, and diff the advice before continuing.

### 2. Baseline run

```bash
./gradlew buildHealth
```

Outputs to inspect:

- `build/reports/dependency-analysis/build-health-report.txt` — human-readable
- `build/reports/dependency-analysis/advice.json` — structured, machine-parseable

For a single module: `./gradlew :module:projectHealth`.

Don't run `fixDependencies` yet. Read the report first.

### 3. Triage — classify, don't just apply

Each `Advice` entry has `coordinates`, optional `fromConfiguration`, `toConfiguration`. The shape of the advice tells you what kind of change it is. **Don't treat all advice equally** — each category has different risk and a different best response.

Pull [references/advice-interpretation.md](references/advice-interpretation.md) for the full decision tree (including what to do when `:mod:reason` and `buildHealth` seem to disagree — usually stale state, occasionally a DAGP bug). In summary:

- **Unused dependency** (`toConfiguration = null`, remove) — usually safe. Check `reason` for annotation-only, reflection, or resource-only usage before removing.
- **Misused transitive** (add to declared) — usually safe. Ask: should this live in a convention plugin or bundle instead of being added module-by-module?
- **Configuration change to `api`-like** (`isToApiLike`) — **investigate**. Often the right fix is to stop exposing the type, not to promote the dep. `reason` shows exactly which class is leaking.
- **Configuration change away from `api`** (demotion) — usually safe and good; shrinks public ABI.
- **Redundant plugin advice** (`PluginAdvice`: `redundantKapt`, `redundantKotlinJvm`, `redundantJavaLibrary`) — generally precise. Remove.
- **Module advice** (Android resource / source-set issues) — case by case.

### 4. Look upstream at convention plugins

If the project uses `buildSrc/`, `build-logic/`, or applies `plugins { id("my-team.convention.*") }`, the same advice repeating across many modules is often a signal that the convention plugin is **over-applying** dependencies — adding them for *every* module even when most don't need them.

Fix at the convention-plugin level when the dep genuinely belongs to a small set of modules; fix at the consumer level when the convention plugin correctly applies a dep for most modules and this one is an outlier. Cross-cutting changes at the convention level need extra care because they affect many modules at once.

See [references/convention-plugins.md](references/convention-plugins.md) for detection and decision guidance.

### 5. Batch the changes

**Do not open a single PR that applies all advice at once.** It's unreviewable, unbisectable, and partial-rollback-hostile.

Propose a batching plan and confirm with the user before creating PRs. Reasonable cuts (pick one, or combine):

- **By module family** — one PR per feature area / team boundary.
- **By advice type** — all "unused removals" in one PR; all `api`/`implementation` demotions in another; convention-plugin changes in their own PR.
- **By blast radius** — touches to convention plugins or shared modules are their own PRs; touches to leaf modules can batch together.

Rule of thumb: a reviewer should be able to load the PR and hold the whole diff in their head. See [references/batching.md](references/batching.md) for concrete strategies.

### 6. Apply and verify each batch

For each batch:

1. Apply the chosen changes.
2. Compile the affected modules: `./gradlew :mod1:compile<Variant> :mod1:test :mod2:compile<Variant> :mod2:test` (Android: `compileDebugKotlin`, `testDebugUnitTest` or similar).
3. Re-run `./gradlew buildHealth` (or `:mod:projectHealth`) and confirm the targeted advice entries are gone and no new ones appeared.
4. Commit and open a PR with a clear, narrow title and the before/after advice.json excerpt in the body.

`fixDependencies` is a tool in the toolbox — it is suitable for the boring cases you've already investigated and classified as safe (typically: pure unused-removal batches). Prefer manual edits anywhere judgment is involved. Never run a project-wide `./gradlew fixDependencies` as a default.

### 7. When DAGP is wrong

If a verified-safe batch breaks compilation or tests and `:mod:reason --id <coord>` doesn't reveal the real cause, you may have hit a DAGP bug. Don't rush to file upstream. Isolate:

- Is the dep actually used via reflection, KAPT stubs, generated sources, or an Android AAR resource?
- Does a newer DAGP version already fix it? (upgrade & re-run)
- Does it reproduce in a minimal sample?

If it's a real DAGP bug, follow [references/upstream-issue.md](references/upstream-issue.md) to draft the report. **Show the draft to the user and wait for approval before filing** — the issue posts under their GitHub identity.

## Mandatory rules

- Don't run `./gradlew fixDependencies` (project-wide) as a default action. Prefer manual, per-module, per-batch edits.
- Don't promote a dependency from `implementation` to `api` without reading `:mod:reason` and confirming the exposure is intentional.
- Don't open PRs that apply all advice in one shot. Batch, confirm, iterate.
- Don't file an upstream DAGP issue without showing the user the draft first and getting explicit approval.
- Don't bump the DAGP version silently as part of a fix PR — version bumps are their own PR.
