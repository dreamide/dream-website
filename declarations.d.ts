declare module "*.css";

declare module "virtual:shiso-config" {
  const config: import("./node_modules/@umami/shiso/src/lib/types").ResolvedShisoConfig;
  export default config;
}
declare module "virtual:shiso-docs-config" {
  const config: import("./node_modules/@umami/shiso/src/lib/types").DocsConfig;
  export default config;
}
declare module "virtual:dream-doc-metadata" {
  const metadata: Record<
    string,
    Omit<
      import("./node_modules/@umami/shiso/src/lib/types").DocModule,
      "default"
    >
  >;
  export default metadata;
}
