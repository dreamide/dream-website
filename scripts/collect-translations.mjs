import fs from "node:fs";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import ts from "typescript";
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
const parser = unified()
  .use(remarkParse)
  .use(remarkMdx)
  .use(remarkGfm)
  .use(remarkFrontmatter);

const strings = new Set();
const ui = new Set();
const normalize = (text) => text.replace(/\s+/g, " ").trim();
const add = (text, set = strings) => {
  const value = normalize(text);
  if (/[A-Za-z]/.test(value)) {
    strings.add(value);
    set.add(value);
  }
  return value;
};

const documents = {};
for (const file of fs
  .readdirSync("content/docs")
  .filter((file) => file.endsWith(".mdx"))) {
  const source = fs.readFileSync(`content/docs/${file}`, "utf8");
  const replacements = [];
  function visit(node, inBlockquote = false) {
    if (["paragraph", "heading", "tableCell"].includes(node.type)) {
      let start = node.position.start.offset;
      let end = node.position.end.offset;
      if (node.type === "heading")
        start += source.slice(start, end).match(/^#+\s+/)?.[0].length ?? 0;
      if (node.type === "tableCell") {
        if (!node.children?.length) return;
        start = node.children[0].position.start.offset;
        end = node.children.at(-1).position.end.offset;
      }
      const raw = source.slice(start, end);
      if (/[A-Za-z]/.test(raw))
        replacements.push({
          start,
          end,
          text: add(inBlockquote ? raw.replace(/\r?\n\s*> ?/g, "\n") : raw),
          prefix: raw.match(/^\s*/)[0],
          suffix: raw.match(/\s*$/)[0],
          kind: "markdown",
        });
      return;
    }
    if (node.type === "yaml") {
      for (const match of node.value.matchAll(
        /^(title|description): (.+)$/gm,
      )) {
        const start =
          node.position.start.offset +
          source.slice(node.position.start.offset).indexOf(match[0]);
        replacements.push({
          start,
          end: start + match[0].length,
          text: add(match[2]),
          kind: "yaml",
          key: match[1],
        });
      }
    }
    if (node.attributes)
      for (const attr of node.attributes) {
        if (
          ["title", "caption", "alt"].includes(attr.name) &&
          typeof attr.value === "string"
        ) {
          replacements.push({
            start: attr.position.start.offset,
            end: attr.position.end.offset,
            text: add(attr.value),
            kind: "attribute",
            key: attr.name,
          });
        }
      }
    for (const child of node.children ?? [])
      visit(child, inBlockquote || node.type === "blockquote");
  }
  visit(parser.parse(source));
  documents[file] = { source, replacements };
}

for (const file of [
  "src/components/home/HomePage.tsx",
  "src/components/home/shots.ts",
  "src/components/DownloadButton.tsx",
  "content/pages/home.tsx",
  "content/pages/download.tsx",
  "content/pages/hello.tsx",
]) {
  const ast = ts.createSourceFile(
    file,
    fs.readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  function visit(node) {
    if (
      ts.isPropertyAssignment(node) &&
      ["title", "label", "body", "alt", "description"].includes(
        node.name.getText(ast),
      ) &&
      ts.isStringLiteral(node.initializer)
    )
      add(node.initializer.text, ui);
    if (
      ts.isCallExpression(node) &&
      node.expression.getText(ast) === "t" &&
      ts.isStringLiteral(node.arguments[0])
    )
      add(node.arguments[0].text, ui);
    ts.forEachChild(node, visit);
  }
  visit(ast);
}
for (const value of Object.values(shisoLabels)) add(value, ui);
for (const value of [
  "Powered by",
  "Language",
  "Documentation",
  "Download",
  "Search documentation...",
  "Dream on GitHub",
  "Dream on Discord",
  "Dream on X",
  "Close",
  "Copy code",
  "Zoom image",
  "Close image",
  "Loading page…",
  "Permalink to {heading}",
  "Search results",
])
  add(value, ui);
const config = JSON.parse(fs.readFileSync("docs.json", "utf8"));
const groups =
  config.navigation.groups ??
  config.navigation.languages.find((item) => item.language === "en").groups;
for (const group of groups) add(group.group);
for (const group of groups)
  for (const page of group.pages) if (typeof page !== "string") add(page.title);

fs.mkdirSync(".shiso/i18n", { recursive: true });
fs.writeFileSync(
  ".shiso/i18n/source.json",
  JSON.stringify(
    { documents, ui: [...ui], strings: [...strings], groups },
    null,
    2,
  ),
);
console.log(
  `Collected ${strings.size} translation units (${ui.size} interface strings), ${Object.keys(documents).length} docs.`,
);
