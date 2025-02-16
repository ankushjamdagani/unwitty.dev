# Unwitty Dev 🧟‍♂️

> [!CAUTION]
> ⚠️ Work in progress ⚠️ A lot of unstable experimentation.

Let the exploration begin.

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and packages

- `apps/web`: Primary portfolio app built using [Next.js](https://nextjs.org/)
- `projects/gameboy-shell`: Shell component for Gameboy UI
- `games/cosmic-velocity`: ThreeJS racing game

- `packages/ui`: a stub React component library. Todo: Use [shadcn](https://ui.shadcn.com/) maybe
- `packages/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `packages/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Scripts

To setup all apps and packages, run the following command:

```js
pnpm install
```

To build all apps and packages, run the following command:

```js
pnpm build
```

To develop all apps and packages, run the following command:

```js
pnpm dev
```

To develop one app, run the following command:

`pnpm dev --filter=@/typing-racer-web`

### Local development using docker

1. Run `docker-compose up --build ${service-name} -d`
2. In VSCode, "Open a Remote Window" and select "Attach to running container"

### Adding new app

1. Navigate to workspace folder `apps` or `packages`
2. Run `pnpm create vite` and follow the prompt
3. Update package name `@unwitty/__NAME__`

## TODOs

[] Generic params based docker-compose script
[] How to persist pnpm-lock.json if project is initiated in docker conctainer
[] volume based developement vs remote container
