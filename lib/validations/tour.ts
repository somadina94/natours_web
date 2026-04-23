import { z } from "zod";

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid id");

function splitLines(s: string | undefined): string[] {
  if (!s?.trim()) return [];
  return s
    .split(/[\n,]+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export const createTourFormSchema = z
  .object({
    name: z.string().trim().min(10).max(40),
    duration: z.coerce.number().positive(),
    maxGroupSize: z.coerce.number().int().min(1).max(200),
    difficulty: z.enum(["easy", "medium", "difficult"]),
    price: z.coerce.number().positive(),
    priceDiscount: z.coerce.number().optional(),
    summary: z.string().trim().min(10),
    description: z.string().trim().optional(),
    imageCover: z.string().optional(),
    startDatesText: z.string().optional(),
  })
  .refine(
    (d) =>
      d.priceDiscount == null ||
      Number.isNaN(d.priceDiscount) ||
      d.priceDiscount < d.price,
    { message: "Discount must be less than price", path: ["priceDiscount"] },
  );

export type CreateTourFormInput = z.infer<typeof createTourFormSchema>;

/** JSON create body (no multipart files). Gallery URLs are passed separately when not using files. */
export function createTourPayload(values: CreateTourFormInput, galleryUrls: string[] = []) {
  const startParts = splitLines(values.startDatesText);
  const startDates = startParts
    .map((p) => new Date(p))
    .filter((d) => !Number.isNaN(d.getTime()));

  const ic = values.imageCover?.trim() ?? "";

  return {
    name: values.name,
    duration: values.duration,
    maxGroupSize: values.maxGroupSize,
    difficulty: values.difficulty,
    price: values.price,
    ...(values.priceDiscount != null &&
    !Number.isNaN(values.priceDiscount) &&
    values.priceDiscount > 0
      ? { priceDiscount: values.priceDiscount }
      : {}),
    summary: values.summary,
    ...(values.description ? { description: values.description } : {}),
    ...(ic ? { imageCover: ic } : {}),
    ...(galleryUrls.length ? { images: galleryUrls } : {}),
    ...(startDates.length ? { startDates } : {}),
  };
}

export const patchTourFormSchema = z
  .object({
    tourId: objectId,
    name: z.string().optional(),
    duration: z.coerce.number().positive().optional(),
    maxGroupSize: z.coerce.number().int().min(1).max(200).optional(),
    difficulty: z.enum(["easy", "medium", "difficult"]).optional(),
    price: z.coerce.number().positive().optional(),
    priceDiscount: z.coerce.number().optional(),
    summary: z.string().optional(),
    description: z.string().optional(),
    imageCover: z.string().optional(),
    imagesText: z.string().optional(),
    startDatesText: z.string().optional(),
  })
  .refine(
    (d) =>
      d.priceDiscount == null ||
      Number.isNaN(d.priceDiscount) ||
      !d.price ||
      d.priceDiscount < d.price,
    { message: "Discount must be less than price", path: ["priceDiscount"] },
  )
  .superRefine((d, ctx) => {
    const n = d.name?.trim();
    if (n && (n.length < 10 || n.length > 40)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Name must be 10–40 characters",
        path: ["name"],
      });
    }
    const s = d.summary?.trim();
    if (s && s.length < 10) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Summary must be at least 10 characters",
        path: ["summary"],
      });
    }
  });

export type PatchTourFormInput = z.infer<typeof patchTourFormSchema>;

export function patchTourBody(values: PatchTourFormInput): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  const nt = values.name?.trim();
  if (nt) body.name = nt;
  if (values.duration != null && Number.isFinite(values.duration)) body.duration = values.duration;
  if (values.maxGroupSize != null && Number.isFinite(values.maxGroupSize)) {
    body.maxGroupSize = values.maxGroupSize;
  }
  if (values.difficulty) body.difficulty = values.difficulty;
  if (values.price != null && Number.isFinite(values.price)) body.price = values.price;
  if (values.priceDiscount != null && Number.isFinite(values.priceDiscount)) {
    body.priceDiscount = values.priceDiscount;
  }
  const st = values.summary?.trim();
  if (st) body.summary = st;
  if (values.description !== undefined) {
    body.description = values.description.trim();
  }
  const ic = values.imageCover?.trim();
  if (ic) body.imageCover = ic;
  const images = splitLines(values.imagesText);
  if (images.length) body.images = images;
  const startParts = splitLines(values.startDatesText);
  const startDates = startParts
    .map((p) => new Date(p))
    .filter((d) => !Number.isNaN(d.getTime()));
  if (startDates.length) body.startDates = startDates;
  return body;
}
