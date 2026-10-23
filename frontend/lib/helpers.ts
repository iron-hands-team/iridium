import type { UserResponse, UserType } from "@/types/user";
import type {
  NotificationResponse,
  NotificationType,
} from "@/types/notification";

export function parseNotification(n: NotificationResponse): NotificationType {
  return {
    id: n.id,
    type: n.type,
    title: n.title,
    body: n.body,
    link: n.link,
    read: n.read,
    createdAt: n.created_at,
  };
}

export function parseUser(user: UserResponse): UserType {
  return {
    id: user.id,
    username: user.username,
    lastName: user.last_name,
    firstName: user.first_name,
    middleName: user.middle_name,
    role: user.role,
    image: user.image,
    requesting: user.requesting,
    requestingDelete: user.requesting_delete,
    title: user.title,
  };
}

export function profileUrl(username: string) {
  return `/s3/files/avatars/${username}/avatar?t=${new Date().getTime()}`;
}

export function mapUrl(index: number) {
  return `/s3/files/map/${index}?t=${new Date().getTime()}`;
}

export function fileUrl(index: number, refresh: boolean = true) {
  return `/s3/files/files/${index}?t=${refresh ? new Date().getTime() : ""}`;
}

export function getTime(time: Date) {
  const now = new Date();
  return time.getTime() > new Date(now.toLocaleDateString()).getTime()
    ? time.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    : time.toLocaleDateString();
}
