"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { dashboardPathForRole, isAuthRole } from "@/types/auth";
import { useAppSelector } from "@/store/hooks";

const TOKEN_KEY = "natours_token";

export function DashboardRedirect() {
  const router = useRouter();
  const user = useAppSelector((s) => s.auth.user);

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
    if (!token) {
      router.replace("/login?next=/dashboard");
      return;
    }
    if (!user) return;
    const role = isAuthRole(String(user.role)) ? user.role : "user";
    router.replace(dashboardPathForRole(String(role)));
  }, [router, user]);

  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-muted-foreground">
      <Loader2 className="size-8 animate-spin text-primary" aria-hidden />
      <p className="text-sm">Taking you to the right workspace…</p>
    </div>
  );
}
