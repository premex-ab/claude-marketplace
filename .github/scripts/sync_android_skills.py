#!/usr/bin/env python3
"""Sync android/skills into per-skill Claude Code plugins.

Reads every SKILL.md under /tmp/upstream (cloned android/skills repo), produces
one plugin directory per skill at plugins/android-<skill-name>/, and regenerates
.claude-plugin/marketplace.json so all current android-* plugins are listed
alongside any non-android plugins already present.
"""
from __future__ import annotations

import json
import os
import shutil
import sys
from pathlib import Path

import yaml

UPSTREAM = Path(os.environ.get("UPSTREAM_DIR", "/tmp/upstream"))
REPO = Path(os.environ.get("GITHUB_WORKSPACE", Path.cwd()))
PLUGINS_DIR = REPO / "plugins"
MARKETPLACE_JSON = REPO / ".claude-plugin" / "marketplace.json"
PLUGIN_PREFIX = "android-"
PLUGIN_VERSION = "0.1.0"

# android-* plugins that are hand-authored in this repo and NOT derived from
# android/skills upstream. Cleanup leaves these alone so the daily sync doesn't
# delete them.
PRESERVE_PLUGINS = frozenset({
    "android-cli-setup",
})


def parse_frontmatter(skill_md: Path) -> dict:
    text = skill_md.read_text(encoding="utf-8")
    if not text.startswith("---\n"):
        raise ValueError(f"{skill_md} missing YAML frontmatter")
    _, fm, _ = text.split("---\n", 2)
    return yaml.safe_load(fm)


def normalise(s: str) -> str:
    return " ".join(s.split())


def discover_upstream_skills() -> list[Path]:
    skills = []
    for p in UPSTREAM.rglob("SKILL.md"):
        rel = p.relative_to(UPSTREAM)
        if any(part.startswith(".") for part in rel.parts):
            continue
        skills.append(p)
    return sorted(skills)


def remove_existing_android_plugins() -> None:
    if not PLUGINS_DIR.exists():
        return
    for child in PLUGINS_DIR.iterdir():
        if (
            child.is_dir()
            and child.name.startswith(PLUGIN_PREFIX)
            and child.name not in PRESERVE_PLUGINS
        ):
            shutil.rmtree(child)


def write_plugin(skill_md: Path) -> str:
    skill_dir = skill_md.parent
    skill_name = skill_dir.name
    plugin_name = f"{PLUGIN_PREFIX}{skill_name}"
    plugin_dir = PLUGINS_DIR / plugin_name

    dest_skill = plugin_dir / "skills" / skill_name
    dest_skill.mkdir(parents=True, exist_ok=True)
    for item in skill_dir.iterdir():
        dest = dest_skill / item.name
        if item.is_dir():
            shutil.copytree(item, dest)
        else:
            shutil.copy2(item, dest)

    shutil.copy2(UPSTREAM / "LICENSE.txt", plugin_dir / "LICENSE.txt")

    fm = parse_frontmatter(skill_md)
    description = normalise(fm["description"])
    manifest = {
        "name": plugin_name,
        "version": PLUGIN_VERSION,
        "description": description,
    }
    (plugin_dir / ".claude-plugin").mkdir(parents=True, exist_ok=True)
    (plugin_dir / ".claude-plugin" / "plugin.json").write_text(
        json.dumps(manifest, indent=2) + "\n", encoding="utf-8"
    )
    return plugin_name


def regenerate_marketplace() -> None:
    marketplace = json.loads(MARKETPLACE_JSON.read_text(encoding="utf-8"))
    entries: list[dict] = []
    for plugin_dir in sorted(PLUGINS_DIR.iterdir(), key=lambda p: p.name):
        manifest_path = plugin_dir / ".claude-plugin" / "plugin.json"
        if not manifest_path.exists():
            continue
        pj = json.loads(manifest_path.read_text(encoding="utf-8"))
        entries.append({
            "name": pj["name"],
            "version": pj["version"],
            "description": pj["description"],
            "source": f"./plugins/{plugin_dir.name}",
        })
    marketplace["plugins"] = entries
    MARKETPLACE_JSON.write_text(
        json.dumps(marketplace, indent=2) + "\n", encoding="utf-8"
    )


def main() -> int:
    if not UPSTREAM.exists():
        print(f"ERROR: upstream clone missing at {UPSTREAM}", file=sys.stderr)
        return 1

    skill_mds = discover_upstream_skills()
    if not skill_mds:
        print("ERROR: no SKILL.md files found upstream", file=sys.stderr)
        return 1

    seen: set[str] = set()
    for skill_md in skill_mds:
        plugin_name = f"{PLUGIN_PREFIX}{skill_md.parent.name}"
        if plugin_name in seen:
            print(
                f"ERROR: duplicate plugin name '{plugin_name}' — upstream has two "
                f"SKILL.md directories with the same basename.",
                file=sys.stderr,
            )
            return 1
        seen.add(plugin_name)

    remove_existing_android_plugins()

    for skill_md in skill_mds:
        name = write_plugin(skill_md)
        rel = skill_md.parent.relative_to(UPSTREAM)
        print(f"synced: {name} (from {rel})")

    regenerate_marketplace()
    print(f"Regenerated {MARKETPLACE_JSON.relative_to(REPO)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
