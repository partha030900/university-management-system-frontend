import { apiFetch } from "@/services/api";

export interface Program {
  id: number;
  name: string;
  code: string;
  duration: number;
  departmentId: number;
  createdAt: string;
  updatedAt: string;
}

export interface StudentProfile {
  id: number;
  userId: number;
  studentId: string;
  name: string;
  programId: number;
  dateOfBirth: string | null;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
  program: Program;
}

export interface StudentProfileResponse {
  success: boolean;
  message: string;
  data: StudentProfile;
}

export async function getStudentById(
  id: number,
  token: string
): Promise<StudentProfileResponse> {
  return apiFetch<StudentProfileResponse>(`/students/${id}`, {
    method: "GET",
    token,
  });
}

export interface CreateStudentProfileInput {
  studentId: string;
  name: string;
  programId: number;
  dateOfBirth?: string;
  phone?: string;
}

export interface AdminCreateStudentInput {
  email: string;
  password: string;
  studentId: string;
  name: string;
  programId: number;
  dateOfBirth?: string;
  phone?: string;
}

export interface AdminCreateStudentResponse {
  success: boolean;
  message: string;
  data: StudentProfile & {
    user: {
      id: number;
      email: string;
      role: "STUDENT";
    };
  };
}

export interface CreateStudentProfileResponse {
  success: boolean;
  message: string;
  data: Omit<StudentProfile, "program">;
}

interface StudentsResponse {
  success: boolean;
  message: string;
  data: StudentProfile[];
}

export async function getAllStudentsCount(
  token: string
): Promise<number> {
  const response = await apiFetch<StudentsResponse>("/students/", {
    method: "GET",
    token,
  });

  return response.data.length;
}

export async function getAllStudents(
  token: string
): Promise<StudentProfile[]> {
  const response = await apiFetch<StudentsResponse>("/students/", {
    method: "GET",
    token,
  });

  return response.data;
}

export async function createMyStudentProfile(
  data: CreateStudentProfileInput,
  token: string
): Promise<CreateStudentProfileResponse> {
  return apiFetch<CreateStudentProfileResponse>(
    "/students/my-profile",
    {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }
  );
}

export async function getMyStudentProfile(
  token: string
): Promise<StudentProfileResponse> {
  return apiFetch<StudentProfileResponse>("/students/my-profile", {
    method: "GET",
    token,
  });
}

export async function getAllPrograms(
  token: string
): Promise<{ success: boolean; message: string; data: Program[] }> {
  return apiFetch("/students/programs", {
    method: "GET",
    token,
  });
}

export async function createStudent(
  data: AdminCreateStudentInput,
  token: string
): Promise<AdminCreateStudentResponse> {
  return apiFetch<AdminCreateStudentResponse>("/students/", {
    method: "POST",
    body: JSON.stringify(data),
    token,
  });
}
