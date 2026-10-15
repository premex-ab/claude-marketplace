# android-litert-runtime

> Configures and implements LiteRT (.tflite) on-device inference on Android in Kotlin using the CompiledModel API on CPU and GPU. Use this skill for any Android LiteRT or .tflite task, including Gradle setup, image classification or vision/audio/embedding helpers, TensorBuffer reuse, Bitmap preprocessing, AndroidViewModel GPU-to-CPU fallback with warm-up on a single-thread dispatcher, migrating from legacy org.tensorflow.lite.Interpreter or GpuDelegate, and latency benchmarking. Don't use for running generative text LLMs with .litertlm files or for Python model conversion.

**Upstream:** [`android/skills/device-ai/litert/litert-runtime`](https://github.com/android/skills/tree/main/device-ai/litert/litert-runtime) — mirrored and split into a one-plugin-per-skill layout so you can install skills individually. Auto-synced daily from upstream; the SKILL.md is Google-authored.

## Install

```bash
/plugin install android-litert-runtime@premex-plugins
```

## What's in the box

- `skills/litert-runtime/SKILL.md` — the skill definition
- `skills/litert-runtime/references/` — supporting docs referenced from the skill
- `LICENSE.txt` — upstream Apache-2.0 license text

## Why this repo instead of cloning upstream?

The [top-level README](../../README.md#-android----googles-official-android-agent-skills) explains the rationale in detail. In short: upstream ships one monolithic repo of skills; this repo splits them into individually-installable plugins and auto-syncs daily.

## License

Apache-2.0 — see [`LICENSE.txt`](LICENSE.txt). The skill content is Google-authored; this directory is a packaging wrapper maintained by the Premex marketplace sync.
