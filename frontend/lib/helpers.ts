import type { UserResponse, UserType } from "@/types/user";

export function parseUser(user: UserResponse): UserType {
  return {
    id: user.id,
    username: user.username,
    lastName: user.last_name,
    firstName: user.first_name,
    middleName: user.middle_name,
    role: user.role,
    image: user.image,
  };
}

export function profileUrl(username: string) {
  return `/s3/files/avatars/${username}/avatar?t=${new Date().getTime()}`;
}

export function mapUrl(index: number) {
  return `/s3/files/map/${index}?t=${new Date().getTime()}`;
}
