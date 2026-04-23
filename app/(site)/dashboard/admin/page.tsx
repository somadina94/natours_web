import { RoleGate } from "@/components/gates/role-gate";
import { AdminDashboard } from "@/components/organisms/dashboard/admin-dashboard";

export default function AdminDashboardPage() {
  return (
    <RoleGate allow={["admin"]}>
      <AdminDashboard />
    </RoleGate>
  );
}
