import type { UserResponse } from "./user";

export interface EventType {
  id: number;
  title: string;
  description?: string;
  location?: string;
  start_time: string;
  end_time?: string;
  created_by: UserResponse;
  attendees: string[];
}