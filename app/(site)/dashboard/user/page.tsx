import { RoleGate } from "@/components/gates/role-gate";
import { UserDashboard } from "@/components/organisms/dashboard/user-dashboard";

export default function TravelerDashboardPage() {
  return (
    <RoleGate allow={["user"]}>
      <UserDashboard />
    </RoleGate>
  );
}
