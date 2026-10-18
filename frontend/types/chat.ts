import type { UserType } from "@/types/user";

export interface MessageType {
  id: number;
  text: string;
  createdAt: Date;
  replyingTo?: ReplyType;
  edited: boolean;
  userId: number;
  user: UserType;
  channelId: number;
}

export interface ReplyType {
  id: number;
  text: string;
  deleted?: boolean;
}
