import HomePageContent from "../../src/components/home/HomePage";
import Studio from "../../src/components/home/Studio";
import { DreamTheme } from "../../src/components/home/theme";
import { useTranslation } from "../../src/i18n/context";

export const frontmatter = {
  title: "Dream — the IDE for AI coding",
  description:
    "Dream is an open-source desktop IDE for working with multiple AI coding agents.",
  search: false,
};

export default function HomePage() {
  const { locale } = useTranslation();
  if (locale === "en") return <Studio />;

  return (
    <DreamTheme>
      <HomePageContent />
    </DreamTheme>
  );
}
