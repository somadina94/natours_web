export type AuthRole = "user" | "guide" | "lead-guide" | "admin";

export function isAuthRole(v: string | undefined): v is AuthRole {
  return (
    v === "user" ||
    v === "guide" ||
    v === "lead-guide" ||
    v === "admin"
  );
}

export function dashboardPathForRole(role: string | undefined): string {
  if (role === "admin") return "/dashboard/admin";
  if (role === "lead-guide") return "/dashboard/lead-guide";
  if (role === "guide") return "/dashboard/guide";
  return "/dashboard/user";
}
