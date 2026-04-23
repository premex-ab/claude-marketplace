# Interpreting DAGP advice

DAGP's `advice.json` is a structured list. Each `Advice` has:

- `coordinates` — `{group, name, version}` for external, or `{identifier: ":path"}` for project deps
- `fromConfiguration` — where it's declared now (or `null` for adds)
- `toConfiguration` — where it should be (or `null` for removes)

From those two fields you can tell what kind of change DAGP is proposing:

| `fromConfiguration` | `toConfiguration` | Category | Typical risk |
|---|---|---|---|
| set | `null` | **Remove** — declared but unused | Low-ish (check reason) |
| `null` | set | **Add** — used transitively, undeclared | Low |
| set | set, different | **Change** — reconfigure | **Varies** — read on |
| set | same | n/a (not emitted) | — |

`PluginAdvice` is separate: `redundantKapt`, `redundantKotlinJvm`, `redundantJavaLibrary`, etc. — usually precise.

`ModuleAdvice` covers Android-specific source-set issues and similar. Case-by-case.

## The decision tree

### Remove (unused dependency)

`implementation("com.squareup.okhttp3:okhttp:4.9.0")` flagged for removal.

**Default**: remove it. But first ask: could this dep be used via a path the analyzer misses?

- **Annotation processors / KAPT / KSP** — a compile-only annotation declared as `implementation` will be flagged, but removal breaks code generation. Check whether it belongs as `kapt("...")` or `ksp("...")` instead.
- **Reflection / Class.forName / service loaders** — DAGP can't see runtime reflection. If the module loads a class by string, the dep is still required even if no type reference exists.
- **Android resources / layouts / manifest** — a library contributing only resources can be missed. Check `AndroidManifest.xml`, layouts, and styles for references.
- **Test runtime** — `testRuntimeOnly` / `androidTestRuntimeOnly` usage (e.g., a JUnit engine, an AndroidX test runner) is often legitimately not compile-referenced.
- **Duplicate declaration of the same coordinate** — DAGP's advice is per-coordinate, not per-line. If `implementation(foo:bar)` is declared 2+ times in the same `build.gradle.kts`, DAGP emits **one** "unused" entry — meaning "one copy is redundant", not "remove all copies". `:mod:reason --id foo:bar` will still show the usages that justify the dep. **Action: dedupe to a single declaration; don't delete the last copy.** This one bites automation especially hard: a script that removes every matching line will strip a real dep and break the build. Before applying removal advice programmatically, grep the build file for duplicates of the coordinate and either dedupe in-place or skip the advice for that module and handle it manually.
- **Source-set-only usage (screenshot tests, androidTest, testFixtures)** — a dep flagged as unused at `implementation` may be used exclusively from a non-main source set (`src/screenshotTest/`, `src/androidTest/`, `src/testFixtures/`). DAGP usually emits a paired "move to `screenshotTestImplementation`" or similar suggestion, but if the source-set is analyzed weakly (e.g., `screenshotTest` on some AGP versions) it may just flag the coord as unused. If your verify step only runs `:mod:compileDebugKotlin` + `:mod:compileDebugAndroidTestKotlin`, it won't catch a break caused by removing a dep that was only keeping the screenshotTest compile classpath alive. For modules with `src/screenshotTest/` sources, include `:mod:compileDebugScreenshotTestKotlin` in the verify loop.

If the `reason` task confirms it's actually unused, remove it. Otherwise change the configuration (e.g., `kapt(...)` instead of `implementation(...)`) or file an upstream bug with a minimal repro.

```bash
./gradlew :mod:reason --id com.example:lib
```

### Add (misused transitive — declared upstream, used directly here)

DAGP says: "you're using this class, but you rely on a transitive to pull it in."

**Default**: add the direct declaration. Two higher-order questions first:

1. **Is there already a shared bundle or convention plugin** that should cover this (e.g., "all modules get kotlinx-coroutines-core")? If so, the fix is conceptually about making the consumer use that bundle — but if the consumer already does and DAGP still wants the direct dep, declare it directly. DAGP follows the convention that direct use means direct declaration, which also protects you when upstream changes its transitive set.
2. **Could this be `api` in the upstream module**, such that consumers legitimately inherit it? If a team-owned upstream module *should* re-export a library, move the fix there instead. If the upstream is external / third-party, just add directly.

### Change to `api`-like configuration (the dangerous one)

DAGP flagged that a type from this dependency is part of the module's public ABI — e.g., a function returns `okio.BufferedSource` or a public class extends a library type. Advice: `implementation` → `api`.

**Default: investigate, don't just apply.** Run:

```bash
./gradlew :mod:reason --id com.squareup.okio:okio
```

`reason` will print the exact class(es) exposing the dep. Then decide, in order of preference:

1. **Stop exposing the type.** Can the public API return a different type? Can the class be made internal? Can the call site go through a small wrapper in this module? Hiding third-party types from consumers is almost always better for long-term maintainability — it decouples consumer modules from upstream library version bumps.
2. **Move the responsibility.** If the exposure is essential (this is a library whose whole job is to expose okio), check whether this is the right module to be exposing it at all, or if a dedicated "-api" module would be cleaner.
3. **Promote to `api`.** Only once (1) and (2) are ruled out. This creates an explicit contract: upgrading this dep now has ABI consequences for every consumer.

Rule of thumb: the more consumers a module has, the higher the cost of promoting to `api`. Libraries consumed by one app-level module can usually afford an `api` declaration. Shared/core modules consumed by 20+ features should refactor instead.

### Change away from `api` (demotion)

`api("foo:bar:1.0")` → `implementation("foo:bar:1.0")`: the dep isn't actually part of the module's public ABI. **Default: apply.** Demotions shrink the ABI contract, which is usually pure upside.

The only thing to double-check: do you have a downstream module silently relying on this transitively? Compile+test after the change catches that immediately; if a consumer breaks, that consumer has its own unreported `misused-transitive` advice waiting.

### Change between `implementation` / `compileOnly` / `runtimeOnly` etc.

Usually DAGP is right about these — `runtimeOnly` for JDBC drivers, `compileOnly` for annotation-only libs. Check `isCompileOnly` / `isRuntimeOnly` on the Advice. Apply and verify.

### Processor vs. runtime

`kapt("...")`-vs-`implementation("...")` confusions are common. DAGP's `isProcessor` flag is precise; apply and verify that generated sources still compile.

### Plugin advice

`PluginAdvice` with `redundantKotlinJvm` / `redundantKapt` / `redundantJavaLibrary` is precise — a plugin is applied that does nothing in this module's context. **Default: remove.** Watch for convention-plugin side effects: if the redundant plugin was applied by a convention plugin you didn't author, removing it from the consumer won't help — see [convention-plugins.md](convention-plugins.md).

### Module advice

Android-specific (unused resources, etc.) or similar structural advice. Treat case-by-case; `reason` doesn't always apply here. If unclear, ask the user rather than guessing.

## When `reason` disagrees with `buildHealth`

It can happen. A `reason` output that says "no advice" while `buildHealth` reports advice usually means stale build state or a multi-variant Android project where different variants have different advice. Clean and re-run:

```bash
./gradlew clean buildHealth --rerun-tasks
```

If they still disagree, you may have hit a bug — see [upstream-issue.md](upstream-issue.md).
