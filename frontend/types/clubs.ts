import type { UserType } from "./user";

export interface ClubType {
  id: number;
  name: string;
  description?: string;
  sponsor?: UserType;
  categories: ClubCategory[];
}

export type ClubCategory =
  | "science"
  | "math"
  | "engineering"
  | "technology"
  | "sports"
  | "academic"
  | "competitive"
  | "art"
  | "volunteering"
  | "business"
  | "other";
