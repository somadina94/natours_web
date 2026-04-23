"use client";

import { TravelerWorkspace } from "@/components/organisms/dashboard/traveler-workspace";

export function UserDashboard({ showTitle = true }: { showTitle?: boolean }) {
  return <TravelerWorkspace mode="user" showTitle={showTitle} />;
}
