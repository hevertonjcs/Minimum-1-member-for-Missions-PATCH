# English Prompt

Use this prompt in Codex or ChatGPT when updating the **Mission Required Members Min1** mod.

```text
I have an old mod JSON and a new original .pabgb file extracted from the latest game version.

I want to update the Mission Required Members Min1 mod.

Use the old JSON to understand what the mod changed. Do not apply the old offsets directly, because they may have changed in the new game version.

Remap the offsets by searching for the same nodes and mission categories inside the new factionnode.pabgb.

Then generate a folder with:
1. updated factionnode.pabgb
2. new JSON with remapped offsets
3. simple report saying how many changes were applied and whether there were any errors

Files:
- old mod JSON: [put path here]
- new original factionnode.pabgb file: [put path here]

Note:
I extract the original game files using PAZ Unlocker.
```

## For the other mods

If updating **Mission Efficiency Bundle 20x**, use:

```text
New original file: gamedata/skill.pabgb
```

If updating **MEGA STACKS 999999**, use:

```text
New original file: gamedata/iteminfo.pabgb
```

