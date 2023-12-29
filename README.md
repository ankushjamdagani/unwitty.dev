# Unwitty Dev 🧟‍♂️

> [!CAUTION]
> ⚠️ Work in progress ⚠️ A lot of unstable experimentation.

Let the exploration begin.

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and packages

- `apps/web`: Primary portfolio app built using [Next.js](https://nextjs.org/)
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

To build all apps and packages, run the following command:

```
pnpm build
```

To develop all apps and packages, run the following command:

```
pnpm dev
```

### Remote Caching

[Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

```
npx turbo login
npx turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)
