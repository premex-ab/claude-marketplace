# github-utils

Talk to [Dependabot](https://github.com/dependabot) in plain English — Claude maps your intent to the right `@dependabot` command and posts it via `gh`, so you don't have to remember the exact syntax or click into each PR to comment.

> **One-liner:** Ask *"rebase all dependabot PRs"* or *"ignore the major version on #123"* and let Claude handle the GitHub CLI calls.

## What it does

Given a natural-language request, the `dependabot` skill:

1. **Maps intent to a Dependabot command** — rebase, recreate, ignore (major / minor / specific dep), show ignore conditions, etc.
2. **Scopes the target PRs** — single PR by number, all open Dependabot PRs, or PRs matching a described dependency.
3. **Confirms before destructive operations** — `ignore` and `recreate` always prompt before applying across multiple PRs. `rebase` (non-destructive) applies without extra confirmation.
4. **Posts the comments via `gh`** — `gh pr comment <PR> --body "@dependabot <command>"`.
5. **Reports results** — which PRs got which command.

## Supported commands

| Ask Claude | `@dependabot` command | Effect |
|---|---|---|
| *"rebase all dependabot PRs"* | `@dependabot rebase` | Rebase the PR(s) onto the base branch |
| *"recreate #123"* | `@dependabot recreate` | Recreate the PR, overwriting any manual edits |
| *"show ignore conditions for lodash"* | `@dependabot show lodash ignore conditions` | List ignore rules for a dependency |
| *"ignore major on #123"* | `@dependabot ignore this major version` | Close PR, stop updates for this major version |
| *"ignore minor on #123"* | `@dependabot ignore this minor version` | Close PR, stop updates for this minor version |
| *"ignore dependency lodash on #123"* | `@dependabot ignore this dependency` | Close PR, stop all updates for this dependency |

## Install

```bash
/plugin install github-utils@premex-plugins
```

## Requirements

- **`gh` CLI** installed and authenticated (`gh auth status` should pass). Claude uses it to read the PR list and post comments.
- The repo must have **Dependabot enabled** and at least one open Dependabot PR for most commands to have anything to target.
- The authenticated `gh` user must have **comment permission** on the target repository.

## Usage examples

```
> rebase all dependabot PRs
  → gh pr list --author "app/dependabot" --state open --json number,title,url
  → gh pr comment 142 --body "@dependabot rebase"
  → gh pr comment 147 --body "@dependabot rebase"
  → gh pr comment 151 --body "@dependabot rebase"
  Rebased 3 PRs.

> ignore the major on #147
  → Confirm: this will close #147 and stop major-version updates for this dep. Proceed?
  → gh pr comment 147 --body "@dependabot ignore this major version"
  Done.

> show ignore conditions for @types/node
  → gh pr comment 151 --body "@dependabot show @types/node ignore conditions"
  Posted — Dependabot will reply on the PR with the active conditions.
```

## What's in the box

- `skills/dependabot/SKILL.md` — command mapping, PR-scope heuristics, and safety rules (non-destructive auto-applies; destructive always confirms).

## Why this plugin exists

Dependabot's chat commands are useful but opaque — everyone ends up googling the exact phrasing, and when you have a dozen open PRs "rebase them all" is a dozen separate comment actions. This plugin collapses that into one natural-language ask.

## Troubleshooting

**"`gh: command not found`"** — install the GitHub CLI (<https://cli.github.com/>) and run `gh auth login`.

**"No Dependabot PRs found"** — check that `gh pr list --author "app/dependabot" --state open` returns rows. Older repos or some GitHub app configurations use a different author string — the skill falls back to matching PR titles if the author filter yields nothing.

**"Dependabot didn't respond to the command"** — verify the repo has Dependabot enabled in the repo's Security settings. Also verify the bot has permission to act on the branch (some org policies restrict bot-rebased commits on protected branches).

## License

Apache-2.0, same as the rest of this marketplace.
