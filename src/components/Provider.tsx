export default function Provider({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 border border-muted/20 rounded-lg p-16 my-16">
      {icon}
      <span className="text-sm text-muted">{label}</span>
    </div>
  );
}
