import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { collectToc } from "../node_modules/@umami/shiso/src/lib/remark-toc.ts";

// Metadata stays synchronous for navigation and SEO; page bodies load separately.
export async function docMetadata(root) {
  const require = createRequire(
    import.meta.resolve("@umami/shiso/package.json"),
  );
  const module = (name) => import(pathToFileURL(require.resolve(name)));
  const { unified } = await module("unified");
  const { default: remarkParse } = await module("remark-parse");
  const { default: remarkMdx } = await module("remark-mdx");
  const { default: remarkFrontmatter } = await module("remark-frontmatter");
  const { default: remarkGfm } = await module("remark-gfm");
  const { parse: yaml } = await module("yaml");
  const parser = unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(remarkFrontmatter)
    .use(remarkGfm);
  const id = "virtual:dream-doc-metadata";
  const resolvedId = `\0${id}`;
  const docsRoot = path.join(root, "content/docs");
  const isDoc = (file) => {
    const relative = path.relative(docsRoot, file);
    return (
      relative !== ".." &&
      !relative.startsWith(`..${path.sep}`) &&
      !path.isAbsolute(relative) &&
      /\.mdx?$/.test(file)
    );
  };
  const invalidate = (server) => {
    const cached = server.moduleGraph.getModuleById(resolvedId);
    if (cached) server.moduleGraph.invalidateModule(cached);
    server.ws.send({ type: "full-reload" });
  };
  return {
    name: "dream-doc-metadata",
    resolveId(request) {
      if (request === id) return resolvedId;
    },
    load(request) {
      if (request !== resolvedId) return;
      const data = {};
      for (const file of fs.readdirSync(docsRoot, { recursive: true })) {
        if (!/\.mdx?$/.test(file)) continue;
        const absolute = path.join(docsRoot, file);
        this.addWatchFile(absolute);
        const tree = parser.parse(fs.readFileSync(absolute, "utf8"));
        const frontmatter = tree.children.find((node) => node.type === "yaml");
        data[`/content/docs/${file.replaceAll("\\", "/")}`] = {
          frontmatter: frontmatter ? yaml(frontmatter.value) : {},
          toc: collectToc(tree),
        };
      }
      return `export default ${JSON.stringify(data)};`;
    },
    handleHotUpdate({ file, server }) {
      if (isDoc(file)) invalidate(server);
    },
    configureServer(server) {
      const refresh = (file) => {
        if (isDoc(file)) invalidate(server);
      };
      server.watcher.on("add", refresh).on("unlink", refresh);
      server.httpServer?.once("close", () => {
        server.watcher.off("add", refresh).off("unlink", refresh);
      });
    },
  };
}
