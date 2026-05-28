import { cn } from "@/lib/utils";

export default function Block({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4 py-8 w-auto mx-auto", className)}>
      <h2 className="text-3xl font-bold font-light">{title}</h2>
      <div className="text-md text-muted">{children}</div>
    </div>
  );
}
