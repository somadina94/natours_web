import { RoleGate } from "@/components/gates/role-gate";
import { LeadGuideDashboard } from "@/components/organisms/dashboard/lead-guide-dashboard";

export default function LeadGuideDashboardPage() {
  return (
    <RoleGate allow={["lead-guide"]}>
      <LeadGuideDashboard />
    </RoleGate>
  );
}
