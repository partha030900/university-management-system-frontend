import { apiFetch } from "@/services/api";

export interface Course {
  id: number;
  code: string;
  title: string;
  description: string | null;
  credits: number;
  prerequisites: {
    id: number;
    code: string;
    title: string;
  }[];
}

interface CoursesResponse {
  success: boolean;
  message: string;
  data: Course[];
}

export const getAllCourses = async (): Promise<Course[]> => {
  const response = await apiFetch<CoursesResponse>("/courses");
  return response.data;
};