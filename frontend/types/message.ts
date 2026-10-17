import type { UserResponse, UserType } from "./user";

export interface MessageResponse {
    id: number;
    subject: string;
    body: string;
    created_at: string;
    read: boolean;
    sender: UserResponse;
    recipient: UserResponse;
}

export interface MessageType {
    id: number;
    subject: string;
    body: string;
    createdAt: string;
    read: boolean;
    sender: UserType;
    recipient: UserType;
}