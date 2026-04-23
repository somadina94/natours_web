import { DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

export function PriceTag({
  amount,
  discount,
  suffix = "per person",
  className,
}: {
  amount: number;
  discount?: number;
  suffix?: string;
  className?: string;
}) {
  const hasDiscount =
    typeof discount === "number" &&
    discount > 0 &&
    discount < amount;
  return (
    <p className={cn("flex flex-wrap items-baseline gap-2", className)}>
      <DollarSign className="size-4 text-primary" aria-hidden />
      {hasDiscount ? (
        <>
          <span className="text-xl font-semibold tabular-nums text-muted-foreground line-through">
            {amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </span>
          <span className="text-2xl font-semibold tabular-nums text-foreground">
            {discount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </span>
        </>
      ) : (
        <span className="text-2xl font-semibold tabular-nums text-foreground">
          {amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </span>
      )}
      <span className="text-sm text-muted-foreground">{suffix}</span>
    </p>
  );
}
