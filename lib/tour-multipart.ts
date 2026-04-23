/** Append tour scalar / JSON fields for multipart requests (not file parts). */
export function appendTourJsonToFormData(fd: FormData, obj: Record<string, unknown>) {
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    if (k === "images") continue;
    if (
      Array.isArray(v) ||
      (typeof v === "object" && v !== null && !(v instanceof Date))
    ) {
      fd.append(k, JSON.stringify(v));
    } else if (v instanceof Date) {
      fd.append(k, v.toISOString());
    } else {
      fd.append(k, String(v));
    }
  }
}
