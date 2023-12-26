# Unwitty Dev webapp

## Tech specs

- Error logging
- User monitoring
- Internationalisation [Template](https://github.com/vercel/next.js/tree/canary/examples/app-dir-i18n-routing)
- Accessibility

## Getting Started

First, run the development server on [http://localhost:3000](http://localhost:3000):

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Directory Structure

- Components
  - Use named exports - now, it can't be used with any other names
  - Make folder for components - all helpers etc remains in scope
  - For better cmd+p - use index.ts only for exporting
  - Use \_ for private non-route folders
-
