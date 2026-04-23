import { mediaBaseUrl } from "@/lib/env";

/** Resolve tour / CDN paths for `<img>` or `next/image` when the API returns relative keys. */
export function tourImageSrc(path: string | undefined | null): string {
  if (path == null || path === "") return "";
  const s = String(path).trim();
  if (/^https?:\/\//i.test(s)) return s;
  const base = mediaBaseUrl;
  if (!base) return s;
  return `${base.replace(/\/$/, "")}/${s.replace(/^\//, "")}`;
}
