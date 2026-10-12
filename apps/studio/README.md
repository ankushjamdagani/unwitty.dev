# @app/studio

The unwitty.dev home: products, their build logs, GitHub activity and the about section. Plan: `docs/studio-revamp-plan.md`.

```bash
pnpm --filter @app/studio dev     # http://localhost:3100
pnpm --filter @app/studio test
```

## Content

All content is config in `src/config/`:

- `products.ts` — one entry per product (newest first). Build log = the repo's `CHANGELOG.md`; activity = the repo's commits.
- `companies.ts` — roles for the about section.
- `profile.ts` — headline, about text, email, résumé link.

## Environment

See `.env.example`.

- `GITHUB_TOKEN` — fine-grained, Contents: read-only on the product repos. Optional for public repos.
- `PRODUCT_URL_<SLUG>` — deployment that serves `unwitty.dev/<slug>/*`. The product must be built with `basePath: "/<slug>"` (Canvas One: `NEXT_PUBLIC_CANVAS_BASE_PATH=/canvas-one`).

## Deploying

`apps/studio/vercel.json` configures the build. Go live without downtime:

1. **New Vercel project** from this repo, Root Directory `apps/studio`. Add `GITHUB_TOKEN`.
2. Check the `*.vercel.app` preview.
3. **Canvas One**: new Vercel project from `ankushjamdagani/canvas-one`, Root Directory `apps/web`, env `NEXT_PUBLIC_CANVAS_BASE_PATH=/canvas-one` and `CANVAS_SITE_URL=https://unwitty.dev/canvas-one`. Set `PRODUCT_URL_CANVAS_ONE=<its .vercel.app URL>` on the studio project and redeploy.
4. Move the `unwitty.dev` domain from the old portfolio project to the studio project (Settings → Domains).

Until step 3, `/canvas-one` redirects to the GitHub repo. Old routes (`/work`, `/work/about`, `/life`, …) redirect into the home page.

## Adding a product

1. `git submodule add <repo> projects/<slug>`
2. Deploy it with `basePath` `/<slug>`.
3. Add an entry to `src/config/products.ts` and set `PRODUCT_URL_<SLUG>`.
