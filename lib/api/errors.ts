import axios from "axios";

export function apiErrorMessage(e: unknown, fallback: string) {
  if (axios.isAxiosError(e)) {
    const msg = e.response?.data?.message;
    return typeof msg === "string" ? msg : fallback;
  }
  return fallback;
}
