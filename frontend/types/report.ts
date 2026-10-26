import type {UserResponse, UserType} from "./user";

export interface ReportResponse {
    id: number;
    title: string;
    description: string;
    anonymous: boolean;
    type: string;
    role: string | null;
    user: UserResponse | null;
    resolved: boolean;
}

export interface ReportType {
    id: number;
    title: string;
    description: string;
    anonymous: boolean;
    type: string;
    role: string | null;
    user: UserType | null;
    resolved: boolean;
}