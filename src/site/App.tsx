import "@fontsource-variable/inter/index.css";
import "@fontsource-variable/jetbrains-mono";
import "@umami/shiso/styles.css";

import { MDXProvider } from "@mdx-js/react";
import { Suspense } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router";
import { CodeBlock } from "@/components/CodeBlock";
import * as docsComponents from "@/components/docs/index";
import { Layout } from "@/components/Layout";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LabelContext } from "@/lib/label-context";
import {
  siteModel as baseSite,
  docsHomeUrl,
  hasRootStandalonePage,
  standalonePages,
} from "@/lib/site-config";
import { DocPage } from "@/pages/DocPage";
import { StandalonePageView } from "@/pages/StandalonePage";
import { LocalizedLink } from "./components/LocalizedLink";
import { ZoomableImage } from "./components/ZoomableImage";

const {
  mermaidSource: _mermaidSource,
  usePanelContent: _usePanelContent,
  useSetPanelContent: _useSetPanelContent,
  ...mdxDocsComponents
} = docsComponents;

const mdxComponents = {
  ...mdxDocsComponents,
  ZoomableImage,
  a: LocalizedLink,
  img: ZoomableImage,
  pre: CodeBlock,
};

import { LocaleContext, translate } from "../i18n/context";
import { localeFromPath } from "../i18n/locales";
import { localizeSite } from "./localize";

export function App() {
  const { pathname } = useLocation();
  const locale = localeFromPath(pathname);
  const siteModel = localizeSite(baseSite, locale);
  return (
    <LocaleContext.Provider value={locale}>
      <LabelContext.Provider value={siteModel.labels}>
        <TooltipProvider>
          <MDXProvider components={mdxComponents}>
            <Layout site={siteModel}>
              <Suspense
                fallback={
                  <p role="status" className="py-12">
                    {translate(locale, "Loading page…")}
                  </p>
                }
              >
                <Routes>
                  {standalonePages.map((page) => (
                    <Route
                      key={page.path}
                      path={page.path}
                      element={
                        <StandalonePageView page={page} site={siteModel} />
                      }
                    />
                  ))}
                  {/* When the default scope's landing page is the root, or a
                standalone page owns "/", there is nothing to redirect. */}
                  {docsHomeUrl !== "/" && !hasRootStandalonePage ? (
                    <Route
                      path="/"
                      element={<Navigate to={docsHomeUrl} replace />}
                    />
                  ) : null}
                  <Route path="*" element={<DocPage site={siteModel} />} />
                </Routes>
              </Suspense>
            </Layout>
          </MDXProvider>
        </TooltipProvider>
      </LabelContext.Provider>
    </LocaleContext.Provider>
  );
}
