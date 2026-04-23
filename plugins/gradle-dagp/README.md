# gradle-dagp

Analyze and fix Gradle module dependencies using the [autonomousapps dependency-analysis-gradle-plugin](https://github.com/autonomousapps/dependency-analysis-gradle-plugin) (DAGP) — **investigatively**, not blindly. Treats DAGP's advice as a starting point for architectural thinking rather than a script to auto-apply.

## What it does

DAGP produces precise, structured advice about unused, misused, and misconfigured dependencies in a Gradle project. This skill turns that advice into **good changes** — not merely *fewer advice entries*.

Specifically, it:

1. **Verifies DAGP is applied and at the latest stable version** before running anything. If the project is behind, proposes the version bump as its own PR first (newer DAGP versions fix analysis bugs and can change advice).
2. **Runs `./gradlew buildHealth`** and reads both `build/reports/dependency-analysis/build-health-report.txt` and `advice.json`.
3. **Triages advice by category** with a distinct decision tree per category:
   - **Unused removal** — usually safe, but checks for annotation processors, reflection, resources, service loaders before removing.
   - **Misused-transitive add** — usually safe, asks whether it should be covered by a bundle or convention plugin.
   - **`implementation → api` promotion** — **investigates instead of applying.** Runs `./gradlew :mod:reason --id <coord>` to see *which* type is leaking into the public ABI. Prefers refactoring callers (hide the type, wrap it, make it internal) over promoting the dep. Only promotes when the exposure is genuinely intentional.
   - **`api → implementation` demotion** — usually pure upside; applies and verifies.
   - **Redundant plugins** (`kapt` / `kotlin-jvm` / `java-library`) — generally precise, safe to remove.
4. **Detects convention plugins** (`buildSrc/`, `build-logic/`, namespaced local plugin IDs) and groups repeated advice. If the same dep is flagged as unused across many modules, the fix usually belongs *in* the convention plugin, not in each consumer.
5. **Batches fixes into reviewable PRs** — by advice type, module family, or blast radius. Convention-plugin changes and single architectural decisions (like `api` promotions) are always isolated in their own PR. No mega-PRs.
6. **Verifies each batch** by compiling + testing the affected modules and re-running `buildHealth`, checking that targeted advice is gone and no *new* advice appeared.
7. **Drafts upstream bug reports** when DAGP genuinely seems wrong — but **shows you the draft and waits for explicit approval before filing** (GitHub issues post under your identity).

## What it won't do

- Run `./gradlew fixDependencies` project-wide as a default. `fixDependencies` only edits the module build file; it can't refactor exposures, split convention plugins, or batch into reviewable PRs.
- Promote a dependency from `implementation` to `api` without reading `:mod:reason` first.
- Open a single PR applying every advice entry at once.
- File an upstream issue against `autonomousapps/dependency-analysis-gradle-plugin` without showing you the draft first.
- Silently bump the DAGP version as part of an unrelated fix PR — version bumps get their own PR.

## Requirements

- A Gradle project (JVM, Android, or both).
- `./gradlew` wrapper in the project root.
- `com.autonomousapps.dependency-analysis` applied, or consent to apply it. Minimum supported Gradle/AGP versions are whatever the currently-latest DAGP release supports — see the [Gradle plugin portal](https://plugins.gradle.org/plugin/com.autonomousapps.dependency-analysis).
- **For upstream bug filing:** `gh` CLI authenticated as you. The skill will never file an issue without your explicit approval of the drafted text.

## Usage

Ask Claude something like:

- *"run DAGP on this project and propose a cleanup plan"*
- *"DAGP says I should make `okio` api in `:core:network` — should I?"*
- *"clean up unused dependencies across the feature modules"*
- *"why does buildHealth flag the same dep in 14 modules? fix it"*
- *"I removed the dep DAGP told me to remove and the build broke — is DAGP wrong?"*

The skill will fire on mentions of `buildHealth`, `projectHealth`, `fixDependencies`, `reason`, `dependency-analysis-gradle-plugin`, `DAGP`, `unused dependencies`, `api-vs-implementation`, and similar phrases.

## How it thinks (the philosophy)

Three principles guide every decision:

1. **The goal is architecture, build speed, and maintainability — not a green `buildHealth`.** A module that passes DAGP but leaks transitive APIs to every consumer has *worse* architecture, not better.
2. **`implementation → api` is usually the wrong fix.** DAGP flags a third-party type leaking through the public ABI. The better response is typically to stop exposing that type — refactor the caller, wrap it, make it internal — rather than formalize the leak by promoting the dep. `api` declarations couple every consumer to upstream version bumps.
3. **DAGP can be wrong.** KAPT stubs, KSP, reflection, `Class.forName`, Android resources, `ServiceLoader`, and some build-script DSL can all confuse the analysis. When in doubt, use `./gradlew :mod:reason --id <coord>` — `reason` is the best debugging tool the plugin ships.

## What's in the box

```
plugins/gradle-dagp/
├── .claude-plugin/plugin.json
└── skills/gradle-dagp/
    ├── SKILL.md                          # philosophy + 7-step workflow
    ├── evals/evals.json                  # test prompts for iteration
    └── references/
        ├── advice-interpretation.md      # decision tree per advice category
        ├── convention-plugins.md         # buildSrc / build-logic awareness
        ├── batching.md                   # PR-splitting strategies
        ├── upstream-issue.md             # bug-filing template + approval guardrail
        └── apply-dagp.md                 # applying DAGP to a new project
```

References use progressive disclosure — SKILL.md stays lean; Claude pulls in each reference only when needed.

## Troubleshooting

**"DAGP says the dep is unused, but removing it breaks the build."** Most common cause: the dep is used by an annotation processor and should be declared as `kapt(...)` / `ksp(...)` instead of `implementation(...)`. Second most common: reflection / `ServiceLoader` / Android resources — invisible to static analysis. Third: a genuine DAGP bug. The skill walks through this triage in [references/upstream-issue.md](skills/gradle-dagp/references/upstream-issue.md).

**"`buildHealth` and `:mod:reason` disagree with each other."** Usually stale build state or a multi-variant Android project. Run `./gradlew clean buildHealth --rerun-tasks` and re-check. If they still disagree, it may be an upstream bug.

**"DAGP is flagging the same dep in every single module."** Strong signal that a convention plugin (`buildSrc/` or `build-logic/`) is over-applying it. See [references/convention-plugins.md](skills/gradle-dagp/references/convention-plugins.md) — the fix usually belongs in the convention plugin, not in every consumer.

**"I want to silence DAGP for a dependency I *know* is used via reflection."** Use the `dependencyAnalysis { issues { ... } }` DSL to add an explicit `exclude(...)` — and always pair it with a code comment (ideally linking to a reproducing test case or an upstream bug).

## License

Apache-2.0, same as the rest of this marketplace.
