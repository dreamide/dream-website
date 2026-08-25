export default function Screenshot() {
  return (
    <div
      className="dream-media-frame flex items-center rounded-lg p-4 sm:p-8 lg:p-16"
      style={{ background: "url(/bg-07.jpg) center/cover no-repeat" }}
    >
      <img
        className="w-full h-auto rounded-lg"
        src="/screen.png"
        alt="Dream IDE screenshot"
      />
    </div>
  );
}
