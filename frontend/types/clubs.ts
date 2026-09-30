import type { UserResponse, UserType } from "./user";

export interface ClubType {
  id: number;
  name: string;
  description?: string;
  sponsor?: UserType;
  categories: string[];
}

export type ClubResponse = ClubType & { sponsor?: UserResponse };
