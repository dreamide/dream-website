export default function Provider({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-4 border border-muted/20 rounded-lg p-8 sm:p-12 lg:p-16 my-4 sm:my-16 bg-background/95 w-full max-w-[220px] sm:w-[220px]">
      {icon}
      <span className="text-sm text-muted">{label}</span>
    </div>
  );
}
