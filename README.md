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

## Release documentation and screenshots (v0.31.0)

The docs cover the published changes through v0.31.0, checked against the `v0.31.0` app source
and release notes:
[v0.29.0](https://github.com/dreamide/dream/releases/tag/v0.29.0),
[v0.30.0](https://github.com/dreamide/dream/releases/tag/v0.30.0), and
[v0.31.0](https://github.com/dreamide/dream/releases/tag/v0.31.0). Earlier releases
(v0.26.0–v0.28.0) were documented in the previous pass. Feature instructions target the
`v0.31.0` tag, not unreleased work on `main`.

| Release | Documented in |
| --- | --- |
| Message queue, Stop and Pause | Working with chats (Queue messages), Troubleshooting |
| Delegated tasks | Agent permissions (Delegated tasks) |
| Fetch, Pull, Open repository, Push changes preview, ahead/behind counts | Git workflows |
| Word wrap toggle, automatic Git and Files refresh, commit message label | Git workflows, Files, Reviewing pull requests |
| Settings → Connections, routes, HTTPS pairing, Open folder dialog | Remote hosts, Open your first project, Projects and workspace, Settings reference |
| Remote access, Tailscale, Cloudflare Tunnel, pairing, paired devices | Remote access (new page) |
| `dream-host` service and remote/pairing commands | Host service (new page) |
| Remove-host confirmation, terminals stopped on removal, service-restored terminals | Remote hosts, Terminals |

The new pages live in the **Remote work** navigation group with Remote hosts. New and changed
strings were drafted for all ten locales and still need native-speaker review. New bold control
labels were added to `src/i18n/app-terms/` from the app's own `v0.31.0` locale files.

### Screenshots still needed

No screenshots were captured for this pass. Until these exist, the affected sections are text
only; do not add image references before the files exist. Capture from a v0.31.0 build.

| Status | Image | What it should show | Use in |
| --- | --- | --- | --- |
| New | Queue panel | The Queue above the message box with one queued and one Failed item (Retry/Remove), plus Pause queue | Working with chats |
| New | Push changes dialog | Branch, Destination, ahead/behind counts, and the commit list | Git workflows |
| New | Remote access settings | Settings → Connections with Remote access Ready and a paired device listed | Remote access |
| New | Set up remote access dialog | Reach this computer through with Tailscale and Cloudflare Tunnel, and Advanced | Remote access |
| New | Pair a device dialog | QR code, Copy link, pairing code, and the Access selector | Remote access |
| New | Open folder dialog | Open on host selector, Folder path with suggestions, Browse… | Open your first project, Remote hosts |
| New | Host routes dialog | A host with an SSH and an HTTPS route, Active route, and Move up/down | Remote hosts |
| Optional | Phone layout | Dream on a phone in the compact layout | Remote access |
| Replace | `docs/ssh-hosts-panel.png` | Settings → Connections → Remote hosts with Add host and status badges (the old crop shows the removed SSH hosts section and is no longer referenced) | Remote hosts |
| Refresh | `docs/changes-panel.png` | The commit box with the Commit message label and file count | Git workflows |
| Refresh | `docs/git-actions-menu.png` | Push and Pull with ahead/behind counts and the highlighted Git actions button | Git workflows |

The Push changes preview is a dialog again in v0.30.0 and later; capture it as a dialog. The old
Commit/Push dialog frames from earlier releases remain unused.

For screenshot updates, update the English MDX frames, alt text, and dimensions; add translations
and regenerate locales. Update `scripts/crop-docs-images.ps1` with the new originals and
coordinates, then regenerate and inspect the crops.
