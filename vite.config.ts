import path from "node:path";
import { fileURLToPath } from "node:url";
import { type ConfigEnv, defineConfig, type UserConfig } from "vite";
// Use Shiso's shipped source so project-owned layout and locale adapters work
// identically in the browser and during static rendering. Keep Shiso pinned.
import shisoConfig from "./node_modules/@umami/shiso/vite.config.ts";
import { docMetadata } from "./scripts/doc-metadata.mjs";

const root = fileURLToPath(new URL(".", import.meta.url));
const shiso = path.join(root, "node_modules/@umami/shiso");
export default defineConfig(async (env: ConfigEnv) => {
  const base = await (shisoConfig as (env: ConfigEnv) => Promise<UserConfig>)(
    env,
  );
  return {
    ...base,
    optimizeDeps: {
      ...base.optimizeDeps,
      // The source runtime is excluded from prebundling, but its nested
      // CommonJS hooks still need conversion before the browser imports them.
      include: [
        ...(base.optimizeDeps?.include ?? []),
        "@umami/shiso > @base-ui/react > use-sync-external-store/shim",
        "@umami/shiso > @base-ui/react > use-sync-external-store/shim/with-selector",
      ],
    },
    plugins: [
      ...(base.plugins ?? []),
      await docMetadata(root),
      {
        name: "dream-content-loader",
        resolveId(id, _importer, options) {
          if (id === "virtual:dream-content") {
            // Select per request, since a dev server renders both environments.
            return options.ssr
              ? path.join(shiso, "src/lib/content.ts")
              : path.join(root, "src/site/content.tsx");
          }
        },
      },
    ],
    resolve: {
      ...base.resolve,
      dedupe: [
        ...(base.resolve?.dedupe ?? []),
        "react-router",
        "@mdx-js/react",
      ],
      alias: [
        { find: "@/lib/content", replacement: "virtual:dream-content" },
        {
          find: "@umami/shiso/client",
          replacement: path.join(shiso, "src/entry-client.tsx"),
        },
        {
          find: "@umami/shiso/components",
          replacement: path.join(shiso, "src/components/docs/index.ts"),
        },
        {
          find: /^.*[/\\]@umami[/\\]shiso[/\\]dist[/\\]entry-server\.js$/,
          replacement: path.join(shiso, "src/entry-server.tsx"),
        },
        { find: "@/App", replacement: path.join(root, "src/site/App.tsx") },
        {
          find: "@/components/LanguageSwitcher",
          replacement: path.join(root, "src/i18n/LanguageSwitcher.tsx"),
        },
        {
          find: "@/components/Footer",
          replacement: path.join(root, "src/site/components/Footer.tsx"),
        },
        {
          find: "@/components/CodeBlock",
          replacement: path.join(root, "src/site/components/CodeBlock.tsx"),
        },
        {
          find: "@/components/ui/dialog",
          replacement: path.join(root, "src/site/dialog.tsx"),
        },
        {
          find: "@/components/ui/command",
          replacement: path.join(root, "src/site/command.tsx"),
        },
        {
          find: "@/components/ui/sheet",
          replacement: path.join(root, "src/site/sheet.tsx"),
        },
        {
          find: "@/lib/site-config",
          replacement: path.join(root, "src/site/site-config.ts"),
        },
        {
          find: "@/lib/head",
          replacement: path.join(root, "src/site/head.ts"),
        },
        ...((base.resolve?.alias ?? []) as {
          find: string;
          replacement: string;
        }[]),
        { find: "@", replacement: path.join(shiso, "src") },
      ],
    },
  };
});
