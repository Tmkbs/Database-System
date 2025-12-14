import { Student, Course, Enrollment } from '../types';

// Initial Seed Data
const INITIAL_STUDENTS: Student[] = [
  { id: '1', fullName: 'Alice Johnson', email: 'alice@example.com', enrollmentDate: '2023-09-01' },
  { id: '2', fullName: 'Bob Smith', email: 'bob@example.com', enrollmentDate: '2023-09-02' },
  { id: '3', fullName: 'Charlie Brown', email: 'charlie@example.com', enrollmentDate: '2024-01-15' },
];

const INITIAL_COURSES: Course[] = [
  { id: '101', courseName: 'Intro to Python', credits: 3, department: 'CS' },
  { id: '102', courseName: 'Database Design', credits: 4, department: 'CS' },
  { id: '103', courseName: 'Calculus I', credits: 4, department: 'Math' },
];

const INITIAL_ENROLLMENTS: Enrollment[] = [
  { id: 'e1', studentId: '1', courseId: '101', grade: 'A', semester: 'Fall 2023' },
  { id: 'e2', studentId: '1', courseId: '102', grade: 'B+', semester: 'Spring 2024' },
  { id: 'e3', studentId: '2', courseId: '103', grade: 'Pending', semester: 'Spring 2024' },
];

// LocalStorage Keys
const KEYS = {
  STUDENTS: 'app_students',
  COURSES: 'app_courses',
  ENROLLMENTS: 'app_enrollments',
};

class MockDatabase {
  constructor() {
    this.init();
  }

  private init() {
    if (!localStorage.getItem(KEYS.STUDENTS)) {
      localStorage.setItem(KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
    }
    if (!localStorage.getItem(KEYS.COURSES)) {
      localStorage.setItem(KEYS.COURSES, JSON.stringify(INITIAL_COURSES));
    }
    if (!localStorage.getItem(KEYS.ENROLLMENTS)) {
      localStorage.setItem(KEYS.ENROLLMENTS, JSON.stringify(INITIAL_ENROLLMENTS));
    }
  }

  // --- Students CRUD ---
  getStudents(): Student[] {
    return JSON.parse(localStorage.getItem(KEYS.STUDENTS) || '[]');
  }
  
  saveStudent(student: Student) {
    const list = this.getStudents();
    const index = list.findIndex(s => s.id === student.id);
    if (index >= 0) {
      list[index] = student;
    } else {
      list.push(student);
    }
    localStorage.setItem(KEYS.STUDENTS, JSON.stringify(list));
  }

  deleteStudent(id: string) {
    const list = this.getStudents().filter(s => s.id !== id);
    localStorage.setItem(KEYS.STUDENTS, JSON.stringify(list));
    // Cascade delete enrollments
    const enrollments = this.getEnrollments().filter(e => e.studentId !== id);
    localStorage.setItem(KEYS.ENROLLMENTS, JSON.stringify(enrollments));
  }

  // --- Courses CRUD ---
  getCourses(): Course[] {
    return JSON.parse(localStorage.getItem(KEYS.COURSES) || '[]');
  }

  saveCourse(course: Course) {
    const list = this.getCourses();
    const index = list.findIndex(c => c.id === course.id);
    if (index >= 0) {
      list[index] = course;
    } else {
      list.push(course);
    }
    localStorage.setItem(KEYS.COURSES, JSON.stringify(list));
  }

  deleteCourse(id: string) {
    const list = this.getCourses().filter(c => c.id !== id);
    localStorage.setItem(KEYS.COURSES, JSON.stringify(list));
    // Cascade delete enrollments
    const enrollments = this.getEnrollments().filter(e => e.courseId !== id);
    localStorage.setItem(KEYS.ENROLLMENTS, JSON.stringify(enrollments));
  }

  // --- Enrollments CRUD ---
  getEnrollments(): Enrollment[] {
    return JSON.parse(localStorage.getItem(KEYS.ENROLLMENTS) || '[]');
  }

  saveEnrollment(enrollment: Enrollment) {
    const list = this.getEnrollments();
    const index = list.findIndex(e => e.id === enrollment.id);
    if (index >= 0) {
      list[index] = enrollment;
    } else {
      list.push(enrollment);
    }
    localStorage.setItem(KEYS.ENROLLMENTS, JSON.stringify(list));
  }

  deleteEnrollment(id: string) {
    const list = this.getEnrollments().filter(e => e.id !== id);
    localStorage.setItem(KEYS.ENROLLMENTS, JSON.stringify(list));
  }
}

export const db = new MockDatabase();