import type { UserResponse } from "./user";
import type { ClubResponse } from "./clubs";
import type { EventType } from "./event";
import type { PostType } from "@/lib/schemas";

export interface SearchResponse {
  users: UserResponse[];
  clubs: ClubResponse[];
  events: EventType[];
  announcements: PostType[];
}
