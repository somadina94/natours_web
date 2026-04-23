import { api } from "@/lib/api/client";
import type { User } from "@/types/user";
import type { ApiListPayload } from "@/types/api-list";
import type { ApiItemResponse } from "@/types/tour";
import type { AxiosRequestConfig } from "axios";

const multipartFormConfig: AxiosRequestConfig = {
  transformRequest: [
    (body, headers) => {
      if (body instanceof FormData) {
        const h = headers as Record<string, string | undefined>;
        delete h["Content-Type"];
      }
      return body;
    },
  ],
};

export async function getUsers() {
  const { data } = await api.get<ApiListPayload<User>>("/users");
  return data.data.data;
}

export async function deleteUser(id: string) {
  await api.delete(`/users/${id}`);
}

export async function updateUser(
  id: string,
  body: Partial<{ name: string; email: string; role: string }>,
) {
  const { data } = await api.patch<ApiItemResponse<User>>(`/users/${id}`, body);
  return data.data.data;
}

export async function patchUpdateMe(body: { name: string; email: string }) {
  const { data } = await api.patch<{ status: string; data: { user: User } }>(
    "/users/updateMe",
    body,
  );
  return data.data.user;
}

export async function patchUpdateMyPhoto(file: File) {
  const body = new FormData();
  body.append("photo", file);
  const { data } = await api.patch<{ status: string; data: { user: User } }>(
    "/users/updateMyPhoto",
    body,
    multipartFormConfig,
  );
  return data.data.user;
}

export async function patchUpdatePassword(body: {
  passwordCurrent: string;
  password: string;
  passwordConfirm: string;
}) {
  const { data } = await api.patch<{
    status: string;
    token: string;
    data: { user: User };
  }>("/users/updateMyPassword", body);
  return { token: data.token, user: data.data.user };
}
