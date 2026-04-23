import { z } from "zod";

export const updateMeSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  email: z.string().trim().email("Enter a valid email"),
});

export type UpdateMeInput = z.infer<typeof updateMeSchema>;

export const updatePasswordSchema = z
  .object({
    passwordCurrent: z.string().min(1, "Current password is required"),
    password: z.string().min(8, "Use at least 8 characters"),
    passwordConfirm: z.string().min(8, "Confirm your new password"),
  })
  .refine((d) => d.password === d.passwordConfirm, {
    message: "Passwords do not match",
    path: ["passwordConfirm"],
  });

export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
