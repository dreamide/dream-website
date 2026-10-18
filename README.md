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

## Release documentation and screenshots (v0.28.0)

The docs cover the published changes from v0.26.0 through v0.28.0, checked against
the `v0.28.0` app source and release notes:
[v0.26.0](https://github.com/dreamide/dream/releases/tag/v0.26.0),
[v0.27.0](https://github.com/dreamide/dream/releases/tag/v0.27.0), and
[v0.28.0](https://github.com/dreamide/dream/releases/tag/v0.28.0).
The feature instructions target that tag. Some supplied screenshots show a newer
development build, including Fetch/Pull/Open repository in the footer and the
word-wrap button; these additional controls are not described as v0.28.0 features.

The supplied PNGs are cropped to the relevant panel, menu, or dialog using
`scripts/crop-docs-images.ps1`. Docs use the crops in `public/images/docs` with
explicit dimensions and translated alt text. The workspace overview keeps the
full window to show the overall layout. One English capture serves all locales.
All required release screenshots are now included.

| Status | Image | What it shows | Used in |
| --- | --- | --- | --- |
| Added | `screen-changes-commit.png` | Git tabs, commit composer and controls, and an expanded diff | Git workflows |
| Added | `screen-git-actions.png` | Git actions menu above the branch footer | Git workflows |
| Added | `screen-git-history.png` | Search commits, colored graph lanes, merges, and branch labels | Git workflows |
| Updated | `screen-create-pr.png` | PR title, description, next-step choices, and Draft off | Git workflows |
| Added | `screen-pr-summary.png` | Open PR, description, running/passed checks with links, and Merge | Reviewing pull requests |
| Added | `screen-pr-code.png` | Changed-file list, line counts, and added/removed badges | Reviewing pull requests |
| Added | `screen-files-search.png` | Filename/path filtering by .ts and http.ts open in the editor | Files |
| Added | `screen-file-find.png` | Search and replace within messages.ts, with the query add and highlighted matches | Files |
| Added | `screen-find-in-files.png` | Project-wide search for function, results grouped by file, a truncation notice, and a selected match open in errors.ts | Files |
| Added | `screen-chat-search.png` | Matching message text highlighted in results from multiple projects | Working with chats |
| Added | `screen-keyboard-shortcuts.png` | Keyboard shortcuts settings and default bindings | Settings reference |
| Added | `screen-settings-notifications.png` | Desktop notifications and Notification sound enabled under Chat messages | Settings reference |
| Added | `screen-worktree-git-actions.png` | Worktree menu with Publish branch, Create pull request, Merge into dev, and Remove worktree | Git worktrees |
| Added | `screen-worktree-merge.png` | Merge into dev review with the base branch, commits, changed file, and clean main checkout | Git worktrees |
| Added | `screen-worktree-merge-success.png` | Successful merge into dev with Keep worktree / Remove worktree and branch | Git worktrees |
| Added | `screen-main.png` | Main window with the current toolbars and branch footer | Workspace |

All filenames in the table are originals under `public/images`. The Changes,
Pull request, Files, and Create PR crops have been refreshed from these originals.
The obsolete Commit/Push dialog frames remain removed; their files are retained
but are not referenced by the docs. Do not recapture them as dialogs.

Optional follow-ups: a failed PR check count, a customized keyboard shortcut or
conflict, an SSH/archived chat search result, and the worktree removal dialog with
its discard option. The supplied images already illustrate the core workflows.

If refreshing full-window overview images too, prioritize
`public/images/screen-multiple-chats.png`, which appears in the introduction and
multi-chat guide: show the current right toolbar and Git footer. Existing focused
SSH, provider, prompt, skills, MCP, browser, and terminal crops do not need new
images solely for these release features.

For future screenshot updates, update the English MDX frames, alt text, and
dimensions; add translations and regenerate locales. Do not add image references
before the corresponding files exist. Update `scripts/crop-docs-images.ps1` with
the new originals and coordinates, then regenerate and inspect the crops.
