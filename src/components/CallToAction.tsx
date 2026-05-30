import DownloadButton from "@/components/DownloadButton";

export default function CallToAction() {
  return (
    <div className="flex flex-col items-center text-center rounded-lg p-16 gap-16">
      <h2 className="text-[4rem] font-bold">Dream your dream.</h2>
      <div className="flex justify-center gap-3">
        <DownloadButton />
      </div>
    </div>
  );
}
