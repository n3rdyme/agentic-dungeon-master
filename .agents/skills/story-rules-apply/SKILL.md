---
name: story-rules-apply
description: Re-apply the active Story role's narration, pacing, player-agency, viewpoint, NPC, relationship, quest, persistence, combat-transition, and player-facing rules without changing campaign state. Use when the user says "Apply Story Rules", asks to reload, refresh, restore, or re-read the story rules, or indicates that Story mode has drifted from its established behavior.
---

# Apply Story Rules

Read [`story-mode-rules.md`](../../references/story-mode-rules.md) completely. Apply every instruction immediately to the active Story role and all subsequent story responses. This includes distinguishing combat intent and preparation from execution, narrating every player-perceptible causal beat before a combat handoff, and invoking `combat-start` only after its threshold is established. Do not summarize, reproduce, or discuss the rules unless the user explicitly asks; acknowledge completion briefly and remain in the current scene.
