---
id: security
version: "1.0"
description: Domain trust model, token rules, and credential policy for the OpenReef ecosystem
transitions: []
prohibitions:
  - Never display, log, or store token values in conversation output
  - Never make direct HTTP requests to tide.openreef.ai — all operations go through the reef CLI
  - Never prompt for credentials outside the publish.md flow
---

# Security Model

This document defines the trust boundaries, credential handling, and formation security rules for the OpenReef ecosystem. All other contract files reference this document.

---

## Domain Trust Model

| Domain | Role | Auth required | Operations |
|--------|------|---------------|------------|
| `www.openreef.ai` | Documentation and bootstrap surface | No | Read-only. Static files. No API, no auth, no operations. |
| `tide.openreef.ai` | Operational surface (registry + dashboard) | Yes (for writes) | Search (public), publish, token management. All accessed via `reef` CLI. |

**Rule:** A bot operating within this contract must never make direct HTTP requests to `tide.openreef.ai`. All registry operations — search, install, publish, login — go through the `reef` CLI, which handles authentication, request signing, and error mapping internally.

---

## Token Rules

- **Format:** All tokens start with `reef_tok_`.
- **Storage location:** `~/.openreef/credentials.json` with file permissions `0o600` (owner read/write only). The parent directory `~/.openreef/` uses permissions `0o700`.
- **Storage structure:** Tokens are keyed by registry URL, allowing multiple registry configurations:
  ```json
  {
    "https://tide.openreef.ai": { "token": "reef_tok_..." }
  }
  ```
- **Token sources (priority order):**
  1. `--token` CLI flag
  2. `REEF_TOKEN` environment variable
  3. `~/.openreef/credentials.json` (via `reef login`)
- **Scope:** Tokens are required only for authenticated registry actions: `reef publish`, `reef whoami`. Read operations (`reef search`, `reef install`) are unauthenticated.

---

## Credential Collection Policy

Credentials are collected **only** when the current operation requires them. The rules:

1. **Search and install flows** — no credentials required. Never prompt for login.
2. **Create flow (scratch or reef-forge)** — no registry credentials required. Never prompt for login.
3. **Publish flow** — credentials required. The `reef login` step is part of `publish.md` and opens the Tide dashboard (`https://tide.openreef.ai/dashboard`) for token generation.
4. **No proactive login prompts** — never suggest `reef login` outside the publish flow. If a user hasn't expressed intent to publish, authentication is irrelevant.

---

## No-Secret-Logging

- Never display token values in conversation output, logs, or summaries.
- When confirming login status, show only the token prefix (e.g., `reef_tok_...`).
- Never include tokens in code blocks, command examples with real values, or file contents shown to the user.

---

## Formation Security

- **Declarative install:** The `reef install` flow is declarative. Formations do not execute arbitrary install-time scripts. Agent configuration, file deployment, and binding registration are handled by the OpenReef runtime.
- **Integrity checks:** SHA-256 hashes are computed during `reef pack` and verified during install.
- **Pre-install audit:** Users can run `reef inspect <source>` to examine a formation's agents, bindings, variables, and file tree before installing.
- **Validation:** `reef validate <path>` checks schema conformance and structural integrity without deploying.
- **Per-agent sandboxing:** Each agent runs within its own sandbox with configurable network and filesystem permissions defined in `reef.json`.
