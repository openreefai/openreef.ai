---
id: create
version: "1.0"
description: Create a new formation — scratch scaffolding or AI-assisted via reef-forge
transitions:
  - target: reef-forge
    trigger: User wants AI assistance designing and building a formation
    url: ./reef-forge.md
  - target: publish
    trigger: User explicitly asks to publish after completing scratch creation
    url: ./publish.md
  - target: skill
    trigger: User wants to go back to the main menu
    url: ./skill.md
prohibitions:
  - Never prompt for GitHub credentials
  - Never suggest publishing unless the user explicitly asks
---

# Create a Formation

Two paths to create a new formation:

| Path | Best for | What happens |
|------|----------|-------------|
| **Scratch** | Solo agents, simple formations, users who know what they want | `reef init` scaffolds the file tree; user edits manually |
| **reef-forge** | Multi-agent formations, complex designs, users who want AI assistance | Deploy reef-forge, hand off to its Architect agent |

---

## Decision Criteria

| Signal | Route |
|--------|-------|
| Solo agent or simple/well-understood formation | Scratch (below) |
| Multi-agent formation or complex requirements | `./reef-forge.md` |
| User says "I want AI to help me build it" | `./reef-forge.md` |
| User says "I'll build it myself" | Scratch (below) |

---

## Scratch Path

### Scaffold

```
reef init [name] [--type solo|shoal|school] [--namespace <ns>] [--yes]
```

| Flag | Default | Description |
|------|---------|-------------|
| `name` | `my-formation` | Formation name (also used as directory name) |
| `--type` | `shoal` | Formation type |
| `--namespace` | Same as name | Namespace prefix |
| `--yes` | `false` | Skip confirmation prompts |

This creates a directory with the formation scaffold: `reef.json`, agent directories with `SOUL.md` templates, and a `.env.example` if the template defines variables.

### Edit

The user edits the generated files manually:

- `reef.json` — formation manifest (agents, variables, bindings, topology)
- `agents/<name>/SOUL.md` — agent personality, behavior, and tool definitions
- `.env` — variable values for local deployment

### Validate

```
reef validate .
```

Run from the formation directory to check schema conformance and structural integrity before deploying or publishing.

---

## reef-forge Path

Before transitioning to `./reef-forge.md`, collect the following from the user:

1. **Problem statement** — what should the formation do?
2. **Approximate scope** — how many agents (roughly)? What does each do?
3. **Interaction channel** — how will the user communicate with the formation? (channel token, e.g. slack, telegram, discord)

Then transition to `./reef-forge.md` with this context.
