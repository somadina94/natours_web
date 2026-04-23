import { api } from "@/lib/api/client";
import type { Review } from "@/types/review";
import type { ApiListPayload } from "@/types/api-list";

export async function getMyReviews() {
  const { data } = await api.get<ApiListPayload<Review>>("/reviews/my-reviews");
  return data.data.data;
}

export async function deleteReview(reviewId: string) {
  await api.delete(`/reviews/${reviewId}`);
}

export async function createReviewOnTour(
  tourId: string,
  body: { review: string; rating: number },
) {
  const { data } = await api.post<{ status: string; data: { data: Review } }>(
    `/tours/${tourId}/reviews`,
    body,
  );
  return data.data.data;
}
