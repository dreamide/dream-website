import CallToAction from "../../src/components/CallToAction";
import Hero from "../../src/components/Hero";
import Showcase from "../../src/components/showcase/Showcase";

export const frontmatter = {
  title: "Dream — the IDE for AI coding",
  description:
    "Dream is an open-source desktop IDE for working with multiple AI coding agents.",
  search: false,
};

export default function PreviewPage() {
  return (
    <div className="landing-page flex flex-col">
      <Hero screenshot={false} />
      <Showcase />
      <div className="py-24 sm:py-40">
        <CallToAction />
      </div>
    </div>
  );
}
