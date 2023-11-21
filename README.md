# unwitty-dev

Personal portfolio 3D experience based on `react-three-fiber`

[Notion Docs](https://www.notion.so/ankushjamdagani/Plan-Portfolio-e4b5dba83ca949b9b2658db60557dc58?pvs=4)

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

- [Postcss Normalise](https://github.com/csstools/postcss-normalize)
- BrowserList
- Normalize CSS

- [React](https://react.dev/)
- [ThreeJS](https://threejs.org/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- [Drei](https://drei.pmnd.rs/)
- [TypeScript](https://www.typescriptlang.org/)

- Meta
  - [Vite](https://vitejs.dev/guide/)
  - [SWC](https://swc.rs/)
  - [vite-pwa](https://vite-pwa-org.netlify.app/)

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

```
texture.map.wrapS = THREE.RepeatWrapping;
texture.map.wrapT = THREE.RepeatWrapping;
```

- For making terrain - transform geometry and add heightfield collider based on z value
- For lights on transformed geometry - call geometry.computeVertexNormals
- Texture splatting

## Assets

1. Nasa - Moon assets [CGI Kit](https://svs.gsfc.nasa.gov/4720) | [Usage](https://science.nasa.gov/moon/)
