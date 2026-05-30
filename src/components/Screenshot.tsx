export default function Screenshot() {
  return (
    <div
      className="flex items-center rounded-lg p-16"
      style={{ background: "url(/bg-07.jpg) center/cover no-repeat" }}
    >
      <img
        className="w-full h-auto rounded-lg"
        src="/screen.jpg"
        alt="Dream IDE screenshot"
      />
    </div>
  );
}
