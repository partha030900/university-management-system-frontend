import { apiFetch } from "@/services/api";

export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE";

export interface SectionStudent {
  id: number;
  sectionId: number;
  student: {
  id: number;
  name: string;
  studentId: string;
  program: {
    name: string;
  };
};
}

export interface SectionStudentsResponse {
  section: {
    id: number;
    course: {
      id: number;
      code: string;
      title: string;
    };
  };
  students: SectionStudent[];
}

export async function getSectionStudents(
  sectionId: number,
  token: string
): Promise<SectionStudentsResponse> {
  const response = await apiFetch<{
    success: boolean;
    message: string;
    data: SectionStudentsResponse;
  }>(`/attendance/section/${sectionId}/students`, {
    method: "GET",
    token,
  });

  return response.data;
}

export async function createAttendance(
  data: {
    registrationId: number;
    date: string;
    status: AttendanceStatus;
  },
  token: string
) {
  return apiFetch<{
    success: boolean;
    message: string;
    data: unknown;
  }>("/attendance", {
    method: "POST",
    token,
    body: JSON.stringify(data),
  });
}