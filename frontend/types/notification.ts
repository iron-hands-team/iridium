export interface NotificationResponse {
    id: number;
    type: string;
    title: string;
    body: string | null;
    link: string | null;
    read: boolean;
    created_at: string;
}

export interface NotificationType {
    id: number;
    type: string;
    title: string;
    body: string | null;
    link: string | null;
    read: boolean;
    createdAt: string;
}
