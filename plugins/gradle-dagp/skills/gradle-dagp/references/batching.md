# Batching DAGP fixes into reviewable PRs

A full DAGP cleanup on a non-trivial project typically produces dozens to hundreds of advice entries. Cramming them into one PR is a review nightmare: reviewers can't hold it in their head, a single failing module blocks the whole change, and partial rollbacks become impossible.

Batch. Confirm the batching plan with the user before creating PRs.

## Batching strategies

Pick one — or combine — depending on the project's shape.

### By advice type

Separate PRs for each kind of change:

1. **Unused-dependency removals** — low risk, mechanical, easy to review.
2. **Misused-transitive additions** — also low risk.
3. **Demotions (`api` → `implementation`)** — low risk, but verify downstream modules still compile.
4. **Promotions (`implementation` → `api`)** — highest judgment content. Usually these get refactored away rather than applied. If genuinely promoting, **one coordinate per PR** so the architectural decision is reviewable in isolation.
5. **Redundant plugin removals** — usually safe, often one PR is fine.
6. **Configuration-type changes** (`runtimeOnly`, `compileOnly`, `kapt`, `ksp`) — batch if similar, split if mixed.

Advantage: each PR has a single review mental model. Reviewers with context for "should we expose this type?" can engage with the promotion PRs and skip the mechanical ones.

### By module family / team ownership

One PR per module or team boundary:

- `:feature:checkout` + its sub-modules → one PR
- `:core:*` → one PR (or split further if `:core` is large)
- Convention plugin changes → their own PR, always

Advantage: aligns with code ownership. Each PR goes to the team that knows that area. Good fit for monorepos with CODEOWNERS.

### By blast radius

- **Leaf-module changes** (module has few or no downstream consumers) — can batch fairly aggressively, since a mistake only breaks that module.
- **Shared / core-module changes** — smaller batches. A regression here blocks everything downstream.
- **Convention plugin / build-logic changes** — always their own PR. Affects every module that applies the plugin.

### Hybrid (most common)

In practice you'll often combine strategies:

- One PR: convention-plugin pruning
- Separate PRs: unused removals per team/domain
- Separate PRs: demotions
- Individual PRs: each API-exposure architectural decision

## Size rules of thumb

These are starting points, not hard rules — the right PR size depends on the team's reviewer culture, the test coverage of the affected modules, and how mechanical the changes are. Adjust toward *smaller* when in doubt:

- **Pure removals / adds** tolerate larger batches because the diff is uniform and easy to skim.
- **Mixed-type advice** is harder to review; prefer tighter scope.
- **Convention plugin changes** — keep the scope crisp (one convention plugin or one concern per PR), whatever the line count.
- **Single-architectural-decision PRs** (promotions, exposure changes, refactors) — one decision per PR, ideally just the one change, so the decision is reviewable in isolation.

If you find yourself drafting a PR large enough that a reviewer would want to split it, split it yourself first. "Could a reviewer hold this diff in their head?" is the question that actually matters.

## Per-batch verification checklist

Before opening each PR:

1. Apply the batch's changes locally.
2. Compile + test the affected modules (not the whole project for a leaf-module PR — local feedback should stay fast).
3. Re-run `./gradlew buildHealth` (or `:module:projectHealth` per affected module) and confirm:
   - The targeted advice entries are gone.
   - No *new* advice appeared that wasn't there before.
4. Paste the before/after advice diff for the affected modules into the PR description. Reviewers love this.
5. If any advice entry *didn't* go away after your change, something is off — don't open the PR with stale leftovers. Investigate `reason` output.

## PR description template

```
## What

Applies DAGP advice for [module family / advice type / specific concern].

## Scope

- [list of modules / files touched]
- Advice categories: [unused removal, misused-transitive add, demotion, ...]

## Before / after

<details><summary>Advice diff for :mymod</summary>

Before:
- implementation("com.example:lib:1.0") → remove
- add implementation("com.example:transitive:1.0")

After: no advice.

</details>

## Verification

- [ ] `./gradlew :mymod:projectHealth` clean
- [ ] `./gradlew :mymod:compile<Variant> :mymod:test` green
- [ ] No new advice elsewhere in the project

## Not in this PR

- Convention plugin changes (separate PR #NNN)
- api/implementation promotions (not applying — refactoring instead in #MMM)
```

## After the last batch

Re-run `./gradlew buildHealth` on `main` after all batches land. Expect it to be clean (or warning-only). If residual advice remains, it's usually:

- A genuine DAGP false-positive (see [upstream-issue.md](upstream-issue.md)).
- An intentional decision the team made (e.g., "yes we pull this transitively on purpose") — document it via the DAGP DSL (`dependencyAnalysis { ... ignore(...) ... }`) with a code comment explaining why.
