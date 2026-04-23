"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  type AuthRole,
  dashboardPathForRole,
  isAuthRole,
} from "@/types/auth";
import { useAppSelector } from "@/store/hooks";

export function RoleGate({
  allow,
  children,
}: {
  allow: readonly AuthRole[];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useAppSelector((s) => s.auth.user);
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("natours_token")
      : null;

  const role: AuthRole =
    user?.role && isAuthRole(String(user.role))
      ? (user.role as AuthRole)
      : "user";

  useEffect(() => {
    if (!token || !user) return;
    if (!allow.includes(role)) {
      router.replace(dashboardPathForRole(role));
    }
  }, [allow, role, router, token, user]);

  if (!token) return null;

  if (!user) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="size-8 animate-spin text-primary" aria-hidden />
        <p className="text-sm">Loading your profile…</p>
      </div>
    );
  }

  if (!allow.includes(role)) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="size-8 animate-spin text-primary" aria-hidden />
        <p className="text-sm">Opening the right workspace…</p>
      </div>
    );
  }

  return <>{children}</>;
}
