import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({
  value,
  count,
  className,
}: {
  value: number;
  count?: number;
  className?: string;
}) {
  const label =
    count != null
      ? `Rated ${value.toFixed(1)} out of 5 from ${count} reviews`
      : `Rated ${value.toFixed(1)} out of 5`;
  return (
    <div
      className={cn("flex items-center gap-2 text-sm", className)}
      role="img"
      aria-label={label}
    >
      <Star className="size-4 fill-primary text-primary" aria-hidden />
      <span className="font-medium tabular-nums">{value.toFixed(1)}</span>
      {count != null ? (
        <span className="text-muted-foreground">({count} reviews)</span>
      ) : null}
    </div>
  );
}
