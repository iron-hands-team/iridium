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
