
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

export interface CreateCourseInput {
  code: string;
  title: string;
  description?: string;
  credits: number;
  fee: number;
}

interface CoursesResponse {
  success: boolean;
  message: string;
  data: Course[];
}

interface CreateCourseResponse {
  success: boolean;
  message: string;
  data: Course;
}

export const getAllCourses = async (): Promise<Course[]> => {
  const response = await apiFetch<CoursesResponse>("/courses");
  return response.data;
};

export const createCourse = async (
  data: CreateCourseInput,
  token: string
): Promise<Course> => {
  const response = await apiFetch<CreateCourseResponse>("/courses", {
    method: "POST",
    token,
    body: JSON.stringify(data),
  });

  return response.data;
};
