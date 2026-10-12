# RTK - Rust Token Killer (Codex / CLI Proxy)

**Usage**: Token-optimized CLI proxy for terminal and shell commands.

RTK intercepts and filters command output to eliminate repetitive boilerplate and minimize token consumption before output reaches the LLM context.

---

## Preferred Usage

Prefix supported, output-heavy shell commands with `rtk` whenever available. Use the underlying command directly if RTK does not support it, if exact raw output is required, or if RTK encounters an issue; do not block a task on RTK.

### Common Repository Commands

```bash
# Git operations
rtk git status
rtk git diff
rtk git log -n 5

# Monorepo build, lint, & typecheck (pnpm / Turbo)
rtk pnpm build
rtk pnpm lint
rtk pnpm typecheck

# Running workspace tests
rtk pnpm --filter @project/song-generator test
rtk pnpm --filter @project/svg-editor test

# Package management
rtk pnpm install
```

---

## Meta Commands

```bash
rtk gain            # View cumulative token savings analytics
rtk gain --history  # View recent command token savings history
rtk proxy <cmd>     # Run raw command through proxy without filtering
```

---

## Verification

```bash
rtk --version
rtk gain
which rtk
```
