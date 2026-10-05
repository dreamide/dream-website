import { defineConfig } from "@umami/shiso/config";
import translations from "./src/i18n/shiso-translations.json";

export default defineConfig({
  siteUrl: "https://dreamide.co",
  translations,
});
