# android-mlkit-agent-api

> Builds autonomous on-device agentic workflows in Android apps using the ML Kit GenAI Agent API powered by Gemini Nano and AICore. Use this skill when implementing conversational agents, multi-turn chat with AgentSession in a ViewModel, autonomous tool calling using Android AppFunctions (@AppFunctionDeclaration and AppFunctionAgentTools.discover), ephemeral single-turn execution with runner.runSingleTurnAsync, or handling GenAiException error resilience. It solves the problem of orchestrating local reasoning loops, typed tool dispatch, and session persistence on-device with zero cloud latency and privacy preservation. Don't use for cloud-based Gemini models or Vertex AI, single-turn text generation without agent loops (suggest Prompt API), or non-Android platforms.

**Upstream:** [`android/skills/device-ai/mlkit-agent-api`](https://github.com/android/skills/tree/main/device-ai/mlkit-agent-api) — mirrored and split into a one-plugin-per-skill layout so you can install skills individually. Auto-synced daily from upstream; the SKILL.md is Google-authored.

## Install

```bash
/plugin install android-mlkit-agent-api@premex-plugins
```

## What's in the box

- `skills/mlkit-agent-api/SKILL.md` — the skill definition
- `skills/mlkit-agent-api/references/` — supporting docs referenced from the skill
- `LICENSE.txt` — upstream Apache-2.0 license text

## Why this repo instead of cloning upstream?

The [top-level README](../../README.md#-android----googles-official-android-agent-skills) explains the rationale in detail. In short: upstream ships one monolithic repo of skills; this repo splits them into individually-installable plugins and auto-syncs daily.

## License

Apache-2.0 — see [`LICENSE.txt`](LICENSE.txt). The skill content is Google-authored; this directory is a packaging wrapper maintained by the Premex marketplace sync.
