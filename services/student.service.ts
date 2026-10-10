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
