import type { LucideIcon } from "lucide-react";
import {
  CalendarRange,
  ClipboardList,
  Crown,
  KeyRound,
  LayoutDashboard,
  Map,
  MessageSquare,
  Pencil,
  PlusCircle,
  Star,
  TicketPlus,
  UserRound,
  Users,
} from "lucide-react";

export type DashboardViewDef = {
  id: string;
  label: string;
  icon: LucideIcon;
};

export const USER_DASHBOARD_VIEWS: DashboardViewDef[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "profile", label: "Profile", icon: UserRound },
  { id: "password", label: "Password", icon: KeyRound },
  { id: "write-review", label: "Write review", icon: Star },
  { id: "bookings", label: "My bookings", icon: ClipboardList },
  { id: "reviews", label: "My reviews", icon: MessageSquare },
];

export const GUIDE_DASHBOARD_VIEWS: DashboardViewDef[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "monthly-plan", label: "Monthly plan", icon: CalendarRange },
  { id: "profile", label: "Profile", icon: UserRound },
  { id: "password", label: "Password", icon: KeyRound },
  { id: "bookings", label: "My bookings", icon: ClipboardList },
  { id: "reviews", label: "My reviews", icon: MessageSquare },
];

export const LEAD_GUIDE_DASHBOARD_VIEWS: DashboardViewDef[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "monthly-plan", label: "Monthly plan", icon: CalendarRange },
  { id: "profile", label: "Profile", icon: UserRound },
  { id: "password", label: "Password", icon: KeyRound },
  { id: "create-tour", label: "Create tour", icon: PlusCircle },
  { id: "update-tour", label: "Update tour", icon: Pencil },
  { id: "create-booking", label: "Manual booking", icon: TicketPlus },
  { id: "bookings", label: "All bookings", icon: Users },
  { id: "tours", label: "Tour catalog", icon: Map },
];

export const ADMIN_DASHBOARD_VIEWS: DashboardViewDef[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "directory", label: "Team directory", icon: Crown },
  ...LEAD_GUIDE_DASHBOARD_VIEWS.filter((v) => v.id !== "overview"),
];

export function dashboardViewsForPath(pathname: string): DashboardViewDef[] | null {
  if (pathname.startsWith("/dashboard/user")) return USER_DASHBOARD_VIEWS;
  if (pathname.startsWith("/dashboard/guide")) return GUIDE_DASHBOARD_VIEWS;
  if (pathname.startsWith("/dashboard/lead-guide")) return LEAD_GUIDE_DASHBOARD_VIEWS;
  if (pathname.startsWith("/dashboard/admin")) return ADMIN_DASHBOARD_VIEWS;
  return null;
}

export function viewLabel(views: DashboardViewDef[] | null, viewId: string): string {
  return views?.find((v) => v.id === viewId)?.label ?? "Dashboard";
}

export function buildDashboardHref(
  pathname: string,
  view: string,
  extra?: { tour?: string },
) {
  const params = new URLSearchParams();
  params.set("view", view);
  if (extra?.tour) params.set("tour", extra.tour);
  const q = params.toString();
  return q ? `${pathname}?${q}` : pathname;
}
