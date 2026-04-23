import { buildMetadata } from "@/lib/metadata";
import { DashboardRoot } from "@/components/templates/dashboard-root";

export const metadata = buildMetadata({
  title: "Dashboard",
  description:
    "Role-based Natours workspaces for travelers, guides, lead guides, and administrators.",
  path: "/dashboard",
  noIndex: true,
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardRoot>{children}</DashboardRoot>;
}
