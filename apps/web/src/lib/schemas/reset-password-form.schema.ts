
import { z } from "zod";
import { resetPasswordSchema } from "@electronic-wallet/validation";

export const resetPasswordFormSchema =
  resetPasswordSchema
    .omit({ token: true })
    .extend({
      confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine(
      (data) => data.newPassword === data.confirmPassword,
      {
        message: "Passwords do not match",
        path: ["confirmPassword"],
      },
    );

export type ResetPasswordFormInput = z.infer<
  typeof resetPasswordFormSchema
>;
