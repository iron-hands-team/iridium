export interface UserType {
  username: string;
  lastName: string;
  firstName: string;
  middleName?: string;
  role: RoleType;
}

export interface UserResponse {
  username: string;
  last_name: string;
  first_name: string;
  middle_name: string;
  role: RoleType;
}

export type RoleType = "student" | "teacher" | "admin";
