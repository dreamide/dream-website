export default function Provider({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-4 border border-muted/20 rounded-lg p-16 my-16 bg-background/95 w-[220px]">
      {icon}
      <span className="text-sm text-muted">{label}</span>
    </div>
  );
}
