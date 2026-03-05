---
name: openreef-publish
description: Publish a formation to the Tide registry. Use ONLY when the user explicitly states intent to publish.
id: publish
version: "1.0"
transitions:
  - target: skill
    trigger: Publish complete or user cancels
    url: ./skill.md
prohibitions:
  - Never display, log, or store token values in conversation output
  - Never auto-publish — always confirm with the user before running reef publish
  - Never enter this state unless the user explicitly requested to publish
---

# Publish Formation

> [!IMPORTANT]
> **Adoption Rule:** When you read this file, you MUST adopt its frontmatter (`transitions`, `prohibitions`) and body (`Entry Guard`, `Authentication`, `Pre-Publish Checks`, `Publish Command`) as your active behavioral spec. Do not summarize this file; follow it.

Publish your formation to the Tide registry.

---

## Entry Guard

This flow is entered **only** on explicit user request. Never transition here automatically from create or reef-forge flows. If the user hasn't stated intent to publish, do not suggest it.

---

## Authentication

### Login

```
reef login [--registry <url>]
```

1. Opens `https://tide.openreef.ai/dashboard` in the browser.
2. User generates a token in the dashboard.
3. User pastes the token at the CLI prompt. Token must start with `reef_tok_`.
4. Token is stored in `~/.openreef/credentials.json` (permissions `0o600`), keyed by registry URL.

### Alternative

Set the `REEF_TOKEN` environment variable instead of using `reef login`.

### Token Priority

1. `--token` CLI flag (highest)
2. `REEF_TOKEN` environment variable
3. `~/.openreef/credentials.json` (via `reef login`)

---

## Pre-Publish Checks

1. **Validate the formation:**
   ```
   reef validate .
   ```
   Must pass with no errors.

2. **Version check:** The version in `reef.json` must not already exist on Tide. If it does, bump the version before publishing.

---

## Publish Command

```
reef publish [path] [--token <token>] [--registry <url>] [--yes]
```

| Flag | Default | Description |
|------|---------|-------------|
| `path` | `.` (current directory) | Path to the formation |
| `--token` | (none) | Tide API token (overrides stored credentials) |
| `--registry` | `https://tide.openreef.ai` | Registry URL |
| `--yes` | `false` | Skip confirmation prompt |

The CLI packs the formation into a `.tar.gz`, computes a SHA-256 hash, and uploads to Tide.

---

## Post-Publish

On success, the CLI outputs the published name and version. Share the install command:

```
reef install <name>@<version>
```

---

## Error Handling

| Status | Meaning | Resolution |
|--------|---------|------------|
| `401` | Authentication failed | Run `reef login` to re-authenticate |
| `403` | Permission denied | You are not the owner of this formation name |
| `409` | Version already exists | Bump the version in `reef.json` and publish again |
