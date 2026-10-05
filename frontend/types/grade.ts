import type { UserResponse } from "./user";

export interface GradeType {
  id: number;
  student: UserResponse;
  score: number | null;
}

export interface AssignmentType {
  id: number;
  name: string;
  max_score: number;
  class_id: number;
  grades: GradeType[];
}

export interface StudentAssignmentGradeType {
  id: number;
  name: string;
  max_score: number;
  score: number | null;
}

export interface StudentClassGradesType {
  class_id: number;
  class_name: string;
  assignments: StudentAssignmentGradeType[];
}