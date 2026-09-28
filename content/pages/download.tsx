import Block from "../../src/components/Block";
import DownloadButton from "../../src/components/DownloadButton";
import DownloadOptions from "../../src/components/DownloadOptions";
import { useTranslation } from "../../src/i18n/context";

export const frontmatter = {
  title: "Download Dream",
  description: "Download Dream for macOS, Windows, and Linux.",
  search: false,
};

export default function DownloadPage() {
  const { t } = useTranslation();
  return (
    <div className="download-page flex flex-col py-12">
      <Block title={t("Download Dream")} className="mb-12">
        {t("Available for macOS, Windows, and Linux.")}
      </Block>
      <div className="mb-24 flex items-center justify-center">
        <DownloadButton eventName="recommended-download" />
      </div>
      <DownloadOptions />
    </div>
  );
}
