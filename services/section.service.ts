import { apiFetch } from "./api";

export interface Section {
  id: number;
  name: string;
  capacity: number;
  courseId: number;
  semesterId: number;
  instructorId: number;
  course: {
    id: number;
    code: string;
    title: string;
    credits: number;
  };
  semester: {
    id: number;
    name: string;
    year: number;
  };
  instructor: {
    id: number;
  };
}

interface SectionsResponse {
  success: boolean;
  message: string;
  data: Section[];
}

export const getAllSections = (accessToken: string) => {
  return apiFetch<SectionsResponse>("/sections", {
    method: "GET",
    token: accessToken,
  });
};