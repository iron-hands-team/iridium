import * as z from "zod";

export const loginSchema = z.object({
  username: z.string().trim().min(1, "Please enter a valid username"),
  password: z
    .string()
    .trim()
    .min(8, "Password has to be at least 8 characters long"),
});

export type LoginType = z.infer<typeof loginSchema>;
