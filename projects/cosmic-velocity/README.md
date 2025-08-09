# unwitty-dev

Personal portfolio 3D experience based on `react-three-fiber`

[Notion Docs](https://www.notion.so/ankushjamdagani/Plan-Portfolio-e4b5dba83ca949b9b2658db60557dc58?pvs=4)

## GamePlay

- Iteration 1
  Scene is a grassland. Pokeball is on a stand and zombie/bug apocalypse occurs. You can shoot from pokeball to convert zombies. Or jump and move away.
- Iteration 2
  Scene is pokeball planet. We have to paint the planet but pikachu is electrocuting us.
- Iteration 3
  Scene is pokeball planet similar to saturn. There's a car racing on it's rings. Points for hitting pokeballs. And -ve points for hitting pokemons.

## Setup

- TBD

## Guidelines

### Directory Structure

> Refining this structure over time

```python
- /public
- /src
  - /components
  - /constants
  - /objects
  - /resources # Manages all assets loading, path and config data
  - /scenes
  - App
- /config # bundler, linter, deployment, etc
- /tests # integration tests
- /docs
```

## Tech Stack

- Language: [TypeScript](https://www.typescriptlang.org/)

- UI

  - [React](https://react.dev/)
  - [Next.js](https://nextjs.org/)

  - Design Sytem: [Radix UI](https://www.radix-ui.com/) @`/design-system`
  - [Stylex](https://stylexjs.com/docs/learn/)
  - [Web Animation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) and [View Transition](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API) API

- 3D

  - [ThreeJS](https://threejs.org/)
  - [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)

- State Management

  - [Zustand](https://docs.pmnd.rs/zustand/)
  - [React Query](https://tanstack.com/query/latest/)

- Helpers

  - [Drei](https://drei.pmnd.rs/)
  - [usehooks-ts](https://usehooks-ts.com/)
  - [lodash-es](https://www.npmjs.com/package/lodash-es)

- Dev Helpers

  - [ESLint](https://eslint.org/) - Also, use `eslint-config-prettier` to turn off prettier rules in eslint
  - [Prettier](https://prettier.io/)
  - [Vite](https://vitejs.dev/guide/)
  - [SWC](https://swc.rs/)
  - [vite-pwa](https://vite-pwa-org.netlify.app/)
  - [Postcss Normalise](https://github.com/csstools/postcss-normalize)
  - BrowserList
  - Normalize CSS

- Dev Ops

  - [Monitoring: Sentry](https://sentry.io/welcome/)
  - [Logging: Axiom](https://axiom.co/)

- Under consideration

```
⛑ Typesafe API: tRPC
🌐 i18n: Format.js + custom i18n routing
🗺 ORM: Prisma
🗄 Database: Supabase (PostgreSQL)
🔐 Authentication: Supabase
- Multiplayer: Supabase
⬇️ Markdown: MDX + Rehype + Remark | (Unifiedjs)
Notifications - https://novu.co/
```

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
   parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
   },
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

## Learnings

- Physics doesnt apply on displacementMap (it's on GPU side, Physics is on CPU side).
- For wrapping texture

```javascript
texture.map.wrapS = THREE.RepeatWrapping;
texture.map.wrapT = THREE.RepeatWrapping;
```

- For making terrain - transform geometry and add heightfield collider based on z value
- For lights on transformed geometry - call geometry.computeVertexNormals
- Texture splatting
- Joints used for constraint system like car ([Example](https://sketches.isaacmason.com/sketch/rapier/revolute-joint-vehicle))
- Rapier params

```js
maxStabilizationIterations={50}
maxVelocityFrictionIterations={50}
maxVelocityIterations={100}
updatePriority={PriorityPhysicsUpdate}
```

## Assets

1. Nasa - Moon assets [CGI Kit](https://svs.gsfc.nasa.gov/4720) | [Usage](https://science.nasa.gov/moon/)
