import type { UserResponse } from "./user";

export interface AttendanceRecordType {
  id: number;
  student: UserResponse;
  date: string;
  status: string;
}

export interface StudentAttendanceDayType {
  date: string;
  status: string;
}

export interface StudentClassAttendanceType {
  class_id: number;
  class_name: string;
  records: StudentAttendanceDayType[];
}