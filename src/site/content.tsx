import metadata from "virtual:dream-doc-metadata";
import { lazy } from "react";
import { LAST_MODIFIED } from "@/generated/last-modified";
import { CONTENT_DIR, PAGES_DIR } from "@/lib/paths";
import type { DocModule } from "@/lib/types";
import { useSectionScroll } from "./useSectionScroll";

const pages = import.meta.glob<DocModule>("/content/pages/**/*.{md,mdx,tsx}", {
  eager: true,
});
const docs = import.meta.glob<DocModule>("/content/docs/**/*.{md,mdx}");

export const docModules: Record<string, DocModule> = { ...pages };
for (const [file, load] of Object.entries(docs)) {
  const Page = lazy(async () => {
    const { default: Content } = await load();
    return {
      default: function LoadedDocument(
        props: Parameters<DocModule["default"]>[0],
      ) {
        useSectionScroll();
        return <Content {...props} />;
      },
    };
  });
  docModules[file] = {
    ...metadata[file],
    default: (props) => <Page {...props} />,
  };
}

export function resolveDocFile(fileSlug: string, contentDir = CONTENT_DIR) {
  return [
    `/${contentDir}/${fileSlug}.mdx`,
    `/${contentDir}/${fileSlug}.md`,
  ].find((file) => file in docModules);
}

export function resolvePageFile(fileSlug: string) {
  return ["tsx", "mdx", "md"]
    .map((extension) => `/${PAGES_DIR}/${fileSlug}.${extension}`)
    .find((file) => file in docModules);
}

export function getDocModule(filePath: string) {
  return docModules[filePath];
}

export function getLastModified(filePath: string) {
  return LAST_MODIFIED[filePath];
}
