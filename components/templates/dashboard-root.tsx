"use client";

import { Suspense } from "react";
import { RequireAuth } from "@/components/gates/require-auth";
import { DashboardShell } from "@/components/templates/dashboard-shell";
import { Skeleton } from "@/components/ui/skeleton";

function DashboardShellFallback() {
  return (
    <div className="flex min-h-[50vh] flex-col gap-4 p-6">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-64 w-full max-w-3xl rounded-xl" />
    </div>
  );
}

export function DashboardRoot({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <Suspense fallback={<DashboardShellFallback />}>
        <DashboardShell>{children}</DashboardShell>
      </Suspense>
    </RequireAuth>
  );
}
