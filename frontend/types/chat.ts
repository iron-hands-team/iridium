import type { UserType } from "@/types/user";

export interface MessageType {
  id: number;
  text: string;
  createdAt: Date;
  replyingTo?: number;
  edited: boolean;
  userId: number;
  user: UserType;
  channelId: number;
}
