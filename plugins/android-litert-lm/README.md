# android-litert-lm

> Builds an Android app that runs an open text LLM on the device, on the CPU or the GPU, with the LiteRT-LM Kotlin API (com.google.ai.edge.litertlm:litertlm-android). Use this skill when creating a chat, summarization, or extraction feature with a .litertlm model from Hugging Face litert-community (Gemma, Qwen, Llama, Phi), including the Gradle dependency, the GPU manifest entries, getting the model file onto the device, Engine initialization off the main thread, a streamed multi-turn Conversation with sendMessageAsync, and the AndroidViewModel and Compose screen. Don't use for running .tflite vision, audio, or embedding models with the CompiledModel API, for image or audio input, tool calling, or NPU backends, or for converting models.

**Upstream:** [`android/skills/device-ai/litert/litert-lm`](https://github.com/android/skills/tree/main/device-ai/litert/litert-lm) — mirrored and split into a one-plugin-per-skill layout so you can install skills individually. Auto-synced daily from upstream; the SKILL.md is Google-authored.

## Install

```bash
/plugin install android-litert-lm@premex-plugins
```

## What's in the box

- `skills/litert-lm/SKILL.md` — the skill definition
- `skills/litert-lm/references/` — supporting docs referenced from the skill
- `LICENSE.txt` — upstream Apache-2.0 license text

## Why this repo instead of cloning upstream?

The [top-level README](../../README.md#-android----googles-official-android-agent-skills) explains the rationale in detail. In short: upstream ships one monolithic repo of skills; this repo splits them into individually-installable plugins and auto-syncs daily.

## License

Apache-2.0 — see [`LICENSE.txt`](LICENSE.txt). The skill content is Google-authored; this directory is a packaging wrapper maintained by the Premex marketplace sync.
