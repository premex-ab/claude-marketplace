# Convention plugins and DAGP advice

In most non-trivial Gradle projects, dependencies aren't declared only in module `build.gradle[.kts]` files — they're also added by **convention plugins** living in `buildSrc/` or an included `build-logic/` composite build. When DAGP produces advice, some of it is really about the convention plugin, not the consumer.

Handling this well often produces **better fixes in fewer PRs**.

## Detecting convention plugins

Look for these patterns in the repo:

- `buildSrc/` directory with `.kt` or `.gradle.kts` files applying plugins / adding dependencies.
- `build-logic/` directory referenced from `settings.gradle[.kts]` via `includeBuild("build-logic")`.
- Modules applying `plugins { id("com.myorg.android.library") }` or similar namespaced local plugin IDs.
- A `*.gradle.kts` or `*ConventionPlugin.kt` that calls `dependencies { implementation(...) }` or configures a `DependencyHandlerScope`.

If any of these exist, every module that applies the convention plugin inherits its dependency block. DAGP analyzes the *effective* dependency graph and will report the same unused/misused dep on every module that applies the same convention.

## The signal: repeated advice

Open `build/reports/dependency-analysis/build-health-report.txt` (or parse `advice.json`) and group the advice by coordinate. If the same dependency is flagged as unused in **many modules** that all apply the same convention plugin, that's a strong signal the convention plugin is over-applying it.

Inverse: if a convention plugin adds `kotlinx-coroutines-core` for every module and DAGP only flags it as unused in 2 of 40 modules, the convention plugin is probably fine — the 2 modules are outliers.

## Decide where the fix lives

For each repeated advice entry, ask:

1. **Does this dep belong on every module that applies the convention plugin?** If yes → leave the convention plugin alone, remove the dep in the outlier consumers (or mark the outliers as legitimately not applying the convention).
2. **Does this dep belong on only *some* modules?** If yes → the convention plugin is too eager. Move the dep out of the convention plugin into either:
   - A narrower convention plugin (e.g., `com.myorg.android.feature` instead of `com.myorg.android.library`)
   - Direct per-module `implementation(...)` declarations in the modules that actually use it
   - A separate convention plugin specifically for modules needing that dep
3. **Is this dep genuinely wrong for the convention plugin to add at all?** (e.g., a leftover from a migration) — remove it at the source.

## The escape hatch convention plugins usually need

Most well-factored convention plugins have a way for individual modules to **opt out** of specific defaults. If yours doesn't, adding one (a boolean property, a DSL block, a plugin variant) is often the cleanest fix for "this dep should be added by default but sometimes shouldn't." Don't quietly hack the convention plugin with module-name conditionals — add a named opt-out.

## Testing convention-plugin changes

A change to a convention plugin affects every module that applies it. That's a wide blast radius. Minimum verification:

```bash
./gradlew buildHealth
./gradlew assemble    # or assembleDebug for Android
./gradlew test        # or the project's standard test task
```

Ideally also run CI on a branch before merging. **A convention-plugin PR should never be batched with consumer-level fixes** — keep it isolated so rollback is clean.

## Don't blindly follow `fixDependencies` across convention-plugin boundaries

`fixDependencies` edits the module's `build.gradle[.kts]` directly. It cannot refactor a convention plugin. If you run `fixDependencies` in a project where deps come from a convention plugin, you can end up with inconsistent duplication (the convention plugin still adds the dep, the module now also adds it) or advice that silently relocates whack-a-mole style. Identify convention-plugin-sourced advice first, handle it at the convention level, then apply remaining consumer advice.
