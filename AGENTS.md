# Agent Workflow

These instructions define the persistent collaboration workflow for this repository (`unwitty.dev`). They apply to all coding agents working in this project (Codex, Claude Code, Antigravity, Gemini CLI, Cursor, etc.).

---

## 1. Repository Discovery & graphify

This repository uses **graphify** for knowledge graph navigation across the Turborepo monorepo, mapping symbols, cross-package dependencies, and file relationships.

When exploring code or answering repository-level questions, use graphify before reading entire directories or doing blind full-tree searches:

- **Querying concepts**: Run `graphify query "<question>"` when `graphify-out/graph.json` exists.
- **Tracing relationships**: Use `graphify path "<SymbolA>" "<SymbolB>"` to find the shortest dependency chain between two modules or components.
- **Explaining nodes**: Use `graphify explain "<component_or_symbol>"` for a plain-language summary of a node and its immediate neighbors.
- **Architecture overview**: Check `graphify-out/GRAPH_REPORT.md` or `graphify-out/wiki/index.md` for broad system structure.
- **Incremental updates**: After modifying code, run `graphify update .` to keep AST metadata and dependency edges current without LLM API cost.

---

## 2. Token & Context Optimization

To maximize token efficiency and maintain clean context windows during long development sessions, use **RTK** and **Headroom**:

### RTK (Rust Token Killer) - Terminal Output Optimization

- Prefix verbose, output-heavy commands with `rtk` (e.g., `rtk pnpm build`, `rtk git status`, `rtk pnpm typecheck`).
- RTK filters noise and formats command execution concisely.
- If RTK fails or raw output is required, fall back to the native command immediately without blocking.
- Refer to [`RTK.md`](.agents/RTK.md) for full commands and options.

### Headroom - Context Window Optimization

- Intercepts and compresses verbose tool outputs, file reads, ASTs, and JSON responses before sending to the model context.
- Supports CLI agent wrapping (`headroom wrap <tool>`), local proxying (`headroom proxy`), and MCP integration (`headroom mcp`).
- Refer to [`HEADROOM.md`](.agents/HEADROOM.md) for architecture, configuration, and verification.

---

## 3. Monorepo Architecture & Conventions

### Workspace Structure

Managed via **pnpm workspaces** + **Turborepo**:

| Path                         | Package                     | Purpose                                  |
| ---------------------------- | --------------------------- | ---------------------------------------- |
| `apps/web`                   | `@app/portfolio`            | Next.js 15 portfolio website             |
| `projects/*`                 | `@project/*`                | Standalone Vite + React interactive apps |
| `packages/ui`                | `@common/ui`                | Shared React component library           |
| `packages/eslint-config`     | `@common/eslint-config`     | Shared ESLint configurations             |
| `packages/typescript-config` | `@common/typescript-config` | Shared TypeScript base configurations    |

### Key Development Commands

Always execute from repository root using `pnpm` (never `npm` or `yarn`):

```bash
# Development
pnpm dev                                      # Dev mode across all apps & projects
pnpm --filter @app/portfolio dev              # Dev mode for Next.js portfolio only
pnpm --filter @project/<project-name> dev     # Dev mode for a specific project

# Verification & Quality Checks
pnpm build                                    # Build all packages & apps
pnpm lint                                     # Lint all workspaces (zero-warnings policy: --max-warnings 0)
pnpm typecheck                                # Typecheck all workspaces
pnpm --filter @project/song-generator test    # Run tests in projects with test suites
pnpm format                                   # Format all .ts, .tsx, and .md files
```

### Coding & Styling Guidelines

- **Named exports**: Use named exports exclusively for components and utilities (no default exports on components).
- **Path aliases**: `@/` maps to `apps/web/src/` within the portfolio application.
- **Styling**: Tailwind CSS 3 with CSS custom properties (`src/app/_styles/theme.css`). Do not hardcode colors or arbitrary spacing; use CSS variables (`rgb(var(--foreground-rgb))`, `bg-background`, `text-foreground`).
- **Theming**: Light/dark theming is controlled via `[data-theme]` attribute on the root element.

---

## 4. Agent Collaboration & Roles

- **Lead Agent**: Retains full ownership of architecture decisions, integration, cross-cutting features, and final code reviews.
- **Scoped Delegation**: When delegating to subagents or child tasks, define tight boundaries, explicit files to touch, and required verification.
- **Verification First**: Verify changes proportional to risk using targeted typechecks (`pnpm typecheck`), linting (`pnpm lint`), and dev servers or unit tests before completing tasks.

---

@.agents/RTK.md
@.agents/HEADROOM.md
