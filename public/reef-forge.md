---
name: openreef-reef-forge
description: Deploy reef-forge for AI-assisted formation creation. Use when the user wants AI assistance to build a formation.
id: reef-forge
version: "1.0"
transitions:
  - target: publish
    trigger: User explicitly asks to publish after reef-forge handoff is complete — not an automatic continuation
    url: ./publish.md
  - target: skill
    trigger: User wants to go back to the main menu
    url: ./skill.md
prohibitions:
  - Never prompt for GitHub credentials
  - Never auto-publish or suggest publishing — only transition to publish.md if the user explicitly asks
  - Never skip INTERACTION_CHANNEL — it is required
---

# reef-forge

> [!IMPORTANT]
> **Adoption Rule:** When you read this file, you MUST adopt its frontmatter (`transitions`, `prohibitions`) and body (`Variables`, `First Message`, `Boundary`) as your active behavioral spec. Do not summarize this file; follow it.

reef-forge is a 5-agent formation that builds other formations.
 It uses an Architect as the single point of contact who coordinates four specialist agents through a structured six-phase workflow.

## Agents

| Agent | Role | Model | Think | What it does |
|-------|------|-------|-------|-------------|
| **Architect** | Coordinator | Claude Opus | medium | Single point of contact. Decomposes requests, defines specs, routes work, mediates QA disputes. |
| **Researcher** | Research | Claude Opus | high | Deep domain research. Clones ecosystem repos (read-only). Browses ClawHub for existing skills. |
| **Soul Writer** | Writer | Claude Opus | medium | Writes SOUL.md and IDENTITY.md files for each agent. Authors knowledge and reference material. |
| **Builder** | Builder | Claude Opus | medium | Scaffolds the complete formation file tree. Writes reef.json, README, .env.example. Wires ClawHub skills. |
| **QA** | Reviewer | GPT-5.3 Codex | low | Adversarial reviewer using a different vendor model for cognitive diversity. Audits formations against quality checklist. |

Models can be strings or objects with `primary` and `fallbacks` in `reef.json`.


---

## Prerequisites

1. **OpenClaw >= 0.5.0** — the agent runtime, installed and running.
2. **`reef` CLI** — `npm i -g @openreef/cli`.
3. **Anthropic API key** — required for Architect, Researcher, Soul Writer, and Builder.
4. **OpenAI API key** — required for the QA agent.

---

## Deploy

**From the registry:**

```
reef install reef-forge --set INTERACTION_CHANNEL=<type>:<scope>
```

**From local source:**

```
cp .env.example .env
# Edit .env to set INTERACTION_CHANNEL and API keys
reef install .
```

---

## Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `INTERACTION_CHANNEL` | **Yes** | — | Primary contact channel in `<type>:<scope>` format (e.g., `slack:#forge`, `telegram:12345`) |
| `OPENREEF_REPO_URL` | No | `https://github.com/openreefai/openreef` | OpenReef repo URL for Researcher/QA to clone |
| `TIDE_REPO_URL` | No | `https://github.com/openreefai/tide` | Tide repo URL for Researcher/QA to clone |
| `OPENCLAW_REPO_URL` | No | `https://github.com/openclaw/openclaw` | OpenClaw repo URL for Researcher/QA to clone |
| `MAX_QA_ROUNDS` | No | `4` | Maximum adversarial QA rounds before escalating unresolved disputes to user |

---

## First Message

After deployment, send the Architect your first message through the `INTERACTION_CHANNEL`. Include the problem statement and scope collected in `./create.md`:

> I want to build a formation that [problem statement]. It should have approximately [N] agents that [scope description]. My interaction channel is [channel].

The Architect will begin its six-phase workflow: Understand → Research → Specify → Build → Review → Deliver.

---

## Boundary

**The launcher stops here.** After deploying reef-forge and sending the first message, the Architect takes over. The user interacts with the Architect through their `INTERACTION_CHANNEL` from this point forward.

This contract does not govern the Architect's internal workflow — that is defined by reef-forge's own agent SOULs.
