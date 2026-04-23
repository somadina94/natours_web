import {
  ADMIN_DASHBOARD_VIEWS,
  GUIDE_DASHBOARD_VIEWS,
  LEAD_GUIDE_DASHBOARD_VIEWS,
  USER_DASHBOARD_VIEWS,
} from "@/lib/dashboard-views";

export const USER_VIEW_IDS = USER_DASHBOARD_VIEWS.map((v) => v.id);
export const GUIDE_VIEW_IDS = GUIDE_DASHBOARD_VIEWS.map((v) => v.id);
export const LEAD_GUIDE_VIEW_IDS = LEAD_GUIDE_DASHBOARD_VIEWS.map((v) => v.id);
export const ADMIN_VIEW_IDS = ADMIN_DASHBOARD_VIEWS.map((v) => v.id);
