export const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "";

/** Public bucket / CDN root (same idea as server `B2_PUBLIC_BASE_URL`) for relative image keys. */
export const mediaBaseUrl =
  process.env.NEXT_PUBLIC_MEDIA_BASE_URL?.replace(/\/$/, "") ?? "";

export const siteName = "Natours";
export const siteDescription =
  "Premium nature tours for adventurous people. Small groups, expert guides, unforgettable landscapes.";
