export interface ScheduleItemType {
    id: number;
    period: number;
    course_name: string;
    room: string | null;
    start_time: string | null;
    end_time: string | null;
}