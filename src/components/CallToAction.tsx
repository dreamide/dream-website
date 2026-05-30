import DownloadButton from "@/components/DownloadButton";

export default function CallToAction() {
  return (
    <div className="flex flex-col items-center text-center rounded-lg p-6 sm:p-12 lg:p-16 gap-8 sm:gap-16">
      <h2 className="text-[clamp(2.5rem,8vw,4rem)] font-bold">
        Dream your dream.
      </h2>
      <div className="flex justify-center gap-3">
        <DownloadButton />
      </div>
    </div>
  );
}
