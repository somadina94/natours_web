"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { cn } from "@/lib/utils";

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode;
    color?: string;
  }
>;

const ChartContext = React.createContext<{ config: ChartConfig } | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }
  return context;
}

export function ChartContainer({
  id,
  className,
  config,
  children,
}: React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"];
}) {
  const chartId = React.useId();
  const resolvedId = `chart-${id || chartId}`;
  const hostRef = React.useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const el = hostRef.current;
    if (!el) return;

    const updateReady = (w: number, h: number) => {
      setReady(w > 0 && h > 0);
    };

    updateReady(el.clientWidth, el.clientHeight);
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      updateReady(entry.contentRect.width, entry.contentRect.height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        ref={hostRef}
        data-slot="chart"
        data-chart={resolvedId}
        className={cn(
          "flex w-full min-w-0 min-h-[160px] justify-center overflow-hidden text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line]:stroke-border/60 [&_.recharts-tooltip-cursor]:stroke-border [&_.recharts-reference-line_line]:stroke-border [&_.recharts-layer]:outline-none",
          className,
        )}
      >
        <style
          dangerouslySetInnerHTML={{
            __html: Object.entries(config)
              .map(([key, item]) => {
                const color = item.color;
                if (!color) return "";
                return `[data-chart="${resolvedId}"] { --color-${key}: ${color}; }`;
              })
              .join("\n"),
          }}
        />
        {ready ? (
          <RechartsPrimitive.ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={160}>
            {children}
          </RechartsPrimitive.ResponsiveContainer>
        ) : (
          <div className="h-full w-full" aria-hidden />
        )}
      </div>
    </ChartContext.Provider>
  );
}

export const ChartTooltip = RechartsPrimitive.Tooltip;

type ChartTooltipPayloadItem = {
  dataKey?: string | number;
  name?: string;
  value?: string | number;
  color?: string;
  payload?: { fill?: string };
};

export function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
}: {
  active?: boolean;
  payload?: ChartTooltipPayloadItem[];
  className?: string;
  indicator?: "dot" | "line";
}) {
  const { config } = useChart();

  if (!active || !payload?.length) return null;

  return (
    <div
      className={cn(
        "grid min-w-[8rem] items-start gap-1.5 rounded-lg border bg-background px-2.5 py-1.5 text-xs shadow-xl",
        className,
      )}
    >
      {payload.map((item) => {
        const key = String(item.dataKey ?? item.name ?? "");
        const cfg = config[key];
        const value = typeof item.value === "number" ? item.value.toLocaleString() : item.value;
        return (
          <div key={key} className="flex items-center gap-2">
            <span
              className={cn(
                "shrink-0 rounded-[2px] bg-[--color-bg] [--color-bg:var(--color-border)]",
                indicator === "dot" ? "size-2" : "h-0.5 w-3",
              )}
              style={
                {
                  "--color-bg": item.color || item.payload?.fill || "var(--color-border)",
                } as React.CSSProperties
              }
            />
            <span className="text-muted-foreground">{cfg?.label ?? item.name}</span>
            <span className="ml-auto font-mono font-medium tabular-nums">{value}</span>
          </div>
        );
      })}
    </div>
  );
}
