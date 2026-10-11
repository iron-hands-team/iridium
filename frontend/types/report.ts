import type {UserResponse, UserType} from "./user";

export interface ReportResponse {
    id: number;
    title: string;
    descripton: string;
    anonymous: boolean;
    type: string;
    role: string | null;
    reporter: UserResponse | null;
}

export interface ReportType {
    id: number;
    title: string;
    description: string;
    anonymous: boolean;
    type: string;
    role: string | null;
    reporter: UserType | null;
}