import { z } from "zod";

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid id");

export const manualBookingSchema = z.object({
  tour: objectId,
  user: objectId,
  price: z.coerce.number().positive(),
  paid: z.boolean(),
});

export type ManualBookingInput = z.infer<typeof manualBookingSchema>;
