import Block from "../../src/components/Block";
import DownloadButton from "../../src/components/DownloadButton";
import DownloadOptions from "../../src/components/DownloadOptions";

export const frontmatter = {
  title: "Download Dream",
  description: "Download Dream for macOS, Windows, and Linux.",
  search: false
};

export default function DownloadPage() {
  return (
    <div className="download-page flex flex-col py-12">
      <Block title="Download Dream" className="mb-12">
        Available for macOS, Windows, and Linux.
      </Block>
      <div className="mb-24 flex items-center justify-center">
        <DownloadButton eventName="Recommended download" />
      </div>
      <DownloadOptions />
    </div>
  );
}
