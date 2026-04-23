import { z } from "zod";

export const createReviewFormSchema = z.object({
  tourId: z.string().regex(/^[a-f\d]{24}$/i, "Pick a tour"),
  review: z.string().trim().min(10, "Write at least a few words"),
  rating: z.coerce.number().int().min(1).max(5),
});

export type CreateReviewFormInput = z.infer<typeof createReviewFormSchema>;
