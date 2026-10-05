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

## Languages

The site uses the app's locale codes and names: `en`, `es`, `fr`, `de`, `pt`,
`it`, `ja`, `ko`, `vi`, `zh-Hans`, and `zh-Hant`. English keeps `/`, `/download`,
and `/docs`. Other languages use paths such as `/es`, `/es/download`, and
`/docs/es/installation`. Shiso's native selector switches between corresponding
standalone pages and opens the selected language's introduction in the docs.
Language comes from `navigation.languages` and `pages[].language` in `docs.json`.

- English documentation in `content/docs/*.mdx` is the source.
- `src/i18n/catalogs/` contains the documentation translation drafts.
- `src/i18n/reviewed/` contains reviewed website copy, documentation titles,
  corrections, and matching terms from the app. These override the drafts.
- `src/i18n/app-terms/` records the app's translated control labels. The
  generator uses these for bold control names and menu paths in the docs.
- `src/i18n/messages.json`, `shiso-translations.json`, localized MDX, localized
  page wrappers, and language navigation are generated. Edit the catalogs and
  reviewed overrides, then run `pnpm locales` to regenerate them.

The generator preserves MDX structure, screenshots, code, and external links,
and remaps internal links and section anchors to the translated page. It fails
on missing translations. After changing English copy, add the corresponding
translations before regenerating. Run `pnpm check`, `pnpm typecheck`, and
`pnpm build` afterward.

Documentation drafts were generated locally with
[Qwen3-4B-Instruct-2507](https://huggingface.co/Qwen/Qwen3-4B-Instruct-2507).
The Traditional Chinese draft uses OpenCC's Taiwan phrase conversion of the
Simplified Chinese draft, with the app's own Traditional Chinese control labels.
They should receive native-speaker editorial review, particularly technical
terminology. The optional `scripts/translate-docs.py` can fill missing drafts
after `node scripts/collect-translations.mjs`; it requires Python, PyTorch with
CUDA, Transformers, Accelerate, and bitsandbytes. Normal builds use the checked-in
translations and require neither Python nor a translation service.

The site uses Shiso's public runtime and default build configuration, including
its layout, language selector, search, metadata, and documentation components.
Shiso supplies UI translations for English, Spanish, French, German, Japanese,
and both Chinese scripts. The generated `shiso-translations.json` supplies the
existing Portuguese, Italian, Korean, and Vietnamese labels through the public
`translations` option in `shiso.config.ts`. Dream's home and download page copy
uses a locale provider inside each generated standalone page; it does not
replace Shiso's layout or translation system.

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
