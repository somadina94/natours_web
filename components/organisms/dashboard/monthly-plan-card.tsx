"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CalendarRange, RefreshCw } from "lucide-react";
import { getMonthlyPlan } from "@/lib/api/tours";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function MonthlyPlanCard() {
  const [year, setYear] = useState(new Date().getFullYear());
  const { data, isPending, isError, refetch, isFetching } = useQuery({
    queryKey: ["monthly-plan", year],
    queryFn: () => getMonthlyPlan(year),
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Card className="border-border/70">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CalendarRange className="size-5 text-primary" aria-hidden />
              Monthly tour plan
            </CardTitle>
            <CardDescription>
              Starts aggregated from tour schedules for the selected year (guide / ops view).
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-2 rounded-full"
              onClick={() => setYear((y) => y - 1)}
            >
              {year - 1}
            </Button>
            <span className="min-w-[4rem] text-center text-sm font-semibold tabular-nums">
              {year}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => setYear((y) => y + 1)}
            >
              {year + 1}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="rounded-full"
              aria-label="Refresh plan"
              onClick={() => void refetch()}
            >
              <RefreshCw className={isFetching ? "size-4 animate-spin" : "size-4"} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isPending ? (
            <Skeleton className="h-40 w-full rounded-xl" />
          ) : isError ? (
            <p className="text-sm text-destructive">Could not load the monthly plan.</p>
          ) : !data?.length ? (
            <p className="text-sm text-muted-foreground">No departures found for this year.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead className="text-right">Departures</TableHead>
                  <TableHead>Tours</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row) => (
                  <TableRow key={row.month}>
                    <TableCell className="font-medium">
                      {monthNames[(row.month ?? 1) - 1] ?? row.month}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {row.numTourStarts}
                    </TableCell>
                    <TableCell className="max-w-[280px] truncate text-muted-foreground">
                      {row.tours?.join(" · ")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
