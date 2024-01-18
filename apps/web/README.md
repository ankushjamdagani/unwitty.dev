# Unwitty Dev webapp

## Checklist for 1.0.alpha release

- Icons black and white
- Improve micro-interactions
- Page transitions for projects and words
- Responsive design
- Smooth animations
- Validate content

## Checklist for 1.0.beta release

- 1 project
- 2 blogs
- Offline support with caching, etc
- Accessibility
- Lighthouse 100
- Feeback changes
- Logging, Monitoring and Tracking

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

## FAQs in Code Structure

- Components
  - Use named exports - now, it can't be used with any other names
  - Make folder for components - all helpers etc remains in scope
  - For better cmd+p - use index.ts only for exporting
  - Use \_ for private non-route folders
-

## Todos

- Error logging
- User monitoring
- Internationalisation [Template](https://github.com/vercel/next.js/tree/canary/examples/app-dir-i18n-routing)
- Accessibility
