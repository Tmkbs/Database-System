export interface Student {
  id: string;
  fullName: string;
  email: string;
  enrollmentDate: string;
}

export interface Course {
  id: string;
  courseName: string;
  credits: number;
  department: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  grade: string; // e.g., 'A', 'B', 'Pending'
  semester: string;
}

// Helper type for joining tables in the UI
export interface EnrichedEnrollment extends Enrollment {
  studentName: string;
  courseName: string;
}