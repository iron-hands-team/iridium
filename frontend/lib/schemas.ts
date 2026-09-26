import { roles } from "./constants";
import * as z from "zod";

export const loginSchema = z.object({
  username: z.string().trim().min(1, "Please enter a valid username"),
  password: z
    .string()
    .trim()
    .min(8, "Password has to be at least 8 characters long"),
});

export const postSchema = z.object({
  id: z.number().optional(),
  created_at: z.string().optional(),
  pinned: z.boolean(),
  archived: z.boolean().optional(),
  title: z.string().trim().min(1, "Please enter a title"),
  content: z.string().trim().min(1, "Please enter valid content"),
  role: z.enum(["all", ...roles], "Please select a valid role to post to"),
});

export const newUserSchema = z.object({
  firstName: z.string().trim().min(1, "Please enter a first name"),
  lastName: z.string().trim().min(1, "Please enter a last name"),
  middleName: z.string().optional().nullable(),
  username: z.string().trim().min(1, "Please enter a username"),
  password: z.string().optional(),
  role: z.enum(roles, "Please assign a valid role"),
});

export type LoginType = z.infer<typeof loginSchema>;
export type PostType = z.infer<typeof postSchema>;
export type NewUserType = z.infer<typeof newUserSchema>;
