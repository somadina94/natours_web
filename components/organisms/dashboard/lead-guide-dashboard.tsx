"use client";

import { LeadGuideWorkspace } from "@/components/organisms/dashboard/lead-guide-workspace";
import { LEAD_GUIDE_VIEW_IDS } from "@/lib/dashboard-view-ids";
import { useDashboardView } from "@/hooks/use-dashboard-view";

export function LeadGuideDashboard({ embedded }: { embedded?: boolean }) {
  const { view, tourId } = useDashboardView(LEAD_GUIDE_VIEW_IDS);
  return <LeadGuideWorkspace embedded={embedded} view={view} tourId={tourId} />;
}
