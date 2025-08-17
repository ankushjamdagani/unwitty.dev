# Turborepo Cheatsheet

A minimal, structured reference compiled from the official Turborepo docs. Optimized for quick daily use.

---

## 1) What is Turborepo?

- High‑performance build system for JavaScript/TypeScript.
- Scales monorepos (and single‑package workspaces) via task graphs + local/remote caching.
- Uses your existing `package.json` scripts + a single `turbo.json`.

```
ASCII: Remote Cache (concept)

    Dev A      Dev B      CI       Dev C
      \         |        /           /
              [ Shared Cache ]
      /         |        \           \
    (hits pull/save artifacts/logs when hashes match)
```

---

## 2) Quick Start

- Install (global, optional): `npm i -g turbo` (or `pnpm i -g turbo`, `yarn global add turbo`).
- Scaffold new monorepo: `pnpm dlx create-turbo@latest` (npm/yarn/bun equivalents supported).
- Incremental adoption: add a root **`turbo.json`** + keep your existing scripts.

**Common layout**

```
repo/
  apps/        # deployable apps (Next.js, Vite, SvelteKit, API, CLI…)
  packages/    # internal libraries & shared tooling
  package.json # workspaces + packageManager
  turbo.json   # tasks + caching config
  .turbo/      # local cache dir (auto)
```

---

## 3) `turbo.json` Essentials

Minimal example:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "command": "tsc -b",
      "dependsOn": ["^build"],
      "inputs": ["src/**", "tsconfig*.json", "package.json"],
      "outputs": ["dist/**"],
      "env": ["NODE_ENV", "API_URL"]
    },
    "lint": { "command": "eslint . --max-warnings 0" },
    "test": { "command": "vitest run", "dependsOn": ["build"] }
  }
}
```

### Key fields (per task)

- **`command`**: shell command to run.
- **`dependsOn`**: task deps (e.g., `"^build"` = parents’ `build`; `"build#self"` = same package first).
- **`inputs`**: globs that affect hash; include config files that change behavior.
- **`outputs`**: files/dirs restored on cache hit (dist, build artifacts).
- **`env` / `globalEnv`**: env vars included in the hash (ensure correctness).
- **Other useful**: `cache` (boolean), `persistent` (long‑running dev servers), `outputMode` (e.g., `stream`), `maxParallel`, `retry`, `timeout`.

**Remote cache (optional)**

```json
{
  "remoteCache": {
    "signature": true
  }
}
```

Set secret key via `TURBO_REMOTE_CACHE_SIGNATURE_KEY` if using artifact signing.

---

## 4) Running Tasks

- All packages: `turbo run build`
- Filter to a workspace: `turbo run test --filter=@repo/web`
- Filter by path: `turbo run lint --filter=./apps/web`
- Bypass cache: `turbo run build --no-cache`
- Plan only: `turbo run build --dry`
- Dev loops: mark tasks `persistent: true` in `turbo.json` (preferred over ad‑hoc `--parallel`).

**Common CLI flags (short)**

| Flag                  | Purpose                        |
| --------------------- | ------------------------------ |
| `--filter=<selector>` | Run in selected workspace(s)   |
| `--no-cache`          | Execute tasks ignoring cache   |
| `--dry`               | Print plan without running     |
| `--summarize`         | Emit JSON summary of tasks/env |

> Tip: Keep task names consistent across packages (`build`, `test`, `lint`, `dev`).

---

## 5) Caching 101

- **Local cache**: hashes inputs/env; restores `outputs` + logs on hit.
- **Remote cache**: shares artifacts across teammates/CI.
  - Local dev: `turbo login` → `turbo link`.
  - CI: set `TURBO_TOKEN` + `TURBO_TEAM` (provider‑specific) and run `turbo run ...`.

- Hygiene: specify `outputs`, include relevant `inputs`, declare envs; avoid printing secrets (logs are cached).

---

## 6) Environment Variables (correct hashing)

- Declare **all** env that change behavior under `env`/`globalEnv`.
- Use **eslint** helpers to catch undeclared env:
  - `eslint-config-turbo` (flat or legacy)
  - `eslint-plugin-turbo` → rule `turbo/no-undeclared-env-vars`

- `.env` files: follow framework guidance; prefer not mutating env at runtime.

---

## 7) Internal Packages (sharing code)

**Strategies**

1. **Just‑in‑Time**: export TS/JS; consumer bundler transpiles; minimal config; not cacheable as a build.
2. **Compiled**: build with `tsc`/bundler to `dist/**`; add to `outputs` for caching.
3. **Publishable**: compiled + ready for npm publishing.

**Install internal packages**

```json
{
  "dependencies": {
    "@repo/ui": "workspace:*"
  }
}
```

---

## 8) Useful Commands (toolbox)

| Command                       | What it does                          |            |                  |
| ----------------------------- | ------------------------------------- | ---------- | ---------------- |
| `turbo run <task>`            | Run task across the graph             |            |                  |
| `turbo watch`                 | Watch & re‑run on changes (dev)       |            |                  |
| `turbo prune`                 | Create a subset for CI/deploys        |            |                  |
| `turbo ls`                    | List workspaces / tasks               |            |                  |
| `turbo query`                 | Inspect package/task graph            |            |                  |
| `turbo boundaries`            | Enforce import boundaries             |            |                  |
| `turbo generate`              | Run local code generators             |            |                  |
| `turbo scan`                  | Detect tasks/files/config across repo |            |                  |
| `turbo login / link / unlink` | Manage remote cache linkage           |            |                  |
| `turbo info`                  | Print environment/daemon/debug info   |            |                  |
| \`turbo telemetry \[status    | enable                                | disable]\` | Manage telemetry |

---

## 9) Editor Integration

- Add `$schema` to `turbo.json` for IntelliSense/validation.
- Turborepo language server/extension improves editing (autocomplete, linting for env usage).

---

## 10) CI Tips

- Use Remote Cache to avoid repeated work.
- Keep root deps minimal; install per‑package where used.
- Use `turbo-ignore` to skip jobs early in CI when nothing changed.
- Document common filters your team uses in PR templates.

---

## 11) Upgrading

- Use `npx @turbo/codemod` to migrate between major versions and apply schema changes automatically.

---

## 12) Practical Patterns

- Always specify `outputs` for cacheable tasks.
- Include config files in `inputs` (e.g., `tsconfig.json`, `vite.config.ts`).
- Prefer shared tooling packages under `packages/` (eslint, tsconfig, jest/vitest config).
- Keep task commands simple; put complex logic in scripts or JS files.

---

### Mini Checklist

- [ ] `turbo.json` present at repo root
- [ ] Shared cache configured (optional but recommended)
- [ ] Each cacheable task has `outputs`
- [ ] Env that changes behavior is declared
- [ ] Internal packages compiled when needed
- [ ] CI uses `turbo prune`/filters where helpful

_Source: condensed directly from the official Turborepo documentation._
