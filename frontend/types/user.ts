export interface UserType {
  id?: number;
  username: string;
  lastName: string;
  firstName: string;
  middleName?: string;
  role: RoleType;
  image?: boolean;
}

export interface UserResponse {
  id: number;
  username: string;
  last_name: string;
  first_name: string;
  middle_name: string;
  role: RoleType;
  image: boolean;
}

export type RoleType = "student" | "teacher" | "admin";
