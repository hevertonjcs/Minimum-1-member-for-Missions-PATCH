# Crimson Desert Mod Update Guide

Simple guide for updating Crimson Desert `.pabgb` JSON patch mods after a game update.

## What this is for

This guide explains the basic workflow I use to update mods when a new Crimson Desert version changes the game files and old offsets no longer work.

The main idea is:

1. Extract the new original game files.
2. Compare the old mod JSON with the new original `.pabgb`.
3. Remap the offsets instead of applying the old offsets directly.
4. Generate a new updated `.pabgb` and a new JSON with the updated offsets.
5. Validate that all changes were applied correctly.

## Tool used to extract files

I use a **PAZ Unlocker** to extract the original game files and folders from the current game version.

After extraction, I grab the original `.pabgb` file needed by the mod.

## Mods I usually update

| Mod | Original file needed |
| --- | --- |
| Mission Required Members Min1 | `gamedata/factionnode.pabgb` |
| Mission Efficiency Bundle 20x | `gamedata/skill.pabgb` |
| MEGA STACKS 999999 | `gamedata/iteminfo.pabgb` |

## Example: Mission Required Members Min1

For **Mission Required Members Min1**, the file needed is:

```text
gamedata/factionnode.pabgb
```

Basic workflow:

1. Extract the new game files with PAZ Unlocker.
2. Get the new original `factionnode.pabgb`.
3. Get the old JSON from the Mission Required Members Min1 mod.
4. Ask Codex or ChatGPT to compare the old JSON with the new file.
5. Do not apply old offsets directly.
6. Remap the offsets by searching for the same nodes and mission categories in the new `factionnode.pabgb`.
7. Generate an updated `factionnode.pabgb`.
8. Generate a new JSON with the remapped offsets.
9. Generate a small report showing how many changes were applied and whether any failed.

## Recommended output structure

```text
Mission_Required_Members_Min1_UPDATED/
  gamedata/
    factionnode.pabgb
  mission_required_members_min1_remapped.json
  REPORT.txt
```

## Prompts

Use one of these prompt files:

- [PROMPT_PT_BR.md](PROMPT_PT_BR.md)
- [PROMPT_EN.md](PROMPT_EN.md)

## Notes

- Always use the original `.pabgb` from the new game version.
- Do not patch the old modded file unless you know exactly what changed.
- Old offsets may be wrong after every game update.
- The safest method is to remap offsets using names/entries from the old JSON.
- Always validate the final result before sharing the updated mod.

