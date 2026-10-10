import { apiFetch } from "@/services/api";

interface InstructorCountResponse {
  success: boolean;
  message: string;
  data: number;
}

export async function getInstructorCount(
  token: string
): Promise<number> {
  const response = await apiFetch<InstructorCountResponse>(
    "/instructors/count",
    {
      method: "GET",
      token,
    }
  );

  return response.data;
}

export interface InstructorSection {
  id: number;
  name: string;
  capacity: number;
  course: {
    id: number;
    code: string;
    title: string;
    credits: number;
  };
  semester: {
    id: number;
    [key: string]: unknown;
  };
  _count: {
    registrations: number;
    exams: number;
  };
}

interface InstructorSectionsResponse {
  success: boolean;
  message: string;
  data: InstructorSection[];
}

export async function getMySections(
  token: string
): Promise<InstructorSection[]> {
  const response = await apiFetch<InstructorSectionsResponse>(
    "/instructors/my-sections",
    {
      method: "GET",
      token,
    }
  );

  return response.data;
}