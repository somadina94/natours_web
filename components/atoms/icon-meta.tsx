import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function IconMeta({
  icon: Icon,
  children,
  className,
}: {
  icon: LucideIcon;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-sm text-muted-foreground",
        className,
      )}
    >
      <Icon className="size-4 shrink-0 text-primary" aria-hidden />
      <span>{children}</span>
    </div>
  );
}
