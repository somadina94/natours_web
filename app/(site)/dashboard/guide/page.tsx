import { RoleGate } from "@/components/gates/role-gate";
import { GuideDashboard } from "@/components/organisms/dashboard/guide-dashboard";

export default function GuideDashboardPage() {
  return (
    <RoleGate allow={["guide"]}>
      <GuideDashboard />
    </RoleGate>
  );
}
