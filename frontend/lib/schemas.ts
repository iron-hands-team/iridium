import { roles } from "./constants";
import * as z from "zod";

export const loginSchema = z.object({
  username: z.string().trim().min(1, "Please enter a valid username"),
  password: z.union(
    [z.string().trim().min(8), z.string().trim().length(0)],
    "Password has to be either empty or at least 8 characters long",
  ),
});

export const postSchema = z.object({
  id: z.number().optional(),
  created_at: z.string().optional(),
  pinned: z.boolean(),
  archived: z.boolean().optional(),
  title: z.string().trim().min(1, "Please enter a title"),
  content: z.string().trim().min(1, "Please enter valid content"),
  role: z.enum(["all", ...roles], "Please select a valid role to post to"),
  likes: z.array(z.string()).optional(),
});

export const newUserSchema = z.object({
  firstName: z.string().trim().min(1, "Please enter a first name"),
  lastName: z.string().trim().min(1, "Please enter a last name"),
  middleName: z.string().optional().nullable(),
  username: z.string().trim().min(1, "Please enter a username"),
  password: z.union(
    [z.string().trim().min(8), z.string().trim().length(0)],
    "Password has to be either empty or at least 8 characters long",
  ),
  role: z.enum(roles, "Please assign a valid role"),
  title: z.string().trim().min(1, "Please enter a title"),
});

export const newClubSchema = z.object({
  name: z.string().trim().min(1, "Please enter a name"),
  description: z.string().optional(),
  sponsorId: z.number().optional(),
  categories: z
    .array(z.string().trim())
    .min(1, "Please assign at least one category"),
});

export const newEventSchema = z.object({
  id: z.number().optional(),
  title: z.string().trim().min(1, "Please enter a title"),
  description: z.string().optional(),
  location: z.string().optional(),
  start_time: z.string().min(1, "Please choose a start time"),
  end_time: z.string().optional(),
});

export const newRulesSchema = z.array(
  z.object({
    id: z.number(),
    name: z.string().trim().min(1, "Please enter a rule name"),
    description: z.string().optional().nullable(),
  }),
);

export type LoginType = z.infer<typeof loginSchema>;
export type PostType = z.infer<typeof postSchema>;
export type NewUserType = z.infer<typeof newUserSchema>;
export type NewClubType = z.infer<typeof newClubSchema>;
export type NewEventType = z.infer<typeof newEventSchema>;
export type RuleType = z.infer<typeof newRulesSchema.element>;
