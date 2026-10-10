
import { apiFetch } from "@/services/api";

export type ExamType = "MIDTERM" | "FINAL";

export interface CreateExamData {
  title: string;
  type: ExamType;
  totalMarks: number;
  sectionId: number;
  examDate: string;
}

export async function createExam(
  data: CreateExamData,
  token: string
) {
  return apiFetch<{
    success: boolean;
    message: string;
    data: {
      id: number;
      title: string;
      type: ExamType;
      totalMarks: number;
      sectionId: number;
      examDate: string;
    };
  }>("/exams", {
    method: "POST",
    token,
    body: JSON.stringify(data),
  });
}
