import type { UserResponse } from "./user";
import type { ClubResponse } from "./clubs";
import type { EventType } from "./event";
import type { PostType } from "@/lib/schemas";
import type { ClassSectionType } from "./class";

export interface SearchResponse {
  users: UserResponse[];
  clubs: ClubResponse[];
  events: EventType[];
  announcements: PostType[];
  classes: ClassSectionType[]; //@iamharry0121 ???
}

export interface TipType {
  icon: React.ReactNode;
  text: string;
}
