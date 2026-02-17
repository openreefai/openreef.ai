---
id: skill
version: "1.0"
description: Entry point for OpenReef onboarding — routes users to search, use, or create formations
domain: www.openreef.ai
security: ./security.md
transitions:
  - target: search
    trigger: User wants to find or discover formations
    url: ./search.md
  - target: use
    trigger: User wants to install a formation by name
    url: ./use.md
  - target: create
    trigger: User wants to build a new formation
    url: ./create.md
  - target: publish
    trigger: User explicitly states intent to publish a formation to the registry
    url: ./publish.md
prohibitions:
  - Never prompt for GitHub credentials
  - Never proactively suggest or prompt publishing in default flows — publish.md is only reached when the user explicitly states publish intent
  - Never prompt for Tide authentication or reef login
  - Never make direct API calls to tide.openreef.ai — all operations go through the reef CLI
  - Never offer fork as an option
---

# OpenReef

OpenReef is a package manager for multi-agent systems. **Formations** are declarative packages that define one or more AI agents, their personalities, tools, communication topology, and deployment configuration. You search, install, create, and publish formations using the `reef` CLI, with the Tide registry (`tide.openreef.ai`) as the public package source.

---

## Prerequisites

1. **OpenClaw >= 0.5.0** — the agent runtime. Must be installed and running.
2. **`reef` CLI** — install with `npm i -g @openreef/cli`.

---

## What do you want to do?

1. **Search** — find formations in the Tide registry
2. **Use** — install a formation (by name, path, or tarball)
3. **Create** — build a new formation from scratch or with AI assistance

---

## Decision Rules

Route the user based on their stated intent:

| User intent | Transition |
|-------------|------------|
| Wants to find, discover, or browse formations | Read `./search.md` |
| Wants to install or deploy a specific formation | Read `./use.md` |
| Wants to build, create, or scaffold a new formation | Read `./create.md` |
| Explicitly states intent to publish a formation to the registry | Read `./publish.md` |

**Important:** Publish is not a default menu option. Only route to `./publish.md` if the user explicitly states they want to publish. Never proactively suggest publishing.

---

## Fallback

If the user's intent is ambiguous, ask **one** clarifying question from this fixed set:

- "Are you looking for an existing formation, or do you want to build a new one?"
- "Do you already know the name of the formation you want to install?"

Do not ask open-ended questions. Do not present more than one clarifying question at a time.
