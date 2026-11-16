# android-ios-to-android

> Use for ANY task that ports or implements Android functionality from an iOS/Swift codebase — including single-feature tasks (BLE scanning, location/GPS tracking, billing, Health Connect, background work, database, one screen), not just full-app migrations. Primary coordinating skill for migrating iOS apps and subsystems to Android (Jetpack Compose, Room, Kotlin Coroutines and Flow, Architecture Components). Handles both full-app greenfield migrations and scoped sub-component feature migrations: Info.plist permissions and AndroidManifest.xml mapping (Android 14+ runtime permissions and foreground service types), SwiftUI views and screen layouts, CoreData/Room, StoreKit/Google Play Billing (in-app subscriptions and purchases), HealthKit/Health Connect, CoreBluetooth/BLE, CoreLocation/GPS, BGTaskScheduler/WorkManager, and UserDefaults/DataStore. Don't use for Android-only work with no iOS source, for converting Android XML Views to Compose, or for building or changing iOS apps.

**Upstream:** [`android/skills/migration/ios-to-android`](https://github.com/android/skills/tree/main/migration/ios-to-android) — mirrored and split into a one-plugin-per-skill layout so you can install skills individually. Auto-synced daily from upstream; the SKILL.md is Google-authored.

## Install

```bash
/plugin install android-ios-to-android@premex-plugins
```

## What's in the box

- `skills/ios-to-android/SKILL.md` — the skill definition
- `skills/ios-to-android/references/` — supporting docs referenced from the skill
- `LICENSE.txt` — upstream Apache-2.0 license text

## Why this repo instead of cloning upstream?

The [top-level README](../../README.md#-android----googles-official-android-agent-skills) explains the rationale in detail. In short: upstream ships one monolithic repo of skills; this repo splits them into individually-installable plugins and auto-syncs daily.

## License

Apache-2.0 — see [`LICENSE.txt`](LICENSE.txt). The skill content is Google-authored; this directory is a packaging wrapper maintained by the Premex marketplace sync.
