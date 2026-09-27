import HomePageContent from "../../src/components/home/HomePage";
import { DreamTheme } from "../../src/components/home/theme";

export const frontmatter = {
  title: "Dream — the IDE for AI coding",
  description:
    "Dream is an open-source desktop IDE for working with multiple AI coding agents.",
  search: false,
};

export default function HomePage() {
  return (
    <DreamTheme>
      <HomePageContent />
    </DreamTheme>
  );
}
