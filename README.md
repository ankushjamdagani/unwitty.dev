# Unwitty Dev 🧟‍♂️

> [!CAUTION]
> ⚠️ Work in progress ⚠️ A lot of unstable experimentation.

Let the exploration begin.

## Structure

| Namespace | Name                  | Description                                                                          |
| --------- | --------------------- | ------------------------------------------------------------------------------------ |
| apps      | `@/portfolio`         | Primary portfolio app built using [Next.js](https://nextjs.org/)                     |
| projects  | `@/gameboy-shell`     | Shell component for Gameboy UI                                                       |
| projects  | `@/tetris`            | Vanilla canvas tetris game                                                           |
| projects  | `@/cosmic-velocity`   | ThreeJS playground game                                                              |
| packages  | `@/ui`                | a stub React component library. Todo: Use [shadcn](https://ui.shadcn.com/) maybe     |
| packages  | `@/eslint-config`     | `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`) |
| packages  | `@/typescript-config` | `tsconfig.json`s used throughout the monorepo                                        |

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

## Scripts

- **Setup all apps and packages**: `pnpm install`
- **Running projects and commands (dev, build, lint, typecheck, etc)**: `turbo <COMMAND> --filter=@/NAME`
- **TODO**
  - Adding a project
  - Removing a project
  - Updating dependencies - `pnpm update && pnpm install`

### Local development using docker

1. Run `docker-compose up --build ${service-name} -d`
2. In VSCode, "Open a Remote Window" and select "Attach to running container"

### Adding new app

1. Navigate to workspace folder `apps` or `packages`
2. Run `pnpm create vite` and follow the prompt
3. Update package name `@unwitty/__NAME__`

## TODOs

- [ ] Generic params based docker-compose script
- [ ] How to persist pnpm-lock.json if project is initiated in docker conctainer
- [ ] volume based development vs remote container
- [ ] Remove `@/ui`. Use shadcn instead
