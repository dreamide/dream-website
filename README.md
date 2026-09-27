# Dream website

The Dream product site and documentation, built with
[@umami/shiso](https://shiso.umami.is).

## Project structure

- `content/pages/home.tsx` — standalone marketing home page at `/`
- `content/pages/download.tsx` — standalone download page at `/download`
- `content/docs/` — product documentation under `/docs`
- `docs.json` — Shiso navigation, branding, and site configuration
- `src/components/` — React components used by the standalone pages
- `public/` — screenshots, artwork, icons, and static hosting configuration
- `functions/` — Cloudflare Pages Function for the first-party analytics script

## Development

Install dependencies and start Shiso:

```sh
pnpm install
pnpm dev
```

The local URL is printed in the terminal.

## Validation

Check the Shiso configuration and create the production site:

```sh
pnpm check
pnpm typecheck
pnpm build
```

The static output is written to `dist/client`.

## Writing documentation

Add Markdown or MDX files to `content/docs`, then register them in the
`navigation` section of `docs.json`. Add non-documentation routes to `pages`
and place their MDX files in `content/pages`.

Use screenshots from `public/images` inside a `<Frame caption="...">` with
descriptive image alt text and explicit dimensions. Focused documentation crops
live in `public/images/docs`; regenerate them from the originals on Windows with:

```powershell
./scripts/crop-docs-images.ps1
```

Crop coordinates are recorded in that script so screenshots can be refreshed
without guessing which part of the interface each example shows.
