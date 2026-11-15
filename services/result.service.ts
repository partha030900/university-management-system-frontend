import { apiFetch } from "@/services/api";

export interface ExamStudent {
  registrationId: number;
  studentId: string;
  name: string;
  email: string;
  result: {
    id: number;
    registrationId: number;
    examId: number;
    marks: number;
    grade: string;
  } | null;
}

export interface ExamStudentsResponse {
  success: boolean;
  message: string;
  data: {
    exam: {
      id: number;
      title: string;
      type: "MIDTERM" | "FINAL";
      totalMarks: number;
      examDate: string;
    };
    students: ExamStudent[];
  };
}

export async function getExamStudents(
  examId: number,
  token: string
): Promise<ExamStudentsResponse> {
  return apiFetch<ExamStudentsResponse>(
    `/results/exam/${examId}/students`,
    {
      method: "GET",
      token,
    }
  );
}



export interface CreateResultData {
  registrationId: number;
  examId: number;
  marks: number;
}

export async function createResult(
  data: CreateResultData,
  token: string
) {
  return apiFetch("/results", {
    method: "POST",
    token,
    body: JSON.stringify(data),
  });
}


export interface ExamPerformanceResponse {
  success: boolean;
  message: string;
  data: {
    exam: {
      id: number;
      title: string;
      type: "MIDTERM" | "FINAL";
      totalMarks: number;
      examDate: string;
    };
    totalStudents: number;
    studentsGraded: number;
    studentsNotGraded: number;
    averageMarks: number;
    passedStudents: number;
    failedStudents: number;
    highestMarks: number | null;
    lowestMarks: number | null;
  };
}

export async function getExamPerformance(
  examId: number,
  token: string
): Promise<ExamPerformanceResponse> {
  return apiFetch<ExamPerformanceResponse>(
    `/results/exam/${examId}/performance`,
    {
      method: "GET",
      token,
    }
  );
}
