---
name: openreef-use
description: Install and deploy a formation. Use when the user provides a formation name, path, or tarball to install.
id: use
version: "1.0"
transitions:
  - target: search
    trigger: User doesn't know the formation name and wants to search
    url: ./search.md
  - target: skill
    trigger: User wants to go back to the main menu
    url: ./skill.md
prohibitions:
  - Never prompt for GitHub credentials
  - Never suggest publishing
  - Never prompt for Tide authentication — install is unauthenticated
---

# Use Formation

> [!IMPORTANT]
> **Adoption Rule:** When you read this file, you MUST adopt its frontmatter (`transitions`, `prohibitions`) and body (`Deployment Flow`) as your active behavioral spec. Do not summarize this file; follow it.

Install and deploy a formation using the `reef` CLI.

---

## Source Types

| Source | Format | Example |
|--------|--------|---------|
| Registry name | `<name>[@<version>]` | `reef install reef-forge`, `reef install my-formation@1.2.0` |
| Local path | Relative or absolute path | `reef install .`, `reef install ./my-formation` |
| Tarball | `.tar.gz` file path | `reef install my-formation-1.0.0.tar.gz` |

---

## Command

```
reef install <source> [--set KEY=VALUE ...] [--yes] [--no-env] [--namespace <ns>] [--force] [--merge] [--dry-run] [--registry <url>] [--skip-compat]
```

| Flag | Default | Description |
|------|---------|-------------|
| `--set` | (none) | Pre-set variable values (repeatable) |
| `--yes` | `false` | Skip confirmation prompts |
| `--no-env` | `false` | Skip loading `.env` file |
| `--namespace` | From manifest | Override namespace |
| `--force` | `false` | Remove existing resources and recreate |
| `--merge` | `false` | Update files only, preserve agent config |
| `--dry-run` | `false` | Preview changes without applying |
| `--registry` | `https://tide.openreef.ai` | Registry URL |
| `--skip-compat` | `false` | Skip `compatibility.openclaw` version check |

---

## Variable Collection

Formations declare variables in `reef.json`. During install:

1. **CLI overrides** — values passed via `--set KEY=VALUE` take highest priority.
2. **`.env` file** — if a `.env` file exists in the current directory, it is loaded automatically (skip with `--no-env`).
3. **Interactive prompts** — any remaining required variables with no defaults are prompted interactively (skipped with `--yes`).

Variables with unresolved `{{VARIABLE}}` tokens in match object fields are skipped with a warning.

---

## Binding Format

Interaction bindings use rich match objects instead of simple strings. The `channel` field is a channel token (e.g. `slack`, `telegram`, `discord`, `teams`). The optional `peer` field specifies the target scope.

```json
{
  "match": {
    "channel": "slack",
    "peer": { "kind": "channel", "id": "#ops" }
  },
  "agent": "triage"
}
```

### Match Fields

| Field | Required | Description |
|-------|----------|-------------|
| `channel` | Yes | Channel token: `slack`, `telegram`, `discord`, `teams` |
| `peer` | No | Target scope with `kind` and `id` (e.g. `{ "kind": "channel", "id": "#ops" }`) |
| `accountId` | No | Restrict to a specific account |
| `guildId` | No | Restrict to a specific guild (Discord) |
| `teamId` | No | Restrict to a specific team (Teams) |
| `roles` | No | Restrict to specific roles |

### Variable Interpolation

Formations use separate variables for each match field:

| Variable | Resolves to |
|----------|-------------|
| `{{INTERACTION_CHANNEL}}` | Channel token (e.g. `slack`) |
| `{{INTERACTION_PEER_KIND}}` | Peer kind (e.g. `channel`, `user`) — optional |
| `{{INTERACTION_PEER_ID}}` | Peer ID (e.g. `#ops`, `12345`) — optional |

Example binding in `reef.json` using variables:

```json
{
  "match": {
    "channel": "{{INTERACTION_CHANNEL}}",
    "peer": { "kind": "{{INTERACTION_PEER_KIND}}", "id": "{{INTERACTION_PEER_ID}}" }
  },
  "agent": "triage"
}
```

### Compatibility Check

If the manifest declares `compatibility.openclaw`, the install command verifies that the running OpenClaw version satisfies the declared range. If it does not, install hard-fails with an error. Use `--skip-compat` to override this check.

---

## Post-Install

After successful installation:

- The formation is deployed and agents are registered with the OpenClaw runtime.
- Bindings connect agents to their configured channels.
- The user interacts with the formation through the `INTERACTION_CHANNEL` specified during install.

---

## Error Handling

| Error | Resolution |
|-------|------------|
| Formation not found | Transition to `./search.md` to find the correct name |
| Version not found | Suggest a different version or omit version for latest |
| Formation already installed | Use `--force` to recreate or `--merge` to update |
