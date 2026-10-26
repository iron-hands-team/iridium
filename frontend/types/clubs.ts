import type { UserResponse, UserType } from "./user";

export interface ClubType {
  id: number;
  name: string;
  description?: string;
  sponsor?: UserType;
  sponsorId?: number;
  categories: string[];
  favorites: string[];
}

export type ClubResponse = ClubType & {
  sponsor?: UserResponse;
  sponsor_id: number;
};

export interface ClubMemberType {
  id: number;
  user: UserType;
}

export interface ClubMemberResponse {
  id: number;
  user: UserResponse;
}
