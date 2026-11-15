
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


export interface InstructorExam {
  id: number;
  title: string;
  type: ExamType;
  totalMarks: number;
  sectionId: number;
  examDate: string;
  section: {
    id: number;
    name: string;
    course: {
      id: number;
      code: string;
      title: string;
    };
    semester: {
      id: number;
      name: string;
    };
  };
}

export async function getMyExams(token: string) {
  return apiFetch<{
    success: boolean;
    message: string;
    data: InstructorExam[];
  }>("/exams", {
    method: "GET",
    token,
  });
}

export async function updateExam(
  examId: number,
  data: {
    title?: string;
    type?: "MIDTERM" | "FINAL";
    totalMarks?: number;
    sectionId?: number;
    examDate?: string;
  },
  token: string
) {
  return apiFetch(`/exams/${examId}`, {
    method: "PUT",
    token,
    body: JSON.stringify(data),
  });
}

export async function deleteExam(
  examId: number,
  token: string
) {
  return apiFetch(`/exams/${examId}`, {
    method: "DELETE",
    token,
  });
}