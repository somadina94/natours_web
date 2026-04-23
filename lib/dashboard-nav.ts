import type { LucideIcon } from "lucide-react";
import { Compass, LayoutDashboard, Shield, Users } from "lucide-react";
import type { AuthRole } from "@/types/auth";

export type DashboardNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  roles: readonly AuthRole[];
};

export const dashboardNavItems: DashboardNavItem[] = [
  {
    href: "/dashboard/user",
    label: "Traveler",
    icon: Compass,
    roles: ["user"],
  },
  {
    href: "/dashboard/guide",
    label: "Guide",
    icon: Compass,
    roles: ["guide"],
  },
  {
    href: "/dashboard/lead-guide",
    label: "Lead guide",
    icon: Shield,
    roles: ["lead-guide"],
  },
  {
    href: "/dashboard/admin",
    label: "Administration",
    icon: Users,
    roles: ["admin"],
  },
];

export const dashboardSharedLinks: {
  href: string;
  label: string;
  icon: LucideIcon;
}[] = [
  { href: "/", label: "Marketing site", icon: LayoutDashboard },
  { href: "/tours", label: "Tour catalog", icon: Compass },
  {
    href: "/dashboard",
    label: "Workspace hub",
    icon: LayoutDashboard,
  },
];
