import z from "zod";

export const updateUserSchema = z.object({
    email: z
      .email()
      .transform((email) => email.toLowerCase().trim())
      .optional(),
  
    profile: z
      .object({
        firstName: z.string().min(1).max(100).optional(),
        lastName: z.string().min(1).max(100).optional(),
        bio: z.string().max(500).nullable().optional(),
      })
      .optional(),
  });

export type UpdateUserInput = z.infer<typeof updateUserSchema>;