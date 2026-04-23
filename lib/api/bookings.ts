import { api } from "@/lib/api/client";
import type { Booking } from "@/types/booking";
import type { ApiListPayload } from "@/types/api-list";

export async function getMyBookings() {
  const { data } = await api.get<ApiListPayload<Booking>>("/bookings/my-bookings");
  return data.data.data;
}

export async function getAllBookings(params?: Record<string, string | number>) {
  const { data } = await api.get<ApiListPayload<Booking>>("/bookings", {
    params,
  });
  return data.data.data;
}

export async function deleteBooking(id: string) {
  await api.delete(`/bookings/${id}`);
}

export async function createBooking(body: {
  tour: string;
  user: string;
  price: number;
  paid?: boolean;
}) {
  const { data } = await api.post<{ status: string; data: { data: Booking } }>(
    "/bookings",
    body,
  );
  return data.data.data;
}
