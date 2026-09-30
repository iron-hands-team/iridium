import type { UserResponse } from "@/types/user";

export function parseUser(user: UserResponse) {
  return {
    username: user.username,
    lastName: user.last_name,
    firstName: user.first_name,
    middleName: user.middle_name,
    role: user.role,
  };
}
