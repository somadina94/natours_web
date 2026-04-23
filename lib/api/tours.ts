import type { AxiosRequestConfig } from "axios";
import { api } from "@/lib/api/client";
import type { ApiItemResponse, ApiListResponse, Tour } from "@/types/tour";

export async function getTours(params?: Record<string, string | number>) {
  const { data } = await api.get<ApiListResponse<Tour>>("/tours", { params });
  return data;
}

export async function getTourBySlug(slug: string) {
  const { data } = await api.get<ApiListResponse<Tour>>("/tours", {
    params: { slug, limit: 1 },
  });
  const tour = data.data.data[0];
  if (!tour) return null;
  return tour;
}

export async function getTourById(id: string) {
  const { data } = await api.get<ApiItemResponse<Tour>>(`/tours/${id}`);
  return data.data.data;
}

export async function getCheckoutSession(tourId: string) {
  const { data } = await api.get<{
    status: string;
    session: { url?: string | null };
  }>(`/bookings/checkout-session/${tourId}`);
  return data.session;
}

export type MonthlyPlanRow = {
  month: number;
  numTourStarts: number;
  tours: string[];
};

export async function getMonthlyPlan(year: number) {
  const { data } = await api.get<{
    status: string;
    data: { plan: MonthlyPlanRow[] };
  }>(`/tours/monthly-plan/${year}`);
  return data.data.plan;
}

export async function deleteTour(id: string) {
  await api.delete(`/tours/${id}`);
}

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

export async function createTour(body: FormData | Record<string, unknown>) {
  const { data } = await api.post<ApiItemResponse<Tour>>(
    "/tours",
    body,
    body instanceof FormData ? multipartFormConfig : undefined,
  );
  return data.data.data;
}

export async function updateTour(id: string, body: FormData | Record<string, unknown>) {
  const { data } = await api.patch<ApiItemResponse<Tour>>(
    `/tours/${id}`,
    body,
    body instanceof FormData ? multipartFormConfig : undefined,
  );
  return data.data.data;
}
