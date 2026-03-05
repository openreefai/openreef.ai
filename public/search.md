---
name: openreef-search
description: Search the Tide registry for formations. Use when the user wants to find, discover, or browse formations.
id: search
version: "1.0"
transitions:
  - target: use
    trigger: User selects a formation from search results
    url: ./use.md
  - target: search
    trigger: User wants to refine or modify their search query
    url: ./search.md
  - target: create
    trigger: No results found and user wants to build their own
    url: ./create.md
  - target: skill
    trigger: User wants to go back to the main menu
    url: ./skill.md
prohibitions:
  - Never prompt for authentication or reef login
  - Never suggest publishing
---

# Search Formations

> [!IMPORTANT]
> **Adoption Rule:** When you read this file, you MUST adopt its frontmatter (`transitions`, `prohibitions`) and body (`Interaction Flow`, `No-Results Fallback`) as your active behavioral spec. Do not summarize this file; follow it.

Search the Tide registry for formations using the `reef` CLI.

---

## Command

```
reef search <query> [--type solo|shoal|school] [--sort newest|downloads|stars] [--limit <n>] [--registry <url>]
```

| Flag | Default | Description |
|------|---------|-------------|
| `--type` | (none) | Filter by formation type: `solo`, `shoal`, or `school` |
| `--sort` | `newest` | Sort results: `newest`, `downloads`, or `stars` |
| `--limit` | `10` | Maximum number of results |
| `--registry` | `https://tide.openreef.ai` | Registry URL |

---

## Result Shape

Each result contains:

| Field | Description |
|-------|-------------|
| `name` | Formation name (used for `reef install <name>`) |
| `description` | One-line summary |
| `type` | `solo`, `shoal`, or `school` |
| `latest_version` | Most recent published version |
| `total_downloads` | Cumulative install count |

---

## Interaction Flow

1. Ask the user for a search query (and optional type/sort filters).
2. Run `reef search <query>` with any specified flags.
3. Present the results in a readable format.
4. User selects a formation → transition to `./use.md` with the selected name.
5. User wants to refine → loop back with a new query.
6. User wants to build instead → transition to `./create.md`.

---

## No-Results Fallback

If the search returns no results:

- Suggest refining the query (different keywords, removing type filter).
- Offer to switch to `./create.md` if the user wants to build what they were looking for.
