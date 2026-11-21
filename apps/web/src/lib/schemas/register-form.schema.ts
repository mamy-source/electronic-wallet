
import { z } from "zod";
import { registerSchema } from "@electronic-wallet/validation";

export const registerFormSchema = registerSchema.extend({
  acceptTerms: z.boolean().refine(
    (value) => value === true,
    {
      message: "You must accept the Terms of Service",
    }
  ),
});

export type RegisterFormInput = z.infer<
  typeof registerFormSchema
>;
