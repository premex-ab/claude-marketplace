---
name: dependabot
description: >
  This skill should be used when the user asks to "rebase dependabot PRs",
  "dependabot rebase", "dependabot recreate", "dependabot ignore",
  "manage dependabot", "list dependabot PRs", "comment on dependabot PR",
  or mentions any @dependabot command (rebase, recreate, ignore, show ignore conditions).
  Handles all Dependabot PR management via GitHub CLI comments.
---

# Dependabot PR Management

Manage Dependabot pull requests by commenting with `@dependabot` commands via `gh` CLI.

## Supported Commands

| User Says | Dependabot Command | Effect |
|---|---|---|
| rebase | `@dependabot rebase` | Rebase the PR onto the base branch |
| recreate | `@dependabot recreate` | Recreate the PR, overwriting any manual edits |
| show ignore conditions | `@dependabot show <dep> ignore conditions` | Show all ignore conditions for a dependency |
| ignore major | `@dependabot ignore this major version` | Close PR, stop updates for this major version |
| ignore minor | `@dependabot ignore this minor version` | Close PR, stop updates for this minor version |
| ignore dependency | `@dependabot ignore this dependency` | Close PR, stop all updates for this dependency |

## Workflow

### Step 1: Identify Target PRs

When the user specifies a command without a specific PR number, list all open Dependabot PRs:

```bash
gh pr list --author "app/dependabot" --state open --json number,title,url
```

If the user says something like "rebase dependabot PRs" without specifying which ones, apply the command to **all** open Dependabot PRs. If the command is destructive (ignore, recreate), confirm with the user first before applying to all.

If no Dependabot PRs are found, inform the user.

### Step 2: Execute the Command

Post a comment on the target PR(s) using:

```bash
gh pr comment <PR_NUMBER> --body "@dependabot <command>"
```

### Step 3: Report Results

After commenting, report which PRs were updated and with what command.

## Command Mapping

Parse the user's intent to determine the correct `@dependabot` command:

- **"rebase"** / **"rebase dependabot PRs"** / **"rebase all"** → `@dependabot rebase`
- **"recreate"** / **"recreate PR #123"** → `@dependabot recreate`
- **"show ignore conditions for lodash"** → `@dependabot show lodash ignore conditions`
- **"ignore this major version"** / **"ignore major on #123"** → `@dependabot ignore this major version`
- **"ignore this minor version"** → `@dependabot ignore this minor version`
- **"ignore this dependency"** / **"ignore dependency on #123"** → `@dependabot ignore this dependency`

## Determining PR Scope

1. **User specifies PR number(s)**: Apply command to those PRs only
2. **User says "all"** or doesn't specify: List all open Dependabot PRs and apply to all (confirm first for destructive commands)
3. **User describes a dependency**: Find the matching Dependabot PR by searching titles
4. **Ambiguous**: Ask the user which PR(s) to target

## Safety Rules

- **Non-destructive commands** (rebase): Safe to apply to all PRs without confirmation
- **Destructive commands** (ignore, recreate): Always confirm with the user before applying to multiple PRs
- Always verify the repository has open Dependabot PRs before attempting commands
