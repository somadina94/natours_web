import type { AuthRole } from "@/types/auth";

export interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  photo?: string;
  role: AuthRole | string;
}
