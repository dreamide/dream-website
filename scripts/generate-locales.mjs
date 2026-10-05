import { execFileSync } from "node:child_process";
import fs from "node:fs";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import "./collect-translations.mjs";
import { shisoLabels } from "./shiso-labels.mjs";

const require = createRequire(import.meta.resolve("@umami/shiso/package.json"));
const { unified } = await import(pathToFileURL(require.resolve("unified")));
const { default: remarkParse } = await import(
  pathToFileURL(require.resolve("remark-parse"))
);
const { default: remarkMdx } = await import(
  pathToFileURL(require.resolve("remark-mdx"))
);
const { default: remarkGfm } = await import(
  pathToFileURL(require.resolve("remark-gfm"))
);
const { default: remarkFrontmatter } = await import(
  pathToFileURL(require.resolve("remark-frontmatter"))
);
const { default: GithubSlugger } = await import(
  pathToFileURL(require.resolve("github-slugger"))
);
const parser = unified()
  .use(remarkParse)
  .use(remarkMdx)
  .use(remarkGfm)
  .use(remarkFrontmatter);
const input = JSON.parse(fs.readFileSync(".shiso/i18n/source.json", "utf8"));
const locales = [
  "en",
  "es",
  "fr",
  "de",
  "pt",
  "it",
  "ja",
  "ko",
  "vi",
  "zh-Hans",
  "zh-Hant",
];
const config = JSON.parse(fs.readFileSync("docs.json", "utf8"));
const catalogs = { en: {} };

function alignControlLabels(source, translated, terms) {
  const originalLabels = [...source.matchAll(/\*\*([^*]+)\*\*/g)];
  const translatedLabels = [...translated.matchAll(/\*\*([^*]+)\*\*/g)];
  if (originalLabels.length !== translatedLabels.length) return translated;
  let index = 0;
  return translated.replace(/\*\*([^*]+)\*\*/g, (match) => {
    const label = originalLabels[index++][1];
    const parts = label.split(" → ");
    return parts.every((part) => terms[part])
      ? `**${parts.map((part) => terms[part]).join(" → ")}**`
      : match;
  });
}

for (const locale of locales.slice(1)) {
  const terms = JSON.parse(
    fs.readFileSync(`src/i18n/app-terms/${locale}.json`, "utf8"),
  );
  catalogs[locale] = {
    ...JSON.parse(fs.readFileSync(`src/i18n/catalogs/${locale}.json`, "utf8")),
    ...JSON.parse(fs.readFileSync(`src/i18n/reviewed/${locale}.json`, "utf8")),
  };
  for (const text of input.strings) {
    if (!catalogs[locale][text])
      throw new Error(`Missing ${locale} translation: ${text}`);
    catalogs[locale][text] = alignControlLabels(
      text,
      catalogs[locale][text],
      terms,
    );
    const protectedParts = (value) =>
      [...value.matchAll(/`[^`]+`|\]\(([^)]+)\)|\{[a-zA-Z][a-zA-Z0-9_]*\}/g)]
        .map((match) => match[1] ?? match[0])
        .sort();
    if (
      JSON.stringify(protectedParts(text)) !==
      JSON.stringify(protectedParts(catalogs[locale][text]))
    )
      throw new Error(
        `Changed code, placeholder, or link in ${locale}: ${text}`,
      );
  }
}
const t = (locale, text) => (locale === "en" ? text : catalogs[locale][text]);
const textEscape = (text) => text.replace(/([\\`*_[\]{}<>#|])/g, "\\$1");
const attrEscape = (text) =>
  text
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;");

function headings(source) {
  const slugger = new GithubSlugger();
  const list = [];
  function content(node) {
    return node.value ?? (node.children ?? []).map(content).join("");
  }
  function visit(node) {
    if (node.type === "heading") list.push(slugger.slug(content(node)));
    for (const child of node.children ?? []) visit(child);
  }
  visit(parser.parse(source));
  return list;
}

const documents = {};
const anchors = {};
for (const [file, { source, replacements }] of Object.entries(
  input.documents,
)) {
  const slug = file.replace(/\.mdx$/, "");
  documents[slug] = { en: source };
  anchors[slug] = { en: headings(source) };
  for (const locale of locales.slice(1)) {
    let translated = source;
    for (const item of [...replacements].sort((a, b) => b.start - a.start)) {
      const value = t(locale, item.text);
      const rendered =
        item.kind === "yaml"
          ? `${item.key}: ${JSON.stringify(value)}`
          : item.kind === "attribute"
            ? `${item.key}="${attrEscape(value)}"`
            : item.prefix +
              (item.kind === "markdown" ? value : textEscape(value)) +
              item.suffix;
      translated =
        translated.slice(0, item.start) + rendered + translated.slice(item.end);
    }
    documents[slug][locale] = translated;
    anchors[slug][locale] = headings(translated);
    if (anchors[slug][locale].length !== anchors[slug].en.length)
      throw new Error(`Heading mismatch: ${locale}/${slug}`);
  }
}

function localizeHref(href, locale) {
  const url = new URL(href, "https://dreamide.co");
  if (url.pathname === "/docs" || url.pathname.startsWith("/docs/")) {
    const slug = url.pathname.slice(6) || "index";
    const index = anchors[slug]?.en.indexOf(
      decodeURIComponent(url.hash.slice(1)),
    );
    const fragment =
      url.hash && index >= 0 ? `#${anchors[slug][locale][index]}` : url.hash;
    return `/docs/${locale}${slug === "index" ? "" : `/${slug}`}${url.search}${fragment}`;
  }
  return `/${locale}${url.pathname === "/" ? "" : url.pathname}${url.search}${url.hash}`;
}

for (const [slug, versions] of Object.entries(documents)) {
  for (const locale of locales.slice(1)) {
    // Rewrite only links, leaving shared images and external URLs untouched.
    const localized = versions[locale].replace(
      /(\]\(|href=")(\/(?:docs(?:[/#?][^\s)"<>]*)?|download|hello)?)(?=[)"])/g,
      (_, prefix, href) => prefix + localizeHref(href, locale),
    );
    const dir = `content/docs/${locale}`;
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(`${dir}/${slug}.mdx`, localized);
  }
}

config.navigation = {
  languages: locales.map((locale) => ({
    language: locale,
    ...(locale === "en" ? { default: true } : {}),
    groups: input.groups.map((group) => ({
      ...group,
      group: t(locale, group.group),
      pages: group.pages.map((page) => {
        if (locale === "en") return page;
        const slug = typeof page === "string" ? page : page.page;
        const title = input.documents[`${slug}.mdx`].replacements.find(
          (item) => item.kind === "yaml" && item.key === "title",
        ).text;
        return {
          ...(typeof page === "string" ? {} : page),
          page: `${locale}/${slug}`,
          title: t(locale, title),
        };
      }),
    })),
  })),
};

config.pages = config.pages
  .filter((page) => !locales.slice(1).includes(page.path.split("/")[1]))
  .map((page) => ({ ...page, language: "en" }));
for (const locale of locales.slice(1)) {
  for (const [page, url] of [
    ["home", ""],
    ["download", "/download"],
    ["hello", "/hello"],
  ]) {
    const title =
      page === "download" ? "Download Dream" : "Dream — the IDE for AI coding";
    const description =
      page === "download"
        ? "Download Dream for macOS, Windows, and Linux."
        : "Dream is an open-source desktop IDE for working with multiple AI coding agents.";
    fs.mkdirSync(`content/pages/${locale}`, { recursive: true });
    fs.writeFileSync(
      `content/pages/${locale}/${page}.tsx`,
      `// Generated by scripts/generate-locales.mjs.\nimport Page from "../${page}";\nimport { LocaleContext } from "../../../src/i18n/context";\nexport const frontmatter = ${JSON.stringify({ title: t(locale, title), description: t(locale, description), search: false }, null, 2)};\nexport default function LocalizedPage() {\n  return <LocaleContext.Provider value="${locale}"><Page /></LocaleContext.Provider>;\n}\n`,
    );
    config.pages.push({
      path: `/${locale}${url}`,
      page: `${locale}/${page}`,
      language: locale,
    });
  }
}

const ui = {};
for (const locale of locales) {
  ui[locale] = Object.fromEntries(input.ui.map((key) => [key, t(locale, key)]));
  ui[locale]["Search..."] = ui[locale]["Search documentation..."];
}
fs.writeFileSync("src/i18n/messages.json", `${JSON.stringify(ui, null, 2)}\n`);
// Other languages use Shiso's built-in dictionaries unchanged. This fills the
// gaps through its supported config API, without replacing runtime components.
const shisoTranslations = Object.fromEntries(
  ["pt", "it", "ko", "vi"].map((locale) => [
    locale,
    {
      ...Object.fromEntries(
        Object.entries(shisoLabels).map(([key, text]) => [
          key,
          t(locale, text),
        ]),
      ),
      viewNamedImage: `${t(locale, "Zoom image")}: {alt}`,
    },
  ]),
);
fs.writeFileSync(
  "src/i18n/shiso-translations.json",
  `${JSON.stringify(shisoTranslations, null, 2)}\n`,
);
fs.writeFileSync("docs.json", `${JSON.stringify(config, null, 2)}\n`);
execFileSync(
  process.execPath,
  [
    "node_modules/@biomejs/biome/bin/biome",
    "format",
    "--write",
    "docs.json",
    "src/i18n",
    ...locales.slice(1).map((locale) => `content/pages/${locale}`),
  ],
  { stdio: "inherit" },
);
console.log(
  `Generated ${locales.length} languages, ${Object.keys(documents).length * locales.length} docs, and ${config.pages.length} standalone routes.`,
);
