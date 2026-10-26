import type { UserResponse } from "./user";

export interface ClassSectionType {
    id: number;
    name: string;
    teacher: UserResponse;
}